import { getToken } from "next-auth/jwt";

export default async function middleware(req: any) {
  const { pathname } = req.nextUrl;
  const isLoginPage = pathname.startsWith("/login");

  // Skip middleware for login page (already excluded in matcher, but extra safety)
  if (isLoginPage) {
    return;
  }

  try {
    if (!process.env.AUTH_SECRET) {
      throw new Error("AUTH_SECRET is not set");
    }

    const token = await getToken({ req, secret: process.env.AUTH_SECRET });

    // If no token, redirect to login
    if (!token) {
      const loginUrl = new URL("/login", req.nextUrl.origin);
      return Response.redirect(loginUrl);
    }

    // If token exists, allow the request to proceed
    return;
  } catch (error) {
    console.error("Authentication error:", error);
    const errorUrl = new URL("/error", req.nextUrl.origin);
    return Response.redirect(errorUrl);
  }
}

export const config = {
  matcher: ["/account((?!login|api|_next/static|_next/image|favicon.ico).*)"],
};

import NextAuth from "next-auth";
import Github from "next-auth/providers/github";
import Gooogle from "next-auth/providers/google";
export const { auth, handlers, signIn, signOut } = NextAuth({
  providers: [
    Github({
      clientId: process.env.GITHUB_CLIENTID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
    Gooogle({
      clientId: process.env.GOOGLE_AUTH_ID,
      clientSecret: process.env.GOOGLE_AUTH_SECRET,
    }),
  ],
  secret: process.env.AUTH_SECRET,
});

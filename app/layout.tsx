import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import Header from "@/app/components/header";
import { SessionProvider } from "next-auth/react";

const outfit = Outfit({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Todo app with Auth",
  description: "This todo app make with authjs for authentication",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SessionProvider>
      <html lang="en">
        <body className={`${outfit.variable}  antialiased`}>
          <Header />
          {children}
        </body>
      </html>
    </SessionProvider>
  );
}

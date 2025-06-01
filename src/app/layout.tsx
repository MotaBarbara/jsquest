import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "../components/Header/Header";
import { AuthProvider } from "@/src/contexts/AuthContext";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "JS Quest - Learn Javascript",
  description:
    "Level up your JavaScript skills through interactive challenges, structured progression, and monthly competitions - learning made fun, focused, and fiercely competitive.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/jsquest-favicon.jpg" />
      </head>
      <body className={`${inter.variable} antialiased`}>
        <AuthProvider>
          <Header />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}

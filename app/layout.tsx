import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import {
  ClerkProvider,
  RedirectToSignIn,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import { Toaster } from "@/components/ui/toaster";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "AngelShot",
  description: "Natural conversation, safer situation.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <SignedOut>
            <RedirectToSignIn />
          </SignedOut>
          <SignedIn>
            <div className="flex justify-between items-center px-4 md:px-32 h-24 mb-8">
              <h1 className="font-bold text-3xl">AngelShot</h1>
              <UserButton />
            </div>
          </SignedIn>
          {children}
          <Toaster />
        </body>
      </html>
    </ClerkProvider>
  );
}

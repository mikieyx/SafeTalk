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
import OngoingCalls from "@/components/OngoingCalls";
import { Suspense } from "react";

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
          className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gradient-to-r from-yellow-100 to-pink-200`}
        >
          <SignedOut>
            <RedirectToSignIn />
          </SignedOut>
          <SignedIn>
            <div className="flex justify-between items-center px-4 md:px-32 h-20 shadow-md">
              <h1 className="font-bold text-3xl">AngelShot</h1>
              <UserButton />
            </div>
            <div className="mb-8">
              <Suspense>
                <OngoingCalls />
              </Suspense>
            </div>
          </SignedIn>
          {children}
          <Toaster />
        </body>
      </html>
    </ClerkProvider>
  );
}

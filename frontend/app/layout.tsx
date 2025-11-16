/**
 * Root Layout (Global App Shell)
 *
 * Purpose:
 * This layout wraps all pages in the app and provides:
 * 1) Global font styles
 * 2) Sticky Header + Footer UI
 * 3) Providers (Theme, Session, Toast Notifications)
 * 4) Global metadata for SEO
 */

import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "./globals.css";

// Global UI Components
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
// import { Toaster } from "@/components/ui/toaster";
import { Providers } from "@/components/providers";

// Load Google Font
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

// SEO Metadata (Next.js App Router)
export const metadata: Metadata = {
  title: "CalmindAI Therapist",
  description: "Your personal AI therapy companion to help support mental well-being",
};

// Root Layout Component
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      {/* Body applies fonts + global utility classes */}
      <body className={`${inter.variable} font-sans antialiased`}>

        {/* Providers make global context available (theme, session, etc.) */}
        <Providers>
          {/* Global header navigation */}
          <Header />

          {/* Page content slot */}
          <main>{children}</main>

          {/* Global footer */}
          <Footer />

          {/* Toast / Notification System */}
          {/* <Toaster /> */}
        </Providers>
      </body>
    </html>
  );
}

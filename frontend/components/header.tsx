"use client";

/**
 * Header Component (Navigation Bar)
 *
 * Purpose:
 * - Displays app branding and navigation links
 * - Shows authenticated actions (Dashboard / Sign out)
 * - Shows Sign in button when not authenticated
 * - Includes Theme Toggle + Mobile Menu for responsiveness
 */

import { useState } from "react";
import Link from "next/link";
import {
  Menu,
  X,
  MessageCircle,
  AudioWaveform,
  LogOut,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { SignInButton } from "@/components/auth/sign-in-button";
import { useSession } from "@/lib/contexts/session-context";

// Navigation links displayed in Desktop & Mobile views
const NAV_ITEMS = [
  { href: "/features", label: "Features" },
  { href: "/about", label: "About Aura" },
];

export function Header() {
  const { isAuthenticated, logout, user } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMobileMenu = () => setIsMenuOpen((prev) => !prev);

  return (
    <div className="w-full fixed top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      {/* Subtle bottom border */}
      <div className="absolute inset-0 border-b border-primary/10" />

      <header className="relative max-w-6xl mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Brand / Logo */}
          <Link
            href="/"
            className="flex items-center space-x-2 transition-opacity hover:opacity-80"
          >
            <AudioWaveform className="h-7 w-7 text-primary animate-pulse-gentle" />

            <div className="flex flex-col leading-tight">
              <span className="font-semibold text-lg bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                Aura3.0
              </span>
              <span className="text-xs dark:text-muted-foreground">
                Your mental health companion
              </span>
            </div>
          </Link>

          {/* Desktop Navigation + Actions */}
          <div className="flex items-center gap-4">
            {/* Desktop Nav Links */}
            <nav className="hidden md:flex items-center space-x-1">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="relative px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors group"
                >
                  {item.label}
                  {/* Hover underline animation */}
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-left" />
                </Link>
              ))}
            </nav>

            {/* Right-side actions: Theme + Auth */}
            <div className="flex items-center gap-3">
              <ThemeToggle />

              {isAuthenticated ? (
                <>
                  {/* Start Chat / Dashboard */}
                  <Button asChild className="hidden md:flex gap-2 bg-primary/90 hover:bg-primary">
                    <Link href="/dashboard">
                      <MessageCircle className="w-4 h-4 mr-1" />
                      Start Chat
                    </Link>
                  </Button>

                  {/* Logout */}
                  <Button
                    variant="outline"
                    onClick={logout}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign out
                  </Button>
                </>
              ) : (
                <SignInButton />
              )}

              {/* Mobile Menu Toggle */}
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={toggleMobileMenu}
              >
                {isMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-primary/10">
            <nav className="flex flex-col space-y-1 py-4">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="px-4 py-3 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-primary/5 rounded-md transition-colors"
                >
                  {item.label}
                </Link>
              ))}

              {isAuthenticated && (
                <Button asChild className="mt-2 mx-4 gap-2 bg-primary/90 hover:bg-primary">
                  <Link href="/dashboard">
                    <MessageCircle className="w-4 h-4" />
                    <span>Start Chat</span>
                  </Link>
                </Button>
              )}
            </nav>
          </div>
        )}
      </header>
    </div>
  );
}

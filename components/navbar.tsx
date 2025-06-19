"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Scissors } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

export function Navbar() {
  const { isAuthenticated, tier, logout } = useAuth();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);

  const formattedTier =
    tier.charAt(0).toUpperCase() + tier.slice(1).toLowerCase();

  const handleLogout = () => {
    logout();
    setIsOpen(false); // close menu after logout
    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
    });
    setTimeout(() => window.location.reload(), 1000);
  };

  return (
    <nav className="px-5 fixed top-0 w-full z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <Scissors className="h-6 w-6 text-primary" />
          <span className="text-2xl font-bold">ViralCuts</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center space-x-6">
          <Link
            href="/pricing"
            className="text-sm font-medium hover:text-primary"
            onClick={() => setIsOpen(false)}
          >
            Pricing
          </Link>
          <Link
            href="/contact"
            className="text-sm font-medium hover:text-primary"
          >
            Contact Us
          </Link>

          {isAuthenticated ? (
            <>
              <span className="text-sm font-medium text-muted-foreground">
                Current plan: {formattedTier}
              </span>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link href="/login" onClick={() => setIsOpen(false)}>
                <Button variant="ghost" size="sm">
                  Login
                </Button>
              </Link>
              <Link href="/signup">
                <Button size="sm">Sign Up Free</Button>
              </Link>
            </>
          )}
        </div>

        {/* Hamburger Toggle (Mobile Only) */}
        <button
          className="md:hidden text-2xl"
          onClick={() => setIsOpen((prev) => !prev)}
        >
          ☰
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden px-5 pb-4 pt-2 space-y-4 bg-background border-t">
          <Link href="/pricing" onClick={() => setIsOpen(false)}>
            <Button variant="outline" className="w-full justify-center">
              Pricing
            </Button>
          </Link>
          <Link href="/contact" onClick={() => setIsOpen(false)}>
            <Button variant="outline" className="w-full justify-center">
              Contact Us
            </Button>
          </Link>

          {isAuthenticated ? (
            <>
              <span className="block text-sm text-center text-muted-foreground">
                Current plan: {formattedTier}
              </span>
              <Button
                variant="destructive"
                size="sm"
                className="w-full"
                onClick={handleLogout}
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link href="/login" onClick={() => setIsOpen(false)}>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-center"
                >
                  Login
                </Button>
              </Link>
              <Link href="/signup" onClick={() => setIsOpen(false)}>
                <Button size="sm" className="w-full justify-center">
                  Sign Up Free
                </Button>
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}

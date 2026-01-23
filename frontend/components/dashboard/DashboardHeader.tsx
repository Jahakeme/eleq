"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { signOut } from "next-auth/react";
import { LogOut, ChevronDown } from "lucide-react";
import { CartIcon } from "./CartIcon";

interface DashboardHeaderProps {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

export function DashboardHeader({ user }: DashboardHeaderProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const initials = user.name
    ? user.name
        .split(" ")
        .map((n) => n.charAt(0))
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U";

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSignOut = () => {
    signOut({ callbackUrl: "/" });
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-background/80 backdrop-blur-sm border-b">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="text-xl font-bold hover:opacity-80 transition-opacity"
          >
            eleq.
          </Link>

          {/* Right side: Cart + User */}
          <div className="flex items-center gap-2">
            {/* Cart Icon */}
            <CartIcon />

            {/* User Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 p-1.5 hover:bg-muted rounded-full transition-colors"
              >
                {/* Avatar */}
                <div className="relative size-8">
                  {user.image ? (
                    <Image
                      src={user.image}
                      alt={user.name || "User"}
                      fill
                      className="rounded-full object-cover"
                    />
                  ) : (
                    <div className="size-8 rounded-full bg-(--colour-primary) flex items-center justify-center text-white text-sm font-medium">
                      {initials}
                    </div>
                  )}
                </div>
                <ChevronDown className="size-4 text-muted-foreground" />
              </button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-lg border bg-background shadow-lg">
                  <div className="p-3 border-b">
                    <p className="font-medium text-sm truncate">
                      {user.name || "User"}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {user.email}
                    </p>
                  </div>
                  <div className="p-1">
                    <button
                      onClick={handleSignOut}
                      className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-muted transition-colors"
                    >
                      <LogOut className="size-4" />
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

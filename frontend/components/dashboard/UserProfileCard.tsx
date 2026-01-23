"use client";

import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";

interface UserProfileCardProps {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

export function UserProfileCard({ user }: UserProfileCardProps) {
  const initials = user.name
    ? user.name
        .split(" ")
        .map((n) => n.charAt(0))
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U";

  return (
    <Card className="border-0 shadow-none bg-transparent py-0">
      <CardContent className="flex items-center gap-4 px-0">
        {/* Large Avatar */}
        <div className="relative size-16 shrink-0">
          {user.image ? (
            <Image
              src={user.image}
              alt={user.name || "User"}
              fill
              className="rounded-full object-cover"
            />
          ) : (
            <div className="size-16 rounded-full bg-[var(--colour-primary)] flex items-center justify-center text-white text-xl font-semibold">
              {initials}
            </div>
          )}
        </div>

        {/* User Info */}
        <div className="min-w-0">
          <h2 className="font-semibold text-lg truncate">
            {user.name || "User"}
          </h2>
          <p className="text-sm text-muted-foreground truncate">
            {user.email}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

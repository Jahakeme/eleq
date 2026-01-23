"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/hooks/use-cart";

export function CartIcon() {
  const { itemCount } = useCart();

  return (
    <Link
      href="/checkout"
      className="relative p-2 hover:bg-muted rounded-full transition-colors"
    >
      <ShoppingCart className="size-5" />
      {itemCount > 0 && (
        <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-[var(--colour-primary)] text-white text-xs flex items-center justify-center font-medium">
          {itemCount > 99 ? "99+" : itemCount}
        </span>
      )}
    </Link>
  );
}

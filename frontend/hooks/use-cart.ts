"use client";

import { useContext } from "react";
import { CartContext } from "@/contexts/CartContext";

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }

  return context;
}

// Optional version that returns null if not in a CartProvider
export function useCartOptional() {
  return useContext(CartContext);
}

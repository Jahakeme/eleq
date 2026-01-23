"use client";

import { createContext, useState, useCallback, ReactNode } from "react";

interface CartContextValue {
  itemCount: number;
  refreshCart: () => Promise<void>;
  isLoading: boolean;
}

export const CartContext = createContext<CartContextValue | null>(null);

interface CartProviderProps {
  children: ReactNode;
  initialCount: number;
}

export function CartProvider({ children, initialCount }: CartProviderProps) {
  const [itemCount, setItemCount] = useState(initialCount);
  const [isLoading, setIsLoading] = useState(false);

  const refreshCart = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/cart");
      if (res.ok) {
        const data = await res.json();
        setItemCount(data.cart.itemCount);
      }
    } catch (error) {
      console.error("Failed to refresh cart:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <CartContext.Provider value={{ itemCount, refreshCart, isLoading }}>
      {children}
    </CartContext.Provider>
  );
}

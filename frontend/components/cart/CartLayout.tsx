"use client";

import { useState, useEffect, useCallback } from "react";
import { Loader2, ShoppingCart } from "lucide-react";
import { CartProvider } from "@/contexts/CartContext";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { CartItem } from "./CartItem";
import { OrderSummary } from "./OrderSummary";

interface CartItemData {
  id: string;
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    imageUrl: string;
    stock: number;
    status: string;
  };
  quantity: number;
  subtotal: number;
}

interface CartLayoutProps {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

function CartContent({ user }: CartLayoutProps) {
  const [cartItems, setCartItems] = useState<CartItemData[]>([]);
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  // Fetch cart items
  const fetchCart = useCallback(async () => {
    try {
      const response = await fetch("/api/cart");
      if (!response.ok) throw new Error("Failed to fetch cart");
      const data = await response.json();
      setCartItems(data.cart.items);
    } catch (error) {
      console.error("Failed to fetch cart:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  // Update quantity
  const updateQuantity = async (id: string, delta: number) => {
    const item = cartItems.find((i) => i.id === id);
    if (!item) return;

    const newQuantity = Math.max(1, item.quantity + delta);
    if (newQuantity > item.product.stock) return;

    // Optimistic update
    setCartItems((prev) =>
      prev.map((i) =>
        i.id === id
          ? {
              ...i,
              quantity: newQuantity,
              subtotal: i.product.price * newQuantity,
            }
          : i
      )
    );

    try {
      await fetch(`/api/cart/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity: newQuantity }),
      });
    } catch (error) {
      console.error("Update failed:", error);
      // Revert on failure
      fetchCart();
    }
  };

  // Delete item
  const deleteItem = async (id: string) => {
    // Optimistic update
    setCartItems((prev) => prev.filter((item) => item.id !== id));

    try {
      const response = await fetch(`/api/cart/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete item");
    } catch (error) {
      console.error("Delete failed:", error);
      // Revert on failure
      fetchCart();
    }
  };

  // Calculate totals
  const subtotal = cartItems.reduce((sum, item) => sum + item.subtotal, 0);
  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  // Handle checkout
  const handleCheckout = async () => {
    setIsProcessing(true);
    // Navigation handled by OrderSummary
    setIsProcessing(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-(--colour-background)">
        <DashboardHeader user={user} />
        <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
          <Loader2 className="animate-spin w-10 h-10 text-(--colour-primary)" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-(--colour-background)">
      <DashboardHeader user={user} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-3xl font-bold mb-8 font-[family-name:var(--font-heading)]">
          My Shopping Cart
        </h2>

        {cartItems.length === 0 ? (
          <div className="bg-card rounded-lg p-12 text-center">
            <ShoppingCart className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-semibold mb-2">Your cart is empty</h3>
            <p className="text-muted-foreground mb-6">
              Looks like you haven&apos;t added any items to your cart yet.
            </p>
            <a
              href="/dashboard"
              className="inline-block bg-(--colour-primary) hover:bg-(--colour-tertiary) text-white px-6 py-3 rounded font-semibold transition-colors"
            >
              Continue Shopping
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <CartItem
                  key={item.id}
                  id={item.id}
                  product={item.product}
                  quantity={item.quantity}
                  subtotal={item.subtotal}
                  onUpdateQuantity={updateQuantity}
                  onDelete={deleteItem}
                />
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <OrderSummary
                itemCount={itemCount}
                subtotal={subtotal}
                isProcessing={isProcessing}
                onCheckout={handleCheckout}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export function CartLayout({ user }: CartLayoutProps) {
  return (
    <CartProvider initialCount={0}>
      <CartContent user={user} />
    </CartProvider>
  );
}

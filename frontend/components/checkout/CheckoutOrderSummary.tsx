"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ShoppingBag, Loader2 } from "lucide-react";

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

export function CheckoutOrderSummary() {
  const [cartItems, setCartItems] = useState<CartItemData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCart = async () => {
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
    };
    fetchCart();
  }, []);

  const subtotal = cartItems.reduce((sum, item) => sum + item.subtotal, 0);
  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const tax = subtotal * 0.075; // 7.5% VAT
  const total = subtotal + tax;

  if (loading) {
    return (
      <div className="bg-card rounded-lg p-6 shadow-sm">
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-(--colour-primary)" />
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="bg-card rounded-lg p-6 shadow-sm text-center">
        <ShoppingBag className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
        <p className="text-muted-foreground mb-4">Your cart is empty</p>
        <Link
          href="/dashboard"
          className="text-(--colour-primary) hover:underline text-sm font-medium"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Order Summary</h2>
        <Link
          href="/cart"
          className="text-sm text-(--colour-primary) hover:underline"
        >
          Edit Cart
        </Link>
      </div>

      {/* Cart Items */}
      <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
        {cartItems.map((item) => (
          <div key={item.id} className="flex gap-3">
            <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted relative shrink-0">
              <Image
                src={item.product.imageUrl}
                alt={item.product.name}
                fill
                className="object-cover"
                sizes="64px"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate">{item.product.name}</p>
              <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
              <p className="text-sm font-semibold">
                NGN {item.subtotal.toLocaleString()}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Price Breakdown */}
      <div className="border-t pt-4 space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">
            Subtotal ({itemCount} {itemCount === 1 ? "item" : "items"})
          </span>
          <span>NGN {subtotal.toLocaleString()}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Tax (7.5% VAT)</span>
          <span>NGN {tax.toLocaleString()}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Shipping</span>
          <span className="text-green-600">Free</span>
        </div>
        <div className="flex justify-between font-bold text-base pt-2 border-t">
          <span>Total</span>
          <span className="text-(--colour-primary)">
            NGN {total.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
}

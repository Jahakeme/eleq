"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Image from "next/image";
import gsap from "gsap";
import { X, Minus, Plus, ShoppingCart, Zap, Loader2 } from "lucide-react";
import type { Product } from "@/lib/products";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useCartOptional } from "@/hooks/use-cart";

interface QuickViewModalProps {
  product: Product | null;
  onClose: () => void;
}

export function QuickViewModal({ product, onClose }: QuickViewModalProps) {
  const router = useRouter();
  const { status } = useSession();
  const cart = useCartOptional();
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isBuyingNow, setIsBuyingNow] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const backdropRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // Reset quantity when product changes
  useEffect(() => {
    if (product) {
      setQuantity(1);
      setError(null);
    }
  }, [product]);

  // Animate modal in
  useEffect(() => {
    if (!product) return;

    gsap.fromTo(
      backdropRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.3, ease: "power2.out" }
    );

    gsap.fromTo(
      modalRef.current,
      { opacity: 0, scale: 0.95, y: 20 },
      { opacity: 1, scale: 1, y: 0, duration: 0.4, ease: "power3.out", delay: 0.1 }
    );
  }, [product]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (product) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [product]);

  const handleClose = () => {
    gsap.to(modalRef.current, {
      opacity: 0,
      scale: 0.95,
      y: 20,
      duration: 0.25,
      ease: "power2.in",
    });

    gsap.to(backdropRef.current, {
      opacity: 0,
      duration: 0.3,
      ease: "power2.in",
      onComplete: onClose,
    });
  };

  const handleQuantityChange = (delta: number) => {
    setQuantity((prev) => {
      const newQty = prev + delta;
      if (newQty < 1) return 1;
      if (product && newQty > product.stock) return product.stock;
      return newQty;
    });
  };

  const addToCart = async () => {
    if (!product) return;

    setIsAddingToCart(true);
    setError(null);

    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product.id, quantity }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to add to cart");
      }

      // Refresh cart count if in CartProvider context
      if (cart?.refreshCart) {
        await cart.refreshCart();
      }

      handleClose();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to add to cart";
      setError(message);
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleAddToCart = async () => {
    if (status === "unauthenticated") {
      // Store pending cart action
      sessionStorage.setItem(
        "pendingCartAction",
        JSON.stringify({ productId: product?.id, quantity, action: "add" })
      );
      router.push("/signin?redirect=/products");
      return;
    }

    await addToCart();
  };

  const handleBuyNow = async () => {
    if (!product) return;

    setIsBuyingNow(true);
    setError(null);

    try {
      if (status === "unauthenticated") {
        // Store pending purchase for after login
        sessionStorage.setItem(
          "pendingCartAction",
          JSON.stringify({ productId: product.id, quantity, action: "buy" })
        );
        router.push(`/signup?redirect=/checkout`);
        return;
      }

      // User is logged in - add to cart and go to checkout
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product.id, quantity }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to add to cart");
      }

      // Refresh cart count if in CartProvider context
      if (cart?.refreshCart) {
        await cart.refreshCart();
      }

      // Redirect to checkout
      router.push("/checkout");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to process";
      setError(message);
      setIsBuyingNow(false);
    }
  };

  if (!product) return null;

  const isOutOfStock = product.status !== "ACTIVE" || product.stock === 0;
  const isLoading = isAddingToCart || isBuyingNow;

  return (
    <div
      ref={backdropRef}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={handleClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Modal */}
      <div
        ref={modalRef}
        className={cn(
          "relative w-full sm:max-w-2xl lg:max-w-4xl",
          "bg-background rounded-t-2xl sm:rounded-2xl",
          "max-h-[90vh] overflow-auto"
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute right-4 top-4 z-10 p-2 rounded-full bg-background/80 hover:bg-muted transition-colors"
        >
          <X className="size-5" />
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
          {/* Image */}
          <div className="aspect-square relative rounded-xl overflow-hidden bg-muted">
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>

          {/* Details */}
          <div className="flex flex-col">
            {/* Category */}
            {product.category && (
              <span className="text-sm text-muted-foreground mb-2">
                {product.category.name}
              </span>
            )}

            {/* Name */}
            <h2 className="font-[var(--font-nunito)] text-2xl font-bold mb-2">
              {product.name}
            </h2>

            {/* Brand */}
            <p className="text-sm text-muted-foreground mb-4">{product.brand}</p>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-3xl font-bold">
                ₦{product.price.toFixed(2)}
              </span>
              {product.comparePrice && product.comparePrice > product.price && (
                <span className="text-lg text-muted-foreground line-through">
                  ₦{product.comparePrice.toFixed(2)}
                </span>
              )}
            </div>

            {/* Description */}
            <p className="text-sm text-muted-foreground leading-relaxed mb-6 line-clamp-3">
              {product.description}
            </p>

            {/* Stock status */}
            {isOutOfStock ? (
              <p className="text-sm text-destructive mb-6">Out of stock</p>
            ) : (
              <p className="text-sm text-muted-foreground mb-6">
                {product.stock} in stock
              </p>
            )}

            {/* Quantity selector */}
            {!isOutOfStock && (
              <div className="flex items-center gap-4 mb-6">
                <span className="text-sm font-medium">Quantity</span>
                <div className="flex items-center border rounded-full">
                  <button
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1 || isLoading}
                    className="p-2 hover:bg-muted rounded-l-full transition-colors disabled:opacity-50"
                  >
                    <Minus className="size-4" />
                  </button>
                  <span className="w-12 text-center font-medium">{quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(1)}
                    disabled={quantity >= product.stock || isLoading}
                    className="p-2 hover:bg-muted rounded-r-full transition-colors disabled:opacity-50"
                  >
                    <Plus className="size-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Error message */}
            {error && (
              <p className="text-sm text-destructive mb-4">{error}</p>
            )}

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-3 mt-auto">
              <Button
                variant="outline"
                size="lg"
                className="flex-1 rounded-full"
                onClick={handleAddToCart}
                disabled={isOutOfStock || isLoading}
              >
                {isAddingToCart ? (
                  <Loader2 className="size-5 animate-spin" />
                ) : (
                  <>
                    <ShoppingCart className="size-5" />
                    Add to Cart
                  </>
                )}
              </Button>
              <Button
                size="lg"
                className="flex-1 rounded-full"
                onClick={handleBuyNow}
                disabled={isOutOfStock || isLoading}
              >
                {isBuyingNow ? (
                  <Loader2 className="size-5 animate-spin" />
                ) : (
                  <>
                    <Zap className="size-5" />
                    Buy Now
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

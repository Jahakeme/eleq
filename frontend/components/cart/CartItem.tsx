"use client";

import Image from "next/image";
import { Minus, Plus, Bookmark, Trash2 } from "lucide-react";

interface CartItemProps {
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
  onUpdateQuantity: (id: string, delta: number) => void;
  onDelete: (id: string) => void;
  onToggleSave?: (id: string) => void;
  saved?: boolean;
}

export function CartItem({
  id,
  product,
  quantity,
  subtotal,
  onUpdateQuantity,
  onDelete,
  onToggleSave,
  saved = false,
}: CartItemProps) {
  return (
    <div className="bg-card rounded-lg p-6 shadow-sm">
      <div className="flex gap-6">
        {/* Product Image */}
        <div className="w-32 h-32 bg-muted rounded-lg shrink-0 overflow-hidden relative">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-cover"
            sizes="128px"
          />
        </div>

        {/* Product Details */}
        <div className="flex-1">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-semibold">{product.name}</h3>
            <div className="flex items-center gap-2">
              {onToggleSave && (
                <button
                  onClick={() => onToggleSave(id)}
                  className={`px-3 py-1 text-sm rounded flex items-center gap-1 transition-colors ${
                    saved
                      ? "bg-(--colour-primary) text-white"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  <Bookmark
                    className="w-3 h-3"
                    fill={saved ? "currentColor" : "none"}
                  />
                  {saved ? "Saved" : "Save for later"}
                </button>
              )}

              {/* Delete Button */}
              <button
                onClick={() => onDelete(id)}
                className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-md transition-colors"
                title="Remove item"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          <p className="text-sm text-muted-foreground mb-3">Free Shipping</p>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">Price</p>
              <p className="text-xl font-bold">
                NGN {product.price.toLocaleString()}
              </p>
            </div>

            {/* Quantity Controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => onUpdateQuantity(id, -1)}
                disabled={quantity <= 1}
                className="w-8 h-8 bg-muted hover:bg-muted/80 disabled:opacity-50 rounded flex items-center justify-center transition-colors"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-12 text-center font-semibold">{quantity}</span>
              <button
                onClick={() => onUpdateQuantity(id, 1)}
                disabled={quantity >= product.stock}
                className="w-8 h-8 bg-(--colour-primary) hover:bg-(--colour-tertiary) disabled:opacity-50 text-white rounded flex items-center justify-center transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Subtotal */}
          <div className="mt-2 text-right">
            <p className="text-sm text-muted-foreground">
              Subtotal: <span className="font-semibold">NGN {subtotal.toLocaleString()}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

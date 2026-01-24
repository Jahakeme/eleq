"use client";

import { useRouter } from "next/navigation";
import { Truck, CreditCard, Lock, MessageCircle, Loader2 } from "lucide-react";

interface OrderSummaryProps {
  itemCount: number;
  subtotal: number;
  isProcessing: boolean;
  onCheckout: () => void;
  disabled?: boolean;
}

export function OrderSummary({
  itemCount,
  subtotal,
  isProcessing,
  onCheckout,
  disabled = false,
}: OrderSummaryProps) {
  const router = useRouter();

  const handleCheckout = () => {
    router.push("/checkout");
  };

  return (
    <div className="bg-card rounded-lg p-6 shadow-sm sticky top-20">
      <h3 className="text-xl font-bold mb-6">Total Price Details</h3>

      <div className="space-y-3 mb-6">
        <div className="flex justify-between">
          <span className="text-muted-foreground">No. of Items</span>
          <span className="font-semibold">{itemCount}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Price</span>
          <span className="font-semibold">NGN {subtotal.toLocaleString()}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Shipping Charges</span>
          <span className="font-semibold text-green-600">Free</span>
        </div>
        <div className="border-t pt-3 flex justify-between">
          <span className="font-bold">Total Amount</span>
          <span className="font-bold text-xl">NGN {subtotal.toLocaleString()}</span>
        </div>
      </div>

      <button
        onClick={handleCheckout}
        disabled={isProcessing || disabled || itemCount === 0}
        className="w-full bg-(--colour-primary) hover:bg-(--colour-tertiary) disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 rounded font-semibold mb-4 flex justify-center items-center cursor-pointer transition-colors"
      >
        {isProcessing ? <Loader2 className="animate-spin" /> : "Checkout"}
      </button>

      <p className="text-xs text-muted-foreground text-center mb-6">
        Estimated to ship within 1 business day after payment confirmation.
      </p>

      {/* Features */}
      <div className="grid grid-cols-2 gap-4 pt-6 border-t">
        <div className="text-center">
          <Truck className="w-8 h-8 mx-auto mb-2 text-(--colour-secondary)" />
          <p className="text-xs text-muted-foreground">
            Free shipping on orders over NGN 50,000
          </p>
        </div>
        <div className="text-center">
          <CreditCard className="w-8 h-8 mx-auto mb-2 text-(--colour-secondary)" />
          <p className="text-xs text-muted-foreground">
            We accept credit cards, PayPal, and bank transfers
          </p>
        </div>
        <div className="text-center">
          <Lock className="w-8 h-8 mx-auto mb-2 text-(--colour-secondary)" />
          <p className="text-xs text-muted-foreground">
            Safe and Secure Payments
          </p>
        </div>
        <div className="text-center">
          <MessageCircle className="w-8 h-8 mx-auto mb-2 text-(--colour-secondary)" />
          <p className="text-xs text-muted-foreground">
            Customer Care Live Chat
          </p>
        </div>
      </div>
    </div>
  );
}

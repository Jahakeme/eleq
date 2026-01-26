"use client";

import { useState } from "react";
import { Loader2, ShieldCheck } from "lucide-react";
import { ShippingAddress, PlaceOrderPayload } from "@/lib/checkout";
import { usePaystack } from "@/hooks/usePaystack";

type Props = {
  shippingAddress: ShippingAddress;
  saveAddress: boolean;
  paymentMethod: "card";
  productId?: string;
  disabled?: boolean;
  email?: string;
};

export function PlaceOrderButton({
  shippingAddress,
  saveAddress,
  paymentMethod,
  productId,
  disabled = false,
  email,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { loadPaystack } = usePaystack();

  const isFormValid =
    shippingAddress.street.trim() !== "" &&
    shippingAddress.city.trim() !== "" &&
    shippingAddress.state.trim() !== "" &&
    shippingAddress.zipCode.trim() !== "" &&
    shippingAddress.country.trim() !== "";

  const handleClick = async () => {
    if (!isFormValid) {
      setError("Please fill in all shipping address fields");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const payload: PlaceOrderPayload = {
        shippingAddress,
        saveAddress,
        paymentMethod,
        ...(productId && { productId, quantity: 1 }),
      };

      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Checkout failed");
      }

      //Trigger Paystack Popup instead of redirecting
      loadPaystack(email ?? "", data.order.total, data.order.id, (response) => {
        window.location.href = `/api/checkout/verify?reference=${response.reference}`;
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "An error occurred";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      {error && (
        <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      <button
        onClick={handleClick}
        disabled={loading || disabled}
        className="w-full bg-(--colour-primary) hover:bg-(--colour-tertiary) disabled:opacity-50 disabled:cursor-not-allowed text-white py-4 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors"
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Processing...
          </>
        ) : (
          <>
            <ShieldCheck className="w-5 h-5" />
            Place Order
          </>
        )}
      </button>

      <p className="text-xs text-center text-muted-foreground">
        By placing your order, you agree to our Terms of Service and Privacy
        Policy
      </p>
    </div>
  );
}

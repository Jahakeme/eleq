"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { CartProvider } from "@/contexts/CartContext";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { ShippingForm } from "./ShippingForm";
import { PaymentMethod } from "./PaymentMethod";
import { CheckoutOrderSummary } from "./CheckoutOrderSummary";
import { PlaceOrderButton } from "./PlaceOrderButton";
import { ShippingAddress } from "@/lib/checkout";

interface CheckoutLayoutProps {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

function CheckoutContent({ user }: CheckoutLayoutProps) {
  const params = useSearchParams();
  const productId = params.get("product") || undefined;

  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
  });

  const [saveAddress, setSaveAddress] = useState(false);
  const [paymentMethod] = useState<"card">("card");

  return (
    <div className="min-h-screen bg-(--colour-background)">
      <DashboardHeader user={user} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back to Cart Link */}
        <Link
          href="/cart"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Cart</span>
        </Link>

        <h1 className="text-3xl font-bold mb-8 font-[family-name:var(--font-heading)]">
          Checkout
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Forms */}
          <div className="lg:col-span-2 space-y-6">
            <ShippingForm
              value={shippingAddress}
              onChange={setShippingAddress}
              saveAddress={saveAddress}
              onToggleSaveAddress={setSaveAddress}
            />

            <PaymentMethod />
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1 space-y-4">
            <CheckoutOrderSummary />
            <PlaceOrderButton
              shippingAddress={shippingAddress}
              saveAddress={saveAddress}
              paymentMethod={paymentMethod}
              productId={productId}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function CheckoutFallback({ user }: CheckoutLayoutProps) {
  return (
    <div className="min-h-screen bg-(--colour-background)">
      <DashboardHeader user={user} />
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <Loader2 className="animate-spin w-10 h-10 text-(--colour-primary)" />
      </div>
    </div>
  );
}

export function CheckoutLayout({ user }: CheckoutLayoutProps) {
  return (
    <CartProvider initialCount={0}>
      <Suspense fallback={<CheckoutFallback user={user} />}>
        <CheckoutContent user={user} />
      </Suspense>
    </CartProvider>
  );
}

"use client";

import { CreditCard, Lock } from "lucide-react";

export function PaymentMethod() {
  return (
    <div className="bg-card rounded-lg p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 rounded-full bg-(--colour-primary)/10">
          <CreditCard className="w-5 h-5 text-(--colour-primary)" />
        </div>
        <h2 className="text-lg font-semibold">Payment Method</h2>
      </div>

      <div className="flex items-center gap-3 p-4 border rounded-lg bg-background">
        <div className="flex-1">
          <p className="font-medium">Credit / Debit Card</p>
          <p className="text-sm text-muted-foreground mt-1">
            You will be redirected to Paystack to complete your payment securely.
          </p>
        </div>
        <div className="p-2 rounded-full bg-green-100">
          <Lock className="w-4 h-4 text-green-600" />
        </div>
      </div>

      <div className="flex items-center gap-2 mt-4 text-xs text-muted-foreground">
        <Lock className="w-3 h-3" />
        <span>Your payment information is encrypted and secure</span>
      </div>
    </div>
  );
}

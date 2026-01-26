"use client";

import Link from "next/link";
import { CheckCircle2, Package, ArrowRight, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function Successpage() {
  return (
    <Card className="max-w-md w-full border-none shadow-2xl bg-white text-(--colour-secondary)">
      <CardHeader className="text-center pb-2">
        <div className="flex justify-center mb-4">
          <div className="rounded-full bg-green-100 p-3">
            <CheckCircle2 className="w-16 h-16 text-green-600 animate-in zoom-in duration-500" />
          </div>
        </div>
        <CardTitle className="text-3xl font-bold">
          Payment Successful!
        </CardTitle>
        <p className="text-muted-foreground mt-2">
          Your transaction was completed successfully.
        </p>
      </CardHeader>

      <CardContent className="space-y-6 py-6">
        <div className="bg-(--colour-background)/30 rounded-lg p-4 space-y-3 border border-(--colour-primary)/10">
          <div className="flex justify-between text-sm">
            <span className="font-medium">Status</span>
            <span className="text-green-600 font-bold uppercase text-xs bg-green-50 px-2 py-1 rounded">
              Paid
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="font-medium">Delivery Est.</span>
            <span>3 - 5 Business Days</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex flex-col gap-3">
        <Button
          asChild
          className="w-full bg-(--colour-secondary) hover:bg-(--colour-primary) text-white py-6"
        >
          <Link href="/dashboard" className="flex items-center gap-2">
            <Package className="w-4 h-4" />
            Go to Dashboard
            <ArrowRight className="w-4 h-4" />
          </Link>
        </Button>

        <Button
          asChild
          variant="ghost"
          className="w-full text-(--colour-primary) hover:bg-(--colour-background)"
        >
          <Link href="/products" className="flex items-center gap-2">
            <ShoppingBag className="w-4 h-4" />
            Continue Shopping
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

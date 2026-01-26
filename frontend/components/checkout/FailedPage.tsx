"use client";

import Link from "next/link";
import { XCircle, RefreshCw, ArrowRight, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function FailedPage() {
  return (
    <Card className="max-w-md w-full border-none shadow-2xl bg-white text-(--colour-secondary)">
      <CardHeader className="text-center pb-2">
        <div className="flex justify-center mb-4">
          <div className="rounded-full bg-red-100 p-3">
            <XCircle className="w-16 h-16 text-red-600 animate-in zoom-in duration-500" />
          </div>
        </div>
        <CardTitle className="text-3xl font-bold">Payment Failed</CardTitle>
        <p className="text-muted-foreground mt-2">
          Your transaction could not be completed.
        </p>
      </CardHeader>

      <CardContent className="space-y-6 py-6">
        <div className="bg-(--colour-background)/30 rounded-lg p-4 space-y-3 border border-red-200">
          <div className="flex justify-between text-sm">
            <span className="font-medium">Status</span>
            <span className="text-red-600 font-bold uppercase text-xs bg-red-50 px-2 py-1 rounded">
              Failed
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="font-medium">Order Status</span>
            <span>Cancelled</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="font-medium">Items</span>
            <span>Returned to stock</span>
          </div>
        </div>

        <p className="text-sm text-muted-foreground text-center">
          Don&apos;t worry! No charges were made to your account and your items
          have been returned to stock.
        </p>
      </CardContent>

      <CardFooter className="flex flex-col gap-3">
        <Button
          asChild
          className="w-full bg-(--colour-secondary) hover:bg-(--colour-primary) text-white py-6"
        >
          <Link href="/checkout" className="flex items-center gap-2">
            <RefreshCw className="w-4 h-4" />
            Try Again
            <ArrowRight className="w-4 h-4" />
          </Link>
        </Button>

        <Button
          asChild
          variant="ghost"
          className="w-full text-(--colour-primary) hover:bg-(--colour-background)"
        >
          <Link href="/dashboard" className="flex items-center gap-2">
            <ShoppingBag className="w-4 h-4" />
            Continue Shopping
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

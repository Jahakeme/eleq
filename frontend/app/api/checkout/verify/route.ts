import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/connection";

async function restoreStockForOrder(orderId: string) {
  const orderItems = await prisma.orderItem.findMany({
    where: { orderId },
    select: { productId: true, quantity: true },
  });

  for (const item of orderItems) {
    const updatedProduct = await prisma.product.update({
      where: { id: item.productId },
      data: { stock: { increment: item.quantity } },
    });

    if (updatedProduct.stock > 0 && updatedProduct.status === "OUT_OF_STOCK") {
      await prisma.product.update({
        where: { id: item.productId },
        data: { status: "ACTIVE" },
      });
    }
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const reference = searchParams.get("reference");

  if (!reference) {
    return NextResponse.redirect(
      new URL("/checkout?error=no_reference", request.url),
    );
  }

  try {
    // Verify the transaction with Paystack
    const response = await fetch(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
      },
    );

    const data = await response.json();

    // Check if the payment was actually successful
    if (data.status && data.data.status === "success") {
      await prisma.order.update({
        where: { id: reference },
        data: {
          paymentStatus: "PAID",
          status: "PROCESSING",
          paidAt: new Date(),
        },
      });

      //Redirect to a success page
      return NextResponse.redirect(new URL("/orders/success", request.url));
    } else {
      // Payment failed or was abandoned - restore stock and cancel order
      await prisma.$transaction(async (tx) => {
        // Update order status
        await tx.order.update({
          where: { id: reference },
          data: {
            paymentStatus: "FAILED",
            status: "CANCELLED",
          },
        });
      });

      // Restore stock outside transaction to avoid long locks
      await restoreStockForOrder(reference);

      return NextResponse.redirect(
        new URL(`/orders/failed?ref=${reference}`, request.url),
      );
    }
  } catch (error) {
    console.error("Verification Error:", error);
    return NextResponse.redirect(
      new URL("/checkout?error=server_error", request.url),
    );
  }
}

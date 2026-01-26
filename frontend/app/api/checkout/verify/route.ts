import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/connection";

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
        },
      });

      //Redirect to a success page
      return NextResponse.redirect(new URL("/orders/success", request.url));
    } else {
      // Payment failed or was abandoned
      return NextResponse.redirect(
        new URL(`/checkout?error=payment_failed&ref=${reference}`, request.url),
      );
    }
  } catch (error) {
    console.error("Verification Error:", error);
    return NextResponse.redirect(
      new URL("/checkout?error=server_error", request.url),
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { Prisma } from "@/lib/generated/prisma";
import prisma from "@/prisma/connection";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// Prisma Error Codes Reference:
// P2002 - Unique constraint violation (order number collision)
// P2025 - Record not found (product not found)
// P2003 - Foreign key constraint violation (invalid productId/userId)
// P2023 - Inconsistent column data (invalid ObjectId format)
// P2034 - Transaction failed due to conflict or timeout

const TAX_RATE = 0.08;
const FREE_SHIPPING_THRESHOLD = 100;
const SHIPPING_COST = 10;

function validateAddress(address: { street?: string; city?: string; state?: string; zipCode?: string; country?: string }) {
  const required = ["street", "city", "state", "zipCode", "country"] as const;
  for (const field of required) {
    if (!address?.[field]) return { valid: false, field };
  }
  return { valid: true, field: null };
}

function calculateOrderTotals(subtotal: number) {
  const tax = subtotal * TAX_RATE;
  const shippingCost = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  return { subtotal, tax, shippingCost, total: subtotal + tax + shippingCost };
}

async function generateOrderNumber() {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `ORD-${date}-${random}`;
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }
    const userId = session.user.id;

    const body = await request.json();
    const { shippingAddress, paymentMethod = "card", saveAddress = false, productId, quantity = 1 } = body;

    const addressValidation = validateAddress(shippingAddress);
    if (!addressValidation.valid) {
      return NextResponse.json({ error: `${addressValidation.field} is required in shipping address` }, { status: 400 });
    }

    const orderItems: Array<{ productId: string; productName: string; price: number; quantity: number }> = [];

    if (productId) {
      const product = await prisma.product.findUnique({
        where: { id: productId },
        select: { id: true, name: true, price: true, stock: true, status: true },
      });

      if (!product) return NextResponse.json({ error: "Product not found" }, { status: 404 });
      if (product.status !== "ACTIVE") return NextResponse.json({ error: "Product not available" }, { status: 400 });
      if (product.stock < quantity) return NextResponse.json({ error: "Insufficient stock" }, { status: 400 });

      orderItems.push({ productId: product.id, productName: product.name, price: product.price, quantity });
    } else {
      const cartItems = await prisma.cartItem.findMany({
        where: { userId },
        include: { product: { select: { id: true, name: true, price: true, stock: true, status: true } } },
      });

      if (cartItems.length === 0) return NextResponse.json({ error: "Cart is empty" }, { status: 400 });

      for (const item of cartItems) {
        if (item.product.status !== "ACTIVE") {
          return NextResponse.json({ error: `${item.product.name} is no longer available` }, { status: 400 });
        }
        if (item.product.stock < item.quantity) {
          return NextResponse.json({ error: `Insufficient stock for ${item.product.name}. Only ${item.product.stock} available` }, { status: 400 });
        }
        orderItems.push({ productId: item.product.id, productName: item.product.name, price: item.product.price, quantity: item.quantity });
      }
    }

    const subtotal = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const totals = calculateOrderTotals(subtotal);
    const orderNumber = await generateOrderNumber();

    const order = await prisma.$transaction(async (tx) => {
      const newOrder = await tx.order.create({
        data: {
          orderNumber,
          userId,
          subtotal: totals.subtotal,
          tax: totals.tax,
          shippingCost: totals.shippingCost,
          total: totals.total,
          shippingAddress,
          paymentMethod,
          status: "PENDING",
          paymentStatus: "PENDING",
        },
      });

      for (const item of orderItems) {
        await tx.orderItem.create({
          data: { orderId: newOrder.id, productId: item.productId, productName: item.productName, price: item.price, quantity: item.quantity },
        });
        await tx.product.update({ where: { id: item.productId }, data: { stock: { decrement: item.quantity } } });
      }

      if (!productId) {
        await tx.cartItem.deleteMany({ where: { userId } });
      }

      if (saveAddress) {
        await tx.user.update({ where: { id: userId }, data: { address: shippingAddress } });
      }

      return newOrder;
    });

    const completeOrder = await prisma.order.findUnique({
      where: { id: order.id },
      include: { items: { select: { productName: true, price: true, quantity: true } } },
    });

    const paymentUrl = `https://checkout.stripe.com/pay/${order.id}`;

    return NextResponse.json({
      success: true,
      message: "Order placed successfully",
      order: {
        id: completeOrder!.id,
        orderNumber: completeOrder!.orderNumber,
        items: completeOrder!.items,
        subtotal: completeOrder!.subtotal,
        tax: completeOrder!.tax,
        shippingCost: completeOrder!.shippingCost,
        total: completeOrder!.total,
        status: completeOrder!.status,
        paymentStatus: completeOrder!.paymentStatus,
        createdAt: completeOrder!.createdAt,
      },
      paymentUrl,
    }, { status: 201 });
  } catch (error) {
    console.error("Checkout error:", error);

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      // P2002 - Unique constraint violation (order number collision, retry)
      if (error.code === "P2002") {
        return NextResponse.json(
          { error: "Order creation conflict. Please try again", code: "P2002" },
          { status: 409 }
        );
      }
      // P2025 - Record not found
      if (error.code === "P2025") {
        return NextResponse.json(
          { error: "Product or cart item not found", code: "P2025" },
          { status: 404 }
        );
      }
      // P2003 - Foreign key constraint violation
      if (error.code === "P2003") {
        return NextResponse.json(
          { error: "Invalid product or user reference", code: "P2003" },
          { status: 400 }
        );
      }
      // P2023 - Invalid ObjectId format
      if (error.code === "P2023") {
        return NextResponse.json(
          { error: "Invalid ID format", code: "P2023" },
          { status: 400 }
        );
      }
      // P2034 - Transaction failed
      if (error.code === "P2034") {
        return NextResponse.json(
          { error: "Transaction failed. Please try again", code: "P2034" },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({ error: "Failed to process checkout" }, { status: 500 });
  }
}

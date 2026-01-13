import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { Prisma } from "@/lib/generated/prisma";
import prisma from "@/prisma/connection";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// Prisma Error Codes Reference:
// P2002 - Unique constraint violation
// P2025 - Record not found (for update/delete operations)
// P2003 - Foreign key constraint violation
// P2016 - Query interpretation error

type Params = { params: Promise<{ itemId: string }> };

// PATCH /api/cart/[itemId] - Update cart item quantity
export async function PATCH(request: NextRequest, { params }: Params) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { itemId } = await params;
    const { quantity } = await request.json();

    // Validate quantity
    if (!quantity || quantity < 1 || quantity > 99) {
      return NextResponse.json({ error: "Invalid quantity" }, { status: 400 });
    }

    // Find the cart item and verify ownership
    const cartItem = await prisma.cartItem.findUnique({
      where: { id: itemId },
      include: {
        product: {
          select: { id: true, name: true, stock: true, status: true },
        },
      },
    });

    if (!cartItem) {
      return NextResponse.json(
        { error: "Cart item not found", code: "P2025" },
        { status: 404 }
      );
    }

    // Verify ownership
    if (cartItem.userId !== session.user.id) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    // Check product availability
    if (cartItem.product.status !== "ACTIVE") {
      return NextResponse.json(
        { error: "Product is no longer available" },
        { status: 400 }
      );
    }

    // Check stock
    if (quantity > cartItem.product.stock) {
      return NextResponse.json(
        {
          error: `Requested quantity exceeds available stock. Only ${cartItem.product.stock} items available`,
        },
        { status: 400 }
      );
    }

    // Update the cart item
    const updatedItem = await prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity },
    });

    return NextResponse.json({
      success: true,
      message: "Cart updated",
      cartItem: {
        id: updatedItem.id,
        quantity: updatedItem.quantity,
      },
    });
  } catch (error) {
    console.error("Update cart item error:", error);

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      // P2025 - Record not found during update
      if (error.code === "P2025") {
        return NextResponse.json(
          { error: "Cart item not found", code: "P2025" },
          { status: 404 }
        );
      }
    }

    return NextResponse.json(
      { error: "Failed to update cart item" },
      { status: 500 }
    );
  }
}

// DELETE /api/cart/[itemId] - Remove item from cart
export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { itemId } = await params;

    // Find the cart item and verify ownership
    const cartItem = await prisma.cartItem.findUnique({
      where: { id: itemId },
      select: { id: true, userId: true },
    });

    if (!cartItem) {
      return NextResponse.json(
        { error: "Cart item not found", code: "P2025" },
        { status: 404 }
      );
    }

    // Verify ownership
    if (cartItem.userId !== session.user.id) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    // Delete the cart item
    await prisma.cartItem.delete({
      where: { id: itemId },
    });

    return NextResponse.json({
      success: true,
      message: "Item removed from cart",
    });
  } catch (error) {
    console.error("Delete cart item error:", error);

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      // P2025 - Record not found during delete
      if (error.code === "P2025") {
        return NextResponse.json(
          { error: "Cart item not found", code: "P2025" },
          { status: 404 }
        );
      }
    }

    return NextResponse.json(
      { error: "Failed to remove item from cart" },
      { status: 500 }
    );
  }
}

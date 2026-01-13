import { NextRequest } from "next/server";
import prisma from "@/prisma/connection";
import { requireAuth } from "@/lib/auth";
import { successResponse, errorResponse } from "@/lib/api-response";
import { isError, getErrorMessage } from "@/lib/error-helpers";

interface RouteParams {
  params: {
    itemId: string;
  };
}

// Function to update cart item quantity
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const user = await requireAuth();
    const { itemId } = params;

    // Parse request body
    const body = await request.json();
    const { quantity } = body;

    // Validate quantity
    if (!quantity || quantity < 1 || quantity > 99) {
      return errorResponse("Invalid quantity", 400);
    }

    // Find cart item and verify ownership
    const cartItem = await prisma.cartItem.findUnique({
      where: { id: itemId },
      include: {
        product: {
          select: {
            stock: true,
            status: true,
          },
        },
      },
    });

    if (!cartItem) {
      return errorResponse("Cart item not found", 404);
    }

    if (cartItem.userId !== user.id) {
      return errorResponse("Access denied", 403);
    }

    // Check product availability
    if (cartItem.product.status !== "ACTIVE") {
      return errorResponse("Product not available", 400);
    }

    if (quantity > cartItem.product.stock) {
      return errorResponse(
        `Only ${cartItem.product.stock} items available`,
        400
      );
    }

    // Update cart item
    const updatedCartItem = await prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity },
    });

    return successResponse({
      success: true,
      message: "Cart updated",
      cartItem: {
        id: updatedCartItem.id,
        quantity: updatedCartItem.quantity,
      },
    });
  } catch (error: unknown) {
    if (isError(error) && error.message === "Unauthorized") {
      return errorResponse("Not authenticated", 401);
    }
    console.error("Update cart error:", getErrorMessage(error));
    return errorResponse("Failed to update cart", 500);
  }
}

//Function to remove item from cart
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const user = await requireAuth();
    const { itemId } = params;

    // Find cart item and verify ownership
    const cartItem = await prisma.cartItem.findUnique({
      where: { id: itemId },
    });

    if (!cartItem) {
      return errorResponse("Cart item not found", 404);
    }

    if (cartItem.userId !== user.id) {
      return errorResponse("Access denied", 403);
    }

    // Delete cart item
    await prisma.cartItem.delete({
      where: { id: itemId },
    });

    return successResponse({
      success: true,
      message: "Item removed from cart",
    });
  } catch (error: unknown) {
    if (isError(error) && error.message === "Unauthorized") {
      return errorResponse("Not authenticated", 401);
    }
    console.error("Delete cart item error:", getErrorMessage(error));
    return errorResponse("Failed to remove item", 500);
  }
}

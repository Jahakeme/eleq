import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { Prisma } from "@/lib/generated/prisma";
import prisma from "@/prisma/connection";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// Prisma Error Codes Reference:
// P2002 - Unique constraint violation (cart item already exists)
// P2025 - Record not found (product not found)
// P2003 - Foreign key constraint violation (invalid productId/userId)
// P2023 - Inconsistent column data (invalid ObjectId format)

type CartItemWithProduct = Prisma.CartItemGetPayload<{
  include: {
    product: {
      select: {
        id: true;
        name: true;
        slug: true;
        price: true;
        imageUrl: true;
        stock: true;
        status: true;
      };
    };
  };
}>;

// Define the type for mapped items
interface CartItemMapped {
  id: string;
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    imageUrl: string;
    stock: number;
    status: string;
  };
  quantity: number;
  subtotal: number;
}

// GET /api/cart - Get current user's cart
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const cartItems = await prisma.cartItem.findMany({
      where: { userId: session.user.id },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            slug: true,
            price: true,
            imageUrl: true,
            stock: true,
            status: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const items: CartItemMapped[] = cartItems.map(
      (item: CartItemWithProduct) => ({
        id: item.id,
        product: item.product,
        quantity: item.quantity,
        subtotal: item.product.price * item.quantity,
      })
    );

    const subtotal = items.reduce((sum, item) => sum + item.subtotal, 0);
    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

    return NextResponse.json({ cart: { items, itemCount, subtotal } });
  } catch (error) {
    console.error("Get cart error:", error);
    return NextResponse.json({ error: "Failed to fetch cart" }, { status: 500 });
  }
}
// POST /api/cart - Add item to cart
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { productId, quantity = 1 } = await request.json();

    if (!productId) {
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
    }

    if (quantity < 1 || quantity > 99) {
      return NextResponse.json({ error: "Invalid quantity" }, { status: 400 });
    }

    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: { id: true, name: true, status: true, stock: true },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    if (product.status !== "ACTIVE") {
      return NextResponse.json({ error: "Product not available" }, { status: 400 });
    }

    if (product.stock < quantity) {
      return NextResponse.json({ error: `Only ${product.stock} items available in stock` }, { status: 400 });
    }

    const existingCartItem = await prisma.cartItem.findUnique({
      where: { userId_productId: { userId: session.user.id, productId } },
    });

    let cartItem;

    if (existingCartItem) {
      const newQuantity = existingCartItem.quantity + quantity;
      if (newQuantity > product.stock) {
        return NextResponse.json({ error: `Cannot add more. Only ${product.stock} items available` }, { status: 400 });
      }
      cartItem = await prisma.cartItem.update({
        where: { id: existingCartItem.id },
        data: { quantity: newQuantity },
      });
    } else {
      cartItem = await prisma.cartItem.create({
        data: { userId: session.user.id, productId, quantity },
      });
    }

    return NextResponse.json({
      success: true,
      message: existingCartItem ? "Cart updated successfully" : "Item added to cart",
      cartItem: { id: cartItem.id, productId: cartItem.productId, quantity: cartItem.quantity },
    }, { status: 201 });
  } catch (error) {
    console.error("Add to cart error:", error);

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      // P2002 - Unique constraint violation (rare, since we handle upsert manually)
      if (error.code === "P2002") {
        return NextResponse.json(
          { error: "Item already in cart", code: "P2002" },
          { status: 409 }
        );
      }
      // P2003 - Foreign key constraint violation
      if (error.code === "P2003") {
        return NextResponse.json(
          { error: "Invalid product reference", code: "P2003" },
          { status: 400 }
        );
      }
      // P2023 - Invalid ObjectId format
      if (error.code === "P2023") {
        return NextResponse.json(
          { error: "Invalid product ID format", code: "P2023" },
          { status: 400 }
        );
      }
    }

    return NextResponse.json({ error: "Failed to add item to cart" }, { status: 500 });
  }
}

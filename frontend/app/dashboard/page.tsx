import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { DashboardLayout } from "@/components/dashboard";
import type { Product, Category, Pagination } from "@/lib/products";
import prisma from "@/prisma/connection";

interface ProductsResponse {
  products: Product[];
  pagination: Pagination;
}

interface CategoriesResponse {
  categories: Category[];
}

async function getProducts(
  searchParams: Record<string, string>
): Promise<ProductsResponse> {
  const params = new URLSearchParams({
    page: "1",
    limit: "12",
    ...searchParams,
  });

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const res = await fetch(`${baseUrl}/api/products?${params}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    return {
      products: [],
      pagination: { page: 1, limit: 12, total: 0, totalPages: 0 },
    };
  }

  return res.json();
}

async function getCategories(): Promise<CategoriesResponse> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const res = await fetch(`${baseUrl}/api/categories?withCount=true`, {
    next: { revalidate: 3600 },
  });

  if (!res.ok) {
    return { categories: [] };
  }

  return res.json();
}

async function getCartCount(userId: string): Promise<number> {
  try {
    const cartItems = await prisma.cartItem.findMany({
      where: { userId },
      select: { quantity: true },
    });

    return cartItems.reduce((sum, item) => sum + item.quantity, 0);
  } catch (error) {
    console.error("Failed to fetch cart count:", error);
    return 0;
  }
}

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>;
}) {
  const session = await getServerSession(authOptions);

  // Fallback redirect if middleware didn't catch it
  if (!session?.user) {
    redirect("/signin?redirect=/dashboard");
  }

  const params = await searchParams;

  const [productsData, categoriesData, cartCount] = await Promise.all([
    getProducts(params),
    getCategories(),
    getCartCount(session.user.id),
  ]);

  return (
    <DashboardLayout
      user={{
        name: session.user.name,
        email: session.user.email,
        image: session.user.image,
      }}
      initialProducts={productsData.products}
      initialCategories={categoriesData.categories}
      initialPagination={productsData.pagination}
      initialCartCount={cartCount}
    />
  );
}

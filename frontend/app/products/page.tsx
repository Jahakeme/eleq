import { ProductsLayout } from "@/components/products";
import Navbar from "@/components/Navbar";
import type { Product, Category, Pagination } from "@/lib/products";

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

  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
  const res = await fetch(`${baseUrl}/api/products?${params}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    return { products: [], pagination: { page: 1, limit: 12, total: 0, totalPages: 0 } };
  }

  return res.json();
}

async function getCategories(): Promise<CategoriesResponse> {
  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
  const res = await fetch(`${baseUrl}/api/categories?withCount=true`, {
    next: { revalidate: 3600 },
  });

  if (!res.ok) {
    return { categories: [] };
  }

  return res.json();
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>;
}) {
  const params = await searchParams;

  const [productsData, categoriesData] = await Promise.all([
    getProducts(params),
    getCategories(),
  ]);

  return (
    <>
      <Navbar />
      <ProductsLayout
        initialProducts={productsData.products}
        initialCategories={categoriesData.categories}
        initialPagination={productsData.pagination}
      />
    </>
  );
}

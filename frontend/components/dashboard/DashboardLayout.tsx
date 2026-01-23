"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { Product, Category, Pagination, ProductFilters } from "@/lib/products";
import { DEFAULT_FILTERS, SORT_OPTIONS } from "@/lib/products";
import { useProducts } from "@/hooks/use-products";
import { CartProvider } from "@/contexts/CartContext";
import { DashboardHeader } from "./DashboardHeader";
import { ProductGrid } from "@/components/products/ProductGrid";
import { ProductSearch } from "@/components/products/ProductSearch";
import { CategoryTabs } from "@/components/products/CategoryTabs";
import { SortDropdown } from "@/components/products/SortDropdown";
import { InfiniteScrollTrigger } from "@/components/products/InfiniteScrollTrigger";
import { QuickViewModal } from "@/components/products/QuickViewModal";

interface DashboardLayoutProps {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
  initialProducts: Product[];
  initialCategories: Category[];
  initialPagination: Pagination;
  initialCartCount: number;
}

function DashboardContent({
  user,
  initialProducts,
  initialCategories,
  initialPagination,
}: Omit<DashboardLayoutProps, "initialCartCount">) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Initialize filters from URL
  const [filters, setFilters] = useState<ProductFilters>(() => ({
    category: searchParams.get("category") || null,
    search: searchParams.get("search") || "",
    sortBy:
      (searchParams.get("sortBy") as "price" | "createdAt") ||
      DEFAULT_FILTERS.sortBy,
    sortOrder:
      (searchParams.get("sortOrder") as "asc" | "desc") ||
      DEFAULT_FILTERS.sortOrder,
  }));

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const { products, pagination, isLoading, hasMore, fetchProducts } =
    useProducts({
      initialProducts,
      initialPagination,
    });

  // Sync filters to URL (using /dashboard instead of /products)
  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.category) params.set("category", filters.category);
    if (filters.search) params.set("search", filters.search);
    if (filters.sortBy !== DEFAULT_FILTERS.sortBy)
      params.set("sortBy", filters.sortBy);
    if (filters.sortOrder !== DEFAULT_FILTERS.sortOrder)
      params.set("sortOrder", filters.sortOrder);

    const queryString = params.toString();
    router.replace(`/dashboard${queryString ? `?${queryString}` : ""}`, {
      scroll: false,
    });
  }, [filters, router]);

  // Fetch products when filters change
  useEffect(() => {
    fetchProducts(filters, 1, false);
  }, [filters, fetchProducts]);

  const handleCategoryChange = useCallback((categoryId: string | null) => {
    setFilters((prev) => ({ ...prev, category: categoryId }));
  }, []);

  const handleSearchChange = useCallback((search: string) => {
    setFilters((prev) => ({ ...prev, search }));
  }, []);

  const handleSortChange = useCallback(
    (sortBy: "price" | "createdAt", sortOrder: "asc" | "desc") => {
      setFilters((prev) => ({ ...prev, sortBy, sortOrder }));
    },
    []
  );

  const handleLoadMore = useCallback(() => {
    if (!isLoading && hasMore && pagination) {
      fetchProducts(filters, pagination.page + 1, true);
    }
  }, [isLoading, hasMore, pagination, filters, fetchProducts]);

  const handleQuickView = useCallback((product: Product) => {
    setSelectedProduct(product);
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedProduct(null);
  }, []);

  // Find current sort option
  const currentSort =
    SORT_OPTIONS.find(
      (opt) => opt.sortBy === filters.sortBy && opt.sortOrder === filters.sortOrder
    ) || SORT_OPTIONS[0];

  return (
    <div className="min-h-screen">
      {/* Header */}
      <DashboardHeader user={user} />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8 lg:pt-12">

        {/* Search */}
        <div className="mb-8 lg:mb-12">
          <ProductSearch value={filters.search} onChange={handleSearchChange} />
        </div>

        {/* Filters Row */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10 lg:mb-14">
          <CategoryTabs
            categories={initialCategories}
            activeCategory={filters.category}
            onCategoryChange={handleCategoryChange}
          />
          <SortDropdown value={currentSort} onChange={handleSortChange} />
        </div>

        {/* Products Grid */}
        <ProductGrid
          products={products}
          isLoading={isLoading && products.length === 0}
          onQuickView={handleQuickView}
        />

        {/* Infinite Scroll Trigger */}
        <InfiniteScrollTrigger
          onIntersect={handleLoadMore}
          hasMore={hasMore}
          isLoading={isLoading}
        />

        {/* Bottom spacing */}
        <div className="h-20" />
      </div>

      {/* Quick View Modal */}
      <QuickViewModal product={selectedProduct} onClose={handleCloseModal} />
    </div>
  );
}

export function DashboardLayout({
  user,
  initialProducts,
  initialCategories,
  initialPagination,
  initialCartCount,
}: DashboardLayoutProps) {
  return (
    <CartProvider initialCount={initialCartCount}>
      <DashboardContent
        user={user}
        initialProducts={initialProducts}
        initialCategories={initialCategories}
        initialPagination={initialPagination}
      />
    </CartProvider>
  );
}

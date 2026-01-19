"use client";

import { useState, useCallback } from "react";
import type { Product, Pagination, ProductFilters } from "@/lib/products";

interface UseProductsOptions {
  initialProducts?: Product[];
  initialPagination?: Pagination;
}

export function useProducts(options: UseProductsOptions = {}) {
  const [products, setProducts] = useState<Product[]>(
    options.initialProducts || []
  );
  const [pagination, setPagination] = useState<Pagination | null>(
    options.initialPagination || null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(
    async (filters: ProductFilters, page: number = 1, append: boolean = false) => {
      try {
        setIsLoading(true);
        setError(null);

        const params = new URLSearchParams({
          page: page.toString(),
          limit: "12",
          sortBy: filters.sortBy,
          sortOrder: filters.sortOrder,
        });

        if (filters.category) params.set("category", filters.category);
        if (filters.search) params.set("search", filters.search);

        const res = await fetch(`/api/products?${params}`);
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Failed to fetch products");
        }

        setProducts((prev) => {
          if (!append) return data.products;
          const existingIds = new Set(prev.map((p) => p.id));
          const newProducts = data.products.filter(
            (p: Product) => !existingIds.has(p.id)
          );
          return [...prev, ...newProducts];
        });
        setPagination(data.pagination);
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to fetch products";
        setError(message);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const hasMore = pagination ? pagination.page < pagination.totalPages : false;

  return {
    products,
    pagination,
    isLoading,
    error,
    hasMore,
    fetchProducts,
  };
}

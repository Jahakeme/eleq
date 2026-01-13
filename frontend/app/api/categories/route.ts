import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@/lib/generated/prisma";
import prisma from "@/prisma/connection";

// Prisma Error Codes Reference:
// P2002 - Unique constraint violation
// P2025 - Record not found (for update/delete operations)
// P2003 - Foreign key constraint violation
// P2014 - Required relation violation

interface CategoryWithChildren {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  parentId: string | null;
  productCount?: number;
  children: CategoryWithChildren[];
}

interface FlatCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  parentId: string | null;
  productCount: number;
}

// Build category tree from flat list
function buildCategoryTree(
  categories: Array<{ id: string; name: string; slug: string; description: string | null; parentId: string | null }>,
  parentId: string | null = null
): CategoryWithChildren[] {
  return categories
    .filter((cat) => cat.parentId === parentId)
    .map((cat) => ({
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      description: cat.description,
      parentId: cat.parentId,
      children: buildCategoryTree(categories, cat.id),
    }));
}

// GET /api/categories - List all categories
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tree = searchParams.get("tree") === "true";
    const withCount = searchParams.get("withCount") !== "false";

    const categories = await prisma.category.findMany({
      include: {
        _count: withCount ? { select: { products: true } } : undefined,
      },
      orderBy: { name: "asc" },
    });

    if (tree) {
      // Return hierarchical structure
      const categoryTree = buildCategoryTree(
        categories.map((cat) => ({
          id: cat.id,
          name: cat.name,
          slug: cat.slug,
          description: cat.description,
          parentId: cat.parentId,
        }))
      );
      return NextResponse.json({ categories: categoryTree });
    }

    // Return flat list with product counts
    const flatCategories: FlatCategory[] = categories.map((cat) => ({
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      description: cat.description,
      parentId: cat.parentId,
      productCount: cat._count?.products ?? 0,
    }));

    return NextResponse.json({ categories: flatCategories });
  } catch (error) {
    console.error("Get categories error:", error);
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 });
  }
}

// POST /api/categories - Create a new category
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, slug, description, parentId } = body;

    // Validate required fields
    if (!name || !slug) {
      return NextResponse.json(
        { error: "Name and slug are required" },
        { status: 400 }
      );
    }

    // Validate parent category exists if provided
    if (parentId) {
      const parentExists = await prisma.category.findUnique({
        where: { id: parentId },
      });
      if (!parentExists) {
        return NextResponse.json(
          { error: "Parent category not found" },
          { status: 404 }
        );
      }
    }

    const category = await prisma.category.create({
      data: {
        name,
        slug,
        description,
        parentId,
      },
    });

    return NextResponse.json({ category }, { status: 201 });
  } catch (error) {
    console.error("Create category error:", error);

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      // P2002 - Unique constraint violation
      if (error.code === "P2002") {
        const target = (error.meta?.target as string[]) || [];
        if (target.includes("name")) {
          return NextResponse.json(
            { error: "Category name already exists", code: "P2002" },
            { status: 409 }
          );
        }
        if (target.includes("slug")) {
          return NextResponse.json(
            { error: "Category slug already exists", code: "P2002" },
            { status: 409 }
          );
        }
      }
    }

    return NextResponse.json({ error: "Failed to create category" }, { status: 500 });
  }
}

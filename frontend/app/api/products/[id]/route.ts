import { NextRequest, NextResponse } from 'next/server';
import  prisma from '@/prisma/connection';
import { UpdateProductSchema } from '@/schemas/product.schema';

const isValidObjectId = (id: string) => /^[a-f\d]{24}$/i.test(id);
  
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;

    if (!isValidObjectId(id)) {
      return NextResponse.json({ message: 'Invalid product ID' }, { status: 400 });
    }

    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        reviews: true
      }
    });

    if (!product) {
      return NextResponse.json({ message: 'Product not found' }, { status: 404 });
    }

    // Compute reviews summary
    const reviewCount = product.reviews.length;
    const averageRating =
      reviewCount === 0
        ? 0
        : product.reviews.reduce((sum, r) => sum + r.rating, 0) / reviewCount;

    // Optional: distribution
    const distribution: Record<string, number> = { '1': 0, '2': 0, '3': 0, '4': 0, '5': 0 };
    for (const r of product.reviews) {
      const rating = r.rating.toString();
      if (distribution[rating] !== undefined) distribution[rating] += 1;
    }

    return NextResponse.json({
      product: {
        ...product,
        reviews: {
          average: Number(averageRating.toFixed(1)),
          count: reviewCount,
          distribution
        }
      }
    });
  } catch (err: any) {
    console.error('GET /api/products/[id] error:', err);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}


export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();

    const parsed = UpdateProductSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { errors: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const product = await prisma.product.update({
      where: { id: params.id },
      data: parsed.data,
    })

    return NextResponse.json(product);

  } catch (error: any) {
    console.error('PUT /api/products/[id] error:', error);
    return NextResponse.json({ message: 'Failed to update product' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await prisma.product.update({
      where: { id: params.id },
      data: { status: 'DISCONTINUED' },
    });

    return NextResponse.json({ message: 'Product discontinued', success: true});
  } catch (error: any) {
    console.error('DELETE /api/products/[id] error:', error);
    return NextResponse.json({ message: 'Failed to delete product' }, { status: 500 });
  }
}
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/prisma/connection';

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const { stock } = await req.json();

    if (!Number.isInteger(stock) || stock < 0) {
      return NextResponse.json(
        { message: 'Invalid stock value' },
        { status: 400 }
      );
    }

    const product = await prisma.product.update({
      where: { id },
      data: {
        stock,
        status: stock === 0 ? 'OUT_OF_STOCK' : 'ACTIVE',
      },
    });

    return NextResponse.json({ product });
  } catch (error) {
    console.error('PATCH stock error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

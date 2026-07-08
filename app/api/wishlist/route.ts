import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma/client';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, productId } = body;

    const wishlist = await prisma.wishlist.create({
      data: { userId, productId },
    });

    return NextResponse.json({ success: true, data: wishlist });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to add to wishlist' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ success: false, error: 'User ID required' }, { status: 400 });
  }

  const wishlist = await prisma.wishlist.findMany({
    where: { userId },
    include: { product: { include: { vendor: true } } },
  });

  return NextResponse.json({ success: true, data: wishlist });
}

export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'ID required' }, { status: 400 });
    }

    await prisma.wishlist.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to remove from wishlist' }, { status: 500 });
  }
}

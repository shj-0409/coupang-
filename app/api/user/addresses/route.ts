import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma/client';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, name, phone, address, city, zipCode, isDefault } = body;

    const newAddress = await prisma.address.create({
      data: { userId, name, phone, address, city, zipCode, isDefault },
    });

    return NextResponse.json({ success: true, data: newAddress });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to add address' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ success: false, error: 'User ID required' }, { status: 400 });
  }

  const addresses = await prisma.address.findMany({
    where: { userId },
  });

  return NextResponse.json({ success: true, data: addresses });
}

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma/client';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ success: false, error: 'User ID required' }, { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { addresses: true },
  });

  return NextResponse.json({ success: true, data: user });
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, name, email } = body;

    const user = await prisma.user.update({
      where: { id: userId },
      data: { name, email },
    });

    return NextResponse.json({ success: true, data: user });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to update profile' }, { status: 500 });
  }
}

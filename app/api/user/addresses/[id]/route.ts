import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma/client';

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    const { name, phone, address, city, zipCode, isDefault } = body;

    const updatedAddress = await prisma.address.update({
      where: { id: params.id },
      data: { name, phone, address, city, zipCode, isDefault },
    });

    return NextResponse.json({ success: true, data: updatedAddress });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to update address' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await prisma.address.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to delete address' }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma/client";

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const body = await request.json();
    const { status } = body;

    const vendor = await prisma.vendor.update({
      where: { id: params.id },
      data: { status },
      include: { user: true },
    });

    return NextResponse.json({ success: true, data: vendor });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to update vendor status" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    await prisma.vendor.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to delete vendor" },
      { status: 500 },
    );
  }
}

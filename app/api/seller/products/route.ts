import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma/client";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { vendorId, name, description, price, stock, category, images } =
      body;

    const product = await prisma.product.create({
      data: {
        vendorId,
        name,
        description,
        price: parseFloat(price),
        stock: parseInt(stock),
        category,
        images: images || [],
      },
    });

    return NextResponse.json({ success: true, data: product });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to create product" },
      { status: 500 },
    );
  }
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const vendorId = searchParams.get("vendorId");

  if (!vendorId) {
    return NextResponse.json(
      { success: false, error: "Vendor ID required" },
      { status: 400 },
    );
  }

  const products = await prisma.product.findMany({
    where: { vendorId },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ success: true, data: products });
}

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma/client";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, vendorId } = body;

    // 기존 채팅방 확인
    let chat = await prisma.chat.findFirst({
      where: {
        userId,
        vendorId,
      },
    });

    // 채팅방이 없으면 생성
    if (!chat) {
      chat = await prisma.chat.create({
        data: {
          userId,
          vendorId,
        },
      });
    }

    return NextResponse.json({ success: true, data: chat });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to create chat" },
      { status: 500 },
    );
  }
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const userId = searchParams.get("userId");
  const vendorId = searchParams.get("vendorId");

  if (userId) {
    const chats = await prisma.chat.findMany({
      where: { userId },
      include: {
        vendor: { include: { user: true } },
        messages: { orderBy: { createdAt: "desc" }, take: 1 },
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ success: true, data: chats });
  }

  if (vendorId) {
    const chats = await prisma.chat.findMany({
      where: { vendorId },
      include: {
        user: true,
        messages: { orderBy: { createdAt: "desc" }, take: 1 },
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ success: true, data: chats });
  }

  return NextResponse.json(
    { success: false, error: "User ID or Vendor ID required" },
    { status: 400 },
  );
}

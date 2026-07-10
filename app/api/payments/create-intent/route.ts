import { NextRequest, NextResponse } from "next/server";
import stripe from "@/lib/stripe/client";
import { prisma } from "@/lib/prisma/client";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderId, amount } = body;

    // 기존 PaymentIntent 확인
    const existingPayment = await prisma.payment.findUnique({
      where: { orderId },
    });

    if (existingPayment && existingPayment.stripePaymentIntentId) {
      return NextResponse.json({
        success: true,
        clientSecret: existingPayment.stripePaymentIntentId,
      });
    }

    // 새 PaymentIntent 생성
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // 센트 단위
      currency: "krw",
      metadata: { orderId },
    });

    // Payment 정보 저장
    await prisma.payment.create({
      data: {
        orderId,
        stripePaymentIntentId: paymentIntent.id,
        amount,
        status: "PENDING",
      },
    });

    return NextResponse.json({
      success: true,
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error("PaymentIntent creation error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create payment intent" },
      { status: 500 },
    );
  }
}

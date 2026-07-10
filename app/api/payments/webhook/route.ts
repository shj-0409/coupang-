import { NextRequest, NextResponse } from "next/server";
import stripe from "@/lib/stripe/client";
import { prisma } from "@/lib/prisma/client";
import crypto from "crypto";

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature")!;

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object as any;
        await handlePaymentSucceeded(paymentIntent);
        break;
      }
      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object as any;
        await handlePaymentFailed(paymentIntent);
        break;
      }
      case "charge.refunded": {
        const charge = event.data.object as any;
        await handleChargeRefunded(charge);
        break;
      }
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook handler error:", error);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 },
    );
  }
}

async function handlePaymentSucceeded(paymentIntent: any) {
  const orderId = paymentIntent.metadata.orderId;

  // Payment 상태 업데이트
  await prisma.payment.update({
    where: { stripePaymentIntentId: paymentIntent.id },
    data: { status: "COMPLETED" },
  });

  // Order 상태 업데이트
  const order = await prisma.order.update({
    where: { id: orderId },
    data: { status: "PROCESSING" },
    include: { items: { include: { product: true } }, vendor: true },
  });

  // 벤더 수익 분배
  await distributeRevenue(order);
}

async function handlePaymentFailed(paymentIntent: any) {
  const orderId = paymentIntent.metadata.orderId;

  await prisma.payment.update({
    where: { stripePaymentIntentId: paymentIntent.id },
    data: { status: "FAILED" },
  });

  await prisma.order.update({
    where: { id: orderId },
    data: { status: "CANCELLED" },
  });
}

async function handleChargeRefunded(charge: any) {
  const paymentIntentId = charge.payment_intent;

  await prisma.payment.update({
    where: { stripePaymentIntentId: paymentIntentId },
    data: { status: "REFUNDED" },
  });

  const payment = await prisma.payment.findUnique({
    where: { stripePaymentIntentId: paymentIntentId },
  });

  if (payment) {
    await prisma.order.update({
      where: { id: payment.orderId },
      data: { status: "REFUNDED" },
    });
  }
}

async function distributeRevenue(order: any) {
  const commissionRate = order.vendor.commissionRate;
  const totalAmount = order.totalAmount;
  const commission = totalAmount * commissionRate;
  const vendorRevenue = totalAmount - commission;

  // Settlement 생성
  await prisma.settlement.create({
    data: {
      vendorId: order.vendorId,
      amount: vendorRevenue,
      period: new Date().toISOString().slice(0, 7), // YYYY-MM
      status: "PENDING",
    },
  });
}

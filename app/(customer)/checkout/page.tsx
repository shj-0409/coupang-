"use client";

import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
);

export default function CheckoutPage() {
  const [clientSecret, setClientSecret] = useState("");
  const [orderId, setOrderId] = useState("");
  const [amount, setAmount] = useState(0);

  const createPaymentIntent = async () => {
    try {
      const response = await fetch("/api/payments/create-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, amount }),
      });

      const data = await response.json();
      if (data.success) {
        setClientSecret(data.clientSecret);
      }
    } catch (error) {
      console.error("Payment intent creation failed:", error);
    }
  };

  const handlePayment = async () => {
    const stripe = await stripePromise;
    if (!stripe || !clientSecret) return;

    const { error, paymentIntent } = await stripe.confirmCardPayment(
      clientSecret,
      {
        payment_method: {
          card: {
            // Stripe Elements가 필요하지만 간단한 예시를 위해 생략
          },
        },
      },
    );

    if (error) {
      console.error("Payment failed:", error);
    } else if (paymentIntent) {
      console.log("Payment succeeded:", paymentIntent);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">결제</h1>

      <div className="bg-white shadow rounded-lg p-6">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            주문 ID
          </label>
          <input
            type="text"
            className="w-full border rounded-lg px-4 py-2"
            placeholder="주문 ID를 입력하세요"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            결제 금액
          </label>
          <input
            type="number"
            className="w-full border rounded-lg px-4 py-2"
            placeholder="결제 금액을 입력하세요"
            value={amount}
            onChange={(e) => setAmount(parseFloat(e.target.value))}
          />
        </div>

        {!clientSecret ? (
          <button
            onClick={createPaymentIntent}
            className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
          >
            결제 시작
          </button>
        ) : (
          <button
            onClick={handlePayment}
            className="w-full bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700"
          >
            결제 완료
          </button>
        )}
      </div>
    </div>
  );
}

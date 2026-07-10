import Stripe from "stripe";

/**
 * Stripe 클라이언트 인스턴스
 * @description Stripe API를 사용하기 위한 클라이언트 설정
 */
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
});

export default stripe;

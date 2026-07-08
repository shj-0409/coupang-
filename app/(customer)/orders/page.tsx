import { prisma } from '@/lib/prisma/client';

export default async function OrdersPage() {
  // TODO: 인증된 사용자 ID 가져오기
  const userId = 'user-id-placeholder';

  const orders = await prisma.order.findMany({
    where: { userId },
    include: { items: { include: { product: true } }, vendor: true },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">주문 내역</h1>
      <div className="space-y-4">
        {orders.map((order: any) => (
          <div key={order.id} className="bg-white shadow rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <div>
                <p className="font-semibold">주문 번호: {order.id}</p>
                <p className="text-gray-600">{new Date(order.createdAt).toLocaleDateString('ko-KR')}</p>
              </div>
              <div className="text-right">
                <p className="text-xl font-bold">₩{order.totalAmount.toLocaleString()}</p>
                <p className="text-sm text-gray-600">상태: {order.status}</p>
              </div>
            </div>
            <div className="border-t pt-4">
              {order.items.map((item: any) => (
                <div key={item.id} className="flex justify-between items-center mb-2">
                  <span>{item.product.name} x {item.quantity}</span>
                  <span>₩{(item.price * item.quantity).toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

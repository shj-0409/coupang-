import { prisma } from "@/lib/prisma/client";

export default async function SellerOrdersPage() {
  // TODO: 인증된 벤더 ID 가져오기
  const vendorId = "vendor-id-placeholder";

  const orders = await prisma.order.findMany({
    where: { vendorId },
    include: { items: { include: { product: true } }, user: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">주문 관리</h1>
      <div className="space-y-4">
        {orders.map((order: any) => (
          <div key={order.id} className="bg-white shadow rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <div>
                <p className="font-semibold">주문 #{order.id}</p>
                <p className="text-gray-600">
                  {new Date(order.createdAt).toLocaleDateString("ko-KR")}
                </p>
                <p className="text-gray-600">고객: {order.user.email}</p>
              </div>
              <div className="text-right">
                <p className="text-xl font-bold">
                  ₩{order.totalAmount.toLocaleString()}
                </p>
                <select className="mt-2 border rounded px-2 py-1">
                  <option value="PENDING" selected={order.status === "PENDING"}>
                    대기 중
                  </option>
                  <option
                    value="PROCESSING"
                    selected={order.status === "PROCESSING"}
                  >
                    처리 중
                  </option>
                  <option value="SHIPPED" selected={order.status === "SHIPPED"}>
                    배송 중
                  </option>
                  <option
                    value="DELIVERED"
                    selected={order.status === "DELIVERED"}
                  >
                    배송 완료
                  </option>
                </select>
              </div>
            </div>
            <div className="border-t pt-4">
              {order.items.map((item: any) => (
                <div
                  key={item.id}
                  className="flex justify-between items-center mb-2"
                >
                  <span>
                    {item.product.name} x {item.quantity}
                  </span>
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

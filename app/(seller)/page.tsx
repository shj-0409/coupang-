import { prisma } from "@/lib/prisma/client";

export default async function SellerDashboard() {
  // TODO: 인증된 벤더 ID 가져오기
  const vendorId = "vendor-id-placeholder";

  const [vendor, products, orders, settlements] = await Promise.all([
    prisma.vendor.findUnique({
      where: { id: vendorId },
      include: { user: true },
    }),
    prisma.product.findMany({
      where: { vendorId },
      orderBy: { createdAt: "desc" },
    }),
    prisma.order.findMany({
      where: { vendorId },
      include: { items: { include: { product: true } }, user: true },
      orderBy: { createdAt: "desc" },
      take: 10,
    }),
    prisma.settlement.findMany({
      where: { vendorId },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
  ]);

  if (!vendor) {
    return <div>벤더를 찾을 수 없습니다.</div>;
  }

  const totalRevenue = orders.reduce(
    (sum: number, order: any) => sum + order.totalAmount,
    0,
  );
  const totalProducts = products.length;
  const totalOrders = orders.length;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">판매자 대시보드</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-gray-600 text-sm">총 매출</h2>
          <p className="text-2xl font-bold">₩{totalRevenue.toLocaleString()}</p>
        </div>
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-gray-600 text-sm">상품 수</h2>
          <p className="text-2xl font-bold">{totalProducts}</p>
        </div>
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-gray-600 text-sm">주문 수</h2>
          <p className="text-2xl font-bold">{totalOrders}</p>
        </div>
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-gray-600 text-sm">수수료율</h2>
          <p className="text-2xl font-bold">
            {(vendor.commissionRate * 100).toFixed(0)}%
          </p>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-6 mb-8">
        <h2 className="text-xl font-bold mb-4">최근 주문</h2>
        {orders.length === 0 ? (
          <p className="text-gray-600">주문이 없습니다.</p>
        ) : (
          <div className="space-y-4">
            {orders.map((order: any) => (
              <div key={order.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <p className="font-semibold">주문 #{order.id}</p>
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      order.status === "DELIVERED"
                        ? "bg-green-100 text-green-800"
                        : order.status === "PROCESSING"
                          ? "bg-blue-100 text-blue-800"
                          : order.status === "SHIPPED"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {order.status}
                  </span>
                </div>
                <p className="text-gray-600">고객: {order.user.email}</p>
                <p className="text-gray-600">
                  금액: ₩{order.totalAmount.toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-bold mb-4">정산 내역</h2>
        {settlements.length === 0 ? (
          <p className="text-gray-600">정산 내역이 없습니다.</p>
        ) : (
          <div className="space-y-4">
            {settlements.map((settlement: any) => (
              <div
                key={settlement.id}
                className="border rounded-lg p-4 flex justify-between items-center"
              >
                <div>
                  <p className="font-semibold">
                    ₩{settlement.amount.toLocaleString()}
                  </p>
                  <p className="text-gray-600">기간: {settlement.period}</p>
                </div>
                <span
                  className={`px-2 py-1 rounded-full text-xs ${
                    settlement.status === "COMPLETED"
                      ? "bg-green-100 text-green-800"
                      : settlement.status === "PENDING"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                  }`}
                >
                  {settlement.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

import { prisma } from "@/lib/prisma/client";

export default async function AnalyticsPage() {
  const [totalRevenue, monthlyRevenue, vendorStats, productStats] =
    await Promise.all([
      prisma.order.aggregate({
        where: { status: "DELIVERED" },
        _sum: { totalAmount: true },
      }),
      prisma.order.aggregate({
        where: {
          status: "DELIVERED",
          createdAt: {
            gte: new Date(new Date().setMonth(new Date().getMonth() - 1)),
          },
        },
        _sum: { totalAmount: true },
      }),
      prisma.vendor.findMany({
        include: {
          _count: { select: { products: true, orders: true } },
        },
      }),
      prisma.product.findMany({
        include: {
          _count: { select: { orderItems: true } },
        },
      }),
    ]);

  const topVendors = vendorStats
    .sort((a: any, b: any) => b._count.orders - a._count.orders)
    .slice(0, 5);

  const topProducts = productStats
    .sort((a: any, b: any) => b._count.orderItems - a._count.orderItems)
    .slice(0, 5);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">통계 및 분석</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-bold mb-4">총 매출</h2>
          <p className="text-3xl font-bold">
            ₩{(totalRevenue._sum.totalAmount || 0).toLocaleString()}
          </p>
        </div>
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-bold mb-4">이번 달 매출</h2>
          <p className="text-3xl font-bold">
            ₩{(monthlyRevenue._sum.totalAmount || 0).toLocaleString()}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-bold mb-4">상위 벤더 (주문 수 기준)</h2>
          <div className="space-y-3">
            {topVendors.map((vendor: any) => (
              <div
                key={vendor.id}
                className="flex justify-between items-center border-b pb-2"
              >
                <span>{vendor.businessName}</span>
                <span className="font-semibold">
                  {vendor._count.orders} 주문
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-bold mb-4">상위 상품 (판매량 기준)</h2>
          <div className="space-y-3">
            {topProducts.map((product: any) => (
              <div
                key={product.id}
                className="flex justify-between items-center border-b pb-2"
              >
                <span>{product.name}</span>
                <span className="font-semibold">
                  {product._count.orderItems} 판매
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

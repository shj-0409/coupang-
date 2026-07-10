import { prisma } from "@/lib/prisma/client";

export default async function AdminDashboard() {
  const [totalRevenue, totalVendors, totalUsers, totalOrders] =
    await Promise.all([
      prisma.order.aggregate({
        where: { status: "DELIVERED" },
        _sum: { totalAmount: true },
      }),
      prisma.vendor.count(),
      prisma.user.count(),
      prisma.order.count(),
    ]);

  const pendingVendors = await prisma.vendor.findMany({
    where: { status: "PENDING" },
    include: { user: true },
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">관리자 대시보드</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-gray-600 text-sm">총 매출</h2>
          <p className="text-2xl font-bold">
            ₩{(totalRevenue._sum.totalAmount || 0).toLocaleString()}
          </p>
        </div>
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-gray-600 text-sm">벤더 수</h2>
          <p className="text-2xl font-bold">{totalVendors}</p>
        </div>
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-gray-600 text-sm">사용자 수</h2>
          <p className="text-2xl font-bold">{totalUsers}</p>
        </div>
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-gray-600 text-sm">주문 수</h2>
          <p className="text-2xl font-bold">{totalOrders}</p>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-6 mb-8">
        <h2 className="text-xl font-bold mb-4">승인 대기 중인 벤더</h2>
        {pendingVendors.length === 0 ? (
          <p className="text-gray-600">승인 대기 중인 벤더가 없습니다.</p>
        ) : (
          <div className="space-y-4">
            {pendingVendors.map((vendor: any) => (
              <div
                key={vendor.id}
                className="border rounded-lg p-4 flex justify-between items-center"
              >
                <div>
                  <p className="font-semibold">{vendor.businessName}</p>
                  <p className="text-gray-600">{vendor.user.email}</p>
                  <p className="text-gray-600">
                    {vendor.description || "설명 없음"}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                    승인
                  </button>
                  <button className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
                    거절
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

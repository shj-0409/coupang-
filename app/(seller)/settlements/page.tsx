import { prisma } from "@/lib/prisma/client";

export default async function SellerSettlementsPage() {
  // TODO: 인증된 벤더 ID 가져오기
  const vendorId = "vendor-id-placeholder";

  const settlements = await prisma.settlement.findMany({
    where: { vendorId },
    orderBy: { createdAt: "desc" },
  });

  const vendor = await prisma.vendor.findUnique({
    where: { id: vendorId },
  });

  const totalSettled = settlements
    .filter((s: any) => s.status === "COMPLETED")
    .reduce((sum: number, s: any) => sum + s.amount, 0);

  const pendingAmount = settlements
    .filter((s: any) => s.status === "PENDING")
    .reduce((sum: number, s: any) => sum + s.amount, 0);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">정산 관리</h1>
        <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
          출금 요청
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-gray-600 text-sm">총 정산 금액</h2>
          <p className="text-2xl font-bold">₩{totalSettled.toLocaleString()}</p>
        </div>
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-gray-600 text-sm">대기 중인 금액</h2>
          <p className="text-2xl font-bold">
            ₩{pendingAmount.toLocaleString()}
          </p>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                기간
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                금액
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                수수료
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                순수익
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                상태
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {settlements.map((settlement: any) => {
              const commission =
                settlement.amount * (vendor?.commissionRate || 0.1);
              const netAmount = settlement.amount - commission;

              return (
                <tr key={settlement.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {settlement.period}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    ₩{settlement.amount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    ₩{commission.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap font-semibold">
                    ₩{netAmount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
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
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

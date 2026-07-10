import { prisma } from "@/lib/prisma/client";

export default async function VendorsPage() {
  const vendors = await prisma.vendor.findMany({
    include: { user: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">벤더 관리</h1>
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                비즈니스명
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                이메일
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                상태
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                수수료율
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                작업
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {vendors.map((vendor: any) => (
              <tr key={vendor.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  {vendor.businessName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {vendor.user.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      vendor.status === "APPROVED"
                        ? "bg-green-100 text-green-800"
                        : vendor.status === "PENDING"
                          ? "bg-yellow-100 text-yellow-800"
                          : vendor.status === "REJECTED"
                            ? "bg-red-100 text-red-800"
                            : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {vendor.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {(vendor.commissionRate * 100).toFixed(0)}%
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button className="text-blue-600 hover:text-blue-800 mr-2">
                    상세
                  </button>
                  <button className="text-red-600 hover:text-red-800">
                    삭제
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

import { prisma } from '@/lib/prisma/client';

export default async function ProductsPage() {
  const products = await prisma.product.findMany({
    where: { status: 'ACTIVE' },
    include: { vendor: true },
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">상품 목록</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product: any) => (
          <div key={product.id} className="border rounded-lg p-4">
            <h2 className="text-lg font-semibold">{product.name}</h2>
            <p className="text-gray-600">{product.description}</p>
            <p className="text-xl font-bold mt-2">₩{product.price.toLocaleString()}</p>
            <p className="text-sm text-gray-500">판매자: {product.vendor.businessName}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

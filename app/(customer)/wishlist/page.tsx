import { prisma } from '@/lib/prisma/client';

export default async function WishlistPage() {
  const wishlist = await prisma.wishlist.findMany({
    include: { product: { include: { vendor: true } } },
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">찜한 상품</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {wishlist.map((item: any) => (
          <div key={item.id} className="border rounded-lg p-4">
            <h2 className="text-lg font-semibold">{item.product.name}</h2>
            <p className="text-gray-600">{item.product.description}</p>
            <p className="text-xl font-bold mt-2">₩{item.product.price.toLocaleString()}</p>
            <p className="text-sm text-gray-500">판매자: {item.product.vendor.businessName}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

import { prisma } from "@/lib/prisma/client";
import { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const product = await prisma.product.findUnique({
    where: { id: params.slug },
    include: { vendor: true },
  });

  if (!product) {
    return {
      title: "상품을 찾을 수 없습니다",
    };
  }

  return {
    title: `${product.name} - 멀티벤더 쇼핑몰`,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: product.images.length > 0 ? [product.images[0]] : [],
    },
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const product = await prisma.product.findUnique({
    where: { id: params.slug },
    include: { vendor: true },
  });

  if (!product) {
    return <div>상품을 찾을 수 없습니다.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
      <p className="text-gray-600 mb-4">{product.description}</p>
      <p className="text-2xl font-bold mb-4">
        ₩{product.price.toLocaleString()}
      </p>
      <p className="text-sm text-gray-500 mb-4">
        판매자: {product.vendor.businessName}
      </p>
      <p className="text-sm text-gray-500 mb-4">카테고리: {product.category}</p>
      <p className="text-sm text-gray-500 mb-4">재고: {product.stock}개</p>

      {/* JSON-LD 구조화된 데이터 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org/",
            "@type": "Product",
            name: product.name,
            description: product.description,
            price: product.price,
            priceCurrency: "KRW",
            seller: {
              "@type": "Organization",
              name: product.vendor.businessName,
            },
          }),
        }}
      />
    </div>
  );
}

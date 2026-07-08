import { prisma } from '@/lib/prisma/client';

export default async function OrderDetailPage({ params }: { params: { id: string } }) {
  const order = await prisma.order.findUnique({
    where: { id: params.id },
    include: { 
      items: { include: { product: true } }, 
      vendor: true,
      payment: true,
      address: true,
    },
  });

  if (!order) {
    return <div>주문을 찾을 수 없습니다.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">주문 상세</h1>
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-gray-600">주문 번호</p>
            <p className="font-semibold">{order.id}</p>
          </div>
          <div>
            <p className="text-gray-600">주문 날짜</p>
            <p className="font-semibold">{new Date(order.createdAt).toLocaleDateString('ko-KR')}</p>
          </div>
          <div>
            <p className="text-gray-600">주문 상태</p>
            <p className="font-semibold">{order.status}</p>
          </div>
          <div>
            <p className="text-gray-600">결제 상태</p>
            <p className="font-semibold">{order.payment?.status || '결제 정보 없음'}</p>
          </div>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <h2 className="text-xl font-bold mb-4">배송지 정보</h2>
        <p className="font-semibold">{order.address.name}</p>
        <p className="text-gray-600">{order.address.phone}</p>
        <p className="text-gray-600">{order.address.address}</p>
        <p className="text-gray-600">{order.address.city}, {order.address.zipCode}</p>
      </div>

      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <h2 className="text-xl font-bold mb-4">주문 상품</h2>
        <div className="space-y-4">
          {order.items.map((item: any) => (
            <div key={item.id} className="flex justify-between items-center border-b pb-4">
              <div>
                <p className="font-semibold">{item.product.name}</p>
                <p className="text-gray-600">판매자: {order.vendor.businessName}</p>
                <p className="text-gray-600">수량: {item.quantity}</p>
              </div>
              <p className="font-semibold">₩{(item.price * item.quantity).toLocaleString()}</p>
            </div>
          ))}
        </div>
        <div className="border-t mt-4 pt-4 flex justify-between">
          <span className="text-xl font-bold">총 금액</span>
          <span className="text-xl font-bold">₩{order.totalAmount.toLocaleString()}</span>
        </div>
      </div>

      <div className="flex gap-4">
        <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
          영수증 다운로드
        </button>
        {order.status === 'PENDING' && (
          <button className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700">
            주문 취소
          </button>
        )}
      </div>
    </div>
  );
}

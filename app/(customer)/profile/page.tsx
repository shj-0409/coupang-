import { prisma } from '@/lib/prisma/client';

export default async function ProfilePage() {
  // TODO: 인증된 사용자 ID 가져오기
  const userId = 'user-id-placeholder';

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { addresses: true },
  });

  if (!user) {
    return <div>사용자를 찾을 수 없습니다.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">프로필</h1>
      <div className="bg-white shadow rounded-lg p-6">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">이름</label>
          <p className="text-lg">{user.name || '설정되지 않음'}</p>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">이메일</label>
          <p className="text-lg">{user.email}</p>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">역할</label>
          <p className="text-lg">{user.role}</p>
        </div>
      </div>

      <h2 className="text-2xl font-bold mt-8 mb-4">배송지</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {user.addresses.map((address: any) => (
          <div key={address.id} className="bg-white shadow rounded-lg p-6">
            <h3 className="font-semibold">{address.name}</h3>
            <p className="text-gray-600">{address.phone}</p>
            <p className="text-gray-600">{address.address}</p>
            <p className="text-gray-600">{address.city}, {address.zipCode}</p>
            {address.isDefault && <span className="text-blue-600 text-sm">기본 배송지</span>}
          </div>
        ))}
      </div>
    </div>
  );
}

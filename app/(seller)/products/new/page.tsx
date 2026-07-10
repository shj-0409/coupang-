export default function NewProductPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">상품 등록</h1>
      <form className="bg-white shadow rounded-lg p-6 space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            상품명
          </label>
          <input
            type="text"
            className="w-full border rounded-lg px-4 py-2"
            placeholder="상품명을 입력하세요"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            설명
          </label>
          <textarea
            className="w-full border rounded-lg px-4 py-2"
            rows={4}
            placeholder="상품 설명을 입력하세요"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              가격
            </label>
            <input
              type="number"
              className="w-full border rounded-lg px-4 py-2"
              placeholder="가격을 입력하세요"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              재고
            </label>
            <input
              type="number"
              className="w-full border rounded-lg px-4 py-2"
              placeholder="재고를 입력하세요"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            카테고리
          </label>
          <select className="w-full border rounded-lg px-4 py-2">
            <option value="">카테고리 선택</option>
            <option value="electronics">전자기기</option>
            <option value="clothing">의류</option>
            <option value="food">식품</option>
            <option value="beauty">뷰티</option>
            <option value="home">홈/리빙</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            이미지
          </label>
          <input
            type="file"
            multiple
            className="w-full border rounded-lg px-4 py-2"
          />
        </div>
        <div className="flex gap-4">
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            등록
          </button>
          <button
            type="button"
            className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700"
          >
            취소
          </button>
        </div>
      </form>
    </div>
  );
}

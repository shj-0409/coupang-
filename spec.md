# 멀티벤더 쇼핑몰 시스템 명세서

## 1. Executive Summary

Next.js 기반의 확장 가능한 멀티벤더 이커머스 플랫폼으로, 판매자들이 입점하여 상품을 등록하고 고객들이 구매할 수 있는 시스템입니다. 고객/관리자/판매자 3개의 라우트 그룹으로 모듈식으로 설계되며, 하나의 주문에 여러 벤더의 상품이 포함될 수 있는 정규화된 데이터베이스 구조를 사용합니다.

## 2. System Architecture Overview

### 2.1 기술 스택
- **프레임워크**: Next.js 15 (App Router)
- **데이터베이스**: PostgreSQL (Prisma ORM)
- **결제**: Stripe
- **실시간 통신**: Socket.io
- **스타일링**: Tailwind CSS
- **배포**: Vercel

### 2.2 모듈형 프로젝트 구조
```
app/
├── (customer)/       # 고객 라우트 그룹
├── (admin)/          # 관리자 라우트 그룹
├── (seller)/         # 판매자 라우트 그룹
├── api/              # API 라우트
└── layout.tsx
lib/
├── prisma/           # Prisma 클라이언트
├── stripe/           # Stripe 유틸리티
├── socket/           # Socket.io 설정
└── utils/            # 공통 유틸리티
components/
├── ui/               # 기본 UI 컴포넌트
├── customer/         # 고객 전용 컴포넌트
├── admin/            # 관리자 전용 컴포넌트
└── seller/           # 판매자 전용 컴포넌트
types/                # TypeScript 타입 정의
hooks/                # 커스텀 훅
features/             # 기능별 모듈
server/               # 서버 사이드 로직
```

## 3. 데이터베이스 스키마 설계

### 3.1 정규화된 관계형 구조

```prisma
model User {
  id            String    @id @default(cuid())
  email         String    @unique
  name          String?
  password      String
  role          Role      @default(CUSTOMER)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  
  addresses     Address[]
  orders        Order[]
  wishlist      Wishlist[]
  chats         Chat[]    @relation("UserChats")
  reviews       Review[]
}

model Vendor {
  id            String    @id @default(cuid())
  userId        String    @unique
  user          User      @relation(fields: [userId], references: [id])
  businessName  String
  description   String?
  status        VendorStatus @default(PENDING)
  commissionRate Float     @default(0.1) // 10% 수수료
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  
  products      Product[]
  orders        Order[]
  settlements   Settlement[]
  chats         Chat[]    @relation("VendorChats")
}

model Product {
  id            String    @id @default(cuid())
  vendorId      String
  vendor        Vendor    @relation(fields: [vendorId], references: [id])
  name          String
  description   String
  price         Float
  stock         Int
  category      String
  images        String[]
  status        ProductStatus @default(ACTIVE)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  
  orderItems    OrderItem[]
  wishlist      Wishlist[]
  reviews       Review[]
}

model Order {
  id            String    @id @default(cuid())
  userId        String
  user          User      @relation(fields: [userId], references: [id])
  vendorId      String
  vendor        Vendor    @relation(fields: [vendorId], references: [id])
  status        OrderStatus @default(PENDING)
  totalAmount   Float
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  
  items         OrderItem[]
  payment       Payment?
  address       Address
}

model OrderItem {
  id            String    @id @default(cuid())
  orderId       String
  order         Order     @relation(fields: [orderId], references: [id])
  productId     String
  product       Product   @relation(fields: [productId], references: [id])
  quantity      Int
  price         Float
}

model Payment {
  id            String    @id @default(cuid())
  orderId       String    @unique
  order         Order     @relation(fields: [orderId], references: [id])
  stripePaymentIntentId String?
  amount        Float
  status        PaymentStatus @default(PENDING)
  createdAt     DateTime  @default(now())
}

model Settlement {
  id            String    @id @default(cuid())
  vendorId      String
  vendor        Vendor    @relation(fields: [vendorId], references: [id])
  amount        Float
  period        String
  status        SettlementStatus @default(PENDING)
  createdAt     DateTime  @default(now())
}

model Address {
  id            String    @id @default(cuid())
  userId        String
  user          User      @relation(fields: [userId], references: [id])
  name          String
  phone         String
  address       String
  city          String
  zipCode       String
  isDefault     Boolean   @default(false)
}

model Wishlist {
  id            String    @id @default(cuid())
  userId        String
  user          User      @relation(fields: [userId], references: [id])
  productId     String
  product       Product   @relation(fields: [productId], references: [id])
  createdAt     DateTime  @default(now())
  
  @@unique([userId, productId])
}

model Chat {
  id            String    @id @default(cuid())
  userId        String
  user          User      @relation("UserChats", fields: [userId], references: [id])
  vendorId      String
  vendor        Vendor    @relation("VendorChats", fields: [vendorId], references: [id])
  messages      Message[]
  createdAt     DateTime  @default(now())
}

model Message {
  id            String    @id @default(cuid())
  chatId        String
  chat          Chat      @relation(fields: [chatId], references: [id])
  senderId      String
  content       String
  isRead        Boolean   @default(false)
  createdAt     DateTime  @default(now())
}

model Review {
  id            String    @id @default(cuid())
  userId        String
  user          User      @relation(fields: [userId], references: [id])
  productId     String
  product       Product   @relation(fields: [productId], references: [id])
  rating        Int
  comment       String?
  createdAt     DateTime  @default(now())
}

enum Role {
  CUSTOMER
  VENDOR
  ADMIN
}

enum VendorStatus {
  PENDING
  APPROVED
  REJECTED
  SUSPENDED
}

enum ProductStatus {
  ACTIVE
  INACTIVE
  OUT_OF_STOCK
}

enum OrderStatus {
  PENDING
  PROCESSING
  SHIPPED
  DELIVERED
  CANCELLED
  REFUNDED
}

enum PaymentStatus {
  PENDING
  COMPLETED
  FAILED
  REFUNDED
}

enum SettlementStatus {
  PENDING
  COMPLETED
  FAILED
}
```

## 4. 기능 상세 명세

### 4.1 고객 페이지 (Customer)

#### 4.1.1 사용자 프로필
- 프로필 정보 수정 (이름, 이메일)
- 비밀번호 변경
- 2FA 설정
- 다중 배송지 관리

#### 4.1.2 주문 관리
- 주문 내역 조회
- 주문 상태 추적 (실시간)
- PDF 영수증 다운로드
- 주문 취소/환불 요청

#### 4.1.3 찜하기
- 상품 찜하기/찜 해제
- 찜 목록 조회
- 찜한 상품 알림 (가격 하락, 재고 입고)

#### 4.1.4 맞춤 추천
- 구매 이력 기반 추천
- 찜한 상품 기반 추천
- 인기 상품 추천

### 4.2 판매자 페이지 (Seller)

#### 4.2.1 상품 등록
- 상품 CRUD
- 다중 이미지 업로드
- 상품 카테고리 설정

#### 4.2.2 재고 관리
- 재고 추적
- 저재고 알림
- 재고 자동 업데이트

#### 4.2.3 가격 책정 및 프로모션
- 가격 설정
- 할인 설정
- 쿠폰 생성
- 번개세일 설정
- 번들 할인 설정

#### 4.2.4 판매 성과
- 판매 통계 대시보드
- 주문 관리
- 주문 상태 변경

#### 4.2.5 정산 관리
- 수수료 기반 수익 계산
- 정산 내역 조회
- 출금 요청

### 4.3 관리자 페이지 (Admin)

#### 4.3.1 플랫폼 전체 시각화
- 전체 매출 대시보드
- 벤더 수 통계
- 사용자 수 통계
- 주문 수 통계

#### 4.3.2 벤더 승인 관리
- 벤더 신청 목록
- 벤더 승인/거절
- 벤더 상태 관리

#### 4.3.3 상품 모니터링
- 상품 목록 조회
- 상품 승인/거절
- 신고된 상품 관리

#### 4.3.4 권한 관리
- 사용자 권한 관리
- 역할 할당
- 권한 정책 설정

#### 4.3.5 통계 및 분석
- 매출 분석
- 벤더별 성과 분석
- 상품별 판매 분석

## 5. 실시간 채팅 시스템

### 5.1 기능
- 고객 ↔ 판매자 직접 채팅
- 메시지 지속성
- 읽음/안읽음 상태
- 기본 모더레이션 기능

### 5.2 기술 구현
- Socket.io 서버
- 메시지 DB 저장
- 실시간 알림

## 6. 결제 시스템 (Stripe)

### 6.1 결제 플로우
1. 고객이 결제 요청
2. PaymentIntent 생성
3. 클라이언트에서 Stripe Elements로 결제
4. Webhook으로 결제 결과 수신
5. 주문 상태 업데이트
6. 벤더 수익 분배

### 6.2 보안
- Stripe-Signature 검증
- Idempotency 키 처리
- 결제 실패 시 재시도 로직

## 7. API 구조

### 7.1 고객 API
- `GET /api/products` - 상품 목록
- `GET /api/products/[id]` - 상품 상세
- `POST /api/orders` - 주문 생성
- `GET /api/orders` - 주문 목록
- `POST /api/wishlist` - 찜하기
- `GET /api/wishlist` - 찜 목록

### 7.2 판매자 API
- `POST /api/seller/products` - 상품 등록
- `PUT /api/seller/products/[id]` - 상품 수정
- `DELETE /api/seller/products/[id]` - 상품 삭제
- `GET /api/seller/orders` - 주문 목록
- `PUT /api/seller/orders/[id]` - 주문 상태 변경
- `GET /api/seller/settlements` - 정산 내역

### 7.3 관리자 API
- `GET /api/admin/vendors` - 벤더 목록
- `PUT /api/admin/vendors/[id]/approve` - 벤더 승인
- `GET /api/admin/products` - 상품 목록
- `GET /api/admin/analytics` - 통계 데이터

## 8. 보안 설계

### 8.1 인증
- JWT 토큰 기반 인증
- bcrypt 비밀번호 해싱
- 2FA 지원

### 8.2 권한
- 역할 기반 접근 제어 (RBAC)
- 라우트 그룹별 권한 검증
- API 엔드포인트 보호

### 8.3 데이터 보호
- HTTPS 강제
- 민감 데이터 암호화
- SQL 인젝션 방지 (Prisma 사용)

## 9. 배포 전략

### 9.1 환경 분리
- Development
- Staging
- Production

### 9.2 CI/CD
- GitHub Actions
- 자동 테스트
- 자동 배포

### 9.3 모니터링
- Vercel Analytics
- 에러 로깅
- 성능 모니터링

## 10. 확장성 전략

### 10.1 데이터베이스
- Prisma 마이그레이션
- 인덱스 최적화
- 캐싱 전략

### 10.2 애플리케이션
- 서버리스 아키텍처
- CDN 활용
- 이미지 최적화

## 11. 미래 확장 계획

### 11.1 AI 기능
- AI 고객 지원 챗봇
- 재입고 알림 자동화
- 자동 정산 스케줄러

### 11.2 국제화
- i18n 지원
- 다중 통화 지원

### 11.3 모노레포
- Turborepo로 전환
- 패키지 분리

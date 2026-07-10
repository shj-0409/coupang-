# G마켓 UI 구조 분석

## 개요

G마켓은 GDS(Gmarket Design System)를 통해 일관된 디자인과 사용자 경험을 제공합니다. 이 문서는 G마켓의 UI 구조를 분석한 내용입니다.

## 디자인 시스템 구조

### 1. Overview (개요)

- **Introduction**: G마켓 디자인 시스템 소개 및 가이드라인

### 2. Brand (브랜드)

브랜드 정체성과 시각적 요소를 정의합니다.

- **Values**: 브랜드 가치 및 철학
- **Logos**: 로고 사용 가이드라인
- **Colors**: 브랜드 색상 팔레트
- **Typeface**: 타이포그래피 가이드라인
- **Notation**: 표기법 규칙

### 3. Foundation (파운데이션)

일관된 레이아웃과 사용자 경험을 위한 기본 시각적 요소입니다.

- **Color**: 색상 시스템
- **Iconography**: 아이콘 디자인 시스템
- **Spacing**: 간격 및 여백 규칙
- **Typography**: 텍스트 스타일 가이드

### 4. Components (컴포넌트)

재사용 가능한 UI 컴포넌트 라이브러리입니다.

#### 4.1 레이아웃 컴포넌트

- **Navigation**: 네비게이션 메뉴
- **Banners**: 배너 컴포넌트
- **Sheets**: 시트/패널 컴포넌트
- **Slides**: 슬라이드 쇼 컴포넌트

#### 4.2 입력 컴포넌트

- **Buttons**: 버튼 컴포넌트
- **Text Fields**: 텍스트 입력 필드
- **Selection Controls**: 선택 컨트롤 (체크박스, 라디오 등)
- **Dropdowns**: 드롭다운 메뉴
- **Dialogs**: 다이얼로그/모달

#### 4.3 정보 표시 컴포넌트

- **Item cards**: 상품 카드
- **Thumbnails**: 썸네일 이미지
- **Info boxes**: 정보 박스
- **Badges**: 배지/태그
- **Labels**: 라벨
- **Lists**: 리스트
- **Heading**: 헤딩/제목

#### 4.4 인터랙티브 컴포넌트

- **Accordions**: 아코디언
- **Tabs**: 탭
- **Popovers**: 팝오버
- **Chips**: 칩 컴포넌트

## 주요 UI 패턴

### 상품 목록 페이지

- Item Cards 컴포넌트 사용
- Thumbnails 이미지 표시
- Badges로 할인/특가 표시
- Navigation으로 카테고리 이동

### 상품 상세 페이지

- Banners로 프로모션 배너
- Info boxes로 상품 정보 표시
- Selection Controls로 옵션 선택
- Buttons로 구매/장바구니 액션

### 검색 및 필터

- Text Fields로 검색 입력
- Dropdowns로 필터링
- Accordions으로 상세 필터 확장

## 디자인 원칙

1. **일관성**: 모든 페이지에서 동일한 컴포넌트와 스타일 사용
2. **사용성**: 직관적인 네비게이션과 명확한 액션 버튼
3. **시각적 계층**: 중요한 정보에 강조 색상과 크기 적용
4. **반응형**: 다양한 디바이스에서 최적화된 레이아웃

## 참고

- G마켓 디자인 시스템: https://gds.gmarket.co.kr/

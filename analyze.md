# Project Structure Analysis: Multivendor Marketplace

## 1. Overview
This project is a robust **Multivendor Marketplace** built with **Next.js 15**, **TypeScript**, and **Prisma**. It is designed to handle multiple user roles (Admin, Seller, Customer) and includes complex features like real-time chat, payment processing, and vendor settlements.

## 2. Technical Stack
- **Framework**: [Next.js 15 (App Router)](https://nextjs.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Database**: [PostgreSQL](https://www.postgresql.org/) with [Prisma ORM](https://www.prisma.io/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Payments**: [Stripe](https://stripe.com/)
- **Real-time**: [Socket.io](https://socket.io/)
- **DevOps**: [Docker](https://www.docker.com/), [Husky](https://typicode.github.io/husky/), [Lint-staged](https://github.com/okonet/lint-staged)

## 3. Directory Structure & Responsibilities

### 📂 `app/` (Routing & Pages)
The core of the application logic using Next.js Route Groups.
- **`(admin)/`**: Administrative dashboard, product/user/vendor management, and analytics.
- **`(customer)/`**: Customer-facing features: shop, product details, checkout, order history, profile, and wishlist.
- **`(seller)/`**: Seller-specific tools: product listing management, order fulfillment, and settlement tracking.
- **`api/`**: Backend endpoints mirroring the role-based structure, handling data operations and third-party integrations (Stripe, Chat).

### 📂 `prisma/` (Database Layer)
- `schema.prisma`: The source of truth for the data model. Key entities include `User`, `Vendor`, `Product`, `Order`, `Payment`, `Settlement`, `Chat`, and `Review`.

### 📂 `lib/` (Service Initializations)
- `prisma/`: Database client setup.
- `stripe/`: Stripe payment configuration.
- `socket/`: Socket.io server and client logic for real-time features.

### 📂 `postgres_config/` (Infrastructure)
- Contains PostgreSQL configuration files (`postgresql.conf`, `pg_hba.conf`) and management scripts (`backup.ps1`, `monitor.ps1`), ensuring production-ready database management.

### 📂 `components/` & `features/` (UI Layer)
- Modularized UI components following the **Gmarket Design System (GDS)** principles as documented in `docs/gmarket-ui-structure.md`.

## 4. Key Architectural Patterns
1. **Role-Based Access Control (RBAC)**: Implemented through Route Groups and role-specific API routes.
2. **Domain-Driven Design (DDD) Lite**: Logic is grouped by user domain (Admin/Seller/Customer) to maintain scalability.
3. **Infrastructure as Code (Lite)**: Database configurations and Docker setup are bundled within the repository.

---
*Created by Roo (Architect mode) on 2026-07-13*

import { PrismaClient } from "@prisma/client";

/**
 * Prisma 클라이언트 싱글톤 인스턴스
 * @description 개발 환경에서 핫 리로딩 시 여러 인스턴스 생성을 방지하기 위한 싱글톤 패턴
 */
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

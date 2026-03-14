import { PrismaClient } from '@prisma/client';

// Prisma Client singleton for Next.js / Vercel.
// Reuses the existing client in development to avoid hitting connection limits
// due to hot-module reloading.
//
// In production each serverless invocation gets a fresh module scope, so a
// module-level constant is sufficient.

declare global {
  // eslint-disable-next-line no-var
  var __prisma: PrismaClient | undefined;
}

function createPrismaClient(): PrismaClient {
  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  });
}

export const prisma: PrismaClient =
  process.env.NODE_ENV === 'production'
    ? createPrismaClient()
    : (globalThis.__prisma ??= createPrismaClient());

export default prisma;

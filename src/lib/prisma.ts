import { PrismaClient } from "@prisma/client";

// In development, force a fresh PrismaClient on every module reload so that
// schema changes (prisma generate) are reflected without restarting the server.
function createPrisma() {
  return new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });
}

declare global {
  // eslint-disable-next-line no-var
  var __prisma: PrismaClient | undefined;
}

export const prisma: PrismaClient =
  process.env.NODE_ENV === "production"
    ? createPrisma()
    : (global.__prisma = createPrisma());

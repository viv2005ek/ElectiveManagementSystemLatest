import { PrismaClient } from "@prisma/client";

// Initialize Prisma Client
const prisma = new PrismaClient({
  log: ["info"],
});
// Export the Prisma Client instance
export { prisma };

import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

// Reuse the client across hot reloads in dev so we don't exhaust the
// Neon/Supabase connection limit with a new client per edit.
const globalForPrisma = globalThis;

function createClient() {
  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
  return new PrismaClient({ adapter });
}

export const db = globalForPrisma.__db ?? createClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.__db = db;
}

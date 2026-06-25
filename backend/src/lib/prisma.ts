import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client.js";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error(
    "DATABASE_URL não foi definida. Verifique o arquivo backend/.env."
  );
}

/**
 * O adapter traduz as consultas do Prisma para o driver PostgreSQL.
 */
const adapter = new PrismaPg({
  connectionString
});

/**
 * Instância única usada pela aplicação inteira.
 *
 * Controllers, services e repositories não devem criar
 * um PrismaClient novo a cada requisição.
 */
export const prisma = new PrismaClient({
  adapter
});
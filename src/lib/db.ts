import { PrismaClient } from '@prisma/client';
import { createClient } from '@libsql/client';
import { PrismaLibSql } from '@prisma/adapter-libsql';

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined;
};

let prisma: PrismaClient;

if (process.env.TURSO_DATABASE_URL && process.env.TURSO_AUTH_TOKEN) {
    const adapter = new PrismaLibSql({
        url: process.env.TURSO_DATABASE_URL,
        authToken: process.env.TURSO_AUTH_TOKEN,
    });
    prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter });
} else {
    // Fallback to local SQLite if no Turso credentials are provided
    prisma = globalForPrisma.prisma ?? new PrismaClient();
}

export const db = prisma;

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db;

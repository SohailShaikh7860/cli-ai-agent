import {PrismaClient} from '@prisma/client';
import {PrismaPg} from '@prisma/adapter-pg';
import {Pool} from 'pg';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '..', '..', '.env') });
if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not set');
}

const globalForPrisma: any = global

let prisma: PrismaClient;

try {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  const adapter = new PrismaPg(pool);

  prisma = new PrismaClient({
    adapter: adapter,
  });

  if(process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
} catch (error) {
  console.error('Error initializing PrismaClient:', error);
  if (error instanceof Error) {
    throw error;
  } else {
    throw new Error(`PrismaClient initialization failed: ${String(error)}`);
  }
}

export default prisma;
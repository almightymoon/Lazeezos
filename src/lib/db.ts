/**
 * Database Configuration
 * PostgreSQL + Redis setup for Lazeezos Food Delivery App
 */

import { PrismaClient } from '@prisma/client';
import Redis from 'ioredis';

// Prisma Client (PostgreSQL)
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// Redis Client
const globalForRedis = globalThis as unknown as {
  redis: Redis | undefined;
};

export const redis =
  globalForRedis.redis ??
  new Redis({
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379'),
    password: process.env.REDIS_PASSWORD,
    retryStrategy: (times) => {
      const delay = Math.min(times * 50, 2000);
      return delay;
    },
    maxRetriesPerRequest: 3,
  });

if (process.env.NODE_ENV !== 'production') globalForRedis.redis = redis;

// Redis connection error handling
redis.on('error', (err) => {
  console.error('Redis Client Error:', err);
});

redis.on('connect', () => {
  console.log('✅ Redis connected');
});

// Helper function to check Redis connection
export async function checkRedisConnection(): Promise<boolean> {
  try {
    await redis.ping();
    return true;
  } catch (error) {
    console.error('Redis connection check failed:', error);
    return false;
  }
}

// Helper function to check PostgreSQL connection
export async function checkPostgresConnection(): Promise<boolean> {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return true;
  } catch (error) {
    console.error('PostgreSQL connection check failed:', error);
    return false;
  }
}

// Graceful shutdown
export async function disconnectDatabases() {
  await prisma.$disconnect();
  redis.disconnect();
}



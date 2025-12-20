# Database Architecture - Lazeezos

## Overview

Lazeezos uses a **PostgreSQL + Redis** architecture, following the same pattern as Foodpanda.

## 🗄️ Database Stack

### PostgreSQL (Main Database)
- **Purpose**: All critical & permanent data
- **Use Cases**:
  - Users (customers, riders, restaurants)
  - Restaurants & menus
  - Orders & order items
  - Payments & payouts
  - Reviews
  - Delivery zones
  - Addresses

### Redis (Real-time / Speed)
- **Purpose**: Fast, temporary, real-time data
- **Use Cases**:
  - Live order status
  - Rider availability & location
  - Rider ↔ order assignment
  - Temporary shopping carts
  - OTP verification
  - Rate limiting
  - Restaurant online/offline status

## 📁 File Structure

```
src/lib/
├── db.ts              # Database connections (Prisma + Redis)
├── db-queries.ts      # Common PostgreSQL queries
└── redis.ts           # Redis service layer

prisma/
└── schema.prisma      # PostgreSQL schema definition
```

## 🚀 Setup Instructions

### 1. Install Dependencies

```bash
npm install @prisma/client ioredis
npm install -D prisma
```

### 2. Setup PostgreSQL

1. Install PostgreSQL locally or use a cloud service (AWS RDS, Supabase, etc.)
2. Create a database:
```sql
CREATE DATABASE lazeezos;
```

### 3. Setup Redis

1. Install Redis locally:
```bash
# macOS
brew install redis
brew services start redis

# Linux
sudo apt-get install redis-server
sudo systemctl start redis
```

Or use a cloud service (Redis Cloud, AWS ElastiCache, etc.)

### 4. Configure Environment Variables

Copy `.env.example` to `.env` and fill in your database credentials:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/lazeezos?schema=public"
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
```

### 5. Run Database Migrations

```bash
# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate dev --name init

# (Optional) Open Prisma Studio to view data
npx prisma studio
```

## 📊 Database Schema Overview

### Core Tables

1. **User** - All users (customers, restaurant owners, riders, admins)
2. **Restaurant** - Restaurant information and settings
3. **MenuItem** - Menu items for restaurants
4. **Order** - Customer orders
5. **OrderItem** - Items in each order
6. **Payment** - Payment transactions
7. **Payout** - Restaurant payouts
8. **Review** - Customer reviews
9. **Rider** - Delivery riders
10. **Address** - Customer delivery addresses
11. **DeliveryZone** - Delivery coverage areas

## 🔄 Data Flow

### Order Flow Example

1. **Customer adds items to cart** → Stored in Redis (temporary)
2. **Customer places order** → Saved to PostgreSQL
3. **Order status updates** → Updated in both PostgreSQL (permanent) and Redis (real-time)
4. **Rider assignment** → Stored in Redis for fast lookup
5. **Order delivered** → Final status in PostgreSQL, removed from Redis

### Rider Location Updates

1. **Rider app sends location** → Stored in Redis (GeoHash)
2. **System finds nearby riders** → Query Redis GeoHash
3. **Rider goes offline** → Removed from Redis, status updated in PostgreSQL

## 🔐 Security Best Practices

1. **Never store sensitive data in Redis** (passwords, payment details)
2. **Use environment variables** for all credentials
3. **Implement rate limiting** using Redis
4. **Use transactions** for critical operations (payments, order creation)
5. **Validate all inputs** before database operations

## 📈 Performance Tips

1. **Index frequently queried fields** (already added in schema)
2. **Use Redis for hot data** (frequently accessed, temporary)
3. **Batch operations** when possible
4. **Use connection pooling** (Prisma handles this automatically)
5. **Monitor query performance** using Prisma's query logging

## 🛠️ Common Operations

### Check Database Connections

```typescript
import { checkPostgresConnection, checkRedisConnection } from '@/lib/db';

const pgConnected = await checkPostgresConnection();
const redisConnected = await checkRedisConnection();
```

### Use Redis Services

```typescript
import { OrderStatusRedis, RiderRedis, CartRedis } from '@/lib/redis';

// Set order status
await OrderStatusRedis.setOrderStatus(orderId, 'PREPARING');

// Find nearby riders
const nearbyRiders = await RiderRedis.getNearbyRiders({ lat: 35.0, lng: 75.0 }, 5);

// Save cart
await CartRedis.saveCart(userId, cartData);
```

### Use PostgreSQL Queries

```typescript
import { RestaurantQueries, OrderQueries } from '@/lib/db-queries';

// Find restaurant
const restaurant = await RestaurantQueries.findBySlug('burger-palace');

// Create order
const order = await OrderQueries.createOrder(orderData);
```

## 🔍 Monitoring

- Use Prisma Studio: `npx prisma studio`
- Monitor Redis: `redis-cli monitor`
- Check connections: Use the check functions in `db.ts`

## 📚 Resources

- [Prisma Documentation](https://www.prisma.io/docs)
- [Redis Documentation](https://redis.io/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)



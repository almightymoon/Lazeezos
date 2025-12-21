# Database Seeding Guide

This guide explains how to seed the Lazeezos database with initial data.

## Overview

The seeder file (`prisma/seed.ts`) populates the database with:
- **Users**: Admin, customers, restaurant owners, and riders
- **Restaurants**: 8 restaurants with complete information
- **Menu Items**: Menu items for each restaurant
- **Orders**: Sample orders for testing
- **Addresses**: Customer addresses
- **Riders**: Delivery riders with status and location

## Prerequisites

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Setup database**:
   - Ensure PostgreSQL is running
   - Set `DATABASE_URL` in `.env`
   - Run migrations: `npm run db:migrate`

3. **Install required packages** (if not already installed):
   ```bash
   npm install bcryptjs tsx
   npm install -D @types/bcryptjs
   ```

## Running the Seeder

### Option 1: Using npm script (Recommended)
```bash
npm run db:seed
```

### Option 2: Using Prisma directly
```bash
npx prisma db seed
```

### Option 3: Using tsx directly
```bash
npx tsx prisma/seed.ts
```

## What Gets Created

### Users
- **1 Admin**: `admin@lazeezos.com` / `password123`
- **5 Customers**: `ahmed@example.com`, `sara@example.com`, etc. / `password123`
- **8 Restaurant Owners**: One for each restaurant / `password123`
- **2 Riders**: `rider1@example.com`, `rider2@example.com` / `password123`

### Restaurants
1. **Burger Palace** - Fast Food, American, Burgers
2. **Pizza Italia** - Italian, Pizza, Pasta
3. **Sushi World** - Japanese, Sushi, Asian
4. **Sweet Treats** - Desserts, Bakery, Sweets
5. **Green Bowl** - Healthy, Salads, Vegan
6. **Taco Fiesta** - Mexican, Tacos, Burritos
7. **Thai Express** - Thai, Asian
8. **Mediterranean Grill** - Mediterranean, Healthy

Each restaurant includes:
- Complete business information
- Operating hours
- Menu items (2-4 items per restaurant)
- Ratings and reviews
- Delivery settings

### Sample Data
- **Orders**: 3 sample orders with different statuses
- **Addresses**: Default addresses for all customers
- **Riders**: 2 riders with different statuses (ONLINE/OFFLINE)

## Resetting the Database

To clear and reseed the database:

```bash
# Clear all data and reseed
npx prisma migrate reset
# This will:
# 1. Drop the database
# 2. Create a new database
# 3. Run all migrations
# 4. Run the seed script
```

## Notes

- All passwords are hashed using bcrypt
- Prices are in PKR (Pakistani Rupees)
- Restaurant coordinates are set for Karachi, Pakistan
- Menu items include images, descriptions, and pricing
- Some restaurants have promotional discounts

## Troubleshooting

### Error: Cannot find module 'bcryptjs'
```bash
npm install bcryptjs @types/bcryptjs
```

### Error: Cannot find module 'tsx'
```bash
npm install -D tsx
```

### Database connection errors
- Check that PostgreSQL is running
- Verify `DATABASE_URL` in `.env`
- Ensure database exists: `createdb lazeezos`

### Seed script fails
- Check database migrations are up to date: `npm run db:migrate`
- Verify Prisma client is generated: `npm run db:generate`
- Check console for specific error messages

## Next Steps

After seeding:
1. Start the development server: `npm run dev`
2. Visit the homepage to see restaurants
3. Login with any seeded user account
4. Test restaurant and menu functionality



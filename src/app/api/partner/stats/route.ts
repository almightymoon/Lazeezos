import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    // For now, get the first restaurant (for demo)
    // In production, get from authenticated session
    const restaurant = await prisma.restaurant.findFirst({
      include: {
        orders: {
          include: {
            items: {
              include: {
                menuItem: true,
              },
            },
          },
        },
        menu: true,
      },
    });

    if (!restaurant) {
      return NextResponse.json({
        revenue: { value: 0, change: 0, period: 'vs last week' },
        orders: { value: 0, change: 0, period: 'vs last week' },
        customers: { value: 0, change: 0, period: 'new this week' },
        rating: { value: 0, change: 0, period: 'from 0' },
      });
    }

    // Calculate stats
    const now = new Date();
    const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

    // Revenue
    const currentWeekRevenue = restaurant.orders
      .filter((o) => o.placedAt >= lastWeek)
      .reduce((sum, o) => sum + o.total, 0);
    
    const lastWeekRevenue = restaurant.orders
      .filter((o) => o.placedAt >= twoWeeksAgo && o.placedAt < lastWeek)
      .reduce((sum, o) => sum + o.total, 0);
    
    const revenueChange = lastWeekRevenue > 0 
      ? ((currentWeekRevenue - lastWeekRevenue) / lastWeekRevenue) * 100 
      : 0;

    // Orders
    const currentWeekOrders = restaurant.orders.filter(
      (o) => o.placedAt >= lastWeek
    ).length;
    
    const lastWeekOrders = restaurant.orders.filter(
      (o) => o.placedAt >= twoWeeksAgo && o.placedAt < lastWeek
    ).length;
    
    const ordersChange = lastWeekOrders > 0
      ? ((currentWeekOrders - lastWeekOrders) / lastWeekOrders) * 100
      : 0;

    // Customers (unique customers this week)
    const currentWeekCustomers = new Set(
      restaurant.orders
        .filter((o) => o.placedAt >= lastWeek)
        .map((o) => o.customerId)
    ).size;

    // Rating
    const ratingChange = 0.2; // Mock change

    return NextResponse.json({
      revenue: {
        value: Math.round(currentWeekRevenue),
        change: Math.round(revenueChange * 10) / 10,
        period: 'vs last week',
      },
      orders: {
        value: currentWeekOrders,
        change: Math.round(ordersChange * 10) / 10,
        period: 'vs last week',
      },
      customers: {
        value: currentWeekCustomers,
        change: 0,
        period: 'new this week',
      },
      rating: {
        value: restaurant.rating,
        change: ratingChange,
        period: `from ${(restaurant.rating - ratingChange).toFixed(1)}`,
      },
    });
  } catch (error) {
    console.error('Error fetching partner stats:', error);
    return NextResponse.json(
      {
        revenue: { value: 0, change: 0, period: 'vs last week' },
        orders: { value: 0, change: 0, period: 'vs last week' },
        customers: { value: 0, change: 0, period: 'new this week' },
        rating: { value: 0, change: 0, period: 'from 0' },
      },
      { status: 500 }
    );
  }
}



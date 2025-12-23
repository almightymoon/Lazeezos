import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

// GET admin statistics
export async function GET(request: Request) {
  try {
    // Get total revenue (sum of all completed orders)
    const completedOrders = await prisma.order.findMany({
      where: {
        status: 'DELIVERED',
      },
      include: {
        payment: true,
      },
    });

    const totalRevenue = completedOrders.reduce((sum, order) => sum + order.total, 0);

    // Get total users
    const totalUsers = await prisma.user.count();

    // Get active restaurants
    const activeRestaurants = await prisma.restaurant.count({
      where: {
        status: 'ACTIVE',
      },
    });

    // Get active riders
    const activeRiders = await prisma.rider.count({
      where: {
        status: 'ONLINE',
      },
    });

    // Get total orders
    const totalOrders = await prisma.order.count();

    // Get average rating from reviews
    const reviews = await prisma.review.findMany({
      select: {
        overallRating: true,
      },
    });

    const avgRating = reviews.length > 0
      ? reviews.reduce((sum, review) => sum + review.overallRating, 0) / reviews.length
      : 0;

    // Get monthly revenue (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyOrders = await prisma.order.findMany({
      where: {
        status: 'DELIVERED',
        deliveredAt: {
          gte: sixMonthsAgo,
        },
      },
    });

    const revenueByMonth: Record<string, { revenue: number; orders: number }> = {};
    monthlyOrders.forEach(order => {
      const month = order.deliveredAt!.toLocaleDateString('en-US', { month: 'short' });
      if (!revenueByMonth[month]) {
        revenueByMonth[month] = { revenue: 0, orders: 0 };
      }
      revenueByMonth[month].revenue += order.total;
      revenueByMonth[month].orders += 1;
    });

    const revenueData = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map(month => ({
      month,
      revenue: revenueByMonth[month]?.revenue || 0,
      orders: revenueByMonth[month]?.orders || 0,
    }));

    // Get order status distribution
    const orderStatusCounts = await prisma.order.groupBy({
      by: ['status'],
      _count: true,
    });

    const orderStatusData = orderStatusCounts.map(item => ({
      name: item.status,
      value: item._count,
      color: getStatusColor(item.status),
    }));

    return NextResponse.json({
      totalRevenue,
      totalUsers,
      activeRestaurants,
      activeRiders,
      totalOrders,
      avgRating: Math.round(avgRating * 10) / 10,
      revenueData,
      orderStatusData,
    });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch admin stats' },
      { status: 500 }
    );
  }
}

function getStatusColor(status: string): string {
  const colorMap: Record<string, string> = {
    'DELIVERED': '#10b981',
    'ON_THE_WAY': '#f59e0b',
    'PREPARING': '#f59e0b',
    'PENDING': '#3b82f6',
    'CANCELLED': '#ef4444',
  };
  return colorMap[status] || '#6b7280';
}


import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

// GET rider statistics
export async function GET(request: Request) {
  try {
    // For now, get the first rider (for demo)
    // In production, get from authenticated session
    const rider = await prisma.rider.findFirst({
      include: {
        user: true,
      },
    });

    if (!rider) {
      return NextResponse.json({
        todayEarnings: 0,
        deliveriesCompleted: 0,
        averageRating: 0,
        activeHours: 0,
        weeklyEarnings: [],
        weeklyPerformance: [],
      });
    }

    // Get today's date range
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Get today's completed deliveries
    const todayOrders = await prisma.order.findMany({
      where: {
        riderId: rider.id,
        status: 'DELIVERED',
        deliveredAt: {
          gte: today,
          lt: tomorrow,
        },
      },
      include: {
        payment: true,
      },
    });

    // Calculate today's earnings
    const todayEarnings = todayOrders.reduce((sum, order) => {
      // Assume rider gets 80% of delivery fee
      return sum + (order.deliveryFee * 0.8);
    }, 0);

    // Get all completed deliveries for rating
    const allDeliveredOrders = await prisma.order.findMany({
      where: {
        riderId: rider.id,
        status: 'DELIVERED',
      },
      include: {
        review: true,
      },
    });

    const ratings = allDeliveredOrders
      .map(order => order.review?.overallRating)
      .filter((rating): rating is number => rating !== null && rating !== undefined);

    const averageRating = ratings.length > 0
      ? ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length
      : 0;

    // Get weekly earnings (last 7 days)
    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);

    const weeklyOrders = await prisma.order.findMany({
      where: {
        riderId: rider.id,
        status: 'DELIVERED',
        deliveredAt: {
          gte: weekAgo,
        },
      },
    });

    // Group by day
    const earningsByDay: Record<string, { earnings: number; deliveries: number }> = {};
    weeklyOrders.forEach(order => {
      const day = order.deliveredAt!.toLocaleDateString('en-US', { weekday: 'short' });
      if (!earningsByDay[day]) {
        earningsByDay[day] = { earnings: 0, deliveries: 0 };
      }
      earningsByDay[day].earnings += order.deliveryFee * 0.8;
      earningsByDay[day].deliveries += 1;
    });

    const weeklyEarnings = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => ({
      day,
      earnings: earningsByDay[day]?.earnings || 0,
      deliveries: earningsByDay[day]?.deliveries || 0,
    }));

    // Calculate active hours (simplified - based on orders)
    const activeHours = todayOrders.length * 0.3; // Assume ~18 min per delivery

    return NextResponse.json({
      todayEarnings,
      deliveriesCompleted: todayOrders.length,
      averageRating: Math.round(averageRating * 10) / 10,
      activeHours: Math.round(activeHours * 10) / 10,
      weeklyEarnings,
      weeklyPerformance: [], // Can be enhanced with hourly breakdown
    });
  } catch (error) {
    console.error('Error fetching rider stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch rider stats' },
      { status: 500 }
    );
  }
}


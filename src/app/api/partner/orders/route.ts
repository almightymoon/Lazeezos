import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { OrderStatus } from '@prisma/client';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status'); // Filter by status
    const restaurantId = searchParams.get('restaurantId'); // In real app, get from session/auth

    // For now, get the first restaurant (for demo)
    // In production, get from authenticated session
    const restaurant = await prisma.restaurant.findFirst();

    if (!restaurant) {
      return NextResponse.json({ orders: [] });
    }

    const where: any = {
      restaurantId: restaurant.id,
    };

    if (status && status !== 'all') {
      where.status = status as OrderStatus;
    }

    const orders = await prisma.order.findMany({
      where,
      include: {
        customer: {
          select: {
            firstName: true,
            lastName: true,
            phone: true,
          },
        },
        items: true,
      },
      orderBy: {
        placedAt: 'desc',
      },
      take: 100,
    });

    // Transform to match frontend format
    const formattedOrders = orders.map((order) => ({
      id: order.id,
      orderNumber: order.orderNumber,
      customer: `${order.customer.firstName} ${order.customer.lastName}`,
      items: order.items.length,
      total: order.total,
      status: order.status,
      time: formatTimeAgo(order.placedAt),
      deliveryAddress: order.deliveryAddress,
      phone: order.customer.phone,
    }));

    return NextResponse.json({ orders: formattedOrders });
  } catch (error) {
    console.error('Error fetching partner orders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders', orders: [] },
      { status: 500 }
    );
  }
}

function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} min ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
}



import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

// GET all orders
export async function GET(request: Request) {
  try {
    const orders = await prisma.order.findMany({
      include: {
        customer: {
          select: {
            firstName: true,
            lastName: true,
            phone: true,
          },
        },
        restaurant: {
          select: {
            name: true,
          },
        },
        rider: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
          },
        },
      },
      orderBy: {
        placedAt: 'desc',
      },
      take: 100,
    });

    const formattedOrders = orders.map(order => ({
      id: order.orderNumber,
      customer: `${order.customer.firstName} ${order.customer.lastName}`,
      restaurant: order.restaurant.name,
      rider: order.rider ? `${order.rider.user.firstName} ${order.rider.user.lastName}` : null,
      amount: order.total,
      status: order.status,
      date: order.placedAt.toISOString().split('T')[0],
      time: order.placedAt.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
    }));

    return NextResponse.json({ orders: formattedOrders });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}


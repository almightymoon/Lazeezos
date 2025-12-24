import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { OrderStatus } from '@prisma/client';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status'); // Filter by status
    const restaurantId = searchParams.get('restaurantId');
    const restaurantSlug = searchParams.get('restaurantSlug');

    let restaurant;
    if (restaurantId) {
      restaurant = await prisma.restaurant.findUnique({ where: { id: restaurantId } });
    } else if (restaurantSlug) {
      restaurant = await prisma.restaurant.findUnique({ where: { slug: restaurantSlug } });
    } else {
      // Fallback for demo, in production this would come from auth
      restaurant = await prisma.restaurant.findFirst();
    }

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

// PUT update order status
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { orderId, status } = body;

    if (!orderId || !status) {
      return NextResponse.json(
        { error: 'Order ID and status are required' },
        { status: 400 }
      );
    }

    // Validate status
    const validStatuses: OrderStatus[] = [
      'PENDING',
      'CONFIRMED',
      'PREPARING',
      'READY',
      'ASSIGNED',
      'PICKED_UP',
      'ON_THE_WAY',
      'DELIVERED',
      'CANCELLED',
    ];

    if (!validStatuses.includes(status as OrderStatus)) {
      return NextResponse.json(
        { error: 'Invalid order status' },
        { status: 400 }
      );
    }

    // Find order
    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    // Update order status
    const updateData: any = { status: status as OrderStatus };

    // Set timestamps based on status
    const now = new Date();
    if (status === 'CONFIRMED' && !order.confirmedAt) {
      updateData.confirmedAt = now;
    } else if (status === 'PREPARING' && !order.preparedAt) {
      updateData.preparedAt = now;
    } else if (status === 'PICKED_UP' && !order.pickedUpAt) {
      updateData.pickedUpAt = now;
    } else if (status === 'DELIVERED' && !order.deliveredAt) {
      updateData.deliveredAt = now;
    }

    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: updateData,
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
    });

    // Format response
    const formattedOrder = {
      id: updatedOrder.id,
      orderNumber: updatedOrder.orderNumber,
      customer: `${updatedOrder.customer.firstName} ${updatedOrder.customer.lastName}`,
      items: updatedOrder.items.length,
      total: updatedOrder.total,
      status: updatedOrder.status,
      time: formatTimeAgo(updatedOrder.placedAt),
      deliveryAddress: updatedOrder.deliveryAddress,
      phone: updatedOrder.customer.phone,
    };

    return NextResponse.json({
      message: 'Order status updated successfully',
      order: formattedOrder,
    });
  } catch (error) {
    console.error('Error updating order status:', error);
    return NextResponse.json(
      { error: 'Failed to update order status' },
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


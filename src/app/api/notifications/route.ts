import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

// GET user notifications
export async function GET(request: Request) {
  try {
    // For now, get the first customer (for demo)
    // In production, get from authenticated session
    const user = await prisma.user.findFirst({
      where: { role: 'CUSTOMER' },
    });

    if (!user) {
      return NextResponse.json({ notifications: [] });
    }

    // Get user's orders for order-related notifications
    const orders = await prisma.order.findMany({
      where: { customerId: user.id },
      orderBy: { placedAt: 'desc' },
      take: 10,
      include: {
        restaurant: {
          select: {
            name: true,
          },
        },
      },
    });

    // Generate notifications from orders
    const notifications = orders.map((order, index) => {
      const statusMessages: Record<string, string> = {
        'PENDING': `Your order from ${order.restaurant.name} is pending confirmation`,
        'CONFIRMED': `Your order from ${order.restaurant.name} has been confirmed`,
        'PREPARING': `Your order from ${order.restaurant.name} is being prepared`,
        'READY': `Your order from ${order.restaurant.name} is ready for pickup`,
        'ASSIGNED': `A rider has been assigned to your order from ${order.restaurant.name}`,
        'PICKED_UP': `Your order from ${order.restaurant.name} has been picked up`,
        'ON_THE_WAY': `Your order from ${order.restaurant.name} is on the way`,
        'DELIVERED': `Your order from ${order.restaurant.name} has been delivered`,
        'CANCELLED': `Your order from ${order.restaurant.name} has been cancelled`,
      };

      return {
        id: `notif-${order.id}`,
        type: 'order',
        title: statusMessages[order.status] || `Order ${order.orderNumber} status updated`,
        message: `Order ${order.orderNumber} - ${order.status}`,
        read: index > 2, // Mark older notifications as read
        timestamp: order.updatedAt.toISOString(),
        orderId: order.id,
        orderNumber: order.orderNumber,
      };
    });

    // Add some promotional notifications
    const promotionalNotifications = [
      {
        id: 'promo-1',
        type: 'promotion',
        title: 'Special Offer!',
        message: 'Get 20% off on your next order. Use code SAVE20',
        read: false,
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
      },
      {
        id: 'promo-2',
        type: 'promotion',
        title: 'New Restaurant Added',
        message: 'Check out our new partner restaurant - Pizza Palace!',
        read: false,
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
      },
    ];

    const allNotifications = [...promotionalNotifications, ...notifications].sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );

    return NextResponse.json({ notifications: allNotifications });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return NextResponse.json(
      { error: 'Failed to fetch notifications' },
      { status: 500 }
    );
  }
}

// PUT mark notification as read
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { notificationId } = body;

    // In a real app, this would update the notification in the database
    // For now, just return success
    return NextResponse.json({
      message: 'Notification marked as read',
      notificationId,
    });
  } catch (error) {
    console.error('Error updating notification:', error);
    return NextResponse.json(
      { error: 'Failed to update notification' },
      { status: 500 }
    );
  }
}


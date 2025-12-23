import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { OrderStatus } from '@prisma/client';

export const dynamic = 'force-dynamic';

// GET available orders and delivery history
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type'); // 'available' or 'history'

    // For now, get the first rider (for demo)
    // In production, get from authenticated session
    const rider = await prisma.rider.findFirst();

    if (!rider) {
      return NextResponse.json({
        availableOrders: [],
        activeDelivery: null,
        deliveryHistory: [],
      });
    }

    if (type === 'available') {
      // Get orders that are ready for pickup (READY status) and not assigned
      const availableOrders = await prisma.order.findMany({
        where: {
          status: OrderStatus.READY,
          riderId: null,
        },
        include: {
          restaurant: {
            select: {
              name: true,
              address: true,
              city: true,
            },
          },
          customer: {
            select: {
              firstName: true,
              lastName: true,
              phone: true,
            },
          },
          items: {
            include: {
              menuItem: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
        orderBy: {
          placedAt: 'desc',
        },
        take: 20,
      });

      const formattedOrders = availableOrders.map(order => ({
        id: order.orderNumber,
        restaurant: order.restaurant.name,
        restaurantAddress: `${order.restaurant.address}, ${order.restaurant.city}`,
        customer: `${order.customer.firstName} ${order.customer.lastName}`,
        deliveryAddress: order.deliveryAddress,
        distance: '2.3 mi', // Would need geolocation to calculate
        payment: Math.round(order.deliveryFee * 0.8 * 100), // Rider gets 80% of delivery fee
        items: order.items.length,
        time: 'Just now', // Would calculate from placedAt
        priority: order.total > 2000 ? 'high' : 'normal',
      }));

      return NextResponse.json({
        availableOrders: formattedOrders,
      });
    } else if (type === 'active') {
      // Get active delivery for this rider
      const activeOrder = await prisma.order.findFirst({
        where: {
          riderId: rider.id,
          status: {
            in: [OrderStatus.ASSIGNED, OrderStatus.PICKED_UP, OrderStatus.ON_THE_WAY],
          },
        },
        include: {
          restaurant: {
            select: {
              name: true,
              address: true,
              city: true,
            },
          },
          customer: {
            select: {
              firstName: true,
              lastName: true,
              phone: true,
            },
          },
          items: {
            include: {
              menuItem: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
      });

      if (!activeOrder) {
        return NextResponse.json({ activeDelivery: null });
      }

      const activeDelivery = {
        id: activeOrder.orderNumber,
        restaurant: activeOrder.restaurant.name,
        restaurantAddress: `${activeOrder.restaurant.address}, ${activeOrder.restaurant.city}`,
        customer: `${activeOrder.customer.firstName} ${activeOrder.customer.lastName}`,
        customerPhone: activeOrder.customer.phone,
        deliveryAddress: activeOrder.deliveryAddress,
        distance: '1.5 mi',
        payment: Math.round(activeOrder.deliveryFee * 0.8 * 100),
        items: activeOrder.items.length,
        status: activeOrder.status.toLowerCase().replace('_', '_'),
        estimatedTime: '12 min',
        orderDetails: activeOrder.items.map(item => `${item.menuItem.name} x${item.quantity}`),
      };

      return NextResponse.json({ activeDelivery });
    } else {
      // Get delivery history
      const historyOrders = await prisma.order.findMany({
        where: {
          riderId: rider.id,
          status: OrderStatus.DELIVERED,
        },
        include: {
          customer: {
            select: {
              firstName: true,
              lastName: true,
            },
          },
          review: {
            select: {
              overallRating: true,
            },
          },
        },
        orderBy: {
          deliveredAt: 'desc',
        },
        take: 50,
      });

      const deliveryHistory = historyOrders.map(order => ({
        id: order.orderNumber,
        customer: `${order.customer.firstName} ${order.customer.lastName}`,
        amount: Math.round(order.deliveryFee * 0.8 * 100),
        rating: order.review?.overallRating || 0,
        time: order.deliveredAt?.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }) || '',
        date: order.deliveredAt?.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) || '',
      }));

      return NextResponse.json({ deliveryHistory });
    }
  } catch (error) {
    console.error('Error fetching rider orders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch rider orders' },
      { status: 500 }
    );
  }
}

// POST accept order
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { orderId } = body;

    if (!orderId) {
      return NextResponse.json(
        { error: 'Order ID is required' },
        { status: 400 }
      );
    }

    // For now, get the first rider (for demo)
    const rider = await prisma.rider.findFirst();

    if (!rider) {
      return NextResponse.json(
        { error: 'Rider not found' },
        { status: 404 }
      );
    }

    // Update order to assign to rider
    const order = await prisma.order.update({
      where: { orderNumber: orderId },
      data: {
        riderId: rider.id,
        status: OrderStatus.ASSIGNED,
      },
    });

    return NextResponse.json({
      message: 'Order accepted successfully',
      order: {
        id: order.orderNumber,
        status: order.status,
      },
    });
  } catch (error: any) {
    console.error('Error accepting order:', error);
    return NextResponse.json(
      { error: 'Failed to accept order' },
      { status: 500 }
    );
  }
}


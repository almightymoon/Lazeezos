import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { OrderStatus } from '@prisma/client';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status'); // 'active' or 'past'
    const userId = searchParams.get('userId'); // In real app, get from session/auth

    // For now, we'll get orders for the first customer (for demo)
    // In production, get from authenticated session
    const customer = await prisma.user.findFirst({
      where: { role: 'CUSTOMER' },
    });

    if (!customer) {
      return NextResponse.json({ activeOrders: [], pastOrders: [] });
    }

    const where: any = {
      customerId: customer.id,
    };

    // Get active orders (not delivered or cancelled)
    const activeOrders = await prisma.order.findMany({
      where: {
        ...where,
        status: {
          notIn: [OrderStatus.DELIVERED, OrderStatus.CANCELLED, OrderStatus.REFUNDED],
        },
      },
      include: {
        customer: {
          select: {
            phone: true,
          },
        },
        restaurant: {
          select: {
            id: true,
            name: true,
            coverImage: true,
          },
        },
        items: {
          include: {
            menuItem: {
              select: {
                id: true,
                name: true,
                image: true,
                price: true,
              },
            },
          },
        },
      },
      orderBy: {
        placedAt: 'desc',
      },
    });

    // Get past orders (delivered or cancelled)
    const pastOrders = await prisma.order.findMany({
      where: {
        ...where,
        status: {
          in: [OrderStatus.DELIVERED, OrderStatus.CANCELLED, OrderStatus.REFUNDED],
        },
      },
      include: {
        customer: {
          select: {
            phone: true,
          },
        },
        restaurant: {
          select: {
            id: true,
            name: true,
            coverImage: true,
          },
        },
        items: {
          include: {
            menuItem: {
              select: {
                id: true,
                name: true,
                image: true,
                price: true,
              },
            },
          },
        },
        review: {
          select: {
            overallRating: true,
          },
        },
      },
      orderBy: {
        placedAt: 'desc',
      },
      take: 50, // Limit past orders
    });

    // Helper to map order status
    const mapStatus = (status: OrderStatus): 'pending' | 'preparing' | 'on_the_way' | 'delivered' | 'cancelled' => {
      const statusMap: Record<string, 'pending' | 'preparing' | 'on_the_way' | 'delivered' | 'cancelled'> = {
        'PENDING': 'pending',
        'CONFIRMED': 'preparing',
        'PREPARING': 'preparing',
        'READY': 'preparing',
        'ASSIGNED': 'preparing',
        'PICKED_UP': 'on_the_way',
        'ON_THE_WAY': 'on_the_way',
        'DELIVERED': 'delivered',
        'CANCELLED': 'cancelled',
        'REFUNDED': 'cancelled',
      };
      return statusMap[status] || 'pending';
    };

    // Transform active orders
    const formattedActiveOrders = activeOrders.map((order) => ({
      id: order.id,
      restaurantName: order.restaurant.name,
      restaurantImage: order.restaurant.coverImage || '',
      orderNumber: order.orderNumber,
      status: mapStatus(order.status),
      items: order.items.map((item) => ({
        id: item.menuItem.id,
        name: item.menuItem.name,
        quantity: item.quantity,
        price: item.price,
        image: item.menuItem.image || '',
      })),
      total: order.total,
      deliveryAddress: order.deliveryAddress,
      phoneNumber: order.customer.phone || '',
      orderDate: order.placedAt.toISOString(),
      estimatedDelivery: order.estimatedDeliveryTime?.toISOString(),
    }));

    // Transform past orders
    const formattedPastOrders = pastOrders.map((order) => ({
      id: order.id,
      restaurantName: order.restaurant.name,
      restaurantImage: order.restaurant.coverImage || '',
      orderNumber: order.orderNumber,
      status: mapStatus(order.status),
      items: order.items.map((item) => ({
        id: item.menuItem.id,
        name: item.menuItem.name,
        quantity: item.quantity,
        price: item.price,
        image: item.menuItem.image || '',
      })),
      total: order.total,
      deliveryAddress: order.deliveryAddress,
      phoneNumber: order.customer.phone || '',
      orderDate: order.placedAt.toISOString(),
      rating: order.review?.overallRating,
    }));

    return NextResponse.json({
      activeOrders: formattedActiveOrders,
      pastOrders: formattedPastOrders,
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders', activeOrders: [], pastOrders: [] },
      { status: 500 }
    );
  }
}


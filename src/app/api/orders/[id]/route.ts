import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { OrderStatus } from '@prisma/client';

export const dynamic = 'force-dynamic';

// GET order by ID
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const order = await prisma.order.findUnique({
      where: { id: params.id },
      include: {
        restaurant: {
          select: {
            id: true,
            name: true,
            coverImage: true,
            slug: true,
            phone: true,
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
        rider: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
                phone: true,
              },
            },
          },
        },
        items: {
          include: {
            menuItem: {
              select: {
                id: true,
                name: true,
                description: true,
                image: true,
                price: true,
                discountedPrice: true,
              },
            },
          },
        },
        payment: {
          select: {
            method: true,
            status: true,
            amount: true,
          },
        },
        review: {
          select: {
            overallRating: true,
            comment: true,
          },
        },
      },
    });

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    // Map order status
    const mapStatus = (status: OrderStatus): string => {
      return status.toLowerCase().replace('_', ' ');
    };

    const formattedOrder = {
      id: order.id,
      orderNumber: order.orderNumber,
      restaurantName: order.restaurant.name,
      restaurantImage: order.restaurant.coverImage || '',
      restaurantSlug: order.restaurant.slug,
      restaurantPhone: order.restaurant.phone,
      restaurantAddress: `${order.restaurant.address}, ${order.restaurant.city}`,
      status: mapStatus(order.status),
      items: order.items.map(item => ({
        id: item.menuItem.id,
        name: item.menuItem.name,
        description: item.menuItem.description || '',
        quantity: item.quantity,
        price: item.price,
        image: item.menuItem.image || '',
      })),
      subtotal: order.subtotal,
      deliveryFee: order.deliveryFee,
      tax: order.tax,
      discount: order.discount,
      total: order.total,
      deliveryAddress: order.deliveryAddress,
      phoneNumber: order.customer.phone,
      specialInstructions: order.deliveryInstructions || '',
      orderDate: order.placedAt.toISOString(),
      confirmedAt: order.confirmedAt?.toISOString(),
      preparedAt: order.preparedAt?.toISOString(),
      pickedUpAt: order.pickedUpAt?.toISOString(),
      deliveredAt: order.deliveredAt?.toISOString(),
      estimatedDelivery: order.estimatedDeliveryTime?.toISOString(),
      rider: order.rider ? {
        name: `${order.rider.user.firstName} ${order.rider.user.lastName}`,
        phone: order.rider.user.phone,
      } : null,
      payment: order.payment ? {
        method: order.payment.method,
        status: order.payment.status,
        amount: order.payment.amount,
      } : null,
      review: order.review ? {
        rating: order.review.overallRating,
        comment: order.review.comment || '',
      } : null,
    };

    return NextResponse.json({ order: formattedOrder });
  } catch (error) {
    console.error('Error fetching order:', error);
    return NextResponse.json(
      { error: 'Failed to fetch order' },
      { status: 500 }
    );
  }
}


import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

// GET all restaurants
export async function GET(request: Request) {
  try {
    const restaurants = await prisma.restaurant.findMany({
      include: {
        owner: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
        _count: {
          select: {
            orders: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Get ratings for each restaurant
    const restaurantsWithRatings = await Promise.all(
      restaurants.map(async (restaurant) => {
        const reviews = await prisma.review.findMany({
          where: {
            order: {
              restaurantId: restaurant.id,
            },
          },
          select: {
            overallRating: true,
          },
        });

        const rating = reviews.length > 0
          ? reviews.reduce((sum, r) => sum + r.overallRating, 0) / reviews.length
          : 0;

        // Calculate revenue from completed orders
        const completedOrders = await prisma.order.findMany({
          where: {
            restaurantId: restaurant.id,
            status: 'DELIVERED',
          },
        });

        const revenue = completedOrders.reduce((sum, order) => sum + order.total, 0);

        return {
          id: restaurant.id,
          name: restaurant.name,
          owner: `${restaurant.owner.firstName} ${restaurant.owner.lastName}`,
          status: restaurant.status,
          orders: restaurant._count.orders,
          rating: Math.round(rating * 10) / 10,
          revenue: Math.round(revenue),
        };
      })
    );

    return NextResponse.json({ restaurants: restaurantsWithRatings });
  } catch (error) {
    console.error('Error fetching restaurants:', error);
    return NextResponse.json(
      { error: 'Failed to fetch restaurants' },
      { status: 500 }
    );
  }
}

// PUT update restaurant status
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { restaurantId, status } = body;

    if (!restaurantId || !status) {
      return NextResponse.json(
        { error: 'Restaurant ID and status are required' },
        { status: 400 }
      );
    }

    const restaurant = await prisma.restaurant.update({
      where: { id: restaurantId },
      data: { status },
    });

    return NextResponse.json({
      message: 'Restaurant status updated successfully',
      restaurant: {
        id: restaurant.id,
        status: restaurant.status,
      },
    });
  } catch (error: any) {
    console.error('Error updating restaurant:', error);
    return NextResponse.json(
      { error: 'Failed to update restaurant' },
      { status: 500 }
    );
  }
}


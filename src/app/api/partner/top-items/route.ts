import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

// GET top selling items
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const restaurantId = searchParams.get('restaurantId');
    const restaurantSlug = searchParams.get('restaurantSlug');

    // Find restaurant by ID or slug, or get first restaurant (for demo)
    let restaurant;
    if (restaurantId) {
      restaurant = await prisma.restaurant.findUnique({
        where: { id: restaurantId },
      });
    } else if (restaurantSlug) {
      restaurant = await prisma.restaurant.findUnique({
        where: { slug: restaurantSlug },
      });
    } else {
      // Fallback to first restaurant for demo
      restaurant = await prisma.restaurant.findFirst();
    }

    if (!restaurant) {
      return NextResponse.json({ topItems: [] });
    }

    // Get all orders for this restaurant with their items
    const orders = await prisma.order.findMany({
      where: {
        restaurantId: restaurant.id,
        status: 'DELIVERED', // Only count delivered orders
      },
      include: {
        items: {
          include: {
            menuItem: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    // Calculate item statistics
    const itemStats: Record<string, { name: string; orders: number; revenue: number }> = {};

    orders.forEach((order) => {
      order.items.forEach((item) => {
        const menuItemId = item.menuItemId;
        const menuItemName = item.menuItem.name;
        const quantity = item.quantity;
        const itemTotal = item.price * quantity;

        if (!itemStats[menuItemId]) {
          itemStats[menuItemId] = {
            name: menuItemName,
            orders: 0,
            revenue: 0,
          };
        }

        itemStats[menuItemId].orders += quantity;
        itemStats[menuItemId].revenue += itemTotal;
      });
    });

    // Convert to array and sort by revenue
    const topItems = Object.values(itemStats)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10) // Top 10 items
      .map((item) => ({
        name: item.name,
        orders: item.orders,
        revenue: Math.round(item.revenue),
      }));

    return NextResponse.json({ topItems });
  } catch (error) {
    console.error('Error fetching top items:', error);
    return NextResponse.json(
      { error: 'Failed to fetch top items', topItems: [] },
      { status: 500 }
    );
  }
}


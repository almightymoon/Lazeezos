import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const cuisine = searchParams.get('cuisine');
    const city = searchParams.get('city') || 'Karachi';
    const isOpen = searchParams.get('isOpen');
    const isPromoted = searchParams.get('isPromoted');

    const where: any = {
      status: 'ACTIVE',
      city: city,
    };

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { cuisineTypes: { has: search } },
      ];
    }

    if (cuisine) {
      where.cuisineTypes = { has: cuisine };
    }

    if (isOpen !== null) {
      where.isOpen = isOpen === 'true';
    }

    if (isPromoted === 'true') {
      where.isPromoted = true;
    }

    const restaurants = await prisma.restaurant.findMany({
      where,
      include: {
        menu: {
          where: {
            status: 'AVAILABLE',
          },
          take: 5, // Limit menu items for list view
        },
      },
      orderBy: [
        { isPromoted: 'desc' },
        { rating: 'desc' },
        { totalOrders: 'desc' },
      ],
    });

    // Transform to match frontend format
    const formattedRestaurants = restaurants.map((restaurant) => ({
      id: restaurant.id,
      name: restaurant.name,
      image: restaurant.coverImage || '',
      cuisine: restaurant.cuisineTypes,
      rating: restaurant.rating,
      deliveryTime: '25-35 min', // You can calculate this based on distance
      priceRange: restaurant.priceRange,
      deliveryFee: restaurant.deliveryFee,
      minOrder: restaurant.minOrder,
      isPromoted: restaurant.isPromoted,
      discount: restaurant.menu.some((item) => item.discountedPrice)
        ? `${Math.round((((restaurant.menu[0]?.price || 0) - (restaurant.menu[0]?.discountedPrice || 0)) / (restaurant.menu[0]?.price || 1)) * 100)}% OFF`
        : undefined,
      slug: restaurant.slug,
      isOpen: restaurant.isOpen,
    }));

    return NextResponse.json(formattedRestaurants);
  } catch (error) {
    console.error('Error fetching restaurants:', error);
    return NextResponse.json(
      { error: 'Failed to fetch restaurants' },
      { status: 500 }
    );
  }
}


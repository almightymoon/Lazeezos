import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const restaurant = await prisma.restaurant.findUnique({
      where: { slug: params.slug },
      include: {
        menu: {
          where: {
            status: 'AVAILABLE',
          },
          orderBy: [
            { isPopular: 'desc' },
            { category: 'asc' },
            { name: 'asc' },
          ],
        },
      },
    });

    if (!restaurant) {
      return NextResponse.json(
        { error: 'Restaurant not found' },
        { status: 404 }
      );
    }

    // Transform to match frontend format
    const formattedRestaurant = {
      id: restaurant.id,
      name: restaurant.name,
      image: restaurant.coverImage || '',
      cuisine: restaurant.cuisineTypes,
      rating: restaurant.rating,
      deliveryTime: '25-35 min',
      priceRange: restaurant.priceRange,
      deliveryFee: restaurant.deliveryFee,
      minOrder: restaurant.minOrder,
      isPromoted: restaurant.isPromoted,
      slug: restaurant.slug,
      isOpen: restaurant.isOpen,
      description: restaurant.description,
    };

    const formattedMenu = restaurant.menu.map((item) => ({
      id: item.id,
      name: item.name,
      description: item.description,
      price: item.price,
      discountedPrice: item.discountedPrice,
      image: item.image || '',
      category: item.category,
      isPopular: item.isPopular,
      isVeg: item.isVeg,
      isSpicy: item.isSpicy,
    }));

    return NextResponse.json({
      restaurant: formattedRestaurant,
      menu: formattedMenu,
    });
  } catch (error) {
    console.error('Error fetching restaurant:', error);
    return NextResponse.json(
      { error: 'Failed to fetch restaurant' },
      { status: 500 }
    );
  }
}


import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: Request) {
  try {
    // For now, get the first restaurant (for demo)
    // In production, get from authenticated session
    const restaurant = await prisma.restaurant.findFirst({
      include: {
        menu: {
          orderBy: [
            { category: 'asc' },
            { name: 'asc' },
          ],
        },
      },
    });

    if (!restaurant) {
      return NextResponse.json({ menuItems: [] });
    }

    // Transform to match frontend format
    const formattedMenu = restaurant.menu.map((item) => ({
      id: item.id,
      name: item.name,
      description: item.description,
      category: item.category,
      price: item.price,
      discountedPrice: item.discountedPrice,
      status: item.status,
      isPopular: item.isPopular,
      isVeg: item.isVeg,
      isSpicy: item.isSpicy,
      image: item.image,
    }));

    return NextResponse.json({ menuItems: formattedMenu });
  } catch (error) {
    console.error('Error fetching partner menu:', error);
    return NextResponse.json(
      { error: 'Failed to fetch menu', menuItems: [] },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const restaurant = await prisma.restaurant.findFirst();

    if (!restaurant) {
      return NextResponse.json(
        { error: 'Restaurant not found' },
        { status: 404 }
      );
    }

    const menuItem = await prisma.menuItem.create({
      data: {
        restaurantId: restaurant.id,
        name: body.name,
        description: body.description,
        category: body.category,
        price: body.price,
        discountedPrice: body.discountedPrice,
        status: body.status || 'AVAILABLE',
        isPopular: body.isPopular || false,
        isVeg: body.isVeg || false,
        isSpicy: body.isSpicy || false,
        image: body.image,
      },
    });

    return NextResponse.json({ menuItem });
  } catch (error) {
    console.error('Error creating menu item:', error);
    return NextResponse.json(
      { error: 'Failed to create menu item' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;

    const menuItem = await prisma.menuItem.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ menuItem });
  } catch (error) {
    console.error('Error updating menu item:', error);
    return NextResponse.json(
      { error: 'Failed to update menu item' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Menu item ID required' },
        { status: 400 }
      );
    }

    await prisma.menuItem.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting menu item:', error);
    return NextResponse.json(
      { error: 'Failed to delete menu item' },
      { status: 500 }
    );
  }
}



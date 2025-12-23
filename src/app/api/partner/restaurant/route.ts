import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { RestaurantType } from '@prisma/client';

export const dynamic = 'force-dynamic';

// GET restaurant profile
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const restaurantId = searchParams.get('restaurantId');
    const restaurantSlug = searchParams.get('restaurantSlug');

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
      // Fallback to most recently created restaurant
      restaurant = await prisma.restaurant.findFirst({
        orderBy: { createdAt: 'desc' },
      });
    }

    if (!restaurant) {
      return NextResponse.json(
        { error: 'Restaurant not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ restaurant });
  } catch (error) {
    console.error('Error fetching restaurant profile:', error);
    return NextResponse.json(
      { error: 'Failed to fetch restaurant profile' },
      { status: 500 }
    );
  }
}

// PUT update restaurant profile
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const {
      restaurantId,
      restaurantSlug,
      name,
      description,
      email,
      phone,
      businessPhone,
      address,
      city,
      state,
      zipCode,
      country,
      cuisineTypes,
      restaurantType,
      isOpen,
      isPromoted,
      deliveryFee,
      minOrder,
      priceRange,
      operatingHours,
      logo,
      coverImage,
      images,
    } = body;

    // Find restaurant
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
      return NextResponse.json(
        { error: 'Restaurant ID or slug required' },
        { status: 400 }
      );
    }

    if (!restaurant) {
      return NextResponse.json(
        { error: 'Restaurant not found' },
        { status: 404 }
      );
    }

    // Update restaurant - use undefined check instead of truthy check to allow empty strings
    const updateData: any = {};
    
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (email !== undefined) updateData.email = email;
    if (phone !== undefined) updateData.phone = phone;
    if (businessPhone !== undefined) updateData.businessPhone = businessPhone;
    if (address !== undefined) updateData.address = address;
    if (city !== undefined) updateData.city = city;
    if (state !== undefined) updateData.state = state;
    if (zipCode !== undefined) updateData.zipCode = zipCode;
    if (country !== undefined) updateData.country = country;
    if (cuisineTypes !== undefined) updateData.cuisineTypes = cuisineTypes;
    if (restaurantType !== undefined) updateData.restaurantType = restaurantType as RestaurantType;
    if (isOpen !== undefined) updateData.isOpen = isOpen;
    if (isPromoted !== undefined) updateData.isPromoted = isPromoted;
    if (deliveryFee !== undefined) updateData.deliveryFee = deliveryFee;
    if (minOrder !== undefined) updateData.minOrder = minOrder;
    if (priceRange !== undefined) updateData.priceRange = priceRange;
    if (operatingHours !== undefined) updateData.operatingHours = operatingHours;
    if (logo !== undefined) updateData.logo = logo;
    if (coverImage !== undefined) updateData.coverImage = coverImage;
    if (images !== undefined) updateData.images = images;

    // Update restaurant
    const updatedRestaurant = await prisma.restaurant.update({
      where: { id: restaurant.id },
      data: updateData,
    });

    return NextResponse.json({
      message: 'Restaurant profile updated successfully',
      restaurant: updatedRestaurant,
    });
  } catch (error: any) {
    console.error('Error updating restaurant profile:', error);
    
    if (error.code === 'P2002') {
      const field = error.meta?.target?.[0];
      return NextResponse.json(
        { error: `${field} already exists` },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to update restaurant profile' },
      { status: 500 }
    );
  }
}


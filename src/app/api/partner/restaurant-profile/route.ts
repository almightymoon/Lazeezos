import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

// GET restaurant profile
export async function GET(request: Request) {
  try {
    // TODO: In production, get restaurant from authenticated session
    // For now, get the first restaurant (demo purposes)
    const restaurant = await prisma.restaurant.findFirst({
      include: {
        owner: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
          },
        },
      },
    });

    if (!restaurant) {
      return NextResponse.json(
        { error: 'Restaurant not found' },
        { status: 404 }
      );
    }

    // Format operating hours if they exist
    let operatingHours = null;
    if (restaurant.operatingHours) {
      const hours = restaurant.operatingHours as any;
      // Convert from JSON format to array format expected by frontend
      const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
      operatingHours = days.map((day) => {
        const dayKey = day.toLowerCase();
        return {
          day,
          open: hours[dayKey]?.open || '09:00',
          close: hours[dayKey]?.close || '22:00',
        };
      });
    }

    // Format response to match frontend expectations
    const formattedRestaurant = {
      id: restaurant.id,
      name: restaurant.name,
      slug: restaurant.slug,
      description: restaurant.description || '',
      email: restaurant.email,
      phone: restaurant.phone,
      businessPhone: restaurant.businessPhone || '',
      address: restaurant.address,
      city: restaurant.city,
      state: restaurant.state,
      zipCode: restaurant.zipCode,
      country: restaurant.country,
      cuisineTypes: restaurant.cuisineTypes,
      restaurantType: restaurant.restaurantType,
      isOpen: restaurant.isOpen,
      isPromoted: restaurant.isPromoted,
      deliveryFee: restaurant.deliveryFee,
      minOrder: restaurant.minOrder,
      priceRange: restaurant.priceRange,
      operatingHours: operatingHours || [
        { day: 'Monday', open: '09:00', close: '22:00' },
        { day: 'Tuesday', open: '09:00', close: '22:00' },
        { day: 'Wednesday', open: '09:00', close: '22:00' },
        { day: 'Thursday', open: '09:00', close: '22:00' },
        { day: 'Friday', open: '09:00', close: '23:00' },
        { day: 'Saturday', open: '10:00', close: '23:00' },
        { day: 'Sunday', open: '10:00', close: '22:00' },
      ],
      logo: restaurant.logo,
      coverImage: restaurant.coverImage,
      images: restaurant.images,
      status: restaurant.status,
      rating: restaurant.rating,
      totalReviews: restaurant.totalReviews,
      totalOrders: restaurant.totalOrders,
      createdAt: restaurant.createdAt,
      updatedAt: restaurant.updatedAt,
    };

    return NextResponse.json({ restaurant: formattedRestaurant });
  } catch (error) {
    console.error('Error fetching restaurant profile:', error);
    return NextResponse.json(
      { error: 'Failed to fetch restaurant profile' },
      { status: 500 }
    );
  }
}

// PUT/PATCH restaurant profile
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const {
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
      deliveryFee,
      minOrder,
      priceRange,
      operatingHours,
    } = body;

    // Validate required fields
    if (!name || !email || !phone || !address || !city || !state || !zipCode || !country) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Validate deliveryFee and minOrder
    if (deliveryFee < 0 || minOrder < 0) {
      return NextResponse.json(
        { error: 'Delivery fee and minimum order must be non-negative' },
        { status: 400 }
      );
    }

    // TODO: In production, get restaurant from authenticated session
    // For now, get the first restaurant (demo purposes)
    const existingRestaurant = await prisma.restaurant.findFirst();

    if (!existingRestaurant) {
      return NextResponse.json(
        { error: 'Restaurant not found' },
        { status: 404 }
      );
    }

    // Check if name changed and generate new slug if needed
    let slug = existingRestaurant.slug;
    if (name !== existingRestaurant.name) {
      slug = generateSlug(name);
      // Check if slug already exists (for another restaurant)
      const slugExists = await prisma.restaurant.findFirst({
        where: {
          slug,
          id: { not: existingRestaurant.id },
        },
      });
      if (slugExists) {
        // Append a number if slug exists
        let counter = 1;
        let newSlug = `${slug}-${counter}`;
        while (await prisma.restaurant.findFirst({
          where: {
            slug: newSlug,
            id: { not: existingRestaurant.id },
          },
        })) {
          counter++;
          newSlug = `${slug}-${counter}`;
        }
        slug = newSlug;
      }
    }

    // Convert operating hours from array format to JSON format
    let operatingHoursJson: any = null;
    if (operatingHours && Array.isArray(operatingHours)) {
      operatingHoursJson = {};
      operatingHours.forEach((hours: { day: string; open: string; close: string }) => {
        const dayKey = hours.day.toLowerCase();
        operatingHoursJson[dayKey] = {
          open: hours.open,
          close: hours.close,
        };
      });
    }

    // Update restaurant
    const updatedRestaurant = await prisma.restaurant.update({
      where: { id: existingRestaurant.id },
      data: {
        name,
        slug,
        description: description || null,
        email,
        phone,
        businessPhone: businessPhone || null,
        address,
        city,
        state,
        zipCode,
        country,
        cuisineTypes: cuisineTypes || [],
        restaurantType: restaurantType || 'RESTAURANT',
        isOpen: isOpen !== undefined ? isOpen : existingRestaurant.isOpen,
        deliveryFee: deliveryFee !== undefined ? deliveryFee : existingRestaurant.deliveryFee,
        minOrder: minOrder !== undefined ? minOrder : existingRestaurant.minOrder,
        priceRange: priceRange || existingRestaurant.priceRange,
        operatingHours: operatingHoursJson || existingRestaurant.operatingHours,
      },
    });

    // Format operating hours for response
    let formattedOperatingHours = null;
    if (updatedRestaurant.operatingHours) {
      const hours = updatedRestaurant.operatingHours as any;
      const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
      formattedOperatingHours = days.map((day) => {
        const dayKey = day.toLowerCase();
        return {
          day,
          open: hours[dayKey]?.open || '09:00',
          close: hours[dayKey]?.close || '22:00',
        };
      });
    }

    // Format response
    const formattedRestaurant = {
      id: updatedRestaurant.id,
      name: updatedRestaurant.name,
      slug: updatedRestaurant.slug,
      description: updatedRestaurant.description || '',
      email: updatedRestaurant.email,
      phone: updatedRestaurant.phone,
      businessPhone: updatedRestaurant.businessPhone || '',
      address: updatedRestaurant.address,
      city: updatedRestaurant.city,
      state: updatedRestaurant.state,
      zipCode: updatedRestaurant.zipCode,
      country: updatedRestaurant.country,
      cuisineTypes: updatedRestaurant.cuisineTypes,
      restaurantType: updatedRestaurant.restaurantType,
      isOpen: updatedRestaurant.isOpen,
      isPromoted: updatedRestaurant.isPromoted,
      deliveryFee: updatedRestaurant.deliveryFee,
      minOrder: updatedRestaurant.minOrder,
      priceRange: updatedRestaurant.priceRange,
      operatingHours: formattedOperatingHours || [
        { day: 'Monday', open: '09:00', close: '22:00' },
        { day: 'Tuesday', open: '09:00', close: '22:00' },
        { day: 'Wednesday', open: '09:00', close: '22:00' },
        { day: 'Thursday', open: '09:00', close: '22:00' },
        { day: 'Friday', open: '09:00', close: '23:00' },
        { day: 'Saturday', open: '10:00', close: '23:00' },
        { day: 'Sunday', open: '10:00', close: '22:00' },
      ],
      logo: updatedRestaurant.logo,
      coverImage: updatedRestaurant.coverImage,
      images: updatedRestaurant.images,
      status: updatedRestaurant.status,
      rating: updatedRestaurant.rating,
      totalReviews: updatedRestaurant.totalReviews,
      totalOrders: updatedRestaurant.totalOrders,
      updatedAt: updatedRestaurant.updatedAt,
    };

    return NextResponse.json({
      message: 'Restaurant profile updated successfully',
      restaurant: formattedRestaurant,
    });
  } catch (error) {
    console.error('Error updating restaurant profile:', error);
    return NextResponse.json(
      { error: 'Failed to update restaurant profile' },
      { status: 500 }
    );
  }
}

// Helper function to generate slug from name
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .substring(0, 100); // Limit length
}


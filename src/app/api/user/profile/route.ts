import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

// GET user profile
export async function GET(request: Request) {
  try {
    // For now, get the first customer (for demo)
    // In production, get from authenticated session
    const user = await prisma.user.findFirst({
      where: {
        role: 'CUSTOMER',
      },
      include: {
        addresses: {
          where: { isDefault: true },
          take: 1,
        },
        orders: {
          select: {
            id: true,
            total: true,
            status: true,
          },
        },
        reviews: {
          select: {
            overallRating: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const totalSpent = user.orders.reduce((sum, order) => {
      if (order.status === 'DELIVERED') {
        return sum + order.total;
      }
      return sum;
    }, 0);

    const avgRating = user.reviews.length > 0
      ? user.reviews.reduce((sum, r) => sum + r.overallRating, 0) / user.reviews.length
      : 0;

    const defaultAddress = user.addresses[0];

    const profile = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      dateOfBirth: user.dateOfBirth?.toISOString().split('T')[0] || '',
      profileImage: user.profileImage || '',
      address: defaultAddress ? {
        street: defaultAddress.street,
        city: defaultAddress.city,
        state: defaultAddress.state,
        zipCode: defaultAddress.zipCode,
        country: defaultAddress.country || 'Pakistan',
      } : {
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'Pakistan',
      },
      preferences: {
        notifications: {
          email: true,
          sms: false,
          push: true,
        },
        language: 'en',
        theme: 'light' as const,
      },
      stats: {
        totalOrders: user.orders.length,
        totalSpent: Math.round(totalSpent),
        favoriteRestaurants: 0, // Can be enhanced
        averageRating: Math.round(avgRating * 10) / 10,
      },
    };

    return NextResponse.json({ profile });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user profile' },
      { status: 500 }
    );
  }
}

// PUT update user profile
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const {
      firstName,
      lastName,
      email,
      phone,
      dateOfBirth,
      profileImage,
      address,
    } = body;

    // For now, get the first customer (for demo)
    const user = await prisma.user.findFirst({
      where: { role: 'CUSTOMER' },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Update user
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        firstName: firstName || user.firstName,
        lastName: lastName || user.lastName,
        email: email || user.email,
        phone: phone || user.phone,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : user.dateOfBirth,
        profileImage: profileImage || user.profileImage,
      },
    });

    // Update default address if provided
    if (address) {
      const defaultAddress = await prisma.address.findFirst({
        where: {
          userId: user.id,
          isDefault: true,
        },
      });

      if (defaultAddress) {
        await prisma.address.update({
          where: { id: defaultAddress.id },
          data: {
            street: address.street || defaultAddress.street,
            city: address.city || defaultAddress.city,
            state: address.state || defaultAddress.state,
            zipCode: address.zipCode || defaultAddress.zipCode,
            country: address.country || defaultAddress.country,
          },
        });
      } else if (address.street) {
        // Create new default address
        await prisma.address.create({
          data: {
            userId: user.id,
            label: 'Home',
            street: address.street,
            city: address.city || '',
            state: address.state || '',
            zipCode: address.zipCode || '',
            country: address.country || 'Pakistan',
            phone: user.phone,
            isDefault: true,
          },
        });
      }
    }

    return NextResponse.json({
      message: 'Profile updated successfully',
      profile: {
        id: updatedUser.id,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        email: updatedUser.email,
        phone: updatedUser.phone,
      },
    });
  } catch (error: any) {
    console.error('Error updating profile:', error);
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    );
  }
}


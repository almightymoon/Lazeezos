import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { UserRole } from '@prisma/client';

export const dynamic = 'force-dynamic';

// DELETE partner account
export async function DELETE(request: Request) {
  try {
    // For now, get the first restaurant owner (for demo)
    // In production, get from authenticated session
    const user = await prisma.user.findFirst({
      where: { role: UserRole.RESTAURANT_OWNER },
      include: {
        restaurant: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Delete restaurant and all related data (cascade will handle menu items, orders, etc.)
    if (user.restaurant) {
      await prisma.restaurant.delete({
        where: { id: user.restaurant.id },
      });
    }

    // Delete user (this will cascade delete addresses, orders, reviews, payments, etc.)
    await prisma.user.delete({
      where: { id: user.id },
    });

    return NextResponse.json({
      message: 'Account deleted successfully',
    });
  } catch (error: any) {
    console.error('Error deleting partner account:', error);
    return NextResponse.json(
      { error: 'Failed to delete account' },
      { status: 500 }
    );
  }
}


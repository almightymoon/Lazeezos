import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { UserRole } from '@prisma/client';
const bcrypt = require('bcryptjs');

export const dynamic = 'force-dynamic';

// GET partner profile
export async function GET(request: Request) {
  try {
    // For now, get the first restaurant owner (for demo)
    // In production, get from authenticated session
    const user = await prisma.user.findFirst({
      where: { role: UserRole.RESTAURANT_OWNER },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        avatar: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error('Error fetching partner profile:', error);
    return NextResponse.json(
      { error: 'Failed to fetch profile' },
      { status: 500 }
    );
  }
}

// PUT update partner profile
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { firstName, lastName, email, phone, avatar, password, currentPassword } = body;

    // For now, get the first restaurant owner (for demo)
    // In production, get from authenticated session
    const user = await prisma.user.findFirst({
      where: { role: UserRole.RESTAURANT_OWNER },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // If password is being changed, verify current password
    let passwordHash = user.passwordHash;
    if (password && currentPassword) {
      if (!user.passwordHash) {
        return NextResponse.json(
          { error: 'Current password is required' },
          { status: 400 }
        );
      }

      const isValidPassword = await bcrypt.compare(currentPassword, user.passwordHash);
      if (!isValidPassword) {
        return NextResponse.json(
          { error: 'Current password is incorrect' },
          { status: 401 }
        );
      }

      passwordHash = await bcrypt.hash(password, 10);
    }

    // Check if email or phone already exists (if changed)
    if (email && email !== user.email) {
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });
      if (existingUser) {
        return NextResponse.json(
          { error: 'Email already exists' },
          { status: 409 }
        );
      }
    }

    if (phone && phone !== user.phone) {
      const existingUser = await prisma.user.findUnique({
        where: { phone },
      });
      if (existingUser) {
        return NextResponse.json(
          { error: 'Phone number already exists' },
          { status: 409 }
        );
      }
    }

    // Update user
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        ...(firstName && { firstName }),
        ...(lastName && { lastName }),
        ...(email && { email }),
        ...(phone && { phone }),
        ...(avatar && { avatar }),
        ...(passwordHash && { passwordHash }),
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        avatar: true,
      },
    });

    return NextResponse.json({
      message: 'Profile updated successfully',
      user: updatedUser,
    });
  } catch (error: any) {
    console.error('Error updating partner profile:', error);
    
    if (error.code === 'P2002') {
      const field = error.meta?.target?.[0];
      return NextResponse.json(
        { error: `${field} already exists` },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    );
  }
}


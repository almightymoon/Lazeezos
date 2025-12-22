import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { UserRole, UserStatus, RestaurantStatus, RestaurantType } from '@prisma/client';

export const dynamic = 'force-dynamic';

// Hash password function using dynamic import
async function hashPassword(password: string): Promise<string> {
  const bcrypt = (await import('bcryptjs')).default;
  return new Promise((resolve, reject) => {
    bcrypt.hash(password, 10, (err: Error | null, hash: string) => {
      if (err) reject(err);
      else resolve(hash);
    });
  });
}

// Helper function to generate slug from restaurant name
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .substring(0, 100); // Limit length
}

// Helper function to map business type to RestaurantType enum
function mapBusinessTypeToRestaurantType(businessType: string): RestaurantType {
  const typeMap: Record<string, RestaurantType> = {
    'restaurant': RestaurantType.RESTAURANT,
    'cloud-kitchen': RestaurantType.CLOUD_KITCHEN,
    'home-chef': RestaurantType.HOME_CHEF,
    'grocery-store': RestaurantType.OTHER,
    'pharmacy': RestaurantType.OTHER,
    'other': RestaurantType.OTHER,
  };
  return typeMap[businessType] || RestaurantType.OTHER;
}

// Helper function to extract city from address (simple implementation)
function extractCityFromAddress(address: string): { city: string; state: string; zipCode: string } {
  // Simple extraction - in production, use a geocoding service
  const parts = address.split(',').map(p => p.trim());
  const city = parts.length > 1 ? parts[parts.length - 2] : 'Karachi';
  const state = parts.length > 1 ? parts[parts.length - 1] : 'Sindh';
  const zipCode = '75000'; // Default zip code
  
  return { city, state, zipCode };
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      restaurantName,
      ownerName,
      email,
      phone,
      password,
      businessType,
      address,
    } = body;

    // Validate required fields
    if (!restaurantName || !ownerName || !email || !phone || !password || !businessType || !address) {
      return NextResponse.json(
        { error: 'All fields are required' },
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

    // Validate password length
    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email },
          { phone },
        ],
      },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email or phone already exists' },
        { status: 409 }
      );
    }

    // Check if restaurant name already exists and generate unique slug
    let slug = generateSlug(restaurantName);
    let existingRestaurant = await prisma.restaurant.findUnique({
      where: { slug },
    });

    if (existingRestaurant) {
      // If slug exists, append a number
      let counter = 1;
      let newSlug = `${slug}-${counter}`;
      while (await prisma.restaurant.findUnique({ where: { slug: newSlug } })) {
        counter++;
        newSlug = `${slug}-${counter}`;
      }
      slug = newSlug;
    }

    // Hash password
    const passwordHash = await hashPassword(password);

    // Extract owner first and last name
    const nameParts = ownerName.trim().split(' ');
    const firstName = nameParts[0] || ownerName;
    const lastName = nameParts.slice(1).join(' ') || '';

    // Extract city, state, zipCode from address
    const { city, state, zipCode } = extractCityFromAddress(address);

    // Map business type to RestaurantType
    const restaurantType = mapBusinessTypeToRestaurantType(businessType);

    // Create user and restaurant in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create user
      const user = await tx.user.create({
        data: {
          email,
          phone,
          firstName,
          lastName,
          passwordHash,
          role: UserRole.RESTAURANT_OWNER,
          status: UserStatus.PENDING_VERIFICATION,
          emailVerified: false,
          phoneVerified: false,
        },
      });

      // Create restaurant
      const restaurant = await tx.restaurant.create({
        data: {
          ownerId: user.id,
          name: restaurantName,
          slug: generateSlug(restaurantName),
          description: `Welcome to ${restaurantName}!`,
          cuisineTypes: [], // Can be updated later
          restaurantType,
          email,
          phone,
          address,
          city,
          state,
          zipCode,
          country: 'Pakistan',
          status: RestaurantStatus.ACTIVE, // Set to ACTIVE for demo. In production, use PENDING and require admin approval
          isOpen: false,
          isPromoted: false,
          rating: 0,
          totalReviews: 0,
          totalOrders: 0,
          deliveryFee: 0,
          minOrder: 0,
          priceRange: '$$',
          operatingHours: {
            monday: { open: '09:00', close: '22:00' },
            tuesday: { open: '09:00', close: '22:00' },
            wednesday: { open: '09:00', close: '22:00' },
            thursday: { open: '09:00', close: '22:00' },
            friday: { open: '09:00', close: '23:00' },
            saturday: { open: '10:00', close: '23:00' },
            sunday: { open: '10:00', close: '22:00' },
          },
        },
      });

      return { user, restaurant };
    });

    return NextResponse.json(
      {
        message: 'Account created successfully! Your restaurant is pending approval.',
        user: {
          id: result.user.id,
          email: result.user.email,
          role: result.user.role,
        },
        restaurant: {
          id: result.restaurant.id,
          name: result.restaurant.name,
          slug: result.restaurant.slug,
          status: result.restaurant.status,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error creating partner account:', error);
    
    // Handle Prisma unique constraint errors
    if (error.code === 'P2002') {
      const field = error.meta?.target?.[0];
      return NextResponse.json(
        { error: `${field} already exists` },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create account. Please try again.' },
      { status: 500 }
    );
  }
}


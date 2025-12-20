/**
 * Database Query Helpers
 * Common queries for PostgreSQL operations
 */

import { prisma } from './db';
import type { 
  UserRole, 
  RestaurantStatus,
  RestaurantType,
  OrderStatus, 
  PaymentStatus,
  RiderStatus 
} from '@prisma/client';

// ============================================
// USER QUERIES
// ============================================

export const UserQueries = {
  async findByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
      include: {
        restaurant: true,
        rider: true,
        addresses: true,
      },
    });
  },

  async findByPhone(phone: string) {
    return prisma.user.findUnique({
      where: { phone },
    });
  },

  async createCustomer(data: {
    email: string;
    phone: string;
    firstName: string;
    lastName: string;
    passwordHash: string;
  }) {
    return prisma.user.create({
      data: {
        ...data,
        role: 'CUSTOMER',
        status: 'PENDING_VERIFICATION',
      },
    });
  },

  async createRestaurantOwner(data: {
    email: string;
    phone: string;
    firstName: string;
    lastName: string;
    passwordHash: string;
  }) {
    return prisma.user.create({
      data: {
        ...data,
        role: 'RESTAURANT_OWNER',
        status: 'PENDING_VERIFICATION',
      },
    });
  },
};

// ============================================
// RESTAURANT QUERIES
// ============================================

export const RestaurantQueries = {
  async findById(id: string) {
    return prisma.restaurant.findUnique({
      where: { id },
      include: {
        owner: true,
        menu: {
          where: { status: 'AVAILABLE' },
          orderBy: { category: 'asc' },
        },
        reviews: {
          take: 10,
          orderBy: { createdAt: 'desc' },
          include: {
            customer: {
              select: {
                firstName: true,
                lastName: true,
                avatar: true,
              },
            },
          },
        },
      },
    });
  },

  async findBySlug(slug: string) {
    return prisma.restaurant.findUnique({
      where: { slug },
      include: {
        menu: {
          where: { status: 'AVAILABLE' },
        },
      },
    });
  },

  async findNearby(lat: number, lng: number, radiusKm: number = 10) {
    // Note: This is a simplified version. For production, use PostGIS for proper geospatial queries
    return prisma.restaurant.findMany({
      where: {
        status: 'ACTIVE',
        isOpen: true,
        latitude: {
          gte: lat - (radiusKm / 111), // Rough conversion: 1 degree ≈ 111 km
          lte: lat + (radiusKm / 111),
        },
        longitude: {
          gte: lng - (radiusKm / 111),
          lte: lng + (radiusKm / 111),
        },
      },
      orderBy: {
        rating: 'desc',
      },
      take: 50,
    });
  },

  async create(data: {
    ownerId: string;
    name: string;
    slug: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    restaurantType: RestaurantType | string;
    cuisineTypes: string[];
  }) {
    return prisma.restaurant.create({
      data: {
        ...data,
        restaurantType: data.restaurantType as RestaurantType,
        status: 'PENDING',
      },
      include: {
        owner: true,
      },
    });
  },
};

// ============================================
// ORDER QUERIES
// ============================================

export const OrderQueries = {
  async findById(id: string) {
    return prisma.order.findUnique({
      where: { id },
      include: {
        customer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            phone: true,
          },
        },
        restaurant: {
          select: {
            id: true,
            name: true,
            address: true,
            phone: true,
          },
        },
        rider: {
          select: {
            id: true,
            user: {
              select: {
                firstName: true,
                lastName: true,
                phone: true,
              },
            },
          },
        },
        items: {
          include: {
            menuItem: true,
          },
        },
        payment: true,
      },
    });
  },

  async findByOrderNumber(orderNumber: string) {
    return prisma.order.findUnique({
      where: { orderNumber },
      include: {
        items: {
          include: {
            menuItem: true,
          },
        },
      },
    });
  },

  async createOrder(data: {
    customerId: string;
    restaurantId: string;
    items: Array<{
      menuItemId: string;
      quantity: number;
      price: number;
      customizations?: any;
    }>;
    subtotal: number;
    deliveryFee: number;
    total: number;
    deliveryAddress: string;
    deliveryCity: string;
    deliveryState: string;
    deliveryZipCode: string;
    paymentMethod: string;
  }) {
    // Generate order number
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    return prisma.order.create({
      data: {
        orderNumber,
        customerId: data.customerId,
        restaurantId: data.restaurantId,
        subtotal: data.subtotal,
        deliveryFee: data.deliveryFee,
        total: data.total,
        deliveryAddress: data.deliveryAddress,
        deliveryCity: data.deliveryCity,
        deliveryState: data.deliveryState,
        deliveryZipCode: data.deliveryZipCode,
        paymentMethod: data.paymentMethod as any,
        items: {
          create: data.items.map(item => ({
            menuItemId: item.menuItemId,
            quantity: item.quantity,
            price: item.price,
            subtotal: item.price * item.quantity,
            customizations: item.customizations,
          })),
        },
        payment: {
          create: {
            userId: data.customerId,
            amount: data.total,
            method: data.paymentMethod as any,
            status: 'PENDING',
          },
        },
      },
      include: {
        items: {
          include: {
            menuItem: true,
          },
        },
      },
    });
  },

  async updateOrderStatus(orderId: string, status: OrderStatus) {
    const updateData: any = { status };
    
    if (status === 'CONFIRMED') {
      updateData.confirmedAt = new Date();
    } else if (status === 'PREPARING') {
      updateData.preparedAt = new Date();
    } else if (status === 'PICKED_UP') {
      updateData.pickedUpAt = new Date();
    } else if (status === 'DELIVERED') {
      updateData.deliveredAt = new Date();
    } else if (status === 'CANCELLED') {
      updateData.cancelledAt = new Date();
    }

    return prisma.order.update({
      where: { id: orderId },
      data: updateData,
    });
  },
};

// ============================================
// RIDER QUERIES
// ============================================

export const RiderQueries = {
  async findById(id: string) {
    return prisma.rider.findUnique({
      where: { id },
      include: {
        user: true,
        orders: {
          where: {
            status: {
              in: ['ASSIGNED', 'PICKED_UP', 'ON_THE_WAY'],
            },
          },
        },
      },
    });
  },

  async findAvailable() {
    return prisma.rider.findMany({
      where: {
        status: {
          in: ['ONLINE', 'ON_DELIVERY'],
        },
      },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            phone: true,
          },
        },
      },
    });
  },
};



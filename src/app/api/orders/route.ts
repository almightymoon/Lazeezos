import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { OrderStatus, PaymentMethod, PaymentStatus } from '@prisma/client';

export const dynamic = 'force-dynamic';

// GET orders (active and past)
export async function GET(request: Request) {
  try {
    // For now, get the first customer (for demo)
    // In production, get from authenticated session
    const customer = await prisma.user.findFirst({
      where: { role: 'CUSTOMER' },
    });

    if (!customer) {
      return NextResponse.json({ activeOrders: [], pastOrders: [] });
    }

    const orders = await prisma.order.findMany({
      where: { customerId: customer.id },
      include: {
        customer: {
          select: {
            phone: true,
          },
        },
        restaurant: {
          select: {
            id: true,
            name: true,
            coverImage: true,
            slug: true,
          },
        },
        items: {
          include: {
            menuItem: {
              select: {
                id: true,
                name: true,
                image: true,
                price: true,
                discountedPrice: true,
              },
            },
          },
        },
      },
      orderBy: { placedAt: 'desc' },
    });

    // Separate active and past orders
    const activeStatuses = ['PENDING', 'CONFIRMED', 'PREPARING', 'READY', 'ASSIGNED', 'PICKED_UP', 'ON_THE_WAY'];
    const activeOrders = orders
      .filter(order => activeStatuses.includes(order.status))
      .map(order => ({
        id: order.id,
        orderNumber: order.orderNumber,
        restaurantName: order.restaurant.name,
        restaurantImage: order.restaurant.coverImage || '',
        restaurantSlug: order.restaurant.slug,
        status: order.status.toLowerCase().replace('_', ' '),
        items: order.items.map(item => ({
          id: item.menuItem.id,
          name: item.menuItem.name,
          quantity: item.quantity,
          price: item.price,
          image: item.menuItem.image || '',
        })),
        subtotal: order.subtotal,
        deliveryFee: order.deliveryFee,
        tax: order.tax,
        total: order.total,
        deliveryAddress: order.deliveryAddress,
        phoneNumber: order.customer.phone || '',
        orderDate: order.placedAt.toISOString(),
        estimatedDelivery: order.estimatedDeliveryTime?.toISOString(),
      }));

    const pastOrders = orders
      .filter(order => !activeStatuses.includes(order.status))
      .map(order => ({
        id: order.id,
        orderNumber: order.orderNumber,
        restaurantName: order.restaurant.name,
        restaurantImage: order.restaurant.coverImage || '',
        restaurantSlug: order.restaurant.slug,
        status: order.status.toLowerCase().replace('_', ' '),
        items: order.items.map(item => ({
          id: item.menuItem.id,
          name: item.menuItem.name,
          quantity: item.quantity,
          price: item.price,
          image: item.menuItem.image || '',
        })),
        subtotal: order.subtotal,
        deliveryFee: order.deliveryFee,
        tax: order.tax,
        total: order.total,
        deliveryAddress: order.deliveryAddress,
        phoneNumber: order.customer.phone || '',
        orderDate: order.placedAt.toISOString(),
        estimatedDelivery: order.estimatedDeliveryTime?.toISOString(),
      }));

    return NextResponse.json({ activeOrders, pastOrders });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders', activeOrders: [], pastOrders: [] },
      { status: 500 }
    );
  }
}

// POST create new order
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      restaurantId,
      items, // Array of { menuItemId, quantity }
      deliveryAddress,
      phoneNumber,
      specialInstructions,
      paymentMethod,
      subtotal,
      deliveryFee,
      tax,
      total,
    } = body;

    // Validate required fields
    if (!restaurantId || !items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: 'Restaurant ID and items are required' },
        { status: 400 }
      );
    }

    if (!deliveryAddress || !phoneNumber) {
      return NextResponse.json(
        { error: 'Delivery address and phone number are required' },
        { status: 400 }
      );
    }

    // For now, get the first customer (for demo)
    // In production, get from authenticated session
    const customer = await prisma.user.findFirst({
      where: { role: 'CUSTOMER' },
    });

    if (!customer) {
      return NextResponse.json(
        { error: 'Customer not found' },
        { status: 404 }
      );
    }

    // Verify restaurant exists
    const restaurant = await prisma.restaurant.findUnique({
      where: { id: restaurantId },
    });

    if (!restaurant) {
      return NextResponse.json(
        { error: 'Restaurant not found' },
        { status: 404 }
      );
    }

    // Verify menu items exist and are available
    const menuItemIds = items.map((item: any) => item.menuItemId);
    const menuItems = await prisma.menuItem.findMany({
      where: {
        id: { in: menuItemIds },
        restaurantId: restaurantId,
        status: 'AVAILABLE',
      },
    });

    if (menuItems.length !== menuItemIds.length) {
      return NextResponse.json(
        { error: 'Some menu items are not available' },
        { status: 400 }
      );
    }

    // Generate order number
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;

    // Parse delivery address
    const addressParts = deliveryAddress.split(', ');
    const deliveryCity = addressParts.length > 1 ? addressParts[addressParts.length - 2] : '';
    const deliveryState = addressParts.length > 1 ? addressParts[addressParts.length - 1] : '';
    const deliveryZipCode = '';

    // Create order with items in a transaction
    const order = await prisma.$transaction(async (tx) => {
      // Create order
      const newOrder = await tx.order.create({
        data: {
          orderNumber,
          customerId: customer.id,
          restaurantId: restaurantId,
          deliveryAddress,
          deliveryCity: deliveryCity || '',
          deliveryState: deliveryState || '',
          deliveryZipCode: deliveryZipCode,
          deliveryInstructions: specialInstructions || null,
          subtotal: subtotal || 0,
          deliveryFee: deliveryFee || restaurant.deliveryFee,
          tax: tax || 0,
          total: total || 0,
          status: OrderStatus.PENDING,
          paymentMethod: (paymentMethod as PaymentMethod) || PaymentMethod.CASH,
        },
      });

      // Create order items
      const orderItems = await Promise.all(
        items.map(async (item: any) => {
          const menuItem = menuItems.find(mi => mi.id === item.menuItemId);
          const itemPrice = menuItem?.discountedPrice || menuItem?.price || 0;
          
          return tx.orderItem.create({
            data: {
              orderId: newOrder.id,
              menuItemId: item.menuItemId,
              quantity: item.quantity,
              price: itemPrice,
              subtotal: itemPrice * item.quantity,
            },
          });
        })
      );

      // Create payment record
      await tx.payment.create({
        data: {
          orderId: newOrder.id,
          userId: customer.id,
          amount: total || 0,
          method: (paymentMethod as PaymentMethod) || PaymentMethod.CASH,
          status: PaymentStatus.PENDING,
        },
      });

      // Update restaurant total orders
      await tx.restaurant.update({
        where: { id: restaurantId },
        data: {
          totalOrders: { increment: 1 },
        },
      });

      return { order: newOrder, items: orderItems };
    });

    // Fetch the complete order with relations
    const createdOrder = await prisma.order.findUnique({
      where: { id: order.order.id },
      include: {
        restaurant: {
          select: {
            name: true,
            coverImage: true,
            slug: true,
          },
        },
        customer: {
          select: {
            phone: true,
          },
        },
        items: {
          include: {
            menuItem: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json(
      {
        message: 'Order placed successfully',
        order: {
          id: createdOrder!.id,
          orderNumber: createdOrder!.orderNumber,
          restaurantName: createdOrder!.restaurant.name,
          restaurantImage: createdOrder!.restaurant.coverImage || '',
          restaurantSlug: createdOrder!.restaurant.slug,
          status: createdOrder!.status.toLowerCase().replace('_', ' '),
          items: createdOrder!.items.map(item => ({
            id: item.menuItem.id,
            name: item.menuItem.name,
            quantity: item.quantity,
            price: item.price,
            image: item.menuItem.image || '',
          })),
          subtotal: createdOrder!.subtotal,
          deliveryFee: createdOrder!.deliveryFee,
          tax: createdOrder!.tax,
          total: createdOrder!.total,
          deliveryAddress: createdOrder!.deliveryAddress,
          phoneNumber: createdOrder!.customer.phone || '',
          orderDate: createdOrder!.placedAt.toISOString(),
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
}

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

// POST create review for an order
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { rating, comment } = body;

    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      );
    }

    // Get the order
    const order = await prisma.order.findUnique({
      where: { id: params.id },
      include: {
        restaurant: true,
      },
    });

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    // Check if order is delivered
    if (order.status !== 'DELIVERED') {
      return NextResponse.json(
        { error: 'Can only review delivered orders' },
        { status: 400 }
      );
    }

    // Check if review already exists
    const existingReview = await prisma.review.findUnique({
      where: { orderId: order.id },
    });

    if (existingReview) {
      return NextResponse.json(
        { error: 'Review already exists for this order' },
        { status: 400 }
      );
    }

    // Create review
    const review = await prisma.review.create({
      data: {
        orderId: order.id,
        restaurantId: order.restaurantId,
        customerId: order.customerId,
        overallRating: rating,
        foodRating: rating, // Can be enhanced to have separate ratings
        deliveryRating: rating,
        serviceRating: rating,
        comment: comment || null,
      },
    });

    // Update restaurant average rating
    const restaurantReviews = await prisma.review.findMany({
      where: { restaurantId: order.restaurantId },
      select: { overallRating: true },
    });

    if (restaurantReviews.length > 0) {
      const avgRating = restaurantReviews.reduce((sum, r) => sum + r.overallRating, 0) / restaurantReviews.length;

      await prisma.restaurant.update({
        where: { id: order.restaurantId },
        data: {
          rating: Math.round(avgRating * 10) / 10,
          totalReviews: restaurantReviews.length,
        },
      });
    }

    return NextResponse.json({
      message: 'Review submitted successfully',
      review: {
        id: review.id,
        rating: review.overallRating,
        comment: review.comment,
      },
    });
  } catch (error: any) {
    console.error('Error creating review:', error);
    return NextResponse.json(
      { error: 'Failed to submit review' },
      { status: 500 }
    );
  }
}


import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { PaymentMethod } from '@prisma/client';

export const dynamic = 'force-dynamic';

// GET payment methods
// Note: Since there's no PaymentMethod model, we'll store them in User model as JSON
// or return a simple list. For now, we'll return a default list and allow saving preferences.
export async function GET(request: Request) {
  try {
    // For now, get the first customer (for demo)
    // In production, get from authenticated session
    const customer = await prisma.user.findFirst({
      where: { role: 'CUSTOMER' },
    });

    if (!customer) {
      // Return default payment methods
      return NextResponse.json({
        paymentMethods: [
          {
            id: 'cash',
            type: 'CASH',
            label: 'Cash on Delivery',
            isDefault: true,
          },
        ],
      });
    }

    // For now, return default payment methods
    // In production, you could store payment methods in User model as JSON
    // or create a separate PaymentMethod model
    const paymentMethods = [
      {
        id: 'cash',
        type: 'CASH',
        label: 'Cash on Delivery',
        isDefault: true,
      },
      {
        id: 'card',
        type: 'CARD',
        label: 'Credit/Debit Card',
        isDefault: false,
      },
      {
        id: 'wallet',
        type: 'MOBILE_WALLET',
        label: 'Mobile Wallet',
        isDefault: false,
      },
    ];

    return NextResponse.json({ paymentMethods });
  } catch (error) {
    console.error('Error fetching payment methods:', error);
    return NextResponse.json(
      { error: 'Failed to fetch payment methods', paymentMethods: [] },
      { status: 500 }
    );
  }
}

// POST save payment method preference
// Note: This is a simplified version. In production, you'd want to:
// 1. Create a PaymentMethod model, or
// 2. Store in User model as JSON, or
// 3. Use a payment gateway that stores cards securely
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { type, label, cardNumber, expiryDate, cvv, walletName, phoneNumber, isDefault } = body;

    // For now, just return success
    // In production, you'd save this securely (never store full card numbers)
    // Use a payment gateway like Stripe, PayPal, etc. for card storage

    return NextResponse.json({
      message: 'Payment method saved (demo mode - not persisted)',
      paymentMethod: {
        id: `pm_${Date.now()}`,
        type,
        label: label || type,
        isDefault: isDefault || false,
      },
    });
  } catch (error: any) {
    console.error('Error saving payment method:', error);
    return NextResponse.json(
      { error: 'Failed to save payment method' },
      { status: 500 }
    );
  }
}

// DELETE payment method
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Payment method ID is required' },
        { status: 400 }
      );
    }

    // For now, just return success
    // In production, delete from database or payment gateway

    return NextResponse.json({ message: 'Payment method deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting payment method:', error);
    return NextResponse.json(
      { error: 'Failed to delete payment method' },
      { status: 500 }
    );
  }
}


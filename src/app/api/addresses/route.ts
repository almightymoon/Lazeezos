import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

// GET addresses
export async function GET(request: Request) {
  try {
    // For now, get the first customer (for demo)
    // In production, get from authenticated session
    const customer = await prisma.user.findFirst({
      where: { role: 'CUSTOMER' },
      include: {
        addresses: {
          orderBy: [
            { isDefault: 'desc' },
            { createdAt: 'desc' },
          ],
        },
      },
    });

    if (!customer) {
      return NextResponse.json({ addresses: [] });
    }

    const formattedAddresses = customer.addresses.map(address => ({
      id: address.id,
      label: address.label || 'Home',
      street: address.address, // Address model uses 'address' field, not 'street'
      city: address.city,
      state: address.state,
      zipCode: address.zipCode,
      phone: address.contactPhone || customer.phone,
      isDefault: address.isDefault,
      latitude: address.latitude,
      longitude: address.longitude,
    }));

    return NextResponse.json({ addresses: formattedAddresses });
  } catch (error) {
    console.error('Error fetching addresses:', error);
    return NextResponse.json(
      { error: 'Failed to fetch addresses', addresses: [] },
      { status: 500 }
    );
  }
}

// POST create new address
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      label,
      street,
      city,
      state,
      zipCode,
      phone,
      isDefault,
      latitude,
      longitude,
    } = body;

    // Validate required fields
    if (!street || !city || !state || !zipCode) {
      return NextResponse.json(
        { error: 'Street, city, state, and zip code are required' },
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

    // If this is set as default, unset other defaults
    if (isDefault) {
      await prisma.address.updateMany({
        where: {
          userId: customer.id,
          isDefault: true,
        },
        data: {
          isDefault: false,
        },
      });
    }

    const address = await prisma.address.create({
      data: {
        userId: customer.id,
        label: label || 'Home',
        address: street, // Use 'address' field, not 'street'
        city,
        state,
        zipCode,
        contactPhone: phone || customer.phone || null,
        isDefault: isDefault || false,
        latitude: latitude || null,
        longitude: longitude || null,
      },
    });

    return NextResponse.json(
      {
        message: 'Address created successfully',
        address: {
          id: address.id,
          label: address.label || 'Home',
          street: address.address, // Map 'address' field to 'street' for frontend
          city: address.city,
          state: address.state,
          zipCode: address.zipCode,
          phone: address.contactPhone || customer.phone,
          isDefault: address.isDefault,
          latitude: address.latitude,
          longitude: address.longitude,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error creating address:', error);
    return NextResponse.json(
      { error: 'Failed to create address' },
      { status: 500 }
    );
  }
}

// PUT update address
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const {
      id,
      label,
      street,
      city,
      state,
      zipCode,
      phone,
      isDefault,
      latitude,
      longitude,
    } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Address ID is required' },
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

    // Verify address belongs to customer
    const existingAddress = await prisma.address.findFirst({
      where: {
        id,
        userId: customer.id,
      },
    });

    if (!existingAddress) {
      return NextResponse.json(
        { error: 'Address not found' },
        { status: 404 }
      );
    }

    // If this is set as default, unset other defaults
    if (isDefault) {
      await prisma.address.updateMany({
        where: {
          userId: customer.id,
          isDefault: true,
          id: { not: id },
        },
        data: {
          isDefault: false,
        },
      });
    }

    const updateData: any = {};
    if (label !== undefined) updateData.label = label;
    if (street !== undefined) updateData.address = street; // Use 'address' field
    if (city !== undefined) updateData.city = city;
    if (state !== undefined) updateData.state = state;
    if (zipCode !== undefined) updateData.zipCode = zipCode;
    if (phone !== undefined) updateData.contactPhone = phone; // Use 'contactPhone' field
    if (isDefault !== undefined) updateData.isDefault = isDefault;
    if (latitude !== undefined) updateData.latitude = latitude;
    if (longitude !== undefined) updateData.longitude = longitude;

    const address = await prisma.address.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({
      message: 'Address updated successfully',
      address: {
        id: address.id,
        label: address.label || 'Home',
        street: address.address, // Map 'address' field to 'street' for frontend
        city: address.city,
        state: address.state,
        zipCode: address.zipCode,
        phone: address.contactPhone || customer.phone,
        isDefault: address.isDefault,
        latitude: address.latitude,
        longitude: address.longitude,
      },
    });
  } catch (error: any) {
    console.error('Error updating address:', error);
    return NextResponse.json(
      { error: 'Failed to update address' },
      { status: 500 }
    );
  }
}

// DELETE address
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Address ID is required' },
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

    // Verify address belongs to customer
    const address = await prisma.address.findFirst({
      where: {
        id,
        userId: customer.id,
      },
    });

    if (!address) {
      return NextResponse.json(
        { error: 'Address not found' },
        { status: 404 }
      );
    }

    await prisma.address.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Address deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting address:', error);
    return NextResponse.json(
      { error: 'Failed to delete address' },
      { status: 500 }
    );
  }
}


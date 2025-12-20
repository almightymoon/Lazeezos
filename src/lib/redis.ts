/**
 * Redis Service Layer
 * Handles all real-time data operations
 * 
 * Use cases:
 * - Live order status
 * - Rider availability
 * - Rider ↔ order assignment
 * - Temporary carts
 * - OTPs
 * - Rate limiting
 */

import { redis } from './db';

// ============================================
// ORDER STATUS (Real-time)
// ============================================

export const OrderStatusRedis = {
  /**
   * Set live order status
   */
  async setOrderStatus(orderId: string, status: string, data?: Record<string, any>) {
    const key = `order:status:${orderId}`;
    await redis.setex(key, 3600, JSON.stringify({ status, ...data, updatedAt: new Date().toISOString() }));
  },

  /**
   * Get live order status
   */
  async getOrderStatus(orderId: string) {
    const key = `order:status:${orderId}`;
    const data = await redis.get(key);
    return data ? JSON.parse(data) : null;
  },

  /**
   * Remove order status (when order is completed/cancelled)
   */
  async removeOrderStatus(orderId: string) {
    const key = `order:status:${orderId}`;
    await redis.del(key);
  },

  /**
   * Set order tracking data
   */
  async setOrderTracking(orderId: string, trackingData: {
    status: string;
    riderId?: string;
    estimatedDeliveryTime?: string;
    currentLocation?: { lat: number; lng: number };
  }) {
    const key = `order:tracking:${orderId}`;
    await redis.setex(key, 7200, JSON.stringify(trackingData));
  },

  /**
   * Get order tracking data
   */
  async getOrderTracking(orderId: string) {
    const key = `order:tracking:${orderId}`;
    const data = await redis.get(key);
    return data ? JSON.parse(data) : null;
  },
};

// ============================================
// RIDER AVAILABILITY & LOCATION
// ============================================

export const RiderRedis = {
  /**
   * Set rider as available
   */
  async setRiderAvailable(riderId: string, location: { lat: number; lng: number }) {
    const key = `rider:available:${riderId}`;
    await redis.setex(key, 300, JSON.stringify({
      location,
      availableAt: new Date().toISOString(),
    }));
    
    // Add to available riders set
    await redis.zadd('riders:available', Date.now(), riderId);
    
    // Update rider location in GeoHash
    await redis.geoadd('riders:locations', location.lng, location.lat, riderId);
  },

  /**
   * Set rider as busy/on delivery
   */
  async setRiderBusy(riderId: string, orderId: string) {
    const key = `rider:busy:${riderId}`;
    await redis.setex(key, 3600, JSON.stringify({
      orderId,
      busyAt: new Date().toISOString(),
    }));
    
    // Remove from available riders
    await redis.zrem('riders:available', riderId);
  },

  /**
   * Check if rider is available
   */
  async isRiderAvailable(riderId: string): Promise<boolean> {
    const key = `rider:available:${riderId}`;
    return (await redis.exists(key)) === 1;
  },

  /**
   * Get nearby available riders
   */
  async getNearbyRiders(location: { lat: number; lng: number }, radiusKm: number = 5) {
    const results = await redis.georadius(
      'riders:locations',
      location.lng,
      location.lat,
      radiusKm,
      'km',
      'WITHDIST',
      'WITHCOORD'
    );
    
    return results.map((result: any) => ({
      riderId: result[0],
      distance: parseFloat(result[1]),
      location: {
        lat: parseFloat(result[2][1]),
        lng: parseFloat(result[2][0]),
      },
    }));
  },

  /**
   * Update rider location
   */
  async updateRiderLocation(riderId: string, location: { lat: number; lng: number }) {
    await redis.geoadd('riders:locations', location.lng, location.lat, riderId);
  },

  /**
   * Remove rider from available pool
   */
  async removeRider(riderId: string) {
    await redis.del(`rider:available:${riderId}`);
    await redis.del(`rider:busy:${riderId}`);
    await redis.zrem('riders:available', riderId);
    await redis.zrem('riders:locations', riderId);
  },
};

// ============================================
// RIDER ↔ ORDER ASSIGNMENT
// ============================================

export const OrderAssignmentRedis = {
  /**
   * Assign order to rider
   */
  async assignOrder(orderId: string, riderId: string) {
    const key = `order:assignment:${orderId}`;
    await redis.setex(key, 3600, JSON.stringify({
      riderId,
      assignedAt: new Date().toISOString(),
    }));
    
    // Track rider's current order
    await redis.setex(`rider:order:${riderId}`, 3600, orderId);
  },

  /**
   * Get order assignment
   */
  async getOrderAssignment(orderId: string) {
    const key = `order:assignment:${orderId}`;
    const data = await redis.get(key);
    return data ? JSON.parse(data) : null;
  },

  /**
   * Get rider's current order
   */
  async getRiderOrder(riderId: string) {
    const key = `rider:order:${riderId}`;
    return await redis.get(key);
  },

  /**
   * Remove assignment (when order is delivered/cancelled)
   */
  async removeAssignment(orderId: string, riderId: string) {
    await redis.del(`order:assignment:${orderId}`);
    await redis.del(`rider:order:${riderId}`);
  },
};

// ============================================
// SHOPPING CARTS (Temporary)
// ============================================

export const CartRedis = {
  /**
   * Save cart to Redis (expires in 24 hours)
   */
  async saveCart(userId: string, cartData: {
    restaurantId: string;
    items: Array<{
      menuItemId: string;
      quantity: number;
      customizations?: any;
    }>;
  }) {
    const key = `cart:${userId}`;
    await redis.setex(key, 86400, JSON.stringify(cartData)); // 24 hours
  },

  /**
   * Get cart from Redis
   */
  async getCart(userId: string) {
    const key = `cart:${userId}`;
    const data = await redis.get(key);
    return data ? JSON.parse(data) : null;
  },

  /**
   * Clear cart
   */
  async clearCart(userId: string) {
    const key = `cart:${userId}`;
    await redis.del(key);
  },
};

// ============================================
// OTP VERIFICATION
// ============================================

export const OTPRedis = {
  /**
   * Store OTP (expires in 5 minutes)
   */
  async storeOTP(identifier: string, otp: string, type: 'email' | 'phone' = 'phone') {
    const key = `otp:${type}:${identifier}`;
    await redis.setex(key, 300, otp); // 5 minutes
  },

  /**
   * Verify OTP
   */
  async verifyOTP(identifier: string, otp: string, type: 'email' | 'phone' = 'phone'): Promise<boolean> {
    const key = `otp:${type}:${identifier}`;
    const storedOTP = await redis.get(key);
    
    if (storedOTP === otp) {
      await redis.del(key); // Delete after successful verification
      return true;
    }
    
    return false;
  },

  /**
   * Check if OTP exists
   */
  async hasOTP(identifier: string, type: 'email' | 'phone' = 'phone'): Promise<boolean> {
    const key = `otp:${type}:${identifier}`;
    return (await redis.exists(key)) === 1;
  },
};

// ============================================
// RATE LIMITING
// ============================================

export const RateLimitRedis = {
  /**
   * Check rate limit
   * Returns true if within limit, false if exceeded
   */
  async checkRateLimit(
    identifier: string,
    limit: number,
    windowSeconds: number
  ): Promise<{ allowed: boolean; remaining: number; resetAt: number }> {
    const key = `ratelimit:${identifier}`;
    const current = await redis.incr(key);
    
    if (current === 1) {
      await redis.expire(key, windowSeconds);
    }
    
    const ttl = await redis.ttl(key);
    const remaining = Math.max(0, limit - current);
    
    return {
      allowed: current <= limit,
      remaining,
      resetAt: Date.now() + (ttl * 1000),
    };
  },

  /**
   * Reset rate limit
   */
  async resetRateLimit(identifier: string) {
    const key = `ratelimit:${identifier}`;
    await redis.del(key);
  },
};

// ============================================
// RESTAURANT STATUS (Real-time)
// ============================================

export const RestaurantStatusRedis = {
  /**
   * Set restaurant online/offline status
   */
  async setRestaurantStatus(restaurantId: string, isOpen: boolean) {
    const key = `restaurant:status:${restaurantId}`;
    await redis.setex(key, 3600, JSON.stringify({
      isOpen,
      updatedAt: new Date().toISOString(),
    }));
  },

  /**
   * Get restaurant status
   */
  async getRestaurantStatus(restaurantId: string) {
    const key = `restaurant:status:${restaurantId}`;
    const data = await redis.get(key);
    return data ? JSON.parse(data) : null;
  },
};



'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { Header } from '../../../components/Header';
import { Button } from '../../../components/ui/button';
import { Card } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { Separator } from '../../../components/ui/separator';
import { 
  ArrowLeft,
  MapPin,
  Phone,
  Clock,
  CheckCircle,
  Package,
  Truck,
  Star,
  MessageSquare,
  AlertCircle
} from 'lucide-react';
import { toast } from 'sonner';
import { Toaster } from '../../../components/ui/sonner';
import { OrderTrackingMap } from '../../../components/Map';
import { Label } from '../../../components/ui/label';

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  image: string;
}

interface Order {
  id: string;
  orderNumber: string;
  restaurantName: string;
  restaurantImage: string;
  restaurantSlug?: string;
  restaurantPhone?: string;
  restaurantAddress?: string;
  restaurant?: {
    id: string;
    name: string;
    address?: string;
    latitude?: number;
    longitude?: number;
  };
  status: string; // Can be various formats from API
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  tax: number;
  discount?: number;
  total: number;
  deliveryAddress: string;
  phoneNumber: string;
  specialInstructions?: string;
  orderDate: string;
  estimatedDelivery?: string;
  confirmedAt?: string;
  preparedAt?: string;
  pickedUpAt?: string;
  deliveredAt?: string;
  rider?: {
    name: string;
    phone: string;
    location?: {
      lat: number;
      lng: number;
    };
  } | null;
  payment?: {
    method: string;
    status: string;
    amount: number;
  } | null;
  review?: {
    rating: number;
    comment: string;
  } | null;
}

// Mock orders removed - now fetched from API

const statusConfig = {
  pending: { label: 'Pending', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
  confirmed: { label: 'Confirmed', color: 'bg-blue-100 text-blue-800', icon: CheckCircle },
  preparing: { label: 'Preparing', color: 'bg-orange-100 text-orange-800', icon: Package },
  ready: { label: 'Ready', color: 'bg-purple-100 text-purple-800', icon: CheckCircle },
  on_the_way: { label: 'On The Way', color: 'bg-indigo-100 text-indigo-800', icon: Truck },
  delivered: { label: 'Delivered', color: 'bg-green-100 text-green-800', icon: CheckCircle },
  cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-800', icon: AlertCircle },
};

export default function OrderDetailPage() {
  const router = useRouter();
  const params = useParams();
  const [selectedRating, setSelectedRating] = useState<number>(0);
  const [reviewText, setReviewText] = useState('');
  const [isReviewSubmitted, setIsReviewSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const orderId = params?.id as string;
  
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/orders/${orderId}`, {
          cache: 'no-store',
        });
        
        if (!response.ok) {
          if (response.status === 404) {
            toast.error('Order not found');
            router.push('/orders');
            return;
          }
          throw new Error('Failed to fetch order');
        }

        const data = await response.json();
        if (data.order) {
          setOrder(data.order);
          if (data.order.review) {
            setSelectedRating(data.order.review.rating);
            setReviewText(data.order.review.comment || '');
            setIsReviewSubmitted(true);
          }
        }
      } catch (error) {
        console.error('Error fetching order:', error);
        toast.error('Failed to load order');
        router.push('/orders');
      } finally {
        setIsLoading(false);
      }
    };

    if (orderId) {
      fetchOrder();
    }
  }, [orderId, router]);

  if (isLoading || !order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mb-4"></div>
          <p className="text-gray-600">Loading order...</p>
        </div>
      </div>
    );
  }

  // Map status from API format to config keys
  const statusKey = order.status.replace(/\s+/g, '_') as keyof typeof statusConfig;
  const StatusIcon = statusConfig[statusKey]?.icon || Clock;
  const statusColor = statusConfig[statusKey]?.color || 'bg-gray-100 text-gray-800';
  const statusLabel = statusConfig[statusKey]?.label || order.status;

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster />
      <Header 
        cartItemCount={0}
        onCartClick={() => {}}
        onSearch={() => {}}
        selectedCategory="delivery"
        onCategoryChange={() => {}}
      />

      <div className="pt-20 md:pt-24">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Back Button */}
        <Link href="/orders">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Orders
          </Button>
        </Link>

        {/* Order Header */}
        <Card className="p-6 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold">Order {order.orderNumber}</h1>
                <Badge className={statusColor}>
                  <StatusIcon className="w-3 h-3 mr-1" />
                  {statusLabel}
                </Badge>
              </div>
              <p className="text-gray-600">
                Placed on {new Date(order.orderDate).toLocaleString()}
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-orange-600">${order.total.toFixed(2)}</div>
              <p className="text-sm text-gray-600">Total Amount</p>
            </div>
          </div>

          {/* Restaurant Info */}
          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
            <img
              src={order.restaurantImage}
              alt={order.restaurantName}
              className="w-16 h-16 rounded-lg object-cover"
            />
            <div>
              <h3 className="font-bold text-lg">{order.restaurantName}</h3>
              <p className="text-sm text-gray-600">Restaurant</p>
            </div>
          </div>
        </Card>

        {/* Order Items */}
        <Card className="p-6 mb-6">
          <h2 className="text-2xl font-bold mb-4">Order Items</h2>
          <div className="space-y-4">
            {order.items.map((item) => (
              <div key={item.id} className="flex gap-4 pb-4 border-b last:border-0">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-20 h-20 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <h3 className="font-semibold">{item.name}</h3>
                  <p className="text-sm text-gray-600">PKR {item.price.toLocaleString()} × {item.quantity}</p>
                </div>
                <div className="font-semibold">
                  PKR {(item.price * item.quantity).toLocaleString()}
                </div>
              </div>
            ))}
          </div>

          <Separator className="my-6" />

          {/* Price Breakdown */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-medium">PKR {order.subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Delivery Fee</span>
              <span className="font-medium">PKR {order.deliveryFee.toLocaleString()}</span>
            </div>
            {order.discount !== undefined && order.discount > 0 && (
              <div className="flex justify-between text-sm text-green-600">
                <span>Discount</span>
                <span className="font-medium">-PKR {order.discount.toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Tax</span>
              <span className="font-medium">PKR {order.tax.toLocaleString()}</span>
            </div>
            <Separator />
            <div className="flex justify-between text-lg font-bold">
              <span>Total</span>
              <span className="text-orange-600">PKR {order.total.toLocaleString()}</span>
            </div>
          </div>
        </Card>

        {/* Order Tracking Map */}
        {order.deliveryAddress && (
          <OrderTrackingMap
            restaurantLocation={{
              lat: order.restaurant?.latitude || 24.8607, // Default to Karachi coordinates
              lng: order.restaurant?.longitude || 67.0011,
              address: order.restaurant?.address || order.restaurantAddress || order.restaurantName || 'Restaurant',
            }}
            deliveryLocation={{
              lat: 24.8607, // In production, get from address geocoding or store lat/lng when address is saved
              lng: 67.0011,
              address: order.deliveryAddress,
            }}
            riderLocation={order.rider?.location ? {
              lat: order.rider.location.lat,
              lng: order.rider.location.lng,
            } : undefined}
            orderStatus={order.status}
            estimatedDeliveryTime={order.estimatedDelivery ? new Date(order.estimatedDelivery).toLocaleTimeString() : undefined}
            className="mb-6"
          />
        )}

        {/* Delivery Information */}
        <Card className="p-6 mb-6">
          <h2 className="text-2xl font-bold mb-4">Delivery Information</h2>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-gray-500 mt-0.5" />
              <div>
                <p className="font-semibold mb-1">Delivery Address</p>
                <p className="text-gray-600">{order.deliveryAddress}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-gray-500" />
              <div>
                <p className="font-semibold mb-1">Phone Number</p>
                <p className="text-gray-600">{order.phoneNumber}</p>
              </div>
            </div>

            {order.estimatedDelivery && (
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="font-semibold mb-1">Estimated Delivery</p>
                  <p className="text-gray-600">
                    {new Date(order.estimatedDelivery).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            )}

            {order.rider && (
              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <p className="font-semibold mb-2 flex items-center gap-2">
                  <Truck className="w-5 h-5 text-blue-600" />
                  Delivery Rider
                </p>
                <p className="text-gray-700">{order.rider.name}</p>
                {order.rider.phone && (
                  <p className="text-sm text-gray-600">{order.rider.phone}</p>
                )}
              </div>
            )}
          </div>
        </Card>

        {/* Actions */}
        {(order.status === 'delivered' || order.status === 'Delivered') && !isReviewSubmitted && (
          <Card className="p-6 mb-6 bg-gradient-to-r from-orange-50 to-pink-50">
            <h2 className="text-2xl font-bold mb-4">Rate Your Experience</h2>
            <p className="text-gray-600 mb-4">How was your order?</p>
            <div className="flex gap-2 mb-4">
              {[1, 2, 3, 4, 5].map((rating) => (
                <button
                  key={rating}
                  onClick={() => setSelectedRating(rating)}
                  className={`w-12 h-12 rounded-full bg-white border-2 flex items-center justify-center transition-colors ${
                    rating <= selectedRating
                      ? 'border-orange-500 bg-orange-50'
                      : 'border-gray-200 hover:border-orange-500 hover:bg-orange-50'
                  }`}
                >
                  <Star className={`w-6 h-6 ${rating <= selectedRating ? 'text-orange-500 fill-orange-500' : 'text-gray-400'}`} />
                </button>
              ))}
            </div>
            {selectedRating > 0 && (
              <div className="mb-4">
                <Label htmlFor="reviewText" className="text-sm font-medium text-gray-700">
                  Tell us more about your experience (optional)
                </Label>
                <textarea
                  id="reviewText"
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="Share your experience..."
                  className="w-full mt-2 p-3 border-2 border-gray-200 rounded-lg resize-none focus:border-orange-500 focus:ring-orange-500"
                  rows={4}
                />
              </div>
            )}
            <Button
              onClick={async () => {
                if (selectedRating === 0) {
                  toast.error('Please select a rating');
                  return;
                }
                try {
                  const response = await fetch(`/api/orders/${order.id}/review`, {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                      rating: selectedRating,
                      comment: reviewText,
                    }),
                  });

                  if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || 'Failed to submit review');
                  }

                  setIsReviewSubmitted(true);
                  toast.success(`Thank you! Your ${selectedRating}-star review has been submitted.`);
                } catch (error: any) {
                  console.error('Error submitting review:', error);
                  toast.error(error.message || 'Failed to submit review');
                }
              }}
              className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white"
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              Submit Review
            </Button>
          </Card>
        )}

        {(order.status === 'delivered' || order.status === 'Delivered') && isReviewSubmitted && (
          <Card className="p-6 mb-6 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-6 h-6 text-green-600" />
              <div>
                <h2 className="text-xl font-bold text-green-900">Thank you for your review!</h2>
                <p className="text-green-700">Your feedback helps us improve our service.</p>
              </div>
            </div>
          </Card>
        )}

        {order.status !== 'delivered' && order.status !== 'Delivered' && order.status !== 'cancelled' && order.status !== 'Cancelled' && (
          <Card className="p-6">
            <div className="flex gap-4">
              <Button variant="outline" className="flex-1">
                <Phone className="w-4 h-4 mr-2" />
                Contact Restaurant
              </Button>
              <Button variant="destructive" className="flex-1">
                Cancel Order
              </Button>
            </div>
          </Card>
        )}
      </div>
      </div>
    </div>
  );
}


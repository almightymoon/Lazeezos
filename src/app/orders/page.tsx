'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '../../components/Header';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { Checkbox } from '../../components/ui/checkbox';
import { Badge } from '../../components/ui/badge';
import { 
  Clock, 
  MapPin, 
  Phone, 
  CheckCircle, 
  XCircle, 
  RotateCcw, 
  Package,
  Truck,
  ChefHat,
  ShoppingCart,
  ArrowLeft,
  Star
} from 'lucide-react';
import { toast } from 'sonner';
import { Toaster } from '../../components/ui/sonner';

// Mock order data
interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  image: string;
}

interface Order {
  id: string;
  restaurantName: string;
  restaurantImage: string;
  orderNumber: string;
  status: 'pending' | 'preparing' | 'on_the_way' | 'delivered' | 'cancelled';
  items: OrderItem[];
  total: number;
  deliveryAddress: string;
  phoneNumber: string;
  orderDate: string;
  estimatedDelivery?: string;
  rating?: number;
}

// Orders are now fetched from the API

const getStatusConfig = (status: Order['status']) => {
  switch (status) {
    case 'pending':
      return { label: 'Pending', color: 'bg-yellow-100 text-yellow-800', icon: Clock };
    case 'preparing':
      return { label: 'Preparing', color: 'bg-blue-100 text-blue-800', icon: ChefHat };
    case 'on_the_way':
      return { label: 'On the Way', color: 'bg-purple-100 text-purple-800', icon: Truck };
    case 'delivered':
      return { label: 'Delivered', color: 'bg-green-100 text-green-800', icon: CheckCircle };
    case 'cancelled':
      return { label: 'Cancelled', color: 'bg-red-100 text-red-800', icon: XCircle };
    default:
      return { label: 'Unknown', color: 'bg-gray-100 text-gray-800', icon: Package };
  }
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export default function OrdersPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'active' | 'past'>('active');
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [isReorderMode, setIsReorderMode] = useState(false);
  const [activeOrders, setActiveOrders] = useState<Order[]>([]);
  const [pastOrders, setPastOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch orders from API
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/orders');
        if (response.ok) {
          const data = await response.json();
          setActiveOrders(data.activeOrders || []);
          setPastOrders(data.pastOrders || []);
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleItemToggle = (itemId: string) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(itemId)) {
      newSelected.delete(itemId);
    } else {
      newSelected.add(itemId);
    }
    setSelectedItems(newSelected);
  };

  const handleReorder = () => {
    if (selectedItems.size === 0) {
      toast.error('Please select at least one item to reorder');
      return;
    }

    // Get selected items from past orders
    const itemsToReorder: OrderItem[] = [];
    pastOrders.forEach(order => {
      order.items.forEach(item => {
        if (selectedItems.has(`${order.id}-${item.id}`)) {
          itemsToReorder.push(item);
        }
      });
    });

    // Add to cart (in a real app, this would add to cart state)
    toast.success(`Added ${itemsToReorder.length} item(s) to cart!`);
    setIsReorderMode(false);
    setSelectedItems(new Set());
    router.push('/dashboard');
  };

  const handleSelectAll = (orderId: string) => {
    const order = pastOrders.find(o => o.id === orderId);
    if (!order) return;

    const newSelected = new Set(selectedItems);
    const allSelected = order.items.every(item => 
      newSelected.has(`${orderId}-${item.id}`)
    );

    if (allSelected) {
      // Deselect all items from this order
      order.items.forEach(item => {
        newSelected.delete(`${orderId}-${item.id}`);
      });
    } else {
      // Select all items from this order
      order.items.forEach(item => {
        newSelected.add(`${orderId}-${item.id}`);
      });
    }

    setSelectedItems(newSelected);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        cartItemCount={0}
        onCartClick={() => router.push('/dashboard')}
        onSearch={() => {}}
        selectedCategory="delivery"
        onCategoryChange={() => {}}
      />

      <div className="pt-20 md:pt-24">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => router.push('/dashboard')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">My Orders</h1>
          <p className="text-gray-600">Track your active orders and reorder from past orders</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6 border-b">
          <button
            onClick={() => {
              setActiveTab('active');
              setIsReorderMode(false);
              setSelectedItems(new Set());
            }}
            className={`pb-4 px-2 font-semibold transition-colors relative ${
              activeTab === 'active'
                ? 'text-pink-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Active Orders
            {activeTab === 'active' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-orange-500 to-pink-500" />
            )}
          </button>
          <button
            onClick={() => {
              setActiveTab('past');
              setIsReorderMode(false);
              setSelectedItems(new Set());
            }}
            className={`pb-4 px-2 font-semibold transition-colors relative ${
              activeTab === 'past'
                ? 'text-pink-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Past Orders
            {activeTab === 'past' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-orange-500 to-pink-500" />
            )}
          </button>
        </div>

        {/* Reorder Mode Toggle (only for past orders) */}
        {activeTab === 'past' && (
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant={isReorderMode ? 'default' : 'outline'}
                onClick={() => {
                  setIsReorderMode(!isReorderMode);
                  setSelectedItems(new Set());
                }}
                className={isReorderMode ? 'bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white' : ''}
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                {isReorderMode ? 'Cancel Reorder' : 'Reorder Items'}
              </Button>
              {isReorderMode && selectedItems.size > 0 && (
                <Badge variant="secondary" className="text-sm">
                  {selectedItems.size} item{selectedItems.size !== 1 ? 's' : ''} selected
                </Badge>
              )}
            </div>
            {isReorderMode && selectedItems.size > 0 && (
              <Button
                onClick={handleReorder}
                className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white"
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                Add to Cart ({selectedItems.size})
              </Button>
            )}
          </div>
        )}

        {/* Active Orders */}
        {activeTab === 'active' && (
          loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mb-4"></div>
                <p className="text-gray-600">Loading orders...</p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
            {activeOrders.length === 0 ? (
              <Card className="p-12 text-center">
                <Package className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-xl font-semibold mb-2">No Active Orders</h3>
                <p className="text-gray-600 mb-4">You don't have any active orders at the moment.</p>
                <Button
                  onClick={() => router.push('/dashboard')}
                  className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white"
                >
                  Browse Restaurants
                </Button>
              </Card>
            ) : (
              activeOrders.map((order) => {
                const statusConfig = getStatusConfig(order.status);
                const StatusIcon = statusConfig.icon;

                return (
                  <Card key={order.id} className="p-6 hover:shadow-lg transition-shadow">
                    <div className="flex flex-col md:flex-row gap-6">
                      {/* Restaurant Image */}
                      <div className="flex-shrink-0">
                        <img
                          src={order.restaurantImage}
                          alt={order.restaurantName}
                          className="w-24 h-24 md:w-32 md:h-32 rounded-xl object-cover"
                        />
                      </div>

                      {/* Order Details */}
                      <div className="flex-1">
                        <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
                          <div>
                            <h3 className="text-xl font-bold mb-1">{order.restaurantName}</h3>
                            <p className="text-sm text-gray-500">Order #{order.orderNumber}</p>
                          </div>
                          <Badge className={`${statusConfig.color} mt-2 md:mt-0`}>
                            <StatusIcon className="w-3 h-3 mr-1" />
                            {statusConfig.label}
                          </Badge>
                        </div>

                        {/* Items */}
                        <div className="space-y-2 mb-4">
                          {order.items.map((item) => (
                            <div key={item.id} className="flex items-center justify-between text-sm">
                              <span className="text-gray-700">
                                {item.quantity}x {item.name}
                              </span>
                              <span className="font-semibold">PKR {(item.price * item.quantity).toFixed(2)}</span>
                            </div>
                          ))}
                        </div>

                        {/* Order Info */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 mb-4">
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            <span className="truncate">{order.deliveryAddress}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4" />
                            <span>{order.phoneNumber}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            <span>Ordered: {formatDate(order.orderDate)}</span>
                          </div>
                          {order.estimatedDelivery && (
                            <div className="flex items-center gap-2">
                              <Truck className="w-4 h-4" />
                              <span>Est. Delivery: {formatDate(order.estimatedDelivery)}</span>
                            </div>
                          )}
                        </div>

                        {/* Total */}
                        <div className="flex items-center justify-between pt-4 border-t mb-4">
                          <span className="text-lg font-semibold">Total</span>
                          <span className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
                            PKR {order.total.toFixed(2)}
                          </span>
                        </div>

                        {/* View Details Button */}
                        <Button
                          onClick={() => router.push(`/orders/${order.id}`)}
                          className="w-full md:w-auto bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white"
                        >
                          View Details
                        </Button>
                      </div>
                    </div>
                  </Card>
                );
              })
            )}
            </div>
          )
        )}

        {/* Past Orders */}
        {activeTab === 'past' && (
          loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mb-4"></div>
                <p className="text-gray-600">Loading orders...</p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
            {pastOrders.length === 0 ? (
              <Card className="p-12 text-center">
                <Package className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-xl font-semibold mb-2">No Past Orders</h3>
                <p className="text-gray-600 mb-4">You haven't placed any orders yet.</p>
                <Button
                  onClick={() => router.push('/dashboard')}
                  className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white"
                >
                  Browse Restaurants
                </Button>
              </Card>
            ) : (
              pastOrders.map((order) => {
                const statusConfig = getStatusConfig(order.status);
                const StatusIcon = statusConfig.icon;

                return (
                  <Card key={order.id} className="p-6 hover:shadow-lg transition-shadow">
                    <div className="flex flex-col md:flex-row gap-6">
                      {/* Restaurant Image */}
                      <div className="flex-shrink-0 relative">
                        <img
                          src={order.restaurantImage}
                          alt={order.restaurantName}
                          className="w-24 h-24 md:w-32 md:h-32 rounded-xl object-cover"
                        />
                        {order.rating && (
                          <div className="absolute -top-2 -right-2 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-full px-2 py-1 flex items-center gap-1 text-xs font-bold">
                            <Star className="w-3 h-3 fill-white" />
                            {order.rating}
                          </div>
                        )}
                      </div>

                      {/* Order Details */}
                      <div className="flex-1">
                        <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
                          <div>
                            <h3 className="text-xl font-bold mb-1">{order.restaurantName}</h3>
                            <p className="text-sm text-gray-500">Order #{order.orderNumber}</p>
                          </div>
                          <div className="flex items-center gap-2 mt-2 md:mt-0">
                            <Badge className={statusConfig.color}>
                              <StatusIcon className="w-3 h-3 mr-1" />
                              {statusConfig.label}
                            </Badge>
                          </div>
                        </div>

                        {/* Items with Checkboxes in Reorder Mode */}
                        <div className="space-y-3 mb-4">
                          {isReorderMode && (
                            <div className="flex items-center gap-2 mb-2 pb-2 border-b">
                              <Checkbox
                                checked={order.items.every(item => 
                                  selectedItems.has(`${order.id}-${item.id}`)
                                )}
                                onCheckedChange={() => handleSelectAll(order.id)}
                                className="border-gray-300"
                              />
                              <span className="text-sm font-semibold text-gray-700">
                                Select All from {order.restaurantName}
                              </span>
                            </div>
                          )}
                          {order.items.map((item) => {
                            const itemKey = `${order.id}-${item.id}`;
                            const isSelected = selectedItems.has(itemKey);

                            return (
                              <div
                                key={item.id}
                                className={`flex items-center justify-between p-3 rounded-lg transition-all ${
                                  isReorderMode
                                    ? isSelected
                                      ? 'bg-gradient-to-r from-orange-50 to-pink-50 border-2 border-pink-300'
                                      : 'bg-gray-50 border-2 border-transparent hover:border-pink-200'
                                    : ''
                                }`}
                              >
                                <div className="flex items-center gap-3 flex-1">
                                  {isReorderMode && (
                                    <Checkbox
                                      checked={isSelected}
                                      onCheckedChange={() => handleItemToggle(itemKey)}
                                      className="border-gray-300"
                                    />
                                  )}
                                  {isReorderMode && (
                                    <img
                                      src={item.image}
                                      alt={item.name}
                                      className="w-12 h-12 rounded-lg object-cover"
                                    />
                                  )}
                                  <div>
                                    <span className="text-sm font-medium text-gray-900">
                                      {item.quantity}x {item.name}
                                    </span>
                                    {isReorderMode && (
                                      <p className="text-xs text-gray-500 mt-1">
                                        PKR {item.price.toFixed(2)} each
                                      </p>
                                    )}
                                  </div>
                                </div>
                                <span className="font-semibold text-gray-900">
                                  PKR {(item.price * item.quantity).toFixed(2)}
                                </span>
                              </div>
                            );
                          })}
                        </div>

                        {/* Order Info */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 mb-4">
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            <span className="truncate">{order.deliveryAddress}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            <span>Ordered: {formatDate(order.orderDate)}</span>
                          </div>
                        </div>

                        {/* Total and Actions */}
                        <div className="flex items-center justify-between pt-4 border-t">
                          <span className="text-lg font-semibold">Total</span>
                          <div className="flex items-center gap-4">
                            <span className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
                              PKR {order.total.toFixed(2)}
                            </span>
                            {!isReorderMode && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setIsReorderMode(true);
                                  order.items.forEach(item => {
                                    setSelectedItems(prev => new Set(prev).add(`${order.id}-${item.id}`));
                                  });
                                }}
                                className="border-pink-300 text-pink-600 hover:bg-pink-50"
                              >
                                <RotateCcw className="w-4 h-4 mr-2" />
                                Reorder All
                              </Button>
                            )}
                            <Button
                              onClick={() => router.push(`/orders/${order.id}`)}
                              variant="outline"
                              className="border-orange-300 text-orange-600 hover:bg-orange-50"
                            >
                              View Details
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })
            )}
          </div>
          )
        )}
      </div>
      </div>

      <Toaster />
    </div>
  );
}



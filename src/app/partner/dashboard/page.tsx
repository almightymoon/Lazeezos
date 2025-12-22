'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { 
  TrendingUp, 
  DollarSign, 
  ShoppingBag, 
  Users, 
  Clock, 
  Star,
  ArrowUpRight,
  ArrowDownRight,
  Bell,
  Settings,
  Menu,
  Plus,
  Eye,
  CheckCircle,
  XCircle,
  Package,
  BarChart3,
  Calendar,
  MapPin,
  Phone,
  Mail,
  Edit,
  MoreVertical,
  ChefHat,
  Sparkles,
  Trash2,
  Search,
  Filter,
  Upload,
  Save,
  X,
  ArrowRight,
  ArrowLeft,
  Store,
  LogOut
} from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Card } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { Toaster } from '../../../components/ui/sonner';
import { toast } from 'sonner';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../../../components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../../../components/ui/dialog';
import { Input } from '../../../components/ui/input';
import { Textarea } from '../../../components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../components/ui/select';
import { Tabs, TabsContent } from '../../../components/ui/tabs';
import { Switch } from '../../../components/ui/switch';
import { Label } from '../../../components/ui/label';
import { ImageWithFallback } from '../../../components/figma/ImageWithFallback';

// Types
interface MenuItem {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  discountedPrice?: number;
  image?: string;
  status: 'AVAILABLE' | 'UNAVAILABLE' | 'OUT_OF_STOCK';
  isPopular: boolean;
  isVeg: boolean;
  isSpicy: boolean;
}

interface Order {
  id: string;
  orderNumber: string;
  customer: string;
  items: number;
  total: number;
  status: 'PENDING' | 'CONFIRMED' | 'PREPARING' | 'READY' | 'ASSIGNED' | 'PICKED_UP' | 'ON_THE_WAY' | 'DELIVERED' | 'CANCELLED';
  time: string;
  deliveryAddress?: string;
  phone?: string;
}

export default function PartnerDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedPeriod, setSelectedPeriod] = useState<'today' | 'week' | 'month'>('week');
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState({
    revenue: { value: 0, change: 0, period: 'vs last week' },
    orders: { value: 0, change: 0, period: 'vs last week' },
    customers: { value: 0, change: 0, period: 'new this week' },
    rating: { value: 0, change: 0, period: 'from 0' },
  });
  const [restaurantName, setRestaurantName] = useState('Restaurant Owner');
  const [restaurantLocation, setRestaurantLocation] = useState('Karachi, Pakistan');
  const [loading, setLoading] = useState(true);
  const [orderFilter, setOrderFilter] = useState<string>('all');
  const [menuSearch, setMenuSearch] = useState('');
  const [menuCategoryFilter, setMenuCategoryFilter] = useState<string>('all');
  const [isMenuDialogOpen, setIsMenuDialogOpen] = useState(false);
  const [isOrderDialogOpen, setIsOrderDialogOpen] = useState(false);
  const [editingMenuItem, setEditingMenuItem] = useState<MenuItem | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [menuFormData, setMenuFormData] = useState<Partial<MenuItem>>({
    name: '',
    description: '',
    category: '',
    price: 0,
    discountedPrice: undefined,
    status: 'AVAILABLE',
    isPopular: false,
    isVeg: false,
    isSpicy: false,
  });

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch restaurant profile to get restaurant name and location
        const profileResponse = await fetch('/api/partner/restaurant-profile');
        if (profileResponse.ok) {
          const profileData = await profileResponse.json();
          if (profileData.restaurant) {
            if (profileData.restaurant.name) {
              setRestaurantName(profileData.restaurant.name);
            }
            if (profileData.restaurant.city && profileData.restaurant.country) {
              setRestaurantLocation(`${profileData.restaurant.city}, ${profileData.restaurant.country}`);
            }
          }
        }
        
        // Fetch stats
        const statsResponse = await fetch('/api/partner/stats');
        if (statsResponse.ok) {
          const statsData = await statsResponse.json();
          setStats(statsData);
        }

        // Fetch menu items - include restaurant info from localStorage
        const restaurantId = localStorage.getItem('restaurantId');
        const restaurantSlug = localStorage.getItem('restaurantSlug');
        const menuUrl = restaurantId || restaurantSlug 
          ? `/api/partner/menu?${restaurantId ? `restaurantId=${restaurantId}` : `restaurantSlug=${restaurantSlug}`}`
          : '/api/partner/menu';
        const menuResponse = await fetch(menuUrl);
        if (menuResponse.ok) {
          const menuData = await menuResponse.json();
          setMenuItems(menuData.menuItems || []);
        }

        // Fetch orders
        const ordersResponse = await fetch('/api/partner/orders');
        if (ordersResponse.ok) {
          const ordersData = await ordersResponse.json();
          setOrders(ordersData.orders || []);
        }
      } catch (error) {
        console.error('Error fetching partner data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Calculate top items from menu items (mock for now)
  const topItems = [
    { name: 'Chicken Biryani', orders: 142, revenue: 28400 },
    { name: 'Beef Burger', orders: 98, revenue: 19600 },
    { name: 'Pizza Margherita', orders: 76, revenue: 15200 },
    { name: 'Chicken Karahi', orders: 65, revenue: 19500 },
  ];

  const categories = ['All', 'Main Course', 'Fast Food', 'Desserts', 'Beverages', 'Appetizers'];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'CONFIRMED': return 'bg-blue-100 text-blue-700';
      case 'PREPARING': return 'bg-yellow-100 text-yellow-700';
      case 'READY': return 'bg-green-100 text-green-700';
      case 'DELIVERED': return 'bg-purple-100 text-purple-700';
      case 'PENDING': return 'bg-gray-100 text-gray-700';
      case 'CANCELLED': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'CONFIRMED': return CheckCircle;
      case 'PREPARING': return Clock;
      case 'READY': return Package;
      case 'DELIVERED': return CheckCircle;
      case 'PENDING': return Clock;
      case 'CANCELLED': return XCircle;
      default: return XCircle;
    }
  };

  const getNextStatus = (currentStatus: Order['status']): Order['status'] | null => {
    const statusFlow: Record<string, Order['status']> = {
      'PENDING': 'CONFIRMED',
      'CONFIRMED': 'PREPARING',
      'PREPARING': 'READY',
      'READY': 'ASSIGNED',
      'ASSIGNED': 'PICKED_UP',
      'PICKED_UP': 'ON_THE_WAY',
      'ON_THE_WAY': 'DELIVERED',
    };
    return statusFlow[currentStatus] || null;
  };

  const handleAddMenuItem = () => {
    setEditingMenuItem(null);
    setMenuFormData({
      name: '',
      description: '',
      category: '',
      price: 0,
      discountedPrice: undefined,
      status: 'AVAILABLE',
      isPopular: false,
      isVeg: false,
      isSpicy: false,
    });
    setIsMenuDialogOpen(true);
  };

  const handleEditMenuItem = (item: MenuItem) => {
    setEditingMenuItem(item);
    setMenuFormData(item);
    setIsMenuDialogOpen(true);
  };

  const handleSaveMenuItem = async () => {
    if (!menuFormData.name || !menuFormData.category || !menuFormData.price) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      if (editingMenuItem) {
        const response = await fetch('/api/partner/menu', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: editingMenuItem.id, ...menuFormData }),
        });
        if (response.ok) {
          const updated = await response.json();
          setMenuItems(menuItems.map(item => item.id === editingMenuItem.id ? updated.menuItem : item));
          toast.success('Menu item updated successfully');
        } else {
          toast.error('Failed to update menu item');
        }
      } else {
        // Include restaurant info when creating menu item
        const restaurantId = localStorage.getItem('restaurantId');
        const restaurantSlug = localStorage.getItem('restaurantSlug');
        const response = await fetch('/api/partner/menu', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...menuFormData,
            restaurantId,
            restaurantSlug,
          }),
        });
        if (response.ok) {
          const newItem = await response.json();
          setMenuItems([...menuItems, newItem.menuItem]);
          toast.success('Menu item added successfully');
        } else {
          toast.error('Failed to add menu item');
        }
      }
      setIsMenuDialogOpen(false);
    } catch (error) {
      console.error('Error saving menu item:', error);
      toast.error('Failed to save menu item');
    }
  };

  const handleDeleteMenuItem = async (id: string) => {
    try {
      const response = await fetch(`/api/partner/menu?id=${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setMenuItems(menuItems.filter(item => item.id !== id));
        toast.success('Menu item deleted successfully');
      } else {
        toast.error('Failed to delete menu item');
      }
    } catch (error) {
      console.error('Error deleting menu item:', error);
      toast.error('Failed to delete menu item');
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, newStatus: Order['status']) => {
    try {
      // In a real app, you'd have an API endpoint for this
      // For now, just update locally
      setOrders(orders.map(order => order.id === orderId ? { ...order, status: newStatus } : order));
      toast.success(`Order status updated to ${newStatus}`);
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error('Failed to update order status');
    }
  };

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setIsOrderDialogOpen(true);
  };

  const filteredMenuItems = menuItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(menuSearch.toLowerCase()) ||
                         item.description.toLowerCase().includes(menuSearch.toLowerCase());
    const matchesCategory = menuCategoryFilter === 'all' || item.category === menuCategoryFilter;
    return matchesSearch && matchesCategory;
  });

  const filteredOrders = orders.filter(order => {
    if (orderFilter === 'all') return true;
    return order.status === orderFilter;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50">
      <Toaster />
      
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b shadow-sm">
        <div className="container mx-auto px-4">
          {/* Top Row */}
          <div className="flex items-center justify-between gap-4 py-3">
            {/* Logo */}
            <div className="flex items-center gap-4 flex-shrink-0">
              <Link href="/" className="flex items-center gap-3">
                <Image
                  src="/lazeezos_icon.png"
                  alt="Lazeezos"
                  width={50}
                  height={50}
                  className="object-contain h-12 w-auto"
                />
                <span className="text-xl md:text-2xl font-bold bg-gradient-to-r from-orange-500 via-orange-400 to-pink-500 bg-clip-text text-transparent">
                  Lazeezos Partner
                </span>
              </Link>
            </div>

            {/* Navigation - Centered */}
            <div className="hidden md:flex justify-center gap-2 flex-1 mx-4">
              <Button
                variant={activeTab === 'dashboard' ? 'default' : 'ghost'}
                onClick={() => setActiveTab('dashboard')}
                className={`flex items-center gap-2 whitespace-nowrap px-4 py-2 rounded-lg font-medium transition-all ${
                  activeTab === 'dashboard'
                    ? 'bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 hover:from-orange-600 hover:via-pink-600 hover:to-purple-600 text-white shadow-sm'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <BarChart3 className={`w-4 h-4 ${activeTab === 'dashboard' ? 'text-white' : 'text-gray-500'}`} />
                <span>Dashboard</span>
              </Button>
              <Button
                variant={activeTab === 'menu' ? 'default' : 'ghost'}
                onClick={() => setActiveTab('menu')}
                className={`flex items-center gap-2 whitespace-nowrap px-4 py-2 rounded-lg font-medium transition-all ${
                  activeTab === 'menu'
                    ? 'bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 hover:from-orange-600 hover:via-pink-600 hover:to-purple-600 text-white shadow-sm'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <Menu className={`w-4 h-4 ${activeTab === 'menu' ? 'text-white' : 'text-gray-500'}`} />
                <span>Menu Management</span>
              </Button>
              <Button
                variant={activeTab === 'orders' ? 'default' : 'ghost'}
                onClick={() => setActiveTab('orders')}
                className={`flex items-center gap-2 whitespace-nowrap px-4 py-2 rounded-lg font-medium transition-all ${
                  activeTab === 'orders'
                    ? 'bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 hover:from-orange-600 hover:via-pink-600 hover:to-purple-600 text-white shadow-sm'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <ShoppingBag className={`w-4 h-4 ${activeTab === 'orders' ? 'text-white' : 'text-gray-500'}`} />
                <span>Orders Management</span>
              </Button>
            </div>

            {/* User Actions */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative">
                    <Bell className="w-5 h-5 text-gray-600" />
                    <span className="absolute top-1 right-1 w-2 h-2 bg-orange-500 rounded-full"></span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80 z-[100]">
                  <DropdownMenuLabel className="flex items-center justify-between">
                    <span>Notifications</span>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        router.push('/notifications');
                      }}
                      className="text-xs text-orange-500 hover:text-orange-600"
                    >
                      View All
                    </button>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <div className="max-h-96 overflow-y-auto">
                    <div
                      className="p-3 hover:bg-gray-50 cursor-pointer border-b"
                      onClick={(e) => {
                        e.preventDefault();
                        router.push('/partner/dashboard');
                      }}
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                        <div className="flex-1">
                          <p className="text-sm font-semibold">New Order Received</p>
                          <p className="text-xs text-gray-600">Order #ORD-001 has been placed</p>
                          <p className="text-xs text-gray-400 mt-1">2 minutes ago</p>
                        </div>
                      </div>
                    </div>
                    <div
                      className="p-3 hover:bg-gray-50 cursor-pointer border-b"
                      onClick={(e) => {
                        e.preventDefault();
                        router.push('/partner/dashboard');
                      }}
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                        <div className="flex-1">
                          <p className="text-sm font-semibold">Payment Received</p>
                          <p className="text-xs text-gray-600">Payment for order #ORD-002 has been processed</p>
                          <p className="text-xs text-gray-400 mt-1">15 minutes ago</p>
                        </div>
                      </div>
                    </div>
                    <div
                      className="p-3 hover:bg-gray-50 cursor-pointer border-b"
                      onClick={(e) => {
                        e.preventDefault();
                        router.push('/partner/restaurant-profile');
                      }}
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                        <div className="flex-1">
                          <p className="text-sm font-semibold">Profile Update Required</p>
                          <p className="text-xs text-gray-600">Please update your restaurant profile</p>
                          <p className="text-xs text-gray-400 mt-1">1 hour ago</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onSelect={(e) => {
                      e.preventDefault();
                      router.push('/notifications');
                    }}
                    className="cursor-pointer"
                  >
                    View All Notifications
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => router.push('/partner/profile')}
              >
                <Settings className="w-5 h-5 text-gray-600" />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-orange-500 to-pink-500 flex items-center justify-center text-white font-bold">
                      {restaurantName.charAt(0).toUpperCase()}
                    </div>
                    <span className="hidden md:inline text-gray-900 font-medium">{restaurantName}</span>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 z-[100]">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onSelect={(e) => {
                      e.preventDefault();
                      router.push('/partner/profile');
                    }}
                    className="cursor-pointer"
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Profile Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuLabel>Restaurant</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onSelect={(e) => {
                      e.preventDefault();
                      router.push('/partner/restaurant-profile');
                    }}
                    className="cursor-pointer"
                  >
                    <Store className="w-4 h-4 mr-2" />
                    Restaurant Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onSelect={(e) => {
                      e.preventDefault();
                      router.push('/partner/dashboard');
                    }}
                    className="cursor-pointer"
                  >
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuLabel>Support</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onSelect={(e) => {
                      e.preventDefault();
                      router.push('/help');
                    }}
                    className="cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    Help Center
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onSelect={(e) => {
                      e.preventDefault();
                      router.push('/');
                    }}
                    className="cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Home
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onSelect={(e) => {
                      e.preventDefault();
                      // Handle logout
                      localStorage.removeItem('isLoggedIn');
                      router.push('/partner/login');
                    }}
                    className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden flex justify-center gap-2 overflow-x-auto scrollbar-hide py-3 border-t">
            <Button
              variant={activeTab === 'dashboard' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('dashboard')}
              size="sm"
              className={`flex items-center gap-2 whitespace-nowrap px-3 py-1.5 rounded-lg font-medium transition-all ${
                activeTab === 'dashboard'
                  ? 'bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 hover:from-orange-600 hover:via-pink-600 hover:to-purple-600 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <BarChart3 className={`w-4 h-4 ${activeTab === 'dashboard' ? 'text-white' : 'text-gray-500'}`} />
              <span className="text-sm">Dashboard</span>
            </Button>
            <Button
              variant={activeTab === 'menu' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('menu')}
              size="sm"
              className={`flex items-center gap-2 whitespace-nowrap px-3 py-1.5 rounded-lg font-medium transition-all ${
                activeTab === 'menu'
                  ? 'bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 hover:from-orange-600 hover:via-pink-600 hover:to-purple-600 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <Menu className={`w-4 h-4 ${activeTab === 'menu' ? 'text-white' : 'text-gray-500'}`} />
              <span className="text-sm">Menu</span>
            </Button>
            <Button
              variant={activeTab === 'orders' ? 'default' : 'ghost'}  
              onClick={() => setActiveTab('orders')}
              size="sm"
              className={`flex items-center gap-2 whitespace-nowrap px-3 py-1.5 rounded-lg font-medium transition-all ${
                activeTab === 'orders'
                  ? 'bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 hover:from-orange-600 hover:via-pink-600 hover:to-purple-600 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <ShoppingBag className={`w-4 h-4 ${activeTab === 'orders' ? 'text-white' : 'text-gray-500'}`} />
              <span className="text-sm">Orders</span>
            </Button>
          </div>
        </div>
      </header>

      <div className="pt-20 md:pt-24">
      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            {/* Welcome Section */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold mb-2">
                    Welcome back, <span className="bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">{restaurantName}</span>
                  </h1>
                  <p className="text-gray-600">Here's what's happening with your restaurant today</p>
                </div>
                <div className="flex items-center gap-3">
                  <Button variant="outline" className="hidden md:flex">
                    <Calendar className="w-4 h-4 mr-2" />
                    {selectedPeriod === 'today' ? 'Today' : selectedPeriod === 'week' ? 'This Week' : 'This Month'}
                  </Button>
                </div>
              </div>

              {/* Restaurant Status Card */}
              <Card className="p-6 bg-gradient-to-r from-orange-500 to-pink-500 text-white border-0 shadow-xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      <ChefHat className="w-8 h-8" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold mb-1">{restaurantName}</h2>
                      <div className="flex items-center gap-4 text-sm opacity-90">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          <span>{restaurantLocation}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-yellow-300 text-yellow-300" />
                          <span>4.8 (234 reviews)</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge className="bg-white/20 text-white border-white/30 mb-2">Open</Badge>
                    <p className="text-sm opacity-90">Restaurant is currently open</p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Revenue Card */}
              <Card className="p-6 relative overflow-hidden border-2 hover:shadow-xl transition-all group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-200 to-pink-200 rounded-full blur-3xl opacity-50 group-hover:opacity-70 transition-opacity"></div>
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-orange-500 to-pink-500 flex items-center justify-center">
                      <DollarSign className="w-6 h-6 text-white" />
                    </div>
                    <div className={`flex items-center gap-1 text-sm font-semibold ${stats.revenue.change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {stats.revenue.change > 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                      {Math.abs(stats.revenue.change)}%
                    </div>
                  </div>
                  <p className="text-3xl font-bold mb-1">PKR {stats.revenue.value.toLocaleString()}</p>
                  <p className="text-sm text-gray-600">Total Revenue</p>
                  <p className="text-xs text-gray-500 mt-1">{stats.revenue.period}</p>
                </div>
              </Card>

              {/* Orders Card */}
              <Card className="p-6 relative overflow-hidden border-2 hover:shadow-xl transition-all group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-200 to-cyan-200 rounded-full blur-3xl opacity-50 group-hover:opacity-70 transition-opacity"></div>
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center">
                      <ShoppingBag className="w-6 h-6 text-white" />
                    </div>
                    <div className={`flex items-center gap-1 text-sm font-semibold ${stats.orders.change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {stats.orders.change > 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                      {Math.abs(stats.orders.change)}%
                    </div>
                  </div>
                  <p className="text-3xl font-bold mb-1">{stats.orders.value}</p>
                  <p className="text-sm text-gray-600">Total Orders</p>
                  <p className="text-xs text-gray-500 mt-1">{stats.orders.period}</p>
                </div>
              </Card>

              {/* Customers Card */}
              <Card className="p-6 relative overflow-hidden border-2 hover:shadow-xl transition-all group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-200 to-pink-200 rounded-full blur-3xl opacity-50 group-hover:opacity-70 transition-opacity"></div>
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    <div className={`flex items-center gap-1 text-sm font-semibold ${stats.customers.change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {stats.customers.change > 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                      {Math.abs(stats.customers.change)}%
                    </div>
                  </div>
                  <p className="text-3xl font-bold mb-1">{stats.customers.value.toLocaleString()}</p>
                  <p className="text-sm text-gray-600">Total Customers</p>
                  <p className="text-xs text-gray-500 mt-1">{stats.customers.period}</p>
                </div>
              </Card>

              {/* Rating Card */}
              <Card className="p-6 relative overflow-hidden border-2 hover:shadow-xl transition-all group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-yellow-200 to-orange-200 rounded-full blur-3xl opacity-50 group-hover:opacity-70 transition-opacity"></div>
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-yellow-500 to-orange-500 flex items-center justify-center">
                      <Star className="w-6 h-6 text-white fill-white" />
                    </div>
                    <div className={`flex items-center gap-1 text-sm font-semibold ${stats.rating.change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {stats.rating.change > 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                      {Math.abs(stats.rating.change)}
                    </div>
                  </div>
                  <p className="text-3xl font-bold mb-1">{stats.rating.value}</p>
                  <p className="text-sm text-gray-600">Average Rating</p>
                  <p className="text-xs text-gray-500 mt-1">{stats.rating.period}</p>
                </div>
              </Card>
            </div>

            {/* Top Selling Items */}
            <Card className="p-6 border-2">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-bold mb-1">Top Selling Items</h3>
                  <p className="text-sm text-gray-600">Your best performing menu items</p>
                </div>
                <Sparkles className="w-6 h-6 text-pink-500" />
              </div>
              <div className="space-y-4">
                {topItems.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 rounded-xl border-2 hover:border-pink-200 hover:shadow-md transition-all bg-white"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-orange-100 to-pink-100 flex items-center justify-center font-bold text-pink-600">
                        #{index + 1}
                      </div>
                      <div>
                        <p className="font-bold">{item.name}</p>
                        <p className="text-sm text-gray-600">{item.orders} orders</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg">PKR {item.revenue.toLocaleString()}</p>
                      <p className="text-xs text-gray-500">Revenue</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          {/* Menu Management Tab */}
          <TabsContent value="menu" className="space-y-6">
            <Card className="p-6 border-2">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-2xl font-bold mb-1">Menu Management</h2>
                  <p className="text-sm text-gray-600">Add, edit, and manage your menu items</p>
                </div>
                <Button 
                  onClick={handleAddMenuItem}
                  className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Menu Item
                </Button>
              </div>

              {/* Search and Filter */}
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Search menu items..."
                    value={menuSearch}
                    onChange={(e) => setMenuSearch(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={menuCategoryFilter} onValueChange={setMenuCategoryFilter}>
                  <SelectTrigger className="w-full md:w-[200px]">
                    <SelectValue placeholder="Filter by category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(cat => (
                      <SelectItem key={cat} value={cat === 'All' ? 'all' : cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Menu Items Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredMenuItems.map((item) => (
                  <Card key={item.id} className="p-4 border-2 hover:shadow-lg transition-all">
                    <div className="relative mb-3">
                      {item.image ? (
                        <ImageWithFallback
                          src={item.image}
                          alt={item.name}
                          width={300}
                          height={200}
                          className="w-full h-40 object-cover rounded-lg"
                        />
                      ) : (
                        <div className="w-full h-40 bg-gradient-to-br from-orange-100 to-pink-100 rounded-lg flex items-center justify-center">
                          <Menu className="w-12 h-12 text-pink-400" />
                        </div>
                      )}
                      <div className="absolute top-2 right-2 flex gap-1">
                        {item.isPopular && (
                          <Badge className="bg-yellow-500 text-white">Popular</Badge>
                        )}
                        {item.status === 'UNAVAILABLE' && (
                          <Badge variant="destructive">Unavailable</Badge>
                        )}
                        {item.status === 'OUT_OF_STOCK' && (
                          <Badge variant="destructive">Out of Stock</Badge>
                        )}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-bold text-lg">{item.name}</h3>
                          <p className="text-sm text-gray-600 line-clamp-2">{item.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge variant="outline">{item.category}</Badge>
                        {item.isVeg && <Badge className="bg-green-100 text-green-700">Veg</Badge>}
                        {item.isSpicy && <Badge className="bg-red-100 text-red-700">Spicy</Badge>}
                      </div>
                      <div className="flex items-center justify-between pt-2">
                        <div>
                          {item.discountedPrice ? (
                            <div className="flex items-center gap-2">
                              <span className="text-lg font-bold text-pink-600">PKR {item.discountedPrice}</span>
                              <span className="text-sm text-gray-500 line-through">PKR {item.price}</span>
                            </div>
                          ) : (
                            <span className="text-lg font-bold">PKR {item.price}</span>
                          )}
                        </div>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEditMenuItem(item)}
                            className="h-8 w-8"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteMenuItem(item.id)}
                            className="h-8 w-8 text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              {filteredMenuItems.length === 0 && (
                <div className="text-center py-12">
                  <Menu className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 font-semibold">No menu items found</p>
                  <p className="text-sm text-gray-500">Try adjusting your search or filters</p>
                </div>
              )}
            </Card>
          </TabsContent>

          {/* Orders Management Tab */}
          <TabsContent value="orders" className="space-y-6">
            <Card className="p-6 border-2">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-2xl font-bold mb-1">Orders Management</h2>
                  <p className="text-sm text-gray-600">Track and manage all your orders</p>
                </div>
                <div className="flex gap-2">
                  <Select value={orderFilter} onValueChange={setOrderFilter}>
                    <SelectTrigger className="w-full md:w-[180px]">
                      <Filter className="w-4 h-4 mr-2" />
                      <SelectValue placeholder="Filter orders" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Orders</SelectItem>
                      <SelectItem value="PENDING">Pending</SelectItem>
                      <SelectItem value="CONFIRMED">Confirmed</SelectItem>
                      <SelectItem value="PREPARING">Preparing</SelectItem>
                      <SelectItem value="READY">Ready</SelectItem>
                      <SelectItem value="DELIVERED">Delivered</SelectItem>
                      <SelectItem value="CANCELLED">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Orders List */}
              <div className="space-y-4">
                {filteredOrders.map((order) => {
                  const StatusIcon = getStatusIcon(order.status);
                  const nextStatus = getNextStatus(order.status);
                  return (
                    <div
                      key={order.id}
                      className="flex flex-col md:flex-row md:items-center md:justify-between p-4 rounded-xl border-2 hover:border-pink-200 hover:shadow-md transition-all bg-white"
                    >
                      <div className="flex items-center gap-4 flex-1">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-orange-100 to-pink-100 flex items-center justify-center">
                          <ShoppingBag className="w-6 h-6 text-pink-600" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-bold text-lg">{order.orderNumber}</p>
                            <Badge className={getStatusColor(order.status)}>
                              <StatusIcon className="w-3 h-3 mr-1" />
                              {order.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600">{order.customer}</p>
                          <p className="text-xs text-gray-500 mt-1">{order.items} items • {order.time}</p>
                          {order.deliveryAddress && (
                            <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {order.deliveryAddress}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-4 mt-4 md:mt-0">
                        <div className="text-right">
                          <p className="font-bold text-lg">PKR {order.total.toLocaleString()}</p>
                          <p className="text-xs text-gray-500">Total</p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewOrder(order)}
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            View
                          </Button>
                          {nextStatus && (
                            <Button
                              size="sm"
                              onClick={() => handleUpdateOrderStatus(order.id, nextStatus)}
                              className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white"
                            >
                              <ArrowRight className="w-4 h-4 mr-1" />
                              {nextStatus}
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {filteredOrders.length === 0 && (
                <div className="text-center py-12">
                  <ShoppingBag className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 font-semibold">No orders found</p>
                  <p className="text-sm text-gray-500">Try adjusting your filters</p>
                </div>
              )}
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Add/Edit Menu Item Dialog */}
      <Dialog open={isMenuDialogOpen} onOpenChange={setIsMenuDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingMenuItem ? 'Edit Menu Item' : 'Add New Menu Item'}</DialogTitle>
            <DialogDescription>
              {editingMenuItem ? 'Update the menu item details' : 'Fill in the details to add a new menu item'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Item Name *</Label>
                <Input
                  id="name"
                  value={menuFormData.name}
                  onChange={(e) => setMenuFormData({ ...menuFormData, name: e.target.value })}
                  placeholder="e.g., Chicken Biryani"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select
                  value={menuFormData.category}
                  onValueChange={(value) => setMenuFormData({ ...menuFormData, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.filter(c => c !== 'All').map(cat => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={menuFormData.description}
                onChange={(e) => setMenuFormData({ ...menuFormData, description: e.target.value })}
                placeholder="Describe your menu item..."
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Price (PKR) *</Label>
                <Input
                  id="price"
                  type="number"
                  value={menuFormData.price}
                  onChange={(e) => setMenuFormData({ ...menuFormData, price: parseFloat(e.target.value) || 0 })}
                  placeholder="0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="discountedPrice">Discounted Price (PKR)</Label>
                <Input
                  id="discountedPrice"
                  type="number"
                  value={menuFormData.discountedPrice || ''}
                  onChange={(e) => setMenuFormData({ ...menuFormData, discountedPrice: e.target.value ? parseFloat(e.target.value) : undefined })}
                  placeholder="Optional"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={menuFormData.status}
                onValueChange={(value: MenuItem['status']) => setMenuFormData({ ...menuFormData, status: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="AVAILABLE">Available</SelectItem>
                  <SelectItem value="UNAVAILABLE">Unavailable</SelectItem>
                  <SelectItem value="OUT_OF_STOCK">Out of Stock</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="isPopular">Mark as Popular</Label>
                <Switch
                  id="isPopular"
                  checked={menuFormData.isPopular}
                  onCheckedChange={(checked) => setMenuFormData({ ...menuFormData, isPopular: checked })}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="isVeg">Vegetarian</Label>
                <Switch
                  id="isVeg"
                  checked={menuFormData.isVeg}
                  onCheckedChange={(checked) => setMenuFormData({ ...menuFormData, isVeg: checked })}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="isSpicy">Spicy</Label>
                <Switch
                  id="isSpicy"
                  checked={menuFormData.isSpicy}
                  onCheckedChange={(checked) => setMenuFormData({ ...menuFormData, isSpicy: checked })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="image">Image URL</Label>
              <Input
                id="image"
                value={menuFormData.image || ''}
                onChange={(e) => setMenuFormData({ ...menuFormData, image: e.target.value })}
                placeholder="https://example.com/image.jpg"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsMenuDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSaveMenuItem}
              className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white"
            >
              <Save className="w-4 h-4 mr-2" />
              {editingMenuItem ? 'Update' : 'Add'} Item
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Order Details Dialog */}
      <Dialog open={isOrderDialogOpen} onOpenChange={setIsOrderDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Order Details - {selectedOrder?.orderNumber}</DialogTitle>
            <DialogDescription>
              View and manage order information
            </DialogDescription>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm text-gray-500">Customer</Label>
                  <p className="font-semibold">{selectedOrder.customer}</p>
                </div>
                <div>
                  <Label className="text-sm text-gray-500">Phone</Label>
                  <p className="font-semibold">{selectedOrder.phone || 'N/A'}</p>
                </div>
                <div>
                  <Label className="text-sm text-gray-500">Status</Label>
                  <Badge className={getStatusColor(selectedOrder.status)}>
                    {selectedOrder.status}
                  </Badge>
                </div>
                <div>
                  <Label className="text-sm text-gray-500">Total</Label>
                  <p className="font-semibold text-lg">PKR {selectedOrder.total.toLocaleString()}</p>
                </div>
                <div className="col-span-2">
                  <Label className="text-sm text-gray-500">Delivery Address</Label>
                  <p className="font-semibold">{selectedOrder.deliveryAddress || 'N/A'}</p>
                </div>
              </div>
              <div className="border-t pt-4">
                <Label className="text-sm text-gray-500 mb-2 block">Order Items</Label>
                <div className="space-y-2">
                  <div className="flex justify-between p-2 bg-gray-50 rounded">
                    <span>Items count</span>
                    <span className="font-semibold">{selectedOrder.items} items</span>
                  </div>
                </div>
              </div>
              {getNextStatus(selectedOrder.status) && (
                <div className="border-t pt-4">
                  <Button
                    className="w-full bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white"
                    onClick={() => {
                      if (selectedOrder) {
                        handleUpdateOrderStatus(selectedOrder.id, getNextStatus(selectedOrder.status)!);
                        setIsOrderDialogOpen(false);
                      }
                    }}
                  >
                    Update to {getNextStatus(selectedOrder.status)}
                  </Button>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOrderDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      </div>
    </div>
  );
}

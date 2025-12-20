'use client';

import { useState } from 'react';
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
  Sparkles
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
import { ImageWithFallback } from '../../../components/figma/ImageWithFallback';

export default function PartnerDashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState<'today' | 'week' | 'month'>('week');

  // Mock data
  const stats = {
    revenue: { value: 45230, change: +12.5, period: 'vs last week' },
    orders: { value: 342, change: +8.2, period: 'vs last week' },
    customers: { value: 1289, change: +15.3, period: 'new this week' },
    rating: { value: 4.8, change: +0.2, period: 'from 4.6' },
  };

  const recentOrders = [
    { id: 'ORD-001', customer: 'Ahmed Ali', items: 3, total: 1250, status: 'preparing', time: '5 min ago' },
    { id: 'ORD-002', customer: 'Sara Khan', items: 2, total: 890, status: 'confirmed', time: '12 min ago' },
    { id: 'ORD-003', customer: 'Hassan Raza', items: 5, total: 2100, status: 'ready', time: '18 min ago' },
    { id: 'ORD-004', customer: 'Fatima Malik', items: 1, total: 450, status: 'delivered', time: '25 min ago' },
  ];

  const topItems = [
    { name: 'Chicken Biryani', orders: 142, revenue: 28400 },
    { name: 'Beef Burger', orders: 98, revenue: 19600 },
    { name: 'Pizza Margherita', orders: 76, revenue: 15200 },
    { name: 'Chicken Karahi', orders: 65, revenue: 19500 },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-blue-100 text-blue-700';
      case 'preparing': return 'bg-yellow-100 text-yellow-700';
      case 'ready': return 'bg-green-100 text-green-700';
      case 'delivered': return 'bg-purple-100 text-purple-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed': return CheckCircle;
      case 'preparing': return Clock;
      case 'ready': return Package;
      case 'delivered': return CheckCircle;
      default: return XCircle;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50">
      <Toaster />
      
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-4">
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
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="w-5 h-5 text-gray-600" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-orange-500 rounded-full"></span>
              </Button>
              <Button variant="ghost" size="icon">
                <Settings className="w-5 h-5 text-gray-600" />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-orange-500 to-pink-500 flex items-center justify-center text-white font-bold">
                      R
                    </div>
                    <span className="hidden md:inline">Restaurant Owner</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/partner/profile" className="cursor-pointer">Profile Settings</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/partner/menu" className="cursor-pointer">Menu Management</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/" className="cursor-pointer">Back to Home</Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">
                Welcome back, <span className="bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">Restaurant Owner</span>
              </h1>
              <p className="text-gray-600">Here's what's happening with your restaurant today</p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" className="hidden md:flex">
                <Calendar className="w-4 h-4 mr-2" />
                {selectedPeriod === 'today' ? 'Today' : selectedPeriod === 'week' ? 'This Week' : 'This Month'}
              </Button>
              <Button className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white">
                <Plus className="w-4 h-4 mr-2" />
                New Order
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
                  <h2 className="text-2xl font-bold mb-1">Burger Palace</h2>
                  <div className="flex items-center gap-4 text-sm opacity-90">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      <span>Karachi, Pakistan</span>
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Recent Orders - Takes 2 columns */}
          <div className="lg:col-span-2">
            <Card className="p-6 border-2">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-bold mb-1">Recent Orders</h3>
                  <p className="text-sm text-gray-600">Track and manage your orders</p>
                </div>
                <Button variant="outline" size="sm">
                  <Eye className="w-4 h-4 mr-2" />
                  View All
                </Button>
              </div>
              <div className="space-y-4">
                {recentOrders.map((order) => {
                  const StatusIcon = getStatusIcon(order.status);
                  return (
                    <div
                      key={order.id}
                      className="flex items-center justify-between p-4 rounded-xl border-2 hover:border-pink-200 hover:shadow-md transition-all bg-white"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-orange-100 to-pink-100 flex items-center justify-center">
                          <ShoppingBag className="w-6 h-6 text-pink-600" />
                        </div>
                        <div>
                          <p className="font-bold text-lg">{order.id}</p>
                          <p className="text-sm text-gray-600">{order.customer}</p>
                          <p className="text-xs text-gray-500 mt-1">{order.items} items • {order.time}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="font-bold text-lg">PKR {order.total.toLocaleString()}</p>
                          <Badge className={getStatusColor(order.status)}>
                            <StatusIcon className="w-3 h-3 mr-1" />
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </Badge>
                        </div>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="w-5 h-5 text-gray-400" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="space-y-6">
            <Card className="p-6 border-2">
              <h3 className="text-xl font-bold mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Button className="w-full justify-start bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white">
                  <Menu className="w-4 h-4 mr-2" />
                  Manage Menu
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  View Analytics
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Restaurant
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Users className="w-4 h-4 mr-2" />
                  View Reviews
                </Button>
              </div>
            </Card>

            {/* Restaurant Info */}
            <Card className="p-6 border-2 bg-gradient-to-br from-orange-50 to-pink-50">
              <h3 className="text-xl font-bold mb-4">Restaurant Info</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-pink-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">Address</p>
                    <p className="text-xs text-gray-600">123 Main Street, Karachi</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center">
                    <Phone className="w-5 h-5 text-pink-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">Phone</p>
                    <p className="text-xs text-gray-600">+92 300 1234567</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center">
                    <Mail className="w-5 h-5 text-pink-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">Email</p>
                    <p className="text-xs text-gray-600">info@burgerpalace.com</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Bottom Section - Top Items & Performance */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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

          {/* Performance Chart Placeholder */}
          <Card className="p-6 border-2">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-2xl font-bold mb-1">Performance</h3>
                <p className="text-sm text-gray-600">Revenue trend over time</p>
              </div>
              <BarChart3 className="w-6 h-6 text-pink-500" />
            </div>
            <div className="h-64 flex items-center justify-center bg-gradient-to-br from-orange-50 to-pink-50 rounded-xl border-2 border-dashed">
              <div className="text-center">
                <TrendingUp className="w-12 h-12 text-pink-400 mx-auto mb-3" />
                <p className="text-gray-600 font-semibold">Revenue Chart</p>
                <p className="text-sm text-gray-500">Visual analytics coming soon</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}


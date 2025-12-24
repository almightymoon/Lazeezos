'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { 
  LayoutDashboard,
  Users,
  Store,
  ShoppingBag,
  Bike,
  DollarSign,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  Bell,
  Settings,
  LogOut,
  Search,
  Filter,
  MoreVertical,
  CheckCircle,
  XCircle,
  Clock,
  Star,
  MapPin,
  Phone,
  Mail,
  Edit,
  Trash2,
  Eye,
  Shield,
  AlertTriangle,
  BarChart3,
  Activity,
  UserCheck,
  UserX,
  Package,
  Calendar,
  Target,
  Award,
  Zap,
  CreditCard,
  FileText,
  Download
} from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Card } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Avatar, AvatarFallback } from '../../../components/ui/avatar';
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/tabs';
import { LineChart, Line, BarChart, Bar, AreaChart, Area, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [userFilter, setUserFilter] = useState('all');
  const [restaurantFilter, setRestaurantFilter] = useState('all');
  const [orderFilter, setOrderFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState([
    { 
      label: 'Total Revenue', 
      value: 'PKR 2.45M', 
      change: '+12.5%', 
      trend: 'up',
      icon: DollarSign,
      color: 'from-green-500 to-emerald-600'
    },
    { 
      label: 'Total Users', 
      value: '15,234', 
      change: '+8.2%', 
      trend: 'up',
      icon: Users,
      color: 'from-blue-500 to-cyan-600'
    },
    { 
      label: 'Active Restaurants', 
      value: '342', 
      change: '+15.3%', 
      trend: 'up',
      icon: Store,
      color: 'from-orange-500 to-pink-600'
    },
    { 
      label: 'Active Riders', 
      value: '128', 
      change: '+5.1%', 
      trend: 'up',
      icon: Bike,
      color: 'from-purple-500 to-indigo-600'
    },
    { 
      label: 'Total Orders', 
      value: '8,456', 
      change: '+18.7%', 
      trend: 'up',
      icon: ShoppingBag,
      color: 'from-yellow-500 to-orange-600'
    },
    { 
      label: 'Avg Rating', 
      value: '4.7', 
      change: '+0.2', 
      trend: 'up',
      icon: Star,
      color: 'from-pink-500 to-rose-600'
    },
  ];

  const revenueData = [
    { month: 'Jan', revenue: 180000, orders: 1200 },
    { month: 'Feb', revenue: 210000, orders: 1450 },
    { month: 'Mar', revenue: 195000, orders: 1380 },
    { month: 'Apr', revenue: 240000, orders: 1650 },
    { month: 'May', revenue: 280000, orders: 1920 },
    { month: 'Jun', revenue: 245000, orders: 1850 },
  ];

  const orderStatusData = [
    { name: 'Delivered', value: 65, color: '#10b981' },
    { name: 'In Progress', value: 20, color: '#f59e0b' },
    { name: 'Pending', value: 10, color: '#3b82f6' },
    { name: 'Cancelled', value: 5, color: '#ef4444' },
  ];

  const users = [
    { id: '1', name: 'Ahmed Ali', email: 'ahmed@example.com', role: 'CUSTOMER', status: 'ACTIVE', orders: 12, joined: '2024-01-15' },
    { id: '2', name: 'Sara Khan', email: 'sara@example.com', role: 'CUSTOMER', status: 'ACTIVE', orders: 8, joined: '2024-02-20' },
    { id: '3', name: 'Hassan Raza', email: 'hassan@example.com', role: 'RESTAURANT_OWNER', status: 'ACTIVE', orders: 0, joined: '2024-01-10' },
    { id: '4', name: 'Fatima Malik', email: 'fatima@example.com', role: 'RIDER', status: 'ACTIVE', orders: 0, joined: '2024-03-05' },
    { id: '5', name: 'Ali Hassan', email: 'ali@example.com', role: 'CUSTOMER', status: 'SUSPENDED', orders: 5, joined: '2024-01-25' },
  ];

  const restaurants = [
    { id: '1', name: 'Burger Palace', owner: 'Hassan Raza', status: 'ACTIVE', orders: 342, rating: 4.8, revenue: 125000 },
    { id: '2', name: 'Pizza Heaven', owner: 'Ahmed Khan', status: 'ACTIVE', orders: 298, rating: 4.6, revenue: 98000 },
    { id: '3', name: 'Sushi Master', owner: 'Sara Ali', status: 'PENDING', orders: 0, rating: 0, revenue: 0 },
    { id: '4', name: 'Taco Fiesta', owner: 'Fatima Raza', status: 'ACTIVE', orders: 156, rating: 4.9, revenue: 67000 },
    { id: '5', name: 'Kebab House', owner: 'Ali Malik', status: 'SUSPENDED', orders: 45, rating: 3.2, revenue: 12000 },
  ];

  const orders = [
    { id: 'ORD-001', customer: 'Ahmed Ali', restaurant: 'Burger Palace', total: 1250, status: 'DELIVERED', date: '2024-06-15', rider: 'Fatima Malik' },
    { id: 'ORD-002', customer: 'Sara Khan', restaurant: 'Pizza Heaven', total: 890, status: 'ON_THE_WAY', date: '2024-06-15', rider: 'Ali Hassan' },
    { id: 'ORD-003', customer: 'Hassan Raza', restaurant: 'Sushi Master', total: 2100, status: 'PREPARING', date: '2024-06-15', rider: '-' },
    { id: 'ORD-004', customer: 'Fatima Malik', restaurant: 'Taco Fiesta', total: 450, status: 'CANCELLED', date: '2024-06-14', rider: '-' },
    { id: 'ORD-005', customer: 'Ali Hassan', restaurant: 'Burger Palace', total: 1800, status: 'DELIVERED', date: '2024-06-14', rider: 'Fatima Malik' },
  ];

  const riders = [
    { id: '1', name: 'Fatima Malik', email: 'fatima@example.com', status: 'ONLINE', deliveries: 156, rating: 4.9, earnings: 125000 },
    { id: '2', name: 'Ali Hassan', email: 'ali@example.com', status: 'ONLINE', deliveries: 142, rating: 4.8, earnings: 112000 },
    { id: '3', name: 'Ahmed Khan', email: 'ahmed@example.com', status: 'OFFLINE', deliveries: 98, rating: 4.7, earnings: 78000 },
    { id: '4', name: 'Sara Ali', email: 'sara@example.com', status: 'ON_DELIVERY', deliveries: 203, rating: 4.9, earnings: 165000 },
    { id: '5', name: 'Hassan Raza', email: 'hassan@example.com', status: 'SUSPENDED', deliveries: 45, rating: 3.5, earnings: 12000 },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
      case 'ONLINE':
      case 'DELIVERED': return 'bg-green-100 text-green-700';
      case 'PENDING': return 'bg-yellow-100 text-yellow-700';
      case 'SUSPENDED':
      case 'CANCELLED': return 'bg-red-100 text-red-700';
      case 'INACTIVE':
      case 'OFFLINE': return 'bg-gray-100 text-gray-700';
      case 'PREPARING':
      case 'ON_THE_WAY':
      case 'ON_DELIVERY': return 'bg-blue-100 text-blue-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ACTIVE':
      case 'ONLINE':
      case 'DELIVERED': return CheckCircle;
      case 'PENDING': return Clock;
      case 'SUSPENDED':
      case 'CANCELLED': return XCircle;
      case 'INACTIVE':
      case 'OFFLINE': return XCircle;
      case 'PREPARING':
      case 'ON_THE_WAY':
      case 'ON_DELIVERY': return Clock;
      default: return AlertTriangle;
    }
  };

  const handleLogout = () => {
    toast.success('Logged out successfully');
    router.push('/');
  };

  const filteredUsers = users.filter(user => {
    const matchesFilter = userFilter === 'all' || user.status === userFilter || user.role === userFilter;
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const filteredRestaurants = restaurants.filter(restaurant => {
    const matchesFilter = restaurantFilter === 'all' || restaurant.status === restaurantFilter;
    const matchesSearch = restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         restaurant.owner.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const filteredOrders = orders.filter(order => {
    if (orderFilter !== 'all' && order.status !== orderFilter) return false;
    return order.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
           order.restaurant.toLowerCase().includes(searchQuery.toLowerCase()) ||
           order.id.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50">
      <Toaster />
      
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200/50 shadow-sm">
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
              <span className="text-xl md:text-2xl font-bold bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 bg-clip-text text-transparent">
                Lazeezos Admin
              </span>
            </Link>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="icon" className="relative hover:bg-gray-100 rounded-xl">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full flex items-center justify-center font-bold shadow-lg">
                  3
                </span>
              </Button>
              <Button variant="outline" size="icon" className="hover:bg-gray-100 rounded-xl">
                <Settings className="w-5 h-5" />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    className="inline-flex items-center justify-center rounded-xl hover:bg-gray-100 h-10 w-10 transition-all focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
                  >
                    <Avatar className="w-10 h-10 bg-gradient-to-r from-orange-500 to-pink-500 ring-2 ring-white shadow-lg">
                      <AvatarFallback className="text-white font-semibold">AD</AvatarFallback>
                    </Avatar>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 z-[100]" sideOffset={8}>
                  <DropdownMenuLabel>Admin Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onSelect={(e) => {
                    e.preventDefault();
                    setActiveTab('settings');
                  }}>
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={(e) => {
                    e.preventDefault();
                    router.push('/');
                  }}>
                    <Eye className="mr-2 h-4 w-4" />
                    View Site
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onSelect={(e) => {
                    e.preventDefault();
                    handleLogout();
                  }} className="text-red-600 focus:text-red-600 focus:bg-red-50">
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Tabs Navigation */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-8 bg-white/90 backdrop-blur-md border-2 border-gray-200/50 shadow-lg rounded-2xl p-1.5 h-auto gap-1">
            <TabsTrigger 
              value="dashboard" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-pink-500 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-orange-500/30 data-[state=active]:scale-[1.02] text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition-all duration-200 px-6 py-3 rounded-xl font-semibold text-sm"
            >
              <LayoutDashboard className="w-4 h-4 mr-2.5" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger 
              value="users" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-pink-500 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-orange-500/30 data-[state=active]:scale-[1.02] text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition-all duration-200 px-6 py-3 rounded-xl font-semibold text-sm"
            >
              <Users className="w-4 h-4 mr-2.5" />
              Users
            </TabsTrigger>
            <TabsTrigger 
              value="restaurants" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-pink-500 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-orange-500/30 data-[state=active]:scale-[1.02] text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition-all duration-200 px-6 py-3 rounded-xl font-semibold text-sm"
            >
              <Store className="w-4 h-4 mr-2.5" />
              Restaurants
            </TabsTrigger>
            <TabsTrigger 
              value="orders" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-pink-500 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-orange-500/30 data-[state=active]:scale-[1.02] text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition-all duration-200 px-6 py-3 rounded-xl font-semibold text-sm"
            >
              <ShoppingBag className="w-4 h-4 mr-2.5" />
              Orders
            </TabsTrigger>
            <TabsTrigger 
              value="riders" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-pink-500 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-orange-500/30 data-[state=active]:scale-[1.02] text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition-all duration-200 px-6 py-3 rounded-xl font-semibold text-sm"
            >
              <Bike className="w-4 h-4 mr-2.5" />
              Riders
            </TabsTrigger>
            <TabsTrigger 
              value="analytics" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-pink-500 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-orange-500/30 data-[state=active]:scale-[1.02] text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition-all duration-200 px-6 py-3 rounded-xl font-semibold text-sm"
            >
              <BarChart3 className="w-4 h-4 mr-2.5" />
              Analytics
            </TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <Card key={index} className="p-6 hover:shadow-xl transition-all duration-300 border-2 hover:scale-[1.02] relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-200/50 to-pink-200/50 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="relative z-10">
                      <div className="flex items-start justify-between mb-4">
                        <div className={`w-14 h-14 rounded-2xl bg-gradient-to-r ${stat.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                          <Icon className="w-7 h-7 text-white" />
                        </div>
                        <div className={`flex items-center gap-1 text-sm font-semibold ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                          {stat.trend === 'up' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                          {stat.change}
                        </div>
                      </div>
                      <p className="text-gray-600 text-sm mb-2 font-medium">{stat.label}</p>
                      <p className="text-3xl font-bold mb-2 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">{stat.value}</p>
                    </div>
                  </Card>
                );
              })}
            </div>

            {/* Charts */}
            <div className="grid lg:grid-cols-2 gap-6">
              <Card className="p-6 border-2 hover:shadow-xl transition-all duration-300">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">Revenue Trend</h3>
                  <TrendingUp className="w-5 h-5 text-green-500" />
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={revenueData}>
                    <defs>
                      <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        border: '1px solid #e5e7eb', 
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                      }} 
                    />
                    <Area type="monotone" dataKey="revenue" stroke="#10b981" fillOpacity={1} fill="url(#revenueGradient)" strokeWidth={3} />
                  </AreaChart>
                </ResponsiveContainer>
              </Card>

              <Card className="p-6 border-2 hover:shadow-xl transition-all duration-300">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Order Status</h3>
                  <Activity className="w-5 h-5 text-purple-500" />
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        border: '1px solid #e5e7eb', 
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                      }} 
                    />
                    <Pie data={orderStatusData} cx="50%" cy="50%" labelLine={false} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} outerRadius={80} fill="#8884d8" dataKey="value">
                      {orderStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </Card>
            </div>

            {/* Recent Activity */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="p-6 border-2 hover:shadow-xl transition-all duration-300">
                <h3 className="text-xl font-bold mb-6 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">Recent Orders</h3>
                <div className="space-y-3">
                  {orders.slice(0, 5).map((order) => {
                    const StatusIcon = getStatusIcon(order.status);
                    return (
                      <div key={order.id} className="flex items-center justify-between p-3 bg-gradient-to-r from-gray-50 to-white rounded-xl hover:shadow-md transition-all duration-200 border border-gray-100">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${getStatusColor(order.status)}`}>
                            <StatusIcon className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="font-bold text-sm text-gray-900">{order.id}</p>
                            <p className="text-xs text-gray-600">{order.customer} • {order.restaurant}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-sm bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">PKR {order.total}</p>
                          <Badge className={getStatusColor(order.status)}>
                            {order.status}
                          </Badge>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Card>

              <Card className="p-6 border-2 hover:shadow-xl transition-all duration-300">
                <h3 className="text-xl font-bold mb-6 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">Pending Actions</h3>
                <div className="space-y-3">
                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
                    <div className="flex items-center gap-3 mb-2">
                      <Store className="w-5 h-5 text-yellow-600" />
                      <p className="font-bold text-sm">3 Restaurants Pending Approval</p>
                    </div>
                    <Button size="sm" className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white">
                      Review Now
                    </Button>
                  </div>
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
                    <div className="flex items-center gap-3 mb-2">
                      <Users className="w-5 h-5 text-blue-600" />
                      <p className="font-bold text-sm">5 Users Pending Verification</p>
                    </div>
                    <Button size="sm" variant="outline" className="border-blue-300 text-blue-700 hover:bg-blue-100">
                      Review Now
                    </Button>
                  </div>
                  <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                    <div className="flex items-center gap-3 mb-2">
                      <AlertTriangle className="w-5 h-5 text-red-600" />
                      <p className="font-bold text-sm">2 Reports Require Attention</p>
                    </div>
                    <Button size="sm" variant="outline" className="border-red-300 text-red-700 hover:bg-red-100">
                      View Reports
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-6">
            <Card className="p-6 border-2">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-2xl font-bold mb-1">User Management</h2>
                  <p className="text-sm text-gray-600">Manage all platform users</p>
                </div>
                <div className="flex gap-3">
                  <div className="relative flex-1 md:flex-initial">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      placeholder="Search users..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 w-full md:w-[250px]"
                    />
                  </div>
                  <Select value={userFilter} onValueChange={setUserFilter}>
                    <SelectTrigger className="w-full md:w-[180px]">
                      <Filter className="w-4 h-4 mr-2" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Users</SelectItem>
                      <SelectItem value="ACTIVE">Active</SelectItem>
                      <SelectItem value="SUSPENDED">Suspended</SelectItem>
                      <SelectItem value="CUSTOMER">Customers</SelectItem>
                      <SelectItem value="RESTAURANT_OWNER">Restaurant Owners</SelectItem>
                      <SelectItem value="RIDER">Riders</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-semibold">User</th>
                      <th className="text-left py-3 px-4 font-semibold">Role</th>
                      <th className="text-left py-3 px-4 font-semibold">Status</th>
                      <th className="text-left py-3 px-4 font-semibold">Orders</th>
                      <th className="text-left py-3 px-4 font-semibold">Joined</th>
                      <th className="text-left py-3 px-4 font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user) => {
                      const StatusIcon = getStatusIcon(user.status);
                      return (
                        <tr key={user.id} className="border-b hover:bg-gray-50 transition-colors">
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-3">
                              <Avatar className="w-10 h-10 bg-gradient-to-r from-orange-500 to-pink-500">
                                <AvatarFallback className="text-white font-semibold text-xs">
                                  {user.name.split(' ').map(n => n[0]).join('')}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-semibold">{user.name}</p>
                                <p className="text-sm text-gray-600">{user.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <Badge variant="outline">{user.role.replace('_', ' ')}</Badge>
                          </td>
                          <td className="py-4 px-4">
                            <Badge className={getStatusColor(user.status)}>
                              <StatusIcon className="w-3 h-3 mr-1" />
                              {user.status}
                            </Badge>
                          </td>
                          <td className="py-4 px-4 font-semibold">{user.orders}</td>
                          <td className="py-4 px-4 text-gray-600">{user.joined}</td>
                          <td className="py-4 px-4">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreVertical className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>
                                  <Eye className="mr-2 h-4 w-4" />
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit User
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  className="text-red-600"
                                  onClick={() => handleUpdateUserStatus(user.id, user.status === 'SUSPENDED' ? 'ACTIVE' : 'SUSPENDED')}
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  {user.status === 'SUSPENDED' ? 'Activate User' : 'Suspend User'}
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </Card>
          </TabsContent>

          {/* Restaurants Tab */}
          <TabsContent value="restaurants" className="space-y-6">
            <Card className="p-6 border-2">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-2xl font-bold mb-1">Restaurant Management</h2>
                  <p className="text-sm text-gray-600">Manage all restaurants on the platform</p>
                </div>
                <div className="flex gap-3">
                  <div className="relative flex-1 md:flex-initial">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      placeholder="Search restaurants..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 w-full md:w-[250px]"
                    />
                  </div>
                  <Select value={restaurantFilter} onValueChange={setRestaurantFilter}>
                    <SelectTrigger className="w-full md:w-[180px]">
                      <Filter className="w-4 h-4 mr-2" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="ACTIVE">Active</SelectItem>
                      <SelectItem value="PENDING">Pending</SelectItem>
                      <SelectItem value="SUSPENDED">Suspended</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredRestaurants.map((restaurant) => {
                  const StatusIcon = getStatusIcon(restaurant.status);
                  return (
                    <Card key={restaurant.id} className="p-6 border-2 hover:shadow-xl transition-all duration-300">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-xl font-bold mb-1">{restaurant.name}</h3>
                          <p className="text-sm text-gray-600 mb-3">Owner: {restaurant.owner}</p>
                          <Badge className={getStatusColor(restaurant.status)}>
                            <StatusIcon className="w-3 h-3 mr-1" />
                            {restaurant.status}
                          </Badge>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit Restaurant
                            </DropdownMenuItem>
                            {restaurant.status === 'PENDING' && (
                              <DropdownMenuItem 
                                className="text-green-600"
                                onClick={() => handleUpdateRestaurantStatus(restaurant.id, 'ACTIVE')}
                              >
                                <CheckCircle className="mr-2 h-4 w-4" />
                                Approve
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem 
                              className="text-red-600"
                              onClick={() => handleUpdateRestaurantStatus(restaurant.id, restaurant.status === 'SUSPENDED' ? 'ACTIVE' : 'SUSPENDED')}
                            >
                              <XCircle className="mr-2 h-4 w-4" />
                              {restaurant.status === 'SUSPENDED' ? 'Activate' : 'Suspend'}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      <div className="space-y-2 pt-4 border-t">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Orders</span>
                          <span className="font-semibold">{restaurant.orders}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Rating</span>
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                            <span className="font-semibold">{restaurant.rating || 'N/A'}</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Revenue</span>
                          <span className="font-semibold text-green-600">PKR {restaurant.revenue.toLocaleString()}</span>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </Card>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders" className="space-y-6">
            <Card className="p-6 border-2">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-2xl font-bold mb-1">Order Management</h2>
                  <p className="text-sm text-gray-600">View and manage all orders</p>
                </div>
                <div className="flex gap-3">
                  <div className="relative flex-1 md:flex-initial">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      placeholder="Search orders..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 w-full md:w-[250px]"
                    />
                  </div>
                  <Select value={orderFilter} onValueChange={setOrderFilter}>
                    <SelectTrigger className="w-full md:w-[180px]">
                      <Filter className="w-4 h-4 mr-2" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Orders</SelectItem>
                      <SelectItem value="PENDING">Pending</SelectItem>
                      <SelectItem value="PREPARING">Preparing</SelectItem>
                      <SelectItem value="ON_THE_WAY">On The Way</SelectItem>
                      <SelectItem value="DELIVERED">Delivered</SelectItem>
                      <SelectItem value="CANCELLED">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-semibold">Order ID</th>
                      <th className="text-left py-3 px-4 font-semibold">Customer</th>
                      <th className="text-left py-3 px-4 font-semibold">Restaurant</th>
                      <th className="text-left py-3 px-4 font-semibold">Rider</th>
                      <th className="text-left py-3 px-4 font-semibold">Total</th>
                      <th className="text-left py-3 px-4 font-semibold">Status</th>
                      <th className="text-left py-3 px-4 font-semibold">Date</th>
                      <th className="text-left py-3 px-4 font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.map((order) => {
                      const StatusIcon = getStatusIcon(order.status);
                      return (
                        <tr key={order.id} className="border-b hover:bg-gray-50 transition-colors">
                          <td className="py-4 px-4 font-semibold">{order.id}</td>
                          <td className="py-4 px-4">{order.customer}</td>
                          <td className="py-4 px-4">{order.restaurant}</td>
                          <td className="py-4 px-4">{order.rider}</td>
                          <td className="py-4 px-4 font-semibold text-green-600">PKR {order.total}</td>
                          <td className="py-4 px-4">
                            <Badge className={getStatusColor(order.status)}>
                              <StatusIcon className="w-3 h-3 mr-1" />
                              {order.status}
                            </Badge>
                          </td>
                          <td className="py-4 px-4 text-gray-600">{order.date}</td>
                          <td className="py-4 px-4">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreVertical className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>
                                  <Eye className="mr-2 h-4 w-4" />
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Edit className="mr-2 h-4 w-4" />
                                  Update Status
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </Card>
          </TabsContent>

          {/* Riders Tab */}
          <TabsContent value="riders" className="space-y-6">
            <Card className="p-6 border-2">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-2xl font-bold mb-1">Rider Management</h2>
                  <p className="text-sm text-gray-600">Manage all delivery riders</p>
                </div>
                <Button className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white">
                  <Download className="w-4 h-4 mr-2" />
                  Export Report
                </Button>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {riders.map((rider) => {
                  const StatusIcon = getStatusIcon(rider.status);
                  return (
                    <Card key={rider.id} className="p-6 border-2 hover:shadow-xl transition-all duration-300">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <Avatar className="w-12 h-12 bg-gradient-to-r from-orange-500 to-pink-500">
                            <AvatarFallback className="text-white font-semibold">
                              {rider.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-bold">{rider.name}</h3>
                            <p className="text-sm text-gray-600">{rider.email}</p>
                          </div>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit Rider
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600">
                              <XCircle className="mr-2 h-4 w-4" />
                              {rider.status === 'SUSPENDED' ? 'Activate' : 'Suspend'}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      <div className="space-y-3 pt-4 border-t">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Status</span>
                          <Badge className={getStatusColor(rider.status)}>
                            <StatusIcon className="w-3 h-3 mr-1" />
                            {rider.status}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Deliveries</span>
                          <span className="font-semibold">{rider.deliveries}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Rating</span>
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                            <span className="font-semibold">{rider.rating}</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Earnings</span>
                          <span className="font-semibold text-green-600">PKR {rider.earnings.toLocaleString()}</span>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card className="p-6 border-2 hover:shadow-xl transition-all duration-300">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">Revenue & Orders</h3>
                  <BarChart3 className="w-5 h-5 text-blue-500" />
                </div>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="month" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        border: '1px solid #e5e7eb', 
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                      }} 
                    />
                    <Legend />
                    <Bar yAxisId="left" dataKey="revenue" fill="url(#revenueBarGradient)" radius={[8, 8, 0, 0]} />
                    <Bar yAxisId="right" dataKey="orders" fill="url(#ordersBarGradient)" radius={[8, 8, 0, 0]} />
                    <defs>
                      <linearGradient id="revenueBarGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#10b981" stopOpacity={1}/>
                        <stop offset="100%" stopColor="#059669" stopOpacity={1}/>
                      </linearGradient>
                      <linearGradient id="ordersBarGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#8b5cf6" stopOpacity={1}/>
                        <stop offset="100%" stopColor="#7c3aed" stopOpacity={1}/>
                      </linearGradient>
                    </defs>
                  </BarChart>
                </ResponsiveContainer>
              </Card>

              <Card className="p-6 border-2 hover:shadow-xl transition-all duration-300">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">User Growth</h3>
                  <TrendingUp className="w-5 h-5 text-purple-500" />
                </div>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        border: '1px solid #e5e7eb', 
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                      }} 
                    />
                    <Line type="monotone" dataKey="orders" stroke="#8b5cf6" strokeWidth={3} />
                  </LineChart>
                </ResponsiveContainer>
              </Card>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <Card className="p-6 border-2 hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-green-50 to-emerald-50">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-gray-600 text-sm font-medium mb-1">Total Revenue</p>
                    <p className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">PKR 2.45M</p>
                  </div>
                  <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <DollarSign className="w-8 h-8 text-white" />
                  </div>
                </div>
                <p className="text-sm text-green-600 font-semibold flex items-center gap-1">
                  <TrendingUp className="w-4 h-4" />
                  ↑ 12.5% from last month
                </p>
              </Card>

              <Card className="p-6 border-2 hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-blue-50 to-cyan-50">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-gray-600 text-sm font-medium mb-1">Active Users</p>
                    <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">15,234</p>
                  </div>
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <Users className="w-8 h-8 text-white" />
                  </div>
                </div>
                <p className="text-sm text-blue-600 font-semibold flex items-center gap-1">
                  <TrendingUp className="w-4 h-4" />
                  ↑ 8.2% from last month
                </p>
              </Card>

              <Card className="p-6 border-2 hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-orange-50 to-pink-50">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-gray-600 text-sm font-medium mb-1">Total Orders</p>
                    <p className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">8,456</p>
                  </div>
                  <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <ShoppingBag className="w-8 h-8 text-white" />
                  </div>
                </div>
                <p className="text-sm text-orange-600 font-semibold flex items-center gap-1">
                  <TrendingUp className="w-4 h-4" />
                  ↑ 18.7% from last month
                </p>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}


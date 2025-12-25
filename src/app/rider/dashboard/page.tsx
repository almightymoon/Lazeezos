'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  LayoutDashboard, 
  Package, 
  DollarSign, 
  Clock, 
  MapPin, 
  Settings, 
  Bell, 
  TrendingUp, 
  Award,
  Navigation,
  CheckCircle,
  XCircle,
  Star,
  LogOut,
  PhoneCall,
  ChevronRight,
  Bike,
  Calendar,
  Target,
  Zap,
  User,
  HelpCircle,
  Shield,
  CreditCard
} from 'lucide-react';
import { Card } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Badge } from '../../../components/ui/badge';
import { Avatar, AvatarFallback } from '../../../components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/tabs';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../../../components/ui/dropdown-menu';
import { LineChart, Line, BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { toast } from 'sonner';
import { Toaster } from '../../../components/ui/sonner';

export default function RiderDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isOnline, setIsOnline] = useState(true);
  const [loading, setLoading] = useState(true);
  const [todayStats, setTodayStats] = useState([
    { 
      label: 'Today\'s Earnings', 
      value: 'PKR 18,750', 
      change: '+PKR 3,250', 
      trend: 'up',
      icon: DollarSign,
      color: 'from-green-500 to-emerald-600'
    },
    { 
      label: 'Deliveries Completed', 
      value: '24', 
      change: '+8 from yesterday', 
      trend: 'up',
      icon: CheckCircle,
      color: 'from-blue-500 to-cyan-600'
    },
    { 
      label: 'Average Rating', 
      value: '4.9', 
      change: '★★★★★', 
      trend: 'up',
      icon: Star,
      color: 'from-yellow-500 to-orange-600'
    },
    { 
      label: 'Active Hours', 
      value: '7.5h', 
      change: 'Today', 
      trend: 'up',
      icon: Clock,
      color: 'from-purple-500 to-pink-600'
    }
  ]);

  const [earningsData, setEarningsData] = useState<Array<{ day: string; earnings: number; deliveries: number }>>([]);
  const [weeklyPerformance, setWeeklyPerformance] = useState<Array<{ hour: string; orders: number }>>([]);
  const [availableOrders, setAvailableOrders] = useState<Array<any>>([]);
  const [activeDelivery, setActiveDelivery] = useState<any>(null);
  const [deliveryHistory, setDeliveryHistory] = useState<Array<any>>([]);

  // Fetch rider stats
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/rider/stats', { cache: 'no-store' });
        if (response.ok) {
          const data = await response.json();
          setTodayStats([
            { 
              label: 'Today\'s Earnings', 
              value: `PKR ${data.todayEarnings.toLocaleString()}`, 
              change: '', 
              trend: 'up',
              icon: DollarSign,
              color: 'from-green-500 to-emerald-600'
            },
            { 
              label: 'Deliveries Completed', 
              value: data.deliveriesCompleted.toString(), 
              change: '', 
              trend: 'up',
              icon: CheckCircle,
              color: 'from-blue-500 to-cyan-600'
            },
            { 
              label: 'Average Rating', 
              value: data.averageRating.toFixed(1), 
              change: '★'.repeat(Math.round(data.averageRating)), 
              trend: 'up',
              icon: Star,
              color: 'from-yellow-500 to-orange-600'
            },
            { 
              label: 'Active Hours', 
              value: `${data.activeHours}h`, 
              change: 'Today', 
              trend: 'up',
              icon: Clock,
              color: 'from-purple-500 to-pink-600'
            },
          ]);
          setEarningsData(data.weeklyEarnings || []);
          setWeeklyPerformance(data.weeklyPerformance || []);
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  // Fetch orders
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        // Fetch available orders
        const availableRes = await fetch('/api/rider/orders?type=available', { cache: 'no-store' });
        if (availableRes.ok) {
          const availableData = await availableRes.json();
          setAvailableOrders(availableData.availableOrders || []);
        }

        // Fetch active delivery
        const activeRes = await fetch('/api/rider/orders?type=active', { cache: 'no-store' });
        if (activeRes.ok) {
          const activeData = await activeRes.json();
          setActiveDelivery(activeData.activeDelivery);
        }

        // Fetch delivery history
        const historyRes = await fetch('/api/rider/orders?type=history', { cache: 'no-store' });
        if (historyRes.ok) {
          const historyData = await historyRes.json();
          setDeliveryHistory(historyData.deliveryHistory || []);
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    fetchOrders();
    const interval = setInterval(fetchOrders, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const handleAcceptOrder = async (orderId: string) => {
    try {
      const response = await fetch('/api/rider/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId }),
      });
      if (response.ok) {
        toast.success(`Order ${orderId} accepted! Navigate to pickup location.`);
        // Refresh orders
        const availableRes = await fetch('/api/rider/orders?type=available', { cache: 'no-store' });
        if (availableRes.ok) {
          const data = await availableRes.json();
          setAvailableOrders(data.availableOrders || []);
        }
        const activeRes = await fetch('/api/rider/orders?type=active', { cache: 'no-store' });
        if (activeRes.ok) {
          const data = await activeRes.json();
          setActiveDelivery(data.activeDelivery);
        }
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to accept order');
      }
    } catch (error) {
      console.error('Error accepting order:', error);
      toast.error('Failed to accept order');
    }
  };

  const handleLogout = () => {
    toast.success('Logged out successfully');
    router.push('/rider');
  };

  const getPriorityBadge = (priority: string) => {
    if (priority === 'high') {
      return <Badge className="bg-red-100 text-red-700">High Priority</Badge>;
    }
    return null;
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50">
      <Toaster />
      
      {/* Sidebar */}
      <div className="w-72 bg-white/95 backdrop-blur-md border-r border-gray-200/50 shadow-2xl flex flex-col">
        <div className="p-6 border-b border-gray-200/50">
          <div className="bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 text-white px-5 py-4 rounded-2xl shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <Bike className="w-5 h-5" />
                </div>
                <h1 className="text-xl font-bold">Rider Dashboard</h1>
              </div>
              <p className="text-xs opacity-90">Alex Johnson</p>
            </div>
          </div>
        </div>

        {/* Online/Offline Toggle */}
        <div className="p-4 border-b border-gray-200/50">
          <div className={`flex items-center justify-between p-4 rounded-2xl transition-all duration-300 shadow-lg ${
            isOnline 
              ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white' 
              : 'bg-gray-100 text-gray-600'
          }`}>
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${isOnline ? 'bg-white shadow-lg' : 'bg-gray-400'} animate-pulse`}></div>
              <span className="font-semibold text-sm">{isOnline ? 'Online' : 'Offline'}</span>
            </div>
            <button
              onClick={() => {
                setIsOnline(!isOnline);
                toast.success(isOnline ? 'You are now offline' : 'You are now online');
              }}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
                isOnline 
                  ? 'bg-white/20 hover:bg-white/30 backdrop-blur-sm' 
                  : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              {isOnline ? 'Go Offline' : 'Go Online'}
            </button>
          </div>
        </div>

        <nav className="flex-1 p-4 overflow-y-auto">
          <div className="space-y-2">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
              { id: 'deliveries', label: 'Available Orders', icon: Package },
              { id: 'active', label: 'Active Delivery', icon: Navigation, badge: '1' },
              { id: 'earnings', label: 'Earnings', icon: DollarSign },
              { id: 'history', label: 'History', icon: Clock },
              { id: 'settings', label: 'Settings', icon: Settings },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl transition-all duration-200 group ${
                    activeTab === item.id
                      ? 'bg-gradient-to-r from-orange-500 to-pink-500 text-white shadow-lg shadow-orange-500/30 scale-[1.02]'
                      : 'text-gray-600 hover:bg-gradient-to-r hover:from-orange-50 hover:to-pink-50 hover:text-gray-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-5 h-5 ${activeTab === item.id ? 'text-white' : 'text-gray-500 group-hover:text-orange-500'}`} />
                    <span className="font-medium text-sm">{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className={`w-6 h-6 ${activeTab === item.id ? 'bg-white/30' : 'bg-red-500'} text-white text-xs rounded-full flex items-center justify-center font-bold shadow-sm`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </nav>

        <div className="p-4 border-t border-gray-200/50">
          <Button
            variant="ghost"
            className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl transition-all"
            onClick={handleLogout}
          >
            <LogOut className="w-5 h-5 mr-3" />
            Logout
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 fixed top-0 left-72 right-0 z-50 shadow-sm">
          <div className="flex items-center justify-between p-6">
            <div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
                {activeTab === 'dashboard' && 'Dashboard Overview'}
                {activeTab === 'deliveries' && 'Available Orders'}
                {activeTab === 'active' && 'Active Delivery'}
                {activeTab === 'earnings' && 'Earnings & Performance'}
                {activeTab === 'history' && 'Delivery History'}
                {activeTab === 'settings' && 'Settings'}
              </h2>
              <p className="text-gray-600 mt-1">
                {isOnline ? 'You\'re online and ready to deliver!' : 'Go online to start receiving orders'}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="icon" className="relative hover:bg-gray-100 rounded-xl transition-all">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full flex items-center justify-center font-bold shadow-lg">
                  2
                </span>
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    className="inline-flex items-center justify-center rounded-xl hover:bg-gray-100 h-10 w-10 transition-all focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
                    aria-label="User menu"
                  >
                    <Avatar className="w-10 h-10 bg-gradient-to-r from-orange-500 to-pink-500 ring-2 ring-white shadow-lg">
                      <AvatarFallback className="text-white font-semibold">AJ</AvatarFallback>
                    </Avatar>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 z-[100]" sideOffset={8}>
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onSelect={(e) => {
                    e.preventDefault();
                    router.push('/rider/dashboard');
                    setActiveTab('settings');
                  }}>
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={(e) => {
                    e.preventDefault();
                    router.push('/rider/dashboard');
                    setActiveTab('earnings');
                  }}>
                    <DollarSign className="mr-2 h-4 w-4" />
                    Earnings
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={(e) => {
                    e.preventDefault();
                    router.push('/rider/dashboard');
                    setActiveTab('history');
                  }}>
                    <Clock className="mr-2 h-4 w-4" />
                    Delivery History
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={(e) => {
                    e.preventDefault();
                    router.push('/rider/dashboard');
                    setActiveTab('settings');
                  }}>
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={(e) => {
                    e.preventDefault();
                    router.push('/help');
                  }}>
                    <HelpCircle className="mr-2 h-4 w-4" />
                    Help Center
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

        <div className="pt-20">
        {/* Content */}
        <div className="p-6">
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {todayStats.map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <Card key={index} className="p-6 hover:shadow-xl transition-all duration-300 border-2 hover:scale-[1.02] relative overflow-hidden group">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-200/50 to-pink-200/50 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      <div className="relative z-10">
                        <div className="flex items-start justify-between mb-4">
                          <div className={`w-14 h-14 rounded-2xl bg-gradient-to-r ${stat.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                            <Icon className="w-7 h-7 text-white" />
                          </div>
                        </div>
                        <p className="text-gray-600 text-sm mb-2 font-medium">{stat.label}</p>
                        <p className="text-3xl font-bold mb-2 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">{stat.value}</p>
                        <p className="text-sm text-gray-500 font-medium">{stat.change}</p>
                      </div>
                    </Card>
                  );
                })}
              </div>

              {/* Charts */}
              <div className="grid lg:grid-cols-2 gap-6">
                <Card className="p-6 border-2 hover:shadow-xl transition-all duration-300">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">Weekly Earnings</h3>
                    <TrendingUp className="w-5 h-5 text-green-500" />
                  </div>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={earningsData}>
                      <defs>
                        <linearGradient id="colorEarnings" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="day" />
                      <YAxis />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'white', 
                          border: '1px solid #e5e7eb', 
                          borderRadius: '8px',
                          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                        }} 
                      />
                      <Area type="monotone" dataKey="earnings" stroke="#10b981" fillOpacity={1} fill="url(#colorEarnings)" strokeWidth={3} />
                    </AreaChart>
                  </ResponsiveContainer>
                </Card>

                <Card className="p-6 border-2 hover:shadow-xl transition-all duration-300">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Peak Hours Performance</h3>
                    <TrendingUp className="w-5 h-5 text-purple-500" />
                  </div>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={weeklyPerformance}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="hour" />
                      <YAxis />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'white', 
                          border: '1px solid #e5e7eb', 
                          borderRadius: '8px',
                          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                        }} 
                      />
                      <Bar dataKey="orders" fill="url(#barGradient)" radius={[8, 8, 0, 0]} />
                      <defs>
                        <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#8b5cf6" stopOpacity={1}/>
                          <stop offset="100%" stopColor="#ec4899" stopOpacity={1}/>
                        </linearGradient>
                      </defs>
                    </BarChart>
                  </ResponsiveContainer>
                </Card>
              </div>

              {/* Quick Stats */}
              <div className="grid md:grid-cols-3 gap-6">
                <Card className="p-6 border-2 hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-green-50 to-emerald-50">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-gray-600 text-sm font-medium mb-1">Weekly Total</p>
                      <p className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">PKR 12,300</p>
                    </div>
                    <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
                      <DollarSign className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  <p className="text-sm text-green-600 font-semibold flex items-center gap-1">
                    <TrendingUp className="w-4 h-4" />
                    ↑ 18% from last week
                  </p>
                </Card>

                <Card className="p-6 border-2 hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-blue-50 to-cyan-50">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-gray-600 text-sm font-medium mb-1">Total Deliveries</p>
                      <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">156</p>
                    </div>
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-2xl flex items-center justify-center shadow-lg">
                      <Package className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  <p className="text-sm text-blue-600 font-semibold">This week</p>
                </Card>

                <Card className="p-6 border-2 hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-purple-50 to-pink-50">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-gray-600 text-sm font-medium mb-1">Avg per Delivery</p>
                      <p className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">PKR 789</p>
                    </div>
                    <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg">
                      <TrendingUp className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  <p className="text-sm text-purple-600 font-semibold">Last 7 days</p>
                </Card>
              </div>

              {/* Recent Activity */}
              <Card className="p-6 border-2 hover:shadow-xl transition-all duration-300">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">Recent Deliveries</h3>
                  <Badge className="bg-gradient-to-r from-green-500 to-emerald-600 text-white">5 deliveries</Badge>
                </div>
                <div className="space-y-3">
                  {deliveryHistory.slice(0, 5).map((delivery) => (
                    <div key={delivery.id} className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-white rounded-xl hover:shadow-md transition-all duration-200 border border-gray-100 hover:border-orange-200 group">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                          <CheckCircle className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <p className="font-bold text-gray-900">{delivery.customer}</p>
                          <p className="text-sm text-gray-600">{delivery.id} • {delivery.time}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">PKR {delivery.amount}</p>
                        <div className="flex items-center gap-1 text-yellow-500 mt-1">
                          {[...Array(delivery.rating)].map((_, i) => (
                            <Star key={i} className="w-3.5 h-3.5 fill-current" />
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          )}

          {activeTab === 'deliveries' && (
            <div className="space-y-6">
              {!isOnline && (
                <Card className="p-6 bg-yellow-50 border-yellow-200">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                      <Zap className="w-6 h-6 text-yellow-600" />
                    </div>
                    <div>
                      <p className="font-bold text-yellow-900">You're currently offline</p>
                      <p className="text-sm text-yellow-700">Go online to start receiving delivery requests</p>
                    </div>
                  </div>
                </Card>
              )}

              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">Available Orders Near You</h3>
                <Badge className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white text-sm px-4 py-1.5 shadow-lg">{availableOrders.length} orders available</Badge>
              </div>

              <div className="space-y-5">
                {availableOrders.map((order) => (
                  <Card key={order.id} className="p-6 hover:shadow-2xl transition-all duration-300 border-2 hover:border-orange-300 bg-white/90 backdrop-blur-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-orange-100/50 to-pink-100/50 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="relative z-10">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-4">
                            <h3 className="text-xl font-bold text-gray-900">{order.id}</h3>
                            {getPriorityBadge(order.priority)}
                            <Badge variant="outline" className="text-xs">{order.time}</Badge>
                          </div>
                          
                          <div className="space-y-4">
                            <div className="flex items-start gap-3 p-3 bg-gradient-to-r from-orange-50 to-pink-50 rounded-xl border border-orange-100">
                              <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-pink-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                                <Bike className="w-5 h-5 text-white" />
                              </div>
                              <div>
                                <p className="font-semibold text-xs text-gray-500 mb-1">Pickup</p>
                                <p className="font-bold text-gray-900">{order.restaurant}</p>
                                <p className="text-sm text-gray-600">{order.restaurantAddress}</p>
                              </div>
                            </div>

                            <div className="flex items-start gap-3 p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-100">
                              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                                <MapPin className="w-5 h-5 text-white" />
                              </div>
                              <div>
                                <p className="font-semibold text-xs text-gray-500 mb-1">Deliver to</p>
                                <p className="font-bold text-gray-900">{order.customer}</p>
                                <p className="text-sm text-gray-600">{order.deliveryAddress}</p>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="text-right ml-6">
                          <div className="mb-4 p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-100">
                            <p className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">PKR {order.payment}</p>
                            <p className="text-sm text-gray-600 mt-1">{order.items} items</p>
                          </div>
                          <Badge className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white mb-4 shadow-lg">{order.distance}</Badge>
                          <Button 
                            className="w-full bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                            onClick={() => handleAcceptOrder(order.id)}
                          >
                            Accept Order
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'active' && (
            <div className="space-y-6">
              <Card className="p-6 border-2 border-blue-200 bg-blue-50">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center animate-pulse">
                    <Navigation className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Active Delivery in Progress</h3>
                    <p className="text-gray-600">Estimated delivery: {activeDelivery.estimatedTime}</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-bold mb-4">Delivery Information</h4>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Order ID</p>
                        <p className="font-semibold">{activeDelivery.id}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Restaurant</p>
                        <p className="font-semibold">{activeDelivery.restaurant}</p>
                        <p className="text-sm text-gray-600">{activeDelivery.restaurantAddress}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Customer</p>
                        <p className="font-semibold">{activeDelivery.customer}</p>
                        <p className="text-sm text-gray-600">{activeDelivery.deliveryAddress}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Order Items</p>
                        {activeDelivery.orderDetails.map((item, i) => (
                          <p key={i} className="text-sm">{item}</p>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-bold mb-4">Actions</h4>
                    <div className="space-y-3">
                      <Button className="w-full bg-green-600 hover:bg-green-700 text-white" size="lg">
                        <PhoneCall className="w-4 h-4 mr-2" />
                        Call Customer
                      </Button>
                      <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white" size="lg">
                        <MapPin className="w-4 h-4 mr-2" />
                        Open in Maps
                      </Button>
                      <Button 
                        className="w-full bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white" 
                        size="lg"
                        onClick={() => toast.success(`Delivery completed! PKR ${activeDelivery.payment} added to your earnings.`)}
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Mark as Delivered
                      </Button>
                    </div>

                    <Card className="p-4 mt-6 bg-white">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-gray-600">Distance</span>
                        <span className="font-bold">{activeDelivery.distance}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Earnings</span>
                        <span className="text-2xl font-bold text-green-600">PKR {activeDelivery.payment}</span>
                      </div>
                    </Card>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {activeTab === 'earnings' && (
            <div className="space-y-6">
              <div className="grid md:grid-cols-4 gap-6">
                <Card className="p-6 bg-gradient-to-r from-green-500 to-emerald-600 text-white">
                  <p className="text-sm opacity-90 mb-2">Today</p>
                  <p className="text-4xl font-bold mb-1">PKR 18,750</p>
                  <p className="text-sm opacity-90">24 deliveries</p>
                </Card>
                <Card className="p-6 bg-gradient-to-r from-blue-500 to-cyan-600 text-white">
                  <p className="text-sm opacity-90 mb-2">This Week</p>
                  <p className="text-4xl font-bold mb-1">PKR 123,000</p>
                  <p className="text-sm opacity-90">156 deliveries</p>
                </Card>
                <Card className="p-6 bg-gradient-to-r from-purple-500 to-pink-600 text-white">
                  <p className="text-sm opacity-90 mb-2">This Month</p>
                  <p className="text-4xl font-bold mb-1">PKR 458,000</p>
                  <p className="text-sm opacity-90">582 deliveries</p>
                </Card>
                <Card className="p-6 bg-gradient-to-r from-orange-500 to-red-600 text-white">
                  <p className="text-sm opacity-90 mb-2">All Time</p>
                  <p className="text-4xl font-bold mb-1">PKR 2,845,000</p>
                  <p className="text-sm opacity-90">3,621 deliveries</p>
                </Card>
              </div>

              <Card className="p-6">
                <h3 className="text-xl font-bold mb-6">Earnings Breakdown</h3>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={earningsData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="earnings" stroke="#10b981" strokeWidth={3} />
                    <Line type="monotone" dataKey="deliveries" stroke="#8b5cf6" strokeWidth={3} />
                  </LineChart>
                </ResponsiveContainer>
              </Card>

              <div className="grid md:grid-cols-3 gap-6">
                <Card className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                      <Star className="w-6 h-6 text-yellow-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Average Rating</p>
                      <p className="text-2xl font-bold">4.9</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">Based on 156 reviews</p>
                </Card>

                <Card className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                      <Target className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Completion Rate</p>
                      <p className="text-2xl font-bold">98%</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">153/156 completed</p>
                </Card>

                <Card className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                      <Clock className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Avg Delivery Time</p>
                      <p className="text-2xl font-bold">22 min</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">Under target time</p>
                </Card>
              </div>
            </div>
          )}

          {activeTab === 'history' && (
            <div className="space-y-6">
              <Card className="p-6">
                <h3 className="text-xl font-bold mb-6">Delivery History</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4">Order ID</th>
                        <th className="text-left py-3 px-4">Customer</th>
                        <th className="text-left py-3 px-4">Date</th>
                        <th className="text-left py-3 px-4">Time</th>
                        <th className="text-left py-3 px-4">Amount</th>
                        <th className="text-left py-3 px-4">Rating</th>
                      </tr>
                    </thead>
                    <tbody>
                      {deliveryHistory.map((delivery) => (
                        <tr key={delivery.id} className="border-b hover:bg-gray-50">
                          <td className="py-4 px-4 font-semibold">{delivery.id}</td>
                          <td className="py-4 px-4">{delivery.customer}</td>
                          <td className="py-4 px-4">{delivery.date}</td>
                          <td className="py-4 px-4 text-gray-600">{delivery.time}</td>
                          <td className="py-4 px-4 font-semibold text-green-600">PKR {delivery.amount}</td>
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-1 text-yellow-500">
                              {[...Array(delivery.rating)].map((_, i) => (
                                <Star key={i} className="w-4 h-4 fill-current" />
                              ))}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-6">
              <Card className="p-6">
                <h3 className="text-xl font-bold mb-6">Personal Information</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label>Full Name</Label>
                    <Input defaultValue="Alex Johnson" className="mt-2" />
                  </div>
                  <div>
                    <Label>Email</Label>
                    <Input defaultValue="alex.johnson@email.com" className="mt-2" />
                  </div>
                  <div>
                    <Label>Phone</Label>
                    <Input defaultValue="+92 300 9876543" className="mt-2" />
                  </div>
                  <div>
                    <Label>Vehicle Type</Label>
                    <select className="w-full px-4 py-3 border rounded-lg mt-2">
                      <option>Bicycle</option>
                      <option selected>Scooter/Motorcycle</option>
                      <option>Car</option>
                    </select>
                  </div>
                </div>
                <Button className="mt-6 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white">
                  Save Changes
                </Button>
              </Card>

              <Card className="p-6">
                <h3 className="text-xl font-bold mb-6">Bank Account</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label>Bank Name</Label>
                    <Input defaultValue="HBL Bank" className="mt-2" />
                  </div>
                  <div>
                    <Label>Account Number</Label>
                    <Input defaultValue="****1234" type="password" className="mt-2" />
                  </div>
                </div>
                <Button className="mt-6 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white">
                  Update Bank Details
                </Button>
              </Card>

              <Card className="p-6">
                <h3 className="text-xl font-bold mb-6">Availability</h3>
                <div className="space-y-4">
                  {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
                    <div key={day} className="flex items-center gap-4">
                      <input type="checkbox" defaultChecked className="w-4 h-4" />
                      <p className="w-32 font-semibold">{day}</p>
                      <Input type="time" defaultValue="09:00" className="w-32" />
                      <span>to</span>
                      <Input type="time" defaultValue="22:00" className="w-32" />
                    </div>
                  ))}
                </div>
                <Button className="mt-6 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white">
                  Update Availability
                </Button>
              </Card>
            </div>
          )}
        </div>
        </div>
      </div>
    </div>
  );
}


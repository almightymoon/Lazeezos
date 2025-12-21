'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Header } from '../../components/Header';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Separator } from '../../components/ui/separator';
import {
  ArrowLeft,
  Bell,
  CheckCircle,
  XCircle,
  ShoppingBag,
  Gift,
  AlertCircle,
  Package,
  Truck,
  Star,
  Trash2,
  Filter,
  CheckCheck
} from 'lucide-react';
import { toast } from 'sonner';
import { Toaster } from '../../components/ui/sonner';

interface Notification {
  id: string;
  type: 'order' | 'promotion' | 'system' | 'review';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  link?: string;
  orderId?: string;
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'order',
    title: 'Order Confirmed',
    message: 'Your order #12345 has been confirmed and is being prepared',
    timestamp: '2 minutes ago',
    isRead: false,
    link: '/orders/12345',
    orderId: '12345',
  },
  {
    id: '2',
    type: 'order',
    title: 'Order is being prepared',
    message: 'Restaurant has started preparing your order',
    timestamp: '15 minutes ago',
    isRead: false,
    link: '/orders/12345',
    orderId: '12345',
  },
  {
    id: '3',
    type: 'promotion',
    title: 'Special Offer',
    message: 'Get 20% off on your next order. Use code SAVE20',
    timestamp: '1 hour ago',
    isRead: false,
    link: '/vouchers',
  },
  {
    id: '4',
    type: 'review',
    title: 'Rate your order',
    message: 'How was your order from Burger Palace? Share your feedback',
    timestamp: '2 hours ago',
    isRead: true,
    link: '/orders/12344',
  },
  {
    id: '5',
    type: 'order',
    title: 'Order Delivered',
    message: 'Your order #12344 has been delivered. Enjoy your meal!',
    timestamp: '3 hours ago',
    isRead: true,
    link: '/orders/12344',
  },
  {
    id: '6',
    type: 'system',
    title: 'Welcome to Lazeezos!',
    message: 'Thank you for joining us. Start ordering your favorite food',
    timestamp: '2 days ago',
    isRead: true,
  },
];

const getNotificationIcon = (type: Notification['type']) => {
  switch (type) {
    case 'order':
      return <ShoppingBag className="w-5 h-5" />;
    case 'promotion':
      return <Gift className="w-5 h-5" />;
    case 'review':
      return <Star className="w-5 h-5" />;
    case 'system':
      return <Bell className="w-5 h-5" />;
    default:
      return <AlertCircle className="w-5 h-5" />;
  }
};

const getNotificationColor = (type: Notification['type']) => {
  switch (type) {
    case 'order':
      return 'bg-blue-100 text-blue-600';
    case 'promotion':
      return 'bg-orange-100 text-orange-600';
    case 'review':
      return 'bg-yellow-100 text-yellow-600';
    case 'system':
      return 'bg-gray-100 text-gray-600';
    default:
      return 'bg-gray-100 text-gray-600';
  }
};

export default function NotificationsPage() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'unread') return !notification.isRead;
    if (filter === 'read') return notification.isRead;
    return true;
  });

  const handleMarkAsRead = (id: string) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, isRead: true } : n));
    toast.success('Marked as read');
  };

  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, isRead: true })));
    toast.success('All notifications marked as read');
  };

  const handleDelete = (id: string) => {
    setNotifications(notifications.filter(n => n.id !== id));
    toast.success('Notification deleted');
  };

  const handleDeleteAll = () => {
    setNotifications([]);
    toast.success('All notifications deleted');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster />
      <Header
        cartItemCount={0}
        onCartClick={() => router.push('/dashboard')}
        onSearch={() => {}}
        selectedCategory="delivery"
        onCategoryChange={() => {}}
      />

      <div className="pt-20 md:pt-24">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold">Notifications</h1>
                <p className="text-gray-600 mt-1">
                  {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}` : 'All caught up!'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleMarkAllAsRead}
                  className="flex items-center gap-2"
                >
                  <CheckCheck className="w-4 h-4" />
                  Mark all as read
                </Button>
              )}
              {notifications.length > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDeleteAll}
                  className="flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                  Clear all
                </Button>
              )}
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2 mb-6">
            <Button
              variant={filter === 'all' ? 'default' : 'outline'}
              onClick={() => setFilter('all')}
              className={filter === 'all' ? 'bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white' : ''}
            >
              All
            </Button>
            <Button
              variant={filter === 'unread' ? 'default' : 'outline'}
              onClick={() => setFilter('unread')}
              className={filter === 'unread' ? 'bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white' : ''}
            >
              Unread
              {notifications.filter(n => !n.isRead).length > 0 && (
                <Badge className="ml-2 bg-orange-600">{notifications.filter(n => !n.isRead).length}</Badge>
              )}
            </Button>
            <Button
              variant={filter === 'read' ? 'default' : 'outline'}
              onClick={() => setFilter('read')}
              className={filter === 'read' ? 'bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white' : ''}
            >
              Read
            </Button>
          </div>

          {/* Notifications List */}
          {filteredNotifications.length === 0 ? (
            <Card className="p-12 text-center">
              <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No notifications</h3>
              <p className="text-gray-600">
                {filter === 'unread' ? "You're all caught up! No unread notifications." : 'No notifications to display'}
              </p>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredNotifications.map((notification) => (
                <Card
                  key={notification.id}
                  className={`p-4 hover:shadow-md transition-all cursor-pointer ${
                    !notification.isRead ? 'bg-blue-50/50 border-blue-200' : ''
                  }`}
                  onClick={() => {
                    if (notification.link) {
                      router.push(notification.link);
                    }
                  }}
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${getNotificationColor(notification.type)}`}>
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-lg">{notification.title}</h3>
                            {!notification.isRead && (
                              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                            )}
                          </div>
                          <p className="text-gray-600 text-sm mb-2">{notification.message}</p>
                          <p className="text-xs text-gray-400">{notification.timestamp}</p>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                          {!notification.isRead && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => handleMarkAsRead(notification.id)}
                            >
                              <CheckCircle className="w-4 h-4 text-gray-400" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={() => handleDelete(notification.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


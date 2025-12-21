'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '../../components/Header';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Badge } from '../../components/ui/badge';
import { Separator } from '../../components/ui/separator';
import { 
  Settings,
  Bell,
  Lock,
  CreditCard,
  Wallet,
  Edit,
  Shield,
  Globe,
  Moon,
  Sun,
  Mail,
  Phone,
  Smartphone,
  Trash2,
  LogOut,
  ArrowLeft,
  Save,
  Eye,
  EyeOff,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { toast } from 'sonner';
import { Toaster } from '../../components/ui/sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../components/ui/dialog';

interface NotificationSettings {
  email: boolean;
  sms: boolean;
  push: boolean;
  orderUpdates: boolean;
  promotions: boolean;
  reminders: boolean;
}

interface SecuritySettings {
  twoFactorAuth: boolean;
  loginAlerts: boolean;
  sessionTimeout: number; // minutes
}

const defaultNotifications: NotificationSettings = {
  email: true,
  sms: false,
  push: true,
  orderUpdates: true,
  promotions: true,
  reminders: false,
};

const defaultSecurity: SecuritySettings = {
  twoFactorAuth: false,
  loginAlerts: true,
  sessionTimeout: 30,
};

interface PaymentMethod {
  id: string;
  type: 'card' | 'wallet';
  last4?: string;
  brand?: string;
  expiryMonth?: number;
  expiryYear?: number;
  walletName?: string;
  phoneNumber?: string;
  isDefault: boolean;
}

const mockPaymentMethods: PaymentMethod[] = [
  {
    id: '1',
    type: 'card',
    last4: '4242',
    brand: 'Visa',
    expiryMonth: 12,
    expiryYear: 2025,
    isDefault: true,
  },
];

export default function SettingsPage() {
  const router = useRouter();
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>(mockPaymentMethods);
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [editingPayment, setEditingPayment] = useState<PaymentMethod | null>(null);
  const [paymentForm, setPaymentForm] = useState<{ type: 'card' | 'wallet'; cardNumber?: string; expiryMonth?: string; expiryYear?: string; cvv?: string; walletName?: string; phoneNumber?: string; isDefault: boolean }>({
    type: 'card',
    isDefault: false,
  });
  const [notifications, setNotifications] = useState<NotificationSettings>(defaultNotifications);
  const [security, setSecurity] = useState<SecuritySettings>(defaultSecurity);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark' | 'auto'>('light');
  const [language, setLanguage] = useState('en');

  const handleNotificationChange = (key: keyof NotificationSettings) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSecurityChange = (key: keyof SecuritySettings, value?: boolean | number) => {
    setSecurity(prev => ({
      ...prev,
      [key]: value !== undefined ? value : !prev[key],
    }));
  };

  const handleChangePassword = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error('Please fill in all password fields');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    if (newPassword.length < 8) {
      toast.error('Password must be at least 8 characters long');
      return;
    }
    toast.success('Password changed successfully!');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const handleSaveSettings = () => {
    toast.success('Settings saved successfully!');
  };

  const handleLogout = () => {
    localStorage.setItem('isLoggedIn', 'false');
    window.dispatchEvent(new Event('loginStateChange'));
    toast.success('Logged out successfully');
    router.push('/');
  };

  const handleDeleteAccount = () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      toast.error('Account deletion is not available in demo mode');
    }
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
      <div className="container mx-auto px-4 py-8 max-w-4xl">
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
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Settings</h1>
          <p className="text-gray-600">Manage your account settings and preferences</p>
        </div>

        <div className="space-y-6">
          {/* Account Security */}
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-pink-500 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Account Security</h3>
                <p className="text-sm text-gray-600">Manage your password and security settings</p>
              </div>
            </div>

            <div className="space-y-6">
              {/* Change Password */}
              <div>
                <h4 className="font-semibold mb-4">Change Password</h4>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <div className="relative mt-2">
                      <Input
                        id="currentPassword"
                        type={showCurrentPassword ? 'text' : 'password'}
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="pr-10"
                        placeholder="Enter current password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="newPassword">New Password</Label>
                    <div className="relative mt-2">
                      <Input
                        id="newPassword"
                        type={showNewPassword ? 'text' : 'password'}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="pr-10"
                        placeholder="Enter new password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <div className="relative mt-2">
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="pr-10"
                        placeholder="Confirm new password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  <Button
                    onClick={handleChangePassword}
                    className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white"
                  >
                    <Lock className="w-4 h-4 mr-2" />
                    Update Password
                  </Button>
                </div>
              </div>

              <Separator />

              {/* Security Options */}
              <div>
                <h4 className="font-semibold mb-4">Security Options</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Shield className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="font-semibold">Two-Factor Authentication</p>
                        <p className="text-sm text-gray-600">Add an extra layer of security</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleSecurityChange('twoFactorAuth')}
                      className={`relative w-12 h-6 rounded-full transition-colors ${
                        security.twoFactorAuth ? 'bg-gradient-to-r from-orange-500 to-pink-500' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                          security.twoFactorAuth ? 'translate-x-6' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Bell className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="font-semibold">Login Alerts</p>
                        <p className="text-sm text-gray-600">Get notified of new login attempts</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleSecurityChange('loginAlerts')}
                      className={`relative w-12 h-6 rounded-full transition-colors ${
                        security.loginAlerts ? 'bg-gradient-to-r from-orange-500 to-pink-500' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                          security.loginAlerts ? 'translate-x-6' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <Label htmlFor="sessionTimeout" className="mb-2 block">Session Timeout (minutes)</Label>
                    <Input
                      id="sessionTimeout"
                      type="number"
                      min="5"
                      max="120"
                      value={security.sessionTimeout}
                      onChange={(e) => handleSecurityChange('sessionTimeout', parseInt(e.target.value))}
                      className="w-32"
                    />
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Notifications */}
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-pink-500 rounded-lg flex items-center justify-center">
                <Bell className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Notifications</h3>
                <p className="text-sm text-gray-600">Manage your notification preferences</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="font-semibold">Email Notifications</p>
                    <p className="text-sm text-gray-600">Receive updates via email</p>
                  </div>
                </div>
                <button
                  onClick={() => handleNotificationChange('email')}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    notifications.email ? 'bg-gradient-to-r from-orange-500 to-pink-500' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                      notifications.email ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="font-semibold">SMS Notifications</p>
                    <p className="text-sm text-gray-600">Receive updates via SMS</p>
                  </div>
                </div>
                <button
                  onClick={() => handleNotificationChange('sms')}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    notifications.sms ? 'bg-gradient-to-r from-orange-500 to-pink-500' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                      notifications.sms ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Smartphone className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="font-semibold">Push Notifications</p>
                    <p className="text-sm text-gray-600">Receive push notifications</p>
                  </div>
                </div>
                <button
                  onClick={() => handleNotificationChange('push')}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    notifications.push ? 'bg-gradient-to-r from-orange-500 to-pink-500' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                      notifications.push ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
              <Separator />
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Bell className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="font-semibold">Order Updates</p>
                    <p className="text-sm text-gray-600">Get notified about order status changes</p>
                  </div>
                </div>
                <button
                  onClick={() => handleNotificationChange('orderUpdates')}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    notifications.orderUpdates ? 'bg-gradient-to-r from-orange-500 to-pink-500' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                      notifications.orderUpdates ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="font-semibold">Promotions & Offers</p>
                    <p className="text-sm text-gray-600">Receive special offers and discounts</p>
                  </div>
                </div>
                <button
                  onClick={() => handleNotificationChange('promotions')}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    notifications.promotions ? 'bg-gradient-to-r from-orange-500 to-pink-500' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                      notifications.promotions ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Bell className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="font-semibold">Reminders</p>
                    <p className="text-sm text-gray-600">Get reminders for abandoned carts</p>
                  </div>
                </div>
                <button
                  onClick={() => handleNotificationChange('reminders')}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    notifications.reminders ? 'bg-gradient-to-r from-orange-500 to-pink-500' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                      notifications.reminders ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>
          </Card>

          {/* Appearance */}
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-pink-500 rounded-lg flex items-center justify-center">
                <Sun className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Appearance</h3>
                <p className="text-sm text-gray-600">Customize your app appearance</p>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <Label className="mb-4 block">Theme</Label>
                <div className="flex gap-4">
                  <button
                    onClick={() => setTheme('light')}
                    className={`flex items-center gap-2 px-4 py-3 rounded-lg border-2 transition-all ${
                      theme === 'light'
                        ? 'border-pink-500 bg-pink-50 text-pink-600'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <Sun className="w-4 h-4" />
                    Light
                  </button>
                  <button
                    onClick={() => setTheme('dark')}
                    className={`flex items-center gap-2 px-4 py-3 rounded-lg border-2 transition-all ${
                      theme === 'dark'
                        ? 'border-pink-500 bg-pink-50 text-pink-600'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <Moon className="w-4 h-4" />
                    Dark
                  </button>
                  <button
                    onClick={() => setTheme('auto')}
                    className={`flex items-center gap-2 px-4 py-3 rounded-lg border-2 transition-all ${
                      theme === 'auto'
                        ? 'border-pink-500 bg-pink-50 text-pink-600'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <Settings className="w-4 h-4" />
                    Auto
                  </button>
                </div>
              </div>

              <div>
                <Label htmlFor="language" className="mb-2 block">Language</Label>
                <select
                  id="language"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full md:w-auto px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                >
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                  <option value="de">German</option>
                  <option value="ar">Arabic</option>
                  <option value="ur">Urdu</option>
                </select>
              </div>
            </div>
          </Card>

          {/* Payment Methods */}
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-pink-500 rounded-lg flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Payment Methods</h3>
                <p className="text-sm text-gray-600">Manage your saved payment methods</p>
              </div>
            </div>

            <div className="space-y-4">
              {paymentMethods.map((method) => (
                <div key={method.id} className="p-4 bg-gray-50 rounded-lg border-2 border-gray-200 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CreditCard className="w-5 h-5 text-gray-400" />
                    <div>
                      {method.type === 'card' ? (
                        <>
                          <p className="font-semibold">•••• •••• •••• {method.last4}</p>
                          <p className="text-sm text-gray-600">
                            {method.brand} • Expires {String(method.expiryMonth).padStart(2, '0')}/{method.expiryYear}
                          </p>
                        </>
                      ) : (
                        <>
                          <p className="font-semibold">{method.walletName}</p>
                          <p className="text-sm text-gray-600">{method.phoneNumber}</p>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {method.isDefault && (
                      <Badge variant="secondary">Default</Badge>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => {
                        setEditingPayment(method);
                        setPaymentForm({
                          type: method.type,
                          isDefault: method.isDefault,
                        });
                        setIsPaymentDialogOpen(true);
                      }}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    {!method.isDefault && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-red-600 hover:text-red-700"
                        onClick={() => {
                          setPaymentMethods(paymentMethods.filter(pm => pm.id !== method.id));
                          toast.success('Payment method deleted');
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
              <Button
                variant="outline"
                className="w-full md:w-auto border-pink-300 text-pink-600 hover:bg-pink-50"
                onClick={() => {
                  setEditingPayment(null);
                  setPaymentForm({ type: 'card', isDefault: false });
                  setIsPaymentDialogOpen(true);
                }}
              >
                <CreditCard className="w-4 h-4 mr-2" />
                Add Payment Method
              </Button>
            </div>
          </Card>

          {/* Danger Zone */}
          <Card className="p-6 border-2 border-red-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <Trash2 className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-red-600">Danger Zone</h3>
                <p className="text-sm text-gray-600">Irreversible and destructive actions</p>
              </div>
            </div>

            <div className="space-y-4">
              <Button
                variant="outline"
                onClick={handleLogout}
                className="w-full md:w-auto border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
              <Button
                variant="outline"
                onClick={handleDeleteAccount}
                className="w-full md:w-auto border-red-300 text-red-600 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Account
              </Button>
            </div>
          </Card>

          {/* Save Button */}
          <div className="flex justify-end">
            <Button
              onClick={handleSaveSettings}
              className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white"
            >
              <Save className="w-4 h-4 mr-2" />
              Save All Settings
            </Button>
          </div>
        </div>
      </div>
      </div>

      {/* Payment Method Dialog */}
      <Dialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingPayment ? 'Edit Payment Method' : 'Add Payment Method'}</DialogTitle>
            <DialogDescription>
              {editingPayment ? 'Update your payment method details' : 'Add a new payment method'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <Label>Payment Type</Label>
              <div className="flex gap-4 mt-2">
                <button
                  type="button"
                  onClick={() => setPaymentForm({ ...paymentForm, type: 'card' })}
                  className={`flex-1 p-4 border-2 rounded-lg transition-all ${
                    paymentForm.type === 'card'
                      ? 'border-orange-500 bg-orange-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <CreditCard className="w-6 h-6 mx-auto mb-2 text-gray-600" />
                  <div className="font-semibold">Card</div>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentForm({ ...paymentForm, type: 'wallet' })}
                  className={`flex-1 p-4 border-2 rounded-lg transition-all ${
                    paymentForm.type === 'wallet'
                      ? 'border-orange-500 bg-orange-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Wallet className="w-6 h-6 mx-auto mb-2 text-gray-600" />
                  <div className="font-semibold">Wallet</div>
                </button>
              </div>
            </div>

            {paymentForm.type === 'card' ? (
              <>
                <div>
                  <Label htmlFor="cardNumber">Card Number *</Label>
                  <Input
                    id="cardNumber"
                    value={paymentForm.cardNumber || ''}
                    onChange={(e) => setPaymentForm({ ...paymentForm, cardNumber: e.target.value })}
                    placeholder="1234 5678 9012 3456"
                    className="mt-2"
                    maxLength={19}
                  />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="expiryMonth">Expiry Month *</Label>
                    <Input
                      id="expiryMonth"
                      value={paymentForm.expiryMonth || ''}
                      onChange={(e) => setPaymentForm({ ...paymentForm, expiryMonth: e.target.value })}
                      placeholder="MM"
                      className="mt-2"
                      maxLength={2}
                    />
                  </div>
                  <div>
                    <Label htmlFor="expiryYear">Expiry Year *</Label>
                    <Input
                      id="expiryYear"
                      value={paymentForm.expiryYear || ''}
                      onChange={(e) => setPaymentForm({ ...paymentForm, expiryYear: e.target.value })}
                      placeholder="YYYY"
                      className="mt-2"
                      maxLength={4}
                    />
                  </div>
                  <div>
                    <Label htmlFor="cvv">CVV *</Label>
                    <Input
                      id="cvv"
                      type="password"
                      value={paymentForm.cvv || ''}
                      onChange={(e) => setPaymentForm({ ...paymentForm, cvv: e.target.value })}
                      placeholder="123"
                      className="mt-2"
                      maxLength={4}
                    />
                  </div>
                </div>
              </>
            ) : (
              <>
                <div>
                  <Label htmlFor="walletName">Wallet Name *</Label>
                  <Input
                    id="walletName"
                    value={paymentForm.walletName || ''}
                    onChange={(e) => setPaymentForm({ ...paymentForm, walletName: e.target.value })}
                    placeholder="JazzCash, EasyPaisa, etc."
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="phoneNumber">Phone Number *</Label>
                  <Input
                    id="phoneNumber"
                    value={paymentForm.phoneNumber || ''}
                    onChange={(e) => setPaymentForm({ ...paymentForm, phoneNumber: e.target.value })}
                    placeholder="+92 300 1234567"
                    className="mt-2"
                  />
                </div>
              </>
            )}

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="paymentDefault"
                checked={paymentForm.isDefault}
                onChange={(e) => setPaymentForm({ ...paymentForm, isDefault: e.target.checked })}
                className="h-4 w-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
              />
              <Label htmlFor="paymentDefault" className="cursor-pointer">
                Set as default payment method
              </Label>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPaymentDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (paymentForm.type === 'card' && (!paymentForm.cardNumber || !paymentForm.expiryMonth || !paymentForm.expiryYear || !paymentForm.cvv)) {
                  toast.error('Please fill in all card fields');
                  return;
                }
                if (paymentForm.type === 'wallet' && (!paymentForm.walletName || !paymentForm.phoneNumber)) {
                  toast.error('Please fill in all wallet fields');
                  return;
                }

                if (paymentForm.isDefault) {
                  setPaymentMethods(prev => prev.map(pm => ({ ...pm, isDefault: false })));
                }

                if (editingPayment) {
                  const updatedMethod: PaymentMethod = paymentForm.type === 'card'
                    ? {
                        ...editingPayment,
                        type: 'card',
                        last4: paymentForm.cardNumber?.slice(-4) || editingPayment.last4,
                        expiryMonth: parseInt(paymentForm.expiryMonth || '0'),
                        expiryYear: parseInt(paymentForm.expiryYear || '0'),
                        isDefault: paymentForm.isDefault,
                      }
                    : {
                        ...editingPayment,
                        type: 'wallet',
                        walletName: paymentForm.walletName,
                        phoneNumber: paymentForm.phoneNumber,
                        isDefault: paymentForm.isDefault,
                      };
                  setPaymentMethods(prev => prev.map(pm => 
                    pm.id === editingPayment.id 
                      ? updatedMethod
                      : paymentForm.isDefault ? { ...pm, isDefault: false } : pm
                  ));
                  toast.success('Payment method updated');
                } else {
                  const newMethod: PaymentMethod = paymentForm.type === 'card'
                    ? {
                        id: Date.now().toString(),
                        type: 'card',
                        last4: paymentForm.cardNumber?.slice(-4) || '0000',
                        brand: 'Visa',
                        expiryMonth: parseInt(paymentForm.expiryMonth || '0'),
                        expiryYear: parseInt(paymentForm.expiryYear || '0'),
                        isDefault: paymentForm.isDefault,
                      }
                    : {
                        id: Date.now().toString(),
                        type: 'wallet',
                        walletName: paymentForm.walletName || '',
                        phoneNumber: paymentForm.phoneNumber || '',
                        isDefault: paymentForm.isDefault,
                      };
                  setPaymentMethods(prev => [...prev, newMethod]);
                  toast.success('Payment method added');
                }
                setIsPaymentDialogOpen(false);
              }}
              className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600"
            >
              {editingPayment ? 'Update Payment Method' : 'Add Payment Method'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Toaster />
    </div>
  );
}



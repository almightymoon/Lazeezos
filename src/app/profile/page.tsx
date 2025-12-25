'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '../../components/Header';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Badge } from '../../components/ui/badge';
import { Separator } from '../../components/ui/separator';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  Edit,
  Save,
  X,
  Camera,
  Bell,
  Lock,
  CreditCard,
  Wallet,
  Heart,
  Star,
  ShoppingBag,
  Settings,
  ArrowLeft,
  Shield,
  Globe,
  Moon,
  Sun,
  Trash2,
  LogOut
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

interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  profileImage: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  preferences: {
    notifications: {
      email: boolean;
      sms: boolean;
      push: boolean;
    };
    language: string;
    theme: 'light' | 'dark' | 'auto';
  };
  stats: {
    totalOrders: number;
    totalSpent: number;
    favoriteRestaurants: number;
    averageRating: number;
  };
}

const mockProfile: UserProfile = {
  id: '1',
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@example.com',
  phone: '+1 (555) 123-4567',
  dateOfBirth: '1990-05-15',
  profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
  address: {
    street: '123 Main Street, Apt 4B',
    city: 'New York',
    state: 'NY',
    zipCode: '10001',
    country: 'United States',
  },
  preferences: {
    notifications: {
      email: true,
      sms: false,
      push: true,
    },
    language: 'en',
    theme: 'light',
  },
  stats: {
    totalOrders: 42,
    totalSpent: 1250.50,
    favoriteRestaurants: 8,
    averageRating: 4.8,
  },
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

export default function ProfilePage() {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>(mockPaymentMethods);
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [editingPayment, setEditingPayment] = useState<PaymentMethod | null>(null);
  const [paymentForm, setPaymentForm] = useState<{ type: 'card' | 'wallet'; cardNumber?: string; expiryMonth?: string; expiryYear?: string; cvv?: string; walletName?: string; phoneNumber?: string; isDefault: boolean }>({
    type: 'card',
    isDefault: false,
  });
  const [activeTab, setActiveTab] = useState<'profile' | 'settings' | 'preferences'>('profile');
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [editedProfile, setEditedProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch profile data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/user/profile', { cache: 'no-store' });
        if (response.ok) {
          const data = await response.json();
          setProfile(data.profile);
          setEditedProfile(data.profile);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleEdit = () => {
    if (profile) {
      setEditedProfile({ ...profile });
      setIsEditing(true);
    }
  };

  const handleCancel = () => {
    if (profile) {
      setEditedProfile({ ...profile });
      setIsEditing(false);
    }
  };

  const handleSave = async () => {
    if (!editedProfile) return;
    
    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: editedProfile.firstName,
          lastName: editedProfile.lastName,
          email: editedProfile.email,
          phone: editedProfile.phone,
          dateOfBirth: editedProfile.dateOfBirth,
          profileImage: editedProfile.profileImage,
          address: editedProfile.address,
        }),
      });
      if (response.ok) {
        const data = await response.json();
        setProfile({ ...editedProfile });
        setIsEditing(false);
        toast.success('Profile updated successfully!');
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    }
  };

  const handleInputChange = (field: string, value: string) => {
    if (!editedProfile) return;
    
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setEditedProfile({
        ...editedProfile,
        [parent]: {
          ...editedProfile[parent as keyof UserProfile] as any,
          [child]: value,
        },
      });
    } else {
      setEditedProfile({
        ...editedProfile,
        [field]: value,
      });
    }
  };

  const handlePreferenceChange = (category: string, key: string, value: boolean | string) => {
    if (!editedProfile) return;
    
    setEditedProfile({
      ...editedProfile,
      preferences: {
        ...editedProfile.preferences,
        [category]: {
          ...editedProfile.preferences[category as keyof typeof editedProfile.preferences] as any,
          [key]: value,
        },
      },
    });
  };

  const handleLogout = () => {
    localStorage.setItem('isLoggedIn', 'false');
    window.dispatchEvent(new Event('loginStateChange'));
    toast.success('Logged out successfully');
    router.push('/');
  };

  const handleDeleteAccount = () => {
    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
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
          <h1 className="text-3xl md:text-4xl font-bold mb-2">My Profile</h1>
          <p className="text-gray-600">Manage your account settings and preferences</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6 border-b overflow-x-auto">
          <button
            onClick={() => setActiveTab('profile')}
            className={`pb-4 px-2 font-semibold transition-colors relative whitespace-nowrap ${
              activeTab === 'profile'
                ? 'text-pink-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Profile
            {activeTab === 'profile' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-orange-500 to-pink-500" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`pb-4 px-2 font-semibold transition-colors relative whitespace-nowrap ${
              activeTab === 'settings'
                ? 'text-pink-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Settings
            {activeTab === 'settings' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-orange-500 to-pink-500" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('preferences')}
            className={`pb-4 px-2 font-semibold transition-colors relative whitespace-nowrap ${
              activeTab === 'preferences'
                ? 'text-pink-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Preferences
            {activeTab === 'preferences' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-orange-500 to-pink-500" />
            )}
          </button>
        </div>

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          loading ? (
            <div className="text-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading profile...</p>
            </div>
          ) : profile ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Profile Card */}
            <Card className="p-6 lg:col-span-1">
              <div className="text-center">
                <div className="relative inline-block mb-4">
                  <img
                    src={isEditing ? editedProfile.profileImage : profile.profileImage}
                    alt={`${profile.firstName} ${profile.lastName}`}
                    className="w-32 h-32 rounded-full object-cover mx-auto border-4 border-gradient-to-r from-orange-500 to-pink-500"
                  />
                  {isEditing && (
                    <button className="absolute bottom-0 right-0 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-full p-2 hover:from-orange-600 hover:to-pink-600 transition-all shadow-lg">
                      <Camera className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <h2 className="text-2xl font-bold mb-1">
                  {isEditing && editedProfile ? `${editedProfile.firstName} ${editedProfile.lastName}` : profile ? `${profile.firstName} ${profile.lastName}` : 'Loading...'}
                </h2>
                <p className="text-gray-600 mb-4">{isEditing && editedProfile ? editedProfile.email : profile?.email || ''}</p>
                
                {/* Stats */}
                {profile && (
                  <div className="grid grid-cols-2 gap-4 mt-6">
                    <div className="bg-gradient-to-br from-orange-50 to-pink-50 rounded-lg p-3">
                      <ShoppingBag className="w-5 h-5 mx-auto text-pink-600 mb-1" />
                      <p className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
                        {profile.stats.totalOrders}
                      </p>
                      <p className="text-xs text-gray-600">Orders</p>
                    </div>
                    <div className="bg-gradient-to-br from-orange-50 to-pink-50 rounded-lg p-3">
                      <Star className="w-5 h-5 mx-auto text-pink-600 mb-1" />
                      <p className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
                        {profile.stats.averageRating}
                      </p>
                      <p className="text-xs text-gray-600">Rating</p>
                    </div>
                  </div>
                )}
              </div>
            </Card>

            {/* Profile Details */}
            <Card className="p-6 lg:col-span-2">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold">Personal Information</h3>
                {!isEditing ? (
                  <Button
                    variant="outline"
                    onClick={handleEdit}
                    className="border-pink-300 text-pink-600 hover:bg-pink-50"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={handleCancel}
                      className="border-gray-300"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Cancel
                    </Button>
                    <Button
                      onClick={handleSave}
                      className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </Button>
                  </div>
                )}
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    {isEditing ? (
                      <Input
                        id="firstName"
                        value={editedProfile?.firstName || ''}
                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                        className="mt-2"
                      />
                    ) : (
                      <div className="mt-2 flex items-center gap-2 text-gray-700">
                        <User className="w-4 h-4 text-gray-400" />
                        <span>{profile?.firstName || ''}</span>
                      </div>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    {isEditing ? (
                      <Input
                        id="lastName"
                        value={editedProfile?.lastName || ''}
                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                        className="mt-2"
                      />
                    ) : (
                      <div className="mt-2 flex items-center gap-2 text-gray-700">
                        <User className="w-4 h-4 text-gray-400" />
                        <span>{profile?.lastName || ''}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <Label htmlFor="email">Email Address</Label>
                  {isEditing ? (
                    <Input
                      id="email"
                      type="email"
                        value={editedProfile?.email || ''}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="mt-2"
                    />
                  ) : (
                    <div className="mt-2 flex items-center gap-2 text-gray-700">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <span>{profile?.email || ''}</span>
                    </div>
                  )}
                </div>

                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  {isEditing ? (
                    <Input
                      id="phone"
                      type="tel"
                        value={editedProfile?.phone || ''}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="mt-2"
                    />
                  ) : (
                    <div className="mt-2 flex items-center gap-2 text-gray-700">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <span>{profile?.phone || ''}</span>
                    </div>
                  )}
                </div>

                <div>
                  <Label htmlFor="dateOfBirth">Date of Birth</Label>
                  {isEditing ? (
                    <Input
                      id="dateOfBirth"
                      type="date"
                        value={editedProfile?.dateOfBirth || ''}
                      onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                      className="mt-2"
                    />
                  ) : (
                    <div className="mt-2 flex items-center gap-2 text-gray-700">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span>{profile?.dateOfBirth ? new Date(profile.dateOfBirth).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      }) : 'Not set'}</span>
                    </div>
                  )}
                </div>

                <Separator />

                <div>
                  <Label className="mb-4 block">Delivery Address</Label>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="street" className="text-sm">Street Address</Label>
                      {isEditing ? (
                        <Input
                          id="street"
                          value={editedProfile?.address?.street || ''}
                          onChange={(e) => handleInputChange('address.street', e.target.value)}
                          className="mt-2"
                        />
                      ) : (
                        <div className="mt-2 flex items-center gap-2 text-gray-700">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          <span>{profile?.address?.street || ''}</span>
                        </div>
                      )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="city" className="text-sm">City</Label>
                        {isEditing ? (
                          <Input
                            id="city"
                            value={editedProfile?.address?.city || ''}
                            onChange={(e) => handleInputChange('address.city', e.target.value)}
                            className="mt-2"
                          />
                        ) : (
                          <div className="mt-2 text-gray-700">{profile?.address?.city || ''}</div>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="state" className="text-sm">State</Label>
                        {isEditing ? (
                          <Input
                            id="state"
                            value={editedProfile?.address?.state || ''}
                            onChange={(e) => handleInputChange('address.state', e.target.value)}
                            className="mt-2"
                          />
                        ) : (
                          <div className="mt-2 text-gray-700">{profile?.address?.state || ''}</div>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="zipCode" className="text-sm">Zip Code</Label>
                        {isEditing ? (
                          <Input
                            id="zipCode"
                            value={editedProfile?.address?.zipCode || ''}
                            onChange={(e) => handleInputChange('address.zipCode', e.target.value)}
                            className="mt-2"
                          />
                        ) : (
                          <div className="mt-2 text-gray-700">{profile?.address?.zipCode || ''}</div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-gray-600">No profile data available</p>
            </div>
          )
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
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
              <div className="space-y-4">
                <Button
                  variant="outline"
                  className="w-full md:w-auto border-pink-300 text-pink-600 hover:bg-pink-50"
                >
                  <Lock className="w-4 h-4 mr-2" />
                  Change Password
                </Button>
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
                  <input
                    type="checkbox"
                    checked={editedProfile?.preferences?.notifications?.email || false}
                    onChange={(e) => handlePreferenceChange('notifications', 'email', e.target.checked)}
                    className="w-5 h-5 text-pink-600 rounded focus:ring-pink-500"
                  />
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="font-semibold">SMS Notifications</p>
                      <p className="text-sm text-gray-600">Receive updates via SMS</p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={editedProfile?.preferences?.notifications?.sms || false}
                    onChange={(e) => handlePreferenceChange('notifications', 'sms', e.target.checked)}
                    className="w-5 h-5 text-pink-600 rounded focus:ring-pink-500"
                  />
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Bell className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="font-semibold">Push Notifications</p>
                      <p className="text-sm text-gray-600">Receive push notifications</p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={editedProfile?.preferences?.notifications?.push || false}
                    onChange={(e) => handlePreferenceChange('notifications', 'push', e.target.checked)}
                    className="w-5 h-5 text-pink-600 rounded focus:ring-pink-500"
                  />
                </div>
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
          </div>
        )}

        {/* Preferences Tab */}
        {activeTab === 'preferences' && (
          <div className="space-y-6">
            {/* Language */}
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <Globe className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Language</h3>
                  <p className="text-sm text-gray-600">Choose your preferred language</p>
                </div>
              </div>
              <select
                value={editedProfile?.preferences?.language || 'en'}
                onChange={(e) => handlePreferenceChange('language', 'language', e.target.value)}
                className="w-full md:w-auto px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
              >
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
                <option value="de">German</option>
              </select>
            </Card>

            {/* Theme */}
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <Sun className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Theme</h3>
                  <p className="text-sm text-gray-600">Choose your preferred theme</p>
                </div>
              </div>
              <div className="flex gap-4">
                <button
                  onClick={() => handlePreferenceChange('theme', 'theme', 'light')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-all ${
                    editedProfile?.preferences?.theme === 'light'
                      ? 'border-pink-500 bg-pink-50 text-pink-600'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <Sun className="w-4 h-4" />
                  Light
                </button>
                <button
                  onClick={() => handlePreferenceChange('theme', 'theme', 'dark')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-all ${
                    editedProfile?.preferences?.theme === 'dark'
                      ? 'border-pink-500 bg-pink-50 text-pink-600'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <Moon className="w-4 h-4" />
                  Dark
                </button>
                <button
                  onClick={() => handlePreferenceChange('theme', 'theme', 'auto')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-all ${
                    editedProfile?.preferences?.theme === 'auto'
                      ? 'border-pink-500 bg-pink-50 text-pink-600'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <Settings className="w-4 h-4" />
                  Auto
                </button>
              </div>
            </Card>

            {/* Save Preferences Button */}
            <div className="flex justify-end">
              <Button
                onClick={() => {
                  if (editedProfile) {
                    setProfile({ ...editedProfile });
                    toast.success('Preferences saved successfully!');
                  }
                }}
                className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white"
              >
                <Save className="w-4 h-4 mr-2" />
                Save Preferences
              </Button>
            </div>
          </div>
        )}
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



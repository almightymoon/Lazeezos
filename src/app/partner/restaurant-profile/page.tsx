'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { 
  ArrowLeft, 
  Save, 
  Upload, 
  MapPin, 
  Phone, 
  Mail, 
  Clock,
  Image as ImageIcon,
  Edit,
  X,
  Plus,
  Trash2,
  ChefHat,
  Globe,
  Building2,
  FileText,
  Loader2
} from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Card } from '../../../components/ui/card';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Textarea } from '../../../components/ui/textarea';
import { Switch } from '../../../components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import { Separator } from '../../../components/ui/separator';
import { toast } from 'sonner';
import { Toaster } from '../../../components/ui/sonner';

const defaultOperatingHours = [
  { day: 'Monday', open: '09:00', close: '22:00' },
  { day: 'Tuesday', open: '09:00', close: '22:00' },
  { day: 'Wednesday', open: '09:00', close: '22:00' },
  { day: 'Thursday', open: '09:00', close: '22:00' },
  { day: 'Friday', open: '09:00', close: '23:00' },
  { day: 'Saturday', open: '10:00', close: '23:00' },
  { day: 'Sunday', open: '10:00', close: '22:00' },
];

interface RestaurantProfile {
  name: string;
  description: string;
  email: string;
  phone: string;
  businessPhone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  cuisineTypes: string[];
  restaurantType: string;
  isOpen: boolean;
  isPromoted: boolean;
  deliveryFee: number;
  minOrder: number;
  priceRange: string;
  operatingHours: Array<{ day: string; open: string; close: string }>;
  logo?: string;
  coverImage?: string;
  images?: string[];
}

export default function RestaurantProfilePage() {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<RestaurantProfile>({
    name: '',
    description: '',
    email: '',
    phone: '',
    businessPhone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'Pakistan',
    cuisineTypes: [],
    restaurantType: 'RESTAURANT',
    isOpen: false,
    isPromoted: false,
    deliveryFee: 0,
    minOrder: 0,
    priceRange: '$$',
    operatingHours: defaultOperatingHours,
    logo: '',
    coverImage: '',
    images: [],
  });

  const [cuisineInput, setCuisineInput] = useState('');
  const [uploadingImage, setUploadingImage] = useState<string | null>(null); // 'logo', 'cover', or 'gallery'

  // Fetch restaurant profile on mount
  useEffect(() => {
    fetchRestaurantProfile();
  }, []);

  const fetchRestaurantProfile = async () => {
    try {
      setIsLoading(true);
      // Get restaurant ID or slug from localStorage if available
      const restaurantId = typeof window !== 'undefined' ? localStorage.getItem('restaurantId') : null;
      const restaurantSlug = typeof window !== 'undefined' ? localStorage.getItem('restaurantSlug') : null;
      const profileUrl = restaurantId || restaurantSlug 
        ? `/api/partner/restaurant?${restaurantId ? `restaurantId=${restaurantId}` : `restaurantSlug=${restaurantSlug}`}`
        : '/api/partner/restaurant';
      const response = await fetch(profileUrl);
      if (!response.ok) {
        throw new Error('Failed to fetch restaurant profile');
      }
      const data = await response.json();
      if (data.restaurant) {
        // Convert operatingHours from JSON object to array format if needed
        let operatingHours = defaultOperatingHours;
        if (data.restaurant.operatingHours) {
          if (Array.isArray(data.restaurant.operatingHours)) {
            operatingHours = data.restaurant.operatingHours;
          } else if (typeof data.restaurant.operatingHours === 'object') {
            // Convert object format to array format
            operatingHours = defaultOperatingHours.map((defaultHour) => {
              const dayKey = defaultHour.day.toLowerCase();
              const storedHour = (data.restaurant.operatingHours as any)[dayKey];
              if (storedHour) {
                return {
                  day: defaultHour.day,
                  open: storedHour.open || defaultHour.open,
                  close: storedHour.close || defaultHour.close,
                };
              }
              return defaultHour;
            });
          }
        }

        setFormData({
          name: data.restaurant.name || '',
          description: data.restaurant.description || '',
          email: data.restaurant.email || '',
          phone: data.restaurant.phone || '',
          businessPhone: data.restaurant.businessPhone || '',
          address: data.restaurant.address || '',
          city: data.restaurant.city || '',
          state: data.restaurant.state || '',
          zipCode: data.restaurant.zipCode || '',
          country: data.restaurant.country || 'Pakistan',
          cuisineTypes: data.restaurant.cuisineTypes || [],
          restaurantType: data.restaurant.restaurantType || 'RESTAURANT',
          isOpen: data.restaurant.isOpen || false,
          isPromoted: data.restaurant.isPromoted || false,
          deliveryFee: data.restaurant.deliveryFee || 0,
          minOrder: data.restaurant.minOrder || 0,
          priceRange: data.restaurant.priceRange || '$$',
          operatingHours: operatingHours,
          logo: data.restaurant.logo || '',
          coverImage: data.restaurant.coverImage || '',
          images: data.restaurant.images || [],
        });
      }
    } catch (error) {
      console.error('Error fetching restaurant profile:', error);
      toast.error('Failed to load restaurant profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      
      // Validate required fields
      if (!formData.name || !formData.email || !formData.phone || !formData.address || 
          !formData.city || !formData.state || !formData.zipCode || !formData.country) {
        toast.error('Please fill in all required fields');
        return;
      }

      // Get restaurant ID or slug from localStorage if available
      const restaurantId = typeof window !== 'undefined' ? localStorage.getItem('restaurantId') : null;
      const restaurantSlug = typeof window !== 'undefined' ? localStorage.getItem('restaurantSlug') : null;
      const profileUrl = restaurantId || restaurantSlug 
        ? `/api/partner/restaurant?${restaurantId ? `restaurantId=${restaurantId}` : `restaurantSlug=${restaurantSlug}`}`
        : '/api/partner/restaurant';
      
      const response = await fetch(profileUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          restaurantId,
          restaurantSlug,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update restaurant profile');
      }

      const data = await response.json();
      
      // Refresh the profile data from the server
      await fetchRestaurantProfile();

      toast.success('Restaurant profile updated successfully!');
      setIsEditing(false);
      
      // Trigger a refresh event to update other components (like dashboard)
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('restaurantProfileUpdated'));
      }
    } catch (error: any) {
      console.error('Error saving restaurant profile:', error);
      toast.error(error.message || 'Failed to update restaurant profile');
    } finally {
      setIsSaving(false);
    }
  };

  const addCuisine = () => {
    if (cuisineInput && !formData.cuisineTypes.includes(cuisineInput)) {
      setFormData({
        ...formData,
        cuisineTypes: [...formData.cuisineTypes, cuisineInput],
      });
      setCuisineInput('');
    }
  };

  const removeCuisine = (cuisine: string) => {
    setFormData({
      ...formData,
      cuisineTypes: formData.cuisineTypes.filter(c => c !== cuisine),
    });
  };

  const handleImageUpload = async (type: 'logo' | 'cover' | 'gallery', file: File) => {
    try {
      setUploadingImage(type);
      
      // Get restaurant ID or slug from localStorage
      const restaurantId = typeof window !== 'undefined' ? localStorage.getItem('restaurantId') : null;
      const restaurantSlug = typeof window !== 'undefined' ? localStorage.getItem('restaurantSlug') : null;

      const uploadFormData = new FormData();
      uploadFormData.append('file', file);
      uploadFormData.append('type', type);
      if (restaurantId) uploadFormData.append('restaurantId', restaurantId);
      if (restaurantSlug) uploadFormData.append('restaurantSlug', restaurantSlug);

      const response = await fetch('/api/partner/upload-image', {
        method: 'POST',
        body: uploadFormData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to upload image');
      }

      const data = await response.json();

      // Update form data with the new image URL
      if (type === 'logo') {
        setFormData({ ...formData, logo: data.url });
      } else if (type === 'cover') {
        setFormData({ ...formData, coverImage: data.url });
      } else if (type === 'gallery') {
        setFormData({ ...formData, images: [...(formData.images || []), data.url] });
      }

      toast.success('Image uploaded successfully! Click Save Changes to update.');
    } catch (error: any) {
      console.error('Error uploading image:', error);
      toast.error(error.message || 'Failed to upload image');
    } finally {
      setUploadingImage(null);
    }
  };

  const handleImageRemove = async (type: 'logo' | 'cover' | 'gallery', index?: number) => {
    try {
      if (type === 'logo') {
        setFormData({ ...formData, logo: '' });
      } else if (type === 'cover') {
        setFormData({ ...formData, coverImage: '' });
      } else if (type === 'gallery' && index !== undefined) {
        const newImages = [...(formData.images || [])];
        newImages.splice(index, 1);
        setFormData({ ...formData, images: newImages });
      }
      
      toast.success('Image removed. Click Save Changes to update.');
    } catch (error) {
      console.error('Error removing image:', error);
      toast.error('Failed to remove image');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50">
      <Toaster />
      
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-4">
            <Link href="/partner/dashboard" className="flex items-center gap-3">
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
              <Link href="/partner/dashboard">
                <Button variant="ghost">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 bg-clip-text text-transparent">
                Restaurant Profile
              </h1>
              <p className="text-gray-600">Manage your restaurant information and settings</p>
            </div>
            {!isLoading && (
              <Button
                onClick={isEditing ? handleSave : () => setIsEditing(true)}
                disabled={isSaving}
                className="bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 hover:from-orange-600 hover:via-pink-600 hover:to-purple-600 text-white"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : isEditing ? (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </>
                ) : (
                  <>
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Profile
                  </>
                )}
              </Button>
            )}
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
            <span className="ml-3 text-gray-600">Loading restaurant profile...</span>
          </div>
        ) : (

        <div className="space-y-6">
          {/* Restaurant Status Card */}
          <Card className="p-6 bg-gradient-to-r from-orange-500 to-pink-500 text-white border-0 shadow-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <ChefHat className="w-8 h-8" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold mb-1">{formData.name}</h2>
                  <div className="flex items-center gap-4 text-sm opacity-90">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      <span>{formData.city}, {formData.country}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm opacity-90">Status:</span>
                  <div className={`px-3 py-1 rounded-full ${formData.isOpen ? 'bg-green-500/30' : 'bg-red-500/30'}`}>
                    {formData.isOpen ? 'Open' : 'Closed'}
                  </div>
                </div>
                {isEditing && (
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={formData.isOpen}
                      onCheckedChange={(checked) => setFormData({ ...formData, isOpen: checked })}
                    />
                    <span className="text-sm opacity-90">Toggle Status</span>
                  </div>
                )}
              </div>
            </div>
          </Card>

          {/* Basic Information */}
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <FileText className="w-6 h-6 text-orange-500" />
              Basic Information
            </h2>
            <div className="space-y-6">
              <div>
                <Label htmlFor="name">Restaurant Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  disabled={!isEditing}
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  disabled={!isEditing}
                  className="mt-2"
                  rows={4}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="restaurantType">Restaurant Type *</Label>
                  <Select
                    value={formData.restaurantType}
                    onValueChange={(value) => setFormData({ ...formData, restaurantType: value })}
                    disabled={!isEditing}
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="RESTAURANT">Restaurant</SelectItem>
                      <SelectItem value="FAST_FOOD">Fast Food</SelectItem>
                      <SelectItem value="CAFE">Cafe</SelectItem>
                      <SelectItem value="BAKERY">Bakery</SelectItem>
                      <SelectItem value="FOOD_TRUCK">Food Truck</SelectItem>
                      <SelectItem value="CATERING">Catering</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="priceRange">Price Range *</Label>
                  <Select
                    value={formData.priceRange}
                    onValueChange={(value) => setFormData({ ...formData, priceRange: value })}
                    disabled={!isEditing}
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="$">$ - Budget Friendly</SelectItem>
                      <SelectItem value="$$">$$ - Moderate</SelectItem>
                      <SelectItem value="$$$">$$$ - Expensive</SelectItem>
                      <SelectItem value="$$$$">$$$$ - Very Expensive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label>Cuisine Types</Label>
                <div className="flex flex-wrap gap-2 mt-2 mb-2">
                  {formData.cuisineTypes.map((cuisine) => (
                    <div
                      key={cuisine}
                      className="flex items-center gap-2 px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-medium"
                    >
                      <span>{cuisine}</span>
                      {isEditing && (
                        <button
                          onClick={() => removeCuisine(cuisine)}
                          className="hover:text-orange-900"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                {isEditing && (
                  <div className="flex gap-2">
                    <Input
                      value={cuisineInput}
                      onChange={(e) => setCuisineInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addCuisine()}
                      placeholder="Add cuisine type"
                      className="flex-1"
                    />
                    <Button onClick={addCuisine} variant="outline">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </Card>

          {/* Contact Information */}
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Phone className="w-6 h-6 text-orange-500" />
              Contact Information
            </h2>
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    disabled={!isEditing}
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="phone">Phone *</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    disabled={!isEditing}
                    className="mt-2"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="businessPhone">Business Phone (Optional)</Label>
                <Input
                  id="businessPhone"
                  value={formData.businessPhone}
                  onChange={(e) => setFormData({ ...formData, businessPhone: e.target.value })}
                  disabled={!isEditing}
                  className="mt-2"
                />
              </div>
            </div>
          </Card>

          {/* Location */}
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <MapPin className="w-6 h-6 text-orange-500" />
              Location
            </h2>
            <div className="space-y-6">
              <div>
                <Label htmlFor="address">Street Address *</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  disabled={!isEditing}
                  className="mt-2"
                />
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    disabled={!isEditing}
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="state">State *</Label>
                  <Input
                    id="state"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    disabled={!isEditing}
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="zipCode">Zip Code *</Label>
                  <Input
                    id="zipCode"
                    value={formData.zipCode}
                    onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                    disabled={!isEditing}
                    className="mt-2"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="country">Country *</Label>
                <Input
                  id="country"
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  disabled={!isEditing}
                  className="mt-2"
                />
              </div>
            </div>
          </Card>

          {/* Operating Hours */}
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Clock className="w-6 h-6 text-orange-500" />
              Operating Hours
            </h2>
            <div className="space-y-4">
              {(Array.isArray(formData.operatingHours) ? formData.operatingHours : defaultOperatingHours).map((hours, index) => (
                <div key={hours.day} className="flex items-center gap-4">
                  <div className="w-24 font-medium">{hours.day}</div>
                  {isEditing ? (
                    <>
                      <Input
                        type="time"
                        value={hours.open}
                        onChange={(e) => {
                          const newHours = [...formData.operatingHours];
                          newHours[index].open = e.target.value;
                          setFormData({ ...formData, operatingHours: newHours });
                        }}
                        className="flex-1"
                      />
                      <span className="text-gray-500">to</span>
                      <Input
                        type="time"
                        value={hours.close}
                        onChange={(e) => {
                          const newHours = [...formData.operatingHours];
                          newHours[index].close = e.target.value;
                          setFormData({ ...formData, operatingHours: newHours });
                        }}
                        className="flex-1"
                      />
                    </>
                  ) : (
                    <div className="flex-1 text-gray-700">
                      {hours.open} - {hours.close}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Card>

          {/* Delivery Settings */}
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Building2 className="w-6 h-6 text-orange-500" />
              Delivery Settings
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="deliveryFee">Delivery Fee (PKR) *</Label>
                <Input
                  id="deliveryFee"
                  type="number"
                  step="0.01"
                  value={formData.deliveryFee}
                  onChange={(e) => setFormData({ ...formData, deliveryFee: parseFloat(e.target.value) || 0 })}
                  disabled={!isEditing}
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="minOrder">Minimum Order (PKR) *</Label>
                <Input
                  id="minOrder"
                  type="number"
                  step="0.01"
                  value={formData.minOrder}
                  onChange={(e) => setFormData({ ...formData, minOrder: parseFloat(e.target.value) || 0 })}
                  disabled={!isEditing}
                  className="mt-2"
                />
              </div>
            </div>
          </Card>

          {/* Images Section */}
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <ImageIcon className="w-6 h-6 text-orange-500" />
              Restaurant Images
            </h2>
            <div className="space-y-6">
              <div>
                <Label>Logo</Label>
                <div className="mt-2 flex items-center gap-4">
                  {formData.logo ? (
                    <div className="relative w-24 h-24 rounded-lg overflow-hidden border-2 border-gray-200">
                      <img
                        src={formData.logo}
                        alt="Restaurant logo"
                        className="w-full h-full object-cover"
                      />
                      {isEditing && (
                        <button
                          onClick={() => handleImageRemove('logo')}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                          aria-label="Remove logo"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center">
                      <ImageIcon className="w-8 h-8 text-gray-400" />
                    </div>
                  )}
                  {isEditing && (
                    <div>
                      <input
                        type="file"
                        accept="image/jpeg,image/jpg,image/png,image/webp"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            handleImageUpload('logo', file);
                          }
                        }}
                        className="hidden"
                        id="logo-upload"
                        disabled={uploadingImage === 'logo'}
                      />
                      <Button
                        variant="outline"
                        onClick={() => document.getElementById('logo-upload')?.click()}
                        disabled={uploadingImage === 'logo'}
                      >
                        {uploadingImage === 'logo' ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Uploading...
                          </>
                        ) : (
                          <>
                            <Upload className="w-4 h-4 mr-2" />
                            Upload Logo
                          </>
                        )}
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <Label>Cover Image</Label>
                <div className="mt-2 flex items-center gap-4">
                  {formData.coverImage ? (
                    <div className="relative w-full h-48 rounded-lg overflow-hidden border-2 border-gray-200">
                      <img
                        src={formData.coverImage}
                        alt="Restaurant cover"
                        className="w-full h-full object-cover"
                      />
                      {isEditing && (
                        <button
                          onClick={() => handleImageRemove('cover')}
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 transition-colors"
                          aria-label="Remove cover image"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className="w-full h-48 bg-gray-100 rounded-lg flex items-center justify-center">
                      <ImageIcon className="w-12 h-12 text-gray-400" />
                    </div>
                  )}
                  {isEditing && (
                    <div>
                      <input
                        type="file"
                        accept="image/jpeg,image/jpg,image/png,image/webp"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            handleImageUpload('cover', file);
                          }
                        }}
                        className="hidden"
                        id="cover-upload"
                        disabled={uploadingImage === 'cover'}
                      />
                      <Button
                        variant="outline"
                        onClick={() => document.getElementById('cover-upload')?.click()}
                        disabled={uploadingImage === 'cover'}
                      >
                        {uploadingImage === 'cover' ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Uploading...
                          </>
                        ) : (
                          <>
                            <Upload className="w-4 h-4 mr-2" />
                            Upload Cover
                          </>
                        )}
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <Label>Gallery Images</Label>
                <div className="mt-2 grid grid-cols-3 gap-4">
                  {formData.images && formData.images.length > 0 ? (
                    formData.images.map((image, index) => (
                      <div key={index} className="relative aspect-square rounded-lg overflow-hidden border-2 border-gray-200">
                        <img
                          src={image}
                          alt={`Gallery image ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                        {isEditing && (
                          <button
                            onClick={() => handleImageRemove('gallery', index)}
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                            aria-label="Remove image"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
                      <ImageIcon className="w-8 h-8 text-gray-400" />
                    </div>
                  )}
                </div>
                {isEditing && (
                  <div>
                    <input
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,image/webp"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          handleImageUpload('gallery', file);
                        }
                      }}
                      className="hidden"
                      id="gallery-upload"
                      disabled={uploadingImage === 'gallery'}
                    />
                    <Button
                      variant="outline"
                      onClick={() => document.getElementById('gallery-upload')?.click()}
                      disabled={uploadingImage === 'gallery'}
                      className="mt-4"
                    >
                      {uploadingImage === 'gallery' ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Uploading...
                        </>
                      ) : (
                        <>
                          <Plus className="w-4 h-4 mr-2" />
                          Add Images
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </Card>
        </div>
        )}
      </div>
    </div>
  );
}



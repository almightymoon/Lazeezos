'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { 
  ArrowLeft, 
  Save, 
  User, 
  Mail, 
  Phone, 
  Lock,
  Camera,
  Eye,
  EyeOff
} from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Card } from '../../../components/ui/card';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Separator } from '../../../components/ui/separator';
import { toast } from 'sonner';
import { Toaster } from '../../../components/ui/sonner';

export default function PartnerProfilePage() {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [profile, setProfile] = useState({
    firstName: 'Restaurant',
    lastName: 'Owner',
    email: 'owner@burgerpalace.com',
    phone: '+92 300 1234567',
    password: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleSave = () => {
    if (profile.newPassword && profile.newPassword !== profile.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    toast.success('Profile updated successfully!');
    setIsEditing(false);
    setProfile({
      ...profile,
      password: '',
      newPassword: '',
      confirmPassword: '',
    });
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

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 bg-clip-text text-transparent">
                Profile Settings
              </h1>
              <p className="text-gray-600">Manage your account information</p>
            </div>
            <Button
              onClick={isEditing ? handleSave : () => setIsEditing(true)}
              className="bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 hover:from-orange-600 hover:via-pink-600 hover:to-purple-600 text-white"
            >
              {isEditing ? (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </>
              ) : (
                <>
                  <User className="w-4 h-4 mr-2" />
                  Edit Profile
                </>
              )}
            </Button>
          </div>
        </div>

        <div className="space-y-6">
          {/* Profile Picture */}
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <User className="w-6 h-6 text-orange-500" />
              Profile Picture
            </h2>
            <div className="flex items-center gap-6">
              <div className="relative">
                <div className="w-32 h-32 rounded-full bg-gradient-to-r from-orange-500 to-pink-500 flex items-center justify-center text-white text-4xl font-bold">
                  {profile.firstName[0]}{profile.lastName[0]}
                </div>
                {isEditing && (
                  <button className="absolute bottom-0 right-0 w-10 h-10 bg-orange-500 text-white rounded-full flex items-center justify-center hover:bg-orange-600 transition-colors">
                    <Camera className="w-5 h-5" />
                  </button>
                )}
              </div>
              <div>
                <p className="text-gray-600 mb-2">
                  {isEditing ? 'Click the camera icon to change your profile picture' : 'Your profile picture'}
                </p>
                {isEditing && (
                  <Button variant="outline" size="sm">
                    <Camera className="w-4 h-4 mr-2" />
                    Upload New Photo
                  </Button>
                )}
              </div>
            </div>
          </Card>

          {/* Personal Information */}
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <User className="w-6 h-6 text-orange-500" />
              Personal Information
            </h2>
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input
                    id="firstName"
                    value={profile.firstName}
                    onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                    disabled={!isEditing}
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input
                    id="lastName"
                    value={profile.lastName}
                    onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                    disabled={!isEditing}
                    className="mt-2"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email Address *
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  disabled={!isEditing}
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="phone" className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  Phone Number *
                </Label>
                <Input
                  id="phone"
                  value={profile.phone}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  disabled={!isEditing}
                  className="mt-2"
                />
              </div>
            </div>
          </Card>

          {/* Password Change */}
          {isEditing && (
            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Lock className="w-6 h-6 text-orange-500" />
                Change Password
              </h2>
              <div className="space-y-6">
                <div>
                  <Label htmlFor="password">Current Password</Label>
                  <div className="relative mt-2">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={profile.password}
                      onChange={(e) => setProfile({ ...profile, password: e.target.value })}
                      placeholder="Enter current password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <Label htmlFor="newPassword">New Password</Label>
                  <div className="relative mt-2">
                    <Input
                      id="newPassword"
                      type={showNewPassword ? 'text' : 'password'}
                      value={profile.newPassword}
                      onChange={(e) => setProfile({ ...profile, newPassword: e.target.value })}
                      placeholder="Enter new password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={profile.confirmPassword}
                    onChange={(e) => setProfile({ ...profile, confirmPassword: e.target.value })}
                    placeholder="Confirm new password"
                    className="mt-2"
                  />
                </div>
              </div>
            </Card>
          )}

          {/* Account Actions */}
          <Card className="p-6 border-red-200 bg-red-50">
            <h2 className="text-xl font-bold mb-4 text-red-700">Danger Zone</h2>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-red-700 mb-1">Delete Account</p>
                <p className="text-sm text-red-600">
                  Once you delete your account, there is no going back. Please be certain.
                </p>
              </div>
              <Button variant="destructive">
                Delete Account
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}


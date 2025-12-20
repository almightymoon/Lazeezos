'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Button } from '../../../components/ui/button';
import { Card } from '../../../components/ui/card';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { toast } from 'sonner';
import { Toaster } from '../../../components/ui/sonner';
import { ArrowRight, Sparkles, Check, ArrowLeft } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import { ImageWithFallback } from '../../../components/figma/ImageWithFallback';

export default function RiderSignUpPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    cnicNumber: '',
    email: '',
    phoneNumber: '',
    vehicleType: '',
    vehicleNumber: '',
    city: '',
    agreeToTerms: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.agreeToTerms) {
      toast.error('Please agree to the terms and conditions');
      return;
    }

    toast.success('Account created successfully!');
    router.push('/rider/dashboard');
  };

  const benefits = [
    'Work on your own schedule',
    'Earn competitive rates with daily payouts',
    'Track your earnings in real-time',
    'Get comprehensive insurance coverage',
  ];

  return (
    <div className="min-h-screen flex">
      <Toaster />
      
      {/* Left Side - Hero */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden bg-gradient-to-br from-orange-500 via-pink-500 to-purple-600">
        <div className="absolute inset-0 bg-black/20"></div>
        
        {/* Decorative Elements */}
        <div className="absolute top-20 left-20 w-64 h-64 bg-white rounded-full opacity-10 filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-64 h-64 bg-white rounded-full opacity-10 filter blur-3xl animate-pulse animation-delay-2000"></div>

        <div className="relative z-10 flex flex-col justify-center p-16 text-white">
          {/* <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm mb-8 w-fit">
            <Sparkles className="w-4 h-4" />
            <span>Join 15,000+ Happy Riders</span>
          </div> */}

          <h2 className="text-6xl font-bold mb-6 leading-tight">
            Start Your
            <br />
            Delivery Journey
            <br />
            Today
          </h2>
          
          <p className="text-xl opacity-90 mb-12 leading-relaxed max-w-md">
            Create your rider account and start earning money on your own schedule. 
            Flexible hours, competitive rates, and daily payouts.
          </p>

          {/* Benefits List */}
          <div className="space-y-4 mb-12">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                  <Check className="w-5 h-5" />
                </div>
                <span className="text-lg">{benefit}</span>
              </div>
            ))}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white/10 backdrop-blur-sm p-5 rounded-2xl">
              <p className="text-3xl font-bold mb-1">PKR 50K+</p>
              <p className="text-sm opacity-80">Monthly Earnings</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-5 rounded-2xl">
              <p className="text-3xl font-bold mb-1">24/7</p>
              <p className="text-sm opacity-80">Flexible Hours</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-5 rounded-2xl">
              <p className="text-3xl font-bold mb-1">4.9★</p>
              <p className="text-sm opacity-80">Rider Rating</p>
            </div>
          </div>
        </div>

        <ImageWithFallback
          src="https://images.unsplash.com/photo-1727694619845-2a35923f9734?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZWxpdmVyeSUyMHBlcnNvbiUyMGJpa2V8ZW58MXx8fHwxNzY2MTYzNjA4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
          alt="Delivery Rider"
          className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-20"
        />
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center p-6 relative overflow-hidden bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-72 h-72 bg-orange-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
          <div className="absolute top-40 right-20 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-20 left-40 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
        </div>

        <div className="w-full max-w-2xl relative z-10">
          {/* Back Button */}
          <Link
            href="/rider"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Back</span>
          </Link>

          {/* Title Section */}
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold mb-2">
              Ready to Get Started?
            </h2>
            <p className="text-base text-gray-600">Fill out the form below and we'll get back to you within 24 hours</p>
          </div>

          <Card className="p-6 shadow-2xl border-2">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName" className="text-base font-medium">First Name (as per CNIC) *</Label>
                  <Input
                    id="firstName"
                    required
                    value={formData.firstName}
                    onChange={(e) =>
                      setFormData({ ...formData, firstName: e.target.value })
                    }
                    placeholder="Enter first name as on CNIC"
                    className="mt-1.5 h-10 text-base"
                  />
                </div>
                <div>
                  <Label htmlFor="lastName" className="text-base font-medium">Last Name (as per CNIC) *</Label>
                  <Input
                    id="lastName"
                    required
                    value={formData.lastName}
                    onChange={(e) =>
                      setFormData({ ...formData, lastName: e.target.value })
                    }
                    placeholder="Enter last name as on CNIC"
                    className="mt-1.5 h-10 text-base"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="cnicNumber" className="text-base font-medium">CNIC Number *</Label>
                  <Input
                    id="cnicNumber"
                    required
                    value={formData.cnicNumber}
                    onChange={(e) =>
                      setFormData({ ...formData, cnicNumber: e.target.value })
                    }
                    placeholder="12345-1234567-1"
                    className="mt-1.5 h-10 text-base"
                  />
                </div>
                <div>
                  <Label htmlFor="email" className="text-base font-medium">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    placeholder="your@email.com"
                    className="mt-1.5 h-10 text-base"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phoneNumber" className="text-base font-medium">Phone Number *</Label>
                  <Input
                    id="phoneNumber"
                    type="tel"
                    required
                    value={formData.phoneNumber}
                    onChange={(e) =>
                      setFormData({ ...formData, phoneNumber: e.target.value })
                    }
                    placeholder="+92 300 1234567"
                    className="mt-1.5 h-10 text-base"
                  />
                </div>
                <div>
                  <Label htmlFor="vehicleType" className="text-base font-medium">Vehicle Type *</Label>
                  <Select
                    required
                    value={formData.vehicleType}
                    onValueChange={(value) =>
                      setFormData({ ...formData, vehicleType: value })
                    }
                  >
                    <SelectTrigger className="mt-1.5 h-10 text-base">
                      <SelectValue placeholder="Select vehicle type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="motorcycle">Motorcycle</SelectItem>
                      <SelectItem value="bike">Bike</SelectItem>
                      <SelectItem value="car">Car</SelectItem>
                      <SelectItem value="scooter">Scooter</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="vehicleNumber" className="text-base font-medium">Vehicle Number *</Label>
                  <Input
                    id="vehicleNumber"
                    required
                    value={formData.vehicleNumber}
                    onChange={(e) =>
                      setFormData({ ...formData, vehicleNumber: e.target.value })
                    }
                    placeholder="Enter your vehicle number"
                    className="mt-1.5 h-10 text-base"
                  />
                </div>
                <div>
                  <Label htmlFor="city" className="text-base font-medium">City *</Label>
                  <Input
                    id="city"
                    required
                    value={formData.city}
                    onChange={(e) =>
                      setFormData({ ...formData, city: e.target.value })
                    }
                    placeholder="Enter your city"
                    className="mt-1.5 h-10 text-base"
                  />
                </div>
              </div>

              <div className="flex items-start pt-1">
                <input
                  type="checkbox"
                  id="terms"
                  checked={formData.agreeToTerms}
                  onChange={(e) =>
                    setFormData({ ...formData, agreeToTerms: e.target.checked })
                  }
                  className="w-4 h-4 mt-0.5 text-pink-600 border-gray-300 rounded focus:ring-pink-500"
                />
                <label htmlFor="terms" className="ml-2 text-sm text-gray-600">
                  I agree to the{' '}
                  <button
                    type="button"
                    className="text-pink-600 hover:text-pink-700 font-semibold"
                    onClick={() => toast.info('Terms coming soon!')}
                  >
                    Terms and Conditions
                  </button>{' '}
                  and{' '}
                  <button
                    type="button"
                    className="text-pink-600 hover:text-pink-700 font-semibold"
                    onClick={() => toast.info('Privacy Policy coming soon!')}
                  >
                    Privacy Policy
                  </button>
                </label>
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 h-11 text-base shadow-xl hover:shadow-2xl transition-all text-white mt-3"
              >
                Submit Application
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </form>

            <p className="text-center text-sm text-gray-600 mt-4">
              Already have an account?{' '}
              <Link
                href="/rider/login"
                className="text-pink-600 hover:text-pink-700 font-bold"
              >
                Sign In
              </Link>
            </p>
          </Card>
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}


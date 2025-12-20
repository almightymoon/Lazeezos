'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { toast } from 'sonner';
import { Toaster } from '../../components/ui/sonner';
import { ArrowRight, Sparkles, Check, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { ImageWithFallback } from '../../components/figma/ImageWithFallback';

export default function SignUpPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match!');
      return;
    }

    if (!formData.agreeToTerms) {
      toast.error('Please agree to the terms and conditions');
      return;
    }

    // Set login state in localStorage
    localStorage.setItem('isLoggedIn', 'true');
    // Dispatch custom event to notify Header component
    window.dispatchEvent(new Event('loginStateChange'));
    toast.success('Account created successfully!');
    router.push('/');
  };

  const benefits = [
    'Order from 1000+ restaurants',
    'Track your delivery in real-time',
    'Exclusive deals and offers',
    'Fast and reliable service',
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
            <span>Join 1 Million+ Food Lovers</span>
          </div> */}

          <h2 className="text-6xl font-bold mb-6 leading-tight">
            Start Your
            <br />
            Food Journey
            <br />
            Today
          </h2>
          
          <p className="text-xl opacity-90 mb-12 leading-relaxed max-w-md">
            Create your account and unlock access to the best restaurants in your city. 
            Fast delivery, amazing food, unbeatable prices.
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
              <p className="text-3xl font-bold mb-1">4.8★</p>
              <p className="text-sm opacity-80">App Rating</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-5 rounded-2xl">
              <p className="text-3xl font-bold mb-1">50K+</p>
              <p className="text-sm opacity-80">Daily Orders</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-5 rounded-2xl">
              <p className="text-3xl font-bold mb-1">30min</p>
              <p className="text-sm opacity-80">Delivery Time</p>
            </div>
          </div>
        </div>

        <ImageWithFallback
          src="https://images.unsplash.com/photo-1485182708500-e8f1f318ba72?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXN0YXVyYW50JTIwYnVzaW5lc3N8ZW58MXx8fHwxNzY2MjI4Njc1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
          alt="Restaurant"
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
            href="/"
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
            <p className="text-base text-gray-600">Create your account and start ordering delicious food</p>
          </div>

          <Card className="p-6 shadow-2xl border-2">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="fullName" className="text-base font-medium">Full Name *</Label>
                <Input
                  id="fullName"
                  required
                  value={formData.fullName}
                  onChange={(e) =>
                    setFormData({ ...formData, fullName: e.target.value })
                  }
                  placeholder="Enter your full name"
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

              <div>
                <Label htmlFor="phone" className="text-base font-medium">Phone Number *</Label>
                <Input
                  id="phone"
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  placeholder="+92 300 1234567"
                  className="mt-1.5 h-10 text-base"
                />
              </div>

              <div>
                <Label htmlFor="password" className="text-base font-medium">Password *</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    placeholder="Create a strong password"
                    className="mt-1.5 h-10 text-base pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <Label htmlFor="confirmPassword" className="text-base font-medium">Confirm Password *</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      setFormData({ ...formData, confirmPassword: e.target.value })
                    }
                    placeholder="Confirm your password"
                    className="mt-1.5 h-10 text-base pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
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
                Create Account
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </form>

            <p className="text-center text-sm text-gray-600 mt-4">
              Already have an account?{' '}
              <Link
                href="/login"
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


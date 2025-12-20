'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Button } from '../../../components/ui/button';
import { Card } from '../../../components/ui/card';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Separator } from '../../../components/ui/separator';
import { toast } from 'sonner';
import { Toaster } from '../../../components/ui/sonner';
import { Eye, EyeOff, ArrowRight, Sparkles, ArrowLeft } from 'lucide-react';
import { ImageWithFallback } from '../../../components/figma/ImageWithFallback';

export default function RiderLoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Signed in successfully!');
    router.push('/rider/dashboard');
  };

  const handleSocialLogin = (provider: string) => {
    toast.info(`${provider} login coming soon!`);
  };

  return (
    <div className="min-h-screen flex">
      <Toaster />
      
      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8 relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50">
          <div className="absolute top-20 left-20 w-72 h-72 bg-orange-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
          <div className="absolute top-40 right-20 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-20 left-40 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
        </div>

        <div className="w-full max-w-md relative z-10">
          {/* Back Button */}
          <Link
            href="/rider"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </Link>

          {/* Logo & Welcome */}
          <div className="text-center mb-8">
                {/* <Link
                href="/"
                className="inline-block bg-gradient-to-r from-orange-500 to-pink-500 text-white px-8 py-4 rounded-2xl mb-6 hover:shadow-xl transition-shadow"
                >
                <h1 className="text-3xl font-bold">Lazeezos</h1>
                </Link> */}
            <h2 className="text-4xl font-bold mb-3">Welcome Back!</h2>
            <p className="text-gray-600 text-lg">Sign in to continue your delivery journey</p>
          </div>

          <Card className="p-8 shadow-2xl border-2 backdrop-blur-sm bg-white/95">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <Label htmlFor="email" className="text-base">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder="your@email.com"
                  className="mt-2 h-12 text-base"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label htmlFor="password" className="text-base">Password</Label>
                  <button
                    type="button"
                    className="text-sm text-pink-600 hover:text-pink-700 font-semibold"
                    onClick={() => toast.info('Password reset coming soon!')}
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    placeholder="Enter your password"
                    className="h-12 text-base pr-12"
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

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="remember"
                  className="w-4 h-4 text-pink-600 border-gray-300 rounded focus:ring-pink-500"
                />
                <label htmlFor="remember" className="ml-2 text-sm text-gray-600">
                  Keep me signed in
                </label>
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 h-12 text-base shadow-lg hover:shadow-xl transition-all"
              >
                Sign In
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </form>



            {/* ############################# Social Login Buttons are not working yet #############################
            {/* <div className="relative my-6">
              <Separator />
              <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white px-4 text-sm text-gray-500">
                Or continue with social
              </span>
            </div> */}

            {/* Social Login Buttons */}
            {/* <div className="space-y-3">
              <Button
                type="button"
                variant="outline"
                className="w-full h-12 text-base border-2 hover:border-pink-300 hover:bg-pink-50"
                onClick={() => handleSocialLogin('Google')}
              >
                <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Continue with Google
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full h-12 text-base border-2 hover:border-blue-300 hover:bg-blue-50"
                onClick={() => handleSocialLogin('Facebook')}
              >
                <svg className="w-5 h-5 mr-3" fill="#1877F2" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                Continue with Facebook
              </Button>
            </div> */}
            {/* ############################# Social Login Buttons are not working yet #############################     */} 
            
            
            
            <p className="text-center text-sm text-gray-600 mt-6">
              Don't have an account?{' '}
              <Link
                href="/rider/signup"
                className="text-pink-600 hover:text-pink-700 font-bold"
              >
                Sign Up
              </Link>
            </p>
          </Card>

          <p className="text-center text-sm text-gray-500 mt-6">
            Protected by industry-leading security measures
          </p>
        </div>
      </div>

      {/* Right Side - Hero Image */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden bg-gradient-to-br from-orange-500 via-pink-500 to-purple-600">
        <div className="absolute inset-0 bg-black/20"></div>
        
        {/* Decorative Elements */}
        <div className="absolute top-10 right-10 w-64 h-64 bg-white rounded-full opacity-10 filter blur-3xl"></div>
        <div className="absolute bottom-10 left-10 w-64 h-64 bg-white rounded-full opacity-10 filter blur-3xl"></div>

        <div className="relative z-10 flex flex-col justify-center p-16 text-white">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm mb-8 w-fit">
            <Sparkles className="w-4 h-4" />
            <span>Join 15,000+ Active Riders</span>
          </div>

          <h2 className="text-5xl font-bold mb-6 leading-tight">
            Deliver Food,
            <br />
            Earn Money,
            <br />
            Be Free
          </h2>
          
          <p className="text-xl opacity-90 mb-8 leading-relaxed">
            Work on your own schedule and earn great money delivering food to customers. 
            Flexible hours, competitive rates, and daily payouts.
          </p>

          <div className="grid grid-cols-3 gap-6">
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl">
              <p className="text-4xl font-bold mb-2">PKR 50K+</p>
              <p className="text-sm opacity-80">Monthly Earnings</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl">
              <p className="text-4xl font-bold mb-2">24/7</p>
              <p className="text-sm opacity-80">Flexible Hours</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl">
              <p className="text-4xl font-bold mb-2">4.9★</p>
              <p className="text-sm opacity-80">Rider Rating</p>
            </div>
          </div>
        </div>

        <ImageWithFallback
          src="https://images.unsplash.com/photo-1727694619845-2a35923f9734?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZWxpdmVyeSUyMHBlcnNvbiUyMGJpa2V8ZW58MXx8fHwxNzY2MTYzNjA4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
          alt="Delivery Rider"
          className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-30"
        />
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


'use client';

import { CheckCircle, TrendingUp, Users, Clock, DollarSign, BarChart, ArrowRight, Sparkles, Target, Zap } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { toast } from 'sonner';
import { Toaster } from '../../components/ui/sonner';
import { ImageWithFallback } from '../../components/figma/ImageWithFallback';

export default function PartnerLandingPage() {
  const [formData, setFormData] = useState({
    restaurantName: '',
    ownerName: '',
    email: '',
    phone: '',
    address: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Application submitted! We\'ll contact you soon.');
    setFormData({
      restaurantName: '',
      ownerName: '',
      email: '',
      phone: '',
      address: '',
    });
  };

  const benefits = [
    {
      icon: Users,
      title: 'Reach More Customers',
      description: 'Connect with thousands of hungry customers in your area',
      color: 'from-purple-500 to-pink-500',
    },
    {
      icon: TrendingUp,
      title: 'Grow Your Business',
      description: 'Increase your revenue by up to 30% with our platform',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: Clock,
      title: 'Easy Management',
      description: 'Simple dashboard to manage orders and track performance',
      color: 'from-green-500 to-emerald-500',
    },
    {
      icon: DollarSign,
      title: 'Competitive Rates',
      description: 'Low commission rates with transparent pricing',
      color: 'from-yellow-500 to-orange-500',
    },
    {
      icon: BarChart,
      title: 'Real-time Analytics',
      description: 'Track your performance with detailed insights and reports',
      color: 'from-red-500 to-pink-500',
    },
    {
      icon: CheckCircle,
      title: '24/7 Support',
      description: 'Dedicated support team ready to help you succeed',
      color: 'from-indigo-500 to-purple-500',
    },
  ];

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      <Toaster />
      
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b shadow-sm">
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
              <span className="text-xl md:text-2xl font-bold bg-gradient-to-r from-orange-500 via-orange-400 to-pink-500 bg-clip-text text-transparent">
                Lazeezos
              </span>
            </Link>
            <div className="flex items-center gap-4">
              <Link href="/partner/login">
                <Button variant="ghost" className="text-gray-600 hover:text-gray-900">
                  Sign In
                </Button>
              </Link>
              <Link href="/partner/signup">
                <Button className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white">
                  Sign Up
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section - Split Design */}
      <div className="relative min-h-[90vh] flex items-center">
        {/* Background Gradient Blobs */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
          <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-pink-500 text-white px-4 py-2 rounded-full text-sm">
                <Sparkles className="w-4 h-4" />
                <span>Trusted by 10,000+ Restaurants</span>
              </div>
              
              <h1 className="text-5xl md:text-7xl font-bold leading-tight">
                Grow Your
                <span className="block bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 bg-clip-text text-transparent">
                  Restaurant Empire
                </span>
              </h1>
              
              <p className="text-xl text-gray-600 leading-relaxed">
                Join the fastest-growing food delivery platform and reach millions of hungry customers. 
                Boost your revenue, expand your reach, and grow your brand with Lazeezos.
              </p>

              <div className="flex flex-wrap gap-4">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-lg px-8 py-6 shadow-xl hover:shadow-2xl transition-all"
                  onClick={() => {
                    document.getElementById('application-form')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  Get Started Now
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="text-lg px-8 py-6 border-2"
                  onClick={() => toast.info('Demo coming soon!')}
                >
                  Watch Demo
                </Button>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-6 pt-8">
                <div>
                  <p className="text-4xl font-bold bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">30%</p>
                  <p className="text-sm text-gray-600 mt-1">Revenue Increase</p>
                </div>
                <div>
                  <p className="text-4xl font-bold bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">10K+</p>
                  <p className="text-sm text-gray-600 mt-1">Partners</p>
                </div>
                <div>
                  <p className="text-4xl font-bold bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">500K</p>
                  <p className="text-sm text-gray-600 mt-1">Daily Orders</p>
                </div>
              </div>
            </div>

            {/* Hero Image */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-pink-500 rounded-3xl transform rotate-6 opacity-20"></div>
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1622021142947-da7dedc7c39a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXN0YXVyYW50JTIwa2l0Y2hlbiUyMGNoZWZ8ZW58MXx8fHwxNzY2MjE4NDE2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Restaurant Kitchen"
                className="relative rounded-3xl shadow-2xl object-cover w-full h-[600px]"
              />
              
              {/* Floating Card */}
              <div className="absolute -bottom-8 -left-8 bg-white p-6 rounded-2xl shadow-2xl">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Monthly Revenue</p>
                    <p className="text-2xl font-bold">+$45,000</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Benefits Section - Bento Grid Style */}
      <div className="py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-pink-100 text-pink-600 px-4 py-2 rounded-full text-sm mb-4">
              <Target className="w-4 h-4" />
              <span>Why Choose Us</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Everything You Need to
              <span className="block bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
                Succeed & Thrive
              </span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <Card 
                  key={index} 
                  className="p-8 hover:shadow-2xl transition-all duration-300 border-2 hover:border-pink-200 group cursor-pointer"
                >
                  <div className={`w-16 h-16 bg-gradient-to-r ${benefit.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3">{benefit.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{benefit.description}</p>
                </Card>
              );
            })}
          </div>
        </div>
      </div>

      {/* How It Works - Timeline Style */}
      <div className="py-24 bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-pink-50 to-transparent opacity-50"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Start in <span className="bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">3 Simple Steps</span>
            </h2>
            <p className="text-xl text-gray-600">From application to first order in less than 48 hours</p>
          </div>

          <div className="max-w-5xl mx-auto">
            <div className="relative">
              {/* Timeline Line */}
              <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-orange-500 via-pink-500 to-purple-500"></div>

              {/* Steps */}
              <div className="space-y-12">
                {[
                  { num: '01', title: 'Submit Application', desc: 'Fill out our simple online form with your restaurant details', icon: Target },
                  { num: '02', title: 'Get Verified', desc: 'Our team reviews your application and verifies your details', icon: CheckCircle },
                  { num: '03', title: 'Start Selling', desc: 'Go live and start receiving orders from thousands of customers', icon: Zap },
                ].map((step, index) => {
                  const Icon = step.icon;
                  return (
                    <div key={index} className={`flex items-center gap-8 ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                      <div className={`flex-1 ${index % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
                        <div className="bg-white p-8 rounded-2xl shadow-xl border-2 border-pink-100">
                          <p className="text-6xl font-bold bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent mb-2">{step.num}</p>
                          <h3 className="text-2xl font-bold mb-3">{step.title}</h3>
                          <p className="text-gray-600">{step.desc}</p>
                        </div>
                      </div>
                      
                      <div className="hidden md:flex w-16 h-16 bg-gradient-to-r from-orange-500 to-pink-500 rounded-full items-center justify-center z-10 shadow-xl">
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                      
                      <div className="flex-1"></div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Application Form - Modern Design */}
      <div className="py-24 bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50" id="application-form">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                Ready to Get Started?
              </h2>
              <p className="text-xl text-gray-600">Fill out the form below and we'll get back to you within 24 hours</p>
            </div>

            <Card className="p-8 md:p-12 shadow-2xl border-2">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="restaurantName" className="text-lg">Restaurant Name *</Label>
                    <Input
                      id="restaurantName"
                      required
                      value={formData.restaurantName}
                      onChange={(e) =>
                        setFormData({ ...formData, restaurantName: e.target.value })
                      }
                      placeholder="Enter your restaurant name"
                      className="mt-2 h-12 text-lg"
                    />
                  </div>
                  <div>
                    <Label htmlFor="ownerName" className="text-lg">Owner Name *</Label>
                    <Input
                      id="ownerName"
                      required
                      value={formData.ownerName}
                      onChange={(e) =>
                        setFormData({ ...formData, ownerName: e.target.value })
                      }
                      placeholder="Enter your full name"
                      className="mt-2 h-12 text-lg"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="email" className="text-lg">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      placeholder="your@email.com"
                      className="mt-2 h-12 text-lg"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone" className="text-lg">Phone Number *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      placeholder="+1 (555) 000-0000"
                      className="mt-2 h-12 text-lg"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="address" className="text-lg">Restaurant Address *</Label>
                  <Input
                    id="address"
                    required
                    value={formData.address}
                    onChange={(e) =>
                      setFormData({ ...formData, address: e.target.value })
                    }
                    placeholder="Full address including city and zip code"
                    className="mt-2 h-12 text-lg"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 h-14 text-lg shadow-xl hover:shadow-2xl transition-all"
                >
                  Submit Application
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </form>
            </Card>
          </div>
        </div>
      </div>

      {/* Final CTA */}
      <div className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500"></div>
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full filter blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full filter blur-3xl"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10 text-center text-white">
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            Join 10,000+ Successful Restaurants
          </h2>
          <p className="text-2xl mb-8 opacity-90">
            Start your growth journey with Lazeezos today
          </p>
          <Button
            size="lg"
            className="bg-white text-pink-600 hover:bg-gray-100 text-xl px-12 py-7 shadow-2xl"
            onClick={() => {
              document.getElementById('application-form')?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            Get Started Now
            <ArrowRight className="ml-2 w-6 h-6" />
          </Button>
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

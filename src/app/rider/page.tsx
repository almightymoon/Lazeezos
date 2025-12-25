'use client';

import { CheckCircle, TrendingUp, Users, Clock, DollarSign, BarChart, ArrowRight, Sparkles, Target, Zap, Bike, MapPin, Shield, Package } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { toast } from 'sonner';
import { Toaster } from '../../components/ui/sonner';
import { ImageWithFallback } from '../../components/figma/ImageWithFallback';

export default function RiderLandingPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    cnicNumber: '',
    email: '',
    phoneNumber: '',
    vehicleType: '',
    vehicleNumber: '',
    city: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Application submitted! We\'ll contact you soon.');
    setFormData({
      firstName: '',
      lastName: '',
      cnicNumber: '',
      email: '',
      phoneNumber: '',
      vehicleType: '',
      vehicleNumber: '',
      city: '',
    });
  };

  const benefits = [
    {
      icon: Clock,
      title: 'Flexible Schedule',
      description: 'Work on your own time and choose when you want to deliver',
      color: 'from-purple-500 to-pink-500',
    },
    {
      icon: DollarSign,
      title: 'Great Earnings',
      description: 'Earn competitive rates with daily payouts and bonuses',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: Bike,
      title: 'Easy to Start',
      description: 'Simple application process and quick onboarding',
      color: 'from-green-500 to-emerald-500',
    },
    {
      icon: MapPin,
      title: 'Work Anywhere',
      description: 'Deliver in your preferred areas and zones',
      color: 'from-yellow-500 to-orange-500',
    },
    {
      icon: Shield,
      title: 'Insurance Coverage',
      description: 'Comprehensive insurance and support for all riders',
      color: 'from-red-500 to-pink-500',
    },
    {
      icon: BarChart,
      title: 'Track Earnings',
      description: 'Real-time tracking of your deliveries and earnings',
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
            <div className="flex items-center gap-6">
              <Link href="#" className="hidden md:flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors">
                <span>Resources</span>
              </Link>
              <Link href="/rider/login" className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors">
                <span>Sign In</span>
              </Link>
              <Link href="/rider/signup" className="flex items-center gap-2">
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
          <div className="absolute top-0 -left-4 w-72 h-72 bg-orange-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
          <div className="absolute top-0 -right-4 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-pink-500 text-white px-4 py-2 rounded-full text-sm">
                <Sparkles className="w-4 h-4" />
                <span>Join 15,000+ Happy Riders</span>
              </div>
              
              <h1 className="text-5xl md:text-7xl font-bold leading-tight">
                Deliver.
                <span className="block bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 bg-clip-text text-transparent">
                  Earn.
                </span>
                Repeat.
              </h1>
              
              <p className="text-xl text-gray-600 leading-relaxed">
                Be your own boss. Set your own hours. Make great money while exploring your city.
              </p>

              {/* Earnings Card */}
              <Card className="p-6 shadow-lg border-2">
                <p className="text-sm text-gray-600 mb-2">Your potential weekly earnings</p>
                <div className="flex items-baseline gap-2">
                  <p className="text-5xl font-bold bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">PKR 30,000</p>
                  <p className="text-lg text-gray-600">/week</p>
                </div>
                <div className="flex items-center gap-2 mt-3">
                  <TrendingUp className="w-4 h-4 text-green-500" />
                  <p className="text-sm text-green-600">Based on 40 hours at PKR 750/hr average</p>
                </div>
              </Card>

              <div className="flex flex-wrap gap-4">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-lg px-8 py-6 shadow-xl hover:shadow-2xl transition-all text-white"
                  onClick={() => {
                    document.getElementById('application-form')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  Start Earning Today
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="text-lg px-8 py-6 border-2 border-pink-500 text-pink-600 hover:bg-pink-50"
                  onClick={() => toast.info('Earnings calculator coming soon!')}
                >
                  Calculate Earnings
                </Button>
              </div>
            </div>

            {/* Hero Image */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-pink-500 rounded-3xl transform rotate-6 opacity-20"></div>
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1727694619845-2a35923f9734?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZWxpdmVyeSUyMHBlcnNvbiUyMGJpa2V8ZW58MXx8fHwxNzY2MTYzNjA4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Delivery Rider"
                className="relative rounded-3xl shadow-2xl object-cover w-full h-[600px]"
              />
              
              {/* Today's Earnings Card */}
              <div className="absolute top-8 right-8 bg-white p-5 rounded-2xl shadow-2xl">
                <p className="text-sm text-gray-600 mb-2">Today's Earnings</p>
                <div className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-green-500" />
                  <p className="text-2xl font-bold text-green-600">PKR 5,625</p>
                </div>
              </div>
              
              {/* Deliveries Today Card */}
              <div className="absolute bottom-8 right-8 bg-white p-5 rounded-2xl shadow-2xl">
                <p className="text-sm text-gray-600 mb-2">Deliveries Today</p>
                <div className="flex items-center gap-2">
                  <Package className="w-5 h-5 text-pink-500" />
                  <p className="text-2xl font-bold text-pink-600">24</p>
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
              <span>Why Ride With Us</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Everything You Need to
              <span className="block bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
                Succeed & Earn
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
            <p className="text-xl text-gray-600">From application to first delivery in less than 48 hours</p>
          </div>

          <div className="max-w-5xl mx-auto">
            <div className="relative">
              {/* Timeline Line */}
              <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-orange-500 via-pink-500 to-purple-500"></div>

              {/* Steps */}
              <div className="space-y-12">
                {[
                  { num: '01', title: 'Submit Application', desc: 'Fill out our simple online form with your details and vehicle information', icon: Target },
                  { num: '02', title: 'Get Verified', desc: 'Our team reviews your application and verifies your documents', icon: CheckCircle },
                  { num: '03', title: 'Start Delivering', desc: 'Go online and start accepting delivery requests from customers', icon: Zap },
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
                    <Label htmlFor="firstName" className="text-lg">First Name (as per CNIC) *</Label>
                    <Input
                      id="firstName"
                      required
                      value={formData.firstName}
                      onChange={(e) =>
                        setFormData({ ...formData, firstName: e.target.value })
                      }
                      placeholder="Enter first name as on CNIC"
                      className="mt-2 h-12 text-lg"
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName" className="text-lg">Last Name (as per CNIC) *</Label>
                    <Input
                      id="lastName"
                      required
                      value={formData.lastName}
                      onChange={(e) =>
                        setFormData({ ...formData, lastName: e.target.value })
                      }
                      placeholder="Enter last name as on CNIC"
                      className="mt-2 h-12 text-lg"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="cnicNumber" className="text-lg">CNIC Number *</Label>
                    <Input
                      id="cnicNumber"
                      required
                      value={formData.cnicNumber}
                      onChange={(e) =>
                        setFormData({ ...formData, cnicNumber: e.target.value })
                      }
                      placeholder="12345-1234567-1"
                      className="mt-2 h-12 text-lg"
                    />
                  </div>
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
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="phoneNumber" className="text-lg">Phone Number *</Label>
                    <Input
                      id="phoneNumber"
                      type="tel"
                      required
                      value={formData.phoneNumber}
                      onChange={(e) =>
                        setFormData({ ...formData, phoneNumber: e.target.value })
                      }
                      placeholder="+92 300 1234567"
                      className="mt-2 h-12 text-lg"
                    />
                  </div>
                  <div>
                    <Label htmlFor="vehicleType" className="text-lg">Vehicle Type *</Label>
                    <Select
                      required
                      value={formData.vehicleType}
                      onValueChange={(value) =>
                        setFormData({ ...formData, vehicleType: value })
                      }
                    >
                      <SelectTrigger className="mt-2 h-12 text-lg">
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

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="vehicleNumber" className="text-lg">Vehicle Number *</Label>
                    <Input
                      id="vehicleNumber"
                      required
                      value={formData.vehicleNumber}
                      onChange={(e) =>
                        setFormData({ ...formData, vehicleNumber: e.target.value })
                      }
                      placeholder="Enter your vehicle number"
                      className="mt-2 h-12 text-lg"
                    />
                  </div>
                  <div>
                    <Label htmlFor="city" className="text-lg">City *</Label>
                    <Input
                      id="city"
                      required
                      value={formData.city}
                      onChange={(e) =>
                        setFormData({ ...formData, city: e.target.value })
                      }
                      placeholder="Enter your city"
                      className="mt-2 h-12 text-lg"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 h-14 text-lg shadow-xl hover:shadow-2xl transition-all text-white"
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
            Join 15,000+ Happy Riders
          </h2>
          <p className="text-2xl mb-8 opacity-90">
            Start your earning journey with Lazeezos today
          </p>
          <Button
            size="lg"
            className="bg-white text-pink-600 hover:bg-gray-100 text-xl px-12 py-7 shadow-2xl"
            onClick={() => {
              document.getElementById('application-form')?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            Start Earning Today
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


'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Header } from '../../components/Header';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Badge } from '../../components/ui/badge';
import { 
  HelpCircle,
  Search,
  Phone,
  Mail,
  Clock,
  ChevronDown,
  ChevronUp,
  Book,
  FileText,
  Video,
  Shield,
  CreditCard,
  ShoppingBag,
  Truck,
  User,
  Store,
  Bike,
  Star,
  ArrowRight,
  CheckCircle,
  XCircle,
  AlertCircle,
  Info,
  Send,
  Headphones,
  ArrowLeft
} from 'lucide-react';
import { toast } from 'sonner';
import { Toaster } from '../../components/ui/sonner';

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export default function HelpPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [openFAQ, setOpenFAQ] = useState<string | null>(null);
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const categories = [
    { id: 'all', name: 'All Topics', icon: Book },
    { id: 'orders', name: 'Orders', icon: ShoppingBag },
    { id: 'delivery', name: 'Delivery', icon: Truck },
    { id: 'payment', name: 'Payment', icon: CreditCard },
    { id: 'account', name: 'Account', icon: User },
    { id: 'restaurant', name: 'Restaurant', icon: Store },
    { id: 'rider', name: 'Rider', icon: Bike },
  ];

  const faqs: FAQ[] = [
    {
      id: '1',
      category: 'orders',
      question: 'How do I place an order?',
      answer: 'To place an order, simply browse restaurants, add items to your cart, and proceed to checkout. You can choose your delivery address, payment method, and any special instructions. Once confirmed, you\'ll receive an order confirmation with tracking details.'
    },
    {
      id: '2',
      category: 'orders',
      question: 'Can I cancel my order?',
      answer: 'Yes, you can cancel your order if it hasn\'t been confirmed by the restaurant yet. Go to your Orders page, select the order, and click "Cancel Order". Once the restaurant confirms, cancellation may be subject to their policy.'
    },
    {
      id: '3',
      category: 'orders',
      question: 'How do I track my order?',
      answer: 'You can track your order in real-time from the Orders page. You\'ll see updates when your order is confirmed, being prepared, picked up by the rider, and out for delivery. You\'ll also receive SMS notifications at each stage.'
    },
    {
      id: '4',
      category: 'delivery',
      question: 'What are the delivery charges?',
      answer: 'Delivery charges vary by restaurant and distance. The exact delivery fee is shown before you place your order. Some restaurants offer free delivery on orders above a certain amount.'
    },
    {
      id: '5',
      category: 'delivery',
      question: 'How long does delivery take?',
      answer: 'Delivery time typically ranges from 30-60 minutes depending on your location, restaurant preparation time, and traffic conditions. Estimated delivery time is shown when you place your order.'
    },
    {
      id: '6',
      category: 'delivery',
      question: 'Can I change my delivery address?',
      answer: 'You can change your delivery address before placing the order. For active orders, contact customer support immediately as changes may not be possible once the order is confirmed.'
    },
    {
      id: '7',
      category: 'payment',
      question: 'What payment methods are accepted?',
      answer: 'We accept cash on delivery, credit/debit cards, and mobile wallet payments. You can save your payment methods for faster checkout in the future.'
    },
    {
      id: '8',
      category: 'payment',
      question: 'Is my payment information secure?',
      answer: 'Yes, all payment information is encrypted and securely processed. We use industry-standard security measures and never store your full card details. Your financial data is protected with SSL encryption.'
    },
    {
      id: '9',
      category: 'payment',
      question: 'How do I get a refund?',
      answer: 'Refunds are processed automatically for cancelled orders. For issues with delivered orders, contact customer support within 24 hours. Refunds typically take 5-7 business days to reflect in your account.'
    },
    {
      id: '10',
      category: 'account',
      question: 'How do I update my profile?',
      answer: 'Go to your Profile page from the menu, click "Edit", and update your information. You can change your name, email, phone number, profile picture, and delivery addresses.'
    },
    {
      id: '11',
      category: 'account',
      question: 'How do I reset my password?',
      answer: 'Click "Forgot Password" on the login page, enter your email, and you\'ll receive a password reset link. You can also change your password from Settings > Account Security.'
    },
    {
      id: '12',
      category: 'account',
      question: 'How do I delete my account?',
      answer: 'Go to Settings > Account Security > Danger Zone, and click "Delete Account". This action is permanent and cannot be undone. Make sure to cancel any active orders first.'
    },
    {
      id: '13',
      category: 'restaurant',
      question: 'How do I become a restaurant partner?',
      answer: 'Visit our Partner page and click "Sign Up". Fill out the application form with your restaurant details, business license, and documents. Our team will review and contact you within 2-3 business days.'
    },
    {
      id: '14',
      category: 'restaurant',
      question: 'How do I manage my restaurant menu?',
      answer: 'Log in to your Partner Dashboard, go to Menu Management, and you can add, edit, or remove items. You can also update prices, availability, and item descriptions.'
    },
    {
      id: '15',
      category: 'restaurant',
      question: 'How do I receive payments?',
      answer: 'Payments are automatically transferred to your registered bank account weekly. You can view your earnings, payout history, and update bank details from the Partner Dashboard > Earnings section.'
    },
    {
      id: '16',
      category: 'rider',
      question: 'How do I become a delivery rider?',
      answer: 'Visit our Rider page and submit an application with your details, vehicle information, and required documents. After verification, you\'ll be onboarded and can start accepting delivery requests.'
    },
    {
      id: '17',
      category: 'rider',
      question: 'How do I get paid?',
      answer: 'Earnings are calculated per delivery and automatically transferred to your registered bank account weekly. You can track your earnings in real-time from the Rider Dashboard.'
    },
    {
      id: '18',
      category: 'rider',
      question: 'What are the requirements to be a rider?',
      answer: 'You need a valid driver\'s license, vehicle registration, CNIC, and a smartphone. You must be 18+ years old and have a clean driving record. Vehicle insurance is recommended.'
    },
  ];

  const filteredFAQs = faqs.filter(faq => {
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Your message has been sent! We\'ll get back to you within 24 hours.');
    setContactForm({ name: '', email: '', subject: '', message: '' });
  };

  const toggleFAQ = (id: string) => {
    setOpenFAQ(openFAQ === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50">
      <Toaster />
      <Header 
        onSearch={() => {}}
        onCategoryChange={() => {}}
        selectedCategory=""
        onCartClick={() => {}}
        cartItemCount={0}
      />

      <div className="pt-20 md:pt-24">
      <div className="container mx-auto px-4 py-12">
        {/* Back Button */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-700 hover:text-gray-900 hover:bg-gradient-to-r hover:from-orange-50 hover:to-pink-50 rounded-xl px-5 py-3 transition-all border-2 border-transparent hover:border-orange-200 font-semibold group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span>Back</span>
          </Button>
        </div>

        {/* Hero Section */}
        <div className="text-center mb-16 relative">
          {/* Animated Background Blobs */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-0 left-1/4 w-72 h-72 bg-orange-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
            <div className="absolute top-0 right-1/4 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
            <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
          </div>
          
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 text-white px-6 py-3 rounded-full text-sm mb-8 shadow-lg hover:shadow-xl transition-shadow">
              <HelpCircle className="w-5 h-5" />
              <span className="font-semibold">Help Center</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              How can we{' '}
              <span className="bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 bg-clip-text text-transparent">
                help you?
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto mb-10 leading-relaxed">
              Find answers to common questions or contact our support team. We're here 24/7 to assist you.
            </p>

            {/* Enhanced Search Bar */}
            <div className="max-w-3xl mx-auto relative">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-pink-500 rounded-2xl blur opacity-20"></div>
              <div className="relative bg-white rounded-2xl border-2 border-gray-200 shadow-xl hover:shadow-2xl transition-all duration-300">
                <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search for help... (e.g., 'cancel order', 'delivery time', 'payment')"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-16 pr-6 py-7 text-lg border-0 focus:ring-0 focus-visible:ring-0 rounded-2xl"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        {/* <div className="grid md:grid-cols-2 gap-8 mb-16 max-w-4xl mx-auto">
          <Card className="p-10 border-2 hover:shadow-2xl transition-all duration-300 cursor-pointer group relative overflow-hidden bg-gradient-to-br from-white via-green-50/50 to-emerald-50/30">
            <div className="absolute top-0 right-0 w-40 h-40 bg-green-200/30 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-emerald-200/20 rounded-full blur-2xl opacity-50"></div>
            <div className="relative z-10">
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 via-emerald-500 to-teal-600 rounded-3xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-xl relative">
                <div className="absolute inset-0 bg-white/20 rounded-3xl blur-xl"></div>
                <Phone className="w-10 h-10 text-white relative z-10" />
              </div>
              <h3 className="text-3xl font-bold mb-4 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">Phone Support</h3>
              <p className="text-gray-700 mb-8 leading-relaxed text-lg">Call us directly for immediate assistance. Our team is available 24/7 to help you with any urgent issues.</p>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-green-700 font-semibold">
                  <Phone className="w-5 h-5" />
                  <span className="text-xl">+92 300 1234567</span>
                </div>
                <Button className="w-full bg-gradient-to-r from-green-500 via-emerald-500 to-teal-600 hover:from-green-600 hover:via-emerald-600 hover:to-teal-700 text-white shadow-xl hover:shadow-2xl transition-all py-6 text-lg font-semibold rounded-xl">
                  <Phone className="w-5 h-5 mr-2" />
                  Call Now
                </Button>
              </div>
            </div>
          </Card>

          <Card className="p-10 border-2 hover:shadow-2xl transition-all duration-300 cursor-pointer group relative overflow-hidden bg-gradient-to-br from-white via-purple-50/50 to-pink-50/30">
            <div className="absolute top-0 right-0 w-40 h-40 bg-purple-200/30 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-pink-200/20 rounded-full blur-2xl opacity-50"></div>
            <div className="relative z-10">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 via-pink-500 to-rose-600 rounded-3xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-xl relative">
                <div className="absolute inset-0 bg-white/20 rounded-3xl blur-xl"></div>
                <Mail className="w-10 h-10 text-white relative z-10" />
              </div>
              <h3 className="text-3xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Email Support</h3>
              <p className="text-gray-700 mb-8 leading-relaxed text-lg">Send us a detailed message and we'll get back to you within 24 hours with a comprehensive solution.</p>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-purple-700 font-semibold">
                  <Mail className="w-5 h-5" />
                  <span className="text-lg">support@lazeezos.com</span>
                </div>
                <Button className="w-full bg-gradient-to-r from-purple-500 via-pink-500 to-rose-600 hover:from-purple-600 hover:via-pink-600 hover:to-rose-700 text-white shadow-xl hover:shadow-2xl transition-all py-6 text-lg font-semibold rounded-xl">
                  <Mail className="w-5 h-5 mr-2" />
                  Send Email
                </Button>
              </div>
            </div>
          </Card>
        </div> */}

        {/* Categories */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-3 bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 bg-clip-text text-transparent">
                Browse by Category
              </h2>
              <p className="text-gray-600 text-lg">Find help organized by topic</p>
            </div>
            <Badge className="bg-gradient-to-r from-orange-500 to-pink-500 text-white px-5 py-2 text-base font-semibold shadow-lg">
              {categories.length} categories
            </Badge>
          </div>
          <div className="flex flex-wrap gap-4 justify-center">
            {categories.map((category) => {
              const Icon = category.icon;
              const isActive = selectedCategory === category.id;
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`group flex items-center gap-3 px-8 py-5 rounded-2xl font-bold transition-all duration-300 relative overflow-hidden ${
                    isActive
                      ? 'bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 text-white shadow-2xl scale-110'
                      : 'bg-white text-gray-700 hover:bg-gradient-to-r hover:from-orange-50 hover:via-pink-50 hover:to-purple-50 border-2 border-gray-200 hover:border-orange-300 hover:shadow-xl'
                  }`}
                >
                  {isActive && (
                    <>
                      <div className="absolute inset-0 bg-white/20 backdrop-blur-sm"></div>
                      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/10 to-transparent"></div>
                    </>
                  )}
                  <div className={`relative z-10 transition-transform ${isActive ? 'text-white scale-110' : 'text-gray-600 group-hover:text-orange-500 group-hover:scale-110'}`}>
                    <Icon className="w-7 h-7" />
                  </div>
                  <span className="relative z-10 text-base">{category.name}</span>
                  {isActive && (
                    <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-white/40 rounded-b-2xl"></div>
                  )}
                  {!isActive && (
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="absolute top-0 right-0 w-20 h-20 bg-orange-200/30 rounded-full blur-2xl"></div>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* FAQs */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-3 bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 bg-clip-text text-transparent">
                Frequently Asked Questions
              </h2>
              <p className="text-gray-600 text-lg">Get instant answers to common questions</p>
            </div>
            <Badge className="bg-gradient-to-r from-orange-500 to-pink-500 text-white px-5 py-2 text-base font-semibold shadow-lg">
              {filteredFAQs.length} questions
            </Badge>
          </div>
          <div className="space-y-5 max-w-4xl mx-auto">
            {filteredFAQs.map((faq, index) => {
              const isOpen = openFAQ === faq.id;
              return (
                <Card 
                  key={faq.id} 
                  className={`border-2 hover:shadow-2xl transition-all duration-300 overflow-hidden group relative ${
                    isOpen 
                      ? 'bg-gradient-to-br from-white via-orange-50/40 to-pink-50/30 border-orange-300 shadow-xl scale-[1.02]' 
                      : 'bg-white hover:border-orange-300 hover:scale-[1.01]'
                  }`}
                >
                  {isOpen && (
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500"></div>
                  )}
                  <button
                    onClick={() => toggleFAQ(faq.id)}
                    className="w-full p-7 md:p-9 flex items-center justify-between text-left group-hover:bg-gradient-to-r group-hover:from-orange-50/60 group-hover:via-pink-50/60 group-hover:to-purple-50/40 transition-all relative"
                  >
                    <div className="flex-1 pr-6">
                      <div className="flex items-center gap-3 mb-4">
                        <Badge 
                          variant="outline" 
                          className={`text-xs font-bold px-3 py-1 ${
                            isOpen 
                              ? 'bg-gradient-to-r from-orange-500 to-pink-500 text-white border-0 shadow-lg' 
                              : 'bg-gray-100 text-gray-700 border-gray-300'
                          }`}
                        >
                          {faq.category}
                        </Badge>
                        {isOpen && (
                          <div className="flex items-center gap-2 text-orange-600 font-semibold">
                            <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                            <span className="text-xs">Expanded</span>
                          </div>
                        )}
                      </div>
                      <h3 className={`text-xl md:text-2xl font-bold transition-colors leading-tight ${
                        isOpen 
                          ? 'text-gray-900' 
                          : 'text-gray-800 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-orange-600 group-hover:to-pink-600'
                      }`}>
                        {faq.question}
                      </h3>
                    </div>
                    <div className={`ml-4 flex-shrink-0 transition-all duration-300 ${
                      isOpen ? 'rotate-180 scale-110' : 'group-hover:scale-110'
                    }`}>
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all shadow-lg ${
                        isOpen 
                          ? 'bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 text-white' 
                          : 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-600 group-hover:from-orange-100 group-hover:to-pink-100 group-hover:text-orange-600'
                      }`}>
                        <ChevronDown className="w-6 h-6" />
                      </div>
                    </div>
                  </button>
                  {isOpen && (
                    <div className="px-7 md:px-9 pb-7 md:pb-9 pt-0 animate-in slide-in-from-top-2 duration-300">
                      <div className="pt-6 border-t-2 border-gradient-to-r from-orange-200 to-pink-200">
                        <div className="flex items-start gap-4">
                          <div className="w-8 h-8 rounded-xl bg-gradient-to-r from-orange-100 to-pink-100 flex items-center justify-center flex-shrink-0 mt-1">
                            <Info className="w-5 h-5 text-orange-600" />
                          </div>
                          <p className="text-gray-700 leading-relaxed text-lg flex-1">{faq.answer}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
          {filteredFAQs.length === 0 && (
            <Card className="p-12 text-center border-2">
              <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 font-semibold">No FAQs found</p>
              <p className="text-sm text-gray-500">Try adjusting your search or category filter</p>
            </Card>
          )}
        </div>

        {/* Contact Form */}
        <Card className="p-10 md:p-14 border-0 bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-orange-200/30 to-pink-200/30 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-purple-200/20 to-pink-200/20 rounded-full blur-3xl"></div>
          <div className="max-w-4xl mx-auto relative z-10">
            <div className="text-center mb-12">
              <div className="relative inline-block mb-8">
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 rounded-3xl blur-2xl opacity-50 animate-pulse-slow"></div>
                <div className="relative w-24 h-24 bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 rounded-3xl flex items-center justify-center shadow-2xl">
                  <Headphones className="w-12 h-12 text-white" />
                </div>
              </div>
              <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 bg-clip-text text-transparent">
                Still need help?
              </h2>
              <p className="text-xl text-gray-700 max-w-2xl mx-auto leading-relaxed font-medium">
                Send us a message and we'll get back to you as soon as possible. Our support team is available 24/7 to assist you.
              </p>
            </div>
            <form onSubmit={handleContactSubmit} className="space-y-7 bg-white/90 backdrop-blur-md p-10 rounded-3xl border-2 border-white/50 shadow-2xl">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold mb-3 text-gray-700">Your Name</label>
                  <Input
                    required
                    value={contactForm.name}
                    onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                    placeholder="Enter your name"
                    className="border-2 h-12 focus:border-orange-500 focus:ring-orange-500 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-3 text-gray-700">Email Address</label>
                  <Input
                    type="email"
                    required
                    value={contactForm.email}
                    onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                    placeholder="your@email.com"
                    className="border-2 h-12 focus:border-orange-500 focus:ring-orange-500 rounded-xl"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold mb-3 text-gray-700">Subject</label>
                <Input
                  required
                  value={contactForm.subject}
                  onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                  placeholder="What is this regarding?"
                  className="border-2 h-12 focus:border-orange-500 focus:ring-orange-500 rounded-xl"
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-3 text-gray-700">Message</label>
                <Textarea
                  required
                  value={contactForm.message}
                  onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                  placeholder="Tell us how we can help..."
                  rows={6}
                  className="border-2 focus:border-orange-500 focus:ring-orange-500 rounded-xl resize-none"
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 hover:from-orange-600 hover:via-pink-600 hover:to-purple-600 text-white py-8 text-xl font-bold shadow-2xl hover:shadow-3xl transition-all rounded-2xl relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                <Send className="w-6 h-6 mr-3 relative z-10" />
                <span className="relative z-10">Send Message</span>
              </Button>
            </form>
          </div>
        </Card>

        {/* Additional Resources */}
        <div className="mt-20 grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <Card className="p-10 border-2 hover:shadow-2xl transition-all duration-300 group relative overflow-hidden bg-gradient-to-br from-white via-blue-50/50 to-cyan-50/30 hover:scale-105">
            <div className="absolute top-0 right-0 w-40 h-40 bg-blue-200/30 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-cyan-200/20 rounded-full blur-2xl opacity-50"></div>
            <div className="relative z-10">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 via-cyan-500 to-teal-600 rounded-3xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-xl relative">
                <div className="absolute inset-0 bg-white/20 rounded-3xl blur-xl"></div>
                <FileText className="w-10 h-10 text-white relative z-10" />
              </div>
              <h3 className="text-3xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">Documentation</h3>
              <p className="text-gray-700 mb-8 leading-relaxed text-lg">Browse our comprehensive guides and step-by-step tutorials</p>
              <Button variant="outline" className="w-full border-2 hover:bg-blue-50 hover:border-blue-400 group-hover:shadow-xl transition-all py-6 text-lg font-semibold rounded-xl">
                View Docs
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform" />
              </Button>
            </div>
          </Card>

          <Card className="p-10 border-2 hover:shadow-2xl transition-all duration-300 group relative overflow-hidden bg-gradient-to-br from-white via-purple-50/50 to-pink-50/30 hover:scale-105">
            <div className="absolute top-0 right-0 w-40 h-40 bg-purple-200/30 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-pink-200/20 rounded-full blur-2xl opacity-50"></div>
            <div className="relative z-10">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 via-pink-500 to-rose-600 rounded-3xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-xl relative">
                <div className="absolute inset-0 bg-white/20 rounded-3xl blur-xl"></div>
                <Video className="w-10 h-10 text-white relative z-10" />
              </div>
              <h3 className="text-3xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Video Tutorials</h3>
              <p className="text-gray-700 mb-8 leading-relaxed text-lg">Watch step-by-step video guides and learn visually</p>
              <Button variant="outline" className="w-full border-2 hover:bg-purple-50 hover:border-purple-400 group-hover:shadow-xl transition-all py-6 text-lg font-semibold rounded-xl">
                Watch Videos
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform" />
              </Button>
            </div>
          </Card>

          <Card className="p-10 border-2 hover:shadow-2xl transition-all duration-300 group relative overflow-hidden bg-gradient-to-br from-white via-green-50/50 to-emerald-50/30 hover:scale-105">
            <div className="absolute top-0 right-0 w-40 h-40 bg-green-200/30 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-emerald-200/20 rounded-full blur-2xl opacity-50"></div>
            <div className="relative z-10">
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 via-emerald-500 to-teal-600 rounded-3xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-xl relative">
                <div className="absolute inset-0 bg-white/20 rounded-3xl blur-xl"></div>
                <Shield className="w-10 h-10 text-white relative z-10" />
              </div>
              <h3 className="text-3xl font-bold mb-4 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">Safety & Security</h3>
              <p className="text-gray-700 mb-8 leading-relaxed text-lg">Learn about our security measures and privacy policies</p>
              <Button variant="outline" className="w-full border-2 hover:bg-green-50 hover:border-green-400 group-hover:shadow-xl transition-all py-6 text-lg font-semibold rounded-xl">
                Learn More
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform" />
              </Button>
            </div>
          </Card>
        </div>

        {/* Support Hours */}
        <Card className="mt-16 p-10 border-0 bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 text-white shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
          <div className="relative z-10">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-3xl flex items-center justify-center shadow-xl border border-white/30">
                  <Clock className="w-10 h-10" />
                </div>
                <div>
                  <h3 className="text-3xl font-bold mb-2">Support Hours</h3>
                  <p className="text-white/90 text-lg">We're here to help 24/7</p>
                </div>
              </div>
              <div className="text-center md:text-right bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20">
                <p className="text-xl font-bold mb-3 flex items-center justify-center md:justify-end gap-2">
                  <CheckCircle className="w-5 h-5" />
                  Available 24/7
                </p>
                <div className="space-y-2">
                  <p className="text-white/90 flex items-center justify-center md:justify-end gap-2">
                    <Mail className="w-4 h-4" />
                    support@lazeezos.com
                  </p>
                  <p className="text-white/90 flex items-center justify-center md:justify-end gap-2">
                    <Phone className="w-4 h-4" />
                    +92 300 1234567
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
      </div>
    </div>
  );
}


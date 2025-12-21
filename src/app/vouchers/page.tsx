'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '../../components/Header';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import { 
  Ticket,
  ArrowLeft,
  Copy,
  CheckCircle,
  XCircle,
  Clock,
  Percent,
  DollarSign,
  Gift,
  Sparkles,
  ArrowRight,
  Calendar,
  Tag
} from 'lucide-react';
import { toast } from 'sonner';
import { Toaster } from '../../components/ui/sonner';

interface Voucher {
  id: string;
  code: string;
  title: string;
  description: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrderAmount?: number;
  maxDiscount?: number;
  validFrom: string;
  validUntil: string;
  status: 'active' | 'expired' | 'used';
  restaurantName?: string;
  image?: string;
}

const mockVouchers: Voucher[] = [
  {
    id: '1',
    code: 'WELCOME20',
    title: 'Welcome Offer',
    description: 'Get 20% off on your first order',
    discountType: 'percentage',
    discountValue: 20,
    minOrderAmount: 500,
    maxDiscount: 200,
    validFrom: '2024-01-01',
    validUntil: '2024-12-31',
    status: 'active',
  },
  {
    id: '2',
    code: 'SAVE50',
    title: 'Flat Discount',
    description: 'Save PKR 50 on orders above PKR 1000',
    discountType: 'fixed',
    discountValue: 50,
    minOrderAmount: 1000,
    validFrom: '2024-01-15',
    validUntil: '2024-02-15',
    status: 'active',
  },
  {
    id: '3',
    code: 'BURGER30',
    title: 'Burger Special',
    description: '30% off at Burger Palace',
    discountType: 'percentage',
    discountValue: 30,
    minOrderAmount: 800,
    maxDiscount: 300,
    validFrom: '2024-01-10',
    validUntil: '2024-01-31',
    status: 'active',
    restaurantName: 'Burger Palace',
    image: 'https://images.unsplash.com/photo-1656439659132-24c68e36b553?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
  },
  {
    id: '4',
    code: 'PIZZA25',
    title: 'Pizza Deal',
    description: '25% off at Pizza Italia',
    discountType: 'percentage',
    discountValue: 25,
    minOrderAmount: 1000,
    maxDiscount: 250,
    validFrom: '2024-01-05',
    validUntil: '2024-01-20',
    status: 'expired',
    restaurantName: 'Pizza Italia',
    image: 'https://images.unsplash.com/photo-1749169395459-9eb9835bd718?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
  },
  {
    id: '5',
    code: 'FREEDEL',
    title: 'Free Delivery',
    description: 'Free delivery on orders above PKR 1500',
    discountType: 'fixed',
    discountValue: 0,
    minOrderAmount: 1500,
    validFrom: '2024-01-01',
    validUntil: '2024-12-31',
    status: 'used',
  },
];

export default function VouchersPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'available' | 'used' | 'expired'>('available');
  const [voucherCode, setVoucherCode] = useState('');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const getStatusBadge = (status: Voucher['status']) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Active</Badge>;
      case 'used':
        return <Badge className="bg-gray-100 text-gray-800"><XCircle className="w-3 h-3 mr-1" />Used</Badge>;
      case 'expired':
        return <Badge className="bg-red-100 text-red-800"><Clock className="w-3 h-3 mr-1" />Expired</Badge>;
    }
  };

  const getFilteredVouchers = () => {
    switch (activeTab) {
      case 'available':
        return mockVouchers.filter(v => v.status === 'active');
      case 'used':
        return mockVouchers.filter(v => v.status === 'used');
      case 'expired':
        return mockVouchers.filter(v => v.status === 'expired');
      default:
        return [];
    }
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    toast.success(`Code "${code}" copied to clipboard!`);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleRedeemCode = () => {
    if (!voucherCode.trim()) {
      toast.error('Please enter a voucher code');
      return;
    }
    // In a real app, this would validate the code with the backend
    toast.success(`Voucher code "${voucherCode}" applied successfully!`);
    setVoucherCode('');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const filteredVouchers = getFilteredVouchers();

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
          <h1 className="text-3xl md:text-4xl font-bold mb-2">My Vouchers</h1>
          <p className="text-gray-600">Redeem vouchers and save on your orders</p>
        </div>

        {/* Redeem Code Section */}
        <Card className="p-6 mb-8 bg-gradient-to-r from-orange-50 to-pink-50 border-2 border-orange-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-pink-500 rounded-lg flex items-center justify-center">
              <Tag className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-bold">Redeem Voucher Code</h2>
          </div>
          <div className="flex flex-col md:flex-row gap-4">
            <Input
              placeholder="Enter voucher code"
              value={voucherCode}
              onChange={(e) => setVoucherCode(e.target.value.toUpperCase())}
              className="flex-1"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleRedeemCode();
                }
              }}
            />
            <Button
              onClick={handleRedeemCode}
              className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white"
            >
              <Ticket className="w-4 h-4 mr-2" />
              Redeem
            </Button>
          </div>
        </Card>

        {/* Tabs */}
        <div className="flex gap-4 mb-6 border-b overflow-x-auto">
          <button
            onClick={() => setActiveTab('available')}
            className={`pb-4 px-2 font-semibold transition-colors relative whitespace-nowrap ${
              activeTab === 'available'
                ? 'text-pink-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Available
            {activeTab === 'available' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-orange-500 to-pink-500" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('used')}
            className={`pb-4 px-2 font-semibold transition-colors relative whitespace-nowrap ${
              activeTab === 'used'
                ? 'text-pink-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Used
            {activeTab === 'used' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-orange-500 to-pink-500" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('expired')}
            className={`pb-4 px-2 font-semibold transition-colors relative whitespace-nowrap ${
              activeTab === 'expired'
                ? 'text-pink-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Expired
            {activeTab === 'expired' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-orange-500 to-pink-500" />
            )}
          </button>
        </div>

        {/* Vouchers List */}
        {filteredVouchers.length === 0 ? (
          <Card className="p-12 text-center">
            <Ticket className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold mb-2">
              {activeTab === 'available' && 'No Available Vouchers'}
              {activeTab === 'used' && 'No Used Vouchers'}
              {activeTab === 'expired' && 'No Expired Vouchers'}
            </h3>
            <p className="text-gray-600 mb-4">
              {activeTab === 'available' && "You don't have any available vouchers at the moment."}
              {activeTab === 'used' && "You haven't used any vouchers yet."}
              {activeTab === 'expired' && "You don't have any expired vouchers."}
            </p>
            {activeTab === 'available' && (
              <Button
                onClick={() => router.push('/dashboard')}
                className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white"
              >
                Browse Restaurants
              </Button>
            )}
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVouchers.map((voucher) => (
              <Card
                key={voucher.id}
                className={`p-6 hover:shadow-lg transition-all relative overflow-hidden ${
                  voucher.status === 'active'
                    ? 'border-2 border-pink-200 bg-gradient-to-br from-white to-pink-50'
                    : 'opacity-75'
                }`}
              >
                {/* Background Pattern */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-200/20 to-pink-200/20 rounded-full -mr-16 -mt-16" />
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-pink-200/20 to-orange-200/20 rounded-full -ml-12 -mb-12" />

                <div className="relative z-10">
                  {/* Restaurant Image (if applicable) */}
                  {voucher.image && (
                    <div className="mb-4">
                      <img
                        src={voucher.image}
                        alt={voucher.restaurantName}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                    </div>
                  )}

                  {/* Status Badge */}
                  <div className="flex items-center justify-between mb-4">
                    {getStatusBadge(voucher.status)}
                    {voucher.restaurantName && (
                      <span className="text-xs text-gray-600 font-medium">
                        {voucher.restaurantName}
                      </span>
                    )}
                  </div>

                  {/* Discount Display */}
                  <div className="mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      {voucher.discountType === 'percentage' ? (
                        <Percent className="w-6 h-6 text-pink-600" />
                      ) : (
                        <DollarSign className="w-6 h-6 text-pink-600" />
                      )}
                      <span className="text-3xl font-bold bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
                        {voucher.discountType === 'percentage' 
                          ? `${voucher.discountValue}%`
                          : voucher.discountValue === 0
                          ? 'FREE'
                          : `PKR ${voucher.discountValue}`
                        }
                      </span>
                    </div>
                    <h3 className="text-lg font-bold mb-1">{voucher.title}</h3>
                    <p className="text-sm text-gray-600">{voucher.description}</p>
                  </div>

                  {/* Terms */}
                  <div className="space-y-2 mb-4 text-xs text-gray-500">
                    {voucher.minOrderAmount && (
                      <div className="flex items-center gap-2">
                        <Gift className="w-3 h-3" />
                        <span>Min. order: PKR {voucher.minOrderAmount}</span>
                      </div>
                    )}
                    {voucher.maxDiscount && (
                      <div className="flex items-center gap-2">
                        <Tag className="w-3 h-3" />
                        <span>Max. discount: PKR {voucher.maxDiscount}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3 h-3" />
                      <span>Valid until: {formatDate(voucher.validUntil)}</span>
                    </div>
                  </div>

                  {/* Voucher Code */}
                  <div className="pt-4 border-t">
                    <div className="flex items-center justify-between p-3 bg-gray-100 rounded-lg">
                      <code className="text-sm font-mono font-bold text-gray-900">
                        {voucher.code}
                      </code>
                      {voucher.status === 'active' && (
                        <button
                          onClick={() => handleCopyCode(voucher.code)}
                          className="p-1.5 hover:bg-gray-200 rounded transition-colors"
                          title="Copy code"
                        >
                          {copiedCode === voucher.code ? (
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          ) : (
                            <Copy className="w-4 h-4 text-gray-600" />
                          )}
                        </button>
                      )}
                    </div>
                    {voucher.status === 'active' && (
                      <Button
                        className="w-full mt-3 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white"
                        onClick={() => {
                          handleCopyCode(voucher.code);
                          router.push('/dashboard');
                        }}
                      >
                        Use Now
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
      </div>

      <Toaster />
    </div>
  );
}



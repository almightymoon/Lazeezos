'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Header } from '../../components/Header';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { RadioGroup, RadioGroupItem } from '../../components/ui/radio-group';
import { Separator } from '../../components/ui/separator';
import { 
  MapPin, 
  Phone, 
  CreditCard, 
  Wallet, 
  Banknote,
  ArrowLeft,
  CheckCircle,
  Plus,
  Edit,
  Trash2,
  Clock,
  AlertCircle
} from 'lucide-react';
import { toast } from 'sonner';
import { Toaster } from '../../components/ui/sonner';
import { CartItem } from '../../components/Cart';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';

interface Address {
  id: string;
  label: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  isDefault: boolean;
}

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

const mockAddresses: Address[] = [
  {
    id: '1',
    label: 'Home',
    street: '123 Main Street, Apt 4B',
    city: 'Karachi',
    state: 'Sindh',
    zipCode: '75500',
    phone: '+92 300 1234567',
    isDefault: true,
  },
  {
    id: '2',
    label: 'Work',
    street: '456 Business Plaza, Floor 10',
    city: 'Karachi',
    state: 'Sindh',
    zipCode: '75501',
    phone: '+92 300 1234567',
    isDefault: false,
  },
];

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
  {
    id: '2',
    type: 'wallet',
    walletName: 'JazzCash',
    phoneNumber: '+92 300 1234567',
    isDefault: false,
  },
];

export default function CheckoutPage() {
  const router = useRouter();
  const [addresses, setAddresses] = useState<Address[]>(mockAddresses);
  const [selectedAddress, setSelectedAddress] = useState<string>(addresses.find(a => a.isDefault)?.id || '1');
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>(mockPaymentMethods);
  const [paymentMethodType, setPaymentMethodType] = useState<'cash' | 'card' | 'wallet'>('cash');
  const [selectedPaymentMethodId, setSelectedPaymentMethodId] = useState<string>('');
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [isAddressDialogOpen, setIsAddressDialogOpen] = useState(false);
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [editingPayment, setEditingPayment] = useState<PaymentMethod | null>(null);
  const [addressForm, setAddressForm] = useState<Omit<Address, 'id'>>({
    label: 'Home',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    phone: '',
    isDefault: false,
  });
  const [paymentForm, setPaymentForm] = useState<{ type: 'card' | 'wallet'; cardNumber?: string; expiryMonth?: string; expiryYear?: string; cvv?: string; walletName?: string; phoneNumber?: string; isDefault: boolean }>({
    type: 'card',
    isDefault: false,
  });
  const [cartItems] = useState<CartItem[]>([
    {
      id: '1',
      name: 'Classic Beef Burger',
      description: 'Juicy beef patty with fresh vegetables',
      price: 12.99,
      quantity: 2,
      image: 'https://images.unsplash.com/photo-1656439659132-24c68e36b553?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
      category: 'Burgers',
    },
    {
      id: '2',
      name: 'French Fries',
      description: 'Crispy golden fries',
      price: 4.99,
      quantity: 1,
      image: 'https://images.unsplash.com/photo-1656439659132-24c68e36b553?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
      category: 'Sides',
    },
  ]);

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = 2.99;
  const serviceFee = 1.50;
  const tax = subtotal * 0.05; // 5% tax
  const total = subtotal + deliveryFee + serviceFee + tax;

  const selectedAddressData = addresses.find(a => a.id === selectedAddress);

  const handlePlaceOrder = () => {
    // Validation
    if (!selectedAddress) {
      toast.error('Please select a delivery address');
      return;
    }

    if (paymentMethodType !== 'cash' && !selectedPaymentMethodId) {
      toast.error('Please select a payment method');
      return;
    }

    // Check if cart is empty
    if (cartItems.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    // Place order
    toast.success('Order placed successfully!');
    router.push('/orders');
  };

  const handleAddAddress = () => {
    setEditingAddress(null);
    setAddressForm({
      label: 'Home',
      street: '',
      city: '',
      state: '',
      zipCode: '',
      phone: '',
      isDefault: false,
    });
    setIsAddressDialogOpen(true);
  };

  const handleEditAddress = (address: Address) => {
    setEditingAddress(address);
    setAddressForm({
      label: address.label,
      street: address.street,
      city: address.city,
      state: address.state,
      zipCode: address.zipCode,
      phone: address.phone,
      isDefault: address.isDefault,
    });
    setIsAddressDialogOpen(true);
  };

  const handleDeleteAddress = (id: string) => {
    const addressToDelete = addresses.find(a => a.id === id);
    if (addressToDelete?.isDefault) {
      toast.error('Cannot delete default address');
      return;
    }
    const updatedAddresses = addresses.filter(a => a.id !== id);
    setAddresses(updatedAddresses);
    if (selectedAddress === id) {
      setSelectedAddress(updatedAddresses.find(a => a.isDefault)?.id || updatedAddresses[0]?.id || '');
    }
    toast.success('Address deleted successfully');
  };

  const handleSaveAddress = () => {
    if (!addressForm.street || !addressForm.city || !addressForm.state || !addressForm.zipCode || !addressForm.phone) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (addressForm.isDefault) {
      // Remove default from all addresses
      setAddresses(prev => prev.map(a => ({ ...a, isDefault: false })));
    }

    if (editingAddress) {
      // Update existing address
      setAddresses(prev => prev.map(a => 
        a.id === editingAddress.id 
          ? { ...addressForm, id: editingAddress.id }
          : addressForm.isDefault ? { ...a, isDefault: false } : a
      ));
      toast.success('Address updated successfully');
    } else {
      // Add new address
      const newAddress: Address = {
        ...addressForm,
        id: Date.now().toString(),
      };
      setAddresses(prev => [...prev, newAddress]);
      setSelectedAddress(newAddress.id);
      toast.success('Address added successfully');
    }

    setIsAddressDialogOpen(false);
  };

  const handleAddPayment = (type: 'card' | 'wallet' = 'card') => {
    setEditingPayment(null);
    setPaymentForm({ type, isDefault: false });
    setIsPaymentDialogOpen(true);
  };

  const handleEditPayment = (payment: PaymentMethod) => {
    setEditingPayment(payment);
    setPaymentForm({
      type: payment.type,
      isDefault: payment.isDefault,
    });
    setIsPaymentDialogOpen(true);
  };

  const handleSavePayment = () => {
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
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster />
      <Header 
        cartItemCount={0}
        onCartClick={() => {}}
        onSearch={() => {}}
        selectedCategory="delivery"
        onCategoryChange={() => {}}
      />

      <div className="pt-20 md:pt-24">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Back Button */}
        <Link href="/">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Restaurants
          </Button>
        </Link>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Checkout Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Delivery Address */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <MapPin className="w-6 h-6 text-orange-500" />
                  Delivery Address
                </h2>
                <Button variant="outline" size="sm" onClick={handleAddAddress}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add New
                </Button>
              </div>

              <RadioGroup value={selectedAddress} onValueChange={setSelectedAddress}>
                <div className="space-y-4">
                  {addresses.map((address) => (
                    <label
                      key={address.id}
                      className={`flex items-start gap-4 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        selectedAddress === address.id
                          ? 'border-orange-500 bg-orange-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <RadioGroupItem value={address.id} className="mt-1" />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-lg">{address.label}</span>
                            {address.isDefault && (
                              <span className="px-2 py-0.5 bg-orange-100 text-orange-600 text-xs font-semibold rounded">
                                Default
                              </span>
                            )}
                          </div>
                          <div className="flex gap-2">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8"
                              onClick={(e) => {
                                e.preventDefault();
                                handleEditAddress(address);
                              }}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            {!address.isDefault && (
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-8 w-8 text-red-600 hover:text-red-700"
                                onClick={(e) => {
                                  e.preventDefault();
                                  handleDeleteAddress(address.id);
                                }}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                        </div>
                        <p className="text-gray-700">{address.street}</p>
                        <p className="text-gray-600 text-sm">
                          {address.city}, {address.state} {address.zipCode}
                        </p>
                        <div className="flex items-center gap-2 mt-2 text-sm text-gray-600">
                          <Phone className="w-4 h-4" />
                          <span>{address.phone}</span>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </RadioGroup>
            </Card>

            {/* Payment Method */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <CreditCard className="w-6 h-6 text-orange-500" />
                  Payment Method
                </h2>
              </div>

              <RadioGroup value={paymentMethodType} onValueChange={(value) => {
                setPaymentMethodType(value as 'cash' | 'card' | 'wallet');
                setSelectedPaymentMethodId('');
              }}>
                <div className="space-y-4">
                  {/* Cash on Delivery */}
                  <label
                    className={`flex items-center gap-4 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      paymentMethodType === 'cash'
                        ? 'border-orange-500 bg-orange-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <RadioGroupItem value="cash" />
                    <Banknote className="w-6 h-6 text-gray-600" />
                    <div className="flex-1">
                      <div className="font-semibold">Cash on Delivery</div>
                      <div className="text-sm text-gray-600">Pay when you receive your order</div>
                    </div>
                  </label>

                  {/* Credit/Debit Cards */}
                  <div>
                    <label
                      className={`flex items-center gap-4 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        paymentMethodType === 'card'
                          ? 'border-orange-500 bg-orange-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setPaymentMethodType('card')}
                    >
                      <RadioGroupItem value="card" />
                      <CreditCard className="w-6 h-6 text-gray-600" />
                      <div className="flex-1">
                        <div className="font-semibold">Credit/Debit Card</div>
                        <div className="text-sm text-gray-600">Visa, Mastercard, or other cards</div>
                      </div>
                    </label>
                    
                    {paymentMethodType === 'card' && (
                      <div className="mt-3 ml-10 space-y-3">
                        {paymentMethods.filter(pm => pm.type === 'card').map((method) => (
                          <label
                            key={method.id}
                            className={`flex items-center gap-3 p-3 border-2 rounded-lg cursor-pointer transition-all ${
                              selectedPaymentMethodId === method.id
                                ? 'border-orange-500 bg-orange-50'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <input
                              type="radio"
                              name="card-method"
                              checked={selectedPaymentMethodId === method.id}
                              onChange={() => setSelectedPaymentMethodId(method.id)}
                              className="w-4 h-4 text-orange-500 border-gray-300 focus:ring-orange-500"
                            />
                            <CreditCard className="w-5 h-5 text-gray-400" />
                            <div className="flex-1">
                              <div className="font-semibold">•••• •••• •••• {method.last4}</div>
                              <div className="text-sm text-gray-600">
                                {method.brand} • Expires {String(method.expiryMonth).padStart(2, '0')}/{method.expiryYear}
                              </div>
                            </div>
                            {method.isDefault && (
                              <span className="px-2 py-0.5 bg-orange-100 text-orange-600 text-xs font-semibold rounded">
                                Default
                              </span>
                            )}
                          </label>
                        ))}
                        <Button variant="outline" size="sm" onClick={(e) => { e.stopPropagation(); handleAddPayment('card'); }} className="ml-3">
                          <Plus className="w-4 h-4 mr-2" />
                          Add Card
                        </Button>
                      </div>
                    )}
                  </div>

                  {/* Mobile Wallets */}
                  <div>
                    <label
                      className={`flex items-center gap-4 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        paymentMethodType === 'wallet'
                          ? 'border-orange-500 bg-orange-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setPaymentMethodType('wallet')}
                    >
                      <RadioGroupItem value="wallet" />
                      <Wallet className="w-6 h-6 text-gray-600" />
                      <div className="flex-1">
                        <div className="font-semibold">Mobile Wallet</div>
                        <div className="text-sm text-gray-600">JazzCash, EasyPaisa, or other wallets</div>
                      </div>
                    </label>
                    
                    {paymentMethodType === 'wallet' && (
                      <div className="mt-3 ml-10 space-y-3">
                        {paymentMethods.filter(pm => pm.type === 'wallet').map((method) => (
                          <label
                            key={method.id}
                            className={`flex items-center gap-3 p-3 border-2 rounded-lg cursor-pointer transition-all ${
                              selectedPaymentMethodId === method.id
                                ? 'border-orange-500 bg-orange-50'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <input
                              type="radio"
                              name="wallet-method"
                              checked={selectedPaymentMethodId === method.id}
                              onChange={() => setSelectedPaymentMethodId(method.id)}
                              className="w-4 h-4 text-orange-500 border-gray-300 focus:ring-orange-500"
                            />
                            <Wallet className="w-5 h-5 text-gray-400" />
                            <div className="flex-1">
                              <div className="font-semibold">{method.walletName}</div>
                              <div className="text-sm text-gray-600">{method.phoneNumber}</div>
                            </div>
                            {method.isDefault && (
                              <span className="px-2 py-0.5 bg-orange-100 text-orange-600 text-xs font-semibold rounded">
                                Default
                              </span>
                            )}
                          </label>
                        ))}
                        <Button variant="outline" size="sm" onClick={(e) => { e.stopPropagation(); handleAddPayment('wallet'); }} className="ml-3">
                          <Plus className="w-4 h-4 mr-2" />
                          Add Wallet
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </RadioGroup>
            </Card>

            {/* Special Instructions */}
            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-4">Special Instructions</h2>
              <textarea
                value={specialInstructions}
                onChange={(e) => setSpecialInstructions(e.target.value)}
                placeholder="Add delivery instructions (optional)"
                className="w-full p-4 border-2 border-gray-200 rounded-lg resize-none focus:border-orange-500 focus:ring-orange-500"
                rows={4}
              />
            </Card>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-24">
              <h2 className="text-2xl font-bold mb-6">Order Summary</h2>

              {/* Restaurant Info */}
              <div className="mb-6 pb-6 border-b">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-pink-500 rounded-lg"></div>
                  <div>
                    <div className="font-bold">Burger Palace</div>
                    <div className="text-sm text-gray-600 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      25-35 min
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="space-y-4 mb-6">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <div className="font-semibold">{item.name}</div>
                      <div className="text-sm text-gray-600">
                        ${item.price.toFixed(2)} × {item.quantity}
                      </div>
                    </div>
                    <div className="font-semibold">
                      ${(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>

              <Separator className="mb-6" />

              {/* Price Breakdown */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Delivery Fee</span>
                  <span className="font-medium">${deliveryFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Service Fee</span>
                  <span className="font-medium">${serviceFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-medium">${tax.toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-orange-600">${total.toFixed(2)}</span>
                </div>
              </div>

              {/* Delivery Address Summary */}
              {selectedAddressData && (
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-start gap-2 text-sm">
                    <MapPin className="w-4 h-4 text-gray-500 mt-0.5" />
                    <div>
                      <div className="font-semibold mb-1">{selectedAddressData.label}</div>
                      <div className="text-gray-600">{selectedAddressData.street}</div>
                      <div className="text-gray-600">
                        {selectedAddressData.city}, {selectedAddressData.state}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Place Order Button */}
              <Button
                onClick={handlePlaceOrder}
                className="w-full h-14 text-lg bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 hover:from-orange-600 hover:via-pink-600 hover:to-purple-600 text-white shadow-lg"
              >
                <CheckCircle className="w-5 h-5 mr-2" />
                Place Order
              </Button>

              <div className="mt-4 flex items-start gap-2 text-xs text-gray-600">
                <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>
                  By placing this order, you agree to our terms and conditions. You'll receive an order confirmation shortly.
                </span>
              </div>
            </Card>
          </div>
        </div>
      </div>
      </div>

      {/* Address Dialog */}
      <Dialog open={isAddressDialogOpen} onOpenChange={setIsAddressDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingAddress ? 'Edit Address' : 'Add New Address'}</DialogTitle>
            <DialogDescription>
              {editingAddress ? 'Update your delivery address' : 'Add a new delivery address'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="label">Address Label</Label>
              <Select
                value={addressForm.label}
                onValueChange={(value) => setAddressForm({ ...addressForm, label: value })}
              >
                <SelectTrigger id="label" className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Home">Home</SelectItem>
                  <SelectItem value="Work">Work</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="street">Street Address *</Label>
              <Input
                id="street"
                value={addressForm.street}
                onChange={(e) => setAddressForm({ ...addressForm, street: e.target.value })}
                placeholder="123 Main Street, Apt 4B"
                className="mt-2"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="city">City *</Label>
                <Input
                  id="city"
                  value={addressForm.city}
                  onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                  placeholder="Karachi"
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="state">State/Province *</Label>
                <Input
                  id="state"
                  value={addressForm.state}
                  onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                  placeholder="Sindh"
                  className="mt-2"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="zipCode">Zip/Postal Code *</Label>
                <Input
                  id="zipCode"
                  value={addressForm.zipCode}
                  onChange={(e) => setAddressForm({ ...addressForm, zipCode: e.target.value })}
                  placeholder="75500"
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  value={addressForm.phone}
                  onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                  placeholder="+92 300 1234567"
                  className="mt-2"
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isDefault"
                checked={addressForm.isDefault}
                onChange={(e) => setAddressForm({ ...addressForm, isDefault: e.target.checked })}
                className="h-4 w-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
              />
              <Label htmlFor="isDefault" className="cursor-pointer">
                Set as default address
              </Label>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddressDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveAddress} className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600">
              {editingAddress ? 'Update Address' : 'Add Address'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
              onClick={handleSavePayment}
              className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600"
            >
              {editingPayment ? 'Update Payment Method' : 'Add Payment Method'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}


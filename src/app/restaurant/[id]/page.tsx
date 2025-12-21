'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { Header } from '../../../components/Header';
import { RestaurantMenu, MenuItem } from '../../../components/Restaurant';
import { Restaurant } from '../../../components/Restaurant/RestaurantCard';
import { Cart, CartItem } from '../../../components/Cart';
import { Toaster } from '../../../components/ui/sonner';
import { toast } from 'sonner';

// Mock restaurant data - In real app, fetch from API
const restaurants: Restaurant[] = [
  {
    id: '1',
    name: 'Burger Palace',
    image: 'https://images.unsplash.com/photo-1656439659132-24c68e36b553?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    cuisine: ['American', 'Burgers', 'Fast Food'],
    rating: 4.5,
    deliveryTime: '25-35 min',
    priceRange: '$$',
    deliveryFee: 2.99,
    minOrder: 15.00,
    isPromoted: true,
    discount: '20% OFF',
  },
  {
    id: '2',
    name: 'Pizza Italia',
    image: 'https://images.unsplash.com/photo-1749169395459-9eb9835bd718?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    cuisine: ['Italian', 'Pizza', 'Pasta'],
    rating: 4.7,
    deliveryTime: '30-40 min',
    priceRange: '$$$',
    deliveryFee: 3.99,
    minOrder: 20.00,
    discount: '15% OFF',
  },
];

const menuItemsByRestaurant: Record<string, MenuItem[]> = {
  '1': [
    {
      id: '1-1',
      name: 'Classic Beef Burger',
      description: 'Juicy beef patty with fresh vegetables',
      price: 12.99,
      image: 'https://images.unsplash.com/photo-1656439659132-24c68e36b553?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
      category: 'Burgers',
      isPopular: true,
    },
    {
      id: '1-2',
      name: 'Chicken Burger',
      description: 'Grilled chicken with special sauce',
      price: 11.99,
      image: 'https://images.unsplash.com/photo-1656439659132-24c68e36b553?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
      category: 'Burgers',
    },
    {
      id: '1-3',
      name: 'French Fries',
      description: 'Crispy golden fries',
      price: 4.99,
      image: 'https://images.unsplash.com/photo-1656439659132-24c68e36b553?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
      category: 'Sides',
    },
  ],
  '2': [
    {
      id: '2-1',
      name: 'Margherita Pizza',
      description: 'Classic Italian pizza with mozzarella and basil',
      price: 18.99,
      image: 'https://images.unsplash.com/photo-1749169395459-9eb9835bd718?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
      category: 'Pizza',
      isPopular: true,
      isVeg: true,
    },
    {
      id: '2-2',
      name: 'Pepperoni Pizza',
      description: 'Spicy pepperoni with mozzarella',
      price: 20.99,
      image: 'https://images.unsplash.com/photo-1749169395459-9eb9835bd718?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
      category: 'Pizza',
    },
  ],
};

export default function RestaurantDetailPage() {
  const router = useRouter();
  const params = useParams();
  const restaurantId = params?.id as string;
  
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    const foundRestaurant = restaurants.find(r => r.id === restaurantId);
    if (foundRestaurant) {
      setRestaurant(foundRestaurant);
    } else {
      toast.error('Restaurant not found');
      router.push('/');
    }
  }, [restaurantId, router]);

  const handleAddToCart = (item: MenuItem) => {
    const existingItem = cartItems.find(cartItem => cartItem.id === item.id);
    if (existingItem) {
      setCartItems(cartItems.map(cartItem =>
        cartItem.id === item.id
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem
      ));
    } else {
      setCartItems([...cartItems, { ...item, quantity: 1 }]);
    }
    toast.success(`${item.name} added to cart`);
  };

  const handleUpdateQuantity = (itemId: string, quantity: number) => {
    if (quantity === 0) {
      handleRemoveItem(itemId);
      return;
    }
    setCartItems(cartItems.map(item =>
      item.id === itemId ? { ...item, quantity } : item
    ));
  };

  const handleRemoveItem = (itemId: string) => {
    setCartItems(cartItems.filter(item => item.id !== itemId));
    toast.info('Item removed from cart');
  };

  const totalCartItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  if (!restaurant) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  const menuItems = menuItemsByRestaurant[restaurant.id] || [];

  return (
    <>
      <Header
        cartItemCount={totalCartItems}
        onCartClick={() => setIsCartOpen(true)}
        onSearch={() => {}}
        selectedCategory="delivery"
        onCategoryChange={() => {}}
      />
      <div className="pt-20 md:pt-24">
      <RestaurantMenu
        restaurant={restaurant}
        menuItems={menuItems}
        onBack={() => router.push('/')}
        onAddToCart={handleAddToCart}
      />
      <Cart
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
      />
      </div>
      <Toaster />
    </>
  );
}


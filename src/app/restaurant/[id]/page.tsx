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

// Restaurant and menu items are now fetched from the API

export default function RestaurantDetailPage() {
  const router = useRouter();
  const params = useParams();
  const restaurantSlug = params?.id as string; // Can be either slug or id
  
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        setLoading(true);
        // Try fetching by slug first, then by id if that fails
        let response = await fetch(`/api/restaurants/${restaurantSlug}`);
        if (!response.ok) {
          // If slug fails, try fetching all restaurants and find by id
          const allRestaurants = await fetch('/api/restaurants');
          if (allRestaurants.ok) {
            const restaurants = await allRestaurants.json();
            const found = restaurants.find((r: Restaurant) => r.id === restaurantSlug);
            if (found) {
              response = await fetch(`/api/restaurants/${found.slug}`);
            }
          }
        }
        
        if (response.ok) {
          const data = await response.json();
          setRestaurant(data.restaurant);
          setMenuItems(data.menu || []);
        } else {
          toast.error('Restaurant not found');
          router.push('/');
        }
      } catch (error) {
        console.error('Error fetching restaurant:', error);
        toast.error('Failed to load restaurant');
        router.push('/');
      } finally {
        setLoading(false);
      }
    };

    if (restaurantSlug) {
      fetchRestaurant();
    }
  }, [restaurantSlug, router]);

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

  if (loading || !restaurant) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mb-4"></div>
          <p className="text-gray-600">Loading restaurant...</p>
        </div>
      </div>
    );
  }

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


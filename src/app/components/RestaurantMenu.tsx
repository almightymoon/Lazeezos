'use client';

import { ArrowLeft, Plus, Star, Clock } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Restaurant } from './RestaurantCard';

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  isVeg?: boolean;
  isPopular?: boolean;
}

interface RestaurantMenuProps {
  restaurant: Restaurant;
  menuItems: MenuItem[];
  onBack: () => void;
  onAddToCart: (item: MenuItem) => void;
}

export function RestaurantMenu({
  restaurant,
  menuItems,
  onBack,
  onAddToCart,
}: RestaurantMenuProps) {
  // Group menu items by category
  const groupedItems = menuItems.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, MenuItem[]>);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Restaurant Header */}
      <div className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-4">
          <Button variant="ghost" onClick={onBack} className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Restaurants
          </Button>
          <div className="flex gap-6">
            <ImageWithFallback
              src={restaurant.image}
              alt={restaurant.name}
              className="w-32 h-32 rounded-lg object-cover"
            />
            <div className="flex-1">
              <h1 className="text-2xl mb-2">{restaurant.name}</h1>
              <p className="text-gray-500 mb-2">{restaurant.cuisine.join(', ')}</p>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span>{restaurant.rating}</span>
                </div>
                <div className="flex items-center gap-1 text-gray-500">
                  <Clock className="w-4 h-4" />
                  <span>{restaurant.deliveryTime}</span>
                </div>
                <span className="text-gray-500">{restaurant.priceRange}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <div className="container mx-auto px-4 py-6">
        {Object.entries(groupedItems).map(([category, items]) => (
          <div key={category} className="mb-8">
            <h2 className="text-xl mb-4">{category}</h2>
            <div className="grid gap-4">
              {items.map((item) => (
                <Card key={item.id} className="overflow-hidden">
                  <div className="flex gap-4 p-4">
                    <ImageWithFallback
                      src={item.image}
                      alt={item.name}
                      className="w-24 h-24 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-1">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold">{item.name}</h3>
                            {item.isVeg && (
                              <Badge variant="outline" className="text-green-600 border-green-600">
                                VEG
                              </Badge>
                            )}
                            {item.isPopular && (
                              <Badge className="bg-orange-500">Popular</Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-500 mt-1">{item.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-lg">${item.price.toFixed(2)}</span>
                        <Button
                          size="sm"
                          className="bg-orange-500 hover:bg-orange-600"
                          onClick={() => onAddToCart(item)}
                        >
                          <Plus className="w-4 h-4 mr-1" />
                          Add
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

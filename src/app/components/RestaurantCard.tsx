'use client';

import { Star, Clock, DollarSign } from 'lucide-react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { ImageWithFallback } from './figma/ImageWithFallback';

export interface Restaurant {
  id: string;
  name: string;
  image: string;
  cuisine: string[];
  rating: number;
  deliveryTime: string;
  priceRange: string;
  deliveryFee: number;
  minOrder?: number;
  isPromoted?: boolean;
  discount?: string;
}

interface RestaurantCardProps {
  restaurant: Restaurant;
  onClick: () => void;
}

export function RestaurantCard({ restaurant, onClick }: RestaurantCardProps) {
  return (
    <Card
      className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
      onClick={onClick}
    >
      <div className="relative">
        <ImageWithFallback
          src={restaurant.image}
          alt={restaurant.name}
          className="w-full h-48 object-cover"
        />
        {restaurant.discount && (
          <Badge className="absolute top-2 left-2 bg-orange-500 hover:bg-orange-600">
            {restaurant.discount}
          </Badge>
        )}
        {restaurant.isPromoted && (
          <Badge className="absolute top-2 right-2 bg-pink-500 hover:bg-pink-600">
            Promoted
          </Badge>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-1">{restaurant.name}</h3>
        <p className="text-sm text-gray-500 mb-3">{restaurant.cuisine.join(', ')}</p>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm">{restaurant.rating}</span>
            </div>
            <div className="flex items-center gap-1 text-gray-500">
              <Clock className="w-4 h-4" />
              <span className="text-sm">{restaurant.deliveryTime}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">
            Delivery: ${restaurant.deliveryFee.toFixed(2)}
          </span>
          {restaurant.minOrder && (
            <span className="text-gray-600">
              Min: ${restaurant.minOrder.toFixed(2)}
            </span>
          )}
        </div>
      </div>
    </Card>
  );
}
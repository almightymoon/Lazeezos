'use client';

import { useState } from 'react';
import { X, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from './ui/button';
import { Checkbox } from './ui/checkbox';
import { Label } from './ui/label';
import { Slider } from './ui/slider';
import { Separator } from './ui/separator';

export interface FilterOptions {
  cuisines: string[];
  priceRange: string[];
  minRating: number;
  deliveryTime: string[];
  dietary: string[];
}

interface FilterSidebarProps {
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  onClearFilters: () => void;
}

const cuisineOptions = [
  'American',
  'Italian',
  'Japanese',
  'Mexican',
  'Chinese',
  'Indian',
  'Thai',
  'Mediterranean',
  'Fast Food',
  'Healthy',
  'Desserts',
  'Bakery',
];

const priceRangeOptions = ['$', '$$', '$$$', '$$$$'];

const deliveryTimeOptions = ['10-20 min', '20-30 min', '30-40 min', '40+ min'];

const dietaryOptions = ['Vegetarian', 'Vegan', 'Gluten-Free', 'Halal'];

function FilterSection({
  title,
  children,
  defaultOpen = true,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="mb-6">
      <button
        className="flex items-center justify-between w-full py-3 px-2 hover:bg-gray-50 rounded-lg transition-colors group"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="font-semibold text-gray-900 group-hover:text-pink-600 transition-colors">{title}</span>
        {isOpen ? (
          <ChevronUp className="w-4 h-4 text-gray-500 group-hover:text-pink-600 transition-colors" />
        ) : (
          <ChevronDown className="w-4 h-4 text-gray-500 group-hover:text-pink-600 transition-colors" />
        )}
      </button>
      {isOpen && <div className="mt-3 space-y-2 px-2">{children}</div>}
      <Separator className="mt-5 bg-gray-200" />
    </div>
  );
}

export function FilterSidebar({ filters, onFiltersChange, onClearFilters }: FilterSidebarProps) {
  const handleCuisineToggle = (cuisine: string) => {
    const newCuisines = filters.cuisines.includes(cuisine)
      ? filters.cuisines.filter((c) => c !== cuisine)
      : [...filters.cuisines, cuisine];
    onFiltersChange({ ...filters, cuisines: newCuisines });
  };

  const handlePriceToggle = (price: string) => {
    const newPrices = filters.priceRange.includes(price)
      ? filters.priceRange.filter((p) => p !== price)
      : [...filters.priceRange, price];
    onFiltersChange({ ...filters, priceRange: newPrices });
  };

  const handleDeliveryTimeToggle = (time: string) => {
    const newTimes = filters.deliveryTime.includes(time)
      ? filters.deliveryTime.filter((t) => t !== time)
      : [...filters.deliveryTime, time];
    onFiltersChange({ ...filters, deliveryTime: newTimes });
  };

  const handleDietaryToggle = (dietary: string) => {
    const newDietary = filters.dietary.includes(dietary)
      ? filters.dietary.filter((d) => d !== dietary)
      : [...filters.dietary, dietary];
    onFiltersChange({ ...filters, dietary: newDietary });
  };

  const hasActiveFilters =
    filters.cuisines.length > 0 ||
    filters.priceRange.length > 0 ||
    filters.deliveryTime.length > 0 ||
    filters.dietary.length > 0 ||
    filters.minRating > 0;

  return (
    <div className="hidden md:block w-64 flex-shrink-0 bg-white border-r border-gray-200 h-full overflow-y-auto sticky top-[73px] p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">Filters</h2>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            className="text-pink-600 hover:text-pink-700 hover:bg-pink-50 font-medium text-sm"
          >
            Clear all
          </Button>
        )}
      </div>

      <FilterSection title="Cuisine Type">
        <div className="space-y-2.5 max-h-64 overflow-y-auto pr-2">
          {cuisineOptions.map((cuisine) => (
            <div key={cuisine} className="flex items-center space-x-3 group">
              <Checkbox
                id={`cuisine-${cuisine}`}
                checked={filters.cuisines.includes(cuisine)}
                onCheckedChange={() => handleCuisineToggle(cuisine)}
                className="border-gray-300 data-[state=checked]:bg-pink-500 data-[state=checked]:border-pink-500"
              />
              <Label
                htmlFor={`cuisine-${cuisine}`}
                className="text-sm cursor-pointer flex-1 text-gray-700 group-hover:text-gray-900 transition-colors font-medium"
              >
                {cuisine}
              </Label>
            </div>
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Price Range">
        <div className="space-y-2.5">
          {priceRangeOptions.map((price) => (
            <div key={price} className="flex items-center space-x-3 group">
              <Checkbox
                id={`price-${price}`}
                checked={filters.priceRange.includes(price)}
                onCheckedChange={() => handlePriceToggle(price)}
                className="border-gray-300 data-[state=checked]:bg-pink-500 data-[state=checked]:border-pink-500"
              />
              <Label htmlFor={`price-${price}`} className="text-sm cursor-pointer flex-1 text-gray-700 group-hover:text-gray-900 transition-colors font-medium text-lg">
                {price}
              </Label>
            </div>
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Rating">
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <span className="text-sm font-semibold text-gray-700">Minimum Rating</span>
            <span className="text-sm font-bold text-pink-600">{filters.minRating.toFixed(1)} ⭐</span>
          </div>
          <Slider
            value={[filters.minRating]}
            onValueChange={(value) =>
              onFiltersChange({ ...filters, minRating: value[0] })
            }
            min={0}
            max={5}
            step={0.5}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-500 px-1 font-medium">
            <span>0</span>
            <span>5</span>
          </div>
        </div>
      </FilterSection>

      <FilterSection title="Delivery Time">
        <div className="space-y-2.5">
          {deliveryTimeOptions.map((time) => (
            <div key={time} className="flex items-center space-x-3 group">
              <Checkbox
                id={`time-${time}`}
                checked={filters.deliveryTime.includes(time)}
                onCheckedChange={() => handleDeliveryTimeToggle(time)}
                className="border-gray-300 data-[state=checked]:bg-pink-500 data-[state=checked]:border-pink-500"
              />
              <Label htmlFor={`time-${time}`} className="text-sm cursor-pointer flex-1 text-gray-700 group-hover:text-gray-900 transition-colors font-medium">
                {time}
              </Label>
            </div>
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Dietary">
        <div className="space-y-2.5">
          {dietaryOptions.map((dietary) => (
            <div key={dietary} className="flex items-center space-x-3 group">
              <Checkbox
                id={`dietary-${dietary}`}
                checked={filters.dietary.includes(dietary)}
                onCheckedChange={() => handleDietaryToggle(dietary)}
                className="border-gray-300 data-[state=checked]:bg-pink-500 data-[state=checked]:border-pink-500"
              />
              <Label
                htmlFor={`dietary-${dietary}`}
                className="text-sm cursor-pointer flex-1 text-gray-700 group-hover:text-gray-900 transition-colors font-medium"
              >
                {dietary}
              </Label>
            </div>
          ))}
        </div>
      </FilterSection>
    </div>
  );
}

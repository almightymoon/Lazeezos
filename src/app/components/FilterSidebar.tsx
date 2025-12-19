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
    <div className="mb-4">
      <button
        className="flex items-center justify-between w-full py-2 hover:text-pink-600 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="font-semibold">{title}</span>
        {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </button>
      {isOpen && <div className="mt-2 space-y-2">{children}</div>}
      <Separator className="mt-4" />
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
    <div className="w-64 bg-white border-r h-full overflow-y-auto sticky top-[73px] p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl">Filters</h2>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            className="text-pink-600 hover:text-pink-700"
          >
            Clear all
          </Button>
        )}
      </div>

      <FilterSection title="Cuisine Type">
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {cuisineOptions.map((cuisine) => (
            <div key={cuisine} className="flex items-center space-x-2">
              <Checkbox
                id={`cuisine-${cuisine}`}
                checked={filters.cuisines.includes(cuisine)}
                onCheckedChange={() => handleCuisineToggle(cuisine)}
              />
              <Label
                htmlFor={`cuisine-${cuisine}`}
                className="text-sm cursor-pointer flex-1"
              >
                {cuisine}
              </Label>
            </div>
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Price Range">
        <div className="space-y-2">
          {priceRangeOptions.map((price) => (
            <div key={price} className="flex items-center space-x-2">
              <Checkbox
                id={`price-${price}`}
                checked={filters.priceRange.includes(price)}
                onCheckedChange={() => handlePriceToggle(price)}
              />
              <Label htmlFor={`price-${price}`} className="text-sm cursor-pointer flex-1">
                {price}
              </Label>
            </div>
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Rating">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm">Minimum Rating: {filters.minRating.toFixed(1)}</span>
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
          <div className="flex justify-between text-xs text-gray-500">
            <span>0</span>
            <span>5</span>
          </div>
        </div>
      </FilterSection>

      <FilterSection title="Delivery Time">
        <div className="space-y-2">
          {deliveryTimeOptions.map((time) => (
            <div key={time} className="flex items-center space-x-2">
              <Checkbox
                id={`time-${time}`}
                checked={filters.deliveryTime.includes(time)}
                onCheckedChange={() => handleDeliveryTimeToggle(time)}
              />
              <Label htmlFor={`time-${time}`} className="text-sm cursor-pointer flex-1">
                {time}
              </Label>
            </div>
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Dietary">
        <div className="space-y-2">
          {dietaryOptions.map((dietary) => (
            <div key={dietary} className="flex items-center space-x-2">
              <Checkbox
                id={`dietary-${dietary}`}
                checked={filters.dietary.includes(dietary)}
                onCheckedChange={() => handleDietaryToggle(dietary)}
              />
              <Label
                htmlFor={`dietary-${dietary}`}
                className="text-sm cursor-pointer flex-1"
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

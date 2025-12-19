import { Bike, ShoppingBag, Store, Package, UtensilsCrossed } from 'lucide-react';
import { Button } from './ui/button';

interface CategoryBarProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

const categories = [
  { id: 'delivery', name: 'Delivery', icon: Bike },
  { id: 'pickup', name: 'Pick-up', icon: ShoppingBag },
  { id: 'pandamart', name: 'pandamart', icon: Store },
  { id: 'shops', name: 'Shops', icon: Package },
  { id: 'caterers', name: 'Caterers', icon: UtensilsCrossed },
];

export function CategoryBar({ selectedCategory, onCategoryChange }: CategoryBarProps) {
  return (
    <div className="bg-white border-b shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex gap-3 overflow-x-auto scrollbar-hide justify-center">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? 'default' : 'outline'}
                onClick={() => onCategoryChange(category.id)}
                className={`flex items-center gap-2 whitespace-nowrap min-w-[120px] justify-center ${
                  selectedCategory === category.id
                    ? 'bg-pink-500 hover:bg-pink-600'
                    : ''
                }`}
              >
                <Icon className="w-5 h-5" />
                {category.name}
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
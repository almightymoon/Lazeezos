import { useState } from 'react';
import { Header } from './components/Header';
import { CategoryBar } from './components/CategoryBar';
import { FilterSidebar, FilterOptions } from './components/FilterSidebar';
import { RestaurantCard, Restaurant } from './components/RestaurantCard';
import { RestaurantMenu, MenuItem } from './components/RestaurantMenu';
import { Cart, CartItem } from './components/Cart';
import { Toaster } from './components/ui/sonner';
import { toast } from 'sonner';

// Mock restaurant data
const restaurants: Restaurant[] = [
  {
    id: '1',
    name: 'Burger Palace',
    image: 'https://images.unsplash.com/photo-1656439659132-24c68e36b553?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXJnZXIlMjBmYXN0JTIwZm9vZHxlbnwxfHx8fDE3NjYxMzEwODZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
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
    image: 'https://images.unsplash.com/photo-1749169395459-9eb9835bd718?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaXp6YSUyMGl0YWxpYW4lMjBmb29kfGVufDF8fHx8MTc2NjA0MzIxNHww&ixlib=rb-4.1.0&q=80&w=1080',
    cuisine: ['Italian', 'Pizza', 'Pasta'],
    rating: 4.7,
    deliveryTime: '30-40 min',
    priceRange: '$$$',
    deliveryFee: 3.99,
    minOrder: 20.00,
    discount: '15% OFF',
  },
  {
    id: '3',
    name: 'Sushi World',
    image: 'https://images.unsplash.com/photo-1697580511707-476438ba9614?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdXNoaSUyMGFzaWFuJTIwZm9vZHxlbnwxfHx8fDE3NjYxMTc2ODZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    cuisine: ['Japanese', 'Sushi', 'Asian'],
    rating: 4.8,
    deliveryTime: '35-45 min',
    priceRange: '$$$',
    deliveryFee: 4.99,
    minOrder: 25.00,
    isPromoted: true,
  },
  {
    id: '4',
    name: 'Sweet Treats',
    image: 'https://images.unsplash.com/photo-1679942262057-d5732f732841?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZXNzZXJ0JTIwY2FrZXxlbnwxfHx8fDE3NjYxMTEzMTd8MA&ixlib=rb-4.1.0&q=80&w=1080',
    cuisine: ['Desserts', 'Bakery', 'Sweets'],
    rating: 4.6,
    deliveryTime: '20-30 min',
    priceRange: '$$',
    deliveryFee: 1.99,
    minOrder: 10.00,
  },
  {
    id: '5',
    name: 'Green Bowl',
    image: 'https://images.unsplash.com/photo-1624340209404-4f479dd59708?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZWFsdGh5JTIwc2FsYWQlMjBib3dsfGVufDF8fHx8MTc2NjEyNjM4Nnww&ixlib=rb-4.1.0&q=80&w=1080',
    cuisine: ['Healthy', 'Salads', 'Vegan'],
    rating: 4.4,
    deliveryTime: '20-30 min',
    priceRange: '$$',
    deliveryFee: 2.49,
    minOrder: 12.00,
    discount: '10% OFF',
  },
  {
    id: '6',
    name: 'Taco Fiesta',
    image: 'https://images.unsplash.com/photo-1640082380928-2f7079392823?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXN0YXVyYW50JTIwZm9vZCUyMGRlbGl2ZXJ5fGVufDF8fHx8MTc2NjE0OTM5NHww&ixlib=rb-4.1.0&q=80&w=1080',
    cuisine: ['Mexican', 'Tacos', 'Burritos'],
    rating: 4.3,
    deliveryTime: '25-35 min',
    priceRange: '$$',
    deliveryFee: 2.99,
    minOrder: 15.00,
  },
  {
    id: '7',
    name: 'Thai Express',
    image: 'https://images.unsplash.com/photo-1640082380928-2f7079392823?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXN0YXVyYW50JTIwZm9vZCUyMGRlbGl2ZXJ5fGVufDF8fHx8MTc2NjE0OTM5NHww&ixlib=rb-4.1.0&q=80&w=1080',
    cuisine: ['Thai', 'Asian'],
    rating: 4.5,
    deliveryTime: '30-40 min',
    priceRange: '$$',
    deliveryFee: 3.49,
    minOrder: 18.00,
  },
  {
    id: '8',
    name: 'Mediterranean Grill',
    image: 'https://images.unsplash.com/photo-1640082380928-2f7079392823?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXN0YXVyYW50JTIwZm9vZCUyMGRlbGl2ZXJ5fGVufDF8fHx8MTc2NjE0OTM5NHww&ixlib=rb-4.1.0&q=80&w=1080',
    cuisine: ['Mediterranean', 'Healthy'],
    rating: 4.7,
    deliveryTime: '25-35 min',
    priceRange: '$$$',
    deliveryFee: 3.99,
    minOrder: 22.00,
    discount: '25% OFF',
  },
];

// Mock menu items
const menuItemsByRestaurant: Record<string, MenuItem[]> = {
  '1': [
    {
      id: '1-1',
      name: 'Classic Beef Burger',
      description: 'Juicy beef patty with lettuce, tomato, and special sauce',
      price: 12.99,
      image: 'https://images.unsplash.com/photo-1656439659132-24c68e36b553?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXJnZXIlMjBmYXN0JTIwZm9vZHxlbnwxfHx8fDE3NjYxMzEwODZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
      category: 'Burgers',
      isPopular: true,
    },
    {
      id: '1-2',
      name: 'Cheese Burger',
      description: 'Double cheese with beef patty',
      price: 14.99,
      image: 'https://images.unsplash.com/photo-1656439659132-24c68e36b553?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXJnZXIlMjBmYXN0JTIwZm9vZHxlbnwxfHx8fDE3NjYxMzEwODZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
      category: 'Burgers',
    },
    {
      id: '1-3',
      name: 'Veggie Burger',
      description: 'Plant-based patty with fresh vegetables',
      price: 11.99,
      image: 'https://images.unsplash.com/photo-1656439659132-24c68e36b553?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXJnZXIlMjBmYXN0JTIwZm9vZHxlbnwxfHx8fDE3NjYxMzEwODZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
      category: 'Burgers',
      isVeg: true,
    },
    {
      id: '1-4',
      name: 'French Fries',
      description: 'Crispy golden fries',
      price: 4.99,
      image: 'https://images.unsplash.com/photo-1656439659132-24c68e36b553?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXJnZXIlMjBmYXN0JTIwZm9vZHxlbnwxfHx8fDE3NjYxMzEwODZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
      category: 'Sides',
      isVeg: true,
    },
  ],
  '2': [
    {
      id: '2-1',
      name: 'Margherita Pizza',
      description: 'Classic pizza with tomato sauce, mozzarella, and basil',
      price: 15.99,
      image: 'https://images.unsplash.com/photo-1749169395459-9eb9835bd718?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaXp6YSUyMGl0YWxpYW4lMjBmb29kfGVufDF8fHx8MTc2NjA0MzIxNHww&ixlib=rb-4.1.0&q=80&w=1080',
      category: 'Pizza',
      isVeg: true,
      isPopular: true,
    },
    {
      id: '2-2',
      name: 'Pepperoni Pizza',
      description: 'Loaded with pepperoni and cheese',
      price: 17.99,
      image: 'https://images.unsplash.com/photo-1749169395459-9eb9835bd718?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaXp6YSUyMGl0YWxpYW4lMjBmb29kfGVufDF8fHx8MTc2NjA0MzIxNHww&ixlib=rb-4.1.0&q=80&w=1080',
      category: 'Pizza',
    },
    {
      id: '2-3',
      name: 'Carbonara Pasta',
      description: 'Creamy pasta with bacon and parmesan',
      price: 14.99,
      image: 'https://images.unsplash.com/photo-1749169395459-9eb9835bd718?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaXp6YSUyMGl0YWxpYW4lMjBmb29kfGVufDF8fHx8MTc2NjA0MzIxNHww&ixlib=rb-4.1.0&q=80&w=1080',
      category: 'Pasta',
    },
  ],
  '3': [
    {
      id: '3-1',
      name: 'California Roll',
      description: 'Crab, avocado, and cucumber',
      price: 12.99,
      image: 'https://images.unsplash.com/photo-1697580511707-476438ba9614?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdXNoaSUyMGFzaWFuJTIwZm9vZHxlbnwxfHx8fDE3NjYxMTc2ODZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
      category: 'Sushi Rolls',
      isPopular: true,
    },
    {
      id: '3-2',
      name: 'Spicy Tuna Roll',
      description: 'Tuna with spicy mayo',
      price: 14.99,
      image: 'https://images.unsplash.com/photo-1697580511707-476438ba9614?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdXNoaSUyMGFzaWFuJTIwZm9vZHxlbnwxfHx8fDE3NjYxMTc2ODZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
      category: 'Sushi Rolls',
    },
    {
      id: '3-3',
      name: 'Salmon Nigiri',
      description: 'Fresh salmon over rice',
      price: 8.99,
      image: 'https://images.unsplash.com/photo-1697580511707-476438ba9614?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdXNoaSUyMGFzaWFuJTIwZm9vZHxlbnwxfHx8fDE3NjYxMTc2ODZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
      category: 'Nigiri',
    },
  ],
  '4': [
    {
      id: '4-1',
      name: 'Chocolate Cake',
      description: 'Rich chocolate cake with ganache',
      price: 8.99,
      image: 'https://images.unsplash.com/photo-1679942262057-d5732f732841?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZXNzZXJ0JTIwY2FrZXxlbnwxfHx8fDE3NjYxMTEzMTd8MA&ixlib=rb-4.1.0&q=80&w=1080',
      category: 'Cakes',
      isPopular: true,
      isVeg: true,
    },
    {
      id: '4-2',
      name: 'Cheesecake',
      description: 'New York style cheesecake',
      price: 9.99,
      image: 'https://images.unsplash.com/photo-1679942262057-d5732f732841?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZXNzZXJ0JTIwY2FrZXxlbnwxfHx8fDE3NjYxMTEzMTd8MA&ixlib=rb-4.1.0&q=80&w=1080',
      category: 'Cakes',
      isVeg: true,
    },
  ],
  '5': [
    {
      id: '5-1',
      name: 'Buddha Bowl',
      description: 'Quinoa, vegetables, and tahini dressing',
      price: 13.99,
      image: 'https://images.unsplash.com/photo-1624340209404-4f479dd59708?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZWFsdGh5JTIwc2FsYWQlMjBib3dsfGVufDF8fHx8MTc2NjEyNjM4Nnww&ixlib=rb-4.1.0&q=80&w=1080',
      category: 'Bowls',
      isVeg: true,
      isPopular: true,
    },
    {
      id: '5-2',
      name: 'Greek Salad',
      description: 'Fresh vegetables with feta cheese',
      price: 11.99,
      image: 'https://images.unsplash.com/photo-1624340209404-4f479dd59708?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZWFsdGh5JTIwc2FsYWQlMjBib3dsfGVufDF8fHx8MTc2NjEyNjM4Nnww&ixlib=rb-4.1.0&q=80&w=1080',
      category: 'Salads',
      isVeg: true,
    },
  ],
  '6': [
    {
      id: '6-1',
      name: 'Chicken Tacos',
      description: 'Grilled chicken with salsa and guacamole',
      price: 10.99,
      image: 'https://images.unsplash.com/photo-1640082380928-2f7079392823?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXN0YXVyYW50JTIwZm9vZCUyMGRlbGl2ZXJ5fGVufDF8fHx8MTc2NjE0OTM5NHww&ixlib=rb-4.1.0&q=80&w=1080',
      category: 'Tacos',
      isPopular: true,
    },
    {
      id: '6-2',
      name: 'Burrito Bowl',
      description: 'Rice, beans, meat, and toppings',
      price: 13.99,
      image: 'https://images.unsplash.com/photo-1640082380928-2f7079392823?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXN0YXVyYW50JTIwZm9vZCUyMGRlbGl2ZXJ5fGVufDF8fHx8MTc2NjE0OTM5NHww&ixlib=rb-4.1.0&q=80&w=1080',
      category: 'Bowls',
    },
  ],
};

export default function App() {
  const [selectedCategory, setSelectedCategory] = useState('delivery');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({
    cuisines: [],
    priceRange: [],
    minRating: 0,
    deliveryTime: [],
    dietary: [],
  });

  // Filter restaurants based on filters and search
  const filteredRestaurants = restaurants.filter((restaurant) => {
    // Cuisine filter
    if (filters.cuisines.length > 0) {
      const matchesCuisine = filters.cuisines.some((cuisine) =>
        restaurant.cuisine.includes(cuisine)
      );
      if (!matchesCuisine) return false;
    }

    // Price range filter
    if (filters.priceRange.length > 0) {
      if (!filters.priceRange.includes(restaurant.priceRange)) return false;
    }

    // Rating filter
    if (restaurant.rating < filters.minRating) return false;

    // Delivery time filter
    if (filters.deliveryTime.length > 0) {
      const matchesDeliveryTime = filters.deliveryTime.some((time) => {
        const restaurantTime = restaurant.deliveryTime;
        if (time === '10-20 min' && restaurantTime.includes('10-20')) return true;
        if (time === '20-30 min' && restaurantTime.includes('20-30')) return true;
        if (time === '30-40 min' && restaurantTime.includes('30-40')) return true;
        if (time === '40+ min') {
          const minutes = parseInt(restaurantTime);
          return minutes >= 40;
        }
        return false;
      });
      if (!matchesDeliveryTime) return false;
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesSearch =
        restaurant.name.toLowerCase().includes(query) ||
        restaurant.cuisine.some((c) => c.toLowerCase().includes(query));
      if (!matchesSearch) return false;
    }

    return true;
  });

  const handleAddToCart = (item: MenuItem) => {
    setCartItems((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
    toast.success(`${item.name} added to cart`);
  };

  const handleUpdateQuantity = (itemId: string, quantity: number) => {
    if (quantity === 0) {
      handleRemoveItem(itemId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, quantity } : item))
    );
  };

  const handleRemoveItem = (itemId: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== itemId));
    toast.info('Item removed from cart');
  };

  const handleClearFilters = () => {
    setFilters({
      cuisines: [],
      priceRange: [],
      minRating: 0,
      deliveryTime: [],
      dietary: [],
    });
  };

  const totalCartItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  if (selectedRestaurant) {
    return (
      <>
        <Header
          cartItemCount={totalCartItems}
          onCartClick={() => setIsCartOpen(true)}
          onSearch={setSearchQuery}
        />
        <RestaurantMenu
          restaurant={selectedRestaurant}
          menuItems={menuItemsByRestaurant[selectedRestaurant.id] || []}
          onBack={() => setSelectedRestaurant(null)}
          onAddToCart={handleAddToCart}
        />
        <Cart
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
          items={cartItems}
          onUpdateQuantity={handleUpdateQuantity}
          onRemoveItem={handleRemoveItem}
        />
        <Toaster />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        cartItemCount={totalCartItems}
        onCartClick={() => setIsCartOpen(true)}
        onSearch={setSearchQuery}
      />

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-orange-500 to-pink-500 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl mb-4">Welcome to Lazeezos</h1>
          <p className="text-xl mb-6">
            Order food from your favorite restaurants, delivered to your door
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <div className="bg-white/20 backdrop-blur-sm rounded-lg px-6 py-4">
              <p className="text-3xl">1000+</p>
              <p className="text-sm">Restaurants</p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-lg px-6 py-4">
              <p className="text-3xl">30 min</p>
              <p className="text-sm">Avg. Delivery</p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-lg px-6 py-4">
              <p className="text-3xl">50K+</p>
              <p className="text-sm">Happy Customers</p>
            </div>
          </div>
        </div>
      </div>

      {/* Category Bar - Below Hero */}
      <CategoryBar
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />

      {/* Main Content with Sidebar */}
      <div className="flex">
        {/* Filter Sidebar */}
        <FilterSidebar
          filters={filters}
          onFiltersChange={setFilters}
          onClearFilters={handleClearFilters}
        />

        {/* Restaurant Listings */}
        <div className="flex-1 p-6">
          <div className="container mx-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl">
                {selectedCategory === 'delivery' && 'Food Delivery'}
                {selectedCategory === 'pickup' && 'Pick-up'}
                {selectedCategory === 'pandamart' && 'pandamart'}
                {selectedCategory === 'shops' && 'Shops'}
                {selectedCategory === 'caterers' && 'Caterers'}
              </h2>
              <p className="text-gray-500">{filteredRestaurants.length} restaurants</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
              {filteredRestaurants.map((restaurant) => (
                <RestaurantCard
                  key={restaurant.id}
                  restaurant={restaurant}
                  onClick={() => setSelectedRestaurant(restaurant)}
                />
              ))}
            </div>
            {filteredRestaurants.length === 0 && (
              <div className="text-center py-12">
                <p className="text-xl text-gray-500">No restaurants found</p>
                <p className="text-gray-400 mt-2">
                  Try adjusting your filters or search query
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <Cart
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
      />
      <Toaster />
    </div>
  );
}
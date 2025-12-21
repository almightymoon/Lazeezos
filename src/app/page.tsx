'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Clock } from 'lucide-react';
import { Header } from '../components/Header';
import { FilterSidebar, FilterOptions } from '../components/Filter';
import { RestaurantCard, Restaurant } from '../components/Restaurant';
import { RestaurantMenu, MenuItem } from '../components/Restaurant';
import { Cart, CartItem } from '../components/Cart';
import { Toaster } from '../components/ui/sonner';
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

export default function Home() {
  const router = useRouter();
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
  const menuScrollRef = useRef<HTMLDivElement>(null);
  const [showRightArrow, setShowRightArrow] = useState(false);
  const [showLeftArrow, setShowLeftArrow] = useState(false);

  const dealsScrollRef = useRef<HTMLDivElement>(null);
  const [showDealsRightArrow, setShowDealsRightArrow] = useState(false);
  const [showDealsLeftArrow, setShowDealsLeftArrow] = useState(false);

  const mealsScrollRef = useRef<HTMLDivElement>(null);
  const [showMealsRightArrow, setShowMealsRightArrow] = useState(false);
  const [showMealsLeftArrow, setShowMealsLeftArrow] = useState(false);

  // Check if scroll is needed for menu
  useEffect(() => {
    const checkScroll = () => {
      if (menuScrollRef.current) {
        const { scrollWidth, clientWidth, scrollLeft } = menuScrollRef.current;
        setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
        setShowLeftArrow(scrollLeft > 10);
      }
    };

    checkScroll();
    const timeoutId = setTimeout(checkScroll, 100);

    window.addEventListener('resize', checkScroll);
    const scrollElement = menuScrollRef.current;
    if (scrollElement) {
      scrollElement.addEventListener('scroll', checkScroll);
    }

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', checkScroll);
      if (scrollElement) {
        scrollElement.removeEventListener('scroll', checkScroll);
      }
    };
  }, []);

  // Check if scroll is needed for deals
  useEffect(() => {
    const checkScroll = () => {
      if (dealsScrollRef.current) {
        const { scrollWidth, clientWidth, scrollLeft } = dealsScrollRef.current;
        setShowDealsRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
        setShowDealsLeftArrow(scrollLeft > 10);
      }
    };

    checkScroll();
    const timeoutId = setTimeout(checkScroll, 100);

    window.addEventListener('resize', checkScroll);
    const scrollElement = dealsScrollRef.current;
    if (scrollElement) {
      scrollElement.addEventListener('scroll', checkScroll);
    }

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', checkScroll);
      if (scrollElement) {
        scrollElement.removeEventListener('scroll', checkScroll);
      }
    };
  }, []);

  // Check if scroll is needed for meals
  useEffect(() => {
    const checkScroll = () => {
      if (mealsScrollRef.current) {
        const { scrollWidth, clientWidth, scrollLeft } = mealsScrollRef.current;
        setShowMealsRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
        setShowMealsLeftArrow(scrollLeft > 10);
      }
    };

    checkScroll();
    const timeoutId = setTimeout(checkScroll, 100);

    window.addEventListener('resize', checkScroll);
    const scrollElement = mealsScrollRef.current;
    if (scrollElement) {
      scrollElement.addEventListener('scroll', checkScroll);
    }

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', checkScroll);
      if (scrollElement) {
        scrollElement.removeEventListener('scroll', checkScroll);
      }
    };
  }, []);

  const scrollMenuRight = () => {
    if (menuScrollRef.current) {
      menuScrollRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  const scrollMenuLeft = () => {
    if (menuScrollRef.current) {
      menuScrollRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollDealsRight = () => {
    if (dealsScrollRef.current) {
      dealsScrollRef.current.scrollBy({ left: 400, behavior: 'smooth' });
    }
  };

  const scrollDealsLeft = () => {
    if (dealsScrollRef.current) {
      dealsScrollRef.current.scrollBy({ left: -400, behavior: 'smooth' });
    }
  };

  const scrollMealsRight = () => {
    if (mealsScrollRef.current) {
      mealsScrollRef.current.scrollBy({ left: 350, behavior: 'smooth' });
    }
  };

  const scrollMealsLeft = () => {
    if (mealsScrollRef.current) {
      mealsScrollRef.current.scrollBy({ left: -350, behavior: 'smooth' });
    }
  };

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
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
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
    <div className="min-h-screen bg-gray-50 w-full overflow-x-hidden">
      <Header
        cartItemCount={totalCartItems}
        onCartClick={() => setIsCartOpen(true)}
        onSearch={setSearchQuery}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-orange-500 to-pink-500 text-white py-8 md:py-12 mt-20 md:mt-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl mb-3 md:mb-4">Welcome to Lazeezos</h1>
          <p className="text-base sm:text-lg md:text-xl mb-4 md:mb-6 px-2">
            Order food from your favorite restaurants, delivered to your door
          </p>
          <div className="flex justify-center gap-3 md:gap-4 flex-wrap">
            <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 md:px-6 py-3 md:py-4">
              <p className="text-2xl md:text-3xl">1000+</p>
              <p className="text-xs md:text-sm">Restaurants</p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 md:px-6 py-3 md:py-4">
              <p className="text-2xl md:text-3xl">30 min</p>
              <p className="text-xs md:text-sm">Avg. Delivery</p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 md:px-6 py-3 md:py-4">
              <p className="text-2xl md:text-3xl">50K+</p>
              <p className="text-xs md:text-sm">Happy Customers</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content with Sidebar */}
      <div className="flex flex-col md:flex-row w-full overflow-x-hidden">
        {/* Filter Sidebar */}
        <FilterSidebar
          filters={filters}
          onFiltersChange={setFilters}
          onClearFilters={handleClearFilters}
        />

        {/* Restaurant Listings */}
        <div className="flex-1 p-4 md:p-6 min-w-0">
          <div className="container mx-auto max-w-full">
            {/* Cuisine Menu - Horizontal Scrollable */}
            <div className="mb-6 md:mb-8">
              <h2 className="text-xl md:text-2xl font-bold mb-4">Menu</h2>
              <div className="relative overflow-hidden">
                {showLeftArrow && (
                  <button
                    onClick={scrollMenuLeft}
                    className="hidden md:block absolute left-0 top-1/2 -translate-y-1/2 bg-white shadow-lg rounded-full p-2 hover:bg-pink-50 transition-colors z-10 border border-gray-200"
                    aria-label="Scroll left"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-pink-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                  </button>
                )}
                <div 
                  ref={menuScrollRef}
                  className="flex gap-4 md:gap-6 overflow-x-auto scrollbar-hide pb-4 pl-4 md:pl-12 pr-4 md:pr-12"
                  style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch' }}
                >
                  {[
                  { name: 'Pizza', image: 'https://images.unsplash.com/photo-1749169395459-9eb9835bd718?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaXp6YSUyMGl0YWxpYW4lMjBmb29kfGVufDF8fHx8MTc2NjA0MzIxNHww&ixlib=rb-4.1.0&q=80&w=400' },
                  { name: 'Fast Food', image: 'https://images.unsplash.com/photo-1656439659132-24c68e36b553?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXJnZXIlMjBmYXN0JTIwZm9vZHxlbnwxfHx8fDE3NjYxMzEwODZ8MA&ixlib=rb-4.1.0&q=80&w=400' },
                  { name: 'Burgers', image: 'https://images.unsplash.com/photo-1656439659132-24c68e36b553?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXJnZXIlMjBmYXN0JTIwZm9vZHxlbnwxfHx8fDE3NjYxMzEwODZ8MA&ixlib=rb-4.1.0&q=80&w=400' },
                  { name: 'Biryani', image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400' },
                  { name: 'Desserts', image: 'https://images.unsplash.com/photo-1679942262057-d5732f732841?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZXNzZXJ0JTIwY2FrZXxlbnwxfHx8fDE3NjYxMTEzMTd8MA&ixlib=rb-4.1.0&q=80&w=400' },
                  { name: 'Pakistani', image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400' },
                  { name: 'Shawarma', image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400' },
                  { name: 'Chinese', image: 'https://images.unsplash.com/photo-1697580511707-476438ba9614?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdXNoaSUyMGFzaWFuJTIwZm9vZHxlbnwxfHx8fDE3NjYxMTc2ODZ8MA&ixlib=rb-4.1.0&q=80&w=400' },
                  { name: 'Italian', image: 'https://images.unsplash.com/photo-1749169395459-9eb9835bd718?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaXp6YSUyMGl0YWxpYW4lMjBmb29kfGVufDF8fHx8MTc2NjA0MzIxNHww&ixlib=rb-4.1.0&q=80&w=400' },
                  { name: 'Sushi', image: 'https://images.unsplash.com/photo-1697580511707-476438ba9614?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdXNoaSUyMGFzaWFuJTIwZm9vZHxlbnwxfHx8fDE3NjYxMTc2ODZ8MA&ixlib=rb-4.1.0&q=80&w=400' },
                  { name: 'Thai', image: 'https://images.unsplash.com/photo-1697580511707-476438ba9614?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdXNoaSUyMGFzaWFuJTIwZm9vZHxlbnwxfHx8fDE3NjYxMTc2ODZ8MA&ixlib=rb-4.1.0&q=80&w=400' },
                  { name: 'Indian', image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400' },
                  { name: 'Mexican', image: 'https://images.unsplash.com/photo-1640082380928-2f7079392823?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXN0YXVyYW50JTIwZm9vZCUyMGRlbGl2ZXJ5fGVufDF8fHx8MTc2NjE0OTM5NHww&ixlib=rb-4.1.0&q=80&w=400' },
                  { name: 'American', image: 'https://images.unsplash.com/photo-1656439659132-24c68e36b553?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXJnZXIlMjBmYXN0JTIwZm9vZHxlbnwxfHx8fDE3NjYxMzEwODZ8MA&ixlib=rb-4.1.0&q=80&w=400' },
                  { name: 'Seafood', image: 'https://images.unsplash.com/photo-1697580511707-476438ba9614?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdXNoaSUyMGFzaWFuJTIwZm9vZHxlbnwxfHx8fDE3NjYxMTc2ODZ8MA&ixlib=rb-4.1.0&q=80&w=400' },
                  { name: 'Healthy', image: 'https://images.unsplash.com/photo-1624340209404-4f479dd59708?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZWFsdGh5JTIwc2FsYWQlMjBib3dsfGVufDF8fHx8MTc2NjEyNjM4Nnww&ixlib=rb-4.1.0&q=80&w=400' },
                ].map((cuisine) => (
                  <div
                    key={cuisine.name}
                    className="flex-shrink-0 cursor-pointer group"
                    onClick={() => {
                      const cuisineLower = cuisine.name.toLowerCase();
                      // Map menu items to filter cuisine names
                      const cuisineMap: Record<string, string> = {
                        'fast food': 'Fast Food',
                        'burgers': 'Burgers',
                        'sushi': 'Japanese',
                        'thai': 'Thai',
                        'indian': 'Indian',
                        'mexican': 'Mexican',
                        'american': 'American',
                        'italian': 'Italian',
                        'healthy': 'Healthy',
                        'pizza': 'Italian',
                        'biryani': 'Indian',
                        'pakistani': 'Mediterranean',
                        'shawarma': 'Mediterranean',
                        'chinese': 'Chinese',
                        'desserts': 'Desserts',
                        'seafood': 'Japanese',
                      };
                      const filterCuisine = cuisineMap[cuisineLower] || cuisine.name;
                      setFilters({ ...filters, cuisines: [filterCuisine] });
                    }}
                  >
                    <div className="w-20 h-20 md:w-28 md:h-28 rounded-full overflow-hidden mb-2 md:mb-3 border-2 border-transparent group-hover:border-pink-500 transition-all shadow-md group-hover:shadow-xl">
                      <img
                        src={cuisine.image}
                        alt={cuisine.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                    <p className="text-center text-xs md:text-sm font-semibold text-pink-600 group-hover:text-pink-700 transition-colors">
                      {cuisine.name}
                    </p>
                  </div>
                ))}
                </div>
                {showRightArrow && (
                  <button
                    onClick={scrollMenuRight}
                    className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 bg-white shadow-lg rounded-full p-2 hover:bg-pink-50 transition-colors z-10 border border-gray-200"
                    aria-label="Scroll right"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-pink-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                )}
              </div>
            </div>

            {/* Daily Deals Section */}
            <div className="mb-8 md:mb-10">
              <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">Daily Deals</h2>
              <div className="relative overflow-hidden">
                {showDealsLeftArrow && (
                  <button
                    onClick={scrollDealsLeft}
                    className="hidden md:block absolute left-0 top-1/2 -translate-y-1/2 bg-white shadow-lg rounded-full p-2 hover:bg-pink-50 transition-colors z-10 border border-gray-200"
                    aria-label="Scroll left"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-pink-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                  </button>
                )}
                <div 
                  ref={dealsScrollRef}
                  className="flex gap-4 md:gap-6 overflow-x-auto scrollbar-hide pb-4 pl-4 md:pl-12 pr-4 md:pr-12"
                  style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch' }}
                >
                {/* Deal Card 1 */}
                <div className="flex-shrink-0 w-80 md:w-96 group relative bg-gradient-to-br from-orange-400 via-pink-500 to-purple-600 rounded-2xl p-6 overflow-hidden cursor-pointer transform hover:scale-[1.02] transition-all duration-300 shadow-lg hover:shadow-xl">
                  <div className="relative z-10">
                    <div className="bg-white/90 backdrop-blur-sm rounded-full px-4 py-1.5 inline-block mb-4">
                      <span className="text-sm font-bold text-pink-600">Up to 30% OFF</span>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">Burger Mania</h3>
                    <p className="text-white/90 text-sm mb-4">Delicious burgers at unbeatable prices</p>
                    <div className="flex items-center gap-2 text-white/80 text-xs">
                      <span>Valid until midnight</span>
                    </div>
                  </div>
                  <div className="absolute -right-8 -bottom-8 w-48 h-48 opacity-20">
                    <img 
                      src="https://images.unsplash.com/photo-1656439659132-24c68e36b553?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400" 
                      alt="Burger" 
                      className="w-full h-full object-cover rounded-full"
                    />
                  </div>
                  <p className="absolute bottom-2 left-6 text-white/70 text-[10px]">T&Cs apply</p>
                </div>

                {/* Deal Card 2 */}
                <div className="flex-shrink-0 w-80 md:w-96 group relative bg-gradient-to-br from-blue-400 via-cyan-500 to-teal-600 rounded-2xl p-6 overflow-hidden cursor-pointer transform hover:scale-[1.02] transition-all duration-300 shadow-lg hover:shadow-xl">
                  <div className="relative z-10">
                    <div className="bg-white/90 backdrop-blur-sm rounded-full px-4 py-1.5 inline-block mb-4">
                      <span className="text-sm font-bold text-cyan-600">Deal for $25</span>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">Sweet Treats</h3>
                    <p className="text-white/90 text-sm mb-4">Desserts that will satisfy your sweet tooth</p>
                    <div className="flex items-center gap-2 text-white/80 text-xs">
                      <span>Limited time offer</span>
                    </div>
                  </div>
                  <div className="absolute -right-8 -bottom-8 w-48 h-48 opacity-20">
                    <img 
                      src="https://images.unsplash.com/photo-1679942262057-d5732f732841?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400" 
                      alt="Dessert" 
                      className="w-full h-full object-cover rounded-full"
                    />
                  </div>
                  <p className="absolute bottom-2 left-6 text-white/70 text-[10px]">T&Cs apply</p>
                </div>

                {/* Deal Card 3 */}
                <div className="flex-shrink-0 w-80 md:w-96 group relative bg-gradient-to-br from-red-400 via-orange-500 to-yellow-600 rounded-2xl p-6 overflow-hidden cursor-pointer transform hover:scale-[1.02] transition-all duration-300 shadow-lg hover:shadow-xl">
                  <div className="relative z-10">
                    <div className="bg-white/90 backdrop-blur-sm rounded-full px-4 py-1.5 inline-block mb-4">
                      <span className="text-sm font-bold text-orange-600">Deal for $35</span>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">Chicken Special</h3>
                    <p className="text-white/90 text-sm mb-4">Crispy fried chicken with sides</p>
                    <div className="flex items-center gap-2 text-white/80 text-xs">
                      <span>Today only</span>
                    </div>
                  </div>
                  <div className="absolute -right-8 -bottom-8 w-48 h-48 opacity-20">
                    <img 
                      src="https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400" 
                      alt="Chicken" 
                      className="w-full h-full object-cover rounded-full"
                    />
                  </div>
                  <p className="absolute bottom-2 left-6 text-white/70 text-[10px]">T&Cs apply</p>
                </div>

                {/* Deal Card 4 */}
                <div className="flex-shrink-0 w-80 md:w-96 group relative bg-gradient-to-br from-green-400 via-emerald-500 to-teal-600 rounded-2xl p-6 overflow-hidden cursor-pointer transform hover:scale-[1.02] transition-all duration-300 shadow-lg hover:shadow-xl">
                  <div className="relative z-10">
                    <div className="bg-white/90 backdrop-blur-sm rounded-full px-4 py-1.5 inline-block mb-4">
                      <span className="text-sm font-bold text-emerald-600">Up to 40% OFF</span>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">Healthy Bowl</h3>
                    <p className="text-white/90 text-sm mb-4">Fresh salads and nutritious meals</p>
                    <div className="flex items-center gap-2 text-white/80 text-xs">
                      <span>Weekend special</span>
                    </div>
                  </div>
                  <div className="absolute -right-8 -bottom-8 w-48 h-48 opacity-20">
                    <img 
                      src="https://images.unsplash.com/photo-1624340209404-4f479dd59708?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400" 
                      alt="Healthy" 
                      className="w-full h-full object-cover rounded-full"
                    />
                  </div>
                  <p className="absolute bottom-2 left-6 text-white/70 text-[10px]">T&Cs apply</p>
                </div>

                {/* Deal Card 5 */}
                <div className="flex-shrink-0 w-80 md:w-96 group relative bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 rounded-2xl p-6 overflow-hidden cursor-pointer transform hover:scale-[1.02] transition-all duration-300 shadow-lg hover:shadow-xl">
                  <div className="relative z-10">
                    <div className="bg-white/90 backdrop-blur-sm rounded-full px-4 py-1.5 inline-block mb-4">
                      <span className="text-sm font-bold text-pink-600">Deal for $29</span>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">Pasta Paradise</h3>
                    <p className="text-white/90 text-sm mb-4">Authentic Italian pasta dishes</p>
                    <div className="flex items-center gap-2 text-white/80 text-xs">
                      <span>Limited stock</span>
                    </div>
                  </div>
                  <div className="absolute -right-8 -bottom-8 w-48 h-48 opacity-20">
                    <img 
                      src="https://images.unsplash.com/photo-1749169395459-9eb9835bd718?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400" 
                      alt="Pasta" 
                      className="w-full h-full object-cover rounded-full"
                    />
                  </div>
                  <p className="absolute bottom-2 left-6 text-white/70 text-[10px]">T&Cs apply</p>
                </div>

                {/* Deal Card 6 */}
                <div className="flex-shrink-0 w-80 md:w-96 group relative bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 rounded-2xl p-6 overflow-hidden cursor-pointer transform hover:scale-[1.02] transition-all duration-300 shadow-lg hover:shadow-xl">
                  <div className="relative z-10">
                    <div className="bg-white/90 backdrop-blur-sm rounded-full px-4 py-1.5 inline-block mb-4">
                      <span className="text-sm font-bold text-orange-600">Up to 35% OFF</span>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">BBQ Special</h3>
                    <p className="text-white/90 text-sm mb-4">Smoky grilled meats and sides</p>
                    <div className="flex items-center gap-2 text-white/80 text-xs">
                      <span>Tonight only</span>
                    </div>
                  </div>
                  <div className="absolute -right-8 -bottom-8 w-48 h-48 opacity-20">
                    <img 
                      src="https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400" 
                      alt="BBQ" 
                      className="w-full h-full object-cover rounded-full"
                    />
                  </div>
                  <p className="absolute bottom-2 left-6 text-white/70 text-[10px]">T&Cs apply</p>
                </div>
                </div>
                {showDealsRightArrow && (
                  <button
                    onClick={scrollDealsRight}
                    className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 bg-white shadow-lg rounded-full p-2 hover:bg-pink-50 transition-colors z-10 border border-gray-200"
                    aria-label="Scroll right"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-pink-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                )}
              </div>
            </div>

            {/* Discounted Meals Section */}
            <div className="mb-8 md:mb-10">
              <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">Discounted Meals</h2>
              <div className="relative overflow-hidden">
                {showMealsLeftArrow && (
                  <button
                    onClick={scrollMealsLeft}
                    className="hidden md:block absolute left-0 top-1/2 -translate-y-1/2 bg-white shadow-lg rounded-full p-2 hover:bg-pink-50 transition-colors z-10 border border-gray-200"
                    aria-label="Scroll left"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-pink-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                  </button>
                )}
                <div 
                  ref={mealsScrollRef}
                  className="flex gap-4 md:gap-6 overflow-x-auto scrollbar-hide pb-4 pl-4 md:pl-12 pr-4 md:pr-12"
                  style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch' }}
                >
                {/* Discounted Meal Card 1 */}
                <div className="flex-shrink-0 w-64 md:w-72 group relative bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-100">
                  <div className="relative h-40 overflow-hidden">
                    <img 
                      src="https://images.unsplash.com/photo-1656439659132-24c68e36b553?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400" 
                      alt="Cheese Burger Combo" 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-md text-xs font-bold">
                      -25%
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-lg mb-1 text-gray-900">Cheese Burger Combo</h3>
                    <p className="text-sm text-gray-500 mb-2">Burger + Fries + Drink</p>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-lg font-bold text-gray-900">$12.99</span>
                      <span className="text-sm text-gray-400 line-through">$17.99</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <Clock className="w-4 h-4" />
                      <span>20-30 min</span>
                    </div>
                  </div>
                </div>

                {/* Discounted Meal Card 2 */}
                <div className="flex-shrink-0 w-64 md:w-72 group relative bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-100">
                  <div className="relative h-40 overflow-hidden">
                    <img 
                      src="https://images.unsplash.com/photo-1749169395459-9eb9835bd718?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400" 
                      alt="Pizza Feast" 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-md text-xs font-bold">
                      -30%
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-lg mb-1 text-gray-900">Pizza Feast</h3>
                    <p className="text-sm text-gray-500 mb-2">Large Pizza + Garlic Bread</p>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-lg font-bold text-gray-900">$18.99</span>
                      <span className="text-sm text-gray-400 line-through">$27.99</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <Clock className="w-4 h-4" />
                      <span>30-40 min</span>
                    </div>
                  </div>
                </div>

                {/* Discounted Meal Card 3 */}
                <div className="flex-shrink-0 w-64 md:w-72 group relative bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-100">
                  <div className="relative h-40 overflow-hidden">
                    <img 
                      src="https://images.unsplash.com/photo-1697580511707-476438ba9614?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400" 
                      alt="Sushi Platter" 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-md text-xs font-bold">
                      -20%
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-lg mb-1 text-gray-900">Sushi Platter</h3>
                    <p className="text-sm text-gray-500 mb-2">Assorted Sushi + Miso Soup</p>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-lg font-bold text-gray-900">$24.99</span>
                      <span className="text-sm text-gray-400 line-through">$31.99</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <Clock className="w-4 h-4" />
                      <span>35-45 min</span>
                    </div>
                  </div>
                </div>

                {/* Discounted Meal Card 4 */}
                <div className="flex-shrink-0 w-64 md:w-72 group relative bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-100">
                  <div className="relative h-40 overflow-hidden">
                    <img 
                      src="https://images.unsplash.com/photo-1679942262057-d5732f732841?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400" 
                      alt="Dessert Combo" 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-md text-xs font-bold">
                      -15%
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-lg mb-1 text-gray-900">Dessert Combo</h3>
                    <p className="text-sm text-gray-500 mb-2">Cake + Ice Cream + Coffee</p>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-lg font-bold text-gray-900">$9.99</span>
                      <span className="text-sm text-gray-400 line-through">$11.99</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <Clock className="w-4 h-4" />
                      <span>15-25 min</span>
                    </div>
                  </div>
                </div>

                {/* Discounted Meal Card 5 */}
                <div className="flex-shrink-0 w-64 md:w-72 group relative bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-100">
                  <div className="relative h-40 overflow-hidden">
                    <img 
                      src="https://images.unsplash.com/photo-1631452180519-c014fe946bc7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400" 
                      alt="Biryani Special" 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-md text-xs font-bold">
                      -22%
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-lg mb-1 text-gray-900">Biryani Special</h3>
                    <p className="text-sm text-gray-500 mb-2">Chicken Biryani + Raita + Salad</p>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-lg font-bold text-gray-900">$14.99</span>
                      <span className="text-sm text-gray-400 line-through">$19.99</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <Clock className="w-4 h-4" />
                      <span>25-35 min</span>
                    </div>
                  </div>
                </div>

                {/* Discounted Meal Card 6 */}
                <div className="flex-shrink-0 w-64 md:w-72 group relative bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-100">
                  <div className="relative h-40 overflow-hidden">
                    <img 
                      src="https://images.unsplash.com/photo-1640082380928-2f7079392823?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400" 
                      alt="Taco Fiesta" 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-md text-xs font-bold">
                      -18%
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-lg mb-1 text-gray-900">Taco Fiesta</h3>
                    <p className="text-sm text-gray-500 mb-2">3 Tacos + Nachos + Soda</p>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-lg font-bold text-gray-900">$11.99</span>
                      <span className="text-sm text-gray-400 line-through">$14.99</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <Clock className="w-4 h-4" />
                      <span>20-30 min</span>
                    </div>
                  </div>
                </div>

                {/* Discounted Meal Card 7 */}
                <div className="flex-shrink-0 w-64 md:w-72 group relative bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-100">
                  <div className="relative h-40 overflow-hidden">
                    <img 
                      src="https://images.unsplash.com/photo-1624340209404-4f479dd59708?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400" 
                      alt="Salad Power" 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-md text-xs font-bold">
                      -12%
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-lg mb-1 text-gray-900">Salad Power</h3>
                    <p className="text-sm text-gray-500 mb-2">Fresh Salad + Soup + Bread</p>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-lg font-bold text-gray-900">$8.99</span>
                      <span className="text-sm text-gray-400 line-through">$10.99</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <Clock className="w-4 h-4" />
                      <span>15-20 min</span>
                    </div>
                  </div>
                </div>

                {/* Discounted Meal Card 8 */}
                <div className="flex-shrink-0 w-64 md:w-72 group relative bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-100">
                  <div className="relative h-40 overflow-hidden">
                    <img 
                      src="https://images.unsplash.com/photo-1697580511707-476438ba9614?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400" 
                      alt="Ramen Bowl" 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-md text-xs font-bold">
                      -28%
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-lg mb-1 text-gray-900">Ramen Bowl</h3>
                    <p className="text-sm text-gray-500 mb-2">Chicken Ramen + Egg + Vegetables</p>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-lg font-bold text-gray-900">$16.99</span>
                      <span className="text-sm text-gray-400 line-through">$23.99</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <Clock className="w-4 h-4" />
                      <span>25-35 min</span>
                    </div>
                  </div>
                </div>
                </div>
                {showMealsRightArrow && (
                  <button
                    onClick={scrollMealsRight}
                    className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 bg-white shadow-lg rounded-full p-2 hover:bg-pink-50 transition-colors z-10 border border-gray-200"
                    aria-label="Scroll right"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-pink-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                )}
              </div>
            </div>

             <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 md:mb-6 gap-2">
              <h2 className="text-xl md:text-2xl font-bold">
                {selectedCategory === 'delivery' && 'Restaurant'}
                {selectedCategory === 'pickup' && 'Pick-up'}
                {selectedCategory === 'pandamart' && 'pandamart'}
                {selectedCategory === 'shops' && 'Shops'}
                {selectedCategory === 'caterers' && 'Caterers'}
              </h2>
              <p className="text-sm md:text-base text-gray-500">{filteredRestaurants.length} restaurants</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 md:gap-6">
              {filteredRestaurants.map((restaurant) => (
                <RestaurantCard
                  key={restaurant.id}
                  restaurant={restaurant}
                  onClick={() => router.push(`/restaurant/${restaurant.id}`)}
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


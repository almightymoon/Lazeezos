'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Clock, RotateCcw } from 'lucide-react';
import { Header } from '../../components/Header';
import { FilterSidebar, FilterOptions } from '../../components/Filter';
import { RestaurantCard, Restaurant } from '../../components/Restaurant';
import { RestaurantMenu, MenuItem } from '../../components/Restaurant';
import { Cart, CartItem } from '../../components/Cart';
import { Toaster } from '../../components/ui/sonner';
import { toast } from 'sonner';

// Note: Restaurants and menu items are now fetched from the API

export default function UserDashboard() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState('delivery');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [menuItemsByRestaurant, setMenuItemsByRestaurant] = useState<Record<string, MenuItem[]>>({});
  const [pastOrders, setPastOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
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

  const reorderScrollRef = useRef<HTMLDivElement>(null);
  const [showReorderRightArrow, setShowReorderRightArrow] = useState(false);
  const [showReorderLeftArrow, setShowReorderLeftArrow] = useState(false);

  // Fetch restaurants from API
  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        if (searchQuery) params.append('search', searchQuery);
        if (filters.cuisines.length > 0) params.append('cuisine', filters.cuisines[0]);
        
        const response = await fetch(`/api/restaurants?${params.toString()}`);
        if (response.ok) {
          const data = await response.json();
          setRestaurants(data);
          
          // Fetch menu items for each restaurant
          const menuItemsMap: Record<string, MenuItem[]> = {};
          for (const restaurant of data) {
            try {
              const menuResponse = await fetch(`/api/restaurants/${restaurant.slug}`);
              if (menuResponse.ok) {
                const menuData = await menuResponse.json();
                menuItemsMap[restaurant.id] = menuData.menu || [];
              }
            } catch (error) {
              console.error(`Error fetching menu for ${restaurant.name}:`, error);
            }
          }
          setMenuItemsByRestaurant(menuItemsMap);
        }
      } catch (error) {
        console.error('Error fetching restaurants:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, [searchQuery, filters.cuisines]);

  // Fetch past orders for reorder section
  useEffect(() => {
    const fetchPastOrders = async () => {
      try {
        const response = await fetch('/api/orders');
        if (response.ok) {
          const data = await response.json();
          setPastOrders(data.pastOrders?.slice(0, 5) || []); // Get last 5 orders
        }
      } catch (error) {
        console.error('Error fetching past orders:', error);
      }
    };

    fetchPastOrders();
  }, []);

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

  // Check if scroll is needed for reorder
  useEffect(() => {
    const checkScroll = () => {
      if (reorderScrollRef.current) {
        const { scrollWidth, clientWidth, scrollLeft } = reorderScrollRef.current;
        setShowReorderRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
        setShowReorderLeftArrow(scrollLeft > 10);
      }
    };

    checkScroll();
    const timeoutId = setTimeout(checkScroll, 100);

    window.addEventListener('resize', checkScroll);
    const scrollElement = reorderScrollRef.current;
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

  const scrollReorderRight = () => {
    if (reorderScrollRef.current) {
      reorderScrollRef.current.scrollBy({ left: 350, behavior: 'smooth' });
    }
  };

  const scrollReorderLeft = () => {
    if (reorderScrollRef.current) {
      reorderScrollRef.current.scrollBy({ left: -350, behavior: 'smooth' });
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

      <div className="pt-20 md:pt-24">
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

            {/* Reorder Section - Only show if there are past orders */}
            {pastOrders.length > 0 && (
            <div className="mb-8 md:mb-10">
              <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">Reorder</h2>
              <div className="relative overflow-hidden">
                {showReorderLeftArrow && (
                  <button
                    onClick={scrollReorderLeft}
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
                  ref={reorderScrollRef}
                  className="flex gap-4 md:gap-6 overflow-x-auto scrollbar-hide pb-4 pl-4 md:pl-12 pr-4 md:pr-12"
                  style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch' }}
                >
                {pastOrders.map((order) => {
                    const formatTimeAgo = (dateString: string) => {
                      const date = new Date(dateString);
                      const now = new Date();
                      const diffMs = now.getTime() - date.getTime();
                      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
                      if (diffDays === 0) return 'Today';
                      if (diffDays === 1) return '1 day ago';
                      if (diffDays < 7) return `${diffDays} days ago`;
                      const diffWeeks = Math.floor(diffDays / 7);
                      return `${diffWeeks} week${diffWeeks > 1 ? 's' : ''} ago`;
                    };

                    const itemsSummary = order.items.slice(0, 2).map((item: any) => `${item.name} × ${item.quantity}`).join(', ');
                    const remainingItems = order.items.length - 2;
                    const itemsText = remainingItems > 0 ? `${itemsSummary} +${remainingItems} more` : itemsSummary;

                    return (
                      <div
                        key={order.id}
                        className="flex-shrink-0 w-64 md:w-72 group relative bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-100"
                        onClick={() => router.push(`/restaurant/${order.restaurantName.toLowerCase().replace(/\s+/g, '-')}`)}
                      >
                        <div className="relative h-40 overflow-hidden">
                          <img 
                            src={order.restaurantImage || 'https://images.unsplash.com/photo-1656439659132-24c68e36b553?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400'} 
                            alt={order.restaurantName} 
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                          <div className="absolute top-2 right-2 bg-gradient-to-r from-orange-500 to-pink-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1">
                            <RotateCcw className="w-3 h-3" />
                            Reorder
                          </div>
                        </div>
                        <div className="p-4">
                          <h3 className="font-bold text-lg mb-1 text-gray-900">{order.restaurantName}</h3>
                          <p className="text-sm text-gray-500 mb-2">{itemsText}</p>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-lg font-bold text-gray-900">PKR {order.total.toLocaleString()}</span>
                            <span className="text-xs text-gray-500">{formatTimeAgo(order.orderDate)}</span>
                          </div>
                          <div className="flex items-center gap-1 text-sm text-gray-600">
                            <Clock className="w-4 h-4" />
                            <span>25-35 min</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                {showReorderRightArrow && (
                  <button
                    onClick={scrollReorderRight}
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
            )}

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
    </div>
  );
}

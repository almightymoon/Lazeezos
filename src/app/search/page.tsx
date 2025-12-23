'use client';

import { useState, useEffect, useMemo, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Header } from '../../components/Header';
import { RestaurantCard, Restaurant } from '../../components/Restaurant';
import { FilterSidebar, FilterOptions } from '../../components/Filter';
import { Cart, CartItem } from '../../components/Cart';
import { Toaster } from '../../components/ui/sonner';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { 
  Search, 
  X, 
  ArrowLeft,
  SlidersHorizontal,
  Clock,
  Star,
  TrendingDown
} from 'lucide-react';
import { toast } from 'sonner';

// Restaurants will be fetched from API - removed mock data

function SearchPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  
  const [searchQuery, setSearchQuery] = useState(query);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [sortBy, setSortBy] = useState<'relevance' | 'rating' | 'deliveryTime' | 'price'>('relevance');
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    minRating: 0,
    deliveryTime: [],
    priceRange: [],
    cuisines: [],
    dietary: [],
  });

  // Fetch restaurants from API
  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/restaurants', {
          cache: 'no-store',
        });
        if (response.ok) {
          const data = await response.json();
          setRestaurants(data.restaurants || []);
        }
      } catch (error) {
        console.error('Error fetching restaurants:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, []);

  // Update search query when URL param changes
  useEffect(() => {
    setSearchQuery(query);
  }, [query]);

  // Filter restaurants based on search query
  const filteredRestaurants = useMemo(() => {
    if (loading) return [];
    
    if (!searchQuery.trim()) {
      return restaurants;
    }

    const queryLower = searchQuery.toLowerCase().trim();
    return restaurants.filter(restaurant => {
      // Search in restaurant name
      const nameMatch = restaurant.name.toLowerCase().includes(queryLower);
      
      // Search in cuisine types
      const cuisineMatch = restaurant.cuisine.some(c => 
        c.toLowerCase().includes(queryLower)
      );
      
      return nameMatch || cuisineMatch;
    });
  }, [searchQuery]);

  // Apply filters and sorting
  const filteredAndSortedRestaurants = useMemo(() => {
    let result = [...filteredRestaurants];

    // Apply filters
    if (filterOptions.minRating > 0) {
      result = result.filter(r => r.rating >= filterOptions.minRating);
    }

    if (filterOptions.deliveryTime.length > 0) {
      result = result.filter(r => {
        return filterOptions.deliveryTime.some(timeRange => {
          if (timeRange === '40+ min') {
            const timeMatch = r.deliveryTime.match(/(\d+)/);
            const maxTime = timeMatch ? parseInt(timeMatch[1]) : 60;
            return maxTime >= 40;
          } else {
            return r.deliveryTime.includes(timeRange);
          }
        });
      });
    }

    if (filterOptions.priceRange.length > 0) {
      result = result.filter(r => filterOptions.priceRange.includes(r.priceRange));
    }

    if (filterOptions.cuisines.length > 0) {
      result = result.filter(r => 
        r.cuisine.some(c => filterOptions.cuisines.includes(c))
      );
    }

    // Apply sorting
    switch (sortBy) {
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'deliveryTime':
        result.sort((a, b) => {
          const timeA = parseInt(a.deliveryTime.match(/(\d+)/)?.[1] || '60');
          const timeB = parseInt(b.deliveryTime.match(/(\d+)/)?.[1] || '60');
          return timeA - timeB;
        });
        break;
      case 'price':
        result.sort((a, b) => {
          const priceA = a.priceRange.length;
          const priceB = b.priceRange.length;
          return priceA - priceB;
        });
        break;
      case 'relevance':
      default:
        // Keep promoted restaurants first, then by rating
        result.sort((a, b) => {
          if (a.isPromoted && !b.isPromoted) return -1;
          if (!a.isPromoted && b.isPromoted) return 1;
          return b.rating - a.rating;
        });
        break;
    }

    return result;
  }, [filteredRestaurants, filterOptions, sortBy]);

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    if (value.trim()) {
      router.push(`/search?q=${encodeURIComponent(value.trim())}`);
    } else {
      router.push('/search');
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleAddToCart = (item: any) => {
    // This would typically add menu items to cart
    // For now, just show a toast
    toast.success(`${item.name} added to cart`);
  };

  const totalCartItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);


  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster />
      <Header
        cartItemCount={totalCartItems}
        onCartClick={() => setIsCartOpen(true)}
        onSearch={handleSearch}
        selectedCategory="delivery"
        onCategoryChange={() => {}}
      />

      <div className="pt-20 md:pt-24">
        <div className="container mx-auto px-4 py-6">
          {/* Back Button */}
          <Link href="/">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>

          {/* Search Bar */}
          <div className="mb-6">
            <form onSubmit={handleSearchSubmit} className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for restaurants or dishes..."
                className="w-full pl-12 pr-12 py-4 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:ring-orange-500 text-lg"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    router.push('/search');
                  }}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </form>
          </div>

          {/* Results Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              {query ? (
                <h1 className="text-2xl md:text-3xl font-bold">
                  Search Results for &quot;{query}&quot;
                </h1>
              ) : (
                <h1 className="text-2xl md:text-3xl font-bold">Search Restaurants</h1>
              )}
              <p className="text-gray-600 mt-1">
                {filteredAndSortedRestaurants.length} restaurant{filteredAndSortedRestaurants.length !== 1 ? 's' : ''} found
              </p>
            </div>

            {/* Sort and Filter */}
            <div className="flex items-center gap-3">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:ring-orange-500"
              >
                <option value="relevance">Sort by: Relevance</option>
                <option value="rating">Sort by: Rating</option>
                <option value="deliveryTime">Sort by: Delivery Time</option>
                <option value="price">Sort by: Price</option>
              </select>

              <Button
                variant="outline"
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="md:hidden"
              >
                <SlidersHorizontal className="w-4 h-4 mr-2" />
                Filters
              </Button>
            </div>
          </div>

          {/* Filters and Results */}
          <div className="flex gap-6">
            {/* Filter Sidebar - Desktop */}
            <div className={`hidden md:block w-64 flex-shrink-0 ${isFilterOpen ? 'block' : 'hidden'}`}>
              <FilterSidebar
                filters={filterOptions}
                onFiltersChange={setFilterOptions}
                onClearFilters={() => setFilterOptions({
                  minRating: 0,
                  deliveryTime: [],
                  priceRange: [],
                  cuisines: [],
                  dietary: [],
                })}
              />
            </div>

            {/* Filter Sidebar - Mobile (Drawer) */}
            {isFilterOpen && (
              <div className="md:hidden fixed inset-0 z-50 bg-black bg-opacity-50" onClick={() => setIsFilterOpen(false)}>
                <div className="absolute right-0 top-0 bottom-0 w-80 bg-white overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                  <div className="p-4 border-b flex items-center justify-between">
                    <h2 className="text-xl font-bold">Filters</h2>
                    <Button variant="ghost" size="icon" onClick={() => setIsFilterOpen(false)}>
                      <X className="w-5 h-5" />
                    </Button>
                  </div>
                  <div className="p-4">
                    <FilterSidebar
                      filters={filterOptions}
                      onFiltersChange={setFilterOptions}
                      onClearFilters={() => setFilterOptions({
                        minRating: 0,
                        deliveryTime: [],
                        priceRange: [],
                        cuisines: [],
                        dietary: [],
                      })}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Results */}
            <div className="flex-1">
              {filteredAndSortedRestaurants.length === 0 ? (
                <div className="text-center py-16">
                  <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h2 className="text-2xl font-bold text-gray-700 mb-2">No restaurants found</h2>
                  <p className="text-gray-600 mb-6">
                    Try adjusting your search or filters
                  </p>
                  <Button onClick={() => {
                    setSearchQuery('');
                    setFilterOptions({
                      minRating: 0,
                      deliveryTime: [],
                      priceRange: [],
                      cuisines: [],
                      dietary: [],
                    });
                    router.push('/search');
                  }}>
                    Clear Search
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredAndSortedRestaurants.map((restaurant) => (
                    <RestaurantCard
                      key={restaurant.id}
                      restaurant={restaurant}
                      onClick={() => router.push(`/restaurant/${restaurant.id}`)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Active Filters */}
          {(filterOptions.minRating > 0 || 
            filterOptions.deliveryTime.length > 0 || 
            filterOptions.priceRange.length > 0 || 
            filterOptions.cuisines.length > 0 ||
            filterOptions.dietary.length > 0) && (
            <div className="mt-6 flex flex-wrap gap-2">
              <span className="text-sm font-semibold text-gray-700">Active filters:</span>
              {filterOptions.minRating > 0 && (
                <Badge variant="secondary" className="gap-1">
                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                  {filterOptions.minRating}+ Rating
                  <button
                    onClick={() => setFilterOptions({ ...filterOptions, minRating: 0 })}
                    className="ml-1 hover:text-red-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              )}
              {filterOptions.deliveryTime.map(time => (
                <Badge key={time} variant="secondary" className="gap-1">
                  <Clock className="w-3 h-3" />
                  {time}
                  <button
                    onClick={() => setFilterOptions({ 
                      ...filterOptions, 
                      deliveryTime: filterOptions.deliveryTime.filter(t => t !== time) 
                    })}
                    className="ml-1 hover:text-red-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
              {filterOptions.priceRange.map(price => (
                <Badge key={price} variant="secondary">
                  {price}
                  <button
                    onClick={() => setFilterOptions({ 
                      ...filterOptions, 
                      priceRange: filterOptions.priceRange.filter(p => p !== price) 
                    })}
                    className="ml-1 hover:text-red-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
              {filterOptions.cuisines.map(cuisine => (
                <Badge key={cuisine} variant="secondary">
                  {cuisine}
                  <button
                    onClick={() => setFilterOptions({ 
                      ...filterOptions, 
                      cuisines: filterOptions.cuisines.filter(c => c !== cuisine) 
                    })}
                    className="ml-1 hover:text-red-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
              {filterOptions.dietary.map(diet => (
                <Badge key={diet} variant="secondary">
                  {diet}
                  <button
                    onClick={() => setFilterOptions({ 
                      ...filterOptions, 
                      dietary: filterOptions.dietary.filter(d => d !== diet) 
                    })}
                    className="ml-1 hover:text-red-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>

      <Cart
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={(id, qty) => {
          setCartItems(items => 
            items.map(item => item.id === id ? { ...item, quantity: qty } : item)
          );
        }}
        onRemoveItem={(id) => {
          setCartItems(items => items.filter(item => item.id !== id));
        }}
      />
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading search...</p>
        </div>
      </div>
    }>
      <SearchPageContent />
    </Suspense>
  );
}


'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, MapPin, ShoppingCart, User, Bike, ShoppingBag, Store, Package, UtensilsCrossed, LogOut, Ticket, HelpCircle, Settings } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';

export interface HeaderProps {
  cartItemCount: number;
  onCartClick: () => void;
  onSearch: (query: string) => void;
  selectedCategory?: string;
  onCategoryChange?: (category: string) => void;
  isLoggedIn?: boolean;
  onLoginChange?: (isLoggedIn: boolean) => void;
}

const categories = [
  { id: 'delivery', name: 'Delivery', icon: Bike },
  { id: 'pickup', name: 'Pick-up', icon: ShoppingBag },
  // { id: 'pandamart', name: 'pandamart', icon: Store },
  { id: 'shops', name: 'Shops', icon: Package },
  { id: 'caterers', name: 'Caterers', icon: UtensilsCrossed },
];

export function Header({ 
  cartItemCount, 
  onCartClick, 
  onSearch, 
  selectedCategory = 'delivery', 
  onCategoryChange,
  isLoggedIn: isLoggedInProp,
  onLoginChange
}: HeaderProps) {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Check localStorage for auth state on mount and listen for changes
  useEffect(() => {
    const checkAuthState = () => {
      const authState = localStorage.getItem('isLoggedIn') === 'true';
      setIsLoggedIn(authState);
      if (onLoginChange) {
        onLoginChange(authState);
      }
    };

    // Check on mount
    checkAuthState();

    // Listen for storage changes (when login happens in another tab/window)
    window.addEventListener('storage', checkAuthState);

    // Listen for custom login event (when login happens in same window)
    window.addEventListener('loginStateChange', checkAuthState);

    return () => {
      window.removeEventListener('storage', checkAuthState);
      window.removeEventListener('loginStateChange', checkAuthState);
    };
  }, [onLoginChange]);

  // Use prop if provided, otherwise use internal state
  const authState = isLoggedInProp !== undefined ? isLoggedInProp : isLoggedIn;

  const handleLogout = () => {
    localStorage.setItem('isLoggedIn', 'false');
    setIsLoggedIn(false);
    // Dispatch custom event to notify other components
    window.dispatchEvent(new Event('loginStateChange'));
    if (onLoginChange) {
      onLoginChange(false);
    }
    router.push('/');
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-white border-b shadow-sm">
      <div className="container mx-auto px-4">
        {/* Top Row */}
        <div className="flex items-center justify-between gap-4 py-3">
          {/* Logo */}
          <div className="flex items-center gap-4 flex-shrink-0">
            <Link href="/">
              <div className="bg-gradient-to-r from-orange-500 to-pink-500 text-white px-4 py-2 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <h1 className="text-xl font-bold">Lazeezos</h1>
              </div>
            </Link>
            {/* <Link href="/partner">
              <Button 
                variant="ghost" 
                className="hidden md:flex text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              >
                For Restaurants
              </Button>
            </Link> */}
          </div>

          {/* Location */}
          <div className="hidden lg:flex items-center gap-2 text-gray-700 hover:text-gray-900 cursor-pointer border border-gray-200 rounded-lg px-4 py-2 hover:bg-gray-50 hover:border-gray-300 transition-all">
            <MapPin className="w-4 h-4 text-orange-500" />
            <div>
              <p className="text-xs text-gray-500 font-medium">Deliver to</p>
              <p className="text-sm font-semibold">Current Location</p>
            </div>
          </div>

          {/* Category Bar - Centered */}
          {onCategoryChange && (
            <div className="hidden md:flex justify-center gap-2 flex-1 mx-4">
              {categories.map((category) => {
                const Icon = category.icon;
                const isSelected = selectedCategory === category.id;
                return (
                  <Button
                    key={category.id}
                    variant={isSelected ? 'default' : 'ghost'}
                    onClick={() => onCategoryChange(category.id)}
                    className={`flex items-center gap-2 whitespace-nowrap px-4 py-2 rounded-lg font-medium transition-all ${
                      isSelected
                        ? 'bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white shadow-sm'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-gray-500'}`} />
                    <span>{category.name}</span>
                  </Button>
                );
              })}
            </div>
          )}

          {/* Search Bar */}
          <div className="flex-1 max-w-xs relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search for restaurants or dishes..."
              className="pl-10 w-full border-gray-200 focus:border-pink-400 focus:ring-pink-400"
              onChange={(e) => onSearch(e.target.value)}
            />
          </div>

          {/* User Actions */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {authState ? (
              // Logged in: Show Cart and Profile
              <>
            <Button
              variant="ghost"
              size="icon"
              className="relative hover:bg-gray-100 rounded-lg"
              onClick={onCartClick}
            >
              <ShoppingCart className="w-5 h-5 text-gray-600" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs font-semibold rounded-full w-5 h-5 flex items-center justify-center shadow-sm">
                  {cartItemCount}
                </span>
              )}
            </Button>
                <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
                  <DropdownMenuTrigger asChild>
                    <button
                      type="button"
                      className="inline-flex items-center justify-center rounded-lg hover:bg-gray-100 h-10 w-10 transition-colors focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2"
                      aria-label="User menu"
                    >
                      <User className="w-5 h-5 text-gray-600" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 z-[100]" sideOffset={8}>
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onSelect={(e) => {
                      e.preventDefault();
                      router.push('/orders');
                    }}>
                      <ShoppingBag className="mr-2 h-4 w-4" />
                      Orders
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={(e) => {
                      e.preventDefault();
                      router.push('/profile');
                    }}>
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={(e) => {
                      e.preventDefault();
                      router.push('/vouchers');
                    }}>
                      <Ticket className="mr-2 h-4 w-4" />
                      Voucher
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={(e) => {
                      e.preventDefault();
                      router.push('/settings');
                    }}>
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={(e) => {
                      e.preventDefault();
                      router.push('/help');
                    }}>
                      <HelpCircle className="mr-2 h-4 w-4" />
                      Help Center
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onSelect={(e) => {
                      e.preventDefault();
                      handleLogout();
                    }} className="text-red-600 focus:text-red-600 focus:bg-red-50">
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              // Not logged in: Show Sign In and Sign Up
              <>
                <Link href="/login">
                  <Button 
                    variant="ghost" 
                    className="hidden md:flex text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  >
                    Sign In
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button 
                    className="hidden md:flex bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white"
                  >
                    Sign Up
                  </Button>
                </Link>
                {/* Mobile: Show single menu button */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="md:hidden hover:bg-gray-100 rounded-lg"
                    >
                      <User className="w-5 h-5 text-gray-600" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuItem asChild>
                      <Link href="/login" className="cursor-pointer">
                        Sign In
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/signup" className="cursor-pointer">
                        Sign Up
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            )}
          </div>
        </div>

        {/* Mobile Category Bar */}
        {onCategoryChange && (
          <div className="md:hidden flex justify-center gap-2 overflow-x-auto scrollbar-hide py-3 border-t">
            {categories.map((category) => {
              const Icon = category.icon;
              const isSelected = selectedCategory === category.id;
              return (
                <Button
                  key={category.id}
                  variant={isSelected ? 'default' : 'ghost'}
                  onClick={() => onCategoryChange(category.id)}
                  size="sm"
                  className={`flex items-center gap-2 whitespace-nowrap px-3 py-1.5 rounded-lg font-medium transition-all ${
                    isSelected
                      ? 'bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white shadow-sm'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-gray-500'}`} />
                  <span className="text-sm">{category.name}</span>
                </Button>
              );
            })}
          </div>
        )}
      </div>
    </header>
  );
}

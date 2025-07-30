import React, { useState, useEffect } from 'react';
import { 
  ShoppingCart, 
  Search, 
  User, 
  Menu, 
  X, 
  LogOut, 
  UserCircle,
  Package,
  Heart,
  Bell,
  Sparkles,
  Zap
} from 'lucide-react';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  
  // Mock auth and cart data - replace with your actual context
  const [user] = useState({ name: 'Binnol', email: 'binnol@example.com' });
  const [isAuthenticated] = useState(true);
  const [cartItems] = useState(3);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMobileMenuOpen && !event.target.closest('.mobile-menu-container')) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMobileMenuOpen]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      console.log('Searching for:', searchQuery);
      setSearchQuery('');
    }
  };

  const handleLogout = () => {
    console.log('Logging out');
    setIsUserMenuOpen(false);
  };

  const navigation = [
    { name: 'Home', href: '/', icon: null },
    { name: 'Subscriptions', href: '/products/subscriptions', icon: Zap },
    { name: 'Gift Cards', href: '/products/giftcards', icon: Heart },
    { name: 'All Products', href: '/products', icon: Package },
  ];

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 w-full z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-lg shadow-lg border-b border-gray-200/50' 
          : 'bg-white/90 backdrop-blur-sm shadow-sm border-b border-gray-100'
      }`}>
        {/* Premium gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/5 via-cyan-500/5 to-blue-600/5 pointer-events-none"></div>
        
        <div className="relative w-full max-w-none px-4 sm:px-6 lg:px-8 xl:px-12">
          <div className="flex items-center justify-between h-16 lg:h-18 w-full">
            
            {/* Enhanced Logo - Responsive sizing */}
            <div className="flex items-center group min-w-0 flex-shrink-0">
              <a href="/" className="flex items-center space-x-2 sm:space-x-3">
                <div className="relative">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-purple-500 via-cyan-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105 overflow-hidden">
                    {/* Chibi Miku */}
                    <div className="relative text-white text-sm sm:text-lg font-bold">
                      {/* Hair */}
                      <div className="absolute -top-1 -left-1 w-4 h-3 sm:w-6 sm:h-4 bg-gradient-to-r from-cyan-300 to-cyan-400 rounded-t-full transform rotate-12"></div>
                      <div className="absolute -top-1 -right-1 w-4 h-3 sm:w-6 sm:h-4 bg-gradient-to-r from-cyan-300 to-cyan-400 rounded-t-full transform -rotate-12"></div>
                      {/* Face */}
                      <div className="w-3 h-3 sm:w-4 sm:h-4 bg-gradient-to-b from-pink-100 to-pink-200 rounded-full flex items-center justify-center">
                        {/* Eyes */}
                        <div className="flex space-x-0.5 sm:space-x-1">
                          <div className="w-0.5 h-0.5 sm:w-1 sm:h-1 bg-blue-600 rounded-full"></div>
                          <div className="w-0.5 h-0.5 sm:w-1 sm:h-1 bg-blue-600 rounded-full"></div>
                        </div>
                      </div>
                      {/* Hair accessories */}
                      <div className="absolute top-0 left-1 w-0.5 h-0.5 sm:w-1 sm:h-1 bg-red-400 rounded-full animate-pulse"></div>
                      <div className="absolute top-0 right-1 w-0.5 h-0.5 sm:w-1 sm:h-1 bg-red-400 rounded-full animate-pulse"></div>
                    </div>
                  </div>
                  <div className="absolute -top-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 bg-gradient-to-r from-pink-400 to-red-400 rounded-full animate-bounce">
                    <div className="w-full h-full flex items-center justify-center text-white text-xs">♪</div>
                  </div>
                </div>
                <div className="min-w-0">
                  <h1 className="text-lg sm:text-xl lg:text-2xl font-bold bg-gradient-to-r from-purple-600 via-cyan-600 to-blue-600 bg-clip-text text-transparent truncate">
                    Miku Miku Store
                  </h1>
                  <p className="text-xs text-gray-500 font-medium hidden sm:block">Digital Marketplace</p>
                </div>
              </a>
            </div>

            {/* Enhanced Desktop Navigation - Hide on smaller screens, show on large */}
            <nav className="hidden xl:flex items-center space-x-1 flex-shrink-0">
              {navigation.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="group relative flex items-center space-x-2 px-3 lg:px-4 py-2 text-gray-700 hover:text-purple-600 text-sm font-medium transition-all duration-300 rounded-xl hover:bg-purple-50"
                >
                  {item.icon && <item.icon className="h-4 w-4 group-hover:scale-110 transition-transform duration-300" />}
                  <span className="whitespace-nowrap">{item.name}</span>
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-purple-500 to-cyan-500 group-hover:w-8 transition-all duration-300"></div>
                </a>
              ))}
            </nav>

            {/* Enhanced Search Bar - Responsive */}
            <div className="hidden md:flex flex-1 max-w-md lg:max-w-lg mx-4 lg:mx-8">
              <div className="w-full">
                <div className={`relative transition-all duration-300 ${
                  isSearchFocused ? 'scale-105' : 'scale-100'
                }`}>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setIsSearchFocused(true)}
                    onBlur={() => setIsSearchFocused(false)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch(e)}
                    placeholder="Search products..."
                    className={`w-full pl-10 lg:pl-12 pr-4 py-2 lg:py-3 text-sm bg-gray-50 border-2 rounded-xl lg:rounded-2xl transition-all duration-300 focus:outline-none ${
                      isSearchFocused 
                        ? 'border-purple-400 bg-white shadow-lg ring-4 ring-purple-100' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  />
                  <div className={`absolute left-3 lg:left-4 top-1/2 transform -translate-y-1/2 transition-all duration-300 ${
                    isSearchFocused ? 'text-purple-500 scale-110' : 'text-gray-400'
                  }`}>
                    <Search className="h-4 w-4 lg:h-5 lg:w-5" />
                  </div>
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 lg:right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Enhanced Right Side Icons - Responsive */}
            <div className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0">
              {/* Mobile Search */}
              <button className="md:hidden p-2 text-gray-700 hover:text-purple-600 hover:bg-purple-50 rounded-xl transition-all duration-300">
                <Search className="h-5 w-5" />
              </button>

              {/* Notifications - Hidden on mobile */}
              <button className="hidden sm:flex relative p-2 text-gray-700 hover:text-purple-600 hover:bg-purple-50 rounded-xl transition-all duration-300">
                <Bell className="h-5 w-5" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              </button>

              {/* Enhanced User Menu - Responsive */}
              <div className="relative">
                {isAuthenticated ? (
                  <div>
                    <button
                      onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                      className="flex items-center space-x-2 p-2 text-gray-700 hover:text-purple-600 hover:bg-purple-50 rounded-xl transition-all duration-300 focus:outline-none"
                    >
                      <div className="relative">
                        <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-full flex items-center justify-center">
                          <User className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-2 h-2 sm:w-3 sm:h-3 bg-green-400 border-2 border-white rounded-full"></div>
                      </div>
                      <span className="hidden lg:block text-sm font-medium max-w-20 xl:max-w-24 truncate">
                        {user?.name || user?.email}
                      </span>
                    </button>

                    {/* Enhanced User Dropdown - Responsive positioning */}
                    {isUserMenuOpen && (
                      <div className="absolute right-0 mt-3 w-56 sm:w-64 bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl border border-gray-200/50 py-2 z-50 animate-in slide-in-from-top-2 duration-200">
                        <div className="px-4 py-3 border-b border-gray-100">
                          <p className="text-sm font-medium text-gray-900 truncate">{user?.name}</p>
                          <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                        </div>
                        
                        <a
                          href="/profile"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center space-x-3 px-4 py-3 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-all duration-200"
                        >
                          <UserCircle className="h-4 w-4 flex-shrink-0" />
                          <span>Profile Settings</span>
                        </a>
                        
                        <a
                          href="/orders"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center space-x-3 px-4 py-3 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-all duration-200"
                        >
                          <Package className="h-4 w-4 flex-shrink-0" />
                          <span>Order History</span>
                        </a>
                        
                        <div className="border-t border-gray-100 mt-2 pt-2">
                          <button
                            onClick={handleLogout}
                            className="flex items-center space-x-3 w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-all duration-200"
                          >
                            <LogOut className="h-4 w-4 flex-shrink-0" />
                            <span>Sign Out</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    <a
                      href="/login"
                      className="text-gray-700 hover:text-purple-600 text-sm font-medium px-2 sm:px-3 py-2 rounded-xl hover:bg-purple-50 transition-all duration-300 whitespace-nowrap"
                    >
                      Sign In
                    </a>
                    <a
                      href="/register"
                      className="bg-gradient-to-r from-purple-600 to-cyan-600 text-white px-3 sm:px-4 py-2 rounded-xl text-sm font-medium hover:from-purple-700 hover:to-cyan-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 whitespace-nowrap"
                    >
                      Sign Up
                    </a>
                  </div>
                )}
              </div>

              {/* Enhanced Cart - Responsive */}
              <a
                href="/cart"
                className="relative p-2 text-gray-700 hover:text-purple-600 hover:bg-purple-50 rounded-xl transition-all duration-300 group"
              >
                <ShoppingCart className="h-5 w-5 sm:h-6 sm:w-6 group-hover:scale-110 transition-transform duration-300" />
                {cartItems > 0 && (
                  <div className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full h-4 w-4 sm:h-5 sm:w-5 flex items-center justify-center font-bold animate-pulse">
                    {cartItems}
                  </div>
                )}
              </a>

              {/* Enhanced Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="xl:hidden p-2 text-gray-700 hover:text-purple-600 hover:bg-purple-50 rounded-xl transition-all duration-300 mobile-menu-container"
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6 rotate-0 transition-transform duration-300" />
                ) : (
                  <Menu className="h-6 w-6 transition-transform duration-300" />
                )}
              </button>
            </div>
          </div>

          {/* Enhanced Mobile Navigation - Full width */}
          {isMobileMenuOpen && (
            <div className="xl:hidden py-4 border-t border-gray-200/50 animate-in slide-in-from-top duration-300 mobile-menu-container">
              {/* Mobile Search */}
              <div className="px-3 pb-4 md:hidden">
                <div className="w-full">
                  <div className="relative">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSearch(e)}
                      placeholder="Search products..."
                      className="w-full pl-12 pr-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-purple-100 focus:border-purple-400 focus:outline-none transition-all duration-300"
                    />
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  </div>
                </div>
              </div>

              {/* Mobile Navigation Links */}
              <nav className="flex flex-col space-y-1">
                {navigation.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:text-purple-600 hover:bg-purple-50 text-sm font-medium transition-all duration-300 mx-2 rounded-xl"
                  >
                    {item.icon && <item.icon className="h-4 w-4 flex-shrink-0" />}
                    <span>{item.name}</span>
                  </a>
                ))}
              </nav>

              {/* Mobile User Actions - Only show if not authenticated */}
              {!isAuthenticated && (
                <div className="flex flex-col space-y-2 px-6 pt-4 border-t border-gray-200/50 mt-4">
                  <a
                    href="/login"
                    className="text-center text-gray-700 hover:text-purple-600 text-sm font-medium px-4 py-3 rounded-xl hover:bg-purple-50 transition-all duration-300"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Sign In
                  </a>
                  <a
                    href="/register"
                    className="text-center bg-gradient-to-r from-purple-600 to-cyan-600 text-white px-4 py-3 rounded-xl text-sm font-medium hover:from-purple-700 hover:to-cyan-700 transition-all duration-300 shadow-lg"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Sign Up
                  </a>
                </div>
              )}
            </div>
          )}
        </div>
      </header>

      {/* Click outside to close user menu */}
      {isUserMenuOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsUserMenuOpen(false)}
        />
      )}

      {/* Spacer to prevent content from hiding behind fixed header */}
      <div className="h-16 lg:h-18"></div>
    </>
  );
};

export default Header;
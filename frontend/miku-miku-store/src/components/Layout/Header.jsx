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
  Sparkles,
  Zap
} from 'lucide-react';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  
  // Mock auth data
  const [user] = useState({ name: 'Binnol', email: 'binnol@example.com' });
  const [isAuthenticated] = useState(true);
  
  // Cart state (simplified without demo controls)
  const [cartItems] = useState(3);

  // Mock product data for search - matches Products.jsx data
  const mockProducts = [
    {
      id: 1,
      name: 'Netflix Premium',
      price: 15.99,
      category: 'subscriptions',
      type: 'Monthly Subscription',
      description: '4K Ultra HD, 4 screens at once',
    },
    {
      id: 2,
      name: 'Spotify Premium',
      price: 9.99,
      category: 'subscriptions',
      type: 'Monthly Subscription',
      description: 'Ad-free music streaming',
    },
    {
      id: 3,
      name: 'Discord Nitro',
      price: 9.99,
      category: 'subscriptions',
      type: 'Monthly Subscription',
      description: 'Enhanced Discord experience',
    },
    {
      id: 4,
      name: 'Google Play Gift Card',
      price: 25.00,
      category: 'giftcards',
      type: '$25 Gift Card',
      description: 'For apps, games, and more',
    },
    {
      id: 5,
      name: 'Roblox Gift Card',
      price: 20.00,
      category: 'giftcards',
      type: '$20 Gift Card',
      description: 'Robux and premium features',
    },
    {
      id: 6,
      name: 'Steam Wallet Card',
      price: 50.00,
      category: 'giftcards',
      type: '$50 Gift Card',
      description: 'For Steam games and content',
    },
    {
      id: 7,
      name: 'Disney+ Premium',
      price: 12.99,
      category: 'subscriptions',
      type: 'Monthly Subscription',
      description: 'Disney, Marvel, Star Wars & more',
    },
    {
      id: 8,
      name: 'Xbox Gift Card',
      price: 30.00,
      category: 'giftcards',
      type: '$30 Gift Card',
      description: 'For Xbox games and content',
    }
  ];

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
      if (showSearchResults && !event.target.closest('.search-container')) {
        setShowSearchResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMobileMenuOpen, showSearchResults]);

  // Handle search functionality
  const performSearch = (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    const results = mockProducts.filter(product =>
      product.name.toLowerCase().includes(query.toLowerCase()) ||
      product.description.toLowerCase().includes(query.toLowerCase()) ||
      product.category.toLowerCase().includes(query.toLowerCase()) ||
      product.type.toLowerCase().includes(query.toLowerCase())
    );
    
    setSearchResults(results);
    setShowSearchResults(true);
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    // Perform search as user types
    if (query.length > 0) {
      performSearch(query);
    } else {
      setSearchResults([]);
      setShowSearchResults(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      console.log('Searching for:', searchQuery);
      performSearch(searchQuery);
      
      // Navigate to products page with search query
      const encodedQuery = encodeURIComponent(searchQuery.trim());
      window.location.href = `/products?search=${encodedQuery}`;
      
      // Alternative: If using React Router, use navigate instead:
      // navigate(`/products?search=${encodedQuery}`);
    }
  };

  const handleSearchResultClick = (product) => {
    console.log('Selected product:', product);
    setShowSearchResults(false);
    
    // Navigate to products page with search query
    const searchQuery = encodeURIComponent(product.name);
    window.location.href = `/products?search=${searchQuery}`;
    
    // Alternative: If using React Router, use navigate instead:
    // navigate(`/products?search=${searchQuery}`);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setShowSearchResults(false);
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
          ? 'bg-white/95 backdrop-blur-lg shadow-xl border-b border-gray-200/50' 
          : 'bg-white/90 backdrop-blur-sm shadow-lg border-b border-gray-100'
      }`}>
        {/* Premium gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/5 via-cyan-500/5 to-blue-600/5 pointer-events-none"></div>
        
        <div className="relative w-full max-w-none px-4 sm:px-6 lg:px-8 xl:px-12">
          <div className="flex items-center justify-between h-18 lg:h-20 w-full">
            
            {/* Logo Section */}
            <div className="flex items-center group min-w-0 flex-shrink-0">
              <a href="/" className="flex items-center space-x-3 sm:space-x-4">
                <div className="relative">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-500 via-cyan-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105 overflow-hidden">
                    {/* Chibi Miku Character */}
                    <div className="relative text-white text-base sm:text-lg font-bold">
                      {/* Hair */}
                      <div className="absolute -top-1 -left-1 w-5 h-4 sm:w-6 sm:h-5 bg-gradient-to-r from-cyan-300 to-cyan-400 rounded-t-full transform rotate-12"></div>
                      <div className="absolute -top-1 -right-1 w-5 h-4 sm:w-6 sm:h-5 bg-gradient-to-r from-cyan-300 to-cyan-400 rounded-t-full transform -rotate-12"></div>
                      {/* Face */}
                      <div className="w-4 h-4 sm:w-5 sm:h-5 bg-gradient-to-b from-pink-100 to-pink-200 rounded-full flex items-center justify-center">
                        {/* Eyes */}
                        <div className="flex space-x-0.5 sm:space-x-1">
                          <div className="w-0.5 h-0.5 sm:w-1 sm:h-1 bg-blue-600 rounded-full"></div>
                          <div className="w-0.5 h-0.5 sm:w-1 sm:h-1 bg-blue-600 rounded-full"></div>
                        </div>
                      </div>
                      {/* Hair accessories */}
                      <div className="absolute top-0 left-1.5 w-0.5 h-0.5 sm:w-1 sm:h-1 bg-red-400 rounded-full animate-pulse"></div>
                      <div className="absolute top-0 right-1.5 w-0.5 h-0.5 sm:w-1 sm:h-1 bg-red-400 rounded-full animate-pulse"></div>
                    </div>
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 bg-gradient-to-r from-pink-400 to-red-400 rounded-full animate-bounce">
                    <div className="w-full h-full flex items-center justify-center text-white text-xs">♪</div>
                  </div>
                </div>
                <div className="min-w-0">
                  <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-purple-600 via-cyan-600 to-blue-600 bg-clip-text text-transparent truncate">
                    Miku Miku Store
                  </h1>
                  <p className="text-sm lg:text-base text-gray-500 font-medium hidden sm:block">Digital Marketplace</p>
                </div>
              </a>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden xl:flex items-center space-x-1 flex-shrink-0">
              {navigation.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="group relative flex items-center space-x-2 px-4 lg:px-5 py-2 lg:py-3 text-gray-700 hover:text-purple-600 text-sm lg:text-base font-medium transition-all duration-300 rounded-xl hover:bg-purple-50"
                >
                  {item.icon && <item.icon className="h-4 w-4 lg:h-5 lg:w-5 group-hover:scale-110 transition-transform duration-300" />}
                  <span className="whitespace-nowrap">{item.name}</span>
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-purple-500 to-cyan-500 group-hover:w-8 transition-all duration-300 rounded-full"></div>
                </a>
              ))}
            </nav>

            {/* Search Bar */}
            <div className="hidden md:flex flex-1 max-w-md lg:max-w-lg mx-4 lg:mx-6">
              <div className="w-full search-container">
                <div className={`relative transition-all duration-300 ${
                  isSearchFocused ? 'scale-105' : 'scale-100'
                }`}>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    onFocus={() => setIsSearchFocused(true)}
                    onBlur={() => setIsSearchFocused(false)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch(e)}
                    placeholder="Search products..."
                    className={`w-full pl-12 lg:pl-14 pr-4 py-3 lg:py-3.5 text-sm lg:text-base bg-gray-50 border-2 rounded-xl lg:rounded-2xl transition-all duration-300 focus:outline-none ${
                      isSearchFocused 
                        ? 'border-purple-400 bg-white shadow-lg ring-4 ring-purple-100' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={handleSearch}
                    className={`absolute left-4 lg:left-5 top-1/2 transform -translate-y-1/2 transition-all duration-300 ${
                      isSearchFocused ? 'text-purple-500 scale-110' : 'text-gray-400'
                    }`}
                  >
                    <Search className="h-4 w-4 lg:h-5 lg:w-5" />
                  </button>
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={clearSearch}
                      className="absolute right-4 lg:right-5 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>

                {/* Search Results Dropdown */}
                {showSearchResults && (
                  <div className="absolute top-full left-0 right-0 mt-3 bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl border border-gray-200/50 py-3 z-50 max-h-80 overflow-y-auto">
                    {searchResults.length > 0 ? (
                      <>
                        <div className="px-6 py-3 text-sm text-gray-500 border-b border-gray-100">
                          {searchResults.length} result{searchResults.length !== 1 ? 's' : ''} found
                        </div>
                        {searchResults.map((product) => (
                          <button
                            key={product.id}
                            onClick={() => handleSearchResultClick(product)}
                            className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-purple-50 transition-all duration-200"
                          >
                            <div className="flex-1 min-w-0">
                              <div className="text-base font-medium text-gray-900 truncate">{product.name}</div>
                              <div className="text-sm text-gray-500 truncate">{product.description}</div>
                              <div className="text-sm text-purple-600 font-medium">{product.type}</div>
                            </div>
                            <div className="text-base font-semibold text-purple-600 ml-4">
                              ${product.price}
                            </div>
                          </button>
                        ))}
                      </>
                    ) : (
                      <div className="px-6 py-8 text-center">
                        <Search className="h-10 w-10 text-gray-300 mx-auto mb-3" />
                        <p className="text-base text-gray-500">No products found for "{searchQuery}"</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0">
              {/* Mobile Search Button */}
              <button className="md:hidden p-2 text-gray-700 hover:text-purple-600 hover:bg-purple-50 rounded-xl transition-all duration-300">
                <Search className="h-5 w-5" />
              </button>

              {/* User Menu */}
              <div className="relative">
                {isAuthenticated ? (
                  <div>
                    <button
                      onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                      className="flex items-center space-x-2 p-2 text-gray-700 hover:text-purple-600 hover:bg-purple-50 rounded-xl transition-all duration-300 focus:outline-none"
                    >
                      <div className="relative">
                        <div className="w-8 h-8 sm:w-9 sm:h-9 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-full flex items-center justify-center">
                          <User className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 border-2 border-white rounded-full"></div>
                      </div>
                      <span className="hidden lg:block text-sm font-medium max-w-20 xl:max-w-24 truncate">
                        {user?.name || user?.email}
                      </span>
                    </button>

                    {/* User Dropdown */}
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
                      className="text-gray-700 hover:text-purple-600 text-sm font-medium px-3 sm:px-4 py-2 rounded-xl hover:bg-purple-50 transition-all duration-300 whitespace-nowrap"
                    >
                      Sign In
                    </a>
                    <a
                      href="/register"
                      className="bg-gradient-to-r from-purple-600 to-cyan-600 text-white px-4 sm:px-5 py-2 rounded-xl text-sm font-medium hover:from-purple-700 hover:to-cyan-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 whitespace-nowrap"
                    >
                      Sign Up
                    </a>
                  </div>
                )}
              </div>

              {/* Shopping Cart - No notification badge */}
              <div className="relative group">
                <a
                  href="/cart"
                  className="relative p-2 text-gray-700 hover:text-purple-600 hover:bg-purple-50 rounded-xl transition-all duration-300 hover:scale-105"
                >
                  <ShoppingCart className="h-5 w-5 sm:h-6 sm:w-6 transition-all duration-300 group-hover:scale-110" />
                </a>

                {/* Cart Hover Preview */}
                <div className="hidden lg:block absolute right-0 top-full mt-2 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 pointer-events-none group-hover:pointer-events-auto z-50">
                  <div className="bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl border border-gray-200/50 p-4 w-64">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-semibold text-gray-900">Shopping Cart</h3>
                      <span className="text-xs text-gray-500">{cartItems} {cartItems === 1 ? 'item' : 'items'}</span>
                    </div>
                    
                    {cartItems > 0 ? (
                      <div className="space-y-2">
                        <div className="text-xs text-gray-600">
                          You have {cartItems} item{cartItems !== 1 ? 's' : ''} in your cart
                        </div>
                        <div className="flex justify-between pt-2 border-t border-gray-100">
                          <span className="text-sm font-medium text-gray-900">Subtotal:</span>
                          <span className="text-sm font-semibold text-purple-600">${(cartItems * 29.99).toFixed(2)}</span>
                        </div>
                        <button className="w-full bg-gradient-to-r from-purple-600 to-cyan-600 text-white py-2 px-4 rounded-xl text-sm font-medium hover:from-purple-700 hover:to-cyan-700 transition-all duration-300 mt-3">
                          View Cart
                        </button>
                      </div>
                    ) : (
                      <div className="text-center py-4">
                        <ShoppingCart className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                        <p className="text-sm text-gray-500">Your cart is empty</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="xl:hidden p-2 text-gray-700 hover:text-purple-600 hover:bg-purple-50 rounded-xl transition-all duration-300 mobile-menu-container"
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6 transition-transform duration-300" />
                ) : (
                  <Menu className="h-6 w-6 transition-transform duration-300" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMobileMenuOpen && (
            <div className="xl:hidden py-6 border-t border-gray-200/50 animate-in slide-in-from-top duration-300 mobile-menu-container">
              {/* Mobile Search */}
              <div className="px-4 pb-6 md:hidden">
                <div className="relative search-container">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch(e)}
                    placeholder="Search products..."
                    className="w-full pl-14 pr-5 py-4 bg-gray-50 border-2 border-gray-200 rounded-3xl focus:ring-4 focus:ring-purple-100 focus:border-purple-400 focus:outline-none transition-all duration-300 text-base"
                  />
                  <button 
                    type="button" 
                    onClick={handleSearch}
                    className="absolute left-5 top-1/2 transform -translate-y-1/2"
                  >
                    <Search className="h-6 w-6 text-gray-400" />
                  </button>
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={clearSearch}
                      className="absolute right-5 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  )}
                </div>

                {/* Mobile Search Results */}
                {showSearchResults && (
                  <div className="mt-3 bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl border border-gray-200/50 py-3 max-h-64 overflow-y-auto">
                    {searchResults.length > 0 ? (
                      searchResults.map((product) => (
                        <button
                          key={product.id}
                          onClick={() => {
                            handleSearchResultClick(product);
                            setIsMobileMenuOpen(false);
                          }}
                          className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-purple-50 transition-all duration-200"
                        >
                          <div className="flex-1 min-w-0">
                            <div className="text-base font-medium text-gray-900 truncate">{product.name}</div>
                            <div className="text-sm text-gray-500 truncate">{product.description}</div>
                            <div className="text-sm text-purple-600 font-medium">{product.type}</div>
                          </div>
                          <div className="text-base font-semibold text-purple-600 ml-4">
                            ${product.price}
                          </div>
                        </button>
                      ))
                    ) : (
                      <div className="px-5 py-8 text-center">
                        <Search className="h-10 w-10 text-gray-300 mx-auto mb-3" />
                        <p className="text-base text-gray-500">No products found</p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Mobile Navigation Links */}
              <nav className="flex flex-col space-y-2">
                {navigation.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center space-x-4 px-6 py-4 text-gray-700 hover:text-purple-600 hover:bg-purple-50 text-base font-medium transition-all duration-300 mx-3 rounded-2xl"
                  >
                    {item.icon && <item.icon className="h-5 w-5 flex-shrink-0" />}
                    <span>{item.name}</span>
                  </a>
                ))}
              </nav>

              {/* Mobile Auth Actions */}
              {!isAuthenticated && (
                <div className="flex flex-col space-y-3 px-8 pt-6 border-t border-gray-200/50 mt-6">
                  <a
                    href="/login"
                    className="text-center text-gray-700 hover:text-purple-600 text-base font-medium px-5 py-4 rounded-2xl hover:bg-purple-50 transition-all duration-300"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Sign In
                  </a>
                  <a
                    href="/register"
                    className="text-center bg-gradient-to-r from-purple-600 to-cyan-600 text-white px-5 py-4 rounded-2xl text-base font-medium hover:from-purple-700 hover:to-cyan-700 transition-all duration-300 shadow-lg"
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

      {/* User Menu Backdrop */}
      {isUserMenuOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsUserMenuOpen(false)}
        />
      )}

      {/* Header Spacer */}
      <div className="h-18 lg:h-20"></div>
    </>
  );
};

export default Header;
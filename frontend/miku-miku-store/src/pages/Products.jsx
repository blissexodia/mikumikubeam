import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { Filter, Grid, List, Search, SlidersHorizontal } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { productsAPI } from '../services/api';

const Products = () => {
  const { category } = useParams();
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search');

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('featured');
  const [priceRange, setPriceRange] = useState([0, 100]);
  const [selectedCategory, setSelectedCategory] = useState(category || 'all');
  const [showFilters, setShowFilters] = useState(false);

  // Mock products data - replace with API call
  const mockProducts = [
    {
      id: 1,
      name: 'Netflix Premium',
      price: 15.99,
      category: 'subscriptions',
      type: 'Monthly Subscription',
      image: 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=300&h=200&fit=crop',
      description: '4K Ultra HD, 4 screens at once',
      rating: 4.8,
      features: ['4K Ultra HD', '4 simultaneous screens', 'Download content']
    },
    {
      id: 2,
      name: 'Spotify Premium',
      price: 9.99,
      category: 'subscriptions',
      type: 'Monthly Subscription',
      image: 'https://images.unsplash.com/photo-1611339555312-e607c8352fd7?w=300&h=200&fit=crop',
      description: 'Ad-free music streaming',
      rating: 4.7,
      features: ['Ad-free listening', 'Offline downloads', 'High quality audio']
    },
    {
      id: 3,
      name: 'Discord Nitro',
      price: 9.99,
      category: 'subscriptions',
      type: 'Monthly Subscription',
      image: 'https://images.unsplash.com/photo-1614680376573-df3480f0c6ff?w=300&h=200&fit=crop',
      description: 'Enhanced Discord experience',
      rating: 4.6,
      features: ['HD video calls', 'Custom emojis', 'Server boosts']
    },
    {
      id: 4,
      name: 'Google Play Gift Card',
      price: 25.00,
      category: 'giftcards',
      type: '$25 Gift Card',
      image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=300&h=200&fit=crop',
      description: 'For apps, games, and more',
      rating: 4.9,
      features: ['Instant delivery', 'No expiration', 'Worldwide valid']
    },
    {
      id: 5,
      name: 'Roblox Gift Card',
      price: 20.00,
      category: 'giftcards',
      type: '$20 Gift Card',
      image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=300&h=200&fit=crop',
      description: 'Robux and premium features',
      rating: 4.8,
      features: ['Instant Robux', 'Premium benefits', 'Safe & secure']
    },
    {
      id: 6,
      name: 'Steam Wallet Card',
      price: 50.00,
      category: 'giftcards',
      type: '$50 Gift Card',
      image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=300&h=200&fit=crop',
      description: 'For Steam games and content',
      rating: 4.9,
      features: ['Instant delivery', 'Global acceptance', 'No fees']
    },
    {
      id: 7,
      name: 'Disney+ Premium',
      price: 12.99,
      category: 'subscriptions',
      type: 'Monthly Subscription',
      image: 'https://images.unsplash.com/photo-1489599162167-c5babf1e9a52?w=300&h=200&fit=crop',
      description: 'Disney, Marvel, Star Wars & more',
      rating: 4.5,
      features: ['4K streaming', 'Multiple profiles', 'Download content']
    },
    {
      id: 8,
      name: 'Xbox Gift Card',
      price: 30.00,
      category: 'giftcards',
      type: '$30 Gift Card',
      image: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=300&h=200&fit=crop',
      description: 'For Xbox games and content',
      rating: 4.7,
      features: ['Digital delivery', 'Games & DLC', 'Xbox Live Gold']
    }
  ];

  useEffect(() => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      let filteredProducts = mockProducts;

      // Filter by category
      if (selectedCategory !== 'all') {
        filteredProducts = filteredProducts.filter(p => p.category === selectedCategory);
      }

      // Filter by search query
      if (searchQuery) {
        filteredProducts = filteredProducts.filter(p =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.description.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }

      // Filter by price range
      filteredProducts = filteredProducts.filter(p => 
        p.price >= priceRange[0] && p.price <= priceRange[1]
      );

      // Sort products
      switch (sortBy) {
        case 'price-low':
          filteredProducts.sort((a, b) => a.price - b.price);
          break;
        case 'price-high':
          filteredProducts.sort((a, b) => b.price - a.price);
          break;
        case 'rating':
          filteredProducts.sort((a, b) => (b.rating || 0) - (a.rating || 0));
          break;
        case 'name':
          filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
          break;
        default:
          // Keep original order for 'featured'
          break;
      }

      setProducts(filteredProducts);
      setLoading(false);
    }, 500);
  }, [selectedCategory, searchQuery, priceRange, sortBy]);

  const categories = [
    { id: 'all', name: 'All Products', count: mockProducts.length },
    { id: 'subscriptions', name: 'Subscriptions', count: mockProducts.filter(p => p.category === 'subscriptions').length },
    { id: 'giftcards', name: 'Gift Cards', count: mockProducts.filter(p => p.category === 'giftcards').length }
  ];

  const getPageTitle = () => {
    if (searchQuery) return `Search Results for "${searchQuery}"`;
    if (selectedCategory === 'subscriptions') return 'Subscription Services';
    if (selectedCategory === 'giftcards') return 'Gift Cards';
    return 'All Products';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{getPageTitle()}</h1>
          <p className="text-gray-600">
            {loading ? 'Loading...' : `${products.length} products found`}
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <div className={`lg:w-64 space-y-6 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              {/* Categories */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-4">Categories</h3>
                <div className="space-y-2">
                  {categories.map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                        selectedCategory === cat.id
                          ? 'bg-indigo-100 text-indigo-700'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      {cat.name} ({cat.count})
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-4">Price Range</h3>
                <div className="px-3">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-sm text-gray-600 mt-2">
                    <span>${priceRange[0]}</span>
                    <span>${priceRange[1]}</span>
                  </div>
                </div>
              </div>

              {/* Clear Filters */}
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setPriceRange([0, 100]);
                  setSortBy('featured');
                }}
                className="w-full text-sm text-indigo-600 hover:text-indigo-700 font-medium"
              >
                Clear All Filters
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                {/* View Toggle & Filters */}
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="lg:hidden flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                  >
                    <SlidersHorizontal className="h-4 w-4 mr-2" />
                    Filters
                  </button>
                  
                  <div className="flex bg-gray-100 rounded-lg p-1">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 rounded-md ${viewMode === 'grid' ? 'bg-white shadow-sm' : ''}`}
                    >
                      <Grid className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 rounded-md ${viewMode === 'list' ? 'bg-white shadow-sm' : ''}`}
                    >
                      <List className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Sort Dropdown */}
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Sort by:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    <option value="featured">Featured</option>
                    <option value="name">Name A-Z</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Highest Rated</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, index) => (
                  <div key={index} className="bg-white rounded-lg h-80 animate-pulse"></div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-12">
                <Search className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-600">Try adjusting your filters or search terms.</p>
              </div>
            ) : (
              <div className={`grid gap-6 ${
                viewMode === 'grid' 
                  ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' 
                  : 'grid-cols-1'
              }`}>
                {products.map(product => (
                  <ProductCard 
                    key={product.id} 
                    product={product}
                    className={viewMode === 'list' ? 'flex-row' : ''}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;
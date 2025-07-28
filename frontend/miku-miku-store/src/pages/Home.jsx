import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, Users, Shield, Zap, Gift, Play } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { productsAPI } from '../services/api';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Mock featured products for now - replace with API call
  useEffect(() => {
    const mockFeaturedProducts = [
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
        id: 5,
        name: 'Roblox Gift Card',
        price: 20.00,
        category: 'giftcards',
        type: '$20 Gift Card',
        image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=300&h=200&fit=crop',
        description: 'Robux and premium features',
        rating: 4.8,
        features: ['Instant Robux', 'Premium benefits', 'Safe & secure']
      }
    ];

    // Simulate API call
    setTimeout(() => {
      setFeaturedProducts(mockFeaturedProducts);
      setLoading(false);
    }, 1000);
  }, []);

  const stats = [
    { icon: Users, value: '50,000+', label: 'Happy Customers' },
    { icon: Shield, value: '99.9%', label: 'Secure Transactions' },
    { icon: Zap, value: 'Instant', label: 'Digital Delivery' },
    { icon: Star, value: '4.9/5', label: 'Customer Rating' }
  ];

  const categories = [
    {
      name: 'Streaming Services',
      description: 'Netflix, Spotify, Disney+, and more',
      image: 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=400&h=250&fit=crop',
      link: '/products/subscriptions',
      icon: Play
    },
    {
      name: 'Gaming Gift Cards',
      description: 'Steam, Roblox, Google Play, Xbox',
      image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400&h=250&fit=crop',
      link: '/products/giftcards',
      icon: Gift
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Your Digital
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-pink-400">
                Marketplace
              </span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-200 max-w-3xl mx-auto">
              Get instant access to your favorite subscriptions and gift cards. 
              Trusted by thousands of customers worldwide.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/products"
                className="bg-white text-indigo-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition duration-200 flex items-center justify-center"
              >
                Shop Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                to="/products/subscriptions"
                className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-indigo-600 transition duration-200"
              >
                Browse Subscriptions
              </Link>
            </div>
          </div>
        </div>
        
        {/* Animated background elements */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-yellow-400 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-pink-400 rounded-full opacity-20 animate-bounce"></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-blue-400 rounded-full opacity-20 animate-ping"></div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-indigo-100 rounded-lg mb-4">
                  <stat.icon className="h-6 w-6 text-indigo-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Shop by Category
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover amazing deals on digital subscriptions and gift cards
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {categories.map((category, index) => (
              <Link
                key={index}
                to={category.link}
                className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="aspect-w-16 aspect-h-9">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="flex items-center mb-2">
                    <category.icon className="h-6 w-6 text-white mr-3" />
                    <h3 className="text-xl font-bold text-white">{category.name}</h3>
                  </div>
                  <p className="text-gray-200">{category.description}</p>
                  <div className="mt-4 flex items-center text-white">
                    <span className="text-sm font-medium">Shop Now</span>
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Featured Products
              </h2>
              <p className="text-xl text-gray-600">
                Most popular subscriptions and gift cards
              </p>
            </div>
            <Link
              to="/products"
              className="hidden md:flex items-center text-indigo-600 hover:text-indigo-700 font-medium"
            >
              View All
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, index) => (
                <div key={index} className="bg-gray-200 rounded-lg h-80 animate-pulse"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          <div className="text-center mt-8 md:hidden">
            <Link
              to="/products"
              className="inline-flex items-center text-indigo-600 hover:text-indigo-700 font-medium"
            >
              View All Products
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Miku Miku Store?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We make digital shopping simple, secure, and instant
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 rounded-full mb-6">
                <Zap className="h-8 w-8 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Instant Delivery</h3>
              <p className="text-gray-600">
                Get your digital products instantly after purchase. No waiting, no delays.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-6">
                <Shield className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">100% Secure</h3>
              <p className="text-gray-600">
                Your transactions are protected with bank-level security and encryption.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-6">
                <Users className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">24/7 Support</h3>
              <p className="text-gray-600">
                Our customer support team is always ready to help you with any questions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-indigo-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-indigo-200 mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers and start enjoying your favorite digital services today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="bg-white text-indigo-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition duration-200"
            >
              Create Account
            </Link>
            <Link
              to="/products"
              className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-indigo-600 transition duration-200"
            >
              Browse Products
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
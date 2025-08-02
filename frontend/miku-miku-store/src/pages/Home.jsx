import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  ArrowRight, 
  Star, 
  Users, 
  Shield, 
  Zap, 
  Gift, 
  Play, 
  TrendingUp, 
  Award,
  Clock,
  Sparkles,
  ChevronRight
} from 'lucide-react';

// Enhanced loading skeleton component
const ProductSkeleton = () => (
  <div className="bg-white rounded-2xl overflow-hidden shadow-lg animate-pulse">
    <div className="h-48 bg-gradient-to-r from-gray-200 to-gray-300"></div>
    <div className="p-6">
      <div className="h-4 bg-gray-200 rounded mb-2"></div>
      <div className="h-3 bg-gray-200 rounded w-2/3 mb-4"></div>
      <div className="flex justify-between items-center">
        <div className="h-6 bg-gray-200 rounded w-1/3"></div>
        <div className="h-8 bg-gray-200 rounded w-1/4"></div>
      </div>
    </div>
  </div>
);

// Simple ProductCard component (since the original import is missing)
const ProductCard = ({ product }) => (
  <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group">
    <div className="relative overflow-hidden">
      <img
        src={product.image}
        alt={product.name}
        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
      />
      {product.badge && (
        <div className="absolute top-3 left-3 bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1 rounded-full text-xs font-bold">
          {product.badge}
        </div>
      )}
      {product.discount && (
        <div className="absolute top-3 right-3 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold">
          -{product.discount}%
        </div>
      )}
    </div>
    <div className="p-6">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-indigo-600 font-medium">{product.type}</span>
        <div className="flex items-center">
          <Star className="h-4 w-4 text-yellow-400 fill-current" />
          <span className="text-sm text-gray-600 ml-1">{product.rating}</span>
        </div>
      </div>
      <h3 className="text-lg font-bold text-gray-900 mb-2">{product.name}</h3>
      <p className="text-gray-600 text-sm mb-4">{product.description}</p>
      <div className="flex justify-between items-end">
        <div className="flex flex-col space-y-1 min-w-0 flex-1 mr-3">
          <div className="flex items-center space-x-2">
            <span className="text-xl font-bold text-gray-900">${product.price}</span>
            {product.originalPrice && (
              <span className="text-sm text-gray-500 line-through">${product.originalPrice}</span>
            )}
          </div>
        </div>
        <button className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-3 py-2 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 text-sm font-medium whitespace-nowrap">
          Buy Now
        </button>
      </div>
    </div>
  </div>
);

// Enhanced hero section with parallax effect
const HeroSection = () => {
  const [scrollY, setScrollY] = useState(0);
  
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 text-white overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div 
          className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-10 animate-pulse"
          style={{ transform: `translateY(${scrollY * 0.5}px)` }}
        />
        <div 
          className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-r from-pink-400 to-yellow-400 rounded-full opacity-10 animate-pulse"
          style={{ transform: `translateY(${scrollY * -0.3}px)` }}
        />
        <div 
          className="absolute top-1/2 left-1/3 w-64 h-64 bg-gradient-to-r from-green-400 to-blue-400 rounded-full opacity-10 animate-bounce"
          style={{ transform: `translateY(${scrollY * 0.2}px)` }}
        />
      </div>

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-black/30"></div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        <div className="opacity-0 animate-pulse" style={{ animation: 'fadeInUp 1s ease-out forwards' }}>
          <h1 className="text-5xl md:text-7xl font-extrabold mb-8 leading-tight">
            Your Digital
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-pink-400 to-purple-400">
              Universe
            </span>
          </h1>
          <p className="text-xl md:text-2xl mb-12 text-gray-200 max-w-4xl mx-auto leading-relaxed">
            Experience instant access to premium subscriptions and gift cards. 
            Join our community of <span className="text-yellow-400 font-semibold">50,000+</span> happy customers worldwide.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
            <button className="group bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-10 py-5 rounded-2xl font-bold text-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-purple-500/25 flex items-center">
              <Sparkles className="mr-3 h-6 w-6" />
              Start Shopping
              <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="group border-2 border-white/50 text-white px-10 py-5 rounded-2xl font-bold text-lg hover:bg-white/10 backdrop-blur-sm transition-all duration-300 transform hover:scale-105">
              Browse Collections
            </button>
          </div>

          {/* Trust indicators */}
          <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-gray-300">
            <div className="flex items-center">
              <Shield className="h-5 w-5 mr-2 text-green-400" />
              <span>SSL Secured</span>
            </div>
            <div className="flex items-center">
              <Zap className="h-5 w-5 mr-2 text-yellow-400" />
              <span>Instant Delivery</span>
            </div>
            <div className="flex items-center">
              <Award className="h-5 w-5 mr-2 text-purple-400" />
              <span>Premium Quality</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Enhanced stats section with counters
const StatsSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [counts, setCounts] = useState({ customers: 0, transactions: 0, rating: 0 });
  const sectionRef = useRef(null);

  const stats = useMemo(() => [
    { icon: Users, target: 50000, value: counts.customers, label: 'Happy Customers', suffix: '+', color: 'text-blue-600' },
    { icon: Shield, target: 99.9, value: counts.transactions, label: 'Secure Transactions', suffix: '%', color: 'text-green-600' },
    { icon: Zap, target: 1, value: 'Instant', label: 'Digital Delivery', suffix: '', color: 'text-yellow-600' },
    { icon: Star, target: 4.9, value: counts.rating, label: 'Customer Rating', suffix: '/5', color: 'text-purple-600' }
  ], [counts]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (isVisible) {
      const duration = 2000;
      const interval = 50;
      const steps = duration / interval;

      let step = 0;
      const timer = setInterval(() => {
        step++;
        const progress = step / steps;
        
        setCounts({
          customers: Math.floor(50000 * progress),
          transactions: Math.floor(99.9 * progress * 10) / 10,
          rating: Math.floor(4.9 * progress * 10) / 10
        });

        if (step >= steps) {
          clearInterval(timer);
          setCounts({ customers: 50000, transactions: 99.9, rating: 4.9 });
        }
      }, interval);

      return () => clearInterval(timer);
    }
  }, [isVisible]);

  return (
    <section ref={sectionRef} className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center group">
              <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl mb-6 group-hover:shadow-lg transition-all duration-300 ${stat.color}`}>
                <stat.icon className="h-8 w-8" />
              </div>
              <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                {typeof stat.value === 'number' ? 
                  `${stat.value.toLocaleString()}${stat.suffix}` : 
                  stat.value
                }
              </div>
              <div className="text-sm font-medium text-gray-600 uppercase tracking-wide">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Enhanced category cards with hover effects
const CategoryCard = ({ category, index }) => (
  <button
    className="group relative overflow-hidden rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105 w-full text-left"
    style={{ animationDelay: `${index * 200}ms` }}
  >
    <div className="aspect-w-16 aspect-h-10">
      <img
        src={category.image}
        alt={category.name}
        className="w-full h-80 object-cover group-hover:scale-110 transition-transform duration-700"
      />
    </div>
    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
    <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/20 to-purple-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
    
    <div className="absolute bottom-0 left-0 right-0 p-8">
      <div className="flex items-center mb-3">
        <div className="p-2 bg-white/20 backdrop-blur-sm rounded-lg mr-4">
          <category.icon className="h-6 w-6 text-white" />
        </div>
        <h3 className="text-2xl font-bold text-white">{category.name}</h3>
      </div>
      <p className="text-gray-200 mb-4 text-lg">{category.description}</p>
      <div className="flex items-center text-white font-semibold">
        <span className="mr-2">Explore Collection</span>
        <ArrowRight className="h-5 w-5 group-hover:translate-x-2 transition-transform duration-300" />
      </div>
    </div>
  </button>
);

// Enhanced features section
const FeatureCard = ({ feature, index }) => (
  <div 
    className="group text-center p-8 bg-white rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
    style={{ animationDelay: `${index * 150}ms` }}
  >
    <div className={`inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br ${feature.gradient} rounded-2xl mb-8 group-hover:scale-110 transition-transform duration-300`}>
      <feature.icon className="h-10 w-10 text-white" />
    </div>
    <h3 className="text-2xl font-bold text-gray-900 mb-4">{feature.title}</h3>
    <p className="text-gray-600 text-lg leading-relaxed">{feature.description}</p>
  </div>
);

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Enhanced mock data
  const mockFeaturedProducts = useMemo(() => [
    {
      id: 1,
      name: 'Netflix Premium',
      price: 15.99,
      originalPrice: 19.99,
      category: 'subscriptions',
      type: 'Monthly Subscription',
      image: 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=300&h=200&fit=crop',
      description: '4K Ultra HD, 4 screens at once',
      rating: 4.8,
      reviews: 2847,
      features: ['4K Ultra HD', '4 simultaneous screens', 'Download content'],
      badge: 'Popular',
      discount: 20
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
      reviews: 1563,
      features: ['Instant delivery', 'No expiration', 'Worldwide valid'],
      badge: 'Best Seller'
    },
    {
      id: 2,
      name: 'Spotify Premium',
      price: 9.99,
      originalPrice: 12.99,
      category: 'subscriptions',
      type: 'Monthly Subscription',
      image: 'https://images.unsplash.com/photo-1611339555312-e607c8352fd7?w=300&h=200&fit=crop',
      description: 'Ad-free music streaming',
      rating: 4.7,
      reviews: 3291,
      features: ['Ad-free listening', 'Offline downloads', 'High quality audio'],
      badge: 'Limited Time',
      discount: 23
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
      reviews: 987,
      features: ['Instant Robux', 'Premium benefits', 'Safe & secure'],
      badge: 'Hot'
    }
  ], []);

  useEffect(() => {
    // Simulate API call with realistic loading time
    const timer = setTimeout(() => {
      setFeaturedProducts(mockFeaturedProducts);
      setLoading(false);
    }, 1200);

    return () => clearTimeout(timer);
  }, [mockFeaturedProducts]);

  const categories = useMemo(() => [
    {
      name: 'Streaming Services',
      description: 'Netflix, Spotify, Disney+, and premium entertainment',
      image: 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=600&h=400&fit=crop',
      icon: Play
    },
    {
      name: 'Gaming Universe',
      description: 'Steam, Roblox, Google Play, Xbox gift cards',
      image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=600&h=400&fit=crop',
      icon: Gift
    }
  ], []);

  const features = useMemo(() => [
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Get your digital products delivered instantly to your email. No waiting periods, no delays.',
      gradient: 'from-yellow-400 to-orange-500'
    },
    {
      icon: Shield,
      title: 'Bank-Level Security',
      description: 'Advanced encryption and fraud protection keep your transactions completely secure.',
      gradient: 'from-green-400 to-emerald-500'
    },
    {
      icon: Users,
      title: 'Expert Support',
      description: 'Our dedicated support team is available 24/7 to assist you with any questions.',
      gradient: 'from-purple-400 to-indigo-500'
    }
  ], []);

  return (
    <div className="min-h-screen">
      <HeroSection />
      
      <StatsSection />

      {/* Enhanced Categories Section */}
      <section className="py-24 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Explore Our
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600"> Collections</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Discover premium digital products curated for the modern lifestyle
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12">
            {categories.map((category, index) => (
              <CategoryCard key={index} category={category} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Featured Products */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-16">
            <div className="max-w-2xl">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Trending Now
              </h2>
              <p className="text-xl text-gray-600">
                Most popular products loved by our community
              </p>
            </div>
            <button className="hidden lg:flex items-center bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-2xl font-bold hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105">
              <TrendingUp className="mr-2 h-5 w-5" />
              View All
              <ArrowRight className="ml-2 h-5 w-5" />
            </button>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {[...Array(4)].map((_, index) => (
                <ProductSkeleton key={index} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {featuredProducts.map((product, index) => (
                <div 
                  key={product.id}
                  className="opacity-0"
                  style={{ 
                    animation: `fadeInUp 0.6s ease-out ${index * 100}ms forwards`
                  }}
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          )}

          <div className="text-center mt-12 lg:hidden">
            <button className="inline-flex items-center bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-2xl font-bold hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105">
              <TrendingUp className="mr-2 h-5 w-5" />
              View All Products
              <ArrowRight className="ml-2 h-5 w-5" />
            </button>
          </div>
        </div>
      </section>

      {/* Enhanced Features Section */}
      <section className="py-24 bg-gradient-to-br from-indigo-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Why Choose 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600"> Miku Store?</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Experience the future of digital commerce with our premium platform
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            {features.map((feature, index) => (
              <FeatureCard key={index} feature={feature} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced CTA Section */}
      <section className="py-24 bg-gradient-to-r from-indigo-900 via-purple-900 to-pink-900 relative overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-blue-600/10 to-purple-600/10"></div>
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-pink-400 to-yellow-400 rounded-full opacity-20 animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-20 animate-pulse"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-8">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-indigo-200 mb-12 max-w-3xl mx-auto leading-relaxed">
            Join our community of satisfied customers and unlock premium digital experiences
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <button className="group bg-white text-indigo-600 px-10 py-5 rounded-2xl font-bold text-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-2xl flex items-center">
              <Users className="mr-3 h-6 w-6" />
              Join Now
              <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="group border-2 border-white/50 text-white px-10 py-5 rounded-2xl font-bold text-lg hover:bg-white/10 backdrop-blur-sm transition-all duration-300 transform hover:scale-105 flex items-center">
              <Gift className="mr-3 h-6 w-6" />
              Start Shopping
              <ChevronRight className="ml-3 h-6 w-6 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Additional trust indicators */}
          <div className="mt-16 flex flex-wrap justify-center items-center gap-12 text-indigo-200">
            <div className="flex items-center">
              <Clock className="h-5 w-5 mr-2" />
              <span className="font-medium">24/7 Available</span>
            </div>
            <div className="flex items-center">
              <Shield className="h-5 w-5 mr-2" />
              <span className="font-medium">100% Secure</span>
            </div>
            <div className="flex items-center">
              <Award className="h-5 w-5 mr-2" />
              <span className="font-medium">Premium Quality</span>
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default Home;
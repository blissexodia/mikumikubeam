import React, { useState, useEffect } from 'react';
import { Home, ArrowLeft, Search, ShoppingBag, Star, Sparkles, Zap } from 'lucide-react';

const NotFound = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleSearch = (e) => {
    // Search functionality would go here
    console.log('Search clicked');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 relative overflow-hidden flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div 
          className="absolute w-96 h-96 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-10 animate-pulse"
          style={{ 
            left: `${20 + mousePosition.x * 0.02}%`,
            top: `${10 + mousePosition.y * 0.02}%`,
            transform: 'translate(-50%, -50%)'
          }}
        />
        <div 
          className="absolute w-80 h-80 bg-gradient-to-r from-pink-400 to-yellow-400 rounded-full opacity-10 animate-pulse"
          style={{ 
            right: `${15 + mousePosition.x * 0.015}%`,
            bottom: `${20 + mousePosition.y * 0.015}%`,
            transform: 'translate(50%, 50%)'
          }}
        />
        <div 
          className="absolute w-64 h-64 bg-gradient-to-r from-green-400 to-blue-400 rounded-full opacity-10 animate-bounce"
          style={{ 
            left: `${60 + mousePosition.x * 0.01}%`,
            top: `${70 + mousePosition.y * 0.01}%`,
            transform: 'translate(-50%, -50%)'
          }}
        />
        
        {/* Floating particles */}
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white rounded-full opacity-20 animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-black/20"></div>

      <div className="relative z-10 max-w-2xl w-full text-center">
        {/* Animated 404 Illustration */}
        <div className="mb-12 relative">
          <div className="relative inline-block">
            <div className="text-8xl md:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-pink-400 to-purple-400 mb-6 animate-pulse">
              404
            </div>
            <div className="absolute -top-4 -right-4">
              <Star className="h-8 w-8 text-yellow-400 animate-spin" />
            </div>
            <div className="absolute -bottom-2 -left-2">
              <Sparkles className="h-6 w-6 text-pink-400 animate-bounce" />
            </div>
            <div className="absolute top-1/2 -right-8">
              <Zap className="h-7 w-7 text-purple-400 animate-pulse" />
            </div>
          </div>
          <div className="w-32 h-2 bg-gradient-to-r from-yellow-400 to-pink-400 mx-auto rounded-full shadow-lg"></div>
        </div>

        {/* Error Message with Enhanced Typography */}
        <div className="mb-12 text-white">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
            Oops! Lost in the
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-pink-400">
              Digital Universe
            </span>
          </h1>
          <p className="text-xl text-gray-200 mb-8 leading-relaxed max-w-lg mx-auto">
            The page you're looking for has wandered off into cyberspace. 
            But don't worry – we'll help you find your way back to amazing deals!
          </p>
        </div>

        {/* Enhanced Action Buttons */}
        <div className="space-y-6 mb-12">
          <button className="group w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 px-8 rounded-2xl font-bold text-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-purple-500/25 flex items-center justify-center">
            <Home className="h-6 w-6 mr-3" />
            Return to Homepage
            <div className="ml-3 w-2 h-2 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity animate-pulse"></div>
          </button>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button className="group bg-white/10 backdrop-blur-lg text-white py-3 px-6 rounded-xl font-semibold border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105 flex items-center justify-center">
              <ShoppingBag className="h-5 w-5 mr-2" />
              Explore Products
              <ArrowLeft className="h-4 w-4 ml-2 rotate-180 group-hover:translate-x-1 transition-transform" />
            </button>
            
            <button
              onClick={() => window.history.back()}
              className="group bg-white/10 backdrop-blur-lg text-white py-3 px-6 rounded-xl font-semibold border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105 flex items-center justify-center"
            >
              <ArrowLeft className="h-5 w-5 mr-2 group-hover:-translate-x-1 transition-transform" />
              Go Back
            </button>
          </div>
        </div>

        {/* Enhanced Search Section */}
        <div className="mb-12 p-6 bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 shadow-2xl">
          <div className="flex items-center justify-center mb-4">
            <Search className="h-6 w-6 text-yellow-400 mr-2" />
            <p className="text-white font-semibold">
              Looking for something specific?
            </p>
          </div>
          <div className="flex">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search our amazing products..."
                className="w-full pl-12 pr-4 py-3 bg-white/90 backdrop-blur-sm border-0 rounded-l-xl focus:ring-2 focus:ring-yellow-400 focus:outline-none text-gray-800 placeholder-gray-500"
              />
            </div>
            <button 
              onClick={handleSearch}
              className="bg-gradient-to-r from-yellow-400 to-pink-400 text-white px-6 py-3 rounded-r-xl hover:from-yellow-500 hover:to-pink-500 transition-all duration-300 transform hover:scale-105 font-semibold"
            >
              Search
            </button>
          </div>
        </div>

        {/* Enhanced Popular Links */}
        <div className="mb-8">
          <p className="text-gray-200 mb-6 text-lg font-medium">Or explore these popular collections:</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { name: 'Streaming', gradient: 'from-red-400 to-pink-400' },
              { name: 'Gaming', gradient: 'from-blue-400 to-purple-400' },
              { name: 'Gift Cards', gradient: 'from-green-400 to-blue-400' },
              { name: 'Premium', gradient: 'from-yellow-400 to-orange-400' }
            ].map((item, index) => (
              <button
                key={index}
                className={`group bg-gradient-to-r ${item.gradient} text-white font-semibold py-3 px-4 rounded-xl hover:shadow-lg transition-all duration-300 transform hover:scale-105`}
              >
                {item.name}
              </button>
            ))}
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-3 gap-6 mb-8">
          <div className="text-center">
            <div className="text-2xl font-bold text-white mb-1">50K+</div>
            <div className="text-sm text-gray-300">Happy Users</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-white mb-1">99.9%</div>
            <div className="text-sm text-gray-300">Uptime</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-white mb-1">24/7</div>
            <div className="text-sm text-gray-300">Support</div>
          </div>
        </div>

        {/* Enhanced Help Text */}
        <div className="text-gray-300">
          <p className="text-sm leading-relaxed">
            Still can't find what you're looking for? Our{' '}
            <button className="text-yellow-400 hover:text-yellow-300 underline font-semibold transition-colors">
              support heroes
            </button>{' '}
            are standing by to help you navigate the digital cosmos.
          </p>
        </div>
      </div>

      {/* Custom CSS for additional animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default NotFound;
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, ShoppingCart, Heart, Zap, Gift, Check, Sparkles } from 'lucide-react';
import { useCart } from '../contexts/CartContext';

const ProductCard = ({ product, className = '' }) => {
  const { addToCart, isInCart } = useCart();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleAddToCart = (e) => {
    e.preventDefault(); // Prevent link navigation
    addToCart(product);
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    setIsWishlisted(!isWishlisted);
    // Add wishlist functionality here
  };

  const getCategoryConfig = (category) => {
    switch (category) {
      case 'subscriptions':
        return {
          icon: Zap,
          label: 'Subscription',
          gradient: 'from-purple-500 to-cyan-500',
          bg: 'from-purple-50 to-cyan-50',
          text: 'from-purple-600 to-cyan-600',
          border: 'border-purple-200/50'
        };
      case 'giftcards':
        return {
          icon: Gift,
          label: 'Gift Card',
          gradient: 'from-pink-500 to-red-500',
          bg: 'from-pink-50 to-red-50',
          text: 'from-pink-600 to-red-600',
          border: 'border-pink-200/50'
        };
      default:
        return {
          icon: Sparkles,
          label: 'Product',
          gradient: 'from-blue-500 to-indigo-500',
          bg: 'from-blue-50 to-indigo-50',
          text: 'from-blue-600 to-indigo-600',
          border: 'border-blue-200/50'
        };
    }
  };

  const categoryConfig = getCategoryConfig(product.category);
  const CategoryIcon = categoryConfig.icon;

  return (
    <div 
      className={`relative bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 overflow-hidden hover:shadow-2xl hover:border-purple-200/50 transition-all duration-500 group transform hover:scale-[1.02] ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Premium gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 via-cyan-500/5 to-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
      
      <Link to={`/product/${product.id}`} className="block relative z-10">
        {/* Enhanced Product Image Section */}
        <div className="relative overflow-hidden rounded-t-2xl">
          <div className="aspect-w-16 aspect-h-10 bg-gradient-to-br from-gray-100 to-gray-200">
            <img 
              src={product.image} 
              alt={product.name}
              className="w-full h-48 sm:h-52 lg:h-48 object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
            />
          </div>
          
          {/* Floating gradient overlay on hover */}
          <div className={`absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
          
          {/* Enhanced Wishlist Button */}
          <button 
            onClick={handleWishlist}
            className={`absolute top-3 sm:top-4 right-3 sm:right-4 p-2 sm:p-2.5 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg transition-all duration-300 ${
              isHovered ? 'opacity-100 scale-110' : 'opacity-0 scale-95'
            } ${isWishlisted ? 'bg-red-50 text-red-500' : 'text-gray-600 hover:text-red-500'}`}
          >
            <Heart className={`h-4 w-4 sm:h-5 sm:w-5 transition-all duration-300 ${isWishlisted ? 'fill-current scale-110' : ''}`} />
          </button>

          {/* Enhanced Category Badge */}
          <div className="absolute top-3 sm:top-4 left-3 sm:left-4">
            <div className={`flex items-center space-x-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl bg-gradient-to-r ${categoryConfig.bg} backdrop-blur-sm border ${categoryConfig.border} shadow-sm`}>
              <CategoryIcon className={`h-3 w-3 sm:h-4 sm:w-4 bg-gradient-to-r ${categoryConfig.text} bg-clip-text text-transparent`} />
              <span className={`text-xs sm:text-sm font-semibold bg-gradient-to-r ${categoryConfig.text} bg-clip-text text-transparent`}>
                {categoryConfig.label}
              </span>
            </div>
          </div>

          {/* Sale Badge (if applicable) */}
          {product.originalPrice && product.originalPrice > product.price && (
            <div className="absolute bottom-3 sm:bottom-4 right-3 sm:right-4">
              <div className="px-2 sm:px-3 py-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs sm:text-sm font-bold rounded-full shadow-lg animate-pulse">
                -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
              </div>
            </div>
          )}
        </div>

        {/* Enhanced Product Info */}
        <div className="p-4 sm:p-6">
          {/* Type and Rating */}
          <div className="flex items-center justify-between mb-2 sm:mb-3">
            <span className="text-xs sm:text-sm text-gray-500 font-medium bg-gray-100 px-2 py-1 rounded-lg">
              {product.type}
            </span>
            {product.rating && (
              <div className="flex items-center space-x-1 bg-yellow-50 px-2 py-1 rounded-lg">
                <Star className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-500 fill-current" />
                <span className="text-xs sm:text-sm text-yellow-700 font-semibold">{product.rating}</span>
              </div>
            )}
          </div>

          {/* Enhanced Product Name */}
          <h3 className="text-base sm:text-lg lg:text-xl font-bold text-gray-900 mb-2 sm:mb-3 group-hover:bg-gradient-to-r group-hover:from-purple-600 group-hover:to-cyan-600 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300 line-clamp-2">
            {product.name}
          </h3>

          {/* Enhanced Description */}
          <p className="text-gray-600 text-xs sm:text-sm mb-4 sm:mb-5 line-clamp-2 leading-relaxed">
            {product.description}
          </p>

          {/* Enhanced Price Section */}
          <div className="mb-4">
            <div className="flex items-baseline space-x-2 mb-3">
              <span className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-purple-600 to-cyan-600 bg-clip-text text-transparent">
                ${product.price}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-sm sm:text-base text-gray-400 line-through">
                  ${product.originalPrice}
                </span>
              )}
            </div>
            
            {/* Add to Cart Button - Full Width */}
            <button
              onClick={handleAddToCart}
              className={`w-full flex items-center justify-center space-x-2 px-4 py-2.5 sm:py-3 rounded-xl font-semibold text-sm sm:text-base transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 ${
                isInCart(product.id)
                  ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white'
                  : 'bg-gradient-to-r from-purple-600 to-cyan-600 text-white hover:from-purple-700 hover:to-cyan-700'
              }`}
            >
              {isInCart(product.id) ? (
                <>
                  <Check className="h-4 w-4" />
                  <span>Added to Cart</span>
                </>
              ) : (
                <>
                  <ShoppingCart className="h-4 w-4" />
                  <span>Add to Cart</span>
                </>
              )}
            </button>
          </div>

          {/* Enhanced Features Section */}
          {product.features && product.features.length > 0 && (
            <div className="pt-4 border-t border-gray-200/50">
              <div className="space-y-2">
                {product.features.slice(0, 2).map((feature, index) => (
                  <div 
                    key={index} 
                    className="flex items-center space-x-2 text-xs sm:text-sm text-gray-600 group-hover:text-gray-700 transition-colors duration-300"
                  >
                    <div className="w-1.5 h-1.5 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full flex-shrink-0"></div>
                    <span className="truncate">{feature}</span>
                  </div>
                ))}
                {product.features.length > 2 && (
                  <div className="text-xs text-purple-600 font-medium">
                    +{product.features.length - 2} more features
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </Link>

      {/* Premium hover effect border */}
      <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-gradient-to-r group-hover:from-purple-400/50 group-hover:to-cyan-400/50 transition-all duration-500 pointer-events-none"></div>
    </div>
  );
};

export default ProductCard;
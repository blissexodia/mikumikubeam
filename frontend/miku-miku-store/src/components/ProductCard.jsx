import React from 'react';
import { Link } from 'react-router-dom';
import { Star, ShoppingCart, Heart } from 'lucide-react';
import { useCart } from '../contexts/CartContext';

const ProductCard = ({ product, className = '' }) => {
  const { addToCart, isInCart } = useCart();

  const handleAddToCart = (e) => {
    e.preventDefault(); // Prevent link navigation
    addToCart(product);
  };

  return (
    <div className={`bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-200 group ${className}`}>
      <Link to={`/product/${product.id}`} className="block">
        {/* Product Image */}
        <div className="relative overflow-hidden">
          <img 
            src={product.image} 
            alt={product.name}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-200"
          />
          
          {/* Wishlist Button */}
          <button 
            onClick={(e) => {
              e.preventDefault();
              // Add wishlist functionality here
            }}
            className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-gray-50"
          >
            <Heart className="h-4 w-4 text-gray-600" />
          </button>

          {/* Category Badge */}
          <div className="absolute top-3 left-3">
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
              product.category === 'subscriptions' 
                ? 'bg-blue-100 text-blue-800' 
                : 'bg-green-100 text-green-800'
            }`}>
              {product.category === 'subscriptions' ? 'Subscription' : 'Gift Card'}
            </span>
          </div>
        </div>

        {/* Product Info */}
        <div className="p-6">
          {/* Type and Rating */}
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-500 font-medium">{product.type}</span>
            {product.rating && (
              <div className="flex items-center">
                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                <span className="text-sm text-gray-600 ml-1">{product.rating}</span>
              </div>
            )}
          </div>

          {/* Product Name */}
          <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">
            {product.name}
          </h3>

          {/* Description */}
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {product.description}
          </p>

          {/* Price and Actions */}
          <div className="flex items-center justify-between">
            <div>
              <span className="text-2xl font-bold text-gray-900">
                ${product.price}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-sm text-gray-500 line-through ml-2">
                  ${product.originalPrice}
                </span>
              )}
            </div>
            
            <button
              onClick={handleAddToCart}
              className={`flex items-center px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                isInCart(product.id)
                  ? 'bg-green-100 text-green-700 hover:bg-green-200'
                  : 'bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-md'
              }`}
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              {isInCart(product.id) ? 'In Cart' : 'Add to Cart'}
            </button>
          </div>

          {/* Additional Info */}
          {product.features && product.features.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <ul className="text-xs text-gray-600 space-y-1">
                {product.features.slice(0, 2).map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <span className="w-1 h-1 bg-gray-400 rounded-full mr-2"></span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
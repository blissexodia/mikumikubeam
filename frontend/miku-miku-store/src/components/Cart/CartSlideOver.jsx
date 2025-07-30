import React from 'react';
import { Link } from 'react-router-dom';
import { X, Plus, Minus, ShoppingBag, Trash2, Heart } from 'lucide-react';
import { useCart } from '../../contexts/CartContext';

const CartSlideOver = ({ isOpen, onClose }) => {
  const { items, updateQuantity, removeFromCart, getTotalPrice, getTotalItems } = useCart();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Enhanced Backdrop with glassmorphism */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-all duration-300"
        onClick={onClose}
      />
      
      {/* Enhanced Slide over panel */}
      <div className="absolute right-0 top-0 h-full w-full max-w-md sm:max-w-lg bg-white/95 backdrop-blur-lg shadow-2xl border-l border-gray-200/50 animate-in slide-in-from-right duration-300">
        {/* Premium gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 via-cyan-500/5 to-blue-600/5 pointer-events-none"></div>
        
        <div className="relative flex h-full flex-col">
          {/* Enhanced Header */}
          <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200/50 bg-white/80 backdrop-blur-sm">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-xl flex items-center justify-center">
                <ShoppingBag className="h-4 w-4 text-white" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-purple-600 via-cyan-600 to-blue-600 bg-clip-text text-transparent">
                  Shopping Cart
                </h2>
                <p className="text-xs sm:text-sm text-gray-500 font-medium">
                  {getTotalItems()} {getTotalItems() === 1 ? 'item' : 'items'}
                </p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-xl transition-all duration-300 group"
            >
              <X className="h-5 w-5 sm:h-6 sm:w-6 group-hover:rotate-90 transition-transform duration-300" />
            </button>
          </div>

          {/* Enhanced Cart Items */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 custom-scrollbar">
            {items.length === 0 ? (
              <div className="text-center py-12 sm:py-16">
                <div className="relative mb-6">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-purple-100 to-cyan-100 rounded-full flex items-center justify-center mx-auto">
                    <ShoppingBag className="h-8 w-8 sm:h-10 sm:w-10 text-purple-400" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-pink-400 to-red-400 rounded-full flex items-center justify-center animate-bounce">
                    <Heart className="h-4 w-4 text-white" />
                  </div>
                </div>
                <p className="text-gray-600 text-lg sm:text-xl font-semibold mb-2">Your cart is empty</p>
                <p className="text-gray-400 text-sm sm:text-base mb-8">Discover amazing digital products and subscriptions</p>
                <Link
                  to="/products"
                  onClick={onClose}
                  className="inline-block bg-gradient-to-r from-purple-600 to-cyan-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-medium hover:from-purple-700 hover:to-cyan-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  Start Shopping
                </Link>
              </div>
            ) : (
              <div className="space-y-4 sm:space-y-6">
                {items.map((item, index) => (
                  <div 
                    key={item.id} 
                    className="group relative bg-white/60 backdrop-blur-sm border border-gray-200/50 p-4 sm:p-5 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 hover:border-purple-200 animate-in slide-in-from-right"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    {/* Premium item card design */}
                    <div className="flex items-start space-x-4">
                      <div className="relative flex-shrink-0">
                        <img 
                          src={item.image} 
                          alt={item.name}
                          className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-xl shadow-md group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs font-bold">✓</span>
                        </div>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <div className="min-w-0 flex-1">
                            <h4 className="font-semibold text-gray-900 truncate text-sm sm:text-base group-hover:text-purple-600 transition-colors duration-300">
                              {item.name}
                            </h4>
                            <p className="text-xs sm:text-sm text-gray-500 font-medium">{item.type}</p>
                          </div>
                          <button 
                            onClick={() => removeFromCart(item.id)}
                            className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-300 group-hover:scale-110"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <p className="text-lg sm:text-xl font-bold bg-gradient-to-r from-purple-600 to-cyan-600 bg-clip-text text-transparent">
                            ${item.price}
                          </p>
                          
                          {/* Enhanced Quantity Controls */}
                          <div className="flex items-center space-x-2 bg-gray-100/80 rounded-xl p-1">
                            <button 
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="p-1.5 text-gray-500 hover:text-purple-600 hover:bg-white rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                              disabled={item.quantity <= 1}
                            >
                              <Minus className="h-3 w-3 sm:h-4 sm:w-4" />
                            </button>
                            <span className="text-sm sm:text-base font-semibold text-gray-900 min-w-[2ch] text-center px-2">
                              {item.quantity}
                            </span>
                            <button 
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="p-1.5 text-gray-500 hover:text-purple-600 hover:bg-white rounded-lg transition-all duration-300"
                            >
                              <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Enhanced Footer */}
          {items.length > 0 && (
            <div className="border-t border-gray-200/50 p-4 sm:p-6 space-y-4 sm:space-y-6 bg-white/80 backdrop-blur-sm">
              {/* Total Section */}
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-cyan-50 rounded-2xl border border-purple-200/50">
                <div>
                  <p className="text-sm text-gray-600 font-medium">Total Amount</p>
                  <p className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-600 to-cyan-600 bg-clip-text text-transparent">
                    ${getTotalPrice().toFixed(2)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">
                    {getTotalItems()} {getTotalItems() === 1 ? 'item' : 'items'}
                  </p>
                  <p className="text-xs text-green-600 font-medium">Free shipping included</p>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="space-y-3">
                <Link
                  to="/cart"
                  onClick={onClose}
                  className="w-full bg-white/80 backdrop-blur-sm text-gray-700 py-3 sm:py-4 px-4 rounded-xl font-semibold hover:bg-gray-50 hover:text-purple-600 transition-all duration-300 border border-gray-200 hover:border-purple-200 text-center block group"
                >
                  <span className="group-hover:translate-x-1 transition-transform duration-300 inline-block">
                    View Full Cart
                  </span>
                </Link>
                <Link
                  to="/checkout"
                  onClick={onClose}
                  className="w-full bg-gradient-to-r from-purple-600 to-cyan-600 text-white py-3 sm:py-4 px-4 rounded-xl font-semibold hover:from-purple-700 hover:to-cyan-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 text-center block"
                >
                  Proceed to Checkout
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Custom scrollbar styles */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #8b5cf6, #06b6d4);
          border-radius: 2px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #7c3aed, #0891b2);
        }
      `}</style>
    </div>
  );
};

export default CartSlideOver;
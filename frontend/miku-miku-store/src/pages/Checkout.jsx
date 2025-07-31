import React, { useMemo, useCallback, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Plus, 
  Minus, 
  X, 
  ShoppingBag, 
  ArrowLeft, 
  Shield, 
  Truck, 
  CreditCard,
  Heart,
  AlertCircle,
  CheckCircle2,
  Timer
} from 'lucide-react';
import { useCart } from '../contexts/cartContext';

// Toast notification component
const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor = type === 'success' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200';
  const textColor = type === 'success' ? 'text-green-800' : 'text-red-800';
  const Icon = type === 'success' ? CheckCircle2 : AlertCircle;

  return (
    <div className={`fixed top-4 right-4 ${bgColor} border ${textColor} px-4 py-3 rounded-lg shadow-lg z-50 flex items-center space-x-2 animate-slide-in`}>
      <Icon className="h-5 w-5" />
      <span className="text-sm font-medium">{message}</span>
      <button onClick={onClose} className="ml-2">
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};

// Loading spinner component
const LoadingSpinner = ({ size = 'sm' }) => {
  const sizeClass = size === 'sm' ? 'h-4 w-4' : 'h-8 w-8';
  return (
    <div className={`animate-spin rounded-full border-2 border-gray-300 border-t-indigo-600 ${sizeClass}`} />
  );
};

// Empty cart component with enhanced visuals
const EmptyCart = () => (
  <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12">
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center">
        <div className="relative">
          <ShoppingBag className="h-32 w-32 text-gray-300 mx-auto mb-6" />
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 opacity-10 rounded-full blur-3xl" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Your cart is empty</h1>
        <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
          Discover amazing products and add them to your cart to get started.
        </p>
        <Link
          to="/products"
          className="inline-flex items-center bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Start Shopping
        </Link>
      </div>
    </div>
  </div>
);

// Enhanced quantity control with loading states
const QuantityControl = ({ item, onUpdateQuantity, isUpdating }) => (
  <div className="flex items-center space-x-3">
    <span className="text-sm text-gray-600 font-medium">Qty:</span>
    <div className="flex items-center space-x-1 bg-gray-50 rounded-xl p-1 border">
      <button
        onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-white rounded-lg transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={item.quantity <= 1 || isUpdating}
        aria-label="Decrease quantity"
      >
        <Minus className="h-4 w-4" />
      </button>
      <div className="flex items-center justify-center min-w-[3rem] px-2">
        {isUpdating ? (
          <LoadingSpinner />
        ) : (
          <span className="text-sm font-semibold text-gray-900">
            {item.quantity}
          </span>
        )}
      </div>
      <button
        onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-white rounded-lg transition-all duration-150 disabled:opacity-50"
        disabled={isUpdating}
        aria-label="Increase quantity"
      >
        <Plus className="h-4 w-4" />
      </button>
    </div>
  </div>
);

// Enhanced cart item features with better styling
const CartItemFeatures = ({ features }) => {
  if (!features?.length) return null;
  
  return (
    <div className="mb-4">
      <div className="flex flex-wrap gap-2">
        {features.slice(0, 3).map((feature, index) => (
          <span
            key={index}
            className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-200"
          >
            {feature}
          </span>
        ))}
        {features.length > 3 && (
          <span className="text-xs text-gray-500 py-1">
            +{features.length - 3} more
          </span>
        )}
      </div>
    </div>
  );
};

// Enhanced cart item with animations and better UX
const CartItem = ({ item, onUpdateQuantity, onRemoveItem, onSaveForLater, isUpdating, isRemoving }) => {
  const itemTotal = useMemo(() => (item.price * item.quantity).toFixed(2), [item.price, item.quantity]);
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <div className={`p-6 transition-all duration-300 ${isRemoving ? 'opacity-50 scale-95' : 'opacity-100 scale-100'}`}>
      <div className="flex items-start space-x-4">
        {/* Product Image with loading state */}
        <div className="relative w-24 h-24 flex-shrink-0">
          {!imageLoaded && (
            <div className="absolute inset-0 bg-gray-200 rounded-lg animate-pulse flex items-center justify-center">
              <div className="w-6 h-6 bg-gray-300 rounded" />
            </div>
          )}
          <img
            src={item.image}
            alt={item.name}
            className={`w-24 h-24 object-cover rounded-lg transition-opacity duration-300 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            loading="lazy"
            onLoad={() => setImageLoaded(true)}
          />
        </div>

        {/* Product Details */}
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-semibold text-gray-900 leading-tight">
              <Link 
                to={`/product/${item.id}`}
                className="hover:text-indigo-600 transition-colors duration-200"
              >
                {item.name}
              </Link>
            </h3>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => onSaveForLater(item.id)}
                className="p-1 text-gray-400 hover:text-red-500 transition-colors duration-200"
                aria-label="Save for later"
              >
                <Heart className="h-4 w-4" />
              </button>
              <button
                onClick={() => onRemoveItem(item.id)}
                className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-all duration-200"
                aria-label={`Remove ${item.name} from cart`}
                disabled={isRemoving}
              >
                {isRemoving ? <LoadingSpinner /> : <X className="h-5 w-5" />}
              </button>
            </div>
          </div>
          
          <p className="text-sm text-gray-600 mb-1 font-medium">{item.type}</p>
          <p className="text-sm text-gray-500 mb-3 line-clamp-2">{item.description}</p>

          <CartItemFeatures features={item.features} />

          {/* Quantity and Price Controls */}
          <div className="flex items-center justify-between flex-wrap gap-4">
            <QuantityControl 
              item={item} 
              onUpdateQuantity={onUpdateQuantity} 
              isUpdating={isUpdating === item.id}
            />

            {/* Price Display */}
            <div className="text-right">
              <div className="text-xl font-bold text-gray-900">
                ${itemTotal}
              </div>
              <div className="text-sm text-gray-500">
                ${item.price.toFixed(2)} each
              </div>
            </div>
          </div>

          {/* Stock indicator */}
          {item.stock && item.stock < 10 && (
            <div className="mt-3 flex items-center space-x-1 text-xs text-amber-600">
              <Timer className="h-3 w-3" />
              <span>Only {item.stock} left in stock</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Enhanced order summary with discount calculations
const OrderSummary = ({ totalItems, totalPrice, onApplyPromo }) => {
  const [promoCode, setPromoCode] = useState('');
  const [isApplyingPromo, setIsApplyingPromo] = useState(false);
  const [appliedPromo, setAppliedPromo] = useState(null);
  
  const shipping = 0;
  const tax = useMemo(() => (parseFloat(totalPrice) * 0.08).toFixed(2), [totalPrice]);
  const discount = appliedPromo ? (parseFloat(totalPrice) * appliedPromo.percentage / 100).toFixed(2) : 0;
  const finalTotal = useMemo(() => {
    return (parseFloat(totalPrice) + parseFloat(tax) + shipping - parseFloat(discount)).toFixed(2);
  }, [totalPrice, tax, discount]);

  const handlePromoSubmit = useCallback(async (e) => {
    e.preventDefault();
    if (!promoCode.trim()) return;
    
    setIsApplyingPromo(true);
    
    // Simulate API call
    setTimeout(() => {
      if (promoCode.toUpperCase() === 'SAVE10') {
        setAppliedPromo({ code: promoCode, percentage: 10 });
        onApplyPromo?.('Promo code applied successfully!', 'success');
      } else {
        onApplyPromo?.('Invalid promo code', 'error');
      }
      setIsApplyingPromo(false);
    }, 1000);
  }, [promoCode, onApplyPromo]);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 sticky top-8 border">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>

      {/* Order Details */}
      <div className="space-y-4 mb-6">
        <div className="flex justify-between items-center">
          <span className="text-gray-600">
            Subtotal ({totalItems} {totalItems === 1 ? 'item' : 'items'})
          </span>
          <span className="font-semibold text-lg">${totalPrice}</span>
        </div>
        
        {appliedPromo && (
          <div className="flex justify-between items-center text-green-600">
            <span className="flex items-center">
              <CheckCircle2 className="h-4 w-4 mr-1" />
              Discount ({appliedPromo.code})
            </span>
            <span className="font-semibold">-${discount}</span>
          </div>
        )}
        
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Shipping</span>
          <span className="font-semibold text-green-600">
            {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
          </span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Tax</span>
          <span className="font-semibold">${tax}</span>
        </div>
        
        <div className="border-t border-gray-200 pt-4">
          <div className="flex justify-between items-center">
            <span className="text-xl font-bold text-gray-900">Total</span>
            <span className="text-xl font-bold text-gray-900">${finalTotal}</span>
          </div>
        </div>
      </div>

      {/* Checkout Button */}
      <Link
        to="/checkout"
        className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 px-6 rounded-xl font-bold hover:from-indigo-700 hover:to-purple-700 focus:ring-4 focus:ring-indigo-200 transition-all duration-200 block text-center mb-6 transform hover:scale-105 shadow-lg"
      >
        Proceed to Checkout
      </Link>

      {/* Security Features */}
      <div className="space-y-3 text-sm text-gray-600 mb-6 bg-gray-50 rounded-lg p-4">
        <div className="flex items-center">
          <Shield className="h-4 w-4 mr-3 text-green-500 flex-shrink-0" />
          <span>256-bit SSL encryption</span>
        </div>
        <div className="flex items-center">
          <Truck className="h-4 w-4 mr-3 text-blue-500 flex-shrink-0" />
          <span>Free instant delivery</span>
        </div>
        <div className="flex items-center">
          <CreditCard className="h-4 w-4 mr-3 text-purple-500 flex-shrink-0" />
          <span>Secure payment options</span>
        </div>
      </div>

      {/* Promo Code */}
      <div className="pt-6 border-t border-gray-200">
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Promo Code</h3>
        <form onSubmit={handlePromoSubmit} className="flex space-x-2">
          <input
            type="text"
            placeholder="Enter promo code"
            value={promoCode}
            onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
            disabled={isApplyingPromo}
          />
          <button 
            type="submit"
            disabled={isApplyingPromo || !promoCode.trim()}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed min-w-[4rem] flex items-center justify-center"
          >
            {isApplyingPromo ? <LoadingSpinner /> : 'Apply'}
          </button>
        </form>
        <p className="text-xs text-gray-500 mt-2">Try code: SAVE10</p>
      </div>
    </div>
  );
};

// Enhanced recommended products with better interactions
const RecommendedProducts = ({ onAddToCart }) => {
  const recommendedItems = useMemo(() => [
    {
      id: 'disney-plus',
      name: 'Disney+ Premium',
      price: 12.99,
      originalPrice: 15.99,
      image: 'https://images.unsplash.com/photo-1489599162167-c5babf1e9a52?w=60&h=60&fit=crop',
      rating: 4.8
    },
    {
      id: 'xbox-gift',
      name: 'Xbox Gift Card',
      price: 30.00,
      image: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=60&h=60&fit=crop',
      rating: 4.9
    }
  ], []);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mt-6 border">
      <h3 className="text-lg font-bold text-gray-900 mb-4">You might also like</h3>
      <div className="space-y-4">
        {recommendedItems.map((item) => (
          <div key={item.id} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200">
            <img
              src={item.image}
              alt={item.name}
              className="w-14 h-14 object-cover rounded-lg flex-shrink-0"
              loading="lazy"
            />
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-semibold text-gray-900 truncate">{item.name}</h4>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-bold text-gray-900">${item.price.toFixed(2)}</span>
                {item.originalPrice && (
                  <span className="text-xs text-gray-500 line-through">${item.originalPrice.toFixed(2)}</span>
                )}
              </div>
              {item.rating && (
                <div className="flex items-center mt-1">
                  <span className="text-xs text-yellow-500">★</span>
                  <span className="text-xs text-gray-600 ml-1">{item.rating}</span>
                </div>
              )}
            </div>
            <button 
              onClick={() => onAddToCart(item)}
              className="text-xs bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-3 py-2 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 font-semibold"
            >
              Add
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

// Main Cart component with enhanced state management
const Cart = () => {
  const { items, updateQuantity, removeFromCart, getTotalPrice, getTotalItems, clearCart } = useCart();
  const [updatingItems, setUpdatingItems] = useState(new Set());
  const [removingItems, setRemovingItems] = useState(new Set());
  const [toast, setToast] = useState(null);

  // Memoize expensive calculations
  const totalPrice = useMemo(() => getTotalPrice().toFixed(2), [getTotalPrice]);
  const totalItems = useMemo(() => getTotalItems(), [getTotalItems]);

  // Enhanced quantity update with loading state
  const handleUpdateQuantity = useCallback(async (id, quantity) => {
    setUpdatingItems(prev => new Set(prev).add(id));
    
    // Simulate API delay
    setTimeout(() => {
      updateQuantity(id, Math.max(1, quantity));
      setUpdatingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    }, 300);
  }, [updateQuantity]);

  // Enhanced remove with loading state and confirmation
  const handleRemoveItem = useCallback(async (id) => {
    const item = items.find(item => item.id === id);
    if (!item) return;

    if (window.confirm(`Remove "${item.name}" from your cart?`)) {
      setRemovingItems(prev => new Set(prev).add(id));
      
      setTimeout(() => {
        removeFromCart(id);
        setRemovingItems(prev => {
          const newSet = new Set(prev);
          newSet.delete(id);
          return newSet;
        });
        showToast('Item removed from cart', 'success');
      }, 500);
    }
  }, [items, removeFromCart]);

  const handleClearCart = useCallback(() => {
    if (window.confirm('Remove all items from your cart?')) {
      clearCart();
      showToast('Cart cleared successfully', 'success');
    }
  }, [clearCart]);

  const handleSaveForLater = useCallback((id) => {
    // TODO: Implement save for later functionality
    showToast('Item saved for later', 'success');
  }, []);

  const handleAddRecommended = useCallback((item) => {
    // TODO: Implement add to cart for recommended items
    showToast(`${item.name} added to cart!`, 'success');
  }, []);

  const showToast = useCallback((message, type) => {
    setToast({ message, type });
  }, []);

  const hideToast = useCallback(() => {
    setToast(null);
  }, []);

  if (items.length === 0) {
    return <EmptyCart />;
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Enhanced Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Shopping Cart</h1>
            <p className="text-lg text-gray-600">
              {totalItems} {totalItems === 1 ? 'item' : 'items'} ready for checkout
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-lg border">
                {/* Cart Header */}
                <div className="p-6 border-b border-gray-200">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold text-gray-900">Cart Items</h2>
                    <button
                      onClick={handleClearCart}
                      className="text-sm text-red-600 hover:text-red-700 focus:outline-none focus:underline font-semibold transition-colors duration-200"
                    >
                      Clear All
                    </button>
                  </div>
                </div>

                {/* Cart Items List */}
                <div className="divide-y divide-gray-200">
                  {items.map((item) => (
                    <CartItem
                      key={item.id}
                      item={item}
                      onUpdateQuantity={handleUpdateQuantity}
                      onRemoveItem={handleRemoveItem}
                      onSaveForLater={handleSaveForLater}
                      isUpdating={updatingItems.has(item.id) ? item.id : null}
                      isRemoving={removingItems.has(item.id)}
                    />
                  ))}
                </div>
              </div>

              {/* Continue Shopping */}
              <div className="mt-6">
                <Link
                  to="/products"
                  className="inline-flex items-center text-indigo-600 hover:text-indigo-700 focus:outline-none focus:underline font-semibold text-lg transition-colors duration-200"
                >
                  <ArrowLeft className="h-5 w-5 mr-2" />
                  Continue Shopping
                </Link>
              </div>
            </div>

            {/* Right Sidebar */}
            <div className="lg:col-span-1">
              <OrderSummary 
                totalItems={totalItems} 
                totalPrice={totalPrice}
                onApplyPromo={showToast}
              />
              <RecommendedProducts onAddToCart={handleAddRecommended} />
            </div>
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={hideToast}
        />
      )}
    </>
  );
};

export default Cart;
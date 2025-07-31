import React, { createContext, useContext, useReducer, useEffect, useCallback, useMemo } from 'react';
import { api } from '../services/api';

// Create the cart context
const CartContext = createContext();

// Enhanced cart reducer with more comprehensive state management
const cartReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload
      };

    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        loading: false
      };

    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null
      };

    case 'ADD_TO_CART':
      const existingItem = state.items.find(item => 
        item.id === action.payload.id && 
        item.variant === action.payload.variant
      );
      
      if (existingItem) {
        const newQuantity = existingItem.quantity + (action.payload.quantity || 1);
        const maxQuantity = action.payload.maxQuantity || existingItem.maxQuantity || 99;
        
        return {
          ...state,
          items: state.items.map(item =>
            item.id === action.payload.id && item.variant === action.payload.variant
              ? { ...item, quantity: Math.min(newQuantity, maxQuantity) }
              : item
          ),
          lastUpdated: new Date().toISOString(),
          error: null
        };
      }
      
      return {
        ...state,
        items: [...state.items, { 
          ...action.payload, 
          quantity: action.payload.quantity || 1,
          addedAt: new Date().toISOString()
        }],
        lastUpdated: new Date().toISOString(),
        error: null
      };

    case 'REMOVE_FROM_CART':
      return {
        ...state,
        items: state.items.filter(item => 
          !(item.id === action.payload.id && 
            (action.payload.variant === undefined || item.variant === action.payload.variant))
        ),
        lastUpdated: new Date().toISOString(),
        error: null
      };

    case 'UPDATE_QUANTITY':
      const { id, variant, quantity } = action.payload;
      
      if (quantity <= 0) {
        return {
          ...state,
          items: state.items.filter(item => 
            !(item.id === id && item.variant === variant)
          ),
          lastUpdated: new Date().toISOString(),
          error: null
        };
      }

      return {
        ...state,
        items: state.items.map(item =>
          item.id === id && item.variant === variant
            ? { ...item, quantity: Math.min(quantity, item.maxQuantity || 99) }
            : item
        ),
        lastUpdated: new Date().toISOString(),
        error: null
      };

    case 'CLEAR_CART':
      return {
        ...state,
        items: [],
        appliedCoupons: [],
        lastUpdated: new Date().toISOString(),
        error: null
      };

    case 'LOAD_CART':
      return {
        ...state,
        items: action.payload.items || [],
        shippingInfo: action.payload.shippingInfo || state.shippingInfo,
        appliedCoupons: action.payload.appliedCoupons || [],
        lastUpdated: action.payload.lastUpdated || new Date().toISOString(),
        loading: false,
        error: null
      };

    case 'SET_SHIPPING_INFO':
      return {
        ...state,
        shippingInfo: { ...state.shippingInfo, ...action.payload },
        lastUpdated: new Date().toISOString(),
        error: null
      };

    case 'APPLY_COUPON':
      if (state.appliedCoupons.find(coupon => coupon.code === action.payload.code)) {
        return {
          ...state,
          error: 'Coupon already applied'
        };
      }

      return {
        ...state,
        appliedCoupons: [...state.appliedCoupons, action.payload],
        lastUpdated: new Date().toISOString(),
        error: null
      };

    case 'REMOVE_COUPON':
      return {
        ...state,
        appliedCoupons: state.appliedCoupons.filter(coupon => coupon.code !== action.payload),
        lastUpdated: new Date().toISOString(),
        error: null
      };

    case 'SAVE_FOR_LATER':
      const itemToSave = state.items.find(item => 
        item.id === action.payload.id && item.variant === action.payload.variant
      );
      
      if (!itemToSave) return state;

      return {
        ...state,
        items: state.items.filter(item => 
          !(item.id === action.payload.id && item.variant === action.payload.variant)
        ),
        savedForLater: [...(state.savedForLater || []), { 
          ...itemToSave, 
          savedAt: new Date().toISOString() 
        }],
        lastUpdated: new Date().toISOString(),
        error: null
      };

    case 'MOVE_TO_CART':
      const savedItem = state.savedForLater?.find(item => 
        item.id === action.payload.id && item.variant === action.payload.variant
      );
      
      if (!savedItem) return state;

      return {
        ...state,
        items: [...state.items, { ...savedItem, addedAt: new Date().toISOString() }],
        savedForLater: state.savedForLater.filter(item => 
          !(item.id === action.payload.id && item.variant === action.payload.variant)
        ),
        lastUpdated: new Date().toISOString(),
        error: null
      };

    case 'SYNC_WITH_SERVER':
      return {
        ...state,
        ...action.payload,
        lastSynced: new Date().toISOString(),
        loading: false,
        error: null
      };

    default:
      return state;
  }
};

// Enhanced initial state with more comprehensive data
const initialState = {
  items: [],
  savedForLater: [],
  appliedCoupons: [],
  shippingInfo: {
    fullName: '',
    email: '',
    phone: '',
    address: '',
    address2: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    deliveryInstructions: ''
  },
  loading: false,
  error: null,
  lastUpdated: null,
  lastSynced: null
};

// Storage keys for better organization
const STORAGE_KEYS = {
  CART: 'miku_store_cart',
  SHIPPING: 'miku_store_shipping',
  SAVED_ITEMS: 'miku_store_saved_items'
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Enhanced cart loading with error handling
  const loadCartFromStorage = useCallback(() => {
    try {
      const savedCart = localStorage.getItem(STORAGE_KEYS.CART);
      const savedShipping = localStorage.getItem(STORAGE_KEYS.SHIPPING);
      const savedItems = localStorage.getItem(STORAGE_KEYS.SAVED_ITEMS);
      
      const cartData = {
        items: savedCart ? JSON.parse(savedCart) : [],
        shippingInfo: savedShipping ? JSON.parse(savedShipping) : initialState.shippingInfo,
        savedForLater: savedItems ? JSON.parse(savedItems) : []
      };

      dispatch({ type: 'LOAD_CART', payload: cartData });
    } catch (error) {
      console.error('Error loading cart from storage:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to load saved cart data' });
      
      // Clear corrupted data
      localStorage.removeItem(STORAGE_KEYS.CART);
      localStorage.removeItem(STORAGE_KEYS.SHIPPING);
      localStorage.removeItem(STORAGE_KEYS.SAVED_ITEMS);
    }
  }, []);

  // Load cart from storage on mount
  useEffect(() => {
    loadCartFromStorage();
  }, [loadCartFromStorage]);

  // Enhanced cart persistence with debouncing
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(state.items));
        localStorage.setItem(STORAGE_KEYS.SHIPPING, JSON.stringify(state.shippingInfo));
        localStorage.setItem(STORAGE_KEYS.SAVED_ITEMS, JSON.stringify(state.savedForLater || []));
      } catch (error) {
        console.error('Error saving cart to storage:', error);
        dispatch({ type: 'SET_ERROR', payload: 'Failed to save cart data' });
      }
    }, 500); // Debounce saves by 500ms

    return () => clearTimeout(timeoutId);
  }, [state.items, state.shippingInfo, state.savedForLater]);

  // Enhanced add to cart with validation
  const addToCart = useCallback(async (product, options = {}) => {
    if (!product || !product.id) {
      dispatch({ type: 'SET_ERROR', payload: 'Invalid product data' });
      return { success: false, error: 'Invalid product data' };
    }

    // Check stock availability
    if (product.stock !== undefined && product.stock <= 0) {
      const error = 'Product is out of stock';
      dispatch({ type: 'SET_ERROR', payload: error });
      return { success: false, error };
    }

    const productToAdd = {
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image || product.images?.[0],
      variant: options.variant || 'default',
      quantity: options.quantity || 1,
      maxQuantity: product.maxQuantity || product.stock || 99,
      category: product.category,
      sku: product.sku
    };

    dispatch({ type: 'ADD_TO_CART', payload: productToAdd });
    dispatch({ type: 'CLEAR_ERROR' });
    
    return { success: true };
  }, []);

  // Enhanced remove from cart
  const removeFromCart = useCallback((productId, variant = 'default') => {
    dispatch({ 
      type: 'REMOVE_FROM_CART', 
      payload: { id: productId, variant } 
    });
    dispatch({ type: 'CLEAR_ERROR' });
  }, []);

  // Enhanced quantity update with validation
  const updateQuantity = useCallback((productId, quantity, variant = 'default') => {
    if (quantity < 0) {
      dispatch({ type: 'SET_ERROR', payload: 'Quantity cannot be negative' });
      return { success: false };
    }

    const item = state.items.find(item => item.id === productId && item.variant === variant);
    if (!item) {
      dispatch({ type: 'SET_ERROR', payload: 'Item not found in cart' });
      return { success: false };
    }

    const maxQuantity = item.maxQuantity || 99;
    if (quantity > maxQuantity) {
      dispatch({ type: 'SET_ERROR', payload: `Maximum quantity is ${maxQuantity}` });
      return { success: false };
    }

    dispatch({
      type: 'UPDATE_QUANTITY',
      payload: { id: productId, variant, quantity }
    });
    dispatch({ type: 'CLEAR_ERROR' });
    
    return { success: true };
  }, [state.items]);

  // Enhanced clear cart with confirmation
  const clearCart = useCallback((skipConfirmation = false) => {
    if (!skipConfirmation && state.items.length > 0) {
      const confirmed = window.confirm('Are you sure you want to clear your cart?');
      if (!confirmed) return { success: false };
    }

    dispatch({ type: 'CLEAR_CART' });
    return { success: true };
  }, [state.items.length]);

  // Enhanced shipping info update
  const setShippingInfo = useCallback((shippingData) => {
    // Basic validation
    const requiredFields = ['fullName', 'email', 'address', 'city', 'zipCode', 'country'];
    const missingFields = requiredFields.filter(field => !shippingData[field]?.trim());
    
    if (missingFields.length > 0) {
      const error = `Please fill in: ${missingFields.join(', ')}`;
      dispatch({ type: 'SET_ERROR', payload: error });
      return { success: false, error };
    }

    dispatch({ type: 'SET_SHIPPING_INFO', payload: shippingData });
    dispatch({ type: 'CLEAR_ERROR' });
    return { success: true };
  }, []);

  // Coupon management
  const applyCoupon = useCallback(async (couponCode) => {
    if (!couponCode?.trim()) {
      const error = 'Please enter a coupon code';
      dispatch({ type: 'SET_ERROR', payload: error });
      return { success: false, error };
    }

    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      // Validate coupon with server
      const response = await api.post('/coupons/validate', {
        code: couponCode.toUpperCase(),
        cartTotal: getTotalPrice(),
        items: state.items
      });

      const coupon = response.data.coupon;
      
      dispatch({ type: 'APPLY_COUPON', payload: coupon });
      dispatch({ type: 'SET_LOADING', payload: false });
      
      return { success: true, coupon };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Invalid coupon code';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      dispatch({ type: 'SET_LOADING', payload: false });
      
      return { success: false, error: errorMessage };
    }
  }, [state.items]);

  const removeCoupon = useCallback((couponCode) => {
    dispatch({ type: 'REMOVE_COUPON', payload: couponCode });
  }, []);

  // Save for later functionality
  const saveForLater = useCallback((productId, variant = 'default') => {
    dispatch({ type: 'SAVE_FOR_LATER', payload: { id: productId, variant } });
    return { success: true };
  }, []);

  const moveToCart = useCallback((productId, variant = 'default') => {
    dispatch({ type: 'MOVE_TO_CART', payload: { id: productId, variant } });
    return { success: true };
  }, []);

  // Server synchronization
  const syncWithServer = useCallback(async (userId) => {
    if (!userId) return;

    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      // Send local cart to server and get updated cart
      const response = await api.post('/cart/sync', {
        localCart: {
          items: state.items,
          savedForLater: state.savedForLater,
          appliedCoupons: state.appliedCoupons,
          lastUpdated: state.lastUpdated
        }
      });

      dispatch({ type: 'SYNC_WITH_SERVER', payload: response.data.cart });
      
      return { success: true };
    } catch (error) {
      console.error('Cart sync failed:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to sync cart with server' });
      return { success: false };
    }
  }, [state.items, state.savedForLater, state.appliedCoupons, state.lastUpdated]);

  // Error handling
  const clearError = useCallback(() => {
    dispatch({ type: 'CLEAR_ERROR' });
  }, []);

  // Enhanced computed values with memoization
  const getTotalItems = useCallback(() => {
    return state.items.reduce((total, item) => total + item.quantity, 0);
  }, [state.items]);

  const getTotalPrice = useCallback(() => {
    const subtotal = state.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    
    // Apply coupon discounts
    const discountAmount = state.appliedCoupons.reduce((total, coupon) => {
      if (coupon.type === 'percentage') {
        return total + (subtotal * coupon.value / 100);
      } else if (coupon.type === 'fixed') {
        return total + coupon.value;
      }
      return total;
    }, 0);

    return Math.max(0, subtotal - discountAmount);
  }, [state.items, state.appliedCoupons]);

  const getSubtotal = useCallback(() => {
    return state.items.reduce((total, item) => total + (item.price * item.quantity), 0);
  }, [state.items]);

  const getDiscountAmount = useCallback(() => {
    const subtotal = getSubtotal();
    return state.appliedCoupons.reduce((total, coupon) => {
      if (coupon.type === 'percentage') {
        return total + (subtotal * coupon.value / 100);
      } else if (coupon.type === 'fixed') {
        return total + coupon.value;
      }
      return total;
    }, 0);
  }, [getSubtotal, state.appliedCoupons]);

  const getItemCount = useCallback((productId, variant = 'default') => {
    const item = state.items.find(item => item.id === productId && item.variant === variant);
    return item ? item.quantity : 0;
  }, [state.items]);

  const isInCart = useCallback((productId, variant = 'default') => {
    return state.items.some(item => item.id === productId && item.variant === variant);
  }, [state.items]);

  const getCartWeight = useCallback(() => {
    return state.items.reduce((total, item) => {
      const weight = item.weight || 0;
      return total + (weight * item.quantity);
    }, 0);
  }, [state.items]);

  const getUniqueCategories = useCallback(() => {
    const categories = state.items.map(item => item.category).filter(Boolean);
    return [...new Set(categories)];
  }, [state.items]);

  // Memoized context value to prevent unnecessary re-renders
  const contextValue = useMemo(() => ({
    // State
    items: state.items,
    savedForLater: state.savedForLater || [],
    appliedCoupons: state.appliedCoupons || [],
    shippingInfo: state.shippingInfo,
    loading: state.loading,
    error: state.error,
    lastUpdated: state.lastUpdated,
    lastSynced: state.lastSynced,

    // Actions
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    setShippingInfo,
    applyCoupon,
    removeCoupon,
    saveForLater,
    moveToCart,
    syncWithServer,
    clearError,

    // Computed values
    getTotalItems,
    getTotalPrice,
    getSubtotal,
    getDiscountAmount,
    getItemCount,
    isInCart,
    getCartWeight,
    getUniqueCategories,

    // Convenience properties
    isEmpty: state.items.length === 0,
    totalItems: getTotalItems(),
    totalPrice: getTotalPrice(),
    subtotal: getSubtotal(),
    discountAmount: getDiscountAmount(),
    hasDiscounts: state.appliedCoupons.length > 0,
    isLoading: state.loading,
    hasError: !!state.error
  }), [
    state,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    setShippingInfo,
    applyCoupon,
    removeCoupon,
    saveForLater,
    moveToCart,
    syncWithServer,
    clearError,
    getTotalItems,
    getTotalPrice,
    getSubtotal,
    getDiscountAmount,
    getItemCount,
    isInCart,
    getCartWeight,
    getUniqueCategories
  ]);

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
};

// Enhanced hook with better error handling
export const useCart = () => {
  const context = useContext(CartContext);
  
  if (!context) {
    throw new Error(
      'useCart must be used within a CartProvider. ' +
      'Make sure your component is wrapped with <CartProvider>.'
    );
  }
  
  return context;
};

// Additional utility hooks for specific use cases
export const useCartItems = () => {
  const { items, isEmpty, totalItems } = useCart();
  return { items, isEmpty, totalItems };
};

export const useCartActions = () => {
  const { addToCart, removeFromCart, updateQuantity, clearCart } = useCart();
  return { addToCart, removeFromCart, updateQuantity, clearCart };
};

export const useCartTotals = () => {
  const { totalPrice, subtotal, discountAmount, hasDiscounts, totalItems } = useCart();
  return { totalPrice, subtotal, discountAmount, hasDiscounts, totalItems };
};

export const useCartStatus = () => {
  const { loading, error, isEmpty, hasError } = useCart();
  return { loading, error, isEmpty, hasError };
};
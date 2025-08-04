import React, { createContext, useContext, useReducer, useEffect, useCallback, useMemo } from 'react';
import { api } from '../services/api';
import { useAuth } from './AuthContext';

// Create the cart context
const CartContext = createContext();

// Cart reducer
const cartReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };

    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };

    case 'CLEAR_ERROR':
      return { ...state, error: null };

    case 'ADD_TO_CART':
      const existingItem = state.items.find(item => item.id === action.payload.id);
      
      if (existingItem) {
        const newQuantity = existingItem.quantity + (action.payload.quantity || 1);
        const maxQuantity = action.payload.maxQuantity || 99;
        
        return {
          ...state,
          items: state.items.map(item =>
            item.id === action.payload.id
              ? { ...item, quantity: Math.min(newQuantity, maxQuantity) }
              : item
          ),
          lastUpdated: new Date().toISOString(),
          error: null
        };
      }
      
      return {
        ...state,
        items: [
          ...state.items,
          {
            ...action.payload,
            quantity: action.payload.quantity || 1,
            addedAt: new Date().toISOString()
          }
        ],
        lastUpdated: new Date().toISOString(),
        error: null
      };

    case 'REMOVE_FROM_CART':
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload.id),
        lastUpdated: new Date().toISOString(),
        error: null
      };

    case 'UPDATE_QUANTITY':
      const { id, quantity } = action.payload;
      
      if (quantity <= 0) {
        return {
          ...state,
          items: state.items.filter(item => item.id !== id),
          lastUpdated: new Date().toISOString(),
          error: null
        };
      }

      return {
        ...state,
        items: state.items.map(item =>
          item.id === id
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
        lastUpdated: new Date().toISOString(),
        error: null
      };

    case 'LOAD_CART':
      return {
        ...state,
        items: action.payload.items || [],
        shippingInfo: action.payload.shippingInfo || state.shippingInfo,
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

    case 'SYNC_WITH_SERVER':
      return {
        ...state,
        items: action.payload.items || [],
        lastSynced: new Date().toISOString(),
        loading: false,
        error: null
      };

    default:
      return state;
  }
};

// Initial state
const initialState = {
  items: [],
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

// Storage keys
const STORAGE_KEYS = {
  CART: 'miku_store_cart',
  SHIPPING: 'miku_store_shipping'
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const { user, isAuthenticated } = useAuth();

  // Load cart from storage on mount
  const loadCartFromStorage = useCallback(() => {
    try {
      const savedCart = localStorage.getItem(STORAGE_KEYS.CART);
      const savedShipping = localStorage.getItem(STORAGE_KEYS.SHIPPING);
      
      const cartData = {
        items: savedCart ? JSON.parse(savedCart) : [],
        shippingInfo: savedShipping ? JSON.parse(savedShipping) : initialState.shippingInfo
      };

      dispatch({ type: 'LOAD_CART', payload: cartData });
    } catch (error) {
      console.error('Error loading cart from storage:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to load saved cart data' });
      localStorage.removeItem(STORAGE_KEYS.CART);
      localStorage.removeItem(STORAGE_KEYS.SHIPPING);
    }
  }, []);

  useEffect(() => {
    loadCartFromStorage();
  }, [loadCartFromStorage]);

  // Persist cart to storage with debouncing
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(state.items));
        localStorage.setItem(STORAGE_KEYS.SHIPPING, JSON.stringify(state.shippingInfo));
      } catch (error) {
        console.error('Error saving cart to storage:', error);
        dispatch({ type: 'SET_ERROR', payload: 'Failed to save cart data' });
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [state.items, state.shippingInfo]);

  // Sync cart with server when user logs in
  useEffect(() => {
    if (isAuthenticated && user?.id) {
      syncWithServer();
    }
  }, [isAuthenticated, user]);

  // Add to cart
  const addToCart = useCallback(async (product, options = {}) => {
    if (!product || !product.id) {
      dispatch({ type: 'SET_ERROR', payload: 'Invalid product data' });
      return { success: false, error: 'Invalid product data' };
    }

    if (product.stock !== undefined && product.stock <= 0) {
      const error = 'Product is out of stock';
      dispatch({ type: 'SET_ERROR', payload: error });
      return { success: false, error };
    }

    const productToAdd = {
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: options.quantity || 1,
      maxQuantity: product.maxQuantity || product.stock || 99,
      category: product.category,
      sku: product.sku
    };

    if (isAuthenticated) {
      try {
        dispatch({ type: 'SET_LOADING', payload: true });
        await api.post('/api/cart', { productId: product.id, quantity: options.quantity || 1 });
        await syncWithServer();
        return { success: true };
      } catch (error) {
        const errorMessage = error.response?.data?.message || 'Failed to add to cart';
        dispatch({ type: 'SET_ERROR', payload: errorMessage });
        return { success: false, error: errorMessage };
      }
    } else {
      dispatch({ type: 'ADD_TO_CART', payload: productToAdd });
      dispatch({ type: 'CLEAR_ERROR' });
      return { success: true };
    }
  }, [isAuthenticated]);

  // Remove from cart
  const removeFromCart = useCallback(async (productId) => {
    if (isAuthenticated) {
      try {
        dispatch({ type: 'SET_LOADING', payload: true });
        const newItems = state.items.filter(item => item.id !== productId);
        await api.post('/api/cart/sync', { items: newItems });
        await syncWithServer();
        return { success: true };
      } catch (error) {
        const errorMessage = error.response?.data?.message || 'Failed to remove from cart';
        dispatch({ type: 'SET_ERROR', payload: errorMessage });
        return { success: false, error: errorMessage };
      }
    } else {
      dispatch({ type: 'REMOVE_FROM_CART', payload: { id: productId } });
      dispatch({ type: 'CLEAR_ERROR' });
      return { success: true };
    }
  }, [isAuthenticated, state.items]);

  // Update quantity
  const updateQuantity = useCallback(async (productId, quantity) => {
    if (quantity < 0) {
      dispatch({ type: 'SET_ERROR', payload: 'Quantity cannot be negative' });
      return { success: false };
    }

    const item = state.items.find(item => item.id === productId);
    if (!item) {
      dispatch({ type: 'SET_ERROR', payload: 'Item not found in cart' });
      return { success: false };
    }

    const maxQuantity = item.maxQuantity || 99;
    if (quantity > maxQuantity) {
      dispatch({ type: 'SET_ERROR', payload: `Maximum quantity is ${maxQuantity}` });
      return { success: false };
    }

    if (isAuthenticated) {
      try {
        dispatch({ type: 'SET_LOADING', payload: true });
        await api.post('/api/cart', { productId, quantity });
        await syncWithServer();
        return { success: true };
      } catch (error) {
        const errorMessage = error.response?.data?.message || 'Failed to update quantity';
        dispatch({ type: 'SET_ERROR', payload: errorMessage });
        return { success: false, error: errorMessage };
      }
    } else {
      dispatch({ type: 'UPDATE_QUANTITY', payload: { id: productId, quantity } });
      dispatch({ type: 'CLEAR_ERROR' });
      return { success: true };
    }
  }, [isAuthenticated, state.items]);

  // Clear cart
  const clearCart = useCallback(async (skipConfirmation = false) => {
    if (!skipConfirmation && state.items.length > 0) {
      const confirmed = window.confirm('Are you sure you want to clear your cart?');
      if (!confirmed) return { success: false };
    }

    if (isAuthenticated) {
      try {
        dispatch({ type: 'SET_LOADING', payload: true });
        await api.post('/api/cart/sync', { items: [] });
        await syncWithServer();
        return { success: true };
      } catch (error) {
        const errorMessage = error.response?.data?.message || 'Failed to clear cart';
        dispatch({ type: 'SET_ERROR', payload: errorMessage });
        return { success: false, error: errorMessage };
      }
    } else {
      dispatch({ type: 'CLEAR_CART' });
      return { success: true };
    }
  }, [isAuthenticated, state.items.length]);

  // Set shipping info
  const setShippingInfo = useCallback((shippingData) => {
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

  // Sync with server
  const syncWithServer = useCallback(async () => {
    if (!isAuthenticated || !user?.id) return;

    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await api.post('/api/cart/sync', {
        items: state.items.map(item => ({
          productId: item.id,
          quantity: item.quantity
        }))
      });

      const serverItems = response.data.cartItems.map(item => ({
        id: item.productId,
        name: item.product.name,
        price: parseFloat(item.product.price),
        image: item.product.image,
        quantity: item.quantity,
        maxQuantity: item.product.stock || 99,
        category: item.product.category.name,
        sku: item.product.slug,
        addedAt: new Date().toISOString()
      }));

      dispatch({ type: 'SYNC_WITH_SERVER', payload: { items: serverItems } });
      return { success: true };
    } catch (error) {
      console.error('Cart sync failed:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to sync cart with server' });
      return { success: false };
    }
  }, [isAuthenticated, user, state.items]);

  // Clear error
  const clearError = useCallback(() => {
    dispatch({ type: 'CLEAR_ERROR' });
  }, []);

  // Computed values
  const getTotalItems = useCallback(() => {
    return state.items.reduce((total, item) => total + item.quantity, 0);
  }, [state.items]);

  const getTotalPrice = useCallback(() => {
    return state.items.reduce((total, item) => total + (item.price * item.quantity), 0);
  }, [state.items]);

  const getSubtotal = useCallback(() => {
    return state.items.reduce((total, item) => total + (item.price * item.quantity), 0);
  }, [state.items]);

  const getItemCount = useCallback((productId) => {
    const item = state.items.find(item => item.id === productId);
    return item ? item.quantity : 0;
  }, [state.items]);

  const isInCart = useCallback((productId) => {
    return state.items.some(item => item.id === productId);
  }, [state.items]);

  const contextValue = useMemo(() => ({
    items: state.items,
    shippingInfo: state.shippingInfo,
    loading: state.loading,
    error: state.error,
    lastUpdated: state.lastUpdated,
    lastSynced: state.lastSynced,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    setShippingInfo,
    syncWithServer,
    clearError,
    getTotalItems,
    getTotalPrice,
    getSubtotal,
    getItemCount,
    isInCart,
    isEmpty: state.items.length === 0,
    totalItems: getTotalItems(),
    totalPrice: getTotalPrice(),
    subtotal: getSubtotal(),
    isLoading: state.loading,
    hasError: !!state.error
  }), [
    state,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    setShippingInfo,
    syncWithServer,
    clearError,
    getTotalItems,
    getTotalPrice,
    getSubtotal,
    getItemCount,
    isInCart
  ]);

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider.');
  }
  return context;
};

export const useCartItems = () => {
  const { items, isEmpty, totalItems } = useCart();
  return { items, isEmpty, totalItems };
};

export const useCartActions = () => {
  const { addToCart, removeFromCart, updateQuantity, clearCart } = useCart();
  return { addToCart, removeFromCart, updateQuantity, clearCart };
};

export const useCartTotals = () => {
  const { totalPrice, subtotal, totalItems } = useCart();
  return { totalPrice, subtotal, totalItems };
};

export const useCartStatus = () => {
  const { loading, error, isEmpty, hasError } = useCart();
  return { loading, error, isEmpty, hasError };
};
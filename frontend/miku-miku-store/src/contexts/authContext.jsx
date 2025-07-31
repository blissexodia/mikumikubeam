import React, { createContext, useContext, useReducer, useEffect, useCallback, useMemo } from 'react';
import { api } from '../services/api';

// Create the auth context
const AuthContext = createContext();

// Enhanced auth reducer with more comprehensive state management
const authReducer = (state, action) => {
  switch (action.type) {
    case 'AUTH_START':
      return {
        ...state,
        loading: true,
        error: null
      };
    
    case 'AUTH_SUCCESS':
      return {
        ...state,
        loading: false,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        error: null,
        lastLoginAt: new Date().toISOString()
      };
    
    case 'AUTH_FAILURE':
      return {
        ...state,
        loading: false,
        user: null,
        token: null,
        isAuthenticated: false,
        error: action.payload,
        lastLoginAt: null
      };
    
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
        error: null,
        lastLoginAt: null
      };
    
    case 'UPDATE_USER':
      return {
        ...state,
        user: state.user ? { ...state.user, ...action.payload } : null,
        error: null
      };
    
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null
      };
    
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload
      };
    
    case 'REFRESH_TOKEN_SUCCESS':
      return {
        ...state,
        token: action.payload.token,
        error: null
      };
    
    default:
      return state;
  }
};

// Enhanced initial state with better default values
const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  lastLoginAt: null
};

// Storage keys for better organization
const STORAGE_KEYS = {
  TOKEN: 'miku_store_token',
  USER: 'miku_store_user',
  LAST_LOGIN: 'miku_store_last_login'
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Enhanced token verification with better error handling
  const verifyToken = useCallback(async (token) => {
    if (!token) return;

    try {
      dispatch({ type: 'AUTH_START' });
      
      const response = await api.get('/auth/verify', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const userData = response.data.user;
      
      // Store user data for offline access
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userData));
      localStorage.setItem(STORAGE_KEYS.LAST_LOGIN, new Date().toISOString());
      
      dispatch({
        type: 'AUTH_SUCCESS',
        payload: {
          user: userData,
          token: token
        }
      });
    } catch (error) {
      console.warn('Token verification failed:', error.message);
      
      // Clean up invalid tokens
      localStorage.removeItem(STORAGE_KEYS.TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER);
      localStorage.removeItem(STORAGE_KEYS.LAST_LOGIN);
      
      dispatch({
        type: 'AUTH_FAILURE',
        payload: 'Session expired. Please log in again.'
      });
    }
  }, []);

  // Initialize auth state on app start
  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
      const savedUser = localStorage.getItem(STORAGE_KEYS.USER);
      const lastLogin = localStorage.getItem(STORAGE_KEYS.LAST_LOGIN);
      
      if (token) {
        // Check if we have cached user data for immediate UI update
        if (savedUser && lastLogin) {
          try {
            const user = JSON.parse(savedUser);
            dispatch({
              type: 'AUTH_SUCCESS',
              payload: { user, token }
            });
          } catch (error) {
            console.warn('Failed to parse cached user data:', error);
          }
        }
        
        // Verify token in background
        await verifyToken(token);
      }
    };

    initializeAuth();
  }, [verifyToken]);

  // Enhanced login with better error handling and user feedback
  const login = useCallback(async (email, password, rememberMe = false) => {
    if (!email || !password) {
      const error = 'Email and password are required';
      dispatch({
        type: 'AUTH_FAILURE',
        payload: error
      });
      return { success: false, error };
    }

    try {
      dispatch({ type: 'AUTH_START' });
      
      const response = await api.post('/auth/login', {
        email: email.toLowerCase().trim(),
        password,
        rememberMe
      });

      const { user, token, refreshToken } = response.data;
      
      // Store tokens with appropriate persistence
      localStorage.setItem(STORAGE_KEYS.TOKEN, token);
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
      localStorage.setItem(STORAGE_KEYS.LAST_LOGIN, new Date().toISOString());
      
      if (refreshToken) {
        localStorage.setItem('miku_store_refresh_token', refreshToken);
      }
      
      dispatch({
        type: 'AUTH_SUCCESS',
        payload: { user, token }
      });

      return { success: true, user };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          'Login failed. Please check your credentials.';
      
      dispatch({
        type: 'AUTH_FAILURE',
        payload: errorMessage
      });
      
      return { success: false, error: errorMessage };
    }
  }, []);

  // Enhanced registration with validation
  const register = useCallback(async (userData) => {
    const { email, password, confirmPassword, ...otherData } = userData;

    // Basic validation
    if (!email || !password) {
      const error = 'Email and password are required';
      dispatch({
        type: 'AUTH_FAILURE',
        payload: error
      });
      return { success: false, error };
    }

    if (password !== confirmPassword) {
      const error = 'Passwords do not match';
      dispatch({
        type: 'AUTH_FAILURE',
        payload: error
      });
      return { success: false, error };
    }

    try {
      dispatch({ type: 'AUTH_START' });
      
      const response = await api.post('/auth/register', {
        email: email.toLowerCase().trim(),
        password,
        ...otherData
      });

      const { user, token } = response.data;
      
      localStorage.setItem(STORAGE_KEYS.TOKEN, token);
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
      localStorage.setItem(STORAGE_KEYS.LAST_LOGIN, new Date().toISOString());
      
      dispatch({
        type: 'AUTH_SUCCESS',
        payload: { user, token }
      });

      return { success: true, user };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          'Registration failed. Please try again.';
      
      dispatch({
        type: 'AUTH_FAILURE',
        payload: errorMessage
      });
      
      return { success: false, error: errorMessage };
    }
  }, []);

  // Enhanced logout with cleanup
  const logout = useCallback(async (everywhere = false) => {
    try {
      // Notify server about logout if needed
      if (everywhere && state.token) {
        await api.post('/auth/logout-all', {}, {
          headers: { Authorization: `Bearer ${state.token}` }
        });
      } else if (state.token) {
        await api.post('/auth/logout', {}, {
          headers: { Authorization: `Bearer ${state.token}` }
        });
      }
    } catch (error) {
      console.warn('Logout request failed:', error);
      // Continue with local logout even if server request fails
    }

    // Clean up all stored data
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
    localStorage.removeItem(STORAGE_KEYS.LAST_LOGIN);
    localStorage.removeItem('miku_store_refresh_token');
    
    dispatch({ type: 'LOGOUT' });
  }, [state.token]);

  // Enhanced user update with optimistic updates
  const updateUser = useCallback(async (userData) => {
    if (!state.isAuthenticated || !state.token) {
      throw new Error('User must be authenticated to update profile');
    }

    // Optimistic update
    dispatch({
      type: 'UPDATE_USER',
      payload: userData
    });

    try {
      const response = await api.put('/auth/profile', userData, {
        headers: { Authorization: `Bearer ${state.token}` }
      });

      const updatedUser = response.data.user;

      // Update with server response
      dispatch({
        type: 'UPDATE_USER',
        payload: updatedUser
      });

      // Update cached user data
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify({
        ...state.user,
        ...updatedUser
      }));

      return { success: true, user: updatedUser };
    } catch (error) {
      // Revert optimistic update on failure
      dispatch({
        type: 'UPDATE_USER',
        payload: state.user
      });

      const errorMessage = error.response?.data?.message || 'Failed to update profile';
      dispatch({
        type: 'AUTH_FAILURE',
        payload: errorMessage
      });

      return { success: false, error: errorMessage };
    }
  }, [state.isAuthenticated, state.token, state.user]);

  // Utility functions
  const clearError = useCallback(() => {
    dispatch({ type: 'CLEAR_ERROR' });
  }, []);

  const refreshToken = useCallback(async () => {
    const refreshToken = localStorage.getItem('miku_store_refresh_token');
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    try {
      const response = await api.post('/auth/refresh', {
        refreshToken
      });

      const { token: newToken } = response.data;
      localStorage.setItem(STORAGE_KEYS.TOKEN, newToken);

      dispatch({
        type: 'REFRESH_TOKEN_SUCCESS',
        payload: { token: newToken }
      });

      return newToken;
    } catch (error) {
      // If refresh fails, logout user
      await logout();
      throw error;
    }
  }, [logout]);

  // Check if user has specific permissions or roles
  const hasPermission = useCallback((permission) => {
    if (!state.user || !state.user.permissions) return false;
    return state.user.permissions.includes(permission);
  }, [state.user]);

  const hasRole = useCallback((role) => {
    if (!state.user || !state.user.roles) return false;
    return state.user.roles.includes(role);
  }, [state.user]);

  // Memoized context value to prevent unnecessary re-renders
  const contextValue = useMemo(() => ({
    // State
    user: state.user,
    token: state.token,
    isAuthenticated: state.isAuthenticated,
    loading: state.loading,
    error: state.error,
    lastLoginAt: state.lastLoginAt,
    
    // Actions
    login,
    register,
    logout,
    updateUser,
    clearError,
    refreshToken,
    
    // Utilities
    hasPermission,
    hasRole,
    
    // Computed values
    isLoading: state.loading,
    isLoggedIn: state.isAuthenticated,
    userDisplayName: state.user?.displayName || state.user?.name || state.user?.email || 'User',
    userAvatar: state.user?.avatar || state.user?.profilePicture,
    userRole: state.user?.role || 'user'
  }), [
    state,
    login,
    register,
    logout,
    updateUser,
    clearError,
    refreshToken,
    hasPermission,
    hasRole
  ]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Enhanced hook with better error handling
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error(
      'useAuth must be used within an AuthProvider. ' +
      'Make sure your component is wrapped with <AuthProvider>.'
    );
  }
  
  return context;
};

// Additional utility hooks for common use cases
export const useAuthUser = () => {
  const { user, isAuthenticated } = useAuth();
  return isAuthenticated ? user : null;
};

export const useAuthActions = () => {
  const { login, register, logout, updateUser, clearError } = useAuth();
  return { login, register, logout, updateUser, clearError };
};

export const useAuthStatus = () => {
  const { isAuthenticated, loading, error } = useAuth();
  return { isAuthenticated, loading, error };
};
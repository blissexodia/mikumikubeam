import React, { createContext, useContext, useReducer, useEffect, useCallback, useMemo } from 'react';
import { api } from '../services/api';

// Create the auth context
const AuthContext = createContext();

// Auth reducer
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
    
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null
      };
    
    default:
      return state;
  }
};

// Initial state
const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  lastLoginAt: null
};

// Storage keys
const STORAGE_KEYS = {
  TOKEN: 'miku_store_token',
  USER: 'miku_store_user',
  LAST_LOGIN: 'miku_store_last_login'
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Initialize auth state on app start
  useEffect(() => {
    const initializeAuth = () => {
      const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
      const savedUser = localStorage.getItem(STORAGE_KEYS.USER);
      const lastLogin = localStorage.getItem(STORAGE_KEYS.LAST_LOGIN);
      
      if (token && savedUser && lastLogin) {
        try {
          const user = JSON.parse(savedUser);
          dispatch({
            type: 'AUTH_SUCCESS',
            payload: { user, token }
          });
        } catch (error) {
          console.warn('Failed to parse cached user data:', error);
          localStorage.removeItem(STORAGE_KEYS.TOKEN);
          localStorage.removeItem(STORAGE_KEYS.USER);
          localStorage.removeItem(STORAGE_KEYS.LAST_LOGIN);
          dispatch({ type: 'AUTH_FAILURE', payload: 'Invalid session data' });
        }
      }
    };

    initializeAuth();
  }, []);

  // Login
  const login = useCallback(async (email, password) => {
    if (!email || !password) {
      const error = 'Email and password are required';
      dispatch({ type: 'AUTH_FAILURE', payload: error });
      return { success: false, error };
    }

    try {
      dispatch({ type: 'AUTH_START' });
      
      const response = await api.post('/api/auth/login', {
        email: email.toLowerCase().trim(),
        password
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
                          'Login failed. Please check your credentials.';
      
      dispatch({ type: 'AUTH_FAILURE', payload: errorMessage });
      return { success: false, error: errorMessage };
    }
  }, []);

  // Register
  const register = useCallback(async (userData) => {
    const { email, password, firstName, lastName } = userData;

    if (!email || !password || !firstName || !lastName) {
      const error = 'First name, last name, email, and password are required';
      dispatch({ type: 'AUTH_FAILURE', payload: error });
      return { success: false, error };
    }

    try {
      dispatch({ type: 'AUTH_START' });
      
      const response = await api.post('/api/auth/register', {
        firstName,
        lastName,
        email: email.toLowerCase().trim(),
        password
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
      
      dispatch({ type: 'AUTH_FAILURE', payload: errorMessage });
      return { success: false, error: errorMessage };
    }
  }, []);

  // Logout
  const logout = useCallback(async (everywhere = false) => {
    try {
      if (state.token) {
        await api.post(`/api/auth/${everywhere ? 'logout-all' : 'logout'}`, {}, {
          headers: { Authorization: `Bearer ${state.token}` }
        });
      }
    } catch (error) {
      console.warn('Logout request failed:', error);
    }

    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
    localStorage.removeItem(STORAGE_KEYS.LAST_LOGIN);
    
    dispatch({ type: 'LOGOUT' });
  }, [state.token]);

  // Clear error
  const clearError = useCallback(() => {
    dispatch({ type: 'CLEAR_ERROR' });
  }, []);

  // Context value
  const contextValue = useMemo(() => ({
    user: state.user,
    token: state.token,
    isAuthenticated: state.isAuthenticated,
    loading: state.loading,
    error: state.error,
    lastLoginAt: state.lastLoginAt,
    login,
    register,
    logout,
    clearError,
    isLoading: state.loading,
    isLoggedIn: state.isAuthenticated,
    userRole: state.user?.role || 'user'
  }), [
    state,
    login,
    register,
    logout,
    clearError
  ]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider.');
  }
  return context;
};

export const useAuthUser = () => {
  const { user, isAuthenticated } = useAuth();
  return isAuthenticated ? user : null;
};

export const useAuthActions = () => {
  const { login, register, logout, clearError } = useAuth();
  return { login, register, logout, clearError };
};

export const useAuthStatus = () => {
  const { isAuthenticated, loading, error } = useAuth();
  return { isAuthenticated, loading, error };
};
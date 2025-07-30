import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Shield, Lock, Sparkles } from 'lucide-react';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  // Enhanced loading screen with premium design
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-purple-50/30 to-cyan-50/30 overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-purple-400 to-cyan-400 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-700"></div>
        </div>

        <div className="relative z-10 text-center max-w-md mx-auto px-6">
          {/* Enhanced loading icon */}
          <div className="relative mb-8">
            <div className="w-20 h-20 mx-auto bg-gradient-to-br from-purple-500 via-cyan-500 to-blue-500 rounded-2xl flex items-center justify-center shadow-2xl animate-bounce">
              {/* Chibi Miku matching your brand */}
              <div className="relative text-white text-lg font-bold">
                {/* Hair */}
                <div className="absolute -top-2 -left-2 w-6 h-4 bg-gradient-to-r from-cyan-300 to-cyan-400 rounded-t-full transform rotate-12"></div>
                <div className="absolute -top-2 -right-2 w-6 h-4 bg-gradient-to-r from-cyan-300 to-cyan-400 rounded-t-full transform -rotate-12"></div>
                {/* Face */}
                <div className="w-5 h-5 bg-gradient-to-b from-pink-100 to-pink-200 rounded-full flex items-center justify-center">
                  {/* Eyes */}
                  <div className="flex space-x-1">
                    <div className="w-1 h-1 bg-blue-600 rounded-full"></div>
                    <div className="w-1 h-1 bg-blue-600 rounded-full"></div>
                  </div>
                </div>
                {/* Hair accessories */}
                <div className="absolute top-0 left-1 w-1 h-1 bg-red-400 rounded-full animate-pulse"></div>
                <div className="absolute top-0 right-1 w-1 h-1 bg-red-400 rounded-full animate-pulse"></div>
              </div>
            </div>
            
            {/* Floating sparkles */}
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-pink-400 to-red-400 rounded-full animate-bounce delay-300">
              <div className="w-full h-full flex items-center justify-center text-white text-sm">♪</div>
            </div>
            <Sparkles className="absolute -bottom-2 -left-2 h-5 w-5 text-purple-400 animate-pulse" />
            <Sparkles className="absolute -top-2 left-8 h-4 w-4 text-cyan-400 animate-pulse delay-500" />
          </div>

          {/* Loading spinner with gradient */}
          <div className="relative mb-6">
            <div className="animate-spin rounded-full h-16 w-16 mx-auto">
              <div className="h-full w-full rounded-full border-4 border-transparent bg-gradient-to-r from-purple-500 via-cyan-500 to-blue-500 animate-pulse"></div>
              <div className="absolute inset-2 rounded-full border-4 border-transparent bg-gradient-to-l from-purple-400 via-cyan-400 to-blue-400 animate-spin"></div>
            </div>
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500/20 to-cyan-500/20 blur-xl animate-pulse"></div>
          </div>

          {/* Enhanced loading text */}
          <div className="space-y-3">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 via-cyan-600 to-blue-600 bg-clip-text text-transparent">
              Miku Miku Store
            </h2>
            <p className="text-gray-600 font-medium">Verifying your access...</p>
            <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
              <Shield className="h-4 w-4 text-purple-500" />
              <span>Secure authentication in progress</span>
            </div>
          </div>

          {/* Loading dots animation */}
          <div className="flex justify-center items-center space-x-2 mt-6">
            <div className="w-2 h-2 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full animate-bounce delay-150"></div>
            <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-bounce delay-300"></div>
          </div>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return (
      <Navigate 
        to="/login" 
        state={{ from: location }} 
        replace 
      />
    );
  }

  // Render the protected component
  return children;
};

export default ProtectedRoute;
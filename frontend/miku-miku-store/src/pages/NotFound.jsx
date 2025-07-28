import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft, Search, ShoppingBag } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full text-center">
        {/* 404 Illustration */}
        <div className="mb-8">
          <div className="text-9xl font-bold text-indigo-600 mb-4">404</div>
          <div className="w-24 h-1 bg-indigo-600 mx-auto rounded-full"></div>
        </div>

        {/* Error Message */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Oops! Page Not Found
          </h1>
          <p className="text-gray-600 mb-6">
            The page you're looking for doesn't exist or has been moved. 
            Don't worry, it happens to the best of us!
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <Link
            to="/"
            className="w-full bg-indigo-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-indigo-700 transition duration-200 flex items-center justify-center"
          >
            <Home className="h-5 w-5 mr-2" />
            Go to Homepage
          </Link>
          
          <div className="grid grid-cols-2 gap-4">
            <Link
              to="/products"
              className="bg-white text-gray-700 py-3 px-4 rounded-lg font-medium border border-gray-300 hover:bg-gray-50 transition duration-200 flex items-center justify-center"
            >
              <ShoppingBag className="h-4 w-4 mr-2" />
              Shop Now
            </Link>
            
            <button
              onClick={() => window.history.back()}
              className="bg-white text-gray-700 py-3 px-4 rounded-lg font-medium border border-gray-300 hover:bg-gray-50 transition duration-200 flex items-center justify-center"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Back
            </button>
          </div>
        </div>

        {/* Search Suggestion */}
        <div className="mt-8 p-4 bg-white rounded-lg border border-gray-200">
          <p className="text-sm text-gray-600 mb-3">
            Looking for something specific? Try searching:
          </p>
          <div className="flex">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
              />
            </div>
            <button className="bg-indigo-600 text-white px-4 py-2 rounded-r-lg hover:bg-indigo-700 transition duration-200">
              Search
            </button>
          </div>
        </div>

        {/* Popular Links */}
        <div className="mt-8">
          <p className="text-sm text-gray-600 mb-4">Or try these popular pages:</p>
          <div className="flex flex-wrap gap-2 justify-center">
            <Link
              to="/products/subscriptions"
              className="text-indigo-600 hover:text-indigo-700 text-sm font-medium px-3 py-1 bg-indigo-50 rounded-full"
            >
              Subscriptions
            </Link>
            <Link
              to="/products/giftcards"
              className="text-indigo-600 hover:text-indigo-700 text-sm font-medium px-3 py-1 bg-indigo-50 rounded-full"
            >
              Gift Cards
            </Link>
            <Link
              to="/cart"
              className="text-indigo-600 hover:text-indigo-700 text-sm font-medium px-3 py-1 bg-indigo-50 rounded-full"
            >
              Shopping Cart
            </Link>
            <Link
              to="/profile"
              className="text-indigo-600 hover:text-indigo-700 text-sm font-medium px-3 py-1 bg-indigo-50 rounded-full"
            >
              My Account
            </Link>
          </div>
        </div>

        {/* Help Text */}
        <div className="mt-8 text-xs text-gray-500">
          <p>
            Still having trouble? Contact our{' '}
            <a href="/contact" className="text-indigo-600 hover:text-indigo-700 underline">
              support team
            </a>{' '}
            for assistance.
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
import React, { useState, useEffect } from 'react';
import { Package, Download, Eye, Calendar, DollarSign, CheckCircle, Clock, XCircle, Star, Sparkles, TrendingUp, Users } from 'lucide-react';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Mock orders data - replace with API call
  useEffect(() => {
    const mockOrders = [
      {
        id: 'ORD-2025-001',
        date: '2025-01-25',
        status: 'completed',
        total: 45.98,
        items: [
          {
            id: 1,
            name: 'Netflix Premium',
            type: 'Monthly Subscription',
            price: 15.99,
            quantity: 2,
            image: 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=100&h=100&fit=crop'
          },
          {
            id: 4,
            name: 'Google Play Gift Card',
            type: '$25 Gift Card',
            price: 25.00,
            quantity: 1,
            image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=100&h=100&fit=crop'
          }
        ],
        billingInfo: {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com'
        },
        paymentMethod: {
          brand: 'visa',
          last4: '4242'
        }
      },
      {
        id: 'ORD-2025-002',
        date: '2025-01-20',
        status: 'processing',
        total: 29.98,
        items: [
          {
            id: 2,
            name: 'Spotify Premium',
            type: 'Monthly Subscription',
            price: 9.99,
            quantity: 1,
            image: 'https://images.unsplash.com/photo-1611339555312-e607c8352fd7?w=100&h=100&fit=crop'
          },
          {
            id: 5,
            name: 'Roblox Gift Card',
            type: '$20 Gift Card',
            price: 20.00,
            quantity: 1,
            image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=100&h=100&fit=crop'
          }
        ],
        billingInfo: {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com'
        },
        paymentMethod: {
          brand: 'mastercard',
          last4: '5555'
        }
      },
      {
        id: 'ORD-2025-003',
        date: '2025-01-15',
        status: 'failed',
        total: 50.00,
        items: [
          {
            id: 6,
            name: 'Steam Wallet Card',
            type: '$50 Gift Card',
            price: 50.00,
            quantity: 1,
            image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=100&h=100&fit=crop'
          }
        ],
        billingInfo: {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com'
        },
        paymentMethod: {
          brand: 'visa',
          last4: '1234'
        }
      }
    ];

    setTimeout(() => {
      setOrders(mockOrders);
      setLoading(false);
    }, 1000);
  }, []);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'processing':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'failed':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Package className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'completed':
        return 'Completed';
      case 'processing':
        return 'Processing';
      case 'failed':
        return 'Failed';
      default:
        return 'Unknown';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border border-green-200';
      case 'processing':
        return 'bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-800 border border-yellow-200';
      case 'failed':
        return 'bg-gradient-to-r from-red-100 to-pink-100 text-red-800 border border-red-200';
      default:
        return 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 border border-gray-200';
    }
  };

  const LoadingSkeleton = () => (
    <div className="animate-pulse bg-white rounded-2xl shadow-lg overflow-hidden mb-6">
      <div className="p-8">
        <div className="flex justify-between items-start mb-6">
          <div className="space-y-3">
            <div className="bg-gradient-to-r from-gray-200 to-gray-300 h-6 w-48 rounded-lg"></div>
            <div className="bg-gradient-to-r from-gray-200 to-gray-300 h-4 w-32 rounded-lg"></div>
          </div>
          <div className="bg-gradient-to-r from-gray-200 to-gray-300 h-8 w-24 rounded-full"></div>
        </div>
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-gray-200 to-gray-300 h-20 rounded-xl"></div>
          <div className="bg-gradient-to-r from-gray-200 to-gray-300 h-4 w-full rounded-lg"></div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-400/5 to-purple-400/5"></div>
        <div className="relative z-10 py-12">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-12">
              <div className="bg-gradient-to-r from-gray-200 to-gray-300 h-10 w-64 rounded-lg mb-4 animate-pulse"></div>
              <div className="bg-gradient-to-r from-gray-200 to-gray-300 h-6 w-96 rounded-lg animate-pulse"></div>
            </div>
            {[...Array(3)].map((_, index) => (
              <LoadingSkeleton key={index} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 right-20 w-72 h-72 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-5 animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-gradient-to-r from-pink-400 to-yellow-400 rounded-full opacity-5 animate-pulse"></div>
        <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-gradient-to-r from-green-400 to-blue-400 rounded-full opacity-5 animate-bounce"></div>
      </div>

      <div className="relative z-10 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Enhanced Header */}
          <div className="mb-12 text-center">
            <div className="flex items-center justify-center mb-6">
              <div className="p-4 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl shadow-lg">
                <Package className="h-8 w-8 text-white" />
              </div>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="text-gray-900">Your Order</span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                History
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Track your digital purchases and manage your premium subscriptions
            </p>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-white/50">
              <div className="flex items-center">
                <div className="p-3 bg-gradient-to-r from-green-400 to-emerald-500 rounded-xl">
                  <CheckCircle className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                  <div className="text-2xl font-bold text-gray-900">
                    {orders.filter(o => o.status === 'completed').length}
                  </div>
                  <div className="text-sm text-gray-600">Completed Orders</div>
                </div>
              </div>
            </div>
            
            <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-white/50">
              <div className="flex items-center">
                <div className="p-3 bg-gradient-to-r from-indigo-400 to-purple-500 rounded-xl">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                  <div className="text-2xl font-bold text-gray-900">
                    ${orders.reduce((sum, order) => sum + order.total, 0).toFixed(2)}
                  </div>
                  <div className="text-sm text-gray-600">Total Spent</div>
                </div>
              </div>
            </div>
            
            <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-white/50">
              <div className="flex items-center">
                <div className="p-3 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl">
                  <Star className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                  <div className="text-2xl font-bold text-gray-900">VIP</div>
                  <div className="text-sm text-gray-600">Member Status</div>
                </div>
              </div>
            </div>
          </div>

          {orders.length === 0 ? (
            <div className="text-center py-20">
              <div className="relative inline-block mb-8">
                <div className="p-8 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl shadow-2xl">
                  <Package className="h-16 w-16 text-white mx-auto" />
                </div>
                <div className="absolute -top-2 -right-2">
                  <Sparkles className="h-8 w-8 text-yellow-400 animate-bounce" />
                </div>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Ready for Your First Order?</h2>
              <p className="text-xl text-gray-600 mb-10 max-w-md mx-auto leading-relaxed">
                Discover premium digital products and start building your collection today!
              </p>
              <button className="group bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-10 py-4 rounded-2xl font-bold text-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-purple-500/25 flex items-center mx-auto">
                <Sparkles className="mr-3 h-6 w-6" />
                Start Shopping
                <Users className="ml-3 h-6 w-6 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          ) : (
            <div className="space-y-8">
              {orders.map((order, index) => (
                <div 
                  key={order.id} 
                  className="bg-white/70 backdrop-blur-lg rounded-2xl shadow-xl overflow-hidden border border-white/50 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Enhanced Order Header */}
                  <div className="p-8 bg-gradient-to-r from-white/50 to-white/30 backdrop-blur-sm border-b border-white/20">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-6">
                        <div className="p-4 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl shadow-lg">
                          {getStatusIcon(order.status)}
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold text-gray-900 mb-2">
                            Order {order.id}
                          </h3>
                          <div className="flex items-center space-x-6">
                            <div className="flex items-center text-gray-600 bg-white/50 rounded-full px-4 py-2">
                              <Calendar className="h-4 w-4 mr-2" />
                              <span className="font-medium">
                                {new Date(order.date).toLocaleDateString('en-US', { 
                                  year: 'numeric', 
                                  month: 'long', 
                                  day: 'numeric' 
                                })}
                              </span>
                            </div>
                            <div className="flex items-center text-gray-600 bg-white/50 rounded-full px-4 py-2">
                              <DollarSign className="h-4 w-4 mr-2" />
                              <span className="font-bold text-lg text-gray-900">
                                ${order.total.toFixed(2)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4">
                        <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-bold shadow-lg ${getStatusColor(order.status)}`}>
                          {getStatusIcon(order.status)}
                          <span className="ml-2">{getStatusText(order.status)}</span>
                        </div>
                        
                        <button
                          onClick={() => setSelectedOrder(selectedOrder === order.id ? null : order.id)}
                          className="group bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center"
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          {selectedOrder === order.id ? 'Hide Details' : 'View Details'}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Enhanced Order Items Preview */}
                  <div className="p-8">
                    <div className="flex items-center space-x-6 overflow-x-auto">
                      {order.items.slice(0, 3).map((item) => (
                        <div key={item.id} className="flex items-center space-x-4 bg-white/50 rounded-2xl p-4 min-w-max shadow-lg">
                          <div className="relative">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-16 h-16 object-cover rounded-xl shadow-md"
                            />
                            <div className="absolute -top-2 -right-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                              {item.quantity}
                            </div>
                          </div>
                          <div>
                            <p className="font-bold text-gray-900 text-lg">{item.name}</p>
                            <p className="text-gray-600 text-sm">{item.type}</p>
                            <p className="font-semibold text-indigo-600">${item.price}</p>
                          </div>
                        </div>
                      ))}
                      {order.items.length > 3 && (
                        <div className="flex items-center justify-center bg-gradient-to-r from-gray-100 to-gray-200 rounded-2xl p-6 min-w-max shadow-lg">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-gray-700">
                              +{order.items.length - 3}
                            </div>
                            <div className="text-sm text-gray-600">more items</div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Enhanced Expanded Order Details */}
                  {selectedOrder === order.id && (
                    <div className="border-t border-white/20 bg-gradient-to-r from-gray-50/50 to-white/50 backdrop-blur-sm p-8">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {/* Order Items */}
                        <div>
                          <h4 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                            <Package className="h-6 w-6 mr-3 text-indigo-600" />
                            Order Items
                          </h4>
                          <div className="space-y-4">
                            {order.items.map((item) => (
                              <div key={item.id} className="flex items-center space-x-4 bg-white/70 backdrop-blur-sm p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  className="w-20 h-20 object-cover rounded-xl shadow-md"
                                />
                                <div className="flex-1">
                                  <h5 className="font-bold text-gray-900 text-lg">{item.name}</h5>
                                  <p className="text-gray-600 mb-1">{item.type}</p>
                                  <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                                </div>
                                <div className="text-right">
                                  <p className="font-bold text-gray-900 text-xl">
                                    ${(item.price * item.quantity).toFixed(2)}
                                  </p>
                                  <p className="text-sm text-gray-500">${item.price} each</p>
                                </div>
                                {order.status === 'completed' && (
                                  <button className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-xl text-sm font-bold hover:from-green-600 hover:to-emerald-600 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center">
                                    <Download className="h-4 w-4 mr-2" />
                                    Download
                                  </button>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Order Information */}
                        <div className="space-y-8">
                          {/* Billing Information */}
                          <div>
                            <h4 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                              <Users className="h-6 w-6 mr-3 text-indigo-600" />
                              Billing Information
                            </h4>
                            <div className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl shadow-lg">
                              <div className="flex items-center space-x-4">
                                <div className="p-3 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-xl">
                                  <Users className="h-6 w-6 text-indigo-600" />
                                </div>
                                <div>
                                  <p className="font-bold text-gray-900 text-lg">
                                    {order.billingInfo.firstName} {order.billingInfo.lastName}
                                  </p>
                                  <p className="text-gray-600">{order.billingInfo.email}</p>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Payment Method */}
                          <div>
                            <h4 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                              <DollarSign className="h-6 w-6 mr-3 text-indigo-600" />
                              Payment Method
                            </h4>
                            <div className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl shadow-lg">
                              <div className="flex items-center space-x-4">
                                <div className="p-3 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-xl">
                                  <div className="w-8 h-6 bg-gradient-to-r from-blue-600 to-indigo-600 rounded flex items-center justify-center">
                                    <span className="text-xs font-bold text-white">
                                      {order.paymentMethod.brand.toUpperCase()}
                                    </span>
                                  </div>
                                </div>
                                <div>
                                  <p className="font-bold text-gray-900">
                                    •••• •••• •••• {order.paymentMethod.last4}
                                  </p>
                                  <p className="text-sm text-gray-600">
                                    {order.paymentMethod.brand.charAt(0).toUpperCase() + order.paymentMethod.brand.slice(1)} Card
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Order Summary */}
                          <div>
                            <h4 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                              <TrendingUp className="h-6 w-6 mr-3 text-indigo-600" />
                              Order Summary
                            </h4>
                            <div className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl shadow-lg space-y-4">
                              <div className="flex justify-between text-lg">
                                <span className="text-gray-600">Subtotal</span>
                                <span className="font-semibold text-gray-900">${order.total.toFixed(2)}</span>
                              </div>
                              <div className="flex justify-between text-lg">
                                <span className="text-gray-600">Tax</span>
                                <span className="font-semibold text-gray-900">$0.00</span>
                              </div>
                              <div className="flex justify-between text-lg">
                                <span className="text-gray-600">Processing Fee</span>
                                <span className="font-semibold text-gray-900">$0.00</span>
                              </div>
                              <div className="border-t border-gray-200 pt-4">
                                <div className="flex justify-between">
                                  <span className="text-xl font-bold text-gray-900">Total</span>
                                  <span className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                                    ${order.total.toFixed(2)}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Enhanced Order Actions */}
                          <div className="space-y-3">
                            {order.status === 'completed' && (
                              <button className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white py-4 px-6 rounded-2xl font-bold text-lg hover:from-green-600 hover:to-emerald-600 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center">
                                <Download className="h-5 w-5 mr-3" />
                                Download All Items
                              </button>
                            )}
                            
                            {order.status === 'failed' && (
                              <button className="w-full bg-gradient-to-r from-red-500 to-pink-500 text-white py-4 px-6 rounded-2xl font-bold text-lg hover:from-red-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 shadow-lg">
                                Retry Payment
                              </button>
                            )}
                            
                            <button className="w-full bg-white/70 backdrop-blur-sm border-2 border-gray-200 text-gray-700 py-4 px-6 rounded-2xl font-bold text-lg hover:bg-white/90 hover:border-indigo-300 transition-all duration-300 transform hover:scale-105 shadow-lg">
                              Contact Support
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderHistory;
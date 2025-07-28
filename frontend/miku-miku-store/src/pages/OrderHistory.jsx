import React, { useState, useEffect } from 'react';
import { Package, Download, Eye, Calendar, DollarSign, CheckCircle, Clock, XCircle } from 'lucide-react';
import { ordersAPI } from '../services/api';

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
        return 'bg-green-100 text-green-800';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-6">
            <div className="bg-gray-200 h-8 w-48 rounded"></div>
            {[...Array(3)].map((_, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="space-y-2">
                    <div className="bg-gray-200 h-4 w-32 rounded"></div>
                    <div className="bg-gray-200 h-3 w-24 rounded"></div>
                  </div>
                  <div className="bg-gray-200 h-6 w-20 rounded"></div>
                </div>
                <div className="space-y-3">
                  <div className="bg-gray-200 h-16 rounded"></div>
                  <div className="bg-gray-200 h-4 w-full rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Order History</h1>
          <p className="text-gray-600 mt-2">View and manage your past orders</p>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-12">
            <Package className="h-24 w-24 text-gray-300 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">No orders yet</h2>
            <p className="text-gray-600 mb-8">
              When you make your first purchase, it will appear here.
            </p>
            <a
              href="/products"
              className="bg-indigo-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition duration-200"
            >
              Start Shopping
            </a>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                {/* Order Header */}
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          Order {order.id}
                        </h3>
                        <div className="flex items-center space-x-4 mt-1">
                          <div className="flex items-center text-sm text-gray-600">
                            <Calendar className="h-4 w-4 mr-1" />
                            {new Date(order.date).toLocaleDateString()}
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <DollarSign className="h-4 w-4 mr-1" />
                            ${order.total.toFixed(2)}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                        {getStatusIcon(order.status)}
                        <span className="ml-1">{getStatusText(order.status)}</span>
                      </div>
                      
                      <button
                        onClick={() => setSelectedOrder(selectedOrder === order.id ? null : order.id)}
                        className="text-indigo-600 hover:text-indigo-700 font-medium text-sm flex items-center"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        {selectedOrder === order.id ? 'Hide Details' : 'View Details'}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Order Items Preview */}
                <div className="p-6">
                  <div className="flex items-center space-x-4">
                    {order.items.slice(0, 3).map((item) => (
                      <div key={item.id} className="flex items-center space-x-2">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-12 h-12 object-cover rounded-lg"
                        />
                        <div className="text-sm">
                          <p className="font-medium text-gray-900">{item.name}</p>
                          <p className="text-gray-600">Qty: {item.quantity}</p>
                        </div>
                      </div>
                    ))}
                    {order.items.length > 3 && (
                      <div className="text-sm text-gray-600">
                        +{order.items.length - 3} more items
                      </div>
                    )}
                  </div>
                </div>

                {/* Expanded Order Details */}
                {selectedOrder === order.id && (
                  <div className="border-t border-gray-200 bg-gray-50 p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      {/* Order Items */}
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-4">Order Items</h4>
                        <div className="space-y-4">
                          {order.items.map((item) => (
                            <div key={item.id} className="flex items-center space-x-4 bg-white p-4 rounded-lg">
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-16 h-16 object-cover rounded-lg"
                              />
                              <div className="flex-1">
                                <h5 className="font-medium text-gray-900">{item.name}</h5>
                                <p className="text-sm text-gray-600">{item.type}</p>
                                <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                              </div>
                              <div className="text-right">
                                <p className="font-medium text-gray-900">
                                  ${(item.price * item.quantity).toFixed(2)}
                                </p>
                                <p className="text-sm text-gray-500">${item.price} each</p>
                              </div>
                              {order.status === 'completed' && (
                                <button className="bg-indigo-600 text-white px-3 py-1 rounded text-sm hover:bg-indigo-700 flex items-center">
                                  <Download className="h-3 w-3 mr-1" />
                                  Download
                                </button>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Order Information */}
                      <div className="space-y-6">
                        {/* Billing Information */}
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900 mb-4">Billing Information</h4>
                          <div className="bg-white p-4 rounded-lg">
                            <p className="font-medium text-gray-900">
                              {order.billingInfo.firstName} {order.billingInfo.lastName}
                            </p>
                            <p className="text-sm text-gray-600">{order.billingInfo.email}</p>
                          </div>
                        </div>

                        {/* Payment Method */}
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900 mb-4">Payment Method</h4>
                          <div className="bg-white p-4 rounded-lg">
                            <div className="flex items-center">
                              <div className="w-8 h-5 bg-gray-200 rounded mr-3 flex items-center justify-center">
                                <span className="text-xs font-bold text-gray-600">
                                  {order.paymentMethod.brand.toUpperCase()}
                                </span>
                              </div>
                              <span className="text-sm text-gray-900">
                                •••• •••• •••• {order.paymentMethod.last4}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Order Summary */}
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h4>
                          <div className="bg-white p-4 rounded-lg space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Subtotal</span>
                              <span className="font-medium">${order.total.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Tax</span>
                              <span className="font-medium">$0.00</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Processing Fee</span>
                              <span className="font-medium">$0.00</span>
                            </div>
                            <div className="border-t pt-2">
                              <div className="flex justify-between">
                                <span className="font-semibold text-gray-900">Total</span>
                                <span className="font-semibold text-gray-900">
                                  ${order.total.toFixed(2)}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Order Actions */}
                        <div className="space-y-2">
                          {order.status === 'completed' && (
                            <button className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition duration-200 flex items-center justify-center">
                              <Download className="h-4 w-4 mr-2" />
                              Download All Items
                            </button>
                          )}
                          
                          {order.status === 'failed' && (
                            <button className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition duration-200">
                              Retry Payment
                            </button>
                          )}
                          
                          <button className="w-full border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition duration-200">
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
  );
};

export default OrderHistory;
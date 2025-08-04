import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  CreditCard,
  Shield,
  Truck,
  ArrowLeft,
  AlertCircle,
  CheckCircle2,
  Lock,
  User,
  Mail,
  MapPin,
  Phone,
  QrCode,
  Timer,
  ShoppingBag,
  X
} from 'lucide-react';
import { QRCodeCanvas } from 'qrcode.react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { api, handleApiError } from '../services/api';

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

// QR Code Payment component
const QRCodePayment = ({ paymentUrl, onCancel, timeRemaining, isLoading }) => {
  return (
    <div className="bg-gray-50 rounded-lg p-6 mt-4">
      <h4 className="text-lg font-semibold text-gray-900 mb-4">Pay with QR Code</h4>
      {isLoading ? (
        <div className="flex justify-center py-8">
          <LoadingSpinner size="lg" />
        </div>
      ) : (
        <>
          <div className="flex justify-center mb-4">
            <QRCodeCanvas
              value={paymentUrl}
              size={200}
              bgColor="#ffffff"
              fgColor="#000000"
              level="H"
              includeMargin={true}
              className="rounded-lg shadow-md"
            />
          </div>
          <div className="text-center space-y-3">
            <p className="text-sm text-gray-600">
              Scan this QR code with your mobile payment app to complete the payment.
            </p>
            <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
              <Timer className="h-4 w-4" />
              <span>Time remaining: {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}</span>
            </div>
            <button
              onClick={onCancel}
              className="text-sm text-indigo-600 hover:text-indigo-700 font-semibold focus:underline"
            >
              Cancel QR Payment
            </button>
          </div>
        </>
      )}
    </div>
  );
};

// Empty cart component
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

const Checkout = () => {
  const { items, getTotalPrice, getTotalItems, setShippingInfo, clearCart, syncWithServer } = useCart();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: user?.name || '',
    email: user?.email || '',
    phone: '',
    address: '',
    address2: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    deliveryInstructions: ''
  });
  const [paymentMethod, setPaymentMethod] = useState('creditCard');
  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [qrPaymentUrl, setQrPaymentUrl] = useState(null);
  const [qrTimeRemaining, setQrTimeRemaining] = useState(300); // 5 minutes in seconds
  const [isQrLoading, setIsQrLoading] = useState(false);

  const totalPrice = getTotalPrice().toFixed(2);
  const totalItems = getTotalItems();
  const shipping = 0;
  const tax = (parseFloat(totalPrice) * 0.08).toFixed(2);
  const finalTotal = (parseFloat(totalPrice) + parseFloat(tax)).toFixed(2);

  // QR code timer
  useEffect(() => {
    let timer;
    if (qrPaymentUrl && qrTimeRemaining > 0) {
      timer = setInterval(() => {
        setQrTimeRemaining((prev) => {
          if (prev <= 1) {
            setQrPaymentUrl(null);
            setToast({ message: 'QR code payment timed out', type: 'error' });
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [qrPaymentUrl, qrTimeRemaining]);

  // Pre-fill form with user data
  useEffect(() => {
    if (isAuthenticated && user) {
      setFormData((prev) => ({
        ...prev,
        fullName: user.name || prev.fullName,
        email: user.email || prev.email
      }));
    }
  }, [isAuthenticated, user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    const requiredFields = ['fullName', 'email', 'address', 'city', 'zipCode', 'country'];
    
    requiredFields.forEach((field) => {
      if (!formData[field]?.trim()) {
        newErrors[field] = `${field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1')} is required`;
      }
    });

    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (formData.phone && !/^\+?\d{10,15}$/.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    if (formData.zipCode && !/^\d{5}(-\d{4})?$/.test(formData.zipCode)) {
      newErrors.zipCode = 'Please enter a valid ZIP code';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleGenerateQrCode = async () => {
    setIsQrLoading(true);
    try {
      const response = await api.post('/payment/create-qr-intent', {
        amount: parseFloat(finalTotal) * 100,
        currency: 'usd'
      });
      setQrPaymentUrl(response.data.paymentUrl);
      setQrTimeRemaining(300);
    } catch (error) {
      const errorMessage = handleApiError(error).message;
      setToast({ message: errorMessage, type: 'error' });
    } finally {
      setIsQrLoading(false);
    }
  };

  const handleCancelQrPayment = () => {
    setQrPaymentUrl(null);
    setQrTimeRemaining(300);
    setPaymentMethod('creditCard');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      setToast({ message: 'Please fill in all required fields correctly', type: 'error' });
      return;
    }

    setIsSubmitting(true);
    try {
      const shippingResult = setShippingInfo(formData);
      if (!shippingResult.success) {
        throw new Error(shippingResult.error);
      }

      if (paymentMethod === 'qrCode') {
        const paymentResponse = await api.get(`/payment/check-qr-status/${qrPaymentUrl.split('/').pop()}`);
        if (!paymentResponse.data.isPaid) {
          throw new Error('QR code payment not completed');
        }
      } else {
        const paymentResponse = await api.post('/payment/create-intent', {
          amount: parseFloat(finalTotal) * 100,
          currency: 'usd'
        });
        const paymentIntentId = paymentResponse.data.paymentIntentId;
        await api.post('/payment/confirm', { paymentIntentId });
      }

      const orderResponse = await api.post('/orders', {
        items: items.map(item => ({
          productId: item.id,
          quantity: item.quantity,
          price: item.price
        })),
        shippingInfo: formData,
        total: parseFloat(finalTotal),
        paymentMethod
      });

      await clearCart(true);
      if (isAuthenticated) {
        await syncWithServer();
      }

      setToast({ message: 'Order placed successfully!', type: 'success' });
      setTimeout(() => {
        navigate('/order-confirmation', { state: { orderId: orderResponse.data.orderId } });
      }, 2000);
    } catch (error) {
      const errorMessage = handleApiError(error).message;
      setToast({ message: errorMessage, type: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const showToast = (message, type) => {
    setToast({ message, type });
  };

  const hideToast = () => {
    setToast(null);
  };

  if (items.length === 0) {
    return <EmptyCart />;
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <Link
              to="/cart"
              className="inline-flex items-center text-indigo-600 hover:text-indigo-700 focus:underline font-semibold text-lg mb-4"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Cart
            </Link>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Checkout</h1>
            <p className="text-lg text-gray-600">
              Complete your order for {totalItems} {totalItems === 1 ? 'item' : 'items'}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Checkout Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-lg p-6 border">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Shipping Information</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Personal Information */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                        Full Name
                      </label>
                      <div className="mt-1 relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <User className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          id="fullName"
                          name="fullName"
                          type="text"
                          value={formData.fullName}
                          onChange={handleInputChange}
                          className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                            errors.fullName ? 'border-red-300' : 'border-gray-300'
                          }`}
                          placeholder="John Doe"
                        />
                      </div>
                      {errors.fullName && (
                        <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>
                      )}
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        Email
                      </label>
                      <div className="mt-1 relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Mail className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                            errors.email ? 'border-red-300' : 'border-gray-300'
                          }`}
                          placeholder="you@example.com"
                        />
                      </div>
                      {errors.email && (
                        <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                      )}
                    </div>
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                        Phone (Optional)
                      </label>
                      <div className="mt-1 relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Phone className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          id="phone"
                          name="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                            errors.phone ? 'border-red-300' : 'border-gray-300'
                          }`}
                          placeholder="+1 (555) 123-4567"
                        />
                      </div>
                      {errors.phone && (
                        <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                      )}
                    </div>
                  </div>

                  {/* Address Information */}
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                        Address
                      </label>
                      <div className="mt-1 relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <MapPin className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          id="address"
                          name="address"
                          type="text"
                          value={formData.address}
                          onChange={handleInputChange}
                          className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                            errors.address ? 'border-red-300' : 'border-gray-300'
                          }`}
                          placeholder="123 Main St"
                        />
                      </div>
                      {errors.address && (
                        <p className="mt-1 text-sm text-red-600">{errors.address}</p>
                      )}
                    </div>
                    <div>
                      <label htmlFor="address2" className="block text-sm font-medium text-gray-700">
                        Address Line 2 (Optional)
                      </label>
                      <input
                        id="address2"
                        name="address2"
                        type="text"
                        value={formData.address2}
                        onChange={handleInputChange}
                        className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        placeholder="Apt, Suite, etc."
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                          City
                        </label>
                        <input
                          id="city"
                          name="city"
                          type="text"
                          value={formData.city}
                          onChange={handleInputChange}
                          className={`block w-full px-3 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                            errors.city ? 'border-red-300' : 'border-gray-300'
                          }`}
                          placeholder="City"
                        />
                        {errors.city && (
                          <p className="mt-1 text-sm text-red-600">{errors.city}</p>
                        )}
                      </div>
                      <div>
                        <label htmlFor="state" className="block text-sm font-medium text-gray-700">
                          State
                        </label>
                        <input
                          id="state"
                          name="state"
                          type="text"
                          value={formData.state}
                          onChange={handleInputChange}
                          className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          placeholder="State"
                        />
                      </div>
                      <div>
                        <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700">
                          ZIP Code
                        </label>
                        <input
                          id="zipCode"
                          name="zipCode"
                          type="text"
                          value={formData.zipCode}
                          onChange={handleInputChange}
                          className={`block w-full px-3 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                            errors.zipCode ? 'border-red-300' : 'border-gray-300'
                          }`}
                          placeholder="12345"
                        />
                        {errors.zipCode && (
                          <p className="mt-1 text-sm text-red-600">{errors.zipCode}</p>
                        )}
                      </div>
                    </div>
                    <div>
                      <label htmlFor="country" className="block text-sm font-medium text-gray-700">
                        Country
                      </label>
                      <input
                        id="country"
                        name="country"
                        type="text"
                        value={formData.country}
                        onChange={handleInputChange}
                        className={`block w-full px-3 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                          errors.country ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="Country"
                      />
                      {errors.country && (
                        <p className="mt-1 text-sm text-red-600">{errors.country}</p>
                      )}
                    </div>
                    <div>
                      <label htmlFor="deliveryInstructions" className="block text-sm font-medium text-gray-700">
                        Delivery Instructions (Optional)
                      </label>
                      <textarea
                        id="deliveryInstructions"
                        name="deliveryInstructions"
                        value={formData.deliveryInstructions}
                        onChange={handleInputChange}
                        className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        placeholder="Any special delivery instructions"
                        rows={3}
                      />
                    </div>
                  </div>

                  {/* Payment Method */}
                  <div className="pt-6 border-t border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Method</h3>
                    <div className="space-y-4">
                      <label className="flex items-center space-x-3 p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="creditCard"
                          checked={paymentMethod === 'creditCard'}
                          onChange={(e) => {
                            setPaymentMethod(e.target.value);
                            setQrPaymentUrl(null);
                          }}
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                        />
                        <CreditCard className="h-5 w-5 text-gray-600" />
                        <span className="text-sm font-medium text-gray-900">Credit/Debit Card</span>
                      </label>
                      <label className="flex items-center space-x-3 p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="paypal"
                          checked={paymentMethod === 'paypal'}
                          onChange={(e) => {
                            setPaymentMethod(e.target.value);
                            setQrPaymentUrl(null);
                          }}
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                        />
                        <img
                          src="https://www.paypalobjects.com/webstatic/icon/pp258.png"
                          alt="PayPal"
                          className="h-5 w-auto"
                        />
                        <span className="text-sm font-medium text-gray-900">PayPal</span>
                      </label>
                      <label className="flex items-center space-x-3 p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="qrCode"
                          checked={paymentMethod === 'qrCode'}
                          onChange={(e) => {
                            setPaymentMethod(e.target.value);
                            handleGenerateQrCode();
                          }}
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                        />
                        <QrCode className="h-5 w-5 text-gray-600" />
                        <span className="text-sm font-medium text-gray-900">Pay with QR Code</span>
                      </label>
                    </div>
                    {paymentMethod === 'qrCode' && (
                      <QRCodePayment
                        paymentUrl={qrPaymentUrl}
                        onCancel={handleCancelQrPayment}
                        timeRemaining={qrTimeRemaining}
                        isLoading={isQrLoading}
                      />
                    )}
                  </div>

                  {/* Submit Button */}
                  <div className="pt-6 border-t border-gray-200">
                    <button
                      type="submit"
                      disabled={isSubmitting || (paymentMethod === 'qrCode' && !qrPaymentUrl)}
                      className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 px-6 rounded-xl font-bold hover:from-indigo-700 hover:to-purple-700 focus:ring-4 focus:ring-indigo-200 transition-all duration-200 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <div className="flex items-center justify-center">
                          <LoadingSpinner />
                          <span className="ml-2">Processing...</span>
                        </div>
                      ) : (
                        'Place Order'
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-lg p-6 sticky top-8 border">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">
                      Subtotal ({totalItems} {totalItems === 1 ? 'item' : 'items'})
                    </span>
                    <span className="font-semibold text-lg">${totalPrice}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-semibold text-green-600">FREE</span>
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

                {/* Order Items */}
                <div className="border-t border-gray-200 pt-6 mb-6">
                  <h3 className="text-sm font-semibold text-gray-900 mb-4">Items in Your Order</h3>
                  <div className="space-y-4">
                    {items.map((item) => (
                      <div key={item.id} className="flex items-center space-x-3 hover:bg-gray-50 p-2 rounded-lg transition-all duration-200">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-12 h-12 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <h4 className="text-sm font-medium text-gray-900 truncate">
                            <Link to={`/product/${item.id}`} className="hover:text-indigo-600">
                              {item.name}
                            </Link>
                          </h4>
                          <p className="text-xs text-gray-600">
                            {item.quantity} x ${item.price.toFixed(2)}
                          </p>
                          {item.features?.length > 0 && (
                            <div className="mt-1 flex flex-wrap gap-1">
                              {item.features.slice(0, 2).map((feature, index) => (
                                <span key={index} className="text-xs text-gray-500">
                                  {feature}
                                  {index < 1 && item.features.length > 1 ? ', ' : ''}
                                </span>
                              ))}
                              {item.features.length > 2 && (
                                <span className="text-xs text-gray-500">
                                  +{item.features.length - 2} more
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                        <span className="text-sm font-semibold text-gray-900">
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Security Features */}
                <div className="space-y-3 text-sm text-gray-600 bg-gray-50 rounded-lg p-4">
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
              </div>
            </div>
          </div>
        </div>
      </div>

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

export default Checkout;
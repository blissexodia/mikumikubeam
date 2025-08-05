import React, { useState, useEffect, useCallback, useMemo } from 'react';
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
  X,
  Eye,
  EyeOff,
  Calendar,
  Zap,
  Star,
  ChevronDown,
  Gift
} from 'lucide-react';
import { QRCodeCanvas } from 'qrcode.react';

// Mock hooks for demonstration
const useCart = () => ({
  items: [
    {
      id: 1,
      name: 'Netflix Premium Subscription',
      price: 15.99,
      quantity: 1,
      image: 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=100&h=100&fit=crop',
      features: ['4K Ultra HD', '4 screens', 'Download content'],
      type: 'Monthly Subscription'
    },
    {
      id: 2,
      name: 'Spotify Premium',
      price: 9.99,
      quantity: 1,
      image: 'https://images.unsplash.com/photo-1611339555312-e607c8352fd7?w=100&h=100&fit=crop',
      features: ['Ad-free music', 'Offline downloads'],
      type: 'Monthly Subscription'
    }
  ],
  getTotalPrice: () => 25.98,
  getTotalItems: () => 2,
  setShippingInfo: () => ({ success: true }),
  clearCart: () => Promise.resolve(),
  syncWithServer: () => Promise.resolve()
});

const useAuth = () => ({
  user: { name: 'John Doe', email: 'john@example.com' },
  isAuthenticated: true
});

// Enhanced Toast component with better animations
const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const config = {
    success: {
      bg: 'bg-gradient-to-r from-green-50 to-emerald-50',
      border: 'border-green-200',
      text: 'text-green-800',
      icon: CheckCircle2,
      iconColor: 'text-green-600'
    },
    error: {
      bg: 'bg-gradient-to-r from-red-50 to-pink-50',
      border: 'border-red-200',
      text: 'text-red-800',
      icon: AlertCircle,
      iconColor: 'text-red-600'
    }
  };

  const { bg, border, text, icon: Icon, iconColor } = config[type];

  return (
    <div className={`fixed top-6 right-6 ${bg} border ${border} ${text} px-6 py-4 rounded-2xl shadow-2xl z-50 flex items-center space-x-3 animate-slide-in backdrop-blur-sm max-w-md`}>
      <Icon className={`h-5 w-5 ${iconColor} flex-shrink-0`} />
      <span className="text-sm font-medium flex-1">{message}</span>
      <button 
        onClick={onClose} 
        className={`${iconColor} hover:opacity-70 p-1 rounded-full hover:bg-white/20 transition-colors`}
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};

// Enhanced Loading spinner
const LoadingSpinner = ({ size = 'sm', color = 'indigo' }) => {
  const sizeClasses = {
    sm: 'h-4 w-4 border-2',
    md: 'h-6 w-6 border-2',
    lg: 'h-8 w-8 border-3'
  };
  
  const colorClasses = {
    indigo: 'border-gray-200 border-t-indigo-600',
    white: 'border-white/30 border-t-white'
  };

  return (
    <div className={`animate-spin rounded-full ${sizeClasses[size]} ${colorClasses[color]}`} />
  );
};

// Enhanced QR Code Payment component
const QRCodePayment = ({ paymentUrl, paymentId, onCancel, timeRemaining, isLoading }) => {
  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;
  const progressPercentage = ((300 - timeRemaining) / 300) * 100;

  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8 mt-6 border border-gray-200">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl mb-6">
          <QrCode className="h-8 w-8 text-white" />
        </div>
        <h4 className="text-2xl font-bold text-gray-900 mb-3">Scan to Pay</h4>
        <p className="text-gray-600 mb-6 max-w-sm mx-auto">
          Use your mobile payment app to scan the QR code and complete your purchase securely.
        </p>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center py-12 space-y-4">
          <LoadingSpinner size="lg" />
          <p className="text-gray-600 font-medium">Generating secure QR code...</p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex justify-center">
            <div className="relative p-4 bg-white rounded-3xl shadow-xl border-4 border-gray-100 transform hover:scale-105 transition-all duration-300">
              <QRCodeCanvas
                value={paymentUrl}
                size={180}
                bgColor="#ffffff"
                fgColor="#000000"
                level="H"
                includeMargin={true}
                className="rounded-2xl"
              />
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-indigo-500/5 to-purple-500/5 pointer-events-none" />
            </div>
          </div>

          {/* Timer with progress bar */}
          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <Timer className="h-5 w-5 text-indigo-600" />
                <span className="text-sm font-semibold text-gray-700">Time remaining</span>
              </div>
              <span className="text-lg font-bold text-gray-900 tabular-nums">
                {minutes}:{seconds.toString().padStart(2, '0')}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${100 - (timeRemaining / 300) * 100}%` }}
              />
            </div>
          </div>

          <div className="text-center space-y-3">
            <div className="flex items-center justify-center space-x-6 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <Shield className="h-4 w-4 text-green-500" />
                <span>Secure Payment</span>
              </div>
              <div className="flex items-center space-x-2">
                <Zap className="h-4 w-4 text-yellow-500" />
                <span>Instant Processing</span>
              </div>
            </div>
            <button
              onClick={() => onCancel(paymentId)}
              className="text-sm text-gray-500 hover:text-gray-700 font-medium transition-colors"
            >
              Cancel and choose different payment method
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Enhanced Empty Cart component
const EmptyCart = () => (
  <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-indigo-50 py-12 flex items-center">
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center">
        <div className="relative mb-8">
          <div className="inline-flex items-center justify-center w-32 h-32 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full mb-6">
            <ShoppingBag className="h-16 w-16 text-gray-400" />
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-600/10 rounded-full blur-3xl" />
        </div>
        
        <h1 className="text-5xl font-bold text-gray-900 mb-4">Cart Empty</h1>
        <p className="text-xl text-gray-600 mb-8 max-w-md mx-auto leading-relaxed">
          Your shopping cart is waiting for some amazing digital products. Let's fill it up!
        </p>
        
        <div className="space-y-4">
          <Link
            to="/products"
            className="inline-flex items-center bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:from-indigo-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-xl"
          >
            <Gift className="h-6 w-6 mr-3" />
            Explore Products
          </Link>
          
          <div className="flex items-center justify-center space-x-6 text-sm text-gray-500 mt-8">
            <div className="flex items-center space-x-2">
              <Shield className="h-4 w-4" />
              <span>Secure Shopping</span>
            </div>
            <div className="flex items-center space-x-2">
              <Zap className="h-4 w-4" />
              <span>Instant Delivery</span>
            </div>
            <div className="flex items-center space-x-2">
              <Star className="h-4 w-4" />
              <span>Premium Quality</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Enhanced Input Field component
const InputField = ({ label, name, type = 'text', value, onChange, error, icon: Icon, placeholder, required = false, ...props }) => (
  <div className="space-y-2">
    <label htmlFor={name} className="block text-sm font-semibold text-gray-700">
      {label} {!required && <span className="text-gray-400 font-normal">(Optional)</span>}
    </label>
    <div className="relative">
      {Icon && (
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Icon className="h-5 w-5 text-gray-400" />
        </div>
      )}
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        className={`block w-full ${Icon ? 'pl-12' : 'pl-4'} pr-4 py-4 border-2 rounded-xl text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 ${
          error ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-gray-300 focus:border-indigo-500'
        }`}
        placeholder={placeholder}
        {...props}
      />
    </div>
    {error && (
      <div className="flex items-center space-x-2 text-red-600">
        <AlertCircle className="h-4 w-4" />
        <p className="text-sm font-medium">{error}</p>
      </div>
    )}
  </div>
);

// Enhanced Payment Method Card
const PaymentMethodCard = ({ method, selected, onSelect, children }) => (
  <label className={`relative flex items-center space-x-4 p-6 border-2 rounded-2xl cursor-pointer transition-all duration-300 ${
    selected 
      ? 'border-indigo-500 bg-indigo-50 shadow-lg transform scale-[1.02]' 
      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
  }`}>
    <input
      type="radio"
      name="paymentMethod"
      value={method}
      checked={selected}
      onChange={onSelect}
      className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 focus:ring-2"
    />
    <div className="flex-1">
      {children}
    </div>
    {selected && (
      <div className="absolute top-3 right-3">
        <CheckCircle2 className="h-5 w-5 text-indigo-600" />
      </div>
    )}
  </label>
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
    country: 'United States',
    deliveryInstructions: ''
  });
  
  const [paymentMethod, setPaymentMethod] = useState('creditCard');
  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [qrPayment, setQrPayment] = useState({ url: null, paymentId: null });
  const [qrTimeRemaining, setQrTimeRemaining] = useState(300);
  const [isQrLoading, setIsQrLoading] = useState(false);
  const [showCardDetails, setShowCardDetails] = useState(false);

  // Calculate totals
  const totals = useMemo(() => {
    const subtotal = getTotalPrice();
    const tax = subtotal * 0.08;
    const shipping = 0;
    const total = subtotal + tax + shipping;
    
    return {
      subtotal: subtotal.toFixed(2),
      tax: tax.toFixed(2),
      shipping: shipping.toFixed(2),
      total: total.toFixed(2)
    };
  }, [getTotalPrice]);

  const totalItems = getTotalItems();

  // QR code timer effect
  useEffect(() => {
    let timer;
    if (qrPayment.url && qrTimeRemaining > 0) {
      timer = setInterval(() => {
        setQrTimeRemaining((prev) => {
          if (prev <= 1) {
            setQrPayment({ url: null, paymentId: null });
            setToast({ message: 'QR code payment session expired', type: 'error' });
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [qrPayment.url, qrTimeRemaining]);

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
    const requiredFields = [
      { field: 'fullName', label: 'Full name' },
      { field: 'email', label: 'Email' },
      { field: 'address', label: 'Address' },
      { field: 'city', label: 'City' },
      { field: 'zipCode', label: 'ZIP code' },
      { field: 'country', label: 'Country' }
    ];
    
    requiredFields.forEach(({ field, label }) => {
      if (!formData[field]?.trim()) {
        newErrors[field] = `${label} is required`;
      }
    });

    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (formData.phone && !/^\+?[\d\s\-\(\)]{10,}$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    if (formData.zipCode && !/^\d{5}(-\d{4})?$/.test(formData.zipCode)) {
      newErrors.zipCode = 'Please enter a valid ZIP code (e.g., 12345 or 12345-6789)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleGenerateQrCode = async () => {
    setIsQrLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      const mockPaymentUrl = `https://pay.example.com/qr/${Date.now()}`;
      setQrPayment({ url: mockPaymentUrl, paymentId: Date.now().toString() });
      setQrTimeRemaining(300);
      setToast({ message: 'QR code generated successfully', type: 'success' });
    } catch (error) {
      setToast({ message: 'Failed to generate QR code. Please try again.', type: 'error' });
    } finally {
      setIsQrLoading(false);
    }
  };

  const handleCancelQrPayment = () => {
    setQrPayment({ url: null, paymentId: null });
    setQrTimeRemaining(300);
    setPaymentMethod('creditCard');
    setToast({ message: 'QR payment cancelled', type: 'success' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      setToast({ message: 'Please check and fill in all required fields', type: 'error' });
      return;
    }

    setIsSubmitting(true);
    try {
      // Simulate processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setToast({ message: 'Order placed successfully! Redirecting...', type: 'success' });
      
      setTimeout(() => {
        navigate('/order-confirmation', { 
          state: { 
            orderId: `ORD-${Date.now()}`,
            total: totals.total,
            items: items.length
          } 
        });
      }, 1500);
    } catch (error) {
      setToast({ message: 'Failed to process order. Please try again.', type: 'error' });
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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-indigo-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <Link
              to="/cart"
              className="inline-flex items-center text-indigo-600 hover:text-indigo-700 font-semibold text-lg mb-6 group transition-colors"
            >
              <ArrowLeft className="h-5 w-5 mr-2 group-hover:-translate-x-1 transition-transform" />
              Back to Cart
            </Link>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">
                  Secure Checkout
                </h1>
                <p className="text-xl text-gray-600">
                  Complete your order for <span className="font-semibold text-indigo-600">{totalItems}</span> {totalItems === 1 ? 'item' : 'items'}
                </p>
              </div>
              <div className="hidden md:flex items-center space-x-4 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <Shield className="h-5 w-5 text-green-500" />
                  <span>SSL Secured</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Zap className="h-5 w-5 text-yellow-500" />
                  <span>Instant Delivery</span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Checkout Form */}
            <div className="lg:col-span-2 space-y-8">
              {/* Shipping Information */}
              <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
                <div className="flex items-center space-x-3 mb-8">
                  <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl">
                    <User className="h-5 w-5 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Shipping Information</h2>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Personal Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputField
                      label="Full Name"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      error={errors.fullName}
                      icon={User}
                      placeholder="Enter your full name"
                      required
                    />
                    <InputField
                      label="Email Address"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      error={errors.email}
                      icon={Mail}
                      placeholder="you@example.com"
                      required
                    />
                  </div>

                  <InputField
                    label="Phone Number"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleInputChange}
                    error={errors.phone}
                    icon={Phone}
                    placeholder="+1 (555) 123-4567"
                  />

                  {/* Address Information */}
                  <div className="space-y-6">
                    <InputField
                      label="Street Address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      error={errors.address}
                      icon={MapPin}
                      placeholder="123 Main Street"
                      required
                    />

                    <InputField
                      label="Apartment, suite, etc."
                      name="address2"
                      value={formData.address2}
                      onChange={handleInputChange}
                      placeholder="Apt 4B, Suite 100, etc."
                    />

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <InputField
                        label="City"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        error={errors.city}
                        placeholder="New York"
                        required
                      />
                      <InputField
                        label="State"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        placeholder="NY"
                      />
                      <InputField
                        label="ZIP Code"
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={handleInputChange}
                        error={errors.zipCode}
                        placeholder="10001"
                        required
                      />
                    </div>

                    <InputField
                      label="Country"
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      error={errors.country}
                      placeholder="United States"
                      required
                    />

                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700">
                        Delivery Instructions <span className="text-gray-400 font-normal">(Optional)</span>
                      </label>
                      <textarea
                        name="deliveryInstructions"
                        value={formData.deliveryInstructions}
                        onChange={handleInputChange}
                        className="block w-full px-4 py-4 border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 resize-none"
                        placeholder="Any special instructions for delivery..."
                        rows={3}
                      />
                    </div>
                  </div>
                </form>
              </div>

              {/* Payment Method */}
              <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
                <div className="flex items-center space-x-3 mb-8">
                  <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl">
                    <CreditCard className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">Payment Method</h3>
                </div>

                <div className="space-y-4">
                  <PaymentMethodCard
                    method="creditCard"
                    selected={paymentMethod === 'creditCard'}
                    onSelect={(e) => {
                      setPaymentMethod(e.target.value);
                      setQrPayment({ url: null, paymentId: null });
                    }}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl">
                        <CreditCard className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">Credit or Debit Card</div>
                        <div className="text-sm text-gray-600">Visa, Mastercard, American Express</div>
                      </div>
                    </div>
                  </PaymentMethodCard>

                  <PaymentMethodCard
                    method="paypal"
                    selected={paymentMethod === 'paypal'}
                    onSelect={(e) => {
                      setPaymentMethod(e.target.value);
                      setQrPayment({ url: null, paymentId: null });
                    }}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl">
                        <img
                          src="https://www.paypalobjects.com/webstatic/icon/pp258.png"
                          alt="PayPal"
                          className="h-8 w-auto"
                        />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">PayPal</div>
                        <div className="text-sm text-gray-600">Pay with your PayPal account</div>
                      </div>
                    </div>
                  </PaymentMethodCard>

                  <PaymentMethodCard
                    method="qrCode"
                    selected={paymentMethod === 'qrCode'}
                    onSelect={(e) => {
                      setPaymentMethod(e.target.value);
                      handleGenerateQrCode();
                    }}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl">
                        <QrCode className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">QR Code Payment</div>
                        <div className="text-sm text-gray-600">Scan with your mobile device</div>
                      </div>
                    </div>
                  </PaymentMethodCard>
                </div>

                {paymentMethod === 'qrCode' && (
                  <QRCodePayment
                    paymentUrl={qrPayment.url}
                    paymentId={qrPayment.paymentId}
                    onCancel={handleCancelQrPayment}
                    timeRemaining={qrTimeRemaining}
                    isLoading={isQrLoading}
                  />
                )}

                {/* Submit Button */}
                <div className="mt-8 pt-8 border-t border-gray-200">
                  <button
                    type="submit"
                    onClick={handleSubmit}
                    disabled={isSubmitting || (paymentMethod === 'qrCode' && !qrPayment.url)}
                    className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-5 px-8 rounded-2xl font-bold text-lg hover:from-indigo-700 hover:to-purple-700 focus:ring-4 focus:ring-indigo-200 transition-all duration-300 transform hover:scale-[1.02] shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center justify-center space-x-3">
                        <LoadingSpinner color="white" />
                        <span>Processing your order...</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center space-x-3">
                        <Lock className="h-5 w-5" />
                        <span>Complete Secure Order</span>
                      </div>
                    )}
                  </button>
                  
                  <div className="mt-4 flex items-center justify-center space-x-6 text-sm text-gray-500">
                    <div className="flex items-center space-x-2">
                      <Shield className="h-4 w-4" />
                      <span>256-bit SSL encryption</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Zap className="h-4 w-4" />
                      <span>Instant delivery</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-3xl shadow-xl p-8 sticky top-8 border border-gray-100">
                <div className="flex items-center space-x-3 mb-8">
                  <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl">
                    <ShoppingBag className="h-5 w-5 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Order Summary</h2>
                </div>

                {/* Pricing Breakdown */}
                <div className="space-y-4 mb-8">
                  <div className="flex justify-between items-center py-3 border-b border-gray-100">
                    <span className="text-gray-600 font-medium">
                      Subtotal ({totalItems} {totalItems === 1 ? 'item' : 'items'})
                    </span>
                    <span className="font-bold text-lg text-gray-900">${totals.subtotal}</span>
                  </div>
                  
                  <div className="flex justify-between items-center py-3 border-b border-gray-100">
                    <div className="flex items-center space-x-2">
                      <Truck className="h-4 w-4 text-green-500" />
                      <span className="text-gray-600 font-medium">Shipping</span>
                    </div>
                    <span className="font-bold text-green-600">FREE</span>
                  </div>
                  
                  <div className="flex justify-between items-center py-3 border-b border-gray-100">
                    <span className="text-gray-600 font-medium">Tax</span>
                    <span className="font-bold text-gray-900">${totals.tax}</span>
                  </div>
                  
                  <div className="flex justify-between items-center py-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl px-4 border-2 border-indigo-100">
                    <span className="text-xl font-bold text-gray-900">Total</span>
                    <span className="text-2xl font-bold text-indigo-600">${totals.total}</span>
                  </div>
                </div>

                {/* Order Items */}
                <div className="border-t border-gray-200 pt-8">
                  <h3 className="text-lg font-bold text-gray-900 mb-6">Items in Your Order</h3>
                  <div className="space-y-4 max-h-80 overflow-y-auto">
                    {items.map((item) => (
                      <div key={item.id} className="group flex items-start space-x-4 p-4 hover:bg-gray-50 rounded-xl transition-all duration-200">
                        <div className="relative">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-16 h-16 object-cover rounded-xl border-2 border-gray-100 group-hover:border-indigo-200 transition-colors"
                          />
                          <div className="absolute -top-2 -right-2 bg-indigo-600 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                            {item.quantity}
                          </div>
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-bold text-gray-900 truncate group-hover:text-indigo-600 transition-colors">
                            {item.name}
                          </h4>
                          <p className="text-xs text-gray-500 mt-1">{item.type}</p>
                          
                          {item.features?.length > 0 && (
                            <div className="mt-2 flex flex-wrap gap-1">
                              {item.features.slice(0, 2).map((feature, index) => (
                                <span key={index} className="inline-flex items-center px-2 py-1 rounded-md bg-gray-100 text-xs font-medium text-gray-600">
                                  {feature}
                                </span>
                              ))}
                              {item.features.length > 2 && (
                                <span className="inline-flex items-center px-2 py-1 rounded-md bg-indigo-100 text-xs font-medium text-indigo-600">
                                  +{item.features.length - 2} more
                                </span>
                              )}
                            </div>
                          )}
                          
                          <div className="mt-3 flex items-center justify-between">
                            <span className="text-sm text-gray-500">
                              {item.quantity} × ${item.price.toFixed(2)}
                            </span>
                            <span className="text-sm font-bold text-gray-900">
                              ${(item.price * item.quantity).toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Security Features */}
                <div className="mt-8 pt-8 border-t border-gray-200">
                  <h4 className="text-sm font-bold text-gray-900 mb-4">Why choose us?</h4>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                        <Shield className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-gray-900">Bank-level Security</div>
                        <div className="text-xs text-gray-600">256-bit SSL encryption</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Zap className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-gray-900">Instant Delivery</div>
                        <div className="text-xs text-gray-600">Digital products delivered immediately</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0 w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                        <Star className="h-4 w-4 text-purple-600" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-gray-900">Premium Support</div>
                        <div className="text-xs text-gray-600">24/7 customer assistance</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Satisfaction guarantee */}
                <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
                  <div className="flex items-center space-x-3">
                    <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
                    <div>
                      <div className="text-sm font-semibold text-green-800">30-Day Money Back Guarantee</div>
                      <div className="text-xs text-green-700">Not satisfied? Get a full refund.</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Toast Notifications */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={hideToast}
        />
      )}

      {/* Custom Styles */}
      <style jsx>{`
        @keyframes slide-in {
          from {
            opacity: 0;
            transform: translateX(100%) translateY(-50%);
          }
          to {
            opacity: 1;
            transform: translateX(0) translateY(0);
          }
        }
        
        .animate-slide-in {
          animation: slide-in 0.3s ease-out forwards;
        }
        
        /* Custom scrollbar for order items */
        .max-h-80::-webkit-scrollbar {
          width: 6px;
        }
        
        .max-h-80::-webkit-scrollbar-track {
          background: #f3f4f6;
          border-radius: 3px;
        }
        
        .max-h-80::-webkit-scrollbar-thumb {
          background: #d1d5db;
          border-radius: 3px;
        }
        
        .max-h-80::-webkit-scrollbar-thumb:hover {
          background: #9ca3af;
        }
      `}</style>
    </>
  );
};

export default Checkout;
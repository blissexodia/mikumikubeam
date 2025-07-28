import React, { useState } from 'react';
import {
  CreditCard,
  Lock,
  User,
  Mail,
  MapPin,
  Phone,
  AlertCircle,
  CheckCircle,
  ArrowLeft,
  ArrowRight
} from 'lucide-react';

const Checkout = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [billingInfo, setBillingInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'US'
  });
  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: ''
  });
  const [errors, setErrors] = useState({});
  const [processing, setProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);

  const items = [
    {
      id: 1,
      name: "Premium WordPress Theme",
      type: "Digital Product",
      price: 59.99,
      quantity: 1,
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=80&h=80&fit=crop&crop=center"
    },
    {
      id: 2,
      name: "React Component Library",
      type: "Code Package",
      price: 89.99,
      quantity: 2,
      image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=80&h=80&fit=crop&crop=center"
    }
  ];

  const getTotalPrice = () => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const clearCart = () => {
    console.log('Cart cleared');
  };

  const handleBillingChange = (e) => {
    const { name, value } = e.target;
    setBillingInfo(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handlePaymentChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    if (name === 'cardNumber') {
      formattedValue = value.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim();
      if (formattedValue.length > 19) formattedValue = formattedValue.slice(0, 19);
    }

    if (name === 'expiryDate') {
      formattedValue = value.replace(/\D/g, '').replace(/(\d{2})(\d)/, '$1/$2');
      if (formattedValue.length > 5) formattedValue = formattedValue.slice(0, 5);
    }

    if (name === 'cvv') {
      formattedValue = value.replace(/\D/g, '').slice(0, 4);
    }

    setPaymentInfo(prev => ({ ...prev, [name]: formattedValue }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateBilling = () => {
    const newErrors = {};
    if (!billingInfo.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!billingInfo.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!billingInfo.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(billingInfo.email)) newErrors.email = 'Invalid email format';
    if (!billingInfo.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!billingInfo.address.trim()) newErrors.address = 'Address is required';
    if (!billingInfo.city.trim()) newErrors.city = 'City is required';
    if (!billingInfo.state.trim()) newErrors.state = 'State is required';
    if (!billingInfo.zipCode.trim()) newErrors.zipCode = 'ZIP code is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePayment = () => {
    const newErrors = {};
    const cardNumber = paymentInfo.cardNumber.replace(/\s/g, '');
    if (!cardNumber) newErrors.cardNumber = 'Card number is required';
    else if (cardNumber.length < 16) newErrors.cardNumber = 'Invalid card number';
    if (!paymentInfo.expiryDate) newErrors.expiryDate = 'Expiry date is required';
    else if (!/^\d{2}\/\d{2}$/.test(paymentInfo.expiryDate)) newErrors.expiryDate = 'Invalid expiry date';
    if (!paymentInfo.cvv) newErrors.cvv = 'CVV is required';
    else if (paymentInfo.cvv.length < 3) newErrors.cvv = 'Invalid CVV';
    if (!paymentInfo.cardholderName.trim()) newErrors.cardholderName = 'Cardholder name is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (currentStep === 1 && validateBilling()) {
      setCurrentStep(2);
    } else if (currentStep === 2 && validatePayment()) {
      setCurrentStep(3);
    }
  };

  const handlePlaceOrder = async () => {
    setProcessing(true);
    try {
      const orderData = {
        items: items.map(item => ({
          productId: item.id,
          quantity: item.quantity,
          price: item.price
        })),
        billingInfo,
        paymentInfo: {
          last4: paymentInfo.cardNumber.slice(-4),
          brand: 'visa'
        },
        total: getTotalPrice()
      };
      await new Promise(resolve => setTimeout(resolve, 2000));
      setOrderComplete(true);
      clearCart();
      setTimeout(() => {
        console.log('Redirecting to orders page');
      }, 3000);
    } catch (error) {
      setErrors({ general: 'Failed to process order. Please try again.' });
    } finally {
      setProcessing(false);
    }
  };

  if (orderComplete) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12">
        <div className="max-w-md mx-auto text-center">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Order Complete!</h2>
            <p className="text-gray-600 mb-6">
              Thank you for your purchase. Your digital products will be delivered instantly to your email.
            </p>
            <div className="text-sm text-gray-500">
              Redirecting to your orders...
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
          <p className="text-gray-600 mt-2">Complete your order in a few simple steps</p>
        </div>

        {/* Step Indicator, Billing, Payment, Review Sections */}
        {/* ... Snipped for brevity (already written above) ... */}
        {/* Place here the step UI blocks that you already have coded, unchanged */}

        {/* Order Summary Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">{/* Rendered step component blocks here */}</div>
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
              <div className="space-y-3 mb-4">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      {item.name} × {item.quantity}
                    </span>
                    <span className="font-medium">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">${getTotalPrice().toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-medium">$0.00</span>
                </div>
                <div className="flex justify-between text-base font-semibold">
                  <span>Total</span>
                  <span>${getTotalPrice().toFixed(2)}</span>
                </div>
              </div>

              <div className="mt-6 flex items-center text-xs text-gray-500">
                <Lock className="h-4 w-4 mr-1" />
                <span>Secure Checkout</span>
              </div>
              <div className="flex items-center mt-2 text-xs text-gray-500">
                <CheckCircle className="h-4 w-4 mr-1" />
                <span>Instant digital delivery</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;

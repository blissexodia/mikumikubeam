import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { CheckCircle2, ArrowLeft, QrCode } from 'lucide-react';
import { QRCodeCanvas } from 'qrcode.react';

const OrderConfirmation = () => {
  const { state } = useLocation();
  const orderId = state?.orderId || 'N/A';

  const orderUrl = `https://mikustore.com/order/${orderId}`; // Replace with your actual order URL

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="relative">
            <CheckCircle2 className="h-32 w-32 text-green-500 mx-auto mb-6" />
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 opacity-10 rounded-full blur-3xl" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Order Confirmed!</h1>
          <p className="text-lg text-gray-600 mb-6">
            Your order #{orderId} has been placed successfully.
          </p>
          <div className="bg-white rounded-xl shadow-lg p-6 border">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Details QR Code</h2>
            <div className="flex justify-center mb-4">
              <QRCodeCanvas
                value={orderUrl}
                size={200}
                bgColor="#ffffff"
                fgColor="#000000"
                level="H"
                includeMargin={true}
                className="rounded-lg shadow-md"
              />
            </div>
            <p className="text-sm text-gray-600 mb-6 text-center">
              Scan this QR code to view your order details on your mobile device.
            </p>
            <div className="flex justify-center space-x-4">
              <Link
                to="/products"
                className="inline-flex items-center bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
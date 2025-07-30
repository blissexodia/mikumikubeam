import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Youtube, Heart, Send, CheckCircle } from 'lucide-react';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) return;
    
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubscribed(true);
      setIsLoading(false);
      setEmail('');
      // Reset success state after 3 seconds
      setTimeout(() => setIsSubscribed(false), 3000);
    }, 1000);
  };

  const socialLinks = [
    { icon: Facebook, href: "#", label: "Facebook", color: "hover:text-blue-400" },
    { icon: Twitter, href: "#", label: "Twitter", color: "hover:text-sky-400" },
    { icon: Instagram, href: "#", label: "Instagram", color: "hover:text-pink-400" },
    { icon: Youtube, href: "#", label: "YouTube", color: "hover:text-red-400" }
  ];

  const quickLinks = [
    { to: "/", label: "Home" },
    { to: "/products", label: "All Products" },
    { to: "/products/subscriptions", label: "Subscriptions" },
    { to: "/products/giftcards", label: "Gift Cards" },
    { to: "/cart", label: "Shopping Cart" }
  ];

  const supportLinks = [
    { to: "/help", label: "Help Center" },
    { to: "/contact", label: "Contact Us" },
    { to: "/faq", label: "FAQ" },
    { to: "/shipping", label: "Shipping Info" },
    { to: "/returns", label: "Returns & Refunds" }
  ];

  const legalLinks = [
    { to: "/privacy", label: "Privacy Policy" },
    { to: "/terms", label: "Terms of Service" },
    { to: "/cookies", label: "Cookie Policy" },
    { to: "/about", label: "About Us" }
  ];

  return (
    <footer className="relative bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-hidden">
      {/* Animated background elements - Responsive positioning */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-48 h-48 sm:w-72 sm:h-72 lg:w-96 lg:h-96 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-48 h-48 sm:w-72 sm:h-72 lg:w-96 lg:h-96 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-700"></div>
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        {/* Main Content Grid - Enhanced responsive breakpoints */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 lg:gap-12">
          {/* Company Info - Enhanced responsive layout */}
          <div className="sm:col-span-2 lg:col-span-2">
            {/* Logo Section - Responsive sizing */}
            <div className="flex items-center mb-4 sm:mb-6">
              <div className="relative">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-500 via-cyan-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg mr-3 overflow-hidden">
                  {/* Chibi Miku matching header style */}
                  <div className="relative text-white text-sm font-bold">
                    {/* Hair */}
                    <div className="absolute -top-1 -left-1 w-4 h-3 sm:w-5 sm:h-4 bg-gradient-to-r from-cyan-300 to-cyan-400 rounded-t-full transform rotate-12"></div>
                    <div className="absolute -top-1 -right-1 w-4 h-3 sm:w-5 sm:h-4 bg-gradient-to-r from-cyan-300 to-cyan-400 rounded-t-full transform -rotate-12"></div>
                    {/* Face */}
                    <div className="w-3 h-3 sm:w-4 sm:h-4 bg-gradient-to-b from-pink-100 to-pink-200 rounded-full flex items-center justify-center">
                      {/* Eyes */}
                      <div className="flex space-x-0.5">
                        <div className="w-0.5 h-0.5 sm:w-1 sm:h-1 bg-blue-600 rounded-full"></div>
                        <div className="w-0.5 h-0.5 sm:w-1 sm:h-1 bg-blue-600 rounded-full"></div>
                      </div>
                    </div>
                    {/* Hair accessories */}
                    <div className="absolute top-0 left-1 w-0.5 h-0.5 sm:w-1 sm:h-1 bg-red-400 rounded-full animate-pulse"></div>
                    <div className="absolute top-0 right-1 w-0.5 h-0.5 sm:w-1 sm:h-1 bg-red-400 rounded-full animate-pulse"></div>
                  </div>
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 bg-gradient-to-r from-pink-400 to-red-400 rounded-full animate-bounce">
                  <div className="w-full h-full flex items-center justify-center text-white text-xs">♪</div>
                </div>
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-600 via-cyan-600 to-blue-600 bg-clip-text text-transparent">
                Miku Miku Store
              </h3>
            </div>
            
            <p className="text-gray-300 mb-6 sm:mb-8 max-w-none sm:max-w-md lg:max-w-lg text-base sm:text-lg leading-relaxed">
              Your trusted marketplace for digital subscriptions and gift cards. 
              Get instant access to your favorite services and games with lightning-fast delivery.
            </p>
            
            {/* Contact Info with enhanced responsive design */}
            <div className="space-y-3 sm:space-y-4">
              {[
                { icon: Mail, text: "support@mikumikustore.com", href: "mailto:support@mikumikustore.com" },
                { icon: Phone, text: "+977-XXXX-XXXX", href: "tel:+977XXXXXXXX" },
                { icon: MapPin, text: "Kathmandu, Nepal", href: "#" }
              ].map((item, index) => (
                <a 
                  key={index}
                  href={item.href}
                  className="flex items-center text-gray-300 hover:text-cyan-400 transition-all duration-300 group"
                >
                  <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 bg-slate-800 rounded-lg mr-3 sm:mr-4 group-hover:bg-cyan-500/20 group-hover:scale-110 transition-all duration-300 flex-shrink-0">
                    <item.icon className="h-4 w-4 sm:h-5 sm:w-5 group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  <span className="group-hover:translate-x-1 transition-transform duration-300 text-sm sm:text-base break-all sm:break-normal">{item.text}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links - Enhanced responsive design */}
          <div className="min-w-0">
            <h4 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6 text-white relative">
              Quick Links
              <div className="absolute -bottom-2 left-0 w-8 sm:w-12 h-1 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full"></div>
            </h4>
            <ul className="space-y-2 sm:space-y-3">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <Link 
                    to={link.to} 
                    className="text-gray-300 hover:text-white hover:translate-x-2 transition-all duration-300 flex items-center group text-sm sm:text-base"
                  >
                    <span className="w-0 h-0.5 bg-cyan-400 group-hover:w-3 sm:group-hover:w-4 transition-all duration-300 mr-0 group-hover:mr-2 flex-shrink-0"></span>
                    <span className="truncate">{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service - Enhanced responsive design */}
          <div className="min-w-0">
            <h4 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6 text-white relative">
              Customer Service
              <div className="absolute -bottom-2 left-0 w-8 sm:w-12 h-1 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full"></div>
            </h4>
            <ul className="space-y-2 sm:space-y-3">
              {supportLinks.map((link, index) => (
                <li key={index}>
                  <Link 
                    to={link.to} 
                    className="text-gray-300 hover:text-white hover:translate-x-2 transition-all duration-300 flex items-center group text-sm sm:text-base"
                  >
                    <span className="w-0 h-0.5 bg-purple-400 group-hover:w-3 sm:group-hover:w-4 transition-all duration-300 mr-0 group-hover:mr-2 flex-shrink-0"></span>
                    <span className="truncate">{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Newsletter & Social Section - Enhanced responsive layout */}
        <div className="border-t border-slate-700/50 mt-8 sm:mt-12 pt-8 sm:pt-12">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 sm:gap-8">
            {/* Social Media - Enhanced responsive design */}
            <div className="w-full lg:w-auto">
              <h5 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-center lg:text-left">Follow Us</h5>
              <div className="flex justify-center lg:justify-start space-x-3 sm:space-x-4 lg:space-x-6">
                {socialLinks.map((social, index) => (
                  <a 
                    key={index}
                    href={social.href} 
                    className={`relative group p-2 sm:p-3 bg-slate-800 rounded-xl text-gray-400 ${social.color} transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-cyan-500/25 flex-shrink-0`}
                    aria-label={social.label}
                  >
                    <social.icon className="h-5 w-5 sm:h-6 sm:w-6 transition-transform duration-300 group-hover:rotate-12" />
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-400/20 to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </a>
                ))}
              </div>
            </div>

            {/* Enhanced Newsletter Signup - Fully responsive */}
            <div className="w-full lg:flex-1 lg:max-w-md xl:max-w-lg">
              <h5 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-center lg:text-left">Stay Updated</h5>
              <p className="text-gray-400 text-xs sm:text-sm mb-3 sm:mb-4 text-center lg:text-left">Get the latest deals and updates delivered to your inbox</p>
              
              {isSubscribed ? (
                <div className="flex items-center justify-center p-3 sm:p-4 bg-green-500/20 border border-green-500/30 rounded-xl">
                  <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-400 mr-2 flex-shrink-0" />
                  <span className="text-green-400 font-medium text-sm sm:text-base">Successfully subscribed!</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="relative">
                  <div className="flex flex-col sm:flex-row rounded-xl overflow-hidden shadow-lg">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email address"
                      className="flex-1 px-4 sm:px-6 py-3 sm:py-4 bg-slate-800 text-white placeholder-gray-400 border-0 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all duration-300 text-sm sm:text-base rounded-t-xl sm:rounded-t-none sm:rounded-l-xl"
                      required
                    />
                    <button 
                      type="submit"
                      disabled={isLoading}
                      className="px-4 sm:px-6 py-3 sm:py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-medium hover:from-cyan-600 hover:to-blue-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center rounded-b-xl sm:rounded-b-none sm:rounded-r-xl"
                    >
                      {isLoading ? (
                        <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-2 border-white border-t-transparent"></div>
                      ) : (
                        <Send className="h-4 w-4 sm:h-5 sm:w-5" />
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Legal Links & Copyright - Enhanced responsive layout */}
        <div className="border-t border-slate-700/50 mt-8 sm:mt-12 pt-6 sm:pt-8">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-4 sm:gap-6">
            {/* Legal Links - Responsive wrapping */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-3 sm:gap-4 lg:gap-6">
              {legalLinks.map((link, index) => (
                <Link 
                  key={index}
                  to={link.to} 
                  className="text-gray-400 hover:text-white text-xs sm:text-sm transition-colors duration-200 hover:underline whitespace-nowrap"
                >
                  {link.label}
                </Link>
              ))}
            </div>
            
            {/* Copyright - Responsive text sizing */}
            <div className="flex items-center text-gray-400 text-xs sm:text-sm text-center lg:text-right">
              <span>&copy; 2025 Miku Miku Store. Made with</span>
              <Heart className="h-3 w-3 sm:h-4 sm:w-4 mx-1 text-pink-500 animate-pulse flex-shrink-0" />
              <span>All rights reserved.</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
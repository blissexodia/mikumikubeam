import React from 'react';
import Header from './Header';
import Footer from './Footer';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50/30 to-cyan-50/30 flex flex-col overflow-x-hidden">
      <Header />
      <main className="flex-1 relative">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <div className="absolute top-0 left-1/3 w-64 h-64 bg-gradient-to-r from-purple-400 to-cyan-400 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/3 right-1/4 w-48 h-48 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-1000"></div>
        </div>
        
        {/* Main content with proper spacing */}
        <div className="relative z-10 w-full min-h-full">
          {children}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
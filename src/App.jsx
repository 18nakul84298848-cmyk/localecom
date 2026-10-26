// ==============================================================================
// DukaanConnect: Main Application Entry & Routing
// ==============================================================================

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Layout Components
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

// Pages
import Home from './pages/Home';
import Explore from './pages/Explore';
import ProductDetails from './pages/ProductDetails';
import ShopStorefront from './pages/ShopStorefront';
import NearbyShops from './pages/NearbyShops';
import AboutBenefits from './pages/AboutBenefits';
import Login from './pages/Login';
import Signup from './pages/Signup';
import SellerOnboarding from './pages/SellerOnboarding';
import SellerDashboard from './pages/SellerDashboard';
import ProductManagement from './pages/ProductManagement';
import AIAssistant from './pages/AIAssistant';
import EnquiriesPage from './pages/EnquiriesPage';
import AnalyticsPage from './pages/AnalyticsPage';

// Protected Route Guard for Seller Dashboard
const ProtectedSellerRoute = ({ children }) => {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-forest-200 border-t-forest-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  // If not logged in, redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If logged in as customer, redirect to onboarding to become seller
  if (profile?.role !== 'seller') {
    return <Navigate to="/seller/onboarding" replace />;
  }

  return children;
};

// 404 Route Fallback
const NotFound = () => (
  <div className="max-w-md mx-auto py-24 px-4 text-center space-y-4">
    <div className="text-6xl font-black text-forest-900 font-display">404</div>
    <h2 className="text-xl font-bold text-gray-900 font-display">Page Not Found</h2>
    <p className="text-xs text-gray-500">
      The marketplace page you were looking for doesn't exist or has moved.
    </p>
    <a
      href="/"
      className="inline-block px-5 py-2.5 rounded-xl bg-forest-900 text-white text-xs font-semibold"
    >
      Return to DukaanConnect Marketplace
    </a>
  </div>
);

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col bg-cream-50 text-brand-charcoal selection:bg-forest-100 selection:text-forest-900">
          <Navbar />
          
          <main className="flex-grow">
            <Routes>
              {/* Public Marketplace Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/explore" element={<Explore />} />
              <Route path="/product/:id" element={<ProductDetails />} />
              <Route path="/shop/:slug" element={<ShopStorefront />} />
              <Route path="/shops" element={<NearbyShops />} />
              <Route path="/about" element={<AboutBenefits />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              
              {/* Seller Onboarding */}
              <Route path="/seller/onboarding" element={<SellerOnboarding />} />

              {/* Protected Seller Routes */}
              <Route
                path="/seller/dashboard"
                element={
                  <ProtectedSellerRoute>
                    <SellerDashboard />
                  </ProtectedSellerRoute>
                }
              />
              <Route
                path="/seller/products"
                element={
                  <ProtectedSellerRoute>
                    <ProductManagement />
                  </ProtectedSellerRoute>
                }
              />
              <Route
                path="/seller/ai-assistant"
                element={
                  <ProtectedSellerRoute>
                    <AIAssistant />
                  </ProtectedSellerRoute>
                }
              />
              <Route
                path="/seller/enquiries"
                element={
                  <ProtectedSellerRoute>
                    <EnquiriesPage />
                  </ProtectedSellerRoute>
                }
              />
              <Route
                path="/seller/analytics"
                element={
                  <ProtectedSellerRoute>
                    <AnalyticsPage />
                  </ProtectedSellerRoute>
                }
              />

              {/* 404 Fallback */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>

          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

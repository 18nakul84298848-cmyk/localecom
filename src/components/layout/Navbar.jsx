// ==============================================================================
// DukaanConnect: Main Navigation Bar
// Responsive, role-aware, with demo switcher badge and mobile drawer
// ==============================================================================

import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Store, 
  Search, 
  MapPin, 
  Menu, 
  X, 
  User, 
  LayoutDashboard, 
  PlusCircle, 
  LogOut, 
  Sparkles,
  ShoppingBag,
  ChevronDown,
  ExternalLink,
  ShieldAlert,
  CheckCircle2,
  PhoneCall
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Navbar() {
  const { user, profile, shop, signOut, switchDemoRole, isDemoMode } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [demoBannerOpen, setDemoBannerOpen] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const handleSignOut = async () => {
    await signOut();
    setProfileDropdownOpen(false);
    navigate('/');
  };

  const isSeller = profile?.role === 'seller';

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-cream-200 transition-all">
      {/* Demo Mode / Hackathon Testing Banner */}
      {isDemoMode && demoBannerOpen && (
        <div className="bg-forest-900 text-cream-100 text-xs py-1.5 px-4">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-forest-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
              </span>
              <span className="font-medium text-emerald-300">Demo Environment Active:</span>
              <span className="text-cream-200 hidden sm:inline">
                LocalStorage backend enabled. Test freely or switch perspective:
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-cream-300">Quick Switch:</span>
              <button
                onClick={() => switchDemoRole('seller')}
                className={`px-2 py-0.5 rounded text-[11px] font-medium transition ${
                  isSeller
                    ? 'bg-emerald-500 text-forest-950 font-bold'
                    : 'bg-forest-800 text-cream-200 hover:bg-forest-700'
                }`}
              >
                🏪 Seller (Ramesh)
              </button>
              <button
                onClick={() => switchDemoRole('customer')}
                className={`px-2 py-0.5 rounded text-[11px] font-medium transition ${
                  !isSeller
                    ? 'bg-emerald-500 text-forest-950 font-bold'
                    : 'bg-forest-800 text-cream-200 hover:bg-forest-700'
                }`}
              >
                👤 Customer (Priya)
              </button>
              <button 
                onClick={() => setDemoBannerOpen(false)}
                className="text-cream-300 hover:text-white ml-2 p-0.5"
                title="Dismiss banner"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
          
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-forest-900 flex items-center justify-center text-white shadow-card group-hover:bg-forest-800 transition">
              <Store className="w-5 h-5 text-emerald-400" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center">
                <span className="text-xl sm:text-2xl font-black tracking-tight text-forest-900 font-display">
                  Dukaan<span className="text-forest-600">Connect</span>
                </span>
                <span className="ml-1 w-2 h-2 rounded-full bg-amber-500 inline-block"></span>
              </div>
              <span className="text-[10px] uppercase tracking-wider font-semibold text-gray-500 -mt-1">
                Local Dukaan • AI Storefronts
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            <Link
              to="/explore"
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition ${
                location.pathname === '/explore'
                  ? 'text-forest-900 bg-forest-50 font-semibold'
                  : 'text-gray-700 hover:text-forest-900 hover:bg-cream-100'
              }`}
            >
              Explore Products
            </Link>
            <Link
              to="/shops"
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition ${
                location.pathname === '/shops'
                  ? 'text-forest-900 bg-forest-50 font-semibold'
                  : 'text-gray-700 hover:text-forest-900 hover:bg-cream-100'
              }`}
            >
              Nearby Shops
            </Link>
            <Link
              to="/about"
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition ${
                location.pathname === '/about'
                  ? 'text-forest-900 bg-forest-50 font-semibold'
                  : 'text-gray-700 hover:text-forest-900 hover:bg-cream-100'
              }`}
            >
              Retailer Benefits
            </Link>
          </nav>

          {/* Action Buttons & Profile Controls */}
          <div className="hidden sm:flex items-center gap-3">
            {isSeller ? (
              // Seller quick actions
              <div className="flex items-center gap-2">
                <Link
                  to="/seller/ai-assistant"
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-emerald-600 to-forest-700 text-white shadow-sm hover:opacity-95 transition"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
                  <span>AI Listing</span>
                </Link>

                <Link
                  to="/seller/dashboard"
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-semibold bg-forest-900 text-white hover:bg-forest-800 shadow-sm transition"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Dashboard</span>
                </Link>

                {shop?.slug && (
                  <Link
                    to={`/shop/${shop.slug}`}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-xl border border-cream-300 text-gray-700 hover:text-forest-900 hover:bg-cream-100 transition"
                    title="View My Public Storefront"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Link>
                )}
              </div>
            ) : (
              // Customer / Visitor view
              <div className="flex items-center gap-2">
                <Link
                  to="/seller/onboarding"
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-semibold text-forest-900 bg-forest-50 border border-forest-200 hover:bg-forest-100 transition"
                >
                  <Store className="w-4 h-4 text-forest-700" />
                  <span>Open Your Dukaan</span>
                </Link>
              </div>
            )}

            {/* User Dropdown */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 pr-2.5 rounded-full border border-cream-300 hover:border-forest-400 bg-white transition"
                >
                  <div className="w-7 h-7 rounded-full bg-forest-100 text-forest-900 font-bold text-xs flex items-center justify-center">
                    {profile?.full_name?.charAt(0) || 'U'}
                  </div>
                  <span className="text-xs font-medium text-gray-700 max-w-[90px] truncate">
                    {profile?.full_name || 'My Account'}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                </button>

                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-lift border border-cream-200 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="px-4 py-2 border-b border-cream-200">
                      <p className="text-xs text-gray-400">Signed in as</p>
                      <p className="text-sm font-semibold text-gray-900 truncate">{profile?.full_name}</p>
                      <span className="inline-block px-2 py-0.5 mt-1 rounded text-[10px] font-bold uppercase tracking-wider bg-forest-100 text-forest-800">
                        {profile?.role === 'seller' ? 'Shopkeeper / Seller' : 'Local Shopper'}
                      </span>
                    </div>

                    {isSeller ? (
                      <>
                        <Link
                          to="/seller/dashboard"
                          onClick={() => setProfileDropdownOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-gray-700 hover:bg-cream-100"
                        >
                          <LayoutDashboard className="w-4 h-4 text-forest-700" />
                          Seller Dashboard
                        </Link>
                        <Link
                          to="/seller/products"
                          onClick={() => setProfileDropdownOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-gray-700 hover:bg-cream-100"
                        >
                          <ShoppingBag className="w-4 h-4 text-forest-700" />
                          Manage Products
                        </Link>
                        <Link
                          to="/seller/enquiries"
                          onClick={() => setProfileDropdownOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-gray-700 hover:bg-cream-100"
                        >
                          <PhoneCall className="w-4 h-4 text-forest-700" />
                          Customer Enquiries
                        </Link>
                        <Link
                          to="/seller/ai-assistant"
                          onClick={() => setProfileDropdownOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-gray-700 hover:bg-cream-100"
                        >
                          <Sparkles className="w-4 h-4 text-forest-700" />
                          AI Listing Assistant
                        </Link>
                      </>
                    ) : (
                      <Link
                        to="/seller/onboarding"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-forest-700 hover:bg-forest-50"
                      >
                        <Store className="w-4 h-4 text-forest-700" />
                        Become a Seller
                      </Link>
                    )}

                    <div className="border-t border-cream-200 mt-1 pt-1">
                      <button
                        onClick={handleSignOut}
                        className="w-full flex items-center gap-2 px-4 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 transition"
                      >
                        <LogOut className="w-4 h-4" />
                        Log Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3 py-2 text-xs font-semibold text-gray-700 hover:text-forest-900 transition"
                >
                  Log In
                </Link>
                <Link
                  to="/signup"
                  className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-forest-900 text-white hover:bg-forest-800 transition"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-gray-700 hover:bg-cream-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-cream-200 bg-white px-4 pt-3 pb-6 space-y-3">
          <Link
            to="/explore"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-base font-medium text-gray-800 hover:text-forest-800"
          >
            Explore Products
          </Link>
          <Link
            to="/shops"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-base font-medium text-gray-800 hover:text-forest-800"
          >
            Nearby Shops
          </Link>
          <Link
            to="/about"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-base font-medium text-gray-800 hover:text-forest-800"
          >
            Retailer Benefits
          </Link>

          <div className="pt-3 border-t border-cream-200 space-y-2">
            {isSeller ? (
              <>
                <Link
                  to="/seller/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 w-full px-4 py-2.5 rounded-xl bg-forest-900 text-white font-medium text-sm justify-center"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Seller Dashboard
                </Link>
                <Link
                  to="/seller/ai-assistant"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 w-full px-4 py-2.5 rounded-xl bg-forest-50 text-forest-900 font-medium text-sm justify-center border border-forest-200"
                >
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  AI Listing Assistant
                </Link>
              </>
            ) : (
              <Link
                to="/seller/onboarding"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 w-full px-4 py-2.5 rounded-xl bg-forest-900 text-white font-medium text-sm justify-center"
              >
                <Store className="w-4 h-4" />
                Register as Seller
              </Link>
            )}

            {user ? (
              <button
                onClick={() => {
                  handleSignOut();
                  setMobileMenuOpen(false);
                }}
                className="flex items-center gap-2 w-full px-4 py-2 rounded-xl text-rose-600 font-medium text-sm justify-center hover:bg-rose-50"
              >
                <LogOut className="w-4 h-4" />
                Sign Out ({profile?.full_name})
              </button>
            ) : (
              <div className="flex gap-2 pt-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 py-2 rounded-xl text-center text-sm font-semibold border border-cream-300"
                >
                  Log In
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 py-2 rounded-xl text-center text-sm font-semibold bg-forest-900 text-white"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

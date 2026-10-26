// ==============================================================================
// DukaanConnect: Signup Page
// Supports both Customer and Seller role onboarding
// ==============================================================================

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Store, 
  Lock, 
  Mail, 
  User, 
  Phone, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  AlertCircle, 
  ShoppingBag,
  Sparkles,
  MapPin
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { shopsService } from '../services/shops';
import { CATEGORIES, LOCALITIES } from '../data/demoData';

export default function Signup() {
  const navigate = useNavigate();
  const { signUp, isDemoMode } = useAuth();

  const [role, setRole] = useState('seller'); // default to seller for retailer growth
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Seller specific shop fields
  const [shopName, setShopName] = useState('');
  const [category, setCategory] = useState('groceries');
  const [locality, setLocality] = useState(LOCALITIES[1]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!fullName.trim() || !email.trim() || !password.trim()) {
      setError('Please fill in all required fields.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    try {
      setLoading(true);
      const { user } = await signUp({
        email,
        password,
        fullName,
        role,
        phone,
      });

      // If registered as seller, create their initial shop
      if (role === 'seller' && shopName.trim()) {
        try {
          await shopsService.createShop({
            owner_id: user?.id || 'demo-seller',
            name: shopName.trim(),
            category,
            locality,
            address: `${shopName}, ${locality}`,
            phone: phone || '+91 98000 00000',
            description: `Welcome to ${shopName}. We provide authentic quality local products in ${locality}.`,
          });
        } catch (shopErr) {
          console.warn('Shop creation note:', shopErr.message);
        }
        navigate('/seller/dashboard');
      } else {
        navigate('/explore');
      }
    } catch (err) {
      console.error('Sign up error:', err);
      setError(err.message || 'Failed to create account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2 mb-2">
            <div className="w-10 h-10 rounded-2xl bg-forest-900 text-white flex items-center justify-center">
              <Store className="w-5 h-5 text-emerald-400" />
            </div>
            <span className="text-2xl font-black text-forest-900 font-display">
              Dukaan<span className="text-forest-600">Connect</span>
            </span>
          </Link>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 font-display">
            Create Your Account
          </h2>
          <p className="text-xs text-gray-500">
            Join thousands of small retailers and shoppers building local digital commerce
          </p>
        </div>

        {/* Role Toggle Selector */}
        <div className="p-1 rounded-2xl bg-cream-200 grid grid-cols-2 gap-1">
          <button
            type="button"
            onClick={() => setRole('seller')}
            className={`py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition ${
              role === 'seller'
                ? 'bg-forest-900 text-white shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Store className="w-4 h-4 text-emerald-400" />
            <span>I am a Shopkeeper / Seller</span>
          </button>
          <button
            type="button"
            onClick={() => setRole('customer')}
            className={`py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition ${
              role === 'customer'
                ? 'bg-forest-900 text-white shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <ShoppingBag className="w-4 h-4 text-forest-700" />
            <span>I am a Shopper / Buyer</span>
          </button>
        </div>

        {/* Signup Form */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-cream-200 shadow-card space-y-5">
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Full Name */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Your Full Name <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Anand Patel"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-cream-300 text-xs focus:outline-none focus:ring-2 focus:ring-forest-600 bg-cream-50/50"
                />
              </div>
            </div>

            {/* Email and Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Email Address <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                  <input
                    type="email"
                    required
                    placeholder="you@domain.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-cream-300 text-xs focus:outline-none focus:ring-2 focus:ring-forest-600 bg-cream-50/50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Mobile Number (WhatsApp)
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                  <input
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-cream-300 text-xs focus:outline-none focus:ring-2 focus:ring-forest-600 bg-cream-50/50"
                  />
                </div>
              </div>
            </div>

            {/* Seller Specific Fields */}
            {role === 'seller' && (
              <div className="pt-3 border-t border-cream-200 space-y-3">
                <div className="flex items-center gap-1.5 text-xs font-bold text-forest-900">
                  <Store className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Dukaan Storefront Setup</span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Dukaan / Shop Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required={role === 'seller'}
                    placeholder="e.g. Patel Handlooms & Silks"
                    value={shopName}
                    onChange={(e) => setShopName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-cream-300 text-xs focus:outline-none focus:ring-2 focus:ring-forest-600 bg-cream-50/50"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Primary Category
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-cream-300 text-xs font-medium text-gray-700 bg-cream-50/50 focus:outline-none focus:ring-2 focus:ring-forest-600"
                    >
                      {CATEGORIES.filter(c => c.id !== 'all').map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Locality / Market
                    </label>
                    <select
                      value={locality}
                      onChange={(e) => setLocality(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-cream-300 text-xs font-medium text-gray-700 bg-cream-50/50 focus:outline-none focus:ring-2 focus:ring-forest-600"
                    >
                      {LOCALITIES.filter(l => l !== 'All Localities').map((l) => (
                        <option key={l} value={l}>
                          {l}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Password <span className="text-rose-500">*</span> (min 6 characters)
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-cream-300 text-xs focus:outline-none focus:ring-2 focus:ring-forest-600 bg-cream-50/50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-forest-900 hover:bg-forest-800 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-sm transition disabled:opacity-50"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  Creating Account...
                </span>
              ) : (
                <>
                  <span>Create {role === 'seller' ? 'Seller Account' : 'Customer Account'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>

          <div className="text-center pt-2 border-t border-cream-200">
            <p className="text-xs text-gray-500">
              Already have an account?{' '}
              <Link to="/login" className="font-semibold text-forest-800 hover:underline">
                Sign in here
              </Link>
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}

// ==============================================================================
// DukaanConnect: Login Page
// ==============================================================================

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Store, 
  Lock, 
  Mail, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  AlertCircle, 
  Sparkles,
  UserCheck
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const { signIn, switchDemoRole, isDemoMode, isSupabaseConfigured } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password.trim()) {
      setError('Please provide your email and password.');
      return;
    }

    try {
      setLoading(true);
      await signIn({ email, password });
      navigate('/seller/dashboard');
    } catch (err) {
      console.error('Sign in error:', err);
      setError(err.message || 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = async (role) => {
    await switchDemoRole(role);
    if (role === 'seller') {
      navigate('/seller/dashboard');
    } else {
      navigate('/explore');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        
        {/* Top Header */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2 mb-2">
            <div className="w-10 h-10 rounded-2xl bg-forest-900 text-white flex items-center justify-center">
              <Store className="w-5 h-5 text-emerald-400" />
            </div>
            <span className="text-2xl font-black text-forest-900 font-display">
              Dukaan<span className="text-forest-600">Connect</span>
            </span>
          </Link>
          <h2 className="text-2xl font-bold text-gray-900 font-display">
            Welcome Back
          </h2>
          <p className="text-xs text-gray-500">
            Sign in to manage your digital dukaan catalog, enquiries, and AI assistant
          </p>
        </div>

        {/* Demo Mode Notice & 1-Click Fast Login for Hackathon Judges */}
        {isDemoMode && (
          <div className="p-4 rounded-3xl bg-forest-50 border border-forest-200 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-forest-900 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                Hackathon Demo Mode Active
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-forest-200 text-forest-900 font-semibold">
                No Password Required
              </span>
            </div>
            <p className="text-xs text-forest-800">
              Test all authenticated features instantly using our pre-seeded demo accounts:
            </p>
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                type="button"
                onClick={() => handleQuickDemo('seller')}
                className="py-2 px-3 rounded-xl bg-forest-900 hover:bg-forest-800 text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-sm transition"
              >
                <Store className="w-3.5 h-3.5 text-emerald-400" />
                <span>Ramesh (Seller)</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemo('customer')}
                className="py-2 px-3 rounded-xl bg-white hover:bg-cream-100 text-forest-900 border border-forest-300 text-xs font-semibold flex items-center justify-center gap-1.5 shadow-sm transition"
              >
                <UserCheck className="w-3.5 h-3.5 text-forest-700" />
                <span>Priya (Customer)</span>
              </button>
            </div>
          </div>
        )}

        {/* Main Login Card */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-cream-200 shadow-card space-y-5">
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  required
                  placeholder="ramesh.sharma@demo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-cream-300 text-xs focus:outline-none focus:ring-2 focus:ring-forest-600 bg-cream-50/50"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Password
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
                  Signing In...
                </span>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>

          <div className="text-center pt-2 border-t border-cream-200">
            <p className="text-xs text-gray-500">
              Don't have an account yet?{' '}
              <Link to="/signup" className="font-semibold text-forest-800 hover:underline">
                Create one now
              </Link>
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}

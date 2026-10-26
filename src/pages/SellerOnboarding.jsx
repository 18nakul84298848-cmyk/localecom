// ==============================================================================
// DukaanConnect: Seller Onboarding Page
// Walkthrough setup for neighbourhood shopkeepers to register digital storefronts
// ==============================================================================

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Store, 
  MapPin, 
  Phone, 
  Mail, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  AlertCircle,
  Upload,
  Globe
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { shopsService } from '../services/shops';
import { CATEGORIES, LOCALITIES } from '../data/demoData';

export default function SellerOnboarding() {
  const navigate = useNavigate();
  const { user, profile, refreshShop, switchDemoRole } = useAuth();

  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [category, setCategory] = useState('groceries');
  const [phone, setPhone] = useState(profile?.phone || '+91 98765 43210');
  const [email, setEmail] = useState(profile?.email || 'shop@demo.com');
  const [address, setAddress] = useState('');
  const [locality, setLocality] = useState(LOCALITIES[1]);
  const [city, setCity] = useState('New Delhi');
  const [state, setState] = useState('Delhi');
  const [pincode, setPincode] = useState('110024');
  const [description, setDescription] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Auto generate slug from name
  const handleNameChange = (val) => {
    setName(val);
    const generatedSlug = val
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    setSlug(generatedSlug);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError('Please provide your shop name.');
      return;
    }
    if (!address.trim()) {
      setError('Please provide your shop address or market location.');
      return;
    }

    try {
      setLoading(true);

      // If anonymous, ensure we have an active seller session
      if (!user) {
        await switchDemoRole('seller');
      }

      await shopsService.createShop({
        owner_id: user?.id || 'seller-1',
        name: name.trim(),
        slug: slug.trim(),
        category,
        phone: phone.trim(),
        email: email.trim(),
        address: address.trim(),
        locality,
        city,
        state,
        pincode,
        description: description.trim() || `Welcome to ${name}. Authentic neighborhood products in ${locality}.`,
        logo_url: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=200&auto=format&fit=crop&q=80',
        banner_url: 'https://images.unsplash.com/photo-1607344645866-009c320c5ab8?w=1200&auto=format&fit=crop&q=80',
      });

      await refreshShop();
      navigate('/seller/dashboard');
    } catch (err) {
      console.error('Failed to create shop:', err);
      setError(err.message || 'Could not create shop. Slug may already be taken.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-forest-100 text-forest-800">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          <span>Quick 2-Minute Digital Storefront Setup</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 font-display">
          Launch Your Digital Dukaan
        </h1>
        <p className="text-sm text-gray-600 max-w-xl mx-auto">
          Establish an online presence for your local shop. Get a dedicated URL to share on WhatsApp and reach nearby shoppers.
        </p>
      </div>

      {/* Main Form Card */}
      <div className="bg-white p-6 sm:p-10 rounded-3xl border border-cream-200 shadow-card">
        {error && (
          <div className="mb-6 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Shop Name & Slug */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Shop / Dukaan Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Ramesh Kirana & Spices"
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-cream-300 text-sm focus:outline-none focus:ring-2 focus:ring-forest-600 bg-cream-50/50"
              />
            </div>

            {/* Live Slug Preview */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Your Public Web Address (Shareable Link)
              </label>
              <div className="flex items-center px-4 py-2.5 rounded-xl border border-cream-300 bg-cream-100 text-xs text-gray-600">
                <Globe className="w-4 h-4 text-forest-700 mr-2 shrink-0" />
                <span className="text-gray-400">dukaanconnect.in/shop/</span>
                <input
                  type="text"
                  required
                  value={slug}
                  onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                  className="font-bold text-forest-900 bg-transparent focus:outline-none ml-0.5 flex-1"
                />
              </div>
              <span className="text-[11px] text-gray-400 mt-1 block">
                Customers can open this URL directly from WhatsApp to see your full product catalog.
              </span>
            </div>
          </div>

          {/* Category & Contact Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Primary Category <span className="text-rose-500">*</span>
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-cream-300 text-xs font-medium text-gray-700 bg-cream-50/50 focus:outline-none focus:ring-2 focus:ring-forest-600"
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
                WhatsApp / Phone Number <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                <input
                  type="tel"
                  required
                  placeholder="+91 98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-cream-300 text-xs focus:outline-none focus:ring-2 focus:ring-forest-600 bg-cream-50/50"
                />
              </div>
            </div>
          </div>

          {/* Address & Locality */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Shop Address (Market, Shop #, Street) <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="Shop 14, Main Bazaar, Near Metro Station"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-cream-300 text-xs focus:outline-none focus:ring-2 focus:ring-forest-600 bg-cream-50/50"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Locality / Market <span className="text-rose-500">*</span>
                </label>
                <select
                  value={locality}
                  onChange={(e) => setLocality(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-cream-300 text-xs font-medium text-gray-700 bg-cream-50/50 focus:outline-none focus:ring-2 focus:ring-forest-600"
                >
                  {LOCALITIES.filter(l => l !== 'All Localities').map((loc) => (
                    <option key={loc} value={loc}>
                      {loc}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">City</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-cream-300 text-xs bg-cream-50/50 focus:outline-none focus:ring-2 focus:ring-forest-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">PIN Code</label>
                <input
                  type="text"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-cream-300 text-xs bg-cream-50/50 focus:outline-none focus:ring-2 focus:ring-forest-600"
                />
              </div>
            </div>
          </div>

          {/* About description */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              About Your Shop (Tell customers your story)
            </label>
            <textarea
              rows={3}
              placeholder="e.g. 25-year-old family shop offering stone-ground spices and organic pulses..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-cream-300 text-xs focus:outline-none focus:ring-2 focus:ring-forest-600 bg-cream-50/50 resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-2xl bg-forest-900 hover:bg-forest-800 text-white font-bold text-sm shadow-md transition flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                Creating Your Digital Dukaan...
              </span>
            ) : (
              <>
                <span>Publish Storefront & Open Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </div>

    </div>
  );
}

// ==============================================================================
// DukaanConnect: Footer Component
// ==============================================================================

import React from 'react';
import { Link } from 'react-router-dom';
import { Store, Heart, ShieldCheck, Sparkles, MapPin, Phone } from 'lucide-react';

const CURRENT_YEAR = new Date().getFullYear();

export default function Footer() {
  return (
    <footer className="bg-forest-950 text-cream-200 border-t border-forest-900 pt-16 pb-12 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-forest-900">
          
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-forest-800 flex items-center justify-center text-white">
                <Store className="w-5 h-5 text-emerald-400" />
              </div>
              <span className="text-2xl font-black tracking-tight text-white font-display">
                Dukaan<span className="text-emerald-400">Connect</span>
              </span>
            </div>
            <p className="text-sm text-cream-300 leading-relaxed max-w-sm">
              Empowering India's independent retailers and neighbourhood shopkeepers to build professional digital storefronts, generate AI product listings, and connect directly with local customers.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-forest-900 text-emerald-300 border border-forest-800">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                Verified Local Dukaan
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-forest-900 text-amber-300 border border-forest-800">
                🇮🇳 Vocal For Local
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">
              Marketplace
            </h4>
            <ul className="space-y-2.5 text-sm text-cream-300">
              <li>
                <Link to="/explore" className="hover:text-emerald-400 transition">
                  Explore Products
                </Link>
              </li>
              <li>
                <Link to="/shops" className="hover:text-emerald-400 transition">
                  Nearby Shops
                </Link>
              </li>
              <li>
                <Link to="/explore?category=groceries" className="hover:text-emerald-400 transition">
                  Kirana & Spices
                </Link>
              </li>
              <li>
                <Link to="/explore?category=clothing" className="hover:text-emerald-400 transition">
                  Ethnic Wear & Silks
                </Link>
              </li>
              <li>
                <Link to="/explore?category=home_decor" className="hover:text-emerald-400 transition">
                  Artisan Home Decor
                </Link>
              </li>
            </ul>
          </div>

          {/* For Retailers */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">
              For Retailers
            </h4>
            <ul className="space-y-2.5 text-sm text-cream-300">
              <li>
                <Link to="/seller/onboarding" className="hover:text-emerald-400 transition">
                  Open Digital Dukaan
                </Link>
              </li>
              <li>
                <Link to="/seller/ai-assistant" className="hover:text-emerald-400 transition flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  AI Listing Assistant
                </Link>
              </li>
              <li>
                <Link to="/seller/dashboard" className="hover:text-emerald-400 transition">
                  Seller Dashboard
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-emerald-400 transition">
                  Growth & Benefits
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Support */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">
              Contact & Locality
            </h4>
            <div className="space-y-3 text-sm text-cream-300">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Supporting local markets across Delhi NCR, Varanasi, Bengaluru & Chennai</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Support: help@dukaanconnect.in</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-cream-400 gap-4">
          <p>© {CURRENT_YEAR} DukaanConnect. All rights reserved. Dedicated to neighbourhood small retailers.</p>
          <div className="flex items-center gap-1 text-cream-400">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>for Indian Commerce</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

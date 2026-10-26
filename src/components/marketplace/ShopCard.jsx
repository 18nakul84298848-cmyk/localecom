// ==============================================================================
// DukaanConnect: Shop Card Component
// ==============================================================================

import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Star, ArrowRight, ShieldCheck, Phone } from 'lucide-react';

export default function ShopCard({ shop }) {
  if (!shop) return null;

  const banner = shop.banner_url || 'https://images.unsplash.com/photo-1607344645866-009c320c5ab8?w=800&auto=format&fit=crop&q=80';
  const logo = shop.logo_url || 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=200&auto=format&fit=crop&q=80';

  return (
    <div className="bg-white rounded-2xl border border-cream-200 overflow-hidden shadow-card hover:shadow-lift transition-all duration-300 flex flex-col h-full group">
      
      {/* Shop Banner */}
      <div className="relative h-28 sm:h-32 w-full overflow-hidden bg-forest-900">
        <img
          src={banner}
          alt={shop.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

        {/* Category Pill */}
        <div className="absolute top-3 right-3">
          <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-white/90 backdrop-blur-md text-forest-900 capitalize shadow-sm">
            {shop.category}
          </span>
        </div>
      </div>

      {/* Shop Info Container */}
      <div className="p-4 sm:p-5 pt-0 relative flex flex-col flex-grow justify-between">
        
        {/* Floating Logo */}
        <div className="-mt-8 mb-3 flex items-end justify-between">
          <div className="w-16 h-16 rounded-2xl border-4 border-white overflow-hidden bg-white shadow-md">
            <img src={logo} alt={shop.name} className="w-full h-full object-cover" />
          </div>

          {/* Rating */}
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-cream-100 border border-cream-200 text-xs font-bold text-forest-900">
            <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            <span>{shop.rating || 4.8}</span>
            {shop.reviews_count && (
              <span className="text-gray-400 font-normal">({shop.reviews_count})</span>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="space-y-2">
          <div className="flex items-center gap-1.5">
            <h3 className="font-bold text-gray-900 text-base sm:text-lg group-hover:text-forest-700 transition font-display line-clamp-1">
              {shop.name}
            </h3>
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" title="Verified Dukaan" />
          </div>

          <div className="flex items-center gap-1 text-xs text-gray-500">
            <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span className="line-clamp-1">{shop.locality || shop.city}</span>
          </div>

          <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
            {shop.description}
          </p>

          {/* Badges */}
          {shop.badges && shop.badges.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {shop.badges.slice(0, 2).map((b, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded text-[10px] font-medium bg-forest-50 text-forest-800 border border-forest-100"
                >
                  {b}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Bottom Storefront Action */}
        <div className="pt-4 mt-3 border-t border-cream-200 flex items-center justify-between">
          {shop.phone && (
            <span className="text-xs text-gray-500 flex items-center gap-1">
              <Phone className="w-3 h-3 text-gray-400" />
              <span>{shop.phone}</span>
            </span>
          )}

          <Link
            to={`/shop/${shop.slug}`}
            className="ml-auto flex items-center gap-1 px-3 py-1.5 rounded-xl bg-forest-900 hover:bg-forest-800 text-white text-xs font-semibold shadow-sm transition"
          >
            <span>Visit Dukaan</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

      </div>

    </div>
  );
}

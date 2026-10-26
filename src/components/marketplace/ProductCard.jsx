// ==============================================================================
// DukaanConnect: Product Card Component
// ==============================================================================

import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Store, MessageCircle, ArrowUpRight, Sparkles } from 'lucide-react';
import { formatINR } from '../../data/demoData';

export default function ProductCard({ product, onQuickEnquire }) {
  if (!product) return null;

  const isLowStock = product.stock > 0 && product.stock <= 5;
  const isOutOfStock = product.stock <= 0;
  const mainImage = product.images?.[0] || 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=600&auto=format&fit=crop&q=80';

  const discountPercent = product.original_price && product.original_price > product.price
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : null;

  return (
    <div className="group bg-white rounded-2xl border border-cream-200 overflow-hidden shadow-card hover:shadow-lift transition-all duration-300 flex flex-col h-full">
      
      {/* Product Image Container */}
      <Link to={`/product/${product.id}`} className="relative block aspect-square overflow-hidden bg-cream-100">
        <img
          src={mainImage}
          alt={product.title}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          {/* Category Badge */}
          <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-white/90 backdrop-blur-md text-forest-900 border border-cream-200 shadow-sm capitalize">
            {product.category}
          </span>

          {/* Stock or Discount Badge */}
          {discountPercent ? (
            <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-500 text-white shadow-sm">
              {discountPercent}% OFF
            </span>
          ) : isOutOfStock ? (
            <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-rose-600 text-white shadow-sm">
              Out of Stock
            </span>
          ) : isLowStock ? (
            <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-100 text-amber-900 border border-amber-300">
              Only {product.stock} left
            </span>
          ) : null}
        </div>
      </Link>

      {/* Product Info */}
      <div className="p-4 sm:p-5 flex flex-col flex-grow justify-between gap-3">
        
        <div className="space-y-1.5">
          {/* Shop & Locality */}
          <div className="flex items-center justify-between text-xs text-gray-500">
            <Link
              to={product.shop_slug ? `/shop/${product.shop_slug}` : '#'}
              className="flex items-center gap-1 font-medium text-forest-800 hover:text-forest-950 truncate max-w-[170px]"
              title={product.shop_name}
            >
              <Store className="w-3.5 h-3.5 shrink-0 text-emerald-600" />
              <span className="truncate">{product.shop_name || 'Local Dukaan'}</span>
            </Link>

            {product.shop_locality && (
              <span className="flex items-center gap-0.5 text-[11px] text-gray-500 shrink-0">
                <MapPin className="w-3 h-3 text-gray-400" />
                <span className="truncate max-w-[110px]">{product.shop_locality.split(',')[0]}</span>
              </span>
            )}
          </div>

          {/* Title */}
          <Link to={`/product/${product.id}`} className="block">
            <h3 className="font-semibold text-gray-900 text-sm sm:text-base leading-snug line-clamp-2 group-hover:text-forest-700 transition font-display">
              {product.title}
            </h3>
          </Link>
        </div>

        {/* Pricing & Actions */}
        <div className="pt-2 border-t border-cream-200 flex items-center justify-between gap-2">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-base sm:text-lg font-black text-forest-900 font-display">
                {formatINR(product.price)}
              </span>
              {product.original_price && product.original_price > product.price && (
                <span className="text-xs text-gray-400 line-through">
                  {formatINR(product.original_price)}
                </span>
              )}
            </div>
            <span className="text-[10px] text-gray-500">Local shop price</span>
          </div>

          <div className="flex items-center gap-1.5">
            {onQuickEnquire && !isOutOfStock && (
              <button
                type="button"
                onClick={() => onQuickEnquire(product)}
                className="p-2 rounded-xl bg-forest-50 hover:bg-forest-100 text-forest-800 border border-forest-200 transition"
                title="Send Enquiry / WhatsApp Shop"
              >
                <MessageCircle className="w-4 h-4 text-forest-700" />
              </button>
            )}

            <Link
              to={`/product/${product.id}`}
              className="px-3 py-1.5 rounded-xl bg-forest-900 hover:bg-forest-800 text-white text-xs font-semibold flex items-center gap-1 shadow-sm transition"
            >
              <span>View</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

      </div>

    </div>
  );
}

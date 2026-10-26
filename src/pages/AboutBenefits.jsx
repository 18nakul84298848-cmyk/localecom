// ==============================================================================
// DukaanConnect: Retailer Benefits & Problem-Solution Story
// ==============================================================================

import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Store, 
  Sparkles, 
  TrendingUp, 
  ShieldCheck, 
  X, 
  Check, 
  ArrowRight, 
  HeartHandshake, 
  Smartphone, 
  MessageSquare,
  Users
} from 'lucide-react';

export default function AboutBenefits() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      
      {/* Hero Mission */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-forest-100 text-forest-800 uppercase tracking-wider">
          Our Purpose
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-gray-900 tracking-tight font-display">
          Revitalizing India's Local Retail Backbone
        </h1>
        <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
          Over 12 million small shopkeepers power India's daily commerce. Yet, large online marketplaces squeeze them with 25-35% commission fees, delayed payouts, and opaque algorithms. DukaanConnect changes the game.
        </p>
      </div>

      {/* Comparison Grid */}
      <div className="bg-white rounded-3xl border border-cream-200 shadow-card overflow-hidden">
        <div className="p-6 sm:p-8 text-center border-b border-cream-200">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 font-display">
            How DukaanConnect Stands Apart
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Built from first principles for Indian kiranas, weavers, and boutique owners
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-cream-50 border-b border-cream-200 text-gray-700 font-bold">
                <th className="py-4 px-6">Feature / Capability</th>
                <th className="py-4 px-6 text-forest-800 bg-forest-50/60 font-extrabold">
                  DukaanConnect
                </th>
                <th className="py-4 px-6 text-gray-400">Giant E-Commerce Marketplaces</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cream-100">
              <tr>
                <td className="py-4 px-6 font-semibold text-gray-800">Platform Commission</td>
                <td className="py-4 px-6 bg-forest-50/30 text-emerald-700 font-bold flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600" />
                  0% Zero Commission on Enquiries
                </td>
                <td className="py-4 px-6 text-gray-500">20% to 35% per order</td>
              </tr>
              <tr>
                <td className="py-4 px-6 font-semibold text-gray-800">Customer Relationship</td>
                <td className="py-4 px-6 bg-forest-50/30 text-emerald-700 font-bold flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600" />
                  Direct WhatsApp & Phone Connect
                </td>
                <td className="py-4 px-6 text-gray-500">Customer contact hidden & masked</td>
              </tr>
              <tr>
                <td className="py-4 px-6 font-semibold text-gray-800">Catalog Listing Effort</td>
                <td className="py-4 px-6 bg-forest-50/30 text-emerald-700 font-bold flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600" />
                  AI Listing Assistant in Hinglish & English
                </td>
                <td className="py-4 px-6 text-gray-500">Complex spreadsheets & barcode rules</td>
              </tr>
              <tr>
                <td className="py-4 px-6 font-semibold text-gray-800">Delivery & Pickups</td>
                <td className="py-4 px-6 bg-forest-50/30 text-emerald-700 font-bold flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600" />
                  Same-Day Local Pickup or Dropoff
                </td>
                <td className="py-4 px-6 text-gray-500">3 to 7 business days logistics loop</td>
              </tr>
              <tr>
                <td className="py-4 px-6 font-semibold text-gray-800">Storefront Identity</td>
                <td className="py-4 px-6 bg-forest-50/30 text-emerald-700 font-bold flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600" />
                  Dedicated Shareable URL (/shop/:slug)
                </td>
                <td className="py-4 px-6 text-gray-500">Buried among thousands of search ads</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 3 Pillars for Retailers */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        <div className="p-6 rounded-3xl bg-white border border-cream-200 shadow-card space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-forest-100 text-forest-800 flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-emerald-600" />
          </div>
          <h3 className="font-bold text-lg text-gray-900 font-display">
            AI Assistant For Everyone
          </h3>
          <p className="text-xs text-gray-600 leading-relaxed">
            Shopkeepers don't need marketing degrees or expensive agency fees. Just speak or type simple product details, and our Claude-powered assistant generates punchy titles, SEO stories, and WhatsApp messages.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-cream-200 shadow-card space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
            <Smartphone className="w-6 h-6 text-emerald-700" />
          </div>
          <h3 className="font-bold text-lg text-gray-900 font-display">
            WhatsApp-First Commerce
          </h3>
          <p className="text-xs text-gray-600 leading-relaxed">
            Over 500 million Indians communicate on WhatsApp daily. Every storefront and product listing on DukaanConnect is pre-wired to trigger instant, pre-filled WhatsApp conversations between buyers and sellers.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-cream-200 shadow-card space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center">
            <TrendingUp className="w-6 h-6 text-amber-600" />
          </div>
          <h3 className="font-bold text-lg text-gray-900 font-display">
            Hyperlocal Discovery
          </h3>
          <p className="text-xs text-gray-600 leading-relaxed">
            Customers look for trusted businesses in their market: Lajpat Nagar, Godowlia Chowk, or Koramangala. DukaanConnect filters products by locality so nearby customers find you first.
          </p>
        </div>

      </div>

      {/* CTA Bottom Banner */}
      <div className="p-8 sm:p-12 rounded-3xl bg-forest-900 text-white text-center space-y-4">
        <h2 className="text-2xl sm:text-3xl font-extrabold font-display">
          Ready to open your digital storefront?
        </h2>
        <p className="text-xs sm:text-sm text-cream-200 max-w-md mx-auto">
          It takes less than 2 minutes. No credit card, no technical setup required.
        </p>
        <Link
          to="/seller/onboarding"
          className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-white text-forest-900 hover:bg-cream-100 font-bold text-xs shadow-md transition"
        >
          <Store className="w-4 h-4 text-forest-700" />
          <span>Launch Your Dukaan Today</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

    </div>
  );
}

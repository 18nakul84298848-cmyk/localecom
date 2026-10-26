// ==============================================================================
// DukaanConnect: Growth Analytics Dashboard
// Real product view events, enquiry volume, and catalog engagement
// ==============================================================================

import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Eye, 
  PhoneCall, 
  ShoppingBag, 
  ArrowUpRight, 
  MapPin, 
  Info,
  Calendar,
  CheckCircle2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { analyticsService } from '../services/analytics';
import { formatINR } from '../data/demoData';

export default function AnalyticsPage() {
  const { shop } = useAuth();
  const shopId = shop?.id;

  const [stats, setStats] = useState({
    totalProducts: 0,
    totalViews: 0,
    totalEnquiries: 0,
    pendingEnquiries: 0,
    topProducts: [],
    enquiryConversionRate: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        if (shopId) {
          const data = await analyticsService.getSellerStats(shopId);
          setStats(data);
        }
      } catch (err) {
        console.error('Failed to load growth analytics:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [shopId]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="space-y-1 pb-4 border-b border-cream-200">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-900 border border-emerald-200">
          <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
          <span>Real-Time Performance Tracking</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 font-display">
          Growth & Engagement Analytics
        </h1>
        <p className="text-xs sm:text-sm text-gray-500">
          Genuine metrics calculated strictly from actual customer product view events and direct enquiry submissions.
        </p>
      </div>

      {/* Analytics Integrity Notice */}
      <div className="p-4 rounded-2xl bg-cream-100 border border-cream-200 flex items-start gap-3 text-xs text-gray-600">
        <Info className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-gray-800">Verified Data Policy:</span> We never fabricate fake sales, ghost conversions, or artificial customer counts. Every product view is triggered only when an active visitor inspects the dedicated listing.
        </div>
      </div>

      {/* Core KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        
        {/* Total Views */}
        <div className="p-6 rounded-3xl bg-white border border-cream-200 shadow-card space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">Total Views</span>
            <div className="p-2 rounded-xl bg-forest-50 text-forest-700">
              <Eye className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="text-3xl sm:text-4xl font-black text-gray-900 font-display">
              {stats.totalViews}
            </span>
            <span className="text-xs text-emerald-700 font-medium block mt-1">
              Active interest in your products
            </span>
          </div>
        </div>

        {/* Customer Enquiries */}
        <div className="p-6 rounded-3xl bg-white border border-cream-200 shadow-card space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">Direct Enquiries</span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-700">
              <PhoneCall className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="text-3xl sm:text-4xl font-black text-gray-900 font-display">
              {stats.totalEnquiries}
            </span>
            <span className="text-xs text-amber-700 font-medium block mt-1">
              WhatsApp & phone leads
            </span>
          </div>
        </div>

        {/* Inquiry Conversion Rate */}
        <div className="p-6 rounded-3xl bg-white border border-cream-200 shadow-card space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">Enquiry Rate</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="text-3xl sm:text-4xl font-black text-forest-900 font-display">
              {stats.enquiryConversionRate}%
            </span>
            <span className="text-xs text-gray-400 block mt-1">
              Enquiries per 100 views
            </span>
          </div>
        </div>

      </div>

      {/* Top Products View Distribution */}
      <div className="bg-white p-6 rounded-3xl border border-cream-200 shadow-card space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-gray-900 font-display">
              Product View Breakdown
            </h2>
            <p className="text-xs text-gray-500">
              Relative customer interest for items currently in your catalog
            </p>
          </div>
          <span className="text-xs font-bold text-forest-800">
            {stats.topProducts.length} items tracked
          </span>
        </div>

        {stats.topProducts.length > 0 ? (
          <div className="space-y-4">
            {stats.topProducts.map((p) => {
              const maxViews = Math.max(...stats.topProducts.map(i => i.views || 1), 1);
              const percentage = Math.round(((p.views || 0) / maxViews) * 100);

              return (
                <div key={p.id} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-gray-800 truncate max-w-md">
                      {p.title}
                    </span>
                    <span className="font-bold text-forest-900 shrink-0">
                      {p.views || 0} Views
                    </span>
                  </div>

                  {/* Visual Bar */}
                  <div className="w-full h-3 rounded-full bg-cream-100 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-forest-700 transition-all duration-500"
                      style={{ width: `${Math.max(5, percentage)}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-10 text-gray-400 text-xs">
            No product view activity recorded yet. As customers open your listings, view statistics will update here automatically.
          </div>
        )}
      </div>

    </div>
  );
}

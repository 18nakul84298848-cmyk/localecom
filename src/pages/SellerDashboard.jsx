// ==============================================================================
// DukaanConnect: Seller Dashboard
// Real metrics, shop overview, quick actions, and recent enquiries
// ==============================================================================

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Store, 
  ShoppingBag, 
  Eye, 
  PhoneCall, 
  Sparkles, 
  PlusCircle, 
  ArrowUpRight, 
  ExternalLink, 
  Share2, 
  Clock, 
  CheckCircle2, 
  MessageSquare, 
  TrendingUp,
  Settings,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { analyticsService } from '../services/analytics';
import { enquiriesService } from '../services/enquiries';
import { productsService } from '../services/products';
import { formatINR } from '../data/demoData';

export default function SellerDashboard() {
  const { user, profile, shop } = useAuth();

  const [stats, setStats] = useState({
    totalProducts: 0,
    totalViews: 0,
    totalEnquiries: 0,
    pendingEnquiries: 0,
    topProducts: [],
    enquiryConversionRate: 0,
  });
  const [recentEnquiries, setRecentEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copiedLink, setCopiedLink] = useState(false);

  const shopId = shop?.id;

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        if (shopId) {
          const [statsData, enquiriesData] = await Promise.all([
            analyticsService.getSellerStats(shopId),
            enquiriesService.getSellerEnquiries(shopId),
          ]);
          setStats(statsData);
          setRecentEnquiries(enquiriesData.slice(0, 5));
        }
      } catch (err) {
        console.error('Failed to load seller dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [shopId]);

  const handleUpdateStatus = async (enquiryId, newStatus) => {
    try {
      await enquiriesService.updateEnquiryStatus(enquiryId, newStatus);
      setRecentEnquiries(prev =>
        prev.map(e => (e.id === enquiryId ? { ...e, status: newStatus } : e))
      );
    } catch (e) {
      console.error('Status update failed:', e);
    }
  };

  const handleCopyStoreLink = () => {
    if (shop?.slug && navigator.clipboard) {
      const fullUrl = `${window.location.origin}/shop/${shop.slug}`;
      navigator.clipboard.writeText(fullUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* ==============================================================================
          WELCOME BANNER
          ============================================================================== */}
      <div className="p-6 sm:p-8 rounded-3xl bg-forest-900 text-white flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-lift border border-forest-800">
        <div className="space-y-2 max-w-xl">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500 text-forest-950">
              Active Storefront
            </span>
            <span className="text-xs text-cream-200">
              {shop?.locality || 'Local Market'}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold font-display">
            Namaste, {profile?.full_name || 'Retailer'}!
          </h1>
          <p className="text-xs sm:text-sm text-cream-200 leading-relaxed">
            Manage your digital dukaan for <span className="font-semibold text-white">{shop?.name || 'Your Shop'}</span>. Generate AI product listings and respond to customer enquiries.
          </p>
        </div>

        {/* Quick Actions in Banner */}
        <div className="flex flex-wrap items-center gap-3">
          {shop?.slug && (
            <Link
              to={`/shop/${shop.slug}`}
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2.5 rounded-xl bg-forest-800 hover:bg-forest-700 text-white text-xs font-semibold flex items-center gap-2 border border-forest-700 transition"
            >
              <Store className="w-4 h-4 text-emerald-400" />
              <span>View Storefront</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          )}

          <button
            onClick={handleCopyStoreLink}
            className="px-4 py-2.5 rounded-xl bg-white text-forest-900 hover:bg-cream-100 text-xs font-bold flex items-center gap-2 shadow-sm transition"
          >
            <Share2 className="w-4 h-4 text-forest-700" />
            <span>{copiedLink ? 'Link Copied!' : 'Share Shop on WhatsApp'}</span>
          </button>
        </div>
      </div>

      {/* ==============================================================================
          METRICS CARDS (GENUINE DATA)
          ============================================================================== */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        
        {/* Metric 1: Active Products */}
        <div className="p-5 rounded-3xl bg-white border border-cream-200 shadow-card space-y-2">
          <div className="flex items-center justify-between text-gray-500">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">Products</span>
            <div className="p-2 rounded-xl bg-forest-50 text-forest-700">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="text-2xl sm:text-3xl font-black text-gray-900 font-display">
              {stats.totalProducts}
            </span>
            <span className="text-xs text-gray-500 block">Listed in catalog</span>
          </div>
        </div>

        {/* Metric 2: Total Product Views */}
        <div className="p-5 rounded-3xl bg-white border border-cream-200 shadow-card space-y-2">
          <div className="flex items-center justify-between text-gray-500">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">Store Views</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700">
              <Eye className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="text-2xl sm:text-3xl font-black text-gray-900 font-display">
              {stats.totalViews}
            </span>
            <span className="text-xs text-gray-500 block">Unique product views</span>
          </div>
        </div>

        {/* Metric 3: Total Enquiries */}
        <div className="p-5 rounded-3xl bg-white border border-cream-200 shadow-card space-y-2">
          <div className="flex items-center justify-between text-gray-500">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">Total Enquiries</span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-700">
              <PhoneCall className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="text-2xl sm:text-3xl font-black text-gray-900 font-display">
              {stats.totalEnquiries}
            </span>
            <span className="text-xs text-gray-500 block">Customer leads captured</span>
          </div>
        </div>

        {/* Metric 4: Pending Replies */}
        <div className="p-5 rounded-3xl bg-white border border-cream-200 shadow-card space-y-2">
          <div className="flex items-center justify-between text-gray-500">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">Pending Leads</span>
            <div className="p-2 rounded-xl bg-rose-50 text-rose-700">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="text-2xl sm:text-3xl font-black text-rose-600 font-display">
              {stats.pendingEnquiries}
            </span>
            <span className="text-xs text-gray-500 block">Requires your reply</span>
          </div>
        </div>

      </div>

      {/* ==============================================================================
          QUICK ACTIONS PANEL
          ============================================================================== */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        <Link
          to="/seller/products"
          className="p-5 rounded-3xl bg-white border border-cream-200 shadow-card hover:shadow-lift transition flex items-center justify-between group"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-forest-100 text-forest-800 flex items-center justify-center group-hover:bg-forest-900 group-hover:text-white transition">
              <PlusCircle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-gray-900 font-display">Add & Edit Products</h3>
              <p className="text-xs text-gray-500">Manage catalog and stock</p>
            </div>
          </div>
          <ArrowUpRight className="w-4 h-4 text-gray-400 group-hover:text-forest-700 transition" />
        </Link>

        <Link
          to="/seller/ai-assistant"
          className="p-5 rounded-3xl bg-gradient-to-br from-emerald-50 to-white border border-emerald-200 shadow-card hover:shadow-lift transition flex items-center justify-between group"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-amber-300 animate-pulse" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-gray-900 font-display">AI Listing Assistant</h3>
              <p className="text-xs text-emerald-700 font-medium">Smart titles & WhatsApp copy</p>
            </div>
          </div>
          <ArrowUpRight className="w-4 h-4 text-emerald-700 transition" />
        </Link>

        <Link
          to="/seller/enquiries"
          className="p-5 rounded-3xl bg-white border border-cream-200 shadow-card hover:shadow-lift transition flex items-center justify-between group"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-900 flex items-center justify-center group-hover:bg-amber-500 group-hover:text-white transition">
              <MessageSquare className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-gray-900 font-display">Customer Enquiries</h3>
              <p className="text-xs text-gray-500">Chat and update lead status</p>
            </div>
          </div>
          <ArrowUpRight className="w-4 h-4 text-gray-400 group-hover:text-forest-700 transition" />
        </Link>

      </div>

      {/* ==============================================================================
          RECENT ENQUIRIES & TOP PRODUCTS
          ============================================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left: Recent Customer Enquiries (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-gray-900 font-display">
                Recent Customer Enquiries
              </h2>
              <p className="text-xs text-gray-500">
                Incoming leads for your shop's products
              </p>
            </div>
            <Link
              to="/seller/enquiries"
              className="text-xs font-semibold text-forest-800 hover:underline"
            >
              View All ({stats.totalEnquiries})
            </Link>
          </div>

          {recentEnquiries.length > 0 ? (
            <div className="space-y-3">
              {recentEnquiries.map((enq) => (
                <div
                  key={enq.id}
                  className="p-4 rounded-2xl bg-white border border-cream-200 shadow-xs space-y-2.5"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-gray-900">{enq.customer_name}</span>
                      <span className="text-[11px] text-gray-500">{enq.customer_phone}</span>
                    </div>

                    {/* Status Badge & Selector */}
                    <select
                      value={enq.status}
                      onChange={(e) => handleUpdateStatus(enq.id, e.target.value)}
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border cursor-pointer focus:outline-none ${
                        enq.status === 'New'
                          ? 'bg-rose-50 text-rose-700 border-rose-200'
                          : enq.status === 'Contacted'
                          ? 'bg-amber-50 text-amber-700 border-amber-200'
                          : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      }`}
                    >
                      <option value="New">● New</option>
                      <option value="Contacted">● Contacted</option>
                      <option value="Completed">● Completed</option>
                      <option value="Cancelled">● Cancelled</option>
                    </select>
                  </div>

                  <p className="text-xs text-gray-700 bg-cream-50 p-2.5 rounded-xl border border-cream-200 leading-relaxed italic">
                    "{enq.message}"
                  </p>

                  <div className="flex items-center justify-between text-[11px] text-gray-400 pt-1">
                    <span className="text-forest-900 font-semibold truncate max-w-[220px]">
                      Item: {enq.product_title || 'General Enquiry'}
                    </span>

                    {/* Quick WhatsApp chat with customer */}
                    <a
                      href={`https://wa.me/${enq.customer_phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Namaste ${enq.customer_name}! This is ${shop?.name}. Replying to your enquiry on DukaanConnect regarding ${enq.product_title}.`)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-emerald-700 font-bold hover:underline flex items-center gap-1"
                    >
                      <MessageSquare className="w-3 h-3 text-emerald-600" />
                      <span>Reply on WhatsApp</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center bg-white rounded-3xl border border-cream-200 space-y-2">
              <PhoneCall className="w-8 h-8 text-gray-400 mx-auto" />
              <h4 className="text-sm font-bold text-gray-800">No customer enquiries yet</h4>
              <p className="text-xs text-gray-500">
                Share your storefront URL on WhatsApp to start receiving customer queries!
              </p>
            </div>
          )}
        </div>

        {/* Right: Top Performing Products (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-gray-900 font-display">
                Top Viewed Products
              </h2>
              <p className="text-xs text-gray-500">
                Most popular items in your shop
              </p>
            </div>
            <Link
              to="/seller/products"
              className="text-xs font-semibold text-forest-800 hover:underline"
            >
              Manage
            </Link>
          </div>

          {stats.topProducts.length > 0 ? (
            <div className="bg-white rounded-3xl border border-cream-200 shadow-card divide-y divide-cream-200">
              {stats.topProducts.map((p, idx) => (
                <div key={p.id} className="p-3.5 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="w-5 font-bold text-xs text-gray-400">#{idx + 1}</span>
                    {p.image && (
                      <img
                        src={p.image}
                        alt=""
                        className="w-10 h-10 rounded-xl object-cover shrink-0"
                      />
                    )}
                    <div className="min-w-0">
                      <h4 className="text-xs font-semibold text-gray-900 truncate">{p.title}</h4>
                      <span className="text-xs font-bold text-forest-900">{formatINR(p.price)}</span>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-xs font-bold text-forest-800 flex items-center gap-1">
                      <Eye className="w-3.5 h-3.5 text-gray-400" />
                      {p.views || 0}
                    </span>
                    <span className="text-[10px] text-gray-400">Views</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center bg-white rounded-3xl border border-cream-200 space-y-2">
              <ShoppingBag className="w-8 h-8 text-gray-400 mx-auto" />
              <h4 className="text-sm font-bold text-gray-800">No active products</h4>
              <p className="text-xs text-gray-500">
                Upload your first item or use the AI Assistant.
              </p>
              <Link
                to="/seller/products"
                className="inline-block mt-2 px-4 py-2 rounded-xl bg-forest-900 text-white text-xs font-semibold"
              >
                Upload First Product
              </Link>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}

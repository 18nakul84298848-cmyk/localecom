// ==============================================================================
// DukaanConnect: Enquiries Inbox Page
// Lead management, status updates (New, Contacted, Completed, Cancelled), WhatsApp reply
// ==============================================================================

import React, { useState, useEffect } from 'react';
import { 
  PhoneCall, 
  MessageSquare, 
  Mail, 
  Phone, 
  Clock, 
  CheckCircle2, 
  Filter, 
  Search, 
  ArrowUpRight,
  ExternalLink,
  ShoppingBag
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { enquiriesService } from '../services/enquiries';
import { formatINR } from '../data/demoData';

export default function EnquiriesPage() {
  const { user, profile, shop } = useAuth();
  const shopId = shop?.id;
  const isSeller = profile?.role === 'seller';

  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Note editing state for sellers
  const [editingNotesId, setEditingNotesId] = useState(null);
  const [noteText, setNoteText] = useState('');

  const loadEnquiries = async () => {
    try {
      setLoading(true);
      if (isSeller && shopId) {
        const data = await enquiriesService.getSellerEnquiries(shopId);
        setEnquiries(data);
      } else if (user?.id) {
        const data = await enquiriesService.getCustomerEnquiries(user.id);
        setEnquiries(data);
      }
    } catch (err) {
      console.error('Failed to load enquiries:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEnquiries();
  }, [shopId, user?.id, isSeller]);

  const handleStatusChange = async (enquiryId, newStatus) => {
    try {
      await enquiriesService.updateEnquiryStatus(enquiryId, newStatus);
      setEnquiries(prev =>
        prev.map(e => (e.id === enquiryId ? { ...e, status: newStatus } : e))
      );
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  const handleSaveNotes = async (enquiryId) => {
    try {
      await enquiriesService.updateEnquiryStatus(enquiryId, undefined, noteText);
      setEnquiries(prev =>
        prev.map(e => (e.id === enquiryId ? { ...e, seller_notes: noteText } : e))
      );
      setEditingNotesId(null);
    } catch (err) {
      console.error('Failed to save notes:', err);
    }
  };

  const filteredEnquiries = enquiries.filter(e => {
    const matchesStatus = selectedStatus === 'all' || e.status === selectedStatus;
    const matchesSearch = !searchQuery.trim() ||
      (e.customer_name && e.customer_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (e.product_title && e.product_title.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (e.message && e.message.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesStatus && matchesSearch;
  });

  const getWhatsAppReplyLink = (enq) => {
    const cleanPhone = enq.customer_phone.replace(/[^0-9]/g, '');
    const text = encodeURIComponent(
      `Namaste ${enq.customer_name}! This is ${shop?.name || 'our shop'}. We received your enquiry regarding "${enq.product_title || 'our products'}". How can we assist you with your order?`
    );
    return `https://wa.me/${cleanPhone.startsWith('91') ? cleanPhone : '91' + cleanPhone}?text=${text}`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-cream-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 font-display">
            Customer Enquiries Inbox
          </h1>
          <p className="text-xs sm:text-sm text-gray-500">
            {isSeller
              ? `Direct buyer leads and product questions for ${shop?.name || 'your shop'}.`
              : 'Your submitted enquiries and seller responses.'}
          </p>
        </div>

        <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-cream-100 text-gray-700 border border-cream-200 self-start sm:self-auto">
          {filteredEnquiries.length} {filteredEnquiries.length === 1 ? 'Enquiry' : 'Enquiries'}
        </span>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-cream-200 shadow-xs">
        
        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {['all', 'New', 'Contacted', 'Completed', 'Cancelled'].map((status) => (
            <button
              key={status}
              onClick={() => setSelectedStatus(status)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                selectedStatus === status
                  ? 'bg-forest-900 text-white'
                  : 'text-gray-600 hover:bg-cream-100'
              }`}
            >
              {status === 'all' ? 'All Leads' : status}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative sm:w-64">
          <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by buyer or item..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-cream-300 text-xs focus:outline-none focus:ring-2 focus:ring-forest-600 bg-cream-50/50"
          />
        </div>

      </div>

      {/* Enquiries Feed */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(n => (
            <div key={n} className="h-32 rounded-3xl bg-cream-100 animate-shimmer"></div>
          ))}
        </div>
      ) : filteredEnquiries.length > 0 ? (
        <div className="space-y-4">
          {filteredEnquiries.map((enq) => (
            <div
              key={enq.id}
              className="p-5 sm:p-6 rounded-3xl bg-white border border-cream-200 shadow-card space-y-4"
            >
              {/* Top Row: Buyer Name, Phone, Status & Date */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-cream-100">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-gray-900">{enq.customer_name}</span>
                    <span className="text-xs text-gray-500 font-mono">{enq.customer_phone}</span>
                    {enq.customer_email && (
                      <span className="text-xs text-gray-400 hidden sm:inline">• {enq.customer_email}</span>
                    )}
                  </div>
                  <span className="text-[11px] text-gray-400">
                    Received on {new Date(enq.created_at).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                {/* Status Changer */}
                {isSeller ? (
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400 font-medium">Status:</span>
                    <select
                      value={enq.status}
                      onChange={(e) => handleStatusChange(enq.id, e.target.value)}
                      className={`text-xs font-bold px-3 py-1.5 rounded-xl border cursor-pointer focus:outline-none ${
                        enq.status === 'New'
                          ? 'bg-rose-50 text-rose-700 border-rose-200'
                          : enq.status === 'Contacted'
                          ? 'bg-amber-50 text-amber-700 border-amber-200'
                          : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      }`}
                    >
                      <option value="New">● New Lead</option>
                      <option value="Contacted">● Contacted</option>
                      <option value="Completed">● Completed</option>
                      <option value="Cancelled">● Cancelled</option>
                    </select>
                  </div>
                ) : (
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-cream-100 text-forest-900">
                    {enq.status}
                  </span>
                )}
              </div>

              {/* Message Content */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-gray-700">
                  <ShoppingBag className="w-3.5 h-3.5 text-forest-700" />
                  <span>Referenced Item: {enq.product_title || 'General Store Enquiry'}</span>
                </div>
                <p className="p-3.5 rounded-2xl bg-cream-50/70 border border-cream-200 text-xs sm:text-sm text-gray-800 leading-relaxed italic">
                  "{enq.message}"
                </p>
              </div>

              {/* Action Buttons: Direct Reply */}
              <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <span className="font-medium">Preferred Contact:</span>
                  <span className="px-2 py-0.5 rounded bg-cream-100 text-gray-700 capitalize font-bold">
                    {enq.contact_preference || 'WhatsApp'}
                  </span>
                </div>

                {isSeller && (
                  <div className="flex items-center gap-2">
                    <a
                      href={`tel:${enq.customer_phone}`}
                      className="px-3 py-1.5 rounded-xl border border-cream-300 hover:bg-cream-100 text-gray-700 text-xs font-semibold flex items-center gap-1.5 transition"
                    >
                      <Phone className="w-3.5 h-3.5 text-gray-600" />
                      <span>Direct Call</span>
                    </a>

                    <a
                      href={getWhatsAppReplyLink(enq)}
                      target="_blank"
                      rel="noreferrer"
                      className="px-4 py-1.5 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition"
                    >
                      <MessageSquare className="w-3.5 h-3.5 fill-white" />
                      <span>Reply on WhatsApp</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                )}
              </div>

            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 px-4 bg-white rounded-3xl border border-cream-200 space-y-3">
          <PhoneCall className="w-12 h-12 text-gray-400 mx-auto" />
          <h3 className="text-base font-bold text-gray-900 font-display">
            No enquiries found
          </h3>
          <p className="text-xs text-gray-500">
            {selectedStatus !== 'all' ? `No enquiries with status "${selectedStatus}".` : 'Share your public storefront to start receiving leads!'}
          </p>
        </div>
      )}

    </div>
  );
}

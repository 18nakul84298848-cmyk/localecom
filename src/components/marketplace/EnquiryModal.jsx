// ==============================================================================
// DukaanConnect: Customer Enquiry Modal
// Lead capture with validation, direct WhatsApp fallback, and confirmation
// ==============================================================================

import React, { useState } from 'react';
import { 
  X, 
  Send, 
  MessageSquare, 
  Phone, 
  Mail, 
  CheckCircle2, 
  AlertCircle, 
  ExternalLink,
  Store
} from 'lucide-react';
import { enquiriesService } from '../../services/enquiries';
import { useAuth } from '../../context/AuthContext';
import { formatINR } from '../../data/demoData';

export default function EnquiryModal({ product, shop, isOpen, onClose, onSuccess }) {
  const { user, profile } = useAuth();

  const [customerName, setCustomerName] = useState(profile?.full_name || '');
  const [customerPhone, setCustomerPhone] = useState(profile?.phone || '');
  const [customerEmail, setCustomerEmail] = useState(profile?.email || '');
  const [message, setMessage] = useState(
    product 
      ? `Hi! I am interested in "${product.title}". Is this available for delivery or store pickup?`
      : 'Hello! I would like to inquire about your products.'
  );
  const [contactPreference, setContactPreference] = useState('whatsapp');
  
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const targetShopId = product?.shop_id || shop?.id;
  const targetShopPhone = product?.shop_phone || shop?.phone;
  const targetShopName = product?.shop_name || shop?.name;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!customerName.trim()) {
      setError('Please provide your name.');
      return;
    }
    if (!customerPhone.trim() || customerPhone.trim().length < 8) {
      setError('Please provide a valid contact phone number.');
      return;
    }
    if (!message.trim() || message.trim().length < 5) {
      setError('Please enter a brief message or question.');
      return;
    }

    try {
      setSubmitting(true);
      await enquiriesService.createEnquiry({
        shop_id: targetShopId,
        product_id: product?.id || null,
        product_title: product?.title || 'General Enquiry',
        customer_id: user?.id || null,
        customer_name: customerName,
        customer_phone: customerPhone,
        customer_email: customerEmail,
        message,
        contact_preference: contactPreference,
      });

      setIsSubmitted(true);
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error('Failed to submit enquiry:', err);
      setError(err.message || 'Could not submit enquiry. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Direct WhatsApp link construction
  const getWhatsAppLink = () => {
    if (!targetShopPhone) return null;
    const cleanPhone = targetShopPhone.replace(/[^0-9]/g, '');
    const text = encodeURIComponent(
      `Namaste ${targetShopName}!\nI found your listing on DukaanConnect.\n\nProduct: ${product?.title || 'Shop item'}\n${product ? `Price: ${formatINR(product.price)}\n` : ''}Message: ${message}`
    );
    return `https://wa.me/${cleanPhone.startsWith('91') ? cleanPhone : '91' + cleanPhone}?text=${text}`;
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div 
        className="relative bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-cream-200 animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-gray-400 hover:text-gray-700 hover:bg-cream-100 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {isSubmitted ? (
          // Success State
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 rounded-full bg-forest-100 text-forest-800 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10 text-emerald-600" />
            </div>
            
            <div className="space-y-1">
              <h3 className="text-2xl font-bold text-gray-900 font-display">
                Enquiry Sent Directly to Shopkeeper!
              </h3>
              <p className="text-sm text-gray-600 max-w-sm mx-auto">
                <span className="font-semibold text-forest-900">{targetShopName}</span> has received your message and will get in touch with you via {contactPreference}.
              </p>
            </div>

            {/* Direct WhatsApp Action */}
            {targetShopPhone && (
              <div className="pt-4">
                <a
                  href={getWhatsAppLink()}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-2 w-full py-3 px-4 rounded-2xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-sm shadow-md transition"
                >
                  <MessageSquare className="w-4 h-4 fill-white" />
                  <span>Chat Immediately on WhatsApp</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
                <p className="text-[11px] text-gray-400 mt-2">
                  Prefer instant answers? You can also message the retailer directly on WhatsApp.
                </p>
              </div>
            )}

            <div className="pt-2">
              <button
                onClick={onClose}
                className="w-full py-2.5 rounded-xl border border-cream-300 text-gray-700 text-sm font-semibold hover:bg-cream-100"
              >
                Close Window
              </button>
            </div>
          </div>
        ) : (
          // Enquiry Form
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-forest-100 text-forest-800">
                Direct Shop Connect
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mt-1 font-display">
                Contact {targetShopName || 'Seller'}
              </h3>
              <p className="text-xs text-gray-500">
                Connect with the neighborhood retailer for availability, bulk orders, or custom questions.
              </p>
            </div>

            {/* Product Snapshot if applicable */}
            {product && (
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-cream-50 border border-cream-200">
                <img
                  src={product.images?.[0]}
                  alt={product.title}
                  className="w-12 h-12 rounded-xl object-cover"
                />
                <div className="min-w-0 flex-1">
                  <h4 className="text-xs font-semibold text-gray-900 truncate">{product.title}</h4>
                  <p className="text-xs font-bold text-forest-800">{formatINR(product.price)}</p>
                </div>
              </div>
            )}

            {error && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Form Fields */}
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Your Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Priya Malhotra"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-cream-300 text-sm focus:outline-none focus:ring-2 focus:ring-forest-600 bg-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Phone / WhatsApp <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-cream-300 text-sm focus:outline-none focus:ring-2 focus:ring-forest-600 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Email Address (Optional)
                  </label>
                  <input
                    type="email"
                    placeholder="you@domain.com"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-cream-300 text-sm focus:outline-none focus:ring-2 focus:ring-forest-600 bg-white"
                  />
                </div>
              </div>

              {/* Preferred Contact Method */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  How should the shop contact you?
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setContactPreference('whatsapp')}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 border transition ${
                      contactPreference === 'whatsapp'
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-800'
                        : 'border-cream-300 text-gray-600 hover:bg-cream-100'
                    }`}
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                    <span>WhatsApp</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setContactPreference('call')}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 border transition ${
                      contactPreference === 'call'
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-800'
                        : 'border-cream-300 text-gray-600 hover:bg-cream-100'
                    }`}
                  >
                    <Phone className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Phone Call</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setContactPreference('email')}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 border transition ${
                      contactPreference === 'email'
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-800'
                        : 'border-cream-300 text-gray-600 hover:bg-cream-100'
                    }`}
                  >
                    <Mail className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Email</span>
                  </button>
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Message / Requirements <span className="text-rose-500">*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-cream-300 text-sm focus:outline-none focus:ring-2 focus:ring-forest-600 bg-white resize-none"
                  placeholder="Specify quantity, delivery timing, or product customization..."
                />
              </div>
            </div>

            {/* Actions */}
            <div className="pt-2 flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="w-1/3 py-2.5 rounded-xl border border-cream-300 text-xs font-semibold text-gray-700 hover:bg-cream-100 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="w-2/3 py-2.5 rounded-xl bg-forest-900 hover:bg-forest-800 text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-sm transition disabled:opacity-50"
              >
                {submitting ? (
                  <span className="flex items-center gap-2">
                    <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    Sending...
                  </span>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Enquiry to Dukaan</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

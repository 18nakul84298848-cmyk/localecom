// ==============================================================================
// DukaanConnect: AI Product Listing Assistant Studio
// Powered by Claude 3.5 Sonnet Edge Function with labelled local fallback
// ==============================================================================

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  Copy, 
  Check, 
  Send, 
  MessageSquare, 
  Share2, 
  AlertCircle, 
  Info, 
  ArrowRight,
  FileText,
  Hash,
  ShoppingBag,
  ExternalLink
} from 'lucide-react';
import { aiListingService } from '../services/aiListing';
import { productsService } from '../services/products';
import { useAuth } from '../context/AuthContext';
import { CATEGORIES } from '../data/demoData';

export default function AIAssistant() {
  const navigate = useNavigate();
  const { shop } = useAuth();

  // Inputs
  const [productName, setProductName] = useState('');
  const [category, setCategory] = useState('groceries');
  const [specifications, setSpecifications] = useState('');
  const [sellingPoints, setSellingPoints] = useState('');
  const [targetAudience, setTargetAudience] = useState('Local neighborhood families and shoppers');
  const [language, setLanguage] = useState('English');

  // Generator State
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [generationMeta, setGenerationMeta] = useState(null);

  // Editable Outputs
  const [generatedTitle, setGeneratedTitle] = useState('');
  const [generatedDesc, setGeneratedDesc] = useState('');
  const [generatedKeywords, setGeneratedKeywords] = useState([]);
  const [keywordInput, setKeywordInput] = useState('');
  const [generatedCaption, setGeneratedCaption] = useState('');
  const [generatedWhatsApp, setGeneratedWhatsApp] = useState('');

  // Active Output Tab
  const [activeTab, setActiveTab] = useState('title_desc'); // 'title_desc' | 'keywords' | 'social' | 'whatsapp'
  const [copiedKey, setCopiedKey] = useState(null);
  const [publishing, setPublishing] = useState(false);
  const [publishSuccess, setPublishSuccess] = useState(false);

  const handleGenerate = async (e) => {
    e.preventDefault();
    setError(null);
    setPublishSuccess(false);

    if (!productName.trim()) {
      setError('Please provide the product name to generate a listing.');
      return;
    }

    try {
      setLoading(true);
      const res = await aiListingService.generateListing({
        productName: productName.trim(),
        category,
        specifications: specifications.trim(),
        sellingPoints: sellingPoints.trim(),
        targetAudience: targetAudience.trim(),
        language,
      });

      if (res?.data) {
        setGeneratedTitle(res.data.title || '');
        setGeneratedDesc(res.data.description || '');
        setGeneratedKeywords(res.data.keywords || []);
        setGeneratedCaption(res.data.shortCaption || '');
        setGeneratedWhatsApp(res.data.whatsappMessage || '');
        setGenerationMeta({
          source: res.source,
          message: res.message,
        });
      }
    } catch (err) {
      console.error('Generation failed:', err);
      setError(err.message || 'Listing generation failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text, key) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2000);
    }
  };

  const handlePublishAsProduct = async () => {
    if (!shop?.id) {
      setError('Please ensure you are registered as a seller with a shop first.');
      return;
    }

    try {
      setPublishing(true);
      await productsService.createProduct({
        shop_id: shop.id,
        title: generatedTitle,
        description: generatedDesc,
        category,
        price: 299, // default placeholder price for seller to edit
        stock: 10,
        is_active: true,
        tags: generatedKeywords,
        images: ['https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=600&auto=format&fit=crop&q=80'],
      });

      setPublishSuccess(true);
      setTimeout(() => {
        navigate('/seller/products');
      }, 1500);
    } catch (err) {
      setError('Failed to create product listing: ' + err.message);
    } finally {
      setPublishing(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="space-y-2 max-w-2xl">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-900 border border-emerald-200">
          <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
          <span>AI Retail Listing Assistant</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-gray-900 font-display">
          Craft High-Converting Product Listings in Seconds
        </h1>
        <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
          Powered by Anthropic Claude 3.5 Sonnet. Turn raw item notes into SEO titles, authentic Indian retailer descriptions, search tags, and ready-to-broadcast WhatsApp messages.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* ==============================================================================
            INPUT FORM (5 Cols)
            ============================================================================== */}
        <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-cream-200 shadow-card space-y-5 h-fit">
          <div className="flex items-center gap-2 pb-3 border-b border-cream-200">
            <span className="font-bold text-sm text-gray-900">Product Inputs</span>
            <span className="text-[10px] text-gray-400 font-medium ml-auto">No technical jargon needed</span>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleGenerate} className="space-y-4">
            
            {/* Product Name */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Item / Product Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Handmade Terracotta Chai Kulhad"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-cream-300 text-xs focus:outline-none focus:ring-2 focus:ring-forest-600 bg-cream-50/50"
              />
            </div>

            {/* Category & Language */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-cream-300 text-xs font-medium text-gray-700 bg-cream-50/50 focus:outline-none focus:ring-2 focus:ring-forest-600 capitalize"
                >
                  {CATEGORIES.filter(c => c.id !== 'all').map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Copy Language</label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-cream-300 text-xs font-medium text-gray-700 bg-cream-50/50 focus:outline-none focus:ring-2 focus:ring-forest-600"
                >
                  <option value="English">English</option>
                  <option value="Hinglish">Hinglish (Hindi in Latin script)</option>
                  <option value="Hindi">Pure Hindi</option>
                  <option value="Tamil">Tamil</option>
                </select>
              </div>
            </div>

            {/* Specifications / Materials */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Materials, Sizes, or Key Specs
              </label>
              <textarea
                rows={2}
                placeholder="e.g. Set of 6, 150ml each, 100% natural river clay, microwave safe"
                value={specifications}
                onChange={(e) => setSpecifications(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-cream-300 text-xs focus:outline-none focus:ring-2 focus:ring-forest-600 bg-cream-50/50 resize-none"
              />
            </div>

            {/* Selling Points */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Unique Selling Points / Special Heritage
              </label>
              <input
                type="text"
                placeholder="e.g. Thrown by Ramanagara village potters, gives rich earthy aroma"
                value={sellingPoints}
                onChange={(e) => setSellingPoints(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-cream-300 text-xs focus:outline-none focus:ring-2 focus:ring-forest-600 bg-cream-50/50"
              />
            </div>

            {/* Target Audience */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Target Customer</label>
              <input
                type="text"
                placeholder="e.g. Chai lovers, festive gifting, eco-friendly home decor"
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-cream-300 text-xs focus:outline-none focus:ring-2 focus:ring-forest-600 bg-cream-50/50"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-forest-800 hover:from-emerald-500 hover:to-forest-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition disabled:opacity-50"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  Claude AI Is Crafting Your Listing...
                </span>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Generate Full Listing with AI</span>
                </>
              )}
            </button>

          </form>
        </div>

        {/* ==============================================================================
            OUTPUT STUDIO & EDITING TABS (7 Cols)
            ============================================================================== */}
        <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-cream-200 shadow-card space-y-6">
          
          {/* Output Meta & Label Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-cream-200">
            <div>
              <span className="font-bold text-sm text-gray-900 block">AI Generated Catalog Output</span>
              {generationMeta && (
                <span className="text-[11px] font-semibold text-emerald-800 flex items-center gap-1 mt-0.5">
                  <Info className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  {generationMeta.message}
                </span>
              )}
            </div>

            {generatedTitle && (
              <span className="text-[10px] text-gray-400">
                ✏️ All fields are directly editable before saving
              </span>
            )}
          </div>

          {generatedTitle ? (
            <div className="space-y-5">
              
              {/* Output Format Tabs */}
              <div className="flex items-center gap-1.5 border-b border-cream-200 pb-2 overflow-x-auto">
                <button
                  type="button"
                  onClick={() => setActiveTab('title_desc')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                    activeTab === 'title_desc'
                      ? 'bg-forest-900 text-white'
                      : 'text-gray-600 hover:bg-cream-100'
                  }`}
                >
                  SEO Title & Description
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('whatsapp')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                    activeTab === 'whatsapp'
                      ? 'bg-forest-900 text-white'
                      : 'text-gray-600 hover:bg-cream-100'
                  }`}
                >
                  WhatsApp Broadcast Message
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('social')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                    activeTab === 'social'
                      ? 'bg-forest-900 text-white'
                      : 'text-gray-600 hover:bg-cream-100'
                  }`}
                >
                  Social Caption
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('keywords')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                    activeTab === 'keywords'
                      ? 'bg-forest-900 text-white'
                      : 'text-gray-600 hover:bg-cream-100'
                  }`}
                >
                  Keywords ({generatedKeywords.length})
                </button>
              </div>

              {/* Tab 1: Title & Description */}
              {activeTab === 'title_desc' && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-bold text-gray-700">SEO Product Title</label>
                      <button
                        onClick={() => copyToClipboard(generatedTitle, 'title')}
                        className="text-[11px] font-semibold text-forest-800 hover:underline flex items-center gap-1"
                      >
                        {copiedKey === 'title' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedKey === 'title' ? 'Copied' : 'Copy Title'}</span>
                      </button>
                    </div>
                    <input
                      type="text"
                      value={generatedTitle}
                      onChange={(e) => setGeneratedTitle(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-cream-300 text-xs font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-forest-600 bg-cream-50/50"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-bold text-gray-700">Storefront Description</label>
                      <button
                        onClick={() => copyToClipboard(generatedDesc, 'desc')}
                        className="text-[11px] font-semibold text-forest-800 hover:underline flex items-center gap-1"
                      >
                        {copiedKey === 'desc' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedKey === 'desc' ? 'Copied' : 'Copy Description'}</span>
                      </button>
                    </div>
                    <textarea
                      rows={8}
                      value={generatedDesc}
                      onChange={(e) => setGeneratedDesc(e.target.value)}
                      className="w-full p-3.5 rounded-xl border border-cream-300 text-xs leading-relaxed text-gray-800 focus:outline-none focus:ring-2 focus:ring-forest-600 bg-cream-50/50 resize-none"
                    />
                  </div>
                </div>
              )}

              {/* Tab 2: WhatsApp Broadcast */}
              {activeTab === 'whatsapp' && (
                <div className="space-y-3 animate-in fade-in duration-150">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-gray-700">Ready-to-Send WhatsApp Text</span>
                    <button
                      onClick={() => copyToClipboard(generatedWhatsApp, 'wa')}
                      className="text-[11px] font-semibold text-forest-800 hover:underline flex items-center gap-1"
                    >
                      {copiedKey === 'wa' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedKey === 'wa' ? 'Copied' : 'Copy WhatsApp Text'}</span>
                    </button>
                  </div>
                  <textarea
                    rows={8}
                    value={generatedWhatsApp}
                    onChange={(e) => setGeneratedWhatsApp(e.target.value)}
                    className="w-full p-3.5 rounded-xl border border-emerald-200 text-xs leading-relaxed text-gray-800 focus:outline-none focus:ring-2 focus:ring-forest-600 bg-emerald-50/20 font-mono resize-none"
                  />
                  <p className="text-[11px] text-gray-400">
                    💡 Broadcast this message to your local WhatsApp customer groups or status update.
                  </p>
                </div>
              )}

              {/* Tab 3: Social Media Caption */}
              {activeTab === 'social' && (
                <div className="space-y-3 animate-in fade-in duration-150">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-gray-700">Social Media Post (Instagram / Facebook)</span>
                    <button
                      onClick={() => copyToClipboard(generatedCaption, 'caption')}
                      className="text-[11px] font-semibold text-forest-800 hover:underline flex items-center gap-1"
                    >
                      {copiedKey === 'caption' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedKey === 'caption' ? 'Copied' : 'Copy Caption'}</span>
                    </button>
                  </div>
                  <textarea
                    rows={5}
                    value={generatedCaption}
                    onChange={(e) => setGeneratedCaption(e.target.value)}
                    className="w-full p-3.5 rounded-xl border border-cream-300 text-xs leading-relaxed text-gray-800 focus:outline-none focus:ring-2 focus:ring-forest-600 bg-cream-50/50 resize-none"
                  />
                </div>
              )}

              {/* Tab 4: Search Keywords */}
              {activeTab === 'keywords' && (
                <div className="space-y-3 animate-in fade-in duration-150">
                  <span className="text-xs font-bold text-gray-700 block">Marketplace Search Tags</span>
                  <div className="flex flex-wrap gap-2">
                    {generatedKeywords.map((kw, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 rounded-full text-xs font-medium bg-forest-50 text-forest-800 border border-forest-200 flex items-center gap-1.5"
                      >
                        <Hash className="w-3 h-3 text-forest-600" />
                        <span>{kw}</span>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Button: Apply Directly to Product Catalog */}
              <div className="pt-4 border-t border-cream-200 flex items-center justify-between gap-4">
                {publishSuccess ? (
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-700">
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>Product created! Redirecting to inventory...</span>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={handlePublishAsProduct}
                    disabled={publishing}
                    className="ml-auto px-5 py-2.5 rounded-xl bg-forest-900 hover:bg-forest-800 text-white text-xs font-bold flex items-center gap-2 shadow-sm transition disabled:opacity-50"
                  >
                    <ShoppingBag className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{publishing ? 'Publishing...' : 'Add to My Store Catalog'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

            </div>
          ) : (
            // Empty State Before Generation
            <div className="text-center py-20 px-4 space-y-3">
              <div className="w-16 h-16 rounded-full bg-cream-100 text-gray-400 flex items-center justify-center mx-auto">
                <Sparkles className="w-8 h-8 text-forest-400" />
              </div>
              <h3 className="text-base font-bold text-gray-900 font-display">
                AI Listing Studio Ready
              </h3>
              <p className="text-xs text-gray-500 max-w-sm mx-auto leading-relaxed">
                Fill in your product name on the left and click "Generate". Claude AI will generate your SEO titles, catalog stories, and WhatsApp messages tailored for Indian neighbourhood commerce.
              </p>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}

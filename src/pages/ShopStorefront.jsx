// ==============================================================================
// DukaanConnect: Public Shop Storefront (/shop/:slug)
// Dedicated branded page for neighbourhood retail shopkeepers
// ==============================================================================

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  MapPin, 
  Phone, 
  Share2, 
  Star, 
  MessageCircle, 
  ShieldCheck, 
  Search, 
  ShoppingBag, 
  ExternalLink,
  Store,
  Clock,
  Sparkles,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { shopsService } from '../services/shops';
import { productsService } from '../services/products';
import ProductCard from '../components/marketplace/ProductCard';
import EnquiryModal from '../components/marketplace/EnquiryModal';

export default function ShopStorefront() {
  const { slug } = useParams();

  const [shop, setShop] = useState(null);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Shop internal search & category tabs
  const [searchInShop, setSearchInShop] = useState('');
  const [selectedShopCategory, setSelectedShopCategory] = useState('all');

  // Share & enquiry state
  const [copiedLink, setCopiedLink] = useState(false);
  const [enquiryProduct, setEnquiryProduct] = useState(null);
  const [isEnquiryModalOpen, setIsEnquiryModalOpen] = useState(false);

  useEffect(() => {
    const fetchShopAndProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        const shopData = await shopsService.getShopBySlug(slug);
        if (!shopData) {
          setError('This dukaan does not exist or has been made private.');
          return;
        }

        setShop(shopData);

        // Fetch products for this shop
        const shopProducts = await productsService.getProducts({
          shopId: shopData.id,
          includeInactive: false, // only public active items for anonymous visitors
        });

        setProducts(shopProducts);
        setFilteredProducts(shopProducts);
      } catch (err) {
        console.error('Error loading shop storefront:', err);
        setError('Failed to load shop storefront.');
      } finally {
        setLoading(false);
      }
    };

    fetchShopAndProducts();
    window.scrollTo(0, 0);
  }, [slug]);

  // Handle in-shop filtering
  useEffect(() => {
    let result = [...products];

    if (selectedShopCategory !== 'all') {
      result = result.filter(p => p.category === selectedShopCategory);
    }

    if (searchInShop.trim()) {
      const q = searchInShop.toLowerCase();
      result = result.filter(p => 
        p.title.toLowerCase().includes(q) || 
        p.description.toLowerCase().includes(q) ||
        (p.tags && p.tags.some(t => t.toLowerCase().includes(q)))
      );
    }

    setFilteredProducts(result);
  }, [searchInShop, selectedShopCategory, products]);

  // Copy shareable link
  const handleCopyLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  // WhatsApp share link for customers/friends
  const getWhatsAppShareLink = () => {
    const text = encodeURIComponent(
      `Check out ${shop?.name} on DukaanConnect! Authentic neighbourhood products: ${window.location.href}`
    );
    return `https://wa.me/?text=${text}`;
  };

  // Direct WhatsApp chat with seller
  const getWhatsAppDirectChat = () => {
    if (!shop?.phone) return null;
    const cleanPhone = shop.phone.replace(/[^0-9]/g, '');
    const text = encodeURIComponent(
      `Namaste ${shop.name}! I am browsing your digital storefront on DukaanConnect and would like to ask a question.`
    );
    return `https://wa.me/${cleanPhone.startsWith('91') ? cleanPhone : '91' + cleanPhone}?text=${text}`;
  };

  // Get unique categories for this shop
  const shopCategories = ['all', ...Array.from(new Set(products.map(p => p.category)))];

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <div className="h-64 rounded-3xl bg-cream-100 animate-shimmer"></div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(n => (
            <div key={n} className="h-72 rounded-2xl bg-cream-100 animate-shimmer"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error || !shop) {
    return (
      <div className="max-w-lg mx-auto py-20 px-4 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 font-display">Storefront Not Found</h2>
        <p className="text-sm text-gray-500">{error}</p>
        <Link
          to="/shops"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-forest-900 text-white text-xs font-semibold"
        >
          <span>Discover Nearby Shops</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      
      {/* ==============================================================================
          STOREFRONT HEADER & BANNER
          ============================================================================== */}
      <div className="relative rounded-3xl overflow-hidden bg-white border border-cream-200 shadow-card">
        
        {/* Cover Banner */}
        <div className="relative h-48 sm:h-72 w-full bg-forest-900 overflow-hidden">
          <img
            src={shop.banner_url || 'https://images.unsplash.com/photo-1607344645866-009c320c5ab8?w=1200&auto=format&fit=crop&q=80'}
            alt={shop.name}
            className="w-full h-full object-cover opacity-85"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>

          {/* Share Action Buttons on Banner */}
          <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
            <button
              onClick={handleCopyLink}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-md text-forest-900 text-xs font-semibold hover:bg-white shadow-sm transition"
            >
              <Share2 className="w-3.5 h-3.5 text-forest-700" />
              <span>{copiedLink ? 'Link Copied!' : 'Copy Link'}</span>
            </button>
            <a
              href={getWhatsAppShareLink()}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#25D366] text-white text-xs font-semibold shadow-sm hover:opacity-95 transition"
            >
              <MessageCircle className="w-3.5 h-3.5 fill-white" />
              <span className="hidden sm:inline">Share on WhatsApp</span>
            </a>
          </div>
        </div>

        {/* Profile Card Overlay */}
        <div className="px-6 pb-6 pt-0 relative">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-12 sm:-mt-16 mb-4">
            
            <div className="flex items-end gap-4">
              {/* Logo */}
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl border-4 border-white bg-white shadow-lift overflow-hidden shrink-0">
                <img
                  src={shop.logo_url || 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=200&auto=format&fit=crop&q=80'}
                  alt={shop.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Title & Locality */}
              <div className="space-y-1 mb-1">
                <div className="flex items-center gap-2">
                  <h1 className="text-xl sm:text-3xl font-extrabold text-gray-900 font-display">
                    {shop.name}
                  </h1>
                  <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" title="Verified Dukaan" />
                </div>
                <p className="text-xs sm:text-sm text-gray-500 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>{shop.address || shop.locality}</span>
                </p>
              </div>
            </div>

            {/* Quick Actions (Direct Chat / Enquire) */}
            <div className="flex items-center gap-2">
              {shop.phone && (
                <a
                  href={getWhatsAppDirectChat()}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-bold shadow-sm transition"
                >
                  <MessageCircle className="w-4 h-4 fill-white" />
                  <span>Chat on WhatsApp</span>
                </a>
              )}
              <button
                onClick={() => {
                  setEnquiryProduct(null);
                  setIsEnquiryModalOpen(true);
                }}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-forest-900 hover:bg-forest-800 text-white text-xs font-semibold shadow-sm transition"
              >
                <Phone className="w-3.5 h-3.5 text-emerald-400" />
                <span>Contact Shop</span>
              </button>
            </div>

          </div>

          {/* Description & Metadata stats */}
          <div className="pt-2 border-t border-cream-200 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-gray-600">
            <div className="md:col-span-2 space-y-1">
              <span className="font-semibold text-gray-700 block">About Our Shop:</span>
              <p className="leading-relaxed">{shop.description}</p>
            </div>
            <div className="flex sm:justify-end items-center gap-4 text-xs">
              <div className="p-2.5 rounded-2xl bg-cream-50 border border-cream-200 text-center min-w-[80px]">
                <span className="block font-black text-sm text-forest-900">{products.length}</span>
                <span className="text-[10px] text-gray-400 uppercase font-semibold">Products</span>
              </div>
              <div className="p-2.5 rounded-2xl bg-cream-50 border border-cream-200 text-center min-w-[80px]">
                <span className="block font-black text-sm text-amber-600 flex items-center justify-center gap-0.5">
                  <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                  {shop.rating || 4.8}
                </span>
                <span className="text-[10px] text-gray-400 uppercase font-semibold">Rating</span>
              </div>
              {shop.established_year && (
                <div className="p-2.5 rounded-2xl bg-cream-50 border border-cream-200 text-center min-w-[80px]">
                  <span className="block font-black text-sm text-forest-900">Since {shop.established_year}</span>
                  <span className="text-[10px] text-gray-400 uppercase font-semibold">Heritage</span>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* ==============================================================================
          SHOP CATALOG BROWSER
          ============================================================================== */}
      <section className="space-y-6">
        
        {/* Search within shop + Category filter tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-cream-200 shadow-xs">
          
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {shopCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedShopCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize whitespace-nowrap transition ${
                  selectedShopCategory === cat
                    ? 'bg-forest-900 text-white'
                    : 'text-gray-600 hover:bg-cream-100'
                }`}
              >
                {cat === 'all' ? 'All Items' : cat}
              </button>
            ))}
          </div>

          {/* Search within shop */}
          <div className="relative sm:w-64">
            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder={`Search in ${shop.name}...`}
              value={searchInShop}
              onChange={(e) => setSearchInShop(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-cream-300 text-xs focus:outline-none focus:ring-2 focus:ring-forest-600 bg-cream-50/50"
            />
          </div>

        </div>

        {/* Product Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {filteredProducts.map((p) => (
              <ProductCard
                key={p.id}
                product={{
                  ...p,
                  shop_name: shop.name,
                  shop_slug: shop.slug,
                  shop_locality: shop.locality,
                  shop_phone: shop.phone,
                }}
                onQuickEnquire={(prod) => {
                  setEnquiryProduct(prod);
                  setIsEnquiryModalOpen(true);
                }}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 px-4 bg-white rounded-3xl border border-cream-200 space-y-3">
            <ShoppingBag className="w-12 h-12 text-gray-400 mx-auto" />
            <h3 className="text-base font-bold text-gray-900 font-display">
              No products found in this category
            </h3>
            <p className="text-xs text-gray-500">
              Try searching with different terms or select "All Items".
            </p>
            <button
              onClick={() => { setSearchInShop(''); setSelectedShopCategory('all'); }}
              className="px-4 py-2 rounded-xl bg-forest-900 text-white text-xs font-semibold"
            >
              Show All Products
            </button>
          </div>
        )}

      </section>

      {/* Enquiry Modal */}
      <EnquiryModal
        shop={shop}
        product={enquiryProduct}
        isOpen={isEnquiryModalOpen}
        onClose={() => setIsEnquiryModalOpen(false)}
      />

    </div>
  );
}

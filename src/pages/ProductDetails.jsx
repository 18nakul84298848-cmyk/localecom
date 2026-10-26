// ==============================================================================
// DukaanConnect: Dedicated Product Details Page
// Image gallery, pricing, specs, shop info, related products, and view tracking
// ==============================================================================

import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  MapPin, 
  Store, 
  MessageCircle, 
  ShieldCheck, 
  Star, 
  ArrowLeft, 
  Share2, 
  Clock, 
  Package, 
  Truck, 
  CheckCircle2, 
  AlertCircle,
  ExternalLink,
  Phone
} from 'lucide-react';
import { productsService } from '../services/products';
import { analyticsService } from '../services/analytics';
import { formatINR } from '../data/demoData';
import EnquiryModal from '../components/marketplace/EnquiryModal';
import ProductCard from '../components/marketplace/ProductCard';

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [selectedImage, setSelectedImage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Enquiry modal & copy share feedback
  const [isEnquiryModalOpen, setIsEnquiryModalOpen] = useState(false);
  const [copiedShare, setCopiedShare] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await productsService.getProductById(id);

        if (!data) {
          setError('Product not found or has been removed by the seller.');
          return;
        }

        setProduct(data);
        setSelectedImage(data.images?.[0] || '');

        // Record genuine view event in analytics
        if (data.id && data.shop_id) {
          analyticsService.recordProductView(data.id, data.shop_id);
        }

        // Fetch related products
        const related = await productsService.getProducts({
          category: data.category,
        });
        setRelatedProducts(related.filter(p => p.id !== data.id).slice(0, 4));
      } catch (err) {
        console.error('Error fetching product details:', err);
        setError('Failed to load product details.');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
    window.scrollTo(0, 0);
  }, [id]);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2500);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="aspect-square rounded-3xl bg-cream-100 animate-shimmer"></div>
          <div className="space-y-4">
            <div className="h-6 w-32 bg-cream-200 rounded-lg animate-pulse"></div>
            <div className="h-10 w-3/4 bg-cream-200 rounded-xl animate-pulse"></div>
            <div className="h-8 w-40 bg-cream-200 rounded-lg animate-pulse"></div>
            <div className="h-32 w-full bg-cream-100 rounded-2xl animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 font-display">Listing Unavailable</h2>
        <p className="text-sm text-gray-500">{error || 'This product does not exist.'}</p>
        <Link
          to="/explore"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-forest-900 text-white text-xs font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Marketplace</span>
        </Link>
      </div>
    );
  }

  const isOutOfStock = product.stock <= 0;
  const isInactive = product.is_active === false;

  const discountPercent = product.original_price && product.original_price > product.price
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : null;

  // Direct WhatsApp chat link
  const getWhatsAppLink = () => {
    if (!product.shop_phone) return null;
    const cleanPhone = product.shop_phone.replace(/[^0-9]/g, '');
    const text = encodeURIComponent(
      `Namaste ${product.shop_name}!\nI am interested in buying "${product.title}" listed for ${formatINR(product.price)} on DukaanConnect.\nListing link: ${window.location.href}`
    );
    return `https://wa.me/${cleanPhone.startsWith('91') ? cleanPhone : '91' + cleanPhone}?text=${text}`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      
      {/* Back button & Breadcrumbs */}
      <div className="flex items-center justify-between text-xs text-gray-500">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 font-semibold text-gray-700 hover:text-forest-900 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-cream-300 hover:bg-cream-100 text-gray-700 font-medium transition"
          >
            <Share2 className="w-3.5 h-3.5 text-forest-700" />
            <span>{copiedShare ? 'Link Copied!' : 'Share Product'}</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Gallery + Product Buy Box */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        
        {/* ==============================================================================
            IMAGE GALLERY (5 Cols)
            ============================================================================== */}
        <div className="lg:col-span-6 space-y-4">
          {/* Main Large Image */}
          <div className="relative aspect-square rounded-3xl overflow-hidden bg-cream-100 border border-cream-200 shadow-card">
            <img
              src={selectedImage || product.images?.[0]}
              alt={product.title}
              className="w-full h-full object-cover object-center"
            />
            {discountPercent && (
              <span className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold bg-amber-500 text-white shadow-md">
                {discountPercent}% OFF
              </span>
            )}
            {isInactive && (
              <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
                <span className="px-4 py-2 rounded-2xl bg-rose-600 text-white font-bold text-sm">
                  Listing Currently Inactive
                </span>
              </div>
            )}
          </div>

          {/* Alternate Thumbnails */}
          {product.images && product.images.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-1">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`w-16 h-16 rounded-2xl overflow-hidden border-2 shrink-0 transition ${
                    selectedImage === img ? 'border-forest-700 shadow-sm' : 'border-cream-300 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ==============================================================================
            DETAILS & BUY BOX (6 Cols)
            ============================================================================== */}
        <div className="lg:col-span-6 space-y-6">
          
          <div className="space-y-2">
            {/* Category & Locality */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-forest-100 text-forest-800">
                {product.category}
              </span>
              {product.shop_locality && (
                <span className="flex items-center gap-1 text-xs text-gray-500 bg-cream-100 px-2.5 py-0.5 rounded-full border border-cream-200">
                  <MapPin className="w-3 h-3 text-emerald-600" />
                  <span>{product.shop_locality}</span>
                </span>
              )}
            </div>

            {/* Product Title */}
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 font-display leading-tight">
              {product.title}
            </h1>
          </div>

          {/* Price & Stock Availability */}
          <div className="p-4 sm:p-5 rounded-3xl bg-cream-100/70 border border-cream-200 space-y-2">
            <div className="flex items-baseline gap-3">
              <span className="text-3xl sm:text-4xl font-black text-forest-900 font-display">
                {formatINR(product.price)}
              </span>
              {product.original_price && product.original_price > product.price && (
                <span className="text-base text-gray-400 line-through">
                  {formatINR(product.original_price)}
                </span>
              )}
            </div>

            {/* Stock indicator */}
            <div className="flex items-center gap-2 pt-1 text-xs font-medium">
              {isInactive ? (
                <span className="text-rose-600 font-bold">Unlisted by shopkeeper</span>
              ) : isOutOfStock ? (
                <span className="text-rose-600 font-bold flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  Currently Out of Stock
                </span>
              ) : product.stock <= 5 ? (
                <span className="text-amber-700 font-bold flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  Hurry! Only {product.stock} units left at the shop
                </span>
              ) : (
                <span className="text-emerald-700 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  In Stock ({product.stock} units ready for immediate pickup)
                </span>
              )}
            </div>
          </div>

          {/* Action CTAs */}
          <div className="space-y-3 pt-2">
            {isOutOfStock || isInactive ? (
              <div className="p-3.5 rounded-2xl bg-gray-100 text-gray-500 text-xs text-center font-medium">
                This item is currently unavailable for purchase or enquiry.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setIsEnquiryModalOpen(true)}
                  className="w-full py-3.5 px-4 rounded-2xl bg-forest-900 hover:bg-forest-800 text-white font-bold text-sm shadow-md transition flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-300" />
                  <span>Send Product Enquiry</span>
                </button>

                {product.shop_phone && (
                  <a
                    href={getWhatsAppLink()}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-3.5 px-4 rounded-2xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-sm shadow-md transition flex items-center justify-center gap-2"
                  >
                    <MessageCircle className="w-4 h-4 fill-white" />
                    <span>Chat on WhatsApp</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            )}
            <p className="text-[11px] text-gray-500 text-center">
              Direct transaction with shopkeeper. Zero platform middleman fees.
            </p>
          </div>

          {/* Description */}
          <div className="space-y-2 pt-4 border-t border-cream-200">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
              Product Story & Details
            </h3>
            <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
              {product.description}
            </p>
          </div>

          {/* Specifications Table */}
          {product.specifications && Object.keys(product.specifications).length > 0 && (
            <div className="space-y-2 pt-4 border-t border-cream-200">
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
                Specifications
              </h3>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {Object.entries(product.specifications).map(([key, value]) => (
                  <div key={key} className="p-2.5 rounded-xl bg-cream-50 border border-cream-200">
                    <span className="text-gray-400 block text-[10px] uppercase font-semibold">{key}</span>
                    <span className="font-semibold text-gray-800">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Shop Card */}
          <div className="p-5 rounded-3xl bg-white border border-cream-200 shadow-card space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-forest-800">
                Sold By Certified Local Dukaan
              </span>
              <span className="flex items-center gap-1 text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                <span>{product.shop_rating || 4.8} Rating</span>
              </span>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-forest-900 text-white flex items-center justify-center font-bold text-base shrink-0 overflow-hidden">
                {product.shop_logo ? (
                  <img src={product.shop_logo} alt="" className="w-full h-full object-cover" />
                ) : (
                  <Store className="w-6 h-6 text-emerald-400" />
                )}
              </div>
              <div className="space-y-0.5 min-w-0 flex-1">
                <h4 className="font-bold text-gray-900 text-base font-display truncate">
                  {product.shop_name}
                </h4>
                <p className="text-xs text-gray-500 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span className="truncate">{product.shop_address || product.shop_locality}</span>
                </p>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between border-t border-cream-200 text-xs">
              {product.shop_phone && (
                <span className="text-gray-600 flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-gray-400" />
                  <span>{product.shop_phone}</span>
                </span>
              )}
              {product.shop_slug && (
                <Link
                  to={`/shop/${product.shop_slug}`}
                  className="font-semibold text-forest-800 hover:text-forest-950 flex items-center gap-1 ml-auto"
                >
                  <span>Visit Shop Storefront</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              )}
            </div>
          </div>

        </div>

      </div>

      {/* ==============================================================================
          RELATED PRODUCTS
          ============================================================================== */}
      {relatedProducts.length > 0 && (
        <section className="pt-10 border-t border-cream-200 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 font-display">
                More from {product.category}
              </h2>
              <p className="text-xs sm:text-sm text-gray-500">
                Handpicked items you might also like
              </p>
            </div>
            <Link
              to={`/explore?category=${product.category}`}
              className="text-xs sm:text-sm font-semibold text-forest-800 hover:underline"
            >
              View All
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
            {relatedProducts.map((rel) => (
              <ProductCard
                key={rel.id}
                product={rel}
                onQuickEnquire={() => {
                  setProduct(rel);
                  setIsEnquiryModalOpen(true);
                }}
              />
            ))}
          </div>
        </section>
      )}

      {/* Enquiry Modal */}
      <EnquiryModal
        product={product}
        isOpen={isEnquiryModalOpen}
        onClose={() => setIsEnquiryModalOpen(false)}
      />

    </div>
  );
}

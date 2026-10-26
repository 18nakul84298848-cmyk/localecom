// ==============================================================================
// DukaanConnect: Homepage / Marketplace
// ==============================================================================

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Search, 
  MapPin, 
  Store, 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  TrendingUp, 
  ShoppingBag, 
  Truck, 
  HeartHandshake, 
  Clock, 
  MessageSquareQuote,
  Star,
  Users
} from 'lucide-react';
import { productsService } from '../services/products';
import { shopsService } from '../services/shops';
import { LOCALITIES, CATEGORIES } from '../data/demoData';
import ProductCard from '../components/marketplace/ProductCard';
import ShopCard from '../components/marketplace/ShopCard';
import CategoryFilterBar from '../components/marketplace/CategoryFilterBar';
import EnquiryModal from '../components/marketplace/EnquiryModal';

export default function Home() {
  const navigate = useNavigate();

  // Search & Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocality, setSelectedLocality] = useState('All Localities');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Data State
  const [trendingProducts, setTrendingProducts] = useState([]);
  const [featuredShops, setFeaturedShops] = useState([]);
  const [loading, setLoading] = useState(true);

  // Quick Enquiry Modal State
  const [enquiryProduct, setEnquiryProduct] = useState(null);
  const [isEnquiryModalOpen, setIsEnquiryModalOpen] = useState(false);

  useEffect(() => {
    const loadMarketplaceData = async () => {
      try {
        setLoading(true);
        const [productsData, shopsData] = await Promise.all([
          productsService.getProducts({
            category: selectedCategory,
            locality: selectedLocality,
            search: searchQuery,
          }),
          shopsService.getShops({
            locality: selectedLocality !== 'All Localities' ? selectedLocality : null,
          }),
        ]);

        setTrendingProducts(productsData.slice(0, 8));
        setFeaturedShops(shopsData.slice(0, 4));
      } catch (err) {
        console.error('Error loading homepage data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadMarketplaceData();
  }, [selectedCategory, selectedLocality]);

  const handleHeroSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery.trim()) params.append('q', searchQuery.trim());
    if (selectedLocality !== 'All Localities') params.append('locality', selectedLocality);
    if (selectedCategory !== 'all') params.append('category', selectedCategory);
    navigate(`/explore?${params.toString()}`);
  };

  const handleQuickEnquire = (product) => {
    setEnquiryProduct(product);
    setIsEnquiryModalOpen(true);
  };

  return (
    <div className="space-y-16 sm:space-y-24">
      
      {/* ==============================================================================
          HERO SECTION
          ============================================================================== */}
      <section className="relative overflow-hidden pt-8 sm:pt-14 pb-12 sm:pb-20 bg-gradient-to-b from-cream-100/80 via-cream-50 to-white border-b border-cream-200">
        {/* Background Subtle Ambient Glow */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-forest-200/30 rounded-full blur-3xl pointer-events-none -z-10"></div>
        <div className="absolute top-1/2 left-10 w-72 h-72 bg-amber-200/20 rounded-full blur-3xl pointer-events-none -z-10"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-5">
            
            {/* Tagline Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-forest-100 border border-forest-200 text-forest-900 text-xs sm:text-sm font-semibold shadow-xs">
              <Sparkles className="w-4 h-4 text-emerald-600 animate-pulse" />
              <span>Empowering Local Indian Retailers With AI Storefronts</span>
            </div>

            {/* Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-gray-900 tracking-tight leading-[1.15] font-display">
              Shop Authentic Products From Trusted{' '}
              <span className="text-forest-700 underline decoration-amber-400 decoration-wavy decoration-2">
                Local Dukaans
              </span>
            </h1>

            {/* Subheading */}
            <p className="text-base sm:text-lg text-gray-600 leading-relaxed max-w-2xl mx-auto font-normal">
              Support neighbourhood shopkeepers in your city. Discover handcrafted silks, stone-ground spices, artisan pottery, and gadgets with same-day local pickup and direct WhatsApp enquiry.
            </p>

            {/* Central Search & Locality Filter Card */}
            <form
              onSubmit={handleHeroSearch}
              className="mt-8 p-2.5 sm:p-3 rounded-3xl bg-white border border-cream-300 shadow-lift flex flex-col sm:flex-row items-center gap-2 max-w-2xl mx-auto text-left"
            >
              {/* Keyword Search Input */}
              <div className="flex items-center gap-2.5 px-3 py-2 flex-grow w-full border-b sm:border-b-0 sm:border-r border-cream-200">
                <Search className="w-5 h-5 text-gray-400 shrink-0" />
                <input
                  type="text"
                  placeholder="Search spices, Banarasi sarees, terracotta, chargers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full text-sm text-gray-800 placeholder-gray-400 focus:outline-none bg-transparent"
                />
              </div>

              {/* Locality Selector */}
              <div className="flex items-center gap-2 px-3 py-2 w-full sm:w-auto shrink-0">
                <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
                <select
                  value={selectedLocality}
                  onChange={(e) => setSelectedLocality(e.target.value)}
                  className="text-xs sm:text-sm font-medium text-gray-700 bg-transparent focus:outline-none cursor-pointer w-full sm:w-44 truncate"
                >
                  {LOCALITIES.map((loc) => (
                    <option key={loc} value={loc}>
                      {loc}
                    </option>
                  ))}
                </select>
              </div>

              {/* Search Action Button */}
              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-forest-900 hover:bg-forest-800 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-sm transition shrink-0"
              >
                <span>Find Near Me</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Trust Highlights */}
            <div className="pt-4 flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-xs font-medium text-gray-500">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Verified Local Shops
              </span>
              <span className="flex items-center gap-1.5">
                <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                4.8★ Average Customer Rating
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-forest-700" />
                Direct WhatsApp Response
              </span>
            </div>

          </div>
        </div>
      </section>

      {/* ==============================================================================
          CATEGORY CAROUSEL / FILTER BAR
          ============================================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 font-display">
              Browse by Category
            </h2>
            <p className="text-xs sm:text-sm text-gray-500">
              Curated collections from neighbourhood retailers
            </p>
          </div>
          <Link
            to="/explore"
            className="text-xs sm:text-sm font-semibold text-forest-800 hover:text-forest-950 flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <CategoryFilterBar
          selectedCategory={selectedCategory}
          onSelectCategory={(catId) => setSelectedCategory(catId)}
        />
      </section>

      {/* ==============================================================================
          FEATURED LOCAL SHOPS
          ============================================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1 rounded-lg bg-forest-100 text-forest-800">
                <Store className="w-4 h-4" />
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-forest-800">
                Neighbourhood Heroes
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1 font-display">
              Featured Local Dukaans
            </h2>
            <p className="text-sm text-gray-500">
              Family-owned retailers bringing authenticity and generations of trust
            </p>
          </div>

          <Link
            to="/shops"
            className="text-sm font-semibold text-forest-800 hover:text-forest-950 flex items-center gap-1 self-start sm:self-auto"
          >
            <span>Discover All Shops</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Shops Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredShops.map((shop) => (
            <ShopCard key={shop.id} shop={shop} />
          ))}
        </div>
      </section>

      {/* ==============================================================================
          TRENDING PRODUCTS SECTION
          ============================================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1 rounded-lg bg-amber-100 text-amber-800">
                <TrendingUp className="w-4 h-4 text-amber-600" />
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-forest-800">
                Trending in Your City
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1 font-display">
              Popular Local Discoveries
            </h2>
            <p className="text-sm text-gray-500">
              {selectedCategory !== 'all' ? `Showing ${selectedCategory} products` : 'Fresh arrivals and bestsellers from nearby storefronts'}
            </p>
          </div>

          <Link
            to={`/explore?category=${selectedCategory}`}
            className="text-sm font-semibold text-forest-800 hover:text-forest-950 flex items-center gap-1 self-start sm:self-auto"
          >
            <span>Browse Full Catalog</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
              <div key={n} className="rounded-2xl bg-cream-100 animate-shimmer aspect-square"></div>
            ))}
          </div>
        ) : trendingProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {trendingProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onQuickEnquire={handleQuickEnquire}
              />
            ))}
          </div>
        ) : (
          <div className="p-12 text-center rounded-3xl bg-white border border-cream-200">
            <ShoppingBag className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-gray-800">No products found in this category</h3>
            <p className="text-sm text-gray-500 mt-1">Try selecting 'All Categories' or exploring other localities.</p>
            <button
              onClick={() => { setSelectedCategory('all'); setSelectedLocality('All Localities'); }}
              className="mt-4 px-4 py-2 rounded-xl bg-forest-900 text-white text-xs font-semibold"
            >
              Reset Filters
            </button>
          </div>
        )}
      </section>

      {/* ==============================================================================
          WHY BUY LOCAL? BENEFITS SECTION
          ============================================================================== */}
      <section className="bg-forest-900 text-white py-16 sm:py-20 my-10 rounded-3xl mx-4 sm:mx-6 lg:mx-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-forest-800 text-emerald-300 border border-forest-700">
              The Dukaan Advantage
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold font-display">
              Why Shopping Local Beats Big Tech Marketplaces
            </h2>
            <p className="text-sm sm:text-base text-cream-200">
              When you buy through DukaanConnect, your money stays within your neighbourhood economy.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            <div className="p-6 rounded-2xl bg-forest-950/60 border border-forest-800/80 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-forest-800 flex items-center justify-center text-emerald-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base font-display">Genuine & Handcrafted</h3>
              <p className="text-xs text-cream-300 leading-relaxed">
                Direct from the craftsman or heritage grocer. Zero counterfeit knockoffs or mystery warehouse lots.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-forest-950/60 border border-forest-800/80 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-forest-800 flex items-center justify-center text-emerald-400">
                <Truck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base font-display">Same-Day Pickup or Delivery</h3>
              <p className="text-xs text-cream-300 leading-relaxed">
                Skip waiting 3 to 5 business days. Walk into your local market or get it delivered within hours.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-forest-950/60 border border-forest-800/80 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-forest-800 flex items-center justify-center text-emerald-400">
                <MessageSquareQuote className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base font-display">Direct WhatsApp Chat</h3>
              <p className="text-xs text-cream-300 leading-relaxed">
                Speak with the actual shop owner. Request size adjustments, live video clips of fabrics, or bulk rates.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-forest-950/60 border border-forest-800/80 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-forest-800 flex items-center justify-center text-emerald-400">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base font-display">100% Retained by Retailer</h3>
              <p className="text-xs text-cream-300 leading-relaxed">
                We charge zero predatory commission cuts on customer enquiries. Your local retailer prospers directly.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* ==============================================================================
          SELLER ONBOARDING CALL TO ACTION
          ============================================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-forest-800 via-forest-900 to-forest-950 text-white p-8 sm:p-14 shadow-lift border border-forest-800">
          <div className="relative z-10 max-w-2xl space-y-4">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500 text-forest-950 uppercase tracking-wider inline-block">
              For Shopkeepers & Retailers
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold font-display leading-tight">
              Create Your Digital Dukaan In 2 Minutes with AI
            </h2>
            <p className="text-sm sm:text-base text-cream-200 leading-relaxed">
              Don't lose your neighborhood customers to e-commerce monopolies. DukaanConnect gives you a shareable storefront, intelligent AI product descriptions, and direct WhatsApp customer leads.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <Link
                to="/seller/onboarding"
                className="px-6 py-3.5 rounded-2xl bg-white hover:bg-cream-100 text-forest-900 font-bold text-sm shadow-md transition flex items-center gap-2"
              >
                <Store className="w-4 h-4 text-forest-700" />
                <span>Launch Your Dukaan Free</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/seller/ai-assistant"
                className="px-5 py-3.5 rounded-2xl bg-forest-800/80 hover:bg-forest-700 border border-forest-600 text-white font-semibold text-sm transition flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Try AI Listing Generator</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Enquiry Modal */}
      <EnquiryModal
        product={enquiryProduct}
        isOpen={isEnquiryModalOpen}
        onClose={() => setIsEnquiryModalOpen(false)}
      />

    </div>
  );
}

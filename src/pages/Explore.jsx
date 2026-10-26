// ==============================================================================
// DukaanConnect: Explore / Full Catalog Page
// Multi-facet filtering (Search, Category, Locality, Price, Stock, Sorting)
// ==============================================================================

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  MapPin, 
  ArrowUpDown, 
  SlidersHorizontal, 
  X, 
  ShoppingBag,
  Sparkles,
  Check
} from 'lucide-react';
import { productsService } from '../services/products';
import { CATEGORIES, LOCALITIES, formatINR } from '../data/demoData';
import ProductCard from '../components/marketplace/ProductCard';
import EnquiryModal from '../components/marketplace/EnquiryModal';

export default function Explore() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Filter states initialized from URL or defaults
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all');
  const [selectedLocality, setSelectedLocality] = useState(searchParams.get('locality') || 'All Localities');
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'newest');
  const [minPrice, setMinPrice] = useState(searchParams.get('min') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('max') || '');
  const [inStockOnly, setInStockOnly] = useState(searchParams.get('instock') === 'true');

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Enquiry Modal
  const [enquiryProduct, setEnquiryProduct] = useState(null);
  const [isEnquiryModalOpen, setIsEnquiryModalOpen] = useState(false);

  // Sync state to URL and fetch products
  useEffect(() => {
    const fetchFilteredProducts = async () => {
      try {
        setLoading(true);
        const data = await productsService.getProducts({
          category: selectedCategory,
          locality: selectedLocality,
          search: searchQuery,
          sort: sortBy,
          minPrice: minPrice !== '' ? Number(minPrice) : null,
          maxPrice: maxPrice !== '' ? Number(maxPrice) : null,
          inStockOnly,
        });
        setProducts(data);
      } catch (err) {
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFilteredProducts();
  }, [searchQuery, selectedCategory, selectedLocality, sortBy, minPrice, maxPrice, inStockOnly]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedLocality('All Localities');
    setSortBy('newest');
    setMinPrice('');
    setMaxPrice('');
    setInStockOnly(false);
    setSearchParams({});
  };

  const hasActiveFilters = 
    searchQuery || 
    selectedCategory !== 'all' || 
    selectedLocality !== 'All Localities' || 
    minPrice || 
    maxPrice || 
    inStockOnly;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Header & Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-cream-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 font-display">
            Explore Local Products
          </h1>
          <p className="text-xs sm:text-sm text-gray-500">
            Browse genuine products from certified neighborhood retail stores across India.
          </p>
        </div>

        {/* Results Counter and Mobile Filter Toggle */}
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-cream-100 text-gray-700 border border-cream-200">
            {products.length} {products.length === 1 ? 'Product found' : 'Products found'}
          </span>
          <button
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            className="sm:hidden flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-forest-900 text-white text-xs font-semibold"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Filters</span>
          </button>
        </div>
      </div>

      {/* Main Layout: Filters Sidebar + Products Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* ==============================================================================
            FILTERS SIDEBAR (Desktop + Mobile Drawer)
            ============================================================================== */}
        <aside className={`lg:block ${mobileFilterOpen ? 'block' : 'hidden'} lg:col-span-1 space-y-6 bg-white p-5 rounded-3xl border border-cream-200 shadow-card h-fit`}>
          
          <div className="flex items-center justify-between pb-3 border-b border-cream-200">
            <span className="font-bold text-sm text-gray-900 flex items-center gap-2">
              <Filter className="w-4 h-4 text-forest-700" />
              Filter Products
            </span>
            {hasActiveFilters && (
              <button
                onClick={handleResetFilters}
                className="text-xs font-semibold text-rose-600 hover:underline"
              >
                Reset All
              </button>
            )}
          </div>

          {/* Search Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-700">Keyword Search</label>
            <div className="relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-cream-300 text-xs focus:outline-none focus:ring-2 focus:ring-forest-600 bg-cream-50/50"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-2.5 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Category Filter */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-700">Category</label>
            <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`w-full flex items-center justify-between px-3 py-1.5 rounded-xl text-xs transition ${
                    selectedCategory === cat.id
                      ? 'bg-forest-100 text-forest-900 font-bold'
                      : 'text-gray-600 hover:bg-cream-100 font-medium'
                  }`}
                >
                  <span>{cat.name}</span>
                  {selectedCategory === cat.id && <Check className="w-3.5 h-3.5 text-forest-700" />}
                </button>
              ))}
            </div>
          </div>

          {/* Locality Filter */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-700">Shop Locality</label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-emerald-600 absolute left-3 top-2.5 pointer-events-none" />
              <select
                value={selectedLocality}
                onChange={(e) => setSelectedLocality(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-cream-300 text-xs font-medium text-gray-700 bg-cream-50/50 focus:outline-none focus:ring-2 focus:ring-forest-600"
              >
                {LOCALITIES.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Price Range Filter */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-gray-700">Price Range (₹)</label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                placeholder="Min ₹"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl border border-cream-300 text-xs focus:outline-none focus:ring-2 focus:ring-forest-600"
              />
              <input
                type="number"
                placeholder="Max ₹"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl border border-cream-300 text-xs focus:outline-none focus:ring-2 focus:ring-forest-600"
              />
            </div>
          </div>

          {/* Stock Availability Toggle */}
          <div className="pt-2 border-t border-cream-200">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="rounded text-forest-700 focus:ring-forest-600 h-4 w-4"
              />
              <span className="text-xs font-semibold text-gray-700">Only in-stock items</span>
            </label>
          </div>

        </aside>

        {/* ==============================================================================
            PRODUCTS GRID & SORTING
            ============================================================================== */}
        <main className="lg:col-span-3 space-y-6">
          
          {/* Top Sort Bar & Active Badges */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-cream-200 shadow-xs">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-gray-400 font-medium">Active filters:</span>
              {selectedCategory !== 'all' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-forest-50 text-forest-800 border border-forest-200">
                  {selectedCategory}
                  <button onClick={() => setSelectedCategory('all')}>
                    <X className="w-3 h-3 text-forest-700" />
                  </button>
                </span>
              )}
              {selectedLocality !== 'All Localities' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                  {selectedLocality.split(',')[0]}
                  <button onClick={() => setSelectedLocality('All Localities')}>
                    <X className="w-3 h-3 text-emerald-700" />
                  </button>
                </span>
              )}
              {inStockOnly && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                  In Stock Only
                  <button onClick={() => setInStockOnly(false)}>
                    <X className="w-3 h-3 text-amber-700" />
                  </button>
                </span>
              )}
              {!hasActiveFilters && (
                <span className="text-xs text-gray-500 italic">None (showing all)</span>
              )}
            </div>

            {/* Sorting Dropdown */}
            <div className="flex items-center gap-2 ml-auto">
              <ArrowUpDown className="w-3.5 h-3.5 text-gray-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="text-xs font-semibold text-gray-700 bg-transparent focus:outline-none cursor-pointer"
              >
                <option value="newest">Sort: Recently Added</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Products Grid */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div key={n} className="rounded-2xl bg-cream-100 animate-shimmer h-80"></div>
              ))}
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onQuickEnquire={(p) => {
                    setEnquiryProduct(p);
                    setIsEnquiryModalOpen(true);
                  }}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 px-4 bg-white rounded-3xl border border-cream-200 space-y-4">
              <div className="w-16 h-16 rounded-full bg-cream-100 text-gray-400 flex items-center justify-center mx-auto">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-gray-900 font-display">
                  No products matched your criteria
                </h3>
                <p className="text-xs text-gray-500 max-w-sm mx-auto">
                  Try clearing some filters or searching for more generic terms like "spices", "saree", or "charger".
                </p>
              </div>
              <button
                onClick={handleResetFilters}
                className="px-5 py-2.5 rounded-xl bg-forest-900 text-white text-xs font-semibold hover:bg-forest-800 transition"
              >
                Reset All Filters
              </button>
            </div>
          )}

        </main>
      </div>

      {/* Enquiry Modal */}
      <EnquiryModal
        product={enquiryProduct}
        isOpen={isEnquiryModalOpen}
        onClose={() => setIsEnquiryModalOpen(false)}
      />

    </div>
  );
}

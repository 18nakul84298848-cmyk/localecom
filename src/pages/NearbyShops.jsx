// ==============================================================================
// DukaanConnect: Nearby Shop Discovery (/shops)
// Locality-based shop browsing and verified store directories
// ==============================================================================

import React, { useState, useEffect } from 'react';
import { 
  Store, 
  MapPin, 
  Search, 
  Compass, 
  Info, 
  Check, 
  ShoppingBag,
  SlidersHorizontal
} from 'lucide-react';
import { shopsService } from '../services/shops';
import { LOCALITIES, CATEGORIES } from '../data/demoData';
import ShopCard from '../components/marketplace/ShopCard';

export default function NearbyShops() {
  const [selectedLocality, setSelectedLocality] = useState('All Localities');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchShops = async () => {
      try {
        setLoading(true);
        const data = await shopsService.getShops({
          locality: selectedLocality,
          category: selectedCategory,
          search: searchQuery,
        });
        setShops(data);
      } catch (err) {
        console.error('Error fetching shops:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchShops();
  }, [selectedLocality, selectedCategory, searchQuery]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Page Header */}
      <div className="space-y-3 max-w-2xl">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-forest-100 text-forest-800">
          <Compass className="w-3.5 h-3.5 text-forest-700" />
          <span>Local Commerce Discovery</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 font-display">
          Find Neighbourhood Dukaans
        </h1>
        <p className="text-sm text-gray-600 leading-relaxed">
          Locate trusted retail shopkeepers in your area. Browse by municipal market, bazaar, or locality to pick up orders directly or request local delivery.
        </p>

        {/* Privacy Note regarding GPS vs Locality */}
        <div className="p-3 rounded-2xl bg-cream-100 border border-cream-200 flex items-start gap-2.5 text-xs text-gray-600">
          <Info className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
          <span>
            <strong>Locality-Based Browsing:</strong> We protect your privacy by not requesting invasive GPS coordinates. Discovery is based on your chosen city bazaar or neighborhood locality.
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-white p-4 rounded-3xl border border-cream-200 shadow-card">
        
        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            placeholder="Search shops by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-cream-300 text-xs focus:outline-none focus:ring-2 focus:ring-forest-600 bg-cream-50/50"
          />
        </div>

        {/* Locality Selector */}
        <div className="relative">
          <MapPin className="w-4 h-4 text-emerald-600 absolute left-3.5 top-3.5 pointer-events-none" />
          <select
            value={selectedLocality}
            onChange={(e) => setSelectedLocality(e.target.value)}
            className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-cream-300 text-xs font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-forest-600 bg-cream-50/50 cursor-pointer"
          >
            {LOCALITIES.map((loc) => (
              <option key={loc} value={loc}>
                {loc}
              </option>
            ))}
          </select>
        </div>

        {/* Category Selector */}
        <div className="relative">
          <Store className="w-4 h-4 text-forest-700 absolute left-3.5 top-3.5 pointer-events-none" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-cream-300 text-xs font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-forest-600 bg-cream-50/50 cursor-pointer capitalize"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

      </div>

      {/* Shops Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="h-80 rounded-3xl bg-cream-100 animate-shimmer"></div>
          ))}
        </div>
      ) : shops.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {shops.map((shop) => (
            <ShopCard key={shop.id} shop={shop} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 px-4 bg-white rounded-3xl border border-cream-200 space-y-3">
          <Store className="w-12 h-12 text-gray-400 mx-auto" />
          <h3 className="text-base font-bold text-gray-900 font-display">
            No dukaans found in this area
          </h3>
          <p className="text-xs text-gray-500">
            Be the first retailer to register in this locality!
          </p>
          <button
            onClick={() => { setSelectedLocality('All Localities'); setSelectedCategory('all'); setSearchQuery(''); }}
            className="px-4 py-2 rounded-xl bg-forest-900 text-white text-xs font-semibold"
          >
            Show All Localities
          </button>
        </div>
      )}

    </div>
  );
}

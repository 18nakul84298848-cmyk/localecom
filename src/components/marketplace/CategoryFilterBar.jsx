// ==============================================================================
// DukaanConnect: Category Filter Bar Component
// ==============================================================================

import React from 'react';
import { 
  Store, 
  ShoppingBag, 
  Shirt, 
  Sparkles, 
  Smartphone, 
  Footprints, 
  BookOpen 
} from 'lucide-react';
import { CATEGORIES } from '../../data/demoData';

const ICON_MAP = {
  Store,
  ShoppingBag,
  Shirt,
  Sparkles,
  Smartphone,
  Footprints,
  BookOpen,
};

export default function CategoryFilterBar({ selectedCategory, onSelectCategory }) {
  return (
    <div className="w-full overflow-x-auto no-scrollbar py-2">
      <div className="flex items-center gap-2.5 min-w-max pb-1">
        {CATEGORIES.map((cat) => {
          const Icon = ICON_MAP[cat.icon] || Store;
          const isSelected = selectedCategory === cat.id;

          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold transition-all duration-200 border ${
                isSelected
                  ? 'bg-forest-900 text-white border-forest-900 shadow-sm'
                  : 'bg-white text-gray-700 border-cream-300 hover:border-forest-300 hover:bg-forest-50/50'
              }`}
            >
              <Icon className={`w-4 h-4 ${isSelected ? 'text-emerald-400' : 'text-forest-700'}`} />
              <span>{cat.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

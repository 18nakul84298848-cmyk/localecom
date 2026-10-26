// ==============================================================================
// DukaanConnect: Local Demo Persistence Store
// Ensures seamless interactive hackathon demonstrations when Supabase is not connected
// ==============================================================================

import { INITIAL_SHOPS, INITIAL_PRODUCTS, INITIAL_ENQUIRIES } from '../data/demoData';

const STORAGE_KEYS = {
  SHOPS: 'dukaan_demo_shops_v1',
  PRODUCTS: 'dukaan_demo_products_v1',
  ENQUIRIES: 'dukaan_demo_enquiries_v1',
  VIEWS: 'dukaan_demo_views_v1',
  USER: 'dukaan_demo_user_v1',
};

// Initialize localStorage with demo data if empty
export const initDemoStorage = () => {
  if (typeof window === 'undefined') return;

  if (!localStorage.getItem(STORAGE_KEYS.SHOPS)) {
    localStorage.setItem(STORAGE_KEYS.SHOPS, JSON.stringify(INITIAL_SHOPS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.PRODUCTS)) {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(INITIAL_PRODUCTS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.ENQUIRIES)) {
    localStorage.setItem(STORAGE_KEYS.ENQUIRIES, JSON.stringify(INITIAL_ENQUIRIES));
  }
  if (!localStorage.getItem(STORAGE_KEYS.VIEWS)) {
    const defaultViews = [
      { product_id: 'prod-1', shop_id: 'shop-1', count: 184 },
      { product_id: 'prod-2', shop_id: 'shop-1', count: 96 },
      { product_id: 'prod-3', shop_id: 'shop-1', count: 142 },
      { product_id: 'prod-4', shop_id: 'shop-2', count: 320 },
      { product_id: 'prod-5', shop_id: 'shop-2', count: 115 },
      { product_id: 'prod-6', shop_id: 'shop-3', count: 210 },
      { product_id: 'prod-7', shop_id: 'shop-3', count: 88 },
      { product_id: 'prod-8', shop_id: 'shop-4', count: 425 },
      { product_id: 'prod-9', shop_id: 'shop-4', count: 290 },
    ];
    localStorage.setItem(STORAGE_KEYS.VIEWS, JSON.stringify(defaultViews));
  }
};

export const getDemoData = (key) => {
  initDemoStorage();
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error('Failed to parse demo data from storage:', e);
    return [];
  }
};

export const setDemoData = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to save demo data to storage:', e);
  }
};

export { STORAGE_KEYS };

// ==============================================================================
// DukaanConnect: Shops Service
// Fetching, creating, updating public and seller storefronts
// ==============================================================================

import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { STORAGE_KEYS, getDemoData, setDemoData } from './storageHelper';

export const shopsService = {
  // Fetch active shops with optional filters
  async getShops({ category, locality, search } = {}) {
    if (isSupabaseConfigured && supabase) {
      let query = supabase
        .from('shops')
        .select('*')
        .eq('is_active', true)
        .order('rating', { ascending: false });

      if (category && category !== 'all') {
        query = query.eq('category', category);
      }
      if (locality && locality !== 'All Localities') {
        query = query.ilike('locality', `%${locality}%`);
      }
      if (search) {
        query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%,locality.ilike.%${search}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    }

    // Demo Mode
    let shops = getDemoData(STORAGE_KEYS.SHOPS).filter(s => s.is_active);

    if (category && category !== 'all') {
      shops = shops.filter(s => s.category === category);
    }
    if (locality && locality !== 'All Localities') {
      shops = shops.filter(s => s.locality.toLowerCase().includes(locality.toLowerCase()));
    }
    if (search) {
      const q = search.toLowerCase();
      shops = shops.filter(s =>
        s.name.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q) ||
        s.locality.toLowerCase().includes(q)
      );
    }
    return shops;
  },

  // Get single shop by unique slug
  async getShopBySlug(slug) {
    if (!slug) return null;

    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('shops')
        .select('*')
        .eq('slug', slug)
        .eq('is_active', true)
        .single();
      if (error) {
        if (error.code === 'PGRST116') return null; // not found
        throw error;
      }
      return data;
    }

    const shops = getDemoData(STORAGE_KEYS.SHOPS);
    return shops.find(s => s.slug.toLowerCase() === slug.toLowerCase() && s.is_active) || null;
  },

  // Get shop owned by a specific seller
  async getShopByOwnerId(ownerId) {
    if (!ownerId) return null;

    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('shops')
        .select('*')
        .eq('owner_id', ownerId)
        .maybeSingle();
      if (error) throw error;
      return data;
    }

    const shops = getDemoData(STORAGE_KEYS.SHOPS);
    return shops.find(s => s.owner_id === ownerId) || shops[0] || null;
  },

  // Create a new shop with unique slug validation
  async createShop(shopData) {
    const rawSlug = (shopData.slug || shopData.name || '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    const slug = rawSlug || `dukaan-${Date.now().toString().slice(-4)}`;

    if (isSupabaseConfigured && supabase) {
      // Check duplicate slug
      const { data: existing } = await supabase
        .from('shops')
        .select('id')
        .eq('slug', slug)
        .maybeSingle();

      if (existing) {
        throw new Error(`Shop URL slug "${slug}" is already taken. Please pick another unique name.`);
      }

      const { data, error } = await supabase
        .from('shops')
        .insert([{ ...shopData, slug, is_active: true }])
        .select()
        .single();
      if (error) throw error;
      return data;
    }

    // Demo Mode
    const shops = getDemoData(STORAGE_KEYS.SHOPS);
    if (shops.some(s => s.slug === slug)) {
      throw new Error(`Shop URL slug "${slug}" is already taken. Please choose another name.`);
    }

    const newShop = {
      id: `shop-${Date.now()}`,
      rating: 5.0,
      reviews_count: 1,
      is_active: true,
      ...shopData,
      slug,
      created_at: new Date().toISOString()
    };
    shops.push(newShop);
    setDemoData(STORAGE_KEYS.SHOPS, shops);
    return newShop;
  },

  // Update shop details
  async updateShop(shopId, updates) {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('shops')
        .update(updates)
        .eq('id', shopId)
        .select()
        .single();
      if (error) throw error;
      return data;
    }

    // Demo Mode
    const shops = getDemoData(STORAGE_KEYS.SHOPS);
    const index = shops.findIndex(s => s.id === shopId);
    if (index === -1) throw new Error('Shop not found');
    shops[index] = { ...shops[index], ...updates, updated_at: new Date().toISOString() };
    setDemoData(STORAGE_KEYS.SHOPS, shops);
    return shops[index];
  }
};

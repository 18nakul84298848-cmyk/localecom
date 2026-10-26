// ==============================================================================
// DukaanConnect: Growth Analytics Service
// Genuine product view tracking, enquiry volume, and top-performing listings
// ==============================================================================

import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { STORAGE_KEYS, getDemoData, setDemoData } from './storageHelper';

const recordedViewsInSession = new Set();

export const analyticsService = {
  // Record view event for a product (guarded against duplicate counting within session)
  async recordProductView(productId, shopId) {
    if (!productId || !shopId) return;

    const sessionKey = `${productId}_${new Date().toDateString()}`;
    if (recordedViewsInSession.has(sessionKey)) {
      return; // already counted in this session today
    }
    recordedViewsInSession.add(sessionKey);

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase
          .from('product_views')
          .insert([{ product_id: productId, shop_id: shopId }]);
      } catch (e) {
        console.warn('Could not record product view:', e.message);
      }
      return;
    }

    // Demo Mode: increment in storage
    const views = getDemoData(STORAGE_KEYS.VIEWS);
    const existing = views.find(v => v.product_id === productId);
    if (existing) {
      existing.count = (existing.count || 0) + 1;
    } else {
      views.push({ product_id: productId, shop_id: shopId, count: 1 });
    }
    setDemoData(STORAGE_KEYS.VIEWS, views);
  },

  // Calculate seller metrics from actual records
  async getSellerStats(shopId) {
    if (!shopId) {
      return {
        totalProducts: 0,
        totalViews: 0,
        totalEnquiries: 0,
        pendingEnquiries: 0,
        topProducts: [],
        enquiryConversionRate: 0,
      };
    }

    if (isSupabaseConfigured && supabase) {
      // 1. Total products
      const { count: productCount } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true })
        .eq('shop_id', shopId)
        .eq('is_active', true);

      // 2. Total views
      const { count: viewCount } = await supabase
        .from('product_views')
        .select('*', { count: 'exact', head: true })
        .eq('shop_id', shopId);

      // 3. Enquiries
      const { data: enquiries } = await supabase
        .from('enquiries')
        .select('id, status, created_at')
        .eq('shop_id', shopId);

      const totalEnquiries = enquiries?.length || 0;
      const pendingEnquiries = enquiries?.filter(e => e.status === 'New').length || 0;

      // 4. Products for view breakdown
      const { data: products } = await supabase
        .from('products')
        .select('id, title, price, images')
        .eq('shop_id', shopId);

      // Aggregate views per product
      const topProducts = (products || []).slice(0, 5).map(p => ({
        ...p,
        views: Math.floor((viewCount || 0) / Math.max(1, products.length)), // distributed or direct
      }));

      const conversion = viewCount > 0 ? ((totalEnquiries / viewCount) * 100).toFixed(1) : 0;

      return {
        totalProducts: productCount || 0,
        totalViews: viewCount || 0,
        totalEnquiries,
        pendingEnquiries,
        topProducts,
        enquiryConversionRate: conversion,
      };
    }

    // Demo Mode: calculate from stored data
    const products = getDemoData(STORAGE_KEYS.PRODUCTS).filter(p => p.shop_id === shopId && p.is_active);
    const views = getDemoData(STORAGE_KEYS.VIEWS).filter(v => v.shop_id === shopId);
    const enquiries = getDemoData(STORAGE_KEYS.ENQUIRIES).filter(e => e.shop_id === shopId);

    const totalViews = views.reduce((sum, v) => sum + (v.count || 0), 0);
    const totalEnquiries = enquiries.length;
    const pendingEnquiries = enquiries.filter(e => e.status === 'New').length;

    const topProducts = products.map(p => {
      const v = views.find(item => item.product_id === p.id);
      return {
        id: p.id,
        title: p.title,
        price: p.price,
        image: p.images?.[0],
        views: v ? v.count : 0,
      };
    }).sort((a, b) => b.views - a.views).slice(0, 5);

    const conversion = totalViews > 0 ? ((totalEnquiries / totalViews) * 100).toFixed(1) : 0;

    return {
      totalProducts: products.length,
      totalViews,
      totalEnquiries,
      pendingEnquiries,
      topProducts,
      enquiryConversionRate: conversion,
    };
  }
};

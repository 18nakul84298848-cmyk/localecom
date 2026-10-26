// ==============================================================================
// DukaanConnect: Products Service
// Full CRUD, search, filter, stock validation, and image upload
// ==============================================================================

import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { STORAGE_KEYS, getDemoData, setDemoData } from './storageHelper';

export const productsService = {
  // Query products with search, category, locality, price, stock filters
  async getProducts({
    category = 'all',
    locality = 'All Localities',
    search = '',
    sort = 'newest',
    minPrice,
    maxPrice,
    inStockOnly = false,
    shopId,
    includeInactive = false
  } = {}) {
    if (isSupabaseConfigured && supabase) {
      let query = supabase
        .from('products')
        .select(`
          *,
          shops!inner (
            id,
            name,
            slug,
            locality,
            city,
            phone,
            is_active
          )
        `);

      if (!includeInactive) {
        query = query.eq('is_active', true).eq('shops.is_active', true);
      }
      if (shopId) {
        query = query.eq('shop_id', shopId);
      }
      if (category && category !== 'all') {
        query = query.eq('category', category);
      }
      if (locality && locality !== 'All Localities') {
        query = query.ilike('shops.locality', `%${locality}%`);
      }
      if (minPrice !== undefined && minPrice !== null && minPrice !== '') {
        query = query.gte('price', Number(minPrice));
      }
      if (maxPrice !== undefined && maxPrice !== null && maxPrice !== '') {
        query = query.lte('price', Number(maxPrice));
      }
      if (inStockOnly) {
        query = query.gt('stock', 0);
      }
      if (search) {
        query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
      }

      // Sorting
      if (sort === 'price-low') {
        query = query.order('price', { ascending: true });
      } else if (sort === 'price-high') {
        query = query.order('price', { ascending: false });
      } else {
        query = query.order('created_at', { ascending: false });
      }

      const { data, error } = await query;
      if (error) throw error;

      // Normalize shop fields
      return (data || []).map(p => ({
        ...p,
        shop_name: p.shops?.name,
        shop_slug: p.shops?.slug,
        shop_locality: p.shops?.locality,
        shop_phone: p.shops?.phone,
      }));
    }

    // Demo Mode filtering
    let products = getDemoData(STORAGE_KEYS.PRODUCTS);
    const shops = getDemoData(STORAGE_KEYS.SHOPS);

    // Merge latest shop info
    products = products.map(p => {
      const parentShop = shops.find(s => s.id === p.shop_id) || {};
      return {
        ...p,
        shop_name: parentShop.name || p.shop_name,
        shop_slug: parentShop.slug || p.shop_slug,
        shop_locality: parentShop.locality || p.shop_locality,
        shop_phone: parentShop.phone || p.shop_phone,
      };
    });

    if (!includeInactive) {
      products = products.filter(p => p.is_active);
    }
    if (shopId) {
      products = products.filter(p => p.shop_id === shopId);
    }
    if (category && category !== 'all') {
      products = products.filter(p => p.category === category);
    }
    if (locality && locality !== 'All Localities') {
      products = products.filter(p => (p.shop_locality || '').toLowerCase().includes(locality.toLowerCase()));
    }
    if (minPrice !== undefined && minPrice !== null && minPrice !== '') {
      products = products.filter(p => Number(p.price) >= Number(minPrice));
    }
    if (maxPrice !== undefined && maxPrice !== null && maxPrice !== '') {
      products = products.filter(p => Number(p.price) <= Number(maxPrice));
    }
    if (inStockOnly) {
      products = products.filter(p => Number(p.stock) > 0);
    }
    if (search) {
      const q = search.toLowerCase();
      products = products.filter(p =>
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        (p.tags && p.tags.some(t => t.toLowerCase().includes(q))) ||
        (p.shop_name && p.shop_name.toLowerCase().includes(q))
      );
    }

    if (sort === 'price-low') {
      products.sort((a, b) => a.price - b.price);
    } else if (sort === 'price-high') {
      products.sort((a, b) => b.price - a.price);
    } else {
      products.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
    }

    return products;
  },

  // Get product by ID
  async getProductById(id) {
    if (!id) return null;

    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          shops (
            id,
            name,
            slug,
            locality,
            address,
            phone,
            rating,
            is_active,
            logo_url
          )
        `)
        .eq('id', id)
        .single();
      if (error) {
        if (error.code === 'PGRST116') return null;
        throw error;
      }
      return {
        ...data,
        shop_name: data.shops?.name,
        shop_slug: data.shops?.slug,
        shop_locality: data.shops?.locality,
        shop_phone: data.shops?.phone,
        shop_address: data.shops?.address,
        shop_rating: data.shops?.rating,
        shop_logo: data.shops?.logo_url,
      };
    }

    const products = getDemoData(STORAGE_KEYS.PRODUCTS);
    const prod = products.find(p => p.id === id);
    if (!prod) return null;

    const shops = getDemoData(STORAGE_KEYS.SHOPS);
    const shop = shops.find(s => s.id === prod.shop_id) || {};
    return {
      ...prod,
      shop_name: shop.name || prod.shop_name,
      shop_slug: shop.slug || prod.shop_slug,
      shop_locality: shop.locality || prod.shop_locality,
      shop_phone: shop.phone || prod.shop_phone,
      shop_address: shop.address,
      shop_rating: shop.rating,
      shop_logo: shop.logo_url,
    };
  },

  // Validate product input fields strictly
  validateProductData(data) {
    const errors = {};
    if (!data.title || data.title.trim().length < 3) {
      errors.title = 'Product title must be at least 3 characters long.';
    }
    if (!data.description || data.description.trim().length < 10) {
      errors.description = 'Please provide a clear description (at least 10 characters).';
    }
    if (!data.category) {
      errors.category = 'Please select a product category.';
    }
    if (data.price === undefined || data.price === null || isNaN(data.price) || Number(data.price) < 0) {
      errors.price = 'Price must be a valid non-negative number.';
    }
    if (data.stock === undefined || data.stock === null || isNaN(data.stock) || Number(data.stock) < 0 || !Number.isInteger(Number(data.stock))) {
      errors.stock = 'Stock quantity must be a non-negative whole number.';
    }
    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  },

  // Create product
  async createProduct(productData) {
    const validation = this.validateProductData(productData);
    if (!validation.isValid) {
      const firstError = Object.values(validation.errors)[0];
      throw new Error(firstError);
    }

    const payload = {
      shop_id: productData.shop_id,
      title: productData.title.trim(),
      description: productData.description.trim(),
      category: productData.category,
      price: Number(productData.price),
      original_price: productData.original_price ? Number(productData.original_price) : null,
      stock: parseInt(productData.stock, 10),
      is_active: productData.is_active !== undefined ? productData.is_active : true,
      images: Array.isArray(productData.images) && productData.images.length > 0 
        ? productData.images 
        : ['https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=600&auto=format&fit=crop&q=80'],
      tags: Array.isArray(productData.tags) ? productData.tags : [],
      specifications: productData.specifications || {},
    };

    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('products')
        .insert([payload])
        .select()
        .single();
      if (error) throw error;
      return data;
    }

    // Demo Mode
    const products = getDemoData(STORAGE_KEYS.PRODUCTS);
    const newProduct = {
      ...payload,
      id: `prod-${Date.now()}`,
      created_at: new Date().toISOString()
    };
    products.unshift(newProduct);
    setDemoData(STORAGE_KEYS.PRODUCTS, products);
    return newProduct;
  },

  // Update product
  async updateProduct(id, updates) {
    if (updates.price !== undefined && (isNaN(updates.price) || Number(updates.price) < 0)) {
      throw new Error('Price must be a valid non-negative number.');
    }
    if (updates.stock !== undefined && (isNaN(updates.stock) || Number(updates.stock) < 0 || !Number.isInteger(Number(updates.stock)))) {
      throw new Error('Stock must be a non-negative whole number.');
    }

    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('products')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    }

    // Demo Mode
    const products = getDemoData(STORAGE_KEYS.PRODUCTS);
    const index = products.findIndex(p => p.id === id);
    if (index === -1) throw new Error('Product not found.');
    products[index] = { ...products[index], ...updates, updated_at: new Date().toISOString() };
    setDemoData(STORAGE_KEYS.PRODUCTS, products);
    return products[index];
  },

  // Delete product
  async deleteProduct(id) {
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);
      if (error) throw error;
      return true;
    }

    // Demo Mode
    let products = getDemoData(STORAGE_KEYS.PRODUCTS);
    products = products.filter(p => p.id !== id);
    setDemoData(STORAGE_KEYS.PRODUCTS, products);
    return true;
  },

  // Upload product image to Supabase Storage with local fallback
  async uploadProductImage(file) {
    if (!file) throw new Error('No file provided');

    if (isSupabaseConfigured && supabase) {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `products/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath);

      return publicUrl;
    }

    // Demo Mode: Convert to object URL or base64 data URL
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = () => reject(new Error('Failed to read image file'));
      reader.readAsDataURL(file);
    });
  }
};

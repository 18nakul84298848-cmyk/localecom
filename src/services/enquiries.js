// ==============================================================================
// DukaanConnect: Enquiries Service
// Lead capture, seller inbox, status updates, and customer enquiries
// ==============================================================================

import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { STORAGE_KEYS, getDemoData, setDemoData } from './storageHelper';

export const enquiriesService = {
  // Validate enquiry inputs
  validateEnquiry(data) {
    const errors = {};
    if (!data.customer_name || data.customer_name.trim().length < 2) {
      errors.customer_name = 'Please provide your name.';
    }
    if (!data.customer_phone || data.customer_phone.trim().length < 8) {
      errors.customer_phone = 'Please provide a valid contact phone number.';
    }
    if (!data.message || data.message.trim().length < 5) {
      errors.message = 'Please write a message or enquiry query (at least 5 characters).';
    }
    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  },

  // Submit customer enquiry
  async createEnquiry(enquiryData) {
    const validation = this.validateEnquiry(enquiryData);
    if (!validation.isValid) {
      const firstError = Object.values(validation.errors)[0];
      throw new Error(firstError);
    }

    const payload = {
      product_id: enquiryData.product_id || null,
      shop_id: enquiryData.shop_id,
      customer_id: enquiryData.customer_id || null,
      customer_name: enquiryData.customer_name.trim(),
      customer_email: enquiryData.customer_email?.trim() || null,
      customer_phone: enquiryData.customer_phone.trim(),
      message: enquiryData.message.trim(),
      contact_preference: enquiryData.contact_preference || 'whatsapp',
      status: 'New',
    };

    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('enquiries')
        .insert([payload])
        .select()
        .single();
      if (error) throw error;
      return data;
    }

    // Demo Mode
    const enquiries = getDemoData(STORAGE_KEYS.ENQUIRIES);
    const newEnquiry = {
      ...payload,
      id: `enq-${Date.now()}`,
      product_title: enquiryData.product_title || 'General Shop Enquiry',
      created_at: new Date().toISOString()
    };
    enquiries.unshift(newEnquiry);
    setDemoData(STORAGE_KEYS.ENQUIRIES, enquiries);
    return newEnquiry;
  },

  // Get enquiries received by a shop (for Seller Dashboard)
  async getSellerEnquiries(shopId) {
    if (!shopId) return [];

    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('enquiries')
        .select(`
          *,
          products (
            id,
            title,
            price,
            images
          )
        `)
        .eq('shop_id', shopId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return (data || []).map(e => ({
        ...e,
        product_title: e.products?.title || 'General Enquiry',
        product_price: e.products?.price,
        product_image: e.products?.images?.[0]
      }));
    }

    // Demo Mode
    const enquiries = getDemoData(STORAGE_KEYS.ENQUIRIES);
    return enquiries.filter(e => e.shop_id === shopId);
  },

  // Get enquiries submitted by a customer
  async getCustomerEnquiries(customerId) {
    if (!customerId) return [];

    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('enquiries')
        .select(`
          *,
          shops (
            id,
            name,
            slug,
            locality,
            phone
          ),
          products (
            id,
            title,
            price
          )
        `)
        .eq('customer_id', customerId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    }

    const enquiries = getDemoData(STORAGE_KEYS.ENQUIRIES);
    return enquiries.filter(e => e.customer_id === customerId);
  },

  // Update status (New, Contacted, Completed, Cancelled)
  async updateEnquiryStatus(enquiryId, status, sellerNotes = '') {
    const validStatuses = ['New', 'Contacted', 'Completed', 'Cancelled'];
    if (!validStatuses.includes(status)) {
      throw new Error(`Invalid status: ${status}. Must be one of ${validStatuses.join(', ')}`);
    }

    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('enquiries')
        .update({ status, seller_notes: sellerNotes })
        .eq('id', enquiryId)
        .select()
        .single();
      if (error) throw error;
      return data;
    }

    // Demo Mode
    const enquiries = getDemoData(STORAGE_KEYS.ENQUIRIES);
    const index = enquiries.findIndex(e => e.id === enquiryId);
    if (index === -1) throw new Error('Enquiry not found');
    enquiries[index] = {
      ...enquiries[index],
      status,
      seller_notes: sellerNotes,
      updated_at: new Date().toISOString()
    };
    setDemoData(STORAGE_KEYS.ENQUIRIES, enquiries);
    return enquiries[index];
  }
};

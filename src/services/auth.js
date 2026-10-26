// ==============================================================================
// DukaanConnect: Authentication Service
// Supports Supabase Auth & Transparent Local Demo Auth
// ==============================================================================

import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { STORAGE_KEYS } from './storageHelper';

// Demo seed accounts for quick testing
export const DEMO_ACCOUNTS = {
  seller: {
    id: 'seller-1',
    email: 'ramesh.sharma@dukaanconnect.demo',
    full_name: 'Ramesh Sharma',
    role: 'seller',
    phone: '+91 98765 43210',
    shop_id: 'shop-1',
    shop_name: 'Sharma Kirana & Organic Spices',
    shop_slug: 'sharma-kirana'
  },
  customer: {
    id: 'cust-1',
    email: 'priya.malhotra@gmail.com',
    full_name: 'Priya Malhotra',
    role: 'customer',
    phone: '+91 98991 12233'
  }
};

export const authService = {
  isConfigured: isSupabaseConfigured,

  // Get current session & profile
  async getCurrentUser() {
    if (isSupabaseConfigured && supabase) {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return { user: null, profile: null };

      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

      return {
        user: session.user,
        profile: profile || {
          id: session.user.id,
          email: session.user.email,
          role: session.user.user_metadata?.role || 'customer',
          full_name: session.user.user_metadata?.full_name || 'User',
        }
      };
    }

    // Demo Mode session
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.USER);
      if (stored) {
        const user = JSON.parse(stored);
        return { user, profile: user };
      }
    } catch (e) {
      console.error('Error reading demo user:', e);
    }
    // Default to Ramesh Sharma seller if empty in demo mode so dashboard is immediately active
    const defaultUser = DEMO_ACCOUNTS.seller;
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(defaultUser));
    return { user: defaultUser, profile: defaultUser };
  },

  // Sign up
  async signUp({ email, password, fullName, role = 'customer', phone = '' }) {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            role,
            phone,
          }
        }
      });
      if (error) throw error;
      return { user: data.user, error: null };
    }

    // Demo mode signup
    const newDemoUser = {
      id: `user-${Date.now()}`,
      email,
      full_name: fullName,
      role,
      phone,
      created_at: new Date().toISOString()
    };
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(newDemoUser));
    return { user: newDemoUser, error: null };
  },

  // Sign in
  async signIn({ email, password }) {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      return { user: data.user, error: null };
    }

    // Demo mode sign in: match demo accounts or create mock user
    let user;
    if (email.toLowerCase().includes('sharma') || email.toLowerCase().includes('seller')) {
      user = DEMO_ACCOUNTS.seller;
    } else if (email.toLowerCase().includes('priya') || email.toLowerCase().includes('cust')) {
      user = DEMO_ACCOUNTS.customer;
    } else {
      user = {
        id: `user-${Date.now()}`,
        email,
        full_name: email.split('@')[0],
        role: 'seller',
        phone: '+91 98000 00000',
      };
    }
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    return { user, error: null };
  },

  // Quick switch demo account for testing
  loginAsDemo(type = 'seller') {
    const user = DEMO_ACCOUNTS[type] || DEMO_ACCOUNTS.seller;
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    return user;
  },

  // Sign out
  async signOut() {
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut();
    }
    localStorage.removeItem(STORAGE_KEYS.USER);
    return { success: true };
  },

  // Update profile
  async updateProfile(userId, updates) {
    // Prevent role escalation by filtering out role change unless allowed
    const safeUpdates = { ...updates };
    delete safeUpdates.role; // Protected

    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('profiles')
        .update(safeUpdates)
        .eq('id', userId)
        .select()
        .single();
      if (error) throw error;
      return data;
    }

    const current = JSON.parse(localStorage.getItem(STORAGE_KEYS.USER) || '{}');
    const updated = { ...current, ...safeUpdates };
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updated));
    return updated;
  }
};

// ==============================================================================
// DukaanConnect: Auth Context & Global User State
// ==============================================================================

import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/auth';
import { shopsService } from '../services/shops';
import { isSupabaseConfigured } from '../lib/supabase';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [shop, setShop] = useState(null);
  const [loading, setLoading] = useState(true);
  const isDemoMode = !isSupabaseConfigured;

  // Load active session and corresponding shop details
  const refreshUser = async () => {
    try {
      setLoading(true);
      const { user: currentUser, profile: currentProfile } = await authService.getCurrentUser();
      setUser(currentUser);
      setProfile(currentProfile);

      if (currentProfile?.role === 'seller') {
        const userShop = await shopsService.getShopByOwnerId(currentUser?.id);
        setShop(userShop);
      } else {
        setShop(null);
      }
    } catch (err) {
      console.error('Failed to load user session:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const signIn = async (credentials) => {
    const res = await authService.signIn(credentials);
    await refreshUser();
    return res;
  };

  const signUp = async (data) => {
    const res = await authService.signUp(data);
    await refreshUser();
    return res;
  };

  const signOut = async () => {
    await authService.signOut();
    setUser(null);
    setProfile(null);
    setShop(null);
  };

  // Demo Switch helper for rapid testing in hackathons
  const switchDemoRole = async (type) => {
    authService.loginAsDemo(type);
    await refreshUser();
  };

  const refreshShop = async () => {
    if (user?.id) {
      const userShop = await shopsService.getShopByOwnerId(user.id);
      setShop(userShop);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        shop,
        loading,
        isDemoMode,
        isSupabaseConfigured,
        signIn,
        signUp,
        signOut,
        switchDemoRole,
        refreshUser,
        refreshShop,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

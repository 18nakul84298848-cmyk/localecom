-- ==============================================================================
-- DukaanConnect: Full Database Schema, Security Policies (RLS), and Demo Seeds
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES TABLE (Linked to auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    full_name TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'seller', 'admin')),
    phone TEXT,
    avatar_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. SHOPS TABLE (Storefront details owned by sellers)
CREATE TABLE IF NOT EXISTS public.shops (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    category TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    address TEXT NOT NULL,
    locality TEXT NOT NULL,
    city TEXT NOT NULL,
    state TEXT NOT NULL DEFAULT 'Delhi',
    pincode TEXT,
    logo_url TEXT,
    banner_url TEXT,
    rating NUMERIC(2, 1) DEFAULT 4.8,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    shop_id UUID NOT NULL REFERENCES public.shops(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL,
    price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
    original_price NUMERIC(10, 2) CHECK (original_price IS NULL OR original_price >= price),
    stock INTEGER NOT NULL DEFAULT 1 CHECK (stock >= 0),
    is_active BOOLEAN NOT NULL DEFAULT true,
    images TEXT[] NOT NULL DEFAULT '{}',
    tags TEXT[] NOT NULL DEFAULT '{}',
    specifications JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. ENQUIRIES TABLE (Customer to Seller lead tracking)
CREATE TABLE IF NOT EXISTS public.enquiries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
    shop_id UUID NOT NULL REFERENCES public.shops(id) ON DELETE CASCADE,
    customer_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    customer_name TEXT NOT NULL,
    customer_email TEXT,
    customer_phone TEXT NOT NULL,
    message TEXT NOT NULL,
    contact_preference TEXT NOT NULL DEFAULT 'whatsapp' CHECK (contact_preference IN ('whatsapp', 'call', 'email')),
    status TEXT NOT NULL DEFAULT 'New' CHECK (status IN ('New', 'Contacted', 'Completed', 'Cancelled')),
    seller_notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. PRODUCT VIEWS TABLE (Anonymized event tracking for Growth Analytics)
CREATE TABLE IF NOT EXISTS public.product_views (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    shop_id UUID NOT NULL REFERENCES public.shops(id) ON DELETE CASCADE,
    session_id TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- INDEXES FOR PERFORMANCE
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_shops_owner ON public.shops(owner_id);
CREATE INDEX IF NOT EXISTS idx_shops_slug ON public.shops(slug);
CREATE INDEX IF NOT EXISTS idx_shops_locality ON public.shops(locality);
CREATE INDEX IF NOT EXISTS idx_shops_category ON public.shops(category);

CREATE INDEX IF NOT EXISTS idx_products_shop ON public.products(shop_id);
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category);
CREATE INDEX IF NOT EXISTS idx_products_price ON public.products(price);
CREATE INDEX IF NOT EXISTS idx_products_is_active ON public.products(is_active);

CREATE INDEX IF NOT EXISTS idx_enquiries_shop ON public.enquiries(shop_id);
CREATE INDEX IF NOT EXISTS idx_enquiries_customer ON public.enquiries(customer_id);
CREATE INDEX IF NOT EXISTS idx_enquiries_status ON public.enquiries(status);

CREATE INDEX IF NOT EXISTS idx_product_views_product ON public.product_views(product_id);
CREATE INDEX IF NOT EXISTS idx_product_views_shop ON public.product_views(shop_id);
CREATE INDEX IF NOT EXISTS idx_product_views_created ON public.product_views(created_at);

-- ==============================================================================
-- UPDATED_AT TRIGGER FUNCTION
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_profiles_updated_at ON public.profiles;
CREATE TRIGGER set_profiles_updated_at BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_shops_updated_at ON public.shops;
CREATE TRIGGER set_shops_updated_at BEFORE UPDATE ON public.shops
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_products_updated_at ON public.products;
CREATE TRIGGER set_products_updated_at BEFORE UPDATE ON public.products
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_enquiries_updated_at ON public.enquiries;
CREATE TRIGGER set_enquiries_updated_at BEFORE UPDATE ON public.enquiries
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ==============================================================================
-- AUTH TRIGGER: Automatically create profile on Supabase auth.users signup
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name, role, phone)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
        COALESCE(NEW.raw_user_meta_data->>'role', 'customer'),
        NEW.raw_user_meta_data->>'phone'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shops ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_views ENABLE ROW LEVEL SECURITY;

-- ----------------- PROFILES RLS -----------------
-- Anyone can view profiles (needed for shop owner info)
CREATE POLICY "Public profiles are viewable by everyone" 
    ON public.profiles FOR SELECT 
    USING (true);

-- Users can only update their own profile; cannot self-promote to 'admin'
CREATE POLICY "Users can update their own profile" 
    ON public.profiles FOR UPDATE 
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id AND (role = 'customer' OR role = 'seller'));

-- ----------------- SHOPS RLS -----------------
-- Active shops are viewable by everyone
CREATE POLICY "Active shops are viewable by everyone" 
    ON public.shops FOR SELECT 
    USING (is_active = true OR (auth.uid() = owner_id));

-- Sellers can create their own shop
CREATE POLICY "Sellers can create their shop" 
    ON public.shops FOR INSERT 
    WITH CHECK (auth.uid() = owner_id);

-- Sellers can update their own shop
CREATE POLICY "Sellers can update their own shop" 
    ON public.shops FOR UPDATE 
    USING (auth.uid() = owner_id)
    WITH CHECK (auth.uid() = owner_id);

-- ----------------- PRODUCTS RLS -----------------
-- Active products belonging to active shops are viewable by everyone
CREATE POLICY "Public products viewable by everyone" 
    ON public.products FOR SELECT 
    USING (
        is_active = true 
        OR EXISTS (
            SELECT 1 FROM public.shops 
            WHERE shops.id = products.shop_id AND shops.owner_id = auth.uid()
        )
    );

-- Sellers can insert products only into shops they own
CREATE POLICY "Sellers can insert products to their shops" 
    ON public.products FOR INSERT 
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.shops 
            WHERE shops.id = products.shop_id AND shops.owner_id = auth.uid()
        )
    );

-- Sellers can update products of shops they own
CREATE POLICY "Sellers can update their own products" 
    ON public.products FOR UPDATE 
    USING (
        EXISTS (
            SELECT 1 FROM public.shops 
            WHERE shops.id = products.shop_id AND shops.owner_id = auth.uid()
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.shops 
            WHERE shops.id = products.shop_id AND shops.owner_id = auth.uid()
        )
    );

-- Sellers can delete products of shops they own
CREATE POLICY "Sellers can delete their own products" 
    ON public.products FOR DELETE 
    USING (
        EXISTS (
            SELECT 1 FROM public.shops 
            WHERE shops.id = products.shop_id AND shops.owner_id = auth.uid()
        )
    );

-- ----------------- ENQUIRIES RLS -----------------
-- Anyone can create an enquiry (customer or anonymous visitor)
CREATE POLICY "Anyone can submit an enquiry" 
    ON public.enquiries FOR INSERT 
    WITH CHECK (true);

-- Customers can view their own submitted enquiries
CREATE POLICY "Customers can view their own enquiries" 
    ON public.enquiries FOR SELECT 
    USING (
        customer_id = auth.uid() 
        OR EXISTS (
            SELECT 1 FROM public.shops 
            WHERE shops.id = enquiries.shop_id AND shops.owner_id = auth.uid()
        )
    );

-- Sellers can update the status/notes of enquiries sent to their shop
CREATE POLICY "Sellers can update enquiries to their shop" 
    ON public.enquiries FOR UPDATE 
    USING (
        EXISTS (
            SELECT 1 FROM public.shops 
            WHERE shops.id = enquiries.shop_id AND shops.owner_id = auth.uid()
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.shops 
            WHERE shops.id = enquiries.shop_id AND shops.owner_id = auth.uid()
        )
    );

-- ----------------- PRODUCT VIEWS RLS -----------------
-- Anyone can insert a product view
CREATE POLICY "Anyone can record a product view" 
    ON public.product_views FOR INSERT 
    WITH CHECK (true);

-- Sellers can only view analytics for their own shop
CREATE POLICY "Sellers can view views for their own shop" 
    ON public.product_views FOR SELECT 
    USING (
        EXISTS (
            SELECT 1 FROM public.shops 
            WHERE shops.id = product_views.shop_id AND shops.owner_id = auth.uid()
        )
    );

-- ==============================================================================
-- STORAGE BUCKET CONFIGURATION (For product images and shop banners)
-- ==============================================================================
-- Run this in Supabase Storage or via SQL:
INSERT INTO storage.buckets (id, name, public) 
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public) 
VALUES ('shop-assets', 'shop-assets', true)
ON CONFLICT (id) DO NOTHING;

-- Storage RLS: Public read access for images
CREATE POLICY "Public image read access"
ON storage.objects FOR SELECT
USING (bucket_id IN ('product-images', 'shop-assets'));

-- Storage RLS: Authenticated users can upload to product-images
CREATE POLICY "Authenticated users can upload images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id IN ('product-images', 'shop-assets') AND auth.role() = 'authenticated');

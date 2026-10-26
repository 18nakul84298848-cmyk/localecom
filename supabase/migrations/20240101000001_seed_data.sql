-- ==============================================================================
-- DukaanConnect: Demo Seed Data for Supabase
-- Clearly identifiable demo data for local Indian retailers and realistic products
-- ==============================================================================

-- Create demo seller profile
INSERT INTO public.profiles (id, email, full_name, role, phone)
VALUES 
  ('a0000000-0000-0000-0000-000000000001', 'ramesh.sharma@dukaanconnect.demo', 'Ramesh Sharma', 'seller', '+91 98765 43210'),
  ('a0000000-0000-0000-0000-000000000002', 'sunita.devi@dukaanconnect.demo', 'Sunita Devi', 'seller', '+91 98111 22334'),
  ('a0000000-0000-0000-0000-000000000003', 'anand.patel@dukaanconnect.demo', 'Anand Patel', 'seller', '+91 99000 88776'),
  ('a0000000-0000-0000-0000-000000000004', 'vikram.singh@dukaanconnect.demo', 'Vikram Singh', 'seller', '+91 98222 33445')
ON CONFLICT (id) DO NOTHING;

-- Demo Shops
INSERT INTO public.shops (id, owner_id, name, slug, description, category, phone, email, address, locality, city, state, pincode, logo_url, banner_url, rating, is_active)
VALUES
(
  'b0000000-0000-0000-0000-000000000001',
  'a0000000-0000-0000-0000-000000000001',
  'Sharma Kirana & Organic Spices',
  'sharma-kirana',
  '30-year-old family grocery & authentic Indian spice store in Lajpat Nagar. Fresh stone-ground turmeric, basmati rice, cold-pressed mustard oil, and pure dry fruits.',
  'groceries',
  '+91 98765 43210',
  'sharmakirana@demo.com',
  'Shop 14, Central Market, Lajpat Nagar II',
  'Lajpat Nagar',
  'New Delhi',
  'Delhi',
  '110024',
  'https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1607344645866-009c320c5ab8?w=1200&auto=format&fit=crop&q=80',
  4.9,
  true
),
(
  'b0000000-0000-0000-0000-000000000002',
  'a0000000-0000-0000-0000-000000000002',
  'Varanasi Silk & Handloom Weaves',
  'varanasi-silk',
  'Direct master weavers from Banaras. Authentic pure Katan silk sarees, bridal brocades, hand-woven dupattas, and festive kurtas with certified silk marks.',
  'clothing',
  '+91 98111 22334',
  'varanasisilk@demo.com',
  'D 37/42, Godowlia Chowk, Main Bazaar',
  'Godowlia',
  'Varanasi',
  'Uttar Pradesh',
  '221001',
  'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=1200&auto=format&fit=crop&q=80',
  4.8,
  true
),
(
  'b0000000-0000-0000-0000-000000000003',
  'a0000000-0000-0000-0000-000000000003',
  'Asha Handcrafted Home & Pottery',
  'asha-decor',
  'Artisan clay cookware, brass diyas, hand-painted ceramic dinnerware, and terracotta home accents sourced directly from rural craft clusters.',
  'home_decor',
  '+91 99000 88776',
  'ashadecor@demo.com',
  '88, 4th Block, 100ft Road, Koramangala',
  'Koramangala',
  'Bengaluru',
  'Karnataka',
  '560034',
  'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=1200&auto=format&fit=crop&q=80',
  4.9,
  true
),
(
  'b0000000-0000-0000-0000-000000000004',
  'a0000000-0000-0000-0000-000000000004',
  'Apex Mobile & Smart Tech Hub',
  'apex-gadgets',
  'Your neighborhood technology stop. Original mobile cases, fast charging adapters, Bluetooth neckbands, screen protectors, and smart accessories with warranty.',
  'electronics',
  '+91 98222 33445',
  'apexgadgets@demo.com',
  'Shop 22, Ranganathan Street, T. Nagar',
  'T. Nagar',
  'Chennai',
  'Tamil Nadu',
  '600017',
  'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=1200&auto=format&fit=crop&q=80',
  4.7,
  true
)
ON CONFLICT (id) DO NOTHING;

-- Demo Products
INSERT INTO public.products (id, shop_id, title, description, category, price, original_price, stock, is_active, images, tags)
VALUES
(
  'c0000000-0000-0000-0000-000000000001',
  'b0000000-0000-0000-0000-000000000001',
  'Organic Lakadong Turmeric Powder (500g)',
  'High-curcumin (7.5%+) unpolished turmeric ground using traditional stone chakki in small batches. No artificial color, intense aromatic flavor and natural immunity booster.',
  'groceries',
  280.00,
  350.00,
  45,
  true,
  ARRAY['https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=600&auto=format&fit=crop&q=80'],
  ARRAY['organic', 'spice', 'immunity', 'haldi', 'curcumin']
),
(
  'c0000000-0000-0000-0000-000000000002',
  'b0000000-0000-0000-0000-000000000001',
  'Cold-Pressed Mustard Oil - Kachi Ghani (1 Litre)',
  'Authentic wood-pressed raw mustard oil extracted at room temperature. Retains original pungency, omega-3 fatty acids, and natural antioxidants. Glass bottle packaging.',
  'groceries',
  240.00,
  290.00,
  30,
  true,
  ARRAY['https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=600&auto=format&fit=crop&q=80'],
  ARRAY['cold-pressed', 'oil', 'kachi ghani', 'cooking', 'healthy']
),
(
  'c0000000-0000-0000-0000-000000000003',
  'b0000000-0000-0000-0000-000000000001',
  'Premium Kashmiri Mamra Almonds (250g)',
  '100% natural, pesticide-free Kashmiri Mamra badam. High oil content, sweet nutty taste, hand-sorted for quality and packed in airtight ziplock pouch.',
  'groceries',
  650.00,
  750.00,
  20,
  true,
  ARRAY['https://images.unsplash.com/photo-1508061252445-5350f3ab0a55?w=600&auto=format&fit=crop&q=80'],
  ARRAY['dryfruits', 'almonds', 'kashmir', 'mamra', 'healthy snack']
),
(
  'c0000000-0000-0000-0000-000000000004',
  'b0000000-0000-0000-0000-000000000002',
  'Royal Crimson Banarasi Katan Silk Saree',
  'Hand-loomed in Varanasi over 18 days. Intricate golden zari floral jaal with traditional meenakari borders. Comes with matching unstitched blouse piece and Silk Mark tag.',
  'clothing',
  4899.00,
  6500.00,
  8,
  true,
  ARRAY['https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&auto=format&fit=crop&q=80'],
  ARRAY['saree', 'banarasi', 'wedding', 'silk', 'handloom']
),
(
  'c0000000-0000-0000-0000-000000000005',
  'b0000000-0000-0000-0000-000000000002',
  'Indigo Chanderi Handblock Kurta Set',
  'Pure breathable cotton-silk blend Chanderi kurta featuring traditional Dabu mud resist block prints. Includes pants and sheer kota doria dupatta.',
  'clothing',
  2250.00,
  2900.00,
  15,
  true,
  ARRAY['https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=600&auto=format&fit=crop&q=80'],
  ARRAY['kurta', 'indigo', 'ethnic', 'handblock', 'summer wear']
),
(
  'c0000000-0000-0000-0000-000000000006',
  'b0000000-0000-0000-0000-000000000003',
  'Handcrafted Terracotta Chai Kulhad Set (Pack of 6)',
  'Traditional clay cups thrown on potter wheels in Ramanagara. Adds earthy aroma (sondhi khushboo) to masala chai. Oven safe and microwave friendly.',
  'home_decor',
  380.00,
  450.00,
  25,
  true,
  ARRAY['https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&auto=format&fit=crop&q=80'],
  ARRAY['terracotta', 'kulhad', 'pottery', 'tea', 'artisan']
),
(
  'c0000000-0000-0000-0000-000000000007',
  'b0000000-0000-0000-0000-000000000003',
  'Vintage Hand-Engraved Brass Peacock Diya',
  'Heavy solid brass ornamental oil lamp featuring intricate peacock motif. Handcrafted by heritage metal artisans. Ideal for living room shrines or festive Diwali decor.',
  'home_decor',
  1250.00,
  1600.00,
  12,
  true,
  ARRAY['https://images.unsplash.com/photo-1605883746313-67b886b69162?w=600&auto=format&fit=crop&q=80'],
  ARRAY['brass', 'diya', 'peacock', 'festive', 'traditional decor']
),
(
  'c0000000-0000-0000-0000-000000000008',
  'b0000000-0000-0000-0000-000000000004',
  '65W GaN Fast Charger with Dual Type-C Ports',
  'Compact next-gen gallium nitride charger. Supports Power Delivery 3.0, Quick Charge 4+, and laptop charging. Overheat protection with 1-year local replacement warranty.',
  'electronics',
  1499.00,
  1999.00,
  35,
  true,
  ARRAY['https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=600&auto=format&fit=crop&q=80'],
  ARRAY['charger', 'fast charging', 'gan', 'type-c', 'mobile accessories']
),
(
  'c0000000-0000-0000-0000-000000000009',
  'b0000000-0000-0000-0000-000000000004',
  'Braided Heavy-Duty 2M Fast Charging Cable',
  'Military-grade nylon braided cable with reinforced aluminum connectors. Supports 100W PD and fast data sync. Tangle-free design tested for 20,000+ bends.',
  'electronics',
  399.00,
  599.00,
  60,
  true,
  ARRAY['https://images.unsplash.com/photo-1585338107529-13afc5f02586?w=600&auto=format&fit=crop&q=80'],
  ARRAY['cable', 'braided', 'fast charge', 'durable', 'gadgets']
)
ON CONFLICT (id) DO NOTHING;

-- Demo Enquiries
INSERT INTO public.enquiries (shop_id, product_id, customer_name, customer_email, customer_phone, message, contact_preference, status)
VALUES
(
  'b0000000-0000-0000-0000-000000000001',
  'c0000000-0000-0000-0000-000000000001',
  'Priya Malhotra',
  'priya.m@gmail.com',
  '+91 98991 12233',
  'Hi Sharma ji, I need 5 packs of the Lakadong Turmeric for our family wedding gift hampers. Can you deliver to Block D Lajpat Nagar today?',
  'whatsapp',
  'New'
),
(
  'b0000000-0000-0000-0000-000000000002',
  'c0000000-0000-0000-0000-000000000004',
  'Aditi Sen',
  'aditi.sen@outlook.com',
  '+91 97480 55667',
  'Namaste Sunita ji, do you have this crimson saree in maroon or deep rani pink? Also please share a short video clip of the zari work on WhatsApp.',
  'whatsapp',
  'Contacted'
),
(
  'b0000000-0000-0000-0000-000000000003',
  'c0000000-0000-0000-0000-000000000007',
  'Karthik Rao',
  'karthik.rao@techcorp.in',
  '+91 99801 44321',
  'Hello! We are looking to buy 15 units of the brass peacock diya for our Diwali office gifting in Koramangala. Is bulk discount available?',
  'call',
  'New'
);

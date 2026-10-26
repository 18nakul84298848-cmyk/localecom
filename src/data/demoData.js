// ==============================================================================
// DukaanConnect: Curated Indian Retail Demo Data
// Used for default state, initial seed, and interactive demo mode
// ==============================================================================

export const CATEGORIES = [
  { id: 'all', name: 'All Categories', icon: 'Store' },
  { id: 'groceries', name: 'Kirana & Spices', icon: 'ShoppingBag', desc: 'Fresh spices, pulses, cold-pressed oils & dry fruits' },
  { id: 'clothing', name: 'Ethnic Wear & Silks', icon: 'Shirt', desc: 'Handloom sarees, festive kurtas & fabrics' },
  { id: 'home_decor', name: 'Artisan & Pottery', icon: 'Sparkles', desc: 'Clay cookware, brass lamps & handcrafted accents' },
  { id: 'electronics', name: 'Mobiles & Tech', icon: 'Smartphone', desc: 'Fast chargers, durable cables & phone accessories' },
  { id: 'footwear', name: 'Footwear & Leather', icon: 'Footprints', desc: 'Traditional juttis, kolhapuris & daily wear' },
  { id: 'stationery', name: 'Stationery & Books', icon: 'BookOpen', desc: 'Handmade paper diaries, notebooks & art supplies' },
];

export const LOCALITIES = [
  'All Localities',
  'Lajpat Nagar, New Delhi',
  'Godowlia, Varanasi',
  'Koramangala, Bengaluru',
  'T. Nagar, Chennai',
  'Bandra West, Mumbai',
  'Chandni Chowk, Old Delhi'
];

export const INITIAL_SHOPS = [
  {
    id: 'shop-1',
    owner_id: 'seller-1',
    name: 'Sharma Kirana & Organic Spices',
    slug: 'sharma-kirana',
    description: '30-year-old family grocery & authentic Indian spice store in Lajpat Nagar. Fresh stone-ground turmeric, basmati rice, cold-pressed mustard oil, and pure dry fruits.',
    category: 'groceries',
    phone: '+91 98765 43210',
    email: 'sharmakirana@demo.com',
    address: 'Shop 14, Central Market, Lajpat Nagar II',
    locality: 'Lajpat Nagar, New Delhi',
    city: 'New Delhi',
    state: 'Delhi',
    pincode: '110024',
    logo_url: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=200&auto=format&fit=crop&q=80',
    banner_url: 'https://images.unsplash.com/photo-1607344645866-009c320c5ab8?w=1200&auto=format&fit=crop&q=80',
    rating: 4.9,
    reviews_count: 142,
    established_year: 1994,
    is_active: true,
    badges: ['Verified Dukaan', 'Same-Day Local Pickup', 'Family Run'],
  },
  {
    id: 'shop-2',
    owner_id: 'seller-2',
    name: 'Varanasi Silk & Handloom Weaves',
    slug: 'varanasi-silk',
    description: 'Direct master weavers from Banaras. Authentic pure Katan silk sarees, bridal brocades, hand-woven dupattas, and festive kurtas with certified silk marks.',
    category: 'clothing',
    phone: '+91 98111 22334',
    email: 'varanasisilk@demo.com',
    address: 'D 37/42, Godowlia Chowk, Main Bazaar',
    locality: 'Godowlia, Varanasi',
    city: 'Varanasi',
    state: 'Uttar Pradesh',
    pincode: '221001',
    logo_url: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=200&auto=format&fit=crop&q=80',
    banner_url: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=1200&auto=format&fit=crop&q=80',
    rating: 4.8,
    reviews_count: 89,
    established_year: 1982,
    is_active: true,
    badges: ['Certified Handloom', 'Master Artisan', 'Direct Weaver'],
  },
  {
    id: 'shop-3',
    owner_id: 'seller-3',
    name: 'Asha Handcrafted Home & Pottery',
    slug: 'asha-decor',
    description: 'Artisan clay cookware, brass diyas, hand-painted ceramic dinnerware, and terracotta home accents sourced directly from rural craft clusters.',
    category: 'home_decor',
    phone: '+91 99000 88776',
    email: 'ashadecor@demo.com',
    address: '88, 4th Block, 100ft Road, Koramangala',
    locality: 'Koramangala, Bengaluru',
    city: 'Bengaluru',
    state: 'Karnataka',
    pincode: '560034',
    logo_url: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=200&auto=format&fit=crop&q=80',
    banner_url: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=1200&auto=format&fit=crop&q=80',
    rating: 4.9,
    reviews_count: 67,
    established_year: 2018,
    is_active: true,
    badges: ['Eco Friendly', 'Artisan Direct', '100% Lead-Free'],
  },
  {
    id: 'shop-4',
    owner_id: 'seller-4',
    name: 'Apex Mobile & Smart Tech Hub',
    slug: 'apex-gadgets',
    description: 'Your neighborhood technology stop. Original mobile cases, fast charging adapters, Bluetooth neckbands, screen protectors, and smart accessories with warranty.',
    category: 'electronics',
    phone: '+91 98222 33445',
    email: 'apexgadgets@demo.com',
    address: 'Shop 22, Ranganathan Street, T. Nagar',
    locality: 'T. Nagar, Chennai',
    city: 'Chennai',
    state: 'Tamil Nadu',
    pincode: '600017',
    logo_url: 'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=200&auto=format&fit=crop&q=80',
    banner_url: 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=1200&auto=format&fit=crop&q=80',
    rating: 4.7,
    reviews_count: 210,
    established_year: 2012,
    is_active: true,
    badges: ['Instant Replacement', 'Original Spares', 'Tech Support'],
  }
];

export const INITIAL_PRODUCTS = [
  {
    id: 'prod-1',
    shop_id: 'shop-1',
    shop_name: 'Sharma Kirana & Organic Spices',
    shop_slug: 'sharma-kirana',
    shop_locality: 'Lajpat Nagar, New Delhi',
    shop_phone: '+91 98765 43210',
    title: 'Organic Lakadong Turmeric Powder (500g)',
    description: 'High-curcumin (7.5%+) unpolished turmeric ground using traditional stone chakki in small batches. No artificial color, intense aromatic flavor and natural immunity booster. Sourced directly from pristine farms in Meghalaya.',
    category: 'groceries',
    price: 280,
    original_price: 350,
    stock: 45,
    is_active: true,
    is_featured: true,
    images: [
      'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=600&auto=format&fit=crop&q=80'
    ],
    tags: ['organic', 'spice', 'immunity', 'haldi', 'curcumin'],
    specifications: {
      'Weight': '500g',
      'Curcumin Content': '7.5% Min',
      'Processing': 'Cold stone milled',
      'Shelf Life': '12 Months'
    },
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: 'prod-2',
    shop_id: 'shop-1',
    shop_name: 'Sharma Kirana & Organic Spices',
    shop_slug: 'sharma-kirana',
    shop_locality: 'Lajpat Nagar, New Delhi',
    shop_phone: '+91 98765 43210',
    title: 'Cold-Pressed Mustard Oil - Kachi Ghani (1 Litre)',
    description: 'Authentic wood-pressed raw mustard oil extracted at room temperature. Retains original pungency, omega-3 fatty acids, and natural antioxidants. Poured into reusable glass bottles.',
    category: 'groceries',
    price: 240,
    original_price: 290,
    stock: 30,
    is_active: true,
    is_featured: false,
    images: [
      'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=600&auto=format&fit=crop&q=80'
    ],
    tags: ['cold-pressed', 'oil', 'kachi ghani', 'cooking', 'healthy'],
    specifications: {
      'Volume': '1 Litre',
      'Extraction': 'Kolhu Wood Pressed',
      'Container': 'Glass Bottle'
    },
    created_at: new Date(Date.now() - 86400000 * 4).toISOString(),
  },
  {
    id: 'prod-3',
    shop_id: 'shop-1',
    shop_name: 'Sharma Kirana & Organic Spices',
    shop_slug: 'sharma-kirana',
    shop_locality: 'Lajpat Nagar, New Delhi',
    shop_phone: '+91 98765 43210',
    title: 'Premium Kashmiri Mamra Almonds (250g)',
    description: '100% natural, pesticide-free Kashmiri Mamra badam. High oil content, sweet nutty taste, hand-sorted for quality and packed in airtight ziplock pouch.',
    category: 'groceries',
    price: 650,
    original_price: 750,
    stock: 20,
    is_active: true,
    is_featured: true,
    images: [
      'https://images.unsplash.com/photo-1508061252445-5350f3ab0a55?w=600&auto=format&fit=crop&q=80'
    ],
    tags: ['dryfruits', 'almonds', 'kashmir', 'mamra', 'healthy snack'],
    specifications: {
      'Origin': 'Pulwama, Kashmir',
      'Grade': 'A+ Select Mamra',
      'Net Weight': '250g'
    },
    created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
  },
  {
    id: 'prod-4',
    shop_id: 'shop-2',
    shop_name: 'Varanasi Silk & Handloom Weaves',
    shop_slug: 'varanasi-silk',
    shop_locality: 'Godowlia, Varanasi',
    shop_phone: '+91 98111 22334',
    title: 'Royal Crimson Banarasi Katan Silk Saree',
    description: 'Hand-loomed in Varanasi over 18 days of dedicated weaver craftsmanship. Intricate golden zari floral jaal with traditional meenakari borders. Comes with matching unstitched blouse piece and Silk Mark tag.',
    category: 'clothing',
    price: 4899,
    original_price: 6500,
    stock: 8,
    is_active: true,
    is_featured: true,
    images: [
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=600&auto=format&fit=crop&q=80'
    ],
    tags: ['saree', 'banarasi', 'wedding', 'silk', 'handloom'],
    specifications: {
      'Fabric': '100% Pure Katan Silk',
      'Zari': 'Golden Brocade',
      'Length': '6.3 Meters (incl. blouse)',
      'Certification': 'Govt Silk Mark'
    },
    created_at: new Date(Date.now() - 86400000 * 1).toISOString(),
  },
  {
    id: 'prod-5',
    shop_id: 'shop-2',
    shop_name: 'Varanasi Silk & Handloom Weaves',
    shop_slug: 'varanasi-silk',
    shop_locality: 'Godowlia, Varanasi',
    shop_phone: '+91 98111 22334',
    title: 'Indigo Chanderi Handblock Kurta Set',
    description: 'Pure breathable cotton-silk blend Chanderi kurta featuring traditional Dabu mud resist block prints. Includes pants and sheer kota doria dupatta with tasselled edges.',
    category: 'clothing',
    price: 2250,
    original_price: 2900,
    stock: 15,
    is_active: true,
    is_featured: false,
    images: [
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=600&auto=format&fit=crop&q=80'
    ],
    tags: ['kurta', 'indigo', 'ethnic', 'handblock', 'summer wear'],
    specifications: {
      'Fabric': 'Chanderi Cotton-Silk',
      'Sizes Available': 'S, M, L, XL, XXL',
      'Care': 'Gentle Hand Wash'
    },
    created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
  {
    id: 'prod-6',
    shop_id: 'shop-3',
    shop_name: 'Asha Handcrafted Home & Pottery',
    shop_slug: 'asha-decor',
    shop_locality: 'Koramangala, Bengaluru',
    shop_phone: '+91 99000 88776',
    title: 'Handcrafted Terracotta Chai Kulhad Set (Pack of 6)',
    description: 'Traditional clay cups thrown on potter wheels in Ramanagara. Adds earthy aroma (sondhi khushboo) to masala chai. Oven safe and microwave friendly for daily warm drinks.',
    category: 'home_decor',
    price: 380,
    original_price: 450,
    stock: 25,
    is_active: true,
    is_featured: true,
    images: [
      'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&auto=format&fit=crop&q=80'
    ],
    tags: ['terracotta', 'kulhad', 'pottery', 'tea', 'artisan'],
    specifications: {
      'Quantity': 'Set of 6 Cups',
      'Capacity': '150ml each',
      'Material': 'Natural River Clay'
    },
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: 'prod-7',
    shop_id: 'shop-3',
    shop_name: 'Asha Handcrafted Home & Pottery',
    shop_slug: 'asha-decor',
    shop_locality: 'Koramangala, Bengaluru',
    shop_phone: '+91 99000 88776',
    title: 'Vintage Hand-Engraved Brass Peacock Diya',
    description: 'Heavy solid brass ornamental oil lamp featuring intricate peacock motif. Handcrafted by heritage metal artisans. Ideal for living room shrines or festive Diwali decor.',
    category: 'home_decor',
    price: 1250,
    original_price: 1600,
    stock: 12,
    is_active: true,
    is_featured: false,
    images: [
      'https://images.unsplash.com/photo-1605883746313-67b886b69162?w=600&auto=format&fit=crop&q=80'
    ],
    tags: ['brass', 'diya', 'peacock', 'festive', 'traditional decor'],
    specifications: {
      'Weight': '850 grams',
      'Material': 'Pure Bell Brass',
      'Height': '8 Inches'
    },
    created_at: new Date(Date.now() - 86400000 * 6).toISOString(),
  },
  {
    id: 'prod-8',
    shop_id: 'shop-4',
    shop_name: 'Apex Mobile & Smart Tech Hub',
    shop_slug: 'apex-gadgets',
    shop_locality: 'T. Nagar, Chennai',
    shop_phone: '+91 98222 33445',
    title: '65W GaN Fast Charger with Dual Type-C Ports',
    description: 'Compact next-gen gallium nitride charger. Supports Power Delivery 3.0, Quick Charge 4+, and laptop charging. Overheat protection with 1-year local replacement warranty.',
    category: 'electronics',
    price: 1499,
    original_price: 1999,
    stock: 35,
    is_active: true,
    is_featured: true,
    images: [
      'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=600&auto=format&fit=crop&q=80'
    ],
    tags: ['charger', 'fast charging', 'gan', 'type-c', 'mobile accessories'],
    specifications: {
      'Total Output': '65W Max',
      'Ports': '2x USB-C + 1x USB-A',
      'Warranty': '1 Year Doorstep Replacement'
    },
    created_at: new Date(Date.now() - 86400000 * 1).toISOString(),
  },
  {
    id: 'prod-9',
    shop_id: 'shop-4',
    shop_name: 'Apex Mobile & Smart Tech Hub',
    shop_slug: 'apex-gadgets',
    shop_locality: 'T. Nagar, Chennai',
    shop_phone: '+91 98222 33445',
    title: 'Braided Heavy-Duty 2M Fast Charging Cable',
    description: 'Military-grade nylon braided cable with reinforced aluminum connectors. Supports 100W PD and fast data sync. Tangle-free design tested for 20,000+ bends.',
    category: 'electronics',
    price: 399,
    original_price: 599,
    stock: 60,
    is_active: true,
    is_featured: false,
    images: [
      'https://images.unsplash.com/photo-1585338107529-13afc5f02586?w=600&auto=format&fit=crop&q=80'
    ],
    tags: ['cable', 'braided', 'fast charge', 'durable', 'gadgets'],
    specifications: {
      'Length': '2 Meters',
      'Speed': '100W PD / 480Mbps',
      'Connector': 'Type-C to Type-C'
    },
    created_at: new Date(Date.now() - 86400000 * 7).toISOString(),
  }
];

export const INITIAL_ENQUIRIES = [
  {
    id: 'enq-1',
    shop_id: 'shop-1',
    product_id: 'prod-1',
    product_title: 'Organic Lakadong Turmeric Powder (500g)',
    customer_name: 'Priya Malhotra',
    customer_email: 'priya.m@gmail.com',
    customer_phone: '+91 98991 12233',
    message: 'Hi Sharma ji, I need 5 packs of the Lakadong Turmeric for our family wedding gift hampers. Can you deliver to Block D Lajpat Nagar today?',
    contact_preference: 'whatsapp',
    status: 'New',
    created_at: new Date(Date.now() - 3600000 * 3).toISOString(),
  },
  {
    id: 'enq-2',
    shop_id: 'shop-1',
    product_id: 'prod-2',
    product_title: 'Cold-Pressed Mustard Oil - Kachi Ghani (1 Litre)',
    customer_name: 'Rajesh Verma',
    customer_email: 'rajesh.v@yahoo.com',
    customer_phone: '+91 98102 77665',
    message: 'Do you offer monthly subscription for 5 Litres of mustard oil? Please call me in the evening after 6 PM.',
    contact_preference: 'call',
    status: 'Contacted',
    created_at: new Date(Date.now() - 3600000 * 20).toISOString(),
  },
  {
    id: 'enq-3',
    shop_id: 'shop-2',
    product_id: 'prod-4',
    product_title: 'Royal Crimson Banarasi Katan Silk Saree',
    customer_name: 'Aditi Sen',
    customer_email: 'aditi.sen@outlook.com',
    customer_phone: '+91 97480 55667',
    message: 'Namaste Sunita ji, do you have this crimson saree in maroon or deep rani pink? Also please share a short video clip of the zari work on WhatsApp.',
    contact_preference: 'whatsapp',
    status: 'Contacted',
    created_at: new Date(Date.now() - 86400000 * 1).toISOString(),
  },
  {
    id: 'enq-4',
    shop_id: 'shop-3',
    product_id: 'prod-7',
    product_title: 'Vintage Hand-Engraved Brass Peacock Diya',
    customer_name: 'Karthik Rao',
    customer_email: 'karthik.rao@techcorp.in',
    customer_phone: '+91 99801 44321',
    message: 'Hello! We are looking to buy 15 units of the brass peacock diya for our Diwali office gifting in Koramangala. Is bulk discount available?',
    contact_preference: 'call',
    status: 'New',
    created_at: new Date(Date.now() - 3600000 * 5).toISOString(),
  }
];

// Helper to format Indian Rupee prices
export const formatINR = (amount) => {
  if (amount === undefined || amount === null) return '₹0';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
};

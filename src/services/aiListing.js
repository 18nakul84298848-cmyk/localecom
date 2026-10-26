// ==============================================================================
// DukaanConnect: AI Product Listing Assistant Service
// Calls Claude via Supabase Edge Function or uses a high-fidelity local generator
// ==============================================================================

import { supabase, isSupabaseConfigured } from '../lib/supabase';

// High-fidelity local generation rules when live Anthropic key is not connected
const generateLocalFallbackListing = ({
  productName,
  category,
  specifications = '',
  _targetAudience = 'Neighbourhood retail shoppers',
  language = 'English',
  sellingPoints = ''
}) => {
  const cleanName = productName.trim();
  const specsList = specifications ? specifications.split(/[,;\n]/).map(s => s.trim()).filter(Boolean) : [];
  
  let title = '';
  let description = '';
  let shortCaption = '';
  let whatsappMessage = '';
  let keywords = [];

  // Tailored title generation
  const prefix = sellingPoints ? `${sellingPoints.split(/[,.]/)[0].trim()} ` : '';
  title = `${prefix}${cleanName} - Authentic ${category.charAt(0).toUpperCase() + category.slice(1)}`.slice(0, 75);

  // Structured descriptions
  if (language === 'Hindi' || language === 'Hinglish') {
    description = `Hamare paas uplabdh hai premium aur authentic ${cleanName}. Yeh vishesh roop se local dukaan ki bharosemand quality aur kifaayati daam par uplabdh hai.\n\n` +
      `Khaas Baatein:\n` +
      `• Shuddh evam authentic local quality\n` +
      (specsList.length > 0 ? specsList.map(s => `• ${s}`).join('\n') + '\n' : '• Har piece ko dhyan se check kiya gaya hai\n') +
      (sellingPoints ? `• ${sellingPoints}\n\n` : '\n') +
      `Apne paas ke local dukaan se khareedein aur local karigaron ka samarthan karein. Dukaan par aakar dekhein ya turant WhatsApp par enquiry karein.`;
    
    shortCaption = `✨ Ab hamari dukaan par uplabdh: ${cleanName}! Shuddh quality, seedha aapke neighbourhood se. DM ya WhatsApp karein! 🛍️ #LocalDukaan #${category}`;
    
    whatsappMessage = `*Namaste! Naya Collection Dukaan par Aagaya Hai!* 🌟\n\n` +
      `📦 *${cleanName}*\n` +
      `🏷️ *Category:* ${category}\n` +
      (specsList.length > 0 ? `✨ *Features:*\n${specsList.map(s => `  - ${s}`).join('\n')}\n` : '') +
      `\n📍 *Local Pickup & Fast Home Delivery uplabdh!*\n` +
      `💬 Reply karein order karne ya details jaan-ne ke liye.`;
  } else {
    description = `Experience the unmatched quality and authentic craftsmanship of our ${cleanName}. Carefully curated by our local family-run shop to ensure the finest standards for our neighbourhood patrons.\n\n` +
      `Key Highlights:\n` +
      `• Premium quality directly from trusted local artisans and suppliers\n` +
      (specsList.length > 0 ? specsList.map(s => `• ${s}`).join('\n') + '\n' : '• Checked individually for perfection and durability\n') +
      (sellingPoints ? `• ${sellingPoints}\n\n` : '\n') +
      `Support local neighbourhood commerce. Visit our store to experience it in person, or send a quick enquiry right here for doorstep delivery.`;
    
    shortCaption = `Fresh arrival at our local store: ${cleanName}! Authentic quality you can trust. Tap the link to view details or WhatsApp us! 🛍️✨ #ShopLocal #DukaanConnect #${category}`;
    
    whatsappMessage = `*Namaste! New Arrival at our Store!* 🌟\n\n` +
      `📦 *Product:* ${cleanName}\n` +
      `📂 *Category:* ${category}\n` +
      (specsList.length > 0 ? `✨ *Key Specs:*\n${specsList.map(s => `  • ${s}`).join('\n')}\n` : '') +
      `💰 *Price:* Check link below for today's special local price!\n` +
      `📍 *Same-Day Local Pickup & Delivery Available*\n\n` +
      `💬 Reply to this message to hold or order your piece!`;
  }

  // Keywords
  const baseWords = cleanName.toLowerCase().split(/\s+/).filter(w => w.length > 2);
  keywords = Array.from(new Set([
    ...baseWords,
    category.toLowerCase(),
    'local store',
    'authentic',
    'near me',
    'handcrafted'
  ])).slice(0, 7);

  return {
    title,
    description,
    keywords,
    shortCaption,
    whatsappMessage,
  };
};

export const aiListingService = {
  // Generate product listing
  async generateListing(params) {
    const { productName, category } = params;
    if (!productName || !category) {
      throw new Error('Product name and category are required to generate listing.');
    }

    // If Supabase is configured, attempt Edge Function invocation
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.functions.invoke('generate-listing', {
          body: params,
        });

        if (error) {
          console.warn('Edge function error, switching to labelled fallback:', error);
          const fallbackData = generateLocalFallbackListing(params);
          return {
            success: true,
            data: fallbackData,
            source: 'local-fallback',
            message: 'Generated using local AI listing engine (Supabase Edge Function was unavailable).',
          };
        }

        if (data?.data) {
          return {
            success: true,
            data: data.data,
            source: 'claude-api',
            message: 'Generated live via Anthropic Claude 3.5 Sonnet Edge Function.',
          };
        }
      } catch (err) {
        console.warn('Direct invoke failed, using local engine:', err.message);
      }
    }

    // Local Fallback Generator (clearly labeled)
    // Add realistic 800ms generation delay for natural UX
    await new Promise(r => setTimeout(r, 800));
    const fallbackData = generateLocalFallbackListing(params);

    return {
      success: true,
      data: fallbackData,
      source: 'local-fallback',
      message: 'Generated using DukaanConnect Local Listing Engine (Claude API secret not configured).',
    };
  }
};

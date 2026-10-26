// ==============================================================================
// DukaanConnect: Supabase Edge Function for Claude 3.5 Sonnet
// Modern native Deno.serve with Supabase Edge Runtime type definitions
// ==============================================================================

// @ts-ignore: Deno global is provided by the Supabase Edge Runtime environment
declare const Deno: {
  env: {
    get(key: string): string | undefined;
  };
  serve: (handler: (req: Request) => Promise<Response> | Response) => void;
};

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

interface RequestPayload {
  productName: string;
  category: string;
  specifications?: string;
  targetAudience?: string;
  language?: string;
  sellingPoints?: string;
}

Deno.serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const apiKey = Deno.env.get("ANTHROPIC_API_KEY");
    if (!apiKey) {
      return new Response(
        JSON.stringify({
          error: "ANTHROPIC_API_KEY is not configured on Supabase Edge Function secrets.",
          isConfigured: false,
        }),
        {
          status: 503,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const payload: RequestPayload = await req.json();
    const { productName, category, specifications, targetAudience, language, sellingPoints } = payload;

    if (!productName || !category) {
      return new Response(
        JSON.stringify({ error: "Product name and category are required." }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const selectedLang = language || "English";
    const audience = targetAudience || "Neighbourhood retail shoppers and families";
    const specs = specifications || "Standard artisanal quality";
    const highlights = sellingPoints || "Authentic local quality, direct from shop";

    const systemPrompt = `You are an expert Indian retail marketing and e-commerce copywriter for "DukaanConnect". 
Your mission is to empower local brick-and-mortar Indian shopkeepers (kirana stores, handloom weavers, boutique owners, pottery artisans, local electronics dealers) to compete with large e-commerce giants.
You craft authentic, warm, high-converting product listings that build trust with neighbourhood customers.
Rules:
1. Output MUST be valid JSON matching the exact schema provided.
2. NEVER invent fake warranties, medical claims, misleading certifications, or false discounts.
3. Write naturally in the requested language/dialect (e.g., Hinglish, English, Hindi).
4. Emphasize local authenticity, freshness, handcrafted charm, or genuine customer service.`;

    const userPrompt = `Generate a complete digital catalog listing for this local product:
- Product Name: ${productName}
- Category: ${category}
- Key Specifications / Details: ${specs}
- Unique Selling Points: ${highlights}
- Target Audience: ${audience}
- Language / Tone: ${selectedLang}

Return a valid JSON object with EXACTLY these keys:
{
  "title": "A crisp, SEO-optimized title (max 75 characters) with key attributes",
  "description": "Engaging 2-3 paragraph product description highlighting craftsmanship/quality, benefits, and local pride",
  "keywords": ["5 to 8 search tags relevant for local Indian buyers and marketplace search"],
  "shortCaption": "A punchy social media caption (Instagram/Facebook) with emojis and hashtags (under 200 chars)",
  "whatsappMessage": "A ready-to-send WhatsApp broadcast text formatted with bold headings, bullet points, price placeholder [₹XXX], and friendly call-to-action like 'Reply to order / visit our shop in [Locality]'"
}`;

    const anthropicResponse = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-3-5-sonnet-20241022",
        max_tokens: 1024,
        temperature: 0.7,
        system: systemPrompt,
        messages: [{ role: "user", content: userPrompt }],
      }),
    });

    if (!anthropicResponse.ok) {
      const errText = await anthropicResponse.text();
      console.error("Anthropic API Error:", errText);
      return new Response(
        JSON.stringify({
          error: `Anthropic API responded with error: ${anthropicResponse.status}`,
          details: errText,
        }),
        {
          status: anthropicResponse.status,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const data = await anthropicResponse.json();
    const rawContent = data.content?.[0]?.text || "{}";

    // Extract JSON block if surrounded by markdown fences
    let jsonString = rawContent.trim();
    if (jsonString.startsWith("```json")) {
      jsonString = jsonString.slice(7);
    } else if (jsonString.startsWith("```")) {
      jsonString = jsonString.slice(3);
    }
    if (jsonString.endsWith("```")) {
      jsonString = jsonString.slice(0, -3);
    }
    jsonString = jsonString.trim();

    const parsedOutput = JSON.parse(jsonString);

    return new Response(
      JSON.stringify({
        success: true,
        data: parsedOutput,
        source: "claude-api",
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (err: any) {
    console.error("Function Handler Error:", err);
    return new Response(
      JSON.stringify({
        error: err.message || "Internal server error occurred while generating listing.",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});

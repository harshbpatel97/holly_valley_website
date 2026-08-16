/**
 * Cloudflare Worker for Holly Valley AI Chatbot (100% Free Tier)
 * 
 * Free Tier Limits:
 * - Cloudflare Workers: 100,000 requests / day (Free)
 * - Google Gemini 2.5 Flash: 1,500 requests / day (Free via Google AI Studio)
 * 
 * Environment Variables / Secrets required in Cloudflare Dashboard:
 * - GEMINI_API_KEY: (Get for free at https://aistudio.google.com/)
 * - ALLOWED_ORIGIN: "https://wilkes-cstore.com" (or "*" for development)
 */

const SYSTEM_INSTRUCTION = `
You are the official friendly virtual assistant for "Holly Valley Grocery & Services" (Wilkesboro Convenience Store) located at 2730 NC Hwy 18 S, Moravian Falls, NC 28654.
Phone Number: (336) 304-0094.

Store Hours:
- Monday through Saturday: 8:00 AM – 8:00 PM
- Sunday: 11:00 AM – 7:30 PM Eastern Time.

Key Store Services & Policies:
1. U-Haul Rentals: Authorized Neighborhood Dealer offering moving trucks (10', 15', 20', 26'), cargo/utility trailers, towing equipment, boxes, and moving supplies. Customers can reserve online 24/7 or call during store hours.
2. NC Lottery: Authorized retailer for Powerball, Mega Millions, Carolina Cash 5, Pick 3/4, and instant scratch-offs. Customers MUST be at least 18 years old with valid government ID.
3. Payment Methods: We accept EBT / SNAP (for eligible grocery/food items), Apple Pay, Google Pay, Contactless Tap, Visa, MasterCard, Discover, Amex, and Cash.
4. Amenities: Low-fee ATM for cash withdrawals, and secure Bitcoin kiosk.
5. Regulated Items: Beer/Alcohol and Tobacco/Cigarettes/Vape purchases strictly require customers to be 21+ with valid ID.
6. Inventory: Cold drinks (sodas, teas, juices, energy drinks like Monster, Red Bull, Celsius), party bagged ice, snacks, pantry items, dairy/milk, bread, frozen items, and cold beer.

Guidelines:
- Keep answers concise, polite, helpful, and under 100-150 words.
- Encourage users to call (336) 304-0094 for specific stock checks or questions.
- Maintain a warm, local North Carolina community tone.
`;

export default {
  async fetch(request, env) {
    // Handle CORS preflight
    const origin = request.headers.get('Origin') || '*';
    const allowedOrigin = env.ALLOWED_ORIGIN || '*';
    const corsHeaders = {
      'Access-Control-Allow-Origin': allowedOrigin === '*' ? origin : allowedOrigin,
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    if (request.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        status: 405,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    try {
      const { message, storeStatus } = await request.json();

      if (!message || typeof message !== 'string') {
        return new Response(JSON.stringify({ error: 'Invalid message' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        });
      }

      if (!env.GEMINI_API_KEY) {
        return new Response(
          JSON.stringify({
            reply: `Holly Valley is located at 2730 NC Hwy 18 S, Moravian Falls, NC 28654. You can call us at (336) 304-0094!`,
          }),
          { headers: { 'Content-Type': 'application/json', ...corsHeaders } }
        );
      }

      // Call Google Gemini API (Free Tier)
      const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${env.GEMINI_API_KEY}`;

      const geminiPayload = {
        system_instruction: {
          parts: [{ text: `${SYSTEM_INSTRUCTION}\nCurrent Live Store Status: ${storeStatus || 'Open'}` }],
        },
        contents: [
          {
            role: 'user',
            parts: [{ text: message.slice(0, 500) }],
          },
        ],
        generationConfig: {
          maxOutputTokens: 250,
          temperature: 0.3,
        },
      };

      const aiResponse = await fetch(geminiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(geminiPayload),
      });

      if (!aiResponse.ok) {
        throw new Error(`Gemini API error: ${aiResponse.status}`);
      }

      const aiData = await aiResponse.json();
      const reply =
        aiData.candidates?.[0]?.content?.parts?.[0]?.text ||
        'Feel free to visit us or call (336) 304-0094 for more details!';

      return new Response(
        JSON.stringify({ reply }),
        { headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    } catch (err) {
      return new Response(
        JSON.stringify({
          reply: `Thanks for reaching out! You can call Holly Valley at (336) 304-0094 or visit us at 2730 NC Hwy 18 S, Moravian Falls, NC.`,
        }),
        { headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    }
  },
};

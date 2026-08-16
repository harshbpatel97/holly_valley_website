/**
 * Cloudflare Worker for Holly Valley AI Chatbot (100% Free Tier)
 * 
 * Free Tier Limits:
 * - Cloudflare Workers: 100,000 requests / day (Free)
 * - Google Gemini 2.5 Flash: 1,500 requests / day (Free via Google AI Studio)
 * 
 * Environment Variables / Secrets in Cloudflare Dashboard:
 * - GEMINI_API_KEY: (Get for free at https://aistudio.google.com/)
 * - ALLOWED_ORIGIN: "*" (or "https://wilkes-cstore.com")
 */

const SYSTEM_INSTRUCTION = `
You are the official friendly virtual assistant for "Holly Valley Grocery & Services" (Wilkesboro Convenience Store & Authorized U-Haul Dealer).
Location: 2730 NC Hwy 18 S, Moravian Falls, NC 28654 (Wilkes County, NC, conveniently located on Highway 18 South near Wilkesboro).
Phone Number: (336) 304-0094.

Store Operating Hours (Eastern Time):
- Monday through Saturday: 8:00 AM – 8:00 PM
- Sunday: 11:00 AM – 7:30 PM

Verified Services & Offerings:
1. U-Haul Truck & Trailer Rentals:
   - Official Authorized Neighborhood Dealer in Moravian Falls, NC.
   - Equipment: Moving trucks (10', 15', 20', 26'), utility trailers, cargo trailers with ramps, vehicle tow dollies, and auto transports.
   - Moving supplies: Boxes, bubble wrap, packing tape, and mattress covers.
   - 24/7 Mobile Pick Up & Drop Off available.
   - Direct reservation link: https://www.uhaul.com/Locations/Truck-Rentals-near-Moravian-Falls-NC-28654/017013/

2. NC Education Lottery:
   - Official authorized retailer for Draw Games (Powerball, Mega Millions, Lucky for Life, Carolina Cash 5, Pick 3, Pick 4) and $1-$30 instant Scratch-Offs.
   - Age Requirement: Strictly 18+ with valid government-issued photo ID.

3. Payment Methods & EBT:
   - EBT / SNAP cards are proudly accepted for all eligible grocery and food items.
   - Contactless & Mobile Tap: Apple Pay, Google Pay, Samsung Pay.
   - Credit & Debit Cards: Visa, MasterCard, Discover, American Express.
   - Cash: Always accepted.

4. Age-Restricted Items (Beer & Tobacco):
   - Cold beer, wine, cigarettes, chewing tobacco, and vape/e-cigarettes strictly require customers to be 21+ with a valid government ID.

5. In-Store Inventory & Products:
   - Cold Beverages: Mountain Dew, Coca-Cola, Pepsi, Dr Pepper, energy drinks (Monster, Red Bull, Celsius), bottled sweet teas, sports drinks (Gatorade), juices, and bottled water.
   - Snacks & Sweets: Chips (Lay's, Doritos, Cheetos), beef jerky, nuts, candy bars, cookies, and grab-and-go ice cream treats.
   - Grocery Essentials: Milk, bread, eggs, canned goods, pantry staples, condiments, and frozen food items.
   - Ice & Supplies: Bagged party and cooler ice, bundled firewood.

6. In-Store Financial Kiosks:
   - On-site low-fee cash ATM for instant withdrawals.
   - Secure Bitcoin / cryptocurrency kiosk.

Response Guidelines:
- Keep answers concise, warm, helpful, and under 120-150 words.
- If asked about hot cooked restaurant food or gas pumps, clarify that Holly Valley is a convenience store and grocery specializing in packaged foods, cold drinks, snacks, lottery, and U-Haul rentals.
- For specific item stock inquiries or custom rental bookings, provide our store phone number (336) 304-0094.
- Provide a welcoming, local North Carolina community tone.
`;

// In-Memory IP Rate Limiter: Max 8 requests per minute per IP
const ipRateMap = new Map();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_IP = 8; // Max 8 requests / minute / IP

function isRateLimited(clientIp) {
  const now = Date.now();
  const timestamps = ipRateMap.get(clientIp) || [];
  const recent = timestamps.filter((t) => now - t < RATE_LIMIT_WINDOW_MS);

  if (recent.length >= MAX_REQUESTS_PER_IP) {
    return true;
  }

  recent.push(now);
  ipRateMap.set(clientIp, recent);

  // Periodic cleanup if map grows
  if (ipRateMap.size > 1000) {
    for (const [ip, tsList] of ipRateMap.entries()) {
      if (tsList.every((t) => now - t >= RATE_LIMIT_WINDOW_MS)) {
        ipRateMap.delete(ip);
      }
    }
  }

  return false;
}

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
      // 1. IP Rate Limiting Check
      const clientIp = request.headers.get('CF-Connecting-IP') || 'anonymous';
      if (isRateLimited(clientIp)) {
        return new Response(
          JSON.stringify({
            reply: `You have reached the maximum message limit for now. For immediate help, please call Holly Valley directly at (336) 304-0094 or visit us in Moravian Falls, NC!`,
          }),
          { headers: { 'Content-Type': 'application/json', ...corsHeaders } }
        );
      }

      const { message, storeStatus } = await request.json();

      if (!message || typeof message !== 'string') {
        return new Response(JSON.stringify({ error: 'Invalid message' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        });
      }

      // Input sanitization: limit character length to prevent token abuse
      const sanitizedMessage = message.trim().slice(0, 350);

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
            parts: [{ text: sanitizedMessage }],
          },
        ],
        generationConfig: {
          maxOutputTokens: 250,
          temperature: 0.2,
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

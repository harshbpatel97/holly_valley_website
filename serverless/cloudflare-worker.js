/**
 * Cloudflare Worker for Holly Valley Generative AI Assistant (100% Free Tier)
 * 
 * Free Tier Limits:
 * - Cloudflare Workers: 100,000 requests / day (Free)
 * - Google Gemini 1.5 Flash: 1,500 requests / day (Free via Google AI Studio)
 * 
 * Environment Variables / Secrets in Cloudflare Dashboard:
 * - GEMINI_API_KEY: (Get for free at https://aistudio.google.com/)
 * - ALLOWED_ORIGIN: "*" (or "https://wilkes-cstore.com")
 */

const STORE_INFO = {
  name: 'Holly Valley Grocery & Services',
  address: '2730 NC Hwy 18 S, Moravian Falls, NC 28654',
  phone: '(336) 304-0094',
  uhaulUrl: 'https://www.uhaul.com/Locations/Truck-Rentals-near-Moravian-Falls-NC-28654/017013/',
};

const SYSTEM_INSTRUCTION = `
You are the official AI assistant for "Holly Valley Grocery & Services" (Wilkesboro / Moravian Falls Convenience Store & Authorized U-Haul Dealer).
Location: 2730 NC Hwy 18 S, Moravian Falls, NC 28654 (conveniently located on NC Hwy 18 South in Wilkes County, near Wilkesboro and the Blue Ridge foothills).
Phone Number: (336) 304-0094.

Store Operating Hours (Eastern Time):
- Monday through Saturday: 8:00 AM – 8:00 PM
- Sunday: 11:00 AM – 7:30 PM

Verified Services & In-Store Offerings:
1. U-Haul Truck & Trailer Rentals:
   - Official Authorized Neighborhood Dealer in Moravian Falls, NC.
   - Moving trucks (10', 15', 20', 26'), utility trailers, cargo trailers with ramps, tow dollies, and auto transports.
   - Moving supplies: Boxes, tape, bubble wrap, mattress covers.
   - 24/7 Mobile Pick Up & Drop Off available online at: ${STORE_INFO.uhaulUrl}
   - In-store counter reservations during store hours or by phone at (336) 304-0094.

2. NC Education Lottery:
   - Official authorized retailer for Draw Games (Powerball, Mega Millions, Lucky for Life, Carolina Cash 5, Pick 3 & 4) and $1-$30 instant Scratch-Offs.
   - Age Requirement: Strictly 18+ with valid government-issued photo ID.

3. Payment Methods & EBT:
   - EBT / SNAP cards are proudly accepted for all eligible grocery and food items.
   - Contactless / NFC: Apple Pay, Google Pay, Samsung Pay.
   - Credit & Debit Cards: Visa, MasterCard, Discover, American Express.
   - Cash: Always accepted.

4. Age-Restricted Items (Beer & Tobacco):
   - Cold beer, wine, cigarettes, chewing tobacco, and vape/e-cigarettes strictly require customers to be 21+ with valid government ID.

5. Inventory & Products:
   - Cold Beverages: Mountain Dew, Coca-Cola, Pepsi, Dr Pepper, Sprite, energy drinks (Monster, Red Bull, Celsius, Reign), sweet teas (Arizona, Gold Peak), Gatorade, Powerade, juices, milk, and bottled water.
   - Snacks & Sweets: Chips (Lay's, Doritos, Cheetos), beef jerky, peanuts/nuts, candy bars, cookies, and grab-and-go ice cream treats.
   - Groceries: Bread, milk, eggs, canned goods, pantry staples, condiments, and frozen food items/pizzas.
   - Ice & Camping/Outdoor: Bagged party and cooler ice, bundled firewood.

6. Financial Services:
   - On-site low-fee cash ATM for instant withdrawals.
   - Secure Bitcoin / cryptocurrency kiosk.

Conversational Guidelines:
- Tone: Friendly, natural, polite, welcoming, and helpful (warm North Carolina community hospitality).
- Keep answers direct, concise (2 to 5 sentences or short bullet points), and conversational.
- Be naturally helpful: if a customer asks for recommendations (e.g. for a picnic, camping trip, or road trip snack), dynamically suggest relevant items we carry (like cold drinks, chips, beef jerky, ice, or firewood).
- If asked about hot cooked restaurant food or gas pumps, clarify that Holly Valley is a convenience store and grocery specializing in packaged snacks, cold drinks, groceries, lottery, and U-Haul rentals.
- When relevant, invite the customer to visit us at 2730 NC Hwy 18 S or call (336) 304-0094.
`;

// In-Memory IP Rate Limiter: Max 10 requests per minute per IP to protect free tier quota
const ipRateMap = new Map();
const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const MAX_REQUESTS_PER_IP = 10;

function isRateLimited(clientIp) {
  const now = Date.now();
  const timestamps = ipRateMap.get(clientIp) || [];
  const recent = timestamps.filter((t) => now - t < RATE_LIMIT_WINDOW_MS);

  if (recent.length >= MAX_REQUESTS_PER_IP) {
    return true;
  }

  recent.push(now);
  ipRateMap.set(clientIp, recent);

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
    const origin = request.headers.get('Origin') || '*';
    const allowedOrigin = env.ALLOWED_ORIGIN || '*';
    const isAllowed =
      allowedOrigin === '*' ||
      allowedOrigin === origin ||
      origin.includes('localhost') ||
      origin.includes('wilkes-cstore.com') ||
      origin.includes('github.io');

    const corsHeaders = {
      'Access-Control-Allow-Origin': isAllowed ? origin : allowedOrigin,
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
            reply: `You have reached the maximum message limit for now. For immediate assistance, please call Holly Valley directly at (336) 304-0094 or visit us in Moravian Falls, NC!`,
            source: 'rate_limited',
          }),
          { headers: { 'Content-Type': 'application/json', ...corsHeaders } }
        );
      }

      const body = await request.json();
      const message = body.message;
      const history = Array.isArray(body.history) ? body.history : [];
      const storeStatus = body.storeStatus;

      if (!message || typeof message !== 'string') {
        return new Response(JSON.stringify({ error: 'Invalid message' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        });
      }

      // Input sanitization
      const sanitizedMessage = message.trim().slice(0, 400);

      if (!env.GEMINI_API_KEY) {
        return new Response(
          JSON.stringify({
            reply: `Holly Valley is located at 2730 NC Hwy 18 S, Moravian Falls, NC 28654. We are open Mon-Sat 8AM-8PM and Sun 11AM-7:30PM. Feel free to call us at (336) 304-0094!`,
            source: 'no_api_key',
          }),
          { headers: { 'Content-Type': 'application/json', ...corsHeaders } }
        );
      }

      // 2. Build Multi-Turn Chat Contents for Gemini (Must start with role 'user')
      const contents = [];
      let lastRole = null;

      const recentHistory = history.slice(-6);
      for (const item of recentHistory) {
        if (!item.text) continue;
        const role = (item.sender === 'user' || item.role === 'user') ? 'user' : 'model';

        // Gemini requires the first turn to be 'user'
        if (contents.length === 0 && role !== 'user') {
          continue;
        }

        // Avoid consecutive identical roles
        if (role === lastRole) {
          continue;
        }

        contents.push({
          role,
          parts: [{ text: item.text.slice(0, 400) }],
        });
        lastRole = role;
      }

      // Append current user message
      if (lastRole === 'user') {
        contents[contents.length - 1] = {
          role: 'user',
          parts: [{ text: sanitizedMessage }],
        };
      } else {
        contents.push({
          role: 'user',
          parts: [{ text: sanitizedMessage }],
        });
      }

      // 3. Call Google Gemini 1.5 Flash API (Official GA Free Tier Model)
      const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${env.GEMINI_API_KEY}`;

      const geminiPayload = {
        system_instruction: {
          parts: [{ text: `${SYSTEM_INSTRUCTION}\nCurrent Live Store Status: ${storeStatus || 'Open'}` }],
        },
        contents,
        generationConfig: {
          maxOutputTokens: 350,
          temperature: 0.7, // Conversational, warm, and natural
        },
      };

      const aiResponse = await fetch(geminiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(geminiPayload),
      });

      if (!aiResponse.ok) {
        const errorDetails = await aiResponse.text();
        console.error(`Gemini API Error (${aiResponse.status}):`, errorDetails);
        throw new Error(`Gemini API Error (${aiResponse.status}): ${errorDetails}`);
      }

      const aiData = await aiResponse.json();
      const reply =
        aiData.candidates?.[0]?.content?.parts?.[0]?.text ||
        'Feel free to visit us or call (336) 304-0094 for more details!';

      return new Response(
        JSON.stringify({ reply, source: 'gemini' }),
        { headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    } catch (err) {
      console.error('Worker fetch error:', err.message);
      return new Response(
        JSON.stringify({
          reply: `Thanks for reaching out! Holly Valley is located at 2730 NC Hwy 18 S, Moravian Falls, NC. You can call us directly at (336) 304-0094.`,
          source: 'worker_fallback',
          debug_error: err.message,
        }),
        { headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    }
  },
};

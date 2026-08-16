import { getStoreStatus, STORE_SCHEDULE } from '../../utils/storeHours';

export const STORE_INFO = {
  name: 'Holly Valley Grocery & Services',
  tagline: 'Wilkesboro Convenience Store & Authorized U-Haul Dealer',
  address: '2730 NC Hwy 18 S, Moravian Falls, NC 28654',
  phone: '(336) 304-0094',
  phoneClean: '+13363040094',
  uhaulUrl: 'https://www.uhaul.com/Locations/Truck-Rentals-near-Moravian-Falls-NC-28654/017013/',
  googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Holly+Valley,2730+NC+Hwy+18+S,Moravian+Falls,NC+28654',
  appleMapsUrl: 'https://maps.apple.com/?q=Holly+Valley,2730+NC+Hwy+18+S,Moravian+Falls,NC+28654',
};

export const QUICK_ACTIONS = [
  { id: 'hours', label: '🕒 Store Hours & Status', icon: '🕒', prompt: 'Are you open right now?' },
  { id: 'uhaul', label: '🚚 Rent a U-Haul', icon: '🚚', prompt: 'How do I rent a U-Haul truck or trailer?' },
  { id: 'payments', label: '💳 EBT & Payments', icon: '💳', prompt: 'Do you take EBT / SNAP and contactless payments?' },
  { id: 'lottery', label: '🎟️ NC Lottery & Rules', icon: '🎟️', prompt: 'What lottery tickets do you sell and what are the age rules?' },
  { id: 'directions', label: '📍 Location & Directions', icon: '📍', prompt: 'Where is the store located and how do I get there?' },
  { id: 'products', label: '🛒 Groceries & Drinks', icon: '🛒', prompt: 'What kinds of snacks, groceries, and drinks do you carry?' },
];

/**
 * Evaluates user input against instant local knowledge for zero-latency, 100% free responses.
 */
export const getLocalResponse = (query) => {
  const q = query.toLowerCase().trim();

  // Store Hours / Open Status
  if (
    q.includes('hour') ||
    q.includes('open') ||
    q.includes('close') ||
    q.includes('schedule') ||
    q.includes('time') ||
    q.includes('today')
  ) {
    const status = getStoreStatus();
    const currentScheduleText = STORE_SCHEDULE.map(
      (s) => `• **${s.day}**: ${s.text}`
    ).join('\n');

    return {
      text: `**Current Status**: ${status.statusText}\n\n**Weekly Store Schedule (Eastern Time):**\n${currentScheduleText}\n\n*Need immediate assistance? Feel free to call us directly!*`,
      actions: [
        { label: '📞 Call Store', url: `tel:${STORE_INFO.phoneClean}`, isExternal: true },
        { label: '📍 Get Directions', url: STORE_INFO.googleMapsUrl, isExternal: true },
      ],
    };
  }

  // U-Haul Rentals
  if (
    q.includes('uhaul') ||
    q.includes('u-haul') ||
    q.includes('truck') ||
    q.includes('trailer') ||
    q.includes('moving') ||
    q.includes('towing') ||
    q.includes('van') ||
    q.includes('rent')
  ) {
    return {
      text: `Holly Valley is an **Authorized U-Haul Neighborhood Dealer** in Moravian Falls, NC! 🚚\n\n**Available Equipment & Services:**\n• Moving Trucks (10', 15', 20', 26')\n• Cargo & Utility Trailers\n• Tow Dollies & Auto Transports\n• Moving Boxes, Tape & Packing Supplies\n• 24/7 Mobile Pick Up & Drop Off\n\nYou can reserve online 24/7 or call our store during regular hours.`,
      actions: [
        { label: '🚚 Reserve U-Haul Online ↗', url: STORE_INFO.uhaulUrl, isExternal: true },
        { label: '📞 Call (336) 304-0094', url: `tel:${STORE_INFO.phoneClean}`, isExternal: true },
      ],
    };
  }

  // Payments / EBT / SNAP
  if (
    q.includes('ebt') ||
    q.includes('snap') ||
    q.includes('food stamp') ||
    q.includes('payment') ||
    q.includes('credit') ||
    q.includes('card') ||
    q.includes('apple pay') ||
    q.includes('google pay') ||
    q.includes('pay') ||
    q.includes('cash') ||
    q.includes('atm') ||
    q.includes('bitcoin') ||
    q.includes('crypto')
  ) {
    return {
      text: `**Payment Options Accepted at Holly Valley:**\n\n• **EBT / SNAP**: Accepted for all eligible food and grocery items\n• **Contactless / Tap to Pay**: Apple Pay, Google Pay, Samsung Pay\n• **Major Credit & Debit Cards**: Visa, MasterCard, Discover, American Express\n• **Cash**: Always accepted\n• **On-Site ATM**: Low-fee ATM for quick cash withdrawals\n• **Bitcoin Terminal**: Buy and sell cryptocurrency securely in-store`,
      actions: [
        { label: 'Explore Services', url: '/services' },
        { label: '📍 Visit Store', url: STORE_INFO.googleMapsUrl, isExternal: true },
      ],
    };
  }

  // Lottery
  if (
    q.includes('lottery') ||
    q.includes('powerball') ||
    q.includes('mega millions') ||
    q.includes('scratch') ||
    q.includes('scratch-off') ||
    q.includes('cash 5') ||
    q.includes('ticket') ||
    q.includes('lotto')
  ) {
    return {
      text: `🎟️ **NC Lottery Retailer**\n\nWe are an authorized North Carolina Education Lottery retailer! We carry:\n• **Draw Games**: Powerball, Mega Millions, Lucky for Life, Carolina Cash 5, Pick 3 & Pick 4\n• **Scratch-Offs**: Wide selection from $1 to $30 instant tickets\n\n⚠️ **Age Requirement**: You must be at least **18 years old** with valid government photo ID to purchase or redeem lottery tickets. Please play responsibly!`,
      actions: [
        { label: 'View Services', url: '/services' },
      ],
    };
  }

  // Age Limits / Tobacco / Alcohol / Vape / Beer
  if (
    q.includes('age') ||
    q.includes('beer') ||
    q.includes('alcohol') ||
    q.includes('wine') ||
    q.includes('tobacco') ||
    q.includes('cigarette') ||
    q.includes('vape') ||
    q.includes('id') ||
    q.includes('old')
  ) {
    return {
      text: `**Age Verification & Store Policies:**\n\n• **Beer & Alcohol**: Must be **21+** with valid government-issued photo ID\n• **Tobacco, Cigarettes & Vape**: Must be **21+** with valid ID\n• **NC Lottery Tickets**: Must be **18+** with valid ID\n\nWe strictly adhere to all North Carolina state regulations to ensure safe, legal transactions.`,
      actions: [
        { label: '📞 Call Store', url: `tel:${STORE_INFO.phoneClean}`, isExternal: true },
      ],
    };
  }

  // Location / Address / Directions
  if (
    q.includes('address') ||
    q.includes('location') ||
    q.includes('where') ||
    q.includes('direction') ||
    q.includes('map') ||
    q.includes('moravian') ||
    q.includes('wilkes') ||
    q.includes('highway') ||
    q.includes('hwy')
  ) {
    return {
      text: `📍 **Holly Valley Store Location:**\n**${STORE_INFO.address}**\n*(Conveniently located on NC Hwy 18 S in Moravian Falls, NC)*\n\n📞 Phone: **${STORE_INFO.phone}**`,
      actions: [
        { label: '🗺️ Google Maps Directions', url: STORE_INFO.googleMapsUrl, isExternal: true },
        { label: '🍎 Apple Maps Directions', url: STORE_INFO.appleMapsUrl, isExternal: true },
      ],
    };
  }

  // Contact / Phone
  if (
    q.includes('phone') ||
    q.includes('call') ||
    q.includes('number') ||
    q.includes('contact') ||
    q.includes('speak') ||
    q.includes('talk')
  ) {
    return {
      text: `You can reach us directly at **${STORE_INFO.phone}** during regular store hours:\n\n• Monday – Saturday: 8:00 AM – 8:00 PM\n• Sunday: 11:00 AM – 7:30 PM`,
      actions: [
        { label: '📞 Call (336) 304-0094', url: `tel:${STORE_INFO.phoneClean}`, isExternal: true },
        { label: 'View Contact Page', url: '/contact' },
      ],
    };
  }

  // Products / Groceries / Drinks / Ice
  if (
    q.includes('product') ||
    q.includes('drink') ||
    q.includes('grocery') ||
    q.includes('groceries') ||
    q.includes('snack') ||
    q.includes('soda') ||
    q.includes('ice') ||
    q.includes('energy') ||
    q.includes('candy') ||
    q.includes('chips') ||
    q.includes('food') ||
    q.includes('milk') ||
    q.includes('bread')
  ) {
    return {
      text: `🛒 **What We Carry at Holly Valley:**\n\n• **Cold Beverages**: Mountain Dew, Coca-Cola, Pepsi, Dr Pepper, energy drinks (Monster, Red Bull, Celsius), teas, juices, and sports drinks\n• **Groceries & Pantry**: Canned goods, condiments, bread, milk, cereals, baking essentials, and frozen items\n• **Snacks & Treats**: Chips, nuts, cookies, candy bars, ice cream, and grab-and-go treats\n• **Bagged Ice**: Cold party and cooler ice ready to go\n• **Cold Beer**: Domestic, imported, and craft beers (21+)`,
      actions: [
        { label: 'Browse Products Gallery', url: '/products' },
        { label: '📍 Visit Us Today', url: STORE_INFO.googleMapsUrl, isExternal: true },
      ],
    };
  }

  // Greetings
  if (
    q === 'hi' ||
    q === 'hello' ||
    q === 'hey' ||
    q === 'help' ||
    q.includes('good morning') ||
    q.includes('good evening') ||
    q.includes('good afternoon')
  ) {
    const status = getStoreStatus();
    return {
      text: `Hello! 👋 Welcome to Holly Valley Grocery & Services. We are currently **${status.badgeText}** (${status.todaySchedule} today).\n\nHow can I help you today? You can choose a quick topic below or type any question about our store, products, or U-Haul rentals!`,
      actions: [],
    };
  }

  // Fallback if not matched
  return null;
};

/**
 * Direct Gemini API call for local testing or custom endpoint
 */
export const callGeminiDirect = async (message, history = [], storeStatus = 'Open', apiKey) => {
  const systemInstruction = `
You are the official AI assistant for "Holly Valley Grocery & Services" (Wilkesboro / Moravian Falls Convenience Store & Authorized U-Haul Dealer).
Location: 2730 NC Hwy 18 S, Moravian Falls, NC 28654 (Wilkes County, NC, conveniently located on Highway 18 South near Wilkesboro).
Phone Number: (336) 304-0094.

Store Operating Hours (Eastern Time):
- Monday through Saturday: 8:00 AM – 8:00 PM
- Sunday: 11:00 AM – 7:30 PM

Current Live Store Status: ${storeStatus || 'Open'}

Verified Services & Offerings:
1. U-Haul Truck & Trailer Rentals:
   - Official Authorized Neighborhood Dealer in Moravian Falls, NC.
   - Equipment: Moving trucks (10', 15', 20', 26'), utility trailers, cargo trailers with ramps, vehicle tow dollies, and auto transports.
   - Moving supplies: Boxes, bubble wrap, packing tape, and mattress covers.
   - 24/7 Mobile Pick Up & Drop Off available online at: ${STORE_INFO.uhaulUrl}
   - Phone counter reservations at (336) 304-0094.

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

Conversational Guidelines:
- Tone: Friendly, conversational, warm, and helpful (local North Carolina community hospitality).
- Keep answers direct and concise (2 to 5 sentences or short bullet points).
- Suggest relevant store items when asked for ideas, recommendations, or trip preparations.
- If asked about hot cooked restaurant food or gas pumps, clarify that Holly Valley is a convenience store and grocery specializing in packaged foods, cold drinks, snacks, lottery, and U-Haul rentals.
- When appropriate, share our phone number (336) 304-0094 or store address.
`;

  const contents = [];
  const recentHistory = Array.isArray(history) ? history.slice(-6) : [];
  for (const item of recentHistory) {
    if (item.text && (item.sender === 'user' || item.sender === 'assistant' || item.role === 'user' || item.role === 'model')) {
      const role = (item.sender === 'user' || item.role === 'user') ? 'user' : 'model';
      contents.push({
        role,
        parts: [{ text: item.text.slice(0, 400) }],
      });
    }
  }

  contents.push({
    role: 'user',
    parts: [{ text: message.slice(0, 400) }],
  });

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

  const payload = {
    system_instruction: {
      parts: [{ text: systemInstruction }],
    },
    contents,
    generationConfig: {
      maxOutputTokens: 350,
      temperature: 0.7,
    },
  };

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error(`Gemini API error: ${res.status}`);
  }

  const data = await res.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || null;
};


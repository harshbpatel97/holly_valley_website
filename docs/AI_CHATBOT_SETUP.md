# Holly Valley AI Chatbot Setup & Architecture Guide

The Holly Valley AI Assistant is designed with a **hybrid zero-cost ($0) architecture**:
1. **Client-Side Out-of-the-Box**: By default, the chatbot answers 80–90% of common store questions (hours, real-time status, directions, phone calls, NC lottery, U-Haul, EBT/payments, groceries) instantly and 100% free with no backend required.
2. **Optional Gemini Free Tier Proxy**: If you want freeform generative AI responses for custom questions, you can deploy the included Cloudflare Worker script (`serverless/cloudflare-worker.js`) in ~2 minutes with zero monthly fees.

---

## Architecture Overview

```
User Query in Browser
   │
   ├─► 1. Client-Side Knowledge Engine (chatKnowledge.js)
   │       └── Matches Hours, Status, U-Haul, EBT, Lottery, Directions, Products ($0, 0ms latency)
   │
   └─► 2. Unmatched / Freeform Question
           └── If REACT_APP_CHAT_API_URL is configured:
                 └── Cloudflare Worker (100k free req/day) ──► Google Gemini 2.5 Flash (1.5k free req/day)
           └── If NOT configured:
                 └── Graceful smart store fallback with direct call and directions links
```

---

## Deploying the Cloudflare Worker (Optional - $0 Cost)

### Step 1: Get a Free Gemini API Key
1. Go to [Google AI Studio](https://aistudio.google.com/).
2. Click **Get API key** and create a free key (no credit card or billing required).
3. The free tier includes **1,500 free requests per day** and **15 requests per minute**.

### Step 2: Deploy Free Cloudflare Worker
1. Log in to your free [Cloudflare Dashboard](https://dash.cloudflare.com/).
2. Navigate to **Workers & Pages** -> **Create Application** -> **Create Worker**.
3. Copy and paste the contents of [`serverless/cloudflare-worker.js`](../serverless/cloudflare-worker.js).
4. In the worker settings under **Settings -> Variables and Secrets**, add:
   - `GEMINI_API_KEY`: *(Your Google AI Studio API key)*
   - `ALLOWED_ORIGIN`: `https://wilkes-cstore.com` (or `*` for local testing)
5. Click **Save and Deploy**.

### Step 3: Connect to Frontend (Optional)
In your website's `.env` or deployment environment variables:
```env
REACT_APP_CHAT_API_URL=https://your-worker-subdomain.workers.dev
```

> **Note**: If `REACT_APP_CHAT_API_URL` is omitted, the website automatically runs in full client-side mode, using its built-in store knowledge base with zero external dependencies.

---

## Key Files Reference

- **Chatbot UI Widget**: [`src/components/ChatBot/ChatWidget.js`](../src/components/ChatBot/ChatWidget.js)
- **Quick Action Chips**: [`src/components/ChatBot/ChatQuickActions.js`](../src/components/ChatBot/ChatQuickActions.js)
- **Local Knowledge Engine**: [`src/components/ChatBot/chatKnowledge.js`](../src/components/ChatBot/chatKnowledge.js)
- **Store Hours Utility**: [`src/utils/storeHours.js`](../src/utils/storeHours.js)
- **Worker Proxy Script**: [`serverless/cloudflare-worker.js`](../serverless/cloudflare-worker.js)

# Viewing Signage Analytics in Google Analytics

This guide explains how to view signage page access events (granted/denied) in Google Analytics (web and mobile app).

## Events Being Tracked

Your signage page tracks the following events:

1. **`signage_access_granted`** - Successful access to signage page
   - `event_category`: "Security"
   - `event_label`: "access_granted" or "open_access"
   - `has_token`: true/false
   - `token_valid`: true/false
   - `access_granted`: true
   - `ip_address`: Client IP address

2. **`signage_access_denied`** - Access denied to signage page
   - `event_category`: "Security"
   - `event_label`: "access_denied"
   - `has_token`: true/false
   - `token_valid`: false
   - `access_granted`: false
   - `reason`: "invalid_token" or "no_token"
   - `ip_address`: Client IP address

---

## Viewing in Google Analytics Web Interface

### Method 1: Events Report (Quick View)

1. **Access Google Analytics**
   - Go to [analytics.google.com](https://analytics.google.com)
   - Select your property (website)

2. **Navigate to Events Report**
   - In the left sidebar, click **Reports** → **Engagement** → **Events**
   - Or go directly: **Reports** → **Engagement** → **Events**

3. **View Signage Events**
   - You'll see a list of events including:
     - `signage_access_granted`
     - `signage_access_denied`
   - Click on any event name to see details

4. **View Event Parameters**
   - Click on an event name (e.g., `signage_access_granted`)
   - Scroll down to see **Event parameters** section
   - Look for:
     - `ip_address` - Client IP address
     - `has_token` - Whether token was provided
     - `token_valid` - Whether token was valid
     - `access_granted` - Whether access was granted
     - `reason` - Reason for denial (if applicable)

### Method 2: Real-Time Events (Live Monitoring)

1. **Access Real-Time Report**
   - In left sidebar: **Reports** → **Realtime** → **Events**
   - Or go directly: **Reports** → **Realtime** → **Overview**

2. **View Live Events**
   - See events as they happen in real-time
   - Filter by event name: `signage_access_granted` or `signage_access_denied`

### Method 3: Custom Report (Recommended for Security Review)

1. **Create Custom Report**
   - Go to **Explore** (left sidebar) → **Free Form**
   - Or: **Reports** → **Explore** → **Free Form**

2. **Configure Dimensions**
   - Add dimensions:
     - `Event name`
     - `Event category`
     - `Event label`
     - Custom dimension: `ip_address` (if available)

3. **Configure Metrics**
   - Add metrics:
     - `Event count`
     - `Users`
     - `Sessions`

4. **Add Filters**
   - Filter by `Event category` = "Security" (for access events)

5. **Save Report**
   - Click **Save** to save this custom report
   - Name it "Signage Security Review"

### Method 4: Search Events by IP Address

1. **Go to Events Report**
   - **Reports** → **Engagement** → **Events**

2. **Use Search/Filter**
   - Click on an event name
   - In the event parameters section, look for `ip_address`
   - Note: IP addresses are stored as event parameters, so you'll need to view individual events or create a custom report

3. **Create Custom Dimension (Advanced)**
   - Go to **Admin** → **Custom Definitions** → **Custom Dimensions**
   - Create a custom dimension: "IP Address" (Event-scoped)
   - Update your tracking code to send IP as a custom dimension
   - This makes IP addresses easier to filter and search

---

## Viewing in Google Analytics Mobile App

### iOS App (Google Analytics)

1. **Open the App**
   - Download "Google Analytics" app from App Store
   - Sign in with your Google account

2. **Select Property**
   - Tap on your website property

3. **View Events**
   - Tap **Reports** (bottom navigation)
   - Tap **Events**
   - You'll see a list of events including signage events

4. **View Event Details**
   - Tap on an event name (e.g., `signage_access_granted`)
   - Scroll to see event parameters including `ip_address`

5. **Real-Time Events**
   - Tap **Realtime** (bottom navigation)
   - Tap **Events** to see live events

### Android App (Google Analytics)

1. **Open the App**
   - Download "Google Analytics" app from Play Store
   - Sign in with your Google account

2. **Select Property**
   - Tap on your website property

3. **View Events**
   - Tap **Reports** (bottom navigation)
   - Tap **Events**
   - You'll see a list of events including signage events

4. **View Event Details**
   - Tap on an event name (e.g., `signage_access_granted`)
   - Scroll to see event parameters including `ip_address`

5. **Real-Time Events**
   - Tap **Realtime** (bottom navigation)
   - Tap **Events** to see live events

---

## Setting Up a Dashboard for Signage Events

### In Google Analytics Web Interface

#### Method 1: Custom Dashboard (Recommended)

1. **Create a New Dashboard**
   - Go to **Reports** → **Dashboards** (left sidebar)
   - Click **+ Create Dashboard**
   - Name it: "Signage Security Dashboard"
   - Choose "Blank Canvas" layout

2. **Add Widget: Access Granted Count**
   - Click **+ Add Widget**
   - Widget Type: Select **Metric**
   - Widget Title: "Access Granted"
   - Configuration:
     - Metric: **Event count**
     - Filter: `Event name` = `signage_access_granted`
   - Click **Save**

3. **Add Widget: Access Denied Count**
   - Click **+ Add Widget**
   - Widget Type: Select **Metric**
   - Widget Title: "Access Denied"
   - Configuration:
     - Metric: **Event count**
     - Filter: `Event name` = `signage_access_denied`
   - Click **Save**

4. **Add Widget: Events Timeline**
   - Click **+ Add Widget**
   - Widget Type: Select **Line Chart** or **Timeline**
   - Widget Title: "Signage Events Timeline"
   - Configuration:
     - Metric: **Event count**
     - Dimension: **Date** (or **Hour** for hourly view)
     - Filter: `Event name` contains `signage_access`
   - Series:
     - Series 1: Filter `Event name` = `signage_access_granted` (label: "Granted")
     - Series 2: Filter `Event name` = `signage_access_denied` (label: "Denied")
   - Click **Save**

5. **Add Widget: Recent Events Table**
   - Click **+ Add Widget**
   - Widget Type: Select **Table**
   - Widget Title: "Recent Signage Events"
   - Configuration:
     - Dimensions: **Event name**, **Date**, **Hour**
     - Metric: **Event count**
     - Filter: `Event name` contains `signage_access`
     - Sort by: **Date** (descending)
     - Rows: 10-20
   - Click **Save**

6. **Add Widget: Access Denied Reasons**
   - Click **+ Add Widget**
   - Widget Type: Select **Pie Chart** or **Bar Chart**
   - Widget Title: "Denial Reasons"
   - Configuration:
     - Metric: **Event count**
     - Dimension: **Event parameter: reason**
     - Filter: `Event name` = `signage_access_denied`
   - Click **Save**

7. **Add Widget: Top IP Addresses (Denied)**
   - Click **+ Add Widget**
   - Widget Type: Select **Table**
   - Widget Title: "Top IPs - Access Denied"
   - Configuration:
     - Dimensions: **Event parameter: ip_address**
     - Metric: **Event count**
     - Filter: `Event name` = `signage_access_denied`
     - Sort by: **Event count** (descending)
     - Rows: 10
   - Click **Save**

8. **Arrange Dashboard**
   - Drag widgets to arrange them
   - Resize widgets as needed
   - Click **Save** (top right) to save the dashboard

#### Method 2: Explore Report (Advanced)

1. **Create Free Form Report**
   - Go to **Explore** → **Free Form** (left sidebar)
   - Click **+ New Exploration**
   - Name it: "Signage Security Analysis"

2. **Configure Dimensions**
   - Click **+** under Dimensions
   - Add:
     - `Event name`
     - `Event category`
     - `Event label`
     - `Event parameter: ip_address`
     - `Event parameter: reason`
     - `Event parameter: has_token`
     - `Date`
     - `Hour`

3. **Configure Metrics**
   - Click **+** under Metrics
   - Add:
     - `Event count`
     - `Users`
     - `Sessions`

4. **Configure Rows/Columns**
   - Drag `Event name` to Rows
   - Drag `Event parameter: reason` to Rows (under Event name)
   - Drag `Date` to Columns
   - Drag `Event count` to Values

5. **Add Filters**
   - Click **Filters** → **Add filter**
   - Filter: `Event category` = `Security`
   - Apply filter

6. **Save Report**
   - Click **Save** (top right)
   - Name: "Signage Security Analysis"

---

### In Google Analytics Mobile App

**Note:** The Google Analytics mobile app has limited dashboard creation capabilities. It's better to create dashboards on the web interface, then view them in the mobile app.

#### Viewing Dashboards on Mobile

1. **Open the App**
   - Download "Google Analytics" app (iOS/Android)
   - Sign in with your Google account

2. **Access Dashboards**
   - Tap **Reports** (bottom navigation)
   - Scroll to find your custom dashboard
   - Or tap **Dashboards** if available in your app version

3. **View Dashboard Widgets**
   - Tap on any widget to see detailed data
   - Swipe left/right to see different metrics

#### Creating Reports on Mobile (Limited)

1. **View Events**
   - Tap **Reports** → **Events**
   - Find `signage_access_granted` or `signage_access_denied`
   - Tap to view details

2. **Save as Favorite**
   - Tap the ⭐ (star) icon to save the report
   - Access from **Favorites** section

3. **View Real-Time**
   - Tap **Realtime** (bottom navigation)
   - Tap **Events** to see live signage events
   - Filter by event name if needed

---

## Useful Filters and Segments

### Filter for Security Events Only

1. **In Events Report**
   - Click **Add filter** (if available)
   - Event category = "Security"

### Filter for Access Denials Only

1. **In Events Report**
   - Click on `signage_access_denied` event
   - View parameters to see denied access attempts

### Filter by IP Address

1. **In Custom Report**
   - Add filter: Custom parameter `ip_address` contains specific IP
   - Useful for tracking specific visitors or suspicious activity

---

## Understanding the Data

### `signage_access_granted` Event
- **What it means**: Someone successfully accessed the signage page
- **Key parameters**:
  - `access_granted: true` - Access was granted
  - `has_token: true/false` - Whether a token was provided
  - `token_valid: true` - Token was valid (if token required)
  - `ip_address` - IP address of the visitor

### `signage_access_denied` Event
- **What it means**: Someone tried to access the signage page but was denied
- **Key parameters**:
  - `access_granted: false` - Access was denied
  - `reason: "invalid_token"` - Token was provided but invalid
  - `reason: "no_token"` - No token was provided
  - `ip_address` - IP address of the blocked visitor

---

## Pro Tips

1. **Set Up Alerts**
   - Go to **Admin** → **Custom Alerts**
   - Create alert for `signage_access_denied` events
   - Get notified when someone tries to access without permission

2. **Create Dashboard**
   - Go to **Reports** → **Dashboards**
   - Create a new dashboard: "Signage Security"
   - Add widgets for:
     - `signage_access_granted` count
     - `signage_access_denied` count
     - Unique IP addresses
     - Recent events timeline

3. **Export Data**
   - In any report, click **Export** (top right)
   - Export to CSV, PDF, or Google Sheets
   - Useful for offline analysis or reporting

4. **Schedule Reports**
   - In any report, click **Share** → **Schedule email**
   - Get regular email updates about signage access

---

## AI Store Assistant (Chatbot) Analytics

The Holly Valley AI Assistant tracks rich real-time interaction, conversational, and conversion metrics in GA4.

### Chatbot Events Tracked

1. **`chatbot_opened`** - User opened the chat widget
   - `event_category`: "Chatbot"
   - `event_label`: "Chat Widget Opened"
   - `open_source`: "fab"

2. **`chatbot_closed`** - User minimized / closed the chat widget
   - `event_category`: "Chatbot"
   - `event_label`: "Chat Widget Closed"

3. **`chatbot_query`** - User sent a message or clicked a quick prompt
   - `event_category`: "Chatbot"
   - `event_label`: Topic category or query preview (e.g., "hours", "uhaul", "lottery")
   - `query_topic`: `"hours"` | `"uhaul"` | `"payments"` | `"lottery"` | `"location"` | `"age_policy"` | `"products"` | `"general"`
   - `query_type`: `"quick_action"` | `"user_input"` | `"embedded_prompt"`
   - `source`: `"local_knowledge"` | `"cloudflare_proxy"` | `"gemini_ai"` | `"local_fallback"` | `"directory_fallback"`
   - `search_term`: First 100 characters of the user prompt
   - `prompt_length`: Character length of the prompt

4. **`chatbot_response`** - Bot delivered a response to the user
   - `event_category`: "Chatbot"
   - `event_label`: Topic or response type
   - `response_source`: `"local_knowledge"` | `"cloudflare"` | `"gemini_direct"` | `"local_fallback"`
   - `response_type`: `"instant_local"` | `"ai_cloud"` | `"ai_direct"` | `"directory_info"`
   - `response_topic`: Intent topic
   - `response_length`: Character length of generated reply
   - `has_cta`: `true`/`false` (whether action buttons were included)

5. **`chatbot_action_click`** - User clicked an action button or quick action chip
   - `event_category`: "Chatbot"
   - `event_label`: Action button text (e.g., "📞 Call Store", "📍 Get Directions")
   - `action_type`: `"quick_chip"` | `"phone_call"` | `"directions"` | `"uhaul_booking"` | `"internal_navigation"` | `"embedded_prompt"`
   - `action_id`: Chip ID (e.g., "hours", "uhaul", "payments", "lottery")
   - `url`: Target URL or phone number

6. **High-Intent Lead Conversions (`chatbot_lead_*`)**:
   - **`chatbot_lead_phone_call`** - User clicked to call the store from the chatbot
   - **`chatbot_lead_directions`** - User clicked for GPS directions from the chatbot
   - **`chatbot_lead_uhaul_booking`** - User clicked through to the official U-Haul reservation portal

7. **`chatbot_rate_limited`** - Session message limit reached (15 messages)
   - `event_category`: "Chatbot"
   - `session_count`: Current count

8. **`chatbot_clear_history`** - User reset chat conversation
   - `event_category`: "Chatbot"

---

## Real-Time Testing with GA4 DebugView

To see all events fire in real time with complete parameter breakdown:

1. **Activate Debug Mode in Any Browser**:
   - Open your site with the debug parameter:
     `https://your-domain.com/?debug_ga=true` (or `http://localhost:3000/?debug_ga=true`)
   - Or open DevTools Console (`F12` or `Cmd+Option+I`) and run:
     ```js
     localStorage.setItem('debug_ga', 'true'); location.reload();
     ```
2. **View Live Events in Google Analytics**:
   - Go to [analytics.google.com](https://analytics.google.com) → **Admin** (bottom left gear icon).
   - Under **Data display**, click **DebugView**.
   - You will see a live timeline of every click, chatbot query, response, and conversion with all parameters!
3. **View in DevTools Console**:
   - When debug mode is active, every event is cleanly logged in your browser console:
     `📊 [GA4 Event] chatbot_query { query_topic: "hours", ... }`

---

## Troubleshooting

### Events Not Showing Up

1. **Check Measurement ID**
   - Verify `REACT_APP_GA_ID` is set correctly in your `.env` file (e.g. `G-Z52L7DLEN1`).
   - Check browser console for `📊 [GA4 Event]` logs.

2. **Verify Tracking Code**
   - Open browser DevTools → Network tab
   - Filter by "collect" or "analytics"
   - Look for requests to `google-analytics.com/g/collect`
   - This confirms events are being sent

3. **Check Ad Blockers & Privacy Shields**
   - Ad blockers (uBlock, AdBlock Plus) and browser shields (Brave Shields, Safari Content Blockers) will block requests to Google Analytics.
   - Test in an incognito window with extensions disabled or allow `googletagmanager.com` / `google-analytics.com`.

---

## Quick Reference: All Event Names

- **Signage Events**:
  - `signage_access_granted`
  - `signage_access_denied`

- **Chatbot Events**:
  - `chatbot_opened`
  - `chatbot_closed`
  - `chatbot_query`
  - `chatbot_response`
  - `chatbot_action_click`
  - `chatbot_lead_phone_call`
  - `chatbot_lead_directions`
  - `chatbot_lead_uhaul_booking`
  - `chatbot_rate_limited`
  - `chatbot_clear_history`

- **Navigation & Store Events**:
  - `phone_click`
  - `directions_click`
  - `uhaul_booking_click`
  - `nav_link_click`
  - `copy_address_click`
  - `product_category_open`
  - `product_image_zoom`



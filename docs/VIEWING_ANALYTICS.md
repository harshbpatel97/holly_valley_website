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

## Troubleshooting

### Events Not Showing Up

1. **Check Measurement ID**
   - Verify `REACT_APP_GA_ID` is set correctly in your `.env` file
   - Check browser console for any errors

2. **Verify Tracking Code**
   - Open browser DevTools → Network tab
   - Filter by "collect" or "analytics"
   - Look for requests to `google-analytics.com/g/collect`
   - This confirms events are being sent

3. **Check Event Parameters**
   - In Google Analytics → **Reports** → **Realtime** → **Events**
   - Events appear within seconds
   - If not appearing, check browser console for errors

4. **Ad Blockers**
   - Some ad blockers may block Google Analytics
   - Test in incognito mode or disable ad blocker

### IP Address Not Showing

1. **IP Fetch May Fail**
   - If `api.ipify.org` is blocked, IP won't be captured
   - Check browser console for fetch errors
   - IP is optional, so events will still be tracked without it

2. **View in Event Parameters**
   - IP addresses are stored as event parameters
   - Click on an event → Scroll to "Event parameters" section
   - Look for `ip_address` parameter

---

## Quick Reference: Event Names

- **`signage_access_granted`** - Successful access (granted)
- **`signage_access_denied`** - Access denied (blocked)

All events include `ip_address` parameter (when available) for security review purposes.


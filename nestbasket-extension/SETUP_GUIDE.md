# 🛒 NestBasket Chrome Extension — Complete Setup Guide

## What This Does
This Chrome extension runs silently in YOUR browser.
When you open Blinkit, Zepto, BigBasket, or Instamart — it reads real product prices using YOUR own login session (Cloudflare cannot block your own browser).
Prices are saved to Firebase and shown on NestBasket automatically.

---

## STEP 1 — Set Up Firebase (Free, Takes 5 Minutes)

### 1.1 Go to Firebase Console
👉 Open: https://console.firebase.google.com/

### 1.2 Create Project
- Click **"Add project"**
- Name: `nestbasket-prices`
- Click Continue → Continue → Create Project

### 1.3 Create Realtime Database
- Left sidebar → **Build** → **Realtime Database**
- Click **"Create database"**
- Choose **"Start in test mode"** (allows read/write without auth)
- Location: **asia-south1 (Mumbai)**
- Click **Done**

### 1.4 Copy Your Firebase URL
After creating, you'll see a URL like:
```
https://nestbasket-prices-default-rtdb.asia-south1.firebasedatabase.app
```
**Copy this URL** — you need it in Step 3.

---

## STEP 2 — Install the Chrome Extension

### 2.1 Open Chrome Extensions page
- Open Chrome browser
- Go to: `chrome://extensions/`
- OR click menu (⋮) → More tools → Extensions

### 2.2 Enable Developer Mode
- Top-right corner: turn ON **"Developer mode"**

### 2.3 Load the Extension
- Click **"Load unpacked"**
- Navigate to this folder:
  ```
  C:\Users\asus\.gemini\antigravity\scratch\nestbasket\nestbasket-extension\
  ```
- Click **Select Folder**

✅ You should see **"NestBasket Price Tracker"** appear in your extensions list.

---

## STEP 3 — Connect Extension to Your Firebase

### 3.1 Open background.js
Open this file in Notepad:
```
C:\Users\asus\.gemini\antigravity\scratch\nestbasket\nestbasket-extension\background.js
```

### 3.2 Replace the Firebase URL
Find this line (line 8):
```javascript
const FIREBASE_URL = 'https://nestbasket-prices-default-rtdb.firebaseio.com';
```

Replace with YOUR Firebase URL:
```javascript
const FIREBASE_URL = 'https://nestbasket-prices-default-rtdb.asia-south1.firebasedatabase.app';
```

### 3.3 Do the SAME in useLivePrices.ts
Open:
```
C:\Users\asus\.gemini\antigravity\scratch\nestbasket\src\hooks\useLivePrices.ts
```
Find and replace the same FIREBASE_URL line.

### 3.4 Reload the Extension
- Go back to `chrome://extensions/`
- Find NestBasket Price Tracker
- Click the **Reload** button (↻)

---

## STEP 4 — Collect Real Prices (Takes 2 Minutes)

Just open each store in Chrome:

| Store | URL to visit |
|---|---|
| Blinkit | https://blinkit.com |
| Zepto | https://www.zeptonow.com |
| BigBasket | https://www.bigbasket.com |
| Instamart | https://www.swiggy.com/instamart |

**That's it!** The extension runs automatically in background.
You'll see prices appear on NestBasket within 30 seconds of visiting each store.

---

## STEP 5 — Deploy Updated NestBasket Website

After updating the Firebase URL in `useLivePrices.ts`:

Run this command:
```
node C:\Users\asus\.gemini\antigravity\brain\52e5becc-4df0-4654-894b-d7af29284b26\scratch\deploy.js
```

Or I (Antigravity) can deploy it for you — just say **"deploy"**.

---

## How It Works (Technical)

```
YOU open blinkit.com in Chrome
           ↓
Extension content_blinkit.js runs in YOUR browser tab
           ↓  
Calls blinkit.com/v6/search/products?q=milk
(Using YOUR cookies — Cloudflare sees you, not a robot)
           ↓
Gets REAL prices: Amul Milk ₹28, etc.
           ↓
Sends to background.js service worker
           ↓
Saves to Firebase Realtime Database
           ↓
NestBasket website reads Firebase every 5 minutes
           ↓
Shows REAL prices to all visitors ✅
```

---

## Check That It's Working

1. Click the NestBasket extension icon in Chrome toolbar
2. You'll see the popup showing:
   - How many products synced
   - Which stores are active
   - Last sync time

---

## Firebase Security (Important)

After testing, update Firebase rules to:
```json
{
  "rules": {
    "prices": {
      ".read": true,
      ".write": false
    }
  }
}
```
This allows everyone to READ prices but only the extension (from your browser) can WRITE. Go to:
Firebase Console → Realtime Database → Rules → Publish

---

## Need Help?
Tell me: "deploy" or "firebase setup help" and I will assist immediately.

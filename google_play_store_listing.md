# 📱 Google Play Console — Store Listing Submission Kit

This document contains everything needed to publish **NestBasket** to the **Google Play Store**.

---

## 1. Store Listing Details

### App Name (Title)
> **Limit: 30 characters**
```
NestBasket — Quick Groceries
```
*(28 / 30 characters)*

### Short Description
> **Limit: 80 characters**
```
Compare live grocery prices across Blinkit, Zepto, Swiggy Instamart & BigBasket!
```
*(79 / 80 characters)*

### Full Description
> **Limit: 4000 characters**
```text
Save ₹1,500+ every month on groceries with NestBasket — India’s #1 all-in-one quick-commerce price comparison and smart shopping assistant.

Founded by Gopagani Arun, NestBasket brings real-time darkstore rates, delivery fees, and surge monitoring into one seamless dashboard so you never overpay for daily essentials again.

⚡ WHY SHOPPERS LOVE NESTBASKET:
• 5-in-1 Multi-Store Comparison: Instantly check rates across Blinkit, Zepto, Swiggy Instamart, BigBasket Now, and Flipkart Minutes.
• Over 24,580 Verified SKUs: Milk, Bread, Eggs, Atta, Rice, Dal, Ghee, Cooking Oil, Fresh Fruits, Vegetables, Chocolates, Cleaning Supplies & Personal Care.
• Real-Time Darkstore Telemetry: Live surge fee radar and delivery handling fee comparisons for your exact locality.
• Smart Basket Optimizer: Finds whether buying everything from one store or splitting your basket across two saves the most money.
• 1-Tap Direct Buy Links: Jump directly to product checkout on your favorite platform with verified store links.
• Fast & Featherweight: Less than 2 MB footprint, zero phone memory bloat, instant launch.

🏙️ SUPPORTED CITIES & HUBS:
Hyderabad (ShivBagh, Balkampet, Ameerpet, Hitec City, Gachibowli, Kukatpally, Banjara Hills), Bengaluru, Delhi NCR, Mumbai, Pune, Chennai, Kolkata, and Suryapet.

🔒 TRUST & PRIVACY:
• Fully compliant with Digital Personal Data Protection Act (DPDP 2023).
• No unnecessary permissions required.
• Founder & CEO: Gopagani Arun.

Disclaimer: Blinkit, Zepto, Swiggy Instamart, BigBasket, and Flipkart are registered trademarks of their respective owners. NestBasket is an independent consumer utility created to help Indian households optimize monthly savings.
```

---

## 2. Categorization & Contact Details

- **Application Type**: App
- **Category**: Shopping
- **Tags**: Grocery, Price Comparison, Coupons & Deals, Food Delivery, Supermarket
- **Content Rating**: Everyone (3+)
- **Target Audience**: 18+ (Shoppers, Families, Students, Home Managers)
- **Developer Email**: Contact via Founder Desk at `https://arungopagani.is-a.dev/nestbasket/founder/gopagani-arun/`
- **Privacy Policy URL**: `https://arungopagani.is-a.dev/nestbasket/`

---

## 3. Graphic Assets Checklist

| Asset | Dimensions | Requirement | Source File in Repo |
| :--- | :--- | :--- | :--- |
| **App Icon** | 512 x 512 px, 32-bit PNG | Square, no rounded corners (Google rounds it) | `public/icon-512.png` |
| **Feature Graphic** | 1024 x 500 px, JPG or PNG | Banner displayed at top of Play Store listing | Generated from `public/nestbasket-logo.jpg` |
| **Phone Screenshots** | Min 2, Max 8 (16:9 or 9:16) | High-res mockups showing price comparison grid and radar | Capture from `http://localhost:5173/` |

---

## 4. Digital Asset Links (TWA Verification)

When Google Play builds or verifies the Trusted Web Activity (TWA), it verifies that:
```
https://arungopagani.is-a.dev/.well-known/assetlinks.json
```
contains the SHA-256 certificate fingerprint of the release keystore. This is already configured and deployed in `public/.well-known/assetlinks.json`!

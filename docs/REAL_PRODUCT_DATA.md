# NestBasket real product data

NestBasket must never invent a store product ID, price, stock state, delivery time, or product image.

## Canonical identity
Match products using brand, normalized name, variant, quantity/unit, origin when relevant, and barcode/GTIN when available.

## VERIFIED store offer
An offer is VERIFIED only when the source provides externalProductId, direct productUrl, current price, current stock state, source timestamp, and matching product identity.

If identity data is missing, show Not verified instead of a guessed price or URL.

## Instamart
Swiggy provides an official Instamart MCP/API for developers. Production access uses OAuth and approved access. NestBasket should use the official integration rather than scraping or bypassing the platform.

## Other stores
Blinkit, Zepto, BigBasket, Amazon and Flipkart must be connected through an authorized API, partner feed, affiliate/catalog integration, or other permitted source. Credentials must stay server-side and must never be committed to GitHub.

## Location
Prices and availability are location-dependent. The ingestion service should accept delivery pincode/address context and store the source location with each offer.

## Images
The canonical image must match the canonical product. Store-specific images may be retained separately as storeImageUrl. Generic stock images must not be presented as exact product images.

## Refresh
Every verified offer should record lastVerifiedAt. Stale offers should stop being displayed as live until refreshed.

## Current behavior
The frontend now avoids fabricated dynamic products and generated store prices. Until a trusted source is connected, unverified offers are not presented as real prices.
# NestBasket Partner/API System

For every store, request an authorized API, catalog feed, affiliate feed, or partner integration. Never bypass authentication, CAPTCHA, anti-bot controls, or access restrictions.

Request, where permitted: product ID/SKU/variant ID, exact name/brand, pack size, current price/MRP, stock, image URL, direct product URL, location availability, and update timestamp.

Every source enters a server-side adapter and then the strict ingestion validator. Records without a real external identifier, direct HTTPS product URL, product name, or valid price are rejected. NestBasket never invents a replacement ID, URL, price, image, or stock state.

Partner secrets remain server-side in environment variables. The browser never receives credentials.

Instamart should use the official Swiggy MCP/OAuth flow. Its product variations expose SKU-level spinId identifiers.

The ingestion endpoint is stateless until persistent storage is connected. A product is not described as permanently synced until database persistence is configured.

A store becomes CONNECTED only after a real authorized response has been received and validated.

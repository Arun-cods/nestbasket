# NestBasket real product data

NestBasket is now structured around a universal canonical catalog rather than individual hard-coded products.

## Supported product scope

The catalog model is product-agnostic. It can represent grocery, fresh produce, dairy, staples, snacks, beverages, personal care, household, baby care, pet supplies, electronics and other categories exposed by a connected store.

Swiggy's official Instamart MCP currently documents product discovery across 50+ categories. `search_products` returns products with variants, and each variant has its own `spinId` SKU identifier. citeturn0search0turn0search1

## Cross-store identity

A canonical product is matched using:

1. barcode/GTIN when available
2. brand
3. product name
4. variant
5. quantity/unit
6. origin when relevant

A different flavour, origin, pack size or product family is not silently merged.

## Store offer requirements

A store offer is considered verified only when NestBasket has:

- real external product/SKU ID
- direct HTTPS product URL from an authorized source
- current price
- stock state
- verification timestamp
- matching product identity

No fake IDs, simulated prices, random images or guessed product URLs are permitted.

## Store integrations

The adapter registry supports:

- Instamart
- Blinkit
- Zepto
- BigBasket
- Amazon
- Flipkart

Each store must provide an authorized API, partner feed, affiliate/catalog feed or equivalent permitted source before its real data is registered.

## Instamart

The official endpoint is `POST https://mcp.swiggy.com/im`. The documented `search_products` call requires the selected delivery address and returns SKU-level variants. citeturn0search0turn0search1

Production authentication is handled through Swiggy's MCP authentication flow. Do not put credentials in the frontend or GitHub. citeturn0search10

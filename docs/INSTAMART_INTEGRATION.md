# Instamart live-data connector

NestBasket now has a server-side adapter for Swiggy Instamart's official MCP endpoint.

## Official flow

Swiggy documents:

- Instamart MCP endpoint: `https://mcp.swiggy.com/im`
- Product discovery tool: `search_products`
- Required search inputs: authenticated `addressId` and product `query`
- SKU-level identifiers: each variation has a `spinId`
- OAuth: OAuth 2.1 with PKCE
- Production access: apply through Swiggy Builders Club

NestBasket does not scrape Instamart and does not manufacture IDs.

## API endpoint

The Vercel function is:

`POST /api/instamart/search`

Headers:

`Authorization: Bearer <Swiggy OAuth access token>`

Body:

```json
{
  "addressId": "<authenticated Swiggy address ID>",
  "query": "Pink Lady Apple",
  "offset": 0
}
```

The endpoint forwards the authenticated request to Swiggy's `search_products` tool and returns the real response.

## Important identity rule

Do not convert a `spinId` into a guessed product URL. Store the returned `spinId` as the external SKU identifier. Only set `productUrl` when Swiggy supplies a direct product URL through an approved source.

The canonical matcher should compare:

- brand
- product name
- variant
- quantity
- origin when relevant
- barcode/GTIN when available

For example, Pink Lady Apple USA 300 g must not be matched to Red Delicious, Royal Gala, Kashmiri Apple, or another pack size.

## Authentication

Swiggy uses OAuth 2.1 + PKCE and dynamically registered clients. Production access is reviewed by Swiggy. Never put a Swiggy access token in source code, GitHub, or public client bundles.

The current API endpoint intentionally requires the bearer token so NestBasket cannot silently use a shared personal Swiggy account for all customers.

## Current limitation

The connector is code-complete for the documented search call, but production live data requires an authorized Swiggy integration and per-user authentication/address context. The same verification architecture should be used for Blinkit, Zepto, BigBasket, Amazon and Flipkart through their permitted APIs, feeds or partner programs.

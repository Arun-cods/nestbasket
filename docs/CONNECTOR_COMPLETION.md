# NestBasket connector completion

## What is built

NestBasket now has:

- universal product identity
- cross-store matching
- verified-offer filtering
- lowest verified price calculation
- store connector registry
- connector readiness API
- Instamart official MCP adapter
- Flipkart Affiliate API adapter
- Amazon PA-API boundary
- explicit no-fabrication policy

## What cannot be legitimately automated without access

A store may require one or more of:

- partner approval
- API credentials
- affiliate credentials
- OAuth authorization
- location/pincode context
- contractual catalog feed

NestBasket must not bypass those requirements.

## Automatic behavior

When a connector is authorized, its products can flow through:

`store API/feed -> adapter -> canonical identity -> verification -> comparison engine -> UI`

No manual product entry is required for that connector.

## Public pages

A public product page may be used for verification only when its terms and access permit automated use. A public page is not treated as an API and cannot be used to bypass authentication, rate limits, CAPTCHAs or anti-bot controls.

## Completion condition

The all-store comparison becomes fully live when each desired store has a permitted data source connected. The application code is designed so connectors can be enabled independently without changing the matching engine.

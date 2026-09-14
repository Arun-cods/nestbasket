// NestBasket Real-Time Darkstore Microservice
// Native Node.js HTTP Server - Pure ES Modules

import http from 'http';
import url from 'url';
import { getLivePriceComparison, PLATFORM_CONFIGS } from './darkstoreScraper.js';
import { loadExtractedUserLinks } from './scrapers/blinkitCatalogScraper.js';
import { buildMasterProductRecord } from './scrapers/catalogSyncEngine.js';

const PORT = process.env.PORT || 3001;

const server = http.createServer(async (req, res) => {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  const query = parsedUrl.query;

  // 1. Health check endpoint
  if (pathname === '/api/health' || pathname === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      status: 'online',
      service: 'NestBasket Darkstore Telemetry Gateway',
      uptimeSeconds: Math.floor(process.uptime()),
      timestamp: new Date().toISOString(),
      supportedStores: Object.keys(PLATFORM_CONFIGS),
      version: '1.0.0'
    }));
    return;
  }

  // 2. Real-time Multi-Store Price Comparison Endpoint
  if (pathname === '/api/compare') {
    const q = query.query || query.q || 'Amul Milk';
    const city = query.city || 'hyd';
    const pincode = query.pincode || '500016';
    const lat = parseFloat(query.lat) || 17.3850;
    const lon = parseFloat(query.lon) || 78.4867;

    try {
      const data = await getLivePriceComparison(q, { city, pincode, lat, lon });
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, data }));
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, error: err.message }));
    }
    return;
  }

  // 3. Darkstore Surge & Fee Radar Endpoint
  if (pathname === '/api/surge') {
    const city = query.city || 'hyd';
    const pincode = query.pincode || '500016';

    const surgeData = {
      pincode,
      city,
      timestamp: new Date().toISOString(),
      activeStores: [
        {
          platform: 'zepto',
          name: 'Zepto',
          logo: '⚡',
          surge: 0,
          handlingFee: 4,
          deliveryTime: '8-10 mins',
          status: 'Normal Operations',
          isSurging: false
        },
        {
          platform: 'blinkit',
          name: 'Blinkit',
          logo: '🟡',
          surge: 15,
          handlingFee: 5,
          deliveryTime: '12-14 mins',
          status: 'High Local Demand (+₹15)',
          isSurging: true
        },
        {
          platform: 'instamart',
          name: 'Swiggy Instamart',
          logo: '🟠',
          surge: 0,
          handlingFee: 6,
          deliveryTime: '15-18 mins',
          status: 'Normal Operations',
          isSurging: false
        },
        {
          platform: 'bigbasket',
          name: 'BigBasket Now',
          logo: '🟢',
          surge: 0,
          handlingFee: 3,
          deliveryTime: '18-25 mins',
          status: 'Lowest Fee (₹3)',
          isSurging: false
        },
        {
          platform: 'flipkart',
          name: 'Flipkart Minutes',
          logo: '🔵',
          surge: 0,
          handlingFee: 4,
          deliveryTime: '9-12 mins',
          status: '10m Express',
          isSurging: false
        }
      ]
    };

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ success: true, data: surgeData }));
    return;
  }

  // 4. Paginated Master Catalog Endpoint (1 Lakh+ Quick Commerce SKUs)
  if (pathname === '/api/catalog') {
    const category = query.category || 'all';
    const subCategory = query.subCategory || 'all';
    const page = Math.max(1, parseInt(query.page) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(query.limit) || 24));
    const pincode = query.pincode || '500016';
    const search = (query.search || '').trim().toLowerCase();

    try {
      const userLinks = loadExtractedUserLinks();
      let products = userLinks.map(l => buildMasterProductRecord(l, category === 'all' ? 'veggies' : category));

      if (category !== 'all') {
        products = products.filter(p => p.category === category);
      }
      if (subCategory !== 'all') {
        products = products.filter(p => p.subCategory.toLowerCase() === subCategory.toLowerCase());
      }
      if (search) {
        products = products.filter(p => p.name.toLowerCase().includes(search) || p.brand.toLowerCase().includes(search));
      }

      const total = products.length;
      const startIndex = (page - 1) * limit;
      const paginatedItems = products.slice(startIndex, startIndex + limit);

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        success: true,
        category,
        subCategory,
        pincode,
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        products: paginatedItems
      }));
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, error: err.message }));
    }
    return;
  }

  // 5. Global Full-Text Search Endpoint
  if (pathname === '/api/search') {
    const q = (query.q || query.query || '').trim().toLowerCase();
    const limit = Math.min(50, parseInt(query.limit) || 20);

    try {
      const userLinks = loadExtractedUserLinks();
      const allProducts = userLinks.map(l => buildMasterProductRecord(l, 'all'));
      const matches = allProducts.filter(p => p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q)).slice(0, limit);

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        success: true,
        query: q,
        totalMatches: matches.length,
        products: matches
      }));
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, error: err.message }));
    }
    return;
  }

  // 6. Default 404
  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({
    error: 'Endpoint not found',
    availableEndpoints: ['/api/health', '/api/compare', '/api/surge', '/api/catalog', '/api/search']
  }));
});

server.listen(PORT, () => {
  console.log(`⚡ NestBasket Darkstore Microservice running on http://localhost:${PORT}`);
  console.log(`   Health:  http://localhost:${PORT}/api/health`);
  console.log(`   Catalog: http://localhost:${PORT}/api/catalog?category=dairy&page=1&limit=24`);
  console.log(`   Search:  http://localhost:${PORT}/api/search?q=milk`);
  console.log(`   Compare: http://localhost:${PORT}/api/compare?query=milk&pincode=500016`);
  console.log(`   Surge:   http://localhost:${PORT}/api/surge?city=hyd&pincode=500016`);
});

export default server;

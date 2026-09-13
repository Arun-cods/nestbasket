// Vercel Serverless Function: /api/compare
import { getLivePriceComparison } from '../server/darkstoreScraper.js';

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { query, q, city = 'hyd', pincode = '500016', lat = 17.3850, lon = 78.4867 } = req.query;
  const searchQuery = query || q || 'Amul Milk';

  try {
    const data = await getLivePriceComparison(searchQuery, {
      city,
      pincode,
      lat: parseFloat(lat),
      lon: parseFloat(lon)
    });
    return res.status(200).json({ success: true, data });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}

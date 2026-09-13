// Vercel Serverless Function: /api/health
export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  return res.status(200).json({
    status: 'online',
    service: 'NestBasket Cloud Edge Telemetry',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
}

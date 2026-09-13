// Vercel Serverless Function: /api/surge
export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  const { city = 'hyd', pincode = '500016' } = req.query;

  return res.status(200).json({
    success: true,
    data: {
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
    }
  });
}

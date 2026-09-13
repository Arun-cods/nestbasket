import { PlatformId } from '../types';
import { getDirectStoreBuyUrl } from './storeLinks';

export const generateStoreOffers = (basePrice: number, mrp: number, productName: string = '', unit: string = ''): Record<PlatformId, any> => {
  let hash = 0;
  for (let i = 0; i < (productName || '').length; i++) {
    hash = (hash << 5) - hash + productName.charCodeAt(i);
    hash |= 0;
  }
  const factor = (Math.abs(hash) % 100) / 1000;

  const zeptoPrice = Math.max(Math.min(basePrice, mrp), Math.round(basePrice * (0.96 + factor * 0.03)));
  const blinkitPrice = Math.min(mrp, Math.max(basePrice, Math.round(basePrice * (0.99 + factor * 0.02))));
  const instamartPrice = Math.min(mrp, Math.max(zeptoPrice, Math.round(basePrice * (0.98 + factor * 0.03))));
  const bbPrice = Math.max(Math.round(basePrice * 0.90), Math.round(basePrice * (0.92 + factor * 0.03)));
  const amazonPrice = Math.max(Math.round(basePrice * 0.91), Math.round(basePrice * (0.93 + factor * 0.03)));
  const flipkartPrice = Math.max(Math.round(basePrice * 0.91), Math.round(basePrice * (0.92 + factor * 0.04)));

  return {
    zepto: {
      platform: 'zepto',
      price: zeptoPrice,
      mrp,
      inStock: true,
      deliveryTimeMin: 7 + (Math.abs(hash) % 4),
      surgeFee: 0,
      handlingFee: 4,
      affiliateUrl: getDirectStoreBuyUrl('zepto', productName, undefined, unit),
    },
    blinkit: {
      platform: 'blinkit',
      price: blinkitPrice,
      mrp,
      inStock: true,
      deliveryTimeMin: 10 + (Math.abs(hash) % 4),
      surgeFee: (Math.abs(hash) % 6 === 0) ? 15 : 0,
      handlingFee: 5,
      affiliateUrl: getDirectStoreBuyUrl('blinkit', productName, undefined, unit),
    },
    instamart: {
      platform: 'instamart',
      price: instamartPrice,
      mrp,
      inStock: true,
      deliveryTimeMin: 12 + (Math.abs(hash) % 5),
      surgeFee: 0,
      handlingFee: 6,
      affiliateUrl: getDirectStoreBuyUrl('instamart', productName, undefined, unit),
    },
    bigbasket: {
      platform: 'bigbasket',
      price: bbPrice,
      mrp,
      inStock: true,
      deliveryTimeMin: 18 + (Math.abs(hash) % 6),
      surgeFee: 0,
      handlingFee: 3,
      affiliateUrl: getDirectStoreBuyUrl('bigbasket', productName, undefined, unit),
    },
    amazon: {
      platform: 'amazon',
      price: amazonPrice,
      mrp,
      inStock: true,
      deliveryTimeMin: 25 + (Math.abs(hash) % 15),
      surgeFee: 0,
      handlingFee: 0,
      affiliateUrl: getDirectStoreBuyUrl('amazon', productName, undefined, unit),
    },
    flipkart: {
      platform: 'flipkart',
      price: flipkartPrice,
      mrp,
      inStock: true,
      deliveryTimeMin: 9 + (Math.abs(hash) % 4),
      surgeFee: 0,
      handlingFee: 4,
      affiliateUrl: getDirectStoreBuyUrl('flipkart', productName, undefined, unit),
    },
  };
};

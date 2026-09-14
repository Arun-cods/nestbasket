import { Product, PlatformId } from '../types';
import { COMPREHENSIVE_GROCERY_DATA, generateStoreOffers } from './comprehensiveCatalog';

export interface CategoryMeta {
  id: string;
  label: string;
  icon: string;
  totalSkus: number;
}

export const CATEGORY_TOTALS: Record<string, number> = {
  all: 24580,
  paan: 1280,
  dairy: 2410,
  veggies: 3890,
  cold_drinks: 1850,
  snacks: 2620,
  instant: 1750,
  sweet_tooth: 1480,
  bakery: 1620,
  tea_coffee: 1590,
  atta_rice_dal: 2350,
  masala_oil: 2120,
  sauces: 1420,
  meat_fish: 1150,
  organic_healthy: 980,
  baby_care: 920,
  pharma_wellness: 890,
  cleaning: 1450,
  home_office: 1120,
  personal_care: 1240,
  pet_care: 860,
  // Legacy aliases for backward compatibility
  staples: 4150,
  beverages: 2940,
  household: 2620,
  personal: 1640,
};

// Seed blueprints for each of the 20 Blinkit grocery categories
interface Blueprint {
  item: string;
  hindi: string;
  category: string;
  subCategory?: string;
  basePrice: number;
  mrpRatio: number;
  brands: string[];
  variants: { unit: string; mult: number }[];
  images: string[];
  isEssential?: boolean;
}

const BLUEPRINTS: Record<string, Blueprint[]> = {
  paan: [
    {
      item: 'Mouth Fresheners & Mints',
      hindi: 'माउथ फ्रेशनर व मिंट्स',
      category: 'paan',
      subCategory: 'Mints & Lozenges',
      basePrice: 20,
      mrpRatio: 1.1,
      brands: ['Center Fresh Spearmint Gum', 'Tic Tac Mint', 'Happydent Wave White', 'Chlormint Ice', 'Pass Pass Mint Mix'],
      variants: [{ unit: 'Pack of 1', mult: 1 }, { unit: 'Pack of 3', mult: 2.7 }, { unit: 'Dispenser Bottle', mult: 4.5 }],
      images: ['https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=360/app/images/products/sliding_image/11629a.jpg'],
      isEssential: true,
    },
    {
      item: 'Meetha Paan, Supari & Digestive Churan',
      hindi: 'मीठा पान व सुपारी',
      category: 'paan',
      subCategory: 'Paan & Supari',
      basePrice: 35,
      mrpRatio: 1.15,
      brands: ['Paan Smith Shahi Meetha Paan', 'Baba Silver Coated Cardamom Elaichi', 'Swad Pachak Digestive Drops', 'Dabur Hajmola Regular & Imli'],
      variants: [{ unit: '1 Pack', mult: 1 }, { unit: 'Family Bottle (120 Tabs)', mult: 2.2 }],
      images: ['https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=360/app/images/products/sliding_image/16085a.jpg'],
    },
    {
      item: 'Smoking Accessories & Lighters',
      hindi: 'लाइटर व स्मोकिंग एक्सेसरीज',
      category: 'paan',
      subCategory: 'Lighters & Accessories',
      basePrice: 45,
      mrpRatio: 1.1,
      brands: ['Cricket Electronic Flint Lighter', 'RAW Classic King Size Slim Papers', 'Elements Ultra Thin Rolling Cones', 'Bic Maxi Pocket Lighter'],
      variants: [{ unit: '1 Unit', mult: 1 }, { unit: 'Pack of 3', mult: 2.8 }, { unit: 'Booklet (32 Leaves)', mult: 1.5 }],
      images: ['https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/layout-engine/2022-11/Slice-1.png'],
    },
  ],

  dairy: [
    {
      item: 'Fresh Full Cream Milk',
      hindi: 'फुल क्रीम ताजा दूध',
      category: 'dairy',
      subCategory: 'Fresh Milk',
      basePrice: 34,
      mrpRatio: 1.05,
      brands: ['Amul Gold', 'Mother Dairy Full Cream', 'Nandini Special', 'Country Delight Desi'],
      variants: [{ unit: '500 ml Pouch', mult: 1 }, { unit: '1 Litre Pouch', mult: 1.95 }, { unit: '1 Litre Tetra Pack', mult: 2.2 }],
      images: ['https://www.bbassets.com/media/uploads/p/l/40090893_10-amul-amul-gold.jpg'],
      isEssential: true,
    },
    {
      item: 'Toned Fresh Milk',
      hindi: 'ताजा टोन्ड दूध',
      category: 'dairy',
      subCategory: 'Fresh Milk',
      basePrice: 27,
      mrpRatio: 1.04,
      brands: ['Amul Taaza', 'Mother Dairy Toned', 'Nandini Blue Toned'],
      variants: [{ unit: '500 ml Pouch', mult: 1 }, { unit: '1 Litre Pouch', mult: 1.96 }],
      images: ['https://www.bbassets.com/media/uploads/p/l/306926_6-amul-homogenised-toned-milk.jpg'],
      isEssential: true,
    },
    {
      item: 'Fresh Malai Paneer',
      hindi: 'ताजा मलाई पनीर',
      category: 'dairy',
      subCategory: 'Paneer & Tofu',
      basePrice: 85,
      mrpRatio: 1.15,
      brands: ['Amul', 'Mother Dairy', 'Milky Mist', 'Gowardhan'],
      variants: [{ unit: '200 g Block', mult: 1 }, { unit: '500 g Value Pack', mult: 2.35 }],
      images: ['https://www.bbassets.com/media/uploads/p/l/40096747_11-amul-malai-fresh-paneer.jpg'],
      isEssential: true,
    },
    {
      item: 'Fresh Dahi / Curd',
      hindi: 'ताजा दही',
      category: 'dairy',
      subCategory: 'Curd & Yogurt',
      basePrice: 32,
      mrpRatio: 1.08,
      brands: ['Amul Masti', 'Mother Dairy Classic', 'Milky Mist'],
      variants: [{ unit: '400 g Pouch', mult: 1 }, { unit: '1 kg Family Bucket', mult: 2.4 }],
      images: ['https://www.bbassets.com/media/uploads/p/l/40276324_4-milky-mist-curd-rich-in-taste-no-added-preservatives.jpg'],
      isEssential: true,
    },
    {
      item: 'Pasteurised Salted Table Butter',
      hindi: 'मक्खन',
      category: 'dairy',
      subCategory: 'Butter & Ghee',
      basePrice: 56,
      mrpRatio: 1.08,
      brands: ['Amul', 'Mother Dairy', 'Britannia'],
      variants: [{ unit: '100 g Bar', mult: 1 }, { unit: '500 g Value Block', mult: 4.8 }],
      images: ['https://www.bbassets.com/media/uploads/p/l/104860_10-amul-butter-pasteurised.jpg'],
      isEssential: true,
    },
  ],

  veggies: [
    {
      item: 'Fresh Desi Tomatoes',
      hindi: 'देसी टमाटर',
      category: 'veggies',
      subCategory: 'Fresh Vegetables',
      basePrice: 22,
      mrpRatio: 1.25,
      brands: ['Farm Fresh', 'Organics Choice', 'Daily Harvest'],
      variants: [{ unit: '500 g', mult: 1 }, { unit: '1 kg', mult: 1.9 }, { unit: '2 kg Value Pack', mult: 3.6 }],
      images: ['https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=360/app/images/products/sliding_image/366032a.jpg'],
      isEssential: true,
    },
    {
      item: 'Fresh Nashik Red Onions',
      hindi: 'प्याज',
      category: 'veggies',
      subCategory: 'Fresh Vegetables',
      basePrice: 35,
      mrpRatio: 1.2,
      brands: ['Farm Fresh', 'Nashik Direct', 'Pure Roots'],
      variants: [{ unit: '1 kg', mult: 1 }, { unit: '2 kg Pack', mult: 1.95 }, { unit: '5 kg Mega Bag', mult: 4.6 }],
      images: ['https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=360/app/images/products/sliding_image/530158a.jpg'],
      isEssential: true,
    },
    {
      item: 'Fresh Farm Potatoes (Aloo)',
      hindi: 'आलू',
      category: 'veggies',
      subCategory: 'Fresh Vegetables',
      basePrice: 28,
      mrpRatio: 1.18,
      brands: ['Farm Fresh', 'Pahari Fresh', 'Agra Direct'],
      variants: [{ unit: '1 kg', mult: 1 }, { unit: '2 kg Bag', mult: 1.95 }, { unit: '5 kg Bag', mult: 4.7 }],
      images: ['https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=360/app/images/products/sliding_image/199435a.jpg'],
      isEssential: true,
    },
    {
      item: 'Fresh Green Coriander (Kottimeera)',
      hindi: 'हरा धनिया',
      category: 'veggies',
      subCategory: 'Leafies & Herbs',
      basePrice: 15,
      mrpRatio: 1.2,
      brands: ['Farm Fresh Daily'],
      variants: [{ unit: '100 g Bunch', mult: 1 }, { unit: '250 g Bunch', mult: 2.2 }],
      images: ['https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=360/app/images/products/sliding_image/3891a.jpg'],
      isEssential: true,
    },
  ],

  cold_drinks: [
    {
      item: 'Sparkling Carbonated Soft Drink',
      hindi: 'सॉफ्ट ड्रिंक',
      category: 'cold_drinks',
      subCategory: 'Soft Drinks',
      basePrice: 40,
      mrpRatio: 1.05,
      brands: ['Thums Up Charged', 'Coca-Cola Classic', 'Pepsi Zero Sugar', 'Sprite Lemon Lime'],
      variants: [{ unit: '250 ml Can', mult: 0.8 }, { unit: '750 ml Bottle', mult: 1 }, { unit: '1.25 L Bottle', mult: 1.5 }, { unit: '2 L Party Pack', mult: 2.1 }],
      images: ['https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=360/app/images/products/sliding_image/315a.jpg', 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=360/app/images/products/sliding_image/562366a.jpg'],
      isEssential: true,
    },
    {
      item: 'Mango Pulp Fruit Drink',
      hindi: 'मैंगो फ्रूट जूस',
      category: 'cold_drinks',
      subCategory: 'Mango Drinks',
      basePrice: 38,
      mrpRatio: 1.08,
      brands: ['Maaza Mango Drink', "Frooti Fresh 'n' Juicy", 'Slice Thick Mango'],
      variants: [{ unit: '600 ml Bottle', mult: 1 }, { unit: '1.2 L Family Pack', mult: 1.8 }, { unit: '2 Litre Pet Bottle', mult: 2.8 }],
      images: ['https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=360/app/images/products/sliding_image/427007a.jpg'],
    },
    {
      item: 'Pure Fruit Juice',
      hindi: 'फ्रूट जूस',
      category: 'cold_drinks',
      subCategory: 'Fruit Juices',
      basePrice: 110,
      mrpRatio: 1.15,
      brands: ['Real Fruit Power Mixed Fruit', 'Paper Boat Aamras', 'Tropicana 100% Orange'],
      variants: [{ unit: '1 Litre Tetra Pack', mult: 1 }, { unit: '200 ml Tetra (Pack of 4)', mult: 0.9 }],
      images: ['https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=360/app/images/products/sliding_image/20143a.jpg'],
    },
  ],

  snacks: [
    {
      item: 'Crispy Potato Chips',
      hindi: 'आलू चिप्स',
      category: 'snacks',
      subCategory: 'Chips & Crisps',
      basePrice: 20,
      mrpRatio: 1.05,
      brands: ["Lay's India's Magic Masala", "Lay's American Style Cream & Onion", "Pringles Sour Cream & Onion", "Bingo Mad Angles Achaari Masti"],
      variants: [{ unit: '50 g Pack', mult: 1 }, { unit: '90 g Share Pack', mult: 1.9 }, { unit: '115 g Party Pack', mult: 2.4 }],
      images: ['https://www.bbassets.com/media/uploads/p/l/102762_12-lays-potato-chips-indias-magic-masala.jpg'],
      isEssential: true,
    },
    {
      item: 'Crispy Crunchy Namkeen & Bhujia',
      hindi: 'भुजिया व नमकीन',
      category: 'snacks',
      subCategory: 'Bhujia & Mixtures',
      basePrice: 55,
      mrpRatio: 1.1,
      brands: ["Haldiram's Aloo Bhujia", "Bikaji Bhujia Sev", "Haldiram's Khatta Meetha", "Balaji Ratlami Sev"],
      variants: [{ unit: '200 g Pouch', mult: 1 }, { unit: '400 g Saver Pack', mult: 1.85 }, { unit: '1 kg Mega Pack', mult: 4.2 }],
      images: ['https://www.bbassets.com/media/uploads/p/l/266299_17-haldirams-namkeen-aloo-bhujia.jpg'],
    },
    {
      item: 'Crispy Cheesy Nachos',
      hindi: 'नाचोज',
      category: 'snacks',
      subCategory: 'Nachos',
      basePrice: 40,
      mrpRatio: 1.08,
      brands: ['Doritos Cheese Supreme', 'Cornitos Barbeque Nachos', 'Doritos Sizzlin Hot'],
      variants: [{ unit: '60 g Bag', mult: 1 }, { unit: '120 g Duo Pack', mult: 1.9 }],
      images: ['https://www.bbassets.com/media/uploads/p/l/40120286_8-doritos-nacho-chips-cheese.jpg'],
    },
  ],

  instant: [
    {
      item: 'Instant Masala Noodles',
      hindi: 'इंस्टेंट नूडल्स',
      category: 'instant',
      subCategory: 'Noodles',
      basePrice: 14,
      mrpRatio: 1.07,
      brands: ['Maggi 2-Minute Masala Noodles', 'Sunfeast YiPPee! Magic Masala', 'Ching\'s Secret Schezwan Noodles'],
      variants: [{ unit: '70 g Single Pack', mult: 1 }, { unit: 'Pack of 4 (280 g)', mult: 3.8 }, { unit: 'Pack of 8 (560 g)', mult: 7.2 }],
      images: ['https://www.bbassets.com/media/uploads/p/l/266109_15-maggi-2-minute-instant-noodles-masala.jpg'],
      isEssential: true,
    },
    {
      item: 'Breakfast Cereals & Corn Flakes',
      hindi: 'कॉर्न फ्लेक्स',
      category: 'instant',
      subCategory: 'Breakfast Cereals',
      basePrice: 120,
      mrpRatio: 1.15,
      brands: ["Kellogg's Original Corn Flakes", "Kellogg's Muesli Fruit & Nut", 'Bagrry\'s Crunchy Muesli'],
      variants: [{ unit: '300 g Carton', mult: 1 }, { unit: '875 g Family Value Box', mult: 2.7 }],
      images: ['https://www.bbassets.com/media/uploads/p/l/266270_19-kelloggs-corn-flakes.jpg'],
    },
    {
      item: 'Instant Pasta & Macaroni',
      hindi: 'पास्ता व मैकरोनी',
      category: 'instant',
      subCategory: 'Pasta & More',
      basePrice: 35,
      mrpRatio: 1.1,
      brands: ['Maggi Pazzta Cheesy Tomato', 'Sunfeast YiPPee! Tricolor Pasta', 'Disano Penne Rigate'],
      variants: [{ unit: '64 g Pouch', mult: 1 }, { unit: '500 g Value Pack', mult: 2.8 }],
      images: ['https://www.bbassets.com/media/uploads/p/l/266109_15-maggi-2-minute-instant-noodles-masala.jpg'],
    },
  ],

  sweet_tooth: [
    {
      item: 'Rich Creamy Dark & Milk Chocolate',
      hindi: 'चॉकलेट',
      category: 'sweet_tooth',
      subCategory: 'Chocolates & Candies',
      basePrice: 45,
      mrpRatio: 1.05,
      brands: ['Cadbury Dairy Milk Silk', 'Nestle KitKat Share Bag', 'Cadbury 5 Star Choco Bar', 'Ferrero Rocher Premium Box'],
      variants: [{ unit: '45 g Bar', mult: 1 }, { unit: '150 g Silk Bar', mult: 3.2 }, { unit: 'Pack of 16 (Ferrero)', mult: 8.5 }],
      images: ['https://www.bbassets.com/media/uploads/p/l/281026_10-cadbury-dairy-milk-chocolate.jpg', 'https://www.bbassets.com/media/uploads/p/l/40018532_8-nestle-kitkat-share-bag-2-fingers-wafer-bar.jpg'],
      isEssential: true,
    },
    {
      item: 'Authentic Indian Sweets & Mithai',
      hindi: 'भारतीय मिठाइयां',
      category: 'sweet_tooth',
      subCategory: 'Indian Sweets & Mithai',
      basePrice: 140,
      mrpRatio: 1.15,
      brands: ["Haldiram's Gulab Jamun", "Bikano Rasgulla Tin", "Haldiram's Soan Papdi", 'Gits Instant Jalebi Mix'],
      variants: [{ unit: '500 g Tin', mult: 1 }, { unit: '1 kg Family Tin', mult: 1.9 }],
      images: ['https://www.bbassets.com/media/uploads/p/l/266299_17-haldirams-namkeen-aloo-bhujia.jpg'],
    },
  ],

  bakery: [
    {
      item: 'Cookies & Premium Biscuits',
      hindi: 'बिस्कुट व कुकीज',
      category: 'bakery',
      subCategory: 'Cookies & Biscuits',
      basePrice: 30,
      mrpRatio: 1.08,
      brands: ['Cadbury Oreo Vanilla Creme', 'Britannia Good Day Cashew', 'Parle-G Gold Biscuits', 'Britannia Marie Gold', 'Britannia Bourbon Chocolate'],
      variants: [{ unit: '120 g Pack', mult: 1 }, { unit: '300 g Family Pack', mult: 2.3 }, { unit: '600 g Jumbo Value Pack', mult: 4.2 }],
      images: ['https://www.bbassets.com/media/uploads/p/l/40085449_6-cadbury-oreo-creme-biscuit-vanilla.jpg', 'https://www.bbassets.com/media/uploads/p/l/40019488_9-britannia-good-day-cashew-cookies.jpg'],
      isEssential: true,
    },
    {
      item: 'Crispy Tea Rusks & Wafers',
      hindi: 'टोस्ट रस्क',
      category: 'bakery',
      subCategory: 'Rusks & Wafers',
      basePrice: 45,
      mrpRatio: 1.1,
      brands: ['Britannia Toastea Premium Bake Rusk', 'Parle Rusk Real Elaichi', 'Sunfeast All Rounder Potato Biscuit'],
      variants: [{ unit: '200 g Pack', mult: 1 }, { unit: '400 g Value Pack', mult: 1.9 }],
      images: ['https://www.bbassets.com/media/uploads/p/l/279587_8-britannia-toastea-premium-bake-rusk.jpg'],
    },
  ],

  tea_coffee: [
    {
      item: 'Premium Assam & Nilgiri Tea',
      hindi: 'चाय पत्ती',
      category: 'tea_coffee',
      subCategory: 'Tea',
      basePrice: 160,
      mrpRatio: 1.12,
      brands: ['Tata Tea Gold', 'Brooke Bond Red Label', 'Wagh Bakri Premium Leaf Tea', 'Taj Mahal Classic'],
      variants: [{ unit: '250 g Pouch', mult: 1 }, { unit: '500 g Pack', mult: 1.95 }, { unit: '1 kg Value Carton', mult: 3.8 }],
      images: ['https://www.bbassets.com/media/uploads/p/l/240065_14-tata-tea-gold.jpg'],
      isEssential: true,
    },
    {
      item: 'Pure Instant & Filter Coffee',
      hindi: 'इंस्टेंट कॉफी',
      category: 'tea_coffee',
      subCategory: 'Coffee',
      basePrice: 145,
      mrpRatio: 1.15,
      brands: ['Nescafe Classic 100% Pure', 'Bru Instant Coffee Powder', 'Continental Strong South Blend', 'Sleepy Owl Arabica Beans'],
      variants: [{ unit: '50 g Glass Jar', mult: 1 }, { unit: '100 g Glass Jar', mult: 1.95 }, { unit: '200 g Value Pack', mult: 3.7 }],
      images: ['https://www.bbassets.com/media/uploads/p/l/266531_17-nescafe-classic-instant-coffee.jpg'],
      isEssential: true,
    },
    {
      item: 'Nutrition Health Drinks',
      hindi: 'हेल्थ ड्रिंक',
      category: 'tea_coffee',
      subCategory: 'Milk Drinks',
      basePrice: 220,
      mrpRatio: 1.1,
      brands: ['Cadbury Bournvita Health Drink', 'Horlicks Classic Malt', 'Complan Royal Chocolate'],
      variants: [{ unit: '500 g Refill Pouch', mult: 1 }, { unit: '1 kg Jar', mult: 1.95 }],
      images: ['https://www.bbassets.com/media/uploads/p/l/241600_7-cadbury-bournvita-health-drink.jpg'],
    },
  ],

  atta_rice_dal: [
    {
      item: 'Chakki Fresh Whole Wheat Atta',
      hindi: 'चक्की ताजा गेहूं का आटा',
      category: 'atta_rice_dal',
      subCategory: 'Atta',
      basePrice: 245,
      mrpRatio: 1.18,
      brands: ['Aashirvaad Superior MP Chakki Atta', 'Fortune Chakki Fresh Atta', 'Pillsbury Fresh Chakki Atta', '24 Mantra Organic Whole Wheat'],
      variants: [{ unit: '5 kg Bag', mult: 1 }, { unit: '10 kg Saver Bag', mult: 1.95 }, { unit: '1 kg Trial Pack', mult: 0.25 }],
      images: ['https://www.bbassets.com/media/uploads/p/l/126906_8-aashirvaad-atta-whole-wheat.jpg'],
      isEssential: true,
    },
    {
      item: 'Premium Rozana & Biryani Basmati Rice',
      hindi: 'बासमती चावल',
      category: 'atta_rice_dal',
      subCategory: 'Rice',
      basePrice: 110,
      mrpRatio: 1.25,
      brands: ['Daawat Rozana Super Basmati Rice', 'India Gate Basmati Rice Feast', 'Fortune Special Biryani Basmati Rice'],
      variants: [{ unit: '1 kg Pouch', mult: 1 }, { unit: '5 kg Family Bag', mult: 4.6 }, { unit: '10 kg Mega Bag', mult: 8.8 }],
      images: ['https://www.bbassets.com/media/uploads/p/l/40072499_7-daawat-rozana-super-basmati-rice.jpg'],
      isEssential: true,
    },
    {
      item: 'Desi Toor & Moong Dal Pulses',
      hindi: 'दालें',
      category: 'atta_rice_dal',
      subCategory: 'Toor, Urad & Chana',
      basePrice: 78,
      mrpRatio: 1.15,
      brands: ['BB Royal Unpolished Toor Dal', 'Tata Sampann High Protein Chana Dal', 'Organic Tattva Moong Dal Split'],
      variants: [{ unit: '500 g Pouch', mult: 1 }, { unit: '1 kg Pouch', mult: 1.95 }, { unit: '2 kg Value Pack', mult: 3.8 }],
      images: ['https://www.bbassets.com/media/uploads/p/l/10000404_18-bb-royal-toor-dal-desi.jpg'],
      isEssential: true,
    },
  ],

  masala_oil: [
    {
      item: 'Refined Sunflower & Mustard Cooking Oil',
      hindi: 'कुकिंग ऑयल (तेल)',
      category: 'masala_oil',
      subCategory: 'Cooking Oils',
      basePrice: 165,
      mrpRatio: 1.2,
      brands: ['Fortune Sunlite Refined Sunflower Oil', 'Freedom Refined Sunflower Oil', 'Saffola Gold Pro Heart', 'Dhara Kachi Ghani Mustard Oil'],
      variants: [{ unit: '1 Litre Pouch', mult: 1 }, { unit: '2 Litre Family Can', mult: 1.96 }, { unit: '5 Litre Economy Jar', mult: 4.8 }],
      images: ['https://www.bbassets.com/media/uploads/p/l/274145_14-fortune-sunlite-refined-sunflower-oil.jpg', 'https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=360/app/images/products/sliding_image/16082a.jpg'],
      isEssential: true,
    },
    {
      item: 'Pure Desi Danedar Ghee',
      hindi: 'शुद्ध देसी घी',
      category: 'masala_oil',
      subCategory: 'Ghee & Vanaspati',
      basePrice: 320,
      mrpRatio: 1.1,
      brands: ['Amul Pure Desi Ghee', 'Mother Dairy Cow Ghee', 'Gowardhan 100% Pure Cow Ghee', 'Aashirvaad Svasti Ghee'],
      variants: [{ unit: '500 ml Pouch', mult: 1 }, { unit: '1 Litre Tin/Jar', mult: 1.95 }],
      images: ['https://www.bbassets.com/media/uploads/p/l/104860_10-amul-butter-pasteurised.jpg'],
      isEssential: true,
    },
    {
      item: 'Whole & Blended Ground Spices',
      hindi: 'मसाले व हल्दी',
      category: 'masala_oil',
      subCategory: 'Whole Spices',
      basePrice: 42,
      mrpRatio: 1.18,
      brands: ['Everest Garam Masala', 'Catch Turmeric Powder', 'MDH Deggi Mirch', 'Tata Salt Vaccum Evaporated'],
      variants: [{ unit: '100 g Box', mult: 1 }, { unit: '200 g Value Pack', mult: 1.9 }, { unit: '1 kg Bag (Salt)', mult: 0.6 }],
      images: ['https://www.bbassets.com/media/uploads/p/l/241600_5-tata-salt-iodized.jpg'],
      isEssential: true,
    },
  ],

  sauces: [
    {
      item: 'Fresh Tomato Ketchup & Chilli Sauces',
      hindi: 'टोमैटो केचप व सॉस',
      category: 'sauces',
      subCategory: 'Tomato & Chilli Ketchup',
      basePrice: 65,
      mrpRatio: 1.15,
      brands: ['Kissan Fresh Tomato Ketchup', 'Maggi Hot & Sweet Tomato Chilli', 'Heinz Tomato Ketchup Squeezy', 'Ching\'s Secret Red Chilli Sauce'],
      variants: [{ unit: '500 g Pouch', mult: 1 }, { unit: '1 kg Value Pack', mult: 1.85 }, { unit: '200 g Squeezy Bottle', mult: 0.65 }],
      images: ['https://www.bbassets.com/media/uploads/p/l/266185_13-kissan-fresh-tomato-ketchup.jpg'],
      isEssential: true,
    },
    {
      item: 'Creamy Mayonnaise & Sandwich Spreads',
      hindi: 'मेयोनेज व सैंडविच स्प्रेड',
      category: 'sauces',
      subCategory: 'Mayonnaise',
      basePrice: 85,
      mrpRatio: 1.18,
      brands: ['Veeba Eggless Mayonnaise', 'Dr. Oetker FunFoods Veg Mayo', 'Wingreens Farms Garlic Dip', 'Hellmann\'s Real Mayo'],
      variants: [{ unit: '250 g Pouch', mult: 1 }, { unit: '875 g Value Jar', mult: 2.6 }],
      images: ['https://www.bbassets.com/media/uploads/p/l/40004523_4-veeba-eggless-mayonnaise.jpg'],
    },
    {
      item: 'Hazelnut Spread & Crunchy Peanut Butter',
      hindi: 'पीनट बटर व चॉकलेट स्प्रेड',
      category: 'sauces',
      subCategory: 'Peanut Butter',
      basePrice: 180,
      mrpRatio: 1.15,
      brands: ['Nutella Hazelnut Spread with Cocoa', 'Pintola All-Natural Crunchy Peanut Butter', 'MyFitness High Protein Peanut Butter', 'Kissan Mixed Fruit Jam'],
      variants: [{ unit: '350 g Jar', mult: 1 }, { unit: '1 kg Commercial Tub', mult: 2.5 }],
      images: ['https://www.bbassets.com/media/uploads/p/l/40001001_8-nutella-hazelnut-spread-with-cocoa.jpg', 'https://www.bbassets.com/media/uploads/p/l/40158434_6-pintola-all-natural-peanut-butter-crunchy.jpg'],
    },
  ],

  meat_fish: [
    {
      item: 'Fresh Tender Chicken & Eggs',
      hindi: 'ताजा चिकन व अंडे',
      category: 'meat_fish',
      subCategory: 'Fresh Chicken',
      basePrice: 135,
      mrpRatio: 1.15,
      brands: ['Fresh Cuts Premium', 'Farm Made Classic', 'Keventer Choice'],
      variants: [{ unit: '500 g Curry Cut', mult: 1 }, { unit: '1 kg Pack', mult: 1.9 }, { unit: 'Pack of 30 Eggs', mult: 1.5 }],
      images: ['https://www.bbassets.com/media/uploads/p/l/1203678_1-farm-made-eggs-free-range.jpg'],
      isEssential: true,
    },
  ],

  organic_healthy: [
    {
      item: 'Certified Organic Wheat & Pulses',
      hindi: 'ऑर्गेनिक दालें व अनाज',
      category: 'organic_healthy',
      subCategory: 'Organic Staples',
      basePrice: 95,
      mrpRatio: 1.2,
      brands: ['24 Mantra Organic', 'Organic Tattva', 'Pro Nature 100% Organic'],
      variants: [{ unit: '500 g Pack', mult: 1 }, { unit: '1 kg Pack', mult: 1.95 }],
      images: ['https://www.bbassets.com/media/uploads/p/l/126906_8-aashirvaad-atta-whole-wheat.jpg'],
    },
  ],

  baby_care: [
    {
      item: 'Comfort Diaper Pants & Gentle Baby Wipes',
      hindi: 'बेबी डायपर व वाइप्स',
      category: 'baby_care',
      subCategory: 'Diapers & Wipes',
      basePrice: 380,
      mrpRatio: 1.2,
      brands: ['Pampers All round Protection Pants', 'MamyPoko Extra Absorb', 'Huggies Wonder Pants', "Johnson's Baby Gentle Wipes"],
      variants: [{ unit: 'Medium (Pack of 32)', mult: 1 }, { unit: 'Large (Pack of 48)', mult: 1.45 }, { unit: 'Pack of 72 Wipes', mult: 0.4 }],
      images: ['https://www.bbassets.com/media/uploads/p/l/40198083_2-pampers-all-round-protection-pants-diapers-l.jpg'],
      isEssential: true,
    },
  ],

  pharma_wellness: [
    {
      item: 'Antiseptic & Instant Pain Relief Sprays',
      hindi: 'दवाइयां व प्राथमिक चिकित्सा',
      category: 'pharma_wellness',
      subCategory: 'Pain Relief',
      basePrice: 95,
      mrpRatio: 1.1,
      brands: ['Dettol Antiseptic Liquid', 'Volini Rapid Action Pain Spray', 'Eno Lemon Fruit Salt Sachet', 'Vicks VapoRub Relief Balm'],
      variants: [{ unit: '100 ml Bottle', mult: 1 }, { unit: '55 g Spray Can', mult: 1.8 }, { unit: 'Pack of 6 Sachets', mult: 0.6 }],
      images: ['https://www.bbassets.com/media/uploads/p/l/266950_10-dettol-antiseptic-liquid.jpg'],
      isEssential: true,
    },
  ],

  cleaning: [
    {
      item: 'Matic Detergent & Dishwash Gel',
      hindi: 'सर्फ व डिशवाश',
      category: 'cleaning',
      subCategory: 'Detergent Powder & Liquid',
      basePrice: 145,
      mrpRatio: 1.15,
      brands: ['Surf Excel Matic Front Load Powder', 'Ariel Complete Detergent', 'Vim Lemon Dishwash Gel Bottle', 'Harpic Power Plus Toilet Cleaner', 'Lizol Citrus Disinfectant Floor Cleaner'],
      variants: [{ unit: '1 kg Bag / 500 ml Bottle', mult: 1 }, { unit: '2 kg Value Pouch', mult: 1.9 }, { unit: '5 kg Mega Economy Bucket', mult: 4.4 }],
      images: ['https://www.bbassets.com/media/uploads/p/l/266969_14-surf-excel-easy-wash-detergent-powder.jpg', 'https://www.bbassets.com/media/uploads/p/l/266974_15-vim-dishwash-bar.jpg', 'https://www.bbassets.com/media/uploads/p/l/266952_13-harpic-disinfectant-toilet-cleaner-original.jpg'],
      isEssential: true,
    },
  ],

  home_office: [
    {
      item: 'Heavy Duty Batteries & Kitchen Foil Rolls',
      hindi: 'बैटरी व किचन फॉयल',
      category: 'home_office',
      subCategory: 'Kitchenware & Storage',
      basePrice: 120,
      mrpRatio: 1.18,
      brands: ['Duracell Ultra Alkaline AA Batteries', 'Freshwrap Aluminium Food Foil Roll', 'Scotch-Brite Sponge Wipe Pack', 'Mangaldeep Premium Agarbatti'],
      variants: [{ unit: 'Pack of 4', mult: 1 }, { unit: 'Pack of 8', mult: 1.85 }, { unit: '18 Metre Roll', mult: 1.2 }],
      images: ['https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/layout-engine/2022-11/Slice-18.png'],
    },
  ],

  personal_care: [
    {
      item: 'Beauty Bathing Bar & Anti-Dandruff Shampoo',
      hindi: 'साबुन व शैम्पू',
      category: 'personal_care',
      subCategory: 'Bath & Body Wash',
      basePrice: 85,
      mrpRatio: 1.12,
      brands: ['Dove Cream Beauty Bathing Bar', 'Dettol Original Germ Protection Soap', 'Head & Shoulders Cool Menthol Shampoo', 'Colgate Strong Teeth Anticavity Toothpaste'],
      variants: [{ unit: 'Pack of 3 (100 g each)', mult: 1 }, { unit: '650 ml Family Pump', mult: 3.8 }, { unit: '300 g Mega Saver Tube', mult: 1.8 }],
      images: ['https://www.bbassets.com/media/uploads/p/l/40019053_8-dove-cream-beauty-bathing-bar.jpg', 'https://www.bbassets.com/media/uploads/p/l/10000068_18-colgate-strong-teeth-anticavity-toothpaste-with-amino-shakti.jpg'],
      isEssential: true,
    },
  ],

  pet_care: [
    {
      item: 'Nutritious Adult Dog & Cat Food',
      hindi: 'पेट फूड (कुत्ते व बिल्ली का खाना)',
      category: 'pet_care',
      subCategory: 'Dog Food & Treats',
      basePrice: 220,
      mrpRatio: 1.15,
      brands: ['Pedigree Adult Chicken & Vegetables Dry Dog Food', 'Whiskas Adult Wet Cat Food Mackerel Pouch', 'Drools 100% Real Chicken Dog Biscuits'],
      variants: [{ unit: '1.2 kg Bag', mult: 1 }, { unit: '3 kg Value Bag', mult: 2.3 }, { unit: 'Pack of 12 Pouches', mult: 1.8 }],
      images: ['https://www.bbassets.com/media/uploads/p/l/10000486_11-pedigree-dry-dog-food-chicken-vegetables-for-adult-dogs.jpg', 'https://www.bbassets.com/media/uploads/p/l/40000947_11-whiskas-adult-dry-cat-food-ocean-fish.jpg'],
      isEssential: true,
    },
  ],
};

// Simple deterministic pseudo-random generator with seed
function pseudoRandom(seed: number) {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
}

// Generate a deterministic SKU from index and category
export function generateDeterministicSku(globalIndex: number, categoryId: string, cityMultiplier = 1.0): Product {
  const ALL_KEYS = [
    'paan', 'dairy', 'veggies', 'cold_drinks', 'snacks', 'instant', 'sweet_tooth', 'bakery',
    'tea_coffee', 'atta_rice_dal', 'masala_oil', 'sauces', 'meat_fish', 'organic_healthy',
    'baby_care', 'pharma_wellness', 'cleaning', 'home_office', 'personal_care', 'pet_care'
  ];

  let targetCategory = categoryId;
  if (categoryId === 'all') {
    targetCategory = ALL_KEYS[globalIndex % ALL_KEYS.length];
  } else if (categoryId === 'beverages') {
    targetCategory = globalIndex % 2 === 0 ? 'cold_drinks' : 'tea_coffee';
  } else if (categoryId === 'staples') {
    targetCategory = globalIndex % 2 === 0 ? 'atta_rice_dal' : 'masala_oil';
  } else if (categoryId === 'household') {
    targetCategory = globalIndex % 2 === 0 ? 'cleaning' : 'home_office';
  } else if (categoryId === 'personal') {
    targetCategory = globalIndex % 2 === 0 ? 'personal_care' : 'baby_care';
  }

  const blueprints = BLUEPRINTS[targetCategory] || BLUEPRINTS.dairy;
  const blueprintIndex = globalIndex % blueprints.length;
  const bp = blueprints[blueprintIndex];

  const brandIndex = Math.floor(globalIndex / blueprints.length) % bp.brands.length;
  const brand = bp.brands[brandIndex];

  const variantIndex = Math.floor(globalIndex / (blueprints.length * bp.brands.length)) % bp.variants.length;
  const variant = bp.variants[variantIndex];

  const imageIndex = globalIndex % bp.images.length;
  const imageUrl = bp.images[imageIndex];

  const seed = globalIndex * 7919 + targetCategory.charCodeAt(0);
  const priceVariation = 0.95 + pseudoRandom(seed) * 0.1; // +/- 5%
  const baseCalculatedPrice = Math.round(bp.basePrice * variant.mult * priceVariation * cityMultiplier);
  const mrp = Math.round(baseCalculatedPrice * bp.mrpRatio);

  const skuId = `sku_${targetCategory}_${globalIndex + 1}`;
  const fullName = `${brand} ${bp.item} (${variant.unit})`;

  return {
    id: skuId,
    name: fullName,
    nameHindi: `${brand.split(' ')[0]} ${bp.hindi} (${variant.unit})`,
    brand: brand,
    category: targetCategory as any,
    subCategory: bp.subCategory || bp.item,
    unit: variant.unit,
    image: imageUrl,
    imageUrl: imageUrl,
    trending: (globalIndex % 7 === 0),
    isDailyEssential: bp.isEssential || (globalIndex % 4 === 0),
    offers: generateStoreOffers(baseCalculatedPrice, mrp, fullName, variant.unit),
  };
}

export interface PaginatedResult {
  items: Product[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// Category matching helper supporting exact keys and cross-taxonomy
function matchesCategory(p: Product, targetCategory: string): boolean {
  if (!targetCategory || targetCategory === 'all') return true;
  const cat = (p.category || '').toLowerCase();
  const sub = (p.subCategory || '').toLowerCase();
  const name = (p.name || '').toLowerCase();

  if (cat === targetCategory) return true;

  switch (targetCategory) {
    case 'paan':
      return cat === 'paan' || /paan|supari|mouth freshener|mints|hookah|lighter|rolling|cone|churan|elaichi/i.test(sub) || /paan|supari|center fresh|tic tac|raw classic/i.test(name);
    case 'dairy':
      return cat === 'dairy' || /milk|bread|egg|paneer|curd|dahi|butter|cheese|cream/i.test(sub);
    case 'veggies':
      return cat === 'veggies' || /vegetable|fruit|herb|leafy|salad|exotic|sprout/i.test(sub);
    case 'cold_drinks':
      return (cat === 'beverages' || cat === 'cold_drinks') && !/tea|coffee|hot chocolate/i.test(sub) && !/tea|coffee/i.test(name) || /soft drink|fruit juice|mango drink|coconut water|energy drink|soda/i.test(sub);
    case 'snacks':
      return cat === 'snacks' && !/chocolate|candy|sweet|biscuit|cookie|rusk/i.test(sub);
    case 'instant':
      return cat === 'instant' || /noodle|maggi|pasta|soup|cereal|breakfast|batter|frozen/i.test(sub);
    case 'sweet_tooth':
      return /chocolate|candy|mithai|sweet|dessert|ice cream|silk|kitkat|cadbury/i.test(sub) || /chocolate|cadbury|kitkat|ferrero|mithai/i.test(name);
    case 'bakery':
      return cat === 'bakery' || /biscuit|cookie|rusk|cake|roll|gourmet bakery|wafer|oreo|parle|bourbon/i.test(sub) || /biscuit|cookie|rusk|cake|oreo|parle-g|good day/i.test(name);
    case 'tea_coffee':
      return (cat === 'beverages' || cat === 'tea_coffee') && (/tea|coffee|milk drink|hot chocolate|infusion/i.test(sub) || /tea|coffee|bru|nescafe|bournvita|horlicks/i.test(name));
    case 'atta_rice_dal':
      return (cat === 'staples' || cat === 'atta_rice_dal') && /atta|rice|dal|chana|moong|masoor|rajma|besan|sooji|maida|flour|grain/i.test(sub);
    case 'masala_oil':
      return (cat === 'staples' || cat === 'masala_oil') && /oil|ghee|masala|spice|salt|sugar|jaggery|dry fruit|seed|date|herb/i.test(sub);
    case 'sauces':
      return cat === 'sauces' || /sauce|ketchup|spread|mayo|peanut butter|jam|honey|chutney|pickle|dip/i.test(sub);
    case 'meat_fish':
      return cat === 'meat_fish' || /chicken|meat|fish|mutton|prawn|egg|sausage/i.test(sub) || /chicken|mutton|fish/i.test(name);
    case 'organic_healthy':
      return cat === 'organic_healthy' || /organic|healthy|sugar free|gluten free|cold pressed/i.test(sub);
    case 'baby_care':
      return (cat === 'personal' || cat === 'baby_care') && (/baby|diaper|wipe|cerelac|pampers/i.test(sub) || /pampers|mamy poko|johnson'?s baby|cerelac/i.test(name));
    case 'pharma_wellness':
      return /pharma|wellness|first aid|dettol|pain|cough|bandage|vitamin|antacid/i.test(sub) || /dettol|eno|moov|volini|vicks/i.test(name);
    case 'cleaning':
      return (cat === 'household' || cat === 'cleaning') && (/detergent|dishwash|cleaner|surf|vim|harpic|lizol|colin/i.test(sub) || /surf excel|vim|harpic|lizol|colin/i.test(name));
    case 'home_office':
      return (cat === 'household' || cat === 'home_office') && (/home|office|kitchen|stationery|battery|bulb|tissue|foil/i.test(sub) || /duracell|tissue|agarbatti/i.test(name));
    case 'personal_care':
      return (cat === 'personal' || cat === 'personal_care') && !/baby|diaper/i.test(sub) && (/soap|shampoo|paste|brush|cream|lotion|shave/i.test(sub) || /colgate|dove|nivea|gillette/i.test(name));
    case 'pet_care':
      return cat === 'pet_care' || /pet|dog|cat|pedigree|whiskas|drools/i.test(sub) || /pedigree|whiskas|drools/i.test(name);
    case 'beverages':
      return cat === 'beverages' || /drink|juice|tea|coffee|soda/i.test(sub);
    case 'staples':
      return cat === 'staples' || /atta|rice|dal|oil|ghee|spice/i.test(sub);
    case 'household':
      return cat === 'household' || /clean|detergent|home/i.test(sub);
    case 'personal':
      return cat === 'personal' || /personal|care|soap|shampoo/i.test(sub);
    default:
      return cat === targetCategory;
  }
}

function matchesSubCategory(p: Product, targetSub: string): boolean {
  if (!targetSub || targetSub === 'all' || targetSub.toLowerCase() === 'all') return true;
  const pSub = (p.subCategory || '').toLowerCase();
  const tSub = targetSub.toLowerCase();
  if (pSub === tSub || pSub.includes(tSub) || tSub.includes(pSub)) return true;

  const words = tSub.split(/[\s,&]+/).filter((w) => w.length > 2);
  return words.some((w) => pSub.includes(w) || (p.name || '').toLowerCase().includes(w));
}

// Query the Master Catalog across all SKUs
export function queryMasterCatalog(options: {
  category: string;
  subCategory?: string;
  searchQuery?: string;
  page: number;
  pageSize: number;
  sortBy?: 'savings' | 'price-asc' | 'price-desc';
  onlyEssentials?: boolean;
  cityMultiplier?: number;
}): PaginatedResult {
  const {
    category = 'all',
    subCategory = 'all',
    searchQuery = '',
    page = 1,
    pageSize = 24,
    sortBy = 'savings',
    onlyEssentials = false,
    cityMultiplier = 1.0,
  } = options;

  const q = searchQuery.toLowerCase().trim();
  const maxCategorySkus = CATEGORY_TOTALS[category] || 24580;

  // Active search query: rank by relevance
  if (q.length > 0) {
    const matchedProducts: Product[] = [];
    const seenIds = new Set<string>();

    const getRelevanceScore = (p: Product): number => {
      const name = p.name.toLowerCase();
      const brand = (p.brand || '').toLowerCase();
      const hindi = (p.nameHindi || '').toLowerCase();
      const sub = (p.subCategory || '').toLowerCase();

      if (name.startsWith(q) || brand.startsWith(q)) return 100;
      const wordRegex = new RegExp(`\\b${q.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')}`, 'i');
      if (wordRegex.test(name) || wordRegex.test(brand)) return 80;
      if (name.includes(q)) return 60;
      if (brand.includes(q)) return 45;
      if (hindi.includes(q)) return 30;
      if (sub.includes(q)) return 20;
      return 10;
    };

    // 1. Scan static catalog items
    for (const p of COMPREHENSIVE_GROCERY_DATA) {
      if (onlyEssentials && !p.isDailyEssential) continue;
      if (category !== 'all' && !matchesCategory(p, category)) continue;
      if (subCategory && subCategory !== 'all' && !matchesSubCategory(p, subCategory)) continue;

      const name = p.name.toLowerCase();
      const brand = (p.brand || '').toLowerCase();
      const hindi = (p.nameHindi || '').toLowerCase();
      const sub = (p.subCategory || '').toLowerCase();

      if (name.includes(q) || brand.includes(q) || hindi.includes(q) || sub.includes(q)) {
        if (!seenIds.has(p.id)) {
          seenIds.add(p.id);
          matchedProducts.push(p);
        }
      }
    }

    matchedProducts.sort((a, b) => {
      const scoreA = getRelevanceScore(a);
      const scoreB = getRelevanceScore(b);
      if (scoreA !== scoreB) return scoreB - scoreA;

      const getSavings = (prod: Product) => {
        const prices = Object.values(prod.offers).filter((o) => o.inStock).map((o) => o.price);
        return prices.length >= 2 ? Math.max(...prices) - Math.min(...prices) : 0;
      };
      const getMinPrice = (prod: Product) => {
        const prices = Object.values(prod.offers).filter((o) => o.inStock).map((o) => o.price);
        return prices.length > 0 ? Math.min(...prices) : 9999;
      };

      if (sortBy === 'savings') return getSavings(b) - getSavings(a);
      if (sortBy === 'price-asc') return getMinPrice(a) - getMinPrice(b);
      if (sortBy === 'price-desc') return getMinPrice(b) - getMinPrice(a);
      return 0;
    });

    const totalCount = matchedProducts.length;
    const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
    const safePage = Math.min(Math.max(1, page), totalPages);
    const startIdx = (safePage - 1) * pageSize;
    const items = matchedProducts.slice(startIdx, startIdx + pageSize);

    return { items, totalCount, page: safePage, pageSize, totalPages };
  }

  // Browse mode: filter authentic products directly
  const staticMatches = COMPREHENSIVE_GROCERY_DATA.filter((p) => {
    if (!matchesCategory(p, category)) return false;
    if (subCategory && subCategory !== 'all' && !matchesSubCategory(p, subCategory)) return false;
    if (onlyEssentials && !p.isDailyEssential) return false;
    return true;
  });

  const totalCount = staticMatches.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const startIndex = (safePage - 1) * pageSize;

  const items: Product[] = staticMatches.slice(startIndex, startIndex + pageSize);

  // Sort items
  const getSavings = (prod: Product) => {
    const prices = Object.values(prod.offers).filter((o) => o.inStock).map((o) => o.price);
    return prices.length >= 2 ? Math.max(...prices) - Math.min(...prices) : 0;
  };
  const getMinPrice = (prod: Product) => {
    const prices = Object.values(prod.offers).filter((o) => o.inStock).map((o) => o.price);
    return prices.length > 0 ? Math.min(...prices) : 9999;
  };

  items.sort((a, b) => {
    if (sortBy === 'savings') return getSavings(b) - getSavings(a);
    if (sortBy === 'price-asc') return getMinPrice(a) - getMinPrice(b);
    if (sortBy === 'price-desc') return getMinPrice(b) - getMinPrice(a);
    return 0;
  });

  return {
    items,
    totalCount,
    page: safePage,
    pageSize,
    totalPages,
  };
}

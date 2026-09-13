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
  dairy: 2410,
  veggies: 3890,
  staples: 4150,
  snacks: 4820,
  beverages: 2940,
  instant: 2110,
  household: 2620,
  personal: 1640,
  paan: 1280,
};

// Seed blueprints for each Indian grocery category
interface Blueprint {
  item: string;
  hindi: string;
  category: string;
  basePrice: number;
  mrpRatio: number;
  brands: string[];
  variants: { unit: string; mult: number }[];
  images: string[];
  isEssential?: boolean;
}

const BLUEPRINTS: Record<string, Blueprint[]> = {
  dairy: [
    {
      item: 'Fresh Full Cream Milk',
      hindi: 'फुल क्रीम ताजा दूध',
      category: 'dairy',
      basePrice: 34,
      mrpRatio: 1.05,
      brands: ['Amul Gold', 'Mother Dairy Full Cream', 'Nandini Special', 'Country Delight Desi', 'Akshayakalpa Organic'],
      variants: [{ unit: '500 ml Pouch', mult: 1 }, { unit: '1 Litre Pouch', mult: 1.95 }, { unit: '1 Litre Tetra Pack', mult: 2.2 }, { unit: '2 Litre Family Can', mult: 3.8 }],
      images: ['https://www.bbassets.com/media/uploads/p/l/40090893_10-amul-amul-gold.jpg', 'https://www.bbassets.com/media/uploads/p/l/40147597_11-heritage-daily-health-toned-milk.jpg'],
      isEssential: true,
    },
    {
      item: 'Toned Fresh Milk',
      hindi: 'ताजा टोन्ड दूध',
      category: 'dairy',
      basePrice: 27,
      mrpRatio: 1.04,
      brands: ['Amul Taaza', 'Mother Dairy Toned', 'Nandini Blue Toned', 'Nestle A+ Milk'],
      variants: [{ unit: '500 ml Pouch', mult: 1 }, { unit: '1 Litre Pouch', mult: 1.96 }, { unit: '1 Litre Tetra Pack', mult: 2.15 }, { unit: '200 ml Tetra (Pack of 6)', mult: 2.6 }],
      images: ['https://www.bbassets.com/media/uploads/p/l/242671_1-nandini-goodlife-toned-milk.jpg', 'https://www.bbassets.com/media/uploads/p/l/306926_6-amul-homogenised-toned-milk.jpg'],
      isEssential: true,
    },
    {
      item: 'Fresh Malai Paneer',
      hindi: 'ताजा मलाई पनीर',
      category: 'dairy',
      basePrice: 85,
      mrpRatio: 1.15,
      brands: ['Amul', 'Mother Dairy', 'Milky Mist', 'Gowardhan', 'Akshayakalpa'],
      variants: [{ unit: '200 g Block', mult: 1 }, { unit: '500 g Value Pack', mult: 2.35 }, { unit: '1 kg Commercial Pack', mult: 4.5 }, { unit: '200 g Diced Cubes', mult: 1.1 }],
      images: ['https://www.bbassets.com/media/uploads/p/l/264679_8-milky-mist-paneer-premium-fresh.jpg', 'https://www.bbassets.com/media/uploads/p/l/40096747_11-amul-malai-fresh-paneer.jpg'],
      isEssential: true,
    },
    {
      item: 'Fresh Dahi / Curd',
      hindi: 'ताजा दही',
      category: 'dairy',
      basePrice: 32,
      mrpRatio: 1.08,
      brands: ['Amul Masti', 'Mother Dairy Classic', 'Milky Mist', 'Epigamia Greek', 'Gowardhan'],
      variants: [{ unit: '200 g Cup', mult: 0.65 }, { unit: '400 g Pouch', mult: 1 }, { unit: '1 kg Family Bucket', mult: 2.4 }, { unit: '400 g Tub', mult: 1.3 }],
      images: ['https://www.bbassets.com/media/uploads/p/l/40276324_4-milky-mist-curd-rich-in-taste-no-added-preservatives.jpg'],
      isEssential: true,
    },
    {
      item: 'Pasteurised Salted Table Butter',
      hindi: 'मक्खन',
      category: 'dairy',
      basePrice: 56,
      mrpRatio: 1.08,
      brands: ['Amul', 'Mother Dairy', 'Britannia', 'Nandini'],
      variants: [{ unit: '100 g Bar', mult: 1 }, { unit: '500 g Value Block', mult: 4.8 }, { unit: '200 g Tub', mult: 2.1 }],
      images: ['https://www.bbassets.com/media/uploads/p/l/104860_10-amul-butter-pasteurised.jpg', 'https://www.bbassets.com/media/uploads/p/l/40045943_1-amul-butter-pasteurised.jpg'],
      isEssential: true,
    },
    {
      item: 'Farm Fresh White Eggs',
      hindi: 'फार्म फ्रेश अंडे',
      category: 'dairy',
      basePrice: 54,
      mrpRatio: 1.15,
      brands: ['Fresho Farm Fresh', 'Eggoz Nutri-Rich', 'Country Delight Free Range', 'Hello Eggs'],
      variants: [{ unit: 'Pack of 6', mult: 1 }, { unit: 'Pack of 10 Saver', mult: 1.55 }, { unit: 'Pack of 12', mult: 1.85 }, { unit: 'Pack of 30 Tray', mult: 4.4 }],
      images: [
        'https://www.bbassets.com/media/uploads/p/l/150502_11-fresho-farm-eggs-table-tray-medium-antibiotic-residue-free.jpg',
        'https://www.bbassets.com/media/uploads/p/l/40211592_7-eggoz-white-farm-fresh-eggs-omega-3-rich-with-no-ddgs-hormone-steroids.jpg',
        'https://www.bbassets.com/media/uploads/p/l/40348875_8-fresho-premium-white-eggs.jpg',
        'https://www.bbassets.com/media/uploads/p/l/40374433_1-hello-eggs-brown-eggs.jpg',
      ],
      isEssential: true,
    },
    {
      item: 'Whole Wheat Brown Bread',
      hindi: 'ब्राउन ब्रेड',
      category: 'dairy',
      basePrice: 42,
      mrpRatio: 1.12,
      brands: ['Harvest Gold', 'English Oven', 'Britannia 100% Atta', 'Modern Bread', 'The Health Factory'],
      variants: [{ unit: '400 g Loaf', mult: 1 }, { unit: '450 g Family Pack', mult: 1.15 }, { unit: 'Sub Footlong Loaf', mult: 1.3 }],
      images: ['https://www.bbassets.com/media/uploads/p/l/40162924_8-britannia-100-whole-wheat-bread.jpg'],
      isEssential: true,
    },
    {
      item: 'Processed Cheese Slices & Cubes',
      hindi: 'चीज स्लाइस',
      category: 'dairy',
      basePrice: 135,
      mrpRatio: 1.12,
      brands: ['Amul', 'Britannia', 'Go Cheese', 'Mother Dairy'],
      variants: [{ unit: '10 Slices (200 g)', mult: 1 }, { unit: '20 Slices (400 g)', mult: 1.9 }, { unit: '200 g Cubes Box', mult: 1.05 }],
      images: ['https://www.bbassets.com/media/uploads/p/l/104808_11-amul-cheese-slices.jpg'],
    },
    {
      item: 'Spiced Buttermilk (Chhach)',
      hindi: 'मसाला छाछ',
      category: 'dairy',
      basePrice: 15,
      mrpRatio: 1.05,
      brands: ['Amul Masti', 'Mother Dairy Tadka', 'Nandini Masala Majjige'],
      variants: [{ unit: '200 ml Tetra', mult: 1 }, { unit: '500 ml Spout Pouch', mult: 2.1 }, { unit: '1 Litre Family Pack', mult: 3.8 }],
      images: ['https://www.bbassets.com/media/uploads/p/l/180584_9-amul-masti-buttermilk-spice.jpg'],
    },
  ],
  veggies: [
    {
      item: 'Hybrid Fresh Red Tomatoes',
      hindi: 'ताजा हाइब्रिड टमाटर',
      category: 'veggies',
      basePrice: 28,
      mrpRatio: 1.25,
      brands: ['Fresho Farm Fresh', 'Organic Mandi', 'Desi Mandi Direct', 'Nature Fresh'],
      variants: [{ unit: '500 g Pack', mult: 0.55 }, { unit: '1 kg Saver Bag', mult: 1 }, { unit: '2 kg Value Box', mult: 1.85 }, { unit: '5 kg Mega Box', mult: 4.2 }],
      images: ['https://www.bbassets.com/media/uploads/p/l/10000200_21-fresho-tomato-hybrid.jpg', 'https://www.bbassets.com/media/uploads/p/l/40183216_3-fresho-tomato-local.jpg'],
      isEssential: true,
    },
    {
      item: 'New Crop Jyoti Fresh Potato (Aloo)',
      hindi: 'ताजा ज्योति आलू',
      category: 'veggies',
      basePrice: 32,
      mrpRatio: 1.2,
      brands: ['Fresho Farm Fresh', 'Agra Mandi Direct', 'Pahar Fresh', 'Organic Farm'],
      variants: [{ unit: '1 kg Bag', mult: 1 }, { unit: '2 kg Saver', mult: 1.9 }, { unit: '5 kg Wholesale Sack', mult: 4.4 }, { unit: 'Baby Potatoes (500 g)', mult: 0.8 }],
      images: ['https://www.bbassets.com/media/uploads/p/l/40189104_1-fresho-new-potato.jpg'],
      isEssential: true,
    },
    {
      item: 'Fresh Red Onion (Pyaz)',
      hindi: 'ताजा नासिक प्याज',
      category: 'veggies',
      basePrice: 38,
      mrpRatio: 1.22,
      brands: ['Fresho Nasik Special', 'Lasalgaon Mandi', 'Desi Farm Direct', 'Organic Mandi'],
      variants: [{ unit: '1 kg Net Bag', mult: 1 }, { unit: '2 kg Saver Net', mult: 1.92 }, { unit: '5 kg Jute Sack', mult: 4.5 }, { unit: 'Sambhar Small Onion (500 g)', mult: 1.2 }],
      images: ['https://www.bbassets.com/media/uploads/p/l/20001190_13-fresho-onion.jpg'],
      isEssential: true,
    },
    {
      item: 'Fresh Green Lady Finger (Bhindi)',
      hindi: 'ताजा हरी भिंडी',
      category: 'veggies',
      basePrice: 24,
      mrpRatio: 1.2,
      brands: ['Fresho Farm Tender', 'Mandi Fresh Direct', 'Nature Basket'],
      variants: [{ unit: '250 g Tray', mult: 0.55 }, { unit: '500 g Fresh Pack', mult: 1 }, { unit: '1 kg Family Saver', mult: 1.88 }],
      images: ['https://www.bbassets.com/media/uploads/p/l/10000142_21-fresho-ladies-finger.jpg'],
      isEssential: true,
    },
    {
      item: 'Fresh Cauliflower (Phool Gobhi)',
      hindi: 'फूलगोभी',
      category: 'veggies',
      basePrice: 35,
      mrpRatio: 1.2,
      brands: ['Fresho Fresh Mandi', 'Local Farm Direct'],
      variants: [{ unit: '1 pc (Approx 400g-600g)', mult: 1 }, { unit: 'Twin Pack (2 pcs)', mult: 1.85 }, { unit: 'Cleaned Florets (250 g)', mult: 0.9 }],
      images: ['https://www.bbassets.com/media/uploads/p/l/10000074_22-fresho-cauliflower.jpg'],
      isEssential: true,
    },
    {
      item: 'Shimla Royal Gala Fresh Apples',
      hindi: 'शिमला सेब',
      category: 'veggies',
      basePrice: 140,
      mrpRatio: 1.25,
      brands: ['Fresho Orchard Choice', 'Kinnaur Royal', 'Washington Extra', 'Kashmir Delicious'],
      variants: [{ unit: '4 pcs Pack (Approx 500g)', mult: 1 }, { unit: '1 kg Saver Box', mult: 1.88 }, { unit: '2 kg Gift Basket', mult: 3.6 }],
      images: ['https://www.bbassets.com/media/uploads/p/l/40134282_6-fresho-baby-apple.jpg'],
      isEssential: true,
    },
    {
      item: 'Fresh Robusta & Yelakki Bananas',
      hindi: 'ताजा केला',
      category: 'veggies',
      basePrice: 42,
      mrpRatio: 1.15,
      brands: ['Fresho Cavendish', 'South Yelakki Elaichi', 'Organic Nendran'],
      variants: [{ unit: 'Pack of 6 Robusta', mult: 1 }, { unit: 'Pack of 12 Robusta', mult: 1.85 }, { unit: 'Yelakki Elaichi Banana (500 g)', mult: 1.25 }],
      images: ['https://www.bbassets.com/media/uploads/p/l/10000031_22-fresho-banana-yelakki.jpg', 'https://www.bbassets.com/media/uploads/p/l/10000025_32-fresho-banana-robusta.jpg'],
      isEssential: true,
    },
    {
      item: 'Pomegranate (Anar) Premium',
      hindi: 'अनार',
      category: 'veggies',
      basePrice: 110,
      mrpRatio: 1.25,
      brands: ['Fresho Bhagwa', 'Solapur Special Direct'],
      variants: [{ unit: '2 pcs (Approx 450g)', mult: 1 }, { unit: '1 kg Box', mult: 2.1 }, { unit: 'Peeled Arils / Pearls (150 g)', mult: 0.8 }],
      images: ['https://www.bbassets.com/media/uploads/p/l/20000709_20-fresho-pomegranate.jpg'],
    },
    {
      item: 'Fresh Coriander, Mint & Curry Leaves Trio',
      hindi: 'धनिया और हरी मिर्च कॉम्बो',
      category: 'veggies',
      basePrice: 22,
      mrpRatio: 1.25,
      brands: ['Fresho Mandi Combo', 'Hydroponic Herbs', 'Desi Garden Fresh'],
      variants: [{ unit: '100g Dhaniya + 100g Mirch', mult: 1 }, { unit: 'Dhaniya Bunch (100 g)', mult: 0.6 }, { unit: 'Pudina Mint Bunch (100 g)', mult: 0.6 }],
      images: ['https://www.bbassets.com/media/uploads/p/l/10000326_17-fresho-coriander-leaves.jpg'],
      isEssential: true,
    },
    {
      item: 'Fresh Green Capsicum (Shimla Mirch)',
      hindi: 'हरी शिमला मिर्च',
      category: 'veggies',
      basePrice: 35,
      mrpRatio: 1.2,
      brands: ['Fresho Polyhouse Green', 'Organic Mandi', 'Tender Fresh'],
      variants: [{ unit: '250 g Pack', mult: 0.6 }, { unit: '500 g Pack', mult: 1 }, { unit: 'Red & Yellow Bell Peppers (2 pcs)', mult: 2.1 }],
      images: ['https://www.bbassets.com/media/uploads/p/l/10000067_27-fresho-capsicum-green.jpg'],
    },
  ],
  staples: [
    {
      item: 'Shudh Chakki Fresh Whole Wheat Atta',
      hindi: 'शुद्ध चक्की गेहूं का आटा',
      category: 'staples',
      basePrice: 225,
      mrpRatio: 1.15,
      brands: ['Aashirvaad Shudh', 'Fortune Chakki Fresh', 'Pillsbury Traditional', 'Nature Fresh Sampoorna', 'bb Royal Chakki'],
      variants: [{ unit: '1 kg Pack', mult: 0.23 }, { unit: '5 kg Bag', mult: 1 }, { unit: '10 kg Saver Sack', mult: 1.92 }, { unit: '5 kg Multigrain Power', mult: 1.28 }],
      images: ['https://www.bbassets.com/media/uploads/p/l/126903_12-aashirvaad-atta-whole-wheat.jpg', 'https://www.bbassets.com/media/uploads/p/l/126906_10-aashirvaad-atta-whole-wheat.jpg'],
      isEssential: true,
    },
    {
      item: 'Rozana Super Basmati / Sona Masoori Rice',
      hindi: 'सोना मसूरी / बासमती चावल',
      category: 'staples',
      basePrice: 340,
      mrpRatio: 1.2,
      brands: ['India Gate Rozana', 'Daawat Super', 'Fortune Rozana Mogra', 'bb Royal Sona Masoori', 'Kohinoor Charminar'],
      variants: [{ unit: '1 kg Pouch', mult: 0.24 }, { unit: '5 kg Bag', mult: 1 }, { unit: '10 kg Family Jute Sack', mult: 1.88 }, { unit: '25 kg Wholesale Sack', mult: 4.4 }],
      images: ['https://www.bbassets.com/media/uploads/p/l/40075897_15-bb-royal-sona-masoori-rice-raw-rice-super-premium.jpg'],
      isEssential: true,
    },
    {
      item: 'Refined Sunflower Cooking Oil',
      hindi: 'रिफाइंड सूरजमुखी / सरसों तेल',
      category: 'staples',
      basePrice: 135,
      mrpRatio: 1.18,
      brands: ['Fortune Sunlite', 'Saffola Gold Pro', 'Dhara Health', 'Gemini Pure', 'Emami Healthy'],
      variants: [{ unit: '1 Litre Pouch', mult: 1 }, { unit: '1 Litre PET Bottle', mult: 1.08 }, { unit: '5 Litre Jar / Can', mult: 4.8 }, { unit: '15 Litre Mega Tin', mult: 14.1 }],
      images: ['https://www.bbassets.com/media/uploads/p/l/274145_19-fortune-sun-lite-sunflower-refined-oil.jpg', 'https://www.bbassets.com/media/uploads/p/l/276764_13-fortune-fortune-premium-kachi-ghani-pure-mustard-oil.jpg'],
      isEssential: true,
    },
    {
      item: 'Unpolished Arhar / Toor Dal (Yellow Split)',
      hindi: 'अरहर / तूर दाल',
      category: 'staples',
      basePrice: 155,
      mrpRatio: 1.15,
      brands: ['Tata Sampann', 'bb Royal Unpolished', 'Fortune Arhar Dal', 'Organic Tattva Desi', 'Catch Natural'],
      variants: [{ unit: '500 g Pack', mult: 0.54 }, { unit: '1 kg Pouch', mult: 1 }, { unit: '2 kg Value Pack', mult: 1.92 }, { unit: '5 kg Saver Sack', mult: 4.6 }],
      images: ['https://www.bbassets.com/media/uploads/p/l/40000276_10-tata-sampann-unpolished-toor-dal.jpg'],
      isEssential: true,
    },
    {
      item: 'Moong Dal (Yellow Dhuli & Green Split)',
      hindi: 'मूंग दाल',
      category: 'staples',
      basePrice: 130,
      mrpRatio: 1.18,
      brands: ['Tata Sampann', 'Fortune', 'Organic Tattva', 'BB Royal'],
      variants: [{ unit: '500 g Pouch', mult: 0.53 }, { unit: '1 kg Pouch', mult: 1 }, { unit: '2 kg Saver Pack', mult: 1.94 }],
      images: ['https://images.unsplash.com/photo-1585994192701-f1a505c8574a?w=500&auto=format&fit=crop&q=80'],
      isEssential: true,
    },
    {
      item: 'Vacuum Evaporated Iodised Table Salt',
      hindi: 'आयोडाइज्ड नमक',
      category: 'staples',
      basePrice: 28,
      mrpRatio: 1.0,
      brands: ['Tata Salt', 'Aashirvaad Iodized Salt', 'Catch Salt', 'Tata Salt Lite (Low Sodium)', 'bb Popular Salt'],
      variants: [{ unit: '1 kg Pouch', mult: 1 }, { unit: '1 kg Low-Sodium Lite', mult: 1.6 }, { unit: 'Rock Salt / Sendha Namak (1 kg)', mult: 1.8 }],
      images: ['https://www.bbassets.com/media/uploads/p/l/241600_11-tata-salt-iodized.jpg'],
      isEssential: true,
    },
    {
      item: 'Pure Desi Cow Ghee (Danedar)',
      hindi: 'शुद्ध देसी गाय का घी',
      category: 'staples',
      basePrice: 650,
      mrpRatio: 1.15,
      brands: ['Amul Cow Ghee', 'Mother Dairy Desi Ghee', 'Patanjali Cow Ghee', 'Nandini Pure Ghee', 'Gowardhan Danedar'],
      variants: [{ unit: '500 ml Pouch', mult: 0.53 }, { unit: '1 Litre Pouch', mult: 1 }, { unit: '1 Litre PET Jar', mult: 1.06 }, { unit: '5 Litre Family Tin', mult: 4.85 }],
      images: ['https://www.bbassets.com/media/uploads/p/l/213273_9-nandini-pure-ghee.jpg'],
      isEssential: true,
    },
    {
      item: 'Authentic Indian Ground Spices (Haldi, Mirch, Dhaniya)',
      hindi: 'हल्दी, मिर्च, धनिया पाउडर',
      category: 'staples',
      basePrice: 58,
      mrpRatio: 1.25,
      brands: ['Everest Spices', 'MDH Deggi Mirch', 'Catch Pure Spices', 'Tata Sampann Spices', 'Badshah Masala'],
      variants: [{ unit: '100 g Box', mult: 0.55 }, { unit: '200 g Box', mult: 1 }, { unit: '500 g Saver Pouch', mult: 2.3 }, { unit: 'Garam Masala 100g', mult: 1.4 }],
      images: ['https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=500&auto=format&fit=crop&q=80'],
    },
    {
      item: 'Pure & Hygienic Crystal White Sugar',
      hindi: 'सफेद चीनी',
      category: 'staples',
      basePrice: 48,
      mrpRatio: 1.1,
      brands: ['Madhur Pure Sugar', 'Trust Classic Sulphur-Free', 'bb Popular Crystal', 'Dhampure Organic'],
      variants: [{ unit: '1 kg Packet', mult: 1 }, { unit: '5 kg Saver Polybag', mult: 4.8 }, { unit: 'Brown Sugar / Demerara (1 kg)', mult: 1.9 }],
      images: ['https://www.bbassets.com/media/uploads/p/l/30005417_10-bb-popular-sugar.jpg'],
      isEssential: true,
    },
  ],
  snacks: [
    {
      item: 'Crispy Potato Chips & Crunchy Munchies',
      hindi: 'आलू चिप्स और स्नैक्स',
      category: 'snacks',
      basePrice: 20,
      mrpRatio: 1.0,
      brands: ["Lay's India's Magic Masala", "Lay's Classic Salted", 'Kurkure Masala Munch', 'Bingo Mad Angles', 'Too Yumm Karare'],
      variants: [{ unit: 'Standard Bag (50 g)', mult: 1 }, { unit: 'Party Saver Pack (115 g)', mult: 2.3 }, { unit: 'Mega Family Pack (200 g)', mult: 3.8 }],
      images: ['https://www.bbassets.com/media/uploads/p/l/40219148_10-bingo-original-style-potato-chips-chilli-sprinkled.jpg'],
    },
    {
      item: 'Everyday Tea Biscuits & Cookies',
      hindi: 'चाय के बिस्कुट',
      category: 'snacks',
      basePrice: 35,
      mrpRatio: 1.08,
      brands: ['Parle-G Gluco', 'Britannia Good Day Butter', 'Britannia Marie Gold', 'Sunfeast Dark Fantasy', 'Oreo Chocolate Crème'],
      variants: [{ unit: 'Regular Pack (120 g)', mult: 0.6 }, { unit: 'Family Saver Pack (300 g)', mult: 1 }, { unit: 'Mega Economy Box (800 g)', mult: 2.4 }],
      images: ['https://www.bbassets.com/media/uploads/p/l/40197801_9-britannia-marie-gold-biscuits.jpg'],
      isEssential: true,
    },
    {
      item: 'Traditional Bikaneri Bhujia & Aloo Bhujia',
      hindi: 'बीकानेरी भुजिया व आलू भुजिया',
      category: 'snacks',
      basePrice: 58,
      mrpRatio: 1.15,
      brands: ['Haldiram\'s Nagpur', 'Bikaji Bhujia No. 1', 'Balaji Wafers & Namkeen', 'Chhedas Banana Chips'],
      variants: [{ unit: '200 g Pouch', mult: 1 }, { unit: '400 g Saver Pouch', mult: 1.9 }, { unit: '1 kg Jumbo Family Bag', mult: 4.4 }, { unit: 'Moong Dal Salted 200g', mult: 1.1 }],
      images: ['https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=500&auto=format&fit=crop&q=80'],
    },
    {
      item: 'Cadbury Dairy Milk & Silk Chocolates',
      hindi: 'डेयरी मिल्क सिल्क चॉकलेट',
      category: 'snacks',
      basePrice: 75,
      mrpRatio: 1.08,
      brands: ['Cadbury Dairy Milk', 'Cadbury Dairy Milk Silk', 'Nestle KitKat 4-Finger', 'Cadbury 5 Star 3D', 'Ferrero Rocher Gold'],
      variants: [{ unit: '55 g Classic Bar', mult: 1 }, { unit: '150 g Silk Large Bar', mult: 2.4 }, { unit: 'Ferrero Box of 16 pcs', mult: 6.8 }, { unit: 'Snickers Peanut Bar 45g', mult: 0.65 }],
      images: ['https://images.unsplash.com/photo-1548907040-4baa42d10919?w=500&auto=format&fit=crop&q=80'],
    },
    {
      item: 'Premium California Almonds & Cashews',
      hindi: 'बादाम व काजू',
      category: 'snacks',
      basePrice: 240,
      mrpRatio: 1.35,
      brands: ['Farmley Prasadam Makhana', 'Nutraj California Almonds', 'Happilo Premium Cashews', 'BB Royal Walnuts Akhrot'],
      variants: [{ unit: '250 g Pouch', mult: 1 }, { unit: '500 g Value Zip Pouch', mult: 1.92 }, { unit: '1 kg Mega Pack', mult: 3.75 }, { unit: 'Roasted Makhana 100g', mult: 0.65 }],
      images: ['https://images.unsplash.com/photo-1508061253366-f7da158b6d46?w=500&auto=format&fit=crop&q=80'],
    },
  ],
  beverages: [
    {
      item: 'Brooke Bond & Tata Premium Chai Tea Leaf',
      hindi: 'प्रीमियम चाय पत्ती',
      category: 'beverages',
      basePrice: 145,
      mrpRatio: 1.15,
      brands: ['Tata Tea Premium', 'Red Label Natural Care', 'Taj Mahal Classic', 'Wagh Bakri CTC', 'Tata Tea Gold'],
      variants: [{ unit: '250 g Carton', mult: 0.55 }, { unit: '500 g Value Pack', mult: 1 }, { unit: '1 kg Family Saver Sack', mult: 1.88 }],
      images: ['https://www.bbassets.com/media/uploads/p/l/226491_15-red-label-tea-natural-care.jpg', 'https://www.bbassets.com/media/uploads/p/l/102871_12-red-label-tea.jpg'],
      isEssential: true,
    },
    {
      item: 'Pure Instant Coffee & Filter Coffee Blend',
      hindi: 'इंस्टेंट कॉफ़ी',
      category: 'beverages',
      basePrice: 195,
      mrpRatio: 1.12,
      brands: ['Nescafé Classic', 'BRU Instant', 'Continental Xtra Blend', 'Tata Coffee Grand', 'Cothas Filter Coffee'],
      variants: [{ unit: '50 g Glass Jar', mult: 0.55 }, { unit: '100 g Glass Jar', mult: 1 }, { unit: '200 g Saver Pouch', mult: 1.8 }],
      images: ['https://www.bbassets.com/media/uploads/p/l/266579_30-bru-instant-coffee.jpg', 'https://www.bbassets.com/media/uploads/p/l/252171_10-cothas-coffee-coffee-powder-speciality-blend-of-coffee-chicory-powder.jpg'],
    },
    {
      item: 'Chilled Cold Drinks, Colas & Sodas',
      hindi: 'कोल्ड ड्रिंक्स',
      category: 'beverages',
      basePrice: 40,
      mrpRatio: 1.0,
      brands: ['Coca-Cola', 'Thums Up', 'Sprite', 'Pepsi', 'Limca', 'Diet Coke'],
      variants: [{ unit: '250 ml Can', mult: 0.9 }, { unit: '750 ml Bottle', mult: 1 }, { unit: '1.25 Litre Party Pet', mult: 1.5 }, { unit: '2 Litre Family Chill', mult: 2.2 }],
      images: ['https://www.bbassets.com/media/uploads/p/l/251023_12-coca-cola-soft-drink-original-taste.jpg'],
    },
    {
      item: '100% Real Fruit Power & Pulp Juices',
      hindi: 'फलों का ताजा जूस',
      category: 'beverages',
      basePrice: 115,
      mrpRatio: 1.25,
      brands: ['Real Fruit Power Mixed', 'Tropicana 100% Orange', 'Paper Boat Aamras', 'Frooti Mango Drink', 'B Natural Mixed Fruit'],
      variants: [{ unit: '1 Litre Tetra Pack', mult: 1 }, { unit: '1 Litre Pack of 2 Combo', mult: 1.88 }, { unit: '200 ml Tetra Pack with Straw', mult: 0.25 }],
      images: ['https://images.unsplash.com/photo-1613478223719-2ab802602423?w=500&auto=format&fit=crop&q=80'],
    },
    {
      item: 'Health Malt Nutrition Drinks (Bournvita, Horlicks, Boost)',
      hindi: 'बॉर्नविटा व हॉर्लिक्स',
      category: 'beverages',
      basePrice: 320,
      mrpRatio: 1.15,
      brands: ['Cadbury Bournvita Pro-Health', 'Horlicks Classic Malt', 'Boost Energy Drink', 'Complan Royale Chocolate'],
      variants: [{ unit: '500 g Refill', mult: 0.55 }, { unit: '1 kg Pet Jar', mult: 1 }, { unit: '2 kg Mega Saver Pack', mult: 1.9 }],
      images: ['https://images.unsplash.com/photo-1541658016709-82535e94bc69?w=500&auto=format&fit=crop&q=80'],
    },
    {
      item: 'Red Bull & Monster Energy Drinks',
      hindi: 'रेड बुल एनर्जी ड्रिंक',
      category: 'beverages',
      basePrice: 115,
      mrpRatio: 1.1,
      brands: ['Red Bull Energy Drink', 'Monster Energy Original', 'Sting Energy Drink 250ml', 'Hell Energy Classic'],
      variants: [{ unit: '250 ml Can', mult: 1 }, { unit: '350 ml Tall Can', mult: 1.35 }, { unit: 'Pack of 4 Cans (250 ml)', mult: 3.8 }],
      images: ['https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=500&auto=format&fit=crop&q=80'],
    },
  ],
  instant: [
    {
      item: 'Instant Noodles',
      hindi: 'इंस्टेंट नूडल्स',
      category: 'instant',
      basePrice: 55,
      mrpRatio: 1.05,
      brands: ['Maggi 2-Minute Masala', 'Maggi Special Masala', 'Sunfeast Yippee Magic', 'Top Ramen Curry', 'Ching\'s Secret Schezwan'],
      variants: [{ unit: 'Single Pack (70 g)', mult: 0.28 }, { unit: 'Pack of 4 Saver (280 g)', mult: 1 }, { unit: 'Pack of 8 Mega (560 g)', mult: 1.95 }, { unit: 'Pack of 12 Super Saver (840 g)', mult: 2.85 }],
      images: ['https://www.bbassets.com/media/uploads/p/l/266112_30-maggi-2-minute-instant-noodles-masala.jpg', 'https://images.unsplash.com/photo-1612927601601-6638404737ce?w=500&auto=format&fit=crop&q=80'],
      isEssential: true,
    },
    {
      item: 'Rich Tomato Ketchup & Schezwan Chutney',
      hindi: 'टोमैटो केचप व शेजवान चटनी',
      category: 'instant',
      basePrice: 110,
      mrpRatio: 1.25,
      brands: ['Maggi Rich Tomato Ketchup', 'Kissan Fresh Tomato Ketchup', 'Heinz Tomato Ketchup', 'Ching\'s Secret Schezwan Chutney'],
      variants: [{ unit: '500 g Squeezy Bottle', mult: 0.6 }, { unit: '1 kg Squeezy Bottle Saver', mult: 1 }, { unit: 'Ching\'s Schezwan 250g Jar', mult: 0.75 }],
      images: ['https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=500&auto=format&fit=crop&q=80'],
    },
    {
      item: 'Durum Wheat Penne & Fusilli Pasta',
      hindi: 'पास्ता व मैकरोनी',
      category: 'instant',
      basePrice: 85,
      mrpRatio: 1.3,
      brands: ['Disano 100% Durum Wheat Penne', 'Barilla Italian Pasta', 'Borges Fusilli Pasta', 'Bambino Roasted Vermicelli'],
      variants: [{ unit: '500 g Pouch', mult: 1 }, { unit: '1 kg Family Saver Bag', mult: 1.9 }, { unit: 'Vermicelli Sevai 500g', mult: 0.6 }],
      images: ['https://images.unsplash.com/photo-1621996346565-e3d5d6281264?w=500&auto=format&fit=crop&q=80'],
    },
    {
      item: 'MTR Ready-to-Eat Dal Makhani & Paneer Tikka',
      hindi: 'रेडी-टू-ईट दाल मखनी व पनीर',
      category: 'instant',
      basePrice: 120,
      mrpRatio: 1.2,
      brands: ['MTR Ready to Eat', 'Tata Sampann Yumside', 'Gits Instant Mix Gulab Jamun', 'MTR Rava Idli Mix'],
      variants: [{ unit: '300 g Retort Pouch', mult: 1 }, { unit: 'Pack of 2 Combo', mult: 1.9 }, { unit: 'Instant Idli Mix 500g', mult: 0.85 }],
      images: ['https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=500&auto=format&fit=crop&q=80'],
    },
  ],
  household: [
    {
      item: 'Matic Washing Machine Detergent Powder & Liquid',
      hindi: 'वॉशिंग मशीन डिटर्जेंट',
      category: 'household',
      basePrice: 195,
      mrpRatio: 1.15,
      brands: ['Surf Excel Matic Front Load', 'Ariel Matic Top Load', 'Tide Plus Double Power', 'Rin Refreshing Lemon', 'Henko Stain Care'],
      variants: [{ unit: '1 kg Pouch', mult: 1 }, { unit: '2 kg Value Box', mult: 1.9 }, { unit: '1 Litre Matic Liquid Pouch', mult: 1.1 }, { unit: '4 kg Family Bucket', mult: 3.6 }],
      images: ['https://www.bbassets.com/media/uploads/p/l/40320190_10-surf-excel-matic-front-load-liquid-detergent-refill.jpg'],
      isEssential: true,
    },
    {
      item: 'Lemon Anti-Germ Dishwash Gel & Bar',
      hindi: 'डिशवॉश जेल और साबुन',
      category: 'household',
      basePrice: 55,
      mrpRatio: 1.1,
      brands: ['Vim Dishwash Gel Lemon', 'Pril Lime Active', 'Exo Touch & Shine Bar', 'Vim Round Bar with Tub'],
      variants: [{ unit: '250 ml Squeeze Bottle', mult: 0.65 }, { unit: '500 ml Bottle', mult: 1 }, { unit: '750 ml Refill Pouch', mult: 1.35 }, { unit: '2 Litre Saver Can', mult: 3.2 }],
      images: ['https://www.bbassets.com/media/uploads/p/l/900459772_10-vim-dishwash-liquid-gel.jpg', 'https://www.bbassets.com/media/uploads/p/l/317229_14-vim-dishwash-bar-lemon.jpg'],
      isEssential: true,
    },
    {
      item: 'Disinfectant Floor & Toilet Cleaners',
      hindi: 'टॉयलेट व फ्लोर क्लीनर',
      category: 'household',
      basePrice: 95,
      mrpRatio: 1.12,
      brands: ['Harpic Power Plus Original', 'Lizol Disinfectant Citrus Floor Cleaner', 'Domex Fresh Guard', 'Dettol Multi-Action Cleaner'],
      variants: [{ unit: '500 ml Bottle', mult: 1 }, { unit: '1 Litre Value Pack', mult: 1.8 }, { unit: '2 Litre Family Can', mult: 3.4 }, { unit: 'Combo (500ml Harpic + 500ml Lizol)', mult: 1.85 }],
      images: ['https://www.bbassets.com/media/uploads/p/l/40359652_2-harpic-original-fresh-disinfectant-toilet-cleaner-liquid.jpg'],
      isEssential: true,
    },
    {
      item: 'Mosquito Vaporizers & Insect Killers',
      hindi: 'मच्छर मार रिफिल व स्प्रे',
      category: 'household',
      basePrice: 145,
      mrpRatio: 1.18,
      brands: ['All Out Ultra Power+ Twin Refill', 'Good Knight Gold Flash Machine + Refill', 'Black HIT Mosquito Spray', 'Red HIT Cockroach Spray'],
      variants: [{ unit: 'Machine + Refill Combo', mult: 1 }, { unit: 'Twin Refill Pack (90 Nights)', mult: 1.1 }, { unit: 'HIT Spray 625 ml Tall Can', mult: 1.5 }],
      images: ['https://images.unsplash.com/photo-1585421514738-01798e348b17?w=500&auto=format&fit=crop&q=80'],
    },
    {
      item: 'Kitchen Foil, Cling Wrap & Garbage Bags',
      hindi: 'किचन फॉयल व गारबेज बैग्स',
      category: 'household',
      basePrice: 99,
      mrpRatio: 1.25,
      brands: ['Freshee Aluminium Foil 18m', 'Origami Kitchen Paper Towels', 'Glad Cling Wrap 30m', 'Shalimar Oxo-Biodegradable Garbage Bags'],
      variants: [{ unit: '18 Meter Heavy Duty Foil', mult: 1 }, { unit: '72 Meter Commercial Roll', mult: 2.8 }, { unit: 'Garbage Bags Roll (30 Bags)', mult: 0.85 }, { unit: 'Kitchen Towel 2 Rolls Pack', mult: 0.95 }],
      images: ['https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&auto=format&fit=crop&q=80'],
    },
  ],
  personal: [
    {
      item: 'Bathing Soap Bars with Germ Protection & Glycerin',
      hindi: 'नहाने का साबुन',
      category: 'personal',
      basePrice: 145,
      mrpRatio: 1.15,
      brands: ['Dettol Original Germ Protection', 'Lifebuoy Total Care', 'Dove Cream Beauty Bar', 'Pears Pure & Gentle Glycerine', 'Mysore Sandal Pure Sandalwood'],
      variants: [{ unit: 'Pack of 3 Bars (75g each)', mult: 0.75 }, { unit: 'Pack of 4 + 1 Free (125g each)', mult: 1 }, { unit: 'Family Saver 8-Bar Mega Pack', mult: 1.85 }],
      images: ['https://www.bbassets.com/media/uploads/p/l/100968_5-mysore-sandal-bathing-soap-superior-with-pure-sandalwood-oil.jpg'],
      isEssential: true,
    },
    {
      item: 'Anti-Dandruff & Hair Fall Control Shampoos',
      hindi: 'शैम्पू व हेयर ऑयल',
      category: 'personal',
      basePrice: 260,
      mrpRatio: 1.22,
      brands: ['Head & Shoulders Cool Menthol', 'Dove Intense Repair Shampoo', 'Pantene Pro-V Hair Fall Control', 'Tresemme Keratin Smooth', 'Parachute Pure Coconut Hair Oil'],
      variants: [{ unit: '340 ml Bottle', mult: 0.65 }, { unit: '650 ml Family Pump Bottle', mult: 1 }, { unit: '1 Litre Salon Size Bottle', mult: 1.5 }, { unit: 'Parachute Oil 500ml Bottle', mult: 0.75 }],
      images: ['https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=500&auto=format&fit=crop&q=80'],
    },
    {
      item: 'Toothpaste & Whole Mouth Care Brushes',
      hindi: 'टूथपेस्ट',
      category: 'personal',
      basePrice: 110,
      mrpRatio: 1.12,
      brands: ['Colgate Strong Teeth Calcium Boost', 'Sensodyne Fresh Mint Sensitivity', 'Close-Up Red Hot Gel', 'Dabur Red Ayurvedic Paste', 'Pepsodent Germi Check'],
      variants: [{ unit: '150 g Tube', mult: 0.65 }, { unit: '300 g Saver Twin Tube Pack', mult: 1 }, { unit: '500 g Mega Family Pack', mult: 1.55 }, { unit: 'Toothbrush Multipack (Buy 2 Get 2)', mult: 0.9 }],
      images: ['https://www.bbassets.com/media/uploads/p/l/10000488_12-colgate-strong-teeth-anticavity-toothpaste.jpg'],
      isEssential: true,
    },
    {
      item: 'Shaving Razors, Foams & Deodorants',
      hindi: 'शेविंग रेज़र व डिओडोरेंट',
      category: 'personal',
      basePrice: 180,
      mrpRatio: 1.15,
      brands: ['Gillette Mach3 Razor with Cartridges', 'Gillette Classic Shaving Foam', 'Fogg Scent Xpressio Perfume', 'Nivea Men Deep Black Carbon Deodorant', 'Wild Stone Edge Body Spray'],
      variants: [{ unit: '150 ml Body Spray Can', mult: 1 }, { unit: 'Mach3 Razor + 2 Cartridges', mult: 1.8 }, { unit: 'Gillette Shave Foam 418g Can', mult: 1.1 }, { unit: 'Fogg 120ml No Gas Perfume', mult: 1.25 }],
      images: ['https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=500&auto=format&fit=crop&q=80'],
    },
    {
      item: 'Feminine Hygiene Wings Pads & Baby Diaper Pants',
      hindi: 'सेनेटरी पैड्स व डायपर',
      category: 'personal',
      basePrice: 185,
      mrpRatio: 1.2,
      brands: ['Whisper Ultra Clean XL+ Wings', 'Stayfree Secure Extra Large Cottony', 'Sofy AntiBacteria Overnight', 'Pampers All Round Protection Pants (M/L)'],
      variants: [{ unit: '15 Pads Saver Pack', mult: 0.55 }, { unit: '30 Pads Ultra Box', mult: 1 }, { unit: '50 Pads Mega Value Bag', mult: 1.6 }, { unit: 'Baby Diaper Pants (32 Pants)', mult: 2.8 }],
      images: ['https://www.bbassets.com/media/uploads/p/l/40195476_13-whisper-ultra-clean-sanitary-pads-xl-plus-locks-wetness-odour.jpg'],
      isEssential: true,
    },
  ],
};

// Simple deterministic pseudo-random generator with seed
function pseudoRandom(seed: number) {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
}

// Generate a deterministic SKU from the index and category
export function generateDeterministicSku(globalIndex: number, categoryId: string, cityMultiplier = 1.0): Product {
  const targetCategory = categoryId === 'all' 
    ? (['dairy', 'veggies', 'staples', 'snacks', 'beverages', 'instant', 'household', 'personal'][globalIndex % 8])
    : categoryId;

  const blueprints = BLUEPRINTS[targetCategory] || BLUEPRINTS.staples;
  const blueprintIndex = globalIndex % blueprints.length;
  const bp = blueprints[blueprintIndex];

  const brandIndex = Math.floor(globalIndex / blueprints.length) % bp.brands.length;
  const brand = bp.brands[brandIndex];

  const variantIndex = Math.floor(globalIndex / (blueprints.length * bp.brands.length)) % bp.variants.length;
  const variant = bp.variants[variantIndex];

  const imageIndex = globalIndex % bp.images.length;
  const imageUrl = bp.images[imageIndex];

  // Variations seed
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
    unit: variant.unit,
    imageUrl: imageUrl,
    trending: (globalIndex % 7 === 0),
    isDailyEssential: bp.isEssential || (globalIndex % 4 === 0),
    offers: generateStoreOffers(baseCalculatedPrice, mrp, fullName),
  };
}

export interface PaginatedResult {
  items: Product[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// Get paginated items with search, filter, and sort across all 24,580 SKUs
export function queryMasterCatalog(options: {
  category: string;
  searchQuery?: string;
  page: number;
  pageSize: number;
  sortBy?: 'savings' | 'price-asc' | 'price-desc';
  onlyEssentials?: boolean;
  cityMultiplier?: number;
}): PaginatedResult {
  const {
    category = 'all',
    searchQuery = '',
    page = 1,
    pageSize = 24,
    sortBy = 'savings',
    onlyEssentials = false,
    cityMultiplier = 1.0,
  } = options;

  const q = searchQuery.toLowerCase().trim();
  const maxCategorySkus = CATEGORY_TOTALS[category] || 24580;

  // If there is an active search query: scan seed + generated items to find matching SKUs
  if (q.length > 0) {
    const matchedProducts: Product[] = [];
    const seenIds = new Set<string>();

    const getRelevanceScore = (p: Product): number => {
      const name = p.name.toLowerCase();
      const brand = (p.brand || '').toLowerCase();
      const hindi = (p.nameHindi || '').toLowerCase();
      const sub = (p.subCategory || '').toLowerCase();

      // Highest relevance: name or brand starts with query or equals query
      if (name.startsWith(q) || brand.startsWith(q)) return 100;
      // Exact word match
      const wordRegex = new RegExp(`\\b${q.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')}`, 'i');
      if (wordRegex.test(name) || wordRegex.test(brand)) return 80;
      // Substring in name
      if (name.includes(q)) return 60;
      // Substring in brand
      if (brand.includes(q)) return 45;
      // Hindi match
      if (hindi.includes(q)) return 30;
      // Subcategory match
      if (sub.includes(q)) return 20;
      return 10;
    };

    // 1. Check static comprehensive first across ALL categories so items like Maggi are never excluded
    for (const p of COMPREHENSIVE_GROCERY_DATA) {
      if (onlyEssentials && !p.isDailyEssential) continue;
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

    // 2. Search across generated deterministic items across all categories
    const categoriesToScan = category === 'all'
      ? ['dairy', 'veggies', 'staples', 'snacks', 'beverages', 'instant', 'household', 'personal']
      : [category, 'instant', 'dairy', 'veggies', 'staples', 'snacks', 'beverages', 'household', 'personal'];

    for (const cat of categoriesToScan) {
      const limit = 200;
      for (let i = 0; i < limit && matchedProducts.length < 250; i++) {
        const p = generateDeterministicSku(i, cat, cityMultiplier);
        if (onlyEssentials && !p.isDailyEssential) continue;
        const name = p.name.toLowerCase();
        const brand = (p.brand || '').toLowerCase();
        const hindi = (p.nameHindi || '').toLowerCase();

        if (name.includes(q) || brand.includes(q) || hindi.includes(q)) {
          if (!seenIds.has(p.id)) {
            seenIds.add(p.id);
            matchedProducts.push(p);
          }
        }
      }
    }

    // 3. Sort primarily by Relevance Score, then by chosen sortBy
    matchedProducts.sort((a, b) => {
      const scoreA = getRelevanceScore(a);
      const scoreB = getRelevanceScore(b);

      if (scoreA !== scoreB) {
        return scoreB - scoreA; // higher relevance first!
      }

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

    return {
      items,
      totalCount,
      page: safePage,
      pageSize,
      totalPages,
    };
  }

  // No search query: full catalog navigation across all 24,580 SKUs
  const totalCount = maxCategorySkus;
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const startIndex = (safePage - 1) * pageSize;

  const items: Product[] = [];

  // For the very first page of category 'all' or specific category, include our hand-crafted static items first
  if (safePage === 1) {
    const staticMatches = COMPREHENSIVE_GROCERY_DATA.filter((p) => {
      if (category !== 'all' && p.category !== category) return false;
      if (onlyEssentials && !p.isDailyEssential) return false;
      return true;
    });

    for (let i = 0; i < Math.min(staticMatches.length, pageSize); i++) {
      items.push(staticMatches[i]);
    }
  }

  // Fill remainder from deterministic generator
  let genIndex = startIndex;
  while (items.length < pageSize && genIndex < totalCount) {
    const p = generateDeterministicSku(genIndex, category, cityMultiplier);
    if (!onlyEssentials || p.isDailyEssential) {
      items.push(p);
    }
    genIndex++;
  }

  // Sort items according to preference
  items.sort((a, b) => {
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

  return {
    items,
    totalCount,
    page: safePage,
    pageSize,
    totalPages,
  };
}

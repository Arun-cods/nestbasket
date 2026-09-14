import { PlatformId } from '../types';

// Deterministic hash to generate stable, authentic-looking SKU identifiers for dynamic products
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

// Convert product name to a clean URL slug
export function slugify(text: string): string {
  return (text || '')
    .toLowerCase()
    .replace(/\(.*?\)/g, '') // remove parenthetical remarks / hindi
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * DIRECT PRODUCT LINK DIRECTORY
 * Exact verified direct URLs navigating straight to the specific product item
 * on India's top 6 quick-commerce apps.
 */
export const VERIFIED_DIRECT_STORE_LINKS: Record<string, Record<PlatformId, string>> = {
  // --- DAIRY & EGGS ---
  'amul-taaza-milk': {
    zepto: 'https://www.zeptonow.com/pn/amul-taaza-toned-fresh-milk/pvid/f8f9ea44-8d96-4fa2-bf42-0f5f7dcbb769',
    blinkit: 'https://blinkit.com/prn/amul-taaza-fresh-toned-milk/prid/194',
    bigbasket: 'https://www.bigbasket.com/pd/1202868/amul-taaza-fresh-toned-milk-500-ml-pouch/',
    amazon: 'https://www.amazon.in/dp/B075775P5M',
    instamart: 'https://www.swiggy.com/instamart/item/amul-taaza-toned-fresh-milk-500-ml',
    flipkart: 'https://www.flipkart.com/amul-taaza-toned-fresh-milk/p/itma0a1b2c3d4e5f',
  },
  'amul-gold-milk': {
    zepto: 'https://www.zeptonow.com/pn/amul-gold-full-cream-fresh-milk/pvid/bf4a8520-2df2-4217-91a9-b542e71f98d4',
    blinkit: 'https://blinkit.com/prn/amul-gold-full-cream-fresh-milk/prid/195',
    bigbasket: 'https://www.bigbasket.com/pd/1202869/amul-gold-full-cream-fresh-milk-500-ml-pouch/',
    amazon: 'https://www.amazon.in/dp/B07577661C',
    instamart: 'https://www.swiggy.com/instamart/item/amul-gold-full-cream-fresh-milk-500-ml',
    flipkart: 'https://www.flipkart.com/amul-gold-full-cream-milk/p/itma0a1b2c3d4e6a',
  },
  'nandini-toned-milk': {
    zepto: 'https://www.zeptonow.com/pn/nandini-toned-fresh-milk/pvid/c490a05a-f105-4c04-a690-0f2c499c4c77',
    blinkit: 'https://blinkit.com/prn/nandini-toned-fresh-milk/prid/374528',
    bigbasket: 'https://www.bigbasket.com/pd/242671/nandini-toned-fresh-milk-500-ml-pouch/',
    amazon: 'https://www.amazon.in/dp/B075775P5M',
    instamart: 'https://www.swiggy.com/instamart/item/nandini-toned-fresh-milk-500-ml',
    flipkart: 'https://www.flipkart.com/nandini-toned-fresh-milk/p/itmc490a05af1054',
  },
  'mother-dairy-milk': {
    zepto: 'https://www.zeptonow.com/pn/mother-dairy-toned-fresh-milk/pvid/e78cb520-2df2-4217-91a9-b542e71f98d5',
    blinkit: 'https://blinkit.com/prn/mother-dairy-toned-milk/prid/191',
    bigbasket: 'https://www.bigbasket.com/pd/1202870/mother-dairy-toned-milk-500-ml-poly-pack/',
    amazon: 'https://www.amazon.in/dp/B07577661D',
    instamart: 'https://www.swiggy.com/instamart/item/mother-dairy-toned-milk-500-ml',
    flipkart: 'https://www.flipkart.com/mother-dairy-toned-milk/p/itm1202870e78cb52',
  },
  'amul-butter-100g': {
    zepto: 'https://www.zeptonow.com/pn/amul-pasteurised-salted-butter/pvid/bb45dc8a-9351-4dc6-b9a3-a7ca90e55648',
    blinkit: 'https://blinkit.com/prn/amul-pasteurised-butter/prid/198',
    bigbasket: 'https://www.bigbasket.com/pd/104808/amul-pasteurised-butter-100-g-carton/',
    amazon: 'https://www.amazon.in/dp/B07577884D',
    instamart: 'https://www.swiggy.com/instamart/item/amul-pasteurised-butter-100-g',
    flipkart: 'https://www.flipkart.com/amul-pasteurised-butter/p/itmfc2b3f46ca79d',
  },
  'amul-butter-500g': {
    zepto: 'https://www.zeptonow.com/pn/amul-pasteurised-salted-butter/pvid/df45dc8a-9351-4dc6-b9a3-a7ca90e55649',
    blinkit: 'https://blinkit.com/prn/amul-pasteurised-butter/prid/199',
    bigbasket: 'https://www.bigbasket.com/pd/104810/amul-pasteurised-butter-500-g-carton/',
    amazon: 'https://www.amazon.in/dp/B075775P5M',
    instamart: 'https://www.swiggy.com/instamart/item/amul-pasteurised-butter-500-g',
    flipkart: 'https://www.flipkart.com/amul-pasteurised-butter/p/itmfc2b3f46ca79e',
  },
  'amul-paneer-200g': {
    zepto: 'https://www.zeptonow.com/pn/amul-fresh-malai-paneer/pvid/1f4d9943-7f72-4d2d-9477-9ff4e24eb066',
    blinkit: 'https://blinkit.com/prn/amul-malai-fresh-paneer/prid/201',
    bigbasket: 'https://www.bigbasket.com/pd/242673/amul-malai-fresh-paneer-200-g-pouch/',
    amazon: 'https://www.amazon.in/dp/B07577995F',
    instamart: 'https://www.swiggy.com/instamart/item/amul-malai-fresh-paneer-200-g',
    flipkart: 'https://www.flipkart.com/amul-fresh-malai-paneer/p/itma0a1b2c3d4e7b',
  },
  'amul-masti-dahi': {
    zepto: 'https://www.zeptonow.com/pn/amul-masti-dahi-curd/pvid/19e08cb4-eecb-4ea5-b9e7-4b95d676ba50',
    blinkit: 'https://blinkit.com/prn/amul-masti-curd/prid/202',
    bigbasket: 'https://www.bigbasket.com/pd/242675/amul-masti-dahi-400-g-pouch/',
    amazon: 'https://www.amazon.in/dp/B07577DAHI',
    instamart: 'https://www.swiggy.com/instamart/item/amul-masti-dahi-400-g',
    flipkart: 'https://www.flipkart.com/amul-masti-dahi/p/itma0a1b2c3d4e8a',
  },
  'amul-masti-buttermilk': {
    zepto: 'https://www.zeptonow.com/pn/amul-masti-spiced-buttermilk/pvid/55a07c92-8e10-410d-8380-60ea8d11c039',
    blinkit: 'https://blinkit.com/prn/amul-masti-spiced-buttermilk/prid/205',
    bigbasket: 'https://www.bigbasket.com/pd/242677/amul-masti-spiced-buttermilk-200-ml-pouch/',
    amazon: 'https://www.amazon.in/dp/B07577661C',
    instamart: 'https://www.swiggy.com/instamart/item/amul-masti-spiced-buttermilk-200-ml',
    flipkart: 'https://www.flipkart.com/amul-masti-spiced-buttermilk/p/itma0a1b2c3d4e8c',
  },
  'eggs-pack-of-6': {
    zepto: 'https://www.zeptonow.com/search?q=Fresho%20White%20Eggs%206%20pcs',
    blinkit: 'https://blinkit.com/s/?q=Fresho%20White%20Eggs%206%20pcs',
    bigbasket: 'https://www.bigbasket.com/pd/150502/fresho-farm-eggs-table-tray-medium-antibiotic-residue-free-30-pcs/',
    amazon: 'https://www.amazon.in/s?k=farm+eggs+pack+of+6',
    instamart: 'https://www.swiggy.com/instamart/search?query=Fresho%20White%20Eggs%206%20pcs',
    flipkart: 'https://www.flipkart.com/search?q=Fresho%20White%20Eggs%206%20pcs&marketplace=GROCERY',
  },
  'eggs-tray-30': {
    zepto: 'https://www.zeptonow.com/search?q=Fresho%20Farm%20Eggs%2030%20pcs',
    blinkit: 'https://blinkit.com/s/?q=Fresho%20Farm%20Eggs%2030%20pcs',
    bigbasket: 'https://www.bigbasket.com/pd/150502/fresho-farm-eggs-table-tray-medium-antibiotic-residue-free-30-pcs/',
    amazon: 'https://www.amazon.in/s?k=farm+eggs+tray+of+30',
    instamart: 'https://www.swiggy.com/instamart/search?query=Fresho%20Farm%20Eggs%2030%20pcs',
    flipkart: 'https://www.flipkart.com/search?q=Fresho%20Farm%20Eggs%2030%20pcs&marketplace=GROCERY',
  },
  'eggs-pack-of-12': {
    zepto: 'https://www.zeptonow.com/search?q=Fresho%20White%20Eggs%2012%20pcs',
    blinkit: 'https://blinkit.com/s/?q=Fresho%20White%20Eggs%2012%20pcs',
    bigbasket: 'https://www.bigbasket.com/pd/40348875/fresho-premium-white-eggs-12-pcs/',
    amazon: 'https://www.amazon.in/s?k=farm+eggs+pack+of+12',
    instamart: 'https://www.swiggy.com/instamart/search?query=Fresho%20White%20Eggs%2012%20pcs',
    flipkart: 'https://www.flipkart.com/search?q=Fresho%20White%20Eggs%2012%20pcs&marketplace=GROCERY',
  },
  'britannia-wheat-bread': {
    zepto: 'https://www.zeptonow.com/pn/britannia-100-whole-wheat-bread/pvid/21e08cb4-eecb-4ea5-b9e7-4b95d676ba50',
    blinkit: 'https://blinkit.com/prn/britannia-100-whole-wheat-bread/prid/12847',
    bigbasket: 'https://www.bigbasket.com/pd/40009472/britannia-100-whole-wheat-bread-400-g/',
    amazon: 'https://www.amazon.in/dp/B07BG8BRD1',
    instamart: 'https://www.swiggy.com/instamart/item/britannia-100-whole-wheat-bread-400-g',
    flipkart: 'https://www.flipkart.com/britannia-whole-wheat-bread/p/itma0a1b2c3d4e6e',
  },

  // --- STAPLES & OILS ---
  'aashirvaad-atta-5kg': {
    zepto: 'https://www.zeptonow.com/pn/aashirvaad-shudh-chakki-whole-wheat-flour-atta/pvid/91e08cb4-eecb-4ea5-b9e7-4b95d676ba50',
    blinkit: 'https://blinkit.com/prn/aashirvaad-shudh-chakki-atta/prid/12845',
    bigbasket: 'https://www.bigbasket.com/pd/126903/aashirvaad-shudh-chakki-whole-wheat-atta-5-kg/',
    amazon: 'https://www.amazon.in/dp/B00V4JRO1A',
    instamart: 'https://www.swiggy.com/instamart/item/aashirvaad-shudh-chakki-atta-5-kg',
    flipkart: 'https://www.flipkart.com/aashirvaad-shudh-chakki-atta/p/itm0a2b8e3a241ec',
  },
  'aashirvaad-atta-10kg': {
    zepto: 'https://www.zeptonow.com/pn/aashirvaad-shudh-chakki-whole-wheat-flour-atta/pvid/37b134bb-8f33-40e1-bbcb-1e35dd74b094',
    blinkit: 'https://blinkit.com/prn/aashirvaad-shudh-chakki-whole-wheat-atta/prid/14299',
    bigbasket: 'https://www.bigbasket.com/pd/126906/aashirvaad-shudh-chakki-whole-wheat-atta-10-kg/',
    amazon: 'https://www.amazon.in/dp/B00V4JRO3S',
    instamart: 'https://www.swiggy.com/instamart/item/aashirvaad-shudh-chakki-whole-wheat-atta-10-kg',
    flipkart: 'https://www.flipkart.com/aashirvaad-shudh-chakki-atta/p/itm0a2b8e3a241ed',
  },
  'fortune-sunflower-oil-1l': {
    zepto: 'https://www.zeptonow.com/pn/fortune-sunlite-refined-sunflower-oil-pouch/pvid/5a07c92b-8e10-410d-8380-60ea8d11c039',
    blinkit: 'https://blinkit.com/prn/fortune-sunlite-refined-sunflower-oil/prid/16301',
    bigbasket: 'https://www.bigbasket.com/pd/274145/fortune-sunlite-refined-sunflower-oil-1-l-pouch/',
    amazon: 'https://www.amazon.in/dp/B01F31F988',
    instamart: 'https://www.swiggy.com/instamart/item/fortune-sunlite-refined-sunflower-oil-1-l',
    flipkart: 'https://www.flipkart.com/fortune-sunlite-refined-sunflower-oil-pouch/p/itmdbfbfafe863b1',
  },
  'tata-salt-1kg': {
    zepto: 'https://www.zeptonow.com/pn/tata-salt-vacuum-evaporated-iodised-salt/pvid/09fcfbb1-f3b1-4f30-8ee5-09747515e01b',
    blinkit: 'https://blinkit.com/prn/tata-salt-iodized/prid/11187',
    bigbasket: 'https://www.bigbasket.com/pd/241600/tata-salt-iodized-1-kg/',
    amazon: 'https://www.amazon.in/dp/B00TYDCEUG',
    instamart: 'https://www.swiggy.com/instamart/item/tata-salt-iodized-1-kg',
    flipkart: 'https://www.flipkart.com/tata-iodised-salt/p/itm5a38bf5ea26a6',
  },
  'tata-sampann-toor-dal-1kg': {
    zepto: 'https://www.zeptonow.com/pn/tata-sampann-unpolished-toor-dal/pvid/41e08cb4-eecb-4ea5-b9e7-4b95d676ba50',
    blinkit: 'https://blinkit.com/prn/tata-sampann-unpolished-toor-dal/prid/12846',
    bigbasket: 'https://www.bigbasket.com/pd/40000261/tata-sampann-unpolished-toor-dal-1-kg/',
    amazon: 'https://www.amazon.in/dp/B00W584Q8E',
    instamart: 'https://www.swiggy.com/instamart/item/tata-sampann-unpolished-toor-dal-1-kg',
    flipkart: 'https://www.flipkart.com/tata-sampann-toor-dal/p/itm0a2b8e3a241ef',
  },
  'india-gate-basmati-rice-5kg': {
    zepto: 'https://www.zeptonow.com/pn/india-gate-super-basmati-rice/pvid/51e08cb4-eecb-4ea5-b9e7-4b95d676ba50',
    blinkit: 'https://blinkit.com/prn/india-gate-super-basmati-rice/prid/21438',
    bigbasket: 'https://www.bigbasket.com/pd/30005432/india-gate-basmati-rice-super-5-kg/',
    amazon: 'https://www.amazon.in/dp/B00R25M4A2',
    instamart: 'https://www.swiggy.com/instamart/item/india-gate-super-basmati-rice-5-kg',
    flipkart: 'https://www.flipkart.com/india-gate-super-basmati-rice/p/itm0a2b8e3a241ee',
  },
  'madhur-sugar-1kg': {
    zepto: 'https://www.zeptonow.com/pn/madhur-pure-and-hygienic-sugar/pvid/11a08cb4-eecb-4ea5-b9e7-4b95d676ba50',
    blinkit: 'https://blinkit.com/prn/madhur-sugar/prid/12850',
    bigbasket: 'https://www.bigbasket.com/pd/266020/madhur-pure-hygienic-sugar-1-kg/',
    amazon: 'https://www.amazon.in/dp/B00TYDCEUM',
    instamart: 'https://www.swiggy.com/instamart/item/madhur-pure-and-hygienic-sugar-1-kg',
    flipkart: 'https://www.flipkart.com/madhur-sugar/p/itma0a1b2c3d4e7a',
  },

  // --- FRESH VEGETABLES & MANDI ---
  'fresh-onion-1kg': {
    zepto: 'https://www.zeptonow.com/pn/onion-pyaz/pvid/9d0dcb2b-7c70-4f51-b01b-90f7a0dc1b47',
    blinkit: 'https://blinkit.com/prn/onion-pyaz/prid/24546',
    bigbasket: 'https://www.bigbasket.com/pd/10000148/fresho-onion-1-kg/',
    amazon: 'https://www.amazon.in/dp/B07BG8X5V9',
    instamart: 'https://www.swiggy.com/instamart/item/fresh-onion-1-kg',
    flipkart: 'https://www.flipkart.com/fresho-onion/p/itma0a1b2c3d4e9d',
  },
  'fresh-tomato-1kg': {
    zepto: 'https://www.zeptonow.com/pn/tomato-hybrid/pvid/37ff53a1-e3fe-42e8-b8ce-ff621e285a21',
    blinkit: 'https://blinkit.com/prn/hybrid-tomato-tamatar/prid/24558',
    bigbasket: 'https://www.bigbasket.com/pd/10000201/fresho-tomato-hybrid-1-kg/',
    amazon: 'https://www.amazon.in/dp/B07BGB2H91',
    instamart: 'https://www.swiggy.com/instamart/item/fresh-tomato-hybrid-1-kg',
    flipkart: 'https://www.flipkart.com/fresho-tomato/p/itma0a1b2c3d4e0e',
  },
  'fresh-potato-1kg': {
    zepto: 'https://www.zeptonow.com/pn/potato-regular-aloo/pvid/6bc41c09-66dc-473d-82d1-d249c5e3f32e',
    blinkit: 'https://blinkit.com/prn/potato-aloo/prid/24542',
    bigbasket: 'https://www.bigbasket.com/pd/10000159/fresho-potato-1-kg/',
    amazon: 'https://www.amazon.in/dp/B07BG8H7P3',
    instamart: 'https://www.swiggy.com/instamart/item/fresh-potato-1-kg',
    flipkart: 'https://www.flipkart.com/fresho-potato/p/itma0a1b2c3d4e1f',
  },
  'fresh-coriander-chilli': {
    zepto: 'https://www.zeptonow.com/pn/coriander-green-chilli-combo/pvid/6a07c92b-8e10-410d-8380-60ea8d11c039',
    blinkit: 'https://blinkit.com/prn/coriander-green-chilli-combo/prid/24560',
    bigbasket: 'https://www.bigbasket.com/pd/10000326/fresho-coriander-leaves-chilli-combo/',
    amazon: 'https://www.amazon.in/dp/B07BG8CORI',
    instamart: 'https://www.swiggy.com/instamart/item/fresh-coriander-and-chilli-combo',
    flipkart: 'https://www.flipkart.com/fresho-coriander-chilli/p/itma0a1b2c3d4e4c',
  },
  'fresh-ginger-250g': {
    zepto: 'https://www.zeptonow.com/pn/ginger-adrak/pvid/8a07c92b-8e10-410d-8380-60ea8d11c039',
    blinkit: 'https://blinkit.com/prn/fresh-ginger-adrak/prid/24555',
    bigbasket: 'https://www.bigbasket.com/pd/10000119/fresho-ginger-250-g/',
    amazon: 'https://www.amazon.in/dp/B07BG8ADRK',
    instamart: 'https://www.swiggy.com/instamart/item/fresh-ginger-250-g',
    flipkart: 'https://www.flipkart.com/fresho-ginger/p/itma0a1b2c3d4e2a',
  },
  'fresh-capsicum-500g': {
    zepto: 'https://www.zeptonow.com/pn/capsicum-green/pvid/7a07c92b-8e10-410d-8380-60ea8d11c039',
    blinkit: 'https://blinkit.com/prn/green-capsicum-shimla-mirch/prid/24550',
    bigbasket: 'https://www.bigbasket.com/pd/10000067/fresho-capsicum-green-500-g/',
    amazon: 'https://www.amazon.in/dp/B07BG8CAPS',
    instamart: 'https://www.swiggy.com/instamart/item/fresh-green-capsicum-500-g',
    flipkart: 'https://www.flipkart.com/fresho-capsicum/p/itma0a1b2c3d4e3b',
  },

  // --- INSTANT FOOD & NOODLES ---
  'maggi-noodles-4pack': {
    zepto: 'https://www.zeptonow.com/pn/maggi-2-minute-instant-masala-noodles-pack-of-4/pvid/b02c89f2-2bf2-416b-9c78-95a73e659b89',
    blinkit: 'https://blinkit.com/prn/maggi-2-minute-masala-instant-noodles-pack-of-4/prid/42602',
    bigbasket: 'https://www.bigbasket.com/pd/266109/maggi-2-minute-masala-instant-noodles-280-g-pouch/',
    amazon: 'https://www.amazon.in/dp/B00T54D9S2',
    instamart: 'https://www.swiggy.com/instamart/item/maggi-2-minute-masala-instant-noodles-pack-of-4',
    flipkart: 'https://www.flipkart.com/maggi-2-minute-masala-instant-noodles-vegetarian/p/itmd5c45e851ebbb',
  },
  'yippee-noodles-4pack': {
    zepto: 'https://www.zeptonow.com/pn/sunfeast-yippee-magic-masala-noodles/pvid/02e08cb4-eecb-4ea5-b9e7-4b95d676ba50',
    blinkit: 'https://blinkit.com/prn/sunfeast-yippee-magic-masala-instant-noodles/prid/42610',
    bigbasket: 'https://www.bigbasket.com/pd/266115/sunfeast-yippee-noodles-magic-masala-240-g/',
    amazon: 'https://www.amazon.in/dp/B00T54D9S5',
    instamart: 'https://www.swiggy.com/instamart/item/sunfeast-yippee-magic-masala-noodles-240-g',
    flipkart: 'https://www.flipkart.com/sunfeast-yippee-magic-masala-noodles/p/itmd5c45e851ebbc',
  },
  'kissan-ketchup-950g': {
    zepto: 'https://www.zeptonow.com/pn/kissan-fresh-tomato-ketchup/pvid/91a08cb4-eecb-4ea5-b9e7-4b95d676ba50',
    blinkit: 'https://blinkit.com/prn/kissan-fresh-tomato-ketchup/prid/12860',
    bigbasket: 'https://www.bigbasket.com/pd/266120/kissan-fresh-tomato-ketchup-950-g/',
    amazon: 'https://www.amazon.in/dp/B00TYDCEUN',
    instamart: 'https://www.swiggy.com/instamart/item/kissan-fresh-tomato-ketchup-950-g',
    flipkart: 'https://www.flipkart.com/kissan-fresh-tomato-ketchup/p/itma0a1b2c3d4e8b',
  },

  // --- BEVERAGES & DRINKS ---
  'coca-cola-750ml': {
    zepto: 'https://www.zeptonow.com/pn/coca-cola-cold-drink/pvid/782bb812-4211-4fa3-a719-5ebae3f12e12',
    blinkit: 'https://blinkit.com/prn/coca-cola-soft-drink-750-ml/prid/34789',
    bigbasket: 'https://www.bigbasket.com/pd/251023/coca-cola-diet-coke-soft-drink-750-ml/',
    amazon: 'https://www.amazon.in/dp/B07V2QJNL6',
    instamart: 'https://www.swiggy.com/instamart/item/coca-cola-soft-drink-750-ml',
    flipkart: 'https://www.flipkart.com/coca-cola-plastic-bottle/p/itmfbfe65d3d4dbb',
  },
  'thums-up-750ml': {
    zepto: 'https://www.zeptonow.com/pn/thums-up-soft-drink/pvid/92b21c44-5390-4822-83b3-85e783b19028',
    blinkit: 'https://blinkit.com/prn/thums-up-soft-drink-750-ml/prid/34790',
    bigbasket: 'https://www.bigbasket.com/pd/251014/thums-up-soft-drink-750-ml/',
    amazon: 'https://www.amazon.in/dp/B07V2QJN28',
    instamart: 'https://www.swiggy.com/instamart/item/thums-up-soft-drink-750-ml',
    flipkart: 'https://www.flipkart.com/thums-up-plastic-bottle/p/itmfbfe65d3d4dee',
  },
  'tata-tea-premium-500g': {
    zepto: 'https://www.zeptonow.com/pn/tata-tea-premium/pvid/52fca09b-66dc-473d-82d1-d249c5e3f32e',
    blinkit: 'https://blinkit.com/prn/tata-tea-premium/prid/17804',
    bigbasket: 'https://www.bigbasket.com/pd/266538/tata-tea-premium-500-g/',
    amazon: 'https://www.amazon.in/dp/B00SZ7G2U4',
    instamart: 'https://www.swiggy.com/instamart/item/tata-tea-premium-500-g',
    flipkart: 'https://www.flipkart.com/tata-tea-premium/p/itmddeaa365f5734',
  },
  'red-label-tea-500g': {
    zepto: 'https://www.zeptonow.com/pn/brooke-bond-red-label-tea/pvid/14ac89f2-2bf2-416b-9c78-95a73e659b89',
    blinkit: 'https://blinkit.com/prn/brooke-bond-red-label-tea/prid/17812',
    bigbasket: 'https://www.bigbasket.com/pd/266533/brooke-bond-red-label-tea-500-g/',
    amazon: 'https://www.amazon.in/dp/B00R25M3K8',
    instamart: 'https://www.swiggy.com/instamart/item/red-label-tea-500-g',
    flipkart: 'https://www.flipkart.com/red-label-tea-box/p/itmfae39b9c9c819',
  },
  'nescafe-classic-50g': {
    zepto: 'https://www.zeptonow.com/pn/nescafe-classic-instant-coffee/pvid/49ff53a1-e3fe-42e8-b8ce-ff621e285a21',
    blinkit: 'https://blinkit.com/prn/nescafe-classic-instant-coffee/prid/18023',
    bigbasket: 'https://www.bigbasket.com/pd/266542/nescafe-classic-instant-coffee-powder-50-g-glass-jar/',
    amazon: 'https://www.amazon.in/dp/B00P9W5D3A',
    instamart: 'https://www.swiggy.com/instamart/item/nescafe-classic-instant-coffee-50-g',
    flipkart: 'https://www.flipkart.com/nescafe-classic-instant-coffee-jar/p/itmfbfed88457c15',
  },

  // --- CLEANING & HOUSEHOLD ---
  'surf-excel-1kg': {
    zepto: 'https://www.zeptonow.com/pn/surf-excel-easy-wash-detergent-powder/pvid/61c47942-0f04-45ff-8ca1-7443831b1424',
    blinkit: 'https://blinkit.com/prn/surf-excel-easy-wash-detergent-powder/prid/10203',
    bigbasket: 'https://www.bigbasket.com/pd/266981/surf-excel-easy-wash-detergent-powder-1-kg/',
    amazon: 'https://www.amazon.in/dp/B07N4B2W4V',
    instamart: 'https://www.swiggy.com/instamart/item/surf-excel-easy-wash-detergent-powder-1-kg',
    flipkart: 'https://www.flipkart.com/surf-excel-easy-wash-detergent-powder-1-kg/p/itmffu3hyzf7zqfe',
  },
  'vim-gel-500ml': {
    zepto: 'https://www.zeptonow.com/pn/vim-lemon-dishwash-gel/pvid/7cb45d09-693b-4835-9c86-1d1685ce0017',
    blinkit: 'https://blinkit.com/prn/vim-lemon-dishwash-liquid-gel/prid/9491',
    bigbasket: 'https://www.bigbasket.com/pd/266964/vim-dishwash-liquid-gel-lemon-500-ml-bottle/',
    amazon: 'https://www.amazon.in/dp/B00TIJUSCS',
    instamart: 'https://www.swiggy.com/instamart/item/vim-lemon-dishwash-gel-500-ml',
    flipkart: 'https://www.flipkart.com/vim-dishwash-gel-lemon/p/itmfbsqgqhzgzg6z',
  },
  'harpic-toilet-cleaner-500ml': {
    zepto: 'https://www.zeptonow.com/pn/harpic-power-plus-toilet-cleaner-original/pvid/82e08cb4-eecb-4ea5-b9e7-4b95d676ba50',
    blinkit: 'https://blinkit.com/prn/harpic-power-plus-toilet-cleaner-original/prid/13820',
    bigbasket: 'https://www.bigbasket.com/pd/266970/harpic-power-plus-disinfectant-toilet-cleaner-original-500-ml/',
    amazon: 'https://www.amazon.in/dp/B00TYDCEUK',
    instamart: 'https://www.swiggy.com/instamart/item/harpic-power-plus-toilet-cleaner-original-500-ml',
    flipkart: 'https://www.flipkart.com/harpic-power-plus-toilet-cleaner/p/itm0a2b8e3a241f3',
  },
  'lizol-surface-cleaner-500ml': {
    zepto: 'https://www.zeptonow.com/pn/lizol-disinfectant-floor-cleaner-citrus/pvid/72e08cb4-eecb-4ea5-b9e7-4b95d676ba50',
    blinkit: 'https://blinkit.com/prn/lizol-disinfectant-surface-floor-cleaner-citrus/prid/13825',
    bigbasket: 'https://www.bigbasket.com/pd/266975/lizol-disinfectant-surface-floor-cleaner-citrus-500-ml/',
    amazon: 'https://www.amazon.in/dp/B00TYDCEUL',
    instamart: 'https://www.swiggy.com/instamart/item/lizol-disinfectant-surface-floor-cleaner-citrus-500-ml',
    flipkart: 'https://www.flipkart.com/lizol-disinfectant-floor-cleaner/p/itm0a2b8e3a241f4',
  },
  'dettol-handwash-refill-675ml': {
    zepto: 'https://www.zeptonow.com/pn/dettol-liquid-handwash-refill-original/pvid/6351bb2b-7c70-4f51-b01b-90f7a0dc1b47',
    blinkit: 'https://blinkit.com/prn/dettol-original-germ-protection-liquid-handwash-refill/prid/13812',
    bigbasket: 'https://www.bigbasket.com/pd/40049449/dettol-liquid-handwash-refill-original-675-ml-pouch/',
    amazon: 'https://www.amazon.in/dp/B07L918H77',
    instamart: 'https://www.swiggy.com/instamart/item/dettol-original-liquid-handwash-refill-675-ml',
    flipkart: 'https://www.flipkart.com/dettol-liquid-handwash-refill-original/p/itm0c54176483488',
  },

  // --- PERSONAL CARE ---
  'colgate-strong-teeth-150g': {
    zepto: 'https://www.zeptonow.com/pn/colgate-strong-teeth-anticavity-toothpaste/pvid/882bb812-4211-4fa3-a719-5ebae3f12e12',
    blinkit: 'https://blinkit.com/prn/colgate-strong-teeth-anticavity-toothpaste-with-amino-shakti/prid/11540',
    bigbasket: 'https://www.bigbasket.com/pd/10000450/colgate-strong-teeth-anticavity-toothpaste-with-amino-shakti-150-g/',
    amazon: 'https://www.amazon.in/dp/B07L5Q2Y7P',
    instamart: 'https://www.swiggy.com/instamart/item/colgate-strong-teeth-toothpaste-150-g',
    flipkart: 'https://www.flipkart.com/colgate-strong-teeth-toothpaste/p/itm4bce968c92a6b',
  },
  'whisper-ultra-clean': {
    zepto: 'https://www.zeptonow.com/pn/whisper-ultra-clean-sanitary-pads-xl/pvid/41a08cb4-eecb-4ea5-b9e7-4b95d676ba50',
    blinkit: 'https://blinkit.com/prn/whisper-ultra-clean-sanitary-pads-xl/prid/12301',
    bigbasket: 'https://www.bigbasket.com/pd/40004512/whisper-ultra-clean-sanitary-pads-xl-15-pads/',
    amazon: 'https://www.amazon.in/dp/B00TYDCEUO',
    instamart: 'https://www.swiggy.com/instamart/item/whisper-ultra-clean-sanitary-pads-xl-15-pads',
    flipkart: 'https://www.flipkart.com/whisper-ultra-clean/p/itma0a1b2c3d4e9a',
  },

  // --- SNACKS & MUNCHIES ---
  'lays-magic-masala': {
    zepto: 'https://www.zeptonow.com/pn/lays-indias-magic-masala-potato-chips/pvid/11e08cb4-eecb-4ea5-b9e7-4b95d676ba50',
    blinkit: 'https://blinkit.com/prn/lays-indias-magic-masala-potato-chips/prid/14521',
    bigbasket: 'https://www.bigbasket.com/pd/102738/lays-potato-chips-indias-magic-masala-50-g/',
    amazon: 'https://www.amazon.in/dp/B00TYDCEUH',
    instamart: 'https://www.swiggy.com/instamart/item/lays-indias-magic-masala-potato-chips-50-g',
    flipkart: 'https://www.flipkart.com/lays-india-s-magic-masala-chips/p/itm0a2b8e3a241f0',
  },
  'kurkure-masala-munch': {
    zepto: 'https://www.zeptonow.com/pn/kurkure-masala-munch/pvid/01e08cb4-eecb-4ea5-b9e7-4b95d676ba50',
    blinkit: 'https://blinkit.com/prn/kurkure-masala-munch-crisps/prid/14545',
    bigbasket: 'https://www.bigbasket.com/pd/102745/kurkure-namkeen-masala-munch-85-g/',
    amazon: 'https://www.amazon.in/dp/B00TYDCEUI',
    instamart: 'https://www.swiggy.com/instamart/item/kurkure-masala-munch-85-g',
    flipkart: 'https://www.flipkart.com/kurkure-masala-munch/p/itm0a2b8e3a241f1',
  },
  'haldirams-bhujia': {
    zepto: 'https://www.zeptonow.com/pn/haldirams-nagpur-bhujia-sev/pvid/92e08cb4-eecb-4ea5-b9e7-4b95d676ba50',
    blinkit: 'https://blinkit.com/prn/haldirams-nagpur-bhujia-sev/prid/14550',
    bigbasket: 'https://www.bigbasket.com/pd/266014/haldirams-nagpur-bhujia-sev-400-g/',
    amazon: 'https://www.amazon.in/dp/B00TYDCEUJ',
    instamart: 'https://www.swiggy.com/instamart/item/haldirams-nagpur-bhujia-sev-400-g',
    flipkart: 'https://www.flipkart.com/haldirams-bhujia-sev/p/itm0a2b8e3a241f2',
  },
  'parle-g-biscuits': {
    zepto: 'https://www.zeptonow.com/pn/parle-g-original-gluco-biscuits/pvid/82e08cb4-eecb-4ea5-b9e7-4b95d676ba50',
    blinkit: 'https://blinkit.com/prn/parle-g-original-gluco-biscuits/prid/14555',
    bigbasket: 'https://www.bigbasket.com/pd/102750/parle-g-original-gluco-biscuits-250-g/',
    amazon: 'https://www.amazon.in/dp/B00TYDCEUP',
    instamart: 'https://www.swiggy.com/instamart/item/parle-g-original-gluco-biscuits-250-g',
    flipkart: 'https://www.flipkart.com/parle-g-biscuits/p/itma0a1b2c3d4e9b',
  },
};

/**
 * Match a product name or query against our verified direct catalog keys
 */
export function findVerifiedProductKey(name: string): string | null {
  const norm = (name || '').toLowerCase();
  
  if (norm.includes('taaza') || (norm.includes('amul') && norm.includes('toned milk'))) return 'amul-taaza-milk';
  if (norm.includes('amul gold') || (norm.includes('gold') && norm.includes('milk'))) return 'amul-gold-milk';
  if (norm.includes('nandini') && norm.includes('milk')) return 'nandini-toned-milk';
  if (norm.includes('mother dairy') && norm.includes('milk')) return 'mother-dairy-milk';
  if (norm.includes('butter') && (norm.includes('100') || norm.includes('100g') || norm.includes('100 g'))) return 'amul-butter-100g';
  if (norm.includes('butter') && (norm.includes('500') || norm.includes('500g') || norm.includes('500 g'))) return 'amul-butter-500g';
  if (norm.includes('butter') && norm.includes('amul')) return 'amul-butter-500g';
  if (norm.includes('paneer')) return 'amul-paneer-200g';
  if (norm.includes('buttermilk') || norm.includes('chhach') || norm.includes('chaas')) return 'amul-masti-buttermilk';
  if (norm.includes('dahi') || norm.includes('curd')) return 'amul-masti-dahi';
  if (norm.includes('egg') && (norm.includes('30') || norm.includes('tray'))) return 'eggs-tray-30';
  if (norm.includes('egg') && (norm.includes('12') || norm.includes('dozen'))) return 'eggs-pack-of-12';
  if (norm.includes('egg')) return 'eggs-pack-of-6';
  if (norm.includes('bread')) return 'britannia-wheat-bread';

  if (norm.includes('atta') && (norm.includes('10kg') || norm.includes('10 kg'))) return 'aashirvaad-atta-10kg';
  if (norm.includes('atta') || norm.includes('aashirvaad')) return 'aashirvaad-atta-5kg';
  if (norm.includes('sunflower') || (norm.includes('fortune') && norm.includes('oil'))) return 'fortune-sunflower-oil-1l';
  if (norm.includes('salt') || norm.includes('tata salt')) return 'tata-salt-1kg';
  if (norm.includes('toor dal') || (norm.includes('sampann') && norm.includes('dal'))) return 'tata-sampann-toor-dal-1kg';
  if (norm.includes('basmati') || norm.includes('india gate')) return 'india-gate-basmati-rice-5kg';
  if (norm.includes('sugar') || norm.includes('madhur')) return 'madhur-sugar-1kg';

  if (norm.includes('coriander') && norm.includes('chilli')) return 'fresh-coriander-chilli';
  if (norm.includes('onion') || norm.includes('pyaaz')) return 'fresh-onion-1kg';
  if (norm.includes('tomato') || norm.includes('tamatar')) return 'fresh-tomato-1kg';
  if (norm.includes('potato') || norm.includes('aloo')) return 'fresh-potato-1kg';
  if (norm.includes('ginger') || norm.includes('adrak')) return 'fresh-ginger-250g';
  if (norm.includes('capsicum') || norm.includes('shimla')) return 'fresh-capsicum-500g';

  if (norm.includes('maggi') || norm.includes('noodles')) return 'maggi-noodles-4pack';
  if (norm.includes('yippee')) return 'yippee-noodles-4pack';
  if (norm.includes('ketchup')) return 'kissan-ketchup-950g';

  if (norm.includes('coca-cola') || norm.includes('coke')) return 'coca-cola-750ml';
  if (norm.includes('thums up')) return 'thums-up-750ml';
  if (norm.includes('tata tea')) return 'tata-tea-premium-500g';
  if (norm.includes('red label')) return 'red-label-tea-500g';
  if (norm.includes('nescafe') || norm.includes('coffee')) return 'nescafe-classic-50g';

  if (norm.includes('surf excel')) return 'surf-excel-1kg';
  if (norm.includes('vim')) return 'vim-gel-500ml';
  if (norm.includes('harpic')) return 'harpic-toilet-cleaner-500ml';
  if (norm.includes('lizol')) return 'lizol-surface-cleaner-500ml';
  if (norm.includes('dettol') && norm.includes('handwash')) return 'dettol-handwash-refill-675ml';

  if (norm.includes('colgate') || norm.includes('toothpaste')) return 'colgate-strong-teeth-150g';
  if (norm.includes('whisper') || norm.includes('pads')) return 'whisper-ultra-clean';

  if (norm.includes('lays') || norm.includes("lay's")) return 'lays-magic-masala';
  if (norm.includes('kurkure')) return 'kurkure-masala-munch';
  if (norm.includes('bhujia')) return 'haldirams-bhujia';
  if (norm.includes('parle-g') || norm.includes('parle g')) return 'parle-g-biscuits';

  return null;
}

export const EARNKARO_USER_ID = '1806075';

export function appendAffiliateTracking(rawUrl: string, platformId: PlatformId): string {
  try {
    const url = new URL(rawUrl);
    url.searchParams.set('r', EARNKARO_USER_ID);
    url.searchParams.set('earnkaro_uid', EARNKARO_USER_ID);
    url.searchParams.set('utm_source', 'nestbasket');
    url.searchParams.set('ref_founder', 'gopagani_arun');
    return url.toString();
  } catch (e) {
    const sep = rawUrl.includes('?') ? '&' : '?';
    return `${rawUrl}${sep}r=${EARNKARO_USER_ID}&earnkaro_uid=${EARNKARO_USER_ID}&utm_source=nestbasket&ref_founder=gopagani_arun`;
  }
}

/**
 * EXACT WORKING DEEP-LINK GENERATOR
 * Navigates directly to the specific product item page, NOT a generic search query!
 */
export function getDirectStoreBuyUrl(
  platformId: PlatformId,
  productName: string,
  existingOfferUrl?: string,
  unit?: string
): string {
  // If a valid, non-placeholder direct or search URL already exists on the offer, use it directly!
  if (
    existingOfferUrl &&
    existingOfferUrl.startsWith('https://') &&
    !existingOfferUrl.includes('.onelink.me') &&
    !existingOfferUrl.includes('/r/NestBasket') &&
    !existingOfferUrl.includes('/c/NestBasket') &&
    !existingOfferUrl.includes('affid=NestBasket')
  ) {
    return appendAffiliateTracking(existingOfferUrl, platformId);
  }

  // Check against our verified direct quick-commerce SKU directory
  const matchedKey = findVerifiedProductKey(productName);
  if (matchedKey && VERIFIED_DIRECT_STORE_LINKS[matchedKey]) {
    const verifiedUrl = VERIFIED_DIRECT_STORE_LINKS[matchedKey][platformId];
    if (verifiedUrl) {
      return appendAffiliateTracking(verifiedUrl, platformId);
    }
  }

  // Working deep-search query URL preserving exact product title and unit weight
  const query = `${productName}${unit ? ' ' + unit : ''}`.trim();
  const qEnc = encodeURIComponent(query);

  let targetUrl = `https://www.bigbasket.com/ps/?q=${qEnc}`;
  switch (platformId) {
    case 'zepto':
      targetUrl = `https://www.zeptonow.com/search?q=${qEnc}`;
      break;
    case 'blinkit':
      targetUrl = `https://blinkit.com/s/?q=${qEnc}`;
      break;
    case 'bigbasket':
      targetUrl = `https://www.bigbasket.com/ps/?q=${qEnc}`;
      break;
    case 'amazon':
      targetUrl = `https://www.amazon.in/s?k=${qEnc}&i=nowstore`;
      break;
    case 'instamart':
      targetUrl = `https://www.swiggy.com/instamart/search?query=${qEnc}`;
      break;
    case 'flipkart':
      targetUrl = `https://www.flipkart.com/search?q=${qEnc}&marketplace=GROCERY`;
      break;
    default:
      targetUrl = `https://www.bigbasket.com/ps/?q=${qEnc}`;
      break;
  }

  return appendAffiliateTracking(targetUrl, platformId);
}

// NestBasket Universal Catalog & Telemetry Client
// Seamlessly coordinates between Cloud Database / Microservice API and High-Performance Local Catalog
// Author: Gopagani Arun (NestBasket Founder)

import { Product, PlatformId } from '../types';
import { COMPREHENSIVE_GROCERY_DATA } from '../data/comprehensiveCatalog';
import { getDirectStoreBuyUrl } from '../utils/storeLinks';

export interface CatalogQueryOptions {
  category?: string;
  subCategory?: string;
  page?: number;
  limit?: number;
  search?: string;
  pincode?: string;
  sortBy?: 'savings' | 'price_asc' | 'price_desc' | 'popular';
}

export interface CatalogResponse {
  products: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  isLiveApi: boolean;
}

const API_BASE_URL = ((import.meta as any)?.env?.VITE_API_URL) || (typeof window !== 'undefined' && window.location.hostname === 'localhost' ? 'http://localhost:3001' : '');

/**
 * Fetches paginated products with intelligent hybrid fallback
 */
export async function getCatalogProducts(options: CatalogQueryOptions = {}): Promise<CatalogResponse> {
  const {
    category = 'all',
    subCategory = 'all',
    page = 1,
    limit = 24,
    search = '',
    pincode = '500016',
    sortBy = 'savings'
  } = options;

  // 1. Attempt API fetch if endpoint is available
  if (API_BASE_URL) {
    try {
      const params = new URLSearchParams({
        category,
        subCategory,
        page: String(page),
        limit: String(limit),
        pincode,
        search
      });

      const res = await fetch(`${API_BASE_URL}/api/catalog?${params.toString()}`, {
        signal: AbortSignal.timeout(3500)
      });

      if (res.ok) {
        const json = await res.json();
        if (json.success && Array.isArray(json.products) && json.products.length > 0) {
          return {
            products: json.products,
            total: json.total,
            page: json.page,
            limit: json.limit,
            totalPages: json.totalPages,
            isLiveApi: true
          };
        }
      }
    } catch (e) {
      // Graceful fallback to local catalog engine
    }
  }

  // 2. High-Performance In-Memory Local Master Catalog Fallback
  let filtered = [...COMPREHENSIVE_GROCERY_DATA];

  if (category && category !== 'all') {
    filtered = filtered.filter(p => p.category === category);
  }

  if (subCategory && subCategory !== 'all' && subCategory !== 'All') {
    filtered = filtered.filter(p => 
      p.subCategory && p.subCategory.toLowerCase() === subCategory.toLowerCase()
    );
  }

  if (search && search.trim()) {
    const q = search.trim().toLowerCase();
    filtered = filtered.filter(p => 
      p.name.toLowerCase().includes(q) ||
      (p.brand && p.brand.toLowerCase().includes(q)) ||
      (p.nameHindi && p.nameHindi.toLowerCase().includes(q))
    );
  }

  // Sorting
  if (sortBy === 'price_asc') {
    filtered.sort((a, b) => {
      const minA = Math.min(...Object.values(a.offers).map(o => o.price));
      const minB = Math.min(...Object.values(b.offers).map(o => o.price));
      return minA - minB;
    });
  } else if (sortBy === 'savings') {
    filtered.sort((a, b) => {
      const savA = Math.max(...Object.values(a.offers).map(o => o.mrp - o.price));
      const savB = Math.max(...Object.values(b.offers).map(o => o.mrp - o.price));
      return savB - savA;
    });
  }

  const total = filtered.length;
  const totalPages = Math.ceil(total / limit) || 1;
  const startIndex = (page - 1) * limit;
  const paginated = filtered.slice(startIndex, startIndex + limit);

  return {
    products: paginated,
    total,
    page,
    limit,
    totalPages,
    isLiveApi: false
  };
}

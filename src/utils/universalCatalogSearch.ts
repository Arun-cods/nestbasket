import { Product } from '../types';

export const searchUniversalCatalog = (query: string, currentList: Product[]): Product[] => {
  if (!query.trim()) return currentList;

  const q = query.toLowerCase().trim();
  return currentList.filter((p) =>
    p.name.toLowerCase().includes(q) ||
    p.brand.toLowerCase().includes(q) ||
    (p.nameHindi && p.nameHindi.includes(q)) ||
    p.unit.toLowerCase().includes(q)
  );
};

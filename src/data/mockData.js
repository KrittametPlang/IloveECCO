export const AVAILABLE_ITEMS = [
  { 
    id: 1, 
    code: 'SKU001',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&h=200&fit=crop',
    model: '102803',
    colorCode: '51925',
    season: 'SS2020',
    location: 'A1-01',
    name: 'รองเท้าผ้าใบ Classic',
    maxQty: 10
  },
  { 
    id: 2, 
    code: 'SKU002',
    image: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=200&h=200&fit=crop',
    model: '205417',
    colorCode: '33801',
    season: 'FW2021',
    location: 'A1-02',
    name: 'รองเท้าวิ่ง Sport Pro',
    maxQty: 8
  },
  { 
    id: 3, 
    code: 'SKU003',
    image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=200&h=200&fit=crop',
    model: '308956',
    colorCode: '72140',
    season: 'SS2021',
    location: 'A2-01',
    name: 'รองเท้าหนัง Premium',
    maxQty: 5
  },
  { 
    id: 4, 
    code: 'SKU004',
    image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=200&h=200&fit=crop',
    model: '411284',
    colorCode: '95632',
    season: 'FW2022',
    location: 'A2-02',
    name: 'รองเท้าแตะ Comfort',
    maxQty: 15
  },
  { 
    id: 5, 
    code: 'SKU005',
    image: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=200&h=200&fit=crop',
    model: '524671',
    colorCode: '18405',
    season: 'SS2022',
    location: 'B1-01',
    name: 'รองเท้าบูท Urban',
    maxQty: 6
  },
  { 
    id: 6, 
    code: 'SKU006',
    image: 'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=200&h=200&fit=crop',
    model: '637592',
    colorCode: '46289',
    season: 'FW2023',
    location: 'B1-02',
    name: 'รองเท้าผ้าใบ Limited',
    maxQty: 3
  },
];

/**
 * Find item by code (case-insensitive)
 */
export const findItemByCode = (code) => {
  if (!code) return null;
  return AVAILABLE_ITEMS.find(
    item => item.code.toLowerCase() === code.toLowerCase().trim()
  );
};

/**
 * Find item by model number
 */
export const findItemByModel = (model) => {
  if (!model) return null;
  return AVAILABLE_ITEMS.find(
    item => item.model === model.trim()
  );
};

/**
 * Search items by any field (code, model, colorCode, season, location, name)
 */
export const searchItems = (query) => {
  if (!query || query.trim().length < 2) return [];
  const q = query.toLowerCase().trim();
  
  return AVAILABLE_ITEMS.filter(item => 
    item.code.toLowerCase().includes(q) ||
    item.model.includes(q) ||
    item.colorCode.includes(q) ||
    item.season.toLowerCase().includes(q) ||
    item.location.toLowerCase().includes(q) ||
    item.name.toLowerCase().includes(q)
  );
};
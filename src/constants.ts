import { Product } from './types';

const BASE_PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: 'Vanilla Latte',
    description: 'Espresso with steamed milk and vanilla syrup.',
    sku: 'LAT-VAN-001',
    currentStock: 45,
    imageUrl: 'https://picsum.photos/400/400?random=1',
    category: 'Beverage'
  },
  {
    id: 'p2',
    name: 'Almond Croissant',
    description: 'Buttery croissant filled with almond paste and topped with sliced almonds.',
    sku: 'BAK-ALM-002',
    currentStock: 12,
    imageUrl: 'https://picsum.photos/400/400?random=2',
    category: 'Bakery'
  },
  {
    id: 'p3',
    name: 'Canvas Tote Bag',
    description: 'Durable 12oz canvas tote with reinforced handles.',
    sku: 'MERCH-TOT-003',
    currentStock: 150,
    imageUrl: 'https://picsum.photos/400/400?random=3',
    category: 'Merchandise'
  },
  {
    id: 'p4',
    name: 'Ceramic Mug (Black)',
    description: '12oz matte black ceramic mug.',
    sku: 'MERCH-MUG-BLK',
    currentStock: 24,
    imageUrl: 'https://picsum.photos/400/400?random=4',
    category: 'Merchandise'
  },
  {
    id: 'p5',
    name: 'Whole Bean Espresso Blend',
    description: '1lb bag of our signature house espresso blend.',
    sku: 'COF-WHL-ESP',
    currentStock: 8,
    imageUrl: 'https://picsum.photos/400/400?random=5',
    category: 'Coffee'
  },
  {
    id: 'p6',
    name: 'Blueberry Muffin',
    description: 'Fresh baked muffin with wild blueberries.',
    sku: 'BAK-BLU-006',
    currentStock: 0,
    imageUrl: 'https://picsum.photos/400/400?random=6',
    category: 'Bakery'
  },
  {
    id: 'p7',
    name: 'Iced Matcha Latte',
    description: 'Premium matcha green tea served over ice.',
    sku: 'BEV-MAT-ICE',
    currentStock: 30,
    imageUrl: 'https://picsum.photos/400/400?random=7',
    category: 'Beverage'
  }
];

const GENERATED_PRODUCTS: Product[] = Array.from({ length: 94 }, (_, index) => {
  const idNumber = index + 8; // continue after base products
  const categories = ['Beverage', 'Bakery', 'Coffee', 'Merchandise', 'Grocery'];
  const category = categories[idNumber % categories.length];

  return {
    id: `p${idNumber}`,
    name: `Sample Item ${idNumber}`,
    description: `Placeholder description for Sample Item ${idNumber}.`,
    sku: `SKU-${idNumber.toString().padStart(3, '0')}`,
    currentStock: (idNumber * 3) % 160,
    imageUrl: `https://picsum.photos/400/400?random=${idNumber}`,
    category
  };
});

export const MOCK_PRODUCTS: Product[] = [...BASE_PRODUCTS, ...GENERATED_PRODUCTS];

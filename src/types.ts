export interface Product {
  id: string;
  name: string;
  description: string;
  sku: string;
  currentStock: number;
  imageUrl: string;
  category: string;
  // Some backends may expose reporting categories separately; keep optional for compatibility.
  reportingCategory?: string;
}

export interface InventoryChange {
  productId: string;
  delta: number; // positive for add, negative for subtract
}

export interface ProductWithChange extends Product {
  pendingDelta: number;
}

import { Product } from "@/types";

const API_URL = import.meta.env.VITE_API_URL;

// GET /inventory
export async function fetchInventory(): Promise<Product[]> {
  if (!API_URL) {
    throw new Error("VITE_API_URL is not set; provide a base URL in your .env file.");
  }
  const res = await fetch(`${API_URL}/api/inventory`);
  if (!res.ok) {
    throw new Error(`Failed to fetch inventory: ${res.status}`);
  }
  return res.json();
}

// PUT /inventory/:sku
export async function updateProductStock(
  sku: string,
  updated: Partial<Product>
): Promise<Product> {
  if (!API_URL) {
    throw new Error("VITE_API_URL is not set; provide a base URL in your .env file.");
  }
  const res = await fetch(`${API_URL}/api/inventory/${sku}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updated),
  });

  if (!res.ok) {
    throw new Error(`Failed to update product ${sku}: ${res.status}`);
  }

  return res.json();
}

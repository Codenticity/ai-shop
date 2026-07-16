// lib/types.ts
// Shared domain types used across server components, server actions, and API routes.

export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  priceCents: number;
  currency: string;
  category: string;
  brand: string | null;
  imageUrl: string | null;
  attributes: ProductAttributes | null;
  stockQuantity: number;
  createdAt: Date;
  updatedAt: Date;
}

// Loosely-typed structured attributes used both for filtering and for
// grounding the LLM's recommendation reasoning (e.g. "fits 16-inch laptop").
export interface ProductAttributes {
  waterproof?: boolean;
  laptopCompatibleInches?: number[];
  weightGrams?: number;
  colors?: string[];
  material?: string;
  [key: string]: unknown;
}

export interface ProductSearchResult {
  product: Product;
  similarity: number; // cosine similarity score from vector search, 0-1
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  recommendedProductIds?: string[];
  createdAt: Date;
}

export interface CartItem {
  productId: string;
  quantity: number;
}

export interface Order {
  id: string;
  userId: string;
  status: "pending" | "paid" | "fulfilled" | "cancelled";
  totalCents: number;
  stripePaymentIntentId: string | null;
  createdAt: Date;
}

export interface User {
  id: string;
  email: string;
  name: string | null;
  role: "customer" | "admin";
}

"use server";
// lib/actions/cart.ts
//
// Server Action: callable directly from a client component's event handler
// like a function, but it executes on the server. This is how we avoid
// hand-rolling a REST API route for a simple mutation — the brief's
// "API routes only when necessary" rule in practice.

import { cookies } from "next/headers";
import type { CartItem } from "@/lib/types";

const CART_COOKIE = "ai_shop_cart";

export async function addToCart(productId: string, quantity: number) {
  const cookieStore = await cookies();
  const raw = cookieStore.get(CART_COOKIE)?.value;
  const cart: CartItem[] = raw ? JSON.parse(raw) : [];

  const existing = cart.find((item) => item.productId === productId);
  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.push({ productId, quantity });
  }

  cookieStore.set(CART_COOKIE, JSON.stringify(cart), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });

  return { ok: true, itemCount: cart.length };
}

export async function getCart(): Promise<CartItem[]> {
  const cookieStore = await cookies();
  const raw = cookieStore.get(CART_COOKIE)?.value;
  return raw ? JSON.parse(raw) : [];
}

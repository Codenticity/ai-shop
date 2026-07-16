"use client";
// components/store/add-to-cart-button.tsx
//
// This is a client component ONLY because it needs onClick + local pending
// state. Everything else about this page stayed server-rendered — this is
// the surgical "use client" boundary the brief asks for, not a blanket one
// at the page or layout level.

import { useState } from "react";
import { addToCart } from "@/lib/actions/cart";

export function AddToCartButton({ productId }: { productId: string }) {
  const [pending, setPending] = useState(false);
  const [added, setAdded] = useState(false);

  async function handleClick() {
    setPending(true);
    await addToCart(productId, 1); // server action — no API route needed
    setPending(false);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  return (
    <button
      onClick={handleClick}
      disabled={pending}
      className="rounded-lg bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:opacity-50"
    >
      {pending ? "Adding…" : added ? "Added ✓" : "Add to cart"}
    </button>
  );
}

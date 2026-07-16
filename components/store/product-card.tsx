// components/store/product-card.tsx
// Server Component — renders product data with zero client JS.

import Link from "next/link";
import type { Product } from "@/lib/types";

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      href={`/products/${product.slug}`}
      className="group rounded-xl border border-zinc-200 bg-white p-3 transition hover:border-zinc-300 hover:shadow-sm"
    >
      <div className="aspect-square overflow-hidden rounded-lg bg-zinc-100">
        {product.imageUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.imageUrl}
            alt={product.name}
            className="h-full w-full object-cover transition group-hover:scale-105"
          />
        )}
      </div>
      <p className="mt-3 truncate text-sm font-medium text-zinc-900">
        {product.name}
      </p>
      <p className="text-sm text-zinc-500">
        ${(product.priceCents / 100).toFixed(2)}
      </p>
    </Link>
  );
}

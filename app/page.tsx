// app/page.tsx
//
// Async Server Component: data is fetched ON THE SERVER during render,
// before any HTML reaches the browser. No useEffect, no loading spinner,
// no client-side fetch waterfall.

import { getAllProducts } from "@/lib/db/queries/products";
import { ProductCard } from "@/components/store/product-card";
import { ChatLauncher } from "@/components/chat/chat-launcher";

export default async function HomePage() {
  const products = await getAllProducts(12);

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <section className="mb-10 rounded-2xl bg-zinc-900 px-8 py-12 text-zinc-50">
        <h1 className="max-w-xl text-3xl font-semibold tracking-tight">
          Tell us what you need. Skip the filters.
        </h1>
        <p className="mt-3 max-w-xl text-zinc-300">
          &ldquo;Waterproof hiking backpack under $120 that fits a 16-inch
          laptop&rdquo; — type it like that. Our assistant reads the whole
          catalog and explains its picks.
        </p>
      </section>

      <h2 className="mb-4 text-lg font-medium text-zinc-700">
        Recently added
      </h2>
      <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Floating chat entry point — the only meaningfully interactive
          piece on this page, isolated to its own client component. */}
      <ChatLauncher />
    </div>
  );
}

// app/(store)/products/[slug]/page.tsx
//
// Dynamic Server Component route. Next.js statically generates this at
// build time for known slugs (see generateStaticParams) and falls back to
// on-demand SSR for new ones — SSG where possible, SSR where needed.

import { notFound } from "next/navigation";
import { getProductBySlug, getAllProducts } from "@/lib/db/queries/products";
import { AddToCartButton } from "@/components/store/add-to-cart-button";

export async function generateStaticParams() {
  const products = await getAllProducts(200);
  return products.map((p) => ({ slug: p.slug }));
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  return (
    <div className="mx-auto grid max-w-5xl gap-10 px-6 py-10 sm:grid-cols-2">
      <div className="aspect-square overflow-hidden rounded-xl bg-zinc-100">
        {product.imageUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.imageUrl}
            alt={product.name}
            className="h-full w-full object-cover"
          />
        )}
      </div>
      <div>
        <p className="text-sm uppercase tracking-wide text-zinc-500">
          {product.category}
        </p>
        <h1 className="mt-1 text-2xl font-semibold">{product.name}</h1>
        <p className="mt-2 text-xl font-medium">
          ${(product.priceCents / 100).toFixed(2)}
        </p>
        <p className="mt-4 text-zinc-700">{product.description}</p>
        <div className="mt-6">
          <AddToCartButton productId={product.id} />
        </div>
      </div>
    </div>
  );
}

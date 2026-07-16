"use client";
// components/admin/product-form.tsx
// Shared form used by both /admin/products/new and /admin/products/[id]/edit.
// Client component because it needs controlled inputs for image preview.

import { useState } from "react";

interface ProductFormProps {
  action: (formData: FormData) => Promise<void>;
  defaultValues?: {
    name?: string;
    description?: string;
    price?: string;
    category?: string;
    brand?: string;
    imageUrl?: string;
    stockQuantity?: string;
  };
  submitLabel?: string;
}

export function ProductForm({
  action,
  defaultValues = {},
  submitLabel = "Save product",
}: ProductFormProps) {
  const [imageUrl, setImageUrl] = useState(defaultValues.imageUrl ?? "");
  const [pending, setPending] = useState(false);

  async function handleSubmit(formData: FormData) {
    setPending(true);
    await action(formData);
    setPending(false);
  }

  return (
    <form action={handleSubmit} className="space-y-5 max-w-xl">

      {/* Name */}
      <div>
        <label className="mb-1.5 block text-sm font-medium text-zinc-700">
          Product name
        </label>
        <input
          name="name"
          defaultValue={defaultValues.name}
          required
          placeholder="e.g. TrailRunner 28L Hiking Backpack"
          className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-zinc-400"
        />
      </div>

      {/* Description */}
      <div>
        <label className="mb-1.5 block text-sm font-medium text-zinc-700">
          Description
        </label>
        <textarea
          name="description"
          defaultValue={defaultValues.description}
          required
          rows={4}
          placeholder="Describe the product..."
          className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-zinc-400 resize-none"
        />
      </div>

      {/* Price + Stock */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-zinc-700">
            Price (USD)
          </label>
          <input
            name="price"
            type="number"
            step="0.01"
            min="0"
            defaultValue={defaultValues.price}
            required
            placeholder="99.00"
            className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-zinc-400"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-zinc-700">
            Stock quantity
          </label>
          <input
            name="stockQuantity"
            type="number"
            min="0"
            defaultValue={defaultValues.stockQuantity ?? "0"}
            required
            className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-zinc-400"
          />
        </div>
      </div>

      {/* Category + Brand */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-zinc-700">
            Category
          </label>
          <input
            name="category"
            defaultValue={defaultValues.category}
            required
            placeholder="e.g. backpacks"
            className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-zinc-400"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-zinc-700">
            Brand
          </label>
          <input
            name="brand"
            defaultValue={defaultValues.brand}
            placeholder="e.g. PeakGear"
            className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-zinc-400"
          />
        </div>
      </div>

      {/* Image URL + Preview */}
      <div>
        <label className="mb-1.5 block text-sm font-medium text-zinc-700">
          Image URL
        </label>
        <input
          name="imageUrl"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          placeholder="https://images.unsplash.com/..."
          className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-zinc-400"
        />
        {imageUrl && (
          <div className="mt-3 h-40 w-40 overflow-hidden rounded-lg border border-zinc-200 bg-zinc-100">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageUrl}
              alt="Preview"
              className="h-full w-full object-cover"
              onError={(e) => (e.currentTarget.style.display = "none")}
            />
          </div>
        )}
      </div>

      <button
        type="submit"
        disabled={pending}
        className="rounded-lg bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-zinc-800 transition disabled:opacity-50"
      >
        {pending ? "Saving..." : submitLabel}
      </button>
    </form>
  );
}
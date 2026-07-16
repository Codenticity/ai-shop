"use client";

import { useState } from "react";

export function DeleteProductButton({
  id,
  name,
}: {
  id: string;
  name: string;
}) {
  const [pending, setPending] = useState(false);

  async function handleDelete() {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${name}"? This cannot be undone.`
    );
    if (!confirmed) return;

    setPending(true);

    await fetch(`/api/admin/products/${id}`, {
      method: "DELETE",
    });

    window.location.reload();
    setPending(false);
  }

  return (
    <button
      onClick={handleDelete}
      disabled={pending}
      className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 transition disabled:opacity-50"
    >
      {pending ? "Deleting..." : "Delete"}
    </button>
  );
}
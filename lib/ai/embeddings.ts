// lib/ai/embeddings.ts
const EMBEDDING_MODEL = "embed-english-v3.0";
const EMBEDDING_DIMENSIONS = 1024;

export async function generateEmbedding(
  text: string,
  inputType: "search_document" | "search_query" = "search_document"
): Promise<number[]> {
  const res = await fetch("https://api.cohere.com/v2/embed", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.COHERE_API_KEY}`,
    },
    body: JSON.stringify({
      model: EMBEDDING_MODEL,
      texts: [text],
      input_type: inputType,
      embedding_types: ["float"],
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Cohere embedding failed (${res.status}): ${body}`);
  }

  const data = await res.json();
  return data.embeddings.float[0] as number[];
}

export function productToEmbeddingText(product: {
  name: string;
  description: string;
  category: string;
  brand?: string | null;
  attributes?: Record<string, unknown> | null;
}): string {
  const attrLines = product.attributes
    ? Object.entries(product.attributes)
        .map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(", ") : v}`)
        .join("\n")
    : "";

  return [
    `Product: ${product.name}`,
    product.brand ? `Brand: ${product.brand}` : null,
    `Category: ${product.category}`,
    `Description: ${product.description}`,
    attrLines,
  ]
    .filter(Boolean)
    .join("\n");
}
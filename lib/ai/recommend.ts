// lib/ai/recommend.ts
import type { ProductSearchResult } from "@/lib/types";

export async function generateRecommendation(
  userQuery: string,
  candidates: ProductSearchResult[]
): Promise<{ text: string; recommendedProductIds: string[] }> {
  if (candidates.length === 0) {
    return {
      text: "I could not find anything matching that. Want to try loosening a constraint?",
      recommendedProductIds: [],
    };
  }

  const catalogContext = candidates
    .map(
      (c, i) =>
        `[${i + 1}] id=${c.product.id} | ${c.product.name} | $${(
          c.product.priceCents / 100
        ).toFixed(2)} | ${c.product.category}` +
        (c.product.brand ? ` | brand: ${c.product.brand}` : "") +
        `\n    ${c.product.description}`
    )
    .join("\n\n");

  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      temperature: 0.3,
      max_tokens: 600,
      messages: [
        {
          role: "system",
          content: "You are a shopping assistant. Only recommend products from the CATALOG below. Never invent products. Write 2-4 sentences recommending 1-3 products with concrete reasons. End with: RECOMMENDED_IDS: id1,id2\n\nCATALOG:\n" + catalogContext,
        },
        {
          role: "user",
          content: userQuery,
        },
      ],
    }),
  });

  if (!res.ok) {
    const errorBody = await res.text();
    console.error("Groq recommend error:", res.status, errorBody);
    return {
      text: "Sorry, I could not generate a recommendation right now. Please try again.",
      recommendedProductIds: [],
    };
  }

  const data = await res.json();
  const text = data.choices?.[0]?.message?.content ?? "";

  const idMatch = text.match(/RECOMMENDED_IDS:\s*(.+)/);
  const recommendedProductIds = idMatch
    ? idMatch[1].split(",").map((s: string) => s.trim()).filter(Boolean)
    : [];

  const displayText = text.replace(/RECOMMENDED_IDS:.*/, "").trim();

  return { text: displayText, recommendedProductIds };
}

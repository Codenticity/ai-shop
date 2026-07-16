import { z } from "zod";

const FiltersSchema = z.object({
  maxPriceCents: z.number().nullable(),
  category: z.string().nullable(),
  searchQuery: z.string(),
});

export type ExtractedFilters = z.infer<typeof FiltersSchema>;

export async function extractFilters(userQuery: string): Promise<ExtractedFilters> {
  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      temperature: 0,
      max_tokens: 300,
      messages: [
        {
          role: "system",
          content: "Extract hard shopping constraints from the user message as JSON only, no prose, no markdown fences. Schema: { maxPriceCents: number|null, category: string|null, searchQuery: string }. maxPriceCents: convert dollar budget to cents, e.g. $120 becomes 12000, null if no budget. category: single broad category word if clearly implied, null if unclear. searchQuery: rewrite as clean product-search phrase keeping descriptive detail but removing price talk.",
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
    console.error("Groq extract-filters error:", res.status, errorBody);
    return { maxPriceCents: null, category: null, searchQuery: userQuery };
  }

  const data = await res.json();
  const text = data.choices?.[0]?.message?.content ?? "{}";
  const cleaned = text.replace(/```json|```/g, "").trim();

  try {
    return FiltersSchema.parse(JSON.parse(cleaned));
  } catch {
    return { maxPriceCents: null, category: null, searchQuery: userQuery };
  }
}

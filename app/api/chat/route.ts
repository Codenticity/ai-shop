import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";
import { extractFilters } from "@/lib/ai/extract-filters";
import { searchProductsWithFilters } from "@/lib/ai/search-products";
import { generateRecommendation } from "@/lib/ai/recommend";
import { db } from "@/lib/db";
import { chatMessages } from "@/lib/db/schema";

const GREETING_RESPONSES: string[] = [
  "Hi! I am your shopping assistant. Tell me what you are looking for and I will find the best match in our catalog.",
  "Hello! What can I help you find today? Describe what you need and I will search our catalog for you.",
  "Hey there! I am here to help you find the perfect product. What are you looking for?",
];

function isGreeting(message: string): boolean {
  const greetings = ["hello", "hi", "hey", "howdy", "hiya", "sup", "greetings", "good morning", "good afternoon", "good evening"];
  const lower = message.toLowerCase().trim();
  return greetings.some((g) => lower === g || lower.startsWith(g + " ") || lower.startsWith(g + ","));
}

export async function POST(req: NextRequest) {
  const { message, sessionId } = await req.json();

  if (!message || typeof message !== "string") {
    return NextResponse.json({ error: "message is required" }, { status: 400 });
  }

  const session = await auth();
  const userId = session?.user?.id ?? null;

  if (isGreeting(message)) {
    const idx = Math.floor(Math.random() * GREETING_RESPONSES.length);
    const reply: string = GREETING_RESPONSES[idx] ?? GREETING_RESPONSES[0] ?? "Hi! How can I help you find a product today?";
    await db.insert(chatMessages).values([
      { userId, sessionId: sessionId as string, role: "user" as const, content: message },
      { userId, sessionId: sessionId as string, role: "assistant" as const, content: reply, recommendedProductIds: [] },
    ]);
    return NextResponse.json({ reply, products: [] });
  }

  const filters = await extractFilters(message);

  if (!filters.searchQuery || filters.searchQuery.trim() === "") {
    const reply: string = "Could you tell me more about what you are looking for? For example: a waterproof backpack under $100, or noise cancelling headphones.";
    await db.insert(chatMessages).values([
      { userId, sessionId: sessionId as string, role: "user" as const, content: message },
      { userId, sessionId: sessionId as string, role: "assistant" as const, content: reply, recommendedProductIds: [] },
    ]);
    return NextResponse.json({ reply, products: [] });
  }

  const candidates = await searchProductsWithFilters(
    filters.searchQuery,
    { maxPriceCents: filters.maxPriceCents ?? undefined, category: filters.category ?? undefined },
    8
  );

  const { text, recommendedProductIds } = await generateRecommendation(message, candidates);

  await db.insert(chatMessages).values([
    { userId, sessionId: sessionId as string, role: "user" as const, content: message },
    { userId, sessionId: sessionId as string, role: "assistant" as const, content: text, recommendedProductIds },
  ]);

  const recommendedProducts = candidates
    .filter((c) => recommendedProductIds.includes(c.product.id))
    .map((c) => c.product);

  return NextResponse.json({ reply: text, products: recommendedProducts });
}

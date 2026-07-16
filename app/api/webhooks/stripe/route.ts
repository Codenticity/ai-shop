// app/api/webhooks/stripe/route.ts
//
// Webhooks MUST be API routes — Stripe calls this URL directly, there's no
// "server action" equivalent for inbound third-party HTTP calls. Signature
// verification happens here before any order-fulfillment logic runs.

import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/services/stripe/client";
import { db } from "@/lib/db";
import { orders } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as { id: string; metadata?: { userId?: string }; amount_total?: number };
    await db.insert(orders).values({
      userId: session.metadata?.userId ?? "",
      status: "paid",
      totalCents: session.amount_total ?? 0,
      stripePaymentIntentId: session.id,
    });
  }

  return NextResponse.json({ received: true });
}

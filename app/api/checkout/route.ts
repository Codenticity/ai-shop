// app/api/checkout/route.ts
//
// Another legitimate API route: creating a Stripe Checkout Session requires
// a server-to-server call with a secret key, triggered from client-side
// "Buy now" interactivity. Logic itself is in /services/stripe.

import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/auth/guards";
import { getCart } from "@/lib/actions/cart";
import { db } from "@/lib/db";
import { products } from "@/lib/db/schema";
import { inArray } from "drizzle-orm";
import { stripe } from "@/services/stripe/client";

export async function POST(_req: NextRequest) {
  try {
    const user = await requireUser();
    const cart = await getCart();

    if (cart.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    const cartProducts = await db
      .select()
      .from(products)
      .where(inArray(products.id, cart.map((i) => i.productId)));

    const lineItems = cart.map((item) => {
      const product = cartProducts.find((p) => p.id === item.productId)!;
      return {
        price_data: {
          currency: product.currency.toLowerCase(),
          product_data: { name: product.name },
          unit_amount: product.priceCents,
        },
        quantity: item.quantity,
      };
    });

    const checkoutSession = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: lineItems,
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/cart`,
      metadata: { userId: user.id as string },
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (err) {
    if (err instanceof Error && err.message === "UNAUTHENTICATED") {
      return NextResponse.json({ error: "Please log in" }, { status: 401 });
    }
    throw err;
  }
}

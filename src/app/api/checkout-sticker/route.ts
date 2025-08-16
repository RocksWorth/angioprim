import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { stripe } from "../../../../lib/stripe";
import { STICKER_SIZES, STICKER_QUANTITIES, STICKER_FINISHES, stickerPriceFor, getStickerProduct } from "../../../../lib/stickers";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const Body = z.object({
  productId: z.string().min(3),
  size: z.enum(["2x2", "3x3", "4x4", "custom"]),
  quantity: z.union([z.literal(25), z.literal(50), z.literal(100), z.literal(250), z.literal(500), z.literal(1000), z.literal(2500)]),
  finish: z.enum(["matte", "gloss", "clear"]),
  copies: z.coerce.number().int().min(1).max(5),
});

export async function POST(req: NextRequest) {
  try {
    // Runtime check for required environment variables
    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json(
        { error: 'Stripe configuration not found' },
        { status: 500 }
      );
    }

    const siteUrl = process.env.SITE_URL || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    if (!siteUrl) throw new Error("Missing SITE_URL");

    const { productId, size, quantity, finish, copies } = Body.parse(await req.json());
    const product = getStickerProduct(productId);
    if (!product) return NextResponse.json({ error: "Unknown product" }, { status: 400 });

    const unit = stickerPriceFor(productId, size, quantity, finish);
    if (unit == null) return NextResponse.json({ error: "Invalid option combination" }, { status: 400 });

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      currency: "cad",
      customer_creation: "always",
      phone_number_collection: { enabled: true },
      shipping_address_collection: { allowed_countries: ["CA", "US"] },
      shipping_options: [
        { shipping_rate_data: { type: "fixed_amount", fixed_amount: { amount: 999, currency: "cad" }, display_name: "Standard (5–7 days)" } },
        { shipping_rate_data: { type: "fixed_amount", fixed_amount: { amount: 1999, currency: "cad" }, display_name: "Express (2–3 days)" } },
      ],
      line_items: [{
        quantity: copies,
        price_data: {
          currency: "cad",
          unit_amount: unit,
          product_data: {
            name: `${product.name} — ${size === "custom" ? "Custom size" : size + '"'} ${quantity} stickers (${finish} finish)`,
          },
        },
      }],
      metadata: {
        product_type: "sticker",
        product_id: product.id,
        size: size,
        quantity: String(quantity),
        finish: finish,
        copies: String(copies),
      },
      success_url: `${siteUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/shop/stickers`,
      allow_promotion_codes: true,
    });

    if (!session.url) throw new Error("Stripe did not return a checkout URL");
    return NextResponse.json({ url: session.url }, { status: 200 });
  } catch (err: any) {
    console.error("[/api/checkout-sticker] ERROR:", err?.message || err);
    return NextResponse.json({ error: err?.message ?? "Checkout failed" }, { status: 500 });
  }
}

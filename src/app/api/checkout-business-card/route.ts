import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { stripe } from "../../../../lib/stripe";
import { PACKS, SIDES, priceFor, type Pack, type Side, getBCProduct } from "../../../../lib/businessCards";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const Body = z.object({
  productId: z.string().min(3),
  pack: z.union([z.literal(100), z.literal(250), z.literal(500), z.literal(1000)]),
  side: z.union([z.literal("single"), z.literal("double")]),
  packs: z.coerce.number().int().min(1).max(10),
});

export async function POST(req: NextRequest){
  try{
    // Runtime check for required environment variables
    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json(
        { error: 'Stripe configuration not found' },
        { status: 500 }
      );
    }

    const origin = (process.env.SITE_URL || process.env.NEXT_PUBLIC_APP_URL || '').trim() || new URL(req.url).origin;

    const { productId, pack, side, packs } = Body.parse(await req.json());
    const product = getBCProduct(productId);
    if(!product) return NextResponse.json({ error: "Unknown product" }, { status: 400 });

    const unit = priceFor(productId, pack as Pack, side as Side);
    if(unit == null) return NextResponse.json({ error: "Invalid option combination" }, { status: 400 });

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      currency: "cad",
      customer_creation: "always",
      phone_number_collection: { enabled: true },
      shipping_address_collection: { allowed_countries: ["CA","US"] },
      shipping_options: [
        { shipping_rate_data: { type:"fixed_amount", fixed_amount:{ amount: 999, currency:"cad" }, display_name:"Standard (5–7 days)" } },
        { shipping_rate_data: { type:"fixed_amount", fixed_amount:{ amount:1999, currency:"cad" }, display_name:"Express (2–3 days)" } },
      ],
      line_items: [{
        quantity: packs,
        price_data: {
          currency: "cad",
          unit_amount: unit,
          product_data: {
            name: `${product.name} — ${pack} cards (${side==="single"?"Single":"Double"}-sided)`,
          },
        },
      }],
      metadata: {
        product_id: product.id,
        pack: String(pack),
        sides: side,
        packs: String(packs),
      },
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/cart`,
      allow_promotion_codes: true,
    });

    if(!session.url) throw new Error("Stripe did not return a checkout URL");
    return NextResponse.json({ url: session.url }, { status: 200 });
  }catch(err:any){
    console.error("[/api/checkout-business-card] ERROR:", err?.message || err);
    return NextResponse.json({ error: err?.message ?? "Checkout failed" }, { status: 500 });
  }
}

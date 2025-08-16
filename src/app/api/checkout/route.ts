import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '../../../../lib/stripe';

export async function POST(request: NextRequest) {
  // Runtime check for required environment variables
  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json(
      { error: 'Stripe configuration not found' },
      { status: 500 }
    );
  }

  try {
    const { quantity, productName, unitPrice } = await request.json();

    if (!quantity || !productName || !unitPrice) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      currency: 'cad',
      
      line_items: [
        {
          price_data: {
            currency: 'cad',
            product_data: {
              name: productName,
            },
            unit_amount: unitPrice,
          },
          quantity: quantity,
        },
      ],

      shipping_address_collection: {
        allowed_countries: ['CA', 'US'],
      },

      shipping_options: [
        { shipping_rate_data: { type:"fixed_amount", fixed_amount:{ amount: 999, currency:"cad" }, display_name:"Standard (5–7 days)" } },
        { shipping_rate_data: { type:"fixed_amount", fixed_amount:{ amount:1999, currency:"cad" }, display_name:"Express (2–3 days)" } },
      ],

      phone_number_collection: {
        enabled: true,
      },

      success_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}`,

      metadata: {
        productName,
        quantity: quantity.toString(),
        unitPrice: unitPrice.toString(),
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Checkout session creation failed:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}

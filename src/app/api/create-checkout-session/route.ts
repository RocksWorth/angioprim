import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '../../../../lib/stripe';

// Types for request payloads
type CartItem = {
  id: string;
  productId: string;
  name: string;
  description: string;
  price: number; // cents
  quantity: number;
  image: string; // path or absolute URL
  options: unknown;
};

type ShippingAddress = {
  name: string;
  address1: string;
  address2?: string;
  city: string;
  province: string;
  postalCode: string;
  country: string;
  phone?: string;
};

type ShippingRate = {
  id: string;
  name: string;
  description: string;
  price: number; // cents
  estimatedDays: string; // e.g. "2-5"
  carrier: string;
};

// Simple validation functions
function validateCartItems(items: any) {
  if (!Array.isArray(items) || items.length === 0) return false;
  return items.every(item => 
    item.id && item.productId && item.name && item.description &&
    typeof item.price === 'number' && typeof item.quantity === 'number' &&
    item.image && item.options
  );
}

function validateShippingAddress(address: any) {
  if (!address || typeof address !== 'object') return false;
  return address.name && address.address1 && address.city && 
         address.province && address.postalCode && address.country;
}

function validateShippingRate(rate: any) {
  if (!rate || typeof rate !== 'object') return false;
  return rate.id && rate.name && rate.description && 
         typeof rate.price === 'number' && rate.estimatedDays && rate.carrier;
}

export async function POST(request: NextRequest) {
  // Runtime check for required environment variables
  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json(
      { error: 'Stripe configuration not found' },
      { status: 500 }
    );
  }

  try {
    const body = await request.json();
    const { items, shippingAddress, shippingRate } = body as {
      items: CartItem[];
      shippingAddress: ShippingAddress;
      shippingRate: ShippingRate;
    };
    
    // Validate request data
    if (!validateCartItems(items)) {
      return NextResponse.json(
        { error: 'Invalid cart items' },
        { status: 400 }
      );
    }
    
    if (!validateShippingAddress(shippingAddress)) {
      return NextResponse.json(
        { error: 'Invalid shipping address' },
        { status: 400 }
      );
    }
    
    if (!validateShippingRate(shippingRate)) {
      return NextResponse.json(
        { error: 'Invalid shipping rate' },
        { status: 400 }
      );
    }
    
    // Validate that we have items in cart
    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: 'No items in cart' },
        { status: 400 }
      );
    }

    // Create line items for Stripe
    const lineItems = items.map((item: CartItem) => ({
      price_data: {
        currency: 'cad',
        product_data: {
          name: item.name,
          description: item.description,
          images: [item.image.startsWith('http') ? item.image : `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}${item.image}`],
          metadata: {
            productId: item.productId,
            options: JSON.stringify(item.options),
          },
        },
        unit_amount: item.price,
      },
      quantity: item.quantity,
    }));

    // Add shipping as a line item
    lineItems.push({
      price_data: {
        currency: 'cad',
        product_data: {
          name: `Shipping - ${shippingRate.name}`,
          description: `${shippingRate.description} via ${shippingRate.carrier}`,
          images: [],
          metadata: { productId: 'shipping', options: '{}' },
        },
        unit_amount: shippingRate.price,
      },
      quantity: 1,
    });

    // Calculate tax (simplified - in real app, use proper tax service)
    const subtotal = items.reduce((sum: number, item: CartItem) => sum + (item.price * item.quantity), 0);
    const taxRate = shippingAddress.province === 'ON' ? 0.13 : 0.05; // HST vs GST
    const taxAmount = Math.round(subtotal * taxRate);

    // Add tax as a line item
    if (taxAmount > 0) {
      lineItems.push({
        price_data: {
          currency: 'cad',
          product_data: {
            name: 'Tax',
            description: `${shippingAddress.province === 'ON' ? 'HST' : 'GST'} (${(taxRate * 100).toFixed(0)}%)`,
            images: [],
            metadata: { productId: 'tax', options: '{}' },
          },
          unit_amount: taxAmount,
        },
        quantity: 1,
      });
    }

    // Determine origin for redirects (env override, else request origin)
    const origin = (process.env.NEXT_PUBLIC_APP_URL || process.env.SITE_URL || '').trim() || new URL(request.url).origin;

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/cart`,
      
      // Customer and shipping information
      customer_creation: 'always',
      customer_email: undefined, // Let customer enter email
      
      shipping_address_collection: {
        allowed_countries: ['CA', 'US'],
      },
      
      // Pre-fill shipping address
      shipping_options: [
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: {
              amount: shippingRate.price,
              currency: 'cad',
            },
            display_name: shippingRate.name,
            delivery_estimate: {
              minimum: {
                unit: 'business_day',
                value: parseInt(shippingRate.estimatedDays.split('-')[0]) || 2,
              },
              maximum: {
                unit: 'business_day',
                value: parseInt(shippingRate.estimatedDays.split('-')[1]) || 7,
              },
            },
          },
        },
      ],
      
      // Metadata for the webhook
      metadata: {
        cartItems: JSON.stringify(items.map((item: CartItem) => ({
          id: item.id,
          productId: item.productId,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          options: item.options,
        }))),
        shippingAddress: JSON.stringify(shippingAddress),
        shippingRate: JSON.stringify(shippingRate),
        source: 'cart_checkout',
      },
      
      // Payment settings
      payment_intent_data: {
        receipt_email: undefined, // Let customer enter email
        metadata: {
          source: 'cart_checkout',
          itemCount: items.length.toString(),
        },
      },
      
      // Additional options
      allow_promotion_codes: true,
      billing_address_collection: 'required',
      phone_number_collection: {
        enabled: true,
      },
    });

    return NextResponse.json({
      success: true,
      url: session.url,
      sessionId: session.id,
    });
    
  } catch (error) {
    console.error('Checkout session creation error:', error);
    
    // Error handling without Zod
    if (error instanceof Error && error.message.includes('validation')) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.message },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}

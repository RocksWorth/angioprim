import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '../../../../../lib/stripe';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  // Runtime check for required environment variables
  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json(
      { error: 'Stripe configuration not found' },
      { status: 500 }
    );
  }

  try {
    const { sessionId } = await params;
    console.log('API: Received session ID:', sessionId);

    if (!sessionId) {
      console.log('API: No session ID provided');
      return NextResponse.json(
        { error: 'Session ID is required' },
        { status: 400 }
      );
    }

    // Retrieve the session with expanded line items
    console.log('API: Retrieving session from Stripe...');
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['line_items', 'line_items.data.price.product'],
    });

    if (!session) {
      console.log('API: Session not found in Stripe');
      return NextResponse.json(
        { error: 'Session not found' },
        { status: 404 }
      );
    }

    console.log('API: Session retrieved successfully:', session.id);

    const lineItems = session.line_items?.data || [];
    const customerDetails = session.customer_details;
    const shippingDetails = (session as any).shipping;

    console.log('API: Customer details:', !!customerDetails);
    console.log('API: Shipping details:', !!shippingDetails);
    console.log('API: Line items count:', lineItems.length);

    if (!customerDetails) {
      console.log('API: Missing customer details');
      return NextResponse.json(
        { error: 'Missing customer details' },
        { status: 400 }
      );
    }

    if (!shippingDetails) {
      console.log('API: Missing shipping details - order might not require shipping or session incomplete');
      // For now, let's continue without shipping for debugging
    }

    // Calculate shipping cost (total amount minus line items total)
    const lineItemsTotal = lineItems.reduce((total, item) => {
      return total + (item.amount_total || 0);
    }, 0);
    const shippingCost = (session.amount_total || 0) - lineItemsTotal;

    // Prepare order data for frontend
    const orderData = {
      id: session.id,
      email: customerDetails.email!,
      shipping: shippingDetails ? {
        name: shippingDetails.name || 'N/A',
        address: {
          line1: shippingDetails.address?.line1 || 'N/A',
          line2: shippingDetails.address?.line2 || undefined,
          city: shippingDetails.address?.city || 'N/A',
          state: shippingDetails.address?.state || 'N/A',
          postal_code: shippingDetails.address?.postal_code || 'N/A',
          country: shippingDetails.address?.country || 'N/A',
        },
      } : {
        name: 'N/A',
        address: {
          line1: 'Shipping info not available',
          city: 'N/A',
          state: 'N/A',
          postal_code: 'N/A',
          country: 'N/A',
        },
      },
      items: lineItems.map((item) => ({
        name: typeof item.price?.product === 'object' && 'name' in item.price.product
          ? item.price.product.name 
          : 'Unknown Product',
        quantity: item.quantity || 1,
        amount_total: item.amount_total || 0,
      })),
      amount_total: session.amount_total || 0,
      shipping_cost: shippingCost,
    };

    console.log('API: Returning order data:', orderData);
    return NextResponse.json(orderData);
  } catch (error) {
    console.error('Error fetching order details:', error);
    return NextResponse.json(
      { error: 'Failed to fetch order details' },
      { status: 500 }
    );
  }
}

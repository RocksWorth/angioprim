import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '../../../../../lib/stripe';
import { db } from '../../../../../lib/firebase';
import { gmailEmailService } from '../../../../lib/gmail-email';
import Stripe from 'stripe';

export async function POST(request: NextRequest) {
  // Runtime check for required environment variables
  if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json(
      { error: 'Stripe configuration not found' },
      { status: 500 }
    );
  }

  // Runtime check for Firebase configuration
  if (!process.env.FIREBASE_PROJECT_ID || !process.env.FIREBASE_CLIENT_EMAIL || !process.env.FIREBASE_PRIVATE_KEY) {
    return NextResponse.json(
      { error: 'Firebase configuration not found' },
      { status: 500 }
    );
  }

  const body = await request.text();
  const signature = request.headers.get('stripe-signature')!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message);
    return NextResponse.json(
      { error: 'Invalid signature' },
      { status: 400 }
    );
  }

  // Handle the checkout.session.completed event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    console.log('Processing checkout session:', session.id);

    try {
      // Retrieve the session with expanded line items and customer details
      const expandedSession = await stripe.checkout.sessions.retrieve(session.id, {
        expand: ['line_items', 'line_items.data.price.product', 'customer_details'],
      });

      const customerDetails = expandedSession.customer_details;
      const shippingDetails = (expandedSession as any).shipping;
      const lineItems = expandedSession.line_items?.data || [];

      if (!customerDetails) {
        console.error('No customer details found in session');
        return NextResponse.json(
          { error: 'Missing customer details' },
          { status: 400 }
        );
      }

      if (!shippingDetails) {
        console.log('No shipping details found in session - using placeholder data');
      }

      // Calculate shipping cost
      const lineItemsTotal = lineItems.reduce((total, item) => {
        return total + (item.amount_total || 0);
      }, 0);
      const shippingCost = (expandedSession.amount_total || 0) - lineItemsTotal;

      // Prepare order data for email and database
      const orderData = {
        id: session.id,
        payment_status: session.payment_status,
        email: customerDetails.email!,
        phone: customerDetails.phone || undefined,
        shipping: shippingDetails ? {
          name: shippingDetails.name!,
          address: {
            line1: shippingDetails.address!.line1!,
            line2: shippingDetails.address!.line2 || undefined,
            city: shippingDetails.address!.city!,
            state: shippingDetails.address!.state!,
            postal_code: shippingDetails.address!.postal_code!,
            country: shippingDetails.address!.country!,
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
        amount_total: expandedSession.amount_total || 0,
        shipping_cost: shippingCost,
        createdAt: new Date(),
      };

      // Save order to Firestore using Admin SDK
      console.log('Saving order to Firestore...');
      await db.collection('orders').add(orderData);
      console.log('Order saved to Firestore:', orderData.id);

      // Send email notifications using Gmail service
      console.log('Sending email notifications via Gmail...');
      const emailResults = await gmailEmailService.sendOrderNotifications(orderData);

      // Log email results
      if (emailResults.customer.success) {
        console.log('✅ Customer confirmation email sent successfully');
      } else {
        console.error('❌ Customer confirmation email failed:', emailResults.customer.error);
      }

      if (emailResults.admin.success) {
        console.log('✅ Admin notification email sent successfully');
      } else {
        console.error('❌ Admin notification email failed:', emailResults.admin.error);
      }

      // Log Gmail service status for debugging
      const emailStatus = gmailEmailService.getStatus();
      console.log('Gmail email service status:', emailStatus);

    } catch (error) {
      console.error('Error processing webhook:', error);
      return NextResponse.json(
        { error: 'Failed to process order' },
        { status: 500 }
      );
    }
  }

  return NextResponse.json({ received: true });
}
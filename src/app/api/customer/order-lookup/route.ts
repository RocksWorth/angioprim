import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../../../lib/firebase';
import { z } from 'zod';

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Validation schema for the request
const OrderLookupSchema = z.object({
  email: z.string().email().min(1),
  orderNumber: z.string().min(10), // Stripe session IDs are longer than 10 chars
});

export async function POST(request: NextRequest) {
  try {
    // Runtime check for Firebase configuration
    if (!process.env.FIREBASE_PROJECT_ID || !process.env.FIREBASE_CLIENT_EMAIL || !process.env.FIREBASE_PRIVATE_KEY) {
      return NextResponse.json(
        { error: 'Service temporarily unavailable' },
        { status: 503 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const validation = OrderLookupSchema.safeParse(body);
    
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid email or order number format' },
        { status: 400 }
      );
    }

    const { email, orderNumber } = validation.data;

    console.log('Customer order lookup request:', { 
      email: email.slice(0, 3) + '***', // Log partial email for debugging
      orderNumber: orderNumber.slice(0, 8) + '***' // Log partial order number
    });

    // Security: Rate limiting could be added here for production
    // For now, we'll rely on Vercel's built-in protections

    // Query Firestore for the specific order
    // Must match BOTH email and order ID for security
    const ordersSnapshot = await db.collection('orders')
      .where('id', '==', orderNumber)
      .where('email', '==', email.toLowerCase())
      .limit(1)
      .get();

    if (ordersSnapshot.empty) {
      console.log('No order found for lookup request');
      return NextResponse.json(
        { error: 'Order not found. Please check your email and order number.' },
        { status: 404 }
      );
    }

    // Get the order data
    const orderDoc = ordersSnapshot.docs[0];
    const orderData = orderDoc.data();

    // Prepare sanitized order data for customer (remove sensitive info)
    const customerOrderData = {
      id: orderData.id,
      email: orderData.email,
      payment_status: orderData.payment_status,
      shipping: orderData.shipping,
      items: orderData.items,
      amount_total: orderData.amount_total,
      shipping_cost: orderData.shipping_cost,
      createdAt: orderData.createdAt?.toDate ? {
        seconds: orderData.createdAt.toDate().getTime() / 1000,
        nanoseconds: 0
      } : orderData.createdAt
    };

    // Do NOT include sensitive data like:
    // - Phone number (unless customer specifically needs it)
    // - Internal Firestore document ID
    // - Payment processor details
    // - Other customers' information

    console.log('Order found and returned for customer');
    
    return NextResponse.json({ 
      order: customerOrderData,
      message: 'Order found successfully'
    });

  } catch (error) {
    console.error('Error in customer order lookup:', error);
    
    // Don't expose internal error details to customers
    return NextResponse.json(
      { error: 'Unable to process your request. Please try again later.' },
      { status: 500 }
    );
  }
}

// Prevent other HTTP methods
export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
}

export async function PUT() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
}

export async function DELETE() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
}

import { NextRequest, NextResponse } from 'next/server';
import { gmailEmailService } from '../../../lib/gmail-email';

export async function GET() {
  try {
    // Test order data
    const testOrderData = {
      id: 'cs_test_gmail_' + Date.now(),
      payment_status: 'paid',
      email: 'mobeen3001@gmail.com',
      phone: '+1234567890',
      shipping: {
        name: 'Mobeen Test',
        address: {
          line1: '123 Test Street',
          line2: 'Suite 100',
          city: 'Toronto',
          state: 'ON',
          postal_code: 'M5V 3A8',
          country: 'CA',
        },
      },
      items: [{
        name: 'Test Business Cards — 250 cards (Double-sided)',
        quantity: 1,
        amount_total: 3999,
      }],
      amount_total: 4998,
      shipping_cost: 999,
      createdAt: new Date(),
    };

    console.log('Testing Gmail email service...');
    
    // Check email service status
    const status = gmailEmailService.getStatus();
    console.log('Gmail email service status:', status);

    if (!status.configured) {
      return NextResponse.json({
        success: false,
        error: 'Gmail email service not configured',
        status,
        instructions: [
          '1. Enable 2-Factor Authentication on Gmail',
          '2. Generate App Password: myaccount.google.com → Security → App passwords',
          '3. Update .env.local with: GMAIL_APP_PASSWORD=your_16_char_code',
          '4. Restart the development server'
        ]
      });
    }

    // Send test emails
    const results = await gmailEmailService.sendOrderNotifications(testOrderData);
    
    return NextResponse.json({
      success: true,
      message: 'Test emails sent via Gmail',
      results,
      status,
      orderData: {
        id: testOrderData.id,
        email: testOrderData.email,
        total: testOrderData.amount_total
      }
    });

  } catch (error: any) {
    console.error('Test Gmail email error:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Test failed',
      instructions: [
        'Make sure Gmail App Password is set up correctly',
        'Check .env.local has GMAIL_USER and GMAIL_APP_PASSWORD',
        'Restart development server after updating .env.local'
      ]
    }, { status: 500 });
  }
}

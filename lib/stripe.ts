import Stripe from 'stripe';

// Use a placeholder during build time if env var is not set
const stripeSecretKey = process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder';

export const stripe = new Stripe(stripeSecretKey, {
  apiVersion: '2025-07-30.basil',
});

export const SHIPPING_OPTIONS = [
  {
    shipping_rate_data: {
      type: 'fixed_amount' as const,
      fixed_amount: {
        amount: 999, // $9.99 CAD
        currency: 'cad',
      },
      display_name: 'Standard (5–7 days)',
      delivery_estimate: {
        minimum: {
          unit: 'business_day' as const,
          value: 5,
        },
        maximum: {
          unit: 'business_day' as const,
          value: 7,
        },
      },
    },
  },
  {
    shipping_rate_data: {
      type: 'fixed_amount' as const,
      fixed_amount: {
        amount: 1999, // $19.99 CAD
        currency: 'cad',
      },
      display_name: 'Express (2–3 days)',
      delivery_estimate: {
        minimum: {
          unit: 'business_day' as const,
          value: 2,
        },
        maximum: {
          unit: 'business_day' as const,
          value: 3,
        },
      },
    },
  },
];

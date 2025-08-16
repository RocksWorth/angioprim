# VersatilePrint - Single Product Checkout

A Next.js e-commerce application with Stripe Checkout integration for selling a single product in CAD currency. Features include quantity selection, Canadian/US shipping, Firestore order management, and optional email notifications.

## Features

- **Product Page**: Display single product with quantity selector
- **Stripe Checkout**: Secure payment processing in CAD currency
- **Shipping Options**: Standard (5-7 days, $9.99) and Express (2-3 days, $19.99)
- **Geographic Support**: Ships to Canada and United States
- **Order Management**: Firestore integration for order storage
- **Email Notifications**: Optional order confirmation emails via Resend
- **Success Page**: Order confirmation with detailed receipt

## Tech Stack

- **Frontend**: Next.js 15.4.6 (App Router), TypeScript, Tailwind CSS
- **Payment**: Stripe Checkout
- **Database**: Firebase Firestore
- **Email**: Resend (optional)

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Variables

Create a `.env.local` file in the project root with the following variables:

```env
# Stripe Configuration (Required)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Firebase Configuration (Required)
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...

# Email Configuration (Gmail SMTP)
GMAIL_USER=your_gmail@gmail.com
GMAIL_APP_PASSWORD=your_16_character_app_password
FROM_EMAIL=orders@versatileprint.com
ADMIN_EMAIL=admin@versatileprint.com

# Canada Post Shipping API (Optional - for real shipping rates)
CANADA_POST_CUSTOMER_NUMBER=your_customer_number
CANADA_POST_USERNAME=your_api_username
CANADA_POST_PASSWORD=your_api_password
ORIGIN_POSTAL_CODE=M5V3A1

# App URL (Required)
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Stripe Setup

1. Create a [Stripe account](https://stripe.com)
2. Get your test API keys from the Stripe Dashboard
3. Configure webhook endpoint:
   - URL: `http://localhost:3000/api/webhooks/stripe` (for local development)
   - Events: `checkout.session.completed`
4. Copy the webhook signing secret to `STRIPE_WEBHOOK_SECRET`

### 4. Email Setup (Optional)

**VersatilePrint includes a professional dual email notification system:**
- **Customer confirmations**: Beautiful branded order confirmations
- **Admin notifications**: Instant new order alerts for store owners

#### Setting up Resend for Email

1. **Create a Resend Account**
   - Visit [resend.com](https://resend.com) and create an account
   - Verify your sending domain or use a Resend subdomain

2. **Get API Key**
   - Go to API Keys in your Resend dashboard
   - Create a new API key with send permissions
   - Copy the key to `RESEND_API_KEY` in `.env.local`

3. **Configure Email Addresses**
   ```env
   FROM_EMAIL=orders@yourdomain.com        # Sender address (must be verified)
   ADMIN_EMAIL=admin@yourdomain.com        # Where new order notifications go
   ```

4. **Email Features**
   - ✅ **Professional HTML templates** with responsive design
   - ✅ **VersatilePrint branding** with gradient colors and modern styling
   - ✅ **Customer confirmations** with order details and tracking links
   - ✅ **Admin notifications** with production details and customer info
   - ✅ **Graceful fallbacks** - order processing continues if email fails
   - ✅ **Mobile-optimized** templates for all devices

#### Email Configuration Options

```env
# Required for email functionality
RESEND_API_KEY=re_your_api_key_here

# Customize sender information
FROM_EMAIL=orders@versatileprint.com      # Must be verified in Resend
ADMIN_EMAIL=admin@versatileprint.com      # Receives new order notifications

# Optional: Customize in lib/email-templates.ts
COMPANY_NAME=VersatilePrint               # Used in email templates
COMPANY_WEBSITE=https://versatileprint.com
COMPANY_PHONE=+1 (555) 123-4567
```

**Without Email Configuration:**
- Orders will still process normally
- Email sending will be skipped gracefully
- Console logs will indicate email service is disabled

### 5. Firebase Setup

1. Create a [Firebase project](https://console.firebase.google.com/)
2. Enable Firestore database
3. Get your Firebase config from Project Settings
4. Create a collection named `orders` (will be auto-created on first order)

### 5. Resend Setup (Optional)

1. Create a [Resend account](https://resend.com)
2. Verify your domain or use a test email
3. Get your API key and add to `RESEND_API_KEY`
4. Update the `from` email in `/src/app/api/webhooks/stripe/route.ts`

### 6. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Testing

### Test Payment Flow

1. Navigate to the product page
2. Select quantity and click "Buy Now"
3. Use Stripe test card numbers:
   - Success: `4242 4242 4242 4242`
   - Declined: `4000 0000 0000 0002`
4. Complete checkout with test information
5. Verify order appears in Firestore `orders` collection

### Webhook Testing

For local webhook testing, use Stripe CLI:

```bash
# Install Stripe CLI
stripe listen --forward-to localhost:3000/api/webhooks/stripe

# Copy the webhook signing secret to your .env.local
```

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── checkout/route.ts          # Stripe session creation
│   │   ├── order/[sessionId]/route.ts # Order details API
│   │   └── webhooks/stripe/route.ts   # Stripe webhook handler
│   ├── success/page.tsx               # Order confirmation page
│   └── page.tsx                       # Product page
└── lib/
    ├── firebase.ts                    # Firebase configuration
    └── stripe.ts                      # Stripe configuration
```

## Key Files

- **`app/page.tsx`**: Product display with quantity selector and buy button
- **`app/api/checkout/route.ts`**: Creates Stripe checkout session
- **`app/api/webhooks/stripe/route.ts`**: Processes successful payments
- **`app/success/page.tsx`**: Order confirmation and receipt
- **`lib/stripe.ts`**: Stripe configuration and shipping options
- **`lib/firebase.ts`**: Firebase setup and order type definitions

## Customization

### Product Information

Edit the `PRODUCT` constant in `app/page.tsx`:

```typescript
const PRODUCT = {
  name: 'Your Product Name',
  price: 2999, // Price in cents (CAD)
  currency: 'CAD',
  description: 'Your product description',
};
```

### Shipping Options

Modify shipping rates in `lib/stripe.ts`:

```typescript
export const SHIPPING_OPTIONS = [
  {
    shipping_rate_data: {
      fixed_amount: { amount: 999, currency: 'cad' }, // $9.99
      display_name: 'Standard (5–7 days)',
      // ... delivery estimates
    },
  },
  // Add more options...
];
```

## Production Deployment

1. Update environment variables with production values
2. Configure production webhook endpoint in Stripe Dashboard
3. Verify domain in Resend (if using email notifications)
4. Deploy to your preferred platform (Vercel, Railway, etc.)

## Canada Post API Setup (Real Shipping Rates)

To get live shipping rates from Canada Post instead of calculated estimates:

### 1. Get Canada Post API Credentials

1. **Register** at [Canada Post Developer Portal](https://www.canadapost.ca/information/app)
2. **Apply for API access** with your business account
3. **Get your credentials**:
   - Customer Number (your business account number)
   - API Username & Password

### 2. Add to Environment Variables

```env
# Canada Post API Configuration
CANADA_POST_CUSTOMER_NUMBER=0000000000
CANADA_POST_USERNAME=your_api_username  
CANADA_POST_PASSWORD=your_api_password
ORIGIN_POSTAL_CODE=M5V3A1  # Your business postal code
```

### 3. Benefits of Real Rates

- **Accurate Pricing**: Live rates from Canada Post
- **Multiple Services**: Regular Parcel, Expedited, Xpresspost, Priority
- **Weight-based**: Precise pricing based on actual package weight
- **Automatic Fallback**: Uses calculated rates if API is unavailable

**Note**: Without Canada Post credentials, the system automatically uses calculated shipping rates based on postal code zones and package weight.

## Security Notes

- Webhook signature verification is implemented
- Environment variables are properly scoped (client vs server)
- Stripe handles all payment processing securely
- No sensitive data is stored in client-side code

## Support

For issues with:
- **Stripe**: Check [Stripe Documentation](https://stripe.com/docs)
- **Firebase**: Check [Firebase Documentation](https://firebase.google.com/docs)
- **Next.js**: Check [Next.js Documentation](https://nextjs.org/docs)
- **Canada Post API**: Check [Canada Post Developer Portal](https://www.canadapost.ca/information/app)

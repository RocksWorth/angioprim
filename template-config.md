# VersatilePrint - Premium Ecommerce Template

## 🚀 Template Customization Guide

This template is designed to be easily customized for different business types. Follow this guide to adapt it for your specific needs.

### 🎨 Quick Brand Customization

#### 1. **Business Type Configuration**

Update the environment variable in `.env.local`:

```env
# Choose from: default, tech, fashion, wellness, food, finance
NEXT_PUBLIC_BUSINESS_TYPE=default
```

#### 2. **Available Templates**

- **`default`** - VersatilePrint (Print Shop)
- **`tech`** - TechFlow (Software/Tech Company)
- **`fashion`** - LuxeCouture (Fashion/Luxury)
- **`wellness`** - PureWellness (Health/Wellness)
- **`food`** - Artisan Kitchen (Restaurant/Food)
- **`finance`** - PremiumWealth (Finance/Professional)

### 🛠 Advanced Customization

#### 1. **Create Custom Brand Configuration**

Edit `src/lib/design-system.ts` and add your custom configuration:

```typescript
export const businessTemplates = {
  // Add your custom template
  myBusiness: {
    ...defaultBrandConfig,
    name: "Your Business Name",
    tagline: "Your Tagline",
    description: "Your business description...",
    colors: {
      primary: "rgb(your, colors, here)",
      // ... more colors
    },
    gradients: {
      primary: "from-your-color to-your-other-color",
      // ... more gradients
    },
  },
};
```

#### 2. **Component Customization**

**Premium Hero Section** (`src/components/sections/premium-hero.tsx`):
- Customize title, subtitle, description
- Change background variants: `gradient`, `solid`, `pattern`, `minimal`
- Add/remove floating elements
- Modify action buttons

**Product Grid** (`src/components/sections/premium-product-grid.tsx`):
- Update product data structure
- Change grid columns (2, 3, or 4)
- Switch between variants: `default`, `minimal`, `luxury`, `glass`
- Toggle pricing display

**Premium Cards** (`src/components/ui/premium-card.tsx`):
- Variants: `default`, `glass`, `elevated`, `gradient`, `product`
- Sizes: `sm`, `md`, `lg`, `xl`
- Enable hover effects and glow

### 📱 Content Customization

#### 1. **Homepage Content** (`src/app/page.tsx`)

```typescript
// Update hero content
<PremiumHero
  badge="Your custom badge"
  title="Your Title"
  description="Your description..."
  actions={[
    {
      label: 'Your Primary CTA',
      href: '/your-link',
      variant: 'gradient',
    },
    // ... more actions
  ]}
/>

// Update featured products
const featuredProducts = [
  {
    id: 'product-1',
    name: 'Your Product',
    description: 'Product description...',
    image: '/your-image.jpg',
    href: '/your-product-link',
    // ... more fields
  },
];
```

#### 2. **Navigation** (`src/components/Header.tsx`)

Update navigation links and brand name:

```typescript
const navigation = [
  { name: 'Home', href: '/' },
  { name: 'Products', href: '/products' }, // Customize
  { name: 'Services', href: '/services' }, // Add new
  { name: 'About', href: '/about' },
  { name: 'Contact', href: '/contact' },
];
```

### 🎨 Styling Customization

#### 1. **Colors and Themes** (`src/app/globals.css`)

```css
:root {
  --brand-primary: rgb(your, primary, color);
  --brand-secondary: rgb(your, secondary, color);
  --brand-accent: rgb(your, accent, color);
  /* ... more color variables */
}
```

#### 2. **Typography**

```css
:root {
  --font-primary: 'Your-Font', -apple-system, BlinkMacSystemFont, sans-serif;
  --font-display: 'Your-Display-Font', sans-serif;
}
```

### 🛍 Product Management

#### 1. **Product Data Structure**

```typescript
interface Product {
  id: string;
  name: string;
  description: string;
  image: string;
  href: string;
  badge?: string;
  price?: string;
  features?: string[];
  popular?: boolean;
}
```

#### 2. **Adding New Products**

1. Create product data in appropriate page
2. Add product images to `/public/products/[product-name]/`
3. Create product page at `/src/app/shop/[product-name]/page.tsx`
4. Add checkout API at `/src/app/api/checkout-[product-name]/route.ts`

### 💳 Payment Integration

#### 1. **Stripe Configuration**

Update Stripe products and pricing in checkout APIs:

```typescript
const session = await stripe.checkout.sessions.create({
  payment_method_types: ['card'],
  line_items: [
    {
      price_data: {
        currency: 'cad', // Change currency
        product_data: {
          name: 'Your Product Name',
        },
        unit_amount: your_price_in_cents,
      },
      quantity: 1,
    },
  ],
  // ... more configuration
});
```

#### 2. **Shipping Configuration**

Update shipping options in checkout APIs:

```typescript
shipping_options: [
  {
    shipping_rate_data: {
      type: 'fixed_amount',
      fixed_amount: {
        amount: your_shipping_cost_in_cents,
        currency: 'cad',
      },
      display_name: 'Your Shipping Method',
      delivery_estimate: {
        minimum: { unit: 'business_day', value: 5 },
        maximum: { unit: 'business_day', value: 7 },
      },
    },
  },
],
```

### 📧 Email Customization

#### 1. **Email Templates** (`src/lib/email-templates.ts`)

- Customize email design and content
- Update company information
- Modify branding colors and fonts

#### 2. **Email Configuration**

```env
# Gmail SMTP
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=your-app-password

# Email addresses
FROM_EMAIL=orders@yourdomain.com
ADMIN_EMAIL=admin@yourdomain.com
```

### 🔧 Environment Setup

#### Required Environment Variables

```env
# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...

# Firebase
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=your-client-email
FIREBASE_PRIVATE_KEY=your-private-key

# Email (Gmail SMTP)
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=your-app-password
FROM_EMAIL=orders@yourdomain.com
ADMIN_EMAIL=admin@yourdomain.com

# Application
SITE_URL=https://yourdomain.com
NEXT_PUBLIC_APP_URL=https://yourdomain.com

# Template Configuration
NEXT_PUBLIC_BUSINESS_TYPE=default
```

### 🚀 Deployment

#### 1. **Vercel Deployment**

1. Connect your repository to Vercel
2. Add all environment variables in Vercel dashboard
3. Deploy with automatic builds

#### 2. **Custom Domain**

1. Add custom domain in Vercel
2. Update `SITE_URL` and `NEXT_PUBLIC_APP_URL`
3. Update Stripe webhook endpoint

### 📖 Business Type Examples

#### Tech Company
```typescript
NEXT_PUBLIC_BUSINESS_TYPE=tech
// Results in: TechFlow branding with green/blue colors
```

#### Fashion Brand
```typescript
NEXT_PUBLIC_BUSINESS_TYPE=fashion
// Results in: LuxeCouture branding with rose/violet colors
```

#### Restaurant
```typescript
NEXT_PUBLIC_BUSINESS_TYPE=food
// Results in: Artisan Kitchen branding with orange/red colors
```

### 🎨 Component Variants

#### PremiumButton Variants
- `primary` - Standard blue button
- `secondary` - Gray button
- `outline` - Outlined button
- `ghost` - Transparent button
- `gradient` - Gradient button (recommended for CTAs)
- `luxury` - Dark luxury button

#### PremiumCard Variants
- `default` - Standard white card
- `glass` - Glass morphism effect
- `elevated` - High shadow card
- `gradient` - Gradient background
- `product` - Optimized for products

#### Hero Background Variants
- `gradient` - Gradient background
- `solid` - Solid color
- `pattern` - Pattern background
- `minimal` - Clean white

### 🔍 SEO and Metadata

Update metadata in layout files:

```typescript
export const metadata: Metadata = {
  title: 'Your Business Name',
  description: 'Your business description...',
  keywords: 'your, keywords, here',
  // ... more metadata
};
```

---

## 📞 Support

This template provides a solid foundation for premium ecommerce sites. Customize the design system, components, and content to match your brand perfectly.

For additional customization needs, refer to the component documentation in each file.

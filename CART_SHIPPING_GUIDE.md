# 🛒 VersatilePrint - Shopping Cart & Shipping System

## 🎯 Overview

VersatilePrint now features a comprehensive shopping cart system with dynamic shipping rate calculation based on customer addresses. This transforms the site from a simple "buy now" model to a full-featured ecommerce experience.

## ✨ New Features

### 🛒 Shopping Cart System
- **Persistent Cart**: Items saved in localStorage, survives browser sessions
- **Cart Management**: Add, remove, update quantities
- **Real-time Totals**: Automatic calculation of subtotal, tax, and total
- **Cart Drawer**: Quick access via header icon with animated badge
- **Full Cart Page**: Detailed cart management and checkout flow

### 📍 Address-Based Shipping
- **Dynamic Rates**: Real-time shipping calculation based on destination
- **Multiple Carriers**: Canada Post, UPS, Purolator, FedEx options
- **Zone-Based Pricing**: Local, regional, national, and remote area rates
- **Weight Calculation**: Product-specific weight calculations
- **Free Shipping Threshold**: Automatic discounts for orders over $50

### 💳 Enhanced Checkout
- **Shipping Selection**: Choose from available shipping options
- **Tax Calculation**: Automatic HST/GST calculation by province
- **Address Validation**: Complete shipping address collection
- **Stripe Integration**: Seamless payment processing

## 🏗 System Architecture

### 📦 Core Components

#### `src/lib/cart-context.tsx`
- **Purpose**: Global cart state management using React Context
- **Features**: 
  - Cart items management
  - Shipping address handling
  - Shipping rate calculation
  - Persistent localStorage storage
  - Tax and total calculations

#### `src/app/api/shipping-rates/route.ts`
- **Purpose**: Calculate shipping rates based on address and cart contents
- **Features**:
  - Weight-based pricing
  - Zone calculation from postal codes
  - Multiple carrier options
  - Fallback rates for API failures

#### `src/app/api/create-checkout-session/route.ts`
- **Purpose**: Create Stripe checkout sessions with shipping and tax
- **Features**:
  - Line item creation from cart
  - Shipping cost integration
  - Tax calculation and addition
  - Metadata for order tracking

### 🎨 UI Components

#### `src/components/cart/cart-drawer.tsx`
- **Purpose**: Slide-out cart for quick item management
- **Features**: Item display, quantity controls, subtotal, quick checkout

#### `src/components/cart/cart-icon.tsx`
- **Purpose**: Header cart icon with item count badge
- **Features**: Animated badge, cart toggle, responsive design

#### `src/components/cart/add-to-cart-button.tsx`
- **Purpose**: Product page "Add to Cart" button
- **Features**: Loading states, success feedback, cart opening

#### `src/app/cart/page.tsx`
- **Purpose**: Full cart management page
- **Features**: Item management, shipping form, rate selection, checkout

## 🚀 Usage Guide

### 🛍 For Customers

1. **Browse Products**: Visit product pages like `/shop/business-cards`
2. **Configure Options**: Select quantity, paper type, sides, etc.
3. **Add to Cart**: Click "Add to Cart" button (not "Buy Now")
4. **Manage Cart**: Use cart icon in header to view/edit cart
5. **Enter Shipping**: Provide shipping address in cart page
6. **Select Shipping**: Choose from available shipping options
7. **Checkout**: Proceed to Stripe checkout with all costs included

### ⚙️ For Developers

#### Adding New Products
```typescript
// In product page component
<AddToCartButton
  productId="new-product"
  name="Product Name"
  description="Product description with options"
  price={priceInCents}
  image="/path/to/image.jpg"
  options={{ size: 'large', color: 'blue' }}
  quantity={1}
/>
```

#### Customizing Shipping Rates
```typescript
// In src/app/api/shipping-rates/route.ts
function getProductWeight(productId: string, options: any): number {
  const weights: Record<string, number> = {
    'business-cards': 0.1,
    'your-new-product': 0.5, // Add your product weight in kg
  };
  return weights[productId] || 0.1;
}
```

#### Integrating Real Shipping APIs
Replace the mock shipping calculation with real API calls:
```typescript
// Example: Canada Post API integration
const response = await fetch('https://ct.soa-gw.canadapost.ca/rs/ship/price', {
  method: 'POST',
  headers: {
    'Authorization': 'Basic ' + Buffer.from(`${username}:${password}`).toString('base64'),
    'Content-Type': 'application/vnd.cpc.ship.rate-v4+xml',
  },
  body: xmlPayload,
});
```

## 📊 Shipping Rate Logic

### 🌍 Zone Calculation
```typescript
function getShippingZone(postalCode: string, province: string): string {
  const firstChar = postalCode.charAt(0);
  
  if (province === 'ON' && ['K', 'L', 'M', 'N', 'P'].includes(firstChar)) {
    return 'local';     // Same province - 1.0x multiplier
  }
  
  if (['K', 'L', 'M', 'N', 'P', 'G', 'H', 'J'].includes(firstChar)) {
    return 'regional';  // Nearby provinces - 1.2x multiplier
  }
  
  if (['R', 'S', 'T', 'V'].includes(firstChar)) {
    return 'national';  // Cross-country - 1.5x multiplier
  }
  
  return 'remote';      // Territories - 2.0x multiplier
}
```

### ⚖️ Weight Calculation
```typescript
const packageWeight = items.reduce((total, item) => {
  const baseWeight = getProductWeight(item.productId, item.options);
  return total + (baseWeight * item.quantity);
}, 0);

// Additional charges for weight over 1kg
if (packageWeight > 1) {
  finalPrice += Math.ceil(packageWeight - 1) * 200; // $2 per additional kg
}
```

### 💰 Pricing Structure
- **Base Rate**: Starting at $9.99 for Canada Post Regular
- **Weight Adjustment**: +$2.00 per kg over 1kg
- **Zone Multiplier**: 1.0x (local) to 2.0x (remote)
- **Free Shipping**: $9.99 discount on orders $50+
- **Minimum**: $4.99 minimum shipping cost

## 🧪 Testing

### 🔬 Test the Shipping API
```bash
# Test shipping rates calculation
curl -X GET http://localhost:3000/api/shipping-rates

# Test with custom data
curl -X POST http://localhost:3000/api/shipping-rates \
  -H "Content-Type: application/json" \
  -d '{
    "address": {
      "name": "Test User",
      "address1": "123 Main St",
      "city": "Toronto",
      "province": "ON",
      "postalCode": "M5V 3A1",
      "country": "CA"
    },
    "items": [
      {
        "id": "1",
        "productId": "business-cards",
        "name": "Business Cards",
        "price": 2499,
        "quantity": 1,
        "options": {"paperType": "14pt-matte"}
      }
    ]
  }'
```

### 🛒 Test the Cart Flow
1. Visit `http://localhost:3000/shop/business-cards`
2. Configure options and click "Add to Cart"
3. Check cart icon shows item count
4. Click cart icon to view cart drawer
5. Click "View Cart" to go to cart page
6. Add shipping address to see rates
7. Select shipping option
8. Proceed to checkout

## 🚨 Known Limitations

### 🔧 Current Implementation
- **Mock Shipping APIs**: Using calculated rates, not real carrier APIs
- **Simplified Tax**: Basic HST/GST calculation, not comprehensive
- **Canadian Focus**: Primarily designed for Canadian shipping
- **Weight Estimates**: Product weights are estimated, not measured

### 🎯 Future Enhancements
- **Real API Integration**: Canada Post, UPS, FedEx, Purolator APIs
- **Advanced Tax**: Province-specific tax calculation service
- **International Shipping**: Global shipping rate calculation
- **Product Dimensions**: 3D packaging optimization
- **Inventory Management**: Stock level tracking
- **Promotions**: Discount codes and shipping promotions

## 🔗 Related Files

### 📁 Core System Files
- `src/lib/cart-context.tsx` - Cart state management
- `src/app/api/shipping-rates/route.ts` - Shipping calculation
- `src/app/api/create-checkout-session/route.ts` - Checkout creation
- `src/app/api/webhooks/stripe/route.ts` - Order processing

### 🎨 UI Components
- `src/components/cart/` - All cart-related components
- `src/app/cart/page.tsx` - Cart management page
- `src/app/layout.tsx` - Cart provider integration

### 📦 Product Integration
- `src/app/shop/business-cards/page.tsx` - Example cart integration
- `src/components/cart/add-to-cart-button.tsx` - Reusable add button

## 💡 Tips for Customization

### 🎨 Styling
- Use `src/lib/design-system.ts` for consistent colors
- Modify `src/components/ui/premium-*` for custom styling
- Update `src/app/globals.css` for global styles

### ⚙️ Business Logic
- Adjust shipping zones in `getShippingZone()`
- Modify weight calculations in `getProductWeight()`
- Update tax rates in cart context `CALCULATE_TOTALS`

### 🌐 Internationalization
- Add currency conversion in `formatPrice()`
- Update province/state lists for different countries
- Modify postal code validation patterns

---

*This cart and shipping system transforms VersatilePrint into a professional ecommerce platform with accurate shipping calculation and seamless checkout experience.*

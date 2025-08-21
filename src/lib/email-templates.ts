// Professional email templates for AngioPrim

export interface OrderData {
  id: string;
  email: string;
  phone?: string;
  payment_status: string;
  shipping: {
    name: string;
    address: {
      line1: string;
      line2?: string;
      city: string;
      state: string;
      postal_code: string;
      country: string;
    };
  };
  items: Array<{
    name: string;
    quantity: number;
    amount_total: number;
  }>;
  amount_total: number;
  shipping_cost: number;
  createdAt: Date;
}

const BRAND_COLORS = {
  primary: '#8B4513', // Saddle Brown (Rich coffee brown)
  secondary: '#D2691E', // Chocolate (Warm coffee accent)
  accent: '#CD853F', // Peru (Light coffee cream)
  text: '#3E2723', // Dark Brown (Coffee bean dark)
  textLight: '#795548', // Brown (Medium coffee)
  background: '#FFF8E1', // Amber 50 (Cream/latte background)
  white: '#FFFFFF'
};

const COMPANY_INFO = {
  name: 'AngioPrim',
  website: 'https://angioprim.com',
  email: 'orders@angioprim.com',
  phone: '+1 (555) 123-4567',
  address: '123 Coffee Street, Toronto, ON M5V 3A8, Canada'
};

// Shared email styles
const emailStyles = `
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
    
    body, table, td, p, a, li, blockquote {
      -webkit-text-size-adjust: 100%;
      -ms-text-size-adjust: 100%;
    }
    
    table, td {
      mso-table-lspace: 0pt;
      mso-table-rspace: 0pt;
    }
    
    img {
      -ms-interpolation-mode: bicubic;
      border: 0;
      height: auto;
      line-height: 100%;
      outline: none;
      text-decoration: none;
    }
    
    .email-container {
      max-width: 600px;
      margin: 0 auto;
      font-family: 'Inter', Arial, sans-serif;
      background-color: ${BRAND_COLORS.white};
    }
    
    .header {
      background: linear-gradient(135deg, ${BRAND_COLORS.primary} 0%, ${BRAND_COLORS.secondary} 100%);
      padding: 40px 20px;
      text-align: center;
    }
    
    .logo {
      font-size: 32px;
      font-weight: 700;
      color: ${BRAND_COLORS.white};
      text-decoration: none;
      margin: 0;
    }
    
    .tagline {
      color: rgba(255, 255, 255, 0.9);
      font-size: 14px;
      margin: 8px 0 0 0;
      font-weight: 300;
    }
    
    .content {
      padding: 40px 30px;
    }
    
    .title {
      font-size: 28px;
      font-weight: 600;
      color: ${BRAND_COLORS.text};
      margin: 0 0 16px 0;
      text-align: center;
    }
    
    .subtitle {
      font-size: 16px;
      color: ${BRAND_COLORS.textLight};
      margin: 0 0 32px 0;
      text-align: center;
      line-height: 1.5;
    }
    
    .order-box {
      background: ${BRAND_COLORS.background};
      border-radius: 12px;
      padding: 24px;
      margin: 24px 0;
      border: 1px solid #E2E8F0;
    }
    
    .order-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
      padding-bottom: 16px;
      border-bottom: 1px solid #E2E8F0;
    }
    
    .order-id {
      font-size: 18px;
      font-weight: 600;
      color: ${BRAND_COLORS.text};
    }
    
    .order-status {
      background: #10B981;
      color: white;
      padding: 6px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 500;
      text-transform: uppercase;
    }
    
    .section-title {
      font-size: 16px;
      font-weight: 600;
      color: ${BRAND_COLORS.text};
      margin: 24px 0 12px 0;
    }
    
    .item-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 0;
      border-bottom: 1px solid #F1F5F9;
    }
    
    .item-name {
      font-weight: 500;
      color: ${BRAND_COLORS.text};
      flex: 1;
    }
    
    .item-details {
      font-size: 14px;
      color: ${BRAND_COLORS.textLight};
      margin-top: 4px;
    }
    
    .item-price {
      font-weight: 600;
      color: ${BRAND_COLORS.text};
      margin-left: 16px;
    }
    
    .total-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 0;
      font-size: 18px;
      font-weight: 600;
      color: ${BRAND_COLORS.text};
      border-top: 2px solid ${BRAND_COLORS.primary};
      margin-top: 16px;
    }
    
    .button {
      display: inline-block;
      background: linear-gradient(135deg, ${BRAND_COLORS.primary} 0%, ${BRAND_COLORS.secondary} 100%);
      color: ${BRAND_COLORS.white} !important;
      padding: 20px 40px;
      border-radius: 12px;
      text-decoration: none !important;
      font-weight: 700;
      font-size: 18px;
      text-align: center;
      margin: 32px auto;
      display: block;
      width: fit-content;
      box-shadow: 0 8px 25px 0 rgba(139, 69, 19, 0.35);
      border: 3px solid ${BRAND_COLORS.white};
      text-transform: uppercase;
      letter-spacing: 1px;
      min-width: 250px;
    }
    
    .button:hover {
      transform: translateY(-2px);
      box-shadow: 0 12px 35px 0 rgba(139, 69, 19, 0.45);
      text-decoration: none !important;
      color: ${BRAND_COLORS.white} !important;
    }
    
    .footer {
      background: ${BRAND_COLORS.background};
      padding: 32px 30px;
      text-align: center;
      border-top: 1px solid #E2E8F0;
    }
    
    .footer-text {
      color: ${BRAND_COLORS.textLight};
      font-size: 14px;
      line-height: 1.6;
      margin: 8px 0;
    }
    
    .contact-info {
      margin: 16px 0;
    }
    
    .contact-link {
      color: ${BRAND_COLORS.primary};
      text-decoration: none;
    }
    
    @media only screen and (max-width: 600px) {
      .email-container {
        width: 100% !important;
      }
      
      .content {
        padding: 24px 20px !important;
      }
      
      .order-header {
        flex-direction: column;
        gap: 12px;
        text-align: center;
      }
      
      .item-row {
        flex-direction: column;
        align-items: flex-start;
        gap: 8px;
      }
      
      .item-price {
        margin-left: 0;
      }
    }
  </style>
`;

export function generateCustomerConfirmationEmail(orderData: OrderData): string {
  const formatCurrency = (cents: number) => 
    new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD' }).format(cents / 100);

  const formatDate = (date: Date) => 
    new Intl.DateTimeFormat('en-CA', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);

  const trackingUrl = `${process.env.SITE_URL || 'http://localhost:3000'}/my-orders`;

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Order Confirmation - ${orderData.id}</title>
      ${emailStyles}
    </head>
    <body>
      <div class="email-container">
        <!-- Header -->
        <div class="header">
          <h1 class="logo">${COMPANY_INFO.name}</h1>
          <p class="tagline">Premium coffee blends crafted for optimal wellness</p>
        </div>

        <!-- Content -->
        <div class="content">
          <h1 class="title">Thank You for Your Order!</h1>
          <p class="subtitle">
            We've received your order and payment successfully. Your premium coffee blend 
            is being prepared and will be shipped to you soon.
          </p>

          <!-- Order Summary -->
          <div class="order-box">
            <div class="order-header">
              <div>
                <div class="order-id">Order #${orderData.id.slice(-8).toUpperCase()}</div>
                <div style="font-size: 14px; color: ${BRAND_COLORS.textLight}; margin-top: 4px;">
                  ${formatDate(orderData.createdAt)}
                </div>
              </div>
              <div class="order-status">Confirmed</div>
            </div>

            <!-- Items -->
            <div class="section-title">Items Ordered</div>
            ${orderData.items.map(item => `
              <div class="item-row">
                <div>
                  <div class="item-name">${item.name}</div>
                  <div class="item-details">Quantity: ${item.quantity}</div>
                </div>
                <div class="item-price">${formatCurrency(item.amount_total)}</div>
              </div>
            `).join('')}

            <!-- Totals -->
            <div style="margin-top: 20px;">
              <div style="display: flex; justify-content: space-between; padding: 8px 0; font-size: 14px;">
                <span>Subtotal:</span>
                <span>${formatCurrency(orderData.amount_total - orderData.shipping_cost)}</span>
              </div>
              <div style="display: flex; justify-content: space-between; padding: 8px 0; font-size: 14px;">
                <span>Shipping:</span>
                <span>${formatCurrency(orderData.shipping_cost)}</span>
              </div>
              <div class="total-row">
                <span>Total:</span>
                <span>${formatCurrency(orderData.amount_total)}</span>
              </div>
            </div>
          </div>

          <!-- Shipping Information -->
          <div class="order-box">
            <div class="section-title">Shipping Address</div>
            <div style="line-height: 1.6; color: ${BRAND_COLORS.text};">
              <strong>${orderData.shipping.name}</strong><br>
              ${orderData.shipping.address.line1}<br>
              ${orderData.shipping.address.line2 ? orderData.shipping.address.line2 + '<br>' : ''}
              ${orderData.shipping.address.city}, ${orderData.shipping.address.state} ${orderData.shipping.address.postal_code}<br>
              ${orderData.shipping.address.country}
            </div>
          </div>

          <!-- Next Steps -->
          <div style="text-align: center; margin: 32px 0;">
            <h3 style="color: ${BRAND_COLORS.text}; margin-bottom: 16px;">What's Next?</h3>
            <p style="color: ${BRAND_COLORS.textLight}; margin-bottom: 24px; line-height: 1.6;">
              Your coffee order is being prepared with care. We'll send you tracking information once your premium coffee ships. 
              You can also track your order status anytime using the link below.
            </p>
            <a href="${trackingUrl}" class="button">Track Your Order</a>
          </div>

          <!-- Contact Support -->
          <div style="background: #FEF3C7; border: 1px solid #F59E0B; border-radius: 8px; padding: 20px; margin: 24px 0;">
            <h4 style="color: #92400E; margin: 0 0 8px 0; font-size: 16px;">Need Help?</h4>
            <p style="color: #B45309; margin: 0; font-size: 14px; line-height: 1.5;">
              Our customer support team is here to help! Contact us at 
              <a href="mailto:${COMPANY_INFO.email}" style="color: #B45309; font-weight: 600;">${COMPANY_INFO.email}</a> 
              or call us at <strong>${COMPANY_INFO.phone}</strong>
            </p>
          </div>
        </div>

        <!-- Footer -->
        <div class="footer">
          <div style="margin-bottom: 16px;">
            <h3 style="color: ${BRAND_COLORS.text}; margin: 0 0 8px 0;">${COMPANY_INFO.name}</h3>
            <p class="footer-text">Where premium coffee meets exceptional wellness</p>
          </div>
          
          <div class="contact-info">
            <p class="footer-text">
              <a href="mailto:${COMPANY_INFO.email}" class="contact-link">${COMPANY_INFO.email}</a> • 
              <a href="tel:${COMPANY_INFO.phone.replace(/\s/g, '')}" class="contact-link">${COMPANY_INFO.phone}</a>
            </p>
            <p class="footer-text">${COMPANY_INFO.address}</p>
            <p class="footer-text">
              <a href="${COMPANY_INFO.website}" class="contact-link">${COMPANY_INFO.website}</a>
            </p>
          </div>

          <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #E2E8F0;">
            <p class="footer-text" style="font-size: 12px;">
              © ${new Date().getFullYear()} ${COMPANY_INFO.name}. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
}

export function generateAdminNotificationEmail(orderData: OrderData): string {
  const formatCurrency = (cents: number) => 
    new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD' }).format(cents / 100);

  const formatDate = (date: Date) => 
    new Intl.DateTimeFormat('en-CA', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Order Alert - ${orderData.id}</title>
      ${emailStyles}
    </head>
    <body>
      <div class="email-container">
        <!-- Header -->
        <div class="header">
          <h1 class="logo">${COMPANY_INFO.name}</h1>
          <p class="tagline">Admin Dashboard</p>
        </div>

        <!-- Content -->
        <div class="content">
          <h1 class="title">🎉 New Order Received!</h1>
          <p class="subtitle">
            A new coffee order has been placed and payment has been confirmed. 
            Here are the order details for preparation and fulfillment.
          </p>

          <!-- Order Summary -->
          <div class="order-box">
            <div class="order-header">
              <div>
                <div class="order-id">Order #${orderData.id.slice(-8).toUpperCase()}</div>
                <div style="font-size: 14px; color: ${BRAND_COLORS.textLight}; margin-top: 4px;">
                  ${formatDate(orderData.createdAt)}
                </div>
              </div>
              <div class="order-status">New Order</div>
            </div>

            <!-- Customer Information -->
            <div class="section-title">Customer Information</div>
            <div style="background: white; padding: 16px; border-radius: 8px; margin-bottom: 20px;">
              <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                <span style="font-weight: 500;">Email:</span>
                <span><a href="mailto:${orderData.email}" style="color: ${BRAND_COLORS.primary};">${orderData.email}</a></span>
              </div>
              ${orderData.phone ? `
                <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                  <span style="font-weight: 500;">Phone:</span>
                  <span><a href="tel:${orderData.phone}" style="color: ${BRAND_COLORS.primary};">${orderData.phone}</a></span>
                </div>
              ` : ''}
            </div>

            <!-- Production Items -->
            <div class="section-title">📦 Items to Produce</div>
            ${orderData.items.map(item => `
              <div style="background: white; padding: 16px; border-radius: 8px; margin-bottom: 12px; border-left: 4px solid ${BRAND_COLORS.primary};">
                <div style="font-weight: 600; color: ${BRAND_COLORS.text}; margin-bottom: 4px;">
                  ${item.name}
                </div>
                <div style="display: flex; justify-content: space-between; align-items: center;">
                  <span style="color: ${BRAND_COLORS.textLight};">Quantity: ${item.quantity}</span>
                  <span style="font-weight: 600; color: ${BRAND_COLORS.text};">${formatCurrency(item.amount_total)}</span>
                </div>
              </div>
            `).join('')}

            <!-- Shipping Information -->
            <div class="section-title">🚚 Shipping Information</div>
            <div style="background: white; padding: 16px; border-radius: 8px;">
              <div style="font-weight: 600; margin-bottom: 8px;">${orderData.shipping.name}</div>
              <div style="line-height: 1.6; color: ${BRAND_COLORS.text};">
                ${orderData.shipping.address.line1}<br>
                ${orderData.shipping.address.line2 ? orderData.shipping.address.line2 + '<br>' : ''}
                ${orderData.shipping.address.city}, ${orderData.shipping.address.state} ${orderData.shipping.address.postal_code}<br>
                ${orderData.shipping.address.country}
              </div>
              <div style="margin-top: 12px; padding-top: 12px; border-top: 1px solid #E2E8F0;">
                <span style="font-weight: 500;">Shipping Cost: ${formatCurrency(orderData.shipping_cost)}</span>
              </div>
            </div>

            <!-- Order Totals -->
            <div style="background: ${BRAND_COLORS.background}; padding: 16px; border-radius: 8px; margin-top: 20px;">
              <div style="display: flex; justify-content: space-between; padding: 8px 0; font-size: 14px;">
                <span>Subtotal:</span>
                <span>${formatCurrency(orderData.amount_total - orderData.shipping_cost)}</span>
              </div>
              <div style="display: flex; justify-content: space-between; padding: 8px 0; font-size: 14px;">
                <span>Shipping:</span>
                <span>${formatCurrency(orderData.shipping_cost)}</span>
              </div>
              <div class="total-row">
                <span>Total Revenue:</span>
                <span>${formatCurrency(orderData.amount_total)}</span>
              </div>
            </div>
          </div>

          <!-- Action Items -->
          <div style="background: #ECFDF5; border: 1px solid #10B981; border-radius: 8px; padding: 20px; margin: 24px 0;">
            <h4 style="color: #065F46; margin: 0 0 12px 0; font-size: 16px;">📋 Next Steps</h4>
            <ul style="color: #047857; margin: 0; padding-left: 20px; line-height: 1.8;">
              <li>Prepare and package premium coffee order</li>
              <li>Quality check coffee freshness and packaging</li>
              <li>Prepare shipping materials and labels</li>
              <li>Update order status when shipped</li>
              <li>Send tracking information to customer</li>
            </ul>
          </div>
        </div>

        <!-- Footer -->
        <div class="footer">
          <p class="footer-text">
            This is an automated notification from your ${COMPANY_INFO.name} order management system.
          </p>
          <p class="footer-text">
            Order ID: ${orderData.id} • Payment Status: ${orderData.payment_status}
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
}

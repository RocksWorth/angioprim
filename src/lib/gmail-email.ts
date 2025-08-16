import nodemailer from 'nodemailer';
import { generateCustomerConfirmationEmail, generateAdminNotificationEmail } from './email-templates';

interface OrderData {
  id: string;
  email: string;
  phone?: string;
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

interface EmailResult {
  success: boolean;
  error?: string;
}

interface EmailResults {
  customer: EmailResult;
  admin: EmailResult;
}

class GmailEmailService {
  private transporter: nodemailer.Transporter | null = null;
  private initialized = false;

  constructor() {
    this.initialize();
  }

  private async initialize() {
    try {
      const gmailUser = process.env.GMAIL_USER;
      const gmailPassword = process.env.GMAIL_APP_PASSWORD;

      if (!gmailUser || !gmailPassword) {
        console.log('Gmail credentials not configured - email service disabled');
        return;
      }

      this.transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: gmailUser,
          pass: gmailPassword,
        },
      });

      // Verify connection
      await this.transporter.verify();
      console.log('Gmail email service initialized successfully');
      this.initialized = true;
    } catch (error) {
      console.error('Failed to initialize Gmail email service:', error);
      this.transporter = null;
      this.initialized = false;
    }
  }

  getStatus() {
    return {
      configured: this.initialized,
      service: 'Gmail SMTP',
      gmailUser: process.env.GMAIL_USER || 'Not configured',
      gmailPassword: process.env.GMAIL_APP_PASSWORD ? 'Configured' : 'Not configured',
    };
  }

  async sendCustomerOrderConfirmation(orderData: OrderData): Promise<EmailResult> {
    if (!this.transporter || !this.initialized) {
      console.log('Gmail email service not initialized - skipping customer email');
      return { success: false, error: 'Email service not configured' };
    }

    try {
      const orderNumber = orderData.id.split('_').pop()?.slice(-8).toUpperCase() || 'UNKNOWN';
      const emailHtml = generateCustomerConfirmationEmail(orderData);

      const mailOptions = {
        from: `"VersatilePrint Orders" <${process.env.GMAIL_USER}>`,
        to: orderData.email,
        subject: `Order Confirmation #${orderNumber} - VersatilePrint`,
        html: emailHtml,
      };

      console.log('Sending customer confirmation email via Gmail:', {
        to: orderData.email,
        subject: mailOptions.subject,
        from: mailOptions.from,
      });

      const result = await this.transporter.sendMail(mailOptions);
      console.log('Customer email sent successfully via Gmail:', result.messageId);
      
      return { success: true };
    } catch (error: any) {
      console.error('Failed to send customer email via Gmail:', error);
      return { success: false, error: error.message };
    }
  }

  async sendAdminNewOrderNotification(orderData: OrderData): Promise<EmailResult> {
    if (!this.transporter || !this.initialized) {
      console.log('Gmail email service not initialized - skipping admin email');
      return { success: false, error: 'Email service not configured' };
    }

    try {
      const orderNumber = orderData.id.split('_').pop()?.slice(-8).toUpperCase() || 'UNKNOWN';
      const totalFormatted = (orderData.amount_total / 100).toFixed(2);
      const emailHtml = generateAdminNotificationEmail(orderData);

      const adminEmail = process.env.ADMIN_EMAIL || process.env.GMAIL_USER;
      const mailOptions = {
        from: `"VersatilePrint System" <${process.env.GMAIL_USER}>`,
        to: adminEmail,
        subject: `🎉 New Order #${orderNumber} - $${totalFormatted} - VersatilePrint`,
        html: emailHtml,
      };

      console.log('Sending admin notification email via Gmail:', {
        to: adminEmail,
        subject: mailOptions.subject,
        from: mailOptions.from,
      });

      const result = await this.transporter.sendMail(mailOptions);
      console.log('Admin email sent successfully via Gmail:', result.messageId);
      
      return { success: true };
    } catch (error: any) {
      console.error('Failed to send admin email via Gmail:', error);
      return { success: false, error: error.message };
    }
  }

  async sendOrderNotifications(orderData: OrderData): Promise<EmailResults> {
    console.log('Sending order notifications via Gmail for order:', orderData.id);

    const [customerResult, adminResult] = await Promise.all([
      this.sendCustomerOrderConfirmation(orderData),
      this.sendAdminNewOrderNotification(orderData),
    ]);

    // Log results
    const orderNumber = orderData.id.split('_').pop()?.slice(-8).toUpperCase() || 'UNKNOWN';
    const totalFormatted = (orderData.amount_total / 100).toFixed(2);

    if (customerResult.success) {
      console.log(`Customer confirmation sent via Gmail to ${orderData.email} for order ${orderNumber}`);
    } else {
      console.error('Customer email failed via Gmail:', customerResult.error);
    }

    if (adminResult.success) {
      console.log(`Admin notification sent via Gmail for order ${orderNumber} ($${totalFormatted})`);
    } else {
      console.error('Admin email failed via Gmail:', adminResult.error);
    }

    return {
      customer: customerResult,
      admin: adminResult,
    };
  }
}

// Export a singleton instance
export const gmailEmailService = new GmailEmailService();

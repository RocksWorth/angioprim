import { generateCustomerConfirmationEmail, generateAdminNotificationEmail, type OrderData } from './email-templates';

interface EmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  from?: string;
}

interface EmailServiceConfig {
  apiKey?: string;
  fromEmail: string;
  adminEmail: string;
  companyName: string;
}

class EmailService {
  private config: EmailServiceConfig;
  private resend: any = null;

  constructor() {
    this.config = {
      apiKey: process.env.RESEND_API_KEY,
      fromEmail: process.env.FROM_EMAIL || 'orders@versatileprint.com',
      adminEmail: process.env.ADMIN_EMAIL || 'admin@versatileprint.com', 
      companyName: 'VersatilePrint'
    };

    // Initialize Resend only if API key is available
    if (this.config.apiKey) {
      try {
        const { Resend } = require('resend');
        this.resend = new Resend(this.config.apiKey);
        console.log('Email service initialized with Resend');
      } catch (error) {
        console.error('Failed to initialize Resend:', error);
        this.resend = null;
      }
    } else {
      console.log('Resend API key not found - email service disabled');
    }
  }

  /**
   * Check if email service is properly configured
   */
  isConfigured(): boolean {
    return this.resend !== null && !!this.config.apiKey;
  }

  /**
   * Send a single email
   */
  async sendEmail(options: EmailOptions): Promise<{ success: boolean; messageId?: string; error?: string }> {
    if (!this.isConfigured()) {
      console.log('Email service not configured, skipping email send');
      return { success: false, error: 'Email service not configured' };
    }

    try {
      const emailData = {
        from: options.from || this.config.fromEmail,
        to: Array.isArray(options.to) ? options.to : [options.to],
        subject: options.subject,
        html: options.html,
      };

      console.log('Sending email:', { 
        to: emailData.to, 
        subject: emailData.subject,
        from: emailData.from 
      });

      const result = await this.resend.emails.send(emailData);
      
      console.log('Email sent successfully:', result.data?.id);
      return { 
        success: true, 
        messageId: result.data?.id 
      };

    } catch (error: any) {
      console.error('Failed to send email:', error);
      return { 
        success: false, 
        error: error.message || 'Unknown email error' 
      };
    }
  }

  /**
   * Send customer order confirmation email
   */
  async sendCustomerConfirmation(orderData: OrderData): Promise<{ success: boolean; messageId?: string; error?: string }> {
    if (!this.isConfigured()) {
      console.log('Email service not configured, skipping customer confirmation');
      return { success: false, error: 'Email service not configured' };
    }

    try {
      const emailHtml = generateCustomerConfirmationEmail(orderData);
      const orderNumber = orderData.id.slice(-8).toUpperCase();

      const result = await this.sendEmail({
        to: orderData.email,
        subject: `Order Confirmation #${orderNumber} - ${this.config.companyName}`,
        html: emailHtml,
      });

      if (result.success) {
        console.log(`Customer confirmation sent to ${orderData.email} for order ${orderNumber}`);
      }

      return result;

    } catch (error: any) {
      console.error('Failed to send customer confirmation:', error);
      return { 
        success: false, 
        error: error.message || 'Failed to send customer confirmation' 
      };
    }
  }

  /**
   * Send admin notification email
   */
  async sendAdminNotification(orderData: OrderData): Promise<{ success: boolean; messageId?: string; error?: string }> {
    if (!this.isConfigured()) {
      console.log('Email service not configured, skipping admin notification');
      return { success: false, error: 'Email service not configured' };
    }

    try {
      const emailHtml = generateAdminNotificationEmail(orderData);
      const orderNumber = orderData.id.slice(-8).toUpperCase();
      const orderTotal = (orderData.amount_total / 100).toLocaleString('en-CA', { 
        style: 'currency', 
        currency: 'CAD' 
      });

      const result = await this.sendEmail({
        to: this.config.adminEmail,
        subject: `🎉 New Order #${orderNumber} - ${orderTotal} - ${this.config.companyName}`,
        html: emailHtml,
      });

      if (result.success) {
        console.log(`Admin notification sent for order ${orderNumber} (${orderTotal})`);
      }

      return result;

    } catch (error: any) {
      console.error('Failed to send admin notification:', error);
      return { 
        success: false, 
        error: error.message || 'Failed to send admin notification' 
      };
    }
  }

  /**
   * Send both customer and admin emails for a new order
   */
  async sendOrderNotifications(orderData: OrderData): Promise<{
    customer: { success: boolean; messageId?: string; error?: string };
    admin: { success: boolean; messageId?: string; error?: string };
  }> {
    console.log('Sending order notifications for order:', orderData.id);

    // Send both emails in parallel for better performance
    const [customerResult, adminResult] = await Promise.allSettled([
      this.sendCustomerConfirmation(orderData),
      this.sendAdminNotification(orderData)
    ]);

    return {
      customer: customerResult.status === 'fulfilled' 
        ? customerResult.value 
        : { success: false, error: customerResult.reason?.message || 'Customer email failed' },
      admin: adminResult.status === 'fulfilled' 
        ? adminResult.value 
        : { success: false, error: adminResult.reason?.message || 'Admin email failed' }
    };
  }

  /**
   * Get email service status for debugging
   */
  getStatus(): {
    configured: boolean;
    apiKey: boolean;
    fromEmail: string;
    adminEmail: string;
  } {
    return {
      configured: this.isConfigured(),
      apiKey: !!this.config.apiKey,
      fromEmail: this.config.fromEmail,
      adminEmail: this.config.adminEmail,
    };
  }
}

// Export a singleton instance
export const emailService = new EmailService();

// Export types for use in other files
export type { OrderData, EmailOptions };
export { EmailService };

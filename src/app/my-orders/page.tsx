'use client';

import { useState } from 'react';
import { Header } from '../../components/Header';
import { Button } from '../../components/Button';
import Link from 'next/link';

interface OrderDetails {
  id: string;
  email: string;
  amount_total: number;
  shipping_cost: number;
  items: Array<{
    name: string;
    quantity: number;
    amount_total: number;
  }>;
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
  createdAt: {
    seconds: number;
    nanoseconds: number;
  };
  payment_status: string;
}

export default function MyOrdersPage() {
  const [email, setEmail] = useState('');
  const [orderNumber, setOrderNumber] = useState('');
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim() || !orderNumber.trim()) {
      setError('Please enter both email and order number');
      return;
    }

    setLoading(true);
    setError(null);
    setOrder(null);

    try {
      const response = await fetch('/api/customer/order-lookup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          orderNumber: orderNumber.trim(),
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setOrder(data.order);
        setSearched(true);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Order not found. Please check your email and order number.');
        setSearched(true);
      }
    } catch (error) {
      setError('Unable to search for orders. Please try again later.');
      setSearched(true);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (priceInCents: number) => {
    return (priceInCents / 100).toLocaleString('en-CA', {
      style: 'currency',
      currency: 'CAD',
    });
  };

  const formatDate = (timestamp: { seconds: number; nanoseconds: number }) => {
    const date = new Date(timestamp.seconds * 1000);
    return date.toLocaleDateString('en-CA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const maskOrderId = (id: string) => {
    // Show only first 4 and last 4 characters for security
    if (id.length <= 8) return id;
    return `${id.slice(0, 4)}...${id.slice(-4)}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-800 mb-4">
            Track Your <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Order</span>
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Enter your email and order number to view your order details and tracking information
          </p>
        </div>

        {/* Search Form */}
        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8 mb-8">
          <form onSubmit={handleSearch} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors text-slate-900"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="orderNumber" className="block text-sm font-semibold text-slate-700 mb-2">
                  Order Number
                </label>
                <input
                  type="text"
                  id="orderNumber"
                  value={orderNumber}
                  onChange={(e) => setOrderNumber(e.target.value)}
                  placeholder="cs_test_..."
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors text-slate-900"
                  required
                />
                <p className="text-xs text-slate-500 mt-1">
                  Found in your order confirmation email
                </p>
              </div>
            </div>
            
            <div className="text-center">
              <Button 
                type="submit" 
                loading={loading}
                size="lg"
                className="px-12"
              >
                {loading ? 'Searching...' : 'Find My Order'}
              </Button>
            </div>
          </form>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border-2 border-red-200 rounded-3xl p-6 mb-8">
            <div className="flex items-center">
              <div className="text-red-500 mr-3">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-red-800">Order Not Found</h3>
                <p className="text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* No Results Message */}
        {searched && !order && !error && (
          <div className="bg-yellow-50 border-2 border-yellow-200 rounded-3xl p-6 mb-8">
            <div className="flex items-center">
              <div className="text-yellow-500 mr-3">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-yellow-800">No Order Found</h3>
                <p className="text-yellow-700">Please double-check your email address and order number.</p>
              </div>
            </div>
          </div>
        )}

        {/* Order Details */}
        {order && (
          <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
            <div className="bg-gradient-to-r from-green-500 to-teal-500 text-white p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">Order Found!</h2>
                  <p className="text-green-100">Order #{maskOrderId(order.id)}</p>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold">{formatPrice(order.amount_total)}</p>
                  <p className="text-green-100">{formatDate(order.createdAt)}</p>
                </div>
              </div>
            </div>

            <div className="p-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                {/* Order Status */}
                <div>
                  <h3 className="font-semibold text-slate-800 mb-4">Order Status</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-xl">
                      <span className="font-medium text-green-800">Payment</span>
                      <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
                        {order.payment_status === 'paid' ? 'Completed' : order.payment_status}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-xl">
                      <span className="font-medium text-blue-800">Production</span>
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
                        In Progress
                      </span>
                    </div>
                  </div>
                </div>

                {/* Shipping Info */}
                <div>
                  <h3 className="font-semibold text-slate-800 mb-4">Shipping Address</h3>
                  <div className="text-sm text-slate-600 space-y-1">
                    <p className="font-medium text-slate-800">{order.shipping.name}</p>
                    <p>{order.shipping.address.line1}</p>
                    {order.shipping.address.line2 && <p>{order.shipping.address.line2}</p>}
                    <p>{order.shipping.address.city}, {order.shipping.address.state} {order.shipping.address.postal_code}</p>
                    <p>{order.shipping.address.country}</p>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="mb-8">
                <h3 className="font-semibold text-slate-800 mb-4">Items Ordered</h3>
                <div className="space-y-3">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex justify-between items-center p-4 bg-slate-50 rounded-xl">
                      <div>
                        <p className="font-medium text-slate-800">{item.name}</p>
                        <p className="text-sm text-slate-600">Quantity: {item.quantity}</p>
                      </div>
                      <p className="font-semibold text-slate-800">{formatPrice(item.amount_total)}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Total */}
              <div className="border-t border-slate-200 pt-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal:</span>
                    <span>{formatPrice(order.amount_total - order.shipping_cost)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Shipping:</span>
                    <span>{formatPrice(order.shipping_cost)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold border-t pt-2">
                    <span>Total:</span>
                    <span>{formatPrice(order.amount_total)}</span>
                  </div>
                </div>
              </div>

              {/* Support Info */}
              <div className="mt-8 p-6 bg-blue-50 rounded-2xl border border-blue-200">
                <h4 className="font-semibold text-blue-900 mb-2">Need Help?</h4>
                <p className="text-blue-800 text-sm">
                  If you have questions about your order, please contact our support team with your order number.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Help Section */}
        <div className="mt-12 text-center">
          <div className="bg-white rounded-3xl shadow-lg border border-slate-100 p-8">
            <h3 className="text-xl font-bold text-slate-800 mb-4">Looking for Your Order Number?</h3>
            <p className="text-slate-600 mb-6">
              Your order number was sent to your email address immediately after purchase. 
              Check your inbox (and spam folder) for a confirmation email from VersatilePrint.
            </p>
            <Link 
              href="/shop"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

'use client';

import { useState } from 'react';
import { Header } from '@/components/Header';
import { PremiumCard } from '@/components/ui/premium-card';
import { PremiumButton } from '@/components/ui/premium-button';
import Link from 'next/link';

interface Order {
  id: string;
  email: string;
  amount_total: number;
  payment_status: string;
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
  createdAt: any;
  trackingNumber?: string;
}

interface TrackingInfo {
  status: string;
  delivery_date?: string;
  events: Array<{
    description: string;
    date: string;
    location: string;
  }>;
}

export default function MyOrdersPage() {
  const [email, setEmail] = useState('');
  const [orderId, setOrderId] = useState('');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [trackingInfo, setTrackingInfo] = useState<TrackingInfo | null>(null);
  const [trackingLoading, setTrackingLoading] = useState(false);

  const formatPrice = (cents: number) => {
    return `$${(cents / 100).toFixed(2)} CAD`;
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'Unknown';
    let date: Date;
    if (timestamp.toDate) {
      date = timestamp.toDate();
    } else if (typeof timestamp === 'object' && typeof timestamp.seconds === 'number') {
      date = new Date(timestamp.seconds * 1000);
    } else {
      date = new Date(timestamp);
    }
    return date.toLocaleDateString('en-CA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const searchOrders = async () => {
    if (!email.trim() || !orderId.trim()) {
      alert('Please enter both email and order ID.');
      return;
    }
    setLoading(true);
    try {
      const response = await fetch('/api/customer/order-lookup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: email.trim().toLowerCase(),
          orderNumber: orderId.trim()
        })
      });

      const data = await response.json();
      if (response.ok && data.order) {
        setOrders([data.order]);
      } else {
        setOrders([]);
        alert(data.error || data.message || 'No orders found');
      }
    } catch (error) {
      console.error('Search error:', error);
      alert('Failed to search orders');
    } finally {
      setLoading(false);
    }
  };

  const trackPackage = async (trackingNumber: string) => {
    setTrackingLoading(true);
    setTrackingInfo(null);
    
    try {
      const response = await fetch('/api/tracking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ trackingNumber })
      });

      const data = await response.json();
      if (data.success) {
        setTrackingInfo(data.tracking);
      } else {
        alert(data.message || 'Unable to track package');
      }
    } catch (error) {
      console.error('Tracking error:', error);
      alert('Failed to track package');
    } finally {
      setTrackingLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <p className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-amber-200/70 text-amber-900 mb-3">
            Anagioprim Healthy Coffee
          </p>
          <h1 className="text-3xl font-bold text-slate-900">Track Your Orders</h1>
          <p className="text-slate-600 mt-2">
            Enter your email address and order ID to view your coffee order and tracking information.
          </p>
        </div>

        {/* Search Section */}
        <PremiumCard className="p-6 mb-8">
          <h2 className="text-xl font-bold text-slate-900 mb-4">Find Your Order</h2>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3 items-start">
            <div className="md:col-span-2">
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && searchOrders()}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              />
            </div>
            <div className="md:col-span-2">
              <input
                type="text"
                placeholder="Order ID (e.g., cs_test_...)"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && searchOrders()}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              />
            </div>
            <div className="md:col-span-1">
              <PremiumButton 
                onClick={searchOrders}
                disabled={loading || !email.trim() || !orderId.trim()}
                loading={loading}
                variant="gradient"
                className="w-full"
              >
                Search
              </PremiumButton>
            </div>
          </div>
        </PremiumCard>

        {/* Orders List */}
        {orders.length > 0 && (
          <div className="space-y-6 mb-8">
            <h2 className="text-2xl font-bold text-slate-900">Your Orders</h2>
            {orders.map((order) => (
              <PremiumCard key={order.id} className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">
                      Order #{order.id.slice(-8).toUpperCase()}
                    </h3>
                    <p className="text-slate-600">{formatDate(order.createdAt)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-slate-900">
                      {formatPrice(order.amount_total)}
                    </p>
                    <span className={`inline-flex px-2 py-1 rounded-full text-xs font-semibold ${
                      order.payment_status === 'paid' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {order.payment_status === 'paid' ? 'Paid' : 'Pending'}
                    </span>
                  </div>
                </div>

                {/* Items */}
                <div className="mb-4">
                  <h4 className="font-semibold text-slate-900 mb-2">Items:</h4>
                  {order.items.map((item, index) => (
                    <div key={index} className="flex justify-between py-1">
                      <span className="text-slate-900">{item.name} × {item.quantity}</span>
                      <span className="text-slate-900 font-semibold">{formatPrice(item.amount_total)}</span>
                    </div>
                  ))}
                </div>

                {/* Shipping */}
                <div className="mb-4">
                  <h4 className="font-semibold text-slate-900 mb-2">Shipping to:</h4>
                  <div className="text-sm text-slate-600">
                    <p>{order.shipping.name}</p>
                    <p>{order.shipping.address.line1}</p>
                    {order.shipping.address.line2 && <p>{order.shipping.address.line2}</p>}
                    <p>
                      {order.shipping.address.city}, {order.shipping.address.state} {order.shipping.address.postal_code}
                    </p>
                    <p>{order.shipping.address.country}</p>
                  </div>
                </div>

                {/* Tracking */}
                {order.trackingNumber && (
                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-semibold text-slate-900">Tracking Number:</h4>
                        <p className="text-slate-600 font-mono">{order.trackingNumber}</p>
                      </div>
                      <PremiumButton
                        variant="outline"
                        size="sm"
                        onClick={() => trackPackage(order.trackingNumber!)}
                        loading={trackingLoading}
                      >
                        Track Package
                      </PremiumButton>
                    </div>
                  </div>
                )}
              </PremiumCard>
            ))}
          </div>
        )}

        {/* Tracking Information */}
        {trackingInfo && (
          <PremiumCard className="p-6">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Package Tracking</h2>
            <div className="mb-4">
              <span className={`inline-flex px-3 py-1 rounded-full text-sm font-semibold ${
                trackingInfo.status === 'delivered' ? 'bg-green-100 text-green-800' :
                trackingInfo.status === 'in_transit' ? 'bg-blue-100 text-blue-800' :
                'bg-yellow-100 text-yellow-800'
              }`}>
                {trackingInfo.status.replace('_', ' ').toUpperCase()}
              </span>
              {trackingInfo.delivery_date && (
                <p className="text-slate-600 mt-2">
                  Delivered: {new Date(trackingInfo.delivery_date).toLocaleDateString()}
                </p>
              )}
            </div>
            
            <div>
              <h3 className="font-semibold text-slate-900 mb-3">Tracking History:</h3>
              <div className="space-y-3">
                {trackingInfo.events.map((event, index) => (
                  <div key={index} className="flex justify-between items-start border-l-2 border-slate-200 pl-4">
                    <div>
                      <p className="font-medium text-slate-900">{event.description}</p>
                      <p className="text-sm text-slate-500">{event.location}</p>
                    </div>
                    <p className="text-sm text-slate-600">
                      {new Date(event.date).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </PremiumCard>
        )}

        {/* Help Section */}
        <PremiumCard className="p-6 mt-8">
          <h2 className="text-lg font-bold text-slate-900 mb-3">Need Help?</h2>
          <p className="text-slate-600 mb-4">
            If you can't find your order or have questions about your coffee delivery, we're here to help.
          </p>
          <Link href="/contact">
            <PremiumButton variant="outline">
              Contact Support
            </PremiumButton>
          </Link>
        </PremiumCard>
      </main>
    </div>
  );
}
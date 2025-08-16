'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
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
}

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(!!sessionId);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (sessionId) {
      fetchOrderDetails(sessionId);
    }
  }, [sessionId]);

  const fetchOrderDetails = async (sessionId: string) => {
    try {
      console.log('Fetching order details for session:', sessionId);
      const response = await fetch(`/api/order/${sessionId}`);
      console.log('Response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Order data received:', data);
        setOrderDetails(data);
      } else {
        const errorData = await response.text();
        console.error('API error:', response.status, errorData);
        setError(`Unable to fetch order details (${response.status})`);
      }
    } catch (error) {
      console.error('Error fetching order details:', error);
      setError('Unable to fetch order details - network error');
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your order details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/" className="text-2xl font-bold text-gray-900 hover:text-blue-600">
            VersatilePrint
          </Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-md p-8">
          {/* Success Icon */}
          <div className="text-center mb-8">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
              <svg
                className="h-8 w-8 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Thank you for your order!
            </h1>
            <p className="text-lg text-gray-600">
              We've received your payment and your order is being processed.
            </p>
          </div>

          {/* Order Details */}
          {orderDetails ? (
            <div className="space-y-6">
              <div className="border-t pt-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Order Details
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Order Information</h3>
                    <p className="text-sm text-gray-600">Order ID: {orderDetails.id}</p>
                    <p className="text-sm text-gray-600">Email: {orderDetails.email}</p>
                  </div>

                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Shipping Address</h3>
                    <div className="text-sm text-gray-600">
                      {orderDetails.shipping.name === 'N/A' || orderDetails.shipping.address.line1 === 'Shipping info not available' ? (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                          <p className="text-blue-800 font-medium">Shipping details being processed</p>
                          <p className="text-blue-700 text-xs mt-1">
                            Your shipping information will be included in your email confirmation
                          </p>
                        </div>
                      ) : (
                        <>
                          <p>{orderDetails.shipping.name}</p>
                          <p>{orderDetails.shipping.address.line1}</p>
                          {orderDetails.shipping.address.line2 && (
                            <p>{orderDetails.shipping.address.line2}</p>
                          )}
                          <p>
                            {orderDetails.shipping.address.city}, {orderDetails.shipping.address.state}{' '}
                            {orderDetails.shipping.address.postal_code}
                          </p>
                          <p>{orderDetails.shipping.address.country}</p>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t pt-6">
                <h3 className="font-medium text-gray-900 mb-4">Items Ordered</h3>
                <div className="space-y-3">
                  {orderDetails.items.map((item, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <div>
                        <p className="font-medium text-gray-900">{item.name}</p>
                        <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                      </div>
                      <p className="font-medium text-gray-900">
                        {formatPrice(item.amount_total)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t pt-6">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <p className="text-gray-600">Subtotal</p>
                    <p className="font-medium">
                      {formatPrice(orderDetails.amount_total - orderDetails.shipping_cost)}
                    </p>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-gray-600">Shipping</p>
                    <p className="font-medium">{formatPrice(orderDetails.shipping_cost)}</p>
                  </div>
                  <div className="flex justify-between text-lg font-bold border-t pt-2">
                    <p>Total</p>
                    <p>{formatPrice(orderDetails.amount_total)}</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="border-t pt-6">
              {error ? (
                <div className="text-center">
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                    <p className="text-yellow-800 font-medium">Order details temporarily unavailable</p>
                    <p className="text-sm text-yellow-700 mt-1">{error}</p>
                  </div>
                  <p className="text-lg text-gray-600">
                    Don't worry! Your payment was successful and we'll send you an email confirmation with your complete order details shortly.
                  </p>
                  {sessionId && (
                    <div className="mt-4 p-3 bg-gray-100 rounded-lg">
                      <p className="text-sm text-gray-600">
                        <strong>Order Reference:</strong> {sessionId.substring(0, 20)}...
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center">
                  <p className="text-lg text-gray-600">
                    Your payment was successful and we'll send you an email confirmation with your order details shortly.
                  </p>
                  {sessionId && (
                    <div className="mt-4 p-3 bg-gray-100 rounded-lg">
                      <p className="text-sm text-gray-600">
                        <strong>Order Reference:</strong> {sessionId.substring(0, 20)}...
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Email Confirmation Note */}
          <div className="border-t pt-6 mt-8">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex">
                <svg
                  className="h-5 w-5 text-blue-400 mt-0.5 mr-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                <div>
                  <h3 className="font-medium text-blue-900">Email Confirmation</h3>
                  <p className="text-sm text-blue-700 mt-1">
                    We've sent a confirmation email with your order details and tracking information.
                    If you don't see it in your inbox, please check your spam folder.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="text-center mt-8 space-x-4">
            <Link
              href="/"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
            >
              Continue Shopping
            </Link>
            <Link
              href="/my-orders"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-slate-600 hover:bg-slate-700 transition-colors"
            >
              Track This Order
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}

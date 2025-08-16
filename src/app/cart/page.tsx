'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/lib/cart-context';
import { Header } from '@/components/Header';
import { ProductImage } from '@/components/ui/product-image';
import { PremiumButton } from '@/components/ui/premium-button';
import { PremiumCard } from '@/components/ui/premium-card';
import { cn } from '@/lib/utils';

export default function CartPage() {
  const { state, removeItem, updateQuantity, setShippingAddress, getShippingRates, selectShippingRate } = useCart();
  const { items, subtotal, tax, total, shippingAddress, shippingRates, selectedShippingRate, isLoadingRates } = state;
  
  const [showShippingForm, setShowShippingForm] = useState(false);
  const [shippingFormData, setShippingFormData] = useState({
    name: '',
    company: '',
    address1: '',
    address2: '',
    city: '',
    province: 'ON',
    postalCode: '',
    country: 'CA',
    phone: '',
  });

  const formatPrice = (price: number) => {
    return `$${(price / 100).toFixed(2)}`;
  };

  const handleShippingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setShippingAddress(shippingFormData);
    await getShippingRates(shippingFormData);
    setShowShippingForm(false);
  };

  const proceedToCheckout = async () => {
    if (!selectedShippingRate) {
      alert('Please select a shipping option');
      return;
    }

    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: items,
          shippingAddress: shippingAddress,
          shippingRate: selectedShippingRate,
        }),
      });

      const { url } = await response.json();
      if (url) {
        window.location.href = url;
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Checkout failed. Please try again.');
    }
  };

  const provinces = [
    { code: 'AB', name: 'Alberta' },
    { code: 'BC', name: 'British Columbia' },
    { code: 'MB', name: 'Manitoba' },
    { code: 'NB', name: 'New Brunswick' },
    { code: 'NL', name: 'Newfoundland and Labrador' },
    { code: 'NS', name: 'Nova Scotia' },
    { code: 'NT', name: 'Northwest Territories' },
    { code: 'NU', name: 'Nunavut' },
    { code: 'ON', name: 'Ontario' },
    { code: 'PE', name: 'Prince Edward Island' },
    { code: 'QC', name: 'Quebec' },
    { code: 'SK', name: 'Saskatchewan' },
    { code: 'YT', name: 'Yukon' },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <Link href="/shop" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
            ← Continue Shopping
          </Link>
          <h1 className="text-3xl font-bold text-slate-900 mt-4">Shopping Cart</h1>
        </div>

        {items.length === 0 ? (
          <PremiumCard className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 opacity-40">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-full h-full">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Your cart is empty</h2>
            <p className="text-slate-600 mb-8">Looks like you haven't added any items to your cart yet.</p>
            <Link href="/shop">
              <PremiumButton variant="gradient" size="lg">
                Start Shopping
              </PremiumButton>
            </Link>
          </PremiumCard>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-6">
              {items.map((item) => (
                <PremiumCard key={item.id} className="p-6">
                  <div className="flex gap-6">
                    <div className="w-24 h-24 flex-shrink-0">
                      <ProductImage
                        src={item.image}
                        alt={item.name}
                        width={96}
                        height={96}
                        className="rounded-lg"
                      />
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-slate-900">{item.name}</h3>
                      <p className="text-slate-600 text-sm mt-1">{item.description}</p>
                      
                      {/* Options */}
                      {Object.keys(item.options).length > 0 && (
                        <div className="mt-3 space-y-1">
                          {Object.entries(item.options).map(([key, value]) => (
                            <p key={key} className="text-sm text-slate-500">
                              <span className="capitalize">{key}:</span> {value}
                            </p>
                          ))}
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between mt-4">
                        {/* Quantity Controls */}
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-10 h-10 rounded-full bg-slate-100 border border-slate-300 flex items-center justify-center hover:bg-slate-200 transition-colors"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                            </svg>
                          </button>
                          <span className="w-12 text-center font-semibold text-lg">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-10 h-10 rounded-full bg-slate-100 border border-slate-300 flex items-center justify-center hover:bg-slate-200 transition-colors"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                          </button>
                        </div>
                        
                        {/* Price and Remove */}
                        <div className="text-right">
                          <p className="text-lg font-bold text-slate-900">
                            {formatPrice(item.price * item.quantity)}
                          </p>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-sm text-red-600 hover:text-red-700 transition-colors"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </PremiumCard>
              ))}
            </div>

            {/* Order Summary */}
            <div className="space-y-6">
              <PremiumCard className="p-6">
                <h2 className="text-xl font-bold text-slate-900 mb-6">Order Summary</h2>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Subtotal ({items.reduce((sum, item) => sum + item.quantity, 0)} items)</span>
                    <span className="font-semibold">{formatPrice(subtotal)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-slate-600">Tax</span>
                    <span className="font-semibold">{formatPrice(tax)}</span>
                  </div>
                  
                  {selectedShippingRate && (
                    <div className="flex justify-between">
                      <span className="text-slate-600">Shipping ({selectedShippingRate.name})</span>
                      <span className="font-semibold">{formatPrice(selectedShippingRate.price)}</span>
                    </div>
                  )}
                  
                  <div className="border-t border-slate-200 pt-3">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span>{formatPrice(total)}</span>
                    </div>
                  </div>
                </div>
              </PremiumCard>

              {/* Shipping */}
              <PremiumCard className="p-6">
                <h3 className="text-lg font-bold text-slate-900 mb-4">Shipping</h3>
                
                {!shippingAddress ? (
                  <div>
                    <p className="text-slate-600 text-sm mb-4">
                      Enter your shipping address to see available shipping options
                    </p>
                    <PremiumButton
                      variant="outline"
                      fullWidth
                      onClick={() => setShowShippingForm(true)}
                    >
                      Add Shipping Address
                    </PremiumButton>
                  </div>
                ) : (
                  <div>
                    <div className="bg-slate-50 p-4 rounded-lg mb-4">
                      <p className="font-semibold">{shippingAddress.name}</p>
                      <p className="text-sm text-slate-600">
                        {shippingAddress.address1}
                        {shippingAddress.address2 && `, ${shippingAddress.address2}`}
                      </p>
                      <p className="text-sm text-slate-600">
                        {shippingAddress.city}, {shippingAddress.province} {shippingAddress.postalCode}
                      </p>
                    </div>
                    
                    <PremiumButton
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowShippingForm(true)}
                      className="mb-4"
                    >
                      Change Address
                    </PremiumButton>
                    
                    {/* Shipping Options */}
                    {shippingRates.length > 0 && (
                      <div className="space-y-3">
                        <h4 className="font-semibold">Shipping Options</h4>
                        {shippingRates.map((rate) => (
                          <label key={rate.id} className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-slate-50">
                            <input
                              type="radio"
                              name="shipping"
                              value={rate.id}
                              checked={selectedShippingRate?.id === rate.id}
                              onChange={() => selectShippingRate(rate)}
                              className="text-blue-600"
                            />
                            <div className="flex-1">
                              <div className="flex justify-between items-start">
                                <div>
                                  <p className="font-medium">{rate.name}</p>
                                  <p className="text-sm text-slate-600">{rate.description}</p>
                                  <p className="text-xs text-slate-500">{rate.carrier}</p>
                                </div>
                                <span className="font-semibold">{formatPrice(rate.price)}</span>
                              </div>
                            </div>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </PremiumCard>

              {/* Checkout Button */}
              <PremiumButton
                variant="gradient"
                size="lg"
                fullWidth
                disabled={!selectedShippingRate}
                onClick={proceedToCheckout}
              >
                Proceed to Checkout
              </PremiumButton>
            </div>
          </div>
        )}

        {/* Shipping Form Modal */}
        {showShippingForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl max-w-lg w-full max-h-[80vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold">Shipping Address</h3>
                  <button
                    onClick={() => setShowShippingForm(false)}
                    className="p-2 hover:bg-slate-100 rounded-lg"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <form onSubmit={handleShippingSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={shippingFormData.name}
                      onChange={(e) => setShippingFormData(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Company (Optional)</label>
                    <input
                      type="text"
                      value={shippingFormData.company}
                      onChange={(e) => setShippingFormData(prev => ({ ...prev, company: e.target.value }))}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Address Line 1 *</label>
                    <input
                      type="text"
                      required
                      value={shippingFormData.address1}
                      onChange={(e) => setShippingFormData(prev => ({ ...prev, address1: e.target.value }))}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Address Line 2 (Optional)</label>
                    <input
                      type="text"
                      value={shippingFormData.address2}
                      onChange={(e) => setShippingFormData(prev => ({ ...prev, address2: e.target.value }))}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">City *</label>
                      <input
                        type="text"
                        required
                        value={shippingFormData.city}
                        onChange={(e) => setShippingFormData(prev => ({ ...prev, city: e.target.value }))}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Province *</label>
                      <select
                        required
                        value={shippingFormData.province}
                        onChange={(e) => setShippingFormData(prev => ({ ...prev, province: e.target.value }))}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        {provinces.map(province => (
                          <option key={province.code} value={province.code}>
                            {province.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Postal Code *</label>
                    <input
                      type="text"
                      required
                      value={shippingFormData.postalCode}
                      onChange={(e) => setShippingFormData(prev => ({ ...prev, postalCode: e.target.value }))}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="A1A 1A1"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Phone (Optional)</label>
                    <input
                      type="tel"
                      value={shippingFormData.phone}
                      onChange={(e) => setShippingFormData(prev => ({ ...prev, phone: e.target.value }))}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <PremiumButton
                      type="button"
                      variant="outline"
                      onClick={() => setShowShippingForm(false)}
                      className="flex-1"
                    >
                      Cancel
                    </PremiumButton>
                    <PremiumButton
                      type="submit"
                      variant="gradient"
                      loading={isLoadingRates}
                      className="flex-1"
                    >
                      {isLoadingRates ? 'Getting Rates...' : 'Get Shipping Rates'}
                    </PremiumButton>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

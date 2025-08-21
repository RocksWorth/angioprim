'use client';

import { Fragment } from 'react';
import Link from 'next/link';
import { useCart } from '@/lib/cart-context';
import { ProductImage } from '@/components/ui/product-image';
import { PremiumButton } from '@/components/ui/premium-button';
import { cn } from '@/lib/utils';

export function CartDrawer() {
  const { state, removeItem, updateQuantity, setCartOpen } = useCart();
  const { isOpen, items, subtotal } = state;

  if (!isOpen) return null;

  const formatPrice = (price: number) => {
    return `$${(price / 100).toFixed(2)}`;
  };

  const prettifyKey = (key: string) => {
    const map: Record<string, string> = {
      coffeeType: 'Coffee',
      size: 'Size',
      blend: 'Blend',
      bags: 'Bags',
      pack: 'Pack',
      sides: 'Sides',
      paperType: 'Paper',
    };
    return map[key] || key.charAt(0).toUpperCase() + key.slice(1);
  };

  const prettifyValue = (key: string, value: any) => {
    const v = String(value);
    if (key === 'coffeeType') {
      const id = v.toLowerCase();
      if (id.includes('omega3')) return 'Omega3 Coffee';
      if (id.includes('chelation')) return 'Chelation Coffee';
      return v;
    }
    if (key === 'blend') {
      return v.charAt(0).toUpperCase() + v.slice(1);
    }
    if (key === 'bags') {
      const n = parseInt(v, 10);
      if (!isNaN(n)) return `${n} ${n === 1 ? 'Bag' : 'Bags'}`;
      return v;
    }
    if (key === 'sides') {
      return v === 'double' ? 'Double' : 'Single';
    }
    return v;
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className={cn(
          "fixed inset-0 bg-black z-40 transition-all duration-300 ease-out",
          isOpen ? "bg-opacity-50" : "bg-opacity-0 pointer-events-none"
        )}
        onClick={() => setCartOpen(false)}
      />
      
      {/* Drawer */}
      <div className={cn(
        "fixed top-0 right-0 h-full w-full max-w-lg bg-white shadow-2xl z-50",
        "transform transition-all duration-300 ease-out",
        "border-l border-slate-200",
        isOpen ? "translate-x-0" : "translate-x-full"
      )}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-200">
            <h2 className="text-xl font-bold text-slate-900">Shopping Cart</h2>
            <button
              onClick={() => setCartOpen(false)}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-6">
            {items.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 opacity-40">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-full h-full">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
                <p className="text-slate-500 text-lg">Your cart is empty</p>
                <p className="text-slate-400 text-sm mt-2">Add some products to get started</p>
              </div>
            ) : (
              <div className="space-y-6">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4 p-4 bg-slate-50 rounded-xl">
                    <div className="w-20 h-20 flex-shrink-0">
                      <ProductImage
                        src={item.image}
                        alt={item.name}
                        width={80}
                        height={80}
                        className="rounded-lg"
                      />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-slate-900 truncate">{item.name}</h3>
                      <p className="text-sm text-slate-600 mt-1">
                        {item.description}
                      </p>
                      
                      {/* Options */}
                      {Object.keys(item.options).length > 0 && (
                        <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1">
                          {Object.entries(item.options).map(([key, value]) => (
                            <div key={key} className="text-xs text-slate-500">
                              <span className="font-medium text-slate-700">{prettifyKey(key)}:</span>{' '}
                              <span>{prettifyValue(key, value)}</span>
                            </div>
                          ))}
                        </div>
                      )}
                      
                      {/* Quantity Controls */}
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-9 h-9 rounded-full bg-white border-2 border-slate-300 flex items-center justify-center hover:bg-slate-50 hover:border-slate-400 active:scale-95 transition-all duration-150 shadow-sm"
                            disabled={item.quantity <= 1}
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M20 12H4" />
                            </svg>
                          </button>
                          <span className="w-10 text-center font-semibold text-lg">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-9 h-9 rounded-full bg-white border-2 border-slate-300 flex items-center justify-center hover:bg-slate-50 hover:border-slate-400 active:scale-95 transition-all duration-150 shadow-sm"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                          </button>
                        </div>
                        
                        <div className="text-right">
                          <p className="font-semibold text-slate-900">
                            {formatPrice(item.price * item.quantity)}
                          </p>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-xs text-red-500 hover:text-red-700 transition-colors underline-offset-2 hover:underline"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="border-t border-slate-200 p-6 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold text-slate-900">Subtotal:</span>
                <span className="text-lg font-bold text-slate-900">{formatPrice(subtotal)}</span>
              </div>
              
              <p className="text-sm text-slate-500">
                Shipping and taxes calculated at checkout
              </p>
              
              <div className="grid grid-cols-2 gap-3">
                <PremiumButton
                  variant="outline"
                  onClick={() => setCartOpen(false)}
                  className="w-full"
                >
                  Continue Shopping
                </PremiumButton>
                
                <Link href="/cart" onClick={() => setCartOpen(false)}>
                  <PremiumButton variant="gradient" className="w-full">
                    View Cart
                  </PremiumButton>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

'use client';

import { useCart } from '@/lib/cart-context';
import { cn } from '@/lib/utils';

export function CartIcon() {
  const { state, toggleCart } = useCart();
  const itemCount = state.items.reduce((total, item) => total + item.quantity, 0);

  return (
    <button
      onClick={toggleCart}
      className={cn(
        "relative p-2 rounded-lg transition-colors duration-200",
        "hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      )}
      aria-label={`Shopping cart with ${itemCount} items`}
    >
      <svg 
        className="w-6 h-6 text-slate-700" 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" 
        />
      </svg>
      
      {itemCount > 0 && (
        <span className={cn(
          "absolute -top-1 -right-1 h-5 w-5 rounded-full",
          "bg-gradient-to-r from-blue-600 to-purple-600",
          "text-white text-xs font-bold",
          "flex items-center justify-center",
          "ring-2 ring-white",
          "animate-pulse"
        )}>
          {itemCount > 99 ? '99+' : itemCount}
        </span>
      )}
    </button>
  );
}

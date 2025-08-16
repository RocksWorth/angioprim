'use client';

import { useState } from 'react';
import { useCart } from '@/lib/cart-context';
import { PremiumButton } from '@/components/ui/premium-button';
import { cn } from '@/lib/utils';

interface AddToCartButtonProps {
  productId: string;
  name: string;
  description: string;
  price: number; // Price in cents
  image: string;
  options: Record<string, any>;
  quantity?: number;
  className?: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'gradient' | 'luxury';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  fullWidth?: boolean;
  disabled?: boolean;
}

export function AddToCartButton({
  productId,
  name,
  description,
  price,
  image,
  options,
  quantity = 1,
  className,
  variant = 'gradient',
  size = 'md',
  fullWidth = false,
  disabled = false,
}: AddToCartButtonProps) {
  const { addItem, toggleCart } = useCart();
  const [isAdding, setIsAdding] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleAddToCart = async () => {
    if (disabled || isAdding || showSuccess) return;

    setIsAdding(true);
    
    try {
      // Small delay to show loading state
      await new Promise(resolve => setTimeout(resolve, 200));
      
      // Add item to cart
      addItem({
        productId,
        name,
        description,
        price,
        quantity,
        options,
        image,
      });

      setIsAdding(false);
      setShowSuccess(true);
      
      // Auto-open cart drawer after success animation
      setTimeout(() => {
        toggleCart();
      }, 800);

      // Reset success state
      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
      
    } catch (error) {
      console.error('Error adding item to cart:', error);
      setIsAdding(false);
    }
  };

  if (showSuccess) {
    return (
      <PremiumButton
        variant="primary"
        size={size}
        fullWidth={fullWidth}
        disabled
        className={cn(
          "bg-green-600 hover:bg-green-600 transform transition-all duration-300 animate-pulse",
          "border-2 border-green-400 shadow-lg shadow-green-500/25",
          className
        )}
        icon={
          <svg className="w-5 h-5 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        }
        iconPosition="left"
      >
        Added to Cart!
      </PremiumButton>
    );
  }

  return (
    <PremiumButton
      variant={variant}
      size={size}
      fullWidth={fullWidth}
      disabled={disabled || isAdding || showSuccess}
      loading={isAdding}
      className={cn(
        "transform transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]",
        "disabled:transform-none disabled:hover:scale-100",
        isAdding && "cursor-not-allowed",
        className
      )}
      onClick={handleAddToCart}
      icon={
        isAdding ? (
          <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
          </svg>
        ) : (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
        )
      }
      iconPosition="left"
    >
      {isAdding ? 'Adding...' : 'Add to Cart'}
    </PremiumButton>
  );
}

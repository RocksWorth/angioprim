'use client';

import { cn } from '@/lib/utils';
import { forwardRef, ButtonHTMLAttributes, ReactNode } from 'react';

interface PremiumButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'gradient' | 'luxury';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
  loading?: boolean;
  glow?: boolean;
  fullWidth?: boolean;
  asChild?: boolean;
}

const buttonVariants = {
  primary: 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl',
  secondary: 'bg-slate-600 hover:bg-slate-700 text-white shadow-lg hover:shadow-xl',
  outline: 'border-2 border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-slate-400 shadow-lg',
  ghost: 'text-slate-700 hover:bg-slate-100',
  gradient: 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-xl hover:shadow-2xl',
  luxury: 'bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 hover:from-blue-900 hover:via-slate-900 hover:to-blue-900 text-white shadow-2xl border border-blue-800/50',
};

const buttonSizes = {
  sm: 'px-4 py-2 text-sm font-medium rounded-lg',
  md: 'px-6 py-3 text-base font-semibold rounded-xl',
  lg: 'px-8 py-4 text-lg font-semibold rounded-xl',
  xl: 'px-10 py-5 text-xl font-bold rounded-2xl',
};

export const PremiumButton = forwardRef<HTMLButtonElement, PremiumButtonProps>(
  ({
    children,
    className,
    variant = 'primary',
    size = 'md',
    icon,
    iconPosition = 'left',
    loading = false,
    glow = false,
    fullWidth = false,
    asChild = false,
    disabled,
    ...props
  }, ref) => {
    // For now, ignore asChild and always render as button
    // This can be enhanced later with proper Slot implementation
    
    return (
      <button
        ref={ref}
        className={cn(
          'relative inline-flex items-center justify-center gap-2 font-semibold transition-all duration-300 focus:ring-4 focus:ring-blue-500/20 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed',
          buttonVariants[variant],
          buttonSizes[size],
          glow && 'hover:shadow-blue-500/25',
          fullWidth && 'w-full',
          loading && 'cursor-not-allowed',
          className
        )}
        disabled={disabled || loading}
        {...props}
      >
        {glow && (
          <div className="absolute inset-0 -z-10 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-blue-600/20 blur-xl opacity-0 transition-opacity duration-300 group-hover:opacity-100 rounded-inherit" />
        )}
        
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          </div>
        )}
        
        <div className={cn('flex items-center gap-2', loading && 'opacity-0')}>
          {icon && iconPosition === 'left' && icon}
          {children}
          {icon && iconPosition === 'right' && icon}
        </div>
      </button>
    );
  }
);

PremiumButton.displayName = 'PremiumButton';

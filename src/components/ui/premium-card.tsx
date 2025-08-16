'use client';

import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface PremiumCardProps {
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'glass' | 'elevated' | 'gradient' | 'product';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  hover?: boolean;
  glow?: boolean;
}

const cardVariants = {
  default: 'bg-white border border-slate-200 shadow-lg',
  glass: 'bg-white/80 backdrop-blur-md border border-white/20 shadow-xl',
  elevated: 'bg-white shadow-2xl border-0',
  gradient: 'bg-gradient-to-br from-white via-blue-50/50 to-purple-50/50 border border-blue-100 shadow-xl',
  product: 'bg-white border border-slate-200 shadow-lg hover:shadow-2xl hover:border-blue-200',
};

const cardSizes = {
  sm: 'p-4 rounded-lg',
  md: 'p-6 rounded-xl',
  lg: 'p-8 rounded-2xl',
  xl: 'p-10 rounded-3xl',
};

export function PremiumCard({
  children,
  className,
  variant = 'default',
  size = 'md',
  hover = false,
  glow = false,
}: PremiumCardProps) {
  return (
    <div
      className={cn(
        'relative overflow-hidden transition-all duration-300',
        cardVariants[variant],
        cardSizes[size],
        hover && 'hover:scale-105 hover:shadow-2xl cursor-pointer',
        glow && 'hover:shadow-blue-500/25',
        className
      )}
    >
      {glow && (
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-blue-600/10 blur-xl opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      )}
      {children}
    </div>
  );
}

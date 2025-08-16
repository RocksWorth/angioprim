'use client';

import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  description?: string;
  badge?: string;
  children?: ReactNode;
  className?: string;
  align?: 'left' | 'center' | 'right';
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const alignmentClasses = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
};

const sizeClasses = {
  sm: {
    title: 'text-2xl md:text-3xl',
    subtitle: 'text-lg md:text-xl',
    description: 'text-base',
    badge: 'text-sm',
  },
  md: {
    title: 'text-3xl md:text-4xl lg:text-5xl',
    subtitle: 'text-xl md:text-2xl',
    description: 'text-lg md:text-xl',
    badge: 'text-sm',
  },
  lg: {
    title: 'text-4xl md:text-5xl lg:text-6xl',
    subtitle: 'text-2xl md:text-3xl',
    description: 'text-xl md:text-2xl',
    badge: 'text-base',
  },
  xl: {
    title: 'text-5xl md:text-6xl lg:text-7xl',
    subtitle: 'text-3xl md:text-4xl',
    description: 'text-2xl md:text-3xl',
    badge: 'text-lg',
  },
};

export function SectionHeader({
  title,
  subtitle,
  description,
  badge,
  children,
  className,
  align = 'center',
  size = 'md',
}: SectionHeaderProps) {
  const sizes = sizeClasses[size];
  
  return (
    <div className={cn('space-y-6', alignmentClasses[align], className)}>
      {badge && (
        <div className={cn(
          'inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 text-blue-800 rounded-full font-semibold backdrop-blur-sm',
          sizes.badge
        )}>
          ✨ {badge}
        </div>
      )}
      
      {subtitle && (
        <p className={cn(
          'font-light text-slate-600 tracking-wide',
          sizes.subtitle
        )}>
          {subtitle}
        </p>
      )}
      
      <h2 className={cn(
        'font-bold tracking-tight text-slate-900',
        sizes.title
      )}>
        {title}
      </h2>
      
      {description && (
        <p className={cn(
          'text-slate-600 font-light leading-relaxed max-w-4xl',
          align === 'center' && 'mx-auto',
          sizes.description
        )}>
          {description}
        </p>
      )}
      
      {children}
    </div>
  );
}

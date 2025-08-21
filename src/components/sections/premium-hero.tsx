'use client';

import { cn } from '@/lib/utils';
import { PremiumButton } from '@/components/ui/premium-button';
import { getBrandConfig } from '@/lib/design-system';
import Link from 'next/link';
import { ReactNode } from 'react';
import Image from 'next/image';

interface HeroAction {
  label: string;
  href: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'gradient' | 'luxury';
  icon?: ReactNode;
}

interface PremiumHeroProps {
  badge?: string;
  title: string;
  subtitle?: string;
  description: string;
  actions: HeroAction[];
  backgroundVariant?: 'gradient' | 'solid' | 'pattern' | 'minimal';
  floatingElements?: boolean;
  className?: string;
  image?: { src: string; alt?: string };
}

export function PremiumHero({
  badge,
  title,
  subtitle,
  description,
  actions,
  backgroundVariant = 'gradient',
  floatingElements = true,
  className,
  image,
}: PremiumHeroProps) {
  const brandConfig = getBrandConfig();

  const backgroundVariants = {
    gradient: `bg-gradient-to-br ${brandConfig.gradients.hero}`,
    solid: 'bg-slate-50',
    pattern: 'bg-slate-50 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-100 via-slate-50 to-purple-100',
    minimal: 'bg-white',
  };

  return (
    <section className={cn('relative overflow-hidden', className)}>
      {/* Background */}
      <div className={cn('absolute inset-0', backgroundVariants[backgroundVariant])} />
      
      {/* Floating Elements */}
      {floatingElements && (
        <>
          <div className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-br from-amber-200 to-orange-200 rounded-full opacity-60 animate-pulse" />
          <div className="absolute bottom-20 right-10 w-32 h-32 bg-gradient-to-br from-orange-200 to-amber-200 rounded-full opacity-40 animate-pulse delay-1000" />
          <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-gradient-to-br from-amber-300 to-orange-300 rounded-full opacity-30 animate-pulse delay-500" />
          <div className="absolute bottom-1/3 right-1/4 w-24 h-24 bg-gradient-to-br from-orange-300 to-amber-300 rounded-full opacity-20 animate-pulse delay-700" />
        </>
      )}
      
      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className={cn(image ? 'grid grid-cols-1 lg:grid-cols-2 items-center gap-12' : 'text-center')}>
          {badge && (
            <div className={cn(
              'inline-flex items-center px-6 py-3 bg-white/90 backdrop-blur-sm shadow-lg rounded-full text-sm font-semibold mb-8 hover:shadow-xl transition-shadow duration-300 border',
              image ? 'justify-self-start border-amber-100 text-amber-800' : 'border-amber-100 text-amber-800'
            )}>
              ✨ {badge}
            </div>
          )}
          
          <div className={cn('space-y-8', image && 'order-1 lg:order-none')}> 
            {subtitle && (
              <p className="text-xl md:text-2xl text-slate-600 font-light tracking-wide">
                {subtitle}
              </p>
            )}
            
            <h1 className={cn('text-5xl md:text-7xl font-light tracking-tight mb-8', image && 'text-left')}>
              <span className="font-extralight text-slate-700 block">{title}</span>
            </h1>
            
            <p className={cn('text-xl md:text-2xl text-slate-600 font-light max-w-4xl leading-relaxed', image ? 'mx-0 text-left' : 'mx-auto')}>
              {description}
            </p>
            
            <div className={cn('flex flex-col sm:flex-row gap-6 pt-8', image ? 'justify-start' : 'justify-center')}>
              {actions.map((action, index) => (
                <Link key={index} href={action.href}>
                  <PremiumButton
                    size="lg"
                    variant={action.variant || (index === 0 ? 'gradient' : 'outline')}
                    glow={index === 0}
                    className="transform hover:-translate-y-1 transition-all duration-300 flex items-center gap-2"
                  >
                    {action.icon}
                    {action.label}
                  </PremiumButton>
                </Link>
              ))}
            </div>
          </div>

          {image && (
            <div className="relative w-full aspect-[4/3] lg:aspect-square rounded-3xl overflow-hidden ring-1 ring-amber-100 shadow-2xl order-2 lg:order-none">
              <Image src={image.src} alt={image.alt || 'Coffee'} fill className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-tr from-amber-900/10 via-transparent to-white/0" />
            </div>
          )}
        </div>
      </div>
      
      {/* Bottom Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white/50 to-transparent" />
    </section>
  );
}

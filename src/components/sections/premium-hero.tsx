'use client';

import { cn } from '@/lib/utils';
import { PremiumButton } from '@/components/ui/premium-button';
import { getBrandConfig } from '@/lib/design-system';
import Link from 'next/link';
import { ReactNode } from 'react';

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
          <div className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-br from-blue-200 to-purple-200 rounded-full opacity-60 animate-pulse" />
          <div className="absolute bottom-20 right-10 w-32 h-32 bg-gradient-to-br from-purple-200 to-blue-200 rounded-full opacity-40 animate-pulse delay-1000" />
          <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-gradient-to-br from-blue-300 to-purple-300 rounded-full opacity-30 animate-pulse delay-500" />
          <div className="absolute bottom-1/3 right-1/4 w-24 h-24 bg-gradient-to-br from-purple-300 to-blue-300 rounded-full opacity-20 animate-pulse delay-700" />
        </>
      )}
      
      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className="text-center">
          {badge && (
            <div className="inline-flex items-center px-6 py-3 bg-white/90 backdrop-blur-sm shadow-lg border border-blue-100 text-blue-800 rounded-full text-sm font-semibold mb-8 hover:shadow-xl transition-shadow duration-300">
              ✨ {badge}
            </div>
          )}
          
          <div className="space-y-8">
            {subtitle && (
              <p className="text-xl md:text-2xl text-slate-600 font-light tracking-wide">
                {subtitle}
              </p>
            )}
            
            <h1 className="text-5xl md:text-7xl font-light tracking-tight mb-8">
              <span className="font-extralight text-slate-700 block">
                {title.split(' ').slice(0, -1).join(' ')}
              </span>
              <span className={cn(
                'font-bold bg-gradient-to-r bg-clip-text text-transparent',
                brandConfig.gradients.primary
              )}>
                {title.split(' ').slice(-1)[0]}
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-slate-600 font-light max-w-4xl mx-auto leading-relaxed">
              {description}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center pt-8">
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
        </div>
      </div>
      
      {/* Bottom Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white/50 to-transparent" />
    </section>
  );
}

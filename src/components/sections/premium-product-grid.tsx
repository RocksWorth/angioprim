'use client';

import { cn } from '@/lib/utils';
import { PremiumCard } from '@/components/ui/premium-card';
import { PremiumButton } from '@/components/ui/premium-button';
import { SectionHeader } from '@/components/ui/section-header';
import Link from 'next/link';
import { ReactNode } from 'react';
import { ProductImage } from '@/components/ui/product-image';

interface ProductItem {
  id: string;
  name: string;
  description: string;
  image: string;
  href: string;
  badge?: string;
  price?: string;
  features?: string[];
  popular?: boolean;
}

interface PremiumProductGridProps {
  title: string;
  subtitle?: string;
  description?: string;
  badge?: string;
  products: ProductItem[];
  columns?: 2 | 3 | 4;
  variant?: 'default' | 'minimal' | 'luxury' | 'glass';
  showPricing?: boolean;
  className?: string;
}

export function PremiumProductGrid({
  title,
  subtitle,
  description,
  badge,
  products,
  columns = 3,
  variant = 'default',
  showPricing = false,
  className,
}: PremiumProductGridProps) {
  const gridColumns = {
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  };

  const cardVariants = {
    default: 'default',
    minimal: 'default',
    luxury: 'gradient',
    glass: 'glass',
  } as const;

  return (
    <section className={cn('py-20 lg:py-32 bg-white', className)}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          title={title}
          subtitle={subtitle}
          description={description}
          badge={badge}
          className="mb-16"
        />
        
        <div className={cn(
          'grid gap-8',
          gridColumns[columns]
        )}>
          {products.map((product, index) => (
            <PremiumCard
              key={product.id}
              variant={cardVariants[variant]}
              hover
              glow={product.popular}
              className={cn(
                'group relative overflow-hidden',
                product.popular && 'ring-2 ring-blue-500/50'
              )}
            >
              {/* Popular Badge */}
              {product.popular && (
                <div className="absolute top-4 right-4 z-10 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  Popular
                </div>
              )}
              
              {/* Custom Badge */}
              {product.badge && (
                <div className="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur-sm text-slate-700 px-3 py-1 rounded-full text-sm font-semibold border border-slate-200">
                  {product.badge}
                </div>
              )}

              {/* Product Image */}
              <div className="relative aspect-[4/3] mb-6 overflow-hidden rounded-xl bg-slate-100">
                <ProductImage
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>

              {/* Product Content */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-slate-600 leading-relaxed">
                    {product.description}
                  </p>
                </div>

                {/* Features */}
                {product.features && product.features.length > 0 && (
                  <div className="space-y-2">
                    {product.features.slice(0, 3).map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center text-sm text-slate-600">
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-3" />
                        {feature}
                      </div>
                    ))}
                  </div>
                )}

                {/* Pricing */}
                {showPricing && product.price && (
                  <div className="pt-2 border-t border-slate-100">
                    <p className="text-2xl font-bold text-slate-900">
                      {product.price}
                      <span className="text-sm font-normal text-slate-500 ml-1">
                        starting at
                      </span>
                    </p>
                  </div>
                )}

                {/* Action Button */}
                <div className="pt-4">
                  <Link href={product.href} className="block">
                    <PremiumButton
                      variant={product.popular ? 'gradient' : 'outline'}
                      size="md"
                      fullWidth
                      className="group-hover:shadow-lg transition-shadow"
                    >
                      {showPricing ? 'View Options' : 'Learn More'}
                    </PremiumButton>
                  </Link>
                </div>
              </div>
            </PremiumCard>
          ))}
        </div>
      </div>
    </section>
  );
}

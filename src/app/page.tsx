import { Header } from "../components/Header";
import { PremiumHero } from "@/components/sections/premium-hero";
import { PremiumProductGrid } from "@/components/sections/premium-product-grid";
import { SectionHeader } from "@/components/ui/section-header";
import { PremiumCard } from "@/components/ui/premium-card";
import { PremiumButton } from "@/components/ui/premium-button";
import { getBrandConfig } from "@/lib/design-system";
import Link from "next/link";

export default function HomePage() {
  const brandConfig = getBrandConfig();
  
  // Featured products data
  const featuredProducts = [
    {
      id: 'business-cards',
      name: 'Business Cards',
      description: 'Professional business cards that make lasting impressions. Premium materials and finishes available.',
      image: '/products/business-cards/featured.jpg',
      href: '/shop/business-cards',
      badge: 'Most Popular',
      popular: true,
      features: ['Premium Paper Stock', 'Multiple Finishes', 'Fast Turnaround'],
      price: 'From $24.99',
    },
    {
      id: 'flyers',
      name: 'Marketing Flyers',
      description: 'Eye-catching flyers for events, promotions, and marketing campaigns. High-quality printing guaranteed.',
      image: '/products/flyers/featured.jpg',
      href: '/shop/flyers',
      features: ['Vibrant Colors', 'Various Sizes', 'Bulk Discounts'],
      price: 'From $19.99',
    },
    {
      id: 'postcards',
      name: 'Custom Postcards',
      description: 'Beautiful postcards for marketing, announcements, or personal use. Professional design and printing.',
      image: '/products/postcards/featured.jpg',
      href: '/shop/postcards',
      features: ['High-Quality Images', 'Custom Sizes', 'Matte & Gloss Options'],
      price: 'From $14.99',
    },
    {
      id: 'stickers',
      name: 'Custom Stickers',
      description: 'Durable, weather-resistant stickers for branding, labeling, or promotional use.',
      image: '/products/stickers/featured.jpg',
      href: '/shop/stickers',
      features: ['Waterproof', 'Die-Cut Options', 'Various Materials'],
      price: 'From $9.99',
    },
  ];

  // Features data
  const features = [
    {
      icon: "⚡",
      title: "Lightning Fast",
      description: "Express production with most orders shipping within 24-48 hours of approval.",
      gradient: "from-yellow-400 to-orange-500"
    },
    {
      icon: "🎨",
      title: "Premium Quality",
      description: "Museum-grade materials and state-of-the-art printing technology for exceptional results.",
      gradient: "from-purple-400 to-pink-500"
    },
    {
      icon: "🚚",
      title: "White-Glove Service",
      description: "Complimentary shipping on orders over $50 with premium packaging and tracking.",
      gradient: "from-blue-400 to-cyan-500"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <PremiumHero
        badge={brandConfig.tagline}
        title="Elegant Print Solutions"
        description={brandConfig.description}
        actions={[
          {
            label: 'Explore Collection',
            href: '/shop',
            variant: 'gradient',
          },
          {
            label: 'Business Cards',
            href: '/shop/business-cards',
            variant: 'outline',
          },
        ]}
        backgroundVariant="gradient"
        floatingElements
      />

      {/* Featured Products */}
      <PremiumProductGrid
        badge="Premium Collection"
        title="Our Signature Products"
        subtitle="Meticulously Crafted"
        description="Professional printing solutions that elevate your brand presence with exceptional quality and attention to detail."
        products={featuredProducts}
        columns={4}
        variant="luxury"
        showPricing={true}
        className="bg-slate-50"
      />

      {/* Features Section */}
      <section className="py-20 lg:py-32 bg-gradient-to-br from-white via-blue-50/30 to-purple-50/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            badge="Why Choose Us"
            title="The VersatilePrint Difference"
            subtitle="Excellence in Every Detail"
            description="Where luxury meets efficiency in professional printing services."
            className="mb-16"
          />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <PremiumCard
                key={index}
                variant="glass"
                hover
                glow
                className="text-center group"
              >
                <div className={`inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r ${feature.gradient} rounded-3xl text-4xl mb-8 shadow-xl group-hover:shadow-2xl transform group-hover:-translate-y-2 transition-all duration-300`}>
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold text-slate-800 mb-4">{feature.title}</h3>
                <p className="text-slate-600 font-light leading-relaxed text-lg">{feature.description}</p>
              </PremiumCard>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900"></div>
        <div className="absolute inset-0 bg-black/20"></div>
        
        {/* Decorative Elements */}
        <div className="absolute top-10 left-20 w-32 h-32 bg-gradient-to-br from-blue-400/30 to-purple-400/30 rounded-full blur-xl"></div>
        <div className="absolute bottom-10 right-20 w-40 h-40 bg-gradient-to-br from-purple-400/30 to-blue-400/30 rounded-full blur-xl"></div>
        
        <div className="relative max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title="Ready to Elevate Your Brand?"
            subtitle="Transform Your Vision"
            description="Join thousands of satisfied customers who trust VersatilePrint for their premium printing needs."
            align="center"
            className="text-white [&_h2]:text-white [&_p]:text-blue-100 [&_.font-light]:text-blue-100 mb-12"
          />
          
          <Link href="/shop">
            <PremiumButton 
              size="xl" 
              variant="luxury"
              glow
              className="transform hover:scale-105 transition-all duration-300"
            >
              Start Your Luxury Print Journey
            </PremiumButton>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
              {brandConfig.name}
            </h3>
            <p className="text-slate-600 font-light text-lg">
              Where luxury printing meets exceptional service
            </p>
            <div className="mt-8 flex justify-center items-center space-x-8 text-slate-400">
              <span>•</span>
              <span className="text-slate-600">Premium Quality</span>
              <span>•</span>
              <span className="text-slate-600">Fast Delivery</span>
              <span>•</span>
              <span className="text-slate-600">Trusted Service</span>
              <span>•</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
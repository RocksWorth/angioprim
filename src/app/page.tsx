import { Header } from "../components/Header";
import { PremiumHero } from "@/components/sections/premium-hero";
import { PremiumProductGrid } from "@/components/sections/premium-product-grid";
import { SectionHeader } from "@/components/ui/section-header";
import { PremiumCard } from "@/components/ui/premium-card";
import { PremiumButton } from "@/components/ui/premium-button";
import Link from "next/link";

export default function HomePage() {
  const brandConfig = { name: 'Anagioprim Healthy Coffee', tagline: 'Smart Coffee for Heart & Brain', description: 'Premium coffee infused with vegan omega‑3s and chelation support.' } as const;
  
  // Featured products data
  const featuredProducts = [
    {
      id: 'omega3',
      name: 'Omega3 Coffee',
      description: 'Plant‑based omega‑3s meet high‑quality, single‑origin coffee. Clean label, non‑GMO, no synthetic additives.',
      image: '/products/coffee/omega3.svg',
      href: '/shop/coffee',
      badge: 'Best Seller',
      popular: true,
      features: ['Vegan Omega‑3', 'Heart & Brain Support', 'No Fishy Taste'],
      price: 'From $39.99',
    },
    {
      id: 'chelation',
      name: 'Chelation Coffee',
      description: 'Chelation‑supporting blend crafted for daily wellness. Single‑origin, ethically sourced, medium roast.',
      image: '/products/coffee/chelation.svg',
      href: '/shop/coffee',
      badge: 'New',
      popular: false,
      features: ['Chelation Support', 'Clean Label', 'Non‑GMO'],
      price: 'From $44.99',
    },
  ];

  // Coffee-focused benefits
  const features = [
    {
      icon: "🧠",
      title: "Sustained Focus",
      description: "Natural caffeine + omega‑3s for smooth, crash‑free energy.",
      gradient: "from-amber-400 to-rose-500"
    },
    {
      icon: "❤️",
      title: "Heart & Brain Support",
      description: "Daily support for cardiovascular and cognitive health.",
      gradient: "from-rose-400 to-orange-500"
    },
    {
      icon: "🌱",
      title: "Clean, Vegan Omega‑3",
      description: "No fishy taste. Non‑GMO, clean label ingredients.",
      gradient: "from-green-400 to-amber-500"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <PremiumHero
        badge={brandConfig.tagline}
        title="Omega3 Coffee • Chelation Coffee"
        description="Premium coffee infused with ultra‑pure, plant‑based omega‑3s and chelation support. Designed to support focus, heart health, and inflammation response without compromising taste or performance."
        actions={[
          {
            label: 'Shop Coffee',
            href: '/shop/coffee',
            variant: 'gradient',
          },
          {
            label: 'View Cart',
            href: '/cart',
            variant: 'outline',
          },
        ]}
        backgroundVariant="minimal"
        floatingElements
        image={{ src: '/products/coffee/bag.svg', alt: 'AngioPrim Coffee Bag' }}
      />

      {/* Featured Coffee */}
      <PremiumProductGrid
        badge="Healthy Coffee"
        title="Our Coffee Blends"
        subtitle="Crafted for Daily Life"
        description="Two functional coffees: Omega3 for heart & brain support, and Chelation for daily wellness."
        products={featuredProducts.map(p => ({
          ...p,
          image: p.id === 'omega3' ? '/products/coffee/cup.svg' : '/products/coffee/beans.svg'
        }))}
        columns={2}
        variant="luxury"
        showPricing={true}
        className="bg-amber-50/40"
      />

      {/* Why Choose Us */}
      <section className="py-20 lg:py-32 bg-gradient-to-br from-white via-amber-50/40 to-rose-50/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            badge="Why Choose Us"
            title="Why Choose Anagioprim Healthy Coffee"
            subtitle="Clean, Functional Coffee"
            description="Backed by science. Crafted for daily life. Loved by high‑performers."
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
            title="Fuel Your Day With Smart Coffee"
            subtitle="Backed by science. Loved by high‑performers."
            description="No fishy taste. Just clean, vegan omega‑3 performance in every sip."
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
              Shop Anagioprim Healthy Coffee
            </PremiumButton>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-amber-700 to-rose-600 bg-clip-text text-transparent mb-4">
              Anagioprim Healthy Coffee
            </h3>
            <p className="text-slate-600 font-light text-lg">Clean label • Non‑GMO • Ethically sourced • Medium roast</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
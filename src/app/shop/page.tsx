import { Header } from '../../components/Header';
import { PremiumHero } from '@/components/sections/premium-hero';
import { PremiumProductGrid } from '@/components/sections/premium-product-grid';
import { PremiumCard } from '@/components/ui/premium-card';
import { SectionHeader } from '@/components/ui/section-header';

const PRODUCTS = [
  {
    id: 'coffee',
    name: 'Omega3 & Chelation Coffee',
    description: 'Premium coffee infused with vegan omega‑3s and chelation support. 300g bags.',
    image: '/products/coffee/featured.jpg',
    href: '/shop/coffee',
    price: 'From $29.99',
    badge: 'Healthy Choice',
    features: ['Vegan Omega‑3', 'Chelation Support', 'Non‑GMO', 'Medium Roast']
  }
];

// Available products
const availableProducts = PRODUCTS;

export default function ShopIndex() {

  // Coffee-focused benefits
  const features = [
    { icon: "🧠", title: "Sustained Focus", description: "Natural caffeine + omega‑3s for smooth, crash‑free energy.", gradient: "from-amber-400 to-rose-500" },
    { icon: "❤️", title: "Heart & Brain Support", description: "Daily support for cardiovascular and cognitive health.", gradient: "from-rose-400 to-orange-500" },
    { icon: "🌱", title: "Clean, Vegan Omega‑3", description: "No fishy taste. Non‑GMO, clean label ingredients.", gradient: "from-green-400 to-amber-500" },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <PremiumHero
        badge="Anagioprim Healthy Coffee"
        title="Omega3 Coffee • Chelation Coffee"
        subtitle="Smart Coffee for Heart & Brain"
        description="Premium coffee infused with ultra‑pure, plant‑based omega‑3s and chelation support—without the fishy taste."
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
        backgroundVariant="pattern"
        floatingElements={false}
        className="pb-0"
      />

      {/* Products Grid */}
      <section id="products">
        <PremiumProductGrid
          title="Available Now"
          subtitle="Premium Quality Products"
          description="Professional printing solutions ready for immediate ordering with fast turnaround times."
          products={availableProducts}
          columns={2}
          variant="luxury"
          showPricing={true}
          className="bg-white"
        />
      </section>

      {/* Removed Coming Soon section for simplicity */}

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
                variant="gradient"
                hover
                glow
                className="text-center group"
              >
                <div className={`inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r ${feature.gradient} rounded-3xl text-4xl mb-6 shadow-xl group-hover:shadow-2xl transform group-hover:-translate-y-2 transition-all duration-300`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-3">{feature.title}</h3>
                <p className="text-slate-600 font-light leading-relaxed">{feature.description}</p>
              </PremiumCard>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
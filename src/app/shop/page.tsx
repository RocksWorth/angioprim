import { Header } from '../../components/Header';
import { PremiumHero } from '@/components/sections/premium-hero';
import { PremiumProductGrid } from '@/components/sections/premium-product-grid';
import { PremiumCard } from '@/components/ui/premium-card';
import { SectionHeader } from '@/components/ui/section-header';
import { getBrandConfig } from '@/lib/design-system';

const PRODUCTS = [
  {
    id: 'business-cards',
    name: 'Business Cards',
    description: 'Luxury networking essentials with premium finishes. Available in 14pt matte, 13pt enviro, and 18pt writable stocks.',
    image: '/products/business-cards/featured.jpg',
    href: '/shop/business-cards',
    price: 'From $24.99',
    badge: 'Most Popular',
    popular: true,
    features: ['Premium Paper Stock', 'Multiple Finishes', 'Fast Turnaround', 'Professional Design']
  },
  {
    id: 'flyers',
    name: 'Premium Flyers',
    description: 'Eye-catching promotional art perfect for events, campaigns, and marketing. Multiple sizes and premium paper options.',
    image: '/products/flyers/featured.jpg',
    href: '/shop/flyers',
    price: 'From $17.99',
    badge: 'Best Value',
    features: ['Vibrant Colors', 'Various Sizes', 'Bulk Discounts', 'Quick Production']
  },
  {
    id: 'postcards',
    name: 'Custom Postcards',
    description: 'Direct mail excellence with UV coating for maximum impact. Perfect for targeted marketing campaigns.',
    image: '/products/postcards/featured.jpg',
    href: '/shop/postcards',
    price: 'From $14.99',
    badge: 'Fast Turnaround',
    features: ['UV Coating', 'Direct Mail Ready', 'Custom Sizes', 'High Impact Design']
  },
  {
    id: 'stickers',
    name: 'Custom Stickers',
    description: 'Branded adhesive solutions in custom sizes. Weather-resistant with matte, gloss, or clear premium finishes.',
    image: '/products/stickers/featured.jpg',
    href: '/shop/stickers',
    price: 'From $8.99',
    badge: 'Trending',
    features: ['Weather Resistant', 'Die-Cut Options', 'Various Materials', 'Custom Shapes']
  },
  {
    id: 'brochures',
    name: 'Luxury Brochures',
    description: 'Professional tri-fold and bi-fold brochures with premium paper and finishing. Perfect for showcasing services.',
    image: '/products/brochures/featured.jpg',
    href: '/shop/brochures',
    price: 'From $32.99',
    badge: 'Coming Soon',
    features: ['Tri-fold & Bi-fold', 'Premium Paper', 'Professional Finish', 'Custom Design']
  },
  {
    id: 'posters',
    name: 'Large Format Posters',
    description: 'Premium large format posters for advertising and events. Available in multiple sizes up to 24x36 inches.',
    image: '/products/posters/featured.jpg',
    href: '/shop/posters',
    price: 'From $19.99',
    badge: 'Coming Soon',
    features: ['Large Format', 'Indoor/Outdoor', 'Multiple Sizes', 'Professional Grade']
  }
];

// Available products
const availableProducts = PRODUCTS.filter(product => 
  ['business-cards', 'flyers', 'postcards', 'stickers'].includes(product.id)
);

export default function ShopIndex() {
  const brandConfig = getBrandConfig();

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
        badge="🎨 Premium Print Solutions • Professional Quality • Fast Delivery"
        title="Premium Collection"
        subtitle="Luxury Printing Solutions"
        description="Discover our curated selection of luxury printing solutions. Each product is crafted with attention to detail and premium materials to elevate your brand presence."
        actions={[
          {
            label: 'Browse Products',
            href: '#products',
            variant: 'gradient',
          },
          {
            label: 'Custom Quote',
            href: '/contact',
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

      {/* Coming Soon Products */}
      <section className="py-20 lg:py-32 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            badge="Coming Soon"
            title="Expanding Our Collection"
            subtitle="More Premium Products"
            description="We're constantly adding new premium printing solutions to serve your business needs better."
            className="mb-16"
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {PRODUCTS.filter(product => 
              !['business-cards', 'flyers', 'postcards', 'stickers'].includes(product.id)
            ).map((product, index) => (
              <PremiumCard
                key={product.id}
                variant="glass"
                className="relative overflow-hidden opacity-75"
              >
                {/* Coming Soon Badge */}
                <div className="absolute top-4 left-4 z-10 bg-gradient-to-r from-slate-600 to-slate-700 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  {product.badge}
                </div>

                {/* Product Image */}
                <div className="relative aspect-[4/3] mb-6 overflow-hidden rounded-xl bg-slate-100">
                  <div className="absolute inset-0 bg-slate-200 flex items-center justify-center">
                    <span className="bg-white text-slate-700 px-6 py-3 rounded-full font-semibold text-lg shadow-xl">
                      Coming Soon
                    </span>
                  </div>
                </div>

                {/* Product Content */}
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-bold text-slate-600 mb-2">
                      {product.name}
                    </h3>
                    <p className="text-slate-500 leading-relaxed">
                      {product.description}
                    </p>
                  </div>

                  {/* Features */}
                  <div className="space-y-2">
                    {product.features.slice(0, 3).map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center text-sm text-slate-500">
                        <div className="w-1.5 h-1.5 bg-slate-400 rounded-full mr-3" />
                        {feature}
                      </div>
                    ))}
                  </div>

                  {/* Pricing */}
                  <div className="pt-2 border-t border-slate-200">
                    <p className="text-2xl font-bold text-slate-500">
                      {product.price}
                      <span className="text-sm font-normal text-slate-400 ml-1">
                        estimated
                      </span>
                    </p>
                  </div>
                </div>
              </PremiumCard>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 lg:py-32 bg-gradient-to-br from-white via-blue-50/30 to-purple-50/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            badge="Why Choose Us"
            title="The VersatilePrint Promise"
            subtitle="Excellence in Every Detail"
            description="Luxury printing with uncompromising quality and service excellence."
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
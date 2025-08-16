export const SIZES = ["8oz", "12oz", "16oz", "32oz"] as const;
export const BLENDS = ["regular", "premium"] as const;
export type Size = typeof SIZES[number];
export type Blend = typeof BLENDS[number];

export type CoffeeProduct = {
  id: string;
  name: string;
  image: string; // /products/coffee/*.jpg
  // pricing[size][blend] -> price in cents per bag
  pricing: Record<Size, Record<Blend, number>>;
  blurb?: string;
  description: string;
  benefits: string[];
};

export const COFFEE_PRODUCTS: CoffeeProduct[] = [
  {
    id: "omega3-original",
    name: "Omega3 Coffee Original",
    image: "/products/coffee/original.jpg",
    blurb: "Clean, vegan omega-3s meet premium single-origin coffee.",
    description: "Our signature blend combines high-quality, ethically sourced coffee with ultra-pure, plant-based omega-3s. Perfect for daily wellness without the fishy taste.",
    benefits: [
      "Mental Clarity & Focus",
      "Heart Health Support", 
      "Anti-Inflammatory Power",
      "No Fish, No Fillers"
    ],
    pricing: {
      "8oz":  { regular: 2999, premium: 3499 },  // $29.99, $34.99
      "12oz": { regular: 3999, premium: 4499 },  // $39.99, $44.99
      "16oz": { regular: 4999, premium: 5499 },  // $49.99, $54.99
      "32oz": { regular: 8999, premium: 9499 },  // $89.99, $94.99
    },
  },
  {
    id: "omega3-premium",
    name: "Omega3 Coffee Premium",
    image: "/products/coffee/premium.jpg",
    blurb: "Enhanced omega-3 concentration with superior single-origin beans.",
    description: "Our premium blend features the highest concentration of plant-based omega-3s paired with rare, single-origin coffee beans for the ultimate wellness experience.",
    benefits: [
      "Maximum Omega-3 Potency",
      "Superior Bean Quality",
      "Enhanced Bioavailability", 
      "Ethically Sourced"
    ],
    pricing: {
      "8oz":  { regular: 3499, premium: 3999 },  // $34.99, $39.99
      "12oz": { regular: 4499, premium: 4999 },  // $44.99, $49.99
      "16oz": { regular: 5499, premium: 5999 },  // $54.99, $59.99
      "32oz": { regular: 9499, premium: 9999 },  // $94.99, $99.99
    },
  },
];

export function getCoffeeProduct(id: string) {
  return COFFEE_PRODUCTS.find(p => p.id === id) ?? null;
}

export function priceFor(id: string, size: Size, blend: Blend) {
  const p = getCoffeeProduct(id);
  if (!p) return null;
  return p.pricing[size]?.[blend] ?? null;
}


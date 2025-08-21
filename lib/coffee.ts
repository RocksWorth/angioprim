export const SIZES = ["300g"] as const;
export const BLENDS = ["standard"] as const;
export type Size = typeof SIZES[number];
export type Blend = typeof BLENDS[number];

export type CoffeeProduct = {
  id: string;
  name: string;
  image: string; // /products/coffee/*.svg
  // pricing[size][blend] -> price in cents per bag
  pricing: Record<Size, Record<Blend, number>>;
  blurb?: string;
  description: string;
  benefits: string[];
};

export const COFFEE_PRODUCTS: CoffeeProduct[] = [
  {
    id: "omega3",
    name: "Omega3 Coffee",
    image: "/products/coffee/omega3.svg",
    blurb: "Clean, vegan omega‑3s meet premium single‑origin coffee.",
    description: "Premium coffee infused with ultra‑pure, plant‑based omega‑3s—designed to support focus, heart health, and inflammation response without compromising taste or performance.",
    benefits: [
      "Mental Clarity & Focus",
      "Heart Health Support",
      "Anti‑Inflammatory Power",
      "No Fishy Taste • Vegan"
    ],
    pricing: {
      "300g":  { standard: 3999 },
    },
  },
  {
    id: "chelation",
    name: "Chelation Coffee",
    image: "/products/coffee/chelation.svg",
    blurb: "Chelation‑supporting blend for daily wellness.",
    description: "Chelation‑support coffee crafted with high‑quality beans. Clean label, non‑GMO, and designed to support everyday vitality.",
    benefits: [
      "Daily Wellness Support",
      "Clean Label • Non‑GMO",
      "No Fillers • No Additives",
      "Ethically Sourced Beans"
    ],
    pricing: {
      "300g":  { standard: 4499 },
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


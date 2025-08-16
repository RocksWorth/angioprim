export const PACKS = [100, 250, 500, 1000] as const;
export const SIDES = ["single", "double"] as const;
export type Side = typeof SIDES[number];
export type Pack = typeof PACKS[number];

export type BCProduct = {
  id: string;
  name: string;
  image: string; // /products/business-cards/*.jpg
  // pricing[pack][side] -> price in cents per pack
  pricing: Record<Pack, Record<Side, number>>;
  blurb?: string;
};

export const BUSINESS_CARDS: BCProduct[] = [
  {
    id: "bc-14pt-matte",
    name: "14pt + Matte Finish",
    image: "/products/business-cards/14pt-matte.jpg",
    blurb: "Smooth matte coating. Crisp colour.",
    pricing: {
      100:  { single: 2499, double: 2999 },
      250:  { single: 3499, double: 3999 },
      500:  { single: 4999, double: 5499 },
      1000: { single: 6999, double: 7499 },
    },
  },
  {
    id: "bc-13pt-enviro",
    name: "13pt Enviro Uncoated",
    image: "/products/business-cards/13pt-enviro.jpg",
    blurb: "Recycled, writable surface.",
    pricing: {
      100:  { single: 2699, double: 3199 },
      250:  { single: 3699, double: 4199 },
      500:  { single: 5299, double: 5799 },
      1000: { single: 7499, double: 7999 },
    },
  },
  {
    id: "bc-18pt-writable-c1s",
    name: "18pt Writable (C1S)",
    image: "/products/business-cards/18pt-writable.jpg",
    blurb: "Coated front, writable back.",
    pricing: {
      100:  { single: 2999, double: 3499 },
      250:  { single: 4299, double: 4799 },
      500:  { single: 5999, double: 6499 },
      1000: { single: 7999, double: 8599 },
    },
  },
];

export function getBCProduct(id: string) {
  return BUSINESS_CARDS.find(p => p.id === id) ?? null;
}

export function priceFor(id: string, pack: Pack, side: Side) {
  const p = getBCProduct(id);
  if (!p) return null;
  return p.pricing[pack]?.[side] ?? null;
}

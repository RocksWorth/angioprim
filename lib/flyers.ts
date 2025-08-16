export const FLYER_SIZES = ["5.5x8.5", "8.5x11", "11x17"] as const;
export const FLYER_QUANTITIES = [25, 50, 100, 250, 500, 1000, 2500] as const;
export const SIDES = ["single", "double"] as const;

export type FlyerSize = typeof FLYER_SIZES[number];
export type FlyerQuantity = typeof FLYER_QUANTITIES[number];
export type Side = typeof SIDES[number];

export type FlyerProduct = {
  id: string;
  name: string;
  image: string;
  blurb?: string;
  // pricing[size][quantity][side] -> price in cents
  pricing: Record<FlyerSize, Record<FlyerQuantity, Record<Side, number>>>;
};

export const FLYERS: FlyerProduct[] = [
  {
    id: "flyer-100lb-gloss",
    name: "100lb Gloss Cover",
    image: "/products/flyers/100lb-gloss.jpg",
    blurb: "Premium glossy finish for vibrant colors",
    pricing: {
      "5.5x8.5": {
        25: { single: 1999, double: 2499 },
        50: { single: 2499, double: 2999 },
        100: { single: 2999, double: 3699 },
        250: { single: 4999, double: 5999 },
        500: { single: 7999, double: 9499 },
        1000: { single: 12999, double: 15999 },
        2500: { single: 24999, double: 29999 },
      },
      "8.5x11": {
        25: { single: 2499, double: 2999 },
        50: { single: 2999, double: 3699 },
        100: { single: 3699, double: 4499 },
        250: { single: 5999, double: 7499 },
        500: { single: 9999, double: 12499 },
        1000: { single: 16999, double: 21999 },
        2500: { single: 34999, double: 44999 },
      },
      "11x17": {
        25: { single: 3499, double: 4299 },
        50: { single: 4299, double: 5299 },
        100: { single: 5299, double: 6599 },
        250: { single: 8999, double: 11499 },
        500: { single: 14999, double: 19499 },
        1000: { single: 24999, double: 32999 },
        2500: { single: 54999, double: 74999 },
      },
    },
  },
  {
    id: "flyer-80lb-silk",
    name: "80lb Silk Text",
    image: "/products/flyers/80lb-silk.jpg", 
    blurb: "Smooth silk finish, professional look",
    pricing: {
      "5.5x8.5": {
        25: { single: 1799, double: 2199 },
        50: { single: 2199, double: 2699 },
        100: { single: 2699, double: 3299 },
        250: { single: 4499, double: 5399 },
        500: { single: 7199, double: 8599 },
        1000: { single: 11699, double: 14399 },
        2500: { single: 22499, double: 26999 },
      },
      "8.5x11": {
        25: { single: 2199, double: 2699 },
        50: { single: 2699, double: 3299 },
        100: { single: 3299, double: 3999 },
        250: { single: 5399, double: 6799 },
        500: { single: 8999, double: 11299 },
        1000: { single: 15299, double: 19899 },
        2500: { single: 31499, double: 40999 },
      },
      "11x17": {
        25: { single: 3199, double: 3899 },
        50: { single: 3899, double: 4799 },
        100: { single: 4799, double: 5999 },
        250: { single: 8199, double: 10499 },
        500: { single: 13699, double: 17899 },
        1000: { single: 22999, double: 30499 },
        2500: { single: 50999, double: 69999 },
      },
    },
  },
];

export function getFlyerProduct(id: string) {
  return FLYERS.find(p => p.id === id) ?? null;
}

export function flyerPriceFor(id: string, size: FlyerSize, quantity: FlyerQuantity, side: Side) {
  const p = getFlyerProduct(id);
  if (!p) return null;
  return p.pricing[size]?.[quantity]?.[side] ?? null;
}

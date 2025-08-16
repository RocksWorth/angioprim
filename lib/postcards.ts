export const POSTCARD_SIZES = ["4x6", "5x7", "6x9"] as const;
export const POSTCARD_QUANTITIES = [25, 50, 100, 250, 500, 1000, 2500] as const;
export const SIDES = ["single", "double"] as const;

export type PostcardSize = typeof POSTCARD_SIZES[number];
export type PostcardQuantity = typeof POSTCARD_QUANTITIES[number];
export type Side = typeof SIDES[number];

export type PostcardProduct = {
  id: string;
  name: string;
  image: string;
  blurb?: string;
  pricing: Record<PostcardSize, Record<PostcardQuantity, Record<Side, number>>>;
};

export const POSTCARDS: PostcardProduct[] = [
  {
    id: "postcard-14pt-uv",
    name: "14pt + UV Coating",
    image: "/products/postcards/14pt-uv.jpg",
    blurb: "High-gloss UV coating for maximum impact",
    pricing: {
      "4x6": {
        25: { single: 1499, double: 1899 },
        50: { single: 1899, double: 2299 },
        100: { single: 2299, double: 2799 },
        250: { single: 3799, double: 4599 },
        500: { single: 6299, double: 7599 },
        1000: { single: 10499, double: 12999 },
        2500: { single: 20999, double: 25999 },
      },
      "5x7": {
        25: { single: 1899, double: 2299 },
        50: { single: 2299, double: 2799 },
        100: { single: 2799, double: 3399 },
        250: { single: 4599, double: 5599 },
        500: { single: 7599, double: 9299 },
        1000: { single: 12999, double: 16499 },
        2500: { single: 26999, double: 34999 },
      },
      "6x9": {
        25: { single: 2299, double: 2799 },
        50: { single: 2799, double: 3399 },
        100: { single: 3399, double: 4199 },
        250: { single: 5599, double: 6999 },
        500: { single: 9299, double: 11999 },
        1000: { single: 16499, double: 21999 },
        2500: { single: 34999, double: 46999 },
      },
    },
  },
];

export function getPostcardProduct(id: string) {
  return POSTCARDS.find(p => p.id === id) ?? null;
}

export function postcardPriceFor(id: string, size: PostcardSize, quantity: PostcardQuantity, side: Side) {
  const p = getPostcardProduct(id);
  if (!p) return null;
  return p.pricing[size]?.[quantity]?.[side] ?? null;
}

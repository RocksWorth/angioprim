export const STICKER_SIZES = ["2x2", "3x3", "4x4", "custom"] as const;
export const STICKER_QUANTITIES = [25, 50, 100, 250, 500, 1000, 2500] as const;
export const STICKER_FINISHES = ["matte", "gloss", "clear"] as const;

export type StickerSize = typeof STICKER_SIZES[number];
export type StickerQuantity = typeof STICKER_QUANTITIES[number];
export type StickerFinish = typeof STICKER_FINISHES[number];

export type StickerProduct = {
  id: string;
  name: string;
  image: string;
  blurb?: string;
  pricing: Record<StickerSize, Record<StickerQuantity, Record<StickerFinish, number>>>;
};

export const STICKERS: StickerProduct[] = [
  {
    id: "sticker-vinyl",
    name: "Vinyl Stickers",
    image: "/products/stickers/vinyl.jpg",
    blurb: "Durable outdoor vinyl, weatherproof",
    pricing: {
      "2x2": {
        25: { matte: 899, gloss: 999, clear: 1199 },
        50: { matte: 1199, gloss: 1299, clear: 1599 },
        100: { matte: 1599, gloss: 1799, clear: 2199 },
        250: { matte: 2999, gloss: 3299, clear: 3999 },
        500: { matte: 4999, gloss: 5499, clear: 6799 },
        1000: { matte: 8999, gloss: 9999, clear: 12499 },
        2500: { matte: 18999, gloss: 21999, clear: 27999 },
      },
      "3x3": {
        25: { matte: 1299, gloss: 1499, clear: 1799 },
        50: { matte: 1699, gloss: 1899, clear: 2399 },
        100: { matte: 2299, gloss: 2599, clear: 3199 },
        250: { matte: 4299, gloss: 4799, clear: 5899 },
        500: { matte: 7199, gloss: 7999, clear: 9999 },
        1000: { matte: 12999, gloss: 14499, clear: 18499 },
        2500: { matte: 27999, gloss: 31999, clear: 40999 },
      },
      "4x4": {
        25: { matte: 1799, gloss: 1999, clear: 2499 },
        50: { matte: 2299, gloss: 2599, clear: 3199 },
        100: { matte: 3099, gloss: 3499, clear: 4299 },
        250: { matte: 5799, gloss: 6499, clear: 7999 },
        500: { matte: 9699, gloss: 10999, clear: 13799 },
        1000: { matte: 17499, gloss: 19999, clear: 25499 },
        2500: { matte: 37999, gloss: 43999, clear: 56999 },
      },
      "custom": {
        25: { matte: 2499, gloss: 2799, clear: 3499 },
        50: { matte: 3199, gloss: 3599, clear: 4499 },
        100: { matte: 4299, gloss: 4799, clear: 5999 },
        250: { matte: 7999, gloss: 8999, clear: 11299 },
        500: { matte: 13499, gloss: 15299, clear: 19499 },
        1000: { matte: 24499, gloss: 27999, clear: 35999 },
        2500: { matte: 53999, gloss: 61999, clear: 79999 },
      },
    },
  },
];

export function getStickerProduct(id: string) {
  return STICKERS.find(p => p.id === id) ?? null;
}

export function stickerPriceFor(id: string, size: StickerSize, quantity: StickerQuantity, finish: StickerFinish) {
  const p = getStickerProduct(id);
  if (!p) return null;
  return p.pricing[size]?.[quantity]?.[finish] ?? null;
}

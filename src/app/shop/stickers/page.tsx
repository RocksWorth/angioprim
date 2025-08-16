"use client";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { STICKERS, STICKER_SIZES, STICKER_QUANTITIES, STICKER_FINISHES, stickerPriceFor, type StickerSize, type StickerQuantity, type StickerFinish } from "../../../../lib/stickers";
import { Header } from '../../../components/Header';
import { Button } from '../../../components/Button';

function money(cents: number) {
  return new Intl.NumberFormat("en-CA", { style: "currency", currency: "CAD" }).format(cents / 100);
}

export default function StickersPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-6xl mx-auto px-4 py-12">
        <nav className="mb-6">
          <Link href="/shop" className="text-blue-600 hover:text-blue-800 text-sm">← Back to Shop</Link>
        </nav>
        
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 mb-4">Stickers</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Durable vinyl stickers in custom sizes. Weather-resistant with your choice of 
            matte, gloss, or clear finishes.
          </p>
        </div>

        <div className="grid sm:grid-cols-1 lg:grid-cols-1 gap-8 max-w-2xl mx-auto">
          {STICKERS.map(p => (
            <StickerCard 
              key={p.id} 
              pid={p.id} 
              name={p.name} 
              img={p.image} 
              blurb={p.blurb} 
            />
          ))}
        </div>
      </main>
    </div>
  );
}

function StickerCard({ pid, name, img, blurb }: { pid: string; name: string; img: string; blurb?: string; }) {
  const [size, setSize] = useState<StickerSize>("3x3");
  const [quantity, setQuantity] = useState<StickerQuantity>(100);
  const [finish, setFinish] = useState<StickerFinish>("gloss");
  const [copies, setCopies] = useState(1);
  
  const price = stickerPriceFor(pid, size, quantity, finish) ?? 0;
  const total = useMemo(() => price * copies, [price, copies]);

  async function buyNow() {
    const res = await fetch("/api/checkout-sticker", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ productId: pid, size, quantity, finish, copies })
    });
    const data = await res.json();
    if (!res.ok || !data?.url) {
      alert(data?.error || "Checkout failed");
      return;
    }
    window.location.href = data.url;
  }

  return (
    <div className="rounded-2xl overflow-hidden border border-gray-200 bg-white shadow-sm">
      <div className="relative aspect-[4/3]">
        <Image src={img} alt={name} fill className="object-cover" />
      </div>
      
      <div className="p-6">
        <div className="mb-4">
          <h3 className="text-xl font-semibold text-gray-900">{name}</h3>
          {blurb && <p className="text-gray-600 text-sm mt-1">{blurb}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Size Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Size</label>
            <select 
              className="w-full rounded-lg border-2 border-gray-300 px-3 py-2 bg-white text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors" 
              value={size} 
              onChange={e => setSize(e.target.value as StickerSize)}
            >
              {STICKER_SIZES.map(s => (
                <option key={s} value={s} className="text-gray-900 bg-white">
                  {s === "custom" ? "Custom Size" : `${s} inches`}
                </option>
              ))}
            </select>
          </div>

          {/* Quantity Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
            <select 
              className="w-full rounded-lg border-2 border-gray-300 px-3 py-2 bg-white text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors" 
              value={quantity} 
              onChange={e => setQuantity(Number(e.target.value) as StickerQuantity)}
            >
              {STICKER_QUANTITIES.map(q => (
                <option key={q} value={q} className="text-gray-900 bg-white">{q} stickers</option>
              ))}
            </select>
          </div>

          {/* Finish Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Finish</label>
            <select 
              className="w-full rounded-lg border-2 border-gray-300 px-3 py-2 bg-white text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors" 
              value={finish} 
              onChange={e => setFinish(e.target.value as StickerFinish)}
            >
              {STICKER_FINISHES.map(f => (
                <option key={f} value={f} className="text-gray-900 bg-white">
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* Copies */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Sets</label>
            <select 
              className="w-full rounded-lg border-2 border-gray-300 px-3 py-2 bg-white text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors" 
              value={copies} 
              onChange={e => setCopies(parseInt(e.target.value))}
            >
              {Array.from({ length: 5 }).map((_, i) => (
                <option key={i + 1} value={i + 1} className="text-gray-900 bg-white">{i + 1} set{i > 0 ? 's' : ''}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-6 space-y-4">
          <div className="text-center">
            <div className="text-sm text-gray-600">Per set: {money(price)}</div>
            <div className="text-2xl font-bold text-blue-600">{money(total)} total</div>
          </div>

          <Button 
            onClick={buyNow} 
            className="w-full"
            size="lg"
          >
            Buy Now
          </Button>
        </div>
      </div>
    </div>
  );
}

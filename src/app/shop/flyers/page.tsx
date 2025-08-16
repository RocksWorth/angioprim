"use client";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { FLYERS, FLYER_SIZES, FLYER_QUANTITIES, SIDES, flyerPriceFor, type FlyerSize, type FlyerQuantity, type Side } from "../../../../lib/flyers";
import { Header } from '../../../components/Header';
import { Button } from '../../../components/Button';

function money(cents: number) {
  return new Intl.NumberFormat("en-CA", { style: "currency", currency: "CAD" }).format(cents / 100);
}

export default function FlyersPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-6xl mx-auto px-4 py-12">
        <nav className="mb-6">
          <Link href="/shop" className="text-blue-600 hover:text-blue-800 text-sm">← Back to Shop</Link>
        </nav>
        
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 mb-4">Flyers</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Eye-catching flyers perfect for events, promotions, and marketing campaigns. 
            Choose from premium paper stocks and multiple sizes.
          </p>
        </div>

        <div className="grid sm:grid-cols-1 lg:grid-cols-2 gap-8">
          {FLYERS.map(p => (
            <FlyerCard 
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

function FlyerCard({ pid, name, img, blurb }: { pid: string; name: string; img: string; blurb?: string; }) {
  const [size, setSize] = useState<FlyerSize>("8.5x11");
  const [quantity, setQuantity] = useState<FlyerQuantity>(100);
  const [side, setSide] = useState<Side>("double");
  const [copies, setCopies] = useState(1);
  
  const price = flyerPriceFor(pid, size, quantity, side) ?? 0;
  const total = useMemo(() => price * copies, [price, copies]);

  async function buyNow() {
    const res = await fetch("/api/checkout-flyer", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ productId: pid, size, quantity, side, copies })
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

        <div className="space-y-4">
          {/* Size Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Size</label>
            <select 
              className="w-full rounded-lg border-2 border-gray-300 px-3 py-2 bg-white text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors" 
              value={size} 
              onChange={e => setSize(e.target.value as FlyerSize)}
            >
              {FLYER_SIZES.map(s => (
                <option key={s} value={s} className="text-gray-900 bg-white">{s} inches</option>
              ))}
            </select>
          </div>

          {/* Quantity Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
            <select 
              className="w-full rounded-lg border-2 border-gray-300 px-3 py-2 bg-white text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors" 
              value={quantity} 
              onChange={e => setQuantity(Number(e.target.value) as FlyerQuantity)}
            >
              {FLYER_QUANTITIES.map(q => (
                <option key={q} value={q} className="text-gray-900 bg-white">{q} flyers</option>
              ))}
            </select>
          </div>

          {/* Sides Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Printing</label>
            <select 
              className="w-full rounded-lg border-2 border-gray-300 px-3 py-2 bg-white text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors" 
              value={side} 
              onChange={e => setSide(e.target.value as Side)}
            >
              {SIDES.map(s => (
                <option key={s} value={s} className="text-gray-900 bg-white">
                  {s === "single" ? "Single-sided" : "Double-sided"}
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

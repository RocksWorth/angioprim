"use client";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { COFFEE_PRODUCTS, SIZES, BLENDS, priceFor, type Size, type Blend } from "../../../../lib/coffee";
import { Header } from '../../../components/Header';
import { AddToCartButton } from '../../../components/cart/add-to-cart-button';

function money(cents: number) {
  return new Intl.NumberFormat("en-CA", { style: "currency", currency: "CAD" }).format(cents / 100);
}

export default function CoffeePage(){
  return(
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-6xl mx-auto px-4 py-12">
        <nav className="mb-6">
          <Link href="/shop" className="text-blue-600 hover:text-blue-800 text-sm">← Back to Shop</Link>
        </nav>
        
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 mb-4">Omega3 Coffee</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Premium coffee infused with ultra-pure, plant-based omega-3s—designed to support focus, 
            heart health, and inflammation response without compromising taste or performance.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-4 text-sm text-gray-700">
            <span className="bg-green-100 px-3 py-1 rounded-full">🧠 Mental Clarity</span>
            <span className="bg-red-100 px-3 py-1 rounded-full">❤️ Heart Health</span>
            <span className="bg-blue-100 px-3 py-1 rounded-full">😌 Mood & Focus</span>
            <span className="bg-purple-100 px-3 py-1 rounded-full">🌱 100% Vegan</span>
          </div>
        </div>

        <div className="grid sm:grid-cols-1 lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {COFFEE_PRODUCTS.map(p => <Card key={p.id} pid={p.id} name={p.name} img={p.image} blurb={p.blurb} description={p.description} benefits={p.benefits} />)}
        </div>
      </main>
    </div>
  );
}

function Card({ pid, name, img, blurb, description, benefits }:{pid:string;name:string;img:string;blurb?:string;description:string;benefits:string[];}){
  const [size,setSize]=useState<Size>("12oz");
  const [blend,setBlend]=useState<Blend>("regular");
  const [bags,setBags]=useState(1); // number of bags
  const price = priceFor(pid, size, blend) ?? 0;
  const total = useMemo(()=> price * bags, [price,bags]);

  // Get the selected product details
  const selectedProduct = COFFEE_PRODUCTS.find(p => p.id === pid);
  
  const cartOptions = {
    coffeeType: pid,
    size: size,
    blend: blend,
    bags: bags,
  };

  return(
    <div className="rounded-2xl overflow-hidden border border-gray-200 bg-white shadow-sm">
      <div className="relative aspect-[4/3]">
        <Image src={img} alt={name} fill className="object-cover"/>
      </div>
      <div className="p-6">
        <div className="mb-4">
          <h3 className="text-xl font-semibold text-gray-900">{name}</h3>
          {blurb && <p className="text-gray-600 text-sm mt-1">{blurb}</p>}
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Pack</label>
            <select className="w-full rounded-lg border-2 border-gray-300 px-3 py-2 bg-white text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors" value={pack} onChange={e=>setPack(Number(e.target.value) as Pack)}>
              {PACKS.map(p=><option key={p} value={p} className="text-gray-900 bg-white">{p}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Sides</label>
            <select className="w-full rounded-lg border-2 border-gray-300 px-3 py-2 bg-white text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors" value={side} onChange={e=>setSide(e.target.value as Side)}>
              {SIDES.map(s=><option key={s} value={s} className="text-gray-900 bg-white">{s==="single"?"Single-sided":"Double-sided"}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Sets</label>
            <select className="w-full rounded-lg border-2 border-gray-300 px-3 py-2 bg-white text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors" value={packs} onChange={e=>setPacks(parseInt(e.target.value))}>
              {Array.from({length:10}).map((_,i)=><option key={i+1} value={i+1} className="text-gray-900 bg-white">{i+1}</option>)}
            </select>
          </div>
        </div>

        <div className="mt-6 space-y-4">
          <div className="text-center">
            <div className="text-sm text-gray-600">Per set: {money(price)}</div>
            <div className="text-2xl font-bold text-blue-600">{money(total)} total</div>
          </div>

          <AddToCartButton
            productId="business-cards"
            name={`${name} Business Cards`}
            description={`${pack} cards, ${side}-sided${blurb ? ` - ${blurb}` : ''}`}
            price={total}
            image={img}
            options={cartOptions}
            quantity={1}
            className="w-full"
            size="lg"
            fullWidth
          />
        </div>
      </div>
    </div>
  )
}

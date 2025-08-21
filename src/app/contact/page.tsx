import { Header } from '@/components/Header';
import { PremiumCard } from '@/components/ui/premium-card';

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-10 text-center">
          <p className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-amber-200/70 text-amber-900 mb-3">Anagioprim Healthy Coffee</p>
          <h1 className="text-3xl font-extrabold text-slate-900">Contact & Support</h1>
          <p className="text-slate-600 mt-2">Questions about Omega3 or Chelation Coffee? We’re here to help.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <PremiumCard className="p-6">
            <h2 className="text-xl font-bold text-slate-900">Support</h2>
            <div className="mt-3 space-y-2 text-slate-700">
              <p>Email: <a href="mailto:support@angioprimhealthycoffee.com" className="text-blue-600 hover:underline">support@angioprimhealthycoffee.com</a></p>
              <p>Phone: <a href="tel:+10000000000" className="text-blue-600 hover:underline">+1 (000) 000-0000</a></p>
              <p>Hours: Mon–Fri, 9am–5pm (ET)</p>
            </div>
          </PremiumCard>

          <PremiumCard className="p-6">
            <h2 className="text-xl font-bold text-slate-900">Order & Shipping</h2>
            <div className="mt-3 space-y-2 text-slate-700">
              <p>Orders ship from Ontario, Canada</p>
              <p>Shipping regions: Canada, USA, International</p>
              <p>Typical handling time: 1–2 business days</p>
            </div>
          </PremiumCard>
        </div>

        <PremiumCard className="p-6 mt-6">
          <h2 className="text-xl font-bold text-slate-900">Message Us</h2>
          <form className="mt-4 grid gap-4">
            <div className="grid md:grid-cols-2 gap-4">
              <input className="border border-slate-300 rounded-lg px-3 py-2 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500" placeholder="Name" />
              <input type="email" className="border border-slate-300 rounded-lg px-3 py-2 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500" placeholder="Email" />
            </div>
            <select className="border border-slate-300 rounded-lg px-3 py-2 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500">
              <option>General Question</option>
              <option>Order Support</option>
              <option>Shipping</option>
              <option>Wholesale</option>
            </select>
            <textarea rows={5} className="border border-slate-300 rounded-lg px-3 py-2 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500" placeholder="Your message" />
            <button className="bg-gradient-to-r from-amber-700 to-rose-600 text-white rounded-lg px-4 py-2 font-semibold w-full md:w-auto">Send</button>
          </form>
        </PremiumCard>
      </main>
    </div>
  )
}

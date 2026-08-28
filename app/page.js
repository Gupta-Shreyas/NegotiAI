"use client";

import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#F6F3EC] text-[#0A1128]">
      {/* NAV HEADER WITH ENLARGED LOGO AND TITLE */}
      <header className="flex items-center justify-between px-8 py-8 max-w-[1200px] mx-auto">
        <div className="flex items-center gap-4">
          <img
            src="/assets/logo.png"
            alt="NegotiAI logo"
            className="w-14 h-14 rounded-2xl object-cover shadow-sm shrink-0"
          />
          <div>
            <h1 className="font-serif text-4xl font-extrabold tracking-tight text-[#0A1128] m-0 leading-none">
              NegotiAI
            </h1>
            <span className="text-[11px] font-bold tracking-widest text-[#6B7280] uppercase mt-1 block">
              AI Capital Marketplace
            </span>
          </div>
        </div>
        <Link
          href="/dashboard/negotiate"
          className="px-6 py-3 rounded-lg bg-[#061226] text-white text-sm font-semibold hover:bg-[#0F1E3D] transition shadow-md"
        >
          Open Dashboard
        </Link>
      </header>

      {/* HERO SECTION */}
      <section className="max-w-[900px] mx-auto px-8 pt-16 pb-16 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#ECE8DF] border border-[#E2DDD4] text-xs font-semibold tracking-wider text-[#6B7280] uppercase mb-6">
          <img src="/assets/logo.png" alt="" className="w-4 h-4 rounded-full object-cover" />
          Agentic Supply-Chain Financing
        </div>
        <h2 className="font-serif text-5xl md:text-6xl font-bold leading-tight mb-6">
          A competitive capital market,<br />negotiated in real time.
        </h2>
        <p className="text-lg text-[#4B5563] max-w-[620px] mx-auto mb-8">
          Autonomous capital providers compete to finance supplier invoices —
          judged on overall fit across rate, tenor, advance rate, fees, and
          settlement speed. Not just the lowest number.
        </p>
        <Link
          href="/dashboard/negotiate"
          className="inline-block px-8 py-4 rounded-xl bg-[#061226] text-white text-base font-semibold hover:bg-[#0F1E3D] transition shadow-lg hover:shadow-xl"
        >
          Try a Live Negotiation →
        </Link>
      </section>

      {/* HOW IT WORKS */}
      <section className="max-w-[1000px] mx-auto px-8 py-16">
        <h3 className="font-serif text-2xl font-bold text-center mb-2">How It Works</h3>
        <p className="text-center text-[#6B7280] mb-12">
          One continuous allocation loop — from invoice to settlement to learning.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
          {["Invoice", "Verify", "Assess Risk", "Discover Capital", "Generate Offers"].map((step, i) => (
            <div key={step} className="bg-white border border-[#E2DDD4] rounded-xl p-4 shadow-sm">
              <div className="font-mono text-xs text-[#6B7280] mb-1">{String(i + 1).padStart(2, "0")}</div>
              <div className="font-semibold text-sm">{step}</div>
            </div>
          ))}
          {["Compare", "Match", "Finance", "Settle", "Learn"].map((step, i) => (
            <div key={step} className="bg-white border border-[#E2DDD4] rounded-xl p-4 shadow-sm">
              <div className="font-mono text-xs text-[#6B7280] mb-1">{String(i + 6).padStart(2, "0")}</div>
              <div className="font-semibold text-sm">{step}</div>
            </div>
          ))}
        </div>
      </section>

      {/* WHY DIFFERENT */}
      <section className="max-w-[1000px] mx-auto px-8 py-16">
        <h3 className="font-serif text-2xl font-bold text-center mb-12">Why This Is Different</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white border border-[#E2DDD4] rounded-xl p-6 shadow-sm">
            <div className="text-2xl mb-3">💬</div>
            <h4 className="font-serif text-lg font-bold mb-2">Visible Negotiation</h4>
            <p className="text-sm text-[#6B7280] m-0">
              Providers negotiate in natural language, not silent scoring — the
              transcript is the explanation for why an offer won.
            </p>
          </div>
          <div className="bg-white border border-[#E2DDD4] rounded-xl p-6 shadow-sm">
            <div className="text-2xl mb-3">⚖️</div>
            <h4 className="font-serif text-lg font-bold mb-2">Buyer-Risk Aware</h4>
            <p className="text-sm text-[#6B7280] m-0">
              Buyer creditworthiness is a first-class signal, distinct from
              supplier risk — reflected directly in negotiated terms.
            </p>
          </div>
          <div className="bg-white border border-[#E2DDD4] rounded-xl p-6 shadow-sm">
            <div className="text-2xl mb-3">📈</div>
            <h4 className="font-serif text-lg font-bold mb-2">Adaptive Market</h4>
            <p className="text-sm text-[#6B7280] m-0">
              Providers remember past outcomes and adjust future terms —
              a dynamic marketplace, not a static comparison table.
            </p>
          </div>
        </div>
      </section>

      <footer className="text-center py-10 text-xs text-[#9CA3AF]">
        NegotiAI — Built with ❤️ in India 🇮🇳 | CSI ORIGIN 2026, Problem Statement 5
      </footer>
    </div>
  );
}
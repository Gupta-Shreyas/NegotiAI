"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import Link from "next/link";
import EditorialDocument from "@/components/EditorialDocument";
import MagneticButton from "@/components/MagneticButton";
import TactileCard from "@/components/TactileCard";
import NewspaperStorm from "@/components/NewspaperStorm";

export default function LandingPage() {
  // Element-by-element landing page reveal stages (0 to 6)
  const [revealStage, setRevealStage] = useState(0);
  const [stormFinished, setStormFinished] = useState(false);

  // Staged sequence revealing landing page element-by-element
  const timersRef = useRef([]);

  const handleNoiseDissolved = useCallback(() => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];

    setRevealStage(1); // 1. Warm ivory canvas & paper grain
    timersRef.current.push(setTimeout(() => setRevealStage(2), 120)); // 2. Logo & Navigation
    timersRef.current.push(setTimeout(() => setRevealStage(3), 280)); // 3. Section label '01' & hairline rule
    timersRef.current.push(setTimeout(() => setRevealStage(4), 450)); // 4. Editorial headline rises line-by-line
    timersRef.current.push(setTimeout(() => setRevealStage(5), 620)); // 5. Supporting paragraph & CTA
    timersRef.current.push(setTimeout(() => setRevealStage(6), 800)); // 6. Physical invoice document on walnut desk
  }, []);

  const handleStormComplete = useCallback(() => {
    setStormFinished(true);
  }, []);

  useEffect(() => {
    return () => {
      timersRef.current.forEach(clearTimeout);
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#F6F3EC] text-[#0A1128] selection:bg-[#061226] selection:text-white relative overflow-hidden">
      {/* CINEMATIC NEWSPAPER STORM OVERLAY (Dissolves into clarity after ~2s) */}
      {!stormFinished && (
        <NewspaperStorm
          onNoiseDissolved={handleNoiseDissolved}
          onComplete={handleStormComplete}
        />
      )}

      {/* Subtle paper grain ambient layer */}
      <div
        className={`absolute inset-0 bg-[radial-gradient(#061226_0.5px,transparent_0.5px)] [background-size:24px_24px] opacity-[0.025] pointer-events-none transition-opacity duration-1000 ${
          revealStage >= 1 ? "opacity-[0.025]" : "opacity-0"
        }`}
      />

      {/* EDITORIAL NAVIGATION */}
      <header
        className={`border-b border-[#E2DDD4] px-6 lg:px-12 py-4 sm:py-5 max-w-[1400px] mx-auto flex items-center justify-between relative z-30 transition-all duration-700 ${
          revealStage >= 2 ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-3"
        }`}
      >
        {/* BALANCED ELEGANT NEGOTIAI BRANDING */}
        <Link href="/" className="flex items-center gap-3.5 sm:gap-4 no-underline group">
          <img
            src="/assets/logo.png"
            alt="NegotiAI logo"
            className="w-12 h-12 sm:w-[54px] sm:h-[54px] rounded-xl object-cover shadow-sm shrink-0 border border-[#E2DDD4] group-hover:border-[#061226]/30 transition-colors"
          />
          <div>
            <span className="font-serif text-[22px] sm:text-[26.5px] font-bold tracking-tight text-[#0A1128] leading-none block group-hover:text-[#0F1E3D] transition-colors">
              NegotiAI
            </span>
            <span className="text-[9.5px] sm:text-[11px] font-mono font-bold tracking-widest text-[#8A8474] uppercase mt-1 block">
              AI Capital Marketplace
            </span>
          </div>
        </Link>

        {/* Editorial Section Jump Links */}
        <nav className="hidden md:flex items-center gap-8 text-xs font-mono font-medium text-[#6B7280]">
          <a href="#hero" className="hover:text-[#0A1128] transition-colors">
            01 / OVERVIEW
          </a>
          <a href="#how-it-works" className="hover:text-[#0A1128] transition-colors">
            02 / ALLOCATION LOOP
          </a>
          <a href="#why-different" className="hover:text-[#0A1128] transition-colors">
            03 / ARCHITECTURE
          </a>
        </nav>

        <div className="flex items-center gap-3">
          <Link href="/dashboard">
            <MagneticButton className="px-5 sm:px-6 py-2.5 sm:py-3 rounded-lg bg-[#061226] text-white text-xs sm:text-sm font-semibold hover:bg-[#0F1E3D] transition shadow-md">
              Open Dashboard →
            </MagneticButton>
          </Link>
        </div>
      </header>

      {/* 1. HERO — EDITORIAL SPREAD WITH TIGHTENED VERTICAL BALANCE */}
      <section
        id="hero"
        className="max-w-[1400px] mx-auto px-6 lg:px-12 pt-8 sm:pt-10 pb-12 sm:pb-16 relative z-20"
      >
        {/* Subtle center crease representing open book fold on desktop */}
        <div
          className={`hidden lg:block absolute top-6 bottom-8 left-1/2 w-[1px] bg-gradient-to-b from-transparent via-[#D5CFC4]/50 to-transparent transition-opacity duration-700 ${
            revealStage >= 1 ? "opacity-100" : "opacity-0"
          }`}
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* LEFT EDITORIAL COLUMN */}
          <div className="lg:col-span-6 flex flex-col justify-center">
            {/* Section Index & Drawing Hairline Rule (Reveals at Stage 3) */}
            <div
              className={`flex items-center gap-3 mb-3 sm:mb-4 transition-all duration-700 ${
                revealStage >= 3 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
              }`}
            >
              <span className="font-mono text-xs font-bold text-[#8A8474] tracking-wider">
                01
              </span>
              <div className="h-[1px] w-12 bg-[#061226]/30 animate-rule" />
              <span className="text-[11px] font-mono uppercase tracking-widest text-[#6B7280] font-bold">
                Agentic Supply-Chain Financing
              </span>
            </div>

            {/* Editorial Headline with Line-by-Line Reveal (Reveals at Stage 4) */}
            <div className="overflow-hidden mb-4">
              <h1
                className={`font-serif text-4xl sm:text-5xl lg:text-[3.5rem] font-bold leading-[1.12] text-[#0A1128] m-0 transition-all duration-700 ${
                  revealStage >= 4
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-8"
                }`}
              >
                A competitive capital market,{" "}
                <span className="italic font-normal text-[#2B1D14]">
                  negotiated in real time.
                </span>
              </h1>
            </div>

            {/* Supporting Financial Narrative (Reveals at Stage 5) */}
            <p
              className={`text-base sm:text-lg text-[#4B5563] leading-relaxed max-w-[540px] mb-6 font-light transition-all duration-700 ${
                revealStage >= 5
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-6"
              }`}
            >
              Autonomous capital provider agents compete to finance supplier invoices —
              judged on overall multidimensional fit across rate, tenor, advance percentage, fees,
              and settlement speed. Not just the lowest number.
            </p>

            {/* CTAs with Magnetic Precision (Reveals at Stage 5) */}
            <div
              className={`flex flex-wrap items-center gap-4 transition-all duration-700 ${
                revealStage >= 5
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-4"
              }`}
            >
              <Link href="/dashboard/negotiate">
                <MagneticButton className="px-7 py-3.5 rounded-xl bg-[#061226] text-white text-sm font-semibold hover:bg-[#0F1E3D] transition shadow-md hover:shadow-lg">
                  Try a Live Negotiation →
                </MagneticButton>
              </Link>

              <Link href="/dashboard/queue">
                <MagneticButton className="px-6 py-3.5 rounded-xl bg-white border border-[#E2DDD4] text-[#0A1128] text-sm font-semibold hover:bg-[#FBF9F4] transition shadow-sm">
                  Inspect Active Ledger
                </MagneticButton>
              </Link>
            </div>

            {/* Authentic Key Architectural Standards (Reveals at Stage 5) */}
            <div
              className={`grid grid-cols-3 gap-6 mt-6 pt-5 border-t border-[#E2DDD4] max-w-lg transition-all duration-700 ${
                revealStage >= 5 ? "opacity-100" : "opacity-0"
              }`}
            >
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#8A8474] block">
                  Auction Protocol
                </span>
                <span className="font-mono text-sm font-bold text-[#0A1128] mt-0.5 block">
                  Multi-Agent Nash
                </span>
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#8A8474] block">
                  Underwriting
                </span>
                <span className="font-mono text-sm font-bold text-[#0A1128] mt-0.5 block">
                  Buyer-Risk Aware
                </span>
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#8A8474] block">
                  Auditability
                </span>
                <span className="font-mono text-sm font-bold text-[#0A1128] mt-0.5 block">
                  100% Explainable
                </span>
              </div>
            </div>
          </div>

          {/* RIGHT EDITORIAL COLUMN: PHYSICAL INVOICE ON WALNUT DESK (Reveals at Stage 6) */}
          <div
            className={`lg:col-span-6 transition-all duration-1000 ease-out ${
              revealStage >= 6
                ? "opacity-100 translate-y-0 scale-100"
                : "opacity-0 translate-y-12 scale-[0.98]"
            }`}
          >
            <EditorialDocument isSettled={revealStage >= 6} />
          </div>
        </div>
      </section>

      {/* 2. HOW IT WORKS — EDITORIAL HORIZONTAL SEQUENCE (Tightened Spacing) */}
      <section
        id="how-it-works"
        className="max-w-[1400px] mx-auto px-6 lg:px-12 py-12 sm:py-16 border-t border-[#E2DDD4] relative z-20"
      >
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="font-mono text-xs font-bold text-[#8A8474]">02</span>
              <div className="h-[1px] w-8 bg-[#061226]/30" />
              <span className="text-[11px] font-mono uppercase tracking-widest text-[#6B7280] font-bold">
                Capital Allocation Cycle
              </span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#0A1128] m-0">
              One continuous allocation loop.
            </h2>
          </div>
          <p className="text-sm text-[#6B7280] max-w-md mt-2 md:mt-0 m-0 font-light">
            From verifiable trade intake to autonomous multi-agent settlement and reinforcement learning.
          </p>
        </div>

        {/* 8-Step Editorial Sequence Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3.5">
          {[
            { step: "01", name: "Invoice", caption: "Digital ingestion" },
            { step: "02", name: "Verify", caption: "Entity KYC match" },
            { step: "03", name: "Assess Risk", caption: "Dual counterparty" },
            { step: "04", name: "Discover", caption: "Provider liquidity" },
            { step: "05", name: "Offers", caption: "Initial term bids" },
            { step: "06", name: "Negotiate", caption: "Agentic rounds" },
            { step: "07", name: "Settle", caption: "Instant clearance" },
            { step: "08", name: "Learn", caption: "Adaptive memory" },
          ].map((item) => (
            <TactileCard
              key={item.step}
              className="bg-white border border-[#E2DDD4] rounded-xl p-4 shadow-sm hover:border-[#061226] transition-all group flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="font-mono text-xs font-bold text-[#8A8474] group-hover:text-[#061226] transition-colors">
                  {item.step}
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#D5CFC4] group-hover:bg-[#061226] transition-colors" />
              </div>
              <div>
                <div className="font-serif font-bold text-sm text-[#0A1128] mb-0.5">
                  {item.name}
                </div>
                <div className="text-[11px] text-[#6B7280]">
                  {item.caption}
                </div>
              </div>
            </TactileCard>
          ))}
        </div>
      </section>

      {/* 3. WHY THIS IS DIFFERENT — ARCHITECTURAL ADVANTAGE */}
      <section
        id="why-different"
        className="max-w-[1400px] mx-auto px-6 lg:px-12 py-12 sm:py-16 border-t border-[#E2DDD4] relative z-20"
      >
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="font-mono text-xs font-bold text-[#8A8474]">03</span>
              <div className="h-[1px] w-8 bg-[#061226]/30" />
              <span className="text-[11px] font-mono uppercase tracking-widest text-[#6B7280] font-bold">
                Market Paradigm
              </span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#0A1128] m-0">
              Why NegotiAI is different.
            </h2>
          </div>
          <p className="text-sm text-[#6B7280] max-w-md mt-2 md:mt-0 m-0 font-light">
            Engineered around physical trade instruments and autonomous economic intelligence.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link href="/dashboard/negotiate" className="block no-underline group">
            <TactileCard className="bg-white border border-[#E2DDD4] rounded-2xl p-7 shadow-sm hover:border-[#061226] transition-all flex flex-col justify-between h-full">
              <div>
                <div className="w-10 h-10 rounded-xl bg-[#F3EFE3] border border-[#E2DDD4] text-[#061226] flex items-center justify-center font-mono font-bold text-sm mb-5">
                  01
                </div>
                <h3 className="font-serif text-xl font-bold text-[#0A1128] mb-3 group-hover:text-[#0F1E3D] transition-colors">
                  Visible Negotiation Transcript
                </h3>
                <p className="text-sm text-[#6B7280] leading-relaxed m-0 font-light">
                  Providers negotiate in natural language, not opaque scoring black-boxes. The full dialogue transcript serves as the auditable proof explaining why a winning deal was selected.
                </p>
              </div>
              <div className="mt-8 pt-4 border-t border-[#F0ECE1] text-[11px] font-mono text-[#061226] font-semibold flex items-center justify-between">
                <span>Explainable AI Protocol</span>
                <span>→</span>
              </div>
            </TactileCard>
          </Link>

          <Link href="/dashboard/queue" className="block no-underline group">
            <TactileCard className="bg-white border border-[#E2DDD4] rounded-2xl p-7 shadow-sm hover:border-[#061226] transition-all flex flex-col justify-between h-full">
              <div>
                <div className="w-10 h-10 rounded-xl bg-[#F3EFE3] border border-[#E2DDD4] text-[#061226] flex items-center justify-center font-mono font-bold text-sm mb-5">
                  02
                </div>
                <h3 className="font-serif text-xl font-bold text-[#0A1128] mb-3 group-hover:text-[#0F1E3D] transition-colors">
                  Buyer-Risk Aware Pricing
                </h3>
                <p className="text-sm text-[#6B7280] leading-relaxed m-0 font-light">
                  Debtor (Buyer) creditworthiness is treated as a first-class underwriting signal, decoupled from supplier balance-sheet constraints — reflected directly in negotiated advance rates.
                </p>
              </div>
              <div className="mt-8 pt-4 border-t border-[#F0ECE1] text-[11px] font-mono text-[#061226] font-semibold flex items-center justify-between">
                <span>Decoupled Credit Model</span>
                <span>→</span>
              </div>
            </TactileCard>
          </Link>

          <Link href="/dashboard/portfolios" className="block no-underline group">
            <TactileCard className="bg-white border border-[#E2DDD4] rounded-2xl p-7 shadow-sm hover:border-[#061226] transition-all flex flex-col justify-between h-full">
              <div>
                <div className="w-10 h-10 rounded-xl bg-[#F3EFE3] border border-[#E2DDD4] text-[#061226] flex items-center justify-center font-mono font-bold text-sm mb-5">
                  03
                </div>
                <h3 className="font-serif text-xl font-bold text-[#0A1128] mb-3 group-hover:text-[#0F1E3D] transition-colors">
                  Adaptive Memory Marketplace
                </h3>
                <p className="text-sm text-[#6B7280] leading-relaxed m-0 font-light">
                  Providers remember past settlement performance, supplier reliability, and payment timelines — dynamically adjusting future terms in an evolving marketplace rather than a static table.
                </p>
              </div>
              <div className="mt-8 pt-4 border-t border-[#F0ECE1] text-[11px] font-mono text-[#061226] font-semibold flex items-center justify-between">
                <span>Reinforcement Learning Loop</span>
                <span>→</span>
              </div>
            </TactileCard>
          </Link>
        </div>
      </section>

      {/* EDITORIAL FOOTER */}
      <footer className="border-t border-[#E2DDD4] py-10 px-6 lg:px-12 max-w-[1400px] mx-auto text-xs text-[#8A8474] relative z-20">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-serif font-bold text-[#0A1128]">NegotiAI</span>
            <span>· Built for CSI ORIGIN 2026, Problem Statement 5</span>
          </div>
          <div className="font-mono text-[11px]">
            Autonomous Capital Allocation Terminal · Made in India 🇮🇳
          </div>
        </div>
      </footer>
    </div>
  );
}
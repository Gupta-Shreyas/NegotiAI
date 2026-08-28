"use client";

import { useRef, useCallback } from "react";

export default function EditorialDocument({ isSettled = false, className = "" }) {
  const containerRef = useRef(null);
  const deskRef = useRef(null);
  const docRef = useRef(null);
  const rafId = useRef(null);
  const rectRef = useRef(null);

  const handleMouseEnter = useCallback(() => {
    if (typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches) return;
    if (!containerRef.current) return;
    rectRef.current = containerRef.current.getBoundingClientRect();
  }, []);

  const handleMouseMove = useCallback((e) => {
    if (!containerRef.current || !rectRef.current) return;

    if (rafId.current) {
      cancelAnimationFrame(rafId.current);
    }

    const rect = rectRef.current;
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const tiltX = ((y - centerY) / centerY) * -2.5;
    const tiltY = ((x - centerX) / centerX) * 2.5;

    rafId.current = requestAnimationFrame(() => {
      if (deskRef.current) {
        deskRef.current.style.transform = `rotateX(${(tiltX * 0.35).toFixed(2)}deg) rotateY(${(tiltY * 0.35).toFixed(2)}deg)`;
      }
      if (docRef.current) {
        docRef.current.style.transform = `rotateX(${tiltX.toFixed(2)}deg) rotateY(${tiltY.toFixed(2)}deg) translateZ(8px)`;
      }
    });
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (rafId.current) {
      cancelAnimationFrame(rafId.current);
    }
    rectRef.current = null;
    if (deskRef.current) {
      deskRef.current.style.transform = "rotateX(0deg) rotateY(0deg)";
    }
    if (docRef.current) {
      docRef.current.style.transform = "rotateX(0deg) rotateY(0deg) translateZ(0px)";
    }
  }, []);

  return (
    <div
      ref={containerRef}
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative select-none w-full max-w-[580px] mx-auto lg:max-w-none ${className}`}
      style={{ perspective: "1200px" }}
    >
      {/* RICH WALNUT / WOOD DESK BACKDROP */}
      <div
        ref={deskRef}
        className="rounded-3xl p-6 sm:p-8 lg:p-9 desk-surface border border-[#4A3525] relative transition-transform duration-250 ease-out"
      >
        {/* Subtle wood grain texture & ambient reflection */}
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-black/20 via-transparent to-white/[0.04] pointer-events-none" />

        {/* Desk Header Badge */}
        <div className="flex items-center justify-between mb-4 text-[10px] sm:text-[11px] font-mono text-[#D5CFC4]/70 tracking-widest uppercase">
          <span>DESK TERMINAL · TRADE REGISTRY</span>
          <span className="flex items-center gap-1.5 text-[#C8AD7F] font-semibold">
            <span className="w-2 h-2 rounded-full bg-[#386641] inline-block animate-pulse"></span>
            LIVE AUDIT ACTIVE
          </span>
        </div>

        {/* DOCUMENT STACK CONTAINER */}
        <div className="relative">
          {/* UNDER-SHEET 2 (Deepest Parchment) */}
          <div
            className="absolute inset-0 bg-[#DED6C4] rounded-xl border border-[#CFC6B2] shadow-sm transform translate-x-3 translate-y-3.5 rotate-1 pointer-events-none"
          />

          {/* UNDER-SHEET 1 (Middle Sheet) */}
          <div
            className="absolute inset-0 bg-[#ECE5D6] rounded-xl border border-[#DCD3C0] shadow-md transform translate-x-1.5 translate-y-1.5 -rotate-0.5 pointer-events-none"
          />

          {/* TOP PRIMARY INVOICE DOCUMENT */}
          <div
            ref={docRef}
            className="relative bg-white rounded-xl border border-[#E2DDD4] p-6 sm:p-8 transition-transform duration-250 ease-out shadow-lg"
          >
            {/* Fine Perforated Top Edge */}
            <div className="absolute top-0 left-6 right-6 h-[1px] border-t border-dashed border-[#D5CFC4]" />

            {/* Document Header */}
            <div className="flex items-start justify-between pb-4 border-b border-[#EFECE4] mb-4">
              <div>
                <span className="text-[10px] font-mono font-bold tracking-widest text-[#8A8474] uppercase block">
                  ORIGINAL COMMERCIAL INVOICE
                </span>
                <span className="font-mono text-sm font-bold text-[#0A1128] mt-0.5 block">
                  INV/2024-25/00891
                </span>
              </div>
              <div className="text-right">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-mono font-bold tracking-wider bg-[#F3EFE3] text-[#0A1128] border border-[#E2DDD4]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#386641] inline-block" />
                  VERIFIED TRADE
                </span>
              </div>
            </div>

            {/* Main Instrument Telemetry: Value & Term */}
            <div className="grid grid-cols-2 gap-4 py-3 bg-[#FAF8F3] rounded-lg p-3.5 border border-[#EFECE4] mb-4">
              <div>
                <span className="text-[10px] font-mono font-bold text-[#8A8474] uppercase tracking-wider block">
                  INVOICE FACE VALUE
                </span>
                <span className="font-mono text-xl sm:text-2xl font-bold text-[#0A1128] tracking-tight block mt-0.5">
                  ₹25,00,000
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-mono font-bold text-[#8A8474] uppercase tracking-wider block">
                  PAYMENT TENOR
                </span>
                <span className="font-mono text-sm font-bold text-[#0A1128] mt-1 block">
                  NET 45 DAYS
                </span>
              </div>
            </div>

            {/* Originator & Debtor Counterparties */}
            <div className="flex flex-col gap-2.5 text-xs pb-4 border-b border-[#F0ECE1] mb-4">
              <div className="flex justify-between items-start">
                <span className="text-[#8A8474] font-medium">Supplier (Originator)</span>
                <span className="font-semibold text-[#0A1128] text-right">
                  Acme Textiles India Pvt Ltd
                </span>
              </div>
              <div className="flex justify-between items-start">
                <span className="text-[#8A8474] font-medium">Debtor (Corporate Buyer)</span>
                <span className="font-semibold text-[#0A1128] text-right">
                  Reliance Retail Ltd
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#8A8474] font-medium">Sector & Goods</span>
                <span className="text-[#0A1128] font-medium">
                  Textiles & Apparel (Yarn)
                </span>
              </div>
            </div>

            {/* Risk Assessment & Decoupled Underwriting */}
            <div className="space-y-2 mb-5">
              <div className="flex justify-between items-center text-[11px] font-mono">
                <span className="text-[#8A8474]">ORIGINATOR CREDIT SCORE</span>
                <span className="font-bold text-[#B45309]">MODERATE (22/100)</span>
              </div>
              <div className="w-full bg-[#EFECE4] rounded-full h-1.5 overflow-hidden">
                <div className="bg-[#B45309] h-1.5 rounded-full w-[22%]" />
              </div>

              <div className="flex justify-between items-center text-[11px] font-mono pt-1">
                <span className="text-[#8A8474]">DEBTOR SOVEREIGN SOLVENCY</span>
                <span className="font-bold text-[#386641]">PRIME AAA (12/100)</span>
              </div>
              <div className="w-full bg-[#EFECE4] rounded-full h-1.5 overflow-hidden">
                <div className="bg-[#386641] h-1.5 rounded-full w-[88%]" />
              </div>
            </div>

            {/* Live Clearing Settlement Footer / Stamp */}
            <div className="pt-3 border-t border-[#EFECE4] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#061226]" />
                <span className="text-[10px] font-mono font-bold text-[#0A1128] uppercase tracking-wider">
                  MARKETPLACE SETTLEMENT STATUS
                </span>
              </div>
              <span className="text-xs font-mono font-bold text-[#386641] bg-[#E8F0EA] px-2.5 py-0.5 rounded-md border border-[#D1E2D6]">
                OPTIMAL CLEARING: 8.2% APR
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

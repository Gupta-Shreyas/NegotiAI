"use client";

import { useState, useEffect, useRef, useMemo, useCallback, memo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { SEED_INVOICES } from "@/data/seed-invoices";
import { PROVIDERS } from "@/lib/providers";
import DocumentAnalysisAnimation from "@/components/DocumentAnalysisAnimation";
import MagneticButton from "@/components/MagneticButton";
import TactileCard from "@/components/TactileCard";

function getRiskLevel(score) {
  if (score <= 30) return { label: "Low Risk", color: "#386641", barColor: "#386641" };
  if (score <= 60) return { label: "Moderate Risk", color: "#B45309", barColor: "#D97706" };
  return { label: "High Risk", color: "#DC2626", barColor: "#DC2626" };
}

function formatDate(dueInDays) {
  const d = new Date();
  d.setDate(d.getDate() + dueInDays);
  return d.toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" });
}

function formatCurrency(amount) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatSector(sector) {
  if (!sector) return "";
  return sector
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

/* ==========================================================================
   ISOLATED MEMOIZED SUBCOMPONENTS (Zero re-renders on unrelated state changes)
   ========================================================================== */

/**
 * 1. ADAPTIVE MEMORY SWITCH
 * Isolated component: Toggling this does NOT trigger re-renders in tables or transcript!
 */
const AdaptiveMemorySwitch = memo(function AdaptiveMemorySwitch({ checked, onChange }) {
  return (
    <label className="flex items-center gap-3 cursor-pointer text-sm font-medium text-[#0A1128] select-none">
      <span>Adaptive Memory</span>
      <div className="relative inline-block w-11 h-6 shrink-0">
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className="sr-only peer"
        />
        <div className="w-11 h-6 bg-[#D5CFC4] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#061226]"></div>
      </div>
    </label>
  );
});

/**
 * 2. TRADE INSTRUMENT DETAILS CARD
 * Isolated component: Only re-renders when selected invoice changes.
 */
const TradeInstrumentCard = memo(function TradeInstrumentCard({
  selectedInvoice,
  invoiceIndex,
  onInvoiceChange,
  loading,
}) {
  return (
    <TactileCard className="bg-white border border-[#E2DDD4] rounded-xl p-6 shadow-sm relative overflow-hidden">
      <div className="flex items-center justify-between pb-3 border-b border-[#F0ECE1] mb-4">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#061226]" />
          <h2 className="font-serif text-lg font-bold text-[#0A1128] m-0">
            Trade Instrument
          </h2>
        </div>
        <span className="text-[10px] font-mono font-semibold text-[#8A8474] uppercase">
          {selectedInvoice.id}
        </span>
      </div>

      {/* Select Active Invoice Dropdown */}
      <div className="mb-4">
        <label className="block text-[10px] font-mono font-bold text-[#8A8474] uppercase tracking-wider mb-1.5">
          Select Active Trade
        </label>
        <select
          value={invoiceIndex}
          disabled={loading}
          onChange={(e) => onInvoiceChange(Number(e.target.value))}
          className="w-full p-2.5 rounded-lg border border-[#E2DDD4] bg-[#FAF8F3] text-[#0A1128] text-xs font-medium focus:ring-1 focus:ring-[#061226] outline-none truncate cursor-pointer disabled:opacity-60"
        >
          {SEED_INVOICES.map((inv, idx) => (
            <option key={inv.id} value={idx}>
              {inv.supplierName} → {inv.buyerName} ({formatCurrency(inv.amount)})
            </option>
          ))}
        </select>
      </div>

      {/* Prominent Invoice Value Banner */}
      <div className="p-3.5 bg-[#FAF8F3] border border-[#EFECE4] rounded-lg mb-4">
        <span className="text-[10px] font-mono font-bold tracking-widest text-[#8A8474] uppercase block">
          Invoice Face Value
        </span>
        <div className="font-mono text-2xl font-bold text-[#0A1128] tracking-tight leading-none mt-1">
          {formatCurrency(selectedInvoice.amount)}
        </div>
      </div>

      {/* Detailed Ledger Metadata */}
      <div className="flex flex-col gap-2.5 text-xs">
        <div className="flex justify-between items-start py-1.5 border-b border-[#F5F2EB]">
          <span className="text-[#8A8474]">Supplier (Originator)</span>
          <span className="font-medium text-[#0A1128] text-right max-w-[170px] leading-tight">
            {selectedInvoice.supplierName}
          </span>
        </div>
        <div className="flex justify-between items-start py-1.5 border-b border-[#F5F2EB]">
          <span className="text-[#8A8474]">Buyer (Debtor)</span>
          <span className="font-medium text-[#0A1128] text-right max-w-[170px] leading-tight">
            {selectedInvoice.buyerName}
          </span>
        </div>
        <div className="flex justify-between items-center py-1.5 border-b border-[#F5F2EB]">
          <span className="text-[#8A8474]">Sector</span>
          <span className="font-medium text-[#0A1128]">
            {formatSector(selectedInvoice.sector)}
          </span>
        </div>
        <div className="flex justify-between items-center py-1.5">
          <span className="text-[#8A8474]">Due Date</span>
          <span className="font-mono font-medium text-[#0A1128]">
            {formatDate(selectedInvoice.dueInDays)} ({selectedInvoice.dueInDays}D)
          </span>
        </div>
      </div>
    </TactileCard>
  );
});

/**
 * 3. RISK ASSESSMENT CARD
 * Isolated component: Only re-renders when counterparty scores change.
 */
const RiskAssessmentCard = memo(function RiskAssessmentCard({
  supplierRiskScore,
  buyerRiskScore,
  supplierRiskInfo,
  buyerRiskInfo,
}) {
  return (
    <TactileCard className="bg-white border border-[#E2DDD4] rounded-xl p-6 shadow-sm">
      <div className="flex items-center justify-between pb-3 border-b border-[#F0ECE1] mb-4">
        <h2 className="font-serif text-lg font-bold text-[#0A1128] m-0">
          Risk Assessment
        </h2>
        <span className="text-[10px] font-mono text-[#8A8474] uppercase">
          Dual Credit Model
        </span>
      </div>

      <div className="flex flex-col gap-4">
        <div>
          <div className="flex justify-between items-center text-xs mb-1.5">
            <span className="font-semibold text-[#0A1128]">Supplier Risk (Originator)</span>
            <span className="font-mono text-xs font-bold" style={{ color: supplierRiskInfo.color }}>
              {supplierRiskInfo.label} · {supplierRiskScore}/100
            </span>
          </div>
          <div className="w-full bg-[#EFECE4] rounded-full h-2 overflow-hidden">
            <div
              className="h-2 rounded-full transition-all duration-300"
              style={{
                width: `${supplierRiskScore}%`,
                backgroundColor: supplierRiskInfo.barColor,
              }}
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center text-xs mb-1.5">
            <span className="font-semibold text-[#0A1128]">Buyer Risk (Debtor Payer)</span>
            <span className="font-mono text-xs font-bold" style={{ color: buyerRiskInfo.color }}>
              {buyerRiskInfo.label} · {buyerRiskScore}/100
            </span>
          </div>
          <div className="w-full bg-[#EFECE4] rounded-full h-2 overflow-hidden">
            <div
              className="h-2 rounded-full transition-all duration-300"
              style={{
                width: `${buyerRiskScore}%`,
                backgroundColor: buyerRiskInfo.barColor,
              }}
            />
          </div>
        </div>
      </div>
    </TactileCard>
  );
});

/**
 * 4. SELECTED OFFER (DECISION MEMO)
 * Isolated component: Only re-renders when auction completes with winning deal.
 */
const SelectedOfferCard = memo(function SelectedOfferCard({ winningDeal, explanation, loading }) {
  return (
    <TactileCard className="bg-white border border-[#E2DDD4] rounded-xl p-6 shadow-sm">
      <div className="flex items-center justify-between pb-3 border-b border-[#F0ECE1] mb-4">
        <h2 className="font-serif text-lg font-bold text-[#0A1128] m-0">
          Selected Offer
        </h2>
        <span className="text-[10px] font-mono font-bold text-[#8A8474] uppercase">
          DECISION MEMO
        </span>
      </div>

      {winningDeal ? (
        <div className="animate-in fade-in slide-in-from-bottom-1 duration-200">
          <div className="flex items-center justify-between mb-3.5">
            <span className="font-serif text-lg font-bold text-[#0A1128]">
              {winningDeal.providerName}
            </span>
            <span className="inline-flex items-center gap-1 bg-[#E8F0EA] text-[#2D6A4F] text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full border border-[#D1E2D6]">
              ✓ Winning Offer
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs pb-4 border-b border-[#F0ECE1]">
            <div className="bg-[#FAF8F3] p-2.5 rounded-lg border border-[#EFECE4]">
              <span className="text-[#8A8474] text-[10px] font-mono block">FINAL RATE</span>
              <span className="font-mono font-bold text-[#0A1128] text-base">
                {winningDeal.terms.rate}%
              </span>
            </div>
            <div className="bg-[#FAF8F3] p-2.5 rounded-lg border border-[#EFECE4]">
              <span className="text-[#8A8474] text-[10px] font-mono block">ADVANCE RATIO</span>
              <span className="font-mono font-bold text-[#0A1128] text-base">
                {winningDeal.terms.advanceRatePct}%
              </span>
            </div>
            <div className="bg-[#FAF8F3] p-2.5 rounded-lg border border-[#EFECE4]">
              <span className="text-[#8A8474] text-[10px] font-mono block">FACILITY FEE</span>
              <span className="font-mono font-semibold text-[#0A1128]">
                {winningDeal.terms.feePct}%
              </span>
            </div>
            <div className="bg-[#FAF8F3] p-2.5 rounded-lg border border-[#EFECE4]">
              <span className="text-[#8A8474] text-[10px] font-mono block">CLEARANCE SPEED</span>
              <span className="font-mono font-semibold text-[#0A1128]">
                T+{winningDeal.terms.settlementDays}
              </span>
            </div>
          </div>

          <div className="mt-3.5">
            <h3 className="text-[10px] font-mono font-bold text-[#0A1128] uppercase tracking-wider mb-1.5">
              Executive Justification Memo
            </h3>
            <p className="text-xs text-[#4B5563] leading-relaxed m-0 bg-[#FAF8F3] p-3 rounded-lg border border-[#EFECE4] font-light">
              {explanation}
            </p>
          </div>
        </div>
      ) : (
        <div className="py-8 text-center text-xs text-[#8A8474]">
          <p className="m-0 italic">
            {loading
              ? "Evaluating best suitability match across provider offers…"
              : "Run negotiation to determine the optimal capital match."}
          </p>
        </div>
      )}
    </TactileCard>
  );
});

/**
 * 5. CAPITAL PROVIDERS COMPARISON TABLE
 * Isolated component: Only re-renders when offers or winner change.
 */
const CapitalProvidersMatrix = memo(function CapitalProvidersMatrix({ displayOffers, winnerId }) {
  return (
    <TactileCard className="bg-white border border-[#E2DDD4] rounded-xl p-6 shadow-sm overflow-hidden">
      <div className="flex items-center justify-between pb-3 border-b border-[#F0ECE1] mb-4">
        <h2 className="font-serif text-lg font-bold text-[#0A1128] m-0">
          Capital Providers Matrix
        </h2>
        <span className="text-[10px] font-mono font-bold text-[#8A8474] uppercase">
          3 Registered Pools
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="text-[10px] font-mono font-bold text-[#8A8474] border-b border-[#E2DDD4] uppercase tracking-wider">
              <th className="pb-3 pr-4">Provider Pool</th>
              <th className="pb-3 px-3 text-right">APR Rate</th>
              <th className="pb-3 px-3 text-right">Advance %</th>
              <th className="pb-3 px-3 text-right">Fee</th>
              <th className="pb-3 px-3 text-right">Settlement</th>
              <th className="pb-3 pl-3 text-right">Max Tenor</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F5F2EB]">
            {displayOffers.map((offer) => {
              const isWinner = offer.providerId === winnerId;
              return (
                <tr
                  key={offer.providerId}
                  className={`transition-colors duration-100 ${
                    isWinner
                      ? "bg-[#ECE6D8] font-medium shadow-xs"
                      : "hover:bg-[#FAF8F3]"
                  }`}
                >
                  <td className="py-3.5 pr-4 font-semibold text-[#0A1128]">
                    <div className="flex items-center gap-2">
                      {isWinner ? (
                        <span className="w-4 h-4 rounded-full bg-[#386641] text-white flex items-center justify-center shrink-0 text-[9px] font-bold">
                          ✓
                        </span>
                      ) : (
                        <span className="w-1.5 h-1.5 rounded-full bg-[#D5CFC4]" />
                      )}
                      <span className="font-serif text-sm">{offer.providerName}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-3 text-right font-mono font-bold text-sm text-[#0A1128]">
                    {offer.terms.rate}%
                  </td>
                  <td className="py-3.5 px-3 text-right font-mono font-medium">
                    {offer.terms.advanceRatePct}%
                  </td>
                  <td className="py-3.5 px-3 text-right font-mono font-medium text-[#6B7280]">
                    {offer.terms.feePct}%
                  </td>
                  <td className="py-3.5 px-3 text-right font-mono font-medium text-[#0A1128]">
                    {offer.terms.settlementDays === 1 ? "Same Day" : `T+${offer.terms.settlementDays}`}
                  </td>
                  <td className="py-3.5 pl-3 text-right font-mono font-medium text-[#8A8474]">
                    {offer.terms.tenorDaysMax} Days
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </TactileCard>
  );
});

/**
 * 6. NEGOTIATION TRANSCRIPT PANEL
 * Isolated component: When dialogue turns stream in, ONLY this component re-renders!
 */
const NegotiationTranscriptPanel = memo(function NegotiationTranscriptPanel({
  visibleTranscript,
  activeSpeaker,
  loading,
  isNegotiationActive,
  result,
  transcriptContainerRef,
  transcriptEndRef,
}) {
  return (
    <TactileCard className="bg-white border border-[#E2DDD4] rounded-xl p-6 shadow-sm flex-1">
      <div className="flex items-center justify-between pb-3 border-b border-[#F0ECE1] mb-4">
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${
            loading ? "bg-[#D97706] animate-pulse" : "bg-[#061226]"
          }`} />
          <h2 className="font-serif text-lg font-bold text-[#0A1128] m-0">
            Negotiation Dialogue Transcript
          </h2>
        </div>
        <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
          loading
            ? "bg-[#FEF3C7] text-[#B45309] border border-[#FDE68A]"
            : result
            ? "bg-[#E8F0EA] text-[#2D6A4F] border border-[#CDE0D3]"
            : "text-[#8A8474]"
        }`}>
          {loading
            ? "● LIVE MULTI-AGENT ROUNDS"
            : result
            ? "✓ SETTLEMENT AUDIT COMPLETE"
            : "STANDBY"}
        </span>
      </div>

      {/* LIVE ACTIVE DIALOGUE DISPLAY */}
      {isNegotiationActive ? (
        <div ref={transcriptContainerRef} className="flex flex-col gap-3.5 max-h-[520px] overflow-y-auto pr-1">
          {visibleTranscript.map((turn, i) => {
            const isSupplier = turn.speakerId === "supplier";
            return (
              <div
                key={i}
                className="flex flex-col gap-1 animate-in fade-in slide-in-from-bottom-1 duration-200"
              >
                <div className="flex items-center justify-between px-1">
                  <span className="text-[10px] font-mono font-bold tracking-widest text-[#8A8474] uppercase">
                    {turn.speaker} {isSupplier ? "· SUPPLIER AGENT" : "· CAPITAL PROVIDER"}
                  </span>
                  <span className="text-[9px] font-mono text-[#A09A8E]">
                    ROUND {turn.round || 1}
                  </span>
                </div>
                <div
                  className={`p-3.5 sm:p-4 rounded-xl text-xs sm:text-sm leading-relaxed ${
                    isSupplier
                      ? "bg-[#061226] text-white shadow-xs"
                      : "bg-[#FAF8F3] text-[#0A1128] border border-[#E5DFCE]"
                  }`}
                >
                  <p className="m-0">{turn.message}</p>
                  {turn.degraded && (
                    <span className="block mt-2 text-[10px] font-mono italic opacity-75">
                      (Standard rate benchmark applied)
                    </span>
                  )}
                </div>
              </div>
            );
          })}

          {/* Live Activity Indicator when next round is streaming */}
          {loading && (
            <div className="flex items-center gap-2.5 p-3.5 rounded-xl bg-[#FAF8F3] border border-[#E5DFCE] text-xs font-mono text-[#0A1128]">
              <span className="w-2 h-2 rounded-full bg-[#061226] animate-pulse" />
              <span>{activeSpeaker || "Autonomous capital providers negotiating terms…"}</span>
            </div>
          )}

          <div ref={transcriptEndRef} />
        </div>
      ) : (
        /* INTENTIONAL EDITORIAL EMPTY STATE BEFORE NEGOTIATION STARTS */
        <div className="py-14 px-4 text-center bg-[#FAF8F3] rounded-xl border border-dashed border-[#E2DDD4]">
          <div className="w-10 h-10 rounded-full bg-[#EFECE4] text-[#68533E] flex items-center justify-center mx-auto mb-3 border border-[#DED8CC]">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <h3 className="font-serif text-base font-bold text-[#0A1128] m-0 mb-1">
            No active negotiation session
          </h3>
          <p className="text-xs text-[#6B7280] m-0 max-w-md mx-auto font-light">
            Select a trade invoice above and click <strong>&quot;Start Negotiation&quot;</strong> to watch autonomous capital providers compete across rate, advance %, and speed in real time.
          </p>
        </div>
      )}
    </TactileCard>
  );
});

/* ==========================================================================
   MAIN PAGE ORCHESTRATOR
   ========================================================================== */

function NegotiatePageInner() {
  const searchParams = useSearchParams();
  const invoiceParam = searchParams.get("invoice");

  const initialInvoice = useMemo(() => {
    if (invoiceParam !== null) {
      const idx = Number(invoiceParam);
      if (!Number.isNaN(idx) && idx >= 0 && idx < SEED_INVOICES.length) {
        return idx;
      }
    }
    return 0;
  }, [invoiceParam]);

  const [invoiceIndex, setInvoiceIndex] = useState(initialInvoice);
  const [useMemory, setUseMemory] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [visibleTranscript, setVisibleTranscript] = useState([]);
  const [activeSpeaker, setActiveSpeaker] = useState(null);
  const [error, setError] = useState(null);
  const transcriptContainerRef = useRef(null);
  const transcriptEndRef = useRef(null);
  const isCancelledRef = useRef(false);

  useEffect(() => {
    return () => {
      isCancelledRef.current = true;
    };
  }, []);

  useEffect(() => {
    if (invoiceParam !== null) {
      const idx = Number(invoiceParam);
      if (!Number.isNaN(idx) && idx >= 0 && idx < SEED_INVOICES.length) {
        setInvoiceIndex(idx);
        setResult(null);
        setVisibleTranscript([]);
        setActiveSpeaker(null);
        setError(null);
      }
    }
  }, [invoiceParam]);

  // Clean, instantaneous invoice switching
  const handleInvoiceChange = useCallback((idx) => {
    if (loading) return;
    setInvoiceIndex(idx);
    setResult(null);
    setVisibleTranscript([]);
    setActiveSpeaker(null);
    setError(null);
  }, [loading]);

  // Instant toggle handler without re-rendering sibling cards
  const handleMemoryToggle = useCallback((e) => {
    setUseMemory(e.target.checked);
  }, []);

  const selectedInvoice = useMemo(() => SEED_INVOICES[invoiceIndex] || SEED_INVOICES[0], [invoiceIndex]);
  const supplierRiskInfo = useMemo(() => getRiskLevel(selectedInvoice.supplierRiskScore), [selectedInvoice.supplierRiskScore]);
  const buyerRiskInfo = useMemo(() => getRiskLevel(selectedInvoice.buyerRiskScore), [selectedInvoice.buyerRiskScore]);

  // Localized auto-scroll inside transcript container without window reflow
  useEffect(() => {
    if (visibleTranscript.length > 0) {
      if (transcriptEndRef.current) {
        transcriptEndRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
      } else if (transcriptContainerRef.current) {
        transcriptContainerRef.current.scrollTop = transcriptContainerRef.current.scrollHeight;
      }
    }
  }, [visibleTranscript]);

  const runNegotiation = useCallback(async () => {
    if (loading) return;
    isCancelledRef.current = false;
    setLoading(true);
    setError(null);
    setResult(null);
    setVisibleTranscript([]);
    setActiveSpeaker("Initiating multi-agent liquidity auction…");

    try {
      const res = await fetch("/api/negotiate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ invoiceIndex, useMemory }),
      });

      if (isCancelledRef.current) return;

      let data;
      try {
        data = await res.json();
      } catch {
        throw new Error("The server sent back an invalid response. Please try again.");
      }

      if (!res.ok) {
        throw new Error(data.error || "Negotiation request failed.");
      }

      const turns = data.transcript || [];

      // Stream dialogue progressively turn-by-turn with snappy 160ms cadence
      for (let i = 0; i < turns.length; i++) {
        if (isCancelledRef.current) return;
        const turn = turns[i];
        await new Promise((resolve) => setTimeout(resolve, 160));
        if (isCancelledRef.current) return;
        setVisibleTranscript((prev) => [...prev, turn]);
        setActiveSpeaker(i < turns.length - 1 ? `${turns[i + 1].speaker} reviewing counter-terms…` : null);
      }

      if (!isCancelledRef.current) {
        setActiveSpeaker(null);
        setResult(data);
      }
    } catch (e) {
      if (!isCancelledRef.current) {
        console.error("Negotiation error:", e);
        setError(e.message || "Something went wrong. Please try again.");
      }
    } finally {
      if (!isCancelledRef.current) {
        setLoading(false);
        setActiveSpeaker(null);
      }
    }
  }, [loading, invoiceIndex, useMemory]);

  const defaultProviderRows = useMemo(() => {
    return PROVIDERS.map((p) => ({
      providerId: p.id,
      providerName: p.name,
      terms: p.pricing(
        selectedInvoice.supplierRiskScore,
        selectedInvoice.buyerRiskScore,
        selectedInvoice
      ),
    }));
  }, [selectedInvoice]);

  const displayOffers = result?.offers || defaultProviderRows;
  const winnerId = result?.winningDeal?.providerId;
  const isNegotiationActive = loading || visibleTranscript.length > 0;

  return (
    <>
      {/* REFINED FINANCIAL NEGOTIATION ROOM HEADER */}
      <header className="flex flex-col md:flex-row md:items-center justify-between mb-8 pb-5 border-b border-[#E2DDD4] gap-4">
        <div>
          <div className="flex items-center gap-2.5 mb-1.5">
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold tracking-wider border ${
              loading
                ? "bg-[#FEF3C7] text-[#B45309] border-[#FDE68A]"
                : result
                ? "bg-[#E8F0EA] text-[#2D6A4F] border-[#CDE0D3]"
                : "bg-[#E7E2D6] text-[#061226] border-[#D5CFC4]"
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${
                loading
                  ? "bg-[#D97706] animate-ping"
                  : result
                  ? "bg-[#2D6A4F]"
                  : "bg-[#061226]"
              }`}></span>
              {loading
                ? "NEGOTIATION IN PROGRESS"
                : result
                ? "AUCTION CONCLUDED"
                : "ACTIVE NEGOTIATION ROOM"}
            </span>
            <span className="text-xs font-mono text-[#8A8474]">· SESSION #{selectedInvoice.id.slice(-5)}</span>
          </div>
          <h1 className="font-serif text-3xl font-bold text-[#0A1128] m-0">
            Live Capital Negotiation
          </h1>
          <p className="text-xs sm:text-sm text-[#6B7280] mt-1 m-0 font-light">
            Autonomous capital providers compete to discount verified Indian trade receivables.
          </p>
        </div>

        <div className="flex items-center gap-6">
          {/* ISOLATED ADAPTIVE MEMORY SWITCH */}
          <AdaptiveMemorySwitch
            checked={useMemory}
            onChange={handleMemoryToggle}
          />

          <MagneticButton
            onClick={runNegotiation}
            disabled={loading}
            className={`px-6 py-3 rounded-lg font-semibold text-sm transition-all duration-150 shadow-md ${
              loading
                ? "bg-[#061226] text-white cursor-wait opacity-85"
                : "bg-[#061226] text-white hover:bg-[#0F1E3D] active:scale-95"
            }`}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Evaluating Bids…
              </span>
            ) : result ? (
              "Re-Run Negotiation ↺"
            ) : (
              "Start Negotiation →"
            )}
          </MagneticButton>
        </div>
      </header>

      {/* ERROR BANNER */}
      {error && (
        <div className="mb-6 p-4 rounded-xl bg-[#FEE2E2] border border-[#FCA5A5] text-[#991B1B] flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-3">
            <svg className="w-5 h-5 text-[#DC2626] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <strong className="font-semibold text-xs sm:text-sm block">Negotiation Protocol Interrupted</strong>
              <span className="text-xs text-[#7F1D1D]">{error}</span>
            </div>
          </div>
          <MagneticButton
            onClick={runNegotiation}
            disabled={loading}
            className="px-3.5 py-1.5 rounded-lg bg-[#DC2626] text-white text-xs font-bold hover:bg-[#B91C1C] transition"
          >
            {loading ? "Retrying..." : "Retry Session"}
          </MagneticButton>
        </div>
      )}

      {/* LIVE PHYSICAL DOCUMENT ANALYSIS ANIMATION */}
      {loading && visibleTranscript.length === 0 && (
        <div className="mb-8">
          <DocumentAnalysisAnimation invoice={selectedInvoice} />
        </div>
      )}

      {/* WORKSPACE GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: INVOICE DETAILS, RISK PROFILE & SELECTED OFFER */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <TradeInstrumentCard
            selectedInvoice={selectedInvoice}
            invoiceIndex={invoiceIndex}
            onInvoiceChange={handleInvoiceChange}
            loading={loading}
          />

          <RiskAssessmentCard
            supplierRiskScore={selectedInvoice.supplierRiskScore}
            buyerRiskScore={selectedInvoice.buyerRiskScore}
            supplierRiskInfo={supplierRiskInfo}
            buyerRiskInfo={buyerRiskInfo}
          />

          <SelectedOfferCard
            winningDeal={result?.winningDeal}
            explanation={result?.explanation}
            loading={loading}
          />
        </div>

        {/* RIGHT COLUMN: CAPITAL PROVIDERS COMPARISON TABLE & TRANSCRIPT */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <CapitalProvidersMatrix
            displayOffers={displayOffers}
            winnerId={winnerId}
          />

          <NegotiationTranscriptPanel
            visibleTranscript={visibleTranscript}
            activeSpeaker={activeSpeaker}
            loading={loading}
            isNegotiationActive={isNegotiationActive}
            result={result}
            transcriptContainerRef={transcriptContainerRef}
            transcriptEndRef={transcriptEndRef}
          />
        </div>
      </div>
    </>
  );
}

export default function NegotiatePage() {
  return (
    <Suspense fallback={<div className="text-xs font-mono text-[#8A8474]">Loading negotiation terminal…</div>}>
      <NegotiatePageInner />
    </Suspense>
  );
}
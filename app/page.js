"use client";

import { useState } from "react";
import { SEED_INVOICES } from "@/data/seed-invoices";
import { PROVIDERS } from "@/lib/providers";

function getRiskLevel(score) {
  if (score <= 30) return { label: "Low", color: "#386641", barColor: "#4E7C59" };
  if (score <= 60) return { label: "Moderate", color: "#B45309", barColor: "#D97706" };
  return { label: "High", color: "#DC2626", barColor: "#EF4444" };
}

function formatDate(dueInDays) {
  const d = new Date();
  d.setDate(d.getDate() + dueInDays);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function formatCurrency(amount) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
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

export default function Home() {
  const [invoiceIndex, setInvoiceIndex] = useState(0);
  const [useMemory, setUseMemory] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const selectedInvoice = SEED_INVOICES[invoiceIndex] || SEED_INVOICES[0];
  const supplierRiskInfo = getRiskLevel(selectedInvoice.supplierRiskScore);
  const buyerRiskInfo = getRiskLevel(selectedInvoice.buyerRiskScore);

  async function runNegotiation() {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch("/api/negotiate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ invoiceIndex, useMemory }),
      });

      let data;
      try {
        data = await res.json();
      } catch {
        throw new Error(
          "The server sent back an unexpected response. Please try again."
        );
      }

      if (!res.ok) {
        throw new Error(data.error || "Negotiation request failed.");
      }
      setResult(data);
    } catch (e) {
      setError(e.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  // Pre-negotiation baseline pricing preview
  const defaultProviderRows = PROVIDERS.map((p) => {
    const terms = p.pricing(
      selectedInvoice.supplierRiskScore,
      selectedInvoice.buyerRiskScore,
      selectedInvoice
    );
    return {
      providerId: p.id,
      providerName: p.name,
      terms,
    };
  });

  const displayOffers = result?.offers || defaultProviderRows;
  const winnerId = result?.winningDeal?.providerId;

  return (
    <div className="flex min-h-screen bg-[#F6F3EC] text-[#0A1128]">
      {/* ================= SIDEBAR ================= */}
      <aside className="w-64 bg-[#ECE8DF] border-r border-[#E2DDD4] flex flex-col p-6 shrink-0">
        {/* Brand Header */}
        <div className="mb-10">
          <h1 className="font-serif text-2xl font-bold tracking-tight text-[#0A1128] m-0">
            NEGOTIA
          </h1>
          <div className="text-[10px] font-semibold tracking-widest text-[#6B7280] uppercase mt-1">
            AI Capital Negotiation
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-2">
          <button className="flex items-center gap-3 px-4 py-3 rounded-lg bg-[#E3DEC3] text-[#0A1128] font-semibold text-sm border-l-4 border-[#0A1128] shadow-sm text-left w-full transition">
            <svg className="w-5 h-5 text-[#0A1128]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
            Dashboard
          </button>

          <button className="flex items-center gap-3 px-4 py-3 rounded-lg text-[#525866] hover:bg-[#E4DFD5] text-sm font-medium text-left w-full transition">
            <svg className="w-5 h-5 text-[#6B7280]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
            Negotiations
          </button>

          <button className="flex items-center gap-3 px-4 py-3 rounded-lg text-[#525866] hover:bg-[#E4DFD5] text-sm font-medium text-left w-full transition">
            <svg className="w-5 h-5 text-[#6B7280]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Invoices
          </button>
        </nav>
      </aside>

      {/* ================= MAIN CONTENT ================= */}
      <main className="flex-1 p-8 overflow-y-auto max-w-[1400px] mx-auto w-full">
        {/* TOP HEADER BAR */}
        <header className="flex flex-col md:flex-row md:items-center justify-between mb-8 pb-4 border-b border-[#E2DDD4] gap-4">
          <div>
            <h1 className="font-serif text-3xl font-bold text-[#0A1128] m-0">
              Active Negotiation
            </h1>
            <p className="text-sm text-[#6B7280] mt-1 m-0">
              Reviewing capital deployment options.
            </p>
          </div>

          {/* CONTROLS: MEMORY TOGGLE & START NEGOTIATION BUTTON */}
          <div className="flex items-center gap-6">
            <label className="flex items-center gap-3 cursor-pointer text-sm font-medium text-[#0A1128] select-none">
              <span>Apply AI Memory</span>
              <div className="relative inline-block w-11 h-6">
                <input
                  type="checkbox"
                  checked={useMemory}
                  onChange={(e) => setUseMemory(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-[#D5CFC4] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#061226]"></div>
              </div>
            </label>

            <button
              onClick={runNegotiation}
              disabled={loading}
              className={`px-6 py-3 rounded-lg font-semibold text-sm transition-all duration-200 shadow-md ${
                loading
                  ? "bg-[#6B7280] text-white cursor-wait opacity-80"
                  : "bg-[#061226] text-white hover:bg-[#0F1E3D] active:scale-95"
              }`}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Negotiating...
                </span>
              ) : (
                "Start Negotiation"
              )}
            </button>
          </div>
        </header>

        {/* ERROR STATE ALERT */}
        {error && (
          <div className="mb-6 p-4 rounded-lg bg-[#FEE2E2] border border-[#FCA5A5] text-[#991B1B] flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 text-[#DC2626] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <strong className="font-semibold text-sm block">Negotiation Failed</strong>
                <span className="text-xs text-[#7F1D1D]">{error}</span>
              </div>
            </div>
            <button
              onClick={runNegotiation}
              disabled={loading}
              className="px-4 py-2 rounded bg-[#DC2626] text-white text-xs font-bold hover:bg-[#B91C1C] transition"
            >
              {loading ? "Retrying..." : "Try Again"}
            </button>
          </div>
        )}

        {/* ================= 2-COLUMN DASHBOARD GRID ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* ================= LEFT COLUMN (4 Cols) ================= */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            
            {/* INVOICE DETAILS CARD */}
            <section className="bg-white border border-[#E2DDD4] rounded-xl p-6 shadow-sm">
              <h2 className="font-serif text-xl font-bold text-[#0A1128] mb-5 border-b border-[#F0ECE1] pb-2">
                Invoice Details
              </h2>

              {/* Selector */}
              <div className="mb-4">
                <label className="block text-xs font-semibold text-[#6B7280] uppercase tracking-wider mb-2">
                  Select Invoice
                </label>
                <select
                  value={invoiceIndex}
                  onChange={(e) => setInvoiceIndex(Number(e.target.value))}
                  className="w-full p-2.5 rounded-lg border border-[#E2DDD4] bg-[#FBF9F4] text-[#0A1128] text-sm font-medium focus:ring-2 focus:ring-[#061226] outline-none"
                >
                  <option value={0}>INV-2024-01 — Acme Textiles</option>
                  <option value={1}>INV-2024-02 — Delta Manufacturing (Memory Demo)</option>
                  <option value={2}>INV-2024-03 — Riverside Foods</option>
                  <option value={3}>INV-2024-04 — Orbit Electronics</option>
                  <option value={4}>INV-2024-05 — Pioneer Steelworks</option>
                </select>
              </div>

              {/* Details Key-Value List */}
              <div className="flex flex-col gap-3 text-sm pt-2">
                <div className="flex justify-between items-center py-1 border-b border-[#F5F2EB]">
                  <span className="text-[#6B7280]">ID</span>
                  <span className="font-mono font-semibold text-[#0A1128]">
                    INV-2024-0{selectedInvoice.id.slice(-1)}
                  </span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-[#F5F2EB]">
                  <span className="text-[#6B7280]">Amount</span>
                  <span className="font-mono font-bold text-[#0A1128]">
                    {formatCurrency(selectedInvoice.amount)}
                  </span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-[#F5F2EB]">
                  <span className="text-[#6B7280]">Sector</span>
                  <span className="font-medium text-[#0A1128]">
                    {formatSector(selectedInvoice.sector)}
                  </span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-[#6B7280]">Due Date</span>
                  <span className="font-medium text-[#0A1128]">
                    {formatDate(selectedInvoice.dueInDays)} ({selectedInvoice.dueInDays} Days)
                  </span>
                </div>
              </div>
            </section>

            {/* RISK ASSESSMENT CARD */}
            <section className="bg-white border border-[#E2DDD4] rounded-xl p-6 shadow-sm">
              <h2 className="font-serif text-xl font-bold text-[#0A1128] mb-5 border-b border-[#F0ECE1] pb-2">
                Risk Assessment
              </h2>

              <div className="flex flex-col gap-5">
                {/* Supplier Risk */}
                <div>
                  <div className="flex justify-between items-center text-sm mb-1.5">
                    <span className="font-semibold text-[#0A1128]">Supplier Risk</span>
                    <span className="text-xs font-semibold" style={{ color: supplierRiskInfo.color }}>
                      {supplierRiskInfo.label} ({selectedInvoice.supplierRiskScore}/100)
                    </span>
                  </div>
                  <div className="w-full bg-[#EFECE4] rounded-full h-2.5 overflow-hidden">
                    <div
                      className="h-2.5 rounded-full transition-all duration-500"
                      style={{
                        width: `${selectedInvoice.supplierRiskScore}%`,
                        backgroundColor: supplierRiskInfo.barColor,
                      }}
                    ></div>
                  </div>
                </div>

                {/* Buyer Risk */}
                <div>
                  <div className="flex justify-between items-center text-sm mb-1.5">
                    <span className="font-semibold text-[#0A1128]">Buyer Risk</span>
                    <span className="text-xs font-semibold" style={{ color: buyerRiskInfo.color }}>
                      {buyerRiskInfo.label} ({selectedInvoice.buyerRiskScore}/100)
                    </span>
                  </div>
                  <div className="w-full bg-[#EFECE4] rounded-full h-2.5 overflow-hidden">
                    <div
                      className="h-2.5 rounded-full transition-all duration-500"
                      style={{
                        width: `${selectedInvoice.buyerRiskScore}%`,
                        backgroundColor: buyerRiskInfo.barColor,
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </section>

            {/* SELECTED OFFER (WINNER & RATIONALE) CARD */}
            <section className="bg-white border border-[#E2DDD4] rounded-xl p-6 shadow-sm">
              <h2 className="font-serif text-xl font-bold text-[#0A1128] mb-4 border-b border-[#F0ECE1] pb-2">
                Selected Offer
              </h2>

              {result?.winningDeal ? (
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="font-serif text-lg font-bold text-[#0A1128]">
                      {result.winningDeal.providerName}
                    </span>
                    <span className="inline-flex items-center gap-1 bg-[#E8F0EA] text-[#2D6A4F] text-xs font-bold px-2.5 py-0.5 rounded-full">
                      <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Winning Offer
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-sm pb-4 border-b border-[#F0ECE1]">
                    <div>
                      <span className="text-[#6B7280] block text-xs">Rate</span>
                      <span className="font-mono font-semibold text-[#0A1128]">
                        {result.winningDeal.terms.rate}%
                      </span>
                    </div>
                    <div>
                      <span className="text-[#6B7280] block text-xs">Advance Rate</span>
                      <span className="font-mono font-semibold text-[#0A1128]">
                        {result.winningDeal.terms.advanceRatePct}%
                      </span>
                    </div>
                    <div>
                      <span className="text-[#6B7280] block text-xs">Fee</span>
                      <span className="font-mono font-semibold text-[#0A1128]">
                        {result.winningDeal.terms.feePct}%
                      </span>
                    </div>
                    <div>
                      <span className="text-[#6B7280] block text-xs">Speed</span>
                      <span className="font-mono font-semibold text-[#0A1128]">
                        T+{result.winningDeal.terms.settlementDays}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4">
                    <h3 className="text-xs font-bold text-[#0A1128] uppercase tracking-wider mb-2">
                      Why This Offer Won
                    </h3>
                    <p className="text-xs text-[#4B5563] leading-relaxed m-0 bg-[#FBF9F4] p-3 rounded-lg border border-[#EFECE4]">
                      {result.explanation}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="py-6 text-center text-xs text-[#6B7280]">
                  <p className="m-0 italic">
                    Run negotiation to determine the optimal capital offer match.
                  </p>
                </div>
              )}
            </section>
          </div>

          {/* ================= RIGHT COLUMN (8 Cols) ================= */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            
            {/* CAPITAL PROVIDERS TABLE CARD */}
            <section className="bg-white border border-[#E2DDD4] rounded-xl p-6 shadow-sm overflow-hidden">
              <h2 className="font-serif text-xl font-bold text-[#0A1128] mb-5 border-b border-[#F0ECE1] pb-2">
                Capital Providers
              </h2>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm border-collapse">
                  <thead>
                    <tr className="text-xs font-semibold text-[#6B7280] border-b border-[#E2DDD4] uppercase tracking-wider">
                      <th className="pb-3 pr-4">Provider</th>
                      <th className="pb-3 px-3 text-right">Rate</th>
                      <th className="pb-3 px-3 text-right">Advance Rate</th>
                      <th className="pb-3 px-3 text-right">Fee</th>
                      <th className="pb-3 px-3 text-right">Speed</th>
                      <th className="pb-3 pl-3 text-right">Tenor</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F5F2EB]">
                    {displayOffers.map((offer) => {
                      const isWinner = offer.providerId === winnerId;
                      return (
                        <tr
                          key={offer.providerId}
                          className={`transition-colors ${
                            isWinner
                              ? "bg-[#ECE6D8] font-medium"
                              : "hover:bg-[#FBF9F4]"
                          }`}
                        >
                          <td className="py-3.5 pr-4 font-semibold text-[#0A1128]">
                            <div className="flex items-center gap-2">
                              {isWinner && (
                                <span className="w-4 h-4 rounded-full bg-[#386641] text-white flex items-center justify-center shrink-0">
                                  <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                  </svg>
                                </span>
                              )}
                              <span>{offer.providerName}</span>
                            </div>
                          </td>
                          <td className="py-3.5 px-3 text-right font-mono font-medium">
                            {offer.terms.rate}%
                          </td>
                          <td className="py-3.5 px-3 text-right font-mono font-medium">
                            {offer.terms.advanceRatePct}%
                          </td>
                          <td className="py-3.5 px-3 text-right font-mono font-medium">
                            {offer.terms.feePct}%
                          </td>
                          <td className="py-3.5 px-3 text-right font-mono font-medium">
                            {offer.terms.settlementDays === 1
                              ? "Same Day"
                              : `T+${offer.terms.settlementDays}`}
                          </td>
                          <td className="py-3.5 pl-3 text-right font-mono font-medium text-[#6B7280]">
                            {offer.terms.tenorDaysMax} Days
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </section>

            {/* NEGOTIATION TRANSCRIPT STREAM CARD */}
            <section className="bg-white border border-[#E2DDD4] rounded-xl p-6 shadow-sm flex-1">
              <h2 className="font-serif text-xl font-bold text-[#0A1128] mb-5 border-b border-[#F0ECE1] pb-2">
                Negotiation Transcript
              </h2>

              {result?.transcript && result.transcript.length > 0 ? (
                <div className="flex flex-col gap-4 max-h-[520px] overflow-y-auto pr-1">
                  {result.transcript.map((turn, i) => {
                    const isSupplier = turn.speakerId === "supplier";
                    return (
                      <div key={i} className="flex flex-col gap-1">
                        <span className="text-[10px] font-bold tracking-widest text-[#6B7280] uppercase px-1">
                          {turn.speaker} {isSupplier && "(AI)"}
                        </span>
                        <div
                          className={`p-4 rounded-xl text-sm leading-relaxed ${
                            isSupplier
                              ? "bg-[#061226] text-white shadow-sm"
                              : "bg-[#F3EFE3] text-[#0A1128] border border-[#E5DFCE]"
                          }`}
                        >
                          <p className="m-0">{turn.message}</p>
                          {turn.degraded && (
                            <span className="block mt-2 text-[11px] italic opacity-75">
                              (Standard rate pricing applied)
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="py-12 px-4 text-center bg-[#FBF9F4] rounded-xl border border-dashed border-[#E2DDD4]">
                  <svg className="w-8 h-8 text-[#A09A8E] mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  <p className="text-sm font-medium text-[#0A1128] m-0 mb-1">
                    No active negotiation session
                  </p>
                  <p className="text-xs text-[#6B7280] m-0 max-w-sm mx-auto">
                    Select an invoice above and click <strong>&quot;Start Negotiation&quot;</strong> to watch autonomous capital providers compete in real time.
                  </p>
                </div>
              )}
            </section>
          </div>

        </div>
      </main>
    </div>
  );
}
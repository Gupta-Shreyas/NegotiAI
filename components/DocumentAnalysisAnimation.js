"use client";

import { useState, useEffect } from "react";

const STAGES = [
  {
    step: "01",
    label: "EXTRACTING DATA",
    detail: "Parsing invoice telemetry, counterparty risk & verified trade fields",
  },
  {
    step: "02",
    label: "ANALYZING MARKET POSITION",
    detail: "Evaluating provider liquidity appetite, rate bands & tenor limits",
  },
  {
    step: "03",
    label: "IDENTIFYING LEVERAGE",
    detail: "Decoupling buyer creditworthiness & modeling trade-off frontier",
  },
  {
    step: "04",
    label: "GENERATING NEGOTIATION STRATEGY",
    detail: "Executing multi-agent counter-bids & optimizing clearing terms",
  },
];

export default function DocumentAnalysisAnimation({ invoice }) {
  const [activeStage, setActiveStage] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setActiveStage(1), 1100);
    const t2 = setTimeout(() => setActiveStage(2), 2300);
    const t3 = setTimeout(() => setActiveStage(3), 3600);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  const invRef = invoice?.id || "INV/2024-25/00891";
  const amountStr = invoice?.amount
    ? new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(invoice.amount)
    : "₹25,00,000";

  return (
    <div className="my-6 rounded-2xl bg-[#ECE8DF] border border-[#E2DDD4] p-6 lg:p-8 shadow-sm relative overflow-hidden transition-all duration-500">
      {/* Subtle desk texture / header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-[#DCD6CA]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#061226] text-white flex items-center justify-center shadow-sm">
            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
          <div>
            <div className="text-[11px] font-bold tracking-widest text-[#8A8474] uppercase">
              Financial Intelligence Desk
            </div>
            <h3 className="font-serif text-lg font-bold text-[#0A1128] m-0">
              Autonomous Capital Engine Reasoning
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-[#061226] animate-pulse"></span>
          <span className="text-xs font-mono font-semibold text-[#0A1128]">
            Round {activeStage + 1} / {STAGES.length}
          </span>
        </div>
      </div>

      {/* Main Analysis Workspace: Document resting on desk with scanning beam & data fragments */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* PHYSICAL INVOICE DOCUMENT UNDER SCAN */}
        <div className="lg:col-span-5 relative">
          {/* Layered paper depth effect */}
          <div className="absolute inset-0 bg-[#E5DFCE] rounded-xl transform translate-x-1.5 translate-y-1.5 border border-[#D5CEBC]"></div>
          <div className="absolute inset-0 bg-[#ECE5D6] rounded-xl transform translate-x-0.5 translate-y-0.5 border border-[#DDD6C5]"></div>

          <div className="relative bg-white rounded-xl border border-[#E2DDD4] p-5 shadow-md overflow-hidden">
            {/* Elegant Navy Scanning Line */}
            <div className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#061226] to-transparent animate-doc-scan pointer-events-none z-10"></div>
            <div className="absolute left-0 right-0 h-10 bg-gradient-to-b from-[#061226]/5 to-transparent pointer-events-none animate-doc-scan z-0"></div>

            {/* Document Header */}
            <div className="flex items-center justify-between pb-3 border-b border-[#F0ECE1] mb-3">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-sm bg-[#061226]"></div>
                <span className="font-mono text-xs font-bold text-[#0A1128]">{invRef}</span>
              </div>
              <span className="text-[10px] font-mono uppercase bg-[#F3EFE3] text-[#6B7280] px-2 py-0.5 rounded border border-[#E5DFCE]">
                Under Audit
              </span>
            </div>

            {/* Document Content Skeleton Lines with Active Highlights */}
            <div className="flex flex-col gap-2.5">
              <div className="flex justify-between items-center text-xs">
                <span className="text-[#6B7280]">Supplier:</span>
                <span className="font-medium text-[#0A1128] truncate max-w-[150px]">
                  {invoice?.supplierName || "Acme Textiles India"}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-[#6B7280]">Debtor (Buyer):</span>
                <span className="font-medium text-[#0A1128] truncate max-w-[150px]">
                  {invoice?.buyerName || "Reliance Retail Ltd"}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs pt-1 border-t border-[#F5F2EB]">
                <span className="text-[#6B7280]">Face Amount:</span>
                <span className="font-mono font-bold text-[#0A1128]">{amountStr}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-[#6B7280]">Tenor:</span>
                <span className="font-mono text-[#0A1128]">{invoice?.dueInDays || 45} Days</span>
              </div>
            </div>

            {/* Floating Data Point Tags */}
            <div className="mt-4 pt-3 border-t border-[#F0ECE1] flex flex-wrap gap-2">
              <span className="animate-float text-[10px] font-mono px-2 py-0.5 rounded bg-[#F6F3EC] border border-[#E2DDD4] text-[#0A1128]">
                Supplier Risk: {invoice?.supplierRiskScore || 22}
              </span>
              <span className="animate-float text-[10px] font-mono px-2 py-0.5 rounded bg-[#F6F3EC] border border-[#E2DDD4] text-[#0A1128]" style={{ animationDelay: "1s" }}>
                Buyer Risk: {invoice?.buyerRiskScore || 12}
              </span>
              <span className="animate-float text-[10px] font-mono px-2 py-0.5 rounded bg-[#061226] text-white" style={{ animationDelay: "1.8s" }}>
                Active Bidding: 3 Providers
              </span>
            </div>
          </div>
        </div>

        {/* PROCESSING STAGES TIMELINE */}
        <div className="lg:col-span-7 flex flex-col gap-2.5">
          {STAGES.map((s, idx) => {
            const isDone = idx < activeStage;
            const isCurrent = idx === activeStage;

            return (
              <div
                key={s.step}
                className={`p-3.5 rounded-xl border transition-all duration-300 ${
                  isCurrent
                    ? "bg-white border-[#061226] shadow-sm transform translate-x-1"
                    : isDone
                    ? "bg-[#F3EFE3] border-[#E2DDD4] opacity-90"
                    : "bg-[#FBF9F4]/60 border-[#E2DDD4]/50 opacity-40"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono text-xs font-bold text-[#8A8474]">{s.step}</span>
                    <span className={`text-xs font-bold tracking-wider ${isCurrent ? "text-[#061226]" : "text-[#4B5563]"}`}>
                      {s.label}
                    </span>
                  </div>

                  {isDone ? (
                    <span className="w-4 h-4 rounded-full bg-[#386641] text-white flex items-center justify-center text-[10px]">
                      ✓
                    </span>
                  ) : isCurrent ? (
                    <div className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#061226] animate-ping"></span>
                      <span className="text-[10px] font-mono font-semibold text-[#061226] uppercase">
                        Computing
                      </span>
                    </div>
                  ) : (
                    <span className="w-2 h-2 rounded-full bg-[#D5CFC4]"></span>
                  )}
                </div>

                <p className="m-0 text-xs text-[#6B7280] leading-snug pl-6">
                  {s.detail}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

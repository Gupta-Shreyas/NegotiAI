"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import MagneticButton from "@/components/MagneticButton";
import TactileCard from "@/components/TactileCard";

function getRiskLevel(score) {
  if (score <= 30) return { label: "Low", color: "#386641", bg: "#E8F0EA" };
  if (score <= 60) return { label: "Moderate", color: "#B45309", bg: "#FEF3C7" };
  return { label: "High", color: "#DC2626", bg: "#FEE2E2" };
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

function RowSkeleton() {
  return (
    <tr className="animate-pulse border-b border-[#F5F2EB]">
      <td className="py-4 pr-4"><div className="h-4 w-28 bg-[#EFECE4] rounded"></div></td>
      <td className="py-4 px-3"><div className="h-4 w-36 bg-[#EFECE4] rounded"></div></td>
      <td className="py-4 px-3"><div className="h-4 w-24 bg-[#EFECE4] rounded ml-auto"></div></td>
      <td className="py-4 px-3"><div className="h-5 w-16 bg-[#EFECE4] rounded-full"></div></td>
      <td className="py-4 px-3"><div className="h-5 w-16 bg-[#EFECE4] rounded-full"></div></td>
      <td className="py-4 px-3"><div className="h-5 w-20 bg-[#EFECE4] rounded-full"></div></td>
      <td className="py-4 pl-3 text-right"><div className="h-7 w-20 bg-[#EFECE4] rounded ml-auto"></div></td>
    </tr>
  );
}

let cachedInvoices = null;

export default function InvoiceQueuePage() {
  const router = useRouter();
  const [invoices, setInvoices] = useState(cachedInvoices || []);
  const [loading, setLoading] = useState(!cachedInvoices);

  useEffect(() => {
    let active = true;
    fetch("/api/dashboard-data")
      .then((res) => res.json())
      .then((data) => {
        if (active) {
          const invList = data.invoices || [];
          cachedInvoices = invList;
          setInvoices(invList);
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const totalValue = useMemo(
    () => invoices.reduce((acc, inv) => acc + (inv.amount || 0), 0),
    [invoices]
  );

  return (
    <>
      {/* EDITORIAL INVOICE LEDGER HEADER */}
      <header className="mb-8 pb-5 border-b border-[#E2DDD4]">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="font-mono text-xs font-bold text-[#8A8474]">03</span>
          <div className="h-[1px] w-6 bg-[#061226]/30" />
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#6B7280] font-bold">
            Registered Trade Instruments
          </span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
          <div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#0A1128] m-0">
              Invoice Ledger
            </h1>
            <p className="text-xs sm:text-sm text-[#6B7280] mt-1 m-0 font-light">
              Verified commercial invoices eligible for autonomous multi-provider auction.
            </p>
          </div>
          <div className="text-right">
            <span className="text-[10px] font-mono text-[#8A8474] block uppercase">Ledger Capital Value</span>
            <span className="font-mono text-lg font-bold text-[#0A1128]">
              {formatCurrency(totalValue)}
            </span>
          </div>
        </div>
      </header>

      <TactileCard className="bg-white border border-[#E2DDD4] rounded-xl p-6 sm:p-7 shadow-sm overflow-hidden">
        {!loading && invoices.length === 0 ? (
          <div className="py-16 text-center bg-[#FAF8F3] rounded-xl border border-dashed border-[#E2DDD4]">
            <div className="w-11 h-11 rounded-full bg-[#EFECE4] text-[#68533E] flex items-center justify-center mx-auto mb-3 border border-[#DED8CC]">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="font-serif text-base font-bold text-[#0A1128] m-0 mb-1">
              No invoices available
            </h3>
            <p className="text-xs text-[#6B7280] m-0 font-light">
              Check active seed records in <code className="font-mono text-[11px] bg-[#EFECE4] px-1.5 py-0.5 rounded">data/seed-invoices.js</code>.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm border-collapse">
              <thead>
                <tr className="text-[10px] font-mono font-bold text-[#8A8474] border-b border-[#E2DDD4] uppercase tracking-wider">
                  <th className="pb-3.5 pr-4">Invoice Reference</th>
                  <th className="pb-3.5 px-3">Counterparties</th>
                  <th className="pb-3.5 px-3">Sector</th>
                  <th className="pb-3.5 px-3 text-right">Face Value</th>
                  <th className="pb-3.5 px-3 text-center">Supplier Risk</th>
                  <th className="pb-3.5 px-3 text-center">Buyer Risk</th>
                  <th className="pb-3.5 px-3">Settlement Status</th>
                  <th className="pb-3.5 pl-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F5F2EB]">
                {loading
                  ? Array.from({ length: 5 }).map((_, i) => <RowSkeleton key={i} />)
                  : invoices.map((inv, idx) => {
                      const supplierRisk = getRiskLevel(inv.supplierRiskScore);
                      const buyerRisk = getRiskLevel(inv.buyerRiskScore);
                      const isMatched = inv.status === "matched";
                      return (
                        <tr
                          key={inv.id}
                          onClick={() => router.push(`/dashboard/negotiate?invoice=${idx}`)}
                          className="hover:bg-[#FAF8F3] transition-colors group cursor-pointer"
                        >
                          {/* Invoice Reference */}
                          <td className="py-4 pr-4">
                            <span className="font-mono text-xs font-bold text-[#0A1128] block">
                              {inv.id}
                            </span>
                            <span className="text-[10px] font-mono text-[#8A8474]">
                              Net {inv.dueInDays}D Tenor
                            </span>
                          </td>

                          {/* Counterparties */}
                          <td className="py-4 px-3">
                            <div className="text-xs font-semibold text-[#0A1128] leading-tight">
                              {inv.supplierName}
                            </div>
                            <div className="text-[11px] text-[#6B7280] font-light mt-0.5">
                              → {inv.buyerName}
                            </div>
                          </td>

                          {/* Sector */}
                          <td className="py-4 px-3 text-xs text-[#525866]">
                            {formatSector(inv.sector)}
                          </td>

                          {/* Face Value */}
                          <td className="py-4 px-3 text-right font-mono font-bold text-sm text-[#0A1128]">
                            {formatCurrency(inv.amount)}
                          </td>

                          {/* Supplier Risk Badge */}
                          <td className="py-4 px-3 text-center">
                            <span
                              className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full border border-current inline-block"
                              style={{ color: supplierRisk.color, backgroundColor: supplierRisk.bg }}
                            >
                              {supplierRisk.label} ({inv.supplierRiskScore})
                            </span>
                          </td>

                          {/* Buyer Risk Badge */}
                          <td className="py-4 px-3 text-center">
                            <span
                              className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full border border-current inline-block"
                              style={{ color: buyerRisk.color, backgroundColor: buyerRisk.bg }}
                            >
                              {buyerRisk.label} ({inv.buyerRiskScore})
                            </span>
                          </td>

                          {/* Status */}
                          <td className="py-4 px-3">
                            {isMatched ? (
                              <span className="inline-flex items-center gap-1.5 text-[11px] font-mono font-semibold px-2.5 py-1 rounded-full bg-[#E8F0EA] text-[#2D6A4F] border border-[#CDE0D3]">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#2D6A4F]"></span>
                                Matched · {inv.winningDeal?.providerName}
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 text-[11px] font-mono font-semibold px-2.5 py-1 rounded-full bg-[#FEF3C7] text-[#B45309] border border-[#FDE68A]">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#D97706]"></span>
                                Ready for Auction
                              </span>
                            )}
                          </td>

                          {/* Action Button */}
                          <td className="py-4 pl-3 text-right">
                            <MagneticButton
                              onClick={(e) => {
                                e.stopPropagation();
                                router.push(`/dashboard/negotiate?invoice=${idx}`);
                              }}
                              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition shadow-xs ${
                                isMatched
                                  ? "bg-white border border-[#CDE0D3] text-[#2D6A4F] hover:bg-[#E8F0EA]"
                                  : "bg-[#061226] text-white hover:bg-[#0F1E3D] hover:shadow-sm"
                              }`}
                            >
                              {isMatched ? "Review Deal →" : "Negotiate →"}
                            </MagneticButton>
                          </td>
                        </tr>
                      );
                    })}
              </tbody>
            </table>
          </div>
        )}
      </TactileCard>
    </>
  );
}
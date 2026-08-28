"use client";

import Link from "next/link";
import { useEffect, useState, useMemo } from "react";
import MagneticButton from "@/components/MagneticButton";
import TactileCard from "@/components/TactileCard";

function formatCurrency(amount) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

function StatCardSkeleton() {
  return (
    <div className="bg-white border border-[#E2DDD4] rounded-xl p-6 shadow-sm animate-pulse">
      <div className="h-3 w-24 bg-[#EFECE4] rounded mb-3"></div>
      <div className="h-8 w-28 bg-[#EFECE4] rounded mb-2"></div>
      <div className="h-2.5 w-20 bg-[#EFECE4] rounded"></div>
    </div>
  );
}

let cachedDashboardData = null;

export default function DashboardOverview() {
  const [data, setData] = useState(cachedDashboardData);

  useEffect(() => {
    let active = true;
    fetch("/api/dashboard-data")
      .then((res) => res.json())
      .then((fresh) => {
        if (active) {
          cachedDashboardData = fresh;
          setData(fresh);
        }
      })
      .catch(() => {
        if (active && !cachedDashboardData) {
          setData({ invoices: [], activityFeed: [], portfolios: [] });
        }
      });
    return () => {
      active = false;
    };
  }, []);

  const loading = !data;
  const invoices = data?.invoices || [];
  const activityFeed = data?.activityFeed || [];

  const { matched, totalFinanced, avgRate, statCards } = useMemo(() => {
    const m = invoices.filter((inv) => inv.status === "matched");
    const tf = invoices.reduce((sum, inv) => sum + inv.amount, 0);
    const ar =
      m.length > 0
        ? (
            m.reduce((sum, inv) => sum + inv.winningDeal.terms.rate, 0) /
            m.length
          ).toFixed(2)
        : "—";

    const cards = [
      {
        label: "TOTAL INVOICES",
        value: invoices.length,
        detail: "Registered trade instruments",
        trend: "5 available in seed queue",
      },
      {
        label: "MATCHED & SETTLED",
        value: `${m.length} / ${invoices.length}`,
        detail: `${((m.length / (invoices.length || 1)) * 100).toFixed(0)}% clearance rate`,
        trend: m.length > 0 ? "Bilateral settlement active" : "Awaiting first auction",
      },
      {
        label: "AVG. WINNING RATE",
        value: ar === "—" ? "—" : `${ar}%`,
        detail: "Weighted capital margin",
        trend: ar === "—" ? "Post-auction telemetry" : "Across settled providers",
      },
      {
        label: "TOTAL INVOICE VALUE",
        value: formatCurrency(tf),
        detail: "Face value under audit",
        trend: "Indian commercial paper",
      },
    ];

    return { matched: m, totalFinanced: tf, avgRate: ar, statCards: cards };
  }, [invoices]);

  return (
    <>
      {/* EDITORIAL WORKSPACE HEADER */}
      <header className="mb-8 pb-5 border-b border-[#E2DDD4]">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="font-mono text-xs font-bold text-[#8A8474]">01</span>
          <div className="h-[1px] w-6 bg-[#061226]/30" />
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#6B7280] font-bold">
            Terminal Portfolio Overview
          </span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#0A1128] m-0">
            Dashboard
          </h1>
          <span className="text-xs font-mono text-[#6B7280]">
            Autonomous Trade Finance & Liquidity Terminal
          </span>
        </div>
      </header>

      {/* 4 REFINED FINANCIAL INDICATOR METRIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => <StatCardSkeleton key={i} />)
          : statCards.map((stat) => (
              <TactileCard
                key={stat.label}
                className="bg-white border border-[#E2DDD4] rounded-xl p-6 shadow-sm hover:shadow-md hover:border-[#061226]/30 transition-all group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold text-[#8A8474] uppercase tracking-widest block">
                      {stat.label}
                    </span>
                    <div className="w-1.5 h-1.5 rounded-full bg-[#D5CFC4] group-hover:bg-[#061226] transition-colors" />
                  </div>
                  <div className="font-serif text-3xl sm:text-[2.1rem] font-bold text-[#0A1128] tracking-tight leading-none my-2.5">
                    {stat.value}
                  </div>
                </div>

                <div className="pt-3 border-t border-[#F0ECE1] flex items-center justify-between text-[11px] font-mono text-[#6B7280]">
                  <span>{stat.detail}</span>
                  <span className="text-[#8A8474] text-[10px]">{stat.trend}</span>
                </div>
              </TactileCard>
            ))}
      </div>

      {/* MAIN ACTIVITY & ACTION GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* RECENT ACTIVITY LEDGER */}
        <section className="lg:col-span-8 bg-white border border-[#E2DDD4] rounded-xl p-6 sm:p-7 shadow-sm">
          <div className="flex items-center justify-between mb-5 border-b border-[#F0ECE1] pb-3.5">
            <div className="flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-[#061226]"></span>
              <h2 className="font-serif text-xl font-bold text-[#0A1128] m-0">
                Recent Activity
              </h2>
            </div>
            <Link
              href="/dashboard/negotiate"
              className="text-xs font-mono font-semibold text-[#061226] hover:text-[#0F1E3D] hover:underline"
            >
              Run New Session →
            </Link>
          </div>

          {loading ? (
            <div className="flex flex-col gap-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="animate-pulse flex justify-between py-2.5 border-b border-[#F5F2EB]">
                  <div className="h-4 w-56 bg-[#EFECE4] rounded"></div>
                  <div className="h-4 w-16 bg-[#EFECE4] rounded"></div>
                </div>
              ))}
            </div>
          ) : activityFeed.length > 0 ? (
            <ul className="flex flex-col gap-1 list-none p-0 m-0">
              {activityFeed.map((entry, i) => (
                <li
                  key={i}
                  className="flex items-start justify-between text-xs sm:text-sm py-3 border-b border-[#F5F2EB] last:border-0 hover:bg-[#FBF9F4] px-2 rounded-lg transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#386641] shrink-0" />
                    <span className="text-[#0A1128] font-medium">{entry.message}</span>
                  </div>
                  <span className="text-xs text-[#8A8474] whitespace-nowrap ml-4 font-mono">
                    {new Date(entry.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            /* INTENTIONAL EDITORIAL EMPTY STATE */
            <div className="py-12 px-4 text-center bg-[#FAF8F3] rounded-xl border border-dashed border-[#E2DDD4]">
              <div className="w-11 h-11 rounded-full bg-[#EFECE4] text-[#68533E] flex items-center justify-center mx-auto mb-3 border border-[#DED8CC]">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="font-serif text-base font-bold text-[#0A1128] m-0 mb-1">
                No negotiations run yet
              </h3>
              <p className="text-xs text-[#6B7280] m-0 max-w-sm mx-auto mb-4 font-light">
                Select an active trade invoice from the ledger to initiate autonomous multi-agent settlement.
              </p>
              <Link href="/dashboard/negotiate">
                <span className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-[#061226] bg-white border border-[#E2DDD4] px-4 py-2 rounded-lg hover:bg-[#F3EFE3] transition shadow-xs">
                  Start Live Negotiation →
                </span>
              </Link>
            </div>
          )}
        </section>

        {/* QUICK ACTIONS & TERMINAL SPECS */}
        <section className="lg:col-span-4 flex flex-col gap-5">
          <div className="bg-white border border-[#E2DDD4] rounded-xl p-6 sm:p-7 shadow-sm">
            <h2 className="font-serif text-xl font-bold text-[#0A1128] mb-5 border-b border-[#F0ECE1] pb-3">
              Quick Actions
            </h2>
            <div className="flex flex-col gap-3">
              <Link href="/dashboard/negotiate" className="w-full">
                <MagneticButton className="w-full px-4 py-3 rounded-lg bg-[#061226] text-white text-xs sm:text-sm font-semibold text-center hover:bg-[#0F1E3D] transition shadow-sm flex items-center justify-center gap-2">
                  <span>Start New Negotiation</span>
                  <span className="text-xs font-mono opacity-80">→</span>
                </MagneticButton>
              </Link>
              <Link href="/dashboard/queue" className="w-full">
                <MagneticButton className="w-full px-4 py-3 rounded-lg bg-white border border-[#E2DDD4] text-[#0A1128] text-xs sm:text-sm font-semibold text-center hover:bg-[#FBF9F4] transition shadow-xs flex items-center justify-center gap-2">
                  <span>View Invoice Queue</span>
                  <span className="text-xs font-mono text-[#8A8474]">({invoices.length})</span>
                </MagneticButton>
              </Link>
            </div>
          </div>

          {/* CAPITAL MARKET INTELLIGENCE BADGE */}
          <div className="bg-[#FAF8F3] border border-[#E2DDD4] rounded-xl p-5 text-xs">
            <div className="flex items-center justify-between text-[#8A8474] font-mono text-[10px] uppercase font-bold mb-2">
              <span>PROTOCOL NOTE</span>
              <span>CSI ORIGIN 2026</span>
            </div>
            <p className="text-[#525866] leading-relaxed m-0 text-xs font-light">
              Multi-agent bilateral negotiation matches debtor credit to institutional capital pools, eliminating factoring spread arbitrage.
            </p>
          </div>
        </section>
      </div>
    </>
  );
}
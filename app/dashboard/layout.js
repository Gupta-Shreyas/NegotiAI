"use client";

import { useState, useCallback, memo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import MagneticButton from "@/components/MagneticButton";

const navItems = [
  {
    label: "Dashboard",
    href: "/dashboard",
    code: "01",
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
    ),
  },
  {
    label: "Negotiations",
    href: "/dashboard/negotiate",
    code: "02",
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
    ),
  },
  {
    label: "Invoices",
    href: "/dashboard/queue",
    code: "03",
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    ),
  },
  {
    label: "Portfolios",
    href: "/dashboard/portfolios",
    code: "04",
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m0 0a2 2 0 002 2h2a2 2 0 002-2v-3a2 2 0 00-2-2h-2a2 2 0 00-2 2v3z" />
    ),
  },
];

const Sidebar = memo(function Sidebar({ pathname, resetting, onReset }) {
  return (
    <aside className="w-68 bg-[#EDE8DF] border-r border-[#E2DDD4] flex flex-col p-6 shrink-0 relative z-20">
      {/* Brand Lockup */}
      <Link href="/" className="mb-8 flex items-center gap-4 no-underline group">
        <div className="w-[47px] h-[47px] rounded-xl p-0.5 bg-white border border-[#D5CFC4] shadow-sm shrink-0 group-hover:border-[#061226]/30 transition-colors">
          <img
            src="/assets/logo.png"
            alt="NegotiAI logo"
            className="w-full h-full rounded-[10px] object-cover"
          />
        </div>
        <div>
          <span className="font-serif text-[23px] font-bold tracking-tight text-[#0A1128] leading-none block group-hover:text-[#0F1E3D] transition-colors">
            NegotiAI
          </span>
          <span className="text-[10px] font-mono font-bold tracking-widest text-[#8A8474] uppercase mt-1.5 block">
            Capital Workspace
          </span>
        </div>
      </Link>

      {/* Navigation Section Label */}
      <div className="text-[10px] font-mono font-bold tracking-widest text-[#8A8474] uppercase px-3 mb-2.5 flex items-center gap-2">
        <span>NAVIGATION</span>
        <div className="h-[1px] flex-1 bg-[#DED8CC]" />
      </div>

      {/* Navigation Items */}
      <nav className="flex flex-col gap-1.5">
        {navItems.map((item) => {
          const isActive =
            item.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`group flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-medium w-full transition-colors duration-100 ${
                isActive
                  ? "bg-[#DFD9CC] text-[#061226] font-semibold border-l-[3px] border-[#061226] shadow-xs translate-x-0.5"
                  : "text-[#525866] hover:bg-[#E5DFD4] hover:text-[#061226]"
              }`}
            >
              <div className="flex items-center gap-3">
                <svg
                  className={`w-4 h-4 transition-colors ${
                    isActive ? "text-[#061226]" : "text-[#6B7280] group-hover:text-[#061226]"
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  {item.icon}
                </svg>
                <span>{item.label}</span>
              </div>
              <span className={`text-[10px] font-mono font-medium transition-colors ${
                isActive ? "text-[#061226]" : "text-[#8A8474] group-hover:text-[#525866]"
              }`}>
                {item.code}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* System Terminal Status Card */}
      <div className="mt-auto pt-6 flex flex-col gap-3.5 border-t border-[#DED8CC]">
        <div className="bg-[#E4DED3] border border-[#D5CFC4] rounded-lg p-3 text-[11px] font-mono">
          <div className="flex items-center justify-between text-[#8A8474] mb-1">
            <span>MARKET ENGINE</span>
            <span className="flex items-center gap-1 text-[#386641] font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-[#386641] inline-block animate-pulse"></span>
              ACTIVE
            </span>
          </div>
          <div className="text-[#0A1128] font-semibold text-[10px] truncate">
            Nash Equilibrium Protocol
          </div>
        </div>

        <MagneticButton
          onClick={onReset}
          disabled={resetting}
          className="w-full text-[11px] font-mono font-semibold px-3 py-2.5 rounded-lg border border-[#D5CFC4] bg-white/60 text-[#525866] hover:bg-white hover:text-[#061226] transition shadow-xs disabled:opacity-50 text-center"
        >
          {resetting ? "Resetting State…" : "Reset Ledger Data"}
        </MagneticButton>

        <div className="text-[10px] font-mono text-[#8A8474] flex items-center justify-between px-1">
          <span>TERMINAL v0.4</span>
          <span>INDIA 🇮🇳</span>
        </div>
      </div>
    </aside>
  );
});

export default function DashboardLayout({ children }) {
  const pathname = usePathname();
  const [resetting, setResetting] = useState(false);

  const handleReset = useCallback(async () => {
    if (!confirm("Reset all demo data? This clears every negotiated deal.")) return;
    setResetting(true);
    try {
      await fetch("/api/reset", { method: "POST" });
      window.location.reload();
    } finally {
      setResetting(false);
    }
  }, []);

  return (
    <div className="flex min-h-screen bg-[#F6F3EC] text-[#0A1128]">
      {/* LUXURY FINANCIAL NAVIGATION RAIL */}
      <Sidebar pathname={pathname} resetting={resetting} onReset={handleReset} />

      {/* MAIN WORKSPACE VIEWPORT */}
      <main className="flex-1 p-7 sm:p-9 lg:p-10 overflow-y-auto max-w-[1440px] mx-auto w-full">
        <div className="animate-page-enter">
          {children}
        </div>
      </main>
    </div>
  );
}
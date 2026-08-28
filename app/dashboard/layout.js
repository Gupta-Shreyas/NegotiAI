"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const navItems = [
    {
        label: "Dashboard",
        href: "/dashboard",
        icon: (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        ),
    },
    {
        label: "Negotiations",
        href: "/dashboard/negotiate",
        icon: (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
        ),
    },
    {
        label: "Invoices",
        href: "/dashboard/queue",
        icon: (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        ),
    },
    {
        label: "Portfolios",
        href: "/dashboard/portfolios",
        icon: (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m0 0a2 2 0 002 2h2a2 2 0 002-2v-3a2 2 0 00-2-2h-2a2 2 0 00-2 2v3z" />
        ),
    },
];

export default function DashboardLayout({ children }) {
    const pathname = usePathname();
    const router = useRouter();
    const [resetting, setResetting] = useState(false);

    async function handleReset() {
        if (!confirm("Reset all demo data? This clears every negotiated deal.")) return;
        setResetting(true);
        try {
            await fetch("/api/reset", { method: "POST" });
            window.location.reload();
        } finally {
            setResetting(false);
        }
    }

    return (
        <div className="flex min-h-screen bg-[#F6F3EC] text-[#0A1128]">
            <aside className="w-64 bg-[#ECE8DF] border-r border-[#E2DDD4] flex flex-col p-6 shrink-0">
                <div className="mb-10 flex items-center gap-3.5">
                    <img
                        src="/assets/logo.png"
                        alt="NegotiAI logo"
                        className="w-12 h-12 rounded-2xl object-cover shrink-0 shadow-sm"
                    />
                    <div>
                        <h1 className="font-serif text-3xl font-extrabold tracking-tight text-[#0A1128] m-0 leading-none">
                            NegotiAI
                        </h1>
                        <div className="text-[10px] font-bold tracking-widest text-[#6B7280] uppercase mt-1.5">
                            AI Capital Negotiation
                        </div>
                    </div>
                </div>

                <nav className="flex flex-col gap-2">
                    {navItems.map((item) => {
                        const isActive =
                            item.href === "/dashboard"
                                ? pathname === "/dashboard"
                                : pathname.startsWith(item.href);

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-left w-full transition ${isActive
                                    ? "bg-[#E3DEC3] text-[#0A1128] font-semibold border-l-4 border-[#0A1128] shadow-sm"
                                    : "text-[#525866] hover:bg-[#E4DFD5]"
                                    }`}
                            >
                                <svg
                                    className={`w-5 h-5 ${isActive ? "text-[#0A1128]" : "text-[#6B7280]"}`}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    {item.icon}
                                </svg>
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                <div className="mt-auto pt-6 flex flex-col gap-3">
                    <button
                        onClick={handleReset}
                        disabled={resetting}
                        className="text-xs font-semibold px-3 py-2 rounded-md border border-[#E2DDD4] text-[#6B7280] hover:bg-[#E4DFD5] hover:text-[#0A1128] transition disabled:opacity-50"
                    >
                        {resetting ? "Resetting…" : "Reset Demo Data"}
                    </button>
                    <div className="text-xs text-[#8A8474]">v0 · Made in India 🇮🇳</div>
                </div>
            </aside>

            <main className="flex-1 p-8 overflow-y-auto max-w-[1400px] mx-auto w-full">
                {children}
            </main>
        </div>
    );
}
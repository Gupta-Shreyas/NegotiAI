"use client";

import { useEffect, useState, useMemo } from "react";
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
            <div className="h-3 w-28 bg-[#EFECE4] rounded mb-3"></div>
            <div className="h-7 w-20 bg-[#EFECE4] rounded"></div>
        </div>
    );
}

function RowSkeleton() {
    return (
        <tr className="animate-pulse">
            <td className="py-4 pr-4"><div className="h-4 w-32 bg-[#EFECE4] rounded"></div></td>
            <td className="py-4 px-3"><div className="h-4 w-10 bg-[#EFECE4] rounded ml-auto"></div></td>
            <td className="py-4 px-3"><div className="h-4 w-20 bg-[#EFECE4] rounded ml-auto"></div></td>
            <td className="py-4 px-3"><div className="h-4 w-12 bg-[#EFECE4] rounded ml-auto"></div></td>
            <td className="py-4 pl-3"><div className="h-2 w-24 bg-[#EFECE4] rounded"></div></td>
        </tr>
    );
}

let cachedPortfolios = null;

export default function PortfoliosPage() {
    const [portfolios, setPortfolios] = useState(cachedPortfolios || []);
    const [loading, setLoading] = useState(!cachedPortfolios);

    useEffect(() => {
        let active = true;
        fetch("/api/dashboard-data")
            .then((res) => res.json())
            .then((data) => {
                if (active) {
                    const list = data.portfolios || [];
                    cachedPortfolios = list;
                    setPortfolios(list);
                }
            })
            .finally(() => {
                if (active) setLoading(false);
            });
        return () => {
            active = false;
        };
    }, []);

    const { sorted, totalDeals, totalFinanced, leader } = useMemo(() => {
        const s = [...portfolios].sort((a, b) => b.dealsWon - a.dealsWon);
        const td = portfolios.reduce((sum, p) => sum + p.dealsWon, 0);
        const tf = portfolios.reduce((sum, p) => sum + p.totalFinanced, 0);
        return { sorted: s, totalDeals: td, totalFinanced: tf, leader: s[0] };
    }, [portfolios]);

    return (
        <>
            <header className="mb-9 pb-5 border-b border-[#E2DDD4]">
                <h1 className="font-serif text-4xl font-bold text-[#0A1128] m-0">
                    Provider Portfolios
                </h1>
                <p className="text-base text-[#6B7280] mt-2 m-0">
                    How each capital provider is performing across negotiated deals.
                </p>
            </header>

            {!loading && portfolios.length === 0 ? (
                <TactileCard className="bg-white border border-[#E2DDD4] rounded-xl p-12 shadow-sm text-center">
                    <p className="text-base text-[#6B7280] m-0 mb-1">
                        No deals closed yet.
                    </p>
                    <p className="text-sm text-[#8A8474] m-0">
                        Run a negotiation to see providers start competing here.
                    </p>
                </TactileCard>
            ) : (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-9">
                        {loading
                            ? Array.from({ length: 3 }).map((_, i) => <StatCardSkeleton key={i} />)
                            : [
                                { label: "Total Deals Closed", value: totalDeals },
                                { label: "Total Capital Deployed", value: formatCurrency(totalFinanced) },
                                { label: "Leading Provider", value: leader?.providerName || "—" },
                            ].map((stat) => (
                                <TactileCard
                                    key={stat.label}
                                    className="bg-white border border-[#E2DDD4] rounded-xl p-6 shadow-sm"
                                >
                                    <span className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider">
                                        {stat.label}
                                    </span>
                                    <div className="font-serif text-3xl font-bold text-[#0A1128] mt-2.5">
                                        {stat.value}
                                    </div>
                                </TactileCard>
                            ))}
                    </div>

                    <TactileCard className="bg-white border border-[#E2DDD4] rounded-xl p-7 shadow-sm overflow-hidden">
                        <h2 className="font-serif text-2xl font-bold text-[#0A1128] mb-6 border-b border-[#F0ECE1] pb-3">
                            Leaderboard
                        </h2>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-base border-collapse">
                                <thead>
                                    <tr className="text-xs font-semibold text-[#6B7280] border-b border-[#E2DDD4] uppercase tracking-wider">
                                        <th className="pb-3 pr-4">Provider</th>
                                        <th className="pb-3 px-3 text-right">Deals Won</th>
                                        <th className="pb-3 px-3 text-right">Total Financed</th>
                                        <th className="pb-3 px-3 text-right">Avg. Rate</th>
                                        <th className="pb-3 pl-3">Market Share</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[#F5F2EB]">
                                    {loading
                                        ? Array.from({ length: 3 }).map((_, i) => <RowSkeleton key={i} />)
                                        : sorted.map((p, i) => {
                                            const share = totalDeals > 0 ? Math.round((p.dealsWon / totalDeals) * 100) : 0;
                                            const isLeader = i === 0;
                                            return (
                                                <tr
                                                    key={p.providerId}
                                                    className={`transition-colors ${isLeader ? "bg-[#ECE6D8]" : "hover:bg-[#FBF9F4]"}`}
                                                >
                                                    <td className="py-4 pr-4 font-semibold text-[#0A1128]">
                                                        <div className="flex items-center gap-2">
                                                            {isLeader && (
                                                                <span className="w-4 h-4 rounded-full bg-[#386641] text-white flex items-center justify-center shrink-0">
                                                                    <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20">
                                                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                                    </svg>
                                                                </span>
                                                            )}
                                                            <span>{p.providerName}</span>
                                                        </div>
                                                    </td>
                                                    <td className="py-4 px-3 text-right font-mono font-medium">
                                                        {p.dealsWon}
                                                    </td>
                                                    <td className="py-4 px-3 text-right font-mono font-medium">
                                                        {formatCurrency(p.totalFinanced)}
                                                    </td>
                                                    <td className="py-4 px-3 text-right font-mono font-medium">
                                                        {p.avgRate}%
                                                    </td>
                                                    <td className="py-4 pl-3">
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-24 bg-[#EFECE4] rounded-full h-2 overflow-hidden">
                                                                <div
                                                                    className="h-2 rounded-full bg-[#061226]"
                                                                    style={{ width: `${share}%` }}
                                                                ></div>
                                                            </div>
                                                            <span className="text-xs text-[#6B7280] font-mono">{share}%</span>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                </tbody>
                            </table>
                        </div>
                    </TactileCard>
                </>
            )}
        </>
    );
}
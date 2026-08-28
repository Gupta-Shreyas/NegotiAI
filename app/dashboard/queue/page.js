"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

function getRiskLevel(score) {
    if (score <= 30) return { label: "Low", color: "#386641" };
    if (score <= 60) return { label: "Moderate", color: "#B45309" };
    return { label: "High", color: "#DC2626" };
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
        <tr className="animate-pulse">
            <td className="py-4 pr-4"><div className="h-4 w-24 bg-[#EFECE4] rounded"></div></td>
            <td className="py-4 px-3"><div className="h-4 w-28 bg-[#EFECE4] rounded"></div></td>
            <td className="py-4 px-3"><div className="h-4 w-20 bg-[#EFECE4] rounded ml-auto"></div></td>
            <td className="py-4 px-3"><div className="h-5 w-16 bg-[#EFECE4] rounded-full"></div></td>
            <td className="py-4 px-3"><div className="h-5 w-16 bg-[#EFECE4] rounded-full"></div></td>
            <td className="py-4 px-3"><div className="h-5 w-20 bg-[#EFECE4] rounded-full"></div></td>
            <td className="py-4 pl-3"><div className="h-7 w-20 bg-[#EFECE4] rounded ml-auto"></div></td>
        </tr>
    );
}

export default function InvoiceQueuePage() {
    const router = useRouter();
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/dashboard-data")
            .then((res) => res.json())
            .then((data) => setInvoices(data.invoices || []))
            .finally(() => setLoading(false));
    }, []);

    return (
        <>
            <header className="mb-9 pb-5 border-b border-[#E2DDD4]">
                <h1 className="font-serif text-4xl font-bold text-[#0A1128] m-0">
                    Invoice Queue
                </h1>
                <p className="text-base text-[#6B7280] mt-2 m-0">
                    All invoices available for capital negotiation.
                </p>
            </header>

            <section className="bg-white border border-[#E2DDD4] rounded-xl p-7 shadow-sm overflow-hidden">
                {!loading && invoices.length === 0 ? (
                    <div className="py-16 text-center">
                        <p className="text-base font-medium text-[#0A1128] m-0 mb-1">
                            No invoices available.
                        </p>
                        <p className="text-sm text-[#6B7280] m-0">
                            Seed data appears to be empty — check{" "}
                            <code className="font-mono text-xs bg-[#F5F2EB] px-1.5 py-0.5 rounded">
                                data/seed-invoices.js
                            </code>.
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-base border-collapse">
                            <thead>
                                <tr className="text-xs font-semibold text-[#6B7280] border-b border-[#E2DDD4] uppercase tracking-wider">
                                    <th className="pb-3 pr-4">Invoice</th>
                                    <th className="pb-3 px-3">Sector</th>
                                    <th className="pb-3 px-3 text-right">Amount</th>
                                    <th className="pb-3 px-3">Supplier Risk</th>
                                    <th className="pb-3 px-3">Buyer Risk</th>
                                    <th className="pb-3 px-3">Status</th>
                                    <th className="pb-3 pl-3 text-right"></th>
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
                                            <tr key={inv.id} className="hover:bg-[#FBF9F4] transition-colors">
                                                <td className="py-4 pr-4 font-mono font-semibold text-[#0A1128]">
                                                    INV-2024-0{inv.id.slice(-1)}
                                                </td>
                                                <td className="py-4 px-3 text-[#0A1128]">
                                                    {formatSector(inv.sector)}
                                                </td>
                                                <td className="py-4 px-3 text-right font-mono font-medium text-[#0A1128]">
                                                    {formatCurrency(inv.amount)}
                                                </td>
                                                <td className="py-4 px-3">
                                                    <span
                                                        className="text-xs font-semibold px-2.5 py-1 rounded-full"
                                                        style={{ color: supplierRisk.color, backgroundColor: `${supplierRisk.color}1A` }}
                                                    >
                                                        {supplierRisk.label}
                                                    </span>
                                                </td>
                                                <td className="py-4 px-3">
                                                    <span
                                                        className="text-xs font-semibold px-2.5 py-1 rounded-full"
                                                        style={{ color: buyerRisk.color, backgroundColor: `${buyerRisk.color}1A` }}
                                                    >
                                                        {buyerRisk.label}
                                                    </span>
                                                </td>
                                                <td className="py-4 px-3">
                                                    {isMatched ? (
                                                        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#E8F0EA] text-[#2D6A4F]">
                                                            Matched — {inv.winningDeal.providerName}
                                                        </span>
                                                    ) : (
                                                        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#FDF3E2] text-[#B45309]">
                                                            Pending
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="py-4 pl-3 text-right">
                                                    <button
                                                        onClick={() => router.push(`/dashboard/negotiate?invoice=${idx}`)}
                                                        disabled={isMatched}
                                                        className={`px-3.5 py-2 rounded-md text-xs font-semibold transition ${isMatched
                                                            ? "bg-[#EFECE4] text-[#A09A8E] cursor-not-allowed"
                                                            : "bg-[#061226] text-white hover:bg-[#0F1E3D]"
                                                            }`}
                                                    >
                                                        {isMatched ? "Matched" : "Negotiate"}
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                            </tbody>
                        </table>
                    </div>
                )}
            </section>
        </>
    );
}
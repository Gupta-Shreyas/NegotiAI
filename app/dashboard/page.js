"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

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
            <div className="h-7 w-16 bg-[#EFECE4] rounded"></div>
        </div>
    );
}

export default function DashboardOverview() {
    const [data, setData] = useState(null);

    useEffect(() => {
        fetch("/api/dashboard-data")
            .then((res) => res.json())
            .then(setData)
            .catch(() => setData({ invoices: [], activityFeed: [], portfolios: [] }));
    }, []);

    const loading = !data;
    const invoices = data?.invoices || [];
    const activityFeed = data?.activityFeed || [];
    const portfolios = data?.portfolios || [];

    const matched = invoices.filter((inv) => inv.status === "matched");
    const totalFinanced = invoices.reduce((sum, inv) => sum + inv.amount, 0);
    const avgRate =
        matched.length > 0
            ? (
                matched.reduce((sum, inv) => sum + inv.winningDeal.terms.rate, 0) /
                matched.length
            ).toFixed(2)
            : "—";

    const statCards = [
        { label: "Total Invoices", value: invoices.length },
        { label: "Matched", value: `${matched.length} / ${invoices.length}` },
        { label: "Avg. Winning Rate", value: avgRate === "—" ? "—" : `${avgRate}%` },
        { label: "Total Invoice Value", value: formatCurrency(totalFinanced) },
    ];

    return (
        <>
            <header className="mb-9 pb-5 border-b border-[#E2DDD4]">
                <h1 className="font-serif text-4xl font-bold text-[#0A1128] m-0">
                    Dashboard
                </h1>
                <p className="text-base text-[#6B7280] mt-2 m-0">
                    Overview of your capital negotiation activity.
                </p>
            </header>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-9">
                {loading
                    ? Array.from({ length: 4 }).map((_, i) => <StatCardSkeleton key={i} />)
                    : statCards.map((stat) => (
                        <div
                            key={stat.label}
                            className="bg-white border border-[#E2DDD4] rounded-xl p-6 shadow-sm"
                        >
                            <span className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider">
                                {stat.label}
                            </span>
                            <div className="font-serif text-3xl font-bold text-[#0A1128] mt-2.5">
                                {stat.value}
                            </div>
                        </div>
                    ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                <section className="lg:col-span-8 bg-white border border-[#E2DDD4] rounded-xl p-7 shadow-sm">
                    <div className="flex items-center justify-between mb-6 border-b border-[#F0ECE1] pb-3">
                        <h2 className="font-serif text-2xl font-bold text-[#0A1128] m-0">
                            Recent Activity
                        </h2>
                        <Link
                            href="/dashboard/negotiate"
                            className="text-sm font-semibold text-[#0A1128] hover:underline"
                        >
                            Run new →
                        </Link>
                    </div>

                    {loading ? (
                        <div className="flex flex-col gap-4">
                            {Array.from({ length: 3 }).map((_, i) => (
                                <div key={i} className="animate-pulse flex justify-between py-2">
                                    <div className="h-4 w-48 bg-[#EFECE4] rounded"></div>
                                    <div className="h-4 w-16 bg-[#EFECE4] rounded"></div>
                                </div>
                            ))}
                        </div>
                    ) : activityFeed.length > 0 ? (
                        <ul className="flex flex-col gap-3.5">
                            {activityFeed.map((entry, i) => (
                                <li
                                    key={i}
                                    className="flex items-start justify-between text-sm py-2.5 border-b border-[#F5F2EB] last:border-0"
                                >
                                    <span className="text-[#0A1128] text-base">{entry.message}</span>
                                    <span className="text-sm text-[#6B7280] whitespace-nowrap ml-4">
                                        {new Date(entry.timestamp).toLocaleTimeString()}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="py-12 text-center text-base text-[#6B7280]">
                            No negotiations run yet.{" "}
                            <Link href="/dashboard/negotiate" className="font-semibold text-[#0A1128] hover:underline">
                                Start one →
                            </Link>
                        </div>
                    )}
                </section>

                <section className="lg:col-span-4 bg-white border border-[#E2DDD4] rounded-xl p-7 shadow-sm">
                    <h2 className="font-serif text-2xl font-bold text-[#0A1128] mb-6 border-b border-[#F0ECE1] pb-3">
                        Quick Actions
                    </h2>
                    <div className="flex flex-col gap-3.5">
                        <Link
                            href="/dashboard/negotiate"
                            className="px-4 py-3.5 rounded-lg bg-[#061226] text-white text-base font-semibold text-center hover:bg-[#0F1E3D] transition"
                        >
                            Start New Negotiation
                        </Link>
                        <Link
                            href="/dashboard/queue"
                            className="px-4 py-3.5 rounded-lg border border-[#E2DDD4] text-[#0A1128] text-base font-semibold text-center hover:bg-[#FBF9F4] transition"
                        >
                            View Invoice Queue
                        </Link>
                    </div>
                </section>
            </div>
        </>
    );
}
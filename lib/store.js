// lib/store.js
// Server-side in-memory state. Resets on server restart — fine for a demo.
// Single source of truth for invoice status and provider portfolios across
// the dashboard's different views (queue, negotiation, portfolios, feed).

import { SEED_INVOICES } from "@/data/seed-invoices";

// Module-level state persists across requests as long as the Node process
// stays alive (i.e. for the life of `npm run dev` / one deployed instance).
const globalState = globalThis.__NEGOTIAI_STORE__ || {
    invoices: SEED_INVOICES.map((inv) => ({
        ...inv,
        status: "pending", // pending | matched
        winningDeal: null,
    })),
    activityFeed: [], // { timestamp, message }
};
globalThis.__NEGOTIAI_STORE__ = globalState;

export function getInvoices() {
    return globalState.invoices;
}

export function getInvoiceById(id) {
    return globalState.invoices.find((inv) => inv.id === id);
}

export function markInvoiceMatched(id, winningDeal) {
    const invoice = globalState.invoices.find((inv) => inv.id === id);
    if (invoice) {
        invoice.status = "matched";
        invoice.winningDeal = winningDeal;
    }
    globalState.activityFeed.unshift({
        timestamp: new Date().toISOString(),
        message: `${id} matched with ${winningDeal.providerName} at ${winningDeal.terms.rate}%`,
    });
    // keep feed bounded
    globalState.activityFeed = globalState.activityFeed.slice(0, 20);
}

export function getActivityFeed() {
    return globalState.activityFeed;
}

export function getProviderPortfolios() {
    const matched = globalState.invoices.filter((inv) => inv.status === "matched" && inv.winningDeal);

    const portfolios = {};
    for (const inv of matched) {
        const deal = inv.winningDeal;
        if (!portfolios[deal.providerId]) {
            portfolios[deal.providerId] = {
                providerId: deal.providerId,
                providerName: deal.providerName,
                dealsWon: 0,
                totalFinanced: 0,
                rateSum: 0,
            };
        }
        const p = portfolios[deal.providerId];
        p.dealsWon += 1;
        p.totalFinanced += inv.amount;
        p.rateSum += deal.terms.rate;
    }

    return Object.values(portfolios).map((p) => ({
        ...p,
        avgRate: Math.round((p.rateSum / p.dealsWon) * 10) / 10,
    }));
}

export function resetStore() {
    globalState.invoices = SEED_INVOICES.map((inv) => ({
        ...inv,
        status: "pending",
        winningDeal: null,
    }));
    globalState.activityFeed = [];
}
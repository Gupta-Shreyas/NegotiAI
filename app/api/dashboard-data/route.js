import { NextResponse } from "next/server";
import { getInvoices, getActivityFeed, getProviderPortfolios } from "@/lib/store";

export async function GET() {
    return NextResponse.json({
        invoices: getInvoices(),
        activityFeed: getActivityFeed(),
        portfolios: getProviderPortfolios(),
    });
}
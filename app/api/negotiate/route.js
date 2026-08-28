import { NextResponse } from "next/server";
import { runNegotiation } from "@/lib/orchestrator";
import { SEED_INVOICES, SIMULATED_PRIOR_OUTCOME } from "@/data/seed-invoices";
import { markInvoiceMatched } from "@/lib/store"; // ← added

export async function POST(request) {
  const body = await request.json().catch(() => ({}));
  const invoiceIndex = body.invoiceIndex ?? 0;
  const useMemory = body.useMemory === true;

  const invoice = SEED_INVOICES[invoiceIndex];
  if (!invoice) {
    return NextResponse.json({ error: "Invalid invoice index" }, { status: 400 });
  }

  try {
    const priorOutcomes = useMemory ? SIMULATED_PRIOR_OUTCOME : {};
    const result = await runNegotiation(invoice, priorOutcomes);

    markInvoiceMatched(invoice.id, result.winningDeal); // ← added

    return NextResponse.json({ invoice, ...result });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Negotiation failed", detail: String(err) },
      { status: 500 }
    );
  }
}
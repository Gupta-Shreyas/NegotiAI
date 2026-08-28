// lib/providers.js
// Provider personas + the rules engine that constrains what each one can actually offer.
// The LLM writes the negotiation language; THIS file decides what numbers are valid.
// Keeps the model from inventing arithmetic — it reasons inside these bounds.

export const PROVIDERS = [
  {
    id: "bank_conservative",
    name: "Meridian Bank",
    persona:
      "A conservative, risk-averse commercial bank. Prioritizes safety over yield. " +
      "Speaks formally, cites risk policy, is slow to move off its opening position.",
    riskAppetite: "low",
    liquidityAvailable: 500000,
    maxExposurePerDeal: 100000,
    sectorPreference: null,
    // base rate + adjustments based on risk scores (0-100, higher = riskier)
    pricing: (supplierRisk, buyerRisk) => {
      const base = 8.5;
      const riskPremium = (supplierRisk * 0.04) + (buyerRisk * 0.06);
      return {
        rate: round1(base + riskPremium),
        advanceRatePct: clamp(85 - (buyerRisk * 0.3), 60, 90),
        feePct: round1(1.0 + (supplierRisk * 0.01)),
        settlementDays: buyerRisk > 50 ? 5 : 3,
        tenorDaysMax: 90,
      };
    },
  },
  {
    id: "fintech_aggressive",
    name: "Velocity Capital",
    persona:
      "An aggressive fintech lender chasing volume and market share. Casual tone, moves fast, " +
      "willing to take on more risk for higher yield, competitive on speed.",
    riskAppetite: "high",
    liquidityAvailable: 300000,
    maxExposurePerDeal: 150000,
    sectorPreference: null,
    pricing: (supplierRisk, buyerRisk) => {
      const base = 10.0;
      const riskPremium = (supplierRisk * 0.05) + (buyerRisk * 0.03);
      return {
        rate: round1(base + riskPremium),
        advanceRatePct: clamp(92 - (buyerRisk * 0.15), 75, 95),
        feePct: round1(1.8),
        settlementDays: 1,
        tenorDaysMax: 60,
      };
    },
  },
  {
    id: "nbfc_sector",
    name: "Anchor NBFC",
    persona:
      "A niche NBFC that specializes in manufacturing and industrial supply chains. " +
      "Warmer tone, cares about long-term relationships, gives better terms within its sector.",
    riskAppetite: "medium",
    liquidityAvailable: 200000,
    maxExposurePerDeal: 80000,
    sectorPreference: "manufacturing",
    pricing: (supplierRisk, buyerRisk, invoice) => {
      const sectorMatch = invoice?.sector === "manufacturing";
      const base = sectorMatch ? 8.0 : 9.5;
      const riskPremium = (supplierRisk * 0.03) + (buyerRisk * 0.05);
      return {
        rate: round1(base + riskPremium),
        advanceRatePct: clamp(sectorMatch ? 88 : 80, 60, 90),
        feePct: round1(1.2),
        settlementDays: 4,
        tenorDaysMax: 120,
      };
    },
  },
];

function round1(n) {
  return Math.round(n * 10) / 10;
}
function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

/**
 * Applies a round-2 "memory" adjustment to a provider based on a prior outcome.
 * Mutates a copy of memoryState, never the base PROVIDERS array.
 */
export function applyMemoryAdjustment(provider, priorOutcome) {
  const memory = { ...(provider.memoryState || {}) };
  if (priorOutcome?.buyerPaidLate) {
    memory.extraSettlementBufferDays = (memory.extraSettlementBufferDays || 0) + 2;
    memory.ratePenalty = (memory.ratePenalty || 0) + 0.5;
    memory.note = `Tightened terms after a late payment from a similar buyer profile.`;
  }
  return memory;
}

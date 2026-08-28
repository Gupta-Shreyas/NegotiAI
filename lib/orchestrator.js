
import { callLLM, delay } from "./llm";
import { PROVIDERS, applyMemoryAdjustment } from "./providers";

const MAX_TURNS_PER_PROVIDER = 3;

function withFallback(text, fallback) {
  const usedFallback = !text || text.trim().length === 0;
  return { text: usedFallback ? fallback : text, degraded: usedFallback };
}

/**
 * Runs a full negotiation round for one invoice against all providers.
 * Returns { transcript, offers, winningDeal, explanation }
 */
export async function runNegotiation(invoice, priorOutcomes = {}) {
  if (!invoice) throw new Error("No invoice provided to runNegotiation");
  if (!PROVIDERS || PROVIDERS.length === 0) throw new Error("No providers configured");

  const transcript = [];
  const finalOffers = [];

  for (const provider of PROVIDERS) {
    try {
      const { offer, turns } = await negotiateWithProvider(provider, invoice, priorOutcomes);
      transcript.push(...turns);
      finalOffers.push(offer);
    } catch (err) {
      // One provider failing entirely should not kill the whole negotiation —
      // fall back to its base rules-engine pricing with no LLM narration.
      console.warn(`${provider.name} failed entirely, using fallback offer:`, err.message || err);
      const fallbackTerms = provider.pricing(
        invoice.supplierRiskScore,
        invoice.buyerRiskScore,
        invoice
      );
      transcript.push({
        round: 1,
        speaker: provider.name,
        speakerId: provider.id,
        message: `${provider.name} submitted a standard offer without further negotiation.`,
        degraded: true,
        offerSnapshot: fallbackTerms,
      });
      finalOffers.push({
        providerId: provider.id,
        providerName: provider.name,
        terms: fallbackTerms,
        accepted: false,
      });
    }
  }

  if (finalOffers.length === 0) {
    throw new Error("All providers failed — no offers were generated");
  }

  const winningDeal = pickBestOffer(invoice, finalOffers);
  const explanation = await generateExplanation(invoice, finalOffers, winningDeal);

  return { transcript, offers: finalOffers, winningDeal, explanation };
}

/**
 * Runs the full negotiation for a single provider: opening offer, supplier
 * pushback, up to MAX_TURNS_PER_PROVIDER counter-offers.
 */
async function negotiateWithProvider(provider, invoice, priorOutcomes) {
  const turns = [];
  const memory = applyMemoryAdjustment(provider, priorOutcomes[provider.id]);
  const baseTerms = provider.pricing(invoice.supplierRiskScore, invoice.buyerRiskScore, invoice);

  const adjustedTerms = {
    ...baseTerms,
    rate: round1(baseTerms.rate + (memory.ratePenalty || 0)),
    settlementDays: baseTerms.settlementDays + (memory.extraSettlementBufferDays || 0),
  };

  let currentTerms = { ...adjustedTerms };
  let turnsUsed = 0;
  let accepted = false;

  const opening = withFallback(
    await callLLM(
      buildProviderSystemPrompt(provider, memory),
      buildOfferPrompt(invoice, currentTerms, memory),
      200
    ),
    `${provider.name} opens with an advance of ${currentTerms.advanceRatePct}% at ${currentTerms.rate}% APR and T+${currentTerms.settlementDays} settlement, reflecting ${invoice.buyerName}'s risk score (${invoice.buyerRiskScore}/100).`
  );
  turns.push({
    round: 1,
    speaker: provider.name,
    speakerId: provider.id,
    message: opening.text,
    degraded: opening.degraded,
    offerSnapshot: currentTerms,
  });
  await delay(150);

  while (turnsUsed < MAX_TURNS_PER_PROVIDER && !accepted) {
    const supplierTurn = withFallback(
      await callLLM(
        buildSupplierSystemPrompt(invoice),
        buildSupplierEvaluationPrompt(currentTerms, provider.name),
        200
      ),
      `Supplier Agent: "We are evaluating the ${currentTerms.rate}% APR offer. To optimize working capital, we request an improved advance ratio above ${currentTerms.advanceRatePct}%."`
    );
    turns.push({
      round: turnsUsed + 1,
      speaker: "Supplier Agent",
      speakerId: "supplier",
      message: supplierTurn.text,
      degraded: supplierTurn.degraded,
    });
    await delay(150);

    if (/accept|deal|agreed/i.test(supplierTurn.text)) {
      accepted = true;
      break;
    }

    currentTerms = counterOffer(currentTerms, provider);
    turnsUsed++;

    const counter = withFallback(
      await callLLM(
        buildProviderSystemPrompt(provider, memory),
        `The supplier pushed back: "${supplierTurn.text}". Offer a small concession: ${JSON.stringify(
          currentTerms
        )}. Stay in character.`,
        200
      ),
      `${provider.name} concedes: revised advance to ${currentTerms.advanceRatePct}% at ${currentTerms.rate}% APR with T+${currentTerms.settlementDays} disbursement.`
    );
    turns.push({
      round: turnsUsed,
      speaker: provider.name,
      speakerId: provider.id,
      message: counter.text,
      degraded: counter.degraded,
      offerSnapshot: currentTerms,
    });
    await delay(150);
  }

  return {
    turns,
    offer: {
      providerId: provider.id,
      providerName: provider.name,
      terms: currentTerms,
      accepted,
    },
  };
}

function counterOffer(terms, provider) {
  return {
    ...terms,
    rate: round1(Math.max(terms.rate - 0.3, 4)),
    settlementDays: Math.max(terms.settlementDays - 1, 1),
  };
}

/**
 * Suitability scoring — weighted by the SUPPLIER's stated priorities,
 * not just lowest rate. This is the core requirement of the problem statement.
 */
function pickBestOffer(invoice, offers) {
  const p = invoice.supplierPriorities || {
    rateWeight: 0.25,
    advanceRateWeight: 0.25,
    feeWeight: 0.25,
    settlementSpeedWeight: 0.25,
  };
  let best = null;
  let bestScore = -Infinity;

  for (const offer of offers) {
    const t = offer.terms;
    const rateScore = 1 - t.rate / 20;
    const advanceScore = t.advanceRatePct / 100;
    const feeScore = 1 - t.feePct / 5;
    const speedScore = 1 - t.settlementDays / 10;

    const score =
      rateScore * p.rateWeight +
      advanceScore * p.advanceRateWeight +
      feeScore * p.feeWeight +
      speedScore * p.settlementSpeedWeight;

    if (score > bestScore) {
      bestScore = score;
      best = offer;
    }
  }
  return { ...best, suitabilityScore: bestScore };
}

async function generateExplanation(invoice, offers, winningDeal) {
  const summaryOfOffers = offers
    .map((o) => `${o.providerName}: ${JSON.stringify(o.terms)}`)
    .join("\n");

  const result = withFallback(
    await callLLM(
      "You are a neutral marketplace explainer. Ground your answer only in the offers and the supplier's stated priorities. Do not invent numbers not given to you.",
      `Supplier priorities: ${JSON.stringify(invoice.supplierPriorities)}\n\n` +
      `All final offers:\n${summaryOfOffers}\n\n` +
      `Winning offer: ${winningDeal.providerName} - ${JSON.stringify(winningDeal.terms)}\n\n` +
      `In 3-4 sentences, explain why this offer was the best overall fit for the supplier, ` +
      `even if it was not the lowest rate. Be specific about which terms mattered most.`,
      250
    ),
    `${winningDeal.providerName}'s offer was selected as the best overall match for the supplier's stated priorities, balancing rate, advance amount, fees, and settlement speed.`
  );
  return result.text;
}

function buildProviderSystemPrompt(provider, memory) {
  return (
    `You are ${provider.name}, a capital provider in a supply-chain financing marketplace.\n` +
    `Persona: ${provider.persona}\n` +
    (memory.note ? `Context from past dealings: ${memory.note}\n` : "") +
    `Stay fully in character. Keep responses under 60 words. No preamble.`
  );
}

function buildSupplierSystemPrompt(invoice) {
  return (
    `You are the Supplier Agent negotiating financing for an invoice.\n` +
    `Your priorities (weights, higher = more important): ${JSON.stringify(
      invoice.supplierPriorities
    )}\n` +
    `Evaluate offers against these priorities, not just the rate. Push back if an offer doesn't match ` +
    `your top priority. Say "I accept" clearly if an offer is good enough. Keep responses under 50 words.`
  );
}

function buildOfferPrompt(invoice, terms, memory) {
  return (
    `A new invoice needs financing. Buyer risk score: ${invoice.buyerRiskScore}/100. ` +
    `Supplier risk score: ${invoice.supplierRiskScore}/100.\n` +
    `Your calculated terms: ${JSON.stringify(terms)}.\n` +
    `Open the negotiation with this offer, in character. Mention buyer risk if it affected your terms.`
  );
}

function buildSupplierEvaluationPrompt(terms, providerName) {
  return `${providerName} offered: ${JSON.stringify(terms)}. Respond in character — push back, ask a question, or accept.`;
}

function round1(n) {
  return Math.round(n * 10) / 10;
}
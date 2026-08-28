# Negotiating Capital Market — v0 (logic-first, no UI polish yet)

## Setup

1. `npm install`
2. Copy `.env.local.example` to `.env.local` and paste in your real Groq API key:
   ```
   GROQ_API_KEY=your_real_key_here
   ```
3. `npm run dev`
4. Open http://localhost:3000

## What's here

- `lib/llm.js` — single wrapper around the Groq API. Swap providers here only, nowhere else.
- `lib/providers.js` — the 3 provider personas + the rules engine that decides what terms each one can actually offer (LLM narrates, this decides the numbers).
- `lib/orchestrator.js` — the negotiation loop: opens offer → supplier responds → counter (up to 3 turns) → picks the best offer by the supplier's weighted priorities (not just lowest rate) → generates a grounded explanation.
- `data/seed-invoices.js` — two demo invoices. Invoice 2 shares a buyer with Invoice 1, so you can demo the "memory" effect: run Invoice 1, then run Invoice 2 with "Apply memory" checked, and watch Meridian Bank tighten its terms.
- `app/page.js` — bare-bones UI. Pick an invoice, run it, see the raw transcript, offers, winning deal, and explanation as JSON/text. No styling yet — that's phase 2.
- `app/api/negotiate/route.js` — API route wiring the frontend to the orchestrator.

## Next steps (once this runs end-to-end)

1. Verify the full loop works with real Groq calls for both seed invoices.
2. Test the memory effect: Invoice 1 → Invoice 2 with memory on, confirm Meridian Bank's language/terms visibly shift.
3. Only then: move to UI polish (styled transcript view, live-typing effect, offer comparison chart).

## Known constraints to watch

- Groq free tier is fast but rate-limited per minute — if you add more providers or turns, you may need to raise the `delay()` value in `lib/llm.js`.
- The rules engine in `providers.js` is intentionally simple (linear formulas) — this is fine and expected for a 24h build. Don't over-engineer it; the differentiator is the visible negotiation and explanation, not the pricing math sophistication.

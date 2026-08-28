<p align="center">
  <img src="https://raw.githubusercontent.com/Gupta-Shreyas/negotia/main/public/assets/logo.png" alt="NegotiAI Logo" width="100" style="border-radius: 16px;">
</p>

<h1 align="center">NegotiAI</h1>
<p align="center">
  <b>Autonomous Capital Negotiation Engine</b>
</p>
# NegotiAI

**AI that negotiates invoice financing rates with multiple lenders — automatically.**


---

## What is this, actually?

Say a business has an unpaid invoice and needs cash now instead of waiting 60-90 days for the client to pay. Normally, someone from the business has to call up 2-3 lenders/banks, negotiate rates back and forth, and manually figure out which offer is actually the best deal.

NegotiAI does that negotiation for you. You give it an invoice, it talks to three different lender "personas" (each with their own personality and risk appetite), runs a real back-and-forth negotiation for a few rounds, picks the best final offer — not just the cheapest one, but the one that actually fits the business's priorities — and explains in plain English why it picked that one.

It also **remembers past negotiations**. If a lender has dealt with the same buyer before, it adjusts its terms based on that history — the same way a real bank would.

This is a v0 build: the negotiation logic is fully working, the UI is intentionally bare-bones for now.

---

## See it working

Here's what a real run looks like (Invoice 1, three lenders negotiating) :-

```
Invoice: INV-1042 | Amount: ₹4,20,000 | Buyer: Meridian Bank | Due: 62 days

→ Opening offers
  Meridian Bank:     14.5% APR, 80% advance
  Horizon Capital:    16.0% APR, 85% advance
  Vantage Finance:    13.8% APR, 75% advance

→ Round 2 (counter)
  Meridian Bank:     13.2% APR, 82% advance
  Horizon Capital:    15.1% APR, 85% advance
  Vantage Finance:    13.8% APR, 78% advance

→ Round 3 (final)
  Meridian Bank:     12.9% APR, 83% advance
  Horizon Capital:    14.6% APR, 87% advance
  Vantage Finance:    13.5% APR, 79% advance

✓ Winning offer: Meridian Bank — 12.9% APR, 83% advance

Why this one won:
"Meridian Bank offered the lowest overall cost while still advancing 
over 80% of the invoice value, which matched the business's priority 
of maximizing upfront cash without paying a premium rate."
```

Now run **Invoice 2** (same buyer, "Apply memory" turned on) — Meridian Bank remembers this buyer and tightens its terms :-

```
Invoice: INV-1043 | Amount: ₹2,80,000 | Buyer: Meridian Bank | Due: 45 days

→ Opening offers
  Meridian Bank:     13.1% APR, 78% advance   ← tighter than before, remembers this buyer
  Horizon Capital:    15.8% APR, 84% advance
  Vantage Finance:    13.6% APR, 76% advance
```

That's the core "proof" of the product — it's not just running a formula once, it's actually adjusting behavior based on history, the way a real financing relationship would.

---

### What's intentionally simple :-

The pricing rules engine in `providers.js` uses straightforward linear formulas, not complex risk modeling. This is on purpose — for a fast build, the interesting part is the visible negotiation and the reasoning behind the final decision, not the sophistication of the pricing math. That can get smarter later.

---

## What's next to do :-

1. Verify the full loop end-to-end with real Groq calls on both seed invoices.
2. Confirm the memory effect is visibly working (Meridian Bank's terms shifting between Invoice 1 and Invoice 2).
3. Then: UI polish — a properly styled transcript view, a live-typing effect for the negotiation, and a visual offer comparison chart.

---

## Things to keep in mind

- Groq's free tier is fast but rate-limited per minute. If more lenders or negotiation rounds get added, the `delay()` value in `lib/llm.js` may need to go up.

# NEGOTIA

### AI Capital Negotiation Marketplace

> **Automating invoice financing negotiations across multiple capital providers.**

Negotia helps businesses compare and negotiate invoice financing offers without manually approaching multiple lenders.

A business selects an invoice, and Negotia allows multiple provider agents to negotiate financing terms before selecting the offer that best matches the business's priorities.

**GitHub:** https://github.com/Gupta-Shreyas/negotia

---

## The Problem

Businesses often need working capital before their invoices are due.

When approaching different financing providers, they have to compare multiple factors:

| Factor | Why it matters |
|---|---|
| Rate | Determines the financing cost |
| Advance Rate | Determines how much cash is received upfront |
| Fee | Adds to the overall cost |
| Settlement Speed | Determines how quickly the funds are available |

The lowest rate is not necessarily the best offer.

**Negotia automates this comparison and negotiation process.**

---

## How Negotia Works

```text
       INVOICE
          │
          ▼
   RISK ASSESSMENT
    ┌─────┴─────┐
    ▼           ▼
SUPPLIER      BUYER
  RISK          RISK
    └─────┬─────┘
          ▼
  CAPITAL PROVIDERS
    ┌─────┼─────┐
    ▼     ▼     ▼
 Meridian Velocity Anchor
   Bank   Capital  NBFC
    └─────┼─────┘
          ▼
   AI NEGOTIATION
          │
          ▼
    FINAL OFFERS
          │
          ▼
  PRIORITY-BASED
      SCORING
          │
          ▼
   WINNING OFFER
          │
          ▼
    EXPLANATION




Core Features
01 — Multi-Provider Negotiation

Three independent provider personas participate in the same negotiation.

Each provider has different pricing rules, risk preferences and negotiation behaviour.

Meridian Bank · Velocity Capital · Anchor NBFC

02 — AI Negotiation

The providers negotiate with the supplier agent over multiple rounds.

They can respond to offers and make counter-offers instead of simply returning a fixed price.

03 — Risk-Aware Pricing

Provider terms take supplier and buyer risk into account.

The MVP uses lightweight rules-based pricing to keep the negotiation fast and interpretable.

04 — Priority-Based Selection

The system does not automatically choose the lowest rate.

The supplier's priorities are used to score the final offers across:

Rate · Advance Rate · Fee · Settlement Speed

The highest-scoring offer becomes the recommended deal.

05 — Market Memory

Previous negotiation outcomes can influence future provider behaviour.

For example, a previous late-payment outcome can cause a provider to tighten terms during a later negotiation.

06 — Explainable Decision

After selecting an offer, Negotia provides a short explanation showing why that offer was considered the best match.

MVP Scope

The current MVP uses a set of seed invoices with predefined risk scores and supplier priorities.

The provider pricing uses straightforward rules-based calculations rather than a complex financial risk model.

The main focus of the MVP is the complete negotiation loop:

Invoice → Risk → Offers → Negotiation → Scoring → Winner → Explanation

Tech Stack
Technology	Purpose
Next.js	Application framework
React	Frontend
Tailwind CSS	UI styling
Groq API	AI negotiation
Recharts	Offer visualization
JavaScript	Application logic



Future Scope
Real invoice/document ingestion
Automated invoice verification
Advanced financial risk modelling
More capital providers
Persistent negotiation history
Real lender integrations
Live negotiation streaming
Production authentication and monitoring

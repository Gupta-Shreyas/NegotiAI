"use client";

import { useState, useEffect } from "react";

// 8 distinct, completely filled, dense financial newspaper broadsheets
const NEWSPAPERS = [
  {
    id: "paper-1",
    masthead: "THE CAPITAL LEDGER",
    motto: "A DAILY REGISTER OF TRADE, FINANCE & COMMERCIAL PAPER",
    meta: "LONDON & BOMBAY · VOL. CXIV · NO. 4,208 · PRICE THREE PENCE",
    leadHeadline: "SUPPLY-CHAIN FINANCE ENTERS A NEW ERA",
    leadSubhead: "AUTONOMOUS CAPITAL PROVIDERS COMPETE FOR QUALITY INVOICE REGISTRIES",
    upperStory: {
      col1: "Corporate treasury desks have begun abandoning rigid bilateral credit lines in favor of real-time competitive liquidity pools. Receivables originating from high-grade corporate buyers now clear with sub-second finality as autonomous matching protocols evaluate rate, tenor, and advance percentages simultaneously.",
      col2: "By decoupling buyer creditworthiness from supplier balance-sheet leverage, underwritten advance rates have advanced from 75% to over 92% for verified industrial shipments. Exporters report unprecedented cash-flow velocity across commercial corridors.",
      col3: "Risk modeling executives observe that Pareto-optimal auction dynamics systematically eliminate factoring arbitrage, establishing transparent settlement records that satisfy capital adequacy constraints without manual paper review queues.",
      col4: "Credit underwriters in regional industrial districts report that default provisions are now dynamically linked to buyer solvency histories, effectively insulating small suppliers from arbitrary bank credit rationing.",
    },
    midBanner: "AUCTION PROTOCOLS COMPRESS DISCOUNT SPREADS ACROSS METALS & TEXTILES",
    midStory: {
      col1: "Secondary trade receivables volume registered record turnover this morning as multi-agent allocation engines matched ₹480 Crore in commercial invoices. Participating lenders tailored their margin bids to balance internal risk limits with portfolio yield targets.",
      col2: "Market analysts note that traditional factoring houses relying on manual documentation have experienced severe margin compression as autonomous bilateral negotiation achieves instant clearing equilibrium.",
    },
    tableTitle: "OFFICIAL COMMERCIAL DISCOUNT BENCHMARKS",
    tableData: [
      { name: "NET 30 PRIME", rate: "7.85%", adv: "90%", spd: "T+1" },
      { name: "NET 45 METALS", rate: "8.40%", adv: "85%", spd: "T+1" },
      { name: "NET 60 TEXTILES", rate: "8.95%", adv: "82%", spd: "T+2" },
      { name: "NET 90 CHEMICALS", rate: "9.25%", adv: "80%", spd: "T+2" },
    ],
    lowerHeadline: "WHY SETTLEMENT SPEED OVERRIDES NOMINAL RATE MARGINS",
    lowerStory: {
      col1: "For mid-tier fabricators servicing conglomerate buyers, accelerated liquidity release offers superior economic utility compared to minor percentage-point concessions subject to protracted approval cycles.",
      col2: "Surveys across manufacturing hubs reveal that cash in hand within twenty-four hours reduces reliance on emergency overdraft facilities by sixty-four percent, stabilizing seasonal working capital.",
      col3: "Treasury officers emphasize that transparent negotiation transcripts provide the essential auditable proof required by statutory auditors and internal risk oversight committees.",
    },
    width: "min(58vw, 540px)",
    aspect: "1 / 1.42",
    layer: "foreground",
    animClass: "animate-sheet-1",
  },
  {
    id: "paper-2",
    masthead: "FINANCIAL DISPATCH & MERCANTILE",
    motto: "RECORD OF TRADE ACCEPTANCES, BILLS & CAPITAL ALLOCATION",
    meta: "CITY MORNING EDITION · REGISTERED AT GENERAL POST · TWO ANNAS",
    leadHeadline: "CAPITAL PROVIDERS COMPETE FOR QUALITY INVOICES",
    leadSubhead: "MULTI-AGENT NEGOTIATION MOVES BEYOND THE LOWEST RATE",
    upperStory: {
      col1: "Leading NBFCs and commercial banks are actively submitting simultaneous counter-bids across contested enterprise supplier pools. In lieu of solitary APR comparison, allocation engines now calculate multi-dimensional fit—weighing liquidity release speed against collateral haircut.",
      col2: "The emergence of agentic counter-proposals has reduced discount spread dispersion by 210 basis points nationwide. Anchor buyers report higher vendor retention and reduced supply-chain disruption following the rollout of automated liquidity corridors.",
      col3: "A senior portfolio officer noted that visible natural-language negotiation transcripts provide unassailable auditable evidence, justifying selective advance discounts to internal credit supervisory committees.",
      col4: "Debtor credit ratings now serve as the primary security pillar, allowing tier-three component vendors to command premier institutional factoring rates previously reserved for Fortune 500 conglomerates.",
    },
    midBanner: "CLEARINGHOUSE DISPATCH: RECEIVABLES DELINQUENCY DROPS TO HISTORIC LOW",
    midStory: {
      col1: "Automated verification protocols linking invoice metadata directly to corporate purchase order ledgers have eliminated disputed invoice claims across major automotive manufacturing supply lines.",
      col2: "With settlement confirmation transmitted at the moment of bill verification, secondary credit desks report complete mitigation of double-pledging risks that previously plagued factoring operations.",
    },
    diagramType: "bars",
    diagramTitle: "SETTLEMENT DURATION COMPRESSION (DAYS)",
    diagramBars: [
      { label: "TRADITIONAL FACTORING", val: "18d", w: "90%" },
      { label: "BANK LINE OF CREDIT", val: "12d", w: "65%" },
      { label: "NEGOTIAI AGENTIC LOOP", val: "<2h", w: "15%" },
    ],
    lowerHeadline: "COUNTERPARTY RISK BECOMES A CENTRAL PRICING SIGNAL",
    lowerStory: {
      col1: "Underwriters no longer penalize small manufacturers for working-capital leverage when the ultimate payer possesses sovereign-grade solvency. This structural decoupling unleashes billions in captive liquidity.",
      col2: "Continuous allocation loops ensure that prompt repayment track records are rewarded in subsequent auction rounds, fostering a competitive marketplace driven by performance and mutual trust.",
      col3: "Market economists project that real-time multi-agent negotiation will become the standard clearing infrastructure for institutional receivables across global trading corridors.",
    },
    width: "min(56vw, 510px)",
    aspect: "1 / 1.42",
    layer: "foreground",
    animClass: "animate-sheet-2",
  },
  {
    id: "paper-3",
    masthead: "THE TRADE REVIEW & CHRONICLE",
    motto: "DEVOTED TO THE INTERESTS OF SOUND MERCHANDISING AND COMMERCE",
    meta: "SPECIAL REPORT · COMMERCIAL RECEIVABLES · PRICE FOURPENCE",
    leadHeadline: "WORKING CAPITAL MOVES CLOSER TO REAL TIME",
    leadSubhead: "EARLY PAYMENT STRATEGIES GAIN MOMENTUM ACROSS MANUFACTURING",
    upperStory: {
      col1: "Delinquency cycles that historically paralyzed tier-two fabricators are dissolving as digital verification engines cross-reference invoice data at issuance. Liquidity is dispatched on verified receipt rather than deferred to traditional net-60 maturity dates.",
      col2: "Automated counter-bidding achieves clearing equilibrium in under 2.4 seconds, freeing suppliers from usurious factoring markups and empowering corporate treasurers with dynamic yield capture opportunities.",
      col3: "Receivables portfolios under autonomous clearing demonstrated 99.8% recovery reliability, validating memory-based pricing models that reward consistent settlement discipline with reduced margin spreads.",
      col4: "Private credit funds report expanding their allocation toward verified short-dated invoices, citing superior risk-adjusted returns compared to traditional unsecured commercial paper issuances.",
    },
    midBanner: "DYNAMIC LIQUIDITY POOLS ELIMINATE REVERSE FACTORING BOTTLENECKS",
    midStory: {
      col1: "Corporate buyers managing thousands of vendor relationships have deployed multi-agent gateways to automate early settlement discounts without depleting internal cash balances.",
      col2: "External capital providers step in to fund the invoices immediately, allowing the buyer to maintain customary payment tenors while vendors receive immediate debt-free working capital.",
    },
    tableTitle: "CREDIT TIER DISCOUNT ADJUSTMENTS",
    tableData: [
      { name: "AAA CORPORATE BUYER", rate: "7.15%", adv: "94%", spd: "INSTANT" },
      { name: "AA MID-CAP DEBTOR", rate: "8.10%", adv: "88%", spd: "SAME DAY" },
      { name: "BBB INDUSTRIAL BUYER", rate: "9.45%", adv: "82%", spd: "T+1" },
      { name: "UNRATED VENDOR ALONE", rate: "14.20%", adv: "65%", spd: "7-10 DAYS" },
    ],
    lowerHeadline: "THE RACE FOR SUPPLIER LIQUIDITY INTENSIFIES",
    lowerStory: {
      col1: "As supply-chain shocks highlight vendor vulnerability, major industrial brands recognize that supplier financial stability is an existential operational imperative.",
      col2: "Bilateral negotiation between autonomous agents ensures optimal allocation of capital reserves, preventing production interruptions caused by supplier cash-flow constraints.",
      col3: "The elimination of subjective underwriting bias creates a transparent, merit-based trade finance ecosystem that rewards verifiable commercial performance.",
    },
    width: "min(50vw, 460px)",
    aspect: "1 / 1.4",
    layer: "midground",
    animClass: "animate-sheet-3",
  },
  {
    id: "paper-4",
    masthead: "MARKET JOURNAL & COMMERCE",
    motto: "AUTHORITATIVE COUNTERPARTY RISK & RECEIVABLES INTELLIGENCE",
    meta: "VOL. XCII · NUMBER 3,841 · EVENING SUMMARY · THREE PENCE",
    leadHeadline: "THE RACE FOR SUPPLIER LIQUIDITY",
    leadSubhead: "DEBTOR CREDIT DECOUPLED FROM SUPPLIER BALANCE SHEETS",
    upperStory: {
      col1: "Traditional factoring houses that price credit solely against supplier balance sheets face obsolescence. Under modern decoupled frameworks, sovereign debtor creditworthiness serves as the primary underwriting anchor, instantly lowering financing costs.",
      col2: "Enterprise buyers such as Reliance and Tata Motors generate AAA-tier payment assurances that allow micro-enterprise vendors to secure discount rates comparable to institutional blue-chip borrowers.",
      col3: "The resulting liquidity influx has compressed vendor supply disruption rates by 68%, demonstrating that intelligent capital allocation stabilizes complex tier-three component manufacturing ecosystems.",
      col4: "Commercial lenders participating in the auction note that automated counter-proposals reach Nash equilibrium in sub-second intervals, ensuring optimal capital deployment without administrative overhead.",
    },
    midBanner: "CENTRAL BANK TELEMETRY: REAL-TIME ASSET FACTORING EXPANDS BY 34%",
    midStory: {
      col1: "National clearinghouse data shows electronic trade bills overtaking traditional bank overdraft facilities as the preferred method of short-term industrial debt clearance.",
      col2: "Automated underwriting engines evaluate historical payment timeliness alongside debtor balance sheets to generate dynamic, risk-sensitive advance rates.",
    },
    diagramType: "quote",
    quoteText: "“Underwriting must reflect the creditworthiness of the debtor who ultimately pays the bill, not the capital constraints of the craftsman who manufactured the goods.”",
    lowerHeadline: "INVOICE FINANCING SHIFTS TOWARD MARKET-BASED PRICING",
    lowerStory: {
      col1: "Where suppliers once accepted unilateral terms from sole relationship banks, competitive multi-provider auctions allow market forces to establish fair discount spreads.",
      col2: "Participating capital providers report that diversified exposure across verified corporate receivables yields superior loss-adjusted returns with zero duration mismatch.",
      col3: "The transition from opaque scoring algorithms to auditable natural-language transcripts provides full compliance justification for every basis-point concession.",
    },
    width: "min(48vw, 430px)",
    aspect: "1 / 1.4",
    layer: "midground",
    animClass: "animate-sheet-4",
  },
  {
    id: "paper-5",
    masthead: "THE CAPITAL ALLOCATION DISPATCH",
    motto: "CIRCULATED EXCLUSIVELY TO BANK TREASURIES AND CLEARINGHOUSES",
    meta: "FOURTH EDITION · MARKET CLOSE · PRICE ONE PENNY",
    leadHeadline: "INVOICE FINANCING SHIFTS TOWARD MARKET PRICING",
    leadSubhead: "STATIC FACTORING GRIDS REPLACED BY CONTINUOUS ALLOCATION LOOPS",
    upperStory: {
      col1: "Market makers praise the shift toward multi-provider competition. Where suppliers once negotiated with a single captive bank, dynamic auction protocols invite multiple lenders to compete openly for short-dated commercial assets.",
      col2: "Participating lenders tailor bids to match internal sector appetite, liquidity reserves, and balance-sheet horizons—ensuring optimal capital utilization across diverse industrial segments.",
      col3: "The continuous loop guarantees that settled deals inform future pricing models, fostering an adaptive marketplace that rewards reliable debtors with preferential pricing tiers.",
      col4: "Institutional investors note that trade receivables represent an exceptional non-correlated asset class when underwritten through automated multi-agent bilateral protocols.",
    },
    midBanner: "TREASURY REPORT: AVERAGE FINANCING TENOR COMPRESSED TO 42 DAYS",
    midStory: {
      col1: "Exporters utilizing algorithmic early payment discounting report cash conversion cycles shortening by an average of 19 days across engineering and chemical export divisions.",
      col2: "The reduction in working-capital drag enables mid-market manufacturers to accept larger volume purchase orders without taking on long-term debt liabilities.",
    },
    tableTitle: "SECTOR CAPITAL ALLOCATION VOLUMES",
    tableData: [
      { name: "TEXTILES & APPAREL", rate: "8.20%", adv: "88%", spd: "T+1" },
      { name: "AUTO COMPONENTS", rate: "8.45%", adv: "85%", spd: "SAME DAY" },
      { name: "HEAVY ENGINEERING", rate: "8.90%", adv: "80%", spd: "T+2" },
      { name: "PHARMACEUTICALS", rate: "7.75%", adv: "92%", spd: "INSTANT" },
    ],
    lowerHeadline: "AUTONOMOUS AGENTS REWRITE THE CAPITAL ALLOCATION LOOP",
    lowerStory: {
      col1: "Bilateral bargaining agents negotiate simultaneously across multiple term parameters—balancing APR, advance ratio, facility fees, and disbursement timelines in a single coherent turn.",
      col2: "Suppliers no longer sacrifice liquidity due to cumbersome paper verifications. The entire cycle from invoice issuance to bank settlement completes automatically.",
      col3: "Financial regulators have welcomed the full transparency of the audit transcript, highlighting its efficacy in eliminating opaque shadow-banking practices.",
    },
    width: "min(44vw, 400px)",
    aspect: "1 / 1.4",
    layer: "midground",
    animClass: "animate-sheet-5",
  },
  {
    id: "paper-6",
    masthead: "MONETARY TIMES & TRADE REVIEW",
    motto: "OFFICIAL RECORD OF BILLS, NOTES AND DISCOUNT BENCHMARKS",
    meta: "REGISTERED AS A NEWSPAPER · ESTABLISHED 1891 · TWO PENCE",
    leadHeadline: "WHY SETTLEMENT SPEED MATTERS",
    leadSubhead: "SAME-DAY CAPITAL DEPLOYMENT OUTWEIGHS MARGINAL BASIS POINTS",
    upperStory: {
      col1: "For fast-moving electronics and food processing suppliers, a 24-hour advance release offers vastly superior economic utility compared to nominal interest point concessions tied to three-week bank approval delays.",
      col2: "Autonomous auction architectures allow suppliers to specify multi-attribute preferences, ensuring that emergency liquidity requirements receive immediate priority routing across registered capital providers.",
      col3: "Data from recent industrial corridors confirms that accelerated settlement velocity directly enhances vendor order fulfillment capacity and reduces inventory holding carrying charges.",
      col4: "Commercial banks participating in the network have observed a 40% reduction in customer acquisition costs by interfacing directly with standardized digital trade receivables pipelines.",
    },
    midBanner: "AUCTION VELOCITY BULLETIN: AVERAGE BID MATCH REACHED IN 1.8 SECONDS",
    midStory: {
      col1: "The deployment of autonomous multi-agent negotiation frameworks has fundamentally transformed the mechanics of trade finance, shifting power back toward agile suppliers.",
      col2: "By evaluating whole-deal suitability rather than arbitrary isolated rates, suppliers consistently secure agreements tailored to their exact cash-flow profiles.",
    },
    diagramType: "bars",
    diagramTitle: "ANNUAL CASH CONVERSION GAIN",
    diagramBars: [
      { label: "STANDARD INVOICE CREDIT", val: "4.2x", w: "45%" },
      { label: "SELECTIVE FACTORING", val: "6.8x", w: "70%" },
      { label: "NEGOTIAI REAL-TIME LOOP", val: "11.4x", w: "98%" },
    ],
    lowerHeadline: "COUNTERPARTY SOLVENCY SUPERSEDES BALANCE SHEET METRICS",
    lowerStory: {
      col1: "Decoupled risk assessment empowers component suppliers servicing blue-chip corporations to tap institutional capital markets with confidence and dignity.",
      col2: "The resulting liquidity stability strengthens entire industrial ecosystems, mitigating the cascading defaults that traditionally follow regional payment delays.",
      col3: "Economists forecast that autonomous capital allocation will permanently compress trade spread dispersion across developing manufacturing markets.",
    },
    width: "min(40vw, 360px)",
    aspect: "1 / 1.4",
    layer: "background",
    animClass: "animate-sheet-6",
  },
  {
    id: "paper-7",
    masthead: "THE MERCANTILE COURIER",
    motto: "WEEKLY COMPILATION OF INLAND TRADE CONTRACTS & DISCOUNTS",
    meta: "VOL. XLVIII · ISSUE 1,290 · THREE HALFPENCE",
    leadHeadline: "AI AGENTS REWRITE THE CAPITAL ALLOCATION LOOP",
    leadSubhead: "EXPLAINABLE NATURAL LANGUAGE CONTRACTS SUPERSEDE BLACK-BOX DECISIONS",
    upperStory: {
      col1: "Auditable conversational transcripts provide compliance teams with granular justification for every bid adjustment, establishing transparent oversight standards across institutional receivables finance.",
      col2: "By removing intermediary friction, suppliers interact directly with autonomous capital provider personas, securing enforceable term sheets within minutes of trade verification.",
      col3: "Economists forecast that algorithmic receivables clearing will unlock billions in trapped liquidity across developing manufacturing corridors.",
      col4: "Lending institutions praise the system for reducing operational risk while maintaining rigorous adherence to counterparty concentration limits.",
    },
    midBanner: "CREDIT MEMORANDUM: FULL AUDIT TRAIL ACCOMPANIES EVERY SETTLEMENT",
    midStory: {
      col1: "Every concession made during multi-turn negotiation is documented in natural-language memos explaining why a specific counter-offer represented the optimal compromise.",
      col2: "Credit supervisory committees no longer rely on subjective post-hoc rationalizations, receiving transparent records of all evaluated bid alternatives.",
    },
    tableTitle: "COUNTERPARTY SETTLEMENT INDICES",
    tableData: [
      { name: "RELIANCE RETAIL", rate: "7.25%", adv: "92%", spd: "INSTANT" },
      { name: "TATA MOTORS", rate: "7.40%", adv: "90%", spd: "SAME DAY" },
      { name: "LARSEN & TOUBRO", rate: "7.55%", adv: "89%", spd: "SAME DAY" },
      { name: "MAHINDRA & MAHINDRA", rate: "7.65%", adv: "88%", spd: "T+1" },
    ],
    lowerHeadline: "WORKING CAPITAL OPTIMIZATION AT INSTITUTIONAL SCALE",
    lowerStory: {
      col1: "Real-time receivables clearing transforms static balance-sheet assets into active working capital without increasing corporate leverage ratios.",
      col2: "SMEs utilizing the platform report significant improvements in supplier goodwill and credit terms from their own upstream material vendors.",
      col3: "The autonomous capital allocation terminal stands as a transformative milestone for supply-chain resilience and financial inclusion.",
    },
    width: "min(38vw, 330px)",
    aspect: "1 / 1.4",
    layer: "background",
    animClass: "animate-sheet-7",
  },
  {
    id: "paper-8",
    masthead: "THE COMMERCIAL CHRONICLE",
    motto: "DAILY BULLETIN OF TRADE BALANCES AND ADVANCE MARGINS",
    meta: "MORNING DISPATCH · SPECIAL PRINTING · FOUR ANNAS",
    leadHeadline: "THE NEW ECONOMICS OF SUPPLIER FINANCE",
    leadSubhead: "REINFORCEMENT LEARNING ENHANCES CLEARING EFFICIENCY",
    upperStory: {
      col1: "Capital providers operating autonomous agents demonstrate adaptive pricing adjustments based on counterparty historical performance, steadily reducing systemic risk premiums.",
      col2: "The convergence of decoupled risk underwriting and multi-objective bidding marks the most significant evolution in commercial factoring in over a century.",
      col3: "Early enterprise adopters report clearance rates exceeding 98% within hours of invoice registration.",
      col4: "The integration of historical settlement memory enables capital providers to offer preferential terms to disciplined suppliers automatically.",
    },
    midBanner: "SPECIAL BULLETIN: HISTORICAL PAYMENT MEMORY REPLACES REPEATED AUDITS",
    midStory: {
      col1: "Suppliers with demonstrated track records of on-time fulfillment receive progressively higher advance percentages without recurring documentation hurdles.",
      col2: "This virtuous cycle encourages operational reliability while driving down financing costs across domestic manufacturing supply chains.",
    },
    diagramType: "quote",
    quoteText: "“When capital flows toward verified trade assets in real time, the entire economic apparatus accelerates with greater stability.”",
    lowerHeadline: "CAPITAL ALLOCATION BECOMES MULTI-DIMENSIONAL",
    lowerStory: {
      col1: "Single-metric price competition has yielded to comprehensive utility optimization, aligning borrower cash needs with lender balance-sheet profiles.",
      col2: "The resulting market structure eliminates the adversarial friction typical of traditional commercial banking interactions.",
      col3: "Autonomous agentic negotiation proves that artificial intelligence can deliver explainable, measurable economic value in wholesale capital markets.",
    },
    width: "min(36vw, 310px)",
    aspect: "1 / 1.4",
    layer: "background",
    animClass: "animate-sheet-8",
  },
];

export default function NewspaperStorm({ onNoiseDissolved, onComplete }) {
  const [phase, setPhase] = useState("storm"); // "storm" -> "dissolving" -> "finished"

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      if (onNoiseDissolved) onNoiseDissolved();
      if (onComplete) onComplete();
      setPhase("finished");
      return;
    }

    // 1.5s: Peak storm begins to dissolve outward (Market Noise -> Clarity)
    const dissolveTimer = setTimeout(() => {
      setPhase("dissolving");
      if (onNoiseDissolved) onNoiseDissolved();
    }, 1500);

    // 2.7s: Storm is fully dispersed, unmount from DOM completely
    const completeTimer = setTimeout(() => {
      setPhase("finished");
      if (onComplete) onComplete();
    }, 2700);

    return () => {
      clearTimeout(dissolveTimer);
      clearTimeout(completeTimer);
    };
  }, [onNoiseDissolved, onComplete]);

  if (phase === "finished") return null;

  return (
    <div
      className={`fixed inset-0 z-50 pointer-events-none overflow-hidden transition-opacity duration-700 ${
        phase === "dissolving" ? "opacity-0" : "opacity-100"
      }`}
      style={{ perspective: "1200px" }}
      aria-hidden="true"
    >
      {/* Dynamic atmospheric paper haze & warm sepia tint */}
      <div
        className={`absolute inset-0 bg-[#E8DECD]/25 transition-opacity duration-700 ${
          phase === "dissolving" ? "opacity-0" : "opacity-100"
        }`}
      />

      {/* FLYING NEWSPAPER BROADSHEETS CONTAINER */}
      {NEWSPAPERS.map((paper, idx) => (
        <div
          key={paper.id}
          className={`absolute left-0 top-0 will-change-transform ${paper.animClass}`}
          style={{
            width: paper.width,
            aspectRatio: paper.aspect,
            zIndex: paper.layer === "foreground" ? 40 : paper.layer === "midground" ? 30 : 20,
          }}
        >
          {/* Physical Flutter Container: Simulates paper warping, flexing & air turbulence */}
          <div
            className="w-full h-full animate-paper-flutter"
            style={{ animationDelay: `${(idx * 0.18).toFixed(2)}s` }}
          >
            {/* FULL PHYSICAL VINTAGE NEWSPAPER PAGE (100% DENSE EDITORIAL CONTENT FROM TOP TO BOTTOM) */}
            <div className="w-full h-full bg-[#EDE2CE] text-[#24170E] border border-[#CEBDA5] p-3 sm:p-4 shadow-[0_18px_42px_-10px_rgba(36,23,14,0.38),0_6px_16px_rgba(36,23,14,0.18)] rounded-[1px] relative overflow-hidden flex flex-col select-none">
              
              {/* Paper Texture Shading & Subtle Creases */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#E3D3BE]/45 via-transparent to-[#C9B396]/35 pointer-events-none" />
              <div className="absolute top-0 bottom-0 left-1/2 w-[1px] bg-[#C5B399]/70 shadow-[0_0_2px_rgba(0,0,0,0.08)] pointer-events-none" />
              <div className="absolute top-0 right-0 w-6 h-6 bg-gradient-to-bl from-[#C4AF92] to-transparent pointer-events-none opacity-50" />

              {/* TIER 1: TOP MASTHEAD & HEADER BANNER */}
              <div className="border-b-2 border-[#24170E] pb-1 mb-1 relative z-10 text-center shrink-0">
                <div className="text-[6px] sm:text-[7px] font-mono tracking-widest text-[#68533E] uppercase leading-tight">
                  {paper.motto}
                </div>
                <div className="font-serif font-black text-base sm:text-xl lg:text-2xl tracking-tight text-[#1C1109] uppercase leading-none my-0.5">
                  {paper.masthead}
                </div>
                <div className="flex items-center justify-between text-[6px] sm:text-[7px] font-mono font-semibold text-[#68533E] pt-0.5 border-t border-[#CEBDA5]">
                  <span>{paper.meta}</span>
                  <span className="hidden sm:inline">OFFICIAL TRADE RECORD</span>
                  <span>ISSUE #{idx + 104}</span>
                </div>
              </div>

              {/* TIER 2: PRIMARY BANNER HEADLINE & SUBHEAD */}
              <div className="border-b border-[#24170E] pb-1 mb-1 text-center relative z-10 shrink-0">
                <h2 className="font-serif font-black text-[11px] sm:text-xs lg:text-sm leading-tight text-[#140B05] uppercase tracking-tight m-0">
                  {paper.leadHeadline}
                </h2>
                <div className="font-serif font-bold text-[7px] sm:text-[8px] text-[#54412F] uppercase tracking-wider mt-0.5">
                  {paper.leadSubhead}
                </div>
              </div>

              {/* TIER 3: UPPER NEWS GRID (4 Compact Columns) */}
              <div className="grid grid-cols-4 gap-1.5 text-[6.5px] sm:text-[7.5px] leading-[1.25] text-[#2D1D12] font-serif relative z-10 border-b border-[#CEBDA5] pb-1 shrink-0">
                <div className="border-r border-[#CEBDA5]/70 pr-1">
                  <p className="m-0 font-light text-justify">
                    <span className="float-left text-sm sm:text-base font-serif font-bold text-[#1C1109] leading-none pr-0.5 pt-0.5">
                      {paper.upperStory.col1.charAt(0)}
                    </span>
                    {paper.upperStory.col1.slice(1)}
                  </p>
                </div>
                <div className="border-r border-[#CEBDA5]/70 pr-1">
                  <p className="m-0 font-light text-justify">
                    {paper.upperStory.col2}
                  </p>
                </div>
                <div className="border-r border-[#CEBDA5]/70 pr-1">
                  <p className="m-0 font-light text-justify">
                    {paper.upperStory.col3}
                  </p>
                </div>
                <div>
                  <p className="m-0 font-light text-justify">
                    {paper.upperStory.col4}
                  </p>
                </div>
              </div>

              {/* TIER 4: MID-PAGE HORIZONTAL SECTION BANNER */}
              <div className="py-0.5 my-0.5 border-b border-t border-[#24170E] bg-[#E5D7BE]/50 text-center relative z-10 shrink-0">
                <span className="font-serif font-extrabold text-[7.5px] sm:text-[8.5px] uppercase tracking-wider text-[#1C1109]">
                  {paper.midBanner}
                </span>
              </div>

              {/* TIER 5: MIDDLE NEWS & DATA GRID (2 Columns text + 1 Data/Chart Block) */}
              <div className="grid grid-cols-3 gap-1.5 text-[6.5px] sm:text-[7.5px] leading-[1.25] text-[#2D1D12] font-serif relative z-10 border-b border-[#CEBDA5] pb-1 shrink-0">
                <div className="border-r border-[#CEBDA5]/70 pr-1">
                  <p className="m-0 font-light text-justify">
                    {paper.midStory.col1}
                  </p>
                </div>
                <div className="border-r border-[#CEBDA5]/70 pr-1">
                  <p className="m-0 font-light text-justify">
                    {paper.midStory.col2}
                  </p>
                </div>
                
                {/* Data Column: Table, Bar Chart, or Inset Quote */}
                <div className="bg-[#E7DBBF]/40 p-1 border border-[#CEBDA5]">
                  {paper.tableData && (
                    <div>
                      <div className="font-mono text-[5.5px] sm:text-[6px] font-bold text-[#68533E] uppercase tracking-wider border-b border-[#24170E] pb-0.5 mb-0.5">
                        {paper.tableTitle}
                      </div>
                      <table className="w-full text-[5.5px] sm:text-[6.5px] font-mono text-left">
                        <tbody>
                          {paper.tableData.map((row, rIdx) => (
                            <tr key={rIdx} className="border-b border-[#CEBDA5]/60">
                              <td className="font-semibold text-[#1C1109] truncate max-w-[55px]">{row.name}</td>
                              <td className="font-bold">{row.rate}</td>
                              <td>{row.adv}</td>
                              <td className="text-right">{row.spd}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {paper.diagramType === "bars" && paper.diagramBars && (
                    <div>
                      <div className="font-mono text-[5.5px] sm:text-[6px] font-bold text-[#68533E] uppercase tracking-wider border-b border-[#24170E] pb-0.5 mb-0.5">
                        {paper.diagramTitle}
                      </div>
                      <div className="space-y-1 mt-0.5">
                        {paper.diagramBars.map((bar, bIdx) => (
                          <div key={bIdx}>
                            <div className="flex justify-between text-[5px] sm:text-[6px] font-mono text-[#54412F]">
                              <span className="truncate max-w-[65px]">{bar.label}</span>
                              <span className="font-bold text-[#1C1109]">{bar.val}</span>
                            </div>
                            <div className="h-1 bg-[#D8C7AE] rounded-sm overflow-hidden">
                              <div className="h-full bg-[#24170E]" style={{ width: bar.w }} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {paper.diagramType === "quote" && (
                    <div className="h-full flex flex-col justify-center italic text-[6.5px] sm:text-[7.5px] font-serif text-[#1C1109] leading-tight border-l-2 border-[#24170E] pl-1">
                      {paper.quoteText}
                    </div>
                  )}
                </div>
              </div>

              {/* TIER 6: LOWER PAGE SECONDARY HEADLINE & ARTICLES (Fills the entire bottom half) */}
              <div className="relative z-10 pt-1 pb-1 border-b border-[#CEBDA5] flex-1 flex flex-col justify-between">
                <div className="font-serif font-bold text-[8px] sm:text-[9.5px] text-[#140B05] uppercase tracking-tight mb-0.5">
                  {paper.lowerHeadline}
                </div>
                <div className="grid grid-cols-3 gap-1.5 text-[6.5px] sm:text-[7.5px] leading-[1.25] text-[#2D1D12] font-serif">
                  <div className="border-r border-[#CEBDA5]/70 pr-1">
                    <p className="m-0 font-light text-justify">
                      {paper.lowerStory.col1}
                    </p>
                  </div>
                  <div className="border-r border-[#CEBDA5]/70 pr-1">
                    <p className="m-0 font-light text-justify">
                      {paper.lowerStory.col2}
                    </p>
                  </div>
                  <div>
                    <p className="m-0 font-light text-justify">
                      {paper.lowerStory.col3}
                    </p>
                  </div>
                </div>
              </div>

              {/* TIER 7: BOTTOM FINANCIAL QUOTATION TICKER BAR & PAGE NUMBER */}
              <div className="pt-0.5 mt-0.5 flex items-center justify-between text-[6px] sm:text-[7px] font-mono text-[#54412F] relative z-10 shrink-0">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-[#1C1109]">PRIME: 7.85%</span>
                  <span>ADVANCE: 90%</span>
                  <span>DISCOUNT: 8.42%</span>
                  <span className="hidden sm:inline">SETTLEMENT: T+1</span>
                </div>
                <span className="font-bold text-[#1C1109]">
                  SECTION 01 · PAGE 0{idx + 1}
                </span>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* COMPONENT-SCOPED CSS ANIMATIONS FOR PHYSICAL FLUTTER & MULTI-PAGE GUST TRAJECTORIES */}
      <style jsx>{`
        /* High-Frequency Air Flutter & Flex: Simulates air turbulence catching loose paper */
        @keyframes paper-flutter {
          0%, 100% {
            transform: rotateX(0deg) rotateY(0deg) skewX(0deg) skewY(0deg);
          }
          20% {
            transform: rotateX(10deg) rotateY(-7deg) skewX(-2deg) skewY(1deg) scaleY(1.01);
          }
          40% {
            transform: rotateX(-7deg) rotateY(12deg) skewX(2.5deg) skewY(-1deg) scaleY(0.99);
          }
          60% {
            transform: rotateX(12deg) rotateY(8deg) skewX(-1.5deg) skewY(1.5deg) scaleX(1.01);
          }
          80% {
            transform: rotateX(-8deg) rotateY(-10deg) skewX(1.5deg) skewY(-1deg) scaleX(0.99);
          }
        }

        .animate-paper-flutter {
          animation: paper-flutter 1.2s ease-in-out infinite;
          transform-style: preserve-3d;
        }

        /* SHEET 1: Foreground Page flying from bottom-left up across to top-right */
        @keyframes sheet-fly-1 {
          0% {
            transform: translate3d(-50vw, 75vh, 250px) rotateZ(-30deg) rotateX(20deg) scale(0.85);
            opacity: 0;
            filter: blur(3px);
          }
          18% {
            opacity: 0.98;
            filter: blur(0.5px);
          }
          55% {
            transform: translate3d(20vw, 8vh, 150px) rotateZ(6deg) rotateX(8deg) scale(1.15);
            opacity: 1;
            filter: blur(0px);
          }
          85% {
            opacity: 0.95;
            filter: blur(1.5px);
          }
          100% {
            transform: translate3d(105vw, -65vh, -80px) rotateZ(35deg) rotateX(-15deg) scale(0.95);
            opacity: 0;
            filter: blur(6px);
          }
        }
        .animate-sheet-1 {
          animation: sheet-fly-1 2.3s cubic-bezier(0.2, 0.8, 0.25, 1) forwards;
        }

        /* SHEET 2: Foreground Page diving from top-right down across to bottom-left */
        @keyframes sheet-fly-2 {
          0% {
            transform: translate3d(95vw, -60vh, 220px) rotateZ(28deg) rotateY(25deg) scale(0.85);
            opacity: 0;
            filter: blur(3px);
          }
          20% {
            opacity: 0.98;
            filter: blur(0.5px);
          }
          60% {
            transform: translate3d(8vw, 18vh, 140px) rotateZ(-12deg) rotateY(-12deg) scale(1.12);
            opacity: 1;
            filter: blur(0px);
          }
          88% {
            opacity: 0.9;
            filter: blur(1.5px);
          }
          100% {
            transform: translate3d(-95vw, 85vh, -60px) rotateZ(-38deg) rotateY(15deg) scale(0.95);
            opacity: 0;
            filter: blur(6px);
          }
        }
        .animate-sheet-2 {
          animation: sheet-fly-2 2.4s cubic-bezier(0.18, 0.85, 0.2, 1) 0.1s forwards;
        }

        /* SHEET 3: Midground Page cutting diagonally from top-left through center */
        @keyframes sheet-fly-3 {
          0% {
            transform: translate3d(-45vw, -35vh, 40px) rotateZ(-18deg) rotateX(12deg) scale(0.8);
            opacity: 0;
            filter: blur(2px);
          }
          25% {
            opacity: 0.95;
            filter: blur(0.5px);
          }
          65% {
            transform: translate3d(35vw, 32vh, 80px) rotateZ(12deg) rotateX(-8deg) scale(1.05);
            opacity: 1;
            filter: blur(0px);
          }
          100% {
            transform: translate3d(100vw, 95vh, -40px) rotateZ(28deg) scale(0.9);
            opacity: 0;
            filter: blur(5px);
          }
        }
        .animate-sheet-3 {
          animation: sheet-fly-3 2.2s cubic-bezier(0.22, 0.9, 0.3, 1) 0.18s forwards;
        }

        /* SHEET 4: Midground Page rising from bottom-right to top-left */
        @keyframes sheet-fly-4 {
          0% {
            transform: translate3d(85vw, 75vh, 60px) rotateZ(18deg) rotateY(-15deg) scale(0.8);
            opacity: 0;
          }
          22% {
            opacity: 0.95;
          }
          60% {
            transform: translate3d(18vw, 12vh, 90px) rotateZ(-6deg) rotateY(8deg) scale(1.08);
            opacity: 1;
          }
          100% {
            transform: translate3d(-80vw, -60vh, -20px) rotateZ(-25deg) scale(0.85);
            opacity: 0;
            filter: blur(5px);
          }
        }
        .animate-sheet-4 {
          animation: sheet-fly-4 2.3s cubic-bezier(0.2, 0.8, 0.2, 1) 0.12s forwards;
        }

        /* SHEET 5: Midground Page crossing center from left */
        @keyframes sheet-fly-5 {
          0% {
            transform: translate3d(-40vw, 25vh, 20px) rotateZ(-12deg) scale(0.75);
            opacity: 0;
          }
          28% {
            opacity: 0.9;
          }
          65% {
            transform: translate3d(45vw, 20vh, 50px) rotateZ(14deg) scale(1.02);
            opacity: 1;
          }
          100% {
            transform: translate3d(105vw, 15vh, -50px) rotateZ(22deg) scale(0.85);
            opacity: 0;
            filter: blur(4px);
          }
        }
        .animate-sheet-5 {
          animation: sheet-fly-5 2.4s cubic-bezier(0.24, 0.88, 0.28, 1) 0.22s forwards;
        }

        /* SHEET 6: Background Page drifting in deep z-space */
        @keyframes sheet-fly-6 {
          0% {
            transform: translate3d(30vw, -45vh, -120px) rotateZ(-10deg) scale(0.7);
            opacity: 0;
          }
          30% {
            opacity: 0.85;
          }
          70% {
            transform: translate3d(-20vw, 45vh, -60px) rotateZ(16deg) scale(0.9);
            opacity: 0.9;
          }
          100% {
            transform: translate3d(-70vw, 95vh, -150px) rotateZ(25deg) scale(0.75);
            opacity: 0;
          }
        }
        .animate-sheet-6 {
          animation: sheet-fly-6 2.5s cubic-bezier(0.25, 0.9, 0.3, 1) 0.08s forwards;
        }

        /* SHEET 7: Background Page sweeping from top-right to bottom-left */
        @keyframes sheet-fly-7 {
          0% {
            transform: translate3d(80vw, -30vh, -100px) rotateZ(15deg) scale(0.7);
            opacity: 0;
          }
          35% {
            opacity: 0.85;
          }
          75% {
            transform: translate3d(25vw, 55vh, -50px) rotateZ(-12deg) scale(0.88);
            opacity: 0.9;
          }
          100% {
            transform: translate3d(-40vw, 105vh, -120px) rotateZ(-24deg) scale(0.75);
            opacity: 0;
          }
        }
        .animate-sheet-7 {
          animation: sheet-fly-7 2.4s cubic-bezier(0.22, 0.85, 0.25, 1) 0.16s forwards;
        }

        /* SHEET 8: Background Page fluttering across upper quadrant */
        @keyframes sheet-fly-8 {
          0% {
            transform: translate3d(-30vw, 5vh, -140px) rotateZ(8deg) scale(0.65);
            opacity: 0;
          }
          30% {
            opacity: 0.8;
          }
          65% {
            transform: translate3d(50vw, -15vh, -70px) rotateZ(-18deg) scale(0.85);
            opacity: 0.85;
          }
          100% {
            transform: translate3d(100vw, -35vh, -160px) rotateZ(-28deg) scale(0.7);
            opacity: 0;
          }
        }
        .animate-sheet-8 {
          animation: sheet-fly-8 2.5s cubic-bezier(0.25, 0.9, 0.3, 1) 0.05s forwards;
        }
      `}</style>
    </div>
  );
}

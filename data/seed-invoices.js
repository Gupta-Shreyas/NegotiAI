export const SEED_INVOICES = [
  {
    id: "INV/2024-25/00891",
    supplierName: "Acme Textiles India Pvt Ltd",
    buyerName: "Reliance Retail Ltd",
    amount: 2500000, // ₹25 Lakhs
    sector: "textiles_apparel",
    supplierRiskScore: 22,
    buyerRiskScore: 12,
    dueInDays: 45,
    status: "pending",
  },
  {
    id: "INV/2024-25/01420",
    supplierName: "Delta Auto Components Pvt Ltd",
    buyerName: "Tata Motors Ltd",
    amount: 8500000, // ₹85 Lakhs
    sector: "automotive",
    supplierRiskScore: 48,
    buyerRiskScore: 18,
    dueInDays: 60,
    status: "pending",
  },
  {
    id: "INV/2024-25/00312",
    supplierName: "Riverside Agro Processing Pvt Ltd",
    buyerName: "ITC Limited",
    amount: 1500000, // ₹15 Lakhs
    sector: "food_agriculture",
    supplierRiskScore: 28,
    buyerRiskScore: 15,
    dueInDays: 30,
    status: "pending",
  },
  {
    id: "INV/2024-25/02844",
    supplierName: "Orbit Electronics Solutions Pvt Ltd",
    buyerName: "Dixon Technologies India Ltd",
    amount: 12000000, // ₹1.2 Crore
    sector: "electronics",
    supplierRiskScore: 65,
    buyerRiskScore: 25,
    dueInDays: 90,
    status: "pending",
  },
  {
    id: "INV/2024-25/05109",
    supplierName: "Pioneer Steelworks India Pvt Ltd",
    buyerName: "JSW Steel Ltd",
    amount: 25000000, // ₹2.5 Crore
    sector: "industrial_metals",
    supplierRiskScore: 35,
    buyerRiskScore: 20,
    dueInDays: 60,
    status: "pending",
  },
];

export const SIMULATED_PRIOR_OUTCOME = {
  "INV/2024-25/01420": {
    defaulted: false,
    delayedDays: 14,
  },
};
"use client";

import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const COLORS = {
  floor: "#05070A",
  card: "#0B1221",
  cardBorder: "rgba(255,255,255,0.05)",
  text: "#FFFFFF",
  textDim: "#909097",
  allow: "#00C853",
  hold: "#FFD600",
  block: "#FF1744",
  freeze: "#78909C",
};

const SPEAKER_STYLES = {
  supplier: { accent: "#42a5f5", align: "flex-start" },
  bank_conservative: { accent: COLORS.allow, align: "flex-end" },
  fintech_aggressive: { accent: COLORS.hold, align: "flex-end" },
  nbfc_sector: { accent: "#c084fc", align: "flex-end" },
};

function styleFor(speakerId) {
  return SPEAKER_STYLES[speakerId] || { accent: COLORS.freeze, align: "flex-start" };
}

const card = {
  background: COLORS.card,
  border: `1px solid ${COLORS.cardBorder}`,
  borderRadius: "8px",
  padding: "24px",
  marginBottom: "24px",
};

const labelCaps = {
  fontFamily: "'JetBrains Mono', monospace",
  fontSize: "12px",
  fontWeight: 600,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  color: COLORS.textDim,
};

const sectionHeading = {
  fontSize: "20px",
  fontWeight: 700,
  marginTop: 0,
  marginBottom: "20px",
  color: COLORS.text,
};

export default function Home() {
  const [invoiceIndex, setInvoiceIndex] = useState(0);
  const [useMemory, setUseMemory] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  async function runNegotiation() {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch("/api/negotiate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ invoiceIndex, useMemory }),
      });

      let data;
      try {
        data = await res.json();
      } catch {
        throw new Error(
          "The server sent back something unexpected. This is usually a temporary hiccup — try again."
        );
      }

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong on that negotiation. Try again.");
      }
      setResult(data);
    } catch (e) {
      setError(e.message || "Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main>
      <header style={{ marginBottom: "48px" }}>
        <div style={{ ...labelCaps, marginBottom: "8px" }}>NegotiAI</div>
        <h1 style={{ fontSize: "32px", fontWeight: 800, margin: 0, letterSpacing: "-0.01em", color: COLORS.text }}>
          Negotiating Capital Market
        </h1>
        <p style={{ fontSize: "16px", color: COLORS.textDim, marginTop: "12px", maxWidth: "620px" }}>
          Autonomous capital providers compete in real time to finance a supplier&apos;s invoice —
          matched on overall fit, not just the lowest rate.
        </p>
      </header>

      <section style={card}>
        <h2 style={sectionHeading}>Select Invoice</h2>

        <div style={{ marginBottom: "20px" }}>
          <div style={{ ...labelCaps, marginBottom: "8px" }}>Invoice</div>
          <select
            value={invoiceIndex}
            onChange={(e) => setInvoiceIndex(Number(e.target.value))}
            style={{ width: "100%" }}
          >
            <option value={0}>Invoice 001 — Acme Textiles (low risk, wants speed)</option>
            <option value={1}>Invoice 002 — Delta Manufacturing (same buyer as #1, use for memory demo)</option>
            <option value={2}>Invoice 003 — Riverside Foods (high risk, cost-sensitive)</option>
            <option value={3}>Invoice 004 — Orbit Electronics (low risk, urgent cash need)</option>
            <option value={4}>Invoice 005 — Pioneer Steelworks (manufacturing sector, cost-sensitive)</option>
          </select>
        </div>

        <label style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "24px", color: COLORS.textDim, fontSize: "14px" }}>
          <input
            type="checkbox"
            checked={useMemory}
            onChange={(e) => setUseMemory(e.target.checked)}
            style={{ width: "16px", height: "16px" }}
          />
          Apply memory from prior round (use for Invoice 002 to show adaptation)
        </label>

        <button
          onClick={runNegotiation}
          disabled={loading}
          style={{
            background: loading ? COLORS.freeze : COLORS.text,
            color: COLORS.floor,
            border: "none",
            borderRadius: "4px",
            padding: "12px 24px",
            fontWeight: 700,
            cursor: loading ? "default" : "pointer",
            letterSpacing: "0.02em",
          }}
        >
          {loading ? "NEGOTIATING..." : result || error ? "RUN AGAIN" : "RUN NEGOTIATION"}
        </button>
      </section>

      {error && (
        <div
          style={{
            ...card,
            border: `1px solid rgba(255,23,68,0.4)`,
            background: "rgba(255,23,68,0.08)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "16px",
          }}
        >
          <div>
            <div style={{ ...labelCaps, color: COLORS.block, marginBottom: "4px" }}>Negotiation Failed</div>
            <p style={{ margin: 0, color: COLORS.textDim, fontSize: "14px" }}>{error}</p>
          </div>
          <button
            onClick={runNegotiation}
            disabled={loading}
            style={{
              flexShrink: 0,
              background: COLORS.block,
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              padding: "10px 20px",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            {loading ? "RETRYING..." : "TRY AGAIN"}
          </button>
        </div>
      )}

      {result && (
        <>
          <section style={card}>
            <h2 style={sectionHeading}>Negotiation Transcript</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {result.transcript.map((turn, i) => {
                const s = styleFor(turn.speakerId);
                return (
                  <div key={i} style={{ display: "flex", justifyContent: s.align }}>
                    <div
                      style={{
                        maxWidth: "75%",
                        background: COLORS.floor,
                        borderLeft: `3px solid ${turn.degraded ? COLORS.freeze : s.accent}`,
                        borderRadius: "4px",
                        padding: "12px 16px",
                        fontStyle: turn.degraded ? "italic" : "normal",
                        opacity: turn.degraded ? 0.6 : 1,
                      }}
                    >
                      <div
                        style={{
                          ...labelCaps,
                          color: turn.degraded ? COLORS.freeze : s.accent,
                          marginBottom: "6px",
                        }}
                      >
                        {turn.speaker}
                      </div>
                      <div style={{ fontSize: "15px", color: COLORS.text }}>{turn.message}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          <section style={card}>
            <h2 style={sectionHeading}>Offer Comparison</h2>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart
                data={result.offers.map((o) => ({
                  name: o.providerName,
                  Rate: o.terms.rate,
                  "Advance Rate": o.terms.advanceRatePct,
                  Fee: o.terms.feePct,
                }))}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: COLORS.textDim }} />
                <YAxis tick={{ fontSize: 12, fill: COLORS.textDim }} />
                <Tooltip
                  contentStyle={{ background: COLORS.floor, border: `1px solid ${COLORS.cardBorder}`, borderRadius: "4px" }}
                  labelStyle={{ color: COLORS.text }}
                />
                <Legend wrapperStyle={{ fontSize: "13px", color: COLORS.textDim }} />
                <Bar dataKey="Rate" fill={COLORS.block} radius={[2, 2, 0, 0]} />
                <Bar dataKey="Advance Rate" fill="#42a5f5" radius={[2, 2, 0, 0]} />
                <Bar dataKey="Fee" fill={COLORS.hold} radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
            <p style={{ fontSize: "13px", color: COLORS.textDim, marginTop: "12px", marginBottom: 0 }}>
              Settlement speed and tenor use different scales — see the cards below.
            </p>
          </section>

          <section style={card}>
            <h2 style={sectionHeading}>Final Offers</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {result.offers.map((offer) => {
                const isWinner = offer.providerId === result.winningDeal.providerId;
                return (
                  <div
                    key={offer.providerId}
                    style={{
                      background: COLORS.floor,
                      border: isWinner ? `1px solid ${COLORS.allow}` : `1px solid ${COLORS.cardBorder}`,
                      borderRadius: "8px",
                      padding: "20px",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
                      <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 700, color: COLORS.text }}>
                        {offer.providerName}
                      </h3>
                      {isWinner && (
                        <span
                          style={{
                            ...labelCaps,
                            color: COLORS.allow,
                            background: "rgba(0,200,83,0.15)",
                            padding: "3px 8px",
                            borderRadius: "4px",
                          }}
                        >
                          Winner
                        </span>
                      )}
                    </div>
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                      <tbody>
                        {[
                          ["Rate", `${offer.terms.rate}%`],
                          ["Advance Rate", `${offer.terms.advanceRatePct}%`],
                          ["Fee", `${offer.terms.feePct}%`],
                          ["Settlement Speed", `${offer.terms.settlementDays} day(s)`],
                          ["Max Tenor", `${offer.terms.tenorDaysMax} days`],
                        ].map(([label, value]) => (
                          <tr key={label}>
                            <td style={{ padding: "6px 0", color: COLORS.textDim, fontSize: "14px" }}>{label}</td>
                            <td
                              className="mono"
                              style={{ padding: "6px 0", textAlign: "right", color: COLORS.text, fontSize: "14px", fontWeight: 500 }}
                            >
                              {value}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                );
              })}
            </div>
          </section>

          <section style={card}>
            <h2 style={sectionHeading}>Why This Offer Won</h2>
            <p style={{ fontSize: "16px", lineHeight: 1.6, color: COLORS.text, margin: 0 }}>
              {result.explanation}
            </p>
          </section>
        </>
      )}
    </main>
  );
}
import React from "react";

export function WhyPayoutSetupMatters({
  isEnabled,
  onCompleteSetup,
}: {
  isEnabled: boolean;
  onCompleteSetup: () => void;
}) {
  return (
    <div style={styles.card}>
      <div style={styles.headerRow}>
        <div style={styles.hTitle}>Why payout setup matters</div>
        <div style={styles.badge}>
          {isEnabled ? "Payout-ready ✅" : "Action needed"}
        </div>
      </div>

      <ul style={styles.ul}>
        <li style={styles.li}>
          <b>Get paid automatically:</b> Once a merchant approves your work, your payout is sent automatically (no chasing invoices).
        </li>
        <li style={styles.li}>
          <b>Get hired faster:</b> Merchants prefer creators who are "payout-ready" so jobs can start immediately.
        </li>
        <li style={styles.li}>
          <b>Protects both sides:</b> Stripe verifies identity so payments are secure and disputes are easier to handle.
        </li>
      </ul>

      <div style={styles.tip}>
        <b>Tip:</b> Use the exact name/address from your ID or business documents to avoid verification delays.
      </div>

      <div style={styles.row}>
        <button
          onClick={onCompleteSetup}
          style={{ ...styles.btn, ...(isEnabled ? styles.btnGhost : styles.btnPrimary) }}
        >
          {isEnabled ? "Manage payout settings" : "Complete payout setup"}
        </button>

        <a href="/creator/dashboard" style={{ ...styles.btn, ...styles.btnSecondary }}>
          Browse jobs
        </a>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  card: {
    background: "#fff",
    border: "1px solid #e6e6e6",
    borderRadius: 16,
    padding: 18,
    marginBottom: 14,
  },
  headerRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
    flexWrap: "wrap",
    marginBottom: 10,
  },
  hTitle: {
    fontSize: 16,
    fontWeight: 900,
  },
  badge: {
    fontSize: 12,
    fontWeight: 900,
    padding: "6px 10px",
    borderRadius: 999,
    background: "#f2f6ff",
    color: "#0b5cff",
  },
  ul: {
    margin: "0 0 10px",
    paddingLeft: 18,
    color: "#222",
    lineHeight: 1.45,
    fontSize: 14,
  },
  li: {
    margin: "8px 0",
  },
  tip: {
    fontSize: 13,
    color: "#444",
    background: "#fafafa",
    border: "1px solid #eee",
    borderRadius: 12,
    padding: 12,
    marginTop: 10,
    marginBottom: 12,
  },
  row: {
    display: "flex",
    gap: 10,
    flexWrap: "wrap",
  },
  btn: {
    padding: "10px 12px",
    borderRadius: 12,
    fontWeight: 900,
    cursor: "pointer",
    border: "1px solid #ddd",
    background: "#fff",
    textDecoration: "none",
    display: "inline-block",
    color: "#111",
  },
  btnPrimary: {
    background: "#0b5cff",
    color: "#fff",
    border: "1px solid #0b5cff",
  },
  btnSecondary: {
    background: "#fff",
    color: "#111",
    border: "1px solid #ddd",
  },
  btnGhost: {
    background: "#fff",
    color: "#0b5cff",
    border: "1px solid #cfd8ff",
  },
};

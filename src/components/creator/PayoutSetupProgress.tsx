import React from "react";

type ConnectProgress = {
  stripe_connect_account_id?: string | null;
  connect_details_submitted: boolean;
  connect_charges_enabled: boolean;
  connect_payouts_enabled: boolean;
};

export function PayoutSetupProgress({
  status,
  onCompleteSetup,
}: {
  status: ConnectProgress;
  onCompleteSetup: () => void;
}) {
  const step1Done = Boolean(status.stripe_connect_account_id);
  const step2Done = Boolean(status.connect_details_submitted);
  const step3Done = Boolean(status.connect_charges_enabled && status.connect_payouts_enabled);

  const step2Active = step1Done && !step2Done;
  const step3Active = step2Done && !step3Done;

  return (
    <div style={styles.card}>
      <div style={styles.title}>Payout setup progress</div>

      <div style={styles.steps}>
        <Step
          number={1}
          label="Create Stripe account"
          state={step1Done ? "done" : "todo"}
        />

        <Connector active={step2Active || step2Done} />

        <Step
          number={2}
          label="Submit required details"
          state={step2Done ? "done" : step2Active ? "active" : "todo"}
        />

        <Connector active={step3Active || step3Done} />

        <Step
          number={3}
          label="Payouts enabled"
          state={step3Done ? "done" : step3Active ? "active" : "todo"}
        />
      </div>

      {!step3Done && (
        <div style={styles.ctaRow}>
          <button
            style={{ ...styles.btn, ...styles.btnPrimary }}
            onClick={onCompleteSetup}
          >
            Continue payout setup
          </button>
          <span style={styles.helper}>
            Takes ~2 minutes
          </span>
        </div>
      )}
    </div>
  );
}

function Step({
  number,
  label,
  state,
}: {
  number: number;
  label: string;
  state: "done" | "active" | "todo";
}) {
  const isDone = state === "done";
  const isActive = state === "active";

  return (
    <div style={styles.step}>
      <div
        style={{
          ...styles.circle,
          ...(isDone ? styles.circleDone : isActive ? styles.circleActive : styles.circleTodo),
        }}
      >
        {isDone ? "✓" : number}
      </div>
      <div
        style={{
          ...styles.stepLabel,
          ...(isDone ? styles.labelDone : isActive ? styles.labelActive : {}),
        }}
      >
        {label}
      </div>
    </div>
  );
}

function Connector({ active }: { active: boolean }) {
  return (
    <div
      style={{
        ...styles.connector,
        background: active ? "#0b5cff" : "#e6e6e6",
      }}
    />
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
  title: {
    fontSize: 15,
    fontWeight: 900,
    marginBottom: 12,
  },
  steps: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 6,
    flexWrap: "wrap",
  },
  step: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    minWidth: 110,
    gap: 8,
  },
  circle: {
    width: 40,
    height: 40,
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 900,
    fontSize: 16,
  },
  circleDone: {
    background: "#0b5cff",
    color: "#fff",
  },
  circleActive: {
    background: "#e0edff",
    color: "#0b5cff",
    border: "2px solid #0b5cff",
  },
  circleTodo: {
    background: "#f5f5f5",
    color: "#999",
  },
  stepLabel: {
    fontSize: 13,
    textAlign: "center",
    color: "#666",
    lineHeight: 1.3,
  },
  labelDone: {
    color: "#222",
    fontWeight: 700,
  },
  labelActive: {
    color: "#0b5cff",
    fontWeight: 700,
  },
  connector: {
    flex: 1,
    height: 3,
    borderRadius: 999,
    minWidth: 20,
    maxWidth: 80,
  },
  ctaRow: {
    marginTop: 14,
    paddingTop: 14,
    borderTop: "1px solid #eee",
    display: "flex",
    alignItems: "center",
    gap: 10,
    flexWrap: "wrap",
  },
  btn: {
    padding: "10px 14px",
    borderRadius: 12,
    fontWeight: 900,
    cursor: "pointer",
    border: "none",
    fontSize: 14,
  },
  btnPrimary: {
    background: "#0b5cff",
    color: "#fff",
  },
  helper: {
    fontSize: 13,
    color: "#666",
  },
};

import React from "react";
import { CheckCircle, AlertCircle, Clock } from "lucide-react";

interface ConnectStatus {
  stripe_connect_account_id: string | null;
  connect_details_submitted: boolean;
  connect_charges_enabled: boolean;
  connect_payouts_enabled: boolean;
  connect_enabled: boolean;
  connect_disabled_reason?: string | null;
}

interface CreatorWalletBannerProps {
  status: ConnectStatus;
  onCompleteSetup: () => void;
}

export function CreatorWalletBanner({ status, onCompleteSetup }: CreatorWalletBannerProps) {
  const isFullyEnabled =
    status.connect_enabled &&
    status.connect_charges_enabled &&
    status.connect_payouts_enabled;

  const hasStarted = Boolean(status.stripe_connect_account_id);
  const needsAction = hasStarted && !isFullyEnabled;

  if (isFullyEnabled) {
    return (
      <div style={styles.bannerEnabled}>
        <div style={styles.iconWrapper}>
          <CheckCircle size={24} color="#059669" />
        </div>
        <div style={styles.content}>
          <div style={styles.title}>Payouts enabled</div>
          <div style={styles.subtitle}>
            You're all set! When merchants approve your work, payments are sent automatically.
          </div>
        </div>
      </div>
    );
  }

  if (needsAction) {
    return (
      <div style={styles.bannerWarning}>
        <div style={styles.iconWrapper}>
          <Clock size={24} color="#d97706" />
        </div>
        <div style={styles.content}>
          <div style={styles.title}>Finish setting up payouts</div>
          <div style={styles.subtitle}>
            You started setup but need to complete a few more steps to receive payments.
          </div>
        </div>
        <button style={styles.btnWarning} onClick={onCompleteSetup}>
          Complete setup
        </button>
      </div>
    );
  }

  return (
    <div style={styles.bannerAction}>
      <div style={styles.iconWrapper}>
        <AlertCircle size={24} color="#dc2626" />
      </div>
      <div style={styles.content}>
        <div style={styles.title}>Payout setup required</div>
        <div style={styles.subtitle}>
          Set up payouts to start earning from UGC projects. Takes ~2 minutes.
        </div>
      </div>
      <button style={styles.btnAction} onClick={onCompleteSetup}>
        Set up payouts
      </button>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  bannerEnabled: {
    display: "flex",
    alignItems: "center",
    gap: 14,
    background: "#f0fdf4",
    border: "1px solid #86efac",
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
  },
  bannerWarning: {
    display: "flex",
    alignItems: "center",
    gap: 14,
    background: "#fefce8",
    border: "1px solid #fde047",
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
  },
  bannerAction: {
    display: "flex",
    alignItems: "center",
    gap: 14,
    background: "#fef2f2",
    border: "1px solid #fca5a5",
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
  },
  iconWrapper: {
    flexShrink: 0,
  },
  content: {
    flex: 1,
    minWidth: 0,
  },
  title: {
    fontSize: 16,
    fontWeight: 900,
    color: "#111",
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 14,
    color: "#444",
    lineHeight: 1.4,
  },
  btnWarning: {
    padding: "10px 16px",
    borderRadius: 12,
    fontWeight: 900,
    fontSize: 14,
    cursor: "pointer",
    border: "1px solid #d97706",
    background: "#fff",
    color: "#d97706",
    whiteSpace: "nowrap",
  },
  btnAction: {
    padding: "10px 16px",
    borderRadius: 12,
    fontWeight: 900,
    fontSize: 14,
    cursor: "pointer",
    border: "1px solid #dc2626",
    background: "#dc2626",
    color: "#fff",
    whiteSpace: "nowrap",
  },
};

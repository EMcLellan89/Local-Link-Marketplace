import React, { useState } from "react";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { DollarSign, Gift, TrendingUp, Search, Award } from "lucide-react";
import { supabase } from "../../lib/supabase";

interface Balance {
  earned_cents: number;
  redeemed_cents: number;
  balance_cents: number;
}

interface LedgerEntry {
  id: string;
  amount_cents: number;
  reason: string;
  status: string;
  created_at: string;
  source: any;
}

export default function CustomerRewardsPage() {
  const [customerId, setCustomerId] = useState("");
  const [balance, setBalance] = useState<Balance | null>(null);
  const [ledger, setLedger] = useState<LedgerEntry[]>([]);
  const [redeemAmount, setRedeemAmount] = useState(2500);
  const [redeemNote, setRedeemNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [redeeming, setRedeeming] = useState(false);

  const loadCustomerRewards = async () => {
    if (!customerId.trim()) {
      alert("Please enter a customer ID");
      return;
    }

    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const baseUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1`;
      const headers = {
        Authorization: `Bearer ${session.access_token}`,
      };

      const [balanceRes, ledgerRes] = await Promise.all([
        fetch(`${baseUrl}/rewards-balance?customer_id=${encodeURIComponent(customerId)}`, { headers }),
        fetch(`${baseUrl}/rewards-ledger?customer_id=${encodeURIComponent(customerId)}`, { headers }),
      ]);

      const balanceData = await balanceRes.json();
      const ledgerData = await ledgerRes.json();

      if (balanceData.ok) {
        setBalance(balanceData.balance);
      }

      if (ledgerData.ok) {
        setLedger(ledgerData.ledger || []);
      }
    } catch (error) {
      console.error("Failed to load rewards:", error);
      alert("Failed to load customer rewards");
    } finally {
      setLoading(false);
    }
  };

  const handleRedeem = async () => {
    if (!customerId.trim()) {
      alert("Please load a customer first");
      return;
    }

    if (redeemAmount <= 0) {
      alert("Amount must be greater than 0");
      return;
    }

    setRedeeming(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/rewards-redeem`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${session.access_token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            customer_id: customerId,
            amount_cents: redeemAmount,
            method: "manual",
            note: redeemNote || null,
          }),
        }
      );

      const result = await response.json();

      if (!result.ok) {
        alert(result.error || "Failed to redeem rewards");
        return;
      }

      alert(`Successfully redeemed $${(result.redeemed_cents / 100).toFixed(2)}`);
      setRedeemNote("");

      // Reload data
      await loadCustomerRewards();
    } catch (error) {
      console.error("Failed to redeem:", error);
      alert("Failed to redeem rewards");
    } finally {
      setRedeeming(false);
    }
  };

  const formatCurrency = (cents: number) => {
    return `$${(cents / 100).toFixed(2)}`;
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Customer Rewards</h1>
        <p className="text-gray-600">
          View earned rewards and redeem them for customers. Admin/merchant access only.
        </p>
      </div>

      {/* Customer Search */}
      <Card className="p-6 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Search className="w-5 h-5 text-blue-600" />
          <h2 className="text-xl font-bold text-gray-900">Customer Lookup</h2>
        </div>
        <div className="flex gap-3 flex-wrap">
          <Input
            type="text"
            placeholder="Enter Customer ID (UUID)"
            value={customerId}
            onChange={(e) => setCustomerId(e.target.value)}
            className="flex-1 min-w-[320px]"
          />
          <Button onClick={loadCustomerRewards} disabled={loading}>
            {loading ? "Loading..." : "Load Customer"}
          </Button>
        </div>
      </Card>

      {balance && (
        <>
          {/* Balance Overview */}
          <div className="grid md:grid-cols-3 gap-6 mb-6">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                  <span className="text-sm font-semibold text-gray-600">Earned</span>
                </div>
              </div>
              <p className="text-3xl font-bold text-gray-900">{formatCurrency(balance.earned_cents)}</p>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Gift className="w-5 h-5 text-blue-600" />
                  <span className="text-sm font-semibold text-gray-600">Redeemed</span>
                </div>
              </div>
              <p className="text-3xl font-bold text-gray-900">{formatCurrency(balance.redeemed_cents)}</p>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-blue-600" />
                  <span className="text-sm font-semibold text-blue-800">Available Balance</span>
                </div>
              </div>
              <p className="text-3xl font-bold text-blue-900">{formatCurrency(balance.balance_cents)}</p>
            </Card>
          </div>

          {/* Redeem Section */}
          <Card className="p-6 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <DollarSign className="w-5 h-5 text-green-600" />
              <h2 className="text-xl font-bold text-gray-900">Redeem Rewards</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Amount (cents)
                </label>
                <Input
                  type="number"
                  value={redeemAmount}
                  onChange={(e) => setRedeemAmount(Number(e.target.value))}
                  min="1"
                  step="100"
                />
                <p className="text-xs text-gray-500 mt-1">
                  = {formatCurrency(redeemAmount)}
                </p>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Note (optional)
                </label>
                <Input
                  type="text"
                  placeholder="e.g., Applied to invoice #1234"
                  value={redeemNote}
                  onChange={(e) => setRedeemNote(e.target.value)}
                />
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Tip: 2500 cents = $25.00 • Max available: {formatCurrency(balance.balance_cents)}
              </p>
              <Button
                onClick={handleRedeem}
                disabled={redeeming || redeemAmount > balance.balance_cents}
              >
                {redeeming ? "Processing..." : "Redeem Rewards"}
              </Button>
            </div>
          </Card>
        </>
      )}

      {/* Ledger */}
      {ledger.length > 0 && (
        <Card className="p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Rewards Ledger</h2>
          <div className="space-y-3">
            {ledger.map((entry) => (
              <div
                key={entry.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200"
              >
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">{entry.reason}</p>
                  <p className="text-sm text-gray-500 mt-1">{formatDate(entry.created_at)}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-gray-900">
                    {formatCurrency(entry.amount_cents)}
                  </p>
                  <span
                    className={`inline-block text-xs font-semibold px-2 py-1 rounded ${
                      entry.status === "earned"
                        ? "bg-green-100 text-green-800"
                        : entry.status === "redeemed"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {entry.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {!balance && !loading && (
        <Card className="p-12 text-center">
          <Award className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">Enter a customer ID to view their rewards</p>
        </Card>
      )}
    </div>
  );
}

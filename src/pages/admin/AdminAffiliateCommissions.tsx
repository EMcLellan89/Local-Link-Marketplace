import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAdminAuth } from "../../contexts/AdminAuthContext";
import { supabase } from "../../lib/supabase";
import { Check, X, DollarSign, ArrowLeft } from "lucide-react";
import BackButton from '../../components/ui/BackButton';

interface Commission {
  id: string;
  marketplace_affiliate_id: string;
  product_sku: string;
  order_id: string;
  sale_amount_cents: number;
  commission_rate_bp: number;
  commission_amount_cents: number;
  status: string;
  notes: string | null;
  eligible_at: string;
  created_at: string;
  marketplace_affiliates: {
    display_name: string;
    affiliate_code: string;
  };
}

export default function AdminAffiliateCommissions() {
  const { admin } = useAdminAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [commissions, setCommissions] = useState<Commission[]>([]);
  const [filter, setFilter] = useState<string>("pending");
  const [processing, setProcessing] = useState<string | null>(null);

  useEffect(() => {
    if (!admin) {
      navigate("/admin/login");
      return;
    }
    loadCommissions();
  }, [admin, filter]);

  async function loadCommissions() {
    try {
      let query = supabase
        .from("marketplace_affiliate_commissions")
        .select(`
          *,
          marketplace_affiliates (
            display_name,
            affiliate_code
          )
        `)
        .order("created_at", { ascending: false });

      if (filter !== "all") {
        query = query.eq("status", filter);
      }

      const { data } = await query;
      setCommissions(data || []);
    } catch (error) {
      console.error("Error loading commissions:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleApprove(commissionId: string) {
    if (!confirm("Approve this commission?")) return;

    setProcessing(commissionId);
    try {
      const token = (await supabase.auth.getSession()).data.session?.access_token;
      if (!token) throw new Error("No auth token");

      const res = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/admin-approve-marketplace-commission`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            commission_id: commissionId,
            action: "approve",
          }),
        }
      );

      const data = await res.json();
      if (data.ok) {
        alert("Commission approved!");
        loadCommissions();
      } else {
        alert("Error: " + (data.error || "Failed to approve"));
      }
    } catch (error) {
      console.error("Error approving commission:", error);
      alert("Error approving commission");
    } finally {
      setProcessing(null);
    }
  }

  async function handleReject(commissionId: string) {
    const notes = prompt("Reason for rejection (optional):");
    if (notes === null) return;

    setProcessing(commissionId);
    try {
      const token = (await supabase.auth.getSession()).data.session?.access_token;
      if (!token) throw new Error("No auth token");

      const res = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/admin-approve-marketplace-commission`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            commission_id: commissionId,
            action: "reject",
            notes,
          }),
        }
      );

      const data = await res.json();
      if (data.ok) {
        alert("Commission rejected");
        loadCommissions();
      } else {
        alert("Error: " + (data.error || "Failed to reject"));
      }
    } catch (error) {
      console.error("Error rejecting commission:", error);
      alert("Error rejecting commission");
    } finally {
      setProcessing(null);
    }
  }

  async function handleCreatePayoutBatch() {
    if (!confirm("Create payout batch for all approved commissions eligible for payout?")) return;

    setLoading(true);
    try {
      const token = (await supabase.auth.getSession()).data.session?.access_token;
      if (!token) throw new Error("No auth token");

      const res = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/admin-create-marketplace-payout-batch`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            min_payout_cents: 5000,
            method: "manual",
          }),
        }
      );

      const data = await res.json();
      if (data.ok) {
        alert(`Created ${data.payouts_created} payout batches!`);
        loadCommissions();
      } else {
        alert("Error: " + (data.error || "Failed to create batch"));
      }
    } catch (error) {
      console.error("Error creating payout batch:", error);
      alert("Error creating payout batch");
    } finally {
      setLoading(false);
    }
  }

  const formatCurrency = (cents: number) => `$${(cents / 100).toFixed(2)}`;
  const formatDate = (dateStr: string) => new Date(dateStr).toLocaleDateString();
  const formatRate = (bp: number) => `${(bp / 100).toFixed(0)}%`;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "approved":
        return "bg-blue-100 text-blue-800";
      case "paid":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const totalAmount = commissions.reduce((sum, c) => sum + c.commission_amount_cents, 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="mb-4">
          <BackButton />
        </div>
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => navigate("/admin/dashboard")}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Admin
        </button>

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Affiliate Commissions</h1>
            <p className="text-gray-600 mt-2">Manage commission approvals and payouts</p>
          </div>
          <button
            onClick={handleCreatePayoutBatch}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
          >
            <DollarSign className="w-4 h-4" />
            Create Payout Batch
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-wrap gap-2">
            {["pending", "approved", "paid", "rejected", "all"].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-lg capitalize transition-colors ${
                  filter === status
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex items-center gap-4 text-sm">
            <div>
              <span className="text-gray-600">Total Commissions:</span>{" "}
              <span className="font-semibold">{commissions.length}</span>
            </div>
            <div>
              <span className="text-gray-600">Total Amount:</span>{" "}
              <span className="font-semibold text-green-600">{formatCurrency(totalAmount)}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Partner</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sale</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rate</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Commission</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {commissions.map((comm) => (
                  <tr key={comm.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4 text-sm">
                      <div className="font-medium text-gray-900">{comm.marketplace_affiliates?.display_name}</div>
                      <div className="text-gray-500 font-mono text-xs">{comm.marketplace_affiliates?.affiliate_code}</div>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-900">{formatDate(comm.created_at)}</td>
                    <td className="px-4 py-4 text-sm text-gray-900">{comm.product_sku}</td>
                    <td className="px-4 py-4 text-sm text-gray-900">{formatCurrency(comm.sale_amount_cents)}</td>
                    <td className="px-4 py-4 text-sm text-gray-600">{formatRate(comm.commission_rate_bp)}</td>
                    <td className="px-4 py-4 text-sm font-semibold text-green-600">
                      {formatCurrency(comm.commission_amount_cents)}
                    </td>
                    <td className="px-4 py-4">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(comm.status)}`}>
                        {comm.status}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      {comm.status === "pending" && (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleApprove(comm.id)}
                            disabled={processing === comm.id}
                            className="p-1 bg-green-100 hover:bg-green-200 rounded text-green-700 disabled:opacity-50"
                            title="Approve"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleReject(comm.id)}
                            disabled={processing === comm.id}
                            className="p-1 bg-red-100 hover:bg-red-200 rounded text-red-700 disabled:opacity-50"
                            title="Reject"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                      {comm.status !== "pending" && <span className="text-gray-400 text-sm">—</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {commissions.length === 0 && (
            <div className="text-center py-12 text-gray-600">No commissions found for this filter</div>
          )}
        </div>

        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-900 mb-2">Payout Process</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>1. Review and approve/reject pending commissions</li>
            <li>2. Approved commissions become eligible after 30 days (Net-30)</li>
            <li>3. Click "Create Payout Batch" to generate payouts for eligible commissions ($50 minimum)</li>
            <li>4. Process payouts via your preferred method (manual transfer, PayPal, etc.)</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

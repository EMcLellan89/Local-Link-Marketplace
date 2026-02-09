import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { supabase } from "../../lib/supabase";
import { ArrowLeft, DollarSign, Calendar } from "lucide-react";
import BackButton from '../../components/ui/BackButton';

interface Commission {
  id: string;
  product_sku: string;
  order_id: string;
  sale_amount_cents: number;
  commission_rate_bp: number;
  commission_amount_cents: number;
  status: string;
  notes: string | null;
  eligible_at: string;
  approved_at: string | null;
  paid_at: string | null;
  created_at: string;
}

export default function AffiliateEarnings() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [commissions, setCommissions] = useState<Commission[]>([]);
  const [affiliate, setAffiliate] = useState<any>(null);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    loadEarnings();
  }, [user]);

  async function loadEarnings() {
    try {
      const { data: affiliateData } = await supabase
        .from("marketplace_affiliates")
        .select("id, affiliate_code, status")
        .eq("user_id", user?.id)
        .maybeSingle();

      if (!affiliateData) {
        navigate("/affiliate/dashboard");
        return;
      }

      setAffiliate(affiliateData);

      const { data: commissionsData } = await supabase
        .from("marketplace_affiliate_commissions")
        .select("*")
        .eq("marketplace_affiliate_id", affiliateData.id)
        .order("created_at", { ascending: false });

      setCommissions(commissionsData || []);
    } catch (error) {
      console.error("Error loading earnings:", error);
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

  const totalPending = commissions
    .filter((c) => c.status === "pending")
    .reduce((sum, c) => sum + c.commission_amount_cents, 0);

  const totalApproved = commissions
    .filter((c) => c.status === "approved")
    .reduce((sum, c) => sum + c.commission_amount_cents, 0);

  const totalPaid = commissions
    .filter((c) => c.status === "paid")
    .reduce((sum, c) => sum + c.commission_amount_cents, 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="mb-4">
          <BackButton />
        </div>
        <div className="text-gray-600">Loading earnings...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => navigate("/affiliate/dashboard")}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </button>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Commission Earnings</h1>
          <p className="text-gray-600 mt-2">Track your commission history and payout status</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Calendar className="w-5 h-5 text-yellow-600" />
              </div>
              <h3 className="text-sm font-medium text-gray-600">Pending Review</h3>
            </div>
            <p className="text-3xl font-bold text-gray-900">{formatCurrency(totalPending)}</p>
            <p className="text-xs text-gray-500 mt-1">Awaiting approval</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-blue-100 rounded-lg">
                <DollarSign className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="text-sm font-medium text-gray-600">Approved (Net-30)</h3>
            </div>
            <p className="text-3xl font-bold text-gray-900">{formatCurrency(totalApproved)}</p>
            <p className="text-xs text-gray-500 mt-1">Pending payout</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-green-100 rounded-lg">
                <DollarSign className="w-5 h-5 text-green-600" />
              </div>
              <h3 className="text-sm font-medium text-gray-600">Total Paid</h3>
            </div>
            <p className="text-3xl font-bold text-gray-900">{formatCurrency(totalPaid)}</p>
            <p className="text-xs text-gray-500 mt-1">All-time earnings</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Commission History</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sale</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rate</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Commission</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Eligible</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {commissions.map((comm) => (
                  <tr key={comm.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900">{formatDate(comm.created_at)}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{comm.product_sku}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{formatCurrency(comm.sale_amount_cents)}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{formatRate(comm.commission_rate_bp)}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-green-600">
                      {formatCurrency(comm.commission_amount_cents)}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(comm.status)}`}>
                        {comm.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {comm.status === "approved" || comm.status === "paid"
                        ? formatDate(comm.eligible_at)
                        : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {commissions.length === 0 && (
            <div className="text-center py-12 text-gray-600">
              <DollarSign className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p>No commissions yet</p>
              <p className="text-sm mt-2">Start sharing your referral links to earn commissions</p>
              <button
                onClick={() => navigate("/affiliate/products")}
                className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                View Products
              </button>
            </div>
          )}
        </div>

        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-900 mb-2">Payout Information</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Commissions are reviewed within 48 hours of the first payment</li>
            <li>• Approved commissions are paid Net-30 (30 days after eligible date)</li>
            <li>• Minimum payout threshold: $50</li>
            <li>• Payouts are processed weekly on Fridays</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

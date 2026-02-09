import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { supabase } from "../../lib/supabase";
import { DollarSign, Users, TrendingUp, Copy, Check, ExternalLink } from "lucide-react";
import BackButton from '../../components/ui/BackButton';

interface Metrics {
  referrals_count: number;
  commission_lifetime_cents: number;
  commission_last30_cents: number;
  commission_pending_cents: number;
  commission_approved_cents: number;
  commission_paid_cents: number;
}

export default function AffiliateDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [affiliate, setAffiliate] = useState<any>(null);
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    loadDashboard();
  }, [user]);

  async function loadDashboard() {
    try {
      const token = (await supabase.auth.getSession()).data.session?.access_token;
      if (!token) throw new Error("No auth token");

      const res = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/get-marketplace-affiliate-dashboard`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();
      if (data.ok) {
        setAffiliate(data.affiliate);
        setMetrics(data.metrics);
      } else if (res.status === 404) {
        await createAffiliate();
      }
    } catch (error) {
      console.error("Error loading dashboard:", error);
    } finally {
      setLoading(false);
    }
  }

  async function createAffiliate() {
    try {
      const token = (await supabase.auth.getSession()).data.session?.access_token;
      if (!token) return;

      const res = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-marketplace-affiliate`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();
      if (data.ok) {
        setAffiliate(data.affiliate);
        loadDashboard();
      }
    } catch (error) {
      console.error("Error creating affiliate:", error);
    }
  }

  function copyCode() {
    if (affiliate?.affiliate_code) {
      navigator.clipboard.writeText(affiliate.affiliate_code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

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

  if (!affiliate) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Become a Local-Link Partner</h2>
          <p className="text-gray-600 mb-6">Earn commissions by referring merchants and customers to our platform</p>
          <button
            onClick={createAffiliate}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Get Started
          </button>
        </div>
      </div>
    );
  }

  const formatCurrency = (cents: number) => `$${(cents / 100).toFixed(2)}`;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Partner Dashboard</h1>
          <p className="text-gray-600 mt-2">Track your earnings and share your referral links</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Your Partner Code</p>
              <p className="text-2xl font-mono font-bold text-gray-900">{affiliate.affiliate_code}</p>
            </div>
            <button
              onClick={copyCode}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? "Copied!" : "Copy Code"}</span>
            </button>
          </div>
          <div className="mt-4 flex items-center gap-2 text-sm">
            <span className={`px-2 py-1 rounded-full ${affiliate.status === "active" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}>
              {affiliate.status}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-600">Lifetime Earnings</h3>
              <DollarSign className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900">{formatCurrency(metrics?.commission_lifetime_cents || 0)}</p>
            <p className="text-sm text-gray-600 mt-2">
              Last 30 days: {formatCurrency(metrics?.commission_last30_cents || 0)}
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-600">Pending</h3>
              <TrendingUp className="w-5 h-5 text-yellow-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900">{formatCurrency(metrics?.commission_pending_cents || 0)}</p>
            <p className="text-sm text-gray-600 mt-2">
              Approved: {formatCurrency(metrics?.commission_approved_cents || 0)}
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-600">Total Paid</h3>
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900">{formatCurrency(metrics?.commission_paid_cents || 0)}</p>
            <p className="text-sm text-gray-600 mt-2">{metrics?.referrals_count || 0} referrals</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <button
            onClick={() => navigate("/affiliate/products")}
            className="bg-white rounded-lg shadow-sm p-6 text-left hover:shadow-md transition-shadow"
          >
            <ExternalLink className="w-6 h-6 text-blue-600 mb-3" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Products to Sell</h3>
            <p className="text-sm text-gray-600">Browse our product catalog and get your referral links</p>
          </button>

          <button
            onClick={() => navigate("/affiliate/earnings")}
            className="bg-white rounded-lg shadow-sm p-6 text-left hover:shadow-md transition-shadow"
          >
            <DollarSign className="w-6 h-6 text-green-600 mb-3" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Earnings</h3>
            <p className="text-sm text-gray-600">View detailed commission history and payout status</p>
          </button>

          <button
            onClick={() => navigate("/course/partner-accelerator-sales")}
            className="bg-white rounded-lg shadow-sm p-6 text-left hover:shadow-md transition-shadow"
          >
            <TrendingUp className="w-6 h-6 text-purple-600 mb-3" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Training</h3>
            <p className="text-sm text-gray-600">Learn how to maximize your earnings with our partner training</p>
          </button>
        </div>
      </div>
    </div>
  );
}

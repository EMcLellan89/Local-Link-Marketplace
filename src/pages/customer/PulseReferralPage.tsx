import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Share2,
  Copy,
  Mail,
  MessageSquare,
  Users,
  Award,
  ChevronLeft,
  Check,
  TrendingUp,
  Gift,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { generateReferralCode, getPointsBalance } from '../../lib/pulse';
import Button from '../../components/ui/Button';
import Card, { CardBody } from '../../components/ui/Card';

export default function PulseReferralPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [customerId, setCustomerId] = useState<string | null>(null);
  const [referralCode, setReferralCode] = useState<string>('');
  const [referralUrl, setReferralUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [points, setPoints] = useState(0);
  const [referralStats, setReferralStats] = useState({
    totalReferrals: 0,
    pointsEarned: 0,
    successfulSignups: 0,
  });

  useEffect(() => {
    loadReferralData();
  }, [user]);

  const loadReferralData = async () => {
    if (!user) {
      navigate('/login?redirect=/pulse/referral');
      return;
    }

    try {
      setLoading(true);

      // Get customer
      const { data: customer } = await supabase
        .from('customers')
        .select('id, points_balance')
        .eq('user_id', user.id)
        .single();

      if (!customer) {
        setLoading(false);
        return;
      }

      setCustomerId(customer.id);
      setPoints(customer.points_balance || 0);

      // Generate or get referral code
      const code = await generateReferralCode(customer.id);
      setReferralCode(code);

      // Build referral URL
      const baseUrl = window.location.origin;
      const url = `${baseUrl}/pulse?ref=${code}`;
      setReferralUrl(url);

      // Get referral stats
      const { data: referrals } = await supabase
        .from('pulse_referrals')
        .select('*')
        .eq('referrer_id', customer.id);

      const totalReferrals = referrals?.length || 0;
      const successfulSignups = referrals?.filter((r) => r.signup_completed).length || 0;

      setReferralStats({
        totalReferrals,
        pointsEarned: successfulSignups * 50, // 50 points per successful referral
        successfulSignups,
      });

      setLoading(false);
    } catch (error) {
      console.error('Error loading referral data:', error);
      setLoading(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(referralUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Error copying to clipboard:', error);
    }
  };

  const shareViaEmail = () => {
    const subject = encodeURIComponent('Check out these amazing local deals!');
    const body = encodeURIComponent(
      `Hey! I've been using Pulse to discover amazing deals from local businesses. Use my link to get started and earn points: ${referralUrl}`
    );
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  const shareViaSMS = () => {
    const message = encodeURIComponent(
      `Check out these local deals on Pulse! ${referralUrl}`
    );
    window.location.href = `sms:?body=${message}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#2BB673]"></div>
          <p className="mt-4 text-slate-600">Loading Referral Info...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#2BB673] to-emerald-600 text-white">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <Button
            variant="ghost"
            size="sm"
            className="mb-4 text-white hover:bg-white/20"
            onClick={() => navigate('/pulse')}
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back to Feed
          </Button>

          <div className="flex items-center gap-3 mb-4">
            <Share2 className="w-10 h-10" />
            <h1 className="text-4xl font-bold">Share & Earn</h1>
          </div>
          <p className="text-emerald-50 text-lg">
            Invite friends and earn 50 points for each signup
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Stats Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card variant="bordered">
            <CardBody>
              <div className="flex items-center justify-between mb-2">
                <Users className="w-8 h-8 text-blue-600" />
                <span className="text-2xl font-bold text-slate-900">
                  {referralStats.totalReferrals}
                </span>
              </div>
              <p className="text-sm text-slate-600">Total Clicks</p>
            </CardBody>
          </Card>

          <Card variant="bordered">
            <CardBody>
              <div className="flex items-center justify-between mb-2">
                <TrendingUp className="w-8 h-8 text-[#2BB673]" />
                <span className="text-2xl font-bold text-slate-900">
                  {referralStats.successfulSignups}
                </span>
              </div>
              <p className="text-sm text-slate-600">Successful Signups</p>
            </CardBody>
          </Card>

          <Card variant="bordered">
            <CardBody>
              <div className="flex items-center justify-between mb-2">
                <Award className="w-8 h-8 text-amber-600" />
                <span className="text-2xl font-bold text-slate-900">
                  {referralStats.pointsEarned}
                </span>
              </div>
              <p className="text-sm text-slate-600">Points Earned</p>
            </CardBody>
          </Card>
        </div>

        {/* How it Works */}
        <Card variant="bordered" className="mb-8 bg-gradient-to-br from-blue-50 to-cyan-50">
          <CardBody className="p-6">
            <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Gift className="w-6 h-6 text-[#2BB673]" />
              How It Works
            </h2>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="bg-[#2BB673] text-white rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">
                  1
                </div>
                <div>
                  <p className="font-semibold text-slate-900">Share your unique link</p>
                  <p className="text-sm text-slate-600">
                    Copy and share your referral link with friends and family
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-[#2BB673] text-white rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">
                  2
                </div>
                <div>
                  <p className="font-semibold text-slate-900">They sign up</p>
                  <p className="text-sm text-slate-600">
                    When they create an account using your link
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-[#2BB673] text-white rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">
                  3
                </div>
                <div>
                  <p className="font-semibold text-slate-900">You both earn points</p>
                  <p className="text-sm text-slate-600">
                    You get 50 points, they get 25 bonus points to start!
                  </p>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Referral Link Card */}
        <Card variant="bordered" className="mb-8">
          <CardBody className="p-6">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Your Referral Link</h2>

            <div className="bg-slate-50 rounded-lg p-4 mb-4 flex items-center gap-3">
              <code className="flex-1 text-sm font-mono text-slate-700 break-all">
                {referralUrl}
              </code>
              <Button
                variant="outline"
                size="sm"
                onClick={copyToClipboard}
                className="flex-shrink-0"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 mr-1" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-1" />
                    Copy
                  </>
                )}
              </Button>
            </div>

            <div className="grid md:grid-cols-2 gap-3">
              <Button variant="outline" onClick={shareViaEmail} className="w-full">
                <Mail className="w-4 h-4 mr-2" />
                Share via Email
              </Button>
              <Button variant="outline" onClick={shareViaSMS} className="w-full">
                <MessageSquare className="w-4 h-4 mr-2" />
                Share via SMS
              </Button>
            </div>
          </CardBody>
        </Card>

        {/* Referral Code */}
        <Card variant="bordered">
          <CardBody className="p-6">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Your Referral Code</h2>
            <p className="text-sm text-slate-600 mb-4">
              Friends can also enter this code manually when signing up:
            </p>
            <div className="bg-gradient-to-r from-[#2BB673] to-emerald-600 rounded-lg p-6 text-center">
              <p className="text-sm text-emerald-50 mb-2">Referral Code</p>
              <p className="text-3xl font-bold text-white tracking-wider">{referralCode}</p>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}

import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, ArrowRight, Share2 } from 'lucide-react';

export default function CheckoutSuccess() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [copied, setCopied] = useState(false);

  const referralLink = `${window.location.origin}/marketplace?ref=YOUR_CODE`;

  function copyReferralLink() {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="mb-6">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Payment Successful!
            </h1>
            <p className="text-lg text-gray-600">
              Thank you for your purchase. Your order has been confirmed.
            </p>
          </div>

          {sessionId && (
            <div className="mb-8 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">Order ID</p>
              <p className="font-mono text-sm text-gray-900 mt-1">{sessionId}</p>
            </div>
          )}

          <div className="space-y-4 mb-8">
            <div className="p-6 bg-blue-50 rounded-xl border-2 border-blue-200">
              <h3 className="font-semibold text-gray-900 mb-2">What's Next?</h3>
              <ul className="text-left space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>You'll receive a confirmation email with your receipt</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Access details and login information will be sent shortly</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Check your dashboard for instant access to your purchase</span>
                </li>
              </ul>
            </div>

            <div className="p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border-2 border-purple-200">
              <div className="flex items-center justify-center gap-2 mb-3">
                <Share2 className="w-5 h-5 text-purple-600" />
                <h3 className="font-semibold text-gray-900">Earn by Referring Friends</h3>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                Share your referral link and earn commissions on every sale!
              </p>
              <button
                onClick={copyReferralLink}
                className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
              >
                {copied ? 'Link Copied!' : 'Copy Your Referral Link'}
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => navigate('/hub')}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Go to Dashboard
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => navigate('/marketplace')}
              className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:border-gray-400 transition-colors font-medium"
            >
              Browse More Products
            </button>
          </div>
        </div>

        <div className="mt-6 text-center text-sm text-gray-600">
          <p>
            Need help? Contact our support team at{' '}
            <a href="mailto:support@local-link.com" className="text-blue-600 hover:text-blue-700">
              support@local-link.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

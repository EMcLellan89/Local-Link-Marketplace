import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, ArrowRight, Share2, BookOpen, Sparkles } from 'lucide-react';

export default function StoryLabCheckoutSuccess() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('order_id') || searchParams.get('session_id');
  const vertical = searchParams.get('vertical') || 'kids'; // kids, teen, or adult
  const [copied, setCopied] = useState(false);

  const referralLink = `${window.location.origin}/storylab/${vertical}/checkout?ref=YOUR_CODE`;

  // Vertical-specific configuration
  const verticalConfig = {
    kids: {
      title: 'StoryLab Kids',
      color: 'blue',
      gradientFrom: 'from-blue-50',
      gradientTo: 'to-cyan-50',
      borderColor: 'border-blue-200',
      buttonBg: 'bg-blue-600',
      buttonHover: 'hover:bg-blue-700',
      icon: '📚',
      dashboardPath: '/app/storylab/kids/dashboard'
    },
    teen: {
      title: 'StoryLab Teen',
      color: 'purple',
      gradientFrom: 'from-purple-50',
      gradientTo: 'to-pink-50',
      borderColor: 'border-purple-200',
      buttonBg: 'bg-purple-600',
      buttonHover: 'hover:bg-purple-700',
      icon: '✨',
      dashboardPath: '/app/storylab/teen/dashboard'
    },
    adult: {
      title: 'StoryLab Adult',
      color: 'emerald',
      gradientFrom: 'from-emerald-50',
      gradientTo: 'to-teal-50',
      borderColor: 'border-emerald-200',
      buttonBg: 'bg-emerald-600',
      buttonHover: 'hover:bg-emerald-700',
      icon: '📖',
      dashboardPath: '/app/storylab/adult/dashboard'
    }
  };

  const config = verticalConfig[vertical as keyof typeof verticalConfig] || verticalConfig.kids;

  function copyReferralLink() {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="mb-6">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Payment Received {config.icon}
            </h1>
            <p className="text-lg text-gray-600">
              Welcome to {config.title}! Your order is being processed.
            </p>
          </div>

          {orderId && (
            <div className="mb-8 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">Order ID</p>
              <p className="font-mono text-sm text-gray-900 mt-1">{orderId}</p>
            </div>
          )}

          <div className="space-y-4 mb-8">
            <div className={`p-6 ${config.gradientFrom} ${config.gradientTo} bg-gradient-to-r rounded-xl border-2 ${config.borderColor}`}>
              <div className="flex items-center justify-center gap-2 mb-3">
                <Sparkles className={`w-5 h-5 text-${config.color}-600`} />
                <h3 className="font-semibold text-gray-900">What's Next?</h3>
              </div>
              <ul className="text-left space-y-3 text-gray-700">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>You'll receive a confirmation email with your receipt and login details</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Access your dashboard to start creating your first story</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>All your projects and books will be saved automatically</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Need help? Our support team is standing by</span>
                </li>
              </ul>
            </div>

            <div className="p-6 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl border-2 border-orange-200">
              <div className="flex items-center justify-center gap-2 mb-3">
                <Share2 className="w-5 h-5 text-orange-600" />
                <h3 className="font-semibold text-gray-900">Earn 25% Commission</h3>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                Share StoryLab with friends and earn 25% commission on every sale! Join our partner program.
              </p>
              <button
                onClick={copyReferralLink}
                className="w-full px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium"
              >
                {copied ? 'Link Copied!' : 'Copy Your Referral Link'}
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => navigate(config.dashboardPath)}
              className={`flex items-center justify-center gap-2 px-6 py-3 ${config.buttonBg} text-white rounded-lg ${config.buttonHover} transition-colors font-medium`}
            >
              <BookOpen className="w-5 h-5" />
              Start Creating Stories
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => navigate(`/storylab/${vertical}/checkout`)}
              className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:border-gray-400 transition-colors font-medium"
            >
              Browse More Plans
            </button>
          </div>
        </div>

        <div className="mt-6 text-center text-sm text-gray-600">
          <p>
            Need help? Contact our support team at{' '}
            <a href="mailto:support@storylab.com" className={`text-${config.color}-600 hover:text-${config.color}-700`}>
              support@storylab.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

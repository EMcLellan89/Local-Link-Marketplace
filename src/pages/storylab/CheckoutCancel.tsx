import { useNavigate, useSearchParams } from 'react-router-dom';
import { XCircle, ArrowRight, RefreshCcw } from 'lucide-react';

export default function StoryLabCheckoutCancel() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('order_id') || searchParams.get('session_id');
  const vertical = searchParams.get('vertical') || 'kids'; // kids, teen, or adult

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
      icon: '📚'
    },
    teen: {
      title: 'StoryLab Teen',
      color: 'purple',
      gradientFrom: 'from-purple-50',
      gradientTo: 'to-pink-50',
      borderColor: 'border-purple-200',
      buttonBg: 'bg-purple-600',
      buttonHover: 'hover:bg-purple-700',
      icon: '✨'
    },
    adult: {
      title: 'StoryLab Adult',
      color: 'emerald',
      gradientFrom: 'from-emerald-50',
      gradientTo: 'to-teal-50',
      borderColor: 'border-emerald-200',
      buttonBg: 'bg-emerald-600',
      buttonHover: 'hover:bg-emerald-700',
      icon: '📖'
    }
  };

  const config = verticalConfig[vertical as keyof typeof verticalConfig] || verticalConfig.kids;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="mb-6">
            <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <XCircle className="w-12 h-12 text-orange-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Checkout Canceled
            </h1>
            <p className="text-lg text-gray-600">
              No worries! You weren't charged anything.
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
                <RefreshCcw className={`w-5 h-5 text-${config.color}-600`} />
                <h3 className="font-semibold text-gray-900">Why did you cancel?</h3>
              </div>
              <ul className="text-left space-y-3 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-lg">💳</span>
                  <span>Having payment issues? We accept all major cards and PayPal</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-lg">❓</span>
                  <span>Have questions? Our support team is here to help</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-lg">💰</span>
                  <span>Need a different plan? We have options for every budget</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-lg">🎁</span>
                  <span>Looking for a discount? Check your email for special offers</span>
                </li>
              </ul>
            </div>

            <div className="p-6 bg-gradient-to-r from-green-50 to-teal-50 rounded-xl border-2 border-green-200">
              <h3 className="font-semibold text-gray-900 mb-2">Still Interested?</h3>
              <p className="text-sm text-gray-600 mb-4">
                Join thousands of creators already using {config.title} to bring their stories to life.
                100% satisfaction guaranteed or your money back.
              </p>
              <div className="flex items-center justify-center gap-2 text-sm text-gray-700">
                <span>⭐⭐⭐⭐⭐</span>
                <span className="font-medium">4.9/5 from 2,400+ reviews</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => navigate(`/storylab/${vertical}/checkout`)}
              className={`flex items-center justify-center gap-2 px-6 py-3 ${config.buttonBg} text-white rounded-lg ${config.buttonHover} transition-colors font-medium`}
            >
              Try Again
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => navigate('/')}
              className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:border-gray-400 transition-colors font-medium"
            >
              Back to Home
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

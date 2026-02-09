import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, XCircle, Clock, ArrowRight, FileText } from 'lucide-react';
import BusinessHubLayout from '../../components/layout/BusinessHubLayout';
import Card, { CardBody } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import BackButton from '../components/ui/BackButton';
import { supabase } from '../../lib/supabase';

export default function SwipeFilePaymentCompletePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const accessId = searchParams.get('access');

  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<'checking' | 'success' | 'pending' | 'failed'>('checking');
  const [access, setAccess] = useState<any>(null);
  const [transaction, setTransaction] = useState<any>(null);

  useEffect(() => {
    if (accessId) {
      checkPaymentStatus();
    }
  }, [accessId]);

  const checkPaymentStatus = async () => {
    if (!accessId) return;

    try {
      let attempts = 0;
      const maxAttempts = 10;

      const checkStatus = async (): Promise<boolean> => {
        const { data: accessData, error: accessError } = await supabase
          .from('swipe_file_access')
          .select('*')
          .eq('id', accessId)
          .maybeSingle();

        if (accessError) throw accessError;

        if (!accessData) {
          throw new Error('Access record not found');
        }

        setAccess(accessData);

        const { data: txData, error: txError } = await supabase
          .from('paybright_transactions')
          .select('*')
          .eq('reference_id', accessId)
          .eq('reference_table', 'swipe_file_access')
          .maybeSingle();

        if (txError && txError.code !== 'PGRST116') {
          throw txError;
        }

        if (txData) {
          setTransaction(txData);

          if (txData.status === 'authorized' || txData.status === 'captured' || txData.status === 'completed') {
            if (accessData.access_granted_at) {
              setStatus('success');
              return true;
            }
          } else if (txData.status === 'failed') {
            setStatus('failed');
            return true;
          }
        }

        return false;
      };

      const pollStatus = async () => {
        while (attempts < maxAttempts) {
          const isComplete = await checkStatus();
          if (isComplete) {
            setLoading(false);
            return;
          }

          attempts++;
          await new Promise(resolve => setTimeout(resolve, 2000));
        }

        setStatus('pending');
        setLoading(false);
      };

      await pollStatus();
    } catch (error) {
      console.error('Error checking payment status:', error);
      setStatus('failed');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <BusinessHubLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-[#2BB673] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-600">Verifying your payment...</p>
          </div>
        </div>
      </BusinessHubLayout>
    );
  }

  return (
    <BusinessHubLayout>
      <div className="max-w-2xl mx-auto py-12">
        <Card variant="bordered">
          <CardBody className="text-center py-12">
            {status === 'success' && (
              <>
                <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
                <h1 className="text-3xl font-bold text-slate-900 mb-4">
                  Access Unlocked!
                </h1>
                <p className="text-lg text-slate-600 mb-8">
                  You now have lifetime access to the Ad Swipe File Library with 1,000+ proven marketing assets.
                </p>

                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-6 mb-8">
                  <div className="flex items-center justify-center mb-4">
                    <FileText className="w-12 h-12 text-purple-600" />
                  </div>
                  <h3 className="font-bold text-slate-900 mb-2">What You Can Access Now:</h3>
                  <ul className="text-left space-y-2 max-w-md mx-auto">
                    <li className="flex items-center text-sm text-slate-700">
                      <span className="text-purple-600 mr-2">✓</span>
                      500+ Facebook & Instagram ad templates
                    </li>
                    <li className="flex items-center text-sm text-slate-700">
                      <span className="text-purple-600 mr-2">✓</span>
                      200+ Google ad campaigns
                    </li>
                    <li className="flex items-center text-sm text-slate-700">
                      <span className="text-purple-600 mr-2">✓</span>
                      100+ Landing page designs
                    </li>
                    <li className="flex items-center text-sm text-slate-700">
                      <span className="text-purple-600 mr-2">✓</span>
                      Complete sales scripts library
                    </li>
                    <li className="flex items-center text-sm text-slate-700">
                      <span className="text-purple-600 mr-2">✓</span>
                      Industry-specific deal ideas
                    </li>
                  </ul>
                </div>

                <div className="space-y-3">
                  <Button
                    fullWidth
                    size="lg"
                    onClick={() => navigate('/merchant/swipe-file')}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    Browse Swipe File Library
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                  <Button
                    fullWidth
                    variant="outline"
                    onClick={() => navigate('/merchant/dashboard')}
                  >
                    Go to Dashboard
                  </Button>
                </div>
              </>
            )}

            {status === 'pending' && (
              <>
                <Clock className="w-20 h-20 text-yellow-500 mx-auto mb-6" />
                <h1 className="text-3xl font-bold text-slate-900 mb-4">
                  Payment Processing
                </h1>
                <p className="text-lg text-slate-600 mb-8">
                  Your payment is being processed. This may take a few moments. We'll send you a confirmation email once complete.
                </p>

                <div className="space-y-3">
                  <Button
                    fullWidth
                    onClick={() => window.location.reload()}
                  >
                    Check Status Again
                  </Button>
                  <Button
                    fullWidth
                    variant="outline"
                    onClick={() => navigate('/merchant/swipe-file')}
                  >
                    Return to Swipe File
                  </Button>
                </div>
              </>
            )}

            {status === 'failed' && (
              <>
                <XCircle className="w-20 h-20 text-red-500 mx-auto mb-6" />
                <h1 className="text-3xl font-bold text-slate-900 mb-4">
                  Payment Failed
                </h1>
                <p className="text-lg text-slate-600 mb-8">
                  We were unable to process your payment. Please try again or contact support if the problem persists.
                </p>

                {transaction?.failure_reason && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
                    <p className="text-sm text-red-800">
                      <strong>Reason:</strong> {transaction.failure_reason}
                    </p>
                  </div>
                )}

                <div className="space-y-3">
                  <Button
                    fullWidth
                    size="lg"
                    onClick={() => navigate('/merchant/swipe-file/checkout')}
                  >
                    Try Again
                  </Button>
                  <Button
                    fullWidth
                    variant="outline"
                    onClick={() => navigate('/merchant/swipe-file')}
                  >
                    Return to Swipe File
                  </Button>
                </div>
              </>
            )}
          </CardBody>
        </Card>
      </div>
    </BusinessHubLayout>
  );
}

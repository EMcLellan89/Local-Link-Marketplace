import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { CheckCircle, Circle, Loader, FileText, AlertCircle } from 'lucide-react';
import Button from '../../components/ui/Button';
import BackButton from '../../components/ui/BackButton';

interface OnboardingStep {
  key: string;
  title: string;
  description: string;
  section: string;
  is_required: boolean;
  sort_order: number;
}

interface StepProgress {
  step_key: string;
  completed: boolean;
  completed_at: string | null;
}

interface CompletionData {
  total_steps: number;
  completed_steps: number;
  required_steps: number;
  required_completed: number;
  completion_percentage: number;
  is_complete: boolean;
}

export default function PartnerOnboardingPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [steps, setSteps] = useState<OnboardingStep[]>([]);
  const [progress, setProgress] = useState<Map<string, StepProgress>>(new Map());
  const [completion, setCompletion] = useState<CompletionData | null>(null);
  const [showAgreement, setShowAgreement] = useState(false);
  const [signingAgreement, setSigningAgreement] = useState(false);
  const [agreementData, setAgreementData] = useState({
    signed_name: '',
    signed_title: '',
    signed_email: user?.email || '',
  });

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    loadOnboardingData();
  }, [user]);

  async function loadOnboardingData() {
    try {
      const [stepsRes, progressRes, completionRes] = await Promise.all([
        supabase.from('partner_onboarding_steps').select('*').order('sort_order'),
        supabase
          .from('partner_onboarding_progress')
          .select('*')
          .eq('partner_id', user!.id),
        supabase.rpc('get_partner_onboarding_completion', {
          p_partner_id: user!.id,
        }),
      ]);

      if (stepsRes.error) throw stepsRes.error;
      if (progressRes.error) throw progressRes.error;

      setSteps(stepsRes.data || []);

      const progressMap = new Map();
      (progressRes.data || []).forEach((p: StepProgress) => {
        progressMap.set(p.step_key, p);
      });
      setProgress(progressMap);

      setCompletion(completionRes.data);
    } catch (error) {
      console.error('Error loading onboarding:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleStepClick(step: OnboardingStep) {
    if (step.key === 'agreement_signed') {
      setShowAgreement(true);
      return;
    }

    if (step.key === 'partner_crm_activated') {
      navigate('/partner/billing');
      return;
    }

    if (step.key === 'download_swipe_files') {
      navigate('/partner/assets');
      return;
    }

    if (step.key === 'profile_confirmed') {
      try {
        await supabase.from('partner_onboarding_progress').upsert({
          partner_id: user!.id,
          step_key: 'profile_confirmed',
          completed: true,
          completed_at: new Date().toISOString(),
        }, { onConflict: 'partner_id,step_key' });

        await loadOnboardingData();
      } catch (error) {
        console.error('Error updating progress:', error);
      }
    }
  }

  async function handleSignAgreement() {
    if (!agreementData.signed_name || !agreementData.signed_email) {
      alert('Please fill in all required fields');
      return;
    }

    setSigningAgreement(true);
    try {
      const { error } = await supabase.functions.invoke('partner-sign-agreement', {
        body: {
          template_version: 'v1.0',
          signed_name: agreementData.signed_name,
          signed_title: agreementData.signed_title,
          signed_email: agreementData.signed_email,
        },
      });

      if (error) throw error;

      alert('Agreement signed successfully!');
      setShowAgreement(false);
      await loadOnboardingData();
    } catch (error) {
      console.error('Error signing agreement:', error);
      alert('Failed to sign agreement. Please try again.');
    } finally {
      setSigningAgreement(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="mb-4">
          <BackButton />
        </div>
        <Loader className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  const sections = ['account_setup', 'tracking_setup', 'sales_readiness', 'first_deal_sprint', 'compliance'];
  const sectionTitles: Record<string, string> = {
    account_setup: 'Account Setup',
    tracking_setup: 'Tracking Setup',
    sales_readiness: 'Sales Readiness',
    first_deal_sprint: 'First Deal Sprint',
    compliance: 'Compliance',
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Partner Onboarding</h1>
          <p className="text-gray-600 mt-2">
            Complete these steps to activate your partner account
          </p>
        </div>

        {completion && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Overall Progress</h2>
              <span className="text-2xl font-bold text-blue-600">
                {completion.completion_percentage}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-blue-600 h-3 rounded-full transition-all"
                style={{ width: `${completion.completion_percentage}%` }}
              />
            </div>
            <p className="text-sm text-gray-600 mt-2">
              {completion.required_completed} of {completion.required_steps} required steps completed
            </p>
            {completion.is_complete && (
              <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-green-900 font-semibold">
                  Onboarding complete! You're ready to start earning commissions.
                </p>
              </div>
            )}
          </div>
        )}

        <div className="space-y-8">
          {sections.map((sectionKey) => {
            const sectionSteps = steps.filter((s) => s.section === sectionKey);
            if (sectionSteps.length === 0) return null;

            return (
              <div key={sectionKey} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  {sectionTitles[sectionKey]}
                </h3>
                <div className="space-y-3">
                  {sectionSteps.map((step) => {
                    const stepProgress = progress.get(step.key);
                    const isCompleted = stepProgress?.completed || false;

                    return (
                      <div
                        key={step.key}
                        className={`flex items-start gap-3 p-4 rounded-lg border transition-all ${
                          isCompleted
                            ? 'bg-green-50 border-green-200'
                            : 'bg-gray-50 border-gray-200 hover:border-gray-300 cursor-pointer'
                        }`}
                        onClick={() => !isCompleted && handleStepClick(step)}
                      >
                        <div className="flex-shrink-0 mt-0.5">
                          {isCompleted ? (
                            <CheckCircle className="w-5 h-5 text-green-600" />
                          ) : (
                            <Circle className="w-5 h-5 text-gray-400" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold text-gray-900">{step.title}</h4>
                            {step.is_required && !isCompleted && (
                              <span className="text-xs bg-red-100 text-red-800 px-2 py-0.5 rounded-full">
                                Required
                              </span>
                            )}
                          </div>
                          {step.description && (
                            <p className="text-sm text-gray-600 mt-1">{step.description}</p>
                          )}
                          {stepProgress?.completed_at && (
                            <p className="text-xs text-gray-500 mt-1">
                              Completed {new Date(stepProgress.completed_at).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {showAgreement && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <FileText className="w-6 h-6 text-blue-600" />
                  <h2 className="text-2xl font-bold text-gray-900">Partner Agreement</h2>
                </div>

                <div className="bg-gray-50 rounded-lg p-6 mb-6 max-h-64 overflow-y-auto">
                  <h3 className="font-semibold text-gray-900 mb-4">Local-Link Partner Terms</h3>
                  <div className="text-sm text-gray-700 space-y-3">
                    <p>
                      <strong>1. Commission Structure:</strong> Commissions are earned only on completed,
                      non-refunded transactions. Rates are defined per product and may be updated with notice.
                    </p>
                    <p>
                      <strong>2. Payout Eligibility:</strong> Active Partner CRM subscription is required
                      to release commission payouts. Commissions may be withheld if subscription is inactive.
                    </p>
                    <p>
                      <strong>3. No Income Guarantees:</strong> Partners may not represent or imply guaranteed
                      earnings, results, or income to prospective customers.
                    </p>
                    <p>
                      <strong>4. Approved Marketing:</strong> Partners must use approved marketing materials
                      provided within the Partner CRM. Custom promotional materials require prior approval.
                    </p>
                    <p>
                      <strong>5. Termination:</strong> We reserve the right to terminate partnership access
                      for non-compliance, misrepresentation, or violation of terms.
                    </p>
                    <p>
                      <strong>6. Attribution:</strong> All sales must be properly attributed using your unique
                      partner code. Commission disputes will be resolved based on attribution records.
                    </p>
                  </div>
                </div>

                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Legal Name <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      value={agreementData.signed_name}
                      onChange={(e) => setAgreementData({ ...agreementData, signed_name: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                      placeholder="John Doe"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Title (Optional)
                    </label>
                    <input
                      type="text"
                      value={agreementData.signed_title}
                      onChange={(e) => setAgreementData({ ...agreementData, signed_title: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                      placeholder="Owner, CEO, etc."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="email"
                      value={agreementData.signed_email}
                      onChange={(e) => setAgreementData({ ...agreementData, signed_email: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-yellow-900">
                    By signing this agreement electronically, you acknowledge that your electronic signature
                    is legally binding and has the same effect as a handwritten signature.
                  </p>
                </div>

                <div className="flex gap-3">
                  <Button
                    variant="secondary"
                    onClick={() => setShowAgreement(false)}
                    disabled={signingAgreement}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    onClick={handleSignAgreement}
                    disabled={signingAgreement}
                    className="flex-1"
                  >
                    {signingAgreement ? 'Signing...' : 'Sign Agreement'}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
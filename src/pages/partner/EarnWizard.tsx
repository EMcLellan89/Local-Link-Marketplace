import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { CheckCircle, Circle } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import BackButton from '../../components/ui/BackButton';

const STEPS = [
  {
    key: 'welcome',
    title: 'Welcome to Partner Program',
    description: 'You\'re about to activate your partner account, choose your territory, and unlock AI scripts to onboard merchants fast.'
  },
  {
    key: 'territory',
    title: 'Choose Your Territory',
    description: 'Go to your Partner Dashboard to select a territory. Start with one city and expand after 10 merchants.'
  },
  {
    key: 'scripts',
    title: 'Get AI Scripts',
    description: 'Use the AI Prompt Library to generate DMs, emails, call scripts, and deal ideas tailored to each business.'
  },
  {
    key: 'training',
    title: 'Complete Training',
    description: 'Watch the onboarding videos, then use the checklist when you sign your first merchant.'
  },
  {
    key: 'go',
    title: 'Start Earning',
    description: 'Post 2–3 short videos daily, DM 20 local businesses, and onboard your first 5 merchants this week.'
  },
];

export default function EarnWizard() {
  const [stepIndex, setStepIndex] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    loadProgress();
    markStep(STEPS[0].key, true);
  }, []);

  async function loadProgress() {
    const { data } = await supabase
      .from('onboarding_progress')
      .select('step, completed')
      .eq('completed', true);

    if (data) {
      setCompletedSteps(data.map(d => d.step));
    }
  }

  async function markStep(step: string, completed: boolean) {
    const { data: session } = await supabase.auth.getSession();
    const userId = session.session?.user.id;
    if (!userId) return;

    await supabase.from('onboarding_progress').upsert({
      user_id: userId,
      step,
      completed,
      updated_at: new Date().toISOString(),
    }, {
      onConflict: 'user_id,step'
    });

    if (completed && !completedSteps.includes(step)) {
      setCompletedSteps([...completedSteps, step]);
    }
  }

  async function next() {
    const currentStep = STEPS[stepIndex];
    await markStep(currentStep.key, true);

    if (stepIndex < STEPS.length - 1) {
      const nextIndex = stepIndex + 1;
      setStepIndex(nextIndex);
      await markStep(STEPS[nextIndex].key, true);
    } else {
      navigate('/partner/dashboard');
    }
  }

  const currentStep = STEPS[stepIndex];
  const progress = ((stepIndex + 1) / STEPS.length) * 100;

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mb-4">
          <BackButton />
        </div>
        <div className="max-w-3xl mx-auto px-4 py-16">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Partner Onboarding</h1>
          <p className="text-slate-600">
            Complete these steps to activate your partner account and start earning
          </p>
        </div>

        <div className="mb-8">
          <div className="flex justify-between mb-2">
            <span className="text-sm font-medium text-slate-700">Progress</span>
            <span className="text-sm font-medium text-slate-700">{Math.round(progress)}%</span>
          </div>
          <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-slate-900 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-5 gap-2 mb-12">
          {STEPS.map((s, i) => (
            <button
              key={s.key}
              onClick={() => setStepIndex(i)}
              className={`p-3 rounded-lg border-2 transition-all ${
                i === stepIndex
                  ? 'border-slate-900 bg-slate-900 text-white'
                  : i < stepIndex
                  ? 'border-green-500 bg-green-50 text-green-700'
                  : 'border-slate-200 bg-white text-slate-400'
              }`}
            >
              <div className="flex justify-center mb-1">
                {i < stepIndex ? (
                  <CheckCircle className="w-5 h-5" />
                ) : (
                  <Circle className="w-5 h-5" />
                )}
              </div>
              <div className="text-xs font-medium text-center">
                Step {i + 1}
              </div>
            </button>
          ))}
        </div>

        <Card className="p-8 mb-8">
          <div className="mb-6">
            <div className="text-sm font-medium text-slate-600 mb-2">
              STEP {stepIndex + 1} OF {STEPS.length}
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-3">{currentStep.title}</h2>
            <p className="text-slate-600 leading-relaxed">{currentStep.description}</p>
          </div>

          {stepIndex === 1 && (
            <div className="mb-6 p-4 bg-slate-50 rounded-lg border border-slate-200">
              <h3 className="font-semibold text-slate-900 mb-2">Territory Selection Tips:</h3>
              <ul className="space-y-2 text-sm text-slate-700">
                <li className="flex items-start gap-2">
                  <span className="text-slate-400 mt-1">•</span>
                  <span>Choose a city you know well or live in</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-slate-400 mt-1">•</span>
                  <span>Start with 1 territory, expand after 10 merchants</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-slate-400 mt-1">•</span>
                  <span>Smaller cities often have less competition</span>
                </li>
              </ul>
            </div>
          )}

          {stepIndex === 2 && (
            <div className="mb-6 p-4 bg-slate-50 rounded-lg border border-slate-200">
              <h3 className="font-semibold text-slate-900 mb-2">Popular AI Prompts:</h3>
              <ul className="space-y-2 text-sm text-slate-700">
                <li className="flex items-start gap-2">
                  <span className="text-slate-400 mt-1">•</span>
                  <span>Instagram DM scripts for cold outreach</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-slate-400 mt-1">•</span>
                  <span>Email templates that book demos</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-slate-400 mt-1">•</span>
                  <span>Deal offer generators for any business type</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-slate-400 mt-1">•</span>
                  <span>Objection handling responses</span>
                </li>
              </ul>
            </div>
          )}

          {stepIndex === 3 && (
            <div className="mb-6 p-4 bg-slate-50 rounded-lg border border-slate-200">
              <h3 className="font-semibold text-slate-900 mb-2">Training Modules:</h3>
              <ul className="space-y-2 text-sm text-slate-700">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                  <span>Introduction to Local-Link Marketplace</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                  <span>How to find and research prospects</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                  <span>Effective outreach strategies</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                  <span>Merchant onboarding best practices</span>
                </li>
              </ul>
            </div>
          )}

          {stepIndex === 4 && (
            <div className="mb-6 p-4 bg-slate-50 rounded-lg border border-slate-200">
              <h3 className="font-semibold text-slate-900 mb-3">Your Daily Action Plan:</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-slate-900 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                    1
                  </div>
                  <div>
                    <div className="font-medium text-slate-900 mb-1">Morning (30 mins)</div>
                    <div className="text-slate-600">Research 20 businesses in your territory using AI prompts</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-slate-900 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                    2
                  </div>
                  <div>
                    <div className="font-medium text-slate-900 mb-1">Afternoon (1 hour)</div>
                    <div className="text-slate-600">Send 20 personalized DMs using AI-generated scripts</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-slate-900 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                    3
                  </div>
                  <div>
                    <div className="font-medium text-slate-900 mb-1">Evening (30 mins)</div>
                    <div className="text-slate-600">Post 2-3 short videos showing how Local-Link helps businesses</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-3">
            {stepIndex > 0 && (
              <Button
                variant="outline"
                onClick={() => setStepIndex(stepIndex - 1)}
              >
                Previous
              </Button>
            )}
            <Button
              onClick={next}
              className="flex-1"
            >
              {stepIndex === STEPS.length - 1 ? 'Go to Dashboard' : 'Next Step'}
            </Button>
          </div>
        </Card>

        <div className="text-center">
          <button
            onClick={() => navigate('/partner/dashboard')}
            className="text-sm text-slate-600 hover:text-slate-900 underline"
          >
            Skip onboarding and go to dashboard
          </button>
        </div>
      </div>
    </div>
  );
}

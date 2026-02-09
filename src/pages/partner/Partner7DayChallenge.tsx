import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import {
  Trophy, CheckCircle2, Circle, Flame, Target,
  Copy, Check, Sparkles, ArrowRight, Calendar, Award, Star
} from 'lucide-react';
import BackButton from '../../components/ui/BackButton';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import {
  buildDayCaptions,
  getPartnerBadges,
  checkAndAwardBadges,
  type MergedDayContent,
  type BadgeAward
} from '../../lib/partnerTracking';

interface DayPrompt {
  day: number;
  title: string;
  post: string;
  cta: string;
  tip: string;
}

const DAILY_PROMPTS: DayPrompt[] = [
  {
    day: 1,
    title: "Day 1 — The Mindset Shift",
    post: "Most businesses don't fail at marketing — they just stop posting.",
    cta: "Learn more 👇",
    tip: "This post addresses the #1 problem: consistency. Keep it simple."
  },
  {
    day: 2,
    title: "Day 2 — Problem Awareness",
    post: "Posting isn't the hard part.\nStaying consistent is.",
    cta: "See how this is handled for you 👇",
    tip: "Now you're deepening the pain point. Your audience is nodding along."
  },
  {
    day: 3,
    title: "Day 3 — Relief",
    post: "What if your content was already done for the month?",
    cta: "Details here 👇",
    tip: "Shift from problem to solution. Plant the seed of possibility."
  },
  {
    day: 4,
    title: "Day 4 — Authority",
    post: "This isn't a course or template.\nIt's done-for-you.",
    cta: "Learn more 👇",
    tip: "Differentiate from DIY solutions. Position as premium service."
  },
  {
    day: 5,
    title: "Day 5 — Industry Angle",
    post: "If your business only posts when things are slow… this is for you.",
    cta: "See how it works 👇",
    tip: "Make it relatable. They should feel like you're speaking directly to them."
  },
  {
    day: 6,
    title: "Day 6 — Comparison",
    post: "DIY posting vs a DFY content system\nWhich one actually gets done?",
    cta: "Compare here 👇",
    tip: "Create a clear contrast. Make the choice obvious."
  },
  {
    day: 7,
    title: "Day 7 — Soft Close",
    post: "If posting keeps falling off, this fixes that.",
    cta: "Learn more 👇",
    tip: "Final nudge. Simple, direct, no pressure. Let the week's work do the selling."
  }
];

export default function Partner7DayChallenge() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [partnerId, setPartnerId] = useState<string>('');
  const [enrollmentId, setEnrollmentId] = useState<string>('');
  const [progress, setProgress] = useState<Array<{
    day_number: number;
    completed: boolean;
    completed_at: string | null;
    clicks_generated: number;
  }>>([]);
  const [streak, setStreak] = useState({ current: 0, longest: 0 });
  const [copiedDay, setCopiedDay] = useState<number | null>(null);
  const [trackedLink, setTrackedLink] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [mergedDays, setMergedDays] = useState<MergedDayContent[]>([]);
  const [badges, setBadges] = useState<BadgeAward[]>([]);
  const [showFullCaption, setShowFullCaption] = useState<{ [key: number]: boolean }>({});

  useEffect(() => {
    loadChallenge();
  }, []);

  async function loadChallenge() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/login');
        return;
      }

      // Get partner
      const { data: partner } = await supabase
        .from('partners')
        .select('id, referral_code')
        .eq('user_id', user.id)
        .single();

      if (!partner) {
        navigate('/partner/apply');
        return;
      }

      setPartnerId(partner.id);
      setReferralCode(partner.referral_code || '');
      setTrackedLink(`${window.location.origin}/merchant/done-for-you?ref=${partner.referral_code}`);

      // Get or create enrollment
      const { data: enrollment } = await supabase
        .from('partner_challenge_enrollments')
        .select('*')
        .eq('partner_id', partner.id)
        .eq('status', 'active')
        .maybeSingle();

      if (!enrollment) {
        // Start challenge
        const { data: newEnrollmentId, error } = await supabase
          .rpc('start_partner_challenge', { p_partner_id: partner.id });

        if (error) throw error;
        setEnrollmentId(newEnrollmentId);
      } else {
        setEnrollmentId(enrollment.id);
      }

      // Load progress
      const { data: progressData } = await supabase
        .from('partner_challenge_progress')
        .select('day_number, completed, completed_at, clicks_generated')
        .eq('partner_id', partner.id)
        .order('day_number', { ascending: true });

      if (progressData) {
        setProgress(progressData);
      }

      // Load streak
      const { data: streakData } = await supabase
        .from('partner_streaks')
        .select('current_streak, longest_streak')
        .eq('partner_id', partner.id)
        .maybeSingle();

      if (streakData) {
        setStreak({ current: streakData.current_streak, longest: streakData.longest_streak });
      }

      // Load badges
      const partnerBadges = await getPartnerBadges(partner.id);
      setBadges(partnerBadges);

      // Build merged captions (auto-loaded by default)
      const merged = await buildDayCaptions(partner.id, 'bundle-faceless-full', DAILY_PROMPTS);
      setMergedDays(merged);

      // Auto-expand all captions by default
      const expandedState: { [key: number]: boolean } = {};
      DAILY_PROMPTS.forEach(p => {
        expandedState[p.day] = true;
      });
      setShowFullCaption(expandedState);

    } catch (error) {
      console.error('Error loading challenge:', error);
    } finally {
      setLoading(false);
    }
  }

  async function markDayComplete(dayNumber: number) {
    try {
      const { error } = await supabase.rpc('complete_challenge_day', {
        p_enrollment_id: enrollmentId,
        p_day_number: dayNumber
      });

      if (error) throw error;

      // Check and award badges
      await checkAndAwardBadges(partnerId);

      // Reload progress and badges
      await loadChallenge();
    } catch (error) {
      console.error('Error completing day:', error);
    }
  }

  function copyFullPost(day: number) {
    const dayContent = mergedDays.find(d => d.day === day);
    if (dayContent) {
      navigator.clipboard.writeText(dayContent.fullPost);
      setCopiedDay(day);
      setTimeout(() => setCopiedDay(null), 2000);
    }
  }

  const completedDays = progress.filter(p => p.completed).length;
  const totalClicks = progress.reduce((sum, p) => sum + (p.clicks_generated || 0), 0);
  const isComplete = completedDays === 7;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading challenge...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <BackButton />

        {/* Header */}
        <div className="mt-6 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
              <Trophy className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                7-Day Faceless Activation Challenge
              </h1>
              <p className="text-gray-600">Post consistently, build confidence, get your first clicks</p>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-4 gap-4">
            <Card className="p-4 bg-white">
              <div className="text-sm text-gray-600 mb-1">Progress</div>
              <div className="text-2xl font-bold text-gray-900">{completedDays}/7</div>
              <div className="text-xs text-gray-500">Days Complete</div>
            </Card>

            <Card className="p-4 bg-gradient-to-br from-orange-50 to-red-50 border-orange-200">
              <div className="flex items-center gap-2 mb-1">
                <Flame className="w-4 h-4 text-orange-600" />
                <div className="text-sm text-orange-900">Current Streak</div>
              </div>
              <div className="text-2xl font-bold text-orange-900">{streak.current}</div>
              <div className="text-xs text-orange-700">days in a row</div>
            </Card>

            <Card className="p-4 bg-white">
              <div className="text-sm text-gray-600 mb-1">Best Streak</div>
              <div className="text-2xl font-bold text-gray-900">{streak.longest}</div>
              <div className="text-xs text-gray-500">days</div>
            </Card>

            <Card className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
              <div className="text-sm text-green-900 mb-1">Clicks</div>
              <div className="text-2xl font-bold text-green-900">{totalClicks}</div>
              <div className="text-xs text-green-700">from your posts</div>
            </Card>
          </div>
        </div>

        {/* Completion Celebration */}
        {isComplete && (
          <Card className="p-8 mb-8 bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-300">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500 rounded-full mb-4">
                <Trophy className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-green-900 mb-2">
                Challenge Complete!
              </h2>
              <p className="text-green-800 mb-4">
                You posted consistently for 7 days without showing your face. That's more than most people ever do.
              </p>
              <Button onClick={() => navigate('/partner/leaderboard')} className="bg-green-600 hover:bg-green-700">
                View Leaderboard <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </Card>
        )}

        {/* Badges Earned */}
        {badges.length > 0 && (
          <Card className="p-6 mb-8 bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200">
            <div className="flex items-center gap-3 mb-4">
              <Award className="w-6 h-6 text-yellow-600" />
              <h3 className="font-semibold text-gray-900">Your Badges</h3>
            </div>
            <div className="flex flex-wrap gap-3">
              {badges.map((award) => (
                <div
                  key={award.id}
                  className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg border-2 border-yellow-300 shadow-sm"
                >
                  <span className="text-2xl">{award.badge?.icon}</span>
                  <div>
                    <div className="font-semibold text-gray-900 text-sm">{award.badge?.name}</div>
                    <div className="text-xs text-gray-600">{award.badge?.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Your Tracked Link */}
        <Card className="p-6 mb-8 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Target className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-2">Your Tracked Link</h3>
              <p className="text-sm text-gray-600 mb-3">
                This link is automatically included in all your challenge posts below
              </p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={trackedLink}
                  readOnly
                  className="flex-1 px-4 py-2 bg-white border border-blue-200 rounded-lg text-sm font-mono"
                />
                <Button
                  onClick={() => {
                    navigator.clipboard.writeText(trackedLink);
                    setCopiedDay(-1);
                    setTimeout(() => setCopiedDay(null), 2000);
                  }}
                  variant="outline"
                  size="sm"
                >
                  {copiedDay === -1 ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Daily Prompts */}
        <div className="space-y-4">
          {DAILY_PROMPTS.map((prompt) => {
            const dayProgress = progress.find(p => p.day_number === prompt.day);
            const isCompleted = dayProgress?.completed || false;
            const isPrevDayComplete = prompt.day === 1 || progress.find(p => p.day_number === prompt.day - 1)?.completed;
            const isToday = !isCompleted && isPrevDayComplete;
            const mergedDay = mergedDays.find(d => d.day === prompt.day);

            return (
              <Card
                key={prompt.day}
                className={`p-6 transition-all ${
                  isCompleted
                    ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-200'
                    : isToday
                    ? 'bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-400 shadow-lg'
                    : 'bg-white hover:shadow-md'
                }`}
              >
                {/* "Day X is today" Badge */}
                {isToday && (
                  <div className="mb-4">
                    <span className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-bold rounded-full">
                      <Star className="w-4 h-4" />
                      Day {prompt.day} is today
                    </span>
                  </div>
                )}

                <div className="flex items-start gap-4">
                  {/* Day Icon */}
                  <div className="flex-shrink-0">
                    {isCompleted ? (
                      <CheckCircle2 className="w-8 h-8 text-green-600" />
                    ) : (
                      <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${
                        isToday ? 'border-blue-600 bg-blue-100' : 'border-gray-300'
                      }`}>
                        <span className={`text-sm font-semibold ${isToday ? 'text-blue-900' : 'text-gray-600'}`}>
                          {prompt.day}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{prompt.title}</h3>

                    {/* Full Post Content (Auto-expanded with tracking link) */}
                    <div className={`rounded-lg border-2 p-4 mb-3 ${
                      isToday ? 'bg-white border-blue-300' : 'bg-gray-50 border-gray-200'
                    }`}>
                      {mergedDay ? (
                        <div className="text-gray-900 whitespace-pre-line text-sm leading-relaxed">
                          {mergedDay.fullPost}
                        </div>
                      ) : (
                        <>
                          <div className="text-gray-900 whitespace-pre-line mb-2">
                            {prompt.post}
                          </div>
                          <div className="text-blue-600 font-medium mb-2">{prompt.cta}</div>
                          <div className="text-xs text-gray-500 font-mono break-all">{trackedLink}</div>
                        </>
                      )}
                    </div>

                    {/* Tip */}
                    <div className="flex items-start gap-2 mb-4">
                      <Sparkles className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-gray-600">{prompt.tip}</p>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap gap-3">
                      <Button
                        onClick={() => copyFullPost(prompt.day)}
                        className={isToday ? 'bg-blue-600 hover:bg-blue-700' : ''}
                        size="sm"
                        disabled={!isPrevDayComplete && prompt.day !== 1}
                      >
                        {copiedDay === prompt.day ? (
                          <>
                            <Check className="w-4 h-4 mr-2 text-white" />
                            Copied!
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4 mr-2" />
                            Copy Full Post
                          </>
                        )}
                      </Button>

                      {!isCompleted && isPrevDayComplete && (
                        <Button
                          onClick={() => markDayComplete(prompt.day)}
                          size="sm"
                          variant="outline"
                          className="border-green-600 text-green-700 hover:bg-green-50"
                        >
                          <CheckCircle2 className="w-4 h-4 mr-2" />
                          Mark Complete
                        </Button>
                      )}

                      {isCompleted && dayProgress?.completed_at && (
                        <div className="text-sm text-green-700 flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          Completed {new Date(dayProgress.completed_at).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <Card className="mt-8 p-6 bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-gray-900 mb-1">
                Want more proven content templates?
              </h3>
              <p className="text-sm text-gray-600">
                Check out the Ad Vault for industry-specific hooks, captions, and DM scripts
              </p>
            </div>
            <Button
              onClick={() => navigate('/partner/dfy-ad-vault')}
              variant="outline"
            >
              Browse Ad Vault <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}

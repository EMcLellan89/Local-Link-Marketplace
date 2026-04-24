import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../contexts/AuthContext";
import {
  Award, Lock, CheckCircle2, Clock, XCircle, ChevronRight,
  ShieldCheck, AlertTriangle, BookOpen, Star
} from "lucide-react";

type CertTrack = {
  id: string;
  partner_id: string;
  track: string;
  status: string;
  passed: boolean;
  score: number | null;
  attempts: number;
  last_attempt_at: string | null;
  completed_at: string | null;
  expires_at: string | null;
};

type QuizQuestion = {
  question: string;
  answers: string[];
  correct: number;
  explanation: string;
};

const TRACKS: {
  key: string;
  label: string;
  description: string;
  unlocks: string;
  course_slug: string;
  color: string;
  bgColor: string;
  questions: QuizQuestion[];
}[] = [
  {
    key: "merchant_sales",
    label: "Merchant Sales",
    description: "Sell Local-Link merchant subscription plans to local businesses.",
    unlocks: "Merchant subscription plans",
    course_slug: "partner-launch-academy",
    color: "text-emerald-700",
    bgColor: "bg-emerald-50 border-emerald-200",
    questions: [
      {
        question: "What is the first step before approaching any prospect?",
        answers: ["Run a Facebook ad","Set up Stripe Connect and copy your tracked links","Cold call 50 businesses","Post on LinkedIn"],
        correct: 1,
        explanation: "Completing your setup ensures every referral is tracked to you and you can receive payouts.",
      },
      {
        question: "Which merchant plan has the lowest churn rate?",
        answers: ["Starter","Growth","Pro","Enterprise"],
        correct: 1,
        explanation: "Growth has the best value-to-price ratio, keeping merchants active longer.",
      },
      {
        question: "What is the recommended first outreach message goal?",
        answers: ["Close the sale immediately","Explain all platform features","Get a yes to a 10-minute demo","Send a pricing sheet"],
        correct: 2,
        explanation: "The only goal of first contact is to earn the right to a demo — not to sell.",
      },
      {
        question: "Can you promise a merchant a specific number of new customers?",
        answers: ["Yes, if your market is strong","Yes, for the first 30 days","No — results depend on many factors","Only for Pro tier merchants"],
        correct: 2,
        explanation: "Income and result guarantees are prohibited under partner compliance rules.",
      },
      {
        question: "What is your tracked link for merchant sign-ups?",
        answers: ["locallinkmarketplace.com/{slug}","locallinkmarketplace.com/{slug}/merchant","locallinkmarketplace.com/sign-up","Both A and B are correct"],
        correct: 3,
        explanation: "Both your main link and /merchant link track merchant sign-ups to your account.",
      },
    ],
  },
  {
    key: "visibility_products",
    label: "Community Visibility",
    description: "Sell DFY marketing, reputation management, and visibility add-ons.",
    unlocks: "Visibility and marketing add-on products",
    course_slug: "partner-launch-academy",
    color: "text-blue-700",
    bgColor: "bg-blue-50 border-blue-200",
    questions: [
      {
        question: "When is the best time to pitch a visibility product?",
        answers: ["Before the merchant signs up","On the same call as the main pitch","After 30 days when the merchant has seen results","Only for Enterprise merchants"],
        correct: 2,
        explanation: "After 30 days, the merchant trusts the platform and is ready to invest more.",
      },
      {
        question: "What question uncovers the need for DFY ads?",
        answers: ["What CRM are you using?","Are you running any paid ads right now?","How many employees do you have?","What is your revenue?"],
        correct: 1,
        explanation: "Discovering they are not running ads opens the door to DFY ad services.",
      },
      {
        question: "A merchant says their Google reviews are declining. What do you recommend?",
        answers: ["Upgrade their subscription plan","Reputation management add-on","A new website","DFY social media"],
        correct: 1,
        explanation: "Reputation management specifically targets review generation and monitoring.",
      },
      {
        question: "Who runs paid advertising campaigns for Local-Link products?",
        answers: ["Individual partners","Any approved partner","Local-Link only","The merchant themselves"],
        correct: 2,
        explanation: "All paid advertising is run exclusively by Local-Link from official ad accounts.",
      },
      {
        question: "Stacking visibility add-ons increases your commission because:",
        answers: ["It gives you a bonus tier","Your commission rate increases","Your total commission is calculated on the higher monthly total","It unlocks override income"],
        correct: 2,
        explanation: "Commission is a percentage of total monthly spend, so more add-ons mean more earnings.",
      },
    ],
  },
  {
    key: "ai_tools",
    label: "AI Tools",
    description: "Sell AI-powered business tools including chatbots, reviewers, and automation.",
    unlocks: "AI product line",
    course_slug: "partner-launch-academy",
    color: "text-violet-700",
    bgColor: "bg-violet-50 border-violet-200",
    questions: [
      {
        question: "AI tools are best positioned as:",
        answers: ["Replacements for employees","Time-saving automation that handles repetitive tasks","Guaranteed revenue generators","Technical software for IT teams"],
        correct: 1,
        explanation: "AI tools handle repetitive tasks like follow-up, review requests, and lead qualification.",
      },
      {
        question: "Which business type is the best prospect for AI tools?",
        answers: ["Large corporations with IT teams","New businesses with no customers yet","Established local businesses that are too busy to follow up manually","E-commerce only businesses"],
        correct: 2,
        explanation: "Busy local businesses have the most to gain from automation.",
      },
      {
        question: "What is the required tier to sell AI tools?",
        answers: ["Starter","Growth","Pro","Enterprise"],
        correct: 1,
        explanation: "Growth tier is required to sell AI products.",
      },
      {
        question: "Can you promise a business owner that an AI tool will double their revenue?",
        answers: ["Yes, if market conditions are right","Yes, for the first 90 days","No — income and result guarantees are prohibited","Only for Pro-tier products"],
        correct: 2,
        explanation: "Guaranteed result claims violate partner compliance rules.",
      },
      {
        question: "A restaurant owner says they are too busy to respond to every review. What do you demo?",
        answers: ["AI chatbot builder","AI review responder","AI invoice reminder","AI lead qualifier"],
        correct: 1,
        explanation: "The AI review responder automates responses to Google and other platform reviews.",
      },
    ],
  },
  {
    key: "1hub_crm",
    label: "1Hub Business CRM",
    description: "Sell 1Hub CRM to local businesses and earn 30% recurring commission.",
    unlocks: "1Hub Business CRM products",
    course_slug: "sell-1hub-crm-cpa",
    color: "text-orange-700",
    bgColor: "bg-orange-50 border-orange-200",
    questions: [
      {
        question: "What commission rate does 1Hub CRM pay?",
        answers: ["10-25% depending on tier","30% one-time","30% recurring every month the client is active","15% first month only"],
        correct: 2,
        explanation: "1Hub CRM pays 30% recurring — every month, regardless of your partner tier.",
      },
      {
        question: "Which Business CRM tier is best for an established local business with a small team?",
        answers: ["Starter ($197/month)","Pro ($297/month)","Growth ($597/month)","Enterprise"],
        correct: 1,
        explanation: "Pro includes unlimited pipelines, team access, and full automation at the best value for small teams.",
      },
      {
        question: "A prospect says they already use Salesforce. Your best response is:",
        answers: ["Tell them Salesforce is bad","Ask if Salesforce also handles their invoicing, scheduling, and review requests","Lower the price","Skip them and find a new prospect"],
        correct: 1,
        explanation: "Most CRMs only handle contacts. Highlighting 1Hub's full feature set differentiates it.",
      },
      {
        question: "In a 15-minute demo, what should you show FIRST?",
        answers: ["All features in order","The API and integration settings","The one feature that solves their specific pain","The pricing page"],
        correct: 2,
        explanation: "Show the most relevant feature first to create an immediate 'this solves my problem' moment.",
      },
      {
        question: "What is your monthly earnings from a Business CRM Pro client ($297/month)?",
        answers: ["$29.70","$59.40","$89.10","$297.00"],
        correct: 2,
        explanation: "$297 x 30% = $89.10/month, every month the client stays active.",
      },
    ],
  },
  {
    key: "1hub_cpa",
    label: "1Hub CPA Firm Plans",
    description: "Sell 1Hub to accounting and CPA firms for high-ticket recurring commissions.",
    unlocks: "1Hub CPA Firm products",
    course_slug: "sell-1hub-crm-cpa",
    color: "text-teal-700",
    bgColor: "bg-teal-50 border-teal-200",
    questions: [
      {
        question: "Which prospect is the ideal CPA firm target?",
        answers: ["Large firms with dedicated IT departments","2-25 staff firms juggling email, spreadsheets, and multiple tools","Solo accountants with fewer than 10 clients","E-commerce focused tax preparers"],
        correct: 1,
        explanation: "Small-to-mid CPA firms have the most pain around client management and are best positioned to benefit.",
      },
      {
        question: "What is your monthly commission on a CPA Growth client ($997/month)?",
        answers: ["$99.70","$199.40","$299.10","$997.00"],
        correct: 2,
        explanation: "$997 x 30% = $299.10/month recurring.",
      },
      {
        question: "A CPA firm says they use QuickBooks. Your response is:",
        answers: ["Recommend they switch to something else","Explain 1Hub replaces QuickBooks","Explain 1Hub handles the client-facing side and syncs with QuickBooks","Tell them 1Hub is not compatible with QuickBooks"],
        correct: 2,
        explanation: "1Hub complements QuickBooks — it handles client intake, billing, and document management with a QuickBooks sync.",
      },
      {
        question: "Which CPA plan should you NEVER promise will guarantee tax savings or IRS approvals?",
        answers: ["Only the Starter plan","Only the Enterprise plan","All plans — never promise tax outcomes","Only plans with setup fees"],
        correct: 2,
        explanation: "Partners may never promise tax outcomes, savings, approvals, or legal/accounting results.",
      },
      {
        question: "What is the qualifying question for a CPA firm prospect?",
        answers: ["How many employees do you have?","How much do you spend on software?","How many different tools do you use to manage clients and billing right now?","Do you use a client portal?"],
        correct: 2,
        explanation: "Firms using 3+ tools are strong 1Hub prospects — this question uncovers that pain.",
      },
    ],
  },
  {
    key: "organic_sharing",
    label: "Organic Sharing Rules",
    description: "Understand the rules for sharing links and content as a partner.",
    unlocks: "Permission to share approved content",
    course_slug: "partner-launch-academy",
    color: "text-gray-700",
    bgColor: "bg-gray-50 border-gray-200",
    questions: [
      {
        question: "Can partners run paid Facebook ads for Local-Link products?",
        answers: ["Yes, with a Local-Link template","Yes, if the budget is under $50/day","No — all paid ads are run only by Local-Link","Yes, after completing the organic sharing certification"],
        correct: 2,
        explanation: "All paid advertising is managed exclusively by Local-Link from official ad accounts.",
      },
      {
        question: "Can partners share their referral links organically on social media?",
        answers: ["No — only Local-Link can post about the platform","Yes, using approved content","Yes, using any content they create","Only after 90 days as a partner"],
        correct: 1,
        explanation: "Partners may share approved content and referral links organically.",
      },
      {
        question: "A partner wants to boost a Facebook post about Local-Link. This is:",
        answers: ["Allowed if the post uses approved copy","Allowed for Gold-tier partners","Not allowed — boosting a post is a form of paid advertising","Allowed for posts under $20 spend"],
        correct: 2,
        explanation: "Boosting posts counts as paid advertising and is not permitted for partners.",
      },
      {
        question: "Who controls paid ad creative, targeting, and campaign launch for Local-Link?",
        answers: ["Individual partners","Approved enterprise partners","Local-Link Admin only","The merchant being advertised"],
        correct: 2,
        explanation: "Local-Link Admin controls all paid campaign decisions to protect brand consistency.",
      },
      {
        question: "A partner wants a paid campaign run for their territory. They should:",
        answers: ["Set it up themselves on Facebook","Ask Local-Link to run it with their prepaid budget and slug attached","Skip paid ads and focus on organic only","Wait until they reach the Pro tier"],
        correct: 1,
        explanation: "Partners can prepay ad budget and Local-Link runs the campaign with their slug for full attribution.",
      },
    ],
  },
  {
    key: "job_board",
    label: "Job Board Fulfillment",
    description: "Fulfill job board postings and manage hiring funnels for merchants.",
    unlocks: "Job board fulfillment assignments",
    course_slug: "partner-launch-academy",
    color: "text-amber-700",
    bgColor: "bg-amber-50 border-amber-200",
    questions: [
      {
        question: "What is the partner's role in a job board fulfillment assignment?",
        answers: ["Find candidates and make hiring decisions","Manage the posting, screening intake, and deliver qualified candidates to the merchant","Set the job salary and terms","Conduct final interviews"],
        correct: 1,
        explanation: "Partners manage the job posting workflow and deliver screened candidates — hiring decisions stay with the merchant.",
      },
      {
        question: "What happens if a placed candidate leaves within the guarantee period?",
        answers: ["Nothing — the commission is final","The commission is reversed","A replacement is sourced at no extra charge to the merchant","The partner pays a penalty fee"],
        correct: 2,
        explanation: "Job board fulfillment includes a replacement guarantee for the merchant.",
      },
      {
        question: "Override commissions on job board fulfillment are:",
        answers: ["7% as usual","5%","Not applicable for job board","Paid only on the first placement"],
        correct: 2,
        explanation: "Override commissions do not apply to job board fulfillment assignments.",
      },
      {
        question: "Before accepting a job board assignment, you should:",
        answers: ["Contact the merchant directly to negotiate","Confirm you have the capacity to fulfill within the stated timeline","Request a higher commission rate","Ask admin to reassign to another partner"],
        correct: 1,
        explanation: "Only accept assignments you can fulfill within the stated timeline to protect merchant experience.",
      },
      {
        question: "Can you promise the merchant their open position will be filled in 7 days?",
        answers: ["Yes, if you have a strong candidate pool","Only for entry-level positions","No — results depend on candidate availability and role complexity","Yes, that is the standard SLA"],
        correct: 2,
        explanation: "Guaranteed timelines are prohibited — partner compliance rules apply to job board fulfillment.",
      },
    ],
  },
];

const PASS_SCORE = 80;
const MAX_ATTEMPTS = 3;
const RETAKE_HOURS = 24;

export default function PartnerCertificationsPage() {
  const { user } = useAuth();
  const [certTracks, setCertTracks] = useState<Record<string, CertTrack>>({});
  const [loading, setLoading] = useState(true);
  const [partnerId, setPartnerId] = useState<string | null>(null);
  const [activeQuiz, setActiveQuiz] = useState<string | null>(null);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user?.id) loadData();
  }, [user?.id]);

  async function loadData() {
    setLoading(true);
    try {
      const { data: partner } = await supabase
        .from("partners").select("id").eq("user_id", user!.id).maybeSingle();
      if (!partner) return;
      setPartnerId(partner.id);
      const { data } = await supabase
        .from("partner_cert_tracks").select("*").eq("partner_id", partner.id);
      const map: Record<string, CertTrack> = {};
      for (const r of data ?? []) map[r.track] = r;
      setCertTracks(map);
    } finally {
      setLoading(false);
    }
  }

  function startQuiz(trackKey: string) {
    setActiveQuiz(trackKey);
    setQuizAnswers({});
    setQuizSubmitted(false);
    setQuizScore(0);
  }

  async function submitQuiz() {
    if (!partnerId || !activeQuiz) return;
    const track = TRACKS.find(t => t.key === activeQuiz)!;
    let correct = 0;
    for (let i = 0; i < track.questions.length; i++) {
      if (quizAnswers[i] === track.questions[i].correct) correct++;
    }
    const score = Math.round((correct / track.questions.length) * 100);
    const passed = score >= PASS_SCORE;
    setQuizScore(score);
    setQuizSubmitted(true);
    setSaving(true);
    try {
      const existing = certTracks[activeQuiz];
      const attempts = (existing?.attempts ?? 0) + 1;
      const now = new Date().toISOString();
      await supabase.from("partner_cert_tracks").upsert({
        partner_id: partnerId,
        track: activeQuiz,
        status: passed ? "passed" : attempts >= MAX_ATTEMPTS ? "failed" : "in_progress",
        passed,
        score,
        attempts,
        last_attempt_at: now,
        completed_at: passed ? now : null,
        expires_at: passed ? new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString() : null,
        updated_at: now,
      }, { onConflict: "partner_id,track" });
      await loadData();
    } finally {
      setSaving(false);
    }
  }

  function canRetake(cert: CertTrack | undefined): boolean {
    if (!cert) return true;
    if (cert.passed) return false;
    if (cert.attempts >= MAX_ATTEMPTS) return false;
    if (cert.last_attempt_at) {
      const hoursSince = (Date.now() - new Date(cert.last_attempt_at).getTime()) / 3600000;
      if (hoursSince < RETAKE_HOURS) return false;
    }
    return true;
  }

  function hoursUntilRetake(cert: CertTrack | undefined): number {
    if (!cert?.last_attempt_at) return 0;
    const hoursSince = (Date.now() - new Date(cert.last_attempt_at).getTime()) / 3600000;
    return Math.max(0, Math.ceil(RETAKE_HOURS - hoursSince));
  }

  const activeTrackDef = activeQuiz ? TRACKS.find(t => t.key === activeQuiz) : null;
  const allAnswered = activeTrackDef ? Object.keys(quizAnswers).length === activeTrackDef.questions.length : false;

  if (loading) {
    return <div className="max-w-4xl mx-auto px-4 py-16 text-center text-gray-500">Loading certifications...</div>;
  }

  if (activeQuiz && activeTrackDef) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-10">
        <button onClick={() => { setActiveQuiz(null); setQuizSubmitted(false); }}
          className="text-sm text-gray-500 hover:text-gray-700 mb-6 flex items-center gap-1">
          Back to Certifications
        </button>
        <div className="border rounded-2xl bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <Award className={`w-7 h-7 ${activeTrackDef.color}`} />
            <div>
              <h2 className="text-xl font-bold">{activeTrackDef.label} Certification</h2>
              <p className="text-sm text-gray-500">80% required to pass · {activeTrackDef.questions.length} questions</p>
            </div>
          </div>
          {quizSubmitted ? (
            <div className="space-y-6">
              <div className={`rounded-xl p-5 text-center ${quizScore >= PASS_SCORE ? "bg-emerald-50 border border-emerald-200" : "bg-red-50 border border-red-200"}`}>
                {quizScore >= PASS_SCORE ? (
                  <>
                    <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-emerald-800">{quizScore}% — Passed!</p>
                    <p className="text-emerald-700 mt-1">Your {activeTrackDef.label} certification is now active.</p>
                  </>
                ) : (
                  <>
                    <XCircle className="w-10 h-10 text-red-500 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-red-800">{quizScore}% — Not Passed</p>
                    <p className="text-red-700 mt-1">You need 80% to pass. Review the course material and try again in 24 hours.</p>
                  </>
                )}
              </div>
              <div className="space-y-4">
                {activeTrackDef.questions.map((q, i) => {
                  const answered = quizAnswers[i];
                  const isCorrect = answered === q.correct;
                  return (
                    <div key={i} className={`p-4 rounded-xl border ${isCorrect ? "border-emerald-200 bg-emerald-50" : "border-red-200 bg-red-50"}`}>
                      <p className="font-medium text-sm mb-1">{q.question}</p>
                      <p className={`text-sm font-medium ${isCorrect ? "text-emerald-700" : "text-red-700"}`}>
                        {isCorrect ? "Correct" : `Incorrect — correct: ${q.answers[q.correct]}`}
                      </p>
                      <p className="text-xs text-gray-600 mt-1">{q.explanation}</p>
                    </div>
                  );
                })}
              </div>
              <button onClick={() => { setActiveQuiz(null); setQuizSubmitted(false); }}
                className="w-full py-3 bg-gray-900 text-white rounded-xl font-semibold hover:bg-gray-800">
                Back to Certifications
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {activeTrackDef.questions.map((q, i) => (
                <div key={i} className="border rounded-xl p-4">
                  <p className="font-medium text-gray-800 mb-3">{i + 1}. {q.question}</p>
                  <div className="space-y-2">
                    {q.answers.map((ans, j) => (
                      <label key={j} className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer border transition-colors ${
                        quizAnswers[i] === j ? "border-blue-400 bg-blue-50" : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                      }`}>
                        <input type="radio" name={`q${i}`} checked={quizAnswers[i] === j}
                          onChange={() => setQuizAnswers(prev => ({ ...prev, [i]: j }))}
                          className="accent-blue-600" />
                        <span className="text-sm text-gray-700">{ans}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
              <button onClick={submitQuiz} disabled={!allAnswered || saving}
                className="w-full py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
                {saving ? "Submitting..." : "Submit Answers"}
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  const certifiedCount = TRACKS.filter(t => certTracks[t.key]?.passed).length;

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-8">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0">
          <Award className="w-6 h-6 text-amber-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Partner Certifications</h1>
          <p className="text-gray-500 mt-1">Complete each track to unlock the corresponding products. Score 80% to pass.</p>
        </div>
        <div className="ml-auto text-right flex-shrink-0">
          <p className="text-3xl font-bold text-gray-900">{certifiedCount}/{TRACKS.length}</p>
          <p className="text-xs text-gray-500">certifications earned</p>
        </div>
      </div>

      <div className="border border-blue-200 rounded-xl p-4 bg-blue-50 flex flex-wrap gap-4 text-sm text-blue-800">
        <span className="flex items-center gap-1.5"><Star className="w-3.5 h-3.5" /> 80% to pass</span>
        <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> 24-hour retake delay</span>
        <span className="flex items-center gap-1.5"><AlertTriangle className="w-3.5 h-3.5" /> 3 attempts max</span>
        <span className="flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5" /> Expires after 12 months</span>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {TRACKS.map(track => {
          const cert = certTracks[track.key];
          const passed = cert?.passed === true;
          const failed = cert && !cert.passed && cert.attempts >= MAX_ATTEMPTS;
          const inProgress = cert && !cert.passed && (cert.attempts ?? 0) < MAX_ATTEMPTS;
          const retakeable = canRetake(cert);
          const hoursLeft = hoursUntilRetake(cert);

          return (
            <div key={track.key} className={`border rounded-2xl p-5 ${passed ? track.bgColor : "bg-white border-gray-200"}`}>
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  {passed ? <CheckCircle2 className={`w-6 h-6 ${track.color}`} />
                    : failed ? <XCircle className="w-6 h-6 text-red-400" />
                    : <Lock className="w-6 h-6 text-gray-400" />}
                  <div>
                    <h3 className="font-semibold text-gray-900">{track.label}</h3>
                    {passed && cert?.expires_at && (
                      <p className="text-xs text-gray-500">Expires {new Date(cert.expires_at).toLocaleDateString()}</p>
                    )}
                    {cert && !passed && (
                      <p className="text-xs text-gray-500">
                        {cert.attempts} attempt{cert.attempts !== 1 ? "s" : ""} used
                        {cert.score != null && ` · Last: ${cert.score}%`}
                      </p>
                    )}
                  </div>
                </div>
                {passed && (
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${track.color} ${track.bgColor}`}>Certified</span>
                )}
              </div>
              <p className="text-sm text-gray-600 mb-3">{track.description}</p>
              <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-4">
                <ShieldCheck className="w-3.5 h-3.5" />Unlocks: {track.unlocks}
              </div>
              <div className="flex gap-2">
                <Link to={`/academy/courses/${track.course_slug}`}
                  className="flex items-center gap-1.5 text-xs font-medium text-gray-600 hover:text-gray-800 border border-gray-200 rounded-lg px-2.5 py-1.5 hover:bg-gray-50 transition-colors">
                  <BookOpen className="w-3.5 h-3.5" /> Study
                </Link>
                {!passed && !failed && (
                  retakeable ? (
                    <button onClick={() => startQuiz(track.key)}
                      className="flex-1 flex items-center justify-center gap-1.5 text-sm font-medium bg-gray-900 text-white rounded-lg px-3 py-1.5 hover:bg-gray-800 transition-colors">
                      {inProgress ? "Retake Quiz" : "Take Quiz"}
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <div className="flex-1 text-center text-xs text-gray-500 border border-gray-200 rounded-lg px-3 py-1.5">
                      <Clock className="w-3 h-3 inline mr-1" />Retake in {hoursLeft}h
                    </div>
                  )
                )}
                {failed && (
                  <div className="flex-1 text-center text-xs text-red-600 border border-red-200 bg-red-50 rounded-lg px-3 py-1.5">
                    Max attempts reached — contact support
                  </div>
                )}
                {passed && (
                  <div className={`flex-1 flex items-center justify-center gap-1.5 text-sm font-medium rounded-lg px-3 py-1.5 ${track.color} ${track.bgColor}`}>
                    <CheckCircle2 className="w-3.5 h-3.5" /> Active
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

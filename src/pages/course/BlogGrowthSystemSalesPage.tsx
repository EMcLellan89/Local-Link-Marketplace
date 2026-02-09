import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Star, TrendingUp, Users, Zap, BookOpen, Target, Award } from 'lucide-react';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';

const TIERS = [
  {
    id: 'core',
    name: 'Self-Implement',
    subtitle: 'Master the system yourself',
    price: 997,
    popular: false,
    features: [
      'Full 8-Module Blog Growth System',
      'Step-by-step blog writing training',
      'AI prompt frameworks',
      'Distribution & ROI tracking',
      'Lifetime access to updates',
      'Merchant Blog Certification',
    ],
    idealFor: [
      'Hands-on business owners',
      'Budget-conscious but serious businesses',
      'Owners who want full control',
    ],
    cta: 'Start Learning',
  },
  {
    id: 'accelerator',
    name: 'Implementation Accelerator',
    subtitle: 'Get set up faster with done-for-you planning',
    price: 1997,
    popular: true,
    features: [
      'Everything in Self-Implement, plus:',
      'Blog topic plan (12 months)',
      'Writing templates + checklists',
      'Partner hiring guidance',
      'Priority job posting in Local-Link',
      'Verified Merchant badge',
      'Direct implementation support',
    ],
    idealFor: [
      'Growing businesses',
      'Owners short on time',
      'Ready to outsource soon',
    ],
    cta: 'Get Started Fast',
  },
  {
    id: 'dfy',
    name: 'Done-For-You Path',
    subtitle: 'We execute the strategy for you',
    price: 2997,
    setup: true,
    popular: false,
    features: [
      'Everything in Accelerator, plus:',
      'Blog strategy & complete setup',
      'DFY blog execution via vetted partners',
      'Monthly performance reporting',
      'Content management oversight',
      'Dedicated account manager',
    ],
    monthly: [
      { blogs: 2, price: 499 },
      { blogs: 4, price: 899 },
      { blogs: 8, price: 1499 },
    ],
    idealFor: [
      'Established businesses',
      'Owners who want results without effort',
      'Premium service seekers',
    ],
    cta: 'Apply Now',
  },
];

const MODULES = [
  {
    number: 1,
    title: 'Foundation & Strategy',
    lessons: 5,
    desc: 'Understanding blog purpose, ROI, and business alignment',
  },
  {
    number: 2,
    title: 'Writing Framework',
    lessons: 6,
    desc: 'Headline creation, structure, CTAs, and voice',
  },
  {
    number: 3,
    title: 'Blog Types & Use Cases',
    lessons: 5,
    desc: 'Educational, promotional, seasonal, and authority content',
  },
  {
    number: 4,
    title: 'SEO & Technical',
    lessons: 5,
    desc: 'Keywords, meta tags, internal linking, and optimization',
  },
  {
    number: 5,
    title: 'AI & Efficiency',
    lessons: 5,
    desc: 'Using AI as a tool (not replacement) for faster output',
  },
  {
    number: 6,
    title: 'Distribution & Visibility',
    lessons: 5,
    desc: 'Sharing across Google, social, email, and building authority',
  },
  {
    number: 7,
    title: 'Measuring ROI',
    lessons: 5,
    desc: 'Metrics, timelines, scaling, and proving value',
  },
  {
    number: 8,
    title: 'Systems & Growth',
    lessons: 5,
    desc: 'Done-for-you path, hiring, and long-term content strategy',
  },
];

const TESTIMONIALS = [
  {
    name: 'Sarah Mitchell',
    business: 'Mitchell Plumbing',
    quote: 'I went from zero blogs to ranking for "plumber near me" in 4 months. The system is clear, actionable, and actually works.',
    results: '+312% organic traffic',
  },
  {
    name: 'James Rodriguez',
    business: 'Rodriguez HVAC',
    quote: 'I tried blogging before and quit. This course showed me what I was missing. Now I get 3-4 leads per week from my blog.',
    results: '20+ qualified leads/month',
  },
  {
    name: 'Emily Chen',
    business: 'Peak Performance Fitness',
    quote: 'The Implementation Accelerator saved me months of guesswork. I had a full year of topics planned and started seeing results immediately.',
    results: '2x membership growth',
  },
];

const FAQS = [
  {
    q: 'How long does it take to see results?',
    a: 'Most businesses see meaningful traffic and leads within 3-6 months. Blogging is a long-term asset, not a quick fix. The course teaches you how to track progress and optimize along the way.',
  },
  {
    q: 'Do I need to be a good writer?',
    a: 'No. The course teaches you a proven framework that works even if you\'ve never written before. Plus, Module 5 shows you how to use AI responsibly to speed up the process.',
  },
  {
    q: 'What if I don\'t have time to write?',
    a: 'That\'s why we offer the Done-For-You path. You\'ll still understand the system (which makes outsourcing successful), but vetted partners will execute for you.',
  },
  {
    q: 'Is this only for certain industries?',
    a: 'No. The system works for any local service business: trades, medical, legal, fitness, restaurants, retail, and more. The principles are universal.',
  },
  {
    q: 'Can I hire help after taking the course?',
    a: 'Absolutely. In fact, Module 8 teaches you how to hire and manage blog help the right way. Plus, Local-Link Marketplace connects you with trained partners.',
  },
  {
    q: 'What if I\'m already blogging?',
    a: 'This course will show you what\'s working, what\'s not, and how to scale strategically. Many experienced bloggers discover gaps they didn\'t know existed.',
  },
];

export default function BlogGrowthSystemSalesPage() {
  const navigate = useNavigate();
  const [selectedTier, setSelectedTier] = useState<string | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleCheckout = (tierId: string) => {
    setSelectedTier(tierId);
    navigate(`/merchant/course-checkout?tier=${tierId}&course=blog-growth-system`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-20 text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 blur-3xl" />
        </div>

        <div className="container relative mx-auto max-w-6xl px-4">
          <div className="text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-cyan-500/10 px-4 py-2 text-sm font-semibold text-cyan-300 ring-1 ring-cyan-500/20">
              <Award className="h-4 w-4" />
              Premium Training System
            </div>

            <h1 className="mb-6 text-5xl font-bold leading-tight md:text-6xl">
              The Blog Growth System<br />
              <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                For Local Businesses
              </span>
            </h1>

            <p className="mx-auto mb-8 max-w-3xl text-xl leading-relaxed text-slate-300">
              Learn the exact system that drives traffic, builds authority, and generates consistent leads through strategic blogging. No guesswork. No generic advice. Just proven frameworks.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <Check className="h-5 w-5 text-green-400" />
                <span>8 Complete Modules</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-5 w-5 text-green-400" />
                <span>40+ Video Lessons</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-5 w-5 text-green-400" />
                <span>Lifetime Access</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-5 w-5 text-green-400" />
                <span>Certificate Included</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Tiers */}
      <section className="py-20">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-4xl font-bold text-slate-900">Choose Your Path</h2>
            <p className="text-lg text-slate-600">
              All tiers include the complete 8-module course. Choose based on how much support you need.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {TIERS.map((tier) => (
              <Card
                key={tier.id}
                className={`relative flex flex-col p-8 ${
                  tier.popular
                    ? 'border-2 border-cyan-500 shadow-2xl ring-4 ring-cyan-500/10'
                    : 'border border-slate-200'
                }`}
              >
                {tier.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 px-4 py-1 text-sm font-bold text-white shadow-lg">
                    Most Popular
                  </div>
                )}

                <div className="mb-6">
                  <h3 className="mb-2 text-2xl font-bold text-slate-900">{tier.name}</h3>
                  <p className="text-sm text-slate-600">{tier.subtitle}</p>
                </div>

                <div className="mb-6">
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-bold text-slate-900">${tier.price.toLocaleString()}</span>
                    {tier.setup && <span className="text-slate-600">setup</span>}
                  </div>
                  {tier.monthly && (
                    <div className="mt-3 space-y-1 text-sm text-slate-600">
                      {tier.monthly.map((plan) => (
                        <div key={plan.blogs}>
                          + ${plan.price}/mo ({plan.blogs} blogs/month)
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <ul className="mb-8 flex-1 space-y-3">
                  {tier.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-600" />
                      <span className="text-slate-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className="mb-6 rounded-lg bg-slate-50 p-4">
                  <div className="mb-2 text-sm font-semibold text-slate-900">Ideal for:</div>
                  <ul className="space-y-1 text-sm text-slate-600">
                    {tier.idealFor.map((item, idx) => (
                      <li key={idx}>• {item}</li>
                    ))}
                  </ul>
                </div>

                <Button
                  onClick={() => handleCheckout(tier.id)}
                  className={`w-full py-6 text-lg font-semibold ${
                    tier.popular
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600'
                      : 'bg-slate-900 hover:bg-slate-800'
                  }`}
                >
                  {tier.cta}
                </Button>
              </Card>
            ))}
          </div>

          <div className="mt-8 text-center text-sm text-slate-600">
            All purchases include 30-day money-back guarantee. Questions?{' '}
            <button
              onClick={() => navigate('/support')}
              className="font-semibold text-cyan-600 hover:text-cyan-700"
            >
              Contact us
            </button>
          </div>
        </div>
      </section>

      {/* Course Curriculum */}
      <section className="bg-slate-50 py-20">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-4xl font-bold text-slate-900">Complete Curriculum</h2>
            <p className="text-lg text-slate-600">
              8 comprehensive modules with 40+ video lessons covering everything from strategy to execution.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {MODULES.map((module) => (
              <Card key={module.number} className="p-6 hover:shadow-lg transition-shadow">
                <div className="mb-3 flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 text-lg font-bold text-white">
                    {module.number}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-slate-900">{module.title}</h3>
                    <div className="text-sm text-slate-600">{module.lessons} lessons</div>
                  </div>
                </div>
                <p className="text-slate-700">{module.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Results Section */}
      <section className="py-20">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-4xl font-bold text-slate-900">Real Businesses, Real Results</h2>
            <p className="text-lg text-slate-600">
              See what happens when local businesses implement this system consistently.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {TESTIMONIALS.map((testimonial, idx) => (
              <Card key={idx} className="p-6">
                <div className="mb-4 flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="mb-4 italic text-slate-700">"{testimonial.quote}"</p>
                <div className="mb-2">
                  <div className="font-semibold text-slate-900">{testimonial.name}</div>
                  <div className="text-sm text-slate-600">{testimonial.business}</div>
                </div>
                <div className="mt-4 rounded-lg bg-green-50 px-3 py-2 text-sm font-semibold text-green-700">
                  {testimonial.results}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why This Works */}
      <section className="bg-slate-900 py-20 text-white">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-4xl font-bold">Why This System Works</h2>
            <p className="text-lg text-slate-300">
              Unlike generic blogging advice, this is built specifically for local businesses.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-cyan-500/10 ring-1 ring-cyan-500/20">
                <Target className="h-8 w-8 text-cyan-400" />
              </div>
              <h3 className="mb-2 font-bold">Local-Specific</h3>
              <p className="text-sm text-slate-400">
                Strategies designed for service businesses, not generic content sites.
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-cyan-500/10 ring-1 ring-cyan-500/20">
                <BookOpen className="h-8 w-8 text-cyan-400" />
              </div>
              <h3 className="mb-2 font-bold">Step-by-Step</h3>
              <p className="text-sm text-slate-400">
                No guesswork. Follow the framework and get results.
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-cyan-500/10 ring-1 ring-cyan-500/20">
                <Zap className="h-8 w-8 text-cyan-400" />
              </div>
              <h3 className="mb-2 font-bold">AI-Enhanced</h3>
              <p className="text-sm text-slate-400">
                Use AI as a tool, not a replacement, for 10x faster output.
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-cyan-500/10 ring-1 ring-cyan-500/20">
                <TrendingUp className="h-8 w-8 text-cyan-400" />
              </div>
              <h3 className="mb-2 font-bold">Proven ROI</h3>
              <p className="text-sm text-slate-400">
                Learn to measure and optimize for business outcomes, not vanity metrics.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20">
        <div className="container mx-auto max-w-4xl px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-4xl font-bold text-slate-900">Frequently Asked Questions</h2>
          </div>

          <div className="space-y-4">
            {FAQS.map((faq, idx) => (
              <Card key={idx} className="overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full p-6 text-left hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center justify-between gap-4">
                    <h3 className="font-semibold text-slate-900">{faq.q}</h3>
                    <div
                      className={`h-6 w-6 flex-shrink-0 rounded-full bg-slate-100 flex items-center justify-center transition-transform ${
                        openFaq === idx ? 'rotate-180' : ''
                      }`}
                    >
                      <span className="text-slate-600">▼</span>
                    </div>
                  </div>
                </button>
                {openFaq === idx && (
                  <div className="border-t border-slate-100 bg-slate-50 px-6 py-4">
                    <p className="text-slate-700">{faq.a}</p>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-gradient-to-br from-cyan-500 to-blue-600 py-20 text-white">
        <div className="container mx-auto max-w-4xl px-4 text-center">
          <h2 className="mb-6 text-4xl font-bold">
            Ready to Transform Your Blog Strategy?
          </h2>
          <p className="mb-8 text-xl text-cyan-50">
            Join hundreds of local businesses using this system to drive consistent growth.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button
              onClick={() => handleCheckout('accelerator')}
              className="bg-white px-8 py-6 text-lg font-semibold text-cyan-600 hover:bg-slate-50"
            >
              Get Started Now
            </Button>
            <Button
              onClick={() => navigate('/support')}
              className="border-2 border-white bg-transparent px-8 py-6 text-lg font-semibold text-white hover:bg-white/10"
            >
              Talk to an Advisor
            </Button>
          </div>
          <p className="mt-6 text-sm text-cyan-100">
            30-day money-back guarantee • Lifetime access • Certificate included
          </p>
        </div>
      </section>
    </div>
  );
}

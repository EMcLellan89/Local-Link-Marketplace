import { Link } from 'react-router-dom';
import { DollarSign, Zap, Users, TrendingUp, Sparkles, MapPin } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import BackButton from '../../components/ui/BackButton';

export default function EarnLanding() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="mb-4">
          <BackButton />
        </div>
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-full text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            AI-Powered Income Platform
          </div>
          <h1 className="text-5xl font-bold text-slate-900 mb-6">
            Earn with Local-Link
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Get paid helping local businesses join Local-Link Marketplace. Use built-in AI scripts,
            onboarding tools, and a commission tracker to earn recurring income.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-16">
          <Card className="p-8 text-center hover:shadow-lg transition-shadow">
            <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">1. Pick a Territory</h3>
            <p className="text-slate-600">
              Start with one city and own your outreach. No competition, no territory fees.
            </p>
          </Card>

          <Card className="p-8 text-center hover:shadow-lg transition-shadow">
            <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">2. Get AI Scripts</h3>
            <p className="text-slate-600">
              DMs, emails, call scripts, and offers generated for you. No guessing, no writer's block.
            </p>
          </Card>

          <Card className="p-8 text-center hover:shadow-lg transition-shadow">
            <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <DollarSign className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">3. Onboard & Earn</h3>
            <p className="text-slate-600">
              Track commissions as merchants activate and renew. Earn 20% recurring revenue monthly.
            </p>
          </Card>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-12 mb-16">
          <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">Commission Structure</h2>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Recurring Monthly Revenue</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                  <span className="text-slate-700">CRM Starter ($49/mo)</span>
                  <span className="font-semibold text-slate-900">$9.80/mo</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                  <span className="text-slate-700">CRM Professional ($129/mo)</span>
                  <span className="font-semibold text-slate-900">$25.80/mo</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                  <span className="text-slate-700">CRM Enterprise ($249/mo)</span>
                  <span className="font-semibold text-slate-900">$49.80/mo</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-4">One-Time Bonuses</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                  <span className="text-slate-700">Merchant Activation</span>
                  <span className="font-semibold text-green-700">$50</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                  <span className="text-slate-700">First Deal Created</span>
                  <span className="font-semibold text-green-700">$25</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                  <span className="text-slate-700">Merchant Services Signup</span>
                  <span className="font-semibold text-green-700">$200</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 text-white rounded-xl p-6">
            <h4 className="font-semibold mb-2">Example Earnings</h4>
            <p className="text-slate-300 text-sm mb-4">
              Partner brings on 10 merchants (5 on Professional, 3 on Starter, 2 on Enterprise)
            </p>
            <div className="flex items-center justify-between">
              <span className="text-slate-300">Monthly Recurring Commission:</span>
              <span className="text-2xl font-bold">$258/month</span>
            </div>
            <div className="flex items-center justify-between mt-2">
              <span className="text-slate-300">Plus Activation Bonuses:</span>
              <span className="text-2xl font-bold">$500 one-time</span>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <Zap className="w-6 h-6 text-slate-900" />
              <h3 className="text-lg font-semibold text-slate-900">AI-Powered</h3>
            </div>
            <p className="text-slate-600">
              Generate personalized outreach messages, email sequences, and deal offers in seconds
            </p>
          </div>

          <div>
            <div className="flex items-center gap-3 mb-3">
              <Users className="w-6 h-6 text-slate-900" />
              <h3 className="text-lg font-semibold text-slate-900">Real Support</h3>
            </div>
            <p className="text-slate-600">
              Training videos, live onboarding calls, and a community of partners who are crushing it
            </p>
          </div>

          <div>
            <div className="flex items-center gap-3 mb-3">
              <TrendingUp className="w-6 h-6 text-slate-900" />
              <h3 className="text-lg font-semibold text-slate-900">Scalable</h3>
            </div>
            <p className="text-slate-600">
              Start solo, build a team. Go from side hustle to full agency with white-label options
            </p>
          </div>
        </div>

        <div className="text-center">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/earn/wizard">
              <Button size="lg" className="text-lg px-8">
                <Sparkles className="w-5 h-5 mr-2" />
                Start the Wizard
              </Button>
            </Link>
            <Link to="/partner/dashboard">
              <Button size="lg" variant="outline" className="text-lg px-8">
                Partner Dashboard
              </Button>
            </Link>
            <Link to="/partner/ai-prompts">
              <Button size="lg" variant="outline" className="text-lg px-8">
                <Zap className="w-5 h-5 mr-2" />
                AI Prompt Library
              </Button>
            </Link>
          </div>
          <p className="text-sm text-slate-500 mt-6">
            Free to join. No upfront fees. You only earn when merchants succeed.
          </p>
        </div>
      </div>
    </div>
  );
}

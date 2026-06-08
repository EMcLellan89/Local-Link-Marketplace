import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Gift, Star, Zap, ArrowLeft, ShoppingBag, HandHeart,
  Calendar, Trophy, ChevronRight, CheckCircle, Users,
  Store, Award, Flame, TrendingUp, Lock,
} from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card, { CardBody } from '../../components/ui/Card';
import Button from '../../components/ui/Button';

interface EarnAction {
  id: string;
  label: string;
  points: number;
  icon: React.ElementType;
  color: string;
  freq: string;
  category: 'shop' | 'volunteer' | 'civic' | 'community';
}

interface Reward {
  id: string;
  title: string;
  merchant: string;
  points: number;
  value: string;
  icon: React.ElementType;
  category: 'discount' | 'experience' | 'civic' | 'donation';
  gradient: string;
  available: boolean;
}

const EARN_ACTIONS: EarnAction[] = [
  { id: 'shop_local', label: 'Shop at a Local-Link Merchant', points: 10, icon: ShoppingBag, color: 'text-blue-600', freq: 'Per qualifying purchase', category: 'shop' },
  { id: 'first_purchase', label: 'First purchase at a new merchant', points: 25, icon: Star, color: 'text-yellow-600', freq: 'Per new merchant (up to 12/year)', category: 'shop' },
  { id: 'redeem_deal', label: 'Redeem a Local Deal', points: 15, icon: Gift, color: 'text-purple-600', freq: 'Per deal redemption', category: 'shop' },
  { id: 'volunteer', label: 'Log a Volunteer Shift', points: 50, icon: HandHeart, color: 'text-rose-600', freq: 'Per verified shift (up to 20/year)', category: 'volunteer' },
  { id: 'volunteer_signup', label: 'Sign Up for a Volunteer Opportunity', points: 5, icon: HandHeart, color: 'text-pink-600', freq: 'Per sign-up (up to 24/year)', category: 'volunteer' },
  { id: 'attend_event', label: 'Attend a Community Event', points: 20, icon: Calendar, color: 'text-green-600', freq: 'Per event (check-in required)', category: 'civic' },
  { id: 'town_meeting', label: 'Attend a Town Meeting or Hearing', points: 40, icon: Users, color: 'text-indigo-600', freq: 'Per verified attendance', category: 'civic' },
  { id: 'review', label: 'Write a Verified Business Review', points: 10, icon: Star, color: 'text-amber-600', freq: 'Per review (max 3/month)', category: 'community' },
  { id: 'refer_merchant', label: 'Refer a Business to Local-Link', points: 100, icon: Store, color: 'text-teal-600', freq: 'When business activates', category: 'community' },
  { id: 'refer_resident', label: 'Invite a Neighbor to Join', points: 25, icon: Users, color: 'text-cyan-600', freq: 'When neighbor verifies email', category: 'community' },
  { id: 'profile_complete', label: 'Complete Your Profile', points: 50, icon: CheckCircle, color: 'text-green-700', freq: 'One-time', category: 'community' },
  { id: 'birthday_bonus', label: 'Birthday Bonus', points: 100, icon: Gift, color: 'text-pink-500', freq: 'Once per year', category: 'community' },
];

const REWARDS: Reward[] = [
  { id: 'coffee', title: 'Free Coffee & Pastry', merchant: 'Pepperell Coffee Co.', points: 200, value: '$7 value', icon: Gift, category: 'discount', gradient: 'from-amber-500 to-orange-400', available: true },
  { id: 'pizza', title: '$10 Off Your Order', merchant: 'Main St Pizza', points: 250, value: '$10 off', icon: ShoppingBag, category: 'discount', gradient: 'from-red-500 to-rose-400', available: true },
  { id: 'hardware', title: '15% Off Any Purchase', merchant: 'Pepperell Hardware', points: 400, value: '15% off', icon: Store, category: 'discount', gradient: 'from-slate-600 to-slate-500', available: true },
  { id: 'yoga', title: 'Free Yoga Class', merchant: 'Nashoba Wellness', points: 300, value: '$20 value', icon: Gift, category: 'experience', gradient: 'from-purple-500 to-violet-500', available: true },
  { id: 'park_pass', title: 'Annual Shattuck Park Parking Pass', merchant: 'Pepperell Parks & Rec', points: 500, value: '$25 value', icon: Award, category: 'civic', gradient: 'from-green-600 to-emerald-500', available: true },
  { id: 'library', title: 'Library Museum Pass (Boston Children\'s)', merchant: 'Pepperell Public Library', points: 600, value: '$50+ value', icon: Gift, category: 'civic', gradient: 'from-teal-600 to-cyan-500', available: true },
  { id: 'donate_food', title: 'Donate 10 Meals to Food Pantry', merchant: 'Greater Nashoba Food Pantry', points: 350, value: 'Community impact', icon: HandHeart, category: 'donation', gradient: 'from-orange-500 to-amber-500', available: true },
  { id: 'donate_veteran', title: 'Sponsor a Veteran Service Hour', merchant: 'Pepperell Veterans Services', points: 400, value: 'Community impact', icon: Award, category: 'donation', gradient: 'from-indigo-600 to-blue-600', available: true },
  { id: 'dinner', title: 'Dinner for Two', merchant: 'The Nashua River Grille', points: 1000, value: '$60 value', icon: Gift, category: 'experience', gradient: 'from-slate-800 to-slate-600', available: true },
  { id: 'spa', title: 'Spa Gift Card', merchant: 'Hollis St Spa', points: 800, value: '$50 value', icon: Star, category: 'experience', gradient: 'from-pink-500 to-rose-500', available: true },
];

const TIERS = [
  { name: 'Neighbor', min: 0, max: 499, color: 'text-slate-600', bg: 'bg-slate-100', icon: Users, perks: ['5% bonus on every 10th purchase', 'Birthday bonus points', 'Access to resident rewards catalog'] },
  { name: 'Regular', min: 500, max: 1499, color: 'text-blue-700', bg: 'bg-blue-100', icon: Star, perks: ['All Neighbor perks', '10% point bonus on all earn actions', 'Early access to new deals', 'Monthly member spotlight eligibility'] },
  { name: 'Local Hero', min: 1500, max: 3999, color: 'text-amber-700', bg: 'bg-amber-100', icon: Flame, perks: ['All Regular perks', '20% point bonus', 'Priority seating at community events', 'Local Hero badge on your profile', 'VIP merchant discounts'] },
  { name: 'Town Champion', min: 4000, max: Infinity, color: 'text-purple-700', bg: 'bg-purple-100', icon: Trophy, perks: ['All Local Hero perks', '30% point bonus', 'Named in annual Community Report', 'Free Local-Link membership for 1 year', 'Town Champion plaque at Community Day'] },
];

const CATEGORY_TABS = [
  { id: 'all', label: 'All Rewards' },
  { id: 'discount', label: 'Deals & Discounts' },
  { id: 'experience', label: 'Experiences' },
  { id: 'civic', label: 'Civic Perks' },
  { id: 'donation', label: 'Give Back' },
];

const EARN_CATEGORIES = [
  { id: 'all', label: 'All Ways to Earn' },
  { id: 'shop', label: 'Shopping' },
  { id: 'volunteer', label: 'Volunteering' },
  { id: 'civic', label: 'Civic Action' },
  { id: 'community', label: 'Community' },
];

const MOCK_LEADERBOARD = [
  { name: 'Sarah M.', points: 4820, tier: 'Town Champion', rank: 1 },
  { name: 'Tom H.', points: 3940, tier: 'Town Champion', rank: 2 },
  { name: 'Lisa K.', points: 2710, tier: 'Local Hero', rank: 3 },
  { name: 'Dave P.', points: 1980, tier: 'Local Hero', rank: 4 },
  { name: 'Amy R.', points: 1230, tier: 'Regular', rank: 5 },
];

export default function RewardsPage() {
  const navigate = useNavigate();
  const [activeRewardTab, setActiveRewardTab] = useState('all');
  const [activeEarnTab, setActiveEarnTab] = useState('all');
  const [mainTab, setMainTab] = useState<'earn' | 'redeem' | 'tiers' | 'leaderboard'>('earn');

  const filteredRewards = REWARDS.filter(r => activeRewardTab === 'all' || r.category === activeRewardTab);
  const filteredEarn = EARN_ACTIONS.filter(a => activeEarnTab === 'all' || a.category === activeEarnTab);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Hero */}
        <div className="bg-gradient-to-br from-amber-500 via-orange-500 to-rose-500 rounded-2xl p-8 text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 80% 20%, white 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
          <div className="relative">
            <button onClick={() => navigate('/community')} className="flex items-center gap-2 text-white/70 text-sm mb-4 hover:text-white transition-colors">
              <ArrowLeft className="w-4 h-4" /> Back to Community Hub
            </button>
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Star className="w-6 h-6 text-yellow-200" />
                  <span className="text-yellow-100 text-sm font-semibold uppercase tracking-wider">Community Rewards</span>
                </div>
                <h1 className="text-3xl font-bold">Earn Points. Support Local. Give Back.</h1>
                <p className="text-white/80 mt-2 max-w-xl">Every time you shop local, volunteer, or show up for your community — you earn points. Redeem them for deals, experiences, and ways to give back.</p>
              </div>
              <div className="grid grid-cols-2 gap-3 min-w-[260px]">
                <div className="bg-white/20 rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold">1,240</div>
                  <div className="text-xs text-white/70 mt-0.5">Your Points</div>
                </div>
                <div className="bg-white/20 rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-yellow-200">Regular</div>
                  <div className="text-xs text-white/70 mt-0.5">Your Tier</div>
                </div>
                <div className="col-span-2 bg-white/20 rounded-xl p-3">
                  <div className="flex justify-between text-xs mb-1.5">
                    <span>Regular → Local Hero</span>
                    <span>260 pts away</span>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-2">
                    <div className="bg-yellow-300 h-2 rounded-full" style={{ width: '83%' }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {([
            { id: 'earn', label: 'How to Earn', icon: Zap },
            { id: 'redeem', label: 'Redeem Rewards', icon: Gift },
            { id: 'tiers', label: 'Member Tiers', icon: Trophy },
            { id: 'leaderboard', label: 'Leaderboard', icon: TrendingUp },
          ] as const).map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setMainTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm whitespace-nowrap transition-all ${mainTab === tab.id ? 'bg-amber-500 text-white shadow-md' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}
              >
                <Icon className="w-4 h-4" />{tab.label}
              </button>
            );
          })}
        </div>

        {/* Earn Tab */}
        {mainTab === 'earn' && (
          <div className="space-y-5">
            <div className="flex gap-2 overflow-x-auto pb-1">
              {EARN_CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setActiveEarnTab(cat.id)}
                  className={`px-4 py-2 rounded-xl font-medium text-sm whitespace-nowrap transition-all ${activeEarnTab === cat.id ? 'bg-slate-800 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredEarn.map(action => {
                const Icon = action.icon;
                return (
                  <Card key={action.id} variant="bordered" className="hover:shadow-md transition-shadow">
                    <CardBody className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center flex-shrink-0">
                        <Icon className={`w-6 h-6 ${action.color}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-slate-900 text-sm">{action.label}</div>
                        <div className="text-xs text-slate-500 mt-0.5">{action.freq}</div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <div className="text-lg font-bold text-amber-600">+{action.points}</div>
                        <div className="text-xs text-slate-400">pts</div>
                      </div>
                    </CardBody>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* Redeem Tab */}
        {mainTab === 'redeem' && (
          <div className="space-y-5">
            <div className="flex gap-2 overflow-x-auto pb-1">
              {CATEGORY_TABS.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setActiveRewardTab(cat.id)}
                  className={`px-4 py-2 rounded-xl font-medium text-sm whitespace-nowrap transition-all ${activeRewardTab === cat.id ? 'bg-amber-500 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredRewards.map(reward => {
                const Icon = reward.icon;
                const canRedeem = 1240 >= reward.points;
                return (
                  <Card key={reward.id} variant="bordered" className="hover:shadow-lg transition-all overflow-hidden">
                    <div className={`bg-gradient-to-br ${reward.gradient} p-4 text-white`}>
                      <div className="flex items-start justify-between">
                        <div>
                          <Icon className="w-8 h-8 text-white/80 mb-2" />
                          <h3 className="font-bold">{reward.title}</h3>
                          <p className="text-white/70 text-sm">{reward.merchant}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold">{reward.points.toLocaleString()}</div>
                          <div className="text-white/70 text-xs">points</div>
                        </div>
                      </div>
                    </div>
                    <CardBody className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-slate-700">{reward.value}</span>
                        {canRedeem ? (
                          <span className="text-xs font-medium text-green-700 bg-green-100 px-2 py-0.5 rounded-full">You can redeem!</span>
                        ) : (
                          <span className="text-xs text-slate-400 flex items-center gap-1"><Lock className="w-3 h-3" />Need {(reward.points - 1240).toLocaleString()} more</span>
                        )}
                      </div>
                      <button
                        disabled={!canRedeem}
                        className={`w-full py-2.5 rounded-xl font-semibold text-sm transition-all ${canRedeem ? 'bg-amber-500 hover:bg-amber-600 text-white' : 'bg-slate-100 text-slate-400 cursor-not-allowed'}`}
                      >
                        {canRedeem ? 'Redeem Now' : 'Not Enough Points'}
                      </button>
                    </CardBody>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* Tiers Tab */}
        {mainTab === 'tiers' && (
          <div className="grid sm:grid-cols-2 gap-5">
            {TIERS.map((tier, i) => {
              const Icon = tier.icon;
              const isCurrentTier = tier.name === 'Regular';
              return (
                <Card key={tier.name} variant="bordered" className={`transition-all ${isCurrentTier ? 'ring-2 ring-amber-400 shadow-lg' : ''}`}>
                  <CardBody className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-xl ${tier.bg} flex items-center justify-center`}>
                          <Icon className={`w-6 h-6 ${tier.color}`} />
                        </div>
                        <div>
                          <div className="font-bold text-slate-900">{tier.name}</div>
                          <div className="text-xs text-slate-500">
                            {tier.max === Infinity ? `${tier.min.toLocaleString()}+ points` : `${tier.min.toLocaleString()}–${tier.max.toLocaleString()} points`}
                          </div>
                        </div>
                      </div>
                      {isCurrentTier && <span className="text-xs font-bold text-amber-700 bg-amber-100 px-2.5 py-1 rounded-full">Your Tier</span>}
                    </div>
                    <ul className="space-y-2">
                      {tier.perks.map(perk => (
                        <li key={perk} className="flex items-start gap-2 text-sm text-slate-700">
                          <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                          {perk}
                        </li>
                      ))}
                    </ul>
                  </CardBody>
                </Card>
              );
            })}
          </div>
        )}

        {/* Leaderboard Tab */}
        {mainTab === 'leaderboard' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-slate-900">Top Community Members — June 2026</h2>
              <span className="text-xs text-slate-500">Resets monthly</span>
            </div>
            <div className="space-y-3">
              {MOCK_LEADERBOARD.map(member => {
                const tier = TIERS.find(t => t.name === member.tier)!;
                const TierIcon = tier.icon;
                return (
                  <Card key={member.rank} variant="bordered" className={`${member.rank <= 3 ? 'border-amber-200' : ''}`}>
                    <CardBody className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${member.rank === 1 ? 'bg-yellow-400 text-yellow-900' : member.rank === 2 ? 'bg-slate-300 text-slate-700' : member.rank === 3 ? 'bg-amber-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                        {member.rank}
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-slate-900">{member.name}</div>
                        <div className={`text-xs font-medium flex items-center gap-1 ${tier.color}`}>
                          <TierIcon className="w-3 h-3" />{member.tier}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-amber-600">{member.points.toLocaleString()}</div>
                        <div className="text-xs text-slate-400">points</div>
                      </div>
                    </CardBody>
                  </Card>
                );
              })}
            </div>
            <Card variant="bordered" className="border-dashed border-slate-300">
              <CardBody className="text-center py-6">
                <Trophy className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                <p className="text-slate-500 font-medium">You're ranked #42 this month</p>
                <p className="text-sm text-slate-400 mt-1">Volunteer 2 more times to jump into the top 20!</p>
              </CardBody>
            </Card>
          </div>
        )}

        {/* Join CTA */}
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-amber-900">Not signed up for Rewards yet?</h3>
            <p className="text-sm text-amber-700 mt-1">Join free — start earning points from your very first local purchase or volunteer shift.</p>
          </div>
          <Button onClick={() => navigate('/register')} className="whitespace-nowrap bg-amber-500 hover:bg-amber-600 border-amber-500">
            Join Rewards — Free
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
}

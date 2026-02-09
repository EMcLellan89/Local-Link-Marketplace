import { useEffect, useState } from 'react';
import { User, Bell, Gift, Settings, Copy, Check } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card, { CardBody, CardHeader } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import BackButton from '../../components/ui/BackButton';

interface CustomerPreferences {
  dietary_preferences: string[];
  favorite_categories: string[];
  preferred_locations: string[];
  price_range_min_cents: number;
  price_range_max_cents: number;
}

interface NotificationPreferences {
  email_new_deals: boolean;
  email_deal_expiring: boolean;
  email_favorite_merchant: boolean;
  email_loyalty_updates: boolean;
  sms_new_deals: boolean;
  sms_deal_expiring: boolean;
  push_new_deals: boolean;
  push_deal_expiring: boolean;
}

interface ReferralData {
  code: string;
  referral_count: number;
  rewards_earned: number;
}

export default function ProfilePage() {
  const { user, profile } = useAuth();
  const [customerId, setCustomerId] = useState<string | null>(null);
  const [preferences, setPreferences] = useState<CustomerPreferences>({
    dietary_preferences: [],
    favorite_categories: [],
    preferred_locations: [],
    price_range_min_cents: 0,
    price_range_max_cents: 10000000,
  });
  const [notificationPrefs, setNotificationPrefs] = useState<NotificationPreferences>({
    email_new_deals: true,
    email_deal_expiring: true,
    email_favorite_merchant: true,
    email_loyalty_updates: true,
    sms_new_deals: false,
    sms_deal_expiring: false,
    push_new_deals: true,
    push_deal_expiring: true,
  });
  const [referralData, setReferralData] = useState<ReferralData>({
    code: '',
    referral_count: 0,
    rewards_earned: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'preferences' | 'notifications' | 'referrals'>('preferences');

  useEffect(() => {
    if (user) {
      fetchCustomerData();
    }
  }, [user]);

  const fetchCustomerData = async () => {
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      const { data: customerData, error: customerError } = await supabase
        .from('customers')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (customerError) throw customerError;

      if (customerData) {
        setCustomerId(customerData.id);
        await Promise.all([
          fetchPreferences(customerData.id),
          fetchNotificationPreferences(customerData.id),
          fetchReferralData(customerData.id),
        ]);
      }
    } catch (err) {
      console.error('Error fetching customer data:', err);
      setError('Failed to load profile data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchPreferences = async (custId: string) => {
    try {
      const { data, error: prefsError } = await supabase
        .from('customer_preferences')
        .select('*')
        .eq('customer_id', custId)
        .maybeSingle();

      if (prefsError) throw prefsError;

      if (data) {
        setPreferences({
          dietary_preferences: data.dietary_preferences || [],
          favorite_categories: data.favorite_categories || [],
          preferred_locations: data.preferred_locations || [],
          price_range_min_cents: data.price_range_min_cents || 0,
          price_range_max_cents: data.price_range_max_cents || 10000000,
        });
      }
    } catch (err) {
      console.error('Error fetching preferences:', err);
    }
  };

  const fetchNotificationPreferences = async (custId: string) => {
    try {
      const { data, error: notifError } = await supabase
        .from('notification_preferences')
        .select('*')
        .eq('customer_id', custId)
        .maybeSingle();

      if (notifError) throw notifError;

      if (data) {
        setNotificationPrefs(data);
      }
    } catch (err) {
      console.error('Error fetching notification preferences:', err);
    }
  };

  const fetchReferralData = async (custId: string) => {
    try {
      let { data: existingReferral, error: referralError } = await supabase
        .from('referrals')
        .select('referral_code')
        .eq('referrer_customer_id', custId)
        .maybeSingle();

      if (referralError) throw referralError;

      let code = existingReferral?.referral_code;

      if (!code) {
        const newCode = await generateReferralCode();
        const { data: newReferral, error: insertError } = await supabase
          .from('referrals')
          .insert({
            referrer_customer_id: custId,
            referral_code: newCode,
          })
          .select('referral_code')
          .single();

        if (insertError) throw insertError;

        code = newReferral?.referral_code || '';
      }

      const { data: referrals, error: referralsError } = await supabase
        .from('referrals')
        .select('*')
        .eq('referrer_customer_id', custId)
        .eq('status', 'completed');

      if (referralsError) throw referralsError;

      const referralCount = referrals?.length || 0;
      const rewardsEarned = referrals?.reduce((sum, r) => sum + (r.referrer_reward_points || 0), 0) || 0;

      setReferralData({
        code: code || '',
        referral_count: referralCount,
        rewards_earned: rewardsEarned,
      });
    } catch (err) {
      console.error('Error fetching referral data:', err);
    }
  };

  const generateReferralCode = async (): Promise<string> => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 8; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  };

  const savePreferences = async () => {
    if (!customerId) return;

    try {
      const { error: saveError } = await supabase
        .from('customer_preferences')
        .upsert({
          customer_id: customerId,
          dietary_preferences: preferences.dietary_preferences,
          favorite_categories: preferences.favorite_categories,
          preferred_locations: preferences.preferred_locations,
          price_range_min_cents: preferences.price_range_min_cents,
          price_range_max_cents: preferences.price_range_max_cents,
          updated_at: new Date().toISOString(),
        });

      if (saveError) throw saveError;

      alert('Preferences saved successfully!');
    } catch (err) {
      console.error('Error saving preferences:', err);
      alert('Failed to save preferences. Please try again.');
    }
  };

  const saveNotificationPreferences = async () => {
    if (!customerId) return;

    try {
      const { error: saveError } = await supabase
        .from('notification_preferences')
        .upsert({
          customer_id: customerId,
          ...notificationPrefs,
          updated_at: new Date().toISOString(),
        });

      if (saveError) throw saveError;

      alert('Notification preferences saved successfully!');
    } catch (err) {
      console.error('Error saving notification preferences:', err);
      alert('Failed to save notification preferences. Please try again.');
    }
  };

  const copyReferralCode = async () => {
    try {
      await navigator.clipboard.writeText(referralData.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Error copying referral code:', err);
      alert('Failed to copy referral code. Please try again.');
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#2BB673]"></div>
          <p className="mt-4 text-slate-600">Loading profile...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="max-w-4xl mx-auto">
          <Card variant="bordered">
            <CardBody>
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="w-8 h-8 text-red-600" />
                </div>
                <h3 className="text-lg font-medium text-slate-900 mb-2">Couldn't Load Profile</h3>
                <p className="text-slate-600 mb-4">{error}</p>
                <Button onClick={fetchCustomerData}>Try Again</Button>
              </div>
            </CardBody>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <Card variant="elevated">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 bg-[#2BB673] rounded-full flex items-center justify-center text-white text-2xl font-bold">
                {profile?.full_name?.[0]?.toUpperCase() || 'U'}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">{profile?.full_name || 'User'}</h1>
                <p className="text-slate-600">{user?.email}</p>
              </div>
            </div>
          </CardHeader>
        </Card>

        <div className="flex gap-2 border-b border-slate-200">
          <button
            onClick={() => setActiveTab('preferences')}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'preferences'
                ? 'text-[#2BB673] border-b-2 border-[#2BB673]'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Settings className="w-5 h-5 inline mr-2" />
            Preferences
          </button>
          <button
            onClick={() => setActiveTab('notifications')}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'notifications'
                ? 'text-[#2BB673] border-b-2 border-[#2BB673]'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Bell className="w-5 h-5 inline mr-2" />
            Notifications
          </button>
          <button
            onClick={() => setActiveTab('referrals')}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'referrals'
                ? 'text-[#2BB673] border-b-2 border-[#2BB673]'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Gift className="w-5 h-5 inline mr-2" />
            Refer Friends
          </button>
        </div>

        {activeTab === 'preferences' && (
          <Card variant="bordered">
            <CardHeader>
              <h2 className="text-xl font-bold text-slate-900">Deal Preferences</h2>
              <p className="text-slate-600 mt-1">Customize your deal recommendations</p>
            </CardHeader>
            <CardBody className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Price Range
                </label>
                <div className="flex items-center gap-4">
                  <Input
                    type="number"
                    value={preferences.price_range_min_cents / 100}
                    onChange={(e) => setPreferences({
                      ...preferences,
                      price_range_min_cents: Number(e.target.value) * 100
                    })}
                    placeholder="Min"
                  />
                  <span className="text-slate-600">to</span>
                  <Input
                    type="number"
                    value={preferences.price_range_max_cents / 100}
                    onChange={(e) => setPreferences({
                      ...preferences,
                      price_range_max_cents: Number(e.target.value) * 100
                    })}
                    placeholder="Max"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Dietary Preferences
                </label>
                <div className="flex flex-wrap gap-2">
                  {['Vegetarian', 'Vegan', 'Gluten-Free', 'Dairy-Free', 'Kosher', 'Halal'].map((diet) => (
                    <button
                      key={diet}
                      onClick={() => {
                        if (preferences.dietary_preferences.includes(diet)) {
                          setPreferences({
                            ...preferences,
                            dietary_preferences: preferences.dietary_preferences.filter(d => d !== diet)
                          });
                        } else {
                          setPreferences({
                            ...preferences,
                            dietary_preferences: [...preferences.dietary_preferences, diet]
                          });
                        }
                      }}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                        preferences.dietary_preferences.includes(diet)
                          ? 'bg-[#2BB673] text-white'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {diet}
                    </button>
                  ))}
                </div>
              </div>

              <Button onClick={savePreferences} fullWidth>
                Save Preferences
              </Button>
            </CardBody>
          </Card>
        )}

        {activeTab === 'notifications' && (
          <Card variant="bordered">
            <CardHeader>
              <h2 className="text-xl font-bold text-slate-900">Notification Settings</h2>
              <p className="text-slate-600 mt-1">Choose how you want to be notified</p>
            </CardHeader>
            <CardBody className="space-y-6">
              <div>
                <h3 className="font-medium text-slate-900 mb-4">Email Notifications</h3>
                <div className="space-y-3">
                  {[
                    { key: 'email_new_deals', label: 'New deals in your area' },
                    { key: 'email_deal_expiring', label: 'Deals about to expire' },
                    { key: 'email_favorite_merchant', label: 'Updates from favorite merchants' },
                    { key: 'email_loyalty_updates', label: 'Loyalty points and rewards' },
                  ].map((item) => (
                    <label key={item.key} className="flex items-center justify-between">
                      <span className="text-slate-700">{item.label}</span>
                      <input
                        type="checkbox"
                        checked={notificationPrefs[item.key as keyof NotificationPreferences] as boolean}
                        onChange={(e) => setNotificationPrefs({
                          ...notificationPrefs,
                          [item.key]: e.target.checked
                        })}
                        className="w-5 h-5 text-[#2BB673] rounded focus:ring-[#2BB673]"
                      />
                    </label>
                  ))}
                </div>
              </div>

              <div className="border-t border-slate-200 pt-6">
                <h3 className="font-medium text-slate-900 mb-4">Push Notifications</h3>
                <div className="space-y-3">
                  {[
                    { key: 'push_new_deals', label: 'New deals in your area' },
                    { key: 'push_deal_expiring', label: 'Deals about to expire' },
                  ].map((item) => (
                    <label key={item.key} className="flex items-center justify-between">
                      <span className="text-slate-700">{item.label}</span>
                      <input
                        type="checkbox"
                        checked={notificationPrefs[item.key as keyof NotificationPreferences] as boolean}
                        onChange={(e) => setNotificationPrefs({
                          ...notificationPrefs,
                          [item.key]: e.target.checked
                        })}
                        className="w-5 h-5 text-[#2BB673] rounded focus:ring-[#2BB673]"
                      />
                    </label>
                  ))}
                </div>
              </div>

              <Button onClick={saveNotificationPreferences} fullWidth>
                Save Notification Settings
              </Button>
            </CardBody>
          </Card>
        )}

        {activeTab === 'referrals' && (
          <Card variant="bordered">
            <CardHeader>
              <h2 className="text-xl font-bold text-slate-900">Refer Friends & Earn Rewards</h2>
              <p className="text-slate-600 mt-1">Share your referral code and earn points for each friend who signs up</p>
            </CardHeader>
            <CardBody className="space-y-6">
              <div className="bg-gradient-to-br from-[#2BB673] to-[#25a062] rounded-lg p-6 text-white">
                <div className="text-center">
                  <Gift className="w-12 h-12 mx-auto mb-4 opacity-90" />
                  <p className="text-sm opacity-90 mb-2">Your Referral Code</p>
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <span className="text-3xl font-bold tracking-wider">{referralData.code}</span>
                    <button
                      onClick={copyReferralCode}
                      className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
                    >
                      {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                    </button>
                  </div>
                  <p className="text-sm opacity-90">
                    Share this code with friends. You both get rewards when they sign up!
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 rounded-lg p-4 text-center">
                  <p className="text-sm text-slate-600 mb-1">Friends Referred</p>
                  <p className="text-3xl font-bold text-slate-900">{referralData.referral_count}</p>
                </div>
                <div className="bg-slate-50 rounded-lg p-4 text-center">
                  <p className="text-sm text-slate-600 mb-1">Points Earned</p>
                  <p className="text-3xl font-bold text-[#2BB673]">{referralData.rewards_earned}</p>
                </div>
              </div>

              <div className="border-t border-slate-200 pt-6">
                <h3 className="font-medium text-slate-900 mb-3">How it works</h3>
                <ol className="space-y-2 text-slate-700">
                  <li className="flex items-start">
                    <span className="flex-shrink-0 w-6 h-6 bg-[#2BB673] text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">1</span>
                    <span>Share your unique referral code with friends</span>
                  </li>
                  <li className="flex items-start">
                    <span className="flex-shrink-0 w-6 h-6 bg-[#2BB673] text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">2</span>
                    <span>They sign up using your code</span>
                  </li>
                  <li className="flex items-start">
                    <span className="flex-shrink-0 w-6 h-6 bg-[#2BB673] text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">3</span>
                    <span>You both receive 500 loyalty points!</span>
                  </li>
                </ol>
              </div>
            </CardBody>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}

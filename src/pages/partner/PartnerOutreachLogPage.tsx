import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { Send, Mail, MessageCircle, Phone, TrendingUp } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import BackButton from '../../components/ui/BackButton';

type Channel = 'email' | 'text' | 'dm' | 'call';
type Outcome = 'sent' | 'replied' | 'booked' | 'no_response';

export default function PartnerOutreachLogPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    channel: 'email' as Channel,
    industry: '',
    outcome: 'sent' as Outcome,
    notes: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user || !formData.industry) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase.functions.invoke('partner-outreach-log', {
        body: formData,
        headers: {
          Authorization: `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
        },
      });

      if (error) throw error;

      setSuccess(true);
      setFormData({
        channel: 'email',
        industry: '',
        outcome: 'sent',
        notes: '',
      });

      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      console.error('Error logging outreach:', err);
      alert(err.message || 'Failed to log outreach');
    } finally {
      setLoading(false);
    }
  };

  const channelIcons = {
    email: <Mail className="w-5 h-5" />,
    text: <MessageCircle className="w-5 h-5" />,
    dm: <Send className="w-5 h-5" />,
    call: <Phone className="w-5 h-5" />,
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-3xl mx-auto space-y-6">
        <BackButton to="/partner/progress" label="Back to Progress" />

        <div>
          <h1 className="text-3xl font-bold text-gray-900">Log Outreach Activity</h1>
          <p className="text-gray-600 mt-1">Track your prospecting efforts and unlock badges</p>
        </div>

        {success && (
          <Card className="p-4 bg-green-50 border-green-200">
            <div className="flex items-center gap-3 text-green-800">
              <TrendingUp className="w-5 h-5" />
              <p className="font-semibold">Outreach logged successfully! Keep up the great work.</p>
            </div>
          </Card>
        )}

        <Card className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Channel <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {(['email', 'text', 'dm', 'call'] as Channel[]).map((channel) => (
                  <button
                    key={channel}
                    type="button"
                    onClick={() => setFormData({ ...formData, channel })}
                    className={`p-4 rounded-lg border-2 transition-all flex flex-col items-center gap-2 ${
                      formData.channel === channel
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                    }`}
                  >
                    {channelIcons[channel]}
                    <span className="font-medium capitalize">{channel}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Industry / Business Type <span className="text-red-500">*</span>
              </label>
              <Input
                type="text"
                value={formData.industry}
                onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                placeholder="e.g. Restaurant, HVAC, Dental, Salon..."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Outcome <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.outcome}
                onChange={(e) => setFormData({ ...formData, outcome: e.target.value as Outcome })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="sent">Sent (No Response Yet)</option>
                <option value="replied">They Replied</option>
                <option value="booked">Booked a Meeting</option>
                <option value="no_response">No Response</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Notes (Optional)</label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Any additional details about this outreach..."
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? (
                <>
                  <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Logging...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Log Outreach
                </>
              )}
            </Button>
          </form>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-blue-50 to-white border-blue-200">
          <h3 className="font-bold text-gray-900 mb-3">Pro Tip: Unlock "First Pitch Sent" Badge</h3>
          <p className="text-gray-700">
            Logging your first outreach activity will automatically award you the "First Pitch Sent" badge.
            Consistent daily logging helps you track patterns, identify what works, and build momentum toward
            bigger milestones!
          </p>
        </Card>
      </div>
    </div>
  );
}

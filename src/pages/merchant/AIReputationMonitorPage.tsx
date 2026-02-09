import { useState } from 'react';
import { Star, Send, Copy, Check } from 'lucide-react';
import BusinessHubLayout from '../../components/layout/BusinessHubLayout';
import Card, { CardBody, CardHeader } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import BackButton from '../components/ui/BackButton';
import { supabase } from '../../lib/supabase';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function AIReputationMonitorPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "Hi! I'm your AI Reputation Monitor. I track reviews across Google, Yelp, Facebook, Angi, and more. I provide real-time alerts, sentiment analysis, and suggested responses. What platforms would you like me to monitor?"
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-reputation-monitor`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
          },
          body: JSON.stringify({
            messages: [...messages, { role: 'user', content: userMessage }],
            userId: user.id
          })
        }
      );

      if (!response.ok) throw new Error('Failed to get response');

      const data = await response.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.response }]);
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.'
      }]);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const monitoringExamples = [
    {
      title: 'Multi-Platform Setup',
      prompt: 'Monitor my business on Google, Yelp, Facebook, and Angi with instant SMS alerts',
      icon: '📱'
    },
    {
      title: 'Negative Alert Priority',
      prompt: 'Setup priority alerts for reviews 3-stars or below across all platforms',
      icon: '⚠️'
    },
    {
      title: 'Competitor Tracking',
      prompt: 'Track competitor ratings and review trends for top 3 competitors in my area',
      icon: '👁️'
    },
    {
      title: 'Weekly Reports',
      prompt: 'Send me weekly reputation reports with rating trends and response suggestions',
      icon: '📊'
    }
  ];

  return (
    <BusinessHubLayout>
      <div className="max-w-5xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">AI Reputation Monitor</h1>
          <p className="text-slate-600 mt-2">
            Never miss a review again. Real-time monitoring with intelligent alerts and responses.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card variant="bordered">
              <CardBody>
                <div className="h-[500px] overflow-y-auto mb-4 space-y-4">
                  {messages.map((message, index) => (
                    <div
                      key={index}
                      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg p-4 ${
                          message.role === 'user'
                            ? 'bg-[#2BB673] text-white'
                            : 'bg-slate-100 text-slate-900'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <p className="whitespace-pre-wrap">{message.content}</p>
                          {message.role === 'assistant' && index > 0 && (
                            <button
                              onClick={() => copyToClipboard(message.content, index)}
                              className="flex-shrink-0 p-1 hover:bg-slate-200 rounded"
                              title="Copy to clipboard"
                            >
                              {copiedIndex === index ? (
                                <Check className="w-4 h-4 text-green-600" />
                              ) : (
                                <Copy className="w-4 h-4 text-slate-600" />
                              )}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  {loading && (
                    <div className="flex justify-start">
                      <div className="bg-slate-100 text-slate-900 rounded-lg p-4">
                        <div className="flex space-x-2">
                          <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <form onSubmit={handleSubmit} className="flex gap-2">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="What would you like to monitor?"
                    className="flex-1 px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2BB673]"
                    disabled={loading}
                  />
                  <Button
                    type="submit"
                    disabled={loading || !input.trim()}
                    className="bg-[#2BB673] hover:bg-[#25a866] text-white px-6"
                  >
                    <Send className="w-5 h-5" />
                  </Button>
                </form>
              </CardBody>
            </Card>
          </div>

          <div className="space-y-6">
            <Card variant="bordered" className="bg-gradient-to-br from-blue-50 to-cyan-50">
              <CardHeader>
                <Star className="w-8 h-8 text-blue-500 mb-2" />
                <h3 className="text-lg font-bold text-slate-900">Monitoring Features</h3>
              </CardHeader>
              <CardBody>
                <ul className="space-y-2 text-sm text-slate-600">
                  <li>✓ Real-time review alerts</li>
                  <li>✓ Sentiment analysis</li>
                  <li>✓ Response suggestions</li>
                  <li>✓ Reputation score tracking</li>
                  <li>✓ Competitor comparison</li>
                  <li>✓ Trend analysis</li>
                </ul>
              </CardBody>
            </Card>

            <Card variant="bordered">
              <CardHeader>
                <h3 className="text-lg font-bold text-slate-900">Setup Examples</h3>
              </CardHeader>
              <CardBody>
                <div className="space-y-2">
                  {monitoringExamples.map((example, index) => (
                    <button
                      key={index}
                      onClick={() => setInput(example.prompt)}
                      className="w-full text-left p-3 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                      <div className="flex items-start gap-2">
                        <span className="text-xl">{example.icon}</span>
                        <div>
                          <p className="font-semibold text-sm text-slate-900">{example.title}</p>
                          <p className="text-xs text-slate-600 mt-1">{example.prompt}</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </CardBody>
            </Card>

            <Card variant="bordered" className="bg-gradient-to-br from-green-50 to-emerald-50">
              <CardBody>
                <h3 className="font-bold text-slate-900 mb-2">Why It Matters:</h3>
                <ul className="space-y-1 text-sm text-slate-600">
                  <li>✓ Respond 10x faster</li>
                  <li>✓ Protect your reputation</li>
                  <li>✓ Turn negatives into positives</li>
                  <li>✓ Track improvement over time</li>
                  <li>✓ Stay ahead of competitors</li>
                </ul>
              </CardBody>
            </Card>
          </div>
        </div>
      </div>
    </BusinessHubLayout>
  );
}

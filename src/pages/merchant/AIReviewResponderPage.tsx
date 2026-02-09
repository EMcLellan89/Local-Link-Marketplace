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

export default function AIReviewResponderPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "Hi! I'm your AI Review Responder. Share a customer review with me, and I'll help you craft a professional, thoughtful response. Just paste the review and let me know if it's positive or negative!"
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
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-review-responder`,
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

  const examples = [
    {
      type: 'Positive Review',
      review: '"Great service! The plumber arrived on time and fixed my leak quickly."',
      icon: '⭐'
    },
    {
      type: 'Negative Review',
      review: '"Disappointed with the wait time. Took 3 hours to arrive."',
      icon: '⚠️'
    },
    {
      type: 'Mixed Review',
      review: '"Good work but a bit pricey for what was done."',
      icon: '🤔'
    }
  ];

  return (
    <BusinessHubLayout>
      <div className="max-w-5xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">AI Review Responder</h1>
          <p className="text-slate-600 mt-2">
            Generate professional, empathetic responses to customer reviews
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
                    placeholder="Paste a customer review..."
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
            <Card variant="bordered" className="bg-gradient-to-br from-yellow-50 to-orange-50">
              <CardHeader>
                <Star className="w-8 h-8 text-yellow-500 mb-2" />
                <h3 className="text-lg font-bold text-slate-900">Quick Tips</h3>
              </CardHeader>
              <CardBody>
                <ul className="space-y-2 text-sm text-slate-600">
                  <li>✓ Paste the entire review</li>
                  <li>✓ Include customer name if available</li>
                  <li>✓ Mention review platform (Google, Yelp, etc.)</li>
                  <li>✓ Add any context about the job</li>
                </ul>
              </CardBody>
            </Card>

            <Card variant="bordered">
              <CardHeader>
                <h3 className="text-lg font-bold text-slate-900">Example Reviews</h3>
              </CardHeader>
              <CardBody>
                <div className="space-y-3">
                  {examples.map((example, index) => (
                    <button
                      key={index}
                      onClick={() => setInput(example.review)}
                      className="w-full text-left p-3 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                      <div className="flex items-start gap-2">
                        <span className="text-xl">{example.icon}</span>
                        <div>
                          <p className="font-semibold text-sm text-slate-900">{example.type}</p>
                          <p className="text-xs text-slate-600 mt-1">{example.review}</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </CardBody>
            </Card>

            <Card variant="bordered" className="bg-gradient-to-br from-green-50 to-emerald-50">
              <CardBody>
                <h3 className="font-bold text-slate-900 mb-2">What I Can Do:</h3>
                <ul className="space-y-1 text-sm text-slate-600">
                  <li>✓ Thank customers professionally</li>
                  <li>✓ Address concerns empathetically</li>
                  <li>✓ Turn negatives into positives</li>
                  <li>✓ Match your brand voice</li>
                  <li>✓ Encourage future business</li>
                </ul>
              </CardBody>
            </Card>
          </div>
        </div>
      </div>
    </BusinessHubLayout>
  );
}

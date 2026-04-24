import { useState } from 'react';
import { X, MessageSquare, CheckCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Props {
  userId: string;
  role: 'merchant' | 'partner';
  onClose: () => void;
}

export default function TestimonialSubmitModal({ userId, role, onClose }: Props) {
  const [form, setForm] = useState({
    display_name: '',
    business_type: '',
    content: '',
    result_badge: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.content.trim() || !form.display_name.trim()) {
      setError('Please fill in your name and feedback.');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      const { error: err } = await supabase.from('testimonials').insert({
        user_id: userId,
        role,
        display_name: form.display_name.trim(),
        business_type: form.business_type.trim(),
        content: form.content.trim(),
        result_badge: form.result_badge.trim(),
        approved: false,
      });
      if (err) throw err;
      setDone(true);
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-blue-100 rounded-xl flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="font-bold text-gray-900">Share Your Result</h2>
              <p className="text-sm text-gray-500">Help others see what's possible</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {done ? (
          <div className="p-8 text-center">
            <CheckCircle className="w-14 h-14 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">Thank You!</h3>
            <p className="text-gray-500 mb-6">Your result has been submitted and will appear on the Results page after a quick review.</p>
            <button onClick={onClose} className="bg-blue-600 text-white font-semibold px-6 py-2.5 rounded-xl hover:bg-blue-700 transition-colors">
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Your Name / Initials <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.display_name}
                  onChange={e => setForm(f => ({ ...f, display_name: e.target.value }))}
                  placeholder="e.g. Maria T."
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {role === 'merchant' ? 'Business Type' : 'Role'}
                </label>
                <input
                  type="text"
                  value={form.business_type}
                  onChange={e => setForm(f => ({ ...f, business_type: e.target.value }))}
                  placeholder={role === 'merchant' ? 'e.g. Cleaning Service' : 'Local Partner'}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                How has Local-Link helped you? <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={4}
                value={form.content}
                onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
                placeholder="Share what changed for your business since joining Local-Link..."
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
              <p className="text-xs text-gray-400 mt-1">{form.content.length}/500 characters</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Quick Result (optional)
              </label>
              <input
                type="text"
                value={form.result_badge}
                onChange={e => setForm(f => ({ ...f, result_badge: e.target.value }))}
                placeholder={role === 'merchant' ? 'e.g. First lead in 3 days' : 'e.g. First sale in 2 days'}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {error && (
              <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>
            )}

            <div className="flex gap-3 pt-2">
              <button type="button" onClick={onClose} className="flex-1 border border-gray-200 text-gray-600 font-medium py-2.5 rounded-xl hover:bg-gray-50 transition-colors text-sm">
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 bg-blue-600 text-white font-semibold py-2.5 rounded-xl hover:bg-blue-700 transition-colors text-sm disabled:opacity-50"
              >
                {submitting ? 'Submitting...' : 'Submit Result'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

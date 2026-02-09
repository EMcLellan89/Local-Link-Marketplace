import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface Nudge {
  id: string;
  key: string;
  title: string;
  body: string;
  cta_label: string | null;
  cta_url: string | null;
  priority: number;
  is_dismissed: boolean;
}

export function NudgeBanner() {
  const { user } = useAuth();
  const [nudge, setNudge] = useState<Nudge | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!user) return;

    fetchNudge();
  }, [user]);

  async function fetchNudge() {
    try {
      const { data, error } = await supabase
        .from('in_app_nudges')
        .select('*')
        .eq('user_id', user?.id as string)
        .eq('is_dismissed', false)
        .order('priority', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setNudge(data as any);
        setIsVisible(true);
      }
    } catch (error) {
      console.error('Error fetching nudge:', error);
    }
  }

  async function dismissNudge() {
    if (!nudge) return;

    try {
      const { error } = await supabase
        .from('in_app_nudges')
        .update({
          is_dismissed: true,
          dismissed_at: new Date().toISOString(),
        } as any)
        .eq('id', nudge.id);

      if (error) throw error;

      setIsVisible(false);
      setTimeout(() => setNudge(null), 300);
    } catch (error) {
      console.error('Error dismissing nudge:', error);
    }
  }

  if (!nudge || !isVisible) return null;

  return (
    <div
      className={`bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-4 mb-6 shadow-sm transition-all duration-300 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            {nudge.title}
          </h3>
          <p className="text-gray-700 mb-3">{nudge.body}</p>
          {nudge.cta_label && nudge.cta_url && (
            <a
              href={nudge.cta_url}
              className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              {nudge.cta_label}
            </a>
          )}
        </div>
        <button
          onClick={dismissNudge}
          className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
          aria-label="Dismiss"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
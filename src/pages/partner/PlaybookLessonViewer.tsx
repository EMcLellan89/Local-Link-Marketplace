import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, CheckCircle, Zap } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../../components/ui/Button';
import { DEV_MODE } from '../../lib/devMode';
import { getProductLessonContent } from '../../lib/devPlaybookData';

interface Lesson {
  id: string;
  title: string;
  content: string | null;
  video_url: string | null;
  video_duration_seconds: number | null;
  display_order: number;
}

export default function PlaybookLessonViewer() {
  const { playbookSlug, lessonId } = useParams<{ playbookSlug: string; lessonId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    loadLesson();
  }, [lessonId]);

  async function loadLesson() {
    try {
      if (!DEV_MODE && !user) {
        navigate('/partner/login');
        return;
      }

      if (DEV_MODE) {
        loadDevModeLesson();
        return;
      }

      const { data: lessonData, error: lessonError } = await supabase
        .from('partner_playbook_lessons')
        .select('*')
        .eq('id', lessonId)
        .single();

      if (lessonError) throw lessonError;
      setLesson(lessonData);

      if (user) {
        const { data: progressData } = await supabase
          .from('partner_playbook_progress')
          .select('completed')
          .eq('user_id', user.id)
          .eq('lesson_id', lessonId)
          .maybeSingle();

        setCompleted(progressData?.completed || false);
      }
    } catch (err) {
      console.error('Error loading lesson:', err);
      navigate(`/partner/playbooks/${playbookSlug}/execute`);
    } finally {
      setLoading(false);
    }
  }

  function loadDevModeLesson() {
    const lessonTitles: Record<string, string> = {
      'lesson-1-1': 'Product Introduction & Overview',
      'lesson-1-2': 'Key Features & Benefits',
      'lesson-1-3': 'Who This Product Is For (Target Market)',
      'lesson-1-4': 'Value Proposition & ROI Calculator',
      'lesson-1-5': 'Competitive Advantages',
      'lesson-2-1': 'Complete Pricing Breakdown',
      'lesson-2-2': 'Package Tiers & Add-Ons',
      'lesson-2-3': 'Your Commission Structure (Exact Numbers)',
      'lesson-2-4': 'Recurring vs One-Time Commissions',
      'lesson-2-5': 'Income Examples & Scenarios',
      'lesson-2-6': 'How & When You Get Paid',
      'lesson-3-1': 'Discovery Questions & Qualifying',
      'lesson-3-2': 'Opening Script & Hook',
      'lesson-3-3': 'Product Demo Walkthrough',
      'lesson-3-4': 'Presenting Pricing & Packages',
      'lesson-3-5': 'Trial Close & Closing Scripts',
      'lesson-4-1': 'Top 10 Objections & Responses',
      'lesson-4-2': 'Price Objection Handling',
      'lesson-4-3': 'Case Studies & Success Stories',
      'lesson-4-4': 'Sales Assets & Resources',
      'lesson-4-5': 'Certification Exam (Pass to Sell)'
    };

    const lessonContent = getProductLessonContent(playbookSlug || '', lessonId || '');

    setLesson({
      id: lessonId || '',
      title: lessonTitles[lessonId || ''] || 'Lesson Title',
      content: lessonContent,
      video_url: 'https://player.vimeo.com/video/76979871',
      video_duration_seconds: 720,
      display_order: 1
    });

    setCompleted(false);
    setLoading(false);
  }

  async function markComplete() {
    if (DEV_MODE) {
      setCompleted(true);
      return;
    }

    if (!user || !lessonId) return;

    try {
      const { error } = await supabase
        .from('partner_playbook_progress')
        .upsert({
          user_id: user.id,
          lesson_id: lessonId,
          completed: true,
          completed_at: new Date().toISOString()
        }, {
          onConflict: 'user_id,lesson_id'
        });

      if (error) throw error;
      setCompleted(true);
    } catch (err) {
      console.error('Error marking lesson complete:', err);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  if (!lesson) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => navigate(`/partner/playbooks/${playbookSlug}/execute`)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Playbook
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-start justify-between">
              <h1 className="text-2xl font-bold text-gray-900">{lesson.title}</h1>
              {completed && (
                <div className="flex items-center gap-2 text-green-600">
                  <CheckCircle className="h-5 w-5" />
                  <span className="text-sm font-medium">Completed</span>
                </div>
              )}
            </div>
          </div>

          {lesson.video_url && (
            <div className="aspect-video bg-black">
              <iframe
                src={lesson.video_url}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          )}

          {lesson.content && (
            <div className="p-6">
              <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: lesson.content }} />
            </div>
          )}

          <div className="p-6 bg-gray-50 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <Button
                onClick={() => navigate(`/partner/playbooks/${playbookSlug}/execute`)}
                variant="outline"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Steps
              </Button>

              {!completed && (
                <Button
                  onClick={markComplete}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Mark Complete
                </Button>
              )}

              {completed && (
                <Button
                  onClick={() => navigate(`/partner/playbooks/${playbookSlug}/execute`)}
                  className="bg-orange-600 hover:bg-orange-700"
                >
                  Next Step
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { supabase } from '../../lib/supabase';

interface Course {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  slug: string;
  is_public: boolean;
  price_cents: number;
  target_audience: string;
  image_url: string;
}

export default function AdminCourseEditor() {
  const { courseId } = useParams<{ courseId: string }>();
  const [course, setCourse] = useState<Course | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [draft, setDraft] = useState({
    title: '',
    subtitle: '',
    description: '',
    slug: '',
    is_public: false,
    price_cents: 0,
    target_audience: 'merchant',
    image_url: ''
  });

  useEffect(() => {
    let mounted = true;

    async function load() {
      if (!courseId) return;
      setLoading(true);
      setError('');

      try {
        const { data, error } = await supabase
          .from('courses')
          .select('*')
          .eq('id', courseId)
          .single();

        if (error) throw error;
        if (!mounted) return;

        setCourse(data);
        setDraft({
          title: data.title || '',
          subtitle: data.subtitle || '',
          description: data.description || '',
          slug: data.slug || '',
          is_public: !!data.is_public,
          price_cents: data.price_cents || 0,
          target_audience: data.target_audience || 'merchant',
          image_url: data.image_url || ''
        });
      } catch (e: any) {
        if (mounted) setError(e.message || 'Failed to load course');
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();
    return () => { mounted = false; };
  }, [courseId]);

  async function handleSave() {
    if (!courseId) return;

    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const { data, error } = await supabase
        .from('courses')
        .update({
          title: draft.title,
          subtitle: draft.subtitle,
          description: draft.description,
          slug: draft.slug,
          is_public: draft.is_public,
          price_cents: draft.price_cents,
          target_audience: draft.target_audience,
          image_url: draft.image_url
        })
        .eq('id', courseId)
        .select()
        .single();

      if (error) throw error;

      setCourse(data);
      setSuccess('Course updated successfully');
      setTimeout(() => setSuccess(''), 3000);
    } catch (e: any) {
      setError(e.message || 'Failed to save course');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl p-6">
        <div className="rounded-lg border p-6 text-center text-gray-600">
          Loading course...
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="mx-auto max-w-3xl p-6">
        <div className="rounded-lg border p-6">
          <h2 className="font-semibold mb-2">Course not found</h2>
          <Link to="/admin/courses" className="text-sm text-blue-600 hover:text-blue-800 underline">
            Back to courses
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Edit Course</h1>
        <Link
          to="/admin/courses"
          className="text-sm text-gray-600 hover:text-gray-900"
        >
          Back to Courses
        </Link>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">
          {error}
        </div>
      )}

      {success && (
        <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-800">
          {success}
        </div>
      )}

      <div className="rounded-lg border bg-white p-6 space-y-6">
        <div className="space-y-2">
          <label className="block text-sm font-semibold">Title</label>
          <input
            type="text"
            className="w-full rounded-lg border p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={draft.title}
            onChange={(e) => setDraft(d => ({ ...d, title: e.target.value }))}
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-semibold">Subtitle</label>
          <input
            type="text"
            className="w-full rounded-lg border p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={draft.subtitle}
            onChange={(e) => setDraft(d => ({ ...d, subtitle: e.target.value }))}
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-semibold">Description</label>
          <textarea
            className="w-full rounded-lg border p-3 text-sm min-h-[150px] focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={draft.description}
            onChange={(e) => setDraft(d => ({ ...d, description: e.target.value }))}
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-semibold">Slug</label>
          <input
            type="text"
            className="w-full rounded-lg border p-3 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={draft.slug}
            onChange={(e) => setDraft(d => ({ ...d, slug: e.target.value }))}
          />
          <p className="text-xs text-gray-500">URL-friendly identifier (e.g., facebook-monetization-local)</p>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-semibold">Image URL</label>
          <input
            type="text"
            className="w-full rounded-lg border p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={draft.image_url}
            onChange={(e) => setDraft(d => ({ ...d, image_url: e.target.value }))}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-sm font-semibold">Target Audience</label>
            <select
              className="w-full rounded-lg border p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={draft.target_audience}
              onChange={(e) => setDraft(d => ({ ...d, target_audience: e.target.value }))}
            >
              <option value="merchant">Merchant</option>
              <option value="partner">Partner</option>
              <option value="both">Both</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold">Price (cents)</label>
            <input
              type="number"
              className="w-full rounded-lg border p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={draft.price_cents}
              onChange={(e) => setDraft(d => ({ ...d, price_cents: Number(e.target.value) }))}
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="is_public"
            className="w-4 h-4 rounded border-gray-300"
            checked={draft.is_public}
            onChange={(e) => setDraft(d => ({ ...d, is_public: e.target.checked }))}
          />
          <label htmlFor="is_public" className="text-sm font-medium">
            Public (visible to all users)
          </label>
        </div>

        <div className="flex gap-3 pt-4 border-t">
          <button
            onClick={handleSave}
            disabled={saving}
            className="rounded-lg bg-black text-white px-6 py-3 text-sm font-medium disabled:opacity-50 hover:bg-gray-800 transition-colors"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>

          <Link
            to="/admin/courses"
            className="rounded-lg border px-6 py-3 text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            Cancel
          </Link>
        </div>

        <div className="text-xs text-gray-500 pt-4 border-t">
          Note: To edit modules and lessons, use the Academy Modules and Academy Lessons pages.
        </div>
      </div>
    </div>
  );
}

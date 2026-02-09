import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';

interface Course {
  id: string;
  title: string;
  slug: string;
  is_public: boolean;
  price_cents: number;
  target_audience: string;
}

export default function AdminCoursesList() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function load() {
      setLoading(true);
      setError('');

      try {
        const { data, error } = await supabase
          .from('courses')
          .select('id, title, slug, is_public, price_cents, target_audience')
          .order('title');

        if (error) throw error;
        if (mounted) setCourses(data || []);
      } catch (e: any) {
        if (mounted) setError(e.message || 'Failed to load courses');
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();
    return () => { mounted = false; };
  }, []);

  return (
    <div className="mx-auto max-w-6xl p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Course Management</h1>
        <Link
          to="/admin/dashboard"
          className="text-sm text-gray-600 hover:text-gray-900"
        >
          Back to Admin
        </Link>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">
          Error: {error}
        </div>
      )}

      {loading ? (
        <div className="rounded-lg border p-6 text-center text-gray-600">
          Loading courses...
        </div>
      ) : (
        <div className="rounded-lg border overflow-hidden bg-white">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left p-4 font-semibold">Title</th>
                <th className="text-left p-4 font-semibold">Slug</th>
                <th className="text-left p-4 font-semibold">Audience</th>
                <th className="text-left p-4 font-semibold">Public</th>
                <th className="text-left p-4 font-semibold">Price</th>
                <th className="text-right p-4 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {courses.map((course) => (
                <tr key={course.id} className="hover:bg-gray-50">
                  <td className="p-4 font-medium">{course.title}</td>
                  <td className="p-4 text-gray-600 font-mono text-xs">{course.slug}</td>
                  <td className="p-4">
                    <span className="inline-block px-2 py-1 rounded-full bg-blue-100 text-blue-800 text-xs">
                      {course.target_audience || 'all'}
                    </span>
                  </td>
                  <td className="p-4">
                    {course.is_public ? (
                      <span className="text-green-600">Yes</span>
                    ) : (
                      <span className="text-gray-400">No</span>
                    )}
                  </td>
                  <td className="p-4">${((course.price_cents || 0) / 100).toFixed(2)}</td>
                  <td className="p-4 text-right">
                    <Link
                      to={`/admin/courses/${course.id}`}
                      className="text-blue-600 hover:text-blue-800 underline"
                    >
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}
              {courses.length === 0 && (
                <tr>
                  <td className="p-8 text-center text-gray-500" colSpan={6}>
                    No courses found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

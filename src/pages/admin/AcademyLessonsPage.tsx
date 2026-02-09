import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { PlusCircle, Edit2, Trash2, Save, X } from 'lucide-react';

interface Lesson {
  id: string;
  module_id: string;
  title: string;
  content: string | null;
  video_url: string | null;
  order_index: number;
  duration_minutes: number | null;
  is_preview: boolean;
  created_at: string;
}

interface Module {
  id: string;
  title: string;
  course_id: string;
}

interface Course {
  id: string;
  title: string;
  slug: string;
}

export default function AcademyLessonsPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<string>('');
  const [modules, setModules] = useState<Module[]>([]);
  const [selectedModuleId, setSelectedModuleId] = useState<string>('');
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    video_url: '',
    order_index: 1,
    duration_minutes: 0,
    is_preview: false,
  });

  useEffect(() => {
    loadCourses();
  }, []);

  useEffect(() => {
    if (selectedCourseId) {
      loadModules();
    }
  }, [selectedCourseId]);

  useEffect(() => {
    if (selectedModuleId) {
      loadLessons();
    }
  }, [selectedModuleId]);

  async function loadCourses() {
    const { data } = await supabase
      .from('course_products')
      .select('id, title, slug')
      .order('title');

    if (data) {
      setCourses(data);
      if (data.length > 0) {
        setSelectedCourseId(data[0].id);
      }
    }
    setLoading(false);
  }

  async function loadModules() {
    const { data } = await supabase
      .from('course_modules')
      .select('id, title, course_id')
      .eq('course_id', selectedCourseId)
      .order('order_index');

    if (data) {
      setModules(data);
      if (data.length > 0) {
        setSelectedModuleId(data[0].id);
      }
    }
  }

  async function loadLessons() {
    setLoading(true);
    const { data } = await supabase
      .from('course_lessons')
      .select('*')
      .eq('module_id', selectedModuleId)
      .order('order_index');

    if (data) {
      setLessons(data);
    }
    setLoading(false);
  }

  function startCreate() {
    setIsCreating(true);
    setFormData({
      title: '',
      content: '',
      video_url: '',
      order_index: lessons.length + 1,
      duration_minutes: 0,
      is_preview: false,
    });
  }

  function startEdit(lesson: Lesson) {
    setEditingId(lesson.id);
    setFormData({
      title: lesson.title,
      content: lesson.content || '',
      video_url: lesson.video_url || '',
      order_index: lesson.order_index,
      duration_minutes: lesson.duration_minutes || 0,
      is_preview: lesson.is_preview,
    });
  }

  function cancelEdit() {
    setEditingId(null);
    setIsCreating(false);
    setFormData({
      title: '',
      content: '',
      video_url: '',
      order_index: 1,
      duration_minutes: 0,
      is_preview: false,
    });
  }

  async function handleSave() {
    if (!formData.title.trim()) return;

    if (isCreating) {
      const { error } = await supabase
        .from('course_lessons')
        .insert({
          module_id: selectedModuleId,
          title: formData.title,
          content: formData.content || null,
          video_url: formData.video_url || null,
          order_index: formData.order_index,
          duration_minutes: formData.duration_minutes || null,
          is_preview: formData.is_preview,
        });

      if (!error) {
        setIsCreating(false);
        loadLessons();
        cancelEdit();
      }
    } else if (editingId) {
      const { error } = await supabase
        .from('course_lessons')
        .update({
          title: formData.title,
          content: formData.content || null,
          video_url: formData.video_url || null,
          order_index: formData.order_index,
          duration_minutes: formData.duration_minutes || null,
          is_preview: formData.is_preview,
        })
        .eq('id', editingId);

      if (!error) {
        setEditingId(null);
        loadLessons();
        cancelEdit();
      }
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this lesson?')) return;

    const { error } = await supabase
      .from('course_lessons')
      .delete()
      .eq('id', id);

    if (!error) {
      loadLessons();
    }
  }

  if (loading && courses.length === 0) {
    return (
      <div className="p-8">
        <div className="animate-pulse">Loading courses...</div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Academy Lessons</h1>
            <p className="text-gray-600 mt-1">Manage course lessons and content</p>
          </div>
          <button
            onClick={startCreate}
            disabled={!selectedModuleId}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <PlusCircle className="w-5 h-5" />
            Add Lesson
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Course
            </label>
            <select
              value={selectedCourseId}
              onChange={(e) => setSelectedCourseId(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              {courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Module
            </label>
            <select
              value={selectedModuleId}
              onChange={(e) => setSelectedModuleId(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              disabled={modules.length === 0}
            >
              {modules.length === 0 ? (
                <option>No modules available</option>
              ) : (
                modules.map((module) => (
                  <option key={module.id} value={module.id}>
                    {module.title}
                  </option>
                ))
              )}
            </select>
          </div>
        </div>

        {isCreating && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-4 border-2 border-blue-500">
            <h3 className="text-lg font-semibold mb-4">Create New Lesson</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Lesson title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Content (Markdown)
                </label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                  rows={8}
                  placeholder="Lesson content in markdown format"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Video URL (YouTube, Vimeo, etc.)
                </label>
                <input
                  type="text"
                  value={formData.video_url}
                  onChange={(e) => setFormData({ ...formData, video_url: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="https://..."
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Order Index
                  </label>
                  <input
                    type="number"
                    value={formData.order_index}
                    onChange={(e) => setFormData({ ...formData, order_index: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Duration (minutes)
                  </label>
                  <input
                    type="number"
                    value={formData.duration_minutes}
                    onChange={(e) => setFormData({ ...formData, duration_minutes: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex items-end">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.is_preview}
                      onChange={(e) => setFormData({ ...formData, is_preview: e.target.checked })}
                      className="w-4 h-4 text-blue-600"
                    />
                    <span className="text-sm font-medium text-gray-700">Free Preview</span>
                  </label>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleSave}
                  className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                >
                  <Save className="w-4 h-4" />
                  Save
                </button>
                <button
                  onClick={cancelEdit}
                  className="flex items-center gap-2 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300"
                >
                  <X className="w-4 h-4" />
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-4">
          {lessons.map((lesson) => (
            <div
              key={lesson.id}
              className="bg-white rounded-lg shadow-md p-6"
            >
              {editingId === lesson.id ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Title
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Content (Markdown)
                    </label>
                    <textarea
                      value={formData.content}
                      onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                      rows={8}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Video URL
                    </label>
                    <input
                      type="text"
                      value={formData.video_url}
                      onChange={(e) => setFormData({ ...formData, video_url: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Order Index
                      </label>
                      <input
                        type="number"
                        value={formData.order_index}
                        onChange={(e) => setFormData({ ...formData, order_index: parseInt(e.target.value) })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Duration (minutes)
                      </label>
                      <input
                        type="number"
                        value={formData.duration_minutes}
                        onChange={(e) => setFormData({ ...formData, duration_minutes: parseInt(e.target.value) })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div className="flex items-end">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.is_preview}
                          onChange={(e) => setFormData({ ...formData, is_preview: e.target.checked })}
                          className="w-4 h-4 text-blue-600"
                        />
                        <span className="text-sm font-medium text-gray-700">Free Preview</span>
                      </label>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={handleSave}
                      className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                    >
                      <Save className="w-4 h-4" />
                      Save
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="flex items-center gap-2 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300"
                    >
                      <X className="w-4 h-4" />
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-sm font-medium">
                          #{lesson.order_index}
                        </span>
                        {lesson.is_preview && (
                          <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-sm font-medium">
                            FREE PREVIEW
                          </span>
                        )}
                        <h3 className="text-lg font-semibold text-gray-900">
                          {lesson.title}
                        </h3>
                      </div>
                      {lesson.video_url && (
                        <p className="text-sm text-blue-600 mb-2">
                          Video: {lesson.video_url}
                        </p>
                      )}
                      {lesson.content && (
                        <p className="text-gray-600 text-sm line-clamp-2">{lesson.content.substring(0, 200)}...</p>
                      )}
                      {lesson.duration_minutes && (
                        <p className="text-sm text-gray-500 mt-2">
                          Duration: {lesson.duration_minutes} minutes
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => startEdit(lesson)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                      >
                        <Edit2 className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(lesson.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ))}

          {lessons.length === 0 && !loading && selectedModuleId && (
            <div className="text-center py-12 text-gray-500">
              No lessons found. Create your first lesson to get started.
            </div>
          )}

          {!selectedModuleId && (
            <div className="text-center py-12 text-gray-500">
              Select a module to view and manage lessons.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

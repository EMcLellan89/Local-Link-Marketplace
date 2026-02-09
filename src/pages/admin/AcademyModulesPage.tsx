import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { PlusCircle, Edit2, Trash2, Save, X } from 'lucide-react';

interface Module {
  id: string;
  course_id: string;
  title: string;
  description: string | null;
  order_index: number;
  duration_minutes: number | null;
  created_at: string;
}

interface Course {
  id: string;
  title: string;
  slug: string;
}

export default function AcademyModulesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<string>('');
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    order_index: 1,
    duration_minutes: 0,
  });

  useEffect(() => {
    loadCourses();
  }, []);

  useEffect(() => {
    if (selectedCourseId) {
      loadModules();
    }
  }, [selectedCourseId]);

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
    setLoading(true);
    const { data } = await supabase
      .from('course_modules')
      .select('*')
      .eq('course_id', selectedCourseId)
      .order('order_index');

    if (data) {
      setModules(data);
    }
    setLoading(false);
  }

  function startCreate() {
    setIsCreating(true);
    setFormData({
      title: '',
      description: '',
      order_index: modules.length + 1,
      duration_minutes: 0,
    });
  }

  function startEdit(module: Module) {
    setEditingId(module.id);
    setFormData({
      title: module.title,
      description: module.description || '',
      order_index: module.order_index,
      duration_minutes: module.duration_minutes || 0,
    });
  }

  function cancelEdit() {
    setEditingId(null);
    setIsCreating(false);
    setFormData({
      title: '',
      description: '',
      order_index: 1,
      duration_minutes: 0,
    });
  }

  async function handleSave() {
    if (!formData.title.trim()) return;

    if (isCreating) {
      const { error } = await supabase
        .from('course_modules')
        .insert({
          course_id: selectedCourseId,
          title: formData.title,
          description: formData.description || null,
          order_index: formData.order_index,
          duration_minutes: formData.duration_minutes || null,
        });

      if (!error) {
        setIsCreating(false);
        loadModules();
        cancelEdit();
      }
    } else if (editingId) {
      const { error } = await supabase
        .from('course_modules')
        .update({
          title: formData.title,
          description: formData.description || null,
          order_index: formData.order_index,
          duration_minutes: formData.duration_minutes || null,
        })
        .eq('id', editingId);

      if (!error) {
        setEditingId(null);
        loadModules();
        cancelEdit();
      }
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this module? All lessons in this module will also be deleted.')) return;

    const { error } = await supabase
      .from('course_modules')
      .delete()
      .eq('id', id);

    if (!error) {
      loadModules();
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
            <h1 className="text-3xl font-bold text-gray-900">Academy Modules</h1>
            <p className="text-gray-600 mt-1">Manage course modules and structure</p>
          </div>
          <button
            onClick={startCreate}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            <PlusCircle className="w-5 h-5" />
            Add Module
          </button>
        </div>

        <div className="mb-6">
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

        {isCreating && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-4 border-2 border-blue-500">
            <h3 className="text-lg font-semibold mb-4">Create New Module</h3>
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
                  placeholder="Module title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="Module description"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
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
          {modules.map((module) => (
            <div
              key={module.id}
              className="bg-white rounded-lg shadow-md p-6"
            >
              {editingId === module.id ? (
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
                      Description
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      rows={3}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
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
                          #{module.order_index}
                        </span>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {module.title}
                        </h3>
                      </div>
                      {module.description && (
                        <p className="text-gray-600">{module.description}</p>
                      )}
                      {module.duration_minutes && (
                        <p className="text-sm text-gray-500 mt-2">
                          Duration: {module.duration_minutes} minutes
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => startEdit(module)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                      >
                        <Edit2 className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(module.id)}
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

          {modules.length === 0 && !loading && (
            <div className="text-center py-12 text-gray-500">
              No modules found. Create your first module to get started.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

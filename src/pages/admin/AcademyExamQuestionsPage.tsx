import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { PlusCircle, Edit2, Trash2, Save, X, Copy } from 'lucide-react';

interface ExamQuestion {
  id: string;
  course_id: string;
  question_text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_answer: string;
  explanation: string | null;
  difficulty: string;
  created_at: string;
}

interface Course {
  id: string;
  title: string;
  slug: string;
}

export default function AcademyExamQuestionsPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<string>('');
  const [questions, setQuestions] = useState<ExamQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    question_text: '',
    option_a: '',
    option_b: '',
    option_c: '',
    option_d: '',
    correct_answer: 'a',
    explanation: '',
    difficulty: 'medium',
  });

  useEffect(() => {
    loadCourses();
  }, []);

  useEffect(() => {
    if (selectedCourseId) {
      loadQuestions();
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

  async function loadQuestions() {
    setLoading(true);
    const { data } = await supabase
      .from('course_exam_questions')
      .select('*')
      .eq('course_id', selectedCourseId)
      .order('created_at', { ascending: false });

    if (data) {
      setQuestions(data);
    }
    setLoading(false);
  }

  function startCreate() {
    setIsCreating(true);
    setFormData({
      question_text: '',
      option_a: '',
      option_b: '',
      option_c: '',
      option_d: '',
      correct_answer: 'a',
      explanation: '',
      difficulty: 'medium',
    });
  }

  function startEdit(question: ExamQuestion) {
    setEditingId(question.id);
    setFormData({
      question_text: question.question_text,
      option_a: question.option_a,
      option_b: question.option_b,
      option_c: question.option_c,
      option_d: question.option_d,
      correct_answer: question.correct_answer,
      explanation: question.explanation || '',
      difficulty: question.difficulty,
    });
  }

  async function duplicateQuestion(question: ExamQuestion) {
    const { error } = await supabase
      .from('course_exam_questions')
      .insert({
        course_id: selectedCourseId,
        question_text: question.question_text + ' (Copy)',
        option_a: question.option_a,
        option_b: question.option_b,
        option_c: question.option_c,
        option_d: question.option_d,
        correct_answer: question.correct_answer,
        explanation: question.explanation,
        difficulty: question.difficulty,
      });

    if (!error) {
      loadQuestions();
    }
  }

  function cancelEdit() {
    setEditingId(null);
    setIsCreating(false);
    setFormData({
      question_text: '',
      option_a: '',
      option_b: '',
      option_c: '',
      option_d: '',
      correct_answer: 'a',
      explanation: '',
      difficulty: 'medium',
    });
  }

  async function handleSave() {
    if (!formData.question_text.trim() || !formData.option_a.trim() || !formData.option_b.trim()) {
      alert('Please fill in at least the question and first two options');
      return;
    }

    if (isCreating) {
      const { error } = await supabase
        .from('course_exam_questions')
        .insert({
          course_id: selectedCourseId,
          question_text: formData.question_text,
          option_a: formData.option_a,
          option_b: formData.option_b,
          option_c: formData.option_c,
          option_d: formData.option_d,
          correct_answer: formData.correct_answer,
          explanation: formData.explanation || null,
          difficulty: formData.difficulty,
        });

      if (!error) {
        setIsCreating(false);
        loadQuestions();
        cancelEdit();
      }
    } else if (editingId) {
      const { error } = await supabase
        .from('course_exam_questions')
        .update({
          question_text: formData.question_text,
          option_a: formData.option_a,
          option_b: formData.option_b,
          option_c: formData.option_c,
          option_d: formData.option_d,
          correct_answer: formData.correct_answer,
          explanation: formData.explanation || null,
          difficulty: formData.difficulty,
        })
        .eq('id', editingId);

      if (!error) {
        setEditingId(null);
        loadQuestions();
        cancelEdit();
      }
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this exam question?')) return;

    const { error } = await supabase
      .from('course_exam_questions')
      .delete()
      .eq('id', id);

    if (!error) {
      loadQuestions();
    }
  }

  const QuestionForm = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Question Text
        </label>
        <textarea
          value={formData.question_text}
          onChange={(e) => setFormData({ ...formData, question_text: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          rows={3}
          placeholder="Enter the question"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Option A
          </label>
          <input
            type="text"
            value={formData.option_a}
            onChange={(e) => setFormData({ ...formData, option_a: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="First answer option"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Option B
          </label>
          <input
            type="text"
            value={formData.option_b}
            onChange={(e) => setFormData({ ...formData, option_b: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="Second answer option"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Option C
          </label>
          <input
            type="text"
            value={formData.option_c}
            onChange={(e) => setFormData({ ...formData, option_c: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="Third answer option (optional)"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Option D
          </label>
          <input
            type="text"
            value={formData.option_d}
            onChange={(e) => setFormData({ ...formData, option_d: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="Fourth answer option (optional)"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Correct Answer
          </label>
          <select
            value={formData.correct_answer}
            onChange={(e) => setFormData({ ...formData, correct_answer: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="a">A</option>
            <option value="b">B</option>
            <option value="c">C</option>
            <option value="d">D</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Difficulty
          </label>
          <select
            value={formData.difficulty}
            onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Explanation (Optional)
        </label>
        <textarea
          value={formData.explanation}
          onChange={(e) => setFormData({ ...formData, explanation: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          rows={2}
          placeholder="Explain why this answer is correct"
        />
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
  );

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
            <h1 className="text-3xl font-bold text-gray-900">Exam Questions</h1>
            <p className="text-gray-600 mt-1">Manage certification exam questions</p>
          </div>
          <button
            onClick={startCreate}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            <PlusCircle className="w-5 h-5" />
            Add Question
          </button>
        </div>

        <div className="mb-6 flex items-center justify-between">
          <div className="flex-1 max-w-md">
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
          <div className="text-right">
            <p className="text-sm text-gray-600">Total Questions</p>
            <p className="text-3xl font-bold text-gray-900">{questions.length}</p>
          </div>
        </div>

        {isCreating && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-4 border-2 border-blue-500">
            <h3 className="text-lg font-semibold mb-4">Create New Question</h3>
            <QuestionForm />
          </div>
        )}

        <div className="space-y-4">
          {questions.map((question, index) => (
            <div
              key={question.id}
              className="bg-white rounded-lg shadow-md p-6"
            >
              {editingId === question.id ? (
                <QuestionForm />
              ) : (
                <>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-sm font-medium">
                          #{index + 1}
                        </span>
                        <span className={`px-2 py-1 rounded text-sm font-medium ${
                          question.difficulty === 'easy' ? 'bg-green-100 text-green-700' :
                          question.difficulty === 'hard' ? 'bg-red-100 text-red-700' :
                          'bg-yellow-100 text-yellow-700'
                        }`}>
                          {question.difficulty.toUpperCase()}
                        </span>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">
                        {question.question_text}
                      </h3>
                      <div className="grid grid-cols-2 gap-2 mb-3">
                        <div className={`p-2 rounded ${question.correct_answer === 'a' ? 'bg-green-50 border-2 border-green-500' : 'bg-gray-50'}`}>
                          <span className="font-medium">A:</span> {question.option_a}
                        </div>
                        <div className={`p-2 rounded ${question.correct_answer === 'b' ? 'bg-green-50 border-2 border-green-500' : 'bg-gray-50'}`}>
                          <span className="font-medium">B:</span> {question.option_b}
                        </div>
                        {question.option_c && (
                          <div className={`p-2 rounded ${question.correct_answer === 'c' ? 'bg-green-50 border-2 border-green-500' : 'bg-gray-50'}`}>
                            <span className="font-medium">C:</span> {question.option_c}
                          </div>
                        )}
                        {question.option_d && (
                          <div className={`p-2 rounded ${question.correct_answer === 'd' ? 'bg-green-50 border-2 border-green-500' : 'bg-gray-50'}`}>
                            <span className="font-medium">D:</span> {question.option_d}
                          </div>
                        )}
                      </div>
                      {question.explanation && (
                        <div className="bg-blue-50 border-l-4 border-blue-500 p-3 text-sm text-gray-700">
                          <span className="font-medium">Explanation:</span> {question.explanation}
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => duplicateQuestion(question)}
                        className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg"
                        title="Duplicate"
                      >
                        <Copy className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => startEdit(question)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                      >
                        <Edit2 className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(question.id)}
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

          {questions.length === 0 && !loading && (
            <div className="text-center py-12 text-gray-500">
              No questions found. Create your first exam question to get started.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

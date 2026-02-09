import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Award, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { SEO } from '../../components/SEO';
import Button from '../../components/ui/Button';
import BackButton from '../../components/ui/BackButton';

const DEV_MODE = import.meta.env.VITE_DEV_MODE === 'true';

interface Question {
  id: string;
  question_index: number;
  question_text: string;
  question_type: string;
  options: Array<{ id: string; text: string }>;
  explanation: string;
}

interface ExamResult {
  score: number;
  passed: boolean;
  certificateCode?: string;
  message: string;
}

export default function CourseExamPage() {
  const { courseSlug } = useParams<{ courseSlug: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<ExamResult | null>(null);
  const [courseTitle, setCourseTitle] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    loadExam();
  }, [user, courseSlug]);

  async function loadExam() {
    if (DEV_MODE) {
      loadDevModeExam();
      return;
    }

    try {
      const { data: courseData } = await supabase
        .from('courses')
        .select('id, title')
        .eq('slug', courseSlug)
        .single();

      if (!courseData) {
        navigate('/');
        return;
      }

      setCourseTitle(courseData.title);

      const { data: questionsData } = await supabase
        .from('course_exam_questions')
        .select('*')
        .eq('course_id', courseData.id)
        .order('question_index');

      setQuestions(questionsData || []);
    } catch (err) {
      console.error('Error loading exam:', err);
    } finally {
      setLoading(false);
    }
  }

  function loadDevModeExam() {
    const courseTitles: Record<string, string> = {
      'pet-businesses-first': 'Pet Businesses That Get Found First™',
      'ugc-from-home': 'UGC From Home™',
      'default': 'Online Sales Without Ads™'
    };
    setCourseTitle(courseTitles[courseSlug!] || courseTitles.default);

    const mockQuestions: Question[] = [
      {
        id: 'q1',
        question_index: 1,
        question_text: 'What is the main focus of this course?',
        question_type: 'mcq',
        options: [
          { id: 'A', text: 'Building a large following' },
          { id: 'B', text: 'Creating content for brands' },
          { id: 'C', text: 'Running paid ads' },
          { id: 'D', text: 'Social media growth' },
        ],
        explanation: 'The course focuses on creating content for brands, not building a personal following.',
      },
      {
        id: 'q2',
        question_index: 2,
        question_text: 'Which is most important for success?',
        question_type: 'mcq',
        options: [
          { id: 'A', text: 'Expensive equipment' },
          { id: 'B', text: 'Consistent outreach and quality' },
          { id: 'C', text: 'Having millions of followers' },
          { id: 'D', text: 'Working 12 hours a day' },
        ],
        explanation: 'Consistent outreach and maintaining quality are key to success.',
      },
    ];

    setQuestions(mockQuestions);
    setLoading(false);
  }

  function handleAnswerChange(questionId: string, optionId: string) {
    setAnswers({ ...answers, [questionId]: optionId });
  }

  async function handleSubmit() {
    const unanswered = questions.filter(q => !answers[q.id]);
    if (unanswered.length > 0) {
      alert(`Please answer all questions (${unanswered.length} remaining)`);
      return;
    }

    setSubmitting(true);

    if (DEV_MODE) {
      setTimeout(() => {
        setResult({
          score: 100,
          passed: true,
          certificateCode: 'DEV-CERT-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
          message: 'Congratulations! You passed and earned your certificate!',
        });
        setSubmitting(false);
      }, 1500);
      return;
    }

    try {
      const { data: { session } } = await supabase.auth.getSession();

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/submit-exam`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${session?.access_token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            courseSlug,
            answers,
          }),
        }
      );

      const data = await response.json();
      setResult(data);
    } catch (err) {
      console.error('Error submitting exam:', err);
      alert('Failed to submit exam. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="mb-4">
          <BackButton />
        </div>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading exam...</p>
        </div>
      </div>
    );
  }

  if (result) {
    return (
      <>
        <SEO title={`Exam Results - ${courseTitle}`} />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full p-8">
            <div className="text-center">
              <div
                className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 ${
                  result.passed ? 'bg-green-100' : 'bg-red-100'
                }`}
              >
                {result.passed ? (
                  <CheckCircle className="h-12 w-12 text-green-600" />
                ) : (
                  <XCircle className="h-12 w-12 text-red-600" />
                )}
              </div>

              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                {result.passed ? 'Congratulations!' : 'Not Quite There'}
              </h1>

              <p className="text-xl text-gray-600 mb-6">
                You scored {result.score}%
              </p>

              <div className={`p-4 rounded-lg mb-8 ${result.passed ? 'bg-green-50' : 'bg-yellow-50'}`}>
                <p className={`${result.passed ? 'text-green-800' : 'text-yellow-800'}`}>
                  {result.message}
                </p>
              </div>

              <div className="flex gap-4 justify-center">
                <Button
                  onClick={() => navigate(`/learn/${courseSlug}`)}
                  variant="outline"
                >
                  Back to Course
                </Button>

                {result.certificateCode && (
                  <Button
                    onClick={() => navigate(`/certificate/${result.certificateCode}`)}
                    className="flex items-center gap-2"
                  >
                    <Award className="h-5 w-5" />
                    View Certificate
                  </Button>
                )}

                {!result.passed && (
                  <Button onClick={() => window.location.reload()}>
                    Retake Exam
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <SEO title={`Certification Exam - ${courseTitle}`} />

      <div className="min-h-screen bg-gray-50">
        <div className="bg-gradient-to-r from-blue-600 to-green-600 text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold mb-2">Certification Exam</h1>
            <p className="text-blue-100">{courseTitle}</p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-6 w-6 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-blue-900 mb-2">Exam Requirements</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• You need 80% or higher to pass</li>
                  <li>• Answer all questions before submitting</li>
                  <li>• Complete all lessons to receive your certificate</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            {questions.map((question, index) => (
              <div key={question.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-start gap-4 mb-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                    {index + 1}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 flex-1">
                    {question.question_text}
                  </h3>
                </div>

                <div className="ml-12 space-y-3">
                  {question.options.map((option) => (
                    <label
                      key={option.id}
                      className={`flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                        answers[question.id] === option.id
                          ? 'border-blue-600 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name={question.id}
                        value={option.id}
                        checked={answers[question.id] === option.id}
                        onChange={() => handleAnswerChange(question.id, option.id)}
                        className="w-5 h-5 text-blue-600"
                      />
                      <span className="text-gray-900">{option.text}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">
                  Questions answered: {Object.keys(answers).length} / {questions.length}
                </p>
              </div>
              <div className="flex gap-4">
                <Button
                  onClick={() => navigate(`/learn/${courseSlug}`)}
                  variant="outline"
                >
                  Back to Course
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={submitting || Object.keys(answers).length !== questions.length}
                  className="px-8"
                >
                  {submitting ? 'Submitting...' : 'Submit Exam'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

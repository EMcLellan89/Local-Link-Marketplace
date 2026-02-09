import { useEffect, useState } from 'react';
import { Star, MessageSquare, CheckCircle, XCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import BusinessHubLayout from '../../components/layout/BusinessHubLayout';
import Card, { CardBody, CardHeader } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import BackButton from '../components/ui/BackButton';

interface Review {
  id: string;
  rating: number;
  title: string;
  comment: string;
  is_verified_purchase: boolean;
  status: string;
  created_at: string;
  customer: {
    user_id: string;
  };
  profiles: {
    full_name: string;
  };
  deal: {
    title: string;
  } | null;
  review_responses: Array<{
    id: string;
    response_text: string;
    created_at: string;
  }>;
}

export default function ReviewsPage() {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'approved'>('all');
  const [respondingTo, setRespondingTo] = useState<string | null>(null);
  const [responseText, setResponseText] = useState('');
  const [averageRating, setAverageRating] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchReviews();
    }
  }, [user, activeTab]);

  const fetchReviews = async () => {
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      const { data: merchantData, error: merchantError } = await supabase
        .from('merchants')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (merchantError) throw merchantError;

      if (!merchantData) {
        setLoading(false);
        return;
      }

      let query = supabase
        .from('reviews')
        .select(`
          id,
          rating,
          title,
          comment,
          is_verified_purchase,
          status,
          created_at,
          customer:customers!inner (
            user_id
          ),
          deal:deals (
            title
          ),
          review_responses (
            id,
            response_text,
            created_at
          )
        `)
        .eq('merchant_id', merchantData.id)
        .order('created_at', { ascending: false });

      if (activeTab !== 'all') {
        query = query.eq('status', activeTab);
      }

      const { data, error: reviewsError } = await query;

      if (reviewsError) throw reviewsError;

      if (data) {
        const reviewsWithProfiles = await Promise.all(
          data.map(async (review: any) => {
            try {
              const { data: profileData, error: profileError } = await supabase
                .from('profiles')
                .select('full_name')
                .eq('user_id', review.customer.user_id)
                .maybeSingle();

              if (profileError) throw profileError;

              return {
                ...review,
                profiles: profileData || { full_name: 'Anonymous' }
              };
            } catch (error) {
              console.error('Error fetching profile:', error);
              return {
                ...review,
                profiles: { full_name: 'Anonymous' }
              };
            }
          })
        );

        setReviews(reviewsWithProfiles as Review[]);

        const approvedReviews = reviewsWithProfiles.filter((r: any) => r.status === 'approved');
        if (approvedReviews.length > 0) {
          const avg = approvedReviews.reduce((sum, r: any) => sum + r.rating, 0) / approvedReviews.length;
          setAverageRating(Math.round(avg * 10) / 10);
        }
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
      setError('Failed to load reviews. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const approveReview = async (reviewId: string) => {
    try {
      const { error } = await supabase
        .from('reviews')
        .update({ status: 'approved' })
        .eq('id', reviewId);

      if (error) throw error;

      fetchReviews();
    } catch (error) {
      console.error('Error approving review:', error);
      alert('Failed to approve review. Please try again.');
    }
  };

  const rejectReview = async (reviewId: string) => {
    try {
      const { error } = await supabase
        .from('reviews')
        .update({ status: 'rejected' })
        .eq('id', reviewId);

      if (error) throw error;

      fetchReviews();
    } catch (error) {
      console.error('Error rejecting review:', error);
      alert('Failed to reject review. Please try again.');
    }
  };

  const submitResponse = async (reviewId: string) => {
    if (!user || !responseText.trim()) return;

    try {
      const { data: merchantData, error: merchantError } = await supabase
        .from('merchants')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (merchantError) throw merchantError;

      if (!merchantData) return;

      const { error } = await supabase.from('review_responses').insert({
        review_id: reviewId,
        merchant_id: merchantData.id,
        response_text: responseText,
      });

      if (error) throw error;

      setRespondingTo(null);
      setResponseText('');
      fetchReviews();
    } catch (error) {
      console.error('Error submitting response:', error);
      alert('Failed to submit response. Please try again.');
    }
  };

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`w-5 h-5 ${
          i < rating ? 'text-yellow-400 fill-current' : 'text-slate-300'
        }`}
      />
    ));
  };

  if (loading) {
    return (
      <BusinessHubLayout>
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#2BB673]"></div>
          <p className="mt-4 text-slate-600">Loading reviews...</p>
        </div>
      </BusinessHubLayout>
    );
  }

  return (
    <BusinessHubLayout>
      <div className="max-w-5xl mx-auto space-y-6">
        {error && (
          <Card variant="bordered" className="border-red-300 bg-red-50">
            <CardBody>
              <div className="flex items-start justify-between">
                <p className="text-red-800 font-medium">{error}</p>
                <Button variant="ghost" size="sm" onClick={() => setError(null)}>
                  Dismiss
                </Button>
              </div>
              <Button variant="outline" onClick={fetchReviews} className="mt-3">
                Try Again
              </Button>
            </CardBody>
          </Card>
        )}

        <Card variant="elevated">
          <CardHeader>
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-slate-900">Customer Reviews</h1>
              <p className="text-slate-600 mt-2">Manage and respond to customer feedback</p>
            </div>
          </CardHeader>
          <CardBody>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-gradient-to-br from-[#2BB673] to-[#25a062] rounded-lg p-6 text-white">
                <p className="text-sm opacity-90 mb-1">Average Rating</p>
                <div className="flex items-center gap-2">
                  <p className="text-4xl font-bold">{averageRating.toFixed(1)}</p>
                  <Star className="w-8 h-8 fill-current" />
                </div>
              </div>
              <div className="bg-slate-50 rounded-lg p-6">
                <p className="text-sm text-slate-600 mb-1">Total Reviews</p>
                <p className="text-4xl font-bold text-slate-900">{reviews.length}</p>
              </div>
              <div className="bg-slate-50 rounded-lg p-6">
                <p className="text-sm text-slate-600 mb-1">Pending Review</p>
                <p className="text-4xl font-bold text-[#F5B82E]">
                  {reviews.filter(r => r.status === 'pending').length}
                </p>
              </div>
            </div>

            <div className="flex gap-2 border-b border-slate-200 mb-6">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-4 py-2 font-medium transition-colors ${
                  activeTab === 'all'
                    ? 'text-[#2BB673] border-b-2 border-[#2BB673]'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All Reviews
              </button>
              <button
                onClick={() => setActiveTab('pending')}
                className={`px-4 py-2 font-medium transition-colors ${
                  activeTab === 'pending'
                    ? 'text-[#2BB673] border-b-2 border-[#2BB673]'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Pending
              </button>
              <button
                onClick={() => setActiveTab('approved')}
                className={`px-4 py-2 font-medium transition-colors ${
                  activeTab === 'approved'
                    ? 'text-[#2BB673] border-b-2 border-[#2BB673]'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Approved
              </button>
            </div>

            {reviews.length === 0 ? (
              <div className="text-center py-12">
                <MessageSquare className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-slate-900 mb-2">No reviews yet</h3>
                <p className="text-slate-600">Reviews from customers will appear here</p>
              </div>
            ) : (
              <div className="space-y-6">
                {reviews.map((review) => (
                  <div
                    key={review.id}
                    className="border border-slate-200 rounded-lg p-6"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-medium text-slate-900">
                            {review.profiles.full_name}
                          </span>
                          {review.is_verified_purchase && (
                            <span className="text-xs bg-[#2BB673] text-white px-2 py-0.5 rounded">
                              Verified Purchase
                            </span>
                          )}
                          <span
                            className={`text-xs px-2 py-0.5 rounded ${
                              review.status === 'approved'
                                ? 'bg-green-100 text-green-800'
                                : review.status === 'pending'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {review.status}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mb-2">
                          <div className="flex">{renderStars(review.rating)}</div>
                          <span className="text-sm text-slate-500">
                            {new Date(review.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        {review.deal && (
                          <p className="text-sm text-slate-600 mb-2">
                            Deal: {review.deal.title}
                          </p>
                        )}
                      </div>
                      {review.status === 'pending' && (
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => approveReview(review.id)}
                          >
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => rejectReview(review.id)}
                          >
                            <XCircle className="w-4 h-4 text-red-600" />
                          </Button>
                        </div>
                      )}
                    </div>

                    {review.title && (
                      <h4 className="font-medium text-slate-900 mb-2">{review.title}</h4>
                    )}
                    <p className="text-slate-700 mb-4">{review.comment}</p>

                    {review.review_responses.length > 0 ? (
                      <div className="bg-slate-50 rounded-lg p-4 ml-6">
                        <p className="text-sm font-medium text-slate-900 mb-2">Your Response</p>
                        <p className="text-slate-700">{review.review_responses[0].response_text}</p>
                        <p className="text-xs text-slate-500 mt-2">
                          {new Date(review.review_responses[0].created_at).toLocaleDateString()}
                        </p>
                      </div>
                    ) : (
                      <div className="ml-6">
                        {respondingTo === review.id ? (
                          <div className="space-y-3">
                            <textarea
                              value={responseText}
                              onChange={(e) => setResponseText(e.target.value)}
                              placeholder="Write your response..."
                              className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#2BB673] focus:border-transparent"
                              rows={3}
                            />
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                onClick={() => submitResponse(review.id)}
                              >
                                Submit Response
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setRespondingTo(null);
                                  setResponseText('');
                                }}
                              >
                                Cancel
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setRespondingTo(review.id)}
                          >
                            <MessageSquare className="w-4 h-4 mr-2" />
                            Respond to Review
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardBody>
        </Card>
      </div>
    </BusinessHubLayout>
  );
}

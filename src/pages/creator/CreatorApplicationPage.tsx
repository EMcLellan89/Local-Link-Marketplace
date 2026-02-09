import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../../components/ui/Button';
import Card, { CardBody } from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import BackButton from '../../components/ui/BackButton';
import { Video, DollarSign, Users, TrendingUp, CheckCircle } from 'lucide-react';

export default function CreatorApplicationPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    display_name: '',
    bio: '',
    portfolio_url: '',
    industries: [] as string[],
    sample_video_url_1: '',
    sample_video_url_2: '',
    sample_video_url_3: ''
  });

  const industryOptions = [
    'Restaurant', 'Salon/Beauty', 'Fitness', 'Real Estate',
    'Healthcare', 'Professional Services', 'Retail', 'E-commerce',
    'Home Services', 'Auto Services', 'Technology', 'Education'
  ];

  const handleIndustryToggle = (industry: string) => {
    setFormData(prev => ({
      ...prev,
      industries: prev.industries.includes(industry)
        ? prev.industries.filter(i => i !== industry)
        : [...prev.industries, industry]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert('Please log in to apply');
      navigate('/login');
      return;
    }

    setLoading(true);

    try {
      const sampleVideoUrls = [
        formData.sample_video_url_1,
        formData.sample_video_url_2,
        formData.sample_video_url_3
      ].filter(url => url.trim() !== '');

      const { error } = await supabase
        .from('ugc_creators')
        .insert({
          user_id: user.id,
          display_name: formData.display_name,
          bio: formData.bio,
          portfolio_url: formData.portfolio_url,
          industries: formData.industries,
          sample_video_urls: sampleVideoUrls,
          status: 'pending'
        });

      if (error) throw error;

      setSubmitted(true);
    } catch (error: any) {
      if (error.code === '23505') {
        alert('You have already submitted an application.');
      } else {
        alert('Error: ' + error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        <div className="mb-4">
          <BackButton />
        </div>
        <div className="max-w-3xl mx-auto px-4 py-16">
          <Card>
            <CardBody>
              <div className="text-center py-12">
                <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Application Submitted!</h2>
                <p className="text-slate-600 mb-6">
                  Thank you for applying to the LocalLink UGC Network. Our team will review your application and get back to you within 2-3 business days.
                </p>
                <Button onClick={() => navigate('/login')}>
                  Go to Dashboard
                </Button>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-5xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">
            Join the LocalLink UGC Network
          </h1>
          <p className="text-xl text-slate-600">
            Create content for local businesses and earn predictable income
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-6 mb-12">
          <Card>
            <CardBody>
              <DollarSign className="w-8 h-8 text-green-600 mb-2" />
              <h3 className="font-semibold text-slate-900">$75-$200</h3>
              <p className="text-sm text-slate-600">per video</p>
            </CardBody>
          </Card>
          <Card>
            <CardBody>
              <Video className="w-8 h-8 text-blue-600 mb-2" />
              <h3 className="font-semibold text-slate-900">Simple Content</h3>
              <p className="text-sm text-slate-600">15-30 second videos</p>
            </CardBody>
          </Card>
          <Card>
            <CardBody>
              <Users className="w-8 h-8 text-violet-600 mb-2" />
              <h3 className="font-semibold text-slate-900">Your Choice</h3>
              <p className="text-sm text-slate-600">Pick industries you like</p>
            </CardBody>
          </Card>
          <Card>
            <CardBody>
              <TrendingUp className="w-8 h-8 text-orange-600 mb-2" />
              <h3 className="font-semibold text-slate-900">Steady Work</h3>
              <p className="text-sm text-slate-600">Weekly opportunities</p>
            </CardBody>
          </Card>
        </div>

        <form onSubmit={handleSubmit}>
          <Card>
            <CardBody>
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 mb-4">Creator Profile</h2>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Display Name *
                      </label>
                      <Input
                        required
                        placeholder="How you want to be known"
                        value={formData.display_name}
                        onChange={(e) => setFormData({...formData, display_name: e.target.value})}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Bio *
                      </label>
                      <textarea
                        required
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        rows={4}
                        placeholder="Tell us about yourself and your content creation experience"
                        value={formData.bio}
                        onChange={(e) => setFormData({...formData, bio: e.target.value})}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Portfolio URL (optional)
                      </label>
                      <Input
                        type="url"
                        placeholder="Instagram, TikTok, or portfolio link"
                        value={formData.portfolio_url}
                        onChange={(e) => setFormData({...formData, portfolio_url: e.target.value})}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-3">Industries You're Interested In *</h3>
                  <p className="text-sm text-slate-600 mb-3">Select at least 2 industries</p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {industryOptions.map((industry) => (
                      <button
                        key={industry}
                        type="button"
                        onClick={() => handleIndustryToggle(industry)}
                        className={`px-4 py-2 rounded-lg border-2 text-sm font-medium transition-colors ${
                          formData.industries.includes(industry)
                            ? 'border-blue-600 bg-blue-50 text-blue-700'
                            : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                        }`}
                      >
                        {industry}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-3">Sample Videos *</h3>
                  <p className="text-sm text-slate-600 mb-3">
                    Provide at least 2 links to videos you've created (YouTube, Instagram, TikTok, etc.)
                  </p>
                  <div className="space-y-3">
                    <Input
                      type="url"
                      required
                      placeholder="https://... (Sample Video #1)"
                      value={formData.sample_video_url_1}
                      onChange={(e) => setFormData({...formData, sample_video_url_1: e.target.value})}
                    />
                    <Input
                      type="url"
                      required
                      placeholder="https://... (Sample Video #2)"
                      value={formData.sample_video_url_2}
                      onChange={(e) => setFormData({...formData, sample_video_url_2: e.target.value})}
                    />
                    <Input
                      type="url"
                      placeholder="https://... (Sample Video #3 - optional)"
                      value={formData.sample_video_url_3}
                      onChange={(e) => setFormData({...formData, sample_video_url_3: e.target.value})}
                    />
                  </div>
                </div>

                <div className="pt-6 border-t">
                  <Button
                    type="submit"
                    disabled={loading || formData.industries.length < 2}
                    className="w-full"
                  >
                    {loading ? 'Submitting...' : 'Submit Application'}
                  </Button>
                  {formData.industries.length < 2 && (
                    <p className="text-sm text-red-600 mt-2 text-center">
                      Please select at least 2 industries
                    </p>
                  )}
                </div>
              </div>
            </CardBody>
          </Card>
        </form>
      </div>
    </div>
  );
}
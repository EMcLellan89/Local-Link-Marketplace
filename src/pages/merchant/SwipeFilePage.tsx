import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Download, Star, CheckCircle } from 'lucide-react';
import BusinessHubLayout from '../../components/layout/BusinessHubLayout';
import Card, { CardBody, CardHeader } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import BackButton from '../components/ui/BackButton';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

export default function SwipeFilePage() {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const [hasAccess, setHasAccess] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (profile) {
      checkAccess();
    }
  }, [profile]);

  const checkAccess = async () => {
    if (!profile) return;

    try {
      const { data } = await supabase
        .from('swipe_file_access')
        .select('*')
        .eq('merchant_id', profile.id)
        .maybeSingle();

      setHasAccess(!!data);
    } catch (error) {
      console.error('Error checking access:', error);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { name: 'Facebook Ads', count: '24', route: '/merchant/swipe-file/templates?category=Facebook Ads' },
    { name: 'Instagram Ads', count: '12', route: '/merchant/swipe-file/templates?category=Instagram Ads' },
    { name: 'Google Ads', count: '7', route: '/merchant/swipe-file/templates?category=Google Ads' },
    { name: 'Landing Pages', count: '20', route: '/merchant/swipe-file/templates?category=Landing Pages' },
    { name: 'Email Scripts', count: '9', route: '/merchant/swipe-file/templates?category=Email Scripts' },
    { name: 'Sales Scripts', count: '8', route: '/merchant/swipe-file/templates?category=Sales Scripts' },
    { name: 'Phone Scripts', count: '7', route: '/merchant/swipe-file/templates?category=Phone Scripts' },
    { name: 'Social Media Posts', count: '10', route: '/merchant/swipe-file/templates?category=Social Media Posts' },
    { name: 'Deal Ideas', count: '8', route: '/merchant/swipe-file/templates?category=Deal Ideas' }
  ];

  return (
    <BusinessHubLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Ad Swipe File Library</h1>
          <p className="text-slate-600 mt-2">
            1,000+ proven marketing assets from successful local businesses
          </p>
        </div>

        {!loading && (
          <Card variant="bordered" className={hasAccess ? "bg-gradient-to-br from-green-50 to-emerald-50" : "bg-gradient-to-br from-purple-50 to-pink-50"}>
            <CardBody>
              <div className="flex items-center justify-between">
                <div className="flex items-start flex-1">
                  <div className="flex-shrink-0">
                    <div className={`w-12 h-12 ${hasAccess ? 'bg-green-100' : 'bg-purple-100'} rounded-lg flex items-center justify-center`}>
                      {hasAccess ? (
                        <CheckCircle className="w-6 h-6 text-green-600" />
                      ) : (
                        <FileText className="w-6 h-6 text-purple-600" />
                      )}
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-bold text-slate-900 mb-1">
                      {hasAccess ? 'Full Access Unlocked' : 'Unlock Full Access'}
                    </h3>
                    <p className="text-slate-600 mb-3">
                      {hasAccess
                        ? 'You have lifetime access to all templates, scripts, and marketing materials'
                        : 'Get lifetime access to all templates, scripts, and marketing materials'
                      }
                    </p>
                    {!hasAccess && (
                      <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-bold text-purple-600">$97</span>
                        <span className="text-sm text-slate-500 line-through">$297</span>
                      </div>
                    )}
                  </div>
                </div>
                {hasAccess ? (
                  <div className="px-6 py-3 bg-green-100 text-green-700 font-semibold rounded-lg">
                    Active
                  </div>
                ) : (
                  <Button
                    className="bg-purple-600 hover:bg-purple-700"
                    onClick={() => navigate('/merchant/swipe-file/checkout')}
                  >
                    Unlock Now
                  </Button>
                )}
              </div>
            </CardBody>
          </Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card variant="bordered">
            <CardHeader>
              <h2 className="text-xl font-bold text-slate-900">What's Inside</h2>
            </CardHeader>
            <CardBody>
              <ul className="space-y-2">
                <li className="flex items-center text-slate-600">
                  <Star className="w-5 h-5 text-[#F5B82E] mr-2" />
                  36 Facebook & Instagram ad templates
                </li>
                <li className="flex items-center text-slate-600">
                  <Star className="w-5 h-5 text-[#F5B82E] mr-2" />
                  7 Google ad campaigns
                </li>
                <li className="flex items-center text-slate-600">
                  <Star className="w-5 h-5 text-[#F5B82E] mr-2" />
                  20 Landing page templates (7 industries)
                </li>
                <li className="flex items-center text-slate-600">
                  <Star className="w-5 h-5 text-[#F5B82E] mr-2" />
                  9 Email campaign templates
                </li>
                <li className="flex items-center text-slate-600">
                  <Star className="w-5 h-5 text-[#F5B82E] mr-2" />
                  15 Sales & phone scripts
                </li>
                <li className="flex items-center text-slate-600">
                  <Star className="w-5 h-5 text-[#F5B82E] mr-2" />
                  18 Social posts & deal ideas
                </li>
              </ul>
            </CardBody>
          </Card>

          <Card variant="bordered">
            <CardHeader>
              <h2 className="text-xl font-bold text-slate-900">Browse Categories</h2>
            </CardHeader>
            <CardBody>
              <div className="grid grid-cols-2 gap-3">
                {categories.map((category) => (
                  <button
                    key={category.name}
                    onClick={() => {
                      if (!hasAccess) {
                        navigate('/merchant/swipe-file/checkout');
                      } else {
                        navigate(category.route);
                      }
                    }}
                    className="p-3 text-left rounded-lg border border-slate-200 hover:border-[#2BB673] hover:bg-[#2BB673]/5 transition-all"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-slate-700">{category.name}</span>
                      <Download className="w-4 h-4 text-slate-400" />
                    </div>
                    <div className="text-xs text-slate-500">
                      {category.count} templates
                    </div>
                  </button>
                ))}
              </div>
            </CardBody>
          </Card>
        </div>

        <Card variant="bordered" className="bg-[#2BB673]/5">
          <CardBody>
            <div className="text-center py-6">
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                Included FREE in Growth & Scale Plans
              </h3>
              <p className="text-slate-600 mb-4">
                Upgrade your subscription to get instant access plus all other premium features
              </p>
              <Button variant="outline" onClick={() => navigate('/merchant/upgrade')}>
                View Plans
              </Button>
            </div>
          </CardBody>
        </Card>
      </div>
    </BusinessHubLayout>
  );
}

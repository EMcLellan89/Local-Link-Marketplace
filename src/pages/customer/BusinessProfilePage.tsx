import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  MapPin, Star, Clock, Phone, Globe, MessageSquare, Calendar,
  Heart, Shield, Award, Zap, TrendingUp, ChevronRight, X,
  CheckCircle, Tag, Users, ArrowLeft, ExternalLink, Gift
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Button from '../../components/ui/Button';

interface BusinessProfile {
  id: string;
  business_name: string;
  description: string | null;
  city: string | null;
  state: string | null;
  address: string | null;
  phone: string | null;
  website: string | null;
  category: string | null;
  logo_url: string | null;
  cover_image_url: string | null;
  hours: Record<string, string> | null;
  rating: number;
  review_count: number;
  is_verified: boolean;
  is_featured: boolean;
  follower_count: number;
  response_time_hours: number | null;
}

interface BusinessOffer {
  id: string;
  title: string;
  short_description: string;
  price_cents: number;
  original_value_cents: number;
  image_url: string | null;
  expires_at: string | null;
}

interface BusinessEvent {
  id: string;
  title: string;
  short_description: string;
  event_date: string;
  start_time: string | null;
  location_name: string | null;
  is_free: boolean;
  ticket_price_cents: number;
  image_url: string | null;
  rsvp_count: number;
}

interface BusinessReview {
  id: string;
  rating: number;
  review_text: string;
  reviewer_name: string;
  created_at: string;
  helpful_count: number;
}

interface FeedPost {
  id: string;
  title: string;
  body: string;
  image_url: string | null;
  post_type: 'update' | 'offer' | 'event' | 'announcement' | 'behind_the_scenes';
  published_at: string;
}

interface InsiderClub {
  id: string;
  name: string;
  description: string | null;
  perks: string[];
  member_count: number;
}

type TabType = 'about' | 'offers' | 'events' | 'reviews' | 'feed';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const MOCK_BUSINESS: BusinessProfile = {
  id: 'mock-biz-1',
  business_name: 'The Corner Café',
  description: 'A cozy neighborhood café serving artisan coffee, fresh pastries, and light bites. We source our beans from local roasters and bake everything fresh daily. Perfect for a morning pick-me-up, a working lunch, or a relaxed afternoon with friends.',
  city: 'Springfield',
  state: 'IL',
  address: '142 Main Street, Springfield, IL 62701',
  phone: '(217) 555-0192',
  website: 'https://thecornercafe.com',
  category: 'Café & Coffee',
  logo_url: null,
  cover_image_url: 'https://images.pexels.com/photos/1833586/pexels-photo-1833586.jpeg?auto=compress&cs=tinysrgb&w=1200',
  hours: {
    Monday: '7:00 AM – 5:00 PM',
    Tuesday: '7:00 AM – 5:00 PM',
    Wednesday: '7:00 AM – 5:00 PM',
    Thursday: '7:00 AM – 5:00 PM',
    Friday: '7:00 AM – 6:00 PM',
    Saturday: '8:00 AM – 4:00 PM',
    Sunday: 'Closed',
  },
  rating: 4.8,
  review_count: 142,
  is_verified: true,
  is_featured: true,
  follower_count: 384,
  response_time_hours: 2,
};

const MOCK_OFFERS: BusinessOffer[] = [
  {
    id: 'o1', title: 'Morning Starter Pack', short_description: 'Any large coffee + a fresh pastry of your choice',
    price_cents: 799, original_value_cents: 1299, image_url: 'https://images.pexels.com/photos/312418/pexels-photo-312418.jpeg?auto=compress&cs=tinysrgb&w=600',
    expires_at: '2026-05-31',
  },
  {
    id: 'o2', title: 'Lunch For Two', short_description: 'Two sandwiches, two drinks, and two cookies',
    price_cents: 1999, original_value_cents: 2800, image_url: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=600',
    expires_at: '2026-06-15',
  },
];

const MOCK_EVENTS: BusinessEvent[] = [
  {
    id: 'e1', title: 'Live Acoustic Morning', short_description: 'Local acoustic artist plays while you enjoy your morning coffee',
    event_date: '2026-05-03', start_time: '9:00 AM', location_name: 'The Corner Café',
    is_free: true, ticket_price_cents: 0, image_url: 'https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=600',
    rsvp_count: 28,
  },
  {
    id: 'e2', title: 'Coffee Tasting Workshop', short_description: 'Learn to identify roast profiles and brew methods from our head barista',
    event_date: '2026-05-10', start_time: '2:00 PM', location_name: 'The Corner Café',
    is_free: false, ticket_price_cents: 1500, image_url: 'https://images.pexels.com/photos/851555/pexels-photo-851555.jpeg?auto=compress&cs=tinysrgb&w=600',
    rsvp_count: 14,
  },
];

const MOCK_REVIEWS: BusinessReview[] = [
  { id: 'r1', rating: 5, review_text: 'Best coffee in town, hands down. The staff always remember my order and the atmosphere is just perfect for working remotely.', reviewer_name: 'Sarah M.', created_at: '2026-03-15', helpful_count: 12 },
  { id: 'r2', rating: 5, review_text: 'My go-to spot every Saturday morning. Love the fresh pastries and the way they source everything locally.', reviewer_name: 'James T.', created_at: '2026-02-28', helpful_count: 8 },
  { id: 'r3', rating: 4, review_text: 'Great café with a wonderful community vibe. Can get a bit crowded on weekends but worth the wait.', reviewer_name: 'Linda K.', created_at: '2026-02-10', helpful_count: 5 },
];

const MOCK_FEED: FeedPost[] = [
  { id: 'fp1', title: 'New Summer Menu is Here!', body: 'We\'re thrilled to announce our summer menu is live! Fresh cold brews, iced matcha lattes, and seasonal fruit pastries. Come try them this week!', image_url: 'https://images.pexels.com/photos/1638280/pexels-photo-1638280.jpeg?auto=compress&cs=tinysrgb&w=600', post_type: 'announcement', published_at: '2026-04-20' },
  { id: 'fp2', title: 'Meet Our Head Barista, Alex', body: 'Alex has been crafting perfect espresso shots for 8 years. Ask them about our single-origin pour-overs next time you\'re in!', image_url: 'https://images.pexels.com/photos/3785927/pexels-photo-3785927.jpeg?auto=compress&cs=tinysrgb&w=600', post_type: 'behind_the_scenes', published_at: '2026-04-15' },
];

const MOCK_CLUB: InsiderClub = {
  id: 'club-1',
  name: 'Corner Café Insiders',
  description: 'Join our exclusive community for the best perks, early access to events, and members-only specials.',
  perks: ['10% off every visit', 'Early access to events', 'Free birthday drink', 'Monthly member-only special', 'Exclusive menu previews'],
  member_count: 67,
};

function StarRating({ rating, size = 'sm' }: { rating: number; size?: 'sm' | 'lg' }) {
  const stars = Array.from({ length: 5 }, (_, i) => i < Math.round(rating));
  return (
    <div className="flex items-center gap-0.5">
      {stars.map((filled, i) => (
        <Star key={i} className={`${size === 'lg' ? 'w-5 h-5' : 'w-4 h-4'} ${filled ? 'text-amber-400 fill-amber-400' : 'text-slate-300'}`} />
      ))}
    </div>
  );
}

function PostTypeBadge({ type }: { type: FeedPost['post_type'] }) {
  const map: Record<FeedPost['post_type'], { label: string; cls: string }> = {
    update: { label: 'Update', cls: 'bg-blue-50 text-blue-700' },
    offer: { label: 'Special Offer', cls: 'bg-green-50 text-green-700' },
    event: { label: 'Event', cls: 'bg-orange-50 text-orange-700' },
    announcement: { label: 'Announcement', cls: 'bg-amber-50 text-amber-700' },
    behind_the_scenes: { label: 'Behind the Scenes', cls: 'bg-pink-50 text-pink-700' },
  };
  const { label, cls } = map[type];
  return <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${cls}`}>{label}</span>;
}

export default function BusinessProfilePage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [business, setBusiness] = useState<BusinessProfile | null>(null);
  const [offers, setOffers] = useState<BusinessOffer[]>([]);
  const [events, setEvents] = useState<BusinessEvent[]>([]);
  const [reviews, setReviews] = useState<BusinessReview[]>([]);
  const [feed, setFeed] = useState<FeedPost[]>([]);
  const [insiderClub, setInsiderClub] = useState<InsiderClub | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('about');
  const [isFollowing, setIsFollowing] = useState(false);
  const [isInsider, setIsInsider] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [showInsiderModal, setShowInsiderModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [followLoading, setFollowLoading] = useState(false);

  useEffect(() => {
    loadBusinessProfile();
  }, [slug, user]);

  const loadBusinessProfile = async () => {
    setLoading(true);
    try {
      const { data: biz } = await supabase
        .from('merchants')
        .select('id, business_name, description, city, state, address, phone, website, category, logo_url, cover_image_url, hours, is_verified, is_featured')
        .eq('slug', slug)
        .maybeSingle();

      if (biz) {
        setBusiness({ ...MOCK_BUSINESS, ...biz, rating: 4.8, review_count: 142, follower_count: 384 });

        const [offersRes, eventsRes, clubRes] = await Promise.allSettled([
          supabase.from('deals').select('id, title, short_description, price_cents, original_value_cents, image_url, expires_at').eq('merchant_id', biz.id).eq('status', 'active').limit(4),
          supabase.from('community_events').select('id, title, short_description, event_date, start_time, location_name, is_free, ticket_price_cents, image_url, rsvp_count').eq('merchant_id', biz.id).gte('event_date', new Date().toISOString().split('T')[0]).limit(4),
          supabase.from('business_insider_clubs').select('id, name, description, perks').eq('merchant_id', biz.id).eq('active', true).maybeSingle(),
        ]);

        if (offersRes.status === 'fulfilled' && offersRes.value.data?.length) setOffers(offersRes.value.data);
        else setOffers(MOCK_OFFERS);

        if (eventsRes.status === 'fulfilled' && eventsRes.value.data?.length) setEvents(eventsRes.value.data);
        else setEvents(MOCK_EVENTS);

        if (clubRes.status === 'fulfilled' && clubRes.value.data) {
          const c = clubRes.value.data;
          setInsiderClub({ ...MOCK_CLUB, ...c, perks: Array.isArray(c.perks) ? c.perks : MOCK_CLUB.perks, member_count: 67 });
        } else {
          setInsiderClub(MOCK_CLUB);
        }

        if (user) {
          const [followRes, insiderRes, savedRes] = await Promise.allSettled([
            supabase.from('business_follows').select('id').eq('merchant_id', biz.id).eq('user_id', user.id).maybeSingle(),
            supabase.from('insider_club_members').select('id').eq('merchant_id', biz.id).eq('user_id', user.id).eq('active', true).maybeSingle(),
            supabase.from('saved_items').select('id').eq('user_id', user.id).eq('item_type', 'business').eq('item_id', biz.id).maybeSingle(),
          ]);
          if (followRes.status === 'fulfilled') setIsFollowing(!!followRes.value.data);
          if (insiderRes.status === 'fulfilled') setIsInsider(!!insiderRes.value.data);
          if (savedRes.status === 'fulfilled') setIsSaved(!!savedRes.value.data);
        }
      } else {
        setBusiness(MOCK_BUSINESS);
        setOffers(MOCK_OFFERS);
        setEvents(MOCK_EVENTS);
        setInsiderClub(MOCK_CLUB);
      }
    } catch {
      setBusiness(MOCK_BUSINESS);
      setOffers(MOCK_OFFERS);
      setEvents(MOCK_EVENTS);
      setInsiderClub(MOCK_CLUB);
    }

    setReviews(MOCK_REVIEWS);
    setFeed(MOCK_FEED);
    setLoading(false);
  };

  const handleFollow = async () => {
    if (!user) { navigate('/login'); return; }
    if (!business) return;
    setFollowLoading(true);
    try {
      if (isFollowing) {
        await supabase.from('business_follows').delete().eq('merchant_id', business.id).eq('user_id', user.id);
        setIsFollowing(false);
      } else {
        await supabase.from('business_follows').insert({ merchant_id: business.id, user_id: user.id, source: 'profile_page' });
        setIsFollowing(true);
      }
    } catch { /* silent */ }
    setFollowLoading(false);
  };

  const handleSave = async () => {
    if (!user) { navigate('/login'); return; }
    if (!business) return;
    try {
      if (isSaved) {
        await supabase.from('saved_items').delete().eq('user_id', user.id).eq('item_type', 'business').eq('item_id', business.id);
        setIsSaved(false);
      } else {
        await supabase.from('saved_items').insert({ user_id: user.id, item_type: 'business', item_id: business.id });
        setIsSaved(true);
      }
    } catch { /* silent */ }
  };

  const handleJoinInsider = async () => {
    if (!user) { navigate('/login'); return; }
    if (!business || !insiderClub) return;
    try {
      await supabase.from('insider_club_members').insert({
        club_id: insiderClub.id,
        merchant_id: business.id,
        user_id: user.id,
        joined_at: new Date().toISOString(),
        active: true,
      });
      setIsInsider(true);
      setShowInsiderModal(false);
    } catch { /* silent */ }
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  const formatPrice = (cents: number) => `$${(cents / 100).toFixed(2)}`;

  const getTodayHours = () => {
    if (!business?.hours) return null;
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
    return business.hours[today] || null;
  };

  const TABS: { id: TabType; label: string; count?: number }[] = [
    { id: 'about', label: 'About' },
    { id: 'offers', label: 'Special Offers', count: offers.length },
    { id: 'events', label: 'Events', count: events.length },
    { id: 'reviews', label: 'Reviews', count: reviews.length },
    { id: 'feed', label: 'Business Feed', count: feed.length },
  ];

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-64">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#2BB673]" />
        </div>
      </DashboardLayout>
    );
  }

  if (!business) {
    return (
      <DashboardLayout>
        <div className="text-center py-16">
          <p className="text-slate-500 mb-4">Business not found.</p>
          <Button onClick={() => navigate(-1)}>Go Back</Button>
        </div>
      </DashboardLayout>
    );
  }

  const todayHours = getTodayHours();

  return (
    <DashboardLayout>
      {/* Back navigation */}
      <div className="mb-0">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
      </div>

      {/* Hero Cover */}
      <div className="relative -mx-4 sm:-mx-6 lg:-mx-8 mb-0 overflow-hidden rounded-t-xl" style={{ height: '240px' }}>
        {business.cover_image_url ? (
          <img src={business.cover_image_url} alt={business.business_name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-slate-700 to-slate-900" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main Content */}
        <div className="flex-1 min-w-0">
          {/* Business Header */}
          <div className="bg-white rounded-b-xl shadow-sm border border-slate-200 -mx-4 sm:-mx-6 lg:-mx-8 lg:mx-0 px-4 sm:px-6 lg:px-6 pt-5 pb-6 mb-6">
            <div className="flex items-start gap-4">
              {/* Logo */}
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border-2 border-white shadow-md bg-slate-100 flex-shrink-0 -mt-10">
                {business.logo_url ? (
                  <img src={business.logo_url} alt={business.business_name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-[#2BB673] to-emerald-600 flex items-center justify-center">
                    <span className="text-white font-bold text-xl sm:text-2xl">{business.business_name.charAt(0)}</span>
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <h1 className="text-xl sm:text-2xl font-bold text-slate-900">{business.business_name}</h1>
                  {business.is_verified && (
                    <span className="flex items-center gap-1 text-xs font-medium text-[#2BB673] bg-[#2BB673]/10 px-2 py-0.5 rounded-full">
                      <CheckCircle className="w-3 h-3" /> Verified
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500 mb-3">
                  {business.category && <span className="font-medium text-slate-700">{business.category}</span>}
                  {business.city && (
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" /> {business.city}{business.state ? `, ${business.state}` : ''}
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <StarRating rating={business.rating} />
                    <span className="font-medium text-slate-700 ml-1">{business.rating}</span>
                    <span className="text-slate-400">({business.review_count} reviews)</span>
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={handleFollow}
                    disabled={followLoading}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      isFollowing
                        ? 'bg-[#2BB673] text-white hover:bg-[#22a262]'
                        : 'border border-[#2BB673] text-[#2BB673] hover:bg-[#2BB673]/5'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${isFollowing ? 'fill-white' : ''}`} />
                    {isFollowing ? 'Following' : 'Follow'}
                    <span className="text-xs opacity-75">({business.follower_count + (isFollowing ? 0 : 0)})</span>
                  </button>
                  <Link
                    to="/community"
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    <MessageSquare className="w-4 h-4" /> Message
                  </Link>
                  <button
                    onClick={handleSave}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border transition-all ${
                      isSaved ? 'border-rose-300 text-rose-600 bg-rose-50' : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${isSaved ? 'fill-rose-500 text-rose-500' : ''}`} />
                    {isSaved ? 'Saved' : 'Save'}
                  </button>
                </div>
              </div>
            </div>

            {/* Trust Strip */}
            <div className="mt-5 pt-5 border-t border-slate-100 flex flex-wrap gap-3">
              {business.is_featured && (
                <span className="flex items-center gap-1.5 text-xs font-medium text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-full">
                  <TrendingUp className="w-3.5 h-3.5" /> Popular This Week
                </span>
              )}
              {business.response_time_hours && business.response_time_hours <= 4 && (
                <span className="flex items-center gap-1.5 text-xs font-medium text-blue-700 bg-blue-50 border border-blue-200 px-3 py-1.5 rounded-full">
                  <Zap className="w-3.5 h-3.5" /> Fast Response
                </span>
              )}
              {business.is_verified && (
                <span className="flex items-center gap-1.5 text-xs font-medium text-[#2BB673] bg-[#2BB673]/10 border border-[#2BB673]/20 px-3 py-1.5 rounded-full">
                  <Shield className="w-3.5 h-3.5" /> Verified Merchant
                </span>
              )}
              <span className="flex items-center gap-1.5 text-xs font-medium text-slate-600 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-full">
                <Award className="w-3.5 h-3.5" /> Local-Link Partner
              </span>
              {todayHours && (
                <span className="flex items-center gap-1.5 text-xs font-medium text-slate-600 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-full">
                  <Clock className="w-3.5 h-3.5" /> Today: {todayHours}
                </span>
              )}
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 mb-6 overflow-hidden">
            <div className="flex overflow-x-auto border-b border-slate-100">
              {TABS.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-shrink-0 px-4 sm:px-5 py-3.5 text-sm font-medium transition-colors border-b-2 ${
                    activeTab === tab.id
                      ? 'border-[#2BB673] text-[#2BB673]'
                      : 'border-transparent text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {tab.label}
                  {tab.count !== undefined && tab.count > 0 && (
                    <span className="ml-1.5 text-xs bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded-full">{tab.count}</span>
                  )}
                </button>
              ))}
            </div>

            <div className="p-5 sm:p-6">
              {/* About Tab */}
              {activeTab === 'about' && (
                <div className="space-y-6">
                  {business.description && (
                    <div>
                      <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-2">About</h3>
                      <p className="text-slate-700 leading-relaxed">{business.description}</p>
                    </div>
                  )}
                  <div className="grid sm:grid-cols-2 gap-4">
                    {business.address && (
                      <div className="flex items-start gap-3">
                        <MapPin className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                        <div>
                          <div className="text-xs font-medium text-slate-500 mb-0.5">Address</div>
                          <div className="text-sm text-slate-700">{business.address}</div>
                        </div>
                      </div>
                    )}
                    {business.phone && (
                      <div className="flex items-start gap-3">
                        <Phone className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                        <div>
                          <div className="text-xs font-medium text-slate-500 mb-0.5">Phone</div>
                          <a href={`tel:${business.phone}`} className="text-sm text-[#2BB673] hover:underline">{business.phone}</a>
                        </div>
                      </div>
                    )}
                    {business.website && (
                      <div className="flex items-start gap-3">
                        <Globe className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                        <div>
                          <div className="text-xs font-medium text-slate-500 mb-0.5">Website</div>
                          <a href={business.website} target="_blank" rel="noopener noreferrer" className="text-sm text-[#2BB673] hover:underline flex items-center gap-1">
                            Visit Website <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      </div>
                    )}
                    <div className="flex items-start gap-3">
                      <Users className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="text-xs font-medium text-slate-500 mb-0.5">Followers</div>
                        <div className="text-sm text-slate-700">{business.follower_count.toLocaleString()} locals following</div>
                      </div>
                    </div>
                  </div>
                  {business.hours && (
                    <div>
                      <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3 flex items-center gap-2">
                        <Clock className="w-4 h-4" /> Hours
                      </h3>
                      <div className="grid sm:grid-cols-2 gap-1">
                        {DAYS.map(day => {
                          const isToday = new Date().toLocaleDateString('en-US', { weekday: 'long' }) === day;
                          return (
                            <div key={day} className={`flex justify-between text-sm py-1.5 px-2 rounded-lg ${isToday ? 'bg-[#2BB673]/10 font-medium' : ''}`}>
                              <span className={isToday ? 'text-[#2BB673]' : 'text-slate-600'}>{day}</span>
                              <span className={isToday ? 'text-[#2BB673]' : 'text-slate-500'}>{(business.hours as Record<string, string>)[day] || 'Closed'}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Offers Tab */}
              {activeTab === 'offers' && (
                <div className="space-y-4">
                  {offers.length === 0 ? (
                    <p className="text-slate-500 text-sm">No active offers right now. Follow this business to be notified when new offers are posted.</p>
                  ) : offers.map(offer => (
                    <div key={offer.id} className="flex gap-4 p-4 border border-slate-200 rounded-xl hover:border-[#2BB673]/30 hover:bg-slate-50 transition-colors cursor-pointer">
                      {offer.image_url && (
                        <img src={offer.image_url} alt={offer.title} className="w-20 h-20 object-cover rounded-lg flex-shrink-0" />
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="font-semibold text-slate-900 text-sm">{offer.title}</h4>
                          <div className="text-right flex-shrink-0">
                            <div className="text-[#2BB673] font-bold">{formatPrice(offer.price_cents)}</div>
                            <div className="text-xs text-slate-400 line-through">{formatPrice(offer.original_value_cents)}</div>
                          </div>
                        </div>
                        <p className="text-xs text-slate-500 mt-1 mb-2">{offer.short_description}</p>
                        {offer.expires_at && (
                          <span className="text-xs text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                            Expires {formatDate(offer.expires_at)}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Events Tab */}
              {activeTab === 'events' && (
                <div className="space-y-4">
                  {events.length === 0 ? (
                    <p className="text-slate-500 text-sm">No upcoming events. Follow this business to get notified about future events.</p>
                  ) : events.map(event => (
                    <div key={event.id} className="flex gap-4 p-4 border border-slate-200 rounded-xl hover:border-[#2BB673]/30 hover:bg-slate-50 transition-colors cursor-pointer">
                      {event.image_url && (
                        <img src={event.image_url} alt={event.title} className="w-20 h-20 object-cover rounded-lg flex-shrink-0" />
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="font-semibold text-slate-900 text-sm">{event.title}</h4>
                          <span className={`text-xs font-medium px-2 py-0.5 rounded-full flex-shrink-0 ${event.is_free ? 'bg-green-50 text-green-700' : 'bg-slate-100 text-slate-600'}`}>
                            {event.is_free ? 'Free' : formatPrice(event.ticket_price_cents)}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-1 mb-2">{event.short_description}</p>
                        <div className="flex items-center gap-3 text-xs text-slate-400">
                          <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {formatDate(event.event_date)}</span>
                          {event.start_time && <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {event.start_time}</span>}
                          <span>{event.rsvp_count} going</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Reviews Tab */}
              {activeTab === 'reviews' && (
                <div className="space-y-5">
                  <div className="flex items-center gap-6 p-4 bg-slate-50 rounded-xl">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-slate-900">{business.rating}</div>
                      <StarRating rating={business.rating} size="lg" />
                      <div className="text-xs text-slate-500 mt-1">{business.review_count} reviews</div>
                    </div>
                    <div className="flex-1">
                      {[5, 4, 3, 2, 1].map(n => (
                        <div key={n} className="flex items-center gap-2 mb-1">
                          <span className="text-xs text-slate-500 w-2">{n}</span>
                          <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                          <div className="flex-1 bg-slate-200 rounded-full h-1.5">
                            <div className="bg-amber-400 h-1.5 rounded-full" style={{ width: n === 5 ? '72%' : n === 4 ? '20%' : n === 3 ? '5%' : '2%' }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  {reviews.map(review => (
                    <div key={review.id} className="border-b border-slate-100 pb-5 last:border-0 last:pb-0">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-[#2BB673]/20 flex items-center justify-center text-sm font-semibold text-[#2BB673]">
                            {review.reviewer_name.charAt(0)}
                          </div>
                          <div>
                            <div className="text-sm font-medium text-slate-900">{review.reviewer_name}</div>
                            <div className="text-xs text-slate-400">{formatDate(review.created_at)}</div>
                          </div>
                        </div>
                        <StarRating rating={review.rating} />
                      </div>
                      <p className="text-sm text-slate-600 leading-relaxed">{review.review_text}</p>
                      <div className="mt-2 text-xs text-slate-400">{review.helpful_count} people found this helpful</div>
                    </div>
                  ))}
                </div>
              )}

              {/* Feed Tab */}
              {activeTab === 'feed' && (
                <div className="space-y-5">
                  {feed.length === 0 ? (
                    <p className="text-slate-500 text-sm">No posts yet. Follow this business to be first to see updates.</p>
                  ) : feed.map(post => (
                    <div key={post.id} className="border border-slate-200 rounded-xl overflow-hidden">
                      {post.image_url && <img src={post.image_url} alt={post.title} className="w-full h-44 object-cover" />}
                      <div className="p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <PostTypeBadge type={post.post_type} />
                          <span className="text-xs text-slate-400">{formatDate(post.published_at)}</span>
                        </div>
                        <h4 className="font-semibold text-slate-900 mb-1">{post.title}</h4>
                        <p className="text-sm text-slate-600 leading-relaxed">{post.body}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sticky Sidebar */}
        <div className="lg:w-80 flex-shrink-0 space-y-4">
          {/* Book Now Card */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 lg:sticky lg:top-4">
            <h3 className="font-semibold text-slate-900 mb-4">Ready to Book?</h3>
            <div className="space-y-3">
              <Link
                to="/community"
                className="w-full flex items-center justify-center gap-2 bg-[#2BB673] hover:bg-[#22a262] text-white font-medium py-3 px-4 rounded-lg transition-colors"
              >
                <Calendar className="w-4 h-4" /> Book Now
              </Link>
              {business.phone && (
                <a
                  href={`tel:${business.phone}`}
                  className="w-full flex items-center justify-center gap-2 border border-slate-200 text-slate-700 hover:bg-slate-50 font-medium py-3 px-4 rounded-lg transition-colors"
                >
                  <Phone className="w-4 h-4" /> Call to Book
                </a>
              )}
              <button
                onClick={() => !user ? navigate('/login') : navigate('/community')}
                className="w-full flex items-center justify-center gap-2 border border-slate-200 text-slate-700 hover:bg-slate-50 font-medium py-3 px-4 rounded-lg transition-colors"
              >
                <MessageSquare className="w-4 h-4" /> Send Message
              </button>
            </div>

            {business.address && (
              <div className="mt-4 pt-4 border-t border-slate-100">
                <div className="flex items-start gap-2 text-sm">
                  <MapPin className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-600">{business.address}</span>
                </div>
              </div>
            )}

            {todayHours && (
              <div className="mt-3 flex items-center gap-2 text-sm">
                <Clock className="w-4 h-4 text-slate-400 flex-shrink-0" />
                <span className="text-slate-600">Today: <span className="font-medium">{todayHours}</span></span>
              </div>
            )}
          </div>

          {/* Insider Club Card */}
          {insiderClub && !isInsider && (
            <div className="bg-gradient-to-br from-[#2BB673] to-emerald-600 rounded-xl p-5 text-white">
              <div className="flex items-center gap-2 mb-1">
                <Gift className="w-5 h-5" />
                <h3 className="font-bold text-lg">{insiderClub.name}</h3>
              </div>
              <p className="text-sm text-white/80 mb-3">
                {insiderClub.member_count} members enjoying exclusive perks
              </p>
              <ul className="space-y-1.5 mb-4">
                {insiderClub.perks.slice(0, 3).map((perk, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-3.5 h-3.5 text-white/70 flex-shrink-0" />
                    <span className="text-white/90">{perk}</span>
                  </li>
                ))}
                {insiderClub.perks.length > 3 && (
                  <li className="text-xs text-white/60">+ {insiderClub.perks.length - 3} more perks</li>
                )}
              </ul>
              <button
                onClick={() => setShowInsiderModal(true)}
                className="w-full bg-white text-[#2BB673] font-semibold py-2.5 rounded-lg hover:bg-white/90 transition-colors text-sm"
              >
                Join Insider Club — Free
              </button>
            </div>
          )}

          {insiderClub && isInsider && (
            <div className="bg-[#2BB673]/10 border border-[#2BB673]/30 rounded-xl p-4 text-center">
              <CheckCircle className="w-8 h-8 text-[#2BB673] mx-auto mb-2" />
              <div className="font-semibold text-[#2BB673]">You're an Insider!</div>
              <div className="text-sm text-slate-600 mt-1">{insiderClub.name} member</div>
            </div>
          )}

          {/* Quick Stats */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3">Quick Stats</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="text-center p-3 bg-slate-50 rounded-lg">
                <div className="text-xl font-bold text-slate-900">{business.review_count}</div>
                <div className="text-xs text-slate-500">Reviews</div>
              </div>
              <div className="text-center p-3 bg-slate-50 rounded-lg">
                <div className="text-xl font-bold text-slate-900">{business.follower_count}</div>
                <div className="text-xs text-slate-500">Followers</div>
              </div>
              <div className="text-center p-3 bg-slate-50 rounded-lg">
                <div className="text-xl font-bold text-[#2BB673]">{offers.length}</div>
                <div className="text-xs text-slate-500">Active Offers</div>
              </div>
              <div className="text-center p-3 bg-slate-50 rounded-lg">
                <div className="text-xl font-bold text-[#2BB673]">{events.length}</div>
                <div className="text-xs text-slate-500">Events</div>
              </div>
            </div>
          </div>

          {/* Other Businesses CTA */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3">Explore More</h3>
            <div className="space-y-2">
              <Link to="/offers" className="flex items-center justify-between text-sm text-slate-700 hover:text-[#2BB673] transition-colors py-1">
                <span className="flex items-center gap-2"><Tag className="w-4 h-4" /> Special Offers</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
              <Link to="/community" className="flex items-center justify-between text-sm text-slate-700 hover:text-[#2BB673] transition-colors py-1">
                <span className="flex items-center gap-2"><Calendar className="w-4 h-4" /> Local Events</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
              <Link to="/my-feed" className="flex items-center justify-between text-sm text-slate-700 hover:text-[#2BB673] transition-colors py-1">
                <span className="flex items-center gap-2"><TrendingUp className="w-4 h-4" /> My Feed</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Insider Club Modal */}
      {showInsiderModal && insiderClub && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4" onClick={() => setShowInsiderModal(false)}>
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl" onClick={e => e.stopPropagation()}>
            <button onClick={() => setShowInsiderModal(false)} className="float-right text-slate-400 hover:text-slate-600">
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-[#2BB673] to-emerald-600 rounded-full flex items-center justify-center">
                <Gift className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-slate-900">{insiderClub.name}</h3>
                <div className="text-sm text-slate-500">{business.business_name}</div>
              </div>
            </div>

            {insiderClub.description && (
              <p className="text-sm text-slate-600 mb-4">{insiderClub.description}</p>
            )}

            <div className="bg-slate-50 rounded-xl p-4 mb-5">
              <div className="text-sm font-semibold text-slate-700 mb-3">Member Perks</div>
              <ul className="space-y-2">
                {insiderClub.perks.map((perk, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-slate-700">
                    <CheckCircle className="w-4 h-4 text-[#2BB673] flex-shrink-0" />
                    {perk}
                  </li>
                ))}
              </ul>
            </div>

            <div className="text-xs text-slate-400 text-center mb-4">
              {insiderClub.member_count} members already enjoying these perks. Free to join — no commitment.
            </div>

            <button
              onClick={handleJoinInsider}
              className="w-full bg-[#2BB673] hover:bg-[#22a262] text-white font-semibold py-3 rounded-xl transition-colors"
            >
              Join {insiderClub.name}
            </button>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

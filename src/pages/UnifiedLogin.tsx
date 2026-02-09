import { useState, FormEvent, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import Card, { CardBody, CardHeader } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { User, Store, Users, Settings, Briefcase, Eye, EyeOff } from 'lucide-react';
import { isBypassEnabled } from '../lib/bypassMode';

const ROLES = [
  {
    key: 'customer',
    label: 'Customer',
    desc: 'Browse, buy, book, and track your orders.',
    icon: User,
    route: '/app'
  },
  {
    key: 'merchant',
    label: 'Merchant',
    desc: 'List services/products and manage leads & sales.',
    icon: Store,
    route: '/merchant/dashboard'
  },
  {
    key: 'partner',
    label: 'Partner',
    desc: 'Promote offers, earn commissions, manage referrals.',
    icon: Briefcase,
    route: '/partner/dashboard'
  },
  {
    key: 'admin',
    label: 'Admin',
    desc: 'Platform settings, products, payouts, approvals.',
    icon: Settings,
    route: '/admin/dashboard'
  },
  {
    key: 'team',
    label: 'Team',
    desc: 'Support, ops, review queues, and internal tools.',
    icon: Users,
    route: '/team/dashboard'
  },
] as const;

type RoleKey = typeof ROLES[number]['key'];

export default function UnifiedLogin() {
  const navigate = useNavigate();
  const bypassMode = isBypassEnabled();

  const [role, setRole] = useState<RoleKey>('customer');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const roleMeta = ROLES.find((r) => r.key === role)!;

  useEffect(() => {
    if (bypassMode) {
      setTimeout(() => {
        navigate(roleMeta.route);
      }, 1500);
    }
  }, [bypassMode, roleMeta.route, navigate]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (!email.trim()) return setError('Please enter your email.');
    if (!password) return setError('Please enter your password.');

    try {
      setSubmitting(true);

      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password,
      });

      if (authError) throw authError;

      if (data.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', data.user.id)
          .single();

        if (profile?.role) {
          const userRole = profile.role;
          const roleRoute = ROLES.find(r => r.key === userRole)?.route || '/app';
          navigate(roleRoute);
        } else {
          navigate(roleMeta.route);
        }
      }
    } catch (err: any) {
      setError(err?.message ?? 'Login failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-800 text-white">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:py-12">
        <header className="text-center mb-8 animate-fadeIn">
          <div className="relative inline-block">
            <div className="absolute -inset-6 rounded-full bg-gradient-to-r from-blue-500/20 via-cyan-500/20 to-green-500/20 blur-3xl animate-pulse-slow" />
            <span className="relative text-6xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent drop-shadow-lg">
              Local-Link
            </span>
          </div>
          <div className="mt-4">
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
              Welcome to Local-Link Marketplace
            </h1>
            <p className="text-slate-300 max-w-2xl mx-auto text-sm sm:text-base">
              Choose your login type below to access the right dashboard. Connect locally, grow faster.
            </p>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-6xl mx-auto">
          <div className="space-y-6 animate-slideInLeft">
            <Card className="bg-white/5 backdrop-blur-lg border-white/10">
              <CardHeader>
                <h2 className="text-xl font-bold text-white">Select Your Login Type</h2>
              </CardHeader>
              <CardBody>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {ROLES.map((r) => {
                    const active = r.key === role;
                    const Icon = r.icon;
                    return (
                      <button
                        key={r.key}
                        type="button"
                        onClick={() => setRole(r.key)}
                        className={`group rounded-xl border p-4 text-left transition-all duration-200 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-cyan-400/60 ${
                          active
                            ? 'border-cyan-400/50 bg-cyan-500/10 shadow-lg shadow-cyan-500/20'
                            : 'border-white/10 bg-black/20 hover:bg-white/5 hover:border-white/20'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <Icon className={`w-5 h-5 ${active ? 'text-cyan-400' : 'text-slate-400'}`} />
                          {active && (
                            <span className="rounded-full bg-cyan-400/20 px-2 py-0.5 text-xs font-semibold text-cyan-300">
                              Selected
                            </span>
                          )}
                        </div>
                        <div className="text-base font-semibold text-white">{r.label}</div>
                        <div className="mt-1 text-xs sm:text-sm text-slate-300">{r.desc}</div>
                      </button>
                    );
                  })}
                </div>

                <div className="mt-5 rounded-xl border border-white/10 bg-black/30 p-4">
                  <div className="text-sm font-semibold text-white">You selected: {roleMeta.label}</div>
                  <div className="mt-1 text-sm text-slate-300">{roleMeta.desc}</div>
                  {(role === 'admin' || role === 'team') && (
                    <div className="mt-3 text-xs text-slate-400 bg-orange-500/10 border border-orange-500/20 rounded-lg p-2">
                      Tip: Admin/Team accounts require proper authorization. Contact your platform administrator if you need access.
                    </div>
                  )}
                </div>

                <div className="mt-4 flex flex-wrap gap-3">
                  <Button
                    variant="secondary"
                    onClick={() => navigate(`/register?role=${role}`)}
                    className="flex-1 min-w-[140px]"
                  >
                    Create Account
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => navigate('/about')}
                    className="flex-1 min-w-[140px]"
                  >
                    Learn More
                  </Button>
                </div>
              </CardBody>
            </Card>
          </div>

          <div className="space-y-4 animate-slideInRight">
            <Card className="bg-white/5 backdrop-blur-lg border-white/10">
              <CardHeader>
                <h2 className="text-xl font-bold text-white">Log In</h2>
              </CardHeader>
              <CardBody>
                <form onSubmit={onSubmit} className="space-y-4">
                  {bypassMode && (
                    <div className="bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 border-2 border-emerald-400/50 text-white px-4 py-4 rounded-xl animate-pulse">
                      <div className="font-bold text-emerald-300 mb-1 flex items-center gap-2">
                        <span className="text-2xl">🎉</span>
                        Bypass Mode Active!
                      </div>
                      <div className="text-sm text-slate-200">
                        No password needed - redirecting you to {roleMeta.label} dashboard...
                      </div>
                    </div>
                  )}

                  {error && (
                    <div className="bg-red-500/20 border border-red-400/50 text-red-200 px-4 py-3 rounded-xl">
                      {error}
                    </div>
                  )}

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-slate-200 mb-2">
                      Email Address
                    </label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@business.com"
                      className="w-full bg-black/30 border-white/10 text-white placeholder:text-slate-500"
                      autoComplete="email"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-slate-200 mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-black/30 border-white/10 text-white placeholder:text-slate-500 pr-10"
                        autoComplete="current-password"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={remember}
                        onChange={(e) => setRemember(e.target.checked)}
                        className="h-4 w-4 rounded border-white/20 bg-black/30 text-cyan-500 focus:ring-cyan-500"
                      />
                      Remember me
                    </label>
                    <button
                      type="button"
                      className="text-sm font-semibold text-cyan-400 hover:text-cyan-300 transition-colors"
                      onClick={() => navigate('/forgot-password')}
                    >
                      Forgot password?
                    </button>
                  </div>

                  {error && (
                    <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200">
                      {error}
                    </div>
                  )}

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold"
                    disabled={submitting}
                  >
                    {submitting ? 'Signing in...' : `Sign in as ${roleMeta.label}`}
                  </Button>

                  <div className="text-center text-xs text-slate-400">
                    By continuing, you agree to Local-Link Marketplace Terms and Privacy Policy.
                  </div>
                </form>
              </CardBody>
            </Card>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Card className="bg-black/30 border-white/10">
                <CardBody className="p-4">
                  <div className="text-sm font-semibold text-white mb-1">New here?</div>
                  <div className="text-xs sm:text-sm text-slate-300 mb-3">
                    Create an account for your selected role.
                  </div>
                  <Button
                    variant="secondary"
                    onClick={() => navigate(`/register?role=${role}`)}
                    className="w-full"
                    size="sm"
                  >
                    Sign Up
                  </Button>
                </CardBody>
              </Card>

              <Card className="bg-black/30 border-white/10">
                <CardBody className="p-4">
                  <div className="text-sm font-semibold text-white mb-1">Just browsing?</div>
                  <div className="text-xs sm:text-sm text-slate-300 mb-3">
                    Explore the marketplace first.
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => navigate('/deals')}
                    className="w-full"
                    size="sm"
                  >
                    Browse Deals
                  </Button>
                </CardBody>
              </Card>
            </div>
          </div>
        </div>

        <footer className="mt-10 border-t border-white/10 pt-6 text-center">
          <div className="flex flex-wrap justify-center gap-6 text-sm text-slate-400 mb-4">
            <button onClick={() => navigate('/about')} className="hover:text-white transition-colors">
              Privacy Policy
            </button>
            <span className="text-slate-600">|</span>
            <button onClick={() => navigate('/about')} className="hover:text-white transition-colors">
              Terms of Service
            </button>
            <span className="text-slate-600">|</span>
            <button onClick={() => navigate('/faq')} className="hover:text-white transition-colors">
              Support
            </button>
          </div>
          <div className="text-xs text-slate-500">
            © {new Date().getFullYear()} Local-Link Marketplace. All rights reserved.
          </div>
        </footer>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.6; }
        }
        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out;
        }
        .animate-slideInLeft {
          animation: slideInLeft 0.6s ease-out;
        }
        .animate-slideInRight {
          animation: slideInRight 0.6s ease-out;
        }
        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}

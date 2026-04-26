import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useInternalTeamAuth } from '../../contexts/InternalTeamAuthContext';
import { Lock, Mail, Eye, EyeOff, ArrowRight, ShieldCheck, BarChart2, Users } from 'lucide-react';

export default function InternalTeamLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn, teamMember } = useInternalTeamAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (teamMember) {
      navigate('/internal/dashboard');
    }
  }, [teamMember, navigate]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signIn(email, password);
      navigate('/internal/dashboard');
    } catch {
      setError('Invalid email or password. Please check your credentials and try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 flex">
      {/* Left panel — branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 flex-col justify-between p-12 border-r border-white/5">
        <div>
          <img src="/local-link_marketplace_logo.png" alt="Local-Link" className="h-10 w-auto opacity-90" />
        </div>

        <div>
          <div className="inline-flex items-center gap-2 bg-[#2BB673]/15 text-[#2BB673] text-xs font-semibold uppercase tracking-wider px-3 py-1.5 rounded-full mb-6">
            <ShieldCheck className="w-3.5 h-3.5" />
            Internal Team Access
          </div>
          <h1 className="text-4xl font-extrabold text-white leading-tight mb-4">
            Your Command Center<br />
            <span className="text-[#2BB673]">For Everything.</span>
          </h1>
          <p className="text-slate-400 text-lg leading-relaxed mb-10">
            Manage merchants, partners, commissions, and growth — all from one secure dashboard.
          </p>

          <div className="space-y-4">
            {[
              { icon: BarChart2, label: 'CRM & Sales Pipeline', desc: 'Track every merchant and partner in real time' },
              { icon: Users, label: 'Partner Management', desc: 'Approvals, commissions, territories, and payouts' },
              { icon: ShieldCheck, label: 'Full Admin Access', desc: 'Every tool, every report, every setting' },
            ].map(item => (
              <div key={item.label} className="flex items-start gap-4">
                <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
                  <item.icon className="w-5 h-5 text-[#2BB673]" />
                </div>
                <div>
                  <div className="font-semibold text-white text-sm">{item.label}</div>
                  <div className="text-slate-500 text-sm">{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="text-xs text-slate-600">
          © 2026 Local-Link Marketplace · Authorized personnel only · All activity is logged
        </div>
      </div>

      {/* Right panel — login form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">

          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-8">
            <img src="/local-link_marketplace_logo.png" alt="Local-Link" className="h-10 w-auto mx-auto mb-4 opacity-90" />
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-1">Team Sign In</h2>
            <p className="text-slate-400 text-sm">Sign in with your Local-Link team account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Email address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-500 w-[18px] h-[18px]" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  placeholder="you@local-link.com"
                  className="w-full bg-white/5 border border-white/10 text-white placeholder-slate-600 rounded-xl px-4 py-3 pl-10 text-sm focus:outline-none focus:ring-2 focus:ring-[#2BB673]/40 focus:border-[#2BB673]/50 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 w-[18px] h-[18px]" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  placeholder="Your password"
                  className="w-full bg-white/5 border border-white/10 text-white placeholder-slate-600 rounded-xl px-4 py-3 pl-10 pr-11 text-sm focus:outline-none focus:ring-2 focus:ring-[#2BB673]/40 focus:border-[#2BB673]/50 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3.5 bg-[#2BB673] text-white font-bold rounded-xl hover:bg-[#25a062] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-[#2BB673]/20 text-sm"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign In to CRM
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-white/5 space-y-3">
            <p className="text-xs text-slate-600 text-center">
              First time? Your account was created by the system admin.
              Use <span className="text-slate-400 font-medium">Forgot Password</span> in Supabase to set your password.
            </p>
            <div className="text-center">
              <Link to="/admin/login" className="text-xs text-slate-500 hover:text-slate-300 transition-colors underline underline-offset-2">
                Admin panel login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

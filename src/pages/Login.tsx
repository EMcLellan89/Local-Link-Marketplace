import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card, { CardBody, CardHeader } from '../components/ui/Card';
import { isBypassEnabled } from '../lib/bypassMode';

export default function Login() {
  const navigate = useNavigate();
  const { signIn, user } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const bypassMode = isBypassEnabled();

  useEffect(() => {
    if (bypassMode && user) {
      setTimeout(() => {
        navigate('/deals');
      }, 1000);
    }
  }, [bypassMode, user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signIn(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError('Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2BB673] to-[#25a062] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center mb-4">
            <span className="text-5xl font-bold text-white drop-shadow-lg">
              Local-Link
            </span>
          </div>
          <p className="text-white/90 text-lg">Local Deals. Local Loyalty. Local Savings.</p>
        </div>

        <Card variant="elevated">
          <CardHeader>
            <h2 className="text-2xl font-bold text-slate-900">Sign In</h2>
            <p className="text-slate-600 mt-1">Welcome back to your account</p>
          </CardHeader>
          <CardBody>
            <form onSubmit={handleSubmit} className="space-y-4">
              {bypassMode && (
                <div className="bg-emerald-50 border-2 border-emerald-500 text-emerald-800 px-4 py-3 rounded-lg animate-pulse">
                  <div className="font-bold mb-1">🎉 Bypass Mode Active!</div>
                  <div className="text-sm">No login required - redirecting to your dashboard...</div>
                </div>
              )}

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}

              <Input
                type="email"
                label="Email Address"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <Input
                type="password"
                label="Password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <Button type="submit" fullWidth disabled={loading}>
                {loading ? 'Signing in...' : 'Sign In'}
              </Button>

              <div className="text-center text-sm text-slate-600">
                Don't have an account?{' '}
                <a href="/register" className="text-[#2BB673] hover:underline font-medium">
                  Sign up
                </a>
              </div>
            </form>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}

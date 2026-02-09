import { ReactNode, useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import {
  LogOut, Users, Package, Target, TrendingUp, GraduationCap,
  FileText, Briefcase, DollarSign, Settings, Menu, X,
  BarChart3, MapPin, Award, BookOpen, Bot, Phone, Mail, MessageCircle, Zap
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../ui/Button';
import BackButton from '../ui/BackButton';

interface PartnerHubLayoutProps {
  children: ReactNode;
}

interface NavItem {
  to: string;
  icon: typeof Users;
  label: string;
  badge?: string;
}

export default function PartnerHubLayout({ children }: PartnerHubLayoutProps) {
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  const partnerNavItems: NavItem[] = [
    { to: '/partner/dashboard', icon: Target, label: 'Dashboard' },
    { to: '/partner/crm', icon: Users, label: 'CRM', badge: 'NEW' },
    { to: '/partner/executive-solutions', icon: TrendingUp, label: 'Executive Solutions', badge: 'NEW' },
    { to: '/partner/playbooks', icon: Zap, label: 'Partner Playbooks' },
    { to: '/partner/products', icon: Package, label: 'Product Catalog' },
    { to: '/partner/ai-bots', icon: Bot, label: 'AI Bots Marketplace', badge: 'NEW' },
    { to: '/partner/earnings', icon: DollarSign, label: 'Commissions & Payouts' },
    { to: '/partner/leaderboard', icon: Award, label: 'Leaderboard', badge: 'NEW' },
    { to: '/partner/territories', icon: MapPin, label: 'Territories' },
    { to: '/partner/analytics', icon: BarChart3, label: 'Analytics', badge: 'NEW' },
    { to: '/partner/contracts', icon: FileText, label: 'Contracts & Docs' },
    { to: '/partner/ai-prompts', icon: Briefcase, label: 'AI Prompt Library', badge: 'NEW' },
    { to: '/partner/communications', icon: Phone, label: 'Communications Hub', badge: 'NEW' },
    { to: '/partner/business-coach', icon: MessageCircle, label: 'Business Coach', badge: 'NEW' },
    { to: '/partner/job-board', icon: Target, label: 'Job Board', badge: 'NEW' },
    { to: '/partner/accounting-pro', icon: BarChart3, label: 'Accounting Pro', badge: 'NEW' },
  ];

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top Navigation Bar */}
      <nav className="bg-white border-b border-slate-200 fixed top-0 left-0 right-0 z-50">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 rounded-md text-slate-600 hover:text-slate-900 hover:bg-slate-100 mr-2"
              >
                {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
              <Link to="/" className="flex-shrink-0 flex items-center">
                <span className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                  Local-Link
                </span>
                <span className="hidden sm:inline ml-2 px-2 py-1 text-xs font-semibold bg-[#2BB673]/10 text-[#2BB673] rounded">
                  Partner Hub
                </span>
              </Link>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <div className="hidden sm:block text-sm text-slate-600">
                {profile?.first_name || profile?.role || 'Partner'}
              </div>
              <Button variant="ghost" size="sm" onClick={handleSignOut}>
                <LogOut className="w-4 h-4 sm:mr-2" />
                <span className="hidden sm:inline">Sign Out</span>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex pt-16">
        {/* Left Sidebar Navigation */}
        <aside
          className={`fixed left-0 top-16 bottom-0 bg-white border-r border-slate-200 transition-all duration-300 overflow-y-auto z-40 ${
            sidebarOpen ? 'w-64' : 'w-0 -translate-x-full'
          }`}
        >
          <nav className="px-3 py-4 space-y-1">
            {partnerNavItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.to);

              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    active
                      ? 'bg-[#2BB673]/10 text-[#2BB673]'
                      : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <Icon className={`w-5 h-5 mr-3 ${active ? 'text-[#2BB673]' : 'text-slate-400'}`} />
                  <span className="flex-1">{item.label}</span>
                  {item.badge && (
                    <span className="ml-2 px-2 py-0.5 text-xs font-semibold bg-[#F5B82E] text-white rounded">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Partner Upgrade CTA */}
          <div className="p-4 m-3 bg-gradient-to-br from-[#2BB673] to-[#25a062] rounded-lg">
            <h3 className="text-sm font-bold text-white mb-1">Scale Your Territory</h3>
            <p className="text-xs text-white/90 mb-3">
              Upgrade to Master Partner for higher commissions
            </p>
            <button
              onClick={() => navigate('/partner/onboarding')}
              className="w-full px-3 py-1.5 text-sm font-bold bg-white text-[#2BB673] hover:bg-slate-50 rounded-lg transition-colors"
            >
              Upgrade Now
            </button>
          </div>

          {/* Admin Login */}
          <div className="p-3 m-3 border-t border-slate-200">
            <Link
              to="/admin/login"
              className="flex items-center px-3 py-2 text-sm font-medium text-slate-600 hover:text-[#2BB673] hover:bg-slate-50 rounded-lg transition-colors"
            >
              <Settings className="w-4 h-4 mr-2" />
              Admin Login
            </Link>
          </div>
        </aside>

        {/* Main Content Area */}
        <main
          className={`flex-1 transition-all duration-300 w-full ${
            sidebarOpen ? 'md:ml-64' : 'ml-0'
          }`}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-4">
              <BackButton />
            </div>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

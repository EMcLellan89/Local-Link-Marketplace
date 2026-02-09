import { ReactNode, useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import {
  LogOut, Store, ShoppingBag, Users,
  Bot, FileText, Globe, Target, Phone,
  CreditCard, Briefcase, UserPlus, Mail, Settings,
  LayoutDashboard, Megaphone, ArrowLeftRight, Menu, X, Printer,
  Star, BarChart3, FileStack, HelpCircle, Video, GraduationCap, MessageCircle, TrendingUp
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../ui/Button';
import BackButton from '../ui/BackButton';

interface BusinessHubLayoutProps {
  children: ReactNode;
}

interface NavItem {
  to: string;
  icon: typeof Store;
  label: string;
  badge?: string;
  submenu?: NavItem[];
}

export default function BusinessHubLayout({ children }: BusinessHubLayoutProps) {
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  const merchantNavItems: NavItem[] = [
    { to: '/merchant/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/academy', icon: GraduationCap, label: 'Local-Link Academy', badge: 'NEW' },
    { to: '/merchant/executive-solutions', icon: TrendingUp, label: 'Executive Solutions', badge: 'NEW' },
    { to: '/merchant/deals', icon: ShoppingBag, label: 'Deals & Promotions' },
    { to: '/merchant/reviews', icon: Star, label: 'Reviews & Ratings', badge: 'NEW' },
    { to: '/merchant/analytics', icon: BarChart3, label: 'Analytics', badge: 'NEW' },
    { to: '/merchant/marketing', icon: Megaphone, label: 'Marketing', badge: 'NEW' },
    { to: '/merchant/crm', icon: Users, label: 'CRM', badge: 'NEW' },
    { to: '/marketplace/financial-engine', icon: FileStack, label: 'AI Bookkeeping Services', badge: 'NEW' },
    { to: '/merchant/invoices', icon: FileText, label: 'Invoicing', badge: 'NEW' },
    { to: '/merchant/crm-migration', icon: ArrowLeftRight, label: 'CRM Migration', badge: 'NEW' },
    { to: '/merchant/ai-bots', icon: Bot, label: 'AI & Automations', badge: 'NEW' },
    { to: '/merchant/swipe-file', icon: FileText, label: 'Ad Swipe File', badge: 'NEW' },
    { to: '/merchant/websites', icon: Globe, label: 'Website Services' },
    { to: '/merchant/printing', icon: Printer, label: 'Printing Services', badge: 'NEW' },
    { to: '/merchant/ugc-orders', icon: Video, label: 'UGC Content', badge: 'NEW' },
    { to: '/merchant/leads', icon: Target, label: 'Leads & Outreach' },
    { to: '/merchant/appointment-setting', icon: Bot, label: 'AI Appointment Booking' },
    { to: '/merchant/hire', icon: Briefcase, label: 'Hire Remote Workers', badge: 'NEW' },
    { to: '/merchant/loyalty', icon: Mail, label: 'Drive Repeat Business' },
    { to: '/merchant/merchant-services', icon: CreditCard, label: 'Merchant Services' },
    { to: '/merchant/capital', icon: Briefcase, label: 'Business Capital' },
    { to: '/merchant/recruiting', icon: UserPlus, label: 'Recruiting Tools' },
    { to: '/merchant/postcards', icon: Megaphone, label: 'Postcard Advertising' },
    { to: '/merchant/payment-settings', icon: CreditCard, label: 'Payment Settings', badge: 'NEW' },
    { to: '/merchant/business-coach', icon: MessageCircle, label: 'Business Coach', badge: 'NEW' },
    { to: '/merchant/support', icon: HelpCircle, label: 'Support' },
    { to: '/merchant/settings', icon: Settings, label: 'Settings' },
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
                  Business Hub
                </span>
              </Link>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <div className="hidden sm:block text-sm text-slate-600">
                {profile?.first_name || profile?.role || 'User'}
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
            {merchantNavItems.map((item) => {
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

          {/* Upgrade CTA in Sidebar */}
          <div className="p-4 m-3 bg-gradient-to-br from-[#2BB673] to-[#25a062] rounded-lg">
            <h3 className="text-sm font-bold text-white mb-1">Upgrade to Scale</h3>
            <p className="text-xs text-white/90 mb-3">
              Get all features + priority support
            </p>
            <button
              onClick={() => navigate('/merchant/upgrade')}
              className="w-full px-3 py-1.5 text-sm font-bold bg-white text-[#2BB673] hover:bg-slate-50 rounded-lg transition-colors"
            >
              Let's Go
            </button>
          </div>

          {/* Internal Team Login */}
          <div className="p-3 m-3 border-t border-slate-200">
            <Link
              to="/internal/login"
              className="flex items-center px-3 py-2 text-sm font-medium text-slate-600 hover:text-[#2BB673] hover:bg-slate-50 rounded-lg transition-colors"
            >
              <Settings className="w-4 h-4 mr-2" />
              Internal Team Login
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

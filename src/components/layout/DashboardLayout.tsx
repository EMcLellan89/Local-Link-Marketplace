import { ReactNode, useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { LogOut, Store, ShoppingBag, Shield, User, Heart, Menu, X } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../ui/Button';
import BackButton from '../ui/BackButton';

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  const getNavLinks = () => {
    if (!profile) return [];

    switch (profile.role) {
      case 'customer':
        return [
          { to: '/dashboard', icon: ShoppingBag, label: 'Browse Deals' },
          { to: '/favorites', icon: Heart, label: 'Favorites' },
          { to: '/purchases', icon: ShoppingBag, label: 'My Purchases' },
          { to: '/profile', icon: User, label: 'Profile' },
        ];
      case 'merchant':
        return [
          { to: '/merchant/dashboard', icon: Store, label: 'Dashboard' },
          { to: '/merchant/deals', icon: ShoppingBag, label: 'My Deals' },
        ];
      case 'admin':
        return [
          { to: '/admin/dashboard', icon: Shield, label: 'Admin Dashboard' },
        ];
      default:
        return [];
    }
  };

  const navLinks = getNavLinks();

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="sm:hidden p-2 rounded-md text-slate-600 hover:text-slate-900 hover:bg-slate-100 mr-2"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
              <Link to="/" className="flex-shrink-0 flex items-center">
                <img
                  src="/image.png"
                  alt="Local Link Marketplace"
                  className="h-10 w-auto"
                />
              </Link>
              <div className="hidden sm:ml-8 sm:flex sm:space-x-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`inline-flex items-center px-3 py-2 text-sm font-medium transition-colors ${
                      location.pathname === link.to
                        ? 'text-[#2BB673] border-b-2 border-[#2BB673]'
                        : 'text-slate-700 hover:text-[#2BB673]'
                    }`}
                  >
                    <link.icon className="w-4 h-4 mr-2" />
                    {link.label}
                  </Link>
                ))}
              </div>
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

        {mobileMenuOpen && (
          <div className="sm:hidden border-t border-slate-200 bg-white">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center px-3 py-2 rounded-md text-base font-medium transition-colors ${
                    location.pathname === link.to
                      ? 'bg-[#2BB673]/10 text-[#2BB673]'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <link.icon className="w-5 h-5 mr-3" />
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-4">
          <BackButton />
        </div>
        {children}
      </main>
    </div>
  );
}

import { ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useInternalTeamAuth } from '../../contexts/InternalTeamAuthContext';
import {
  Users,
  DollarSign,
  FileText,
  LifeBuoy,
  BarChart3,
  Building2,
  LogOut,
  Bell,
  Search,
  Key,
  Mail,
  AlertTriangle,
} from 'lucide-react';
import Button from '../ui/Button';
import { DEV_MODE } from '../../lib/devMode';
import BackButton from '../ui/BackButton';

interface InternalCRMLayoutProps {
  children: ReactNode;
}

export function InternalCRMLayout({ children }: InternalCRMLayoutProps) {
  const { teamMember, signOut, isRole } = useInternalTeamAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const navigation = [
    { name: 'Dashboard', href: '/internal/dashboard', icon: BarChart3 },
    { name: 'Customers', href: '/internal/customers', icon: Users },
    { name: 'Sales', href: '/internal/sales', icon: DollarSign },
    { name: 'Invoices', href: '/internal/invoices', icon: FileText },
    { name: 'Support', href: '/internal/support', icon: LifeBuoy },
    { name: 'Businesses', href: '/internal/businesses', icon: Building2 },
  ];

  const accountingNav = [
    { name: 'Accounting', href: '/internal/accounting', icon: FileText },
  ];

  const adminNav = [
    { name: 'API Integration', href: '/internal/api-integration', icon: Key },
    { name: 'Marketing', href: '/internal/marketing', icon: Mail },
  ];

  async function handleSignOut() {
    await signOut();
    navigate('/internal/login');
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Dev Mode Warning Banner */}
      {DEV_MODE && (
        <div className="bg-red-600 text-white px-4 py-2">
          <div className="max-w-7xl mx-auto flex items-center justify-center space-x-2">
            <AlertTriangle className="w-5 h-5" />
            <span className="font-semibold">DEV MODE ENABLED</span>
            <span className="text-red-100">|</span>
            <span className="text-sm">Authentication bypassed - All data is mocked</span>
          </div>
        </div>
      )}

      {/* Top Navigation Bar */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo and Title */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Internal CRM</h1>
                  <p className="text-xs text-gray-500">Team Dashboard</p>
                </div>
              </div>
            </div>

            {/* Search Bar */}
            <div className="flex-1 max-w-2xl mx-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search customers, sales, tickets..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-4">
              <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              <div className="flex items-center space-x-3 pl-4 border-l border-gray-200">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{teamMember?.full_name}</p>
                  <p className="text-xs text-gray-500 capitalize">{teamMember?.role}</p>
                </div>
                <Button
                  onClick={handleSignOut}
                  variant="ghost"
                  size="sm"
                  className="text-gray-600"
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Sub Navigation */}
        <div className="border-t border-gray-200">
          <div className="px-4 sm:px-6 lg:px-8">
            <nav className="flex space-x-1 py-2">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`
                      flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors
                      ${isActive
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                      }
                    `}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}

              {isRole('admin', 'accountant', 'manager') && accountingNav.map((item) => {
                const isActive = location.pathname === item.href;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`
                      flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors
                      ${isActive
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                      }
                    `}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}

              {isRole('admin', 'manager', 'developer') && adminNav.map((item) => {
                const isActive = location.pathname === item.href;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`
                      flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors
                      ${isActive
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                      }
                    `}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="py-8">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="mb-4">
            <BackButton />
          </div>
          {children}
        </div>
      </main>

      {/* Bottom Quick Access Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-3 shadow-lg">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link
              to="/internal/customers/new"
              className="text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              + New Customer
            </Link>
            <Link
              to="/internal/invoices/new"
              className="text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              + New Invoice
            </Link>
            <Link
              to="/internal/support/new"
              className="text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              + New Ticket
            </Link>
          </div>
          <div className="text-xs text-gray-500">
            Press <kbd className="px-2 py-1 bg-gray-100 rounded">Ctrl</kbd> + <kbd className="px-2 py-1 bg-gray-100 rounded">K</kbd> for quick search
          </div>
        </div>
      </div>
    </div>
  );
}

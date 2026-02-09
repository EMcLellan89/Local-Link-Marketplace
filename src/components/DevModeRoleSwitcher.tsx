import { Users, Store, Briefcase, Shield } from 'lucide-react';
import { DEV_MODE, getDevRole, setDevRole, type DevRole } from '../lib/devMode';

export default function DevModeRoleSwitcher() {
  if (!DEV_MODE) return null;

  const currentRole = getDevRole();

  // Add padding to body to prevent content from being hidden
  if (typeof document !== 'undefined') {
    document.body.style.paddingTop = '60px';
  }

  const roles: { value: DevRole; label: string; icon: typeof Users; color: string }[] = [
    { value: 'customer', label: 'Customer', icon: Users, color: 'bg-blue-600' },
    { value: 'merchant', label: 'Merchant', icon: Store, color: 'bg-[#2BB673]' },
    { value: 'partner', label: 'Partner', icon: Briefcase, color: 'bg-orange-600' },
    { value: 'admin', label: 'Admin', icon: Shield, color: 'bg-red-600' },
  ];

  return (
    <div className="fixed top-0 left-0 right-0 z-[9999] bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-2">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm">DEV MODE</span>
            <span className="text-xs opacity-90">Switch Roles:</span>
          </div>

          <div className="flex items-center gap-2">
            {roles.map((role) => {
              const Icon = role.icon;
              const isActive = currentRole === role.value;

              return (
                <button
                  key={role.value}
                  onClick={() => setDevRole(role.value)}
                  className={`
                    flex items-center gap-2 px-3 py-1.5 rounded-lg font-medium text-sm
                    transition-all duration-200
                    ${isActive
                      ? `${role.color} text-white shadow-lg scale-105`
                      : 'bg-white/20 hover:bg-white/30 text-white'
                    }
                  `}
                >
                  <Icon className="w-4 h-4" />
                  {role.label}
                </button>
              );
            })}
          </div>

          <div className="text-xs opacity-90 hidden sm:block">
            Click a role to switch dashboards
          </div>
        </div>
      </div>
    </div>
  );
}

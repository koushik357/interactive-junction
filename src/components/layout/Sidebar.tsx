
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  BarChart3, 
  DollarSign, 
  FileText, 
  Home, 
  LayoutDashboard, 
  LucideIcon, 
  ShieldCheck, 
  UserRound,
  ChevronLeft,
  ChevronRight,
  Settings
} from 'lucide-react';

interface SidebarProps {
  collapsed: boolean;
}

interface NavItemProps {
  to: string;
  icon: LucideIcon;
  label: string;
  collapsed: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ to, icon: Icon, label, collapsed }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 
        ${isActive 
          ? 'bg-primary text-primary-foreground' 
          : 'text-sidebar-foreground hover:bg-sidebar-accent'
        }
        ${collapsed ? 'justify-center' : 'justify-start'}
      `}
    >
      <Icon size={20} />
      {!collapsed && <span className="font-medium">{label}</span>}
    </Link>
  );
};

export const Sidebar: React.FC<SidebarProps> = ({ collapsed }) => {
  const navItems = [
    { to: '/', icon: Home, label: 'Home' },
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/recruitment', icon: UserRound, label: 'Recruitment' },
    { to: '/payroll', icon: DollarSign, label: 'Payroll' },
    { to: '/billing', icon: FileText, label: 'Billing' },
    { to: '/sales', icon: BarChart3, label: 'Sales' },
    { to: '/sla', icon: ShieldCheck, label: 'SLA Compliance' },
  ];

  return (
    <aside
      className={`bg-sidebar h-screen border-r border-sidebar-border transition-all duration-300 ease-in-out
        ${collapsed ? 'w-[70px]' : 'w-[240px]'}
      `}
    >
      <div className="flex flex-col h-full">
        <div className={`h-16 flex items-center px-4 border-b border-sidebar-border ${collapsed ? 'justify-center' : 'justify-start'}`}>
          {!collapsed && (
            <div className="text-xl font-semibold text-primary">AI Analytics</div>
          )}
          {collapsed && (
            <div className="text-xl font-semibold text-primary">AI</div>
          )}
        </div>
        
        <nav className="flex-1 py-4 px-3 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => (
            <NavItem
              key={item.to}
              to={item.to}
              icon={item.icon}
              label={item.label}
              collapsed={collapsed}
            />
          ))}
        </nav>
        
        <div className="p-3 border-t border-sidebar-border">
          <NavItem
            to="/settings"
            icon={Settings}
            label="Settings"
            collapsed={collapsed}
          />
        </div>
      </div>
    </aside>
  );
};

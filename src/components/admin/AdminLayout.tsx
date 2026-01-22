import { Link, Outlet, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  CreditCard, 
  MessageCircle, 
  Webhook, 
  FileText, 
  Settings,
  LogOut,
  Shield,
  Mail,
  FolderOpen,
  BarChart3,
  FileCheck,
  Tag
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export default function AdminLayout() {
  const location = useLocation();
  const { user, signOut } = useAuth();

  const navItems = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
    { path: '/admin/reports', label: 'Reports', icon: FileCheck },
    { path: '/admin/users', label: 'Users', icon: Users },
    { path: '/admin/purchases', label: 'Purchases', icon: CreditCard },
    { path: '/admin/discounts', label: 'Discounts', icon: Tag },
    { path: '/admin/documents', label: 'Documents', icon: FolderOpen },
    { path: '/admin/support', label: 'Support', icon: MessageCircle },
    { path: '/admin/webhooks', label: 'Webhooks', icon: Webhook },
    { path: '/admin/audit-log', label: 'Audit Log', icon: FileText },
    { path: '/admin/settings', label: 'Settings', icon: Settings },
  ];

  const isActive = (path: string) => location.pathname.startsWith(path);

  return (
    <div className="flex h-screen bg-neutral-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-border flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-border">
          <Link to="/admin/dashboard" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <div className="font-semibold text-foreground">YieldPulse</div>
              <div className="text-xs text-neutral-500">Admin Panel</div>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`
                  flex items-center space-x-3 px-3 py-2 rounded-lg mb-1 transition-colors
                  ${active 
                    ? 'bg-primary text-primary-foreground' 
                    : 'text-neutral-600 hover:bg-neutral-100'
                  }
                `}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* User Info */}
        <div className="p-4 border-t border-border">
          <div className="text-sm text-neutral-600 mb-2 truncate">{user?.email}</div>
          <div className="flex items-center justify-between">
            <Link
              to="/dashboard"
              className="text-sm text-neutral-600 hover:text-foreground transition-colors"
            >
              User View
            </Link>
            <button
              onClick={signOut}
              className="flex items-center space-x-1 text-neutral-600 hover:text-foreground text-sm transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}

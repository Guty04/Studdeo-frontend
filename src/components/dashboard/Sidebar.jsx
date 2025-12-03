import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { LayoutDashboard, BookOpen, Users, GraduationCap } from 'lucide-react';
import { ROLES } from '@/routes/routes.jsx';

const Sidebar = ({ user }) => {
  const location = useLocation();

  const menuItems = [
    {
      path: '/dashboard',
      icon: LayoutDashboard,
      label: 'Resumen',
      roles: [ROLES.ADMIN, ROLES.TEACHER]
    },
    {
      path: '/dashboard/classes',
      icon: BookOpen,
      label: 'Cursos',
      roles: [ROLES.ADMIN, ROLES.TEACHER]
    },
    {
      path: '/dashboard/metrics',
      icon: LayoutDashboard,
      label: 'Métricas',
      roles: [ROLES.ADMIN, ROLES.TEACHER]
    },
    {
      path: '/dashboard/students',
      icon: GraduationCap,
      label: 'Estudiantes',
      roles: [ROLES.ADMIN, ROLES.TEACHER]
    },
    {
      path: '/dashboard/teachers',
      icon: Users,
      label: 'Ventas',
      roles: [ROLES.ADMIN]
    },
  ];

  const visibleMenuItems = menuItems.filter(item => 
    item.roles.includes(user?.role)
  );

  const isActive = (path) => location.pathname === path;

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-violet-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">S</span>
          </div>
          <span className="text-xl font-semibold text-gray-900">Studdeo</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <div className="space-y-1">
          {visibleMenuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                  active 
                    ? "bg-gray-100 text-gray-900" 
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                )}
              >
                <Icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;

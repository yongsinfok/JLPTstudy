import { Link, useLocation } from 'react-router-dom';
import { Home, BookOpen, Trophy, Target, Settings, ClipboardList } from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', icon: Home, label: '首页' },
    { path: '/lessons', icon: BookOpen, label: '课程' },
    { path: '/practice', icon: ClipboardList, label: '练习' },
    { path: '/progress', icon: Trophy, label: '进度' },
    { path: '/achievements', icon: Target, label: '成就' },
    { path: '/settings', icon: Settings, label: '设置' },
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-200 h-[calc(100vh-64px)] fixed left-0 top-16 overflow-y-auto hidden lg:block">
      <nav className="p-4">
        <ul className="space-y-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-primary-light text-primary font-medium'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <item.icon size={20} />
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;

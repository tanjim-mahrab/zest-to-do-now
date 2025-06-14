
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { CheckCircle, Calendar, FolderOpen, Settings } from 'lucide-react';

const BottomNavigation = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    {
      label: 'Tasks',
      icon: CheckCircle,
      path: '/',
      active: location.pathname === '/',
    },
    {
      label: 'Calendar',
      icon: Calendar,
      path: '/calendar',
      active: location.pathname === '/calendar',
    },
    {
      label: 'Projects',
      icon: FolderOpen,
      path: '/projects',
      active: location.pathname === '/projects',
    },
    {
      label: 'Settings',
      icon: Settings,
      path: '/settings',
      active: location.pathname === '/settings',
    },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-black z-10">
      <div className="flex items-center justify-around px-6 py-2">
        {navItems.map((item) => (
          <Button
            key={item.path}
            variant="ghost"
            size="sm"
            onClick={() => navigate(item.path)}
            className={`flex flex-col items-center gap-1 px-4 py-3 rounded-xl transition-all duration-200 ${
              item.active 
                ? 'text-white bg-black' 
                : 'text-black hover:text-white hover:bg-black'
            }`}
          >
            <item.icon className={`w-5 h-5 ${
              item.active ? 'text-white' : 'text-black'
            }`} />
            <span className={`text-xs font-medium ${
              item.active ? 'text-white' : 'text-black'
            }`}>
              {item.label}
            </span>
          </Button>
        ))}
      </div>
    </div>
  );
};

export default BottomNavigation;

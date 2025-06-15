
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
    },
    {
      label: 'Calendar',
      icon: Calendar,
      path: '/calendar',
    },
    {
      label: 'Projects',
      icon: FolderOpen,
      path: '/projects',
    },
    {
      label: 'Settings',
      icon: Settings,
      path: '/settings',
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-16 bg-background/95 backdrop-blur-sm border-t border-border z-50 animate-slide-up">
      <div className="grid grid-cols-4 h-full max-w-sm mx-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Button
              key={item.path}
              variant="ghost"
              onClick={() => navigate(item.path)}
              className={`
                flex flex-col items-center justify-center h-full rounded-none
                gap-1 transition-colors duration-200
                ${isActive ? 'text-foreground' : 'text-muted-foreground'}
              `}
            >
              <item.icon className="w-5 h-5" />
              <span className={`text-xs ${isActive ? 'font-semibold' : 'font-medium'}`}>
                {item.label}
              </span>
            </Button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNavigation;

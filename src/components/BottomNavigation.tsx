
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
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-black z-50 animate-slide-up">
      <div className="flex items-center justify-between px-4 py-3 max-w-sm mx-auto">
        {navItems.map((item, index) => (
          <Button
            key={item.path}
            variant="ghost"
            size="sm"
            onClick={() => navigate(item.path)}
            className={`
              relative flex flex-col items-center justify-center gap-1 p-3 
              rounded-2xl transition-all duration-300 ease-out
              hover:scale-110 hover:bg-black hover:text-white
              ${item.active 
                ? 'bg-black text-white scale-105 shadow-lg' 
                : 'text-black hover:shadow-md'
              }
              animate-scale-in
            `}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            {/* Active indicator */}
            {item.active && (
              <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-white rounded-full animate-bounce-check" />
            )}
            
            <item.icon className={`
              w-5 h-5 transition-all duration-300
              ${item.active ? 'text-white scale-110' : 'text-black'}
            `} />
            
            <span className={`
              text-xs font-medium transition-all duration-300
              ${item.active ? 'text-white font-semibold' : 'text-black'}
            `}>
              {item.label}
            </span>
            
            {/* Ripple effect on active */}
            {item.active && (
              <div className="absolute inset-0 rounded-2xl bg-white opacity-10 animate-pulse" />
            )}
          </Button>
        ))}
      </div>
      
      {/* Subtle gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent pointer-events-none" />
    </div>
  );
};

export default BottomNavigation;


import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { useAuth } from '@/contexts/AuthContext';
import { useTask } from '@/contexts/TaskContext';
import { User, Bell, Palette, Download, LogOut, Trash2 } from 'lucide-react';
import BottomNavigation from '@/components/BottomNavigation';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

const Settings = () => {
  const { user, logout } = useAuth();
  const { tasks } = useTask();
  const navigate = useNavigate();

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to log out?')) {
      logout();
      navigate('/welcome');
      toast.success('Logged out successfully');
    }
  };

  const handleExportData = () => {
    const data = {
      tasks,
      exportDate: new Date().toISOString(),
      totalTasks: tasks.length,
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `taskflow-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success('Data exported successfully');
  };

  const handleClearData = () => {
    if (window.confirm(
      'Are you sure you want to clear all data? This action cannot be undone. Consider exporting your data first.'
    )) {
      localStorage.clear();
      toast.success('All data cleared successfully');
      window.location.reload();
    }
  };

  const settingsSections = [
    {
      title: 'Account',
      items: [
        {
          icon: User,
          label: 'Profile',
          description: user?.email,
          action: () => toast.info('Profile editing coming soon!'),
        },
      ],
    },
    {
      title: 'Preferences',
      items: [
        {
          icon: Bell,
          label: 'Notifications',
          description: 'Manage notification settings',
          action: () => toast.info('Notification settings coming soon!'),
        },
        {
          icon: Palette,
          label: 'Theme',
          description: 'Choose your preferred theme',
          action: () => toast.info('Theme settings coming soon!'),
        },
      ],
    },
    {
      title: 'Data',
      items: [
        {
          icon: Download,
          label: 'Export Data',
          description: 'Download your tasks as JSON',
          action: handleExportData,
        },
        {
          icon: Trash2,
          label: 'Clear All Data',
          description: 'Remove all tasks and projects',
          action: handleClearData,
          danger: true,
        },
      ],
    },
  ];

  const stats = [
    { label: 'Total Tasks', value: tasks.length },
    { label: 'Completed', value: tasks.filter(t => t.completed).length },
    { label: 'Active', value: tasks.filter(t => !t.completed).length },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50/30 via-blue-50/30 to-pink-50/30 pb-20">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 sticky top-0 z-10">
        <div className="px-6 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600">Manage your account and preferences</p>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-6 space-y-6">
        {/* User Stats */}
        <Card className="p-6 border-0 bg-white/60 backdrop-blur-sm animate-scale-in">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Your Progress</h2>
          <div className="grid grid-cols-3 gap-4">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-2xl font-bold text-purple-600">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </Card>

        {/* Settings Sections */}
        {settingsSections.map((section, sectionIndex) => (
          <Card 
            key={section.title}
            className="border-0 bg-white/60 backdrop-blur-sm animate-slide-up"
            style={{ animationDelay: `${sectionIndex * 0.1}s` }}
          >
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">{section.title}</h2>
              <div className="space-y-1">
                {section.items.map((item, itemIndex) => (
                  <Button
                    key={itemIndex}
                    variant="ghost"
                    onClick={item.action}
                    className={`w-full justify-start h-auto p-4 rounded-xl hover:bg-gray-50 ${
                      item.danger ? 'hover:text-red-600 hover:bg-red-50' : ''
                    }`}
                  >
                    <div className="flex items-center gap-3 w-full">
                      <item.icon className={`w-5 h-5 ${
                        item.danger ? 'text-red-500' : 'text-gray-500'
                      }`} />
                      <div className="flex-1 text-left">
                        <div className={`font-medium ${
                          item.danger ? 'text-red-600' : 'text-gray-900'
                        }`}>
                          {item.label}
                        </div>
                        <div className="text-sm text-gray-500">{item.description}</div>
                      </div>
                    </div>
                  </Button>
                ))}
              </div>
            </div>
          </Card>
        ))}

        {/* Logout Button */}
        <Card className="border-0 bg-white/60 backdrop-blur-sm animate-slide-up">
          <div className="p-6">
            <Button
              onClick={handleLogout}
              variant="ghost"
              className="w-full justify-start h-auto p-4 rounded-xl hover:text-red-600 hover:bg-red-50"
            >
              <div className="flex items-center gap-3">
                <LogOut className="w-5 h-5 text-red-500" />
                <div className="text-left">
                  <div className="font-medium text-red-600">Log Out</div>
                  <div className="text-sm text-gray-500">Sign out of your account</div>
                </div>
              </div>
            </Button>
          </div>
        </Card>

        {/* App Info */}
        <div className="text-center text-sm text-gray-500 space-y-1">
          <p>TaskFlow v1.0.0</p>
          <p>Made with ❤️ for productivity enthusiasts</p>
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
};

export default Settings;

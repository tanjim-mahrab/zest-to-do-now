
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useTask } from '@/contexts/TaskContext';
import { User, Bell, Download, LogOut, Trash2, Shield, HelpCircle, Info, BarChart3 } from 'lucide-react';
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

  const stats = [
    { label: 'Total Tasks', value: tasks.length, icon: BarChart3 },
    { label: 'Completed', value: tasks.filter(t => t.completed).length, icon: Shield },
    { label: 'Active', value: tasks.filter(t => !t.completed).length, icon: Info },
  ];

  const settingsSections = [
    {
      title: 'Account',
      items: [
        {
          icon: User,
          label: 'Profile Settings',
          description: user?.email || 'Manage your account',
          action: () => toast.info('Profile editing coming soon!'),
        },
        {
          icon: Bell,
          label: 'Notifications',
          description: 'Push notifications & reminders',
          action: () => toast.info('Notification settings coming soon!'),
        },
      ],
    },
    {
      title: 'Data Management',
      items: [
        {
          icon: Download,
          label: 'Export Data',
          description: 'Download your tasks as JSON file',
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
    {
      title: 'Support',
      items: [
        {
          icon: HelpCircle,
          label: 'Help & Support',
          description: 'Get help with using TaskFlow',
          action: () => toast.info('Help center coming soon!'),
        },
        {
          icon: Info,
          label: 'About TaskFlow',
          description: 'Version 1.0.0',
          action: () => toast.info('TaskFlow - Built for productivity enthusiasts'),
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Modern Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="px-6 py-6">
          <div className="max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold text-black mb-2">Settings</h1>
            <p className="text-gray-600">Manage your account and app preferences</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-8">
        <div className="max-w-2xl mx-auto space-y-8">
          {/* User Stats - Modern Cards */}
          <div className="grid grid-cols-3 gap-4">
            {stats.map((stat, index) => (
              <Card 
                key={index}
                className="p-6 text-center bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 animate-scale-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center mx-auto mb-3">
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-black mb-1">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </Card>
            ))}
          </div>

          {/* Settings Sections - Modern Layout */}
          {settingsSections.map((section, sectionIndex) => (
            <Card 
              key={section.title}
              className="bg-white border border-gray-200 shadow-sm animate-slide-up overflow-hidden"
              style={{ animationDelay: `${(sectionIndex + 1) * 0.1}s` }}
            >
              <div className="px-6 py-4 border-b border-gray-100">
                <h2 className="text-lg font-semibold text-black">{section.title}</h2>
              </div>
              <div className="divide-y divide-gray-100">
                {section.items.map((item, itemIndex) => (
                  <Button
                    key={itemIndex}
                    variant="ghost"
                    onClick={item.action}
                    className={`w-full justify-start h-auto p-6 rounded-none hover:bg-gray-50 transition-colors duration-200 ${
                      item.danger ? 'hover:bg-red-50' : ''
                    }`}
                  >
                    <div className="flex items-center gap-4 w-full">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        item.danger 
                          ? 'bg-red-100 text-red-600' 
                          : 'bg-gray-100 text-black'
                      }`}>
                        <item.icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1 text-left">
                        <div className={`font-medium text-base ${
                          item.danger ? 'text-red-600' : 'text-black'
                        }`}>
                          {item.label}
                        </div>
                        <div className="text-sm text-gray-500 mt-1">{item.description}</div>
                      </div>
                    </div>
                  </Button>
                ))}
              </div>
            </Card>
          ))}

          {/* Logout Section - Prominent */}
          <Card className="bg-white border border-gray-200 shadow-sm animate-slide-up overflow-hidden">
            <Button
              onClick={handleLogout}
              variant="ghost"
              className="w-full justify-start h-auto p-6 rounded-none hover:bg-red-50 transition-colors duration-200"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <LogOut className="w-5 h-5 text-red-600" />
                </div>
                <div className="text-left">
                  <div className="font-medium text-base text-red-600">Sign Out</div>
                  <div className="text-sm text-gray-500 mt-1">Sign out of your account</div>
                </div>
              </div>
            </Button>
          </Card>

          {/* App Info */}
          <div className="text-center text-sm text-gray-400 space-y-2 pt-4">
            <p>TaskFlow v1.0.0</p>
            <p>Made with ❤️ for productivity enthusiasts</p>
          </div>
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default Settings;

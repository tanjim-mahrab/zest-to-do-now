
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useTask } from '@/contexts/TaskContext';
import { User, Bell, Download, LogOut, Trash2, HelpCircle, Info } from 'lucide-react';
import BottomNavigation from '@/components/BottomNavigation';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { Switch } from '@/components/ui/switch';

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
          label: 'Profile Settings',
          description: user?.email || 'Manage your account',
          action: () => toast.info('Profile editing coming soon!'),
        },
        {
          icon: Bell,
          label: 'Notifications',
          description: 'Push notifications & reminders',
          action: () => {},
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
          action: () => navigate('/help'),
        },
        {
          icon: Info,
          label: 'About TaskFlow',
          description: 'Version 1.0.0',
          action: () => navigate('/about'),
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Modern Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="px-4 sm:px-6 py-6">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-1">Settings</h1>
            <p className="text-gray-500">Manage your account and app preferences</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 sm:px-6 py-8">
        <div className="max-w-3xl mx-auto space-y-8">
          {settingsSections.map((section) => (
            <Card key={section.title}>
              <CardHeader>
                <CardTitle>{section.title}</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-gray-200">
                  {section.items.map((item) => {
                    const itemContent = (
                      <div className="flex items-center gap-4">
                        <div
                          className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                            item.danger
                              ? 'bg-red-100 text-red-600'
                              : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          <item.icon className="h-5 w-5" />
                        </div>
                        <div>
                          <p
                            className={`font-medium ${
                              item.danger ? 'text-red-600' : 'text-gray-800'
                            }`}
                          >
                            {item.label}
                          </p>
                          <p className="text-sm text-gray-500">{item.description}</p>
                        </div>
                      </div>
                    );

                    if (item.label === 'Notifications') {
                      return (
                        <div key={item.label} className="flex items-center justify-between w-full p-4 text-left">
                           {itemContent}
                          <Switch checked disabled />
                        </div>
                      );
                    }

                    return (
                      <button
                        key={item.label}
                        onClick={item.action}
                        className={`flex items-center justify-between w-full p-4 text-left transition-colors ${
                          item.danger
                            ? 'hover:bg-red-50'
                            : 'hover:bg-gray-50'
                        }`}
                      >
                        {itemContent}
                      </button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Logout Section */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center rounded-lg border bg-card text-red-600 shadow-sm p-4 hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-5 h-5 mr-2" />
            <span className="font-medium">Sign Out</span>
          </button>

          {/* App Info */}
          <div className="text-center text-sm text-gray-500 space-y-1 pt-6 pb-4">
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

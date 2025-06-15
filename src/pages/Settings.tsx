import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useTask } from '@/contexts/TaskContext';
import { User, Bell, Download, LogOut, Trash2, HelpCircle, Info, ChevronRight } from 'lucide-react';
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
        <div className="px-4 sm:px-6 py-6">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold text-black mb-2">Settings</h1>
            <p className="text-gray-600">Manage your account and app preferences</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 sm:px-6 py-8">
        <div className="max-w-3xl mx-auto space-y-8">
          {/* Settings Sections - New Layout */}
          {settingsSections.map((section, sectionIndex) => (
            <div
              key={section.title}
              className="animate-slide-up"
              style={{ animationDelay: `${sectionIndex * 100}ms` }}
            >
              <h2 className="mb-3 px-4 text-sm font-semibold text-gray-500 uppercase tracking-wider">
                {section.title}
              </h2>
              <div className="bg-white rounded-xl border border-gray-200/80 shadow-sm overflow-hidden">
                <div className="divide-y divide-gray-200/80">
                  {section.items.map((item, itemIndex) => (
                    <Button
                      key={itemIndex}
                      variant="ghost"
                      onClick={item.action}
                      className={`w-full justify-start h-auto p-4 rounded-none hover:bg-gray-50/70 transition-colors duration-150 ${
                        item.danger ? 'hover:bg-red-50/70' : ''
                      }`}
                    >
                      <div className="flex items-center justify-between w-full gap-4">
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            item.danger 
                              ? 'bg-red-100 text-red-600' 
                              : 'bg-gray-100 text-gray-600'
                          }`}>
                            <item.icon className="w-5 h-5" />
                          </div>
                          <div className="flex-1 text-left">
                            <div className={`font-medium ${
                              item.danger ? 'text-red-600' : 'text-gray-800'
                            }`}>
                              {item.label}
                            </div>
                            <div className="text-sm text-gray-500 mt-0.5">{item.description}</div>
                          </div>
                        </div>
                        {!item.danger && <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />}
                      </div>
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          ))}

          {/* Logout Section */}
          <div 
            className="animate-slide-up pt-4"
            style={{ animationDelay: `${settingsSections.length * 100}ms` }}
          >
            <div className="bg-white rounded-xl border border-gray-200/80 shadow-sm overflow-hidden">
              <Button
                onClick={handleLogout}
                variant="ghost"
                className="w-full h-auto p-4 rounded-none hover:bg-red-50/70 transition-colors duration-150 text-red-600"
              >
                <div className="flex items-center justify-center gap-3 w-full font-medium">
                  <LogOut className="w-5 h-5" />
                  Sign Out
                </div>
              </Button>
            </div>
          </div>

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

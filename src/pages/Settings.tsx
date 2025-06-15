import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { User, Bell, LogOut, Info } from 'lucide-react';
import BottomNavigation from '@/components/BottomNavigation';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { Switch } from '@/components/ui/switch';

const Settings = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to log out?')) {
      logout();
      navigate('/welcome');
      toast.success('Logged out successfully');
    }
  };

  const settingsItems = [
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
      isSwitch: true,
    },
    {
      icon: Info,
      label: 'About DailyFlow',
      description: 'Version 1.0.0',
      action: () => navigate('/about'),
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
            <Card>
              <CardContent className="p-0">
                <div className="divide-y divide-gray-200">
                  {settingsItems.map((item) => {
                    const itemContent = (
                      <div className="flex items-center gap-4">
                        <div
                          className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 text-gray-600"
                        >
                          <item.icon className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">
                            {item.label}
                          </p>
                          <p className="text-sm text-gray-500">{item.description}</p>
                        </div>
                      </div>
                    );

                    if (item.isSwitch) {
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
                        className="flex items-center justify-between w-full p-4 text-left transition-colors hover:bg-gray-50"
                      >
                        {itemContent}
                      </button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

          {/* Logout Section */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center rounded-lg border bg-card text-red-600 shadow-sm p-4 hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-5 h-5 mr-2" />
            <span className="font-medium">Sign Out</span>
          </button>
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default Settings;

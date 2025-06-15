import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { User, Bell, LogOut, Info, HelpCircle, type LucideProps } from 'lucide-react';
import BottomNavigation from '@/components/BottomNavigation';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { Switch } from '@/components/ui/switch';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import React, { useState } from 'react';

type SettingsItem = {
  icon: React.ForwardRefExoticComponent<Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>>;
  label: string;
  description: string;
  action?: () => void;
  isSwitch?: boolean;
};
const Settings = () => {
  const {
    user,
    logout
  } = useAuth();
  const navigate = useNavigate();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const handleLogout = () => {
    logout();
    navigate('/welcome');
    toast.success('Logged out successfully');
  };
  const accountSettings: SettingsItem[] = [{
    icon: User,
    label: 'Profile Settings',
    description: user?.email || 'Manage your account',
    action: () => toast.info('Profile editing coming soon!')
  }, {
    icon: Bell,
    label: 'Notifications',
    description: 'Push notifications & reminders',
    isSwitch: true
  }];
  const moreSettings: SettingsItem[] = [{
    icon: Info,
    label: 'About DailyFlow',
    description: 'Version 1.0.0',
    action: () => navigate('/about')
  }, {
    icon: HelpCircle,
    label: 'Help & Support',
    description: 'Get help and find answers',
    action: () => navigate('/help')
  }];
  const renderSettingsList = (items: SettingsItem[]) => <div className="divide-y divide-gray-200">
      {items.map(item => {
      const itemContent = <div className="flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 text-gray-600">
              <item.icon className="h-5 w-5" />
            </div>
            <div>
              <p className="font-medium text-gray-800">
                {item.label}
              </p>
              <p className="text-sm text-gray-500">{item.description}</p>
            </div>
          </div>;
      if (item.isSwitch) {
        return <div key={item.label} className="flex items-center justify-between w-full p-4 text-left">
               {itemContent}
              <Switch checked={notificationsEnabled} onCheckedChange={checked => {
            setNotificationsEnabled(checked);
            toast.info(`Notifications ${checked ? 'enabled' : 'disabled'}.`);
          }} />
            </div>;
      }
      return <button key={item.label} onClick={item.action} className="flex items-center justify-between w-full p-4 text-left transition-colors hover:bg-gray-50">
            {itemContent}
          </button>;
    })}
    </div>;
  return <div className="min-h-screen bg-gray-50 pb-20">
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
              <CardHeader>
                <CardTitle>Account</CardTitle>
                <CardDescription>
                  Manage your account and notification preferences.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                {renderSettingsList(accountSettings)}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>More</CardTitle>
                <CardDescription>
                  Learn more about the app and get support.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                {renderSettingsList(moreSettings)}
              </CardContent>
            </Card>

          {/* Logout Section */}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <button className="w-full flex items-center justify-between rounded-full bg-gradient-to-b from-gray-800 to-black text-white pr-2 pl-4 text-left transition-shadow hover:shadow-xl shadow-lg border border-gray-700 mx-0 py-[6px] px-[18px]">
                <span className="text-center py-0 font-extrabold px-[95px] text-white">Sign Out</span>
                <div className="bg-gradient-to-br from-gray-200 to-gray-400 rounded-full p-1">
                  <LogOut className="w-4 h-4 text-black" />
                </div>
              </button>
            </AlertDialogTrigger>
            <AlertDialogContent className="max-w-xs rounded-lg">
              <AlertDialogHeader className="text-left">
                <AlertDialogTitle>Are you sure you want to sign out?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will log you out of your account. You can always log back in.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter className="flex-col sm:flex-col gap-2 pt-4">
                <AlertDialogAction asChild>
                  <Button onClick={handleLogout} className="w-full bg-gradient-to-br from-red-800 to-yellow-500 text-white font-bold hover:from-red-700 hover:to-yellow-400">
                    Sign Out
                  </Button>
                </AlertDialogAction>
                <AlertDialogCancel asChild>
                  <Button variant="outline" className="w-full">Cancel</Button>
                </AlertDialogCancel>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <BottomNavigation />
    </div>;
};
export default Settings;

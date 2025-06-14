
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Calendar, Bell, Smartphone } from 'lucide-react';

const WelcomeScreen = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: CheckCircle,
      title: 'Smart Task Management',
      description: 'Organize tasks with projects, tags, and priorities'
    },
    {
      icon: Calendar,
      title: 'Due Dates & Reminders',
      description: 'Never miss a deadline with smart notifications'
    },
    {
      icon: Bell,
      title: 'Daily Focus',
      description: 'Get AI-powered suggestions for your daily tasks'
    },
    {
      icon: Smartphone,
      title: 'Mobile-First Design',
      description: 'Beautiful, responsive design for all devices'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 flex flex-col">
      {/* Header */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        <div className="max-w-md w-full space-y-8 text-center">
          {/* Logo and Title */}
          <div className="space-y-4">
            <div className="mx-auto w-20 h-20 gradient-purple-blue rounded-2xl flex items-center justify-center shadow-lg">
              <CheckCircle className="w-10 h-10 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                TaskFlow
              </h1>
              <p className="text-lg text-gray-600 mt-2">
                Organize your tasks and boost productivity
              </p>
            </div>
          </div>

          {/* Features */}
          <div className="grid grid-cols-2 gap-4 my-8">
            {features.map((feature, index) => (
              <Card key={index} className="p-4 border-0 bg-white/60 backdrop-blur-sm animate-slide-up" 
                    style={{ animationDelay: `${index * 0.1}s` }}>
                <feature.icon className="w-6 h-6 text-purple-600 mb-2" />
                <h3 className="font-semibold text-sm text-gray-800">{feature.title}</h3>
                <p className="text-xs text-gray-600 mt-1">{feature.description}</p>
              </Card>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="space-y-4">
            <Button 
              onClick={() => navigate('/signup')}
              className="w-full h-12 gradient-purple-blue text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
            >
              Get Started
            </Button>
            
            <Button 
              variant="outline"
              onClick={() => navigate('/login')}
              className="w-full h-12 border-2 border-purple-200 text-purple-700 font-semibold rounded-xl hover:bg-purple-50 transition-all duration-200"
            >
              I already have an account
            </Button>
          </div>

          {/* Footer */}
          <p className="text-sm text-gray-500 mt-8">
            Free forever • No credit card required
          </p>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;

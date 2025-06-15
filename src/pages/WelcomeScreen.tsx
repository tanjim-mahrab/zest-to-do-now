
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Calendar, Bell, Smartphone } from 'lucide-react';
const WelcomeScreen = () => {
  const navigate = useNavigate();
  const features = [{
    icon: CheckCircle,
    title: 'Smart Task Management',
    description: 'Organize tasks with projects, tags, and priorities'
  }, {
    icon: Calendar,
    title: 'Due Dates & Reminders',
    description: 'Never miss a deadline with smart notifications'
  }, {
    icon: Bell,
    title: 'Daily Focus',
    description: 'Get AI-powered suggestions for your daily tasks'
  }, {
    icon: Smartphone,
    title: 'Mobile-First Design',
    description: 'Beautiful, responsive design for all devices'
  }];
  return <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        <div className="max-w-md w-full space-y-8 text-center">
          {/* Logo and Title */}
          <div className="space-y-4">
            <div className="mx-auto w-32 h-32 rounded-2xl flex items-center justify-center shadow-lg bg-white">
              <img src="/lovable-uploads/032edfd7-839a-442d-9946-bb1e9059f576.png" className="w-28 h-28" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-black">
                TaskFlow
              </h1>
              <p className="text-lg text-gray-600 mt-2">
                Organize your tasks and boost productivity
              </p>
            </div>
          </div>

          {/* Features */}
          <div className="grid grid-cols-2 gap-4 my-8">
            {features.map((feature, index) => <Card key={index} className="p-4 border border-black bg-white animate-slide-up" style={{
            animationDelay: `${index * 0.1}s`
          }}>
                <feature.icon className="w-6 h-6 text-black mb-2" />
                <h3 className="font-semibold text-sm text-gray-800">{feature.title}</h3>
                <p className="text-xs text-gray-600 mt-1">{feature.description}</p>
              </Card>)}
          </div>

          {/* CTA Buttons */}
          <div className="space-y-4">
            <Button onClick={() => navigate('/signup')} className="w-full h-12 bg-black text-white font-semibold rounded-xl shadow-lg hover:bg-gray-800">
              Get Started
            </Button>
            
            <Button variant="outline" onClick={() => navigate('/login')} className="w-full h-12 border-2 border-black text-black font-semibold rounded-xl hover:bg-black hover:text-white">
              I already have an account
            </Button>
          </div>

          {/* Footer */}
          <p className="text-sm text-gray-500 mt-8">
            Free forever • No credit card required
          </p>
        </div>
      </div>
    </div>;
};
export default WelcomeScreen;

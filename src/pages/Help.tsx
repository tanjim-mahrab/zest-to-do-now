
import { ArrowLeft } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const HelpPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleBack = () => {
    // A more robust check to see if we can go back.
    if (location.key !== 'default') {
      navigate(-1);
    } else {
      // Fallback to settings page if no history is available
      navigate('/settings');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="px-4 sm:px-6 py-4">
          <div className="max-w-3xl mx-auto flex items-center gap-4">
            <button onClick={handleBack} className="p-2 rounded-full hover:bg-gray-100">
                <ArrowLeft className="h-5 w-5 text-gray-600" />
            </button>
            <div>
                <h1 className="text-xl font-bold text-gray-900">Help & Support</h1>
            </div>
          </div>
        </div>
      </div>
      <div className="px-4 sm:px-6 py-8">
        <div className="max-w-3xl mx-auto text-gray-700">
          <h2 className="text-3xl font-bold text-gray-900">Need assistance? We're here to help — every step of the way.</h2>
          <p className="mt-4 text-lg text-gray-600">
              Whether you're just getting started or need guidance with specific features, our support section is designed to give you fast answers, clear instructions, and direct access to our team.
          </p>

          <div className="mt-10">
              <h3 className="text-2xl font-bold text-gray-900">What You’ll Find Here:</h3>
              <ul className="mt-4 space-y-5">
                  <li>
                      <h4 className="text-lg font-semibold text-gray-800">Getting Started Guides</h4>
                      <p className="mt-1 text-gray-600">Learn how to create tasks, manage projects, and make the most of DailyFlow in just a few taps.</p>
                  </li>
                  <li>
                      <h4 className="text-lg font-semibold text-gray-800">FAQs (Frequently Asked Questions)</h4>
                      <p className="mt-1 text-gray-600">Quick answers to common questions about accounts, data, features, and settings.</p>
                  </li>
                  <li>
                      <h4 className="text-lg font-semibold text-gray-800">Troubleshooting Help</h4>
                      <p className="mt-1 text-gray-600">Step-by-step solutions for common issues — from syncing errors to login problems.</p>
                  </li>
                  <li>
                      <h4 className="text-lg font-semibold text-gray-800">Contact Support</h4>
                      <p className="mt-1 text-gray-600">Can’t find what you're looking for? Reach out to us directly. We're quick to respond and happy to help.</p>
                  </li>
                  <li>
                      <h4 className="text-lg font-semibold text-gray-800">Suggest a Feature</h4>
                      <p className="mt-1 text-gray-600">Have an idea? We'd love to hear it. Help us shape the future of DailyFlow.</p>
                  </li>
                   <li>
                      <h4 className="text-lg font-semibold text-gray-800">Privacy & Data</h4>
                      <p className="mt-1 text-gray-600">Transparency matters. Learn how your data is stored, synced, and kept secure.</p>
                  </li>
              </ul>
          </div>
          
          <div className="mt-10">
              <h3 className="text-2xl font-bold text-gray-900">Get in Touch</h3>
              <div className="mt-4 space-y-2 text-gray-600">
                   <p><strong>Email:</strong> <a href="mailto:support@dailyflow.app" className="text-primary hover:underline">support@dailyflow.app</a></p>
                   <p><strong>In-app support form:</strong> Tap “Report a Problem”</p>
                   <p><strong>Feedback:</strong> Use the “Suggest a Feature” option to share your ideas</p>
              </div>
          </div>

          <div className="mt-10 border-t pt-8">
              <p className="text-gray-600">
                  DailyFlow is built to simplify your life — and we're always here to make sure it does. If something isn’t working the way it should, or if you just have a question, don’t hesitate to reach out.
              </p>

              <p className="mt-4 font-semibold text-gray-800">
                  Your productivity is our priority.
              </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpPage;

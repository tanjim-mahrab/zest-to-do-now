
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AboutPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="px-4 sm:px-6 py-4">
          <div className="max-w-3xl mx-auto flex items-center gap-4">
            <button onClick={() => navigate('/')} className="p-2 rounded-full hover:bg-gray-100">
                <ArrowLeft className="h-5 w-5 text-gray-600" />
            </button>
            <div>
                <h1 className="text-xl font-bold text-gray-900">About DailyFlow</h1>
            </div>
          </div>
        </div>
      </div>
      <div className="px-4 sm:px-6 py-8">
        <div className="max-w-3xl mx-auto space-y-6 text-gray-800 leading-relaxed">
          <p>
            DailyFlow is your all-in-one personal productivity companion — designed to help you organize your tasks, projects, and daily routines with clarity and simplicity. Whether you're managing work, personal goals, or everyday habits, DailyFlow keeps everything in sync and on track.
          </p>
          <p>
            We believe productivity should be minimal, clean, and focused — without distractions. That’s why DailyFlow uses a sleek black & white interface that brings attention to what matters most: your tasks.
          </p>
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Key Highlights:</h2>
            <ul className="list-disc space-y-2 pl-5">
              <li>
                <strong>Project-Based Task Management</strong> — Organize your life into categories like Home, Work, Fitness, and more.
              </li>
              <li>
                <strong>Smart Icons</strong> — Projects automatically receive meaningful icons based on their names.
              </li>
              <li>
                <strong>Clean, Distraction-Free UI</strong> — Designed with simplicity in mind, using a black-and-white color theme for better focus.
              </li>
              <li>
                <strong>Calendar Integration</strong> — Plan and view your tasks day by day.
              </li>
              <li>
                <strong>Lightweight & Fast</strong> — Smooth experience without unnecessary clutter.
              </li>
              <li>
                <strong>No Ads, Always Free</strong> — Focus on your goals without interruptions.
              </li>
            </ul>
          </div>
          <p>
            DailyFlow is not just a to-do list — it’s a flow for your mind, a space to stay clear, calm, and organized every day.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;

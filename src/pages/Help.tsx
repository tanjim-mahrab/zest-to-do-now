
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const HelpPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="px-4 sm:px-6 py-4">
          <div className="max-w-3xl mx-auto flex items-center gap-4">
            <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-gray-100">
                <ArrowLeft className="h-5 w-5 text-gray-600" />
            </button>
            <div>
                <h1 className="text-xl font-bold text-gray-900">Help & Support</h1>
            </div>
          </div>
        </div>
      </div>
      <div className="px-4 sm:px-6 py-8">
        <div className="max-w-3xl mx-auto">
          <p>If you need help, please visit our documentation or contact support.</p>
          <p>Help content is coming soon.</p>
        </div>
      </div>
    </div>
  );
};

export default HelpPage;

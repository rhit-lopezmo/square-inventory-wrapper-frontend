import React from 'react';
import { Loader2 } from 'lucide-react';
import App from '@/App';
import { LoginPage } from '@/components/LoginPage';
import { useAuth } from '@/auth';

export const RootApp: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F7F7F7]">
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm px-4 py-3 flex items-center gap-2 text-gray-700">
          <Loader2 className="animate-spin" size={18} />
          Checking session...
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginPage />;
  }

  return <App />;
};

export default RootApp;

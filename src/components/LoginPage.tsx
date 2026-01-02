import React, { useState } from 'react';
import { LogIn, Package } from 'lucide-react';
import { Button } from '@/components/Button';
import { useAuth } from '@/auth';

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      setIsSubmitting(true);
      await login(email, password);
    } catch (err) {
      const message = (err as Error)?.message || 'Unable to authenticate right now.';
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F7F7] flex items-center justify-center px-4 py-12">
      <div className="max-w-lg w-full">
        <div className="bg-white border border-gray-200 rounded-2xl shadow-lg p-8 lg:p-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-black text-white p-2 rounded-lg shadow-sm">
              <Package size={22} />
            </div>
            <div>
              <p className="text-xs uppercase font-semibold tracking-[0.2em] text-gray-500">AoA Inventory</p>
              <h1 className="text-2xl font-bold text-gray-900 mt-1">Sign in to continue</h1>
            </div>
          </div>

          <p className="text-sm text-gray-600 mb-6">
            Log in to access the inventory workspace, adjust stock counts, and sync updates with your backend.
          </p>

          {error && (
            <div className="mb-4 rounded-lg border border-red-100 bg-red-50 text-red-700 text-sm px-3 py-2">
              {error}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <label className="block">
              <span className="text-sm font-medium text-gray-700">Work email</span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 shadow-sm focus:border-black focus:ring-2 focus:ring-black outline-none transition"
                placeholder="alex@square.com"
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-gray-700">Password</span>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 shadow-sm focus:border-black focus:ring-2 focus:ring-black outline-none transition"
                placeholder="••••••••"
              />
            </label>

            <Button
              type="submit"
              className="w-full h-12 text-base flex items-center justify-center"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="animate-pulse">Signing in...</span>
              ) : (
                <>
                  Sign in
                  <LogIn size={18} className="ml-2" />
                </>
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

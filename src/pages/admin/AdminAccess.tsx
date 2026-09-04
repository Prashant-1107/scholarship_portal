import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';
import { ShieldCheck, Lock } from 'lucide-react';

export default function AdminAccess() {
  const [isClaimed, setIsClaimed] = useState<boolean | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    checkAdminStatus();
  }, []);

  const checkAdminStatus = async () => {
    try {
      const { data, error } = await supabase
        .from('platform_settings')
        .select('admin_claimed')
        .eq('id', 'global')
        .single();
      
      if (error) {
        console.warn('Settings table missing or error:', error);
        // Fallback if table doesn't exist yet
        setIsClaimed(false);
      } else {
        setIsClaimed(data?.admin_claimed || false);
      }
    } catch (err) {
      setIsClaimed(false);
    }
  };

  const handleAction = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isClaimed) {
        // Log in
        await login(email, password);
        navigate('/admin');
      } else {
        // Sign up as admin
        await register(email, password, name || 'Admin', 'admin');
        
        // Update the lock
        await supabase
          .from('platform_settings')
          .upsert({ id: 'global', admin_claimed: true });
          
        navigate('/admin');
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  if (isClaimed === null) {
    return <div className="min-h-screen flex items-center justify-center bg-[#FFF9F2]">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-[#FFF9F2] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="w-12 h-12 bg-[#0D9488]/10 rounded-2xl flex items-center justify-center">
            {isClaimed ? <Lock className="w-6 h-6 text-[#0D9488]" /> : <ShieldCheck className="w-6 h-6 text-[#0D9488]" />}
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          {isClaimed ? 'Admin Portal' : 'Initialize Admin Account'}
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          {isClaimed 
            ? 'Sign in to access the platform administration.' 
            : 'Create the one-time root administrator account. This cannot be undone.'}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-sm border border-gray-200 sm:rounded-2xl sm:px-10">
          <form className="space-y-6" onSubmit={handleAction}>
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm border border-red-100">
                {error}
              </div>
            )}
            
            {!isClaimed && (
              <div>
                <label className="block text-sm font-medium text-gray-700">Full Name</label>
                <div className="mt-1">
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0D9488] focus:border-transparent transition-all"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700">Email address</label>
              <div className="mt-1">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0D9488] focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <div className="mt-1">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0D9488] focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-[#0D9488] hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0D9488] transition-colors disabled:opacity-70"
              >
                {loading ? 'Processing...' : (isClaimed ? 'Sign In' : 'Claim Admin Account')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GraduationCap, Sparkles, ShieldCheck, ArrowRight } from 'lucide-react';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(email, password, name, 'student');
      // Wait for auth to propagate
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex">
      {/* Left Column: Form */}
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:w-1/2 lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:max-w-md">
          {/* Mobile Logo */}
          <div className="flex items-center gap-2 mb-10 lg:hidden">
            <GraduationCap className="w-10 h-10 text-[#0D9488]" />
            <span className="text-3xl font-bold tracking-tight text-gray-900">ScholarBridge India</span>
          </div>

          <div>
            <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Create an account</h2>
            <p className="text-base text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="font-medium text-[#0D9488] hover:text-teal-700 transition-colors">
                Sign in now <ArrowRight className="inline w-4 h-4 ml-0.5 -mt-0.5" />
              </Link>
            </p>
          </div>

          <div className="mt-10">
            <form className="space-y-6" onSubmit={handleSubmit}>
              {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm border border-red-100">
                  {error}
                </div>
              )}
              <div>
                <label className="block text-sm font-semibold text-gray-900">
                  Full Name
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0D9488] focus:border-transparent transition-all"
                    placeholder="John Doe"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900">
                  Email address
                </label>
                <div className="mt-2">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0D9488] focus:border-transparent transition-all"
                    placeholder="student@tezhack.in"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900">
                  Password
                </label>
                <div className="mt-2">
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0D9488] focus:border-transparent transition-all"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-md text-sm font-bold text-white bg-[#0D9488] hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0D9488] transition-colors disabled:opacity-70"
                >
                  {loading ? 'Creating account...' : 'Create Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Right Column: Visual Showcase */}
      <div className="hidden lg:flex relative w-0 flex-1 bg-[#0D9488] items-center justify-center overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0D9488] to-teal-900"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-[#EC4899] rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
        <div className="absolute top-1/4 -right-24 w-96 h-96 bg-teal-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
        
        <div className="relative z-10 px-12 max-w-2xl text-left">
          <div className="flex items-center gap-3 mb-12">
            <div className="bg-white/10 p-3 rounded-2xl backdrop-blur-md border border-white/20">
              <GraduationCap className="w-10 h-10 text-[#F9A8D4]" />
            </div>
            <span className="text-3xl font-bold tracking-tight text-white">ScholarBridge India</span>
          </div>

          <h2 className="text-5xl font-extrabold text-white mb-6 leading-[1.15]">
            Unlock your <br />
            <span className="text-[#F9A8D4]">academic potential.</span>
          </h2>
          <p className="text-xl text-teal-100 mb-12 font-medium max-w-lg leading-relaxed">
            Connect with millions in scholarships using our intelligent AI-driven matching system.
          </p>
          
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-white/10 p-6 rounded-2xl border border-white/10 backdrop-blur-md">
              <Sparkles className="w-8 h-8 text-[#F9A8D4] mb-4" />
              <h3 className="text-white font-bold text-lg mb-2">Smart Matching</h3>
              <p className="text-teal-100 text-sm leading-relaxed">AI counselor evaluates your profile to find perfectly tailored opportunities.</p>
            </div>
            <div className="bg-white/10 p-6 rounded-2xl border border-white/10 backdrop-blur-md">
              <ShieldCheck className="w-8 h-8 text-[#F9A8D4] mb-4" />
              <h3 className="text-white font-bold text-lg mb-2">Verified Sources</h3>
              <p className="text-teal-100 text-sm leading-relaxed">100% authentic scholarships from government and private foundations.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

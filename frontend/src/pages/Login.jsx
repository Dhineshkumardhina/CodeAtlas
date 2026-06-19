import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../App';
import { registerUser, loginUser } from '../services/api';
import { Compass, User, Mail, Lock, ShieldAlert, Loader2, Key } from 'lucide-react';

function Login() {
  const { user, login } = useAuth();
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState('login'); // 'login' or 'register'
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // If already logged in, redirect to dashboard
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  // Handle URL query parameter ?tab=register
  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab === 'register' || tab === 'login') {
      setActiveTab(tab);
    }
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Validations
    if (activeTab === 'register' && !name.trim()) {
      setError('Please enter your name');
      return;
    }
    if (!email.trim() || !password.trim()) {
      setError('Please enter both email and password');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setIsLoading(true);

    try {
      if (activeTab === 'login') {
        const data = await loginUser({ email, password });
        if (data.success) {
          login(data.user);
          navigate('/dashboard');
        } else {
          setError(data.error || 'Failed to authenticate');
        }
      } else {
        const data = await registerUser({ name, email, password });
        if (data.success) {
          login(data.user);
          navigate('/dashboard');
        } else {
          setError(data.error || 'Failed to register account');
        }
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || 'Authentication server connection error. Check backend configuration.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12">
      {/* Decorative glows */}
      <div className="absolute top-1/3 left-1/2 -z-10 h-[300px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-600/5 blur-[100px]"></div>
      
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-blue-500 shadow-lg shadow-violet-500/20">
            <Compass className="h-6.5 w-6.5 text-white" />
          </div>
          <h2 className="mt-6 font-display text-2xl font-extrabold tracking-tight text-white">
            {activeTab === 'login' ? 'Welcome back' : 'Create your account'}
          </h2>
          <p className="mt-2 text-xs text-gray-400">
            {activeTab === 'login' ? 'Sign in to access search histories' : 'Get started with CodeAtlas for free'}
          </p>
        </div>

        <div className="glass-panel rounded-3xl p-8 border border-white/5 shadow-xl relative overflow-hidden">
          {/* Toggles */}
          <div className="flex border-b border-white/5 pb-4 mb-6">
            <button
              onClick={() => {
                setActiveTab('login');
                setError('');
              }}
              className={`flex-1 pb-2 text-sm font-semibold border-b-2 transition-all duration-200 cursor-pointer ${
                activeTab === 'login'
                  ? 'border-violet-500 text-violet-400'
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => {
                setActiveTab('register');
                setError('');
              }}
              className={`flex-1 pb-2 text-sm font-semibold border-b-2 transition-all duration-200 cursor-pointer ${
                activeTab === 'register'
                  ? 'border-violet-500 text-violet-400'
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              Register
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 text-left">
            {activeTab === 'register' && (
              <div className="space-y-1.5">
                <label className="text-2xs font-bold uppercase tracking-wider text-gray-400 pl-1">Full Name</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-500">
                    <User className="h-4 w-4" />
                  </span>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="block w-full rounded-xl border border-white/10 bg-white/3 py-3 pl-10 pr-4 text-sm text-white placeholder-gray-500 focus:border-violet-500/50 focus:bg-white/5 outline-none transition-all duration-200"
                    placeholder="Enter your name"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-2xs font-bold uppercase tracking-wider text-gray-400 pl-1">Email Address</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-500">
                  <Mail className="h-4 w-4" />
                </span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full rounded-xl border border-white/10 bg-white/3 py-3 pl-10 pr-4 text-sm text-white placeholder-gray-500 focus:border-violet-500/50 focus:bg-white/5 outline-none transition-all duration-200"
                  placeholder="name@example.com"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-2xs font-bold uppercase tracking-wider text-gray-400 pl-1">Password</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-500">
                  <Lock className="h-4 w-4" />
                </span>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full rounded-xl border border-white/10 bg-white/3 py-3 pl-10 pr-4 text-sm text-white placeholder-gray-500 focus:border-violet-500/50 focus:bg-white/5 outline-none transition-all duration-200"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {error && (
              <div className="rounded-xl bg-rose-500/15 border border-rose-500/10 p-3.5 flex items-start gap-2.5 text-xs text-rose-400 animate-fadeIn">
                <ShieldAlert className="h-4 w-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="mt-6 w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-500/20 hover:from-violet-500 hover:to-blue-500 hover:shadow-violet-500/35 transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Please wait...
                </>
              ) : activeTab === 'login' ? (
                'Sign In'
              ) : (
                'Create Account'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/authService';
import toast from 'react-hot-toast';

export function LoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username || !password) {
      toast.error('Please enter username and password');
      return;
    }
    
    setLoading(true);
    
    try {
      const response = await login({ username, password });
      toast.success(`Welcome back, ${response.user.username}!`);
      navigate('/signals');  // Redirect to main page
    } catch (error) {
      console.error('Login failed:', error);
      toast.error(error instanceof Error ? error.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0d0f14]">
      {/* Subtle background texture */}
      <div className="fixed inset-0 grid-bg pointer-events-none"></div>
      <div className="fixed inset-0 texture-overlay pointer-events-none"></div>
      
      <div className="relative bg-[#12141a]/60 border border-white/5 p-8 w-full max-w-md">
        {/* Header */}
        <div className="mb-8">
          <div className="text-[10px] text-slate-600 mb-2 tracking-widest uppercase">
            Authentication
          </div>
          <h1 className="text-xl font-semibold text-[#9ca8c8] tracking-tight">
            Volman AI
          </h1>
          <p className="text-[10px] text-slate-600 mt-0.5 tracking-wider uppercase">
            Price Action Terminal
          </p>
        </div>
        
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-[10px] text-slate-600 tracking-widest uppercase mb-2">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2.5 bg-white/1 border border-white/5 text-slate-300 text-sm focus:outline-none focus:border-[#7c8db5]/30 transition-all"
              placeholder="Enter username"
              disabled={loading}
            />
          </div>
          
          <div>
            <label className="block text-[10px] text-slate-600 tracking-widest uppercase mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 bg-white/1 border border-white/5 text-slate-300 text-sm focus:outline-none focus:border-[#7c8db5]/30 transition-all"
              placeholder="Enter password"
              disabled={loading}
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full px-6 py-3 bg-[#7c8db5]/15 hover:bg-[#7c8db5]/25 disabled:bg-white/5 border border-[#7c8db5]/20 text-[#9ca8c8] text-sm font-medium tracking-wide transition-all"
          >
            {loading ? 'AUTHENTICATING...' : 'LOGIN'}
          </button>
        </form>
        
        <div className="mt-6 pt-6 border-t border-white/5">
          <p className="text-slate-500 text-xs text-center">
            Don't have an account?{' '}
            <button
              onClick={() => navigate('/register')}
              className="text-[#9ca8c8] hover:text-[#7c8db5] transition-colors"
            >
              Register here
            </button>
          </p>
        </div>
        
        <div className="mt-6 pt-6 border-t border-white/5">
          <div className="text-[10px] text-slate-600 tracking-widest uppercase mb-2 text-center">
            Demo Credentials
          </div>
          <p className="text-xs text-slate-500 text-center font-mono">
            admin / admin123
          </p>
        </div>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from '../services/authService';
import toast from 'react-hot-toast';

export function RegisterPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.username || !formData.email || !formData.password) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    
    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    
    setLoading(true);
    
    try {
      const response = await register({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        fullName: formData.fullName || undefined,
      });
      
      toast.success(`Welcome, ${response.user.username}!`);
      navigate('/signals');  // Redirect to main page
    } catch (error) {
      console.error('Registration failed:', error);
      toast.error(error instanceof Error ? error.message : 'Registration failed');
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
            Registration
          </div>
          <h1 className="text-xl font-semibold text-[#9ca8c8] tracking-tight">
            Create Account
          </h1>
          <p className="text-[10px] text-slate-600 mt-0.5 tracking-wider uppercase">
            Join Volman AI Terminal
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-[10px] text-slate-600 tracking-widest uppercase mb-2">
              Username *
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-white/1 border border-white/5 text-slate-300 text-sm focus:outline-none focus:border-[#7c8db5]/30 transition-all"
              disabled={loading}
            />
          </div>
          
          <div>
            <label className="block text-[10px] text-slate-600 tracking-widest uppercase mb-2">
              Email *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-white/1 border border-white/5 text-slate-300 text-sm focus:outline-none focus:border-[#7c8db5]/30 transition-all"
              disabled={loading}
            />
          </div>
          
          <div>
            <label className="block text-[10px] text-slate-600 tracking-widest uppercase mb-2">
              Full Name
            </label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-white/1 border border-white/5 text-slate-300 text-sm focus:outline-none focus:border-[#7c8db5]/30 transition-all"
              disabled={loading}
            />
          </div>
          
          <div>
            <label className="block text-[10px] text-slate-600 tracking-widest uppercase mb-2">
              Password *
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-white/1 border border-white/5 text-slate-300 text-sm focus:outline-none focus:border-[#7c8db5]/30 transition-all"
              disabled={loading}
            />
          </div>
          
          <div>
            <label className="block text-[10px] text-slate-600 tracking-widest uppercase mb-2">
              Confirm Password *
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-white/1 border border-white/5 text-slate-300 text-sm focus:outline-none focus:border-[#7c8db5]/30 transition-all"
              disabled={loading}
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full px-6 py-3 bg-[#7c8db5]/15 hover:bg-[#7c8db5]/25 disabled:bg-white/5 border border-[#7c8db5]/20 text-[#9ca8c8] text-sm font-medium tracking-wide transition-all"
          >
            {loading ? 'CREATING ACCOUNT...' : 'REGISTER'}
          </button>
        </form>
        
        <div className="mt-6 pt-6 border-t border-white/5">
          <p className="text-slate-500 text-xs text-center">
            Already have an account?{' '}
            <button
              onClick={() => navigate('/login')}
              className="text-[#9ca8c8] hover:text-[#7c8db5] transition-colors"
            >
              Login here
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

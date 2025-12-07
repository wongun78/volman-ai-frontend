import { useState } from 'react';
import { getCurrentUser, logout } from '../../services/authService';
import { useNavigate } from 'react-router-dom';

export function UserProfile() {
  const navigate = useNavigate();
  const user = getCurrentUser();
  const [showMenu, setShowMenu] = useState(false);
  
  if (!user) return null;
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  return (
    <div className="relative">
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="flex items-center gap-2 px-3 py-2 bg-white/2 border border-white/5 hover:bg-white/3 transition-all"
      >
        <div className="w-6 h-6 bg-[#7c8db5]/20 border border-[#7c8db5]/30 flex items-center justify-center">
          <span className="text-[10px] font-medium text-[#9ca8c8] tracking-wider">
            {user.username.charAt(0).toUpperCase()}
          </span>
        </div>
        <span className="text-xs text-slate-300 font-medium tracking-wide">{user.username}</span>
      </button>
      
      {showMenu && (
        <div className="absolute right-0 mt-2 w-64 bg-[#12141a] border border-white/5 z-50">
          <div className="px-4 py-3 border-b border-white/5">
            <p className="text-[10px] text-slate-600 tracking-widest uppercase mb-1">Signed in as</p>
            <p className="text-sm font-medium text-slate-300">{user.username}</p>
            <p className="text-xs text-slate-500 mt-0.5">{user.email}</p>
          </div>
          
          <div className="px-4 py-3 border-b border-white/5">
            <p className="text-[10px] text-slate-600 tracking-widest uppercase mb-2">Roles</p>
            <div className="flex flex-wrap gap-1">
              {user.roles.map(role => (
                <span
                  key={role}
                  className="px-2 py-1 bg-[#7c8db5]/10 text-[#9ca8c8] border border-[#7c8db5]/20 text-[10px] font-medium tracking-wide uppercase"
                >
                  {role.replace('ROLE_', '')}
                </span>
              ))}
            </div>
          </div>
          
          <div className="p-2">
            <button
              onClick={handleLogout}
              className="w-full text-left px-3 py-2 bg-[#a16e7c]/10 hover:bg-[#a16e7c]/20 border border-[#a16e7c]/20 text-[#a16e7c] text-xs font-medium tracking-wide transition-all"
            >
              LOGOUT
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

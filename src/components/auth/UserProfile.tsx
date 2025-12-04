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
        className="flex items-center space-x-2 px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
      >
        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
          {user.username.charAt(0).toUpperCase()}
        </div>
        <span className="text-white">{user.username}</span>
      </button>
      
      {showMenu && (
        <div className="absolute right-0 mt-2 w-64 bg-gray-800 rounded-lg shadow-xl py-2 z-50">
          <div className="px-4 py-3 border-b border-gray-700">
            <p className="text-sm text-gray-400">Signed in as</p>
            <p className="font-semibold text-white">{user.username}</p>
            <p className="text-xs text-gray-500">{user.email}</p>
          </div>
          
          <div className="px-4 py-2">
            <p className="text-xs text-gray-400 mb-1">Roles:</p>
            <div className="flex flex-wrap gap-1">
              {user.roles.map(role => (
                <span
                  key={role}
                  className="px-2 py-1 bg-blue-900 text-blue-300 text-xs rounded"
                >
                  {role.replace('ROLE_', '')}
                </span>
              ))}
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-2">
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 text-red-400 hover:bg-gray-700 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

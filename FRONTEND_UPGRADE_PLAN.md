# 🎨 Frontend Upgrade Plan - Authentication & Authorization

**Project:** volman-ai-frontend  
**Backend Changes:** Spring Security, JWT, RBAC, Ownership Validation  
**Generated:** December 3, 2025

---

## 📋 **SUMMARY: What Needs to Change**

Backend đã thêm:
- ✅ JWT Authentication
- ✅ User Roles (ADMIN, TRADER, VIEWER)
- ✅ Ownership Validation (users chỉ xem own positions)
- ✅ Login/Register endpoints

Frontend cần:
- 🔴 **ADD:** Login/Register pages
- 🔴 **ADD:** JWT token storage & management
- 🔴 **ADD:** Protected routes (require login)
- 🔴 **ADD:** Role-based UI (hide admin features from non-admins)
- 🔴 **UPDATE:** API client to send Authorization header
- 🔴 **UPDATE:** Error handling for 401/403
- 🔴 **ADD:** User profile display
- 🔴 **ADD:** Logout functionality

---

## 🚨 **BREAKING CHANGES**

### ❌ **What Will BREAK Without Updates:**

1. **All API calls will fail with 401 Unauthorized**
   - Current: No authentication
   - Backend: Requires JWT token in header
   - Fix: Add `Authorization: Bearer {token}` header

2. **Can't create/view positions**
   - Backend: `/api/positions` requires authentication
   - Fix: Login before accessing

3. **No way to register/login**
   - Current: No auth UI
   - Fix: Add login page

---

## 📁 **FILES TO CREATE**

### 1. **Authentication Service** 🔴 CRITICAL
**File:** `src/services/authService.ts`

```typescript
import { apiFetch } from './apiClient';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  fullName?: string;
}

export interface UserInfo {
  id: number;
  username: string;
  email: string;
  fullName?: string;
  roles: string[];
  status: string;
}

export interface LoginResponse {
  token: string;
  tokenType: string;
  expiresIn: number;  // milliseconds
  user: UserInfo;
}

const AUTH_BASE = '/api/auth';

/**
 * Login user and store JWT token
 */
export const login = async (request: LoginRequest): Promise<LoginResponse> => {
  const response = await apiFetch<LoginResponse>(`${AUTH_BASE}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  });
  
  // Store token in localStorage
  localStorage.setItem('jwt_token', response.token);
  localStorage.setItem('user_info', JSON.stringify(response.user));
  
  return response;
};

/**
 * Register new user
 */
export const register = async (request: RegisterRequest): Promise<LoginResponse> => {
  const response = await apiFetch<LoginResponse>(`${AUTH_BASE}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  });
  
  // Auto-login after registration
  localStorage.setItem('jwt_token', response.token);
  localStorage.setItem('user_info', JSON.stringify(response.user));
  
  return response;
};

/**
 * Logout user (clear token)
 */
export const logout = (): void => {
  localStorage.removeItem('jwt_token');
  localStorage.removeItem('user_info');
};

/**
 * Get stored JWT token
 */
export const getToken = (): string | null => {
  return localStorage.getItem('jwt_token');
};

/**
 * Get current user info
 */
export const getCurrentUser = (): UserInfo | null => {
  const userStr = localStorage.getItem('user_info');
  return userStr ? JSON.parse(userStr) : null;
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = (): boolean => {
  return !!getToken();
};

/**
 * Check if user has specific role
 */
export const hasRole = (role: string): boolean => {
  const user = getCurrentUser();
  return user?.roles.includes(role) ?? false;
};

/**
 * Check if user is admin
 */
export const isAdmin = (): boolean => {
  return hasRole('ROLE_ADMIN');
};

/**
 * Check if token is expired
 */
export const isTokenExpired = (): boolean => {
  // JWT tokens have expiration in payload
  const token = getToken();
  if (!token) return true;
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return Date.now() >= payload.exp * 1000;
  } catch {
    return true;
  }
};
```

---

### 2. **Login Page** 🔴 CRITICAL
**File:** `src/pages/LoginPage.tsx`

```typescript
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
      <div className="bg-gray-800 p-8 rounded-lg shadow-xl w-full max-w-md">
        <h1 className="text-3xl font-bold text-white mb-6 text-center">
          Trading AI
        </h1>
        
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your username"
              disabled={loading}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your password"
              disabled={loading}
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        
        <p className="text-gray-400 text-sm text-center mt-4">
          Don't have an account?{' '}
          <button
            onClick={() => navigate('/register')}
            className="text-blue-400 hover:text-blue-300"
          >
            Register here
          </button>
        </p>
        
        <div className="mt-6 pt-6 border-t border-gray-700">
          <p className="text-gray-500 text-xs text-center">
            Demo credentials: <br />
            <code className="text-gray-400">admin / admin123</code>
          </p>
        </div>
      </div>
    </div>
  );
}
```

---

### 3. **Register Page** 🔴 CRITICAL
**File:** `src/pages/RegisterPage.tsx`

```typescript
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
      <div className="bg-gray-800 p-8 rounded-lg shadow-xl w-full max-w-md">
        <h1 className="text-3xl font-bold text-white mb-6 text-center">
          Create Account
        </h1>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Username *
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Email *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Full Name
            </label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Password *
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Confirm Password *
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
          >
            {loading ? 'Creating account...' : 'Register'}
          </button>
        </form>
        
        <p className="text-gray-400 text-sm text-center mt-4">
          Already have an account?{' '}
          <button
            onClick={() => navigate('/login')}
            className="text-blue-400 hover:text-blue-300"
          >
            Login here
          </button>
        </p>
      </div>
    </div>
  );
}
```

---

### 4. **Protected Route Component** 🔴 CRITICAL
**File:** `src/components/auth/ProtectedRoute.tsx`

```typescript
import { Navigate } from 'react-router-dom';
import { isAuthenticated, hasRole } from '../../services/authService';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
}

export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  if (!isAuthenticated()) {
    // Not logged in - redirect to login
    return <Navigate to="/login" replace />;
  }
  
  if (requiredRole && !hasRole(requiredRole)) {
    // Logged in but missing required role - show error or redirect
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-red-500 mb-4">Access Denied</h1>
          <p className="text-gray-400">You don't have permission to access this page.</p>
          <p className="text-gray-500 mt-2">Required role: {requiredRole}</p>
        </div>
      </div>
    );
  }
  
  return <>{children}</>;
}
```

---

### 5. **User Profile Component** 🟡 RECOMMENDED
**File:** `src/components/auth/UserProfile.tsx`

```typescript
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
```

---

## 📝 **FILES TO UPDATE**

### 1. **API Client** 🔴 CRITICAL - Add Auth Header
**File:** `src/services/apiClient.ts`

**Change:**
```typescript
import { getToken } from './authService';

export async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE}${path}`;
  
  // 🔴 ADD: Get JWT token
  const token = getToken();
  
  // 🔴 ADD: Inject Authorization header
  const headers = {
    ...options?.headers,
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
  };
  
  try {
    const response = await fetch(url, {
      ...options,
      headers,  // ✅ Use updated headers
    });
    
    // ... rest of code
  }
}
```

---

### 2. **App.tsx** 🔴 CRITICAL - Add Auth Routes
**File:** `src/App.tsx`

**Change:**
```typescript
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ProtectedRoute } from './components/auth/ProtectedRoute';

function App() {
  return (
    <>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        
        {/* Protected routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Routes>
                  <Route path="/" element={<Navigate to="/signals" replace />} />
                  <Route path="/signals" element={<SignalsPage />} />
                  <Route path="/positions" element={<PositionsPage />} />
                  <Route path="/history" element={<HistoryPage />} />
                  
                  {/* Admin-only route */}
                  <Route
                    path="/admin/binance"
                    element={
                      <ProtectedRoute requiredRole="ROLE_ADMIN">
                        <BinanceAdminPage />
                      </ProtectedRoute>
                    }
                  />
                  
                  <Route path="/settings" element={<SettingsPage />} />
                </Routes>
              </MainLayout>
            </ProtectedRoute>
          }
        />
      </Routes>
      <Toaster position="top-right" />
    </>
  );
}
```

---

### 3. **MainLayout** 🟡 RECOMMENDED - Add User Profile
**File:** `src/layout/MainLayout.tsx`

**Add to navigation:**
```typescript
import { UserProfile } from '../components/auth/UserProfile';

export function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <header className="flex justify-between items-center p-4 bg-gray-800">
        <nav>{/* existing nav */}</nav>
        
        {/* 🔴 ADD: User profile dropdown */}
        <UserProfile />
      </header>
      
      <main>{children}</main>
    </div>
  );
}
```

---

### 4. **Error Handling** 🔴 CRITICAL
**File:** `src/services/apiClient.ts`

**Add 401/403 handling:**
```typescript
export async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  // ... existing code
  
  try {
    const response = await fetch(url, {...});
    const apiResponse: ApiResponse<T> = await response.json();
    
    // 🔴 ADD: Handle auth errors
    if (response.status === 401) {
      // Token expired or invalid - logout and redirect
      logout();
      window.location.href = '/login';
      throw new ApiError('Session expired. Please login again.', 401);
    }
    
    if (response.status === 403) {
      throw new ApiError('Access denied. You don\'t have permission.', 403, 'ACCESS_DENIED');
    }
    
    // ... rest of error handling
  }
}
```

---

### 5. **Position Types** 🟡 OPTIONAL - Add Audit Fields
**File:** `src/types/trading.ts`

**Add to PositionResponseDto:**
```typescript
export interface PositionResponseDto {
  // ... existing fields
  
  // 🔴 ADD: Audit fields
  createdBy?: string;
  lastModifiedBy?: string;
  createdAt?: string;
  updatedAt?: string;
}
```

---

## 🎨 **UI ENHANCEMENTS** (Optional)

### 1. **Role-Based UI** 🟡 RECOMMENDED

Hide admin features from non-admins:

```typescript
import { isAdmin } from '../services/authService';

// In navigation:
{isAdmin() && (
  <Link to="/admin/binance">Admin</Link>
)}
```

### 2. **Position Ownership Display** 🟡 RECOMMENDED

Show who created positions:

```tsx
// In PositionCard.tsx:
{position.createdBy && (
  <div className="text-xs text-gray-500">
    Created by: {position.createdBy}
  </div>
)}
```

### 3. **Loading States** 🟢 NICE TO HAVE

Show loading spinners during auth:

```tsx
const [loading, setLoading] = useState(false);

{loading && <Spinner />}
```

---

## 📦 **DEPENDENCIES TO ADD**

```bash
# If using React Context for auth state:
npm install --save-dev @types/react

# No new packages needed! All auth logic uses:
# - localStorage (built-in)
# - fetch API (built-in)
# - react-router-dom (already installed)
# - react-hot-toast (already installed)
```

---

## 🧪 **TESTING CHECKLIST**

### Before Updates:
- [ ] Document current user flow
- [ ] Test all API endpoints (should fail with 401)
- [ ] Backup frontend code

### After Updates:
- [ ] Test login with `admin/admin123`
- [ ] Test register new user
- [ ] Test protected routes redirect to login
- [ ] Test logout clears token
- [ ] Test API calls include Authorization header
- [ ] Test 401 error redirects to login
- [ ] Test 403 error shows access denied
- [ ] Test admin-only routes (BinanceAdminPage)
- [ ] Test non-admin can't access admin routes
- [ ] Test position ownership (users see own positions)
- [ ] Test token expiration (after 24 hours)

---

## 🚀 **DEPLOYMENT ORDER**

1. ✅ **Backend deployed first** (already done)
2. 🔴 **Create authService.ts**
3. 🔴 **Update apiClient.ts** (add Authorization header)
4. 🔴 **Create LoginPage.tsx**
5. 🔴 **Create RegisterPage.tsx**
6. 🔴 **Create ProtectedRoute.tsx**
7. 🔴 **Update App.tsx** (add routes)
8. 🟡 **Create UserProfile.tsx**
9. 🟡 **Update MainLayout.tsx** (add profile)
10. 🧪 **Test everything**
11. 🚀 **Deploy frontend**

---

## ⚠️ **COMMON ISSUES & FIXES**

### Issue 1: CORS Errors
**Symptom:** `Access-Control-Allow-Origin` error

**Fix:** Backend already configured CORS in `WebConfig.java`:
```yaml
cors.allowed-origins=http://localhost:5173
```

Make sure frontend runs on port 5173: `npm run dev`

---

### Issue 2: 401 on Every Request
**Symptom:** All API calls fail with "Unauthorized"

**Fix:** Check `localStorage` has token:
```javascript
console.log(localStorage.getItem('jwt_token'));
```

If null, login again. If present, check Authorization header in Network tab.

---

### Issue 3: Token Expired
**Symptom:** Works for 24 hours, then fails

**Fix:** Backend tokens expire after 24h. Frontend should:
- Detect expired token in apiClient.ts
- Auto-logout and redirect to login
- Show "Session expired" message

---

### Issue 4: Can't Access Admin Routes
**Symptom:** User logged in but can't access /admin/binance

**Fix:** Check user roles:
```typescript
const user = getCurrentUser();
console.log(user?.roles);  // Should include "ROLE_ADMIN"
```

Only admin account has ROLE_ADMIN. Regular users can't access.

---

## 📚 **BACKEND ENDPOINTS**

### Authentication:
- `POST /api/auth/login` - Login (returns JWT token)
- `POST /api/auth/register` - Register new user

### Protected Endpoints (require JWT):
- `GET /api/positions` - List own positions
- `POST /api/positions` - Create position (TRADER/ADMIN only)
- `GET /api/signals` - List signals
- `POST /api/signals/ai-suggest` - Generate signal (TRADER/ADMIN only)
- `GET /api/admin/binance/**` - Admin endpoints (ADMIN only)

---

## 🎯 **FINAL CHECKLIST**

### Must Have (CRITICAL):
- [x] authService.ts created
- [x] apiClient.ts updated with Authorization header
- [x] LoginPage.tsx created
- [x] RegisterPage.tsx created
- [x] ProtectedRoute.tsx created
- [x] App.tsx updated with auth routes
- [x] 401/403 error handling

### Should Have (RECOMMENDED):
- [x] UserProfile.tsx created
- [x] MainLayout.tsx updated
- [x] Role-based UI (hide admin features)
- [x] Position ownership display

### Nice to Have (OPTIONAL):
- [ ] Remember me checkbox
- [ ] Password reset flow
- [ ] User settings page
- [ ] Session timeout warning
- [ ] Auto token refresh

---

## 📖 **DOCUMENTATION REFERENCES**

- **Backend Auth:** `ENTERPRISE_UPGRADE.md`
- **Security Integration:** `SECURITY_INTEGRATION.md`
- **API Compliance:** `COMPLIANCE_REPORT.md`
- **Quick Start:** `QUICKSTART.md`

---

**Status:** 🔴 **ACTION REQUIRED**  
**Priority:** **CRITICAL - App won't work without auth**  
**Effort:** ~4-6 hours for basic implementation  
**Testing:** ~2 hours

---

**Next Steps:**
1. Review this plan
2. Start with authService.ts
3. Update apiClient.ts
4. Create login/register pages
5. Test with backend
6. Deploy when working

Good luck! 🚀

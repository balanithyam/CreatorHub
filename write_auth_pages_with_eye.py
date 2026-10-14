register_code = r"""import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UserRole } from '../types';
import { User, Mail, Lock, Eye, EyeOff, ArrowRight, Loader2, CheckCircle2 } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

export const RegisterPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [role, setRole] = useState<UserRole>('CREATOR');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (password !== confirmPassword) {
      setError('Passwords do not match. Please verify.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (!termsAccepted) {
      setError('You must accept the Terms of Service to continue.');
      return;
    }

    setLoading(true);

    try {
      const res = await api.post('/auth/register', {
        name,
        email,
        password,
        role,
      });

      if (res.data?.success) {
        setSuccessMessage('Registration successful! Redirecting you to sign in...');
        setTimeout(() => {
          navigate('/login');
        }, 1500);
      } else {
        setError(res.data?.message || 'Registration failed.');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setError('');
    setGoogleLoading(true);
    try {
      const res = await api.post('/auth/google', {
        email: email.trim() || undefined,
        name: name.trim() || undefined,
        role: role,
      });
      if (res.data?.success) {
        const token = res.data.token || res.data.data?.token;
        const userData = res.data.user || res.data.data?.user;
        if (token && userData) {
          login(token, userData);
          navigate('/app');
        } else {
          setSuccessMessage('Google account connected! Redirecting to studio...');
          setTimeout(() => navigate('/app'), 1000);
        }
      } else {
        setError(res.data?.message || 'Google registration failed.');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Google sign-in failed. Please try again.');
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center p-4 selection:bg-[#FF5A36] selection:text-white">
      <div className="w-full max-w-lg">
        <div className="text-center mb-6">
          <div
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 cursor-pointer mb-2"
          >
            <div className="w-10 h-10 bg-[#121316] rounded-xl flex items-center justify-center text-white font-black text-2xl shadow-brutal-sm">
              C
            </div>
            <span className="font-black text-2xl tracking-tight text-[#121316]">
              CreatorHub
            </span>
          </div>
          <p className="text-xs font-extrabold uppercase tracking-widest text-[#6B6864]">
            Register Your Studio Profile
          </p>
        </div>

        <div className="brutal-card p-6 md:p-8 bg-white border-2 border-[#121316] rounded-3xl shadow-xl">
          {error && (
            <div className="mb-4 p-3 bg-[#FFEFEA] border-2 border-[#FF5A36] rounded-xl text-xs font-bold text-[#FF5A36]">
              {error}
            </div>
          )}

          {successMessage && (
            <div className="mb-4 p-3 bg-[#EEFFE5] border-2 border-[#28A745] rounded-xl text-xs font-bold text-[#1E7E34] flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#28A745]" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Continue with Google Button */}
          <button
            type="button"
            onClick={handleGoogleAuth}
            disabled={googleLoading}
            className="w-full py-3 px-4 bg-white hover:bg-[#FAF8F5] border-2 border-[#121316] rounded-xl text-xs font-black text-[#121316] transition-all flex items-center justify-center gap-3 shadow-brutal-sm hover:translate-y-[-1px] cursor-pointer disabled:opacity-60"
          >
            {googleLoading ? (
              <Loader2 className="w-4 h-4 animate-spin text-[#121316]" />
            ) : (
              <>
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Continue with Google</span>
              </>
            )}
          </button>

          {/* Divider */}
          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#121316]/20"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-3 text-[#6B6864] font-mono font-bold text-[10px]">
                Or register with email
              </span>
            </div>
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-xs font-black uppercase text-[#121316] mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-[#6B6864] absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Elena Rostova"
                  className="w-full pl-9 pr-3 py-2.5 bg-[#FAF8F5] border-2 border-[#121316] rounded-xl text-xs font-medium focus:outline-none focus:bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-black uppercase text-[#121316] mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#6B6864] absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="elena@creatorhub.com"
                  className="w-full pl-9 pr-3 py-2.5 bg-[#FAF8F5] border-2 border-[#121316] rounded-xl text-xs font-medium focus:outline-none focus:bg-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-black uppercase text-[#121316] mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#6B6864] absolute left-3 top-3" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-10 py-2.5 bg-[#FAF8F5] border-2 border-[#121316] rounded-xl text-xs font-medium focus:outline-none focus:bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-[#6B6864] hover:text-[#121316] cursor-pointer focus:outline-none"
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-black uppercase text-[#121316] mb-1.5">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#6B6864] absolute left-3 top-3" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-10 py-2.5 bg-[#FAF8F5] border-2 border-[#121316] rounded-xl text-xs font-medium focus:outline-none focus:bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-3 text-[#6B6864] hover:text-[#121316] cursor-pointer focus:outline-none"
                    title={showConfirmPassword ? 'Hide password' : 'Show password'}
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Role Selection */}
            <div>
              <label className="block text-xs font-black uppercase text-[#121316] mb-1.5">
                Select Your Primary Studio Role
              </label>
              <div className="grid grid-cols-3 gap-2">
                <div
                  onClick={() => setRole('CREATOR')}
                  className={`p-3 rounded-xl border-2 cursor-pointer transition-all ${
                    role === 'CREATOR'
                      ? 'bg-[#FFEFEA] border-[#FF5A36] text-[#FF5A36] shadow-brutal-sm font-black'
                      : 'bg-[#FAF8F5] border-[#121316] text-[#121316] hover:bg-[#F4F0EA]'
                  }`}
                >
                  <p className="text-xs font-black">CREATOR</p>
                  <p className="text-[10px] text-[#6B6864] mt-0.5">Vision & Blueprints</p>
                </div>

                <div
                  onClick={() => setRole('PRODUCER')}
                  className={`p-3 rounded-xl border-2 cursor-pointer transition-all ${
                    role === 'PRODUCER'
                      ? 'bg-[#EBF2FF] border-[#2A72FF] text-[#2A72FF] shadow-brutal-sm font-black'
                      : 'bg-[#FAF8F5] border-[#121316] text-[#121316] hover:bg-[#F4F0EA]'
                  }`}
                >
                  <p className="text-xs font-black">PRODUCER</p>
                  <p className="text-[10px] text-[#6B6864] mt-0.5">Media & Edits</p>
                </div>

                <div
                  onClick={() => setRole('CURATOR')}
                  className={`p-3 rounded-xl border-2 cursor-pointer transition-all ${
                    role === 'CURATOR'
                      ? 'bg-[#F9FFE5] border-[#121316] text-[#121316] bg-[#D2F800]/40 shadow-brutal-sm font-black'
                      : 'bg-[#FAF8F5] border-[#121316] text-[#121316] hover:bg-[#F4F0EA]'
                  }`}
                >
                  <p className="text-xs font-black">CURATOR</p>
                  <p className="text-[10px] text-[#6B6864] mt-0.5">Trends & Feeds</p>
                </div>
              </div>
            </div>

            {/* Terms checkbox */}
            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="terms"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                className="w-4 h-4 border-2 border-[#121316] rounded accent-[#FF5A36]"
              />
              <label htmlFor="terms" className="text-xs text-[#6B6864] font-medium cursor-pointer">
                I agree to the CreatorHub Terms of Service & Privacy Policy
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-[#FF5A36] hover:bg-[#e04c2b] text-white rounded-xl font-black text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2 mt-4 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <span>Create Studio Account</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-[#6B6864] mt-6 font-bold">
          Already registered?{' '}
          <Link to="/login" className="text-[#FF5A36] hover:underline font-black">
            Sign In Here
          </Link>
        </p>
      </div>
    </div>
  );
};
"""

login_code = r"""import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Loader2 } from 'lucide-react';
import api from '../services/api';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('creator@creatorhub.com');
  const [password, setPassword] = useState('Password123!');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await api.post('/auth/login', { email, password });
      const token = res.data?.token || res.data?.data?.token;
      const user = res.data?.user || res.data?.data?.user;

      if (token && user) {
        login(token, user);
        navigate('/app');
      } else {
        setError(res.data?.message || 'Login failed. Please check credentials.');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setError('');
    setGoogleLoading(true);
    try {
      const res = await api.post('/auth/google', {
        email: email.trim() || 'creator@creatorhub.com',
        name: 'Elena Rostova',
        role: 'CREATOR',
      });
      const token = res.data?.token || res.data?.data?.token;
      const user = res.data?.user || res.data?.data?.user;

      if (token && user) {
        login(token, user);
        navigate('/app');
      } else {
        setError(res.data?.message || 'Google Sign-In failed.');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Google Sign-In failed.');
    } finally {
      setGoogleLoading(false);
    }
  };

  const setDemoRole = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('Password123!');
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center p-4 selection:bg-[#FF5A36] selection:text-white">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <div
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 cursor-pointer mb-2"
          >
            <div className="w-10 h-10 bg-[#121316] rounded-xl flex items-center justify-center text-white font-black text-2xl shadow-brutal-sm">
              C
            </div>
            <span className="font-black text-2xl tracking-tight text-[#121316]">
              CreatorHub
            </span>
          </div>
          <p className="text-xs font-extrabold uppercase tracking-widest text-[#6B6864]">
            Studio Workspace Sign In
          </p>
        </div>

        <div className="brutal-card p-6 md:p-8 bg-white border-2 border-[#121316] rounded-3xl shadow-xl">
          {error && (
            <div className="mb-4 p-3 bg-[#FFEFEA] border-2 border-[#FF5A36] rounded-xl text-xs font-bold text-[#FF5A36]">
              {error}
            </div>
          )}

          {/* Continue with Google Button */}
          <button
            type="button"
            onClick={handleGoogleAuth}
            disabled={googleLoading}
            className="w-full py-3 px-4 bg-white hover:bg-[#FAF8F5] border-2 border-[#121316] rounded-xl text-xs font-black text-[#121316] transition-all flex items-center justify-center gap-3 shadow-brutal-sm hover:translate-y-[-1px] cursor-pointer disabled:opacity-60"
          >
            {googleLoading ? (
              <Loader2 className="w-4 h-4 animate-spin text-[#121316]" />
            ) : (
              <>
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Continue with Google</span>
              </>
            )}
          </button>

          {/* Divider */}
          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#121316]/20"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-3 text-[#6B6864] font-mono font-bold text-[10px]">
                Or sign in with email
              </span>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-black uppercase text-[#121316] mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#6B6864] absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@creatorhub.com"
                  className="w-full pl-9 pr-3 py-2.5 bg-[#FAF8F5] border-2 border-[#121316] rounded-xl text-xs font-medium focus:outline-none focus:bg-white"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-black uppercase text-[#121316]">
                  Password
                </label>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#6B6864] absolute left-3 top-3" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-10 py-2.5 bg-[#FAF8F5] border-2 border-[#121316] rounded-xl text-xs font-medium focus:outline-none focus:bg-white"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-[#6B6864] hover:text-[#121316] cursor-pointer focus:outline-none"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-[#FF5A36] hover:bg-[#e04c2b] text-white rounded-xl font-black text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2 mt-4 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <span>Sign In to Studio</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t-2 border-[#121316]/10">
            <p className="text-[10px] font-black uppercase text-[#6B6864] mb-2 tracking-wider">
              Quick Switch Seed Profiles:
            </p>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setDemoRole('creator@creatorhub.com')}
                className={`p-2 rounded-xl border-2 text-center text-xs font-extrabold transition-all cursor-pointer ${
                  email === 'creator@creatorhub.com'
                    ? 'bg-[#FF5A36] text-white border-[#121316] shadow-brutal-sm'
                    : 'bg-[#FAF8F5] text-[#121316] border-[#121316]/40 hover:bg-[#F4F0EA]'
                }`}
              >
                Creator
              </button>
              <button
                type="button"
                onClick={() => setDemoRole('producer@creatorhub.com')}
                className={`p-2 rounded-xl border-2 text-center text-xs font-extrabold transition-all cursor-pointer ${
                  email === 'producer@creatorhub.com'
                    ? 'bg-[#2A72FF] text-white border-[#121316] shadow-brutal-sm'
                    : 'bg-[#FAF8F5] text-[#121316] border-[#121316]/40 hover:bg-[#F4F0EA]'
                }`}
              >
                Producer
              </button>
              <button
                type="button"
                onClick={() => setDemoRole('curator@creatorhub.com')}
                className={`p-2 rounded-xl border-2 text-center text-xs font-extrabold transition-all cursor-pointer ${
                  email === 'curator@creatorhub.com'
                    ? 'bg-[#D2F800] text-[#121316] border-[#121316] shadow-brutal-sm'
                    : 'bg-[#FAF8F5] text-[#121316] border-[#121316]/40 hover:bg-[#F4F0EA]'
                }`}
              >
                Curator
              </button>
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-[#6B6864] mt-6 font-bold">
          Don&apos;t have an account?{' '}
          <Link to="/register" className="text-[#FF5A36] hover:underline font-black">
            Register New Account
          </Link>
        </p>
      </div>
    </div>
  );
};
"""

with open(r'D:\CreatorHub\frontend\src\pages\RegisterPage.tsx', 'w', encoding='utf-8') as f:
    f.write(register_code.strip())

with open(r'D:\CreatorHub\frontend\src\pages\LoginPage.tsx', 'w', encoding='utf-8') as f:
    f.write(login_code.strip())

print("Added Password Visibility Toggle Eye Icons & fixed Google Sign-In!")

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { LogIn, Key, Mail, ShieldAlert, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { SEO } from '../../components/common/SEO';

const loginSchema = zod.object({
  email: zod.string().email({ message: 'Please enter a valid email address.' }),
  password: zod.string().min(6, { message: 'Password must be at least 6 characters.' }),
  rememberMe: zod.boolean().optional()
});

type LoginFormData = zod.infer<typeof loginSchema>;

export const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const redirectPath = searchParams.get('redirect') || '/dashboard';

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema)
  });

  const onSubmit = async (data: LoginFormData) => {
    setErrorMsg(null);
    try {
      const success = await login(data.email, data.password);
      if (success) {
        navigate(redirectPath);
      } else {
        setErrorMsg('Invalid login credentials. Please verify your email and password.');
      }
    } catch {
      setErrorMsg('Login failed. Please verify your connection.');
    }
  };

  return (
    <div className="bg-deep-navy-50/70 min-h-screen flex items-center justify-center py-16 px-4">
      <SEO 
        title="Sign In to Edqoo" 
        description="Sign in to your Edqoo account to access your enrolled courses, practical labs, and dashboard."
        canonical="/login"
      />
      <div className="w-full max-w-md bg-white border border-deep-navy-200 p-8 rounded-2xl shadow-xl space-y-6 text-left">
        
        {/* Header Logo */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2 group justify-center">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-royal-blue-600 to-royal-blue-500 flex items-center justify-center text-white font-display font-black text-lg shadow-sm">
              E
            </div>
            <span className="font-display font-extrabold text-xl tracking-tight text-deep-navy-900">
              Edqoo
            </span>
          </Link>
          <h2 className="text-xl font-display font-bold text-deep-navy-900 mt-2">Welcome Back</h2>
          <p className="text-xs text-slate-500">Sign in to resume building your practical technology capabilities.</p>
        </div>

        {errorMsg && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2 font-medium">
            <ShieldAlert className="w-4 h-4 text-red-600 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Field: Email */}
          <div className="space-y-1">
            <label htmlFor="login-email" className="text-[10px] font-bold text-deep-navy-800 uppercase tracking-wider block">
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                id="login-email"
                placeholder="e.g. name@example.com"
                {...register('email')}
                className={`w-full pl-9 pr-3 py-2 bg-deep-navy-50 border rounded-lg text-xs text-deep-navy-900 focus:outline-none focus:bg-white transition-all ${
                  errors.email ? 'border-red-400 focus:border-red-500' : 'border-deep-navy-200 focus:border-royal-blue-600'
                }`}
              />
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
            {errors.email && <span className="text-[10px] text-red-500 font-medium">{errors.email.message}</span>}
          </div>

          {/* Field: Password */}
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <label htmlFor="login-password" className="text-[10px] font-bold text-deep-navy-800 uppercase tracking-wider">
                Password
              </label>
              <Link to="/forgot-password" className="text-[10px] font-semibold text-royal-blue-600 hover:text-royal-blue-700">
                Forgot Password?
              </Link>
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                id="login-password"
                placeholder="••••••••"
                {...register('password')}
                className={`w-full pl-9 pr-10 py-2 bg-deep-navy-50 border rounded-lg text-xs text-deep-navy-900 focus:outline-none focus:bg-white transition-all ${
                  errors.password ? 'border-red-400 focus:border-red-500' : 'border-deep-navy-200 focus:border-royal-blue-600'
                }`}
              />
              <Key className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-deep-navy-900 focus:outline-none"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.password && <span className="text-[10px] text-red-500 font-medium">{errors.password.message}</span>}
          </div>

          {/* Field: Remember me */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="remember-me"
              {...register('rememberMe')}
              className="w-4 h-4 border-deep-navy-300 rounded text-royal-blue-600 focus:ring-royal-blue-500"
            />
            <label htmlFor="remember-me" className="ml-2 text-xs text-slate-600 select-none">
              Remember me on this device
            </label>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary w-full py-3 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-md"
          >
            {isSubmitting ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Signing In...</span>
              </>
            ) : (
              <>
                <span>Sign In</span>
                <LogIn className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="border-t border-deep-navy-100 pt-4 text-center">
          <p className="text-xs text-slate-500">
            Don't have an account yet?{' '}
            <Link to="/register" className="font-bold text-royal-blue-600 hover:text-royal-blue-700">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

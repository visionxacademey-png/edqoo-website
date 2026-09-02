import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, Mail, Key, User, Phone, ShieldAlert, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { SEO } from '../../components/common/SEO';

const registerSchema = zod.object({
  name: zod.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: zod.string().email({ message: 'Please enter a valid email address.' }),
  phone: zod.string().min(10, { message: 'Phone must be at least 10 digits.' }),
  password: zod.string().min(6, { message: 'Password must be at least 6 characters.' }),
  confirmPassword: zod.string(),
  terms: zod.boolean().refine((val) => val === true, {
    message: 'You must accept the terms of service.'
  })
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match.",
  path: ["confirmPassword"]
});

type RegisterFormData = zod.infer<typeof registerSchema>;

export const Register: React.FC = () => {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema)
  });

  const onSubmit = async (data: RegisterFormData) => {
    setErrorMsg(null);
    try {
      const success = await registerUser(data.name, data.email, data.phone, data.password);
      if (success) {
        navigate('/dashboard');
      } else {
        setErrorMsg('Registration failed. Please check your details.');
      }
    } catch {
      setErrorMsg('Network error while registering account.');
    }
  };

  return (
    <div className="bg-deep-navy-50/70 min-h-screen flex items-center justify-center py-16 px-4">
      <SEO 
        title="Create an Edqoo Account" 
        description="Join Edqoo to start your professional learning journey with verified industry certifications."
        canonical="/register"
      />
      <div className="w-full max-w-md bg-white border border-deep-navy-200 p-8 rounded-2xl shadow-xl space-y-6 text-left">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2 justify-center">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-royal-blue-600 to-royal-blue-500 flex items-center justify-center text-white font-display font-black text-lg shadow-sm">
              E
            </div>
            <span className="font-display font-extrabold text-xl tracking-tight text-deep-navy-900">
              Edqoo
            </span>
          </Link>
          <h2 className="text-xl font-display font-bold text-deep-navy-900 mt-2">Create Your Account</h2>
          <p className="text-xs text-slate-500">Sign up to begin your professional technology journey today.</p>
        </div>

        {errorMsg && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2 font-medium">
            <ShieldAlert className="w-4 h-4 text-red-600 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3.5">
          {/* Field: Name */}
          <div className="space-y-1">
            <label htmlFor="reg-name" className="text-[10px] font-bold text-deep-navy-800 uppercase tracking-wider block">
              Full Name
            </label>
            <div className="relative">
              <input
                type="text"
                id="reg-name"
                placeholder="e.g. Alex Morgan"
                {...register('name')}
                className={`w-full pl-9 pr-3 py-2 bg-deep-navy-50 border rounded-lg text-xs text-deep-navy-900 focus:outline-none focus:bg-white transition-all ${
                  errors.name ? 'border-red-400 focus:border-red-500' : 'border-deep-navy-200 focus:border-royal-blue-600'
                }`}
              />
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
            {errors.name && <span className="text-[10px] text-red-500 font-medium">{errors.name.message}</span>}
          </div>

          {/* Field: Email */}
          <div className="space-y-1">
            <label htmlFor="reg-email" className="text-[10px] font-bold text-deep-navy-800 uppercase tracking-wider block">
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                id="reg-email"
                placeholder="e.g. alex@example.com"
                {...register('email')}
                className={`w-full pl-9 pr-3 py-2 bg-deep-navy-50 border rounded-lg text-xs text-deep-navy-900 focus:outline-none focus:bg-white transition-all ${
                  errors.email ? 'border-red-400 focus:border-red-500' : 'border-deep-navy-200 focus:border-royal-blue-600'
                }`}
              />
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
            {errors.email && <span className="text-[10px] text-red-500 font-medium">{errors.email.message}</span>}
          </div>

          {/* Field: Phone */}
          <div className="space-y-1">
            <label htmlFor="reg-phone" className="text-[10px] font-bold text-deep-navy-800 uppercase tracking-wider block">
              Phone Number
            </label>
            <div className="relative">
              <input
                type="tel"
                id="reg-phone"
                placeholder="e.g. +1 555-0199"
                {...register('phone')}
                className={`w-full pl-9 pr-3 py-2 bg-deep-navy-50 border rounded-lg text-xs text-deep-navy-900 focus:outline-none focus:bg-white transition-all ${
                  errors.phone ? 'border-red-400 focus:border-red-500' : 'border-deep-navy-200 focus:border-royal-blue-600'
                }`}
              />
              <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
            {errors.phone && <span className="text-[10px] text-red-500 font-medium">{errors.phone.message}</span>}
          </div>

          {/* Field: Password */}
          <div className="space-y-1">
            <label htmlFor="reg-password" className="text-[10px] font-bold text-deep-navy-800 uppercase tracking-wider block">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                id="reg-password"
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

          {/* Field: Confirm Password */}
          <div className="space-y-1">
            <label htmlFor="reg-confirm" className="text-[10px] font-bold text-deep-navy-800 uppercase tracking-wider block">
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                id="reg-confirm"
                placeholder="••••••••"
                {...register('confirmPassword')}
                className={`w-full pl-9 pr-10 py-2 bg-deep-navy-50 border rounded-lg text-xs text-deep-navy-900 focus:outline-none focus:bg-white transition-all ${
                  errors.confirmPassword ? 'border-red-400 focus:border-red-500' : 'border-deep-navy-200 focus:border-royal-blue-600'
                }`}
              />
              <Key className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-deep-navy-900 focus:outline-none"
                aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.confirmPassword && <span className="text-[10px] text-red-500 font-medium">{errors.confirmPassword.message}</span>}
          </div>

          {/* Terms checkbox */}
          <div className="flex items-start pt-1">
            <input
              type="checkbox"
              id="reg-terms"
              {...register('terms')}
              className="w-4 h-4 mt-0.5 border-deep-navy-300 rounded text-royal-blue-600 focus:ring-royal-blue-500"
            />
            <label htmlFor="reg-terms" className="ml-2 text-xs text-slate-600 select-none">
              I agree to the Terms of Service & Privacy Policy
            </label>
          </div>
          {errors.terms && <span className="text-[10px] text-red-500 font-medium block">{errors.terms.message}</span>}

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary w-full py-3 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-md mt-2"
          >
            {isSubmitting ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Creating Account...</span>
              </>
            ) : (
              <>
                <span>Create Account</span>
                <UserPlus className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="border-t border-deep-navy-100 pt-4 text-center">
          <p className="text-xs text-slate-500">
            Already have an account?{' '}
            <Link to="/login" className="font-bold text-royal-blue-600 hover:text-royal-blue-700">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

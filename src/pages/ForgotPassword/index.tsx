import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle2, ShieldAlert } from 'lucide-react';
import { authService } from '../../services/authService';

const forgotPasswordSchema = zod.object({
  email: zod.string().email({ message: 'Please enter a valid email address.' })
});

type ForgotPasswordFormData = zod.infer<typeof forgotPasswordSchema>;

export const ForgotPassword: React.FC = () => {
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema)
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setErrorMsg(null);
    try {
      const resp = await authService.forgotPassword(data.email);
      if (resp.success) {
        setSuccess(true);
      } else {
        setErrorMsg('Failed to process request. Verify your input.');
      }
    } catch {
      setErrorMsg('Network error requesting recovery token.');
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen flex items-center justify-center py-16 px-4">
      <div className="w-full max-w-md bg-white border border-slate-200 p-8 rounded-2xl shadow-xl space-y-6 text-left">
        {/* Header Logo */}
        <div className="text-center space-y-3">
          <Link to="/" className="inline-block focus:outline-none">
            <img 
              src="/logo.jpg" 
              alt="EDQOO - Your skill partner" 
              className="h-11 w-auto object-contain mx-auto max-w-[170px]" 
            />
          </Link>
          <h2 className="text-xl font-display font-bold text-slate-900 mt-2">Reset Password</h2>
          <p className="text-xs text-slate-500">We will email you a secure link to reset your password.</p>
        </div>

        {errorMsg && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2 font-medium">
            <ShieldAlert className="w-4 h-4 text-red-600 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {success ? (
          <div className="space-y-4 text-center">
            <div className="p-4 bg-purple-50 border border-purple-200 text-purple-900 rounded-xl space-y-2 text-xs">
              <CheckCircle2 className="w-6 h-6 text-purple-600 mx-auto" />
              <p className="font-bold">Password reset link dispatched!</p>
              <p className="text-slate-600">Check your inbox for step-by-step instructions.</p>
            </div>
            <Link
              to="/login"
              className="btn-primary w-full py-2.5 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              Return to Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1">
              <label htmlFor="fp-email" className="text-[10px] font-bold text-slate-700 uppercase tracking-wider block">
                Your Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  id="fp-email"
                  placeholder="e.g. name@example.com"
                  {...register('email')}
                  className={`w-full pl-9 pr-3 py-2.5 bg-slate-50 border rounded-lg text-xs text-slate-900 focus:outline-none focus:bg-white transition-all ${
                    errors.email ? 'border-red-400 focus:border-red-500' : 'border-slate-300 focus:border-purple-600'
                  }`}
                />
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
              {errors.email && <span className="text-[10px] text-red-500 font-medium">{errors.email.message}</span>}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary w-full py-3 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-md hover:shadow-lg"
            >
              {isSubmitting ? 'Sending Request...' : 'Send Recovery Link'}
            </button>
          </form>
        )}

        <div className="border-t border-slate-100 pt-4 text-center">
          <Link to="/login" className="inline-flex items-center gap-1 text-xs font-semibold text-purple-600 hover:text-purple-800">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Login</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

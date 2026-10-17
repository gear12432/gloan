'use client';

import React, { useState } from 'react';
import { Building2, Mail, Lock, ArrowRight, Sparkles } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface SignInViewProps {
  onNavigateSignUp: () => void;
  onForgotPassword: () => void;
}

export default function SignInView({ onNavigateSignUp, onForgotPassword }: SignInViewProps) {
  const { signIn, demoLogin } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await signIn(email, password);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to sign in. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoSignIn = async () => {
    setLoading(true);
    try {
      await demoLogin();
    } catch (err: any) {
      console.error(err);
      setError('Demo sign in failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f3f6f9] flex flex-col items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-md flex flex-col items-center">
        
        {/* Logo Box */}
        <div className="w-16 h-16 bg-[#0d9488] rounded-2xl flex items-center justify-center shadow-lg shadow-teal-700/20 mb-4">
          <Building2 className="w-9 h-9 text-white" />
        </div>

        {/* Title */}
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight text-center">
          SMALL FINANCE
        </h1>
        <p className="text-sm text-slate-500 font-medium mt-1 mb-6 text-center">
          Real-Time Customer Management Console
        </p>

        {/* Card */}
        <div className="w-full bg-white rounded-3xl p-6 sm:p-8 shadow-xl shadow-slate-200/60 border border-slate-100">
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-xl text-xs font-medium border border-red-100">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* EMAIL */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                EMAIL ADDRESS
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@business.com"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-11 pr-4 text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0d9488]/40 focus:border-[#0d9488]"
                />
              </div>
            </div>

            {/* PASSWORD */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  PASSWORD
                </label>
                <button
                  type="button"
                  onClick={onForgotPassword}
                  className="text-xs font-bold text-[#0d9488] hover:underline"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-11 pr-4 text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0d9488]/40 focus:border-[#0d9488]"
                />
              </div>
            </div>

            {/* SIGN IN BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#0d9488] hover:bg-[#0f766e] text-white font-bold py-3.5 rounded-xl shadow-md shadow-teal-700/20 flex items-center justify-center gap-2 transition-all active:scale-[0.99] disabled:opacity-60"
            >
              {loading ? 'Signing In...' : 'Sign In'}
              <ArrowRight className="w-5 h-5" />
            </button>
          </form>

          {/* Quick Demo Login Option */}
          <div className="mt-4 pt-4 border-t border-slate-100 flex flex-col items-center">
            <button
              type="button"
              onClick={handleDemoSignIn}
              disabled={loading}
              className="w-full py-2.5 px-4 bg-teal-50 hover:bg-teal-100 text-[#0d9488] font-semibold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors"
            >
              <Sparkles className="w-4 h-4 text-[#0d9488]" />
              Quick Demo Login (One-Click)
            </button>
          </div>

          {/* CREATE ACCOUNT LINK */}
          <div className="mt-6 text-center text-xs font-medium text-slate-500">
            New to Small Finance?{' '}
            <button
              type="button"
              onClick={onNavigateSignUp}
              className="font-bold text-[#0d9488] hover:underline"
            >
              Create an Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

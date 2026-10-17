'use client';

import React, { useState } from 'react';
import { Building2, Mail, Lock, ArrowRight, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { useAuth } from '@/context/AuthContext';
import FloatingInput from './ui/FloatingInput';

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
    <motion.div 
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen bg-[#f3f6f9] flex flex-col items-center justify-center p-4 sm:p-6"
    >
      <div className="w-full max-w-lg flex flex-col items-center">
        
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
            <FloatingInput
              label="Email Address"
              icon={Mail}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            {/* PASSWORD */}
            <div>
              <div className="flex justify-end mb-1">
                <button
                  type="button"
                  onClick={onForgotPassword}
                  className="text-xs font-bold text-[#0d9488] hover:underline"
                >
                  Forgot password?
                </button>
              </div>
              <FloatingInput
                label="Password"
                icon={Lock}
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {/* SIGN IN BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#0d9488] hover:bg-[#0f766e] text-white font-bold py-3.5 rounded-xl shadow-md shadow-teal-700/20 flex items-center justify-center gap-2 transition-all active:scale-[0.99] disabled:opacity-60 text-sm sm:text-base"
            >
              {loading ? 'Signing In...' : 'Sign In'}
              <ArrowRight className="w-5 h-5" />
            </button>
          </form>

          {/* Quick Demo Login Option */}
          <div className="mt-5 pt-4 border-t border-slate-100 flex flex-col items-center">
            <button
              type="button"
              onClick={handleDemoSignIn}
              disabled={loading}
              className="w-full py-3 px-4 bg-teal-50 hover:bg-teal-100 text-[#0d9488] font-bold text-xs sm:text-sm rounded-xl flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
            >
              <Sparkles className="w-4 h-4 text-[#0d9488]" />
              Quick Demo Login (One-Click)
            </button>
          </div>

          {/* CREATE ACCOUNT LINK */}
          <div className="mt-6 text-center text-xs sm:text-sm font-medium text-slate-500">
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
    </motion.div>
  );
}

'use client';

import React, { useState } from 'react';
import { Building2, User, Phone, Mail, Lock, ShieldCheck, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import { useAuth } from '@/context/AuthContext';
import FloatingInput from './ui/FloatingInput';

interface SignUpViewProps {
  onNavigateSignIn: () => void;
}

export default function SignUpView({ onNavigateSignIn }: SignUpViewProps) {
  const { signUp } = useAuth();
  const [fullName, setFullName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !businessName || !mobileNumber || !email || !password) {
      setError('Please fill in all required fields');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setError('');
    setLoading(true);
    try {
      await signUp(email, password, fullName, businessName, mobileNumber);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to create business account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen bg-[#f3f6f9] flex flex-col items-center justify-center p-4 sm:p-6 my-6"
    >
      <div className="w-full max-w-lg flex flex-col items-center">
        
        {/* Logo */}
        <div className="w-16 h-16 bg-[#0d9488] rounded-2xl flex items-center justify-center shadow-lg shadow-teal-700/20 mb-4">
          <Building2 className="w-9 h-9 text-white" />
        </div>

        {/* Title */}
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight text-center">
          SMALL FINANCE
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1 mb-6 text-center px-4">
          Create your Business Account & Start Managing Customers
        </p>

        {/* Card */}
        <div className="w-full bg-white rounded-3xl p-6 sm:p-8 shadow-xl shadow-slate-200/60 border border-slate-100">
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-xl text-xs font-medium border border-red-100">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* FULL NAME */}
            <FloatingInput
              label="Full Name"
              icon={User}
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />

            {/* BUSINESS NAME */}
            <FloatingInput
              label="Business Name"
              icon={Building2}
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              required
            />

            {/* MOBILE NUMBER */}
            <FloatingInput
              label="Mobile Number"
              icon={Phone}
              type="tel"
              value={mobileNumber}
              onChange={(e) => setMobileNumber(e.target.value)}
              required
            />

            {/* EMAIL ADDRESS */}
            <FloatingInput
              label="Email Address"
              icon={Mail}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            {/* PASSWORD */}
            <FloatingInput
              label="Password (At least 6 characters)"
              icon={Lock}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            {/* CONFIRM PASSWORD */}
            <FloatingInput
              label="Confirm Password"
              icon={ShieldCheck}
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />

            {/* SUBMIT BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#0d9488] hover:bg-[#0f766e] text-white font-bold py-3.5 rounded-xl shadow-md shadow-teal-700/20 flex items-center justify-center gap-2 transition-all active:scale-[0.99] disabled:opacity-60 mt-2 text-sm sm:text-base"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
              <ArrowRight className="w-5 h-5" />
            </button>
          </form>

          {/* LINK TO SIGN IN */}
          <div className="mt-6 text-center text-xs sm:text-sm font-medium text-slate-500">
            Already have a Business Account?{' '}
            <button
              type="button"
              onClick={onNavigateSignIn}
              className="font-bold text-[#0d9488] hover:underline"
            >
              Log In
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

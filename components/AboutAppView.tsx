'use client';

import React from 'react';
import { ArrowLeft, Info, Building2, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';
import { useAuth } from '@/context/AuthContext';

interface AboutAppViewProps {
  onBack: () => void;
}

export default function AboutAppView({ onBack }: AboutAppViewProps) {
  const { userProfile } = useAuth();

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="min-h-screen bg-[#f8fafc] pb-12 flex flex-col text-slate-900"
    >
      {/* Header */}
      <div className="bg-[#0d9488] text-white pt-6 pb-6 px-4 sm:px-6 rounded-b-[2rem] shadow-md flex items-center justify-between">
        <button
          onClick={onBack}
          className="w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors active:scale-95 cursor-pointer"
          title="Back"
        >
          <ArrowLeft className="w-6 h-6 text-white" />
        </button>
        <h1 className="text-base sm:text-xl font-black uppercase tracking-wide text-white">
          About Application
        </h1>
        <div className="w-11" />
      </div>

      <main className="max-w-xl w-full mx-auto px-4 sm:px-6 mt-6 space-y-5">
        {/* App Logo & Name Card */}
        <div className="bg-white rounded-3xl p-8 shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col items-center text-center space-y-4">
          <div className="w-20 h-20 rounded-3xl bg-[#0d9488] text-white flex items-center justify-center shadow-lg shadow-teal-700/20 text-3xl font-black">
            SF
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-900 uppercase tracking-wider">Small Finance Console</h2>
            <p className="text-xs font-bold text-slate-400 mt-1">Version 2.4.0 (Production)</p>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-md">
            A professional, secure, and intuitive digital ledger and loan management platform designed to streamline small business financial operations with real-time syncing and precise calculations.
          </p>
        </div>

        {/* Details Card */}
        <div className="bg-white rounded-3xl p-6 shadow-xl shadow-slate-200/50 border border-slate-100 space-y-4">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">System Information</h3>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2 border-b border-slate-100 text-xs sm:text-sm">
              <span className="font-semibold text-slate-500">Business Name</span>
              <span className="font-black text-slate-900 uppercase">{userProfile?.businessName || 'KH LOAN'}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-slate-100 text-xs sm:text-sm">
              <span className="font-semibold text-slate-500">Registered Owner</span>
              <span className="font-black text-slate-900">{userProfile?.fullName || 'Gear'}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-slate-100 text-xs sm:text-sm">
              <span className="font-semibold text-slate-500">Database Engine</span>
              <span className="font-black text-[#0d9488]">Google Cloud Firestore</span>
            </div>
            <div className="flex items-center justify-between py-2 text-xs sm:text-sm">
              <span className="font-semibold text-slate-500">Security Standard</span>
              <span className="font-black text-emerald-600 flex items-center gap-1">
                <ShieldCheck className="w-4 h-4" /> End-to-End Encrypted
              </span>
            </div>
          </div>
        </div>
      </main>
    </motion.div>
  );
}

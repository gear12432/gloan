'use client';

import React, { useState } from 'react';
import { ArrowLeft, Percent, Calculator, Info, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';
import { useAuth } from '@/context/AuthContext';

interface InterestRateViewProps {
  onBack: () => void;
}

export default function InterestRateView({ onBack }: InterestRateViewProps) {
  const { userProfile, updateProfile } = useAuth();
  const [interestRate, setInterestRate] = useState<number | string>(userProfile?.defaultInterestRate ?? 2);
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSaveRate = async (e: React.FormEvent) => {
    e.preventDefault();
    const rateNum = parseFloat(String(interestRate));
    if (isNaN(rateNum) || rateNum < 0) {
      return;
    }

    setLoading(true);
    try {
      await updateProfile({ defaultInterestRate: rateNum });
      setSuccessMsg('Interest rate updated successfully! This will automatically calculate interest when adding new customer loans.');
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

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
          className="w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors active:scale-95"
          title="Back"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-base sm:text-xl font-black uppercase tracking-wide">
          Interest Rate Settings
        </h1>
        <div className="w-11" />
      </div>

      <main className="max-w-xl w-full mx-auto px-4 sm:px-6 mt-6 space-y-5">
        {successMsg && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-emerald-50 border border-emerald-300 text-emerald-800 p-4 rounded-2xl flex items-center gap-3 text-xs sm:text-sm font-bold shadow-sm"
          >
            <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-emerald-600" />
            <span>{successMsg}</span>
          </motion.div>
        )}

        {/* Interest Rate Configuration Form */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl shadow-slate-200/50 border border-slate-100 space-y-6">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-teal-50 text-[#0d9488] flex items-center justify-center">
              <Percent className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-slate-900">Configure Default Interest Rate</h2>
              <p className="text-xs font-semibold text-slate-500">Set the percentage applied to new loan amounts</p>
            </div>
          </div>

          <form onSubmit={handleSaveRate} className="space-y-4">
            <div>
              <label className="text-xs font-black text-slate-700 uppercase tracking-wider block mb-2">
                Interest Rate Percentage (%)
              </label>
              <div className="relative flex items-center">
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="100"
                  value={interestRate}
                  onChange={(e) => setInterestRate(e.target.value)}
                  placeholder="e.g. 2"
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3.5 text-base font-black text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0d9488] shadow-inner"
                  required
                />
                <div className="absolute right-4 text-slate-400 font-bold text-sm">
                  % per period
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#0d9488] hover:bg-[#0f766e] text-white py-3.5 rounded-2xl text-sm font-black shadow-md shadow-teal-700/20 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              {loading ? 'Saving...' : 'Save Interest Rate'}
            </button>
          </form>
        </div>

        {/* Calculation Method Box */}
        <div className="bg-white rounded-3xl p-6 shadow-xl shadow-slate-200/50 border border-slate-100 space-y-4">
          <div className="flex items-center gap-2 text-[#0d9488]">
            <Calculator className="w-5 h-5" />
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wide">Automatic Calculation Logic</h3>
          </div>
          <div className="space-y-2.5 text-xs sm:text-sm text-slate-600 leading-relaxed">
            <p>
              • When adding a new customer in the <strong>Add Customer</strong> screen, entering the loan amount will automatically calculate and fill the interest amount using this configured percentage.
            </p>
            <p>
              • Formula: <code className="bg-slate-100 px-2 py-1 rounded text-teal-700 font-bold">Interest = (Loan Amount × Rate %) / 100</code>
            </p>
          </div>
        </div>

        {/* Information Notice */}
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
          <Info className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-amber-900 leading-relaxed font-semibold">
            Changing this default interest rate applies to newly created customer records. Existing customer loans maintain their originally assigned terms.
          </p>
        </div>
      </main>
    </motion.div>
  );
}

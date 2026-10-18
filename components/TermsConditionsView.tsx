'use client';

import React from 'react';
import { ArrowLeft, FileText, Calendar, Percent, AlertCircle, CheckCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { useAuth } from '@/context/AuthContext';

interface TermsConditionsViewProps {
  onBack: () => void;
}

export default function TermsConditionsView({ onBack }: TermsConditionsViewProps) {
  const { userProfile } = useAuth();

  const businessName = userProfile?.businessName || 'KH LOAN';
  const defaultInterest = userProfile?.defaultInterestRate || 0;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="min-h-screen bg-[#f3f6f9] pb-12 flex flex-col font-sans"
    >
      {/* Header */}
      <div className="bg-[#0d9488] text-white pt-6 pb-6 px-4 sm:px-6 rounded-b-[2rem] shadow-md flex items-center justify-between">
        <button
          onClick={onBack}
          className="w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors active:scale-95"
          title="Back"
        >
          <ArrowLeft className="w-6 h-6" strokeWidth={2.5} />
        </button>

        <h1 className="text-base sm:text-xl font-black uppercase tracking-wide">
          TERMS & CONDITIONS / नियम और शर्तें
        </h1>

        <div className="w-11" />
      </div>

      {/* Main Content */}
      <main className="max-w-2xl w-full mx-auto px-4 sm:px-6 mt-5 space-y-4 flex-1">
        
        {/* Banner Card */}
        <div className="bg-white rounded-3xl p-6 shadow-xl shadow-slate-200/50 border border-slate-100 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0 shadow-2xs border border-amber-200">
            <FileText className="w-7 h-7" strokeWidth={2.5} />
          </div>
          <div>
            <h2 className="text-lg font-black text-slate-900">
              {businessName} Loan & Repayment Terms
            </h2>
            <p className="text-xs font-bold text-slate-500">
              Official Business Guidelines & Repayment Terms
            </p>
          </div>
        </div>

        {/* Full Terms & Conditions Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl shadow-slate-200/50 border border-slate-100 space-y-6 text-xs sm:text-sm text-slate-700 leading-relaxed">
          
          {/* Section 1 */}
          <section className="space-y-2">
            <h3 className="text-sm sm:text-base font-black text-slate-900 flex items-center gap-2">
              <Percent className="w-4 h-4 text-[#0d9488]" strokeWidth={2.5} />
              1. Loan Interest & Amount Calculation
            </h3>
            <p>
              When issuing a loan to a customer through <strong className="text-slate-900">{businessName}</strong>, the total loan payable consists of the Principal Loan Amount plus the calculated Interest Amount based on the configured Default Interest Rate (currently configured at <strong>{defaultInterest}%</strong>).
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-2">
            <h3 className="text-sm sm:text-base font-black text-slate-900 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#0d9488]" strokeWidth={2.5} />
              2. Repayment Frequency Schedule (Per Day, Per Week, Per Month)
            </h3>
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-2 font-medium">
              <p className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" strokeWidth={2.5} />
                <span><strong>Per Day (दैनिक भुगतान)</strong>: Customer agrees to make daily installment payments until the total subtotal loan amount is fully cleared.</span>
              </p>
              <p className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" strokeWidth={2.5} />
                <span><strong>Per Week (साप्ताहिक भुगतान)</strong>: Customer agrees to pay weekly installments on the assigned day of each week.</span>
              </p>
              <p className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" strokeWidth={2.5} />
                <span><strong>Per Month (मासिक भुगतान)</strong>: Customer agrees to pay monthly installments on the specified due date of every month.</span>
              </p>
            </div>
          </section>

          {/* Section 3 */}
          <section className="space-y-2">
            <h3 className="text-sm sm:text-base font-black text-slate-900 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-[#0d9488]" strokeWidth={2.5} />
              3. Payment Deductions & Settlement Status
            </h3>
            <p>
              Every payment recorded via &quot;Record Payment&quot; is automatically logged with an official Invoice ID (e.g. INV-XXXXXX). Upon saving payment, the status updates to <strong>SUCCESSFUL</strong> and reflects in real time under the Successful records ledger.
            </p>
          </section>

          <button
            onClick={onBack}
            className="w-full bg-[#0d9488] hover:bg-[#0f766e] text-white font-extrabold py-3.5 rounded-2xl shadow-md transition-all active:scale-95 mt-4"
          >
            I Accept Terms & Conditions
          </button>

        </div>

      </main>
    </motion.div>
  );
}

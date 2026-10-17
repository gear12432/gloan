'use client';

import React, { useState } from 'react';
import { ArrowLeft, CheckCircle2, IndianRupee, FileText, Calculator } from 'lucide-react';
import { motion } from 'motion/react';
import { Customer } from '@/types/finance';
import { useAuth } from '@/context/AuthContext';
import FloatingInput from './ui/FloatingInput';

interface RecordPaymentModalProps {
  customer: Customer;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function RecordPaymentModal({
  customer,
  isOpen,
  onClose,
  onSuccess,
}: RecordPaymentModalProps) {
  const { recordPayment } = useAuth();
  const [paidAmount, setPaidAmount] = useState<string>('');
  const [description, setDescription] = useState<string>('Payment received');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const currentTotalAmount = customer.remainingAmount ?? customer.subTotalLoanAmount;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(paidAmount);
    if (isNaN(amount) || amount <= 0) {
      setError('Please enter a valid payment amount.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      await recordPayment(customer, amount, description.trim());
      setPaidAmount('');
      setDescription('Payment received');
      onSuccess();
      onClose();
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to record payment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 15 }}
      transition={{ duration: 0.25 }}
      className="fixed inset-0 z-50 bg-[#f3f6f9] w-full min-h-screen h-full overflow-y-auto flex flex-col"
    >
      {/* Top Teal Full Width Header */}
      <div className="bg-[#0d9488] text-white py-5 px-4 sm:px-6 rounded-b-[2rem] shadow-md flex items-center justify-between">
        <button
          type="button"
          onClick={onClose}
          className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="text-center">
          <h1 className="text-base sm:text-lg font-extrabold uppercase tracking-wide flex items-center justify-center gap-2">
            <Calculator className="w-5 h-5" />
            Record Payment & Calculation
          </h1>
          <p className="text-xs text-teal-100 font-semibold mt-0.5">
            {customer.customerName} ({customer.customerId})
          </p>
        </div>

        <div className="w-10" />
      </div>

      {/* Main Full Width Form Container */}
      <main className="max-w-3xl w-full mx-auto px-4 sm:px-6 mt-6 flex-1 pb-12">
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl shadow-slate-200/60 border border-slate-100 space-y-6">
          
          {error && (
            <div className="p-3.5 bg-red-50 text-red-600 rounded-xl text-xs font-semibold border border-red-100">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Total Loan Amount / Remaining Balance Box */}
            <div className="bg-red-50/50 border border-red-200 rounded-2xl p-4 sm:p-5 flex items-center justify-between">
              <div>
                <p className="text-[11px] font-black text-red-600 uppercase tracking-wider">
                  TOTAL LOAN AMOUNT
                </p>
                <p className="text-xs font-medium text-slate-500 mt-0.5">
                  Current remaining unpaid loan balance
                </p>
              </div>
              <p className="text-xl sm:text-2xl font-black text-red-600 flex items-center gap-1">
                ₹{currentTotalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </p>
            </div>

            {/* Paid Amount (₹) with Floating Input */}
            <FloatingInput
              label="Paid Amount (₹)"
              icon={IndianRupee}
              type="number"
              step="any"
              value={paidAmount}
              onChange={(e) => setPaidAmount(e.target.value)}
              required
              autoFocus
            />

            {/* Description with Floating Input */}
            <FloatingInput
              label="Description"
              icon={FileText}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            {/* Large Action Buttons */}
            <div className="flex items-center gap-3.5 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm py-3.5 sm:py-4 rounded-2xl transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-[#0d9488] hover:bg-[#0f766e] text-white font-extrabold text-sm py-3.5 sm:py-4 rounded-2xl shadow-lg shadow-teal-700/20 flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-60"
              >
                <CheckCircle2 className="w-5 h-5" />
                {loading ? 'Saving...' : 'Save & Deduct'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </motion.div>
  );
}

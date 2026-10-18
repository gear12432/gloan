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
  // Automatically pre-fill paid amount with customer's installment amount (or remaining amount)
  const [paidAmount, setPaidAmount] = useState<string>(
    customer.installmentAmount 
      ? String(customer.installmentAmount) 
      : (customer.remainingAmount ? String(customer.remainingAmount) : '')
  );
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
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 bg-[#0d9488] w-full h-full flex flex-col overflow-hidden"
    >
      {/* Top Header Bar - Seamless Header */}
      <div className="bg-[#0d9488] text-white pt-6 pb-6 px-4 sm:px-6 flex items-center justify-between">
        <button
          type="button"
          onClick={onClose}
          className="w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>

        <div className="text-center">
          <h1 className="text-base sm:text-xl font-extrabold uppercase tracking-wide flex items-center justify-center gap-2">
            <Calculator className="w-5 h-5 sm:w-6 sm:h-6" />
            RECORD PAYMENT & CALCULATION
          </h1>
          <p className="text-xs sm:text-sm text-teal-100 font-bold mt-0.5">
            {customer.customerName} ({customer.customerId})
          </p>
        </div>

        <div className="w-11" />
      </div>

      {/* Main Form Body - Edge-to-Edge Full Height & Full Width Box without Gaps */}
      <main className="w-full flex-1 bg-white rounded-t-[2.5rem] p-5 sm:p-8 flex flex-col justify-between overflow-y-auto shadow-2xl">
        <div className="max-w-3xl w-full mx-auto space-y-6">
          
          {error && (
            <div className="p-4 bg-red-50 text-red-600 rounded-2xl text-xs sm:text-sm font-bold border border-red-100">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6 flex flex-col h-full justify-between">
            <div className="space-y-6">
              {/* Total Loan Amount Box */}
              <div className="bg-red-50/60 border-2 border-red-200/80 rounded-2xl p-4 sm:p-5 flex items-center justify-between">
                <div>
                  <p className="text-xs font-black text-red-600 uppercase tracking-wider">
                    TOTAL LOAN AMOUNT
                  </p>
                  <p className="text-xs font-semibold text-slate-500 mt-0.5">
                    Current remaining unpaid loan balance
                  </p>
                </div>
                <p className="text-2xl sm:text-3xl font-black text-red-600 tracking-tight">
                  ₹{currentTotalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </p>
              </div>

              {/* Paid Amount (₹) with Bolder Floating Input & Auto-detected installment amount */}
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

              {customer.installmentAmount && (
                <div className="text-xs font-bold text-teal-700 bg-teal-50 px-4 py-2.5 rounded-xl border border-teal-200 flex items-center justify-between">
                  <span>Auto-detected per installment amount:</span>
                  <span className="font-black">₹{customer.installmentAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                </div>
              )}

              {/* Description with Bolder Floating Input */}
              <FloatingInput
                label="Description"
                icon={FileText}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            {/* Bottom Full Width Large Buttons without awkward bottom gap */}
            <div className="flex items-center gap-4 pt-6 border-t border-slate-100 mt-auto">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold text-sm sm:text-base py-4 rounded-2xl transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-[#0d9488] hover:bg-[#0f766e] text-white font-extrabold text-sm sm:text-base py-4 rounded-2xl shadow-lg shadow-teal-700/20 flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-60"
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

'use client';

import React, { useState } from 'react';
import { Calculator, X, CheckCircle2, IndianRupee, FileText } from 'lucide-react';
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
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95">
        
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-50 text-[#0d9488] flex items-center justify-center">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-900">
                Record Payment & Calculation
              </h2>
              <p className="text-xs font-semibold text-slate-500">
                {customer.customerName} ({customer.customerId})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="mt-5 space-y-4 pt-1">
          {error && (
            <div className="p-3 bg-red-50 text-red-600 rounded-xl text-xs font-semibold border border-red-100">
              {error}
            </div>
          )}

          {/* Total Loan Amount / Remaining Balance */}
          <div>
            <label className="block text-[11px] font-black text-red-600 uppercase tracking-wider mb-1">
              Total Loan Amount
            </label>
            <div className="relative">
              <IndianRupee className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-red-500" />
              <input
                type="text"
                readOnly
                value={`₹${currentTotalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`}
                className="w-full bg-red-50/30 border border-red-300 rounded-xl py-2.5 pl-10 pr-4 text-sm font-bold text-red-600 focus:outline-none"
              />
            </div>
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

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs py-3 rounded-2xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-[#0d9488] hover:bg-[#0f766e] text-white font-extrabold text-xs py-3 rounded-2xl shadow-md shadow-teal-700/20 flex items-center justify-center gap-1.5 transition-all active:scale-95 disabled:opacity-60"
            >
              <CheckCircle2 className="w-4 h-4" />
              {loading ? 'Saving...' : 'Save & Deduct'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

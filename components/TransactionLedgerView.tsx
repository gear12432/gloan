'use client';

import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Printer, 
  Plus, 
  TrendingUp, 
  TrendingDown, 
  FileText 
} from 'lucide-react';
import { motion } from 'motion/react';
import { Customer, Transaction, UserProfile } from '@/types/finance';
import RecordPaymentModal from './RecordPaymentModal';
import FinancialLedgerStatementModal from './FinancialLedgerStatementModal';

interface TransactionLedgerViewProps {
  customer: Customer;
  transactions: Transaction[];
  userProfile: UserProfile | null;
  onBack: () => void;
}

export default function TransactionLedgerView({
  customer,
  transactions,
  userProfile,
  onBack,
}: TransactionLedgerViewProps) {
  const [isRecordModalOpen, setIsRecordModalOpen] = useState(false);
  const [isStatementModalOpen, setIsStatementModalOpen] = useState(false);
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);

  // Filter transactions for this specific customer
  const custTxList = transactions.filter(
    (t) => t.customerDocId === customer.id || t.customerId === customer.customerId
  );

  const totalPaid = custTxList.reduce((acc, t) => acc + t.amount, 0);
  const totalCharges = 0; // standard charges
  const currentRemaining = Math.max(0, customer.subTotalLoanAmount - totalPaid);

  const handleOpenSingleInvoice = (tx: Transaction) => {
    setSelectedTx(tx);
    setIsStatementModalOpen(true);
  };

  const handleOpenFullStatement = () => {
    setSelectedTx(null);
    setIsStatementModalOpen(true);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="min-h-screen bg-[#f3f6f9] pb-12"
    >
      {/* Top Header */}
      <div className="bg-[#0d9488] text-white py-5 px-4 sm:px-6 rounded-b-[2rem] shadow-md flex items-center justify-between">
        <button
          onClick={onBack}
          className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="text-center">
          <h1 className="text-sm sm:text-base font-extrabold uppercase tracking-wide">
            TRANSACTION LEDGER
          </h1>
          <p className="text-xs text-teal-100 font-semibold mt-0.5">
            {customer.customerName} ({customer.customerId})
          </p>
        </div>

        {/* Right Header Actions */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={handleOpenFullStatement}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
            title="Print Statement"
          >
            <Printer className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIsRecordModalOpen(true)}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
            title="Record Payment"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </div>

      <main className="max-w-2xl mx-auto px-4 sm:px-6 mt-5 space-y-4">
        {/* Current Loan Amount Card */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-slate-200/80 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
              CURRENT LOAN AMOUNT
            </p>
            <p className="text-2xl sm:text-3xl font-black text-[#0d9488] mt-0.5">
              ₹{currentRemaining.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </p>
          </div>
          <button
            onClick={() => setIsRecordModalOpen(true)}
            className="bg-[#0d9488] hover:bg-[#0f766e] text-white text-xs sm:text-sm font-bold py-2.5 px-4 sm:px-5 rounded-xl shadow-md shadow-teal-700/20 flex items-center gap-1.5 transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            Add Payment
          </button>
        </div>

        {/* Summary Stats Row */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          {/* TOTAL PAID Card */}
          <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-2xl p-4 sm:p-5 shadow-2xs">
            <div className="flex items-center gap-1.5 text-emerald-700 font-extrabold text-[10px] sm:text-xs uppercase tracking-wider">
              <TrendingUp className="w-4 h-4" />
              TOTAL PAID
            </div>
            <p className="text-lg sm:text-xl font-black text-emerald-600 mt-1">
              +₹{totalPaid.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </p>
          </div>

          {/* TOTAL CHARGES Card */}
          <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-4 sm:p-5 shadow-2xs">
            <div className="flex items-center gap-1.5 text-amber-700 font-extrabold text-[10px] sm:text-xs uppercase tracking-wider">
              <TrendingDown className="w-4 h-4" />
              TOTAL CHARGES
            </div>
            <p className="text-lg sm:text-xl font-black text-amber-600 mt-1">
              -₹{totalCharges.toFixed(2)}
            </p>
          </div>
        </div>

        {/* REAL-TIME LEDGER ENTRIES */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-slate-200/80 space-y-4">
          {/* Section Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#0d9488]" />
              <h2 className="text-xs sm:text-sm font-extrabold text-slate-800 uppercase tracking-wider">
                REAL-TIME LEDGER ENTRIES
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleOpenFullStatement}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs py-1.5 px-3 rounded-lg flex items-center gap-1 transition-colors"
              >
                <Printer className="w-3.5 h-3.5" />
                Print
              </button>
              <span className="text-xs font-medium text-slate-400">
                {custTxList.length} Entries
              </span>
            </div>
          </div>

          {/* Entries List */}
          <div className="space-y-3">
            {custTxList.length === 0 ? (
              <div className="text-center py-8 text-slate-400 text-xs">
                <p className="font-semibold">No payment entries recorded yet.</p>
                <p className="mt-1 text-[11px]">Click &quot;Add Payment&quot; above to record a payment.</p>
              </div>
            ) : (
              custTxList.map((tx) => (
                <div
                  key={tx.id}
                  onClick={() => handleOpenSingleInvoice(tx)}
                  className="bg-slate-50 hover:bg-teal-50/50 border border-slate-200/80 hover:border-teal-300 rounded-2xl p-4 transition-all cursor-pointer flex items-center justify-between shadow-2xs"
                >
                  <div className="flex items-center gap-3">
                    {/* Avatar */}
                    <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full border border-slate-200 bg-amber-500 text-white font-extrabold flex items-center justify-center text-sm uppercase">
                      {customer.customerName.charAt(0)}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm sm:text-base font-bold text-slate-900">
                          {customer.customerName}
                        </span>
                        <span className="bg-emerald-100 text-emerald-800 text-[9px] sm:text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase">
                          {tx.status}
                        </span>
                      </div>
                      <p className="text-[11px] sm:text-xs font-medium text-slate-500 mt-0.5">
                        {tx.type} • {tx.date}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-sm sm:text-base font-black text-emerald-600">
                      +₹{tx.amount.toFixed(2)}
                    </p>
                    <p className="text-[10px] sm:text-[11px] font-bold text-[#0d9488] hover:underline mt-0.5">
                      View Invoice &gt;
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>

      {/* Record Payment Modal */}
      <RecordPaymentModal
        customer={customer}
        isOpen={isRecordModalOpen}
        onClose={() => setIsRecordModalOpen(false)}
        onSuccess={() => {}}
      />

      {/* Printable Statement Modal */}
      <FinancialLedgerStatementModal
        customer={customer}
        transactions={transactions}
        userProfile={userProfile}
        isOpen={isStatementModalOpen}
        onClose={() => setIsStatementModalOpen(false)}
        selectedTransaction={selectedTx}
      />
    </motion.div>
  );
}

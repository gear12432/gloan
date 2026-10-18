'use client';

import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Printer, 
  Plus, 
  TrendingUp, 
  TrendingDown, 
  FileText,
  Calendar,
  Receipt,
  ChevronRight,
  Wallet
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
      className="min-h-screen bg-[#f3f6f9] pb-6"
    >
      {/* Top Header - White Text & Icons (Plus button removed, larger Print icon) */}
      <div className="bg-[#0d9488] text-white py-5 px-4 sm:px-6 rounded-b-[2rem] shadow-md flex items-center justify-between">
        <button
          onClick={onBack}
          className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5 text-white" />
        </button>

        <div className="text-center">
          <h1 className="text-sm sm:text-base font-extrabold uppercase tracking-wide text-white">
            TRANSACTION LEDGER
          </h1>
          <p className="text-xs text-teal-100 font-semibold mt-0.5">
            {customer.customerName} ({customer.customerId})
          </p>
        </div>

        {/* Right Header Actions - Only larger Print icon */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={handleOpenFullStatement}
            className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
            title="Print Statement"
          >
            <Printer className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </button>
        </div>
      </div>

      <main className="max-w-2xl mx-auto px-4 sm:px-6 mt-5 space-y-4">
        {/* Single Line Row for Current Loan Amount (with Black Wallet Icon), Total Paid, and Total Charges (Bigger & Bolder Text) */}
        <div className="grid grid-cols-3 gap-2 sm:gap-3">
          {/* 1. Current Loan Amount with Black Wallet Icon */}
          <div className="bg-white rounded-2xl p-3.5 sm:p-5 shadow-sm border border-slate-200/80 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-1.5 text-[10px] sm:text-xs font-black text-slate-800 uppercase tracking-wider">
                <Wallet className="w-4 h-4 text-slate-900 shrink-0" />
                <span className="truncate">Loan Amt</span>
              </div>
              <p className="text-base sm:text-xl font-black text-[#0d9488] mt-1.5">
                ₹{currentRemaining.toLocaleString('en-IN', { minimumFractionDigits: 0 })}
              </p>
            </div>
          </div>

          {/* 2. Total Paid */}
          <div className="bg-emerald-50/80 border border-emerald-200 rounded-2xl p-3.5 sm:p-5 shadow-2xs flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-1.5 text-[10px] sm:text-xs font-black text-emerald-800 uppercase tracking-wider">
                <TrendingUp className="w-4 h-4 text-emerald-700 shrink-0" />
                <span className="truncate">Total Paid</span>
              </div>
              <p className="text-base sm:text-xl font-black text-emerald-600 mt-1.5">
                +₹{totalPaid.toLocaleString('en-IN', { minimumFractionDigits: 0 })}
              </p>
            </div>
          </div>

          {/* 3. Total Charges */}
          <div className="bg-amber-50/80 border border-amber-200 rounded-2xl p-3.5 sm:p-5 shadow-2xs flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-1.5 text-[10px] sm:text-xs font-black text-amber-800 uppercase tracking-wider">
                <TrendingDown className="w-4 h-4 text-amber-700 shrink-0" />
                <span className="truncate">Charges</span>
              </div>
              <p className="text-base sm:text-xl font-black text-amber-600 mt-1.5">
                -₹{totalCharges.toFixed(0)}
              </p>
            </div>
          </div>
        </div>

        {/* Add Payment Action Button */}
        <button
          onClick={() => setIsRecordModalOpen(true)}
          className="w-full bg-[#0d9488] hover:bg-[#0f766e] text-white text-xs sm:text-sm font-bold py-3 px-5 rounded-2xl shadow-md shadow-teal-700/20 flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer"
        >
          <Plus className="w-4 h-4 text-white" />
          Add Payment Entry
        </button>

        {/* REAL-TIME LEDGER ENTRIES - ZERO SIDE GAPS, EXTENDS TO BOTTOM */}
        <div className="bg-white rounded-none sm:rounded-3xl py-5 sm:py-6 shadow-sm border-y sm:border border-slate-200/80 space-y-4 px-0 -mx-4 sm:mx-0 mb-6">
          {/* Section Header */}
          <div className="flex items-center justify-between pb-3 px-4 sm:px-6 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#0d9488]" />
              <h2 className="text-xs sm:text-sm font-extrabold text-slate-800 uppercase tracking-wider">
                REAL-TIME LEDGER ENTRIES
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleOpenFullStatement}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs py-1.5 px-3 rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5 text-slate-700" />
                Print
              </button>
              <span className="text-xs font-medium text-slate-400">
                {custTxList.length} Entries
              </span>
            </div>
          </div>

          {/* Entries List - Zero side gaps, full width edge-to-edge */}
          <div className="space-y-0 sm:space-y-2.5 w-full px-0">
            {custTxList.length === 0 ? (
              <div className="text-center py-8 text-slate-400 text-xs px-4">
                <p className="font-semibold">No payment entries recorded yet.</p>
                <p className="mt-1 text-[11px]">Click &quot;Add Payment&quot; above to record a payment.</p>
              </div>
            ) : (
              custTxList.map((tx) => (
                <div
                  key={tx.id}
                  onClick={() => handleOpenSingleInvoice(tx)}
                  className="bg-slate-50 hover:bg-teal-50/50 border-b sm:border sm:rounded-2xl border-slate-200/80 hover:border-teal-300 p-4 sm:p-4 transition-all cursor-pointer flex items-center justify-between shadow-none sm:shadow-2xs w-full rounded-none"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {/* Relevant Icon */}
                    <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl border border-slate-200 bg-teal-50 text-[#0d9488] font-extrabold flex items-center justify-center shrink-0">
                      <Receipt className="w-5 h-5 text-[#0d9488]" />
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm sm:text-base font-bold text-slate-900 truncate">
                          {customer.customerName}
                        </span>
                        <span className="bg-emerald-100 text-emerald-800 text-[9px] sm:text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase">
                          {tx.status}
                        </span>
                      </div>
                      <p className="text-[11px] sm:text-xs font-medium text-slate-500 mt-0.5 flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        {tx.type} • {tx.date}
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0 pl-2">
                    <p className="text-sm sm:text-base font-black text-emerald-600">
                      +₹{tx.amount.toFixed(2)}
                    </p>
                    <p className="text-[10px] sm:text-[11px] font-bold text-[#0d9488] hover:underline mt-0.5 flex items-center justify-end gap-0.5">
                      View Invoice
                      <ChevronRight className="w-3.5 h-3.5 text-[#0d9488]" />
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

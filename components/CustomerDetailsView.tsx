'use client';

import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Share2, 
  Copy, 
  Wallet, 
  PhoneCall, 
  Edit3, 
  UserCheck, 
  Receipt, 
  Trash2,
  Check
} from 'lucide-react';
import { motion } from 'motion/react';
import { Customer } from '@/types/finance';
import { useAuth } from '@/context/AuthContext';

interface CustomerDetailsViewProps {
  customer: Customer;
  onBack: () => void;
  onEdit: () => void;
  onOpenLedger: () => void;
}

export default function CustomerDetailsView({
  customer,
  onBack,
  onEdit,
  onOpenLedger,
}: CustomerDetailsViewProps) {
  const { deleteCustomer, updateCustomer } = useAuth();
  const [copied, setCopied] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleCopyId = () => {
    navigator.clipboard.writeText(customer.customerId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    const text = `Customer: ${customer.customerName}\nID: ${customer.customerId}\nLoan Amount: ₹${customer.subTotalLoanAmount}\nStatus: ${customer.status}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Small Finance - ${customer.customerName}`,
          text: text,
        });
      } catch (err) {
        console.log('Share canceled or failed:', err);
      }
    } else {
      navigator.clipboard.writeText(text);
      alert('Customer summary copied to clipboard!');
    }
  };

  const handleCall = () => {
    window.location.href = `tel:${customer.mobileNumber}`;
  };

  const handleToggleStatus = async () => {
    const newStatus = customer.status === 'PENDING' ? 'SUCCESSFUL' : 'PENDING';
    await updateCustomer(customer.id, { status: newStatus });
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteCustomer(customer.id);
      onBack();
    } catch (err) {
      console.error(err);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="min-h-screen bg-[#f3f6f9] pb-12"
    >
      {/* Top Teal Header */}
      <div className="bg-[#0d9488] text-white py-5 px-4 sm:px-6 rounded-b-[2rem] shadow-md flex items-center justify-between">
        <button
          onClick={onBack}
          className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-base sm:text-lg font-extrabold uppercase tracking-wide">
          CUSTOMER DETAILS
        </h1>
        <button
          onClick={handleShare}
          className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
        >
          <Share2 className="w-5 h-5" />
        </button>
      </div>

      <main className="max-w-2xl mx-auto px-4 sm:px-6 mt-5 space-y-4">
        {/* Customer Main Banner & Card */}
        <div className="bg-white rounded-3xl overflow-hidden shadow-lg shadow-slate-200/50 border border-slate-100">
          {/* Status Bar */}
          <div
            className={`py-2.5 px-4 text-center text-xs font-black uppercase tracking-wider text-white ${
              customer.status === 'PENDING' ? 'bg-amber-500' : 'bg-emerald-600'
            }`}
          >
            STATUS: {customer.status}
          </div>

          <div className="p-5 sm:p-6">
            {/* Upper profile section */}
            <div className="flex items-center justify-between gap-3 flex-wrap sm:flex-nowrap">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full border-2 border-amber-300 overflow-hidden bg-slate-100 flex-shrink-0 flex items-center justify-center">
                  {customer.profilePicture ? (
                    <img
                      src={customer.profilePicture}
                      alt={customer.customerName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-amber-500 text-white font-extrabold text-xl sm:text-2xl flex items-center justify-center">
                      {customer.customerName.charAt(0)}
                    </div>
                  )}
                </div>

                <div>
                  <h2 className="text-lg sm:text-xl font-black text-slate-900">
                    {customer.customerName}
                  </h2>
                  <div className="flex items-center gap-1.5 text-xs sm:text-sm text-slate-500 font-bold mt-0.5">
                    <span>ID: {customer.customerId}</span>
                    <button
                      onClick={handleCopyId}
                      className="p-1 hover:text-[#0d9488] transition-colors"
                      title="Copy Customer ID"
                    >
                      {copied ? (
                        <Check className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <Copy className="w-4 h-4 text-slate-400" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Loan Amount Box */}
              <div className="bg-slate-50 border border-slate-200/80 p-3 px-4 rounded-2xl flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-teal-100 text-[#0d9488] flex items-center justify-center">
                  <Wallet className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
                    LOAN AMOUNT
                  </p>
                  <p className="text-sm sm:text-base font-black text-red-600">
                    ₹{customer.subTotalLoanAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Action Grid (4 Cards) */}
            <div className="grid grid-cols-4 gap-3 mt-6 pt-5 border-t border-slate-100">
              {/* 1. Call */}
              <button
                onClick={handleCall}
                className="bg-teal-50/70 hover:bg-teal-100/80 text-[#0d9488] p-3 sm:p-4 rounded-2xl border border-teal-100/80 flex flex-col items-center justify-center gap-1.5 transition-all active:scale-95 shadow-2xs"
              >
                <PhoneCall className="w-5 h-5 sm:w-6 sm:h-6" />
                <span className="text-xs font-bold">Call</span>
              </button>

              {/* 2. Edit */}
              <button
                onClick={onEdit}
                className="bg-teal-50/70 hover:bg-teal-100/80 text-[#0d9488] p-3 sm:p-4 rounded-2xl border border-teal-100/80 flex flex-col items-center justify-center gap-1.5 transition-all active:scale-95 shadow-2xs"
              >
                <Edit3 className="w-5 h-5 sm:w-6 sm:h-6" />
                <span className="text-xs font-bold">Edit</span>
              </button>

              {/* 3. Mark Status */}
              <button
                onClick={handleToggleStatus}
                className="bg-teal-50/70 hover:bg-teal-100/80 text-[#0d9488] p-3 sm:p-4 rounded-2xl border border-teal-100/80 flex flex-col items-center justify-center gap-1.5 transition-all active:scale-95 shadow-2xs"
              >
                <UserCheck className="w-5 h-5 sm:w-6 sm:h-6" />
                <span className="text-xs font-bold truncate max-w-full">Mark ...</span>
              </button>

              {/* 4. Ledger */}
              <button
                onClick={onOpenLedger}
                className="bg-teal-50/70 hover:bg-teal-100/80 text-[#0d9488] p-3 sm:p-4 rounded-2xl border border-teal-100/80 flex flex-col items-center justify-center gap-1.5 transition-all active:scale-95 shadow-2xs"
              >
                <Receipt className="w-5 h-5 sm:w-6 sm:h-6" />
                <span className="text-xs font-bold">Ledger</span>
              </button>
            </div>
          </div>
        </div>

        {/* Delete Record Button */}
        <button
          onClick={() => setShowDeleteConfirm(true)}
          className="w-full bg-red-50 hover:bg-red-100/80 text-red-600 border border-red-200/80 font-bold text-xs sm:text-sm py-3.5 rounded-2xl flex items-center justify-center gap-2 shadow-xs transition-colors"
        >
          <Trash2 className="w-4.5 h-4.5 text-red-600" />
          Delete Customer Record
        </button>
      </main>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div className="text-center">
              <h3 className="text-base font-bold text-slate-900">
                Delete Customer Record?
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Are you sure you want to delete <span className="font-bold text-slate-800">{customer.customerName}</span>? This action cannot be undone.
              </p>
            </div>
            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md shadow-red-600/20"
              >
                {deleting ? 'Deleting...' : 'Yes, Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}

'use client';

import React, { useRef, useState } from 'react';
import { Printer, Download, X, Building2 } from 'lucide-react';
import { Customer, Transaction, UserProfile } from '@/types/finance';

interface FinancialLedgerStatementModalProps {
  customer: Customer;
  transactions: Transaction[];
  userProfile: UserProfile | null;
  isOpen: boolean;
  onClose: () => void;
  selectedTransaction?: Transaction | null;
}

export default function FinancialLedgerStatementModal({
  customer,
  transactions,
  userProfile,
  isOpen,
  onClose,
  selectedTransaction,
}: FinancialLedgerStatementModalProps) {
  const printRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);
  const [invoiceId] = useState(
    () => selectedTransaction?.invoiceId || `INV-${Math.floor(100000 + Math.random() * 900000)}`
  );

  if (!isOpen) return null;

  // Filter all transactions for this customer or single selected
  const custTxList = selectedTransaction
    ? [selectedTransaction]
    : transactions.filter((t) => t.customerDocId === customer.id || t.customerId === customer.customerId);

  const totalPaid = custTxList.reduce((acc, t) => acc + t.amount, 0);
  const subTotalLoan = customer.subTotalLoanAmount;
  const remainingBalance = Math.max(0, subTotalLoan - totalPaid);

  const currentDate = new Date().toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
  });

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadJpg = async () => {
    if (!printRef.current) return;
    setDownloading(true);
    try {
      const { toJpeg } = await import('html-to-image');
      const dataUrl = await toJpeg(printRef.current, {
        quality: 0.98,
        backgroundColor: '#ffffff',
        pixelRatio: 2,
        cacheBust: true,
      });
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = `Invoice_${customer.customerId}_${invoiceId}.jpg`;
      link.click();
    } catch (err) {
      console.error('Failed to download invoice image:', err);
      alert('Error generating JPG. Please try again.');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-1 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl sm:rounded-3xl max-w-2xl w-full p-2 sm:p-5 shadow-2xl border border-slate-100 my-auto">
        
        {/* Top Control Bar - Single Line */}
        <div className="flex items-center justify-between pb-2 sm:pb-3 border-b border-slate-100 mb-2 sm:mb-3 gap-1 sm:gap-2 flex-nowrap px-1">
          <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
            <div className="p-1.5 rounded-xl bg-emerald-50 text-[#037244] shrink-0">
              <Building2 className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0">
              <h2 className="text-[11px] sm:text-base font-extrabold text-slate-900 truncate">
                Official Invoice Statement
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-1 sm:gap-1.5 flex-shrink-0 flex-nowrap">
            <button
              onClick={handlePrint}
              className="bg-[#037244] hover:bg-[#025a35] text-white font-extrabold text-[10px] sm:text-xs py-1 px-2 sm:px-3.5 rounded-xl flex items-center gap-1 shadow-sm transition-all active:scale-95 whitespace-nowrap cursor-pointer"
            >
              <Printer className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>Print</span>
            </button>
            <button
              onClick={handleDownloadJpg}
              disabled={downloading}
              className="bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-[10px] sm:text-xs py-1 px-2 sm:px-3.5 rounded-xl flex items-center gap-1 shadow-sm transition-all disabled:opacity-60 active:scale-95 whitespace-nowrap cursor-pointer"
            >
              <Download className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>{downloading ? 'Export...' : 'Download'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded-full text-slate-400 hover:text-slate-600 transition-colors shrink-0 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* PRINTABLE INVOICE CONTAINER - ZERO SIDE GAP ON MOBILE */}
        <div
          ref={printRef}
          className="bg-white p-2.5 sm:p-6 text-slate-900 space-y-4 border border-slate-200 font-sans print:p-0 print:border-none"
        >
          {/* HEADER BANNER - DARK GREEN WITH LOGO & TITLE */}
          <div className="bg-[#037244] text-white p-3.5 sm:p-5 rounded-t-lg flex items-center justify-between flex-nowrap gap-2 sm:gap-4">
            {/* Left Logo & INVOICE Title */}
            <div className="flex items-center gap-2 sm:gap-4">
              {userProfile?.profileImageUrl ? (
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded bg-white overflow-hidden flex items-center justify-center p-0.5 border border-white/80">
                  <img src={userProfile.profileImageUrl} alt="Logo" className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center border-2 border-white/80 p-1 px-2 rounded">
                  <span className="text-[8px] sm:text-[10px] font-black tracking-widest uppercase leading-none">COMPANY</span>
                  <span className="text-sm sm:text-lg font-black tracking-tighter uppercase leading-tight">LOGO</span>
                </div>
              )}
              <div className="h-8 sm:h-10 w-0.5 bg-white/40" />
              <h1 className="text-lg sm:text-3xl font-black tracking-wider uppercase">
                INVOICE
              </h1>
            </div>

            {/* Right Invoice Metadata */}
            <div className="text-right text-[10px] sm:text-xs font-bold space-y-0.5">
              <p className="flex justify-end gap-1.5 sm:gap-3">
                <span className="text-emerald-200 font-black uppercase">NO:</span>
                <span className="font-extrabold">{invoiceId.replace('INV-', '')}</span>
              </p>
              <p className="flex justify-end gap-1.5 sm:gap-3">
                <span className="text-emerald-200 font-black uppercase">DATE:</span>
                <span className="font-extrabold">{currentDate}</span>
              </p>
              <p className="flex justify-end gap-1.5 sm:gap-3">
                <span className="text-emerald-200 font-black uppercase">FREQ:</span>
                <span className="font-extrabold">{customer.repaymentFrequency}</span>
              </p>
            </div>
          </div>

          {/* TWO COLUMN ADDRESS SECTION */}
          <div className="grid grid-cols-2 gap-3 sm:gap-6 text-[11px] sm:text-xs pt-1">
            {/* Left: YOUR COMPANY NAME */}
            <div className="space-y-0.5 text-slate-800">
              <h2 className="font-black text-xs sm:text-sm text-slate-900 uppercase tracking-wide truncate">
                {userProfile?.businessName || 'KH LOAN'}
              </h2>
              <p className="font-medium text-slate-700 truncate">
                <span className="font-bold text-slate-900">Address:</span> {userProfile?.businessAddress || 'Main Road, Market Complex'}
              </p>
              <p className="font-medium text-slate-700 truncate">
                <span className="font-bold text-slate-900">Phone:</span> {userProfile?.mobileNumber || '+91 98765 43210'}
              </p>
              <p className="font-medium text-slate-700 truncate">
                <span className="font-bold text-slate-900">Email:</span> {userProfile?.businessEmail || userProfile?.email || 'contact@khloan.com'}
              </p>
            </div>

            {/* Right: BILLED TO */}
            <div className="space-y-0.5 text-slate-800">
              <h2 className="font-black text-xs sm:text-sm text-slate-900 uppercase tracking-wide">
                BILLED TO
              </h2>
              <p className="font-extrabold text-slate-900 text-xs sm:text-sm truncate">
                {customer.customerName}
              </p>
              <p className="font-medium text-slate-700 truncate">
                <span className="font-bold text-slate-900">ID:</span> {customer.customerId}
              </p>
              <p className="font-medium text-slate-700 truncate">
                <span className="font-bold text-slate-900">Address:</span> {customer.address || 'Main City Address'}
              </p>
              <p className="font-medium text-slate-700 truncate">
                <span className="font-bold text-slate-900">Phone:</span> {customer.mobileNumber}
              </p>
            </div>
          </div>

          {/* EXACTLY 4 COLUMNS TABLE - FULL WIDTH FIT, NO HORIZONTAL SCROLL */}
          <div className="border border-[#037244] rounded-xs w-full bg-white overflow-hidden">
            <table className="w-full table-fixed text-left border-collapse">
              <thead className="bg-[#e8f5e9] text-[#037244] font-black text-[10px] sm:text-xs border-b border-[#037244]">
                <tr>
                  <th className="py-2 px-1 border-r border-[#037244]/30 w-[10%] text-center">S.N.</th>
                  <th className="py-2 px-1.5 border-r border-[#037244]/30 w-[24%] text-center">DATE</th>
                  <th className="py-2 px-2 border-r border-[#037244]/30 w-[42%]">DESCRIPTION</th>
                  <th className="py-2 px-2 text-right w-[24%]">AMOUNT</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#037244]/20 text-[10px] sm:text-xs font-semibold">
                {custTxList.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-6 text-center text-slate-400 font-bold">
                      No transaction entries recorded yet
                    </td>
                  </tr>
                ) : (
                  custTxList.map((tx, idx) => (
                    <tr key={tx.id || idx} className="hover:bg-emerald-50/40">
                      <td className="py-2 px-1 text-center font-bold text-slate-800 border-r border-[#037244]/20">
                        {idx + 1}
                      </td>
                      <td className="py-2 px-1.5 text-center font-bold text-slate-900 border-r border-[#037244]/20 truncate">
                        {tx.date}
                      </td>
                      <td className="py-2 px-2 font-bold text-slate-900 border-r border-[#037244]/20 truncate">
                        {tx.description || 'Payment Received'}
                      </td>
                      <td className="py-2 px-2 text-right font-black text-[#037244]">
                        ₹{tx.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </td>
                    </tr>
                  ))
                )}
                {/* Extra padding rows */}
                {Array.from({ length: Math.max(0, 2 - custTxList.length) }).map((_, i) => (
                  <tr key={`empty-${i}`}>
                    <td className="py-3 px-1 border-r border-[#037244]/20">&nbsp;</td>
                    <td className="py-3 px-1.5 border-r border-[#037244]/20">&nbsp;</td>
                    <td className="py-3 px-2 border-r border-[#037244]/20">&nbsp;</td>
                    <td className="py-3 px-2">&nbsp;</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* BOTTOM SUMMARY & TOTALS SECTION */}
          <div className="flex flex-row items-start justify-between gap-3 pt-1">
            {/* Left Payment Info */}
            <div className="space-y-1 text-[10px] sm:text-xs text-slate-700 flex-1 min-w-0 pr-2">
              <p className="font-black text-slate-900 truncate">
                Payable to: <span className="uppercase">{userProfile?.businessName || 'SMALL FINANCE'}</span>
              </p>
              <p className="font-medium text-slate-600 hidden sm:block">
                If you have any questions about this invoice please contact us using the details above.
              </p>
              <p className="font-bold text-slate-800 truncate">
                {userProfile?.mobileNumber || '+91 98765 43210'}
              </p>
            </div>

            {/* Right Side Totals Breakdown */}
            <div className="w-48 sm:w-64 space-y-1 text-[10px] sm:text-xs font-bold text-slate-800 flex-shrink-0">
              <div className="flex justify-between py-0.5 border-b border-slate-100">
                <span className="font-bold text-slate-600 uppercase">SUBTOTAL</span>
                <span className="font-black text-slate-900">
                  ₹{subTotalLoan.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex justify-between py-0.5 border-b border-slate-100">
                <span className="font-bold text-slate-600 uppercase">TOTAL PAID</span>
                <span className="font-black text-emerald-600">
                  ₹{totalPaid.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </span>
              </div>

              {/* HIGHLIGHTED GREEN BOX AT BOTTOM RIGHT: AMOUNT DUE */}
              <div className="bg-[#037244] text-white p-2.5 px-3 rounded-xs flex items-center justify-between shadow-xs mt-2">
                <span className="font-black text-[11px] sm:text-xs uppercase tracking-wider">AMOUNT DUE</span>
                <span className="font-black text-sm sm:text-base tracking-tight">
                  ₹{remainingBalance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          </div>

          {/* THANK YOU FOOTER */}
          <div className="pt-3 pb-1 text-center border-t border-slate-100">
            <h3 className="text-xs sm:text-sm font-black text-[#037244] uppercase tracking-widest">
              THANK YOU FOR YOUR BUSINESS!
            </h3>
          </div>
        </div>
      </div>
    </div>
  );
}

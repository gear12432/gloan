'use client';

import React, { useRef, useState } from 'react';
import { Printer, Download, X } from 'lucide-react';
import html2canvas from 'html2canvas';
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

  // Filter transactions for this customer or single selected
  const custTxList = selectedTransaction
    ? [selectedTransaction]
    : transactions.filter((t) => t.customerDocId === customer.id || t.customerId === customer.customerId);

  const totalPaid = custTxList.reduce((acc, t) => acc + t.amount, 0);
  const currentDate = new Date().toLocaleDateString('en-GB'); // DD/MM/YYYY

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadJpg = async () => {
    if (!printRef.current) return;
    setDownloading(true);
    try {
      const canvas = await html2canvas(printRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
      });
      const image = canvas.toDataURL('image/jpeg', 0.95);
      const link = document.createElement('a');
      link.href = image;
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
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-xl w-full p-4 sm:p-6 shadow-2xl border border-slate-100 my-auto">
        
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4 gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-teal-50 text-[#0d9488]">
              <Printer className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-extrabold text-slate-900">
                Print & Download Invoice
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="bg-[#0d9488] hover:bg-[#0f766e] text-white font-bold text-xs py-2 px-3 sm:px-4 rounded-xl flex items-center gap-1.5 shadow-sm transition-all"
            >
              <Printer className="w-4 h-4" />
              Print Invoice
            </button>
            <button
              onClick={handleDownloadJpg}
              disabled={downloading}
              className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs py-2 px-3 sm:px-4 rounded-xl flex items-center gap-1.5 shadow-sm transition-all disabled:opacity-60"
            >
              <Download className="w-4 h-4" />
              {downloading ? 'Exporting...' : 'Download JPG'}
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 transition-colors ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Container */}
        <div
          ref={printRef}
          className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 text-slate-800 space-y-4 print:p-0 print:border-none print:shadow-none"
        >
          {/* Statement Header */}
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-lg sm:text-xl font-extrabold text-[#0d9488] tracking-tight uppercase">
                FINANCIAL LEDGER STATEMENT
              </h1>
              <p className="text-[11px] font-semibold text-slate-500 mt-0.5">
                Official Loan Payment Statement & Invoice Receipt
              </p>
            </div>
            <div className="text-right text-xs">
              <p className="font-bold text-slate-900">Date: {currentDate}</p>
              <p className="text-slate-400 font-semibold text-[11px]">
                Invoice ID: {invoiceId}
              </p>
            </div>
          </div>

          <div className="h-0.5 bg-[#0d9488]/40 rounded-full w-full" />

          {/* Details Boxes Grid */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            {/* Customer Details Box */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-1">
              <p className="font-black text-[10px] text-slate-400 uppercase tracking-wider mb-1">
                CUSTOMER DETAILS
              </p>
              <p className="font-extrabold text-slate-900 text-sm">
                {customer.customerName}
              </p>
              <p className="font-medium text-slate-600">
                Customer ID: <span className="font-bold">{customer.customerId}</span>
              </p>
              <p className="font-medium text-slate-600">
                Mobile: <span className="font-bold">{customer.mobileNumber}</span>
              </p>
              {customer.address && (
                <p className="font-medium text-slate-600 truncate">
                  Address: {customer.address}
                </p>
              )}
            </div>

            {/* Account Summary Box */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-1">
              <p className="font-black text-[10px] text-slate-400 uppercase tracking-wider mb-1">
                ACCOUNT SUMMARY
              </p>
              <div className="flex justify-between font-medium">
                <span className="text-slate-600">Total Loan Amount:</span>
                <span className="font-bold text-slate-900">
                  ₹{customer.subTotalLoanAmount.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between font-medium">
                <span className="text-slate-600">Total Paid Amount:</span>
                <span className="font-bold text-emerald-600">
                  ₹{totalPaid.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between font-medium">
                <span className="text-slate-600">Repayment Frequency:</span>
                <span className="font-bold text-slate-900">
                  {customer.repaymentFrequency}
                </span>
              </div>
              <div className="flex justify-between font-medium">
                <span className="text-slate-600">Status:</span>
                <span className="font-black text-emerald-600 uppercase">
                  {customer.status}
                </span>
              </div>
            </div>
          </div>

          {/* Transaction Entries Table */}
          <div className="space-y-2 pt-2">
            <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
              LEDGER TRANSACTION ENTRIES ({custTxList.length})
            </h3>
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3">Date</th>
                    <th className="py-2.5 px-3">Type</th>
                    <th className="py-2.5 px-3">Description</th>
                    <th className="py-2.5 px-3 text-right">Amount (₹)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {custTxList.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-4 text-center text-slate-400 text-xs">
                        No recorded transactions
                      </td>
                    </tr>
                  ) : (
                    custTxList.map((tx) => (
                      <tr key={tx.id} className="hover:bg-slate-50">
                        <td className="py-2.5 px-3 font-medium text-slate-700">
                          {tx.date}
                        </td>
                        <td className="py-2.5 px-3 font-bold text-slate-800">
                          {tx.type}
                        </td>
                        <td className="py-2.5 px-3 text-slate-600 truncate max-w-[140px]">
                          {tx.description}
                        </td>
                        <td className="py-2.5 px-3 text-right font-black text-emerald-600">
                          +₹{tx.amount.toFixed(2)}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Footer Notice */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400 font-medium">
            <p>Computer generated official ledger statement invoice.</p>
            <p>Page 1 of 1</p>
          </div>
        </div>
      </div>
    </div>
  );
}

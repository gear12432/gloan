'use client';

import React, { useState } from 'react';
import { Plus, ChevronRight, Phone } from 'lucide-react';
import { motion } from 'motion/react';
import { Customer } from '@/types/finance';
import Header from './Header';

interface DashboardViewProps {
  customers: Customer[];
  onAddCustomer: () => void;
  onSelectCustomer: (customer: Customer) => void;
  onOpenNotifications: () => void;
  onOpenProfileModal: () => void;
}

type FilterType = 'PENDING' | 'SUCCESSFUL' | 'ALL';

export default function DashboardView({
  customers,
  onAddCustomer,
  onSelectCustomer,
  onOpenNotifications,
  onOpenProfileModal,
}: DashboardViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterType>('PENDING');

  // Strictly deduplicate customers by customerId or id
  const uniqueMap = new Map<string, Customer>();
  customers.forEach((c) => {
    const key = c.customerId || c.id;
    if (!uniqueMap.has(key)) {
      uniqueMap.set(key, c);
    }
  });
  const uniqueCustomers = Array.from(uniqueMap.values());

  // Counts based on unique customers
  const pendingCount = uniqueCustomers.filter((c) => c.status === 'PENDING').length;
  const successfulCount = uniqueCustomers.filter((c) => c.status === 'SUCCESSFUL').length;
  const totalCount = uniqueCustomers.length;

  // Filtered List
  const filteredCustomers = uniqueCustomers.filter((c) => {
    if (activeFilter === 'PENDING' && c.status !== 'PENDING') return false;
    if (activeFilter === 'SUCCESSFUL' && c.status !== 'SUCCESSFUL') return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = c.customerName.toLowerCase().includes(q);
      const matchId = c.customerId.toLowerCase().includes(q);
      const matchPhone = c.mobileNumber.toLowerCase().includes(q);
      return matchName || matchId || matchPhone;
    }
    return true;
  });

  return (
    <motion.div 
      initial={{ opacity: 0, y: 8 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.25 }}
      className="min-h-screen bg-[#f3f6f9] pb-12"
    >
      {/* Header */}
      <Header
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onOpenNotifications={onOpenNotifications}
        onOpenProfileModal={onOpenProfileModal}
      />

      {/* Main Content Area - Full width responsive container */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 mt-5 space-y-4">
        {/* Create New Customer & Add Now Row */}
        <div className="flex items-center justify-between">
          <h2 className="text-base sm:text-lg font-extrabold text-slate-800">
            Create New Customer
          </h2>
          <button
            onClick={onAddCustomer}
            className="bg-[#0d9488] hover:bg-[#0f766e] text-white text-xs sm:text-sm font-bold py-2.5 px-4 rounded-xl shadow-md shadow-teal-700/15 flex items-center gap-1.5 transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            Add Now
          </button>
        </div>

        {/* Status Filter Tabs Box */}
        <div className="bg-white p-1.5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between text-xs sm:text-sm font-bold">
          {/* Pending Button */}
          <button
            onClick={() => setActiveFilter('PENDING')}
            className={`flex-1 py-2.5 px-2 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
              activeFilter === 'PENDING'
                ? 'bg-amber-50 text-amber-900 border-2 border-amber-400 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            Pending ({pendingCount})
          </button>

          {/* Successful Button */}
          <button
            onClick={() => setActiveFilter('SUCCESSFUL')}
            className={`flex-1 py-2.5 px-2 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
              activeFilter === 'SUCCESSFUL'
                ? 'bg-emerald-50 text-emerald-900 border-2 border-emerald-500 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            Successful ({successfulCount})
          </button>

          {/* All Button */}
          <button
            onClick={() => setActiveFilter('ALL')}
            className={`flex-1 py-2.5 px-2 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
              activeFilter === 'ALL'
                ? 'bg-slate-100 text-slate-900 border-2 border-slate-300 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All ({totalCount})
          </button>
        </div>

        {/* Customer Cards List */}
        <div className="space-y-3 pt-1">
          {filteredCustomers.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 text-center border border-slate-200/80 shadow-sm">
              <p className="text-sm font-semibold text-slate-500">
                No customer records found
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Click &quot;+ Add Now&quot; to create your first customer loan entry.
              </p>
            </div>
          ) : (
            filteredCustomers.map((cust) => (
              <motion.div
                key={cust.id || cust.customerId}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-slate-200/70 hover:border-teal-300 transition-all flex items-center justify-between gap-3"
              >
                {/* Left side details */}
                <div className="flex items-center gap-3.5 min-w-0">
                  {/* Avatar */}
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-slate-100 border border-slate-200 flex-shrink-0 flex items-center justify-center overflow-hidden shadow-xs">
                    {cust.profilePicture ? (
                      <img
                        src={cust.profilePicture}
                        alt={cust.customerName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-amber-500 text-white flex items-center justify-center font-bold text-base sm:text-lg uppercase">
                        {cust.customerName.charAt(0)}
                      </div>
                    )}
                  </div>

                  {/* Info Column */}
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-sm sm:text-base font-bold text-slate-900 truncate">
                        {cust.customerName}
                      </h3>
                      <span
                        className={`text-[10px] sm:text-[11px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                          cust.status === 'PENDING'
                            ? 'bg-amber-100 text-amber-800 border border-amber-200'
                            : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                        }`}
                      >
                        {cust.status}
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm font-semibold text-slate-600 mt-0.5">
                      <span className="text-[#0d9488] font-bold">
                        ID: {cust.customerId}
                      </span>{' '}
                      •{' '}
                      <span className="text-slate-900 font-bold">
                        ₹{cust.subTotalLoanAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </span>
                    </p>

                    <div className="flex items-center gap-2 mt-1 text-[11px] sm:text-xs text-slate-500 font-medium flex-wrap">
                      <span className="flex items-center gap-1">
                        <Phone className="w-3.5 h-3.5 text-slate-400" />
                        {cust.mobileNumber}
                      </span>
                      <span className="bg-teal-50 text-[#0d9488] px-2 py-0.5 rounded-md font-bold text-[10px] sm:text-[11px] border border-teal-100">
                        {cust.repaymentFrequency}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right side View Button */}
                <button
                  onClick={() => onSelectCustomer(cust)}
                  className="bg-slate-100 hover:bg-teal-50 hover:text-[#0d9488] text-slate-700 font-bold text-xs sm:text-sm px-3.5 py-2 sm:py-2.5 rounded-xl flex items-center gap-0.5 transition-all flex-shrink-0 ml-2 shadow-2xs active:scale-95"
                >
                  View
                  <ChevronRight className="w-4 h-4" />
                </button>
              </motion.div>
            ))
          )}
        </div>
      </main>
    </motion.div>
  );
}

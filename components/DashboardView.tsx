'use client';

import React, { useState } from 'react';
import { Plus, ChevronRight, Phone, User as UserIcon } from 'lucide-react';
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

  // Counts
  const pendingCount = customers.filter((c) => c.status === 'PENDING').length;
  const successfulCount = customers.filter((c) => c.status === 'SUCCESSFUL').length;
  const totalCount = customers.length;

  // Filtered List
  const filteredCustomers = customers.filter((c) => {
    // Filter by status
    if (activeFilter === 'PENDING' && c.status !== 'PENDING') return false;
    if (activeFilter === 'SUCCESSFUL' && c.status !== 'SUCCESSFUL') return false;

    // Search query
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
    <div className="min-h-screen bg-[#f3f6f9] pb-12">
      {/* Header */}
      <Header
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onOpenNotifications={onOpenNotifications}
        onOpenProfileModal={onOpenProfileModal}
      />

      {/* Main Content Area */}
      <main className="max-w-md mx-auto px-4 mt-5 space-y-4">
        {/* Create New Customer & Add Now Row */}
        <div className="flex items-center justify-between">
          <h2 className="text-base font-extrabold text-slate-800">
            Create New Customer
          </h2>
          <button
            onClick={onAddCustomer}
            className="bg-[#0d9488] hover:bg-[#0f766e] text-white text-xs font-bold py-2 px-3.5 rounded-xl shadow-md shadow-teal-700/15 flex items-center gap-1 transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            Add Now
          </button>
        </div>

        {/* Status Filter Tabs Box */}
        <div className="bg-white p-1.5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between text-xs font-bold">
          {/* Pending Button */}
          <button
            onClick={() => setActiveFilter('PENDING')}
            className={`flex-1 py-2 px-2 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
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
            className={`flex-1 py-2 px-2 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
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
            className={`flex-1 py-2 px-2 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
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
              <div
                key={cust.id}
                className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200/70 hover:border-teal-300 transition-all flex items-center justify-between"
              >
                {/* Left side details */}
                <div className="flex items-center gap-3 min-w-0">
                  {/* Avatar */}
                  <div className="w-12 h-12 rounded-full bg-slate-100 border border-slate-200 flex-shrink-0 flex items-center justify-center overflow-hidden">
                    {cust.profilePicture ? (
                      <img
                        src={cust.profilePicture}
                        alt={cust.customerName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-base uppercase">
                        {cust.customerName.charAt(0)}
                      </div>
                    )}
                  </div>

                  {/* Info Column */}
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-sm font-bold text-slate-900 truncate">
                        {cust.customerName}
                      </h3>
                      <span
                        className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider ${
                          cust.status === 'PENDING'
                            ? 'bg-amber-100 text-amber-800 border border-amber-200'
                            : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                        }`}
                      >
                        {cust.status}
                      </span>
                    </div>

                    <p className="text-xs font-semibold text-slate-600 mt-0.5">
                      <span className="text-[#0d9488] font-bold">
                        ID: {cust.customerId}
                      </span>{' '}
                      •{' '}
                      <span className="text-slate-900 font-bold">
                        ₹{cust.subTotalLoanAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </span>
                    </p>

                    <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-500 font-medium">
                      <span className="flex items-center gap-1">
                        <Phone className="w-3 h-3 text-slate-400" />
                        {cust.mobileNumber}
                      </span>
                      <span className="bg-teal-50 text-[#0d9488] px-2 py-0.5 rounded-md font-bold text-[10px] border border-teal-100">
                        {cust.repaymentFrequency}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right side View Button */}
                <button
                  onClick={() => onSelectCustomer(cust)}
                  className="bg-slate-100 hover:bg-teal-50 hover:text-[#0d9488] text-slate-700 font-bold text-xs px-3 py-2 rounded-xl flex items-center gap-0.5 transition-colors flex-shrink-0 ml-2"
                >
                  View
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}

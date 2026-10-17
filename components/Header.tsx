'use client';

import React from 'react';
import { Bell, Search, User as UserIcon, LogOut } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface HeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onOpenNotifications: () => void;
  onOpenProfileModal: () => void;
}

export default function Header({
  searchQuery,
  setSearchQuery,
  onOpenNotifications,
  onOpenProfileModal,
}: HeaderProps) {
  const { userProfile, signOutUser } = useAuth();

  const businessName = userProfile?.businessName || 'KH LOAN';
  const fullName = userProfile?.fullName || 'Gear';

  return (
    <header className="bg-[#0d9488] text-white pt-5 pb-6 px-4 sm:px-6 rounded-b-[2.5rem] shadow-lg shadow-teal-900/10 transition-all">
      <div className="max-w-3xl mx-auto">
        {/* Top User Bar */}
        <div className="flex items-center justify-between mb-4">
          {/* User Profile Info */}
          <button 
            onClick={onOpenProfileModal}
            className="flex items-center gap-2.5 text-left group hover:opacity-95 transition-opacity"
          >
            <div className="w-10 h-10 rounded-full bg-teal-100/90 border-2 border-white/60 flex items-center justify-center text-[#0d9488] font-bold text-sm shadow-sm overflow-hidden">
              <UserIcon className="w-6 h-6 text-[#0d9488]" />
            </div>
            <div>
              <p className="text-[11px] text-teal-100 font-medium leading-none">Hello,</p>
              <p className="text-sm font-bold text-white group-hover:underline leading-tight mt-0.5">
                {fullName}
              </p>
            </div>
          </button>

          {/* Business Title Header */}
          <h1 className="text-lg sm:text-xl font-extrabold tracking-wide text-white uppercase text-center">
            {businessName}
          </h1>

          {/* Right Actions: Notifications & Logout */}
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenNotifications}
              className="relative p-2.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              title="Notifications"
            >
              <Bell className="w-5 h-5 text-white" />
              <span className="absolute top-1 right-1 w-4 h-4 bg-amber-500 text-white font-black text-[10px] rounded-full flex items-center justify-center border border-[#0d9488]">
                4
              </span>
            </button>
            <button
              onClick={signOutUser}
              className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white/90 hover:text-white transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Search Input Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by ID, name or mobile number"
            className="w-full bg-white rounded-full py-3 pl-11 pr-4 text-xs sm:text-sm font-semibold text-slate-800 placeholder-slate-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-white/50"
          />
        </div>
      </div>
    </header>
  );
}

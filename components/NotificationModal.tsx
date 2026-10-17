'use client';

import React from 'react';
import { Bell, X, CheckCircle, Info, ShieldCheck } from 'lucide-react';

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NotificationModal({ isOpen, onClose }: NotificationModalProps) {
  if (!isOpen) return null;

  const notifications = [
    {
      id: 1,
      title: 'Real-Time Sync Active',
      desc: 'Firebase Firestore is actively persisting and syncing your data in real-time.',
      time: 'Just now',
      icon: ShieldCheck,
      color: 'text-[#0d9488] bg-teal-50',
    },
    {
      id: 2,
      title: 'Ledger Invoice Ready',
      desc: 'Print and JPG download functionality active for all transactions.',
      time: '10m ago',
      icon: CheckCircle,
      color: 'text-emerald-600 bg-emerald-50',
    },
    {
      id: 3,
      title: 'Customer Payment Recorded',
      desc: 'Automatic subtotal deduction and status updates calculated live.',
      time: '1h ago',
      icon: Info,
      color: 'text-amber-600 bg-amber-50',
    },
    {
      id: 4,
      title: 'Welcome to Small Finance',
      desc: 'Manage loans, calculate interests, and track repayments effortlessly.',
      time: 'Today',
      icon: Bell,
      color: 'text-indigo-600 bg-indigo-50',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 space-y-4">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-teal-50 text-[#0d9488]">
              <Bell className="w-5 h-5" />
            </div>
            <h2 className="text-base font-extrabold text-slate-900">
              Notifications
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List */}
        <div className="space-y-3 max-h-[320px] overflow-y-auto pr-1">
          {notifications.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                className="p-3 bg-slate-50 border border-slate-100 rounded-2xl flex items-start gap-3"
              >
                <div className={`p-2 rounded-xl flex-shrink-0 ${item.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-slate-900">{item.title}</h3>
                    <span className="text-[10px] text-slate-400 font-medium">{item.time}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 font-medium mt-0.5 leading-snug">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-[#0d9488] text-white font-bold text-xs shadow-md shadow-teal-700/20"
        >
          Close Notifications
        </button>
      </div>
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import { ArrowLeft, Mail, Phone, Copy, CheckCircle2, MessageSquare, ExternalLink } from 'lucide-react';
import { motion } from 'motion/react';
import { useAuth } from '@/context/AuthContext';

interface HelpSupportViewProps {
  onBack: () => void;
}

export default function HelpSupportView({ onBack }: HelpSupportViewProps) {
  const { userProfile } = useAuth();
  const [copiedType, setCopiedType] = useState<string | null>(null);

  const supportEmail = userProfile?.businessEmail || userProfile?.email || 'support@smallfinance.app';
  const mobileNumber = userProfile?.mobileNumber || '+91 98765 43210';
  const whatsappNumber = mobileNumber.replace(/\D/g, '');

  const handleCopyText = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2500);
  };

  const handleWhatsAppChat = () => {
    window.open(`https://wa.me/${whatsappNumber}?text=Hello%20Support,%20I%20need%20assistance%20with%20Small%20Finance.`, '_blank');
  };

  const handleCall = () => {
    window.location.href = `tel:${mobileNumber}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="min-h-screen bg-[#f8fafc] pb-12 flex flex-col text-slate-900"
    >
      {/* Header */}
      <div className="bg-[#0d9488] text-white pt-6 pb-6 px-4 sm:px-6 rounded-b-[2rem] shadow-md flex items-center justify-between">
        <button
          onClick={onBack}
          className="w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors active:scale-95 cursor-pointer"
          title="Back"
        >
          <ArrowLeft className="w-6 h-6 text-white" />
        </button>
        <h1 className="text-base sm:text-xl font-black uppercase tracking-wide text-white">
          Help & Support
        </h1>
        <div className="w-11" />
      </div>

      <main className="max-w-xl w-full mx-auto px-4 sm:px-6 mt-6 space-y-5">
        {copiedType && (
          <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 p-4 rounded-2xl flex items-center gap-3 text-sm font-bold shadow-xs">
            <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-emerald-600" />
            <span>{copiedType} copied to clipboard!</span>
          </div>
        )}

        {/* 1. Business Gmail / Email Card */}
        <div className="bg-white rounded-3xl p-6 shadow-xl shadow-slate-200/50 border border-slate-100 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-teal-50 text-[#0d9488] flex items-center justify-center">
              <Mail className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-sm font-black text-slate-900">Business Gmail / Email</h2>
              <p className="text-xs text-slate-500">Official support email address</p>
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl flex items-center justify-between border border-slate-200/70">
            <span className="text-xs sm:text-sm font-bold text-slate-800 truncate pr-2">{supportEmail}</span>
            <button
              onClick={() => handleCopyText(supportEmail, 'Email')}
              className="bg-[#0d9488] hover:bg-[#0f766e] text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm active:scale-95 transition-all cursor-pointer shrink-0"
            >
              <Copy className="w-3.5 h-3.5" /> Copy
            </button>
          </div>
        </div>

        {/* 2. Mobile Number Card */}
        <div className="bg-white rounded-3xl p-6 shadow-xl shadow-slate-200/50 border border-slate-100 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-teal-50 text-[#0d9488] flex items-center justify-center">
              <Phone className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-sm font-black text-slate-900">Support Mobile Number</h2>
              <p className="text-xs text-slate-500">Call our customer assistance helpline</p>
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl flex items-center justify-between border border-slate-200/70">
            <span className="text-xs sm:text-sm font-black text-slate-900">{mobileNumber}</span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleCopyText(mobileNumber, 'Mobile number')}
                className="bg-slate-200 hover:bg-slate-300 text-slate-700 px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1 shadow-sm active:scale-95 transition-all cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5" /> Copy
              </button>
              <button
                onClick={handleCall}
                className="bg-[#0d9488] hover:bg-[#0f766e] text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1 shadow-sm active:scale-95 transition-all cursor-pointer"
              >
                <Phone className="w-3.5 h-3.5" /> Call
              </button>
            </div>
          </div>
        </div>

        {/* 3. WhatsApp Number Card */}
        <div className="bg-white rounded-3xl p-6 shadow-xl shadow-slate-200/50 border border-slate-100 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <MessageSquare className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-sm font-black text-slate-900">WhatsApp Support</h2>
              <p className="text-xs text-slate-500">Chat directly with support via WhatsApp</p>
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl flex items-center justify-between border border-slate-200/70">
            <span className="text-xs sm:text-sm font-black text-slate-900">{mobileNumber}</span>
            <button
              onClick={handleWhatsAppChat}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm shadow-emerald-600/20 active:scale-95 transition-all cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5" /> Open WhatsApp
            </button>
          </div>
        </div>
      </main>
    </motion.div>
  );
}

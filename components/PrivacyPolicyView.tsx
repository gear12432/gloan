'use client';

import React from 'react';
import { ArrowLeft, ShieldCheck, Mail, MapPin, Building2, Lock, FileText } from 'lucide-react';
import { motion } from 'motion/react';
import { useAuth } from '@/context/AuthContext';

interface PrivacyPolicyViewProps {
  onBack: () => void;
}

export default function PrivacyPolicyView({ onBack }: PrivacyPolicyViewProps) {
  const { userProfile } = useAuth();

  const businessName = userProfile?.businessName || 'KH LOAN';
  const businessEmail = userProfile?.businessEmail || userProfile?.email || 'contact@khloan.com';
  const businessAddress = userProfile?.businessAddress || 'Main Road, Market Complex, India';

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="min-h-screen bg-[#f3f6f9] pb-12 flex flex-col font-sans"
    >
      {/* Header */}
      <div className="bg-[#0d9488] text-white pt-6 pb-6 px-4 sm:px-6 rounded-b-[2rem] shadow-md flex items-center justify-between">
        <button
          onClick={onBack}
          className="w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors active:scale-95"
          title="Back"
        >
          <ArrowLeft className="w-6 h-6" strokeWidth={2.5} />
        </button>

        <h1 className="text-base sm:text-xl font-black uppercase tracking-wide">
          PRIVACY POLICY / प्राइवेसी पॉलिसी
        </h1>

        <div className="w-11" />
      </div>

      {/* Main Content */}
      <main className="max-w-2xl w-full mx-auto px-4 sm:px-6 mt-5 space-y-4 flex-1">
        
        {/* Banner Card */}
        <div className="bg-white rounded-3xl p-6 shadow-xl shadow-slate-200/50 border border-slate-100 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-teal-50 text-[#0d9488] flex items-center justify-center flex-shrink-0 shadow-2xs border border-teal-100">
            <ShieldCheck className="w-7 h-7" strokeWidth={2.5} />
          </div>
          <div>
            <h2 className="text-lg font-black text-slate-900">
              {businessName} Data Protection & Privacy Policy
            </h2>
            <p className="text-xs font-bold text-slate-500">
              Last Updated: October 2026 • Official Business Policy
            </p>
          </div>
        </div>

        {/* Full Privacy Policy Text Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl shadow-slate-200/50 border border-slate-100 space-y-6 text-xs sm:text-sm text-slate-700 leading-relaxed">
          
          {/* Section 1 */}
          <section className="space-y-2">
            <h3 className="text-sm sm:text-base font-black text-slate-900 flex items-center gap-2">
              <Lock className="w-4 h-4 text-[#0d9488]" strokeWidth={2.5} />
              1. Information Collection & Encryption
            </h3>
            <p>
              At <strong className="text-slate-900">{businessName}</strong>, we take the confidentiality and privacy of your loan data very seriously. All customer records, transaction ledger amounts, payment histories, and contact entries are stored securely in Google Cloud Firebase Firestore with 256-bit encryption.
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-2">
            <h3 className="text-sm sm:text-base font-black text-slate-900 flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#0d9488]" strokeWidth={2.5} />
              2. How We Use Business Data
            </h3>
            <p>
              Your business and customer data is strictly isolated to your authenticated account. We do NOT sell, rent, or trade customer information, financial loan details, or transaction histories to any third-party advertisers or external agencies.
            </p>
          </section>

          {/* Section 3 */}
          <section className="space-y-2">
            <h3 className="text-sm sm:text-base font-black text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#0d9488]" strokeWidth={2.5} />
              3. Data Security & Storage
            </h3>
            <p>
              All interactions between your browser/mobile device and our database servers are conducted using Secure Sockets Layer (SSL) and Transport Layer Security (TLS). Automated database backups are performed regularly to ensure zero data loss.
            </p>
          </section>

          {/* Contact Business Box */}
          <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200/80 space-y-3">
            <h4 className="text-xs font-black text-[#0d9488] uppercase tracking-wider">
              Official Business Contact Details
            </h4>
            
            <div className="flex items-center gap-2.5 text-xs font-bold text-slate-800">
              <Building2 className="w-4 h-4 text-slate-500 flex-shrink-0" strokeWidth={2.5} />
              <span>Business Name: {businessName}</span>
            </div>

            <div className="flex items-center gap-2.5 text-xs font-bold text-slate-800">
              <Mail className="w-4 h-4 text-slate-500 flex-shrink-0" strokeWidth={2.5} />
              <span>Email: {businessEmail}</span>
            </div>

            <div className="flex items-center gap-2.5 text-xs font-bold text-slate-800">
              <MapPin className="w-4 h-4 text-slate-500 flex-shrink-0" strokeWidth={2.5} />
              <span>Address: {businessAddress}</span>
            </div>
          </div>

          <button
            onClick={onBack}
            className="w-full bg-[#0d9488] hover:bg-[#0f766e] text-white font-extrabold py-3.5 rounded-2xl shadow-md transition-all active:scale-95 mt-4"
          >
            Back to Settings
          </button>

        </div>

      </main>
    </motion.div>
  );
}

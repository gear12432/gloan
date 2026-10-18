'use client';

import React from 'react';
import { ArrowLeft, ShieldCheck, Lock, FileText } from 'lucide-react';
import { motion } from 'motion/react';

interface PrivacyPolicyViewProps {
  onBack: () => void;
}

export default function PrivacyPolicyView({ onBack }: PrivacyPolicyViewProps) {
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
          Privacy Policy
        </h1>
        <div className="w-11" />
      </div>

      <main className="max-w-2xl w-full mx-auto px-4 sm:px-6 mt-6 space-y-6">
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl shadow-slate-200/50 border border-slate-100 space-y-6">
          <div className="flex items-center gap-3.5 pb-5 border-b border-slate-100">
            <div className="w-12 h-12 rounded-2xl bg-teal-50 text-[#0d9488] flex items-center justify-center flex-shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-slate-900">Small Finance Privacy Policy</h2>
              <p className="text-xs font-semibold text-slate-500">Effective Date: October 17, 2026</p>
            </div>
          </div>

          <div className="space-y-5 text-xs sm:text-sm text-slate-700 leading-relaxed">
            <section className="space-y-2">
              <h3 className="text-sm sm:text-base font-black text-slate-900">1. Introduction</h3>
              <p>
                Welcome to Small Finance (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;). We respect your privacy and are committed to protecting your personal and business data. This Privacy Policy explains how we collect, use, store, and safeguard your information when you use our application and services.
              </p>
            </section>

            <section className="space-y-2">
              <h3 className="text-sm sm:text-base font-black text-slate-900">2. Information We Collect</h3>
              <p>
                We collect information necessary to provide efficient financial record keeping, including business name, full name, mobile number, registered email, customer loan records, repayment histories, and transaction ledgers.
              </p>
            </section>

            <section className="space-y-2">
              <h3 className="text-sm sm:text-base font-black text-slate-900">3. Account Information</h3>
              <p>
                Registered user credentials (via Firebase Authentication) and user profile preferences (such as theme and language settings) are securely associated with your unique account identifier (UID).
              </p>
            </section>

            <section className="space-y-2">
              <h3 className="text-sm sm:text-base font-black text-slate-900">4. Data Storage & Security</h3>
              <p>
                All application data is securely stored using Google Cloud Firestore with strict security rules ensuring that only authenticated users can access their own business records. Passwords are never stored in plain text.
              </p>
            </section>

            <section className="space-y-2">
              <h3 className="text-sm sm:text-base font-black text-slate-900">5. Firebase Services</h3>
              <p>
                Our app utilizes Firebase Authentication for secure sign-in and Cloud Firestore for real-time data persistence. Firebase adheres to enterprise-grade cloud security standards.
              </p>
            </section>

            <section className="space-y-2">
              <h3 className="text-sm sm:text-base font-black text-slate-900">6. How We Use Information</h3>
              <p>
                We use collected information solely for operating the small finance ledger, computing interest, tracking repayments, generating financial statements, and providing customer support.
              </p>
            </section>

            <section className="space-y-2">
              <h3 className="text-sm sm:text-base font-black text-slate-900">7. Data Sharing</h3>
              <p>
                We do not sell, trade, or rent your personal or business financial data to third parties. Data is only processed within secure cloud infrastructure necessary for app functionality.
              </p>
            </section>

            <section className="space-y-2">
              <h3 className="text-sm sm:text-base font-black text-slate-900">8. Data Security</h3>
              <p>
                We implement industry-standard encryption in transit (HTTPS) and secure database access controls to safeguard your financial records against unauthorized access.
              </p>
            </section>

            <section className="space-y-2">
              <h3 className="text-sm sm:text-base font-black text-slate-900">9. Data Retention and Deletion</h3>
              <p>
                Your records remain stored as long as your account is active. You may request account closure and data deletion by contacting our support team.
              </p>
            </section>

            <section className="space-y-2">
              <h3 className="text-sm sm:text-base font-black text-slate-900">10. User Rights</h3>
              <p>
                You retain full rights to access, update, export, or correct your personal business profile and customer records directly within the application interface at any time.
              </p>
            </section>

            <section className="space-y-2">
              <h3 className="text-sm sm:text-base font-black text-slate-900">11. Children&apos;s Privacy</h3>
              <p>
                Our services are designed for professional business and financial record management and are not directed to individuals under the age of 18.
              </p>
            </section>

            <section className="space-y-2">
              <h3 className="text-sm sm:text-base font-black text-slate-900">12. Policy Updates</h3>
              <p>
                We may update this Privacy Policy from time to time. Continued use of the application after changes constitutes acceptance of the revised policy.
              </p>
            </section>

            <section className="space-y-2">
              <h3 className="text-sm sm:text-base font-black text-slate-900">13. Contact Information</h3>
              <p>
                For questions regarding this Privacy Policy, please contact us at support@smallfinance.app.
              </p>
            </section>
          </div>
        </div>
      </main>
    </motion.div>
  );
}

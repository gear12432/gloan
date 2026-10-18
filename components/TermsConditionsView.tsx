'use client';

import React from 'react';
import { ArrowLeft, FileText, Scale } from 'lucide-react';
import { motion } from 'motion/react';

interface TermsConditionsViewProps {
  onBack: () => void;
}

export default function TermsConditionsView({ onBack }: TermsConditionsViewProps) {
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
          Terms & Conditions
        </h1>
        <div className="w-11" />
      </div>

      <main className="max-w-2xl w-full mx-auto px-4 sm:px-6 mt-6 space-y-6">
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl shadow-slate-200/50 border border-slate-100 space-y-6">
          <div className="flex items-center gap-3.5 pb-5 border-b border-slate-100">
            <div className="w-12 h-12 rounded-2xl bg-teal-50 text-[#0d9488] flex items-center justify-center flex-shrink-0">
              <Scale className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-slate-900">Small Finance Terms of Service</h2>
              <p className="text-xs font-semibold text-slate-500">Last Updated: October 17, 2026</p>
            </div>
          </div>

          <div className="space-y-5 text-xs sm:text-sm text-slate-700 leading-relaxed">
            <section className="space-y-2">
              <h3 className="text-sm sm:text-base font-black text-slate-900">1. Introduction</h3>
              <p>
                By accessing or using the Small Finance application, you agree to be bound by these Terms and Conditions. Please read them carefully before using our ledger and financial record-keeping tools.
              </p>
            </section>

            <section className="space-y-2">
              <h3 className="text-sm sm:text-base font-black text-slate-900">2. Acceptance of Terms</h3>
              <p>
                Your registration, login, or continued use of the application constitutes full acceptance of these terms and any future modifications.
              </p>
            </section>

            <section className="space-y-2">
              <h3 className="text-sm sm:text-base font-black text-slate-900">3. Eligibility</h3>
              <p>
                You must be at least 18 years of age and possess full legal capacity to operate a business or financial ledger using this application.
              </p>
            </section>

            <section className="space-y-2">
              <h3 className="text-sm sm:text-base font-black text-slate-900">4. User Account Responsibilities</h3>
              <p>
                You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account UID.
              </p>
            </section>

            <section className="space-y-2">
              <h3 className="text-sm sm:text-base font-black text-slate-900">5. Acceptable Use</h3>
              <p>
                You agree not to use the application for any unlawful activities, fraudulent lending practices, or unauthorized data scraping.
              </p>
            </section>

            <section className="space-y-2">
              <h3 className="text-sm sm:text-base font-black text-slate-900">6. Application Services</h3>
              <p>
                Small Finance provides digital ledger tools, customer tracking, loan calculations, and payment recording utilities designed to assist small business operations.
              </p>
            </section>

            <section className="space-y-2">
              <h3 className="text-sm sm:text-base font-black text-slate-900">7. User Responsibilities</h3>
              <p>
                You are solely responsible for the accuracy of all customer loan amounts, interest rates, and payment records entered into your ledger.
              </p>
            </section>

            <section className="space-y-2">
              <h3 className="text-sm sm:text-base font-black text-slate-900">8. Fees and Charges</h3>
              <p>
                Standard software usage terms apply as outlined in your subscription tier. No hidden fees are charged by the platform.
              </p>
            </section>

            <section className="space-y-2">
              <h3 className="text-sm sm:text-base font-black text-slate-900">9. Interest and Repayment Terms</h3>
              <p>
                Interest calculations are performed automatically based on the rates and frequencies configured by the account owner.
              </p>
            </section>

            <section className="space-y-2">
              <h3 className="text-sm sm:text-base font-black text-slate-900">10. Transactions and Payment Rules</h3>
              <p>
                Recorded payments update remaining loan balances in real-time. Users must verify all transaction entries for correctness.
              </p>
            </section>

            <section className="space-y-2">
              <h3 className="text-sm sm:text-base font-black text-slate-900">11. Suspension or Termination</h3>
              <p>
                We reserve the right to suspend or terminate accounts that violate these terms or compromise platform security.
              </p>
            </section>

            <section className="space-y-2">
              <h3 className="text-sm sm:text-base font-black text-slate-900">12. Limitation of Liability</h3>
              <p>
                Small Finance shall not be held liable for indirect, incidental, or consequential damages arising from business financial record inaccuracies or data loss.
              </p>
            </section>

            <section className="space-y-2">
              <h3 className="text-sm sm:text-base font-black text-slate-900">13. Changes to These Terms</h3>
              <p>
                We may revise these terms at any time. Notice of significant changes will be provided through the application interface.
              </p>
            </section>

            <section className="space-y-2">
              <h3 className="text-sm sm:text-base font-black text-slate-900">14. Governing Law</h3>
              <p>
                These terms are governed by the applicable laws of the jurisdiction in which the business operates.
              </p>
            </section>

            <section className="space-y-2">
              <h3 className="text-sm sm:text-base font-black text-slate-900">15. Contact Information</h3>
              <p>
                For any legal inquiries or support, contact us at legal@smallfinance.app.
              </p>
            </section>
          </div>
        </div>
      </main>
    </motion.div>
  );
}

'use client';

import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Building2, 
  Phone, 
  MapPin, 
  Mail, 
  Camera, 
  CheckCircle2, 
  Building
} from 'lucide-react';
import { motion } from 'motion/react';
import { useAuth } from '@/context/AuthContext';
import FloatingInput from './ui/FloatingInput';

interface BusinessSettingsViewProps {
  onBack: () => void;
}

export default function BusinessSettingsView({ onBack }: BusinessSettingsViewProps) {
  const { userProfile, updateProfile } = useAuth();

  const [businessName, setBusinessName] = useState(userProfile?.businessName || 'KH LOAN');
  const [mobileNumber, setMobileNumber] = useState(userProfile?.mobileNumber || '+91 98765 43210');
  const [businessAddress, setBusinessAddress] = useState(userProfile?.businessAddress || 'Main Road, Market Complex');
  const [businessEmail, setBusinessEmail] = useState(userProfile?.businessEmail || userProfile?.email || 'contact@khloan.com');
  const [profileImageUrl, setProfileImageUrl] = useState(userProfile?.profileImageUrl || 'https://api.dicebear.com/7.x/shapes/svg?seed=KHLoan');

  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!businessName.trim() || !mobileNumber.trim() || !businessEmail.trim()) {
      setErrorMsg('Please enter Business Name, Contact Number, and Email ID.');
      return;
    }

    setErrorMsg('');
    setLoading(true);

    try {
      await updateProfile({
        businessName: businessName.trim(),
        mobileNumber: mobileNumber.trim(),
        businessAddress: businessAddress.trim(),
        businessEmail: businessEmail.trim(),
        profileImageUrl: profileImageUrl.trim(),
      });
      setSuccessMsg('Business Settings updated successfully! All invoice records will now show these business details.');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Failed to update business settings.');
    } finally {
      setLoading(false);
    }
  };

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
          BUSINESS SETTINGS / बिजनेस सेटिंग
        </h1>

        <div className="w-11" />
      </div>

      {/* Main Container */}
      <main className="max-w-xl w-full mx-auto px-4 sm:px-6 mt-5 space-y-4 flex-1">
        
        {/* Business Preview Header Card */}
        <div className="bg-white rounded-3xl p-6 shadow-xl shadow-slate-200/50 border border-slate-100 flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl border-2 border-teal-300 bg-slate-100 overflow-hidden flex items-center justify-center shadow-xs flex-shrink-0">
            {profileImageUrl ? (
              <img src={profileImageUrl} alt={businessName} className="w-full h-full object-cover" />
            ) : (
              <Building className="w-8 h-8 text-[#0d9488]" strokeWidth={2.5} />
            )}
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              INVOICE BUSINESS HEADER PREVIEW
            </p>
            <h2 className="text-lg font-black text-slate-900 uppercase">
              {businessName || 'KH LOAN'}
            </h2>
            <p className="text-xs font-bold text-slate-500">
              {mobileNumber} • {businessEmail}
            </p>
          </div>
        </div>

        {/* Form Fields Card */}
        <div className="bg-white rounded-3xl p-5 sm:p-7 shadow-xl shadow-slate-200/50 border border-slate-100 space-y-5">
          
          {errorMsg && (
            <div className="p-4 bg-red-50 text-red-600 rounded-2xl text-xs font-bold border border-red-100">
              {errorMsg}
            </div>
          )}

          {successMsg && (
            <div className="p-4 bg-emerald-50 text-emerald-700 rounded-2xl text-xs font-bold border border-emerald-100">
              {successMsg}
            </div>
          )}

          <form onSubmit={handleSave} className="space-y-5">
            {/* Business Logo URL */}
            <FloatingInput
              label="Business Logo Image URL (बिजनेस लोगो)"
              icon={Camera}
              value={profileImageUrl}
              onChange={(e) => setProfileImageUrl(e.target.value)}
            />

            {/* Business Name */}
            <FloatingInput
              label="Business Name (बिजनेस नेम)"
              icon={Building2}
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              required
            />

            {/* Business Mobile Number */}
            <FloatingInput
              label="Business Contact Number (कॉन्टेक्ट नंबर)"
              icon={Phone}
              type="tel"
              value={mobileNumber}
              onChange={(e) => setMobileNumber(e.target.value)}
              required
            />

            {/* Business Address */}
            <FloatingInput
              label="Business Address (बिजनेस एड्रेस)"
              icon={MapPin}
              value={businessAddress}
              onChange={(e) => setBusinessAddress(e.target.value)}
            />

            {/* Business Email / Gmail */}
            <FloatingInput
              label="Business Gmail / Email ID (जीमेल आईडी)"
              icon={Mail}
              type="email"
              value={businessEmail}
              onChange={(e) => setBusinessEmail(e.target.value)}
              required
            />

            {/* Save Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#0d9488] hover:bg-[#0f766e] text-white font-extrabold text-sm sm:text-base py-4 rounded-2xl shadow-lg shadow-teal-700/20 flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-60 mt-6"
            >
              <CheckCircle2 className="w-5 h-5" strokeWidth={2.5} />
              {loading ? 'Saving Business Settings...' : 'Save Business Settings'}
            </button>
          </form>
        </div>

      </main>
    </motion.div>
  );
}

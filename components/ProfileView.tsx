'use client';

import React, { useState } from 'react';
import { 
  ArrowLeft, 
  LogOut, 
  User, 
  Building2, 
  Phone, 
  MapPin, 
  Camera, 
  Mail, 
  CheckCircle2 
} from 'lucide-react';
import { motion } from 'motion/react';
import { useAuth } from '@/context/AuthContext';
import FloatingInput from './ui/FloatingInput';

interface ProfileViewProps {
  onBack: () => void;
}

export default function ProfileView({ onBack }: ProfileViewProps) {
  const { user, userProfile, updateProfile, signOutUser } = useAuth();

  const [fullName, setFullName] = useState(userProfile?.fullName || 'Gear');
  const [businessName, setBusinessName] = useState(userProfile?.businessName || 'KH LOAN');
  const [mobileNumber, setMobileNumber] = useState(userProfile?.mobileNumber || '907436329');
  const [businessAddress, setBusinessAddress] = useState(userProfile?.businessAddress || '');
  const [profileImageUrl, setProfileImageUrl] = useState(
    userProfile?.profileImageUrl || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Gear'
  );
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const accountEmail = userProfile?.email || user?.email || 'gear@gmail.com';

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !businessName.trim() || !mobileNumber.trim()) {
      setErrorMsg('Please fill in Full Name, Business Name, and Mobile Number.');
      return;
    }

    setErrorMsg('');
    setLoading(true);

    try {
      await updateProfile({
        fullName: fullName.trim(),
        businessName: businessName.trim(),
        mobileNumber: mobileNumber.trim(),
        businessAddress: businessAddress.trim(),
        profileImageUrl: profileImageUrl.trim(),
      });
      setSuccessMsg('Profile changes saved successfully!');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOutUser();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="min-h-screen bg-[#f3f6f9] pb-12 flex flex-col"
    >
      {/* Top Header Bar matching Screenshot */}
      <div className="bg-[#0d9488] text-white pt-6 pb-6 px-4 sm:px-6 rounded-b-[2rem] shadow-md flex items-center justify-between">
        <button
          onClick={onBack}
          className="w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors active:scale-95"
          title="Back"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>

        <h1 className="text-base sm:text-xl font-black uppercase tracking-wide">
          BUSINESS PROFILE
        </h1>

        <button
          onClick={handleSignOut}
          className="w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors active:scale-95"
          title="Sign Out"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>

      {/* Main Content Area */}
      <main className="max-w-xl w-full mx-auto px-4 sm:px-6 mt-5 space-y-4 flex-1">
        
        {/* User Avatar & Quick Info Banner Card */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-xl shadow-slate-200/50 border border-slate-100 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            {/* Avatar Circle with Camera badge */}
            <div className="relative">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 border-teal-300 bg-slate-100 overflow-hidden flex items-center justify-center shadow-xs">
                {profileImageUrl ? (
                  <img
                    src={profileImageUrl}
                    alt={fullName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-[#0d9488] text-white font-extrabold text-2xl flex items-center justify-center">
                    {fullName.charAt(0)}
                  </div>
                )}
              </div>
              <div className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-[#0d9488] border-2 border-white text-white flex items-center justify-center shadow-2xs">
                <Camera className="w-3.5 h-3.5" />
              </div>
            </div>

            <div>
              <h2 className="text-lg sm:text-xl font-black text-slate-900">
                {fullName || 'Gear'}
              </h2>
              <p className="text-xs sm:text-sm font-semibold text-slate-500 mt-0.5">
                {accountEmail}
              </p>
            </div>
          </div>

          <div className="text-right">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              BUSINESS
            </p>
            <p className="text-sm sm:text-base font-black text-[#0d9488] uppercase tracking-wide">
              {businessName || 'KH LOAN'}
            </p>
          </div>
        </div>

        {/* Call Details Quick Action Bar */}
        <div className="bg-[#0d9488]/10 border border-[#0d9488]/20 rounded-2xl p-4 flex items-center justify-between gap-3 shadow-2xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#0d9488] text-white flex items-center justify-center flex-shrink-0 shadow-xs">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] font-black text-[#0d9488] uppercase tracking-wider">
                CALL / CONTACT DETAILS
              </p>
              <p className="text-sm sm:text-base font-extrabold text-slate-900 mt-0.5">
                {mobileNumber || 'Not specified'}
              </p>
            </div>
          </div>
          <a
            href={`tel:${mobileNumber}`}
            className="bg-[#0d9488] hover:bg-[#0f766e] text-white text-xs sm:text-sm font-extrabold py-2.5 px-4 rounded-xl shadow-xs flex items-center gap-1.5 transition-all active:scale-95 flex-shrink-0"
          >
            <Phone className="w-4 h-4" />
            Call Now
          </a>
        </div>

        {/* Form Fields Card */}
        <div className="bg-white rounded-3xl p-5 sm:p-7 shadow-xl shadow-slate-200/50 border border-slate-100 space-y-6">
          
          {errorMsg && (
            <div className="p-4 bg-red-50 text-red-600 rounded-2xl text-xs sm:text-sm font-bold border border-red-100">
              {errorMsg}
            </div>
          )}

          {successMsg && (
            <div className="p-4 bg-emerald-50 text-emerald-700 rounded-2xl text-xs sm:text-sm font-bold border border-emerald-100">
              {successMsg}
            </div>
          )}

          <form onSubmit={handleSave} className="space-y-5">
            {/* Full Name */}
            <FloatingInput
              label="Full Name"
              icon={User}
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />

            {/* Business Name */}
            <FloatingInput
              label="Business Name"
              icon={Building2}
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              required
            />

            {/* Mobile Number */}
            <FloatingInput
              label="Mobile Number"
              icon={Phone}
              type="tel"
              value={mobileNumber}
              onChange={(e) => setMobileNumber(e.target.value)}
              required
            />

            {/* Business Address */}
            <FloatingInput
              label="Business Address"
              icon={MapPin}
              value={businessAddress}
              onChange={(e) => setBusinessAddress(e.target.value)}
            />

            {/* Profile Image URL */}
            <FloatingInput
              label="Profile Image URL"
              icon={Camera}
              value={profileImageUrl}
              onChange={(e) => setProfileImageUrl(e.target.value)}
            />

            {/* Account Email (Read-Only) */}
            <FloatingInput
              label="Account Email (Read-Only)"
              icon={Mail}
              value={accountEmail}
              readOnly
              readOnlyText
            />

            {/* Save Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#0d9488] hover:bg-[#0f766e] text-white font-extrabold text-sm sm:text-base py-4 rounded-2xl shadow-lg shadow-teal-700/20 flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-60 mt-6"
            >
              <CheckCircle2 className="w-5 h-5" />
              {loading ? 'Saving Profile...' : 'Save Profile Changes'}
            </button>
          </form>
        </div>

        {/* Sign Out Button below card matching screenshot */}
        <button
          onClick={handleSignOut}
          className="w-full bg-red-50 hover:bg-red-100/80 text-red-600 border border-red-200/80 font-extrabold text-sm sm:text-base py-4 rounded-2xl flex items-center justify-center gap-2 shadow-xs transition-colors active:scale-95"
        >
          <LogOut className="w-5 h-5 text-red-600" />
          Sign Out of Account
        </button>

      </main>
    </motion.div>
  );
}

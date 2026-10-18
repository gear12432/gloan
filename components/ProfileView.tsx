'use client';

import React, { useState, useRef } from 'react';
import { 
  ArrowLeft, 
  LogOut, 
  User, 
  Building2, 
  Phone, 
  MapPin, 
  Camera, 
  Mail, 
  CheckCircle2,
  Percent,
  ShieldCheck,
  FileText,
  Info,
  HelpCircle,
  ChevronRight,
  AlertTriangle,
  Upload,
  MessageSquare
} from 'lucide-react';
import { motion } from 'motion/react';
import { useAuth } from '@/context/AuthContext';

interface ProfileViewProps {
  onBack: () => void;
  onNavigateInterestRate: () => void;
  onNavigatePrivacy: () => void;
  onNavigateTerms: () => void;
  onNavigateAbout: () => void;
  onNavigateHelp: () => void;
}

export default function ProfileView({
  onBack,
  onNavigateInterestRate,
  onNavigatePrivacy,
  onNavigateTerms,
  onNavigateAbout,
  onNavigateHelp,
}: ProfileViewProps) {
  const { user, userProfile, updateProfile, signOutUser } = useAuth();

  const [fullName, setFullName] = useState(userProfile?.fullName || 'Gear');
  const [businessName, setBusinessName] = useState(userProfile?.businessName || 'KH LOAN');
  const [mobileNumber, setMobileNumber] = useState(userProfile?.mobileNumber || '+91 98765 43210');
  const [businessAddress, setBusinessAddress] = useState(userProfile?.businessAddress || '');
  const [profileImageUrl, setProfileImageUrl] = useState(
    userProfile?.profileImageUrl || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Gear'
  );
  const [selectedFileName, setSelectedFileName] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const accountEmail = userProfile?.email || user?.email || 'gear@gmail.com';

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFileName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
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
      setSuccessMsg('Profile updated and all data saved successfully!');
      setIsEditing(false);
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  const handleWhatsAppSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleSaveProfile();
    const text = encodeURIComponent(
      `*Business Profile Data Saved*\nName: ${fullName}\nBusiness: ${businessName}\nMobile: ${mobileNumber}\nAddress: ${businessAddress}\nEmail: ${accountEmail}`
    );
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  const handleConfirmLogout = async () => {
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
      className="min-h-screen bg-[#f8fafc] pb-12 flex flex-col text-slate-900"
    >
      {/* Hidden File Input for Choose File & Camera Icon */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />

      {/* Top Header Bar */}
      <div className="bg-[#0d9488] text-white pt-6 pb-6 px-4 sm:px-6 rounded-b-[2rem] shadow-md flex items-center justify-between">
        <button
          onClick={onBack}
          className="w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors active:scale-95 cursor-pointer"
          title="Back"
        >
          <ArrowLeft className="w-6 h-6 text-white" />
        </button>

        <h1 className="text-base sm:text-xl font-black uppercase tracking-wide text-white">
          Profile & Settings
        </h1>

        <div className="w-11" /> {/* Spacer for balance */}
      </div>

      <main className="flex-1 max-w-2xl w-full mx-auto px-4 sm:px-6 pt-6 space-y-6">
        {successMsg && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-3 shadow-sm"
          >
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{successMsg}</span>
          </motion.div>
        )}

        {errorMsg && (
          <div className="bg-rose-50 border border-rose-200 text-rose-800 p-4 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-3 shadow-sm">
            <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Profile Card Header */}
        <div className="bg-white rounded-3xl p-6 shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col sm:flex-row items-center gap-6">
          <div className="relative">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-4 border-teal-100 bg-teal-50 shadow-inner">
              <img
                src={profileImageUrl || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Gear'}
                alt={fullName}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-[#0d9488] text-white flex items-center justify-center shadow-md hover:bg-[#0f766e] transition-colors cursor-pointer active:scale-95"
              title="Select Profile Picture"
            >
              <Camera className="w-4 h-4 text-white" />
            </button>
          </div>

          <div className="flex-1 text-center sm:text-left space-y-1">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <h2 className="text-xl font-black text-slate-900">{fullName}</h2>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="px-4 py-1.5 rounded-full bg-teal-50 hover:bg-teal-100 text-[#0d9488] text-xs font-black transition-colors border border-teal-200/60 cursor-pointer"
              >
                {isEditing ? 'Cancel Edit' : 'Edit Profile'}
              </button>
            </div>

            <p className="text-sm font-bold text-teal-700 flex items-center justify-center sm:justify-start gap-1.5">
              <Building2 className="w-4 h-4 text-[#0d9488]" />
              {businessName}
            </p>

            <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs font-semibold text-slate-500">
              <span className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                {mobileNumber}
              </span>
              <span className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                {accountEmail}
              </span>
              {businessAddress && (
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  {businessAddress}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* EDIT PROFILE FORM */}
        {isEditing && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={handleSaveProfile}
            className="bg-white rounded-3xl p-6 shadow-xl shadow-slate-200/50 border border-slate-100 space-y-4"
          >
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wide border-b border-slate-100 pb-3">
              Update Business Profile Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-600">Full Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Your Full Name"
                  className="w-full mt-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0d9488]"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-600">Business Name</label>
                <input
                  type="text"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="Business / Firm Name"
                  className="w-full mt-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0d9488]"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-600">Mobile Number</label>
                <input
                  type="text"
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full mt-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0d9488]"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-600">Business Address</label>
                <input
                  type="text"
                  value={businessAddress}
                  onChange={(e) => setBusinessAddress(e.target.value)}
                  placeholder="e.g. Main Market, City"
                  className="w-full mt-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0d9488]"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="text-xs font-bold text-slate-600">Business Profile Image / Logo</label>
                <div className="mt-1 flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-2.5 bg-teal-50 hover:bg-teal-100 border border-teal-200 text-[#0d9488] rounded-xl text-xs sm:text-sm font-black flex items-center gap-2 transition-colors cursor-pointer active:scale-95 shadow-sm"
                  >
                    <Upload className="w-4 h-4" />
                    Choose File
                  </button>
                  <span className="text-xs font-semibold text-slate-500 truncate max-w-xs">
                    {selectedFileName || (profileImageUrl ? 'Image selected' : 'No file chosen')}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 w-full bg-[#0d9488] hover:bg-[#0f766e] text-white py-3 rounded-xl text-sm font-bold shadow-md shadow-teal-700/20 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {loading ? 'Saving...' : 'Save Profile Changes'}
              </button>

              <button
                type="button"
                onClick={handleWhatsAppSave}
                disabled={loading}
                className="flex-1 w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl text-sm font-bold shadow-md shadow-emerald-600/20 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <MessageSquare className="w-4 h-4" />
                Save & WhatsApp Share
              </button>
            </div>
          </motion.form>
        )}

        {/* SETTINGS MENU OPTIONS - BOLD BLACK ICONS */}
        <div className="bg-white rounded-3xl p-3 shadow-xl shadow-slate-200/50 border border-slate-100 space-y-1">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-3 py-2">Settings & Preferences</p>

          {/* 1. Interest Rate */}
          <button
            onClick={onNavigateInterestRate}
            className="w-full flex items-center justify-between p-3.5 rounded-2xl hover:bg-slate-50 transition-colors group cursor-pointer"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-900 flex items-center justify-center shadow-2xs">
                <Percent className="w-5 h-5 text-slate-900 stroke-[2.5]" />
              </div>
              <div className="text-left">
                <p className="text-sm font-black text-slate-900">Interest Rate</p>
                <p className="text-xs font-medium text-slate-500">Configure default loan interest & terms</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-400 group-hover:translate-x-1 transition-transform" />
          </button>

          <div className="border-t border-slate-100 my-1" />
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-3 py-2">About & Legal</p>

          {/* 2. Privacy Policy */}
          <button
            onClick={onNavigatePrivacy}
            className="w-full flex items-center justify-between p-3.5 rounded-2xl hover:bg-slate-50 transition-colors group cursor-pointer"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-900 flex items-center justify-center shadow-2xs">
                <ShieldCheck className="w-5 h-5 text-slate-900 stroke-[2.5]" />
              </div>
              <div className="text-left">
                <p className="text-sm font-black text-slate-900">Privacy Policy</p>
                <p className="text-xs font-medium text-slate-500">Data protection & security policies</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-400 group-hover:translate-x-1 transition-transform" />
          </button>

          {/* 3. Terms & Conditions */}
          <button
            onClick={onNavigateTerms}
            className="w-full flex items-center justify-between p-3.5 rounded-2xl hover:bg-slate-50 transition-colors group cursor-pointer"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-900 flex items-center justify-center shadow-2xs">
                <FileText className="w-5 h-5 text-slate-900 stroke-[2.5]" />
              </div>
              <div className="text-left">
                <p className="text-sm font-black text-slate-900">Terms & Conditions</p>
                <p className="text-xs font-medium text-slate-500">Platform terms & user responsibilities</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-400 group-hover:translate-x-1 transition-transform" />
          </button>

          {/* 4. About App */}
          <button
            onClick={onNavigateAbout}
            className="w-full flex items-center justify-between p-3.5 rounded-2xl hover:bg-slate-50 transition-colors group cursor-pointer"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-900 flex items-center justify-center shadow-2xs">
                <Info className="w-5 h-5 text-slate-900 stroke-[2.5]" />
              </div>
              <div className="text-left">
                <p className="text-sm font-black text-slate-900">About App</p>
                <p className="text-xs font-medium text-slate-500">Version 2.4.0 & system info</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-400 group-hover:translate-x-1 transition-transform" />
          </button>

          {/* 5. Help & Support */}
          <button
            onClick={onNavigateHelp}
            className="w-full flex items-center justify-between p-3.5 rounded-2xl hover:bg-slate-50 transition-colors group cursor-pointer"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-900 flex items-center justify-center shadow-2xs">
                <HelpCircle className="w-5 h-5 text-slate-900 stroke-[2.5]" />
              </div>
              <div className="text-left">
                <p className="text-sm font-black text-slate-900">Help & Support</p>
                <p className="text-xs font-medium text-slate-500">FAQs & customer assistance</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-400 group-hover:translate-x-1 transition-transform" />
          </button>

          <div className="border-t border-slate-100 my-1" />

          {/* 6. Logout */}
          <button
            onClick={() => setShowLogoutModal(true)}
            className="w-full flex items-center justify-between p-3.5 rounded-2xl hover:bg-rose-50 transition-colors group text-rose-600 cursor-pointer"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center shadow-2xs">
                <LogOut className="w-5 h-5 text-rose-600 stroke-[2.5]" />
              </div>
              <div className="text-left">
                <p className="text-sm font-black">Logout</p>
                <p className="text-xs font-medium opacity-80">Sign out of your account</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </main>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 text-center space-y-4"
          >
            <div className="w-14 h-14 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-7 h-7 stroke-[2.5]" />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900">Sign Out Confirmation</h3>
              <p className="text-xs text-slate-500 mt-1">
                Are you sure you want to sign out? Your financial records remain securely saved in your database.
              </p>
            </div>
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmLogout}
                className="flex-1 bg-rose-600 hover:bg-rose-700 text-white py-3 rounded-xl text-xs font-bold shadow-md shadow-rose-600/20 transition-all active:scale-95 cursor-pointer"
              >
                Confirm Logout
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}

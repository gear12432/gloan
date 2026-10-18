'use client';

import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Globe, 
  Percent, 
  Sun, 
  Moon, 
  User, 
  ShieldCheck, 
  FileText, 
  LogOut, 
  ChevronRight, 
  CheckCircle2, 
  X,
  Search,
  Building
} from 'lucide-react';
import { motion } from 'motion/react';
import { useAuth } from '@/context/AuthContext';
import { LANGUAGES } from '@/lib/translations';

interface SettingsViewProps {
  onBack: () => void;
  onNavigateProfile: () => void;
  onNavigateBusinessSettings: () => void;
  onNavigatePrivacy: () => void;
  onNavigateTerms: () => void;
  currentTheme: 'light' | 'dark';
  onToggleTheme: (mode: 'light' | 'dark') => void;
}

export default function SettingsView({ 
  onBack, 
  onNavigateProfile,
  onNavigateBusinessSettings,
  onNavigatePrivacy,
  onNavigateTerms,
  currentTheme,
  onToggleTheme
}: SettingsViewProps) {
  const { signOutUser, userProfile, updateProfile } = useAuth();

  // Settings State
  const [selectedLanguage, setSelectedLanguage] = useState<string>(
    userProfile?.language || 'EN'
  );
  const [defaultInterestRate, setDefaultInterestRate] = useState<number>(
    userProfile?.defaultInterestRate || 0
  );
  const [langSearch, setLangSearch] = useState<string>('');
  const [saveMessage, setSaveMessage] = useState<string>('');

  // Modals for Language & Interest Rate Dialogs
  const [activeModal, setActiveModal] = useState<'LANGUAGE' | 'INTEREST' | null>(null);

  const handleSignOut = async () => {
    try {
      await signOutUser();
    } catch (err) {
      console.error(err);
    }
  };

  const handleSelectLanguage = async (code: string) => {
    setSelectedLanguage(code);
    setActiveModal(null);
    try {
      await updateProfile({ language: code });
    } catch (err) {
      console.error('Error saving language:', err);
    }
  };

  const handleSaveInterest = async () => {
    try {
      await updateProfile({ defaultInterestRate: Number(defaultInterestRate) });
      setSaveMessage('Default Interest Rate updated successfully!');
      setTimeout(() => {
        setSaveMessage('');
        setActiveModal(null);
      }, 1200);
    } catch (err) {
      console.error('Error saving interest rate:', err);
    }
  };

  const filteredLanguages = LANGUAGES.filter((l) => 
    l.name.toLowerCase().includes(langSearch.toLowerCase()) || 
    l.nativeName.toLowerCase().includes(langSearch.toLowerCase()) ||
    l.code.toLowerCase().includes(langSearch.toLowerCase())
  );

  const activeLangObj = LANGUAGES.find((l) => l.code === selectedLanguage) || LANGUAGES[0];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="min-h-screen bg-[#f3f6f9] dark:bg-slate-900 pb-12 flex flex-col font-sans transition-colors"
    >
      {/* Top Header Bar */}
      <div className="bg-[#0d9488] text-white pt-6 pb-6 px-4 sm:px-6 rounded-b-[2rem] shadow-md flex items-center justify-between">
        <button
          onClick={onBack}
          className="w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors active:scale-95"
          title="Back to Dashboard"
        >
          <ArrowLeft className="w-6 h-6" strokeWidth={2.5} />
        </button>

        <h1 className="text-base sm:text-xl font-black uppercase tracking-wide">
          SETTINGS / सेटिंग्स
        </h1>

        <div className="w-11" /> {/* Spacer */}
      </div>

      {/* Main Content Container */}
      <main className="max-w-xl w-full mx-auto px-4 sm:px-6 mt-5 space-y-4 flex-1">
        
        {/* User Card Header */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-5 shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-full bg-teal-50 dark:bg-teal-900/40 border-2 border-[#0d9488]/30 flex items-center justify-center text-[#0d9488] dark:text-teal-300 font-black text-lg shadow-2xs">
              {userProfile?.fullName ? userProfile.fullName.charAt(0) : 'U'}
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-slate-100">
                {userProfile?.fullName || 'Business Owner'}
              </h2>
              <p className="text-xs font-bold text-[#0d9488] dark:text-teal-300">
                {userProfile?.businessName || 'KH LOAN'}
              </p>
            </div>
          </div>
          <button
            onClick={onNavigateProfile}
            className="text-xs font-black text-[#0d9488] bg-teal-50 hover:bg-teal-100/80 dark:bg-teal-900/30 dark:text-teal-300 px-3 py-2 rounded-xl border border-teal-200/60 dark:border-teal-700 transition-all active:scale-95 flex items-center gap-1"
          >
            Edit Profile
            <ChevronRight className="w-4 h-4" strokeWidth={2.5} />
          </button>
        </div>

        {/* Menu Section 1: Application Preferences */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-3 sm:p-4 shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-700 space-y-2">
          <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest px-3 pt-2">
            Preferences & Configuration
          </p>

          {/* 1. Language Option (25 Languages Dialog) */}
          <button
            onClick={() => setActiveModal('LANGUAGE')}
            className="w-full flex items-center justify-between p-3.5 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-700/60 transition-colors border border-transparent hover:border-slate-200/60 active:scale-[0.99]"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-700 text-black dark:text-white flex items-center justify-center shadow-2xs border border-slate-200 dark:border-slate-600">
                <Globe className="w-5 h-5 text-black dark:text-white" strokeWidth={2.5} />
              </div>
              <div className="text-left">
                <p className="text-sm font-black text-slate-900 dark:text-slate-100">Language / भाषा (25 Languages)</p>
                <p className="text-xs font-bold text-slate-500 dark:text-slate-400">
                  {activeLangObj.name} ({activeLangObj.nativeName})
                </p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-black dark:text-slate-300" strokeWidth={2.5} />
          </button>

          {/* 2. Loan Interest Option */}
          <button
            onClick={() => setActiveModal('INTEREST')}
            className="w-full flex items-center justify-between p-3.5 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-700/60 transition-colors border border-transparent hover:border-slate-200/60 active:scale-[0.99]"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-700 text-black dark:text-white flex items-center justify-center shadow-2xs border border-slate-200 dark:border-slate-600">
                <Percent className="w-5 h-5 text-black dark:text-white" strokeWidth={2.5} />
              </div>
              <div className="text-left">
                <p className="text-sm font-black text-slate-900 dark:text-slate-100">Default Interest Rate / ब्याज प्रतिशत</p>
                <p className="text-xs font-bold text-slate-500 dark:text-slate-400">
                  Current Default: {defaultInterestRate}%
                </p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-black dark:text-slate-300" strokeWidth={2.5} />
          </button>

          {/* 3. Theme Settings (Light / Dark Mode Toggle) */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl border border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-700/30">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-700 text-black dark:text-white flex items-center justify-center shadow-2xs border border-slate-200 dark:border-slate-600">
                {currentTheme === 'light' ? (
                  <Sun className="w-5 h-5 text-black dark:text-white" strokeWidth={2.5} />
                ) : (
                  <Moon className="w-5 h-5 text-black dark:text-white" strokeWidth={2.5} />
                )}
              </div>
              <div>
                <p className="text-sm font-black text-slate-900 dark:text-slate-100">Theme Settings / थीम सेटिंग</p>
                <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">{currentTheme} Mode Active</p>
              </div>
            </div>

            <div className="flex items-center bg-slate-200 dark:bg-slate-600 p-1 rounded-xl">
              <button
                onClick={() => onToggleTheme('light')}
                className={`px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all ${
                  currentTheme === 'light' ? 'bg-white text-black shadow-2xs' : 'text-slate-600 dark:text-slate-300'
                }`}
              >
                Light
              </button>
              <button
                onClick={() => onToggleTheme('dark')}
                className={`px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all ${
                  currentTheme === 'dark' ? 'bg-[#0d9488] text-white shadow-2xs' : 'text-slate-600 dark:text-slate-300'
                }`}
              >
                Dark
              </button>
            </div>
          </div>

          {/* 4. Business Profile Settings Screen */}
          <button
            onClick={onNavigateBusinessSettings}
            className="w-full flex items-center justify-between p-3.5 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-700/60 transition-colors border border-transparent hover:border-slate-200/60 active:scale-[0.99]"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-700 text-black dark:text-white flex items-center justify-center shadow-2xs border border-slate-200 dark:border-slate-600">
                <Building className="w-5 h-5 text-black dark:text-white" strokeWidth={2.5} />
              </div>
              <div className="text-left">
                <p className="text-sm font-black text-slate-900 dark:text-slate-100">Business Profile / बिजनेस प्रोफाइल</p>
                <p className="text-xs font-bold text-slate-500 dark:text-slate-400">Logo, Name, Contact, Address, & Email</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-black dark:text-slate-300" strokeWidth={2.5} />
          </button>
        </div>

        {/* Menu Section 2: Legal & Information */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-3 sm:p-4 shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-700 space-y-2">
          <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest px-3 pt-2">
            Legal & Policy
          </p>

          {/* 5. Privacy Policy Full Screen */}
          <button
            onClick={onNavigatePrivacy}
            className="w-full flex items-center justify-between p-3.5 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-700/60 transition-colors border border-transparent hover:border-slate-200/60 active:scale-[0.99]"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-700 text-black dark:text-white flex items-center justify-center shadow-2xs border border-slate-200 dark:border-slate-600">
                <ShieldCheck className="w-5 h-5 text-black dark:text-white" strokeWidth={2.5} />
              </div>
              <div className="text-left">
                <p className="text-sm font-black text-slate-900 dark:text-slate-100">Privacy Policy / प्राइवेसी पॉलिसी</p>
                <p className="text-xs font-bold text-slate-500 dark:text-slate-400">Full screen data security terms</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-black dark:text-slate-300" strokeWidth={2.5} />
          </button>

          {/* 6. Terms & Conditions Full Screen */}
          <button
            onClick={onNavigateTerms}
            className="w-full flex items-center justify-between p-3.5 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-700/60 transition-colors border border-transparent hover:border-slate-200/60 active:scale-[0.99]"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-700 text-black dark:text-white flex items-center justify-center shadow-2xs border border-slate-200 dark:border-slate-600">
                <FileText className="w-5 h-5 text-black dark:text-white" strokeWidth={2.5} />
              </div>
              <div className="text-left">
                <p className="text-sm font-black text-slate-900 dark:text-slate-100">Terms & Conditions / टर्म्स एंड कंडीशन</p>
                <p className="text-xs font-bold text-slate-500 dark:text-slate-400">Repayment schedules (Per Day, Week, Month)</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-black dark:text-slate-300" strokeWidth={2.5} />
          </button>
        </div>

        {/* 7. Sign Out Button */}
        <button
          onClick={handleSignOut}
          className="w-full bg-red-50 hover:bg-red-100/80 text-red-600 border border-red-200/80 font-black text-sm sm:text-base py-4 rounded-2xl flex items-center justify-center gap-2 shadow-xs transition-colors active:scale-95 mt-4"
        >
          <LogOut className="w-5 h-5 text-red-600" strokeWidth={2.5} />
          Sign Out of Account / लॉगआउट
        </button>

      </main>

      {/* 25 Languages Dialog Modal */}
      {activeModal === 'LANGUAGE' && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-5 max-w-md w-full space-y-4 shadow-2xl animate-in fade-in zoom-in-95 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-700 flex-shrink-0">
              <div className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-black dark:text-white" strokeWidth={2.5} />
                <h3 className="text-base font-black text-slate-900 dark:text-slate-100">Select Language (25 Languages)</h3>
              </div>
              <button onClick={() => setActiveModal(null)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" strokeWidth={2.5} />
              </button>
            </div>

            {/* Language Search */}
            <div className="relative flex-shrink-0">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" strokeWidth={2.5} />
              <input
                type="text"
                value={langSearch}
                onChange={(e) => setLangSearch(e.target.value)}
                placeholder="Search language..."
                className="w-full bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl py-2.5 pl-10 pr-4 text-xs font-bold text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#0d9488]"
              />
            </div>

            {/* 25 Languages List */}
            <div className="space-y-1.5 overflow-y-auto flex-1 pr-1">
              {filteredLanguages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => handleSelectLanguage(lang.code)}
                  className={`w-full p-3 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-between border transition-all ${
                    selectedLanguage === lang.code
                      ? 'bg-teal-50 dark:bg-teal-900/40 border-[#0d9488] text-[#0d9488] dark:text-teal-300'
                      : 'bg-slate-50 dark:bg-slate-700/50 border-slate-200/80 dark:border-slate-600/80 text-slate-800 dark:text-slate-200 hover:border-teal-300'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-7 h-7 rounded-lg bg-slate-200 dark:bg-slate-600 text-slate-800 dark:text-slate-100 flex items-center justify-center font-black text-[10px]">
                      {lang.code}
                    </span>
                    <div className="text-left">
                      <span className="block font-black">{lang.name}</span>
                      <span className="block text-[11px] text-slate-500 dark:text-slate-400 font-medium">{lang.nativeName}</span>
                    </div>
                  </div>
                  {selectedLanguage === lang.code && <CheckCircle2 className="w-5 h-5 text-[#0d9488] dark:text-teal-300" strokeWidth={2.5} />}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Loan Interest Settings Modal */}
      {activeModal === 'INTEREST' && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-700">
              <div className="flex items-center gap-2">
                <Percent className="w-5 h-5 text-black dark:text-white" strokeWidth={2.5} />
                <h3 className="text-base font-black text-slate-900 dark:text-slate-100">Default Interest Rate</h3>
              </div>
              <button onClick={() => setActiveModal(null)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" strokeWidth={2.5} />
              </button>
            </div>

            {saveMessage ? (
              <div className="p-4 bg-emerald-50 text-emerald-800 rounded-2xl text-xs font-extrabold text-center border border-emerald-200">
                {saveMessage}
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-black text-slate-700 dark:text-slate-300 uppercase mb-1">
                    Default Interest Percentage (%)
                  </label>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-2 font-medium">
                    Auto-calculates interest amount in Add Customer screen (e.g. 10% on ₹1000 = ₹100).
                  </p>
                  <input
                    type="number"
                    value={defaultInterestRate}
                    onChange={(e) => setDefaultInterestRate(Number(e.target.value))}
                    className="w-full bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-xl py-3 px-4 text-sm font-extrabold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0d9488]"
                    placeholder="e.g. 10"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveModal(null)}
                    className="flex-1 py-3 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveInterest}
                    className="flex-1 py-3 rounded-xl bg-[#0d9488] text-white font-extrabold text-xs shadow-md shadow-teal-700/20"
                  >
                    Save Rate
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

    </motion.div>
  );
}

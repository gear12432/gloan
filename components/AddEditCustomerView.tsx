'use client';

import React, { useState } from 'react';
import { 
  ArrowLeft, 
  User, 
  Phone, 
  MapPin, 
  IndianRupee, 
  Percent, 
  Calculator, 
  Camera, 
  CheckCircle2,
  Calendar
} from 'lucide-react';
import { motion } from 'motion/react';
import { Customer, RepaymentFrequency } from '@/types/finance';
import { useAuth } from '@/context/AuthContext';
import FloatingInput from './ui/FloatingInput';

interface AddEditCustomerViewProps {
  existingCustomer?: Customer | null;
  onBack: () => void;
  onSaved: () => void;
}

export default function AddEditCustomerView({
  existingCustomer,
  onBack,
  onSaved,
}: AddEditCustomerViewProps) {
  const { addCustomer, updateCustomer, userProfile } = useAuth();
  const defaultRate = userProfile?.defaultInterestRate || 0;

  const generateNewId = () => {
    const num = Math.floor(10000 + Math.random() * 90000);
    return `FG${num}`;
  };

  const [customerId, setCustomerId] = useState<string>(
    () => existingCustomer?.customerId || generateNewId()
  );
  const [customerName, setCustomerName] = useState(existingCustomer?.customerName || '');
  const [mobileNumber, setMobileNumber] = useState(existingCustomer?.mobileNumber || '');
  const [address, setAddress] = useState(existingCustomer?.address || '');
  const [loanAmount, setLoanAmount] = useState<string>(existingCustomer ? String(existingCustomer.loanAmount) : '');
  const [interestAmount, setInterestAmount] = useState<string>(existingCustomer ? String(existingCustomer.interestAmount) : '');
  const [repaymentFrequency, setRepaymentFrequency] = useState<RepaymentFrequency>(
    existingCustomer?.repaymentFrequency || 'Per Week'
  );
  const [loanTenure, setLoanTenure] = useState<string>(
    existingCustomer?.loanTenure || '1 Month'
  );
  const [profilePicture, setProfilePicture] = useState<string>(existingCustomer?.profilePicture || '');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLoanAmountChange = (val: string) => {
    setLoanAmount(val);
    const num = parseFloat(val);
    if (!isNaN(num) && num > 0 && defaultRate > 0) {
      const calcInterest = (num * defaultRate) / 100;
      setInterestAmount(String(calcInterest));
    }
  };

  // Auto-calculated Subtotal = Loan + Interest
  const numLoan = parseFloat(loanAmount) || 0;
  const numInterest = parseFloat(interestAmount) || 0;
  const subTotal = numLoan + numInterest;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setError('Image size should be less than 2MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicture(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !mobileNumber.trim() || numLoan <= 0) {
      setError('Please fill in Customer Name, Mobile Number, and valid Loan Amount.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      if (existingCustomer) {
        await updateCustomer(existingCustomer.id, {
          customerId,
          customerName: customerName.trim(),
          mobileNumber: mobileNumber.trim(),
          address: address.trim(),
          loanAmount: numLoan,
          interestAmount: numInterest,
          subTotalLoanAmount: subTotal,
          remainingAmount: Math.max(0, subTotal - (existingCustomer.totalPaid || 0)),
          profilePicture,
          repaymentFrequency,
          loanTenure,
          status: existingCustomer.status || 'PENDING',
        });
      } else {
        await addCustomer({
          customerId,
          customerName: customerName.trim(),
          mobileNumber: mobileNumber.trim(),
          address: address.trim(),
          loanAmount: numLoan,
          interestAmount: numInterest,
          subTotalLoanAmount: subTotal,
          profilePicture,
          repaymentFrequency,
          loanTenure,
          status: 'PENDING',
        });
      }
      onSaved();
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to save customer record.');
    } finally {
      setLoading(false);
    }
  };

  // Generate 1 Month to 12 Months (1 Year) tenure options
  const tenureOptions = [
    '1 Month',
    '2 Months',
    '3 Months',
    '4 Months',
    '5 Months',
    '6 Months',
    '7 Months',
    '8 Months',
    '9 Months',
    '10 Months',
    '11 Months',
    '12 Months (1 Year)'
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="min-h-screen bg-[#0d9488] flex flex-col overflow-hidden"
    >
      {/* Top Header */}
      <div className="bg-[#0d9488] text-white pt-6 pb-6 px-4 sm:px-6 flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-base sm:text-xl font-extrabold uppercase tracking-wide">
          {existingCustomer ? 'Edit Customer' : 'Add New Customer'}
        </h1>
        <div className="w-11" />
      </div>

      {/* Main Form Container - Edge-to-Edge Full Screen */}
      <main className="w-full flex-1 bg-white rounded-t-[2.5rem] p-5 sm:p-8 space-y-6 overflow-y-auto shadow-2xl">
        <div className="max-w-3xl mx-auto space-y-6">
          {error && (
            <div className="p-4 bg-red-50 text-red-600 rounded-2xl text-xs sm:text-sm font-bold border border-red-100">
              {error}
            </div>
          )}

          <form onSubmit={handleSave} className="space-y-5">
            {/* Customer ID */}
            <div className="space-y-1.5">
              <label className="block text-xs font-black text-slate-700 uppercase tracking-wider">
                Customer ID (Auto)
              </label>
              <input
                type="text"
                value={customerId}
                disabled
                className="w-full bg-slate-100 border border-slate-200 rounded-2xl px-4 py-3.5 text-sm font-bold text-slate-500 cursor-not-allowed"
              />
            </div>

            {/* Customer Name */}
            <FloatingInput
              label="Customer Full Name *"
              icon={User}
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              required
            />

            {/* Mobile Number */}
            <FloatingInput
              label="Mobile Number *"
              icon={Phone}
              type="tel"
              value={mobileNumber}
              onChange={(e) => setMobileNumber(e.target.value)}
              required
            />

            {/* Customer Address */}
            <FloatingInput
              label="Customer Address"
              icon={MapPin}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />

            {/* Loan Amount */}
            <FloatingInput
              label="Loan Amount (₹) *"
              icon={IndianRupee}
              type="number"
              value={loanAmount}
              onChange={(e) => handleLoanAmountChange(e.target.value)}
              required
            />

            {/* Total Interest Rate Amount */}
            <FloatingInput
              label="Total Interest Rate Amount (₹)"
              icon={Percent}
              type="number"
              value={interestAmount}
              onChange={(e) => setInterestAmount(e.target.value)}
            />

            {/* SUB TOTAL LOAN AMOUNT (Green Auto-Calculated Box) */}
            <div className="bg-teal-50/70 border-2 border-teal-200/80 rounded-2xl p-4 sm:p-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-[#0d9488] flex items-center justify-center text-white shadow-sm">
                  <Calculator className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs font-black text-[#0d9488] uppercase tracking-wider">
                    SUB TOTAL LOAN AMOUNT
                  </p>
                  <p className="text-xs font-medium text-slate-500">
                    Auto-calculated (Loan + Interest)
                  </p>
                </div>
              </div>
              <p className="text-xl sm:text-2xl font-black text-[#0d9488]">
                ₹{subTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </p>
            </div>

            {/* PROFILE PICTURE */}
            <div className="space-y-2 pt-1">
              <label className="block text-xs font-black text-slate-700 uppercase tracking-wider">
                PROFILE PICTURE
              </label>
              <div className="flex items-center gap-3">
                <label className="cursor-pointer inline-flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs sm:text-sm px-4 py-3 rounded-xl border border-slate-200 transition-colors">
                  <Camera className="w-4 h-4 text-[#0d9488]" />
                  Choose File
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
                <span className="text-xs sm:text-sm text-slate-500 font-semibold">
                  {profilePicture ? 'Image selected' : 'No file chosen'}
                </span>
                {profilePicture && (
                  <div className="w-11 h-11 rounded-full border-2 border-teal-300 overflow-hidden ml-auto">
                    <img src={profilePicture} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>
            </div>

            {/* REPAYMENT FREQUENCY */}
            <div className="space-y-2 pt-1">
              <label className="block text-xs font-black text-slate-700 uppercase tracking-wider">
                REPAYMENT FREQUENCY *
              </label>
              <div className="grid grid-cols-3 gap-3">
                {(['Per Day', 'Per Week', 'Per Month'] as RepaymentFrequency[]).map((freq) => (
                  <button
                    key={freq}
                    type="button"
                    onClick={() => setRepaymentFrequency(freq)}
                    className={`py-3 text-xs sm:text-sm font-extrabold rounded-2xl border-2 transition-all ${
                      repaymentFrequency === freq
                        ? 'bg-teal-50 text-[#0d9488] border-[#0d9488] ring-2 ring-[#0d9488]/15 shadow-2xs'
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {freq}
                  </button>
                ))}
              </div>
            </div>

            {/* LOAN CLOSE / TENURE DROPDOWN */}
            <div className="space-y-2 pt-1">
              <label className="block text-xs font-black text-slate-700 uppercase tracking-wider">
                LOAN CLOSE / DURATION (TENURE) *
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-4 text-[#0d9488] pointer-events-none">
                  <Calendar className="w-5 h-5" />
                </div>
                <select
                  value={loanTenure}
                  onChange={(e) => setLoanTenure(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-12 pr-4 py-3.5 text-sm font-black text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0d9488] appearance-none cursor-pointer"
                >
                  {tenureOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* SAVE BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#0d9488] hover:bg-[#0f766e] text-white font-extrabold py-4 rounded-2xl shadow-lg shadow-teal-700/20 flex items-center justify-center gap-2 transition-all active:scale-[0.99] disabled:opacity-60 text-base sm:text-lg mt-6"
            >
              <CheckCircle2 className="w-6 h-6" />
              {loading ? 'Saving Customer...' : 'Save Customer'}
            </button>
          </form>
        </div>
      </main>
    </motion.div>
  );
}

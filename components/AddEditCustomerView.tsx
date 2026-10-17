'use client';

import React, { useState } from 'react';
import { 
  ArrowLeft, 
  RotateCw, 
  User, 
  Phone, 
  MapPin, 
  IndianRupee, 
  Percent, 
  Calculator, 
  Camera, 
  CheckCircle2 
} from 'lucide-react';
import { motion } from 'motion/react';
import { Customer, RepaymentFrequency, CustomerStatus } from '@/types/finance';
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
  const { addCustomer, updateCustomer } = useAuth();

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
  const [status, setStatus] = useState<CustomerStatus>(existingCustomer?.status || 'PENDING');
  const [profilePicture, setProfilePicture] = useState<string>(existingCustomer?.profilePicture || '');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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
          status,
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
          status,
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

          <form onSubmit={handleSave} className="space-y-5 pb-8">
            {/* Customer ID with Regenerate Button */}
            <div className="relative">
              <div className="absolute right-3.5 top-3.5 z-20">
                <button
                  type="button"
                  onClick={() => setCustomerId(generateNewId())}
                  className="text-xs font-bold text-[#0d9488] hover:underline flex items-center gap-1 bg-teal-50 px-3 py-1.5 rounded-lg border border-teal-100"
                >
                  <RotateCw className="w-3.5 h-3.5" />
                  Regenerate
                </button>
              </div>
              <FloatingInput
                label="Customer ID"
                value={customerId}
                onChange={(e) => setCustomerId(e.target.value)}
                required
              />
            </div>

            {/* Customer Name */}
            <FloatingInput
              label="Customer Name"
              icon={User}
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              required
            />

            {/* Customer Mobile Number */}
            <FloatingInput
              label="Customer Mobile Number"
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
              label="Loan Amount (₹)"
              icon={IndianRupee}
              type="number"
              value={loanAmount}
              onChange={(e) => setLoanAmount(e.target.value)}
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

            {/* STATUS */}
            <div className="space-y-2 pt-1">
              <label className="block text-xs font-black text-slate-700 uppercase tracking-wider">
                STATUS
              </label>
              <button
                type="button"
                onClick={() => setStatus(status === 'PENDING' ? 'SUCCESSFUL' : 'PENDING')}
                className={`w-full py-4 px-4 rounded-2xl font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all ${
                  status === 'PENDING'
                    ? 'bg-amber-500 text-white shadow-md shadow-amber-500/20'
                    : 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                }`}
              >
                <span className="w-3 h-3 rounded-full bg-white" />
                {status === 'PENDING' ? 'Pending (Selected)' : 'Successful (Selected)'}
              </button>
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

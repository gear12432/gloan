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
      transition={{ duration: 0.25 }}
      className="min-h-screen bg-[#f3f6f9] pb-12"
    >
      {/* Top Header */}
      <div className="bg-[#0d9488] text-white py-5 px-4 sm:px-6 rounded-b-[2rem] shadow-md flex items-center justify-between">
        <button
          onClick={onBack}
          className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-base sm:text-lg font-extrabold uppercase tracking-wide">
          {existingCustomer ? 'Edit Customer' : 'Add New Customer'}
        </h1>
        <div className="w-10" />
      </div>

      {/* Main Form Container - Expanded Full Responsive Width */}
      <main className="max-w-2xl mx-auto px-4 sm:px-6 mt-5">
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl shadow-slate-200/50 border border-slate-100">
          {error && (
            <div className="mb-4 p-3.5 bg-red-50 text-red-600 rounded-xl text-xs font-semibold border border-red-100">
              {error}
            </div>
          )}

          <form onSubmit={handleSave} className="space-y-5">
            {/* Customer ID with Regenerate Button */}
            <div className="relative">
              <div className="absolute right-3 top-3.5 z-20">
                <button
                  type="button"
                  onClick={() => setCustomerId(generateNewId())}
                  className="text-xs font-bold text-[#0d9488] hover:underline flex items-center gap-1 bg-teal-50 px-2.5 py-1 rounded-lg border border-teal-100"
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
            <div className="bg-teal-50/70 border border-teal-200/80 rounded-2xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#0d9488] flex items-center justify-center text-white shadow-sm">
                  <Calculator className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[11px] font-black text-[#0d9488] uppercase tracking-wider">
                    SUB TOTAL LOAN AMOUNT
                  </p>
                  <p className="text-[11px] font-medium text-slate-500">
                    Auto-calculated (Loan + Interest)
                  </p>
                </div>
              </div>
              <p className="text-lg font-black text-[#0d9488]">
                ₹{subTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </p>
            </div>

            {/* PROFILE PICTURE */}
            <div className="space-y-1.5 pt-1">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                PROFILE PICTURE
              </label>
              <div className="flex items-center gap-3">
                <label className="cursor-pointer inline-flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 transition-colors">
                  <Camera className="w-4 h-4 text-[#0d9488]" />
                  Choose File
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
                <span className="text-xs text-slate-500 font-medium">
                  {profilePicture ? 'Image selected' : 'No file chosen'}
                </span>
                {profilePicture && (
                  <div className="w-10 h-10 rounded-full border border-teal-300 overflow-hidden ml-auto">
                    <img src={profilePicture} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>
            </div>

            {/* REPAYMENT FREQUENCY */}
            <div className="space-y-1.5 pt-1">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                REPAYMENT FREQUENCY *
              </label>
              <div className="grid grid-cols-3 gap-2.5">
                {(['Per Day', 'Per Week', 'Per Month'] as RepaymentFrequency[]).map((freq) => (
                  <button
                    key={freq}
                    type="button"
                    onClick={() => setRepaymentFrequency(freq)}
                    className={`py-3 text-xs sm:text-sm font-bold rounded-xl border transition-all ${
                      repaymentFrequency === freq
                        ? 'bg-teal-50 text-[#0d9488] border-[#0d9488] ring-2 ring-[#0d9488]/20 shadow-2xs'
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {freq}
                  </button>
                ))}
              </div>
            </div>

            {/* STATUS */}
            <div className="space-y-1.5 pt-1">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                STATUS
              </label>
              <button
                type="button"
                onClick={() => setStatus(status === 'PENDING' ? 'SUCCESSFUL' : 'PENDING')}
                className={`w-full py-3.5 px-4 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all ${
                  status === 'PENDING'
                    ? 'bg-amber-500 text-white shadow-md shadow-amber-500/20'
                    : 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                }`}
              >
                <span className="w-2.5 h-2.5 rounded-full bg-white" />
                {status === 'PENDING' ? 'Pending (Selected)' : 'Successful (Selected)'}
              </button>
            </div>

            {/* SAVE BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#0d9488] hover:bg-[#0f766e] text-white font-extrabold py-3.5 sm:py-4 rounded-2xl shadow-lg shadow-teal-700/20 flex items-center justify-center gap-2 transition-all active:scale-[0.99] disabled:opacity-60 text-sm sm:text-base mt-4"
            >
              <CheckCircle2 className="w-5 h-5" />
              {loading ? 'Saving Customer...' : 'Save Customer'}
            </button>
          </form>
        </div>
      </main>
    </motion.div>
  );
}

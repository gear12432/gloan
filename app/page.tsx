'use client';

import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import SignInView from '@/components/SignInView';
import SignUpView from '@/components/SignUpView';
import DashboardView from '@/components/DashboardView';
import AddEditCustomerView from '@/components/AddEditCustomerView';
import CustomerDetailsView from '@/components/CustomerDetailsView';
import TransactionLedgerView from '@/components/TransactionLedgerView';
import NotificationModal from '@/components/NotificationModal';
import ProfileView from '@/components/ProfileView';
import ProfileModal from '@/components/ProfileModal';
import { Customer, ActiveScreen } from '@/types/finance';

function MainApp() {
  const { user, loading, customers, transactions, addCustomer, recordPayment } = useAuth();

  const [authMode, setAuthMode] = useState<'SIGN_IN' | 'SIGN_UP'>('SIGN_IN');
  const [activeScreen, setActiveScreen] = useState<ActiveScreen>('DASHBOARD');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  // Modals
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Auto seed demo customers if new account with 0 customers
  useEffect(() => {
    if (!user || loading) return;

    const seedKey = `sf_seeded_${user.uid}`;
    if (localStorage.getItem(seedKey)) return;

    if (customers.length === 0) {
      localStorage.setItem(seedKey, 'true');
      const seedData = async () => {
        try {
          const cust1Id = await addCustomer({
            customerId: 'FG16028',
            customerName: 'Bxjcg',
            mobileNumber: '9999999999',
            address: 'Ghfi... street',
            loanAmount: 12000,
            interestAmount: 0,
            subTotalLoanAmount: 12000,
            repaymentFrequency: 'Per Week',
            status: 'PENDING',
            profilePicture: '',
          });

          await addCustomer({
            customerId: 'FG43396',
            customerName: 'Aaaaa',
            mobileNumber: '9999999999',
            address: 'Main city',
            loanAmount: 6100,
            interestAmount: 0,
            subTotalLoanAmount: 6100,
            repaymentFrequency: 'Per Day',
            status: 'PENDING',
            profilePicture: '',
          });

          // Add initial transaction payment for Bxjcg
          await recordPayment(
            {
              id: cust1Id,
              customerId: 'FG16028',
              customerName: 'Bxjcg',
              mobileNumber: '9999999999',
              loanAmount: 12000,
              interestAmount: 0,
              subTotalLoanAmount: 12000,
              totalPaid: 0,
              remainingAmount: 12000,
              repaymentFrequency: 'Per Week',
              status: 'PENDING',
              userId: user.uid,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
            3000,
            'Payment received (₹3000)'
          );
        } catch (err) {
          console.error('Error seeding initial records:', err);
        }
      };
      seedData();
    } else {
      localStorage.setItem(seedKey, 'true');
    }
  }, [user, customers.length, loading, addCustomer, recordPayment]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f3f6f9] flex flex-col items-center justify-center p-4">
        <div className="w-12 h-12 border-4 border-[#0d9488] border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-sm font-bold text-slate-700">Loading Small Finance Console...</p>
      </div>
    );
  }

  // If not signed in, show Auth screens
  if (!user) {
    if (authMode === 'SIGN_UP') {
      return (
        <SignUpView
          onNavigateSignIn={() => setAuthMode('SIGN_IN')}
        />
      );
    }
    return (
      <SignInView
        onNavigateSignUp={() => setAuthMode('SIGN_UP')}
        onForgotPassword={() => alert('Password reset link sent to your email.')}
      />
    );
  }

  // Active Customer selection synchronization
  const currentCustomer = selectedCustomer
    ? customers.find((c) => c.id === selectedCustomer.id) || selectedCustomer
    : null;

  return (
    <div className="min-h-screen bg-[#f3f6f9] font-sans antialiased selection:bg-[#0d9488] selection:text-white">
      {/* Screen Router */}
      {activeScreen === 'DASHBOARD' && (
        <DashboardView
          customers={customers}
          onAddCustomer={() => {
            setSelectedCustomer(null);
            setActiveScreen('ADD_CUSTOMER');
          }}
          onSelectCustomer={(cust) => {
            setSelectedCustomer(cust);
            setActiveScreen('CUSTOMER_DETAILS');
          }}
          onOpenNotifications={() => setIsNotificationOpen(true)}
          onOpenProfileModal={() => setActiveScreen('PROFILE')}
        />
      )}

      {activeScreen === 'PROFILE' && (
        <ProfileView
          onBack={() => setActiveScreen('DASHBOARD')}
        />
      )}

      {activeScreen === 'ADD_CUSTOMER' && (
        <AddEditCustomerView
          existingCustomer={null}
          onBack={() => setActiveScreen('DASHBOARD')}
          onSaved={() => setActiveScreen('DASHBOARD')}
        />
      )}

      {activeScreen === 'EDIT_CUSTOMER' && currentCustomer && (
        <AddEditCustomerView
          existingCustomer={currentCustomer}
          onBack={() => setActiveScreen('CUSTOMER_DETAILS')}
          onSaved={() => setActiveScreen('CUSTOMER_DETAILS')}
        />
      )}

      {activeScreen === 'CUSTOMER_DETAILS' && currentCustomer && (
        <CustomerDetailsView
          customer={currentCustomer}
          onBack={() => {
            setSelectedCustomer(null);
            setActiveScreen('DASHBOARD');
          }}
          onEdit={() => setActiveScreen('EDIT_CUSTOMER')}
          onOpenLedger={() => setActiveScreen('TRANSACTION_LEDGER')}
        />
      )}

      {activeScreen === 'TRANSACTION_LEDGER' && currentCustomer && (
        <TransactionLedgerView
          customer={currentCustomer}
          transactions={transactions}
          userProfile={null}
          onBack={() => setActiveScreen('CUSTOMER_DETAILS')}
        />
      )}

      {/* Global Modals */}
      <NotificationModal
        isOpen={isNotificationOpen}
        onClose={() => setIsNotificationOpen(false)}
      />

      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
      />
    </div>
  );
}

export default function Home() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}

'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  User as FirebaseUser,
  signInAnonymously
} from 'firebase/auth';
import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  onSnapshot, 
  query, 
  where, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  serverTimestamp 
} from 'firebase/firestore';
import { auth, db, testFirebaseConnection } from '@/lib/firebase';
import { handleFirestoreError, OperationType } from '@/lib/error-handler';
import { Customer, Transaction, UserProfile, RepaymentFrequency, CustomerStatus } from '@/types/finance';
import { getTranslation } from '@/lib/translations';

interface AuthContextType {
  user: FirebaseUser | null;
  userProfile: UserProfile | null;
  loading: boolean;
  customers: Customer[];
  transactions: Transaction[];
  signIn: (email: string, pass: string) => Promise<void>;
  signUp: (email: string, pass: string, fullName: string, businessName: string, mobileNumber: string) => Promise<void>;
  demoLogin: () => Promise<void>;
  signOutUser: () => Promise<void>;
  addCustomer: (data: Omit<Customer, 'id' | 'totalPaid' | 'remainingAmount' | 'userId' | 'createdAt' | 'updatedAt'>) => Promise<string>;
  updateCustomer: (id: string, data: Partial<Customer>) => Promise<void>;
  deleteCustomer: (id: string) => Promise<void>;
  recordPayment: (customer: Customer, amount: number, description: string) => Promise<void>;
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
  updateProfileName: (businessName: string, fullName: string) => Promise<void>;
  t: (key: string) => string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    testFirebaseConnection();
  }, []);

  useEffect(() => {
    // Safety fallback: Ensure loading becomes false after max 1.5s so screen always renders
    const fallbackTimer = setTimeout(() => {
      setLoading(false);
    }, 1500);

    const unsubscribeAuth = onAuthStateChanged(auth, async (currentUser) => {
      clearTimeout(fallbackTimer);
      setUser(currentUser);
      if (currentUser) {
        // Fetch or create profile
        const userDocRef = doc(db, 'users', currentUser.uid);
        try {
          const docSnap = await getDoc(userDocRef);
          if (docSnap.exists()) {
            setUserProfile(docSnap.data() as UserProfile);
          } else {
            const newProfile: UserProfile = {
              uid: currentUser.uid,
              fullName: currentUser.displayName || 'KH Loan Owner',
              businessName: 'KH LOAN',
              mobileNumber: '+91 98765 43210',
              email: currentUser.email || 'user@business.com',
              theme: 'light',
              language: 'EN',
              createdAt: new Date().toISOString()
            };
            await setDoc(userDocRef, newProfile);
            setUserProfile(newProfile);
          }
        } catch (err) {
          console.error("Error fetching user profile:", err);
          setUserProfile({
            uid: currentUser.uid,
            fullName: 'KH Loan Owner',
            businessName: 'KH LOAN',
            mobileNumber: '+91 98765 43210',
            email: currentUser.email || 'user@business.com',
            theme: 'light',
            language: 'EN',
            createdAt: new Date().toISOString()
          });
        }
      } else {
        setUserProfile(null);
        setCustomers([]);
        setTransactions([]);
      }
      setLoading(false);
    });

    return () => {
      clearTimeout(fallbackTimer);
      unsubscribeAuth();
    };
  }, []);

  // Realtime subscribe to customers and transactions
  useEffect(() => {
    if (!user) return;

    const customersPath = 'customers';
    const custQuery = query(
      collection(db, customersPath),
      where('userId', '==', user.uid)
    );

    const unsubscribeCustomers = onSnapshot(
      custQuery,
      (snapshot) => {
        const custsMap = new Map<string, Customer>();
        snapshot.forEach((doc) => {
          const data = { id: doc.id, ...doc.data() } as Customer;
          // Deduplicate by customerId or doc id
          const key = data.customerId || doc.id;
          if (!custsMap.has(key)) {
            custsMap.set(key, data);
          }
        });
        const custs = Array.from(custsMap.values());
        // Sort by createdAt desc
        custs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setCustomers(custs);
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, customersPath);
      }
    );

    const transactionsPath = 'transactions';
    const transQuery = query(
      collection(db, transactionsPath),
      where('userId', '==', user.uid)
    );

    const unsubscribeTransactions = onSnapshot(
      transQuery,
      (snapshot) => {
        const txs: Transaction[] = [];
        snapshot.forEach((doc) => {
          txs.push({ id: doc.id, ...doc.data() } as Transaction);
        });
        txs.sort((a, b) => b.timestamp - a.timestamp);
        setTransactions(txs);
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, transactionsPath);
      }
    );

    return () => {
      unsubscribeCustomers();
      unsubscribeTransactions();
    };
  }, [user]);

  const signIn = async (email: string, pass: string) => {
    await signInWithEmailAndPassword(auth, email, pass);
  };

  const signUp = async (email: string, pass: string, fullName: string, businessName: string, mobileNumber: string) => {
    const cred = await createUserWithEmailAndPassword(auth, email, pass);
    const newProfile: UserProfile = {
      uid: cred.user.uid,
      fullName,
      businessName,
      mobileNumber,
      email,
      createdAt: new Date().toISOString()
    };
    await setDoc(doc(db, 'users', cred.user.uid), newProfile);
    setUserProfile(newProfile);
  };

  const demoLogin = async () => {
    // Demo login as demo account or anonymous auth
    let cred;
    try {
      cred = await signInWithEmailAndPassword(auth, 'demo@smallfinance.com', 'demo123456');
    } catch {
      try {
        cred = await createUserWithEmailAndPassword(auth, 'demo@smallfinance.com', 'demo123456');
      } catch {
        cred = await signInAnonymously(auth);
      }
    }
    if (cred.user) {
      const userDocRef = doc(db, 'users', cred.user.uid);
      const docSnap = await getDoc(userDocRef);
      if (!docSnap.exists()) {
        const newProfile: UserProfile = {
          uid: cred.user.uid,
          fullName: 'Gear Owner',
          businessName: 'KH LOAN',
          mobileNumber: '+91 99999 99999',
          email: cred.user.email || 'demo@smallfinance.com',
          createdAt: new Date().toISOString()
        };
        await setDoc(userDocRef, newProfile);
        setUserProfile(newProfile);
      }
    }
  };

  const signOutUser = async () => {
    await signOut(auth);
  };

  const addCustomer = async (data: Omit<Customer, 'id' | 'totalPaid' | 'remainingAmount' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    if (!user) throw new Error('Not authenticated');
    const path = 'customers';
    try {
      const now = new Date().toISOString();
      const subTotal = Number(data.loanAmount) + Number(data.interestAmount || 0);
      const newCust = {
        ...data,
        loanAmount: Number(data.loanAmount),
        interestAmount: Number(data.interestAmount || 0),
        subTotalLoanAmount: subTotal,
        totalPaid: 0,
        remainingAmount: subTotal,
        userId: user.uid,
        createdAt: now,
        updatedAt: now,
      };
      const docRef = await addDoc(collection(db, path), newCust);
      return docRef.id;
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, path);
      throw error;
    }
  };

  const updateCustomer = async (id: string, data: Partial<Customer>) => {
    if (!user) throw new Error('Not authenticated');
    const path = `customers/${id}`;
    try {
      const custRef = doc(db, 'customers', id);
      const updatePayload = {
        ...data,
        updatedAt: new Date().toISOString()
      };
      await updateDoc(custRef, updatePayload);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, path);
    }
  };

  const deleteCustomer = async (id: string) => {
    if (!user) throw new Error('Not authenticated');
    const path = `customers/${id}`;
    try {
      await deleteDoc(doc(db, 'customers', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, path);
    }
  };

  const recordPayment = async (customer: Customer, amount: number, description: string) => {
    if (!user) throw new Error('Not authenticated');
    const transPath = 'transactions';
    const custPath = `customers/${customer.id}`;

    try {
      const newTotalPaid = (customer.totalPaid || 0) + amount;
      const newRemaining = Math.max(0, customer.subTotalLoanAmount - newTotalPaid);
      const newStatus: CustomerStatus = 'SUCCESSFUL';

      // 1. Add transaction record
      const dateStr = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
      const invNum = Math.floor(100000 + Math.random() * 900000);
      const newTx: Omit<Transaction, 'id'> = {
        customerId: customer.customerId,
        customerDocId: customer.id,
        customerName: customer.customerName,
        invoiceId: `INV-${invNum}`,
        amount: amount,
        type: 'Payment',
        description: description || `Payment received (₹${amount})`,
        date: dateStr,
        timestamp: Date.now(),
        userId: user.uid,
        status: newStatus
      };

      await addDoc(collection(db, transPath), newTx);

      // 2. Update customer record
      await updateDoc(doc(db, 'customers', customer.id), {
        totalPaid: newTotalPaid,
        remainingAmount: newRemaining,
        status: newStatus,
        updatedAt: new Date().toISOString()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, transPath);
    }
  };

  const updateProfile = async (data: Partial<UserProfile>) => {
    if (!user) return;
    const userDocRef = doc(db, 'users', user.uid);
    await updateDoc(userDocRef, data);
    setUserProfile(prev => prev ? { ...prev, ...data } : null);
  };

  const updateProfileName = async (businessName: string, fullName: string) => {
    await updateProfile({ businessName, fullName });
  };

  const t = (key: string): string => {
    const lang = userProfile?.language || 'EN';
    return getTranslation(lang, key);
  };

  return (
    <AuthContext.Provider value={{
      user,
      userProfile,
      loading,
      customers,
      transactions,
      signIn,
      signUp,
      demoLogin,
      signOutUser,
      addCustomer,
      updateCustomer,
      deleteCustomer,
      recordPayment,
      updateProfile,
      updateProfileName,
      t
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export type RepaymentFrequency = 'Per Day' | 'Per Week' | 'Per Month';
export type CustomerStatus = 'PENDING' | 'SUCCESSFUL';

export interface Customer {
  id: string; // Firestore Doc ID
  customerId: string; // e.g., "FG21363"
  customerName: string;
  mobileNumber: string;
  address?: string;
  loanAmount: number;
  interestAmount: number;
  subTotalLoanAmount: number;
  totalPaid: number;
  remainingAmount: number;
  profilePicture?: string;
  repaymentFrequency: RepaymentFrequency;
  loanTenure?: string;
  installmentAmount?: number;
  status: CustomerStatus;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Transaction {
  id: string; // Firestore Doc ID
  customerId: string; // e.g., "FG16028"
  customerDocId: string;
  customerName: string;
  invoiceId: string; // e.g., "INV-798973"
  amount: number;
  type: 'Payment' | 'Charge';
  description: string;
  date: string; // e.g., "2026-10-17"
  timestamp: number;
  userId: string;
  status: CustomerStatus;
}

export interface UserProfile {
  uid: string;
  fullName: string;
  businessName: string;
  mobileNumber: string;
  businessAddress?: string;
  businessEmail?: string;
  profileImageUrl?: string;
  email: string;
  defaultInterestRate?: number;
  language?: string;
  theme?: 'light' | 'dark';
  createdAt: string;
}

export type ActiveScreen = 
  | 'AUTH'
  | 'DASHBOARD'
  | 'ADD_CUSTOMER'
  | 'EDIT_CUSTOMER'
  | 'CUSTOMER_DETAILS'
  | 'TRANSACTION_LEDGER'
  | 'PROFILE'
  | 'INTEREST_RATE'
  | 'PRIVACY_POLICY'
  | 'TERMS_CONDITIONS'
  | 'ABOUT_APP'
  | 'HELP_SUPPORT';

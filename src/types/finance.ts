
export interface CreditProfile {
  score: number;
  riskLevel: 'low' | 'medium' | 'high';
  paymentCapacity: number;
  recommendedLimit: number;
  lastUpdated: string;
}

export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
}

export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  message: string;
  read: boolean;
  createdAt: string;
}

export interface OpenFinanceConsent {
  id: string;
  scope: string[];
  validUntil: string;
  authorizedAt: string | null;
  status: 'pending' | 'authorized' | 'expired' | 'revoked';
}

export interface CreditOffer {
  id: string;
  institutionId: string;
  institutionName: string;
  institutionLogo?: string;
  amount: number;
  minAmount: number;
  maxAmount: number;
  interestRate: number;
  minInstallments: number;
  maxInstallments: number;
  minScore: number;
  compatibility: number;
  description: string;
  requirementsDescription: string;
}

export interface CreditContract {
  id: string;
  offerId: string;
  userId: string;
  amount: number;
  interestRate: number;
  installments: number;
  monthlyPayment: number;
  totalPayment: number;
  contractDate: string;
  status: 'pending' | 'approved' | 'rejected' | 'active' | 'completed';
}

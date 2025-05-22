
import React, { createContext, useContext, useState } from 'react';
import { 
  CreditProfile, 
  Transaction,
  Notification,
  OpenFinanceConsent,
  CreditOffer
} from '@/types/finance';
import { useAuth } from './AuthContext';

// Dados simulados
const mockTransactions: Transaction[] = [
  {
    id: '1',
    date: '2023-05-22',
    description: 'Salário',
    amount: 5000,
    type: 'income',
    category: 'Receita'
  },
  {
    id: '2',
    date: '2023-05-20',
    description: 'Supermercado',
    amount: 350.75,
    type: 'expense',
    category: 'Alimentação'
  },
  {
    id: '3',
    date: '2023-05-18',
    description: 'Aluguel',
    amount: 1200,
    type: 'expense',
    category: 'Moradia'
  },
  {
    id: '4',
    date: '2023-05-15',
    description: 'Freelance',
    amount: 750,
    type: 'income',
    category: 'Receita'
  },
  {
    id: '5',
    date: '2023-05-10',
    description: 'Conta de Luz',
    amount: 120,
    type: 'expense',
    category: 'Utilidades'
  }
];

const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'info',
    message: 'Nova proposta disponível',
    read: false,
    createdAt: '2023-05-21T10:30:00'
  },
  {
    id: '2',
    type: 'success',
    message: 'Análise de perfil concluída',
    read: false,
    createdAt: '2023-05-20T15:20:00'
  }
];

const mockCreditProfile: CreditProfile = {
  score: 720,
  riskLevel: 'medium',
  paymentCapacity: 1800,
  recommendedLimit: 10000,
  lastUpdated: '2023-05-15'
};

const mockConsent: OpenFinanceConsent = {
  id: 'consent-123',
  scope: [
    'ACCOUNTS_READ',
    'CREDIT_CARD_ACCOUNTS_READ',
    'CREDIT_OPERATIONS_READ',
    'INVESTMENTS_READ',
    'LOANS_READ'
  ],
  validUntil: '2023-11-22',
  authorizedAt: null,
  status: 'pending'
};

const mockCreditOffers: CreditOffer[] = [
  {
    id: '1',
    institutionId: 'bank-1',
    institutionName: 'Banco Alpha',
    institutionLogo: '/placeholders/bank-alpha.png',
    amount: 15000,
    minAmount: 5000,
    maxAmount: 20000,
    interestRate: 0.028,
    minInstallments: 12,
    maxInstallments: 48,
    minScore: 600,
    compatibility: 0.85,
    description: 'Crédito pessoal com taxa competitiva para clientes com bom histórico financeiro.',
    requirementsDescription: 'Score mínimo de 600 pontos. Renda mínima comprovada de R$ 2.500.'
  },
  {
    id: '2',
    institutionId: 'bank-2',
    institutionName: 'Financeira Beta',
    institutionLogo: '/placeholders/bank-beta.png',
    amount: 8000,
    minAmount: 3000,
    maxAmount: 10000,
    interestRate: 0.035,
    minInstallments: 6,
    maxInstallments: 24,
    minScore: 550,
    compatibility: 0.7,
    description: 'Empréstimo pessoal para necessidades imediatas com aprovação rápida.',
    requirementsDescription: 'Score mínimo de 550 pontos. Sem restrições no CPF.'
  },
  {
    id: '3',
    institutionId: 'bank-3',
    institutionName: 'Cooperativa Gama',
    institutionLogo: '/placeholders/bank-gamma.png',
    amount: 25000,
    minAmount: 10000,
    maxAmount: 30000,
    interestRate: 0.023,
    minInstallments: 24,
    maxInstallments: 60,
    minScore: 720,
    compatibility: 0.9,
    description: 'Crédito com as melhores taxas do mercado para associados.',
    requirementsDescription: 'Score mínimo de 720 pontos. Associação à cooperativa.'
  }
];

// Tipos do contexto
interface FinanceContextType {
  creditProfile: CreditProfile | null;
  transactions: Transaction[];
  notifications: Notification[];
  unreadNotificationsCount: number;
  consent: OpenFinanceConsent | null;
  creditOffers: CreditOffer[];
  filteredOffers: CreditOffer[];
  isLoading: boolean;
  error: string | null;
  
  // Ações
  authorizeConsent: () => Promise<void>;
  simulateAnalysis: () => Promise<void>;
  markNotificationAsRead: (id: string) => void;
  filterOffers: (filters: OfferFilters) => void;
}

interface OfferFilters {
  minAmount?: number;
  maxAmount?: number;
  maxInterestRate?: number;
  minInstallments?: number;
  maxInstallments?: number;
  minScore?: number;
}

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

export const FinanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [creditProfile, setCreditProfile] = useState<CreditProfile | null>(
    isAuthenticated ? mockCreditProfile : null
  );
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions);
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [consent, setConsent] = useState<OpenFinanceConsent | null>(mockConsent);
  const [creditOffers, setCreditOffers] = useState<CreditOffer[]>(mockCreditOffers);
  const [filteredOffers, setFilteredOffers] = useState<CreditOffer[]>(mockCreditOffers);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const unreadNotificationsCount = notifications.filter(n => !n.read).length;

  const authorizeConsent = async (): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      // Simula uma chamada de API
      await new Promise(resolve => setTimeout(resolve, 2000));

      setConsent({
        ...consent!,
        authorizedAt: new Date().toISOString(),
        status: 'authorized'
      });

      // Adiciona notificação
      const newNotification: Notification = {
        id: `notification-${Date.now()}`,
        type: 'success',
        message: 'Acesso aos dados autorizado com sucesso',
        read: false,
        createdAt: new Date().toISOString()
      };

      setNotifications([newNotification, ...notifications]);
    } catch (error) {
      setError('Erro ao autorizar consentimento');
    } finally {
      setIsLoading(false);
    }
  };

  const simulateAnalysis = async (): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      // Simula uma chamada de API
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Atualiza o perfil de crédito com dados simulados
      const newScore = Math.floor(Math.random() * (850 - 500) + 500);
      let riskLevel: 'low' | 'medium' | 'high' = 'medium';
      
      if (newScore < 600) riskLevel = 'high';
      else if (newScore > 750) riskLevel = 'low';

      const newProfile: CreditProfile = {
        score: newScore,
        riskLevel,
        paymentCapacity: Math.floor(Math.random() * (3000 - 800) + 800),
        recommendedLimit: newScore * 20,
        lastUpdated: new Date().toISOString().split('T')[0]
      };

      setCreditProfile(newProfile);

      // Adiciona notificação
      const newNotification: Notification = {
        id: `notification-${Date.now()}`,
        type: 'info',
        message: 'Análise de perfil financeiro concluída',
        read: false,
        createdAt: new Date().toISOString()
      };

      setNotifications([newNotification, ...notifications]);

      // Atualiza as ofertas com base no novo perfil
      filterOffersByProfile(newProfile, creditOffers);

    } catch (error) {
      setError('Erro ao realizar análise');
    } finally {
      setIsLoading(false);
    }
  };

  const filterOffersByProfile = (profile: CreditProfile, offers: CreditOffer[]) => {
    const compatibleOffers = offers.map(offer => ({
      ...offer,
      compatibility: calculateCompatibility(profile, offer)
    })).filter(offer => offer.minScore <= profile.score);

    // Ordena por compatibilidade
    compatibleOffers.sort((a, b) => b.compatibility - a.compatibility);
    
    setFilteredOffers(compatibleOffers);
  };

  const calculateCompatibility = (profile: CreditProfile, offer: CreditOffer): number => {
    // Algoritmo simples de compatibilidade
    const scoreFactor = Math.min(1, profile.score / offer.minScore);
    const amountFactor = Math.min(1, profile.recommendedLimit / offer.maxAmount);
    
    return (scoreFactor * 0.7) + (amountFactor * 0.3);
  };

  const markNotificationAsRead = (id: string): void => {
    setNotifications(
      notifications.map(n => 
        n.id === id ? { ...n, read: true } : n
      )
    );
  };

  const filterOffers = (filters: OfferFilters): void => {
    let filtered = creditOffers;

    if (filters.minAmount) {
      filtered = filtered.filter(offer => offer.maxAmount >= filters.minAmount!);
    }
    
    if (filters.maxAmount) {
      filtered = filtered.filter(offer => offer.minAmount <= filters.maxAmount!);
    }
    
    if (filters.maxInterestRate) {
      filtered = filtered.filter(offer => offer.interestRate <= filters.maxInterestRate!);
    }
    
    if (filters.minInstallments) {
      filtered = filtered.filter(offer => offer.maxInstallments >= filters.minInstallments!);
    }
    
    if (filters.maxInstallments) {
      filtered = filtered.filter(offer => offer.minInstallments <= filters.maxInstallments!);
    }
    
    if (filters.minScore && creditProfile) {
      filtered = filtered.filter(offer => offer.minScore <= creditProfile.score);
    }

    setFilteredOffers(filtered);
  };

  return (
    <FinanceContext.Provider
      value={{
        creditProfile,
        transactions,
        notifications,
        unreadNotificationsCount,
        consent,
        creditOffers,
        filteredOffers,
        isLoading,
        error,
        authorizeConsent,
        simulateAnalysis,
        markNotificationAsRead,
        filterOffers
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
};

export const useFinance = (): FinanceContextType => {
  const context = useContext(FinanceContext);
  if (context === undefined) {
    throw new Error('useFinance deve ser usado dentro de um FinanceProvider');
  }
  return context;
};

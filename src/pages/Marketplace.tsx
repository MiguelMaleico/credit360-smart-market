
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useFinance } from '@/contexts/FinanceContext';
import { Layout } from '@/components/layout/Layout';
import { CreditOfferCard } from '@/components/offers/CreditOfferCard';
import { OffersFilter } from '@/components/offers/OffersFilter';

const Marketplace: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const { 
    filteredOffers, 
    creditProfile,
    consent,
    filterOffers
  } = useFinance();

  // Redirecionar se não estiver autenticado ou for uma instituição parceira
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (user?.role !== 'user') {
    return <Navigate to="/dashboard" />;
  }

  // Redirecionar se o usuário não realizou a análise de perfil
  if (!creditProfile) {
    return <Navigate to="/simulation" />;
  }

  // Redirecionar se o usuário não autorizou o compartilhamento de dados
  if (consent?.status !== 'authorized') {
    return <Navigate to="/authorize" />;
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Marketplace de Crédito</h1>
          <p className="text-muted-foreground mt-1">
            Ofertas personalizadas baseadas no seu perfil financeiro
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-1">
            <OffersFilter onApplyFilters={filterOffers} />
          </div>
          
          <div className="md:col-span-3">
            {filteredOffers.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredOffers.map((offer) => (
                  <CreditOfferCard key={offer.id} offer={offer} />
                ))}
              </div>
            ) : (
              <div className="bg-muted p-8 rounded-lg text-center">
                <h3 className="text-lg font-medium">Nenhuma oferta encontrada</h3>
                <p className="text-muted-foreground mt-2">
                  Tente ajustar os filtros para encontrar mais opções.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Marketplace;

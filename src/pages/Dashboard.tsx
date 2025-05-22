
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useFinance } from '@/contexts/FinanceContext';
import { Layout } from '@/components/layout/Layout';
import { CreditScoreCard } from '@/components/dashboard/CreditScoreCard';
import { TransactionsList } from '@/components/dashboard/TransactionsList';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Check, LockKeyhole, Brain } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const { 
    creditProfile,
    transactions,
    consent,
    filteredOffers,
  } = useFinance();

  // Redirecionar se não estiver autenticado
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight">
            Olá, {user?.name}
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            {creditProfile ? (
              <CreditScoreCard profile={creditProfile} />
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Seu Perfil de Crédito</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center justify-center py-8 space-y-4">
                    <p className="text-center text-muted-foreground">
                      Você ainda não realizou a análise do seu perfil de crédito.
                    </p>
                    {consent?.status === 'authorized' ? (
                      <Button asChild>
                        <Link to="/simulation">
                          <Brain className="mr-2 h-4 w-4" /> Simular Análise
                        </Link>
                      </Button>
                    ) : (
                      <Button asChild>
                        <Link to="/authorize">
                          <LockKeyhole className="mr-2 h-4 w-4" /> Autorizar Acesso
                        </Link>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
            <TransactionsList transactions={transactions} />
          </div>
          
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Autorização Open Finance</span>
                  <span className={`text-sm font-medium px-2 py-1 rounded-full ${
                    consent?.status === 'authorized' ? 'bg-success-100 text-success-700' : 'bg-muted text-muted-foreground'
                  }`}>
                    {consent?.status === 'authorized' ? (
                      <span className="flex items-center">
                        <Check className="h-3 w-3 mr-1" /> Autorizado
                      </span>
                    ) : 'Pendente'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Análise de Perfil</span>
                  <span className={`text-sm font-medium px-2 py-1 rounded-full ${
                    creditProfile ? 'bg-success-100 text-success-700' : 'bg-muted text-muted-foreground'
                  }`}>
                    {creditProfile ? (
                      <span className="flex items-center">
                        <Check className="h-3 w-3 mr-1" /> Realizada
                      </span>
                    ) : 'Pendente'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Ofertas Disponíveis</span>
                  <span className="text-sm font-medium">
                    {filteredOffers.length}
                  </span>
                </div>
              </CardContent>
            </Card>
            
            {user?.role === 'user' && (
              <Card>
                <CardHeader>
                  <CardTitle>Próximos Passos</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {!consent || consent.status !== 'authorized' ? (
                    <Button variant="outline" className="w-full justify-between" asChild>
                      <Link to="/authorize">
                        Autorizar acesso aos dados
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  ) : !creditProfile ? (
                    <Button variant="outline" className="w-full justify-between" asChild>
                      <Link to="/simulation">
                        Simular análise de perfil
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  ) : (
                    <Button variant="outline" className="w-full justify-between" asChild>
                      <Link to="/marketplace">
                        Ver ofertas de crédito
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  )}
                </CardContent>
              </Card>
            )}

            {user?.role === 'partner' && (
              <Card>
                <CardHeader>
                  <CardTitle>Ações</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button variant="outline" className="w-full justify-between" asChild>
                    <Link to="/partner">
                      Gerenciar ofertas
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;

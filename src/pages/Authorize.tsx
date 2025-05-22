
import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useFinance } from '@/contexts/FinanceContext';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { CheckIcon, LockKeyhole } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const Authorize: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const { consent, authorizeConsent, isLoading } = useFinance();
  const [showSuccess, setShowSuccess] = useState(false);

  // Redirecionar se não estiver autenticado ou for uma instituição parceira
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (user?.role !== 'user') {
    return <Navigate to="/dashboard" />;
  }

  const handleAuthorize = async () => {
    await authorizeConsent();
    setShowSuccess(true);
  };

  // Formata a data para exibição
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Autorização de Compartilhamento de Dados</h1>
          <p className="text-muted-foreground mt-1">
            Autorize o acesso aos seus dados financeiros para que possamos analisar seu perfil de crédito.
          </p>
        </div>

        {showSuccess && (
          <Alert className="bg-success-50 text-success-900 border-success-200">
            <CheckIcon className="h-4 w-4 stroke-success-500" />
            <AlertTitle>Autorização realizada com sucesso!</AlertTitle>
            <AlertDescription>
              Seus dados foram autorizados para compartilhamento. Agora você pode prosseguir para a simulação do seu perfil.
            </AlertDescription>
          </Alert>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LockKeyhole className="h-5 w-5" /> Compartilhamento de Dados Open Finance
            </CardTitle>
            <CardDescription>
              Ao autorizar, você permite que acessemos seus dados financeiros para avaliação de crédito.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium">Dados que serão compartilhados:</h3>
                <ul className="mt-2 space-y-2 text-sm">
                  {consent?.scope.map((item) => (
                    <li key={item} className="flex items-start">
                      <div className="mr-2 mt-1 h-1.5 w-1.5 rounded-full bg-primary"></div>
                      <div>
                        {item === 'ACCOUNTS_READ' && 'Informações de contas bancárias (saldo, movimentações)'}
                        {item === 'CREDIT_CARD_ACCOUNTS_READ' && 'Informações de cartões de crédito (limite, fatura)'}
                        {item === 'CREDIT_OPERATIONS_READ' && 'Operações de crédito ativas (empréstimos, financiamentos)'}
                        {item === 'INVESTMENTS_READ' && 'Informações de investimentos (aplicações, rendimentos)'}
                        {item === 'LOANS_READ' && 'Informações de empréstimos (valor, parcelas, taxa)'}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-medium">Período de consentimento:</h3>
                <p className="mt-2 text-sm">
                  Válido até: <span className="font-medium">{formatDate(consent?.validUntil || '')}</span>
                </p>
              </div>

              <div className="bg-muted p-4 rounded-md">
                <h3 className="text-sm font-medium">Importante:</h3>
                <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
                  <li>• Você pode revogar este consentimento a qualquer momento.</li>
                  <li>• Seus dados serão protegidos de acordo com a Lei Geral de Proteção de Dados.</li>
                  <li>• Esta autorização é necessária para avaliarmos sua elegibilidade para ofertas de crédito.</li>
                  <li>• Neste ambiente simulado, nenhum dado bancário real é compartilhado.</li>
                </ul>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <p className="text-sm text-muted-foreground">
              {consent?.status === 'authorized'
                ? `Autorizado em: ${consent.authorizedAt ? formatDate(consent.authorizedAt) : '-'}`
                : 'Status: Pendente de autorização'}
            </p>
            <Button
              onClick={handleAuthorize}
              disabled={isLoading || consent?.status === 'authorized' || showSuccess}
            >
              {isLoading ? 'Processando...' : (
                consent?.status === 'authorized' ? 'Já Autorizado' : 'Autorizar Acesso'
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </Layout>
  );
};

export default Authorize;

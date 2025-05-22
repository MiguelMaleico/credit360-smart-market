
import React, { useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
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
import { CreditScoreCard } from '@/components/dashboard/CreditScoreCard';
import { Brain, ArrowRight } from 'lucide-react';

const Simulation: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const { creditProfile, consent, simulateAnalysis, isLoading } = useFinance();
  const [isSimulating, setIsSimulating] = useState(false);

  // Redirecionar se não estiver autenticado ou for uma instituição parceira
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (user?.role !== 'user') {
    return <Navigate to="/dashboard" />;
  }

  // Redirecionar se o usuário não autorizou o compartilhamento de dados
  if (consent?.status !== 'authorized') {
    return <Navigate to="/authorize" />;
  }

  const handleSimulation = async () => {
    setIsSimulating(true);
    await simulateAnalysis();
    setIsSimulating(false);
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Simulação de Perfil com IA</h1>
          <p className="text-muted-foreground mt-1">
            Com base nos seus dados financeiros, nossa inteligência artificial analisará seu perfil de crédito.
          </p>
        </div>

        {!creditProfile ? (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" /> Análise de Perfil Financeiro
              </CardTitle>
              <CardDescription>
                Nossa IA analisará seus dados financeiros para determinar seu perfil de crédito.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-muted p-4 rounded-md mb-4">
                <h3 className="text-sm font-medium">O que será analisado:</h3>
                <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
                  <li>• Histórico de transações bancárias</li>
                  <li>• Pagamentos de contas e compromissos financeiros</li>
                  <li>• Comportamento de crédito existente</li>
                  <li>• Renda e capacidade de pagamento</li>
                  <li>• Estabilidade financeira</li>
                </ul>
              </div>

              <div className="text-center py-8">
                <Button
                  size="lg"
                  onClick={handleSimulation}
                  disabled={isLoading || isSimulating}
                  className="animate-pulse-slow"
                >
                  {isSimulating ? 'Analisando dados...' : 'Simular Análise de Perfil'}
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            <Card className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
              <CardContent className="py-4">
                <div className="text-center text-green-700 dark:text-green-300">
                  <h2 className="text-xl font-medium">Análise concluída com sucesso!</h2>
                  <p className="text-sm">Seu perfil de crédito foi calculado com base nos dados fornecidos.</p>
                </div>
              </CardContent>
            </Card>
            
            <CreditScoreCard profile={creditProfile} />
            
            <Card>
              <CardHeader>
                <CardTitle>O que isso significa?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-medium">Score de Crédito: {creditProfile.score}</h3>
                  <p className="text-sm text-muted-foreground">
                    Seu score é {creditProfile.score < 600 ? 'baixo' : (creditProfile.score > 750 ? 'excelente' : 'bom')}.
                    {creditProfile.score < 600
                      ? ' Isso pode limitar suas opções de crédito e resultar em taxas mais altas.'
                      : creditProfile.score > 750
                      ? ' Isso te qualifica para as melhores taxas e condições.'
                      : ' Você tem acesso a boas opções, mas pode melhorar.'}
                  </p>
                </div>
                
                <div>
                  <h3 className="font-medium">Capacidade de Pagamento: 
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(creditProfile.paymentCapacity)}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Este é o valor mensal que você consegue comprometer para pagamento de dívidas.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-medium">Limite Recomendado: 
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(creditProfile.recommendedLimit)}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Este é o valor total recomendado para empréstimos e financiamentos.
                  </p>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full" asChild>
                  <Link to="/marketplace">
                    Ver Ofertas de Crédito
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Simulation;

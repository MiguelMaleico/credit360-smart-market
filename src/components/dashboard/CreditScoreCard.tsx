
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { CreditProfile } from '@/types/finance';
import { cn } from '@/lib/utils';

interface CreditScoreCardProps {
  profile: CreditProfile;
}

export const CreditScoreCard: React.FC<CreditScoreCardProps> = ({ profile }) => {
  // Determina a cor baseada no risco
  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'low':
        return 'bg-success-500';
      case 'medium':
        return 'bg-warning-500';
      case 'high':
        return 'bg-danger-500';
      default:
        return 'bg-muted';
    }
  };

  // Calcula o progresso do score (0-850)
  const scoreProgress = Math.min(100, Math.max(0, (profile.score / 850) * 100));
  
  // Formata o valor para moeda brasileira
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Seu Score de Crédito</span>
          <span 
            className={cn(
              "text-xs px-2 py-1 rounded-full text-white font-medium",
              getRiskColor(profile.riskLevel)
            )}
          >
            {profile.riskLevel === 'low' && 'Baixo Risco'}
            {profile.riskLevel === 'medium' && 'Médio Risco'}
            {profile.riskLevel === 'high' && 'Alto Risco'}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-6">
          <div>
            <div className="flex justify-between items-baseline mb-1">
              <span className="text-3xl font-bold">{profile.score}</span>
              <span className="text-sm text-muted-foreground">de 850</span>
            </div>
            <Progress 
              value={scoreProgress} 
              className={cn(
                "h-2",
                profile.riskLevel === 'low' && "bg-success-200",
                profile.riskLevel === 'medium' && "bg-warning-200",
                profile.riskLevel === 'high' && "bg-danger-200"
              )}
              indicatorClassName={getRiskColor(profile.riskLevel)}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-muted-foreground">Capacidade de Pagamento</div>
              <div className="text-xl font-semibold">{formatCurrency(profile.paymentCapacity)}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Limite Recomendado</div>
              <div className="text-xl font-semibold">{formatCurrency(profile.recommendedLimit)}</div>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="text-xs text-muted-foreground">
        Atualizado em {new Date(profile.lastUpdated).toLocaleDateString('pt-BR')}
      </CardFooter>
    </Card>
  );
};

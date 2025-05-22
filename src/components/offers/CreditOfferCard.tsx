
import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CreditOffer } from '@/types/finance';
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';

interface CreditOfferCardProps {
  offer: CreditOffer;
}

export const CreditOfferCard: React.FC<CreditOfferCardProps> = ({ offer }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [installments, setInstallments] = useState(offer.minInstallments);
  const [amount, setAmount] = useState(offer.amount);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  // Formata o valor para moeda brasileira
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  // Formata a taxa de juros como percentual
  const formatInterestRate = (rate: number) => {
    return (rate * 100).toFixed(2) + '% a.m.';
  };

  // Calcula o valor da parcela
  const calculateInstallment = (principal: number, rate: number, periods: number) => {
    // Fórmula de amortização: PMT = P * (r * (1 + r)^n) / ((1 + r)^n - 1)
    const pmt = principal * (rate * Math.pow(1 + rate, periods)) / (Math.pow(1 + rate, periods) - 1);
    return pmt;
  };

  // Calcula a compatibilidade visual (0-100%)
  const getCompatibilityPercentage = (compatibility: number) => {
    return Math.round(compatibility * 100) + '%';
  };

  // Classe de cor baseada na compatibilidade
  const getCompatibilityColor = (compatibility: number) => {
    if (compatibility >= 0.8) return 'bg-success-500';
    if (compatibility >= 0.6) return 'bg-warning-500';
    return 'bg-danger-500';
  };

  const handleContractOffer = () => {
    setIsSubmitting(true);
    
    // Simula uma chamada de API
    setTimeout(() => {
      setIsSubmitting(false);
      setIsDialogOpen(false);
      
      toast({
        title: "Proposta contratada com sucesso!",
        description: "Sua solicitação foi enviada para a instituição financeira.",
      });
    }, 2000);
  };

  const monthlyPayment = calculateInstallment(amount, offer.interestRate, installments);
  const totalPayment = monthlyPayment * installments;

  return (
    <>
      <Card className="h-full flex flex-col">
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between">
            <div className="flex items-center">
              <div className="font-bold text-lg">{offer.institutionName}</div>
            </div>
            <div className="flex flex-col items-end">
              <div className="text-xs font-medium px-2 py-1 rounded-full bg-muted">
                Taxa: {formatInterestRate(offer.interestRate)}
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex-1">
          <div className="space-y-4">
            <div className="flex flex-col">
              <span className="text-muted-foreground text-sm">Valor disponível</span>
              <span className="text-2xl font-bold">{formatCurrency(offer.amount)}</span>
              <span className="text-xs text-muted-foreground">
                De {formatCurrency(offer.minAmount)} até {formatCurrency(offer.maxAmount)}
              </span>
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="text-muted-foreground text-xs">Parcelas</span>
                <div className="font-semibold">
                  {offer.minInstallments} a {offer.maxInstallments}x
                </div>
              </div>
              <div>
                <span className="text-muted-foreground text-xs">Compatibilidade</span>
                <div className="flex items-center gap-2">
                  <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${getCompatibilityColor(offer.compatibility)}`}
                      style={{ width: getCompatibilityPercentage(offer.compatibility) }}
                    ></div>
                  </div>
                  <span className="text-xs font-medium">
                    {getCompatibilityPercentage(offer.compatibility)}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="text-sm line-clamp-2 text-muted-foreground">
              {offer.description}
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            className="w-full" 
            onClick={() => setIsDialogOpen(true)}
          >
            Contratar Proposta
          </Button>
        </CardFooter>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Contratação de Crédito</DialogTitle>
          </DialogHeader>
          
          <div className="py-4 space-y-6">
            <div className="space-y-1">
              <h3 className="font-medium">Instituição</h3>
              <p>{offer.institutionName}</p>
            </div>
            
            <div>
              <label className="text-sm font-medium">Valor (R$)</label>
              <input
                type="range"
                min={offer.minAmount}
                max={offer.maxAmount}
                step={100}
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer mt-2"
              />
              <div className="flex justify-between mt-1 text-sm">
                <span>{formatCurrency(amount)}</span>
                <span className="text-muted-foreground">
                  Máx: {formatCurrency(offer.maxAmount)}
                </span>
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium">Parcelas</label>
              <input
                type="range"
                min={offer.minInstallments}
                max={offer.maxInstallments}
                step={1}
                value={installments}
                onChange={(e) => setInstallments(Number(e.target.value))}
                className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer mt-2"
              />
              <div className="flex justify-between mt-1 text-sm">
                <span>{installments}x</span>
                <span className="text-muted-foreground">
                  {formatCurrency(monthlyPayment)}/mês
                </span>
              </div>
            </div>
            
            <div className="space-y-2 pt-2 border-t">
              <div className="flex justify-between">
                <span className="font-medium">Valor total</span>
                <span className="font-semibold">{formatCurrency(amount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Juros</span>
                <span className="font-semibold">{formatInterestRate(offer.interestRate)}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Total a pagar</span>
                <span className="font-semibold">{formatCurrency(totalPayment)}</span>
              </div>
            </div>
          </div>
          
          <DialogFooter className="flex space-x-2 sm:justify-between">
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancelar
              </Button>
            </DialogClose>
            <Button 
              onClick={handleContractOffer} 
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Processando...' : 'Confirmar Contratação'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

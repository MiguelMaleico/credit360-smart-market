
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Filter } from 'lucide-react';

interface OffersFilterProps {
  onApplyFilters: (filters: any) => void;
}

export const OffersFilter: React.FC<OffersFilterProps> = ({ onApplyFilters }) => {
  const [amount, setAmount] = useState<[number, number]>([5000, 30000]);
  const [interestRate, setInterestRate] = useState<number[]>([5]);
  const [installments, setInstallments] = useState<[number, number]>([12, 48]);

  // Formata o valor para moeda brasileira
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  // Formata a taxa de juros como percentual
  const formatInterestRate = (rate: number) => {
    return (rate).toFixed(1) + '%';
  };

  const handleApplyFilters = () => {
    onApplyFilters({
      minAmount: amount[0],
      maxAmount: amount[1],
      maxInterestRate: interestRate[0] / 100,
      minInstallments: installments[0],
      maxInstallments: installments[1],
    });
  };

  const handleResetFilters = () => {
    setAmount([5000, 30000]);
    setInterestRate([5]);
    setInstallments([12, 48]);
    
    onApplyFilters({});
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Filter className="h-5 w-5" /> Filtrar Ofertas
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="amount">Valor</Label>
              <span className="text-sm text-muted-foreground">
                {formatCurrency(amount[0])} - {formatCurrency(amount[1])}
              </span>
            </div>
            <Slider
              id="amount"
              min={1000}
              max={50000}
              step={1000}
              value={amount}
              onValueChange={setAmount}
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="interestRate">Taxa de juros máxima</Label>
              <span className="text-sm text-muted-foreground">
                {formatInterestRate(interestRate[0])} a.m.
              </span>
            </div>
            <Slider
              id="interestRate"
              min={1}
              max={10}
              step={0.1}
              value={interestRate}
              onValueChange={setInterestRate}
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="installments">Parcelas</Label>
              <span className="text-sm text-muted-foreground">
                {installments[0]} - {installments[1]}x
              </span>
            </div>
            <Slider
              id="installments"
              min={1}
              max={72}
              step={1}
              value={installments}
              onValueChange={setInstallments}
            />
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={handleResetFilters} className="flex-1">
            Limpar
          </Button>
          <Button onClick={handleApplyFilters} className="flex-1">
            Aplicar Filtros
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

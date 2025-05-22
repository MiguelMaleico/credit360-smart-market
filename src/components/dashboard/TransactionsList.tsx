
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Transaction } from '@/types/finance';

interface TransactionsListProps {
  transactions: Transaction[];
}

export const TransactionsList: React.FC<TransactionsListProps> = ({ transactions }) => {
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
        <CardTitle>Extrato Bancário</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {transactions.map((transaction) => (
            <div 
              key={transaction.id}
              className="flex items-center justify-between py-2 border-b last:border-0"
            >
              <div className="flex flex-col">
                <span className="font-medium">{transaction.description}</span>
                <span className="text-xs text-muted-foreground">
                  {new Date(transaction.date).toLocaleDateString('pt-BR')} • {transaction.category}
                </span>
              </div>
              <span className={`font-semibold ${transaction.type === 'income' ? 'text-success-600' : 'text-danger-600'}`}>
                {transaction.type === 'income' ? '+' : '-'} {formatCurrency(transaction.amount)}
              </span>
            </div>
          ))}
          
          {transactions.length === 0 && (
            <div className="text-center py-4 text-muted-foreground">
              Nenhuma transação encontrada
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};


import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { History, Plus, Minus, Repeat, Gift } from 'lucide-react';
import { CreditTransaction } from '@/types/credits.types';

interface CreditHistoryProps {
  transactions: CreditTransaction[];
}

export const CreditHistory: React.FC<CreditHistoryProps> = ({ transactions }) => {
  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'uso':
        return <Minus className="h-4 w-4 text-red-500" />;
      case 'compra':
        return <Plus className="h-4 w-4 text-green-500" />;
      case 'assinatura':
        return <Repeat className="h-4 w-4 text-blue-500" />;
      case 'renovacao':
        return <Gift className="h-4 w-4 text-purple-500" />;
      default:
        return <History className="h-4 w-4 text-gray-500" />;
    }
  };

  const getTransactionColor = (type: string) => {
    switch (type) {
      case 'uso':
        return 'destructive';
      case 'compra':
        return 'default';
      case 'assinatura':
        return 'secondary';
      case 'renovacao':
        return 'outline';
      default:
        return 'outline';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatAmount = (amount: number, type: string) => {
    const sign = type === 'uso' ? '' : '+';
    return `${sign}${Math.abs(amount)}`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <History className="h-5 w-5 text-gray-600" />
          Histórico de Transações
        </CardTitle>
      </CardHeader>
      <CardContent>
        {transactions.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <History className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>Nenhuma transação encontrada</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {transactions.map((transaction) => (
              <div 
                key={transaction.id} 
                className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  {getTransactionIcon(transaction.type)}
                  <div>
                    <p className="font-medium text-sm">{transaction.description}</p>
                    <p className="text-xs text-gray-500">
                      {formatDate(transaction.created_at)}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className={`font-bold ${
                    transaction.type === 'uso' ? 'text-red-600' : 'text-green-600'
                  }`}>
                    {formatAmount(transaction.amount, transaction.type)}
                  </span>
                  <Badge variant={getTransactionColor(transaction.type)} className="text-xs">
                    {transaction.type === 'uso' ? 'Uso' :
                     transaction.type === 'compra' ? 'Compra' :
                     transaction.type === 'assinatura' ? 'Assinatura' :
                     'Renovação'}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

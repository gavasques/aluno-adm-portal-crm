
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface CreditInfoCardProps {
  creditLimit: number;
  renewalDate: string;
}

export const CreditInfoCard: React.FC<CreditInfoCardProps> = ({
  creditLimit,
  renewalDate
}) => {
  return (
    <Card className="bg-blue-50 border-blue-200">
      <CardContent className="p-6">
        <h3 className="font-semibold text-blue-900 mb-2">💡 Como funcionam os créditos?</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• <strong>Limite mensal:</strong> Você possui {creditLimit} créditos base por mês</li>
          <li>• <strong>Compras avulsas:</strong> Somam ao seu saldo atual e não expiram</li>
          <li>• <strong>Assinatura:</strong> Adiciona créditos extras automaticamente todo mês</li>
          <li>• <strong>Renovação:</strong> No dia {new Date(renewalDate).getDate()} de cada mês seus créditos base são renovados</li>
        </ul>
      </CardContent>
    </Card>
  );
};


import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useCreditSettings } from '@/hooks/credits/useCreditSettings';

interface CreditInfoCardProps {
  creditLimit: number;
  renewalDate: string;
}

export const CreditInfoCard: React.FC<CreditInfoCardProps> = ({
  creditLimit,
  renewalDate
}) => {
  const { creditSettings } = useCreditSettings();
  
  const monthlyFreeCredits = creditSettings?.systemSettings?.monthly_free_credits || creditLimit;
  const enablePurchases = creditSettings?.systemSettings?.enable_purchases ?? true;
  const enableSubscriptions = creditSettings?.systemSettings?.enable_subscriptions ?? true;

  return (
    <Card className="bg-blue-50 border-blue-200">
      <CardContent className="p-6">
        <h3 className="font-semibold text-blue-900 mb-2">💡 Como funcionam os créditos?</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• <strong>Créditos gratuitos mensais:</strong> Você recebe {monthlyFreeCredits} créditos gratuitos por mês</li>
          {enablePurchases && (
            <li>• <strong>Compras avulsas:</strong> Somam ao seu saldo atual e não expiram</li>
          )}
          {enableSubscriptions && (
            <li>• <strong>Assinatura:</strong> Adiciona créditos extras automaticamente todo mês</li>
          )}
          <li>• <strong>Renovação:</strong> No dia {new Date(renewalDate).getDate()} de cada mês seus créditos gratuitos são renovados</li>
          <li>• <strong>Consumo:</strong> Cada interação com a IA consome 1 crédito</li>
        </ul>
      </CardContent>
    </Card>
  );
};

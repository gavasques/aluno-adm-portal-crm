
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw, Loader2 } from 'lucide-react';
import { CreditDisplay } from './CreditDisplay';

interface CreditStatusCardProps {
  creditStatus: any;
  isLoading: boolean;
  error: string | null;
  onRefresh: () => void;
}

export const CreditStatusCard: React.FC<CreditStatusCardProps> = ({
  creditStatus,
  isLoading,
  error,
  onRefresh
}) => {
  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Carregando informações de créditos...</p>
        </CardContent>
      </Card>
    );
  }

  if (error && !creditStatus) {
    return (
      <Card className="border-red-200">
        <CardContent className="p-6 text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={onRefresh} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Tentar Novamente
          </Button>
        </CardContent>
      </Card>
    );
  }

  const safeCredits = creditStatus?.credits || {
    current: 0,
    used: 0,
    limit: 50,
    renewalDate: new Date().toISOString().split('T')[0],
    usagePercentage: 0
  };

  const safeSubscription = creditStatus?.subscription || null;

  return (
    <CreditDisplay
      current={safeCredits.current}
      used={safeCredits.used}
      limit={safeCredits.limit}
      renewalDate={safeCredits.renewalDate}
      usagePercentage={safeCredits.usagePercentage}
      subscriptionType={safeSubscription?.monthly_credits 
        ? `+${safeSubscription.monthly_credits}/mês` 
        : null}
    />
  );
};

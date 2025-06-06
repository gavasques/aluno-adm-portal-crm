
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { CreditCard, Calendar, RefreshCw } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useCredits } from '@/hooks/useCredits';
import { useCreditSettings } from '@/hooks/credits/useCreditSettings';

interface CreditDisplayProps {
  current: number;
  used: number;
  limit: number;
  renewalDate: string;
  usagePercentage: number;
  subscriptionType?: string | null;
}

export const CreditDisplay: React.FC<CreditDisplayProps> = ({
  current,
  used,
  limit,
  renewalDate,
  usagePercentage,
  subscriptionType
}) => {
  const { refreshCredits, isLoading } = useCredits();
  const { creditSettings } = useCreditSettings();
  
  const monthlyFreeCredits = creditSettings?.systemSettings?.monthly_free_credits || limit;
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const getStatusColor = () => {
    if (current <= 0) return 'destructive';
    if (usagePercentage >= 90) return 'destructive';
    if (usagePercentage >= 70) return 'secondary';
    return 'default';
  };

  const handleRefresh = () => {
    console.log("🔄 Refresh de créditos solicitado");
    refreshCredits();
  };

  return (
    <Card className="border-l-4 border-l-blue-500">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-xl">
          <CreditCard className="h-6 w-6 text-blue-600" />
          Meus Créditos
          {subscriptionType && (
            <Badge variant="outline" className="ml-auto">
              {subscriptionType}
            </Badge>
          )}
          <Button
            onClick={handleRefresh}
            variant="ghost"
            size="sm"
            className="ml-2"
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Saldo Principal */}
        <div className="text-center">
          <div className="text-3xl font-bold text-gray-900">
            {current} <span className="text-lg text-gray-500">disponíveis</span>
          </div>
          <p className="text-sm text-gray-600">
            {monthlyFreeCredits} créditos gratuitos mensais + compras avulsas
          </p>
        </div>

        {/* Barra de Progresso */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Créditos gratuitos usados este mês</span>
            <span>{Math.min(used, monthlyFreeCredits)}/{monthlyFreeCredits}</span>
          </div>
          <Progress 
            value={(Math.min(used, monthlyFreeCredits) / monthlyFreeCredits) * 100} 
            className="h-3"
          />
          <div className="flex justify-between text-xs text-gray-600">
            <span>{Math.min(used, monthlyFreeCredits)} usados dos gratuitos</span>
            <span>{Math.max(0, monthlyFreeCredits - used)} gratuitos restantes</span>
          </div>
        </div>

        {/* Status e Renovação */}
        <div className="flex items-center justify-between pt-2 border-t">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-600">
              Créditos gratuitos renovam em: {formatDate(renewalDate)}
            </span>
          </div>
          <Badge variant={getStatusColor()}>
            {current <= 0 ? 'Sem créditos' : 
             current <= (creditSettings?.systemSettings?.low_credit_threshold || 10) ? 'Créditos baixos' : 'Normal'}
          </Badge>
        </div>

        {/* Alertas */}
        {current <= 0 && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-sm text-red-800 font-medium">
              ⚠️ Seus créditos acabaram! Adquira mais para continuar usando o sistema.
            </p>
          </div>
        )}
        
        {current > 0 && current <= (creditSettings?.systemSettings?.low_credit_threshold || 10) && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <p className="text-sm text-yellow-800 font-medium">
              ⚡ Você tem poucos créditos restantes ({current}). Considere adquirir mais.
            </p>
          </div>
        )}

        {used >= monthlyFreeCredits && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm text-blue-800 font-medium">
              🎉 Você já usou todos os seus {monthlyFreeCredits} créditos gratuitos deste mês! 
              Os créditos restantes são de compras avulsas.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

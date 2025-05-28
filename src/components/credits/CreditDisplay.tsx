
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { CreditCard, Calendar, TrendingUp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

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
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const getProgressColor = () => {
    if (usagePercentage >= 90) return 'bg-red-500';
    if (usagePercentage >= 70) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getStatusColor = () => {
    if (current <= 0) return 'destructive';
    if (usagePercentage >= 90) return 'destructive';
    if (usagePercentage >= 70) return 'secondary';
    return 'default';
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
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Saldo Principal */}
        <div className="text-center">
          <div className="text-3xl font-bold text-gray-900">
            {current} <span className="text-lg text-gray-500">de {limit}</span>
          </div>
          <p className="text-sm text-gray-600">créditos disponíveis</p>
        </div>

        {/* Barra de Progresso */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Usado este mês</span>
            <span>{usagePercentage}%</span>
          </div>
          <Progress 
            value={usagePercentage} 
            className="h-3"
          />
          <div className="flex justify-between text-xs text-gray-600">
            <span>{used} consumidos</span>
            <span>{current} restantes</span>
          </div>
        </div>

        {/* Status e Renovação */}
        <div className="flex items-center justify-between pt-2 border-t">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-600">
              Renova em: {formatDate(renewalDate)}
            </span>
          </div>
          <Badge variant={getStatusColor()}>
            {current <= 0 ? 'Sem créditos' : 
             usagePercentage >= 90 ? 'Atenção' : 'Normal'}
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
        
        {usagePercentage >= 90 && current > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <p className="text-sm text-yellow-800 font-medium">
              ⚡ Você já usou {usagePercentage}% dos seus créditos mensais.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

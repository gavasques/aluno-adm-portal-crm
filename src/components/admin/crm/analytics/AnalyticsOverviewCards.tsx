
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Users, Target, Clock } from 'lucide-react';
import { useCRMAnalytics } from '@/hooks/crm/useCRMAnalytics';

interface OverviewCard {
  title: string;
  value: string | number;
  subtitle: string;
  icon: React.ComponentType<any>;
  color: string;
  trend: string;
}

interface AnalyticsOverviewCardsProps {
  dateRange?: { from: Date; to: Date };
}

export const AnalyticsOverviewCards: React.FC<AnalyticsOverviewCardsProps> = ({
  dateRange = {
    from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    to: new Date()
  }
}) => {
  const { analyticsMetrics, isLoading } = useCRMAnalytics(dateRange);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-20 bg-gray-200 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!analyticsMetrics) return null;

  const overviewCards: OverviewCard[] = [
    {
      title: 'Total de Leads',
      value: analyticsMetrics.totalLeads,
      subtitle: `${analyticsMetrics.leadsThisWeek} esta semana`,
      icon: Users,
      color: 'blue',
      trend: analyticsMetrics.leadsThisWeek > 0 ? '+' + analyticsMetrics.leadsThisWeek.toString() : '0'
    },
    {
      title: 'Taxa de Conversão',
      value: `${analyticsMetrics.conversionRate.toFixed(1)}%`,
      subtitle: 'Média do período',
      icon: Target,
      color: 'green',
      trend: analyticsMetrics.conversionRate > 20 ? '+Boa' : 'Baixa'
    },
    {
      title: 'Tempo Médio no Pipeline',
      value: `${analyticsMetrics.averageTimeInPipeline} dias`,
      subtitle: 'Para conversão',
      icon: Clock,
      color: 'orange',
      trend: analyticsMetrics.averageTimeInPipeline < 30 ? 'Rápido' : 'Lento'
    },
    {
      title: 'Performance Geral',
      value: analyticsMetrics.conversionRate > 15 ? 'Boa' : 'Regular',
      subtitle: 'Baseado na conversão',
      icon: TrendingUp,
      color: 'purple',
      trend: analyticsMetrics.conversionRate > 15 ? '+5%' : 'Estável'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {overviewCards.map((card, index) => {
        const Icon = card.icon;
        const isPositive = card.trend.startsWith('+') || card.trend === 'Boa' || card.trend === 'Rápido';
        const TrendIcon = isPositive ? TrendingUp : TrendingDown;
        
        return (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {card.title}
              </CardTitle>
              <div className={`p-2 rounded-full bg-${card.color}-100`}>
                <Icon className={`h-4 w-4 text-${card.color}-600`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {card.value}
              </div>
              <div className="flex items-center justify-between">
                <p className="text-xs text-gray-500">
                  {card.subtitle}
                </p>
                <div className={`flex items-center text-xs ${
                  isPositive ? 'text-green-600' : 'text-red-600'
                }`}>
                  <TrendIcon className="h-3 w-3 mr-1" />
                  {card.trend}
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

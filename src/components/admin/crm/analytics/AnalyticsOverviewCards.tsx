
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Users, Target, Clock } from 'lucide-react';

interface OverviewCard {
  title: string;
  value: string | number;
  subtitle: string;
  icon: React.ComponentType<any>;
  color: string;
  trend: string;
}

interface AnalyticsOverviewCardsProps {
  analyticsMetrics?: {
    totalLeads?: number;
    leadsThisWeek?: number;
    conversionRate?: number;
    averageTimeInPipeline?: number;
  };
}

export const AnalyticsOverviewCards: React.FC<AnalyticsOverviewCardsProps> = ({
  analyticsMetrics
}) => {
  const overviewCards: OverviewCard[] = [
    {
      title: 'Total de Leads',
      value: analyticsMetrics?.totalLeads || 0,
      subtitle: `${analyticsMetrics?.leadsThisWeek || 0} esta semana`,
      icon: Users,
      color: 'blue',
      trend: '+12%'
    },
    {
      title: 'Taxa de Conversão',
      value: `${analyticsMetrics?.conversionRate || 0}%`,
      subtitle: 'Média do período',
      icon: Target,
      color: 'green',
      trend: '+3.2%'
    },
    {
      title: 'Tempo Médio',
      value: `${analyticsMetrics?.averageTimeInPipeline || 0} dias`,
      subtitle: 'No pipeline',
      icon: Clock,
      color: 'orange',
      trend: '-2 dias'
    },
    {
      title: 'Performance',
      value: '85%',
      subtitle: 'Meta atingida',
      icon: TrendingUp,
      color: 'purple',
      trend: '+5%'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {overviewCards.map((card, index) => {
        const Icon = card.icon;
        const isPositive = card.trend.startsWith('+');
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

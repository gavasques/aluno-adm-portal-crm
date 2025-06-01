
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  TrendingUp, 
  Target, 
  Clock,
  ArrowUpIcon,
  ArrowDownIcon
} from 'lucide-react';
import { CRMMetrics } from '@/hooks/crm/useCRMReports';

interface CRMReportsOverviewProps {
  metrics?: CRMMetrics;
  loading: boolean;
}

const CRMReportsOverview: React.FC<CRMReportsOverviewProps> = ({ metrics, loading }) => {
  if (loading) {
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

  if (!metrics) return null;

  const cards = [
    {
      title: 'Total de Leads',
      value: metrics.totalLeads,
      icon: Users,
      color: 'blue',
      subtitle: `${metrics.leadsThisMonth} este mês`
    },
    {
      title: 'Taxa de Conversão',
      value: `${metrics.conversionRate.toFixed(1)}%`,
      icon: Target,
      color: 'green',
      subtitle: `${metrics.convertedLeads} convertidos`
    },
    {
      title: 'Crescimento Mensal',
      value: `${metrics.monthlyGrowth > 0 ? '+' : ''}${metrics.monthlyGrowth.toFixed(1)}%`,
      icon: metrics.monthlyGrowth >= 0 ? ArrowUpIcon : ArrowDownIcon,
      color: metrics.monthlyGrowth >= 0 ? 'green' : 'red',
      subtitle: 'vs. mês anterior'
    },
    {
      title: 'Leads Ativos',
      value: metrics.totalLeads - metrics.convertedLeads,
      icon: Clock,
      color: 'orange',
      subtitle: 'em andamento'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => {
        const Icon = card.icon;
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
              <div className="text-2xl font-bold text-gray-900">
                {card.value}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {card.subtitle}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default CRMReportsOverview;

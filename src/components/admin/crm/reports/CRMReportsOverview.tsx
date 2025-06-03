
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

  const convertedLeads = Math.round(metrics.total_leads * (metrics.conversion_rate / 100));

  const cards = [
    {
      title: 'Total de Leads',
      value: metrics.total_leads,
      icon: Users,
      color: 'blue',
      subtitle: `${metrics.new_leads_this_month} este mês`
    },
    {
      title: 'Taxa de Conversão',
      value: `${metrics.conversion_rate.toFixed(1)}%`,
      icon: Target,
      color: 'green',
      subtitle: `${convertedLeads} convertidos`
    },
    {
      title: 'Crescimento Mensal',
      value: `${metrics.monthly_growth > 0 ? '+' : ''}${metrics.monthly_growth.toFixed(1)}%`,
      icon: metrics.monthly_growth >= 0 ? ArrowUpIcon : ArrowDownIcon,
      color: metrics.monthly_growth >= 0 ? 'green' : 'red',
      subtitle: 'vs. mês anterior'
    },
    {
      title: 'Leads Ativos',
      value: metrics.total_leads - convertedLeads,
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

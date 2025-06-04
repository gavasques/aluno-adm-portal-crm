
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, Users, DollarSign, Target, Activity, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCRMPerformance } from '@/hooks/crm/useCRMPerformance';

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon: React.ReactNode;
  loading?: boolean;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, change, changeType, icon, loading }) => {
  const changeColor = changeType ? {
    positive: 'text-green-600',
    negative: 'text-red-600',
    neutral: 'text-gray-600'
  }[changeType] : 'text-gray-600';

  if (loading) {
    return (
      <Card className="relative overflow-hidden border-0 shadow-md">
        <CardContent className="p-6">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded mb-2"></div>
            <div className="h-8 bg-gray-200 rounded mb-2"></div>
            <div className="h-3 bg-gray-200 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="relative overflow-hidden border-0 shadow-md bg-white hover:shadow-lg transition-shadow duration-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
              <p className="text-2xl font-bold text-gray-900 mb-2">{value}</p>
              {change && (
                <p className={`text-xs font-medium ${changeColor} flex items-center gap-1`}>
                  {changeType === 'positive' && <TrendingUp className="h-3 w-3" />}
                  {change}
                </p>
              )}
            </div>
            <div className="flex-shrink-0 p-3 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl">
              {icon}
            </div>
          </div>
        </CardContent>
        <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-500" />
      </Card>
    </motion.div>
  );
};

export const CRMMetricsCards: React.FC = () => {
  const { metrics, isLoading } = useCRMPerformance();

  const metricsData = [
    {
      title: 'Total de Leads',
      value: metrics?.totalLeads || 0,
      change: `${metrics?.leadsThisMonth || 0} este mês`,
      changeType: 'neutral' as const,
      icon: <Users className="h-6 w-6 text-blue-600" />
    },
    {
      title: 'Taxa de Conversão',
      value: `${(metrics?.conversionRate || 0).toFixed(1)}%`,
      change: metrics?.conversionRate && metrics.conversionRate > 15 ? 'Acima da média' : 'Abaixo da média',
      changeType: metrics?.conversionRate && metrics.conversionRate > 15 ? 'positive' : 'negative' as const,
      icon: <Target className="h-6 w-6 text-green-600" />
    },
    {
      title: 'Contatos Agendados',
      value: metrics?.contactsScheduled || 0,
      change: `${metrics?.contactsCompleted || 0} realizados`,
      changeType: 'neutral' as const,
      icon: <Clock className="h-6 w-6 text-orange-600" />
    },
    {
      title: 'Atividades Pendentes',
      value: (metrics?.contactsScheduled || 0) + (metrics?.overdueContacts || 0),
      change: `${metrics?.overdueContacts || 0} em atraso`,
      changeType: metrics?.overdueContacts && metrics.overdueContacts > 0 ? 'negative' : 'positive' as const,
      icon: <Activity className="h-6 w-6 text-purple-600" />
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metricsData.map((metric, index) => (
        <MetricCard key={index} {...metric} loading={isLoading} />
      ))}
    </div>
  );
};

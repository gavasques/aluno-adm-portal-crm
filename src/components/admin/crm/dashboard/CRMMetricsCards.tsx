
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, Users, DollarSign, Target, Activity, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

interface MetricCardProps {
  title: string;
  value: string | number;
  change: string;
  changeType: 'positive' | 'negative' | 'neutral';
  icon: React.ReactNode;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, change, changeType, icon }) => {
  const changeColor = {
    positive: 'text-green-600',
    negative: 'text-red-600',
    neutral: 'text-gray-600'
  }[changeType];

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
              <p className={`text-xs font-medium ${changeColor} flex items-center gap-1`}>
                {changeType === 'positive' && <TrendingUp className="h-3 w-3" />}
                {change}
              </p>
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
  const metrics = [
    {
      title: 'Total de Leads',
      value: '1,234',
      change: '+12% este mês',
      changeType: 'positive' as const,
      icon: <Users className="h-6 w-6 text-blue-600" />
    },
    {
      title: 'Taxa de Conversão',
      value: '24.5%',
      change: '+3.2% vs último mês',
      changeType: 'positive' as const,
      icon: <Target className="h-6 w-6 text-green-600" />
    },
    {
      title: 'Valor em Pipeline',
      value: 'R$ 2.4M',
      change: '+8.5% este mês',
      changeType: 'positive' as const,
      icon: <DollarSign className="h-6 w-6 text-emerald-600" />
    },
    {
      title: 'Atividade Hoje',
      value: '47',
      change: '12 pendentes',
      changeType: 'neutral' as const,
      icon: <Activity className="h-6 w-6 text-orange-600" />
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metrics.map((metric, index) => (
        <MetricCard key={index} {...metric} />
      ))}
    </div>
  );
};

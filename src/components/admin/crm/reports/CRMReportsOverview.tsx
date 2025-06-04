
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
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface CRMReportsOverviewProps {
  loading?: boolean;
}

const CRMReportsOverview: React.FC<CRMReportsOverviewProps> = ({ loading: propLoading = false }) => {
  
  const { data: metrics, isLoading } = useQuery({
    queryKey: ['crm-reports-overview'],
    queryFn: async () => {
      // Get current month start
      const currentMonth = new Date();
      currentMonth.setDate(1);
      currentMonth.setHours(0, 0, 0, 0);

      // Get previous month start and end
      const previousMonth = new Date(currentMonth);
      previousMonth.setMonth(previousMonth.getMonth() - 1);
      const previousMonthEnd = new Date(currentMonth);
      previousMonthEnd.setTime(previousMonthEnd.getTime() - 1);

      // Total leads
      const { count: totalLeads } = await supabase
        .from('crm_leads')
        .select('*', { count: 'exact', head: true });

      // Leads this month
      const { count: leadsThisMonth } = await supabase
        .from('crm_leads')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', currentMonth.toISOString());

      // Leads previous month
      const { count: leadsPreviousMonth } = await supabase
        .from('crm_leads')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', previousMonth.toISOString())
        .lte('created_at', previousMonthEnd.toISOString());

      // Converted leads
      const { count: convertedLeads } = await supabase
        .from('crm_leads')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'ganho');

      // Active leads
      const { count: activeLeads } = await supabase
        .from('crm_leads')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'aberto');

      // Calculate growth
      const monthlyGrowth = leadsPreviousMonth && leadsPreviousMonth > 0 ? 
        (((leadsThisMonth || 0) - leadsPreviousMonth) / leadsPreviousMonth) * 100 : 0;

      // Calculate conversion rate
      const conversionRate = totalLeads && totalLeads > 0 ? 
        ((convertedLeads || 0) / totalLeads) * 100 : 0;

      return {
        total_leads: totalLeads || 0,
        new_leads_this_month: leadsThisMonth || 0,
        conversion_rate: conversionRate,
        monthly_growth: monthlyGrowth,
        active_leads: activeLeads || 0,
        converted_leads: convertedLeads || 0
      };
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const loading = isLoading || propLoading;

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
      subtitle: `${metrics.converted_leads} convertidos`
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
      value: metrics.active_leads,
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
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card className="hover:shadow-lg transition-shadow">
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
          </motion.div>
        );
      })}
    </div>
  );
};

export default CRMReportsOverview;

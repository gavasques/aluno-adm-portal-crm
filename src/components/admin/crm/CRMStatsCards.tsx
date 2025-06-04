
import React from 'react';
import { Users, TrendingUp, DollarSign, Clock } from 'lucide-react';
import { useCRMData } from '@/hooks/crm/useCRMData';
import { CRMFilters } from '@/types/crm.types';
import { CardStats } from '@/components/ui/card-stats';

interface CRMStatsCardsProps {
  filters: CRMFilters;
}

const CRMStatsCards = React.memo(({ filters }: CRMStatsCardsProps) => {
  const { leadsWithContacts, loading } = useCRMData(filters);

  const stats = React.useMemo(() => {
    if (loading) return { total: 0, qualified: 0, closed: 0, pending: 0 };

    const total = leadsWithContacts.length;
    const qualified = leadsWithContacts.filter(lead => 
      lead.status === 'aberto' && lead.responsible_id
    ).length;
    const closed = leadsWithContacts.filter(lead => 
      lead.status === 'ganho'
    ).length;
    const pending = leadsWithContacts.filter(lead => 
      !lead.responsible_id || lead.status === 'aberto'
    ).length;

    return { total, qualified, closed, pending };
  }, [leadsWithContacts, loading]);

  const statsData = React.useMemo(() => [
    {
      title: "Total de Leads",
      value: stats.total,
      icon: <Users className="h-4 w-4" />,
      description: loading ? "Carregando..." : "No pipeline atual"
    },
    {
      title: "Leads Qualificados",
      value: stats.qualified,
      icon: <TrendingUp className="h-4 w-4" />,
      description: loading ? "Carregando..." : "Com responsável definido"
    },
    {
      title: "Leads Convertidos",
      value: stats.closed,
      icon: <DollarSign className="h-4 w-4" />,
      description: loading ? "Carregando..." : "Status: Ganho"
    },
    {
      title: "Leads Pendentes",
      value: stats.pending,
      icon: <Clock className="h-4 w-4" />,
      description: loading ? "Carregando..." : "Sem responsável ou em aberto"
    }
  ], [stats, loading]);

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {statsData.map((stat, index) => (
        <CardStats
          key={index}
          title={stat.title}
          value={loading ? 0 : stat.value}
          icon={stat.icon}
          description={stat.description}
        />
      ))}
    </div>
  );
});

CRMStatsCards.displayName = 'CRMStatsCards';

export default CRMStatsCards;

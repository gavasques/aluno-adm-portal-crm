
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
      lead.column?.name && !['Novo Lead', 'Perdido'].includes(lead.column.name)
    ).length;
    const closed = leadsWithContacts.filter(lead => 
      lead.column?.name === 'Fechado'
    ).length;
    const pending = leadsWithContacts.filter(lead => 
      !lead.responsible_id
    ).length;

    return { total, qualified, closed, pending };
  }, [leadsWithContacts, loading]);

  const statsData = React.useMemo(() => [
    {
      title: "Total de Leads",
      value: stats.total,
      icon: <Users className="h-4 w-4" />,
      description: "No pipeline atual"
    },
    {
      title: "Qualificados",
      value: stats.qualified,
      icon: <TrendingUp className="h-4 w-4" />,
      description: "Em processo de venda"
    },
    {
      title: "Fechados",
      value: stats.closed,
      icon: <DollarSign className="h-4 w-4" />,
      description: "Vendas concluídas"
    },
    {
      title: "Sem Responsável",
      value: stats.pending,
      icon: <Clock className="h-4 w-4" />,
      description: "Aguardando atribuição"
    }
  ], [stats]);

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {statsData.map((stat, index) => (
        <CardStats
          key={index}
          title={stat.title}
          value={stat.value}
          icon={stat.icon}
          description={stat.description}
        />
      ))}
    </div>
  );
});

CRMStatsCards.displayName = 'CRMStatsCards';

export default CRMStatsCards;

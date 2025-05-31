
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, TrendingUp, DollarSign, Clock } from 'lucide-react';
import { useCRMData } from '@/hooks/crm/useCRMData';
import { CRMFilters } from '@/types/crm.types';

interface CRMStatsCardsProps {
  filters: CRMFilters;
}

const CRMStatsCards = ({ filters }: CRMStatsCardsProps) => {
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

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total de Leads</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.total}</div>
          <p className="text-xs text-muted-foreground">
            No pipeline atual
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Qualificados</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.qualified}</div>
          <p className="text-xs text-muted-foreground">
            Em processo de venda
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Fechados</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.closed}</div>
          <p className="text-xs text-muted-foreground">
            Vendas concluídas
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Sem Responsável</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.pending}</div>
          <p className="text-xs text-muted-foreground">
            Aguardando atribuição
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default CRMStatsCards;

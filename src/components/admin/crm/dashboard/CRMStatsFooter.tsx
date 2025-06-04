
import React from 'react';
import { useUnifiedCRMData } from '@/hooks/crm/useUnifiedCRMData';

interface CRMStatsFooterProps {
  filters?: any;
}

export const CRMStatsFooter: React.FC<CRMStatsFooterProps> = ({ filters = {} }) => {
  const { leadsWithContacts, loading } = useUnifiedCRMData(filters);
  
  const stats = React.useMemo(() => {
    if (loading || !leadsWithContacts) {
      return {
        totalLeads: 0,
        totalValue: 0,
        closedThisMonth: 0
      };
    }

    const totalLeads = leadsWithContacts.length;
    
    // Calcular valor total estimado (R$ 2.500 por lead convertido como exemplo)
    const convertedLeads = leadsWithContacts.filter(lead => lead.status === 'ganho').length;
    const totalValue = convertedLeads * 2500;
    
    // Leads fechados este mês
    const currentMonth = new Date();
    currentMonth.setDate(1);
    currentMonth.setHours(0, 0, 0, 0);
    
    const closedThisMonth = leadsWithContacts.filter(lead => 
      lead.status === 'ganho' && 
      lead.status_changed_at && 
      new Date(lead.status_changed_at) >= currentMonth
    ).length;

    return {
      totalLeads,
      totalValue,
      closedThisMonth
    };
  }, [leadsWithContacts, loading]);

  const lastUpdate = new Date().toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit'
  });

  if (loading) {
    return (
      <div className="bg-white border-t border-gray-200 px-6 py-3">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center gap-8">
            <span>Carregando dados...</span>
          </div>
          <div>
            <span>Atualizando...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border-t border-gray-200 px-6 py-3">
      <div className="flex items-center justify-between text-sm text-gray-600">
        <div className="flex items-center gap-8">
          <span>Total de leads: <strong className="text-gray-900">{stats.totalLeads}</strong></span>
          <span>Valor estimado: <strong className="text-gray-900">R$ {stats.totalValue.toLocaleString()}</strong></span>
          <span>Fechados este mês: <strong className="text-gray-900">{stats.closedThisMonth}</strong></span>
        </div>
        <div>
          <span>Última atualização: hoje às {lastUpdate}</span>
        </div>
      </div>
    </div>
  );
};

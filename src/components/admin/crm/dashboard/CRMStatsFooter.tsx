
import React from 'react';
import { useOptimizedCRMData } from '@/hooks/crm/useOptimizedCRMData';

export const CRMStatsFooter: React.FC = () => {
  // Mock data - replace with real data from your hooks
  const totalLeads = 20;
  const totalValue = 456500;
  const closedThisMonth = 5;
  const lastUpdate = new Date().toLocaleTimeString('pt-BR', { 
    hour: '2-digit', 
    minute: '2-digit' 
  });

  return (
    <div className="bg-white border-t border-gray-200 px-6 py-3">
      <div className="flex items-center justify-between text-sm text-gray-600">
        <div className="flex items-center gap-8">
          <span>Total de leads: <strong className="text-gray-900">{totalLeads}</strong></span>
          <span>Valor potencial: <strong className="text-gray-900">R$ {totalValue.toLocaleString('pt-BR')},00</strong></span>
          <span>Fechados este mês: <strong className="text-gray-900">{closedThisMonth}</strong></span>
        </div>
        <div>
          <span>Última atualização: hoje às {lastUpdate}</span>
        </div>
      </div>
    </div>
  );
};

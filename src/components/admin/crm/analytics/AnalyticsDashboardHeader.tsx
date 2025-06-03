
import React from 'react';
import { Button } from '@/components/ui/button';
import { Filter, Download } from 'lucide-react';

interface AnalyticsDashboardHeaderProps {
  onFilter?: () => void;
  onExport?: () => void;
}

export const AnalyticsDashboardHeader: React.FC<AnalyticsDashboardHeaderProps> = ({
  onFilter,
  onExport
}) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Analytics Avançado</h2>
        <p className="text-gray-600">Análises detalhadas e insights de performance</p>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={onFilter}>
          <Filter className="h-4 w-4 mr-2" />
          Filtros
        </Button>
        <Button variant="outline" size="sm" onClick={onExport}>
          <Download className="h-4 w-4 mr-2" />
          Exportar
        </Button>
      </div>
    </div>
  );
};

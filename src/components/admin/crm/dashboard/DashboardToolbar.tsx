
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Grid3X3, 
  List, 
  Filter, 
  Settings,
  Plus,
  ChevronDown,
  BarChart3
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { CRMFilters } from '@/types/crm.types';
import { CRMCardConfigDialog } from '../card-config/CRMCardConfigDialog';

interface DashboardToolbarProps {
  activeView: 'kanban' | 'list';
  onViewChange: (view: 'kanban' | 'list') => void;
  showFilters: boolean;
  onToggleFilters: () => void;
  onCreateLead: (columnId?: string) => void;
  filters: CRMFilters;
  onOpenReports?: () => void;
}

export const DashboardToolbar: React.FC<DashboardToolbarProps> = ({
  activeView,
  onViewChange,
  showFilters,
  onToggleFilters,
  onCreateLead,
  filters,
  onOpenReports
}) => {
  const [showCardConfig, setShowCardConfig] = useState(false);

  // Contar filtros ativos
  const activeFiltersCount = Object.entries(filters).filter(([key, value]) => {
    if (key === 'pipeline_id') return false; // pipeline não conta como filtro ativo
    if (Array.isArray(value)) return value.length > 0;
    return value && value !== '';
  }).length;

  return (
    <>
      <div className="flex items-center justify-between gap-4 px-6 py-4 bg-white/80 backdrop-blur-sm border-b border-gray-200/50">
        <div className="flex items-center gap-3">
          {/* Botão Novo Lead */}
          <Button 
            onClick={() => onCreateLead()} 
            className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
          >
            <Plus className="h-4 w-4 mr-2" />
            Novo Lead
          </Button>

          {/* Botão Configurar Campos - NOVO */}
          <Button
            variant="outline"
            onClick={() => setShowCardConfig(true)}
            className="flex items-center gap-2"
          >
            <Settings className="h-4 w-4" />
            Configurar Campos
          </Button>

          {/* Botão Mostrar Filtros */}
          <Button 
            variant="outline" 
            onClick={onToggleFilters}
            className="relative"
          >
            <Filter className="h-4 w-4 mr-2" />
            Mostrar Filtros
            <AnimatePresence>
              {activeFiltersCount > 0 && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="absolute -top-2 -right-2"
                >
                  <Badge 
                    variant="destructive" 
                    className="h-5 w-5 p-0 flex items-center justify-center text-xs"
                  >
                    {activeFiltersCount}
                  </Badge>
                </motion.div>
              )}
            </AnimatePresence>
            <ChevronDown 
              className={`h-4 w-4 ml-2 transition-transform duration-200 ${
                showFilters ? 'rotate-180' : ''
              }`} 
            />
          </Button>

          {/* Botão Relatórios */}
          {onOpenReports && (
            <Button
              variant="outline"
              onClick={onOpenReports}
              className="flex items-center gap-2"
            >
              <BarChart3 className="h-4 w-4" />
              Relatórios
            </Button>
          )}
        </div>

        {/* Controles de Visualização */}
        <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
          <Button
            variant={activeView === 'kanban' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onViewChange('kanban')}
            className="h-8 px-3"
          >
            <Grid3X3 className="h-4 w-4 mr-1" />
            Kanban
          </Button>
          <Button
            variant={activeView === 'list' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onViewChange('list')}
            className="h-8 px-3"
          >
            <List className="h-4 w-4 mr-1" />
            Lista
          </Button>
        </div>
      </div>

      {/* Dialog de Configuração de Campos */}
      <CRMCardConfigDialog 
        open={showCardConfig}
        onOpenChange={setShowCardConfig}
      />
    </>
  );
};

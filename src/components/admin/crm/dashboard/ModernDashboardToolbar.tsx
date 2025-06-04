
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Grid3X3, 
  List, 
  Filter, 
  Settings,
  Plus,
  ChevronDown,
  BarChart3,
  Search,
  LayoutGrid
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { CRMFilters, CRMPipeline } from '@/types/crm.types';
import { CRMCardConfigDialog } from '../card-config/CRMCardConfigDialog';

interface ModernDashboardToolbarProps {
  activeView: 'kanban' | 'list';
  onViewChange: (view: 'kanban' | 'list') => void;
  showFilters: boolean;
  onToggleFilters: () => void;
  onCreateLead: (columnId?: string) => void;
  filters: CRMFilters;
  onOpenReports?: () => void;
  // Filtros primários integrados
  pipelineId: string;
  onPipelineChange: (pipelineId: string) => void;
  pipelines: CRMPipeline[];
  searchValue: string;
  setSearchValue: (value: string) => void;
  isDebouncing: boolean;
}

export const ModernDashboardToolbar: React.FC<ModernDashboardToolbarProps> = ({
  activeView,
  onViewChange,
  showFilters,
  onToggleFilters,
  onCreateLead,
  filters,
  onOpenReports,
  pipelineId,
  onPipelineChange,
  pipelines,
  searchValue,
  setSearchValue,
  isDebouncing
}) => {
  const [showCardConfig, setShowCardConfig] = useState(false);

  // Contar filtros ativos
  const activeFiltersCount = Object.entries(filters).filter(([key, value]) => {
    if (key === 'pipeline_id') return false;
    if (Array.isArray(value)) return value.length > 0;
    return value && value !== '';
  }).length;

  return (
    <>
      <div className="bg-white border-b border-gray-200 px-8 py-4 flex-shrink-0">
        <div className="flex items-center justify-between gap-6">
          {/* Lado Esquerdo - Ações principais e filtros primários */}
          <div className="flex items-center gap-4 flex-1">
            {/* Botão Novo Lead - Destaque */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button 
                onClick={() => onCreateLead()} 
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-md border-0 px-6 py-2.5 font-medium"
              >
                <Plus className="h-4 w-4 mr-2" />
                Novo Lead
              </Button>
            </motion.div>

            {/* Pipeline Selection */}
            <div className="flex items-center gap-2 min-w-[200px]">
              <LayoutGrid className="h-4 w-4 text-gray-500" />
              <Select value={pipelineId} onValueChange={onPipelineChange}>
                <SelectTrigger className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 h-10 bg-white">
                  <SelectValue placeholder="Pipeline de Vendas" />
                </SelectTrigger>
                <SelectContent className="bg-white border border-gray-200 shadow-lg">
                  {pipelines.map(pipeline => (
                    <SelectItem key={pipeline.id} value={pipeline.id}>
                      {pipeline.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar leads..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                className="pl-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500 h-10 bg-white"
              />
              {isDebouncing && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                </div>
              )}
            </div>
          </div>

          {/* Centro - Botões de ação */}
          <div className="flex items-center gap-3">
            {/* Botão Configurar Campos */}
            <Button
              variant="outline"
              onClick={() => setShowCardConfig(true)}
              className="flex items-center gap-2 border-gray-300 hover:border-blue-400 hover:bg-blue-50"
            >
              <Settings className="h-4 w-4" />
              Configurar Campos
            </Button>

            {/* Botão Mostrar Filtros */}
            <Button 
              variant="outline" 
              onClick={onToggleFilters}
              className="relative border-gray-300 hover:border-blue-400 hover:bg-blue-50"
            >
              <Filter className="h-4 w-4 mr-2" />
              Filtros Avançados
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
                className="flex items-center gap-2 border-gray-300 hover:border-blue-400 hover:bg-blue-50"
              >
                <BarChart3 className="h-4 w-4" />
                Relatórios
              </Button>
            )}
          </div>

          {/* Lado Direito - Controles de Visualização - CORRIGIDO */}
          <div className="flex items-center bg-gray-100 rounded-lg p-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onViewChange('kanban')}
              className={`h-9 px-4 rounded-md transition-all duration-200 ${
                activeView === 'kanban' 
                  ? 'bg-white text-gray-900 shadow-sm font-medium' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'
              }`}
            >
              <Grid3X3 className="h-4 w-4 mr-2" />
              Kanban
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onViewChange('list')}
              className={`h-9 px-4 rounded-md transition-all duration-200 ${
                activeView === 'list' 
                  ? 'bg-white text-gray-900 shadow-sm font-medium' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'
              }`}
            >
              <List className="h-4 w-4 mr-2" />
              Lista
            </Button>
          </div>
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

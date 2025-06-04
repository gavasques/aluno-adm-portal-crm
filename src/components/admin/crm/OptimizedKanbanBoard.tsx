
import React, { useCallback, useMemo } from 'react';
import { DndContext, DragOverlay, closestCenter } from '@dnd-kit/core';
import { useCRMPipelines } from '@/hooks/crm/useCRMPipelines';
import { useUnifiedCRMData } from '@/hooks/crm/useUnifiedCRMData';
import { useKanbanNavigation } from '@/hooks/crm/useKanbanNavigation';
import { useUltraSimplifiedDragAndDrop } from '@/hooks/crm/useUltraSimplifiedDragAndDrop';
import { useUltraSimplifiedLeadMovement } from '@/hooks/crm/useUltraSimplifiedLeadMovement';
import { KanbanGrid } from './kanban/KanbanGrid';
import { DynamicLeadCard } from './kanban/DynamicLeadCard';
import { KanbanLoadingOverlay } from './kanban/KanbanLoadingOverlay';
import { KanbanEmptyState } from './kanban/KanbanEmptyState';
import { CRMFilters } from '@/types/crm.types';
import { debugLogger } from '@/utils/debug-logger';
import { runCORSDiagnostics } from '@/utils/cors-diagnostics';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { AlertTriangle, Wifi } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface OptimizedKanbanBoardProps {
  filters: CRMFilters;
  pipelineId: string;
  onCreateLead: (columnId?: string) => void;
}

const OptimizedKanbanBoard: React.FC<OptimizedKanbanBoardProps> = React.memo(({
  filters,
  pipelineId,
  onCreateLead
}) => {
  const kanbanBoardId = `ultra_simple_kanban_board_${Date.now()}`;
  const [connectionError, setConnectionError] = React.useState<string | null>(null);
  const [isRetrying, setIsRetrying] = React.useState(false);
  
  debugLogger.info(`🎯 [ULTRA_SIMPLE_KANBAN_BOARD_${kanbanBoardId}] RENDERIZAÇÃO (REFATORADO)`, {
    filters,
    pipelineId,
    timestamp: new Date().toISOString()
  });

  const {
    columns,
    loading: columnsLoading,
    error: columnsError
  } = useCRMPipelines();

  const activeColumns = useMemo(() => {
    const filteredColumns = columns.filter(col => 
      col.is_active && col.pipeline_id === pipelineId
    );
    
    debugLogger.info('📋 [ULTRA_SIMPLE_KANBAN] Colunas processadas (refatorado):', {
      pipelineId,
      totalColumns: columns.length,
      filteredColumns: filteredColumns.length,
      columnDetails: filteredColumns.map(col => ({
        id: col.id,
        name: col.name,
        sort_order: col.sort_order
      }))
    });
    
    return filteredColumns;
  }, [columns, pipelineId]);

  const {
    leadsWithContacts,
    leadsByColumn,
    loading: leadsLoading,
    error: leadsError
  } = useUnifiedCRMData(filters);

  // Verificar erros de conectividade
  React.useEffect(() => {
    if (columnsError || leadsError) {
      const errorMessage = columnsError?.message || leadsError?.message || '';
      if (errorMessage.includes('CORS') || errorMessage.includes('cross-origin')) {
        setConnectionError('Erro de CORS detectado. Verifique as configurações do Supabase.');
      } else {
        setConnectionError(`Erro de conectividade: ${errorMessage}`);
      }
    } else {
      setConnectionError(null);
    }
  }, [columnsError, leadsError]);

  debugLogger.info('📊 [ULTRA_SIMPLE_KANBAN] Dados dos leads (refatorado):', {
    totalLeads: leadsWithContacts.length,
    leadsByColumnCount: Object.entries(leadsByColumn).map(([columnId, leads]) => ({
      columnId,
      leadsCount: leads.length,
      leadNames: leads.map(l => l.name)
    })),
    hasConnectionError: !!connectionError
  });

  const { handleOpenDetail } = useKanbanNavigation();
  const { moveLeadToColumn } = useUltraSimplifiedLeadMovement(filters);

  const {
    draggedLead,
    isMoving,
    sensors,
    handleDragStart,
    handleDragEnd,
    isDragging,
    canDrag
  } = useUltraSimplifiedDragAndDrop({
    onMoveLeadToColumn: moveLeadToColumn
  });

  const loading = columnsLoading || leadsLoading;

  const handleLeadClick = useCallback((lead: any) => {
    debugLogger.info('🔗 [ULTRA_SIMPLE_KANBAN] Click no lead (refatorado):', {
      leadId: lead.id,
      leadName: lead.name,
      columnId: lead.column_id,
      canInteract: !isMoving && !isDragging && canDrag
    });
    
    if (isMoving || isDragging || !canDrag) {
      debugLogger.info('🚫 [ULTRA_SIMPLE_KANBAN] Click bloqueado durante operação');
      return;
    }
    
    handleOpenDetail(lead, false, false);
  }, [handleOpenDetail, isMoving, isDragging, canDrag]);

  const handleRetryConnection = async () => {
    setIsRetrying(true);
    try {
      const diagnostics = await runCORSDiagnostics();
      if (diagnostics.canConnect && !diagnostics.corsError) {
        setConnectionError(null);
        window.location.reload(); // Recarregar para tentar novamente
      }
    } catch (error) {
      console.error('Erro ao testar conectividade:', error);
    } finally {
      setIsRetrying(false);
    }
  };

  // Renderizar erro de conectividade
  if (connectionError) {
    return (
      <div className="h-full w-full flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full"
        >
          <Card className="border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 mb-4">
                <AlertTriangle className="h-6 w-6 text-red-600" />
                <h3 className="text-lg font-semibold text-red-800">
                  Erro de Conectividade
                </h3>
              </div>
              <p className="text-red-700 mb-4 text-sm">
                {connectionError}
              </p>
              <Button 
                onClick={handleRetryConnection} 
                disabled={isRetrying}
                size="sm"
                className="w-full"
              >
                {isRetrying ? 'Testando...' : 'Testar Conectividade'}
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  if (loading) {
    debugLogger.info('⏳ [ULTRA_SIMPLE_KANBAN] Estado de carregamento (refatorado)');
    return <KanbanLoadingOverlay isVisible={true} />;
  }

  if (activeColumns.length === 0) {
    debugLogger.info('📋 [ULTRA_SIMPLE_KANBAN] Nenhuma coluna ativa encontrada (refatorado)');
    return (
      <KanbanEmptyState 
        pipelineId={pipelineId}
        hasColumns={false}
      />
    );
  }

  debugLogger.info('🎮 [ULTRA_SIMPLE_KANBAN] Estado final do Kanban (refatorado):', {
    columns: activeColumns.length,
    totalLeads: leadsWithContacts.length,
    draggedLead: draggedLead?.id,
    isMoving,
    isDragging,
    canDrag,
    sensorsConfigured: !!sensors
  });

  return (
    <div className="h-full w-full flex flex-col p-8">
      {/* Indicador de status */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Wifi className="h-4 w-4 text-green-600" />
          <span>Conectado - {activeColumns.length} colunas, {leadsWithContacts.length} leads</span>
        </div>
      </div>

      <DndContext 
        sensors={sensors}
        onDragStart={handleDragStart} 
        onDragEnd={handleDragEnd}
        collisionDetection={closestCenter}
      >
        <KanbanGrid
          pipelineColumns={activeColumns}
          leadsByColumn={leadsByColumn}
          activeColumnId={draggedLead?.column_id || null}
          isDragging={isDragging}
          isMoving={isMoving}
          onOpenDetail={handleLeadClick}
          onCreateLead={onCreateLead}
          useVirtualization={leadsWithContacts.length > 50}
        />

        <DragOverlay>
          {draggedLead && (
            <div className="rotate-3 scale-105 opacity-90 z-50">
              <DynamicLeadCard 
                lead={draggedLead} 
                isDragging 
                onClick={() => {}}
              />
            </div>
          )}
        </DragOverlay>
      </DndContext>

      <KanbanLoadingOverlay isVisible={isMoving} />
      
      {isMoving && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg z-50"
        >
          <div className="flex items-center gap-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            Movendo lead... (Ultra Simplificado)
          </div>
        </motion.div>
      )}
    </div>
  );
});

OptimizedKanbanBoard.displayName = 'OptimizedKanbanBoard';

export default OptimizedKanbanBoard;

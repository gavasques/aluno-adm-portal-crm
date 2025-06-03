
import React, { useMemo, useCallback } from 'react';
import { FixedSizeList as List } from 'react-window';
import { LeadWithContacts, CRMPipelineColumn } from '@/types/crm.types';
import { DynamicLeadCard } from './kanban/DynamicLeadCard';
import { usePerformanceTracking } from '@/utils/performanceMonitor';

interface VirtualizedLeadsListProps {
  leads: LeadWithContacts[];
  column: CRMPipelineColumn;
  height: number;
  onOpenDetail: (lead: LeadWithContacts) => void;
  isOver?: boolean;
}

const ITEM_HEIGHT = 120; // Altura fixa para cada card
const OVERSCAN_COUNT = 5; // Itens extras para renderizar fora da viewport

interface ListItemProps {
  index: number;
  style: React.CSSProperties;
  data: {
    leads: LeadWithContacts[];
    onOpenDetail: (lead: LeadWithContacts) => void;
    isOver: boolean;
  };
}

const ListItem = React.memo<ListItemProps>(({ index, style, data }) => {
  const { leads, onOpenDetail, isOver } = data;
  const lead = leads[index];

  if (!lead) {
    return <div style={style} />;
  }

  return (
    <div style={{ ...style, padding: '4px' }}>
      <DynamicLeadCard
        lead={lead}
        onClick={() => onOpenDetail(lead)}
        isDragging={false}
        isOver={isOver}
      />
    </div>
  );
});

ListItem.displayName = 'VirtualizedListItem';

export const VirtualizedLeadsList: React.FC<VirtualizedLeadsListProps> = ({
  leads,
  column,
  height,
  onOpenDetail,
  isOver = false
}) => {
  const { startTiming } = usePerformanceTracking('VirtualizedLeadsList');

  // Dados memoizados para evitar re-criações desnecessárias
  const itemData = useMemo(() => ({
    leads,
    onOpenDetail,
    isOver
  }), [leads, onOpenDetail, isOver]);

  // Callback otimizado para renderização de itens
  const itemRenderer = useCallback((props: ListItemProps) => {
    const endTiming = startTiming();
    const result = <ListItem {...props} />;
    endTiming();
    return result;
  }, [startTiming]);

  // Altura total calculada
  const totalHeight = Math.min(height, leads.length * ITEM_HEIGHT);

  console.log('📊 [VIRTUALIZED_LIST] Renderizando lista virtualizada:', {
    columnId: column.id,
    columnName: column.name,
    leadsCount: leads.length,
    height: totalHeight,
    itemHeight: ITEM_HEIGHT,
    visibleItems: Math.ceil(height / ITEM_HEIGHT),
    overscan: OVERSCAN_COUNT
  });

  if (leads.length === 0) {
    return (
      <div 
        className="flex items-center justify-center text-gray-500 text-sm"
        style={{ height: Math.max(height, 200) }}
      >
        <div className="text-center">
          <p>Nenhum lead nesta coluna</p>
          <p className="text-xs text-gray-400 mt-1">
            Arraste leads para cá ou crie um novo
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <List
        height={totalHeight}
        itemCount={leads.length}
        itemSize={ITEM_HEIGHT}
        itemData={itemData}
        overscanCount={OVERSCAN_COUNT}
        className="scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
      >
        {itemRenderer}
      </List>
    </div>
  );
};

export default VirtualizedLeadsList;

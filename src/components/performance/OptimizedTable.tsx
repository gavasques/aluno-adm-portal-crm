
import React, { memo, useMemo, useCallback } from 'react';
import { FixedSizeList as List } from 'react-window';
import { Table, TableBody, TableHeader } from '@/components/ui/table';
import { useVirtualList } from '@/hooks/useVirtualList';

interface OptimizedTableProps<T> {
  data: T[];
  height?: number;
  itemHeight?: number;
  renderRow: (item: T, index: number) => React.ReactNode;
  renderHeader?: () => React.ReactNode;
  onItemClick?: (item: T, index: number) => void;
  keyExtractor: (item: T, index: number) => string;
  className?: string;
  overscan?: number;
}

// Memoized row component
const TableRow = memo<{
  index: number;
  style: any;
  data: {
    items: any[];
    renderRow: (item: any, index: number) => React.ReactNode;
    onItemClick?: (item: any, index: number) => void;
  };
}>(({ index, style, data }) => {
  const { items, renderRow, onItemClick } = data;
  const item = items[index];

  const handleClick = useCallback(() => {
    onItemClick?.(item, index);
  }, [item, index, onItemClick]);

  return (
    <div style={style} onClick={handleClick} className="cursor-pointer">
      {renderRow(item, index)}
    </div>
  );
});

TableRow.displayName = 'TableRow';

export const OptimizedTable = memo<OptimizedTableProps<any>>(({
  data,
  height = 400,
  itemHeight = 60,
  renderRow,
  renderHeader,
  onItemClick,
  keyExtractor,
  className,
  overscan = 5
}) => {
  const itemData = useMemo(() => ({
    items: data,
    renderRow,
    onItemClick
  }), [data, renderRow, onItemClick]);

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-32 text-gray-500">
        Nenhum item encontrado
      </div>
    );
  }

  return (
    <div className={className}>
      {renderHeader && (
        <Table>
          <TableHeader>
            {renderHeader()}
          </TableHeader>
        </Table>
      )}
      
      <List
        height={Math.min(height, data.length * itemHeight)}
        width="100%"
        itemCount={data.length}
        itemSize={itemHeight}
        itemData={itemData}
        itemKey={(index) => keyExtractor(data[index], index)}
        overscanCount={overscan}
      >
        {TableRow}
      </List>
    </div>
  );
});

OptimizedTable.displayName = 'OptimizedTable';

// Performance monitoring hook
export const useTablePerformance = (itemCount: number) => {
  const renderStart = performance.now();
  
  React.useEffect(() => {
    const renderTime = performance.now() - renderStart;
    
    if (renderTime > 16) { // > 1 frame at 60fps
      console.warn(`Table render took ${renderTime.toFixed(2)}ms for ${itemCount} items`);
    }
  }, [itemCount, renderStart]);

  return { renderStart };
};

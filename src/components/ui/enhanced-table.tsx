
import React, { memo } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { OptimizedTable } from '@/components/performance/OptimizedTable';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

interface EnhancedTableProps<T> {
  data: T[];
  columns: {
    key: string;
    label: string;
    render: (item: T, index: number) => React.ReactNode;
    className?: string;
    sortable?: boolean;
  }[];
  keyExtractor: (item: T, index: number) => string;
  onRowClick?: (item: T, index: number) => void;
  loading?: boolean;
  emptyMessage?: string;
  virtualizeThreshold?: number;
  className?: string;
}

export const EnhancedTable = memo<EnhancedTableProps<any>>(({
  data,
  columns,
  keyExtractor,
  onRowClick,
  loading = false,
  emptyMessage = 'Nenhum item encontrado',
  virtualizeThreshold = 100,
  className
}) => {
  const isMobile = useIsMobile();

  // Use virtualization for large datasets
  const shouldVirtualize = data.length > virtualizeThreshold;

  const renderHeader = () => (
    <TableRow>
      {columns.map((column) => (
        <TableHead 
          key={column.key}
          className={cn(
            'font-semibold text-gray-900',
            'focus:outline-none focus:ring-2 focus:ring-blue-500',
            column.sortable && 'cursor-pointer hover:bg-gray-50',
            column.className
          )}
          tabIndex={column.sortable ? 0 : -1}
          role={column.sortable ? 'button' : undefined}
          aria-sort={column.sortable ? 'none' : undefined}
        >
          {column.label}
        </TableHead>
      ))}
    </TableRow>
  );

  const renderRow = (item: any, index: number) => (
    <TableRow
      key={keyExtractor(item, index)}
      className={cn(
        'hover:bg-gray-50 transition-colors',
        'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset',
        onRowClick && 'cursor-pointer'
      )}
      onClick={() => onRowClick?.(item, index)}
      onKeyDown={(e) => {
        if ((e.key === 'Enter' || e.key === ' ') && onRowClick) {
          e.preventDefault();
          onRowClick(item, index);
        }
      }}
      tabIndex={onRowClick ? 0 : -1}
      role={onRowClick ? 'button' : undefined}
      aria-label={onRowClick ? `Ver detalhes do item ${index + 1}` : undefined}
    >
      {columns.map((column) => (
        <TableCell
          key={column.key}
          className={cn(
            'py-3 px-4',
            column.className
          )}
        >
          {column.render(item, index)}
        </TableCell>
      ))}
    </TableRow>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
        <span className="sr-only">Carregando dados...</span>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        {emptyMessage}
      </div>
    );
  }

  if (shouldVirtualize && !isMobile) {
    return (
      <OptimizedTable
        data={data}
        renderHeader={renderHeader}
        renderRow={renderRow}
        keyExtractor={keyExtractor}
        onItemClick={onRowClick}
        className={className}
      />
    );
  }

  return (
    <Table className={className}>
      <TableHeader>
        {renderHeader()}
      </TableHeader>
      <TableBody>
        {data.map((item, index) => renderRow(item, index))}
      </TableBody>
    </Table>
  );
});

EnhancedTable.displayName = 'EnhancedTable';

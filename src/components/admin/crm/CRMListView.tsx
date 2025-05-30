import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { EnhancedTable } from '@/components/ui/enhanced-table';
import { 
  Search, 
  Download, 
  Eye, 
  Edit, 
  Trash2, 
  UserPlus,
  ArrowUpDown,
  Calendar,
  Mail,
  Phone
} from 'lucide-react';
import { CRMFiltersType, CRMLead } from '@/types/crm.types';
import { useCRMLeads } from '@/hooks/crm/useCRMLeads';
import { usePagination } from '@/hooks/usePagination';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { toast } from 'sonner';

interface CRMListViewProps {
  filters: CRMFiltersType;
  onOpenDetail?: (lead: CRMLead) => void;
  onEditLead?: (lead: CRMLead) => void;
}

const CRMListView = ({ filters, onOpenDetail, onEditLead }: CRMListViewProps) => {
  const navigate = useNavigate();
  const { leads, loading, deleteLead } = useCRMLeads(filters);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<keyof CRMLead>('created_at');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  // Filtrar e ordenar leads
  const filteredAndSortedLeads = useMemo(() => {
    let filtered = leads.filter(lead => 
      lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (lead.phone && lead.phone.includes(searchTerm))
    );

    // Ordenação
    filtered.sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      
      if (aValue === null || aValue === undefined) return 1;
      if (bValue === null || bValue === undefined) return -1;
      
      let comparison = 0;
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        comparison = aValue.localeCompare(bValue);
      } else if (typeof aValue === 'number' && typeof bValue === 'number') {
        comparison = aValue - bValue;
      } else if (aValue instanceof Date && bValue instanceof Date) {
        comparison = aValue.getTime() - bValue.getTime();
      } else {
        comparison = String(aValue).localeCompare(String(bValue));
      }
      
      return sortDirection === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [leads, searchTerm, sortField, sortDirection]);

  // Paginação
  const { paginatedItems: paginatedLeads, pageInfo } = usePagination({
    items: filteredAndSortedLeads,
    pageSize,
    currentPage
  });

  const handleSort = (field: keyof CRMLead) => {
    if (field === sortField) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleDelete = async (lead: CRMLead) => {
    if (window.confirm(`Tem certeza que deseja excluir o lead "${lead.name}"?`)) {
      try {
        await deleteLead(lead.id);
        toast.success('Lead excluído com sucesso');
      } catch (error) {
        toast.error('Erro ao excluir lead');
      }
    }
  };

  const exportToCSV = () => {
    const headers = ['Nome', 'Email', 'Telefone', 'Empresa', 'Status', 'Responsável', 'Criado em'];
    const csvContent = [
      headers.join(','),
      ...filteredAndSortedLeads.map(lead => [
        `"${lead.name}"`,
        `"${lead.email}"`,
        `"${lead.phone || ''}"`,
        `"${lead.has_company ? 'Sim' : 'Não'}"`,
        `"${lead.column?.name || 'Sem coluna'}"`,
        `"${lead.responsible?.name || 'Não atribuído'}"`,
        `"${new Date(lead.created_at).toLocaleDateString('pt-BR')}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `leads-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    toast.success('Dados exportados com sucesso');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const columns = [
    {
      key: 'name',
      label: 'Nome',
      sortable: true,
      render: (lead: CRMLead) => (
        <div className="flex items-center space-x-2">
          <div>
            <div className="font-medium text-gray-900">{lead.name}</div>
            <div className="text-sm text-gray-500 flex items-center">
              <Mail className="h-3 w-3 mr-1" />
              {lead.email}
            </div>
          </div>
        </div>
      )
    },
    {
      key: 'phone',
      label: 'Contato',
      render: (lead: CRMLead) => (
        <div className="text-sm">
          {lead.phone && (
            <div className="flex items-center text-gray-600">
              <Phone className="h-3 w-3 mr-1" />
              {lead.phone}
            </div>
          )}
          {lead.scheduled_contact_date && (
            <div className="flex items-center text-gray-600 mt-1">
              <Calendar className="h-3 w-3 mr-1" />
              {formatDate(lead.scheduled_contact_date)}
            </div>
          )}
        </div>
      )
    },
    {
      key: 'has_company',
      label: 'Empresa',
      render: (lead: CRMLead) => (
        <div className="text-sm">
          <Badge variant={lead.has_company ? 'default' : 'secondary'}>
            {lead.has_company ? 'Tem empresa' : 'Pessoa física'}
          </Badge>
          {lead.what_sells && (
            <div className="text-xs text-gray-500 mt-1 max-w-32 truncate">
              {lead.what_sells}
            </div>
          )}
        </div>
      )
    },
    {
      key: 'column_id',
      label: 'Status',
      render: (lead: CRMLead) => (
        <div>
          {lead.column ? (
            <Badge 
              variant="outline"
              style={{ 
                backgroundColor: lead.column.color + '15',
                borderColor: lead.column.color + '30',
                color: lead.column.color
              }}
            >
              {lead.column.name}
            </Badge>
          ) : (
            <Badge variant="secondary">Sem status</Badge>
          )}
        </div>
      )
    },
    {
      key: 'responsible_id',
      label: 'Responsável',
      render: (lead: CRMLead) => (
        <div className="text-sm">
          {lead.responsible ? (
            <div>
              <div className="font-medium">{lead.responsible.name}</div>
              <div className="text-xs text-gray-500">{lead.responsible.email}</div>
            </div>
          ) : (
            <span className="text-gray-400">Não atribuído</span>
          )}
        </div>
      )
    },
    {
      key: 'qualification',
      label: 'Qualificação',
      render: (lead: CRMLead) => (
        <div className="space-y-1">
          {lead.ready_to_invest_3k && (
            <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
              R$ 3k OK
            </Badge>
          )}
          {lead.seeks_private_label && (
            <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
              Private Label
            </Badge>
          )}
          {lead.sells_on_amazon && (
            <Badge variant="outline" className="text-xs bg-orange-50 text-orange-700 border-orange-200">
              Amazon
            </Badge>
          )}
        </div>
      )
    },
    {
      key: 'created_at',
      label: 'Criado em',
      sortable: true,
      render: (lead: CRMLead) => (
        <div className="text-sm text-gray-600">
          {formatDate(lead.created_at)}
        </div>
      )
    },
    {
      key: 'actions',
      label: 'Ações',
      render: (lead: CRMLead) => (
        <div className="flex items-center space-x-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onOpenDetail?.(lead)}
            className="h-8 w-8 p-0"
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEditLead?.(lead)}
            className="h-8 w-8 p-0"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDelete(lead)}
            className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      )
    }
  ];

  const handleViewDetails = (lead: CRMLead) => {
    navigate(`/admin/crm/lead/${lead.id}`);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <CardTitle>Lista de Leads ({filteredAndSortedLeads.length})</CardTitle>
          
          <div className="flex flex-col md:flex-row items-stretch md:items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar leads..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full md:w-64"
              />
            </div>
            
            <Select value={pageSize.toString()} onValueChange={(value) => setPageSize(Number(value))}>
              <SelectTrigger className="w-full md:w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10 por página</SelectItem>
                <SelectItem value="25">25 por página</SelectItem>
                <SelectItem value="50">50 por página</SelectItem>
                <SelectItem value="100">100 por página</SelectItem>
              </SelectContent>
            </Select>
            
            <Button onClick={exportToCSV} variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Exportar CSV
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <EnhancedTable
          data={paginatedLeads}
          columns={columns.map(col => ({
            ...col,
            className: col.key === 'actions' ? 'w-32' : undefined
          }))}
          keyExtractor={(lead) => lead.id}
          onRowClick={handleViewDetails}
          loading={loading}
          emptyMessage="Nenhum lead encontrado com os filtros aplicados."
        />

        {pageInfo.totalPages > 1 && (
          <div className="flex items-center justify-between mt-6">
            <div className="text-sm text-gray-500">
              Mostrando {pageInfo.startIndex} a {pageInfo.endIndex} de {pageInfo.totalItems} leads
            </div>
            
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    className={!pageInfo.hasPreviousPage ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                  />
                </PaginationItem>
                
                {Array.from({ length: Math.min(5, pageInfo.totalPages) }, (_, i) => {
                  const page = i + 1;
                  return (
                    <PaginationItem key={page}>
                      <PaginationLink
                        onClick={() => setCurrentPage(page)}
                        isActive={currentPage === page}
                        className="cursor-pointer"
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  );
                })}
                
                <PaginationItem>
                  <PaginationNext 
                    onClick={() => setCurrentPage(prev => Math.min(pageInfo.totalPages, prev + 1))}
                    className={!pageInfo.hasNextPage ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CRMListView;


import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { CRMFilters, CRMLead, CRMPipelineColumn } from "@/types/crm.types";
import { useCRMData } from "@/hooks/crm/useCRMData";
import { useNavigate } from "react-router-dom";

interface ListViewProps {
  filters: CRMFilters;
  columns: CRMPipelineColumn[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onOpenLeadDetails?: (lead: CRMLead) => void;
}

const ListView = React.memo(({ 
  filters, 
  columns, 
  searchQuery, 
  onSearchChange, 
  onOpenLeadDetails 
}: ListViewProps) => {
  const navigate = useNavigate();
  const { leadsWithContacts, loading } = useCRMData(filters);

  const handleOpenLeadDetails = (lead: CRMLead) => {
    console.log('🔗 ListView - Navigating to lead detail (new page):', lead.id);
    if (onOpenLeadDetails) {
      onOpenLeadDetails(lead);
    } else {
      navigate(`/admin/lead/${lead.id}`);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getColumnInfo = (columnId?: string) => {
    if (!columnId) return { name: 'Não definido', color: '#6b7280' };
    const column = columns.find(col => col.id === columnId);
    return column ? { name: column.name, color: column.color } : { name: 'Não definido', color: '#6b7280' };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="sticky top-0 z-10 bg-white border-b p-4">
        <div className="mb-4 w-full max-w-sm">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input 
              placeholder="Buscar leads..." 
              value={searchQuery} 
              onChange={e => onSearchChange(e.target.value)} 
              className="pl-8" 
            />
          </div>
        </div>
      </div>
      <div className="p-4">
        <ScrollArea className="h-[calc(100vh-350px)]">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead className="sticky top-0 bg-white z-10">
                <tr className="bg-gray-50">
                  <th className="px-4 py-2 text-left">Nome</th>
                  <th className="px-4 py-2 text-left">Email</th>
                  <th className="px-4 py-2 text-left">Telefone</th>
                  <th className="px-4 py-2 text-left">Responsável</th>
                  <th className="px-4 py-2 text-left">Estágio</th>
                  <th className="px-4 py-2 text-left">Criado em</th>
                  <th className="px-4 py-2 text-left">Ações</th>
                </tr>
              </thead>
              <tbody>
                {leadsWithContacts.map(lead => {
                  const columnInfo = getColumnInfo(lead.column_id);
                  return (
                    <tr key={lead.id} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium">{lead.name}</td>
                      <td className="px-4 py-3">{lead.email}</td>
                      <td className="px-4 py-3">{lead.phone || '-'}</td>
                      <td className="px-4 py-3">{lead.responsible?.name || 'Sem responsável'}</td>
                      <td className="px-4 py-3">
                        <Badge 
                          variant="outline" 
                          className="text-xs"
                          style={{ 
                            backgroundColor: columnInfo.color + '15', 
                            color: columnInfo.color,
                            borderColor: columnInfo.color + '30'
                          }}
                        >
                          {columnInfo.name}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500">
                        {formatDate(lead.created_at)}
                      </td>
                      <td className="px-4 py-3">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleOpenLeadDetails(lead)}
                          className="flex items-center gap-1"
                        >
                          <Eye className="h-4 w-4" />
                          Ver Detalhes
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {leadsWithContacts.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                Nenhum lead encontrado com os critérios de busca.
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
});

ListView.displayName = 'ListView';

export default ListView;

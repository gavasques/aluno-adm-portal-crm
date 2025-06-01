
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, Eye, Loader2, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CRMFilters, CRMLead, CRMPipelineColumn } from "@/types/crm.types";
import { useOptimizedCRMData } from "@/hooks/crm/useOptimizedCRMData";
import { useNavigate } from "react-router-dom";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { cn } from "@/lib/utils";

interface OptimizedListViewProps {
  filters: CRMFilters;
  columns: CRMPipelineColumn[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onOpenLeadDetails?: (lead: CRMLead) => void;
}

const OptimizedListView = React.memo(({ 
  filters, 
  columns, 
  searchQuery, 
  onSearchChange, 
  onOpenLeadDetails 
}: OptimizedListViewProps) => {
  const navigate = useNavigate();
  const [debouncedSearch, isSearching] = useDebouncedValue(searchQuery, 300);
  const { leadsWithContacts, loading } = useOptimizedCRMData({
    ...filters,
    search: debouncedSearch
  });

  const handleOpenLeadDetails = (lead: CRMLead) => {
    console.log('🔗 OptimizedListView - Navigating to modern lead detail page:', lead.id);
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

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const getContactInfo = (lead: any) => {
    if (lead.pending_contacts && lead.pending_contacts.length > 0) {
      const nextContact = lead.pending_contacts[0];
      const contactDate = new Date(nextContact.contact_date);
      const isToday = contactDate.toDateString() === new Date().toDateString();
      const isTomorrow = contactDate.toDateString() === new Date(Date.now() + 86400000).toDateString();
      
      if (isToday) return { text: 'Hoje', icon: Clock, color: 'text-red-600' };
      if (isTomorrow) return { text: 'Amanhã', icon: Clock, color: 'text-orange-600' };
      return { text: contactDate.toLocaleDateString('pt-BR'), icon: Clock, color: 'text-gray-600' };
    }
    return null;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
          <span className="text-gray-600">Carregando leads...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Search and Filters Bar */}
      <div className="border-b border-gray-200 p-4">
        <div className="flex items-center gap-4 mb-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input 
              placeholder="Buscar leads..." 
              value={searchQuery} 
              onChange={e => onSearchChange(e.target.value)} 
              className="pl-10 border-gray-300" 
            />
            {isSearching && (
              <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 animate-spin text-gray-400" />
            )}
          </div>
        </div>

        {/* Active Filters */}
        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant="secondary" className="bg-blue-100 text-blue-800 border-blue-200">
            Contato: Hoje
          </Badge>
          <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">
            Responsável: Alex Silva
          </Badge>
          <Badge variant="secondary" className="bg-purple-100 text-purple-800 border-purple-200">
            Tag: Prioridade Alta
          </Badge>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200 sticky top-0 z-10">
              <tr>
                <th className="w-8 px-4 py-3">
                  <Checkbox />
                </th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-700">LEAD</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-700">STATUS</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-700">VALOR</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-700">RESPONSÁVEL</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-700">CONTATO</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-700">TAGS</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-700">AÇÕES</th>
              </tr>
            </thead>
            <tbody>
              {leadsWithContacts.map((lead, index) => {
                const columnInfo = getColumnInfo(lead.column_id);
                const contactInfo = getContactInfo(lead);
                
                return (
                  <tr 
                    key={lead.id} 
                    className={cn(
                      "border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer",
                      index % 2 === 0 ? "bg-white" : "bg-gray-50/30"
                    )}
                    onClick={() => handleOpenLeadDetails(lead)}
                  >
                    <td className="px-4 py-4">
                      <Checkbox onClick={(e) => e.stopPropagation()} />
                    </td>
                    
                    {/* Lead Info */}
                    <td className="px-4 py-4">
                      <div>
                        <div className="font-medium text-gray-900">{lead.name}</div>
                        <div className="text-sm text-gray-500">{lead.email}</div>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-2 h-2 rounded-full" 
                          style={{ backgroundColor: columnInfo.color }}
                        />
                        <span className="text-sm text-gray-700">{columnInfo.name}</span>
                      </div>
                    </td>

                    {/* Value */}
                    <td className="px-4 py-4">
                      <span className="text-sm font-medium text-gray-900">
                        R$ 15.000
                      </span>
                    </td>

                    {/* Responsible */}
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarFallback className="text-xs bg-blue-100 text-blue-600">
                            {lead.responsible?.name?.split(' ').map(n => n[0]).join('') || 'NN'}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm text-gray-700">
                          {lead.responsible?.name || 'Sem responsável'}
                        </span>
                      </div>
                    </td>

                    {/* Contact */}
                    <td className="px-4 py-4">
                      {contactInfo ? (
                        <div className="flex items-center gap-1">
                          <contactInfo.icon className={cn("h-4 w-4", contactInfo.color)} />
                          <span className={cn("text-sm", contactInfo.color)}>
                            {contactInfo.text}
                          </span>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-400">-</span>
                      )}
                    </td>

                    {/* Tags */}
                    <td className="px-4 py-4">
                      <div className="flex gap-1">
                        {lead.tags && lead.tags.length > 0 ? (
                          lead.tags.slice(0, 2).map((tag) => (
                            <Badge 
                              key={tag.id}
                              variant="outline" 
                              className="text-xs px-2 py-0"
                              style={{ 
                                backgroundColor: tag.color + '15', 
                                color: tag.color,
                                borderColor: tag.color + '30'
                              }}
                            >
                              {tag.name}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-sm text-gray-400">-</span>
                        )}
                        {lead.tags && lead.tags.length > 2 && (
                          <Badge variant="secondary" className="text-xs">
                            +{lead.tags.length - 2}
                          </Badge>
                        )}
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-1">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenLeadDetails(lead);
                          }}
                          className="h-8 w-8 p-0 hover:bg-gray-100"
                        >
                          <Eye className="h-4 w-4 text-gray-500" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {leadsWithContacts.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              {debouncedSearch ? 
                `Nenhum lead encontrado para "${debouncedSearch}"` : 
                'Nenhum lead encontrado com os critérios de busca.'
              }
            </div>
          )}
        </ScrollArea>
      </div>
    </div>
  );
});

OptimizedListView.displayName = 'OptimizedListView';

export default OptimizedListView;

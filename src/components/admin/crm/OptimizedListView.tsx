import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, Eye, Loader2, Clock, Plus } from "lucide-react";
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
  onCreateLead?: () => void;
}
const OptimizedListView = React.memo(({
  filters,
  columns,
  searchQuery,
  onSearchChange,
  onOpenLeadDetails,
  onCreateLead
}: OptimizedListViewProps) => {
  const navigate = useNavigate();
  const [debouncedSearch, isSearching] = useDebouncedValue(searchQuery, 300);
  const {
    leadsWithContacts,
    loading
  } = useOptimizedCRMData({
    ...filters,
    search: debouncedSearch
  });
  const handleOpenLeadDetails = (lead: CRMLead) => {
    console.log('🔗 OptimizedListView - Navigating to lead detail page:', lead.id);
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
    if (!columnId) return {
      name: 'Não definido',
      color: '#6b7280'
    };
    const column = columns.find(col => col.id === columnId);
    return column ? {
      name: column.name,
      color: column.color
    } : {
      name: 'Não definido',
      color: '#6b7280'
    };
  };
  const getContactInfo = (lead: any) => {
    if (lead.pending_contacts && lead.pending_contacts.length > 0) {
      const nextContact = lead.pending_contacts[0];
      const contactDate = new Date(nextContact.contact_date);
      const isToday = contactDate.toDateString() === new Date().toDateString();
      const isTomorrow = contactDate.toDateString() === new Date(Date.now() + 86400000).toDateString();
      if (isToday) return {
        text: 'Hoje',
        icon: Clock,
        color: 'text-red-600'
      };
      if (isTomorrow) return {
        text: 'Amanhã',
        icon: Clock,
        color: 'text-orange-600'
      };
      return {
        text: contactDate.toLocaleDateString('pt-BR'),
        icon: Clock,
        color: 'text-gray-600'
      };
    }
    return null;
  };
  const getLastContactInfo = (lead: any) => {
    if (lead.last_completed_contact) {
      const lastContact = lead.last_completed_contact;
      const contactDate = new Date(lastContact.completed_at || lastContact.contact_date);
      return {
        text: contactDate.toLocaleDateString('pt-BR'),
        type: lastContact.contact_type
      };
    }
    return null;
  };
  if (loading) {
    return <div className="flex items-center justify-center py-12">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
          <span className="text-gray-600">Carregando leads...</span>
        </div>
      </div>;
  }
  return <div className="h-full flex flex-col bg-white">
      {/* Header with Title and New Lead Button */}
      

      {/* Search and Filters */}
      

      {/* Table */}
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200 sticky top-0 z-10">
              <tr>
                <th className="w-12 px-6 py-4 text-left">
                  <Checkbox />
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">
                  LEAD
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">
                  STATUS
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">
                  RESPONSÁVEL
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">
                  ÚLTIMO CONTATO
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">
                  PRÓXIMO CONTATO
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">
                  TAGS
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">
                  AÇÕES
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {leadsWithContacts.map(lead => {
              const columnInfo = getColumnInfo(lead.column_id);
              const nextContactInfo = getContactInfo(lead);
              const lastContactInfo = getLastContactInfo(lead);
              return <tr key={lead.id} className="hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => handleOpenLeadDetails(lead)}>
                    <td className="px-6 py-4">
                      <Checkbox onClick={e => e.stopPropagation()} />
                    </td>
                    
                    {/* Lead Info */}
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium text-gray-900">{lead.name}</div>
                        <div className="text-sm text-gray-500">{lead.email}</div>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full" style={{
                      backgroundColor: columnInfo.color
                    }} />
                        <span className="text-sm text-gray-700">{columnInfo.name}</span>
                      </div>
                    </td>

                    {/* Responsible */}
                    <td className="px-6 py-4">
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

                    {/* Last Contact */}
                    <td className="px-6 py-4">
                      {lastContactInfo ? <div className="text-sm text-gray-600">
                          {lastContactInfo.text}
                        </div> : <span className="text-sm text-gray-400">-</span>}
                    </td>

                    {/* Next Contact */}
                    <td className="px-6 py-4">
                      {nextContactInfo ? <div className="flex items-center gap-1">
                          <nextContactInfo.icon className={cn("h-4 w-4", nextContactInfo.color)} />
                          <span className={cn("text-sm", nextContactInfo.color)}>
                            {nextContactInfo.text}
                          </span>
                        </div> : <span className="text-sm text-gray-400">-</span>}
                    </td>

                    {/* Tags */}
                    <td className="px-6 py-4">
                      <div className="flex gap-1">
                        {lead.tags && lead.tags.length > 0 ? lead.tags.slice(0, 2).map(tag => <Badge key={tag.id} variant="secondary" className="text-xs px-2 py-1" style={{
                      backgroundColor: tag.color + '15',
                      color: tag.color,
                      borderColor: tag.color + '30'
                    }}>
                              {tag.name}
                            </Badge>) : <span className="text-sm text-gray-400">-</span>}
                        {lead.tags && lead.tags.length > 2 && <Badge variant="secondary" className="text-xs">
                            +{lead.tags.length - 2}
                          </Badge>}
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4">
                      <Button variant="ghost" size="sm" onClick={e => {
                    e.stopPropagation();
                    handleOpenLeadDetails(lead);
                  }} className="h-8 w-8 p-0 hover:bg-gray-100">
                        <Eye className="h-4 w-4 text-gray-500" />
                      </Button>
                    </td>
                  </tr>;
            })}
            </tbody>
          </table>

          {/* Empty State */}
          {leadsWithContacts.length === 0 && <div className="text-center py-12 text-gray-500">
              {debouncedSearch ? `Nenhum lead encontrado para "${debouncedSearch}"` : 'Nenhum lead encontrado com os critérios de busca.'}
            </div>}
        </ScrollArea>
      </div>

      {/* Footer Stats */}
      
    </div>;
});
OptimizedListView.displayName = 'OptimizedListView';
export default OptimizedListView;
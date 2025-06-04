
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Eye, Plus } from 'lucide-react';
import { CRMFilters, CRMLead } from '@/types/crm.types';
import { useCRMData } from '@/hooks/crm/useCRMData';
import { motion } from 'framer-motion';

interface OptimizedListViewProps {
  filters: CRMFilters;
  onCreateLead: (columnId?: string) => void;
}

const OptimizedListView: React.FC<OptimizedListViewProps> = ({ 
  filters, 
  onCreateLead 
}) => {
  const { leadsWithContacts, loading, error } = useCRMData(filters);
  const [searchTerm, setSearchTerm] = React.useState('');

  console.log('🔍 OptimizedListView: Loading state:', loading);
  console.log('🔍 OptimizedListView: Error state:', error);
  console.log('🔍 OptimizedListView: Leads count:', leadsWithContacts?.length || 0);

  // Filtrar leads baseado no termo de busca
  const filteredLeads = React.useMemo(() => {
    if (!searchTerm.trim()) return leadsWithContacts;
    
    return leadsWithContacts.filter(lead => 
      lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (lead.phone && lead.phone.includes(searchTerm))
    );
  }, [leadsWithContacts, searchTerm]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ganho': return 'bg-green-100 text-green-800';
      case 'perdido': return 'bg-red-100 text-red-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  const handleLeadClick = (lead: CRMLead) => {
    console.log('🔗 OptimizedListView: Lead clicked:', lead.id);
    // Aqui você pode adicionar navegação para detalhes do lead
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <p className="text-red-700">Erro ao carregar leads: {error.message}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header da Lista */}
      <div className="border-b border-gray-200 p-4 bg-gray-50">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 flex-1">
            <h2 className="text-lg font-semibold text-gray-900">
              Lista de Leads ({filteredLeads.length})
            </h2>
            
            {/* Campo de busca */}
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar por nome, email ou telefone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <Button 
            onClick={() => onCreateLead()}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Novo Lead
          </Button>
        </div>
      </div>

      {/* Conteúdo da Lista */}
      <div className="flex-1 overflow-auto">
        {filteredLeads.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <p className="text-gray-500 mb-4">
                {searchTerm ? 'Nenhum lead encontrado com os critérios de busca' : 'Nenhum lead encontrado'}
              </p>
              {!searchTerm && (
                <Button onClick={() => onCreateLead()} variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Criar Primeiro Lead
                </Button>
              )}
            </div>
          </div>
        ) : (
          <div className="p-4">
            <div className="space-y-3">
              {filteredLeads.map((lead, index) => (
                <motion.div
                  key={lead.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <Card className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-gray-900">{lead.name}</h3>
                            <Badge className={getStatusColor(lead.status)}>
                              {lead.status}
                            </Badge>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-gray-600">
                            <div>
                              <span className="font-medium">Email:</span> {lead.email}
                            </div>
                            <div>
                              <span className="font-medium">Telefone:</span> {lead.phone || 'Não informado'}
                            </div>
                            <div>
                              <span className="font-medium">Responsável:</span> {lead.responsible?.name || 'Não atribuído'}
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                            <span>Criado em: {formatDate(lead.created_at)}</span>
                            {lead.pipeline?.name && (
                              <span>Pipeline: {lead.pipeline.name}</span>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleLeadClick(lead)}
                            className="text-blue-600 hover:text-blue-700"
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            Ver Detalhes
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OptimizedListView;


import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger, TabsTriggerWithBadge } from '@/components/ui/tabs';
import { 
  User, 
  FileText, 
  MessageSquare, 
  Clock,
  Calendar
} from 'lucide-react';
import { motion } from 'framer-motion';
import { LeadDetailHeader } from '@/components/admin/crm/lead-detail/LeadDetailHeader';
import { ConditionalLeadDetailOverview } from '@/components/admin/crm/lead-detail/ConditionalLeadDetailOverview';
import LeadAttachmentsTab from '@/components/admin/crm/lead-detail-tabs/LeadAttachmentsTab';
import LeadCommentsTab from '@/components/admin/crm/lead-detail-tabs/LeadCommentsTab';
import LeadHistoryTab from '@/components/admin/crm/lead-detail-tabs/LeadHistoryTab';
import LeadContactsTab from '@/components/admin/crm/lead-detail-tabs/LeadContactsTab';
import { useCRMLeadDetail } from '@/hooks/crm/useCRMLeadDetail';
import { Alert, AlertDescription } from '@/components/ui/alert';

const LeadDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: lead, isLoading: loading, error, refetch } = useCRMLeadDetail(id || '');
  
  // Estados para edição
  const [isEditing, setIsEditing] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  console.log('🎯 LeadDetail - id:', id, 'lead:', lead, 'loading:', loading, 'error:', error);

  const handleBack = () => {
    if (isEditing && hasChanges) {
      const confirm = window.confirm('Você tem alterações não salvas. Deseja sair mesmo assim?');
      if (!confirm) return;
    }
    navigate('/admin/crm');
  };

  const handleLeadUpdate = () => {
    console.log('🔄 Lead updated, refetching data...');
    refetch();
    setIsEditing(false);
    setHasChanges(false);
  };

  const handleToggleEdit = () => {
    if (isEditing && hasChanges) {
      const confirm = window.confirm('Você tem alterações não salvas. Deseja cancelar as alterações?');
      if (!confirm) return;
    }
    setIsEditing(!isEditing);
    setHasChanges(false);
  };

  const handleSave = async () => {
    if ((window as any).saveLeadData) {
      await (window as any).saveLeadData();
      setIsEditing(false);
      setHasChanges(false);
    }
  };

  const handleDataChange = (changes: boolean) => {
    setHasChanges(changes);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Carregando detalhes do lead...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <Button onClick={handleBack} variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar para CRM
          </Button>
        </div>
        
        <Alert variant="destructive">
          <AlertDescription>
            {error.message}
          </AlertDescription>
        </Alert>
        
        <div className="mt-4">
          <p className="text-sm text-muted-foreground">
            Lead ID: {id}
          </p>
        </div>
      </div>
    );
  }

  if (!lead) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-12">
          <p className="text-red-600 mb-4">
            Lead não encontrado (ID: {id})
          </p>
          <Button onClick={handleBack} variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar para CRM
          </Button>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="container mx-auto p-6 space-y-6"
    >
      {/* Breadcrumb e navegação */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleBack}
            className="p-0 h-auto hover:bg-transparent hover:text-blue-600"
            disabled={isEditing && hasChanges}
          >
            CRM
          </Button>
          <span>/</span>
          <span>Lead</span>
          <span>/</span>
          <span className="font-medium text-gray-900">{lead.name}</span>
          {isEditing && (
            <>
              <span>/</span>
              <span className="font-medium text-blue-600">Editando</span>
            </>
          )}
        </div>
        
        <Button 
          onClick={handleBack} 
          variant="outline"
          disabled={isEditing && hasChanges}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
      </div>

      {/* Header do Lead */}
      <div className="bg-white rounded-2xl border border-gray-200/50 shadow-lg overflow-hidden">
        <LeadDetailHeader 
          lead={lead} 
          onClose={handleBack} 
          onLeadUpdate={handleLeadUpdate}
          isEditing={isEditing}
          onToggleEdit={handleToggleEdit}
          onSave={handleSave}
          hasChanges={hasChanges}
        />
      </div>

      {/* Conteúdo Principal */}
      <div className="bg-white rounded-2xl border border-gray-200/50 shadow-lg overflow-hidden">
        <Tabs defaultValue="overview" className="w-full">
          <div className="border-b border-gray-200/50 bg-gray-50/50 px-6">
            <TabsList className="bg-white/80 backdrop-blur-sm border border-white/20 shadow-sm">
              <TabsTrigger 
                value="overview" 
                className="flex items-center gap-2"
                disabled={isEditing}
              >
                <User className="h-4 w-4" />
                Visão Geral & Dados
                {isEditing && (
                  <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full">
                    Editando
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger 
                value="contacts" 
                className="flex items-center gap-2"
                disabled={isEditing}
              >
                <Calendar className="h-4 w-4" />
                Contatos
              </TabsTrigger>
              <TabsTriggerWithBadge 
                value="attachments" 
                badgeContent="3"
                className="flex items-center gap-2"
                disabled={isEditing}
              >
                <FileText className="h-4 w-4" />
                Anexos
              </TabsTriggerWithBadge>
              <TabsTriggerWithBadge 
                value="comments" 
                badgeContent="2"
                className="flex items-center gap-2"
                disabled={isEditing}
              >
                <MessageSquare className="h-4 w-4" />
                Comentários
              </TabsTriggerWithBadge>
              <TabsTrigger 
                value="history" 
                className="flex items-center gap-2"
                disabled={isEditing}
              >
                <Clock className="h-4 w-4" />
                Histórico
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="p-6">
            <TabsContent value="overview" className="mt-0">
              <ConditionalLeadDetailOverview 
                lead={lead}
                isEditing={isEditing}
                onDataChange={handleDataChange}
                onLeadUpdate={handleLeadUpdate}
              />
            </TabsContent>
            
            <TabsContent value="contacts" className="mt-0">
              <LeadContactsTab leadId={lead.id} />
            </TabsContent>
            
            <TabsContent value="attachments" className="mt-0">
              <LeadAttachmentsTab leadId={lead.id} />
            </TabsContent>
            
            <TabsContent value="comments" className="mt-0">
              <LeadCommentsTab leadId={lead.id} />
            </TabsContent>
            
            <TabsContent value="history" className="mt-0">
              <LeadHistoryTab leadId={lead.id} />
            </TabsContent>
          </div>
        </Tabs>
      </div>

      {/* Indicador de alterações não salvas */}
      {isEditing && hasChanges && (
        <div className="fixed bottom-4 right-4 bg-amber-100 border border-amber-300 text-amber-800 px-4 py-2 rounded-lg shadow-lg">
          <p className="text-sm font-medium">Você tem alterações não salvas</p>
        </div>
      )}
    </motion.div>
  );
};

export default LeadDetail;

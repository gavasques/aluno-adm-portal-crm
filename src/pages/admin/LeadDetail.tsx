
import React from 'react';
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
import { LeadDetailOverview } from '@/components/admin/crm/lead-detail/LeadDetailOverview';
import LeadAttachmentsTab from '@/components/admin/crm/lead-detail-tabs/LeadAttachmentsTab';
import LeadCommentsTab from '@/components/admin/crm/lead-detail-tabs/LeadCommentsTab';
import LeadHistoryTab from '@/components/admin/crm/lead-detail-tabs/LeadHistoryTab';
import LeadContactsTab from '@/components/admin/crm/lead-detail-tabs/LeadContactsTab';
import { useCRMLeadDetail } from '@/hooks/crm/useCRMLeadDetail';
import { Alert, AlertDescription } from '@/components/ui/alert';

const LeadDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { lead, loading, error, refetch } = useCRMLeadDetail(id || '');

  console.log('🎯 LeadDetail - id:', id, 'lead:', lead, 'loading:', loading, 'error:', error);

  const handleBack = () => {
    navigate('/admin/crm');
  };

  const handleLeadUpdate = () => {
    console.log('🔄 Lead updated, refetching data...');
    refetch();
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
            {error}
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
          >
            CRM
          </Button>
          <span>/</span>
          <span>Lead</span>
          <span>/</span>
          <span className="font-medium text-gray-900">{lead.name}</span>
        </div>
        
        <Button onClick={handleBack} variant="outline">
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
        />
      </div>

      {/* Conteúdo Principal */}
      <div className="bg-white rounded-2xl border border-gray-200/50 shadow-lg overflow-hidden">
        <Tabs defaultValue="overview" className="w-full">
          <div className="border-b border-gray-200/50 bg-gray-50/50 px-6">
            <TabsList className="bg-white/80 backdrop-blur-sm border border-white/20 shadow-sm">
              <TabsTrigger value="overview" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Visão Geral & Dados
              </TabsTrigger>
              <TabsTrigger value="contacts" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Contatos
              </TabsTrigger>
              <TabsTriggerWithBadge 
                value="attachments" 
                badgeContent="3"
                className="flex items-center gap-2"
              >
                <FileText className="h-4 w-4" />
                Anexos
              </TabsTriggerWithBadge>
              <TabsTriggerWithBadge 
                value="comments" 
                badgeContent="2"
                className="flex items-center gap-2"
              >
                <MessageSquare className="h-4 w-4" />
                Comentários
              </TabsTriggerWithBadge>
              <TabsTrigger value="history" className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Histórico
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="p-6">
            <TabsContent value="overview" className="mt-0">
              <LeadDetailOverview lead={lead} />
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
    </motion.div>
  );
};

export default LeadDetail;

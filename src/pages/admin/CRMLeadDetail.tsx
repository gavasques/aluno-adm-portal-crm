
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Edit, User, Calendar, MessageSquare, Paperclip, History, Phone, Mail } from 'lucide-react';
import { useCRMData } from '@/hooks/crm/useCRMData';
import { useCRMAttachments } from '@/hooks/crm/useCRMAttachments';
import { CRMLead } from '@/types/crm.types';
import CRMAttachmentUpload from '@/components/admin/crm/CRMAttachmentUpload';
import LeadCommentsTab from '@/components/admin/crm/lead-detail-tabs/LeadCommentsTab';
import LeadContactsTab from '@/components/admin/crm/lead-detail-tabs/LeadContactsTab';
import LeadHistoryTab from '@/components/admin/crm/lead-detail-tabs/LeadHistoryTab';
import LeadAttachmentsTab from '@/components/admin/crm/lead-detail-tabs/LeadAttachmentsTab';
import CRMLeadFormDialog from '@/components/admin/crm/CRMLeadFormDialog';
import { cn } from '@/lib/utils';

const CRMLeadDetail = () => {
  const { leadId } = useParams<{ leadId: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [lead, setLead] = useState<CRMLead | null>(null);
  const [loading, setLoading] = useState(true);

  const { leadsWithContacts, refetch } = useCRMData({});

  useEffect(() => {
    if (leadId && leadsWithContacts.length > 0) {
      const foundLead = leadsWithContacts.find(l => l.id === leadId);
      setLead(foundLead || null);
      setLoading(false);
    }
  }, [leadId, leadsWithContacts]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!lead) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Lead não encontrado</h3>
          <p className="text-gray-500 mb-4">O lead solicitado não foi encontrado.</p>
          <Button onClick={() => navigate('/admin/crm')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar ao CRM
          </Button>
        </div>
      </div>
    );
  }

  const handleEditSuccess = () => {
    setShowEditDialog(false);
    refetch();
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={() => navigate('/admin/crm')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{lead.name}</h1>
            <p className="text-gray-600">{lead.email}</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          {lead.column && (
            <Badge 
              style={{ backgroundColor: lead.column.color + '20', color: lead.column.color }}
              className="border-0"
            >
              {lead.column.name}
            </Badge>
          )}
          <Button onClick={() => setShowEditDialog(true)}>
            <Edit className="h-4 w-4 mr-2" />
            Editar
          </Button>
        </div>
      </div>

      {/* Lead Overview Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Informações do Lead
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label className="text-sm font-medium text-gray-600">Email</label>
              <div className="flex items-center mt-1">
                <Mail className="h-4 w-4 mr-2 text-gray-400" />
                <span>{lead.email}</span>
              </div>
            </div>
            
            {lead.phone && (
              <div>
                <label className="text-sm font-medium text-gray-600">Telefone</label>
                <div className="flex items-center mt-1">
                  <Phone className="h-4 w-4 mr-2 text-gray-400" />
                  <span>{lead.phone}</span>
                </div>
              </div>
            )}

            <div>
              <label className="text-sm font-medium text-gray-600">Tem Empresa</label>
              <p className="mt-1">{lead.has_company ? 'Sim' : 'Não'}</p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-600">Vende na Amazon</label>
              <p className="mt-1">{lead.sells_on_amazon ? 'Sim' : 'Não'}</p>
            </div>

            {lead.what_sells && (
              <div>
                <label className="text-sm font-medium text-gray-600">O que vende</label>
                <p className="mt-1">{lead.what_sells}</p>
              </div>
            )}

            {lead.responsible && (
              <div>
                <label className="text-sm font-medium text-gray-600">Responsável</label>
                <p className="mt-1">{lead.responsible.name}</p>
              </div>
            )}

            <div>
              <label className="text-sm font-medium text-gray-600">Criado em</label>
              <div className="flex items-center mt-1">
                <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                <span>{new Date(lead.created_at).toLocaleDateString('pt-BR')}</span>
              </div>
            </div>
          </div>

          {lead.notes && (
            <div className="mt-6">
              <label className="text-sm font-medium text-gray-600">Observações</label>
              <p className="mt-1 text-gray-800 bg-gray-50 p-3 rounded-md">{lead.notes}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tabs */}
      <Card className="flex-1">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <CardHeader>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="comments" className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                Comentários
              </TabsTrigger>
              <TabsTrigger value="contacts" className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                Contatos
              </TabsTrigger>
              <TabsTrigger value="attachments" className="flex items-center gap-2">
                <Paperclip className="h-4 w-4" />
                Anexos
              </TabsTrigger>
              <TabsTrigger value="history" className="flex items-center gap-2">
                <History className="h-4 w-4" />
                Histórico
              </TabsTrigger>
            </TabsList>
          </CardHeader>
          <CardContent className="p-0">
            <TabsContent value="comments" className="mt-0">
              <LeadCommentsTab leadId={leadId!} />
            </TabsContent>
            <TabsContent value="contacts" className="mt-0">
              <LeadContactsTab leadId={leadId!} />
            </TabsContent>
            <TabsContent value="attachments" className="mt-0">
              <LeadAttachmentsTab leadId={leadId!} />
            </TabsContent>
            <TabsContent value="history" className="mt-0">
              <LeadHistoryTab leadId={leadId!} />
            </TabsContent>
          </CardContent>
        </Tabs>
      </Card>

      {/* Edit Dialog */}
      <CRMLeadFormDialog
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        leadId={lead.id}
        pipelineId={lead.pipeline_id || ''}
        mode="edit"
        onSuccess={handleEditSuccess}
      />
    </div>
  );
};

export default CRMLeadDetail;

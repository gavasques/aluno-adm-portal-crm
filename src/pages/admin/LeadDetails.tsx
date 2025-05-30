
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger, TabsTriggerWithBadge } from '@/components/ui/tabs';
import { 
  ArrowLeft,
  User, 
  FileText, 
  MessageSquare, 
  Clock,
  Edit,
  Trash2
} from 'lucide-react';
import { CRMLead } from '@/types/crm.types';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { LeadDetailHeader } from '@/components/admin/crm/lead-detail/LeadDetailHeader';
import { LeadDetailOverview } from '@/components/admin/crm/lead-detail/LeadDetailOverview';
import LeadDataTab from '@/components/admin/crm/lead-detail-tabs/LeadDataTab';
import LeadAttachmentsTab from '@/components/admin/crm/lead-detail-tabs/LeadAttachmentsTab';
import LeadCommentsTab from '@/components/admin/crm/lead-detail-tabs/LeadCommentsTab';
import LeadHistoryTab from '@/components/admin/crm/lead-detail-tabs/LeadHistoryTab';

const LeadDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [lead, setLead] = useState<CRMLead | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (id) {
      fetchLead();
    }
  }, [id]);

  const fetchLead = async () => {
    if (!id) return;

    try {
      const { data, error } = await supabase
        .from('crm_leads')
        .select(`
          *,
          pipeline:crm_pipelines(id, name),
          column:crm_pipeline_columns(id, name, color),
          responsible:profiles!crm_leads_responsible_id_fkey(id, name, email),
          tags:crm_lead_tags(tag:crm_tags(*))
        `)
        .eq('id', id)
        .single();

      if (error) throw error;

      // Processar os dados conforme necessário
      const processedLead: CRMLead = {
        ...data,
        has_company: data.has_company || false,
        sells_on_amazon: data.sells_on_amazon || false,
        works_with_fba: data.works_with_fba || false,
        had_contact_with_lv: data.had_contact_with_lv || false,
        seeks_private_label: data.seeks_private_label || false,
        ready_to_invest_3k: data.ready_to_invest_3k || false,
        calendly_scheduled: data.calendly_scheduled || false,
        tags: data.tags?.map((t: any) => t.tag) || []
      };

      setLead(processedLead);
    } catch (error) {
      console.error('Erro ao buscar lead:', error);
      toast.error('Erro ao carregar detalhes do lead');
      navigate('/admin/crm');
    } finally {
      setLoading(false);
    }
  };

  const handleLeadUpdate = () => {
    fetchLead();
  };

  const handleBack = () => {
    navigate('/admin/crm');
  };

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
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Lead não encontrado</h1>
          <Button onClick={handleBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar para CRM
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="container mx-auto p-6 space-y-6"
      >
        {/* Header da página */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              onClick={handleBack}
              className="bg-white/80 backdrop-blur-sm hover:bg-white"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Detalhes do Lead</h1>
              <p className="text-gray-600">Visualize e gerencie informações completas</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" className="bg-white/80 backdrop-blur-sm hover:bg-white">
              <Edit className="h-4 w-4 mr-2" />
              Editar
            </Button>
            <Button variant="outline" className="bg-white/80 backdrop-blur-sm hover:bg-white text-red-600 hover:text-red-700">
              <Trash2 className="h-4 w-4 mr-2" />
              Excluir
            </Button>
          </div>
        </div>

        {/* Card principal com header do lead */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 shadow-xl overflow-hidden">
          <LeadDetailHeader lead={lead} onClose={handleBack} />
          
          {/* Tabs Container */}
          <div className="p-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="bg-white/80 backdrop-blur-sm border border-white/20 shadow-sm">
                <TabsTrigger value="overview" className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm">
                  <User className="h-4 w-4" />
                  Visão Geral
                </TabsTrigger>
                <TabsTrigger value="data" className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm">
                  <FileText className="h-4 w-4" />
                  Dados Completos
                </TabsTrigger>
                <TabsTriggerWithBadge 
                  value="attachments" 
                  badgeContent="3"
                  className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm"
                >
                  <FileText className="h-4 w-4" />
                  Anexos
                </TabsTriggerWithBadge>
                <TabsTriggerWithBadge 
                  value="comments" 
                  badgeContent="2"
                  className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm"
                >
                  <MessageSquare className="h-4 w-4" />
                  Comentários
                </TabsTriggerWithBadge>
                <TabsTrigger value="history" className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm">
                  <Clock className="h-4 w-4" />
                  Histórico
                </TabsTrigger>
              </TabsList>

              <div className="min-h-96">
                <TabsContent value="overview" className="mt-0">
                  <LeadDetailOverview lead={lead} />
                </TabsContent>
                
                <TabsContent value="data" className="mt-0">
                  <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                    <LeadDataTab lead={lead} onUpdate={handleLeadUpdate} />
                  </div>
                </TabsContent>
                
                <TabsContent value="attachments" className="mt-0">
                  <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-white/20">
                    <LeadAttachmentsTab leadId={lead.id} />
                  </div>
                </TabsContent>
                
                <TabsContent value="comments" className="mt-0">
                  <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-white/20">
                    <LeadCommentsTab leadId={lead.id} />
                  </div>
                </TabsContent>
                
                <TabsContent value="history" className="mt-0">
                  <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-white/20">
                    <LeadHistoryTab leadId={lead.id} />
                  </div>
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LeadDetails;

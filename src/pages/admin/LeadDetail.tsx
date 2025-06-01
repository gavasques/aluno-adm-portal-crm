
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
import { DesignCard } from '@/design-system';
import { LeadDetailHeader } from '@/components/admin/crm/lead-detail/LeadDetailHeader';
import { LeadDetailOverview } from '@/components/admin/crm/lead-detail/LeadDetailOverview';
import LeadAttachmentsTab from '@/components/admin/crm/lead-detail-tabs/LeadAttachmentsTab';
import LeadCommentsTab from '@/components/admin/crm/lead-detail-tabs/LeadCommentsTab';
import LeadHistoryTab from '@/components/admin/crm/lead-detail-tabs/LeadHistoryTab';
import LeadContactsTab from '@/components/admin/crm/lead-detail-tabs/LeadContactsTab';
import { useCRMLeadDetail } from '@/hooks/crm/useCRMLeadDetail';

const LeadDetail = () => {
  const { leadId } = useParams<{ leadId: string }>();
  const navigate = useNavigate();
  const { lead, loading, error, refetch } = useCRMLeadDetail(leadId || '');
  const [activeTab, setActiveTab] = useState('overview');

  const handleBack = () => {
    navigate('/admin/crm');
  };

  const handleLeadUpdate = () => {
    console.log('🔄 Lead updated, refetching data...');
    refetch();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex items-center gap-3"
        >
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <span className="text-slate-600 dark:text-slate-300 font-medium">
            Carregando detalhes do lead...
          </span>
        </motion.div>
      </div>
    );
  }

  if (error || !lead) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <DesignCard variant="glass" size="lg" className="p-12 max-w-md">
            <p className="text-red-600 dark:text-red-400 mb-6 font-medium">
              {error || 'Lead não encontrado'}
            </p>
            <Button onClick={handleBack} variant="outline" className="bg-white/60 dark:bg-black/20">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar para CRM
            </Button>
          </DesignCard>
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900"
    >
      <div className="container mx-auto p-6 space-y-6 max-w-7xl">
        {/* Breadcrumb e navegação */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="flex items-center justify-between"
        >
          <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleBack}
              className="p-0 h-auto hover:bg-transparent hover:text-blue-600 transition-colors"
            >
              CRM
            </Button>
            <span className="text-slate-400">/</span>
            <span>Lead</span>
            <span className="text-slate-400">/</span>
            <span className="font-medium text-slate-900 dark:text-slate-100">{lead.name}</span>
          </div>
          
          <Button 
            onClick={handleBack} 
            variant="outline"
            className="bg-white/60 dark:bg-black/20 border-white/30 backdrop-blur-sm hover:bg-white/80 dark:hover:bg-white/10"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
        </motion.div>

        {/* Header do Lead */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <DesignCard 
            variant="glass" 
            size="lg" 
            className="border-white/30 bg-white/40 dark:bg-black/10 backdrop-blur-xl shadow-2xl overflow-hidden"
          >
            <LeadDetailHeader 
              lead={lead} 
              onClose={handleBack} 
              onLeadUpdate={handleLeadUpdate}
            />
          </DesignCard>
        </motion.div>

        {/* Conteúdo Principal */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <DesignCard 
            variant="glass" 
            size="lg" 
            className="border-white/30 bg-white/40 dark:bg-black/10 backdrop-blur-xl shadow-2xl overflow-hidden min-h-[600px]"
          >
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full h-full flex flex-col">
              <div className="border-b border-white/20 bg-white/30 dark:bg-black/10 backdrop-blur-sm px-6 py-4">
                <TabsList className="bg-white/80 dark:bg-black/20 backdrop-blur-sm border border-white/20 shadow-lg">
                  <TabsTrigger 
                    value="overview" 
                    className="flex items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-white/10 data-[state=active]:shadow-md transition-all duration-200"
                  >
                    <User className="h-4 w-4" />
                    Visão Geral & Dados
                  </TabsTrigger>
                  <TabsTrigger 
                    value="contacts" 
                    className="flex items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-white/10 data-[state=active]:shadow-md transition-all duration-200"
                  >
                    <Calendar className="h-4 w-4" />
                    Contatos
                  </TabsTrigger>
                  <TabsTriggerWithBadge 
                    value="attachments" 
                    badgeContent="3"
                    className="flex items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-white/10 data-[state=active]:shadow-md transition-all duration-200"
                  >
                    <FileText className="h-4 w-4" />
                    Anexos
                  </TabsTriggerWithBadge>
                  <TabsTriggerWithBadge 
                    value="comments" 
                    badgeContent="2"
                    className="flex items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-white/10 data-[state=active]:shadow-md transition-all duration-200"
                  >
                    <MessageSquare className="h-4 w-4" />
                    Comentários
                  </TabsTriggerWithBadge>
                  <TabsTrigger 
                    value="history" 
                    className="flex items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-white/10 data-[state=active]:shadow-md transition-all duration-200"
                  >
                    <Clock className="h-4 w-4" />
                    Histórico
                  </TabsTrigger>
                </TabsList>
              </div>

              <div className="flex-1 overflow-hidden">
                <TabsContent value="overview" className="h-full mt-0 p-6">
                  <LeadDetailOverview lead={lead} />
                </TabsContent>
                
                <TabsContent value="contacts" className="h-full mt-0">
                  <LeadContactsTab leadId={lead.id} />
                </TabsContent>
                
                <TabsContent value="attachments" className="h-full mt-0">
                  <LeadAttachmentsTab leadId={lead.id} />
                </TabsContent>
                
                <TabsContent value="comments" className="h-full mt-0">
                  <LeadCommentsTab leadId={lead.id} />
                </TabsContent>
                
                <TabsContent value="history" className="h-full mt-0">
                  <LeadHistoryTab leadId={lead.id} />
                </TabsContent>
              </div>
            </Tabs>
          </DesignCard>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default LeadDetail;

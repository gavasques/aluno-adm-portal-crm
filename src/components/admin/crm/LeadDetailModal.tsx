
import React, { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger, TabsTriggerWithBadge } from '@/components/ui/tabs';
import { 
  User, 
  FileText, 
  MessageSquare, 
  Clock,
  Calendar
} from 'lucide-react';
import { CRMLead, CRMLeadContact } from '@/types/crm.types';
import { motion, AnimatePresence } from 'framer-motion';
import { useLeadDetailData } from '@/hooks/crm/useLeadDetailData';
import { LeadDetailHeader } from './lead-detail/LeadDetailHeader';
import { LeadDetailOverview } from './lead-detail/LeadDetailOverview';
import LeadAttachmentsTab from './lead-detail-tabs/LeadAttachmentsTab';
import LeadCommentsTab from './lead-detail-tabs/LeadCommentsTab';
import LeadHistoryTab from './lead-detail-tabs/LeadHistoryTab';
import LeadContactsTab from './lead-detail-tabs/LeadContactsTab';

interface LeadDetailModalProps {
  lead: (CRMLead & {
    pending_contacts?: CRMLeadContact[];
    last_completed_contact?: CRMLeadContact;
  }) | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onLeadUpdate?: () => void;
}

const LeadDetailModal = ({ lead, open, onOpenChange, onLeadUpdate }: LeadDetailModalProps) => {
  const {
    activeTab,
    setActiveTab,
    attachmentCount,
    commentCount,
    handleLeadUpdate
  } = useLeadDetailData({ lead });

  // Estados para edição (similar ao LeadDetail.tsx)
  const [isEditing, setIsEditing] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const handleUpdate = () => {
    handleLeadUpdate();
    onLeadUpdate?.();
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

  if (!lead) return null;

  return (
    <AnimatePresence>
      {open && (
        <Dialog open={open} onOpenChange={onOpenChange}>
          <DialogContent className="max-w-7xl max-h-[95vh] overflow-hidden flex flex-col p-0 bg-white/80 backdrop-blur-xl border border-white/20 shadow-2xl">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col h-full"
            >
              {/* Header */}
              <LeadDetailHeader 
                lead={lead} 
                onClose={() => onOpenChange(false)} 
                onLeadUpdate={handleUpdate}
                isEditing={isEditing}
                onToggleEdit={handleToggleEdit}
                onSave={handleSave}
                hasChanges={hasChanges}
              />

              {/* Tabs Container */}
              <div className="flex-1 overflow-hidden">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
                  <div className="border-b border-gray-200/50 bg-white/50 backdrop-blur-sm px-6">
                    <TabsList className="bg-white/80 backdrop-blur-sm border border-white/20 shadow-sm">
                      <TabsTrigger value="overview" className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm">
                        <User className="h-4 w-4" />
                        Visão Geral & Dados
                      </TabsTrigger>
                      <TabsTrigger value="contacts" className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm">
                        <Calendar className="h-4 w-4" />
                        Contatos
                      </TabsTrigger>
                      <TabsTriggerWithBadge 
                        value="attachments" 
                        badgeContent={attachmentCount}
                        className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm"
                      >
                        <FileText className="h-4 w-4" />
                        Anexos
                      </TabsTriggerWithBadge>
                      <TabsTriggerWithBadge 
                        value="comments" 
                        badgeContent={commentCount}
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
              </div>
            </motion.div>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  );
};

export default LeadDetailModal;


import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { X, User, FileText, MessageSquare, Clock } from 'lucide-react';
import { CRMLead } from '@/types/crm.types';
import LeadDataTab from './lead-detail-tabs/LeadDataTab';
import LeadAttachmentsTab from './lead-detail-tabs/LeadAttachmentsTab';
import LeadCommentsTab from './lead-detail-tabs/LeadCommentsTab';
import LeadHistoryTab from './lead-detail-tabs/LeadHistoryTab';

interface LeadDetailModalProps {
  lead: CRMLead | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onLeadUpdate?: () => void;
}

const LeadDetailModal = ({ lead, open, onOpenChange, onLeadUpdate }: LeadDetailModalProps) => {
  const [activeTab, setActiveTab] = useState('data');

  if (!lead) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <User className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <DialogTitle className="text-xl font-semibold">{lead.name}</DialogTitle>
              <p className="text-sm text-gray-500">{lead.email}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        <div className="flex-1 overflow-hidden">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
            <TabsList className="grid w-full grid-cols-4 mb-4">
              <TabsTrigger value="data" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Dados
              </TabsTrigger>
              <TabsTrigger value="attachments" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Anexos
              </TabsTrigger>
              <TabsTrigger value="comments" className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                Comentários
              </TabsTrigger>
              <TabsTrigger value="history" className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Histórico
              </TabsTrigger>
            </TabsList>

            <div className="flex-1 overflow-hidden">
              <TabsContent value="data" className="h-full mt-0">
                <LeadDataTab lead={lead} onUpdate={onLeadUpdate} />
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
      </DialogContent>
    </Dialog>
  );
};

export default LeadDetailModal;

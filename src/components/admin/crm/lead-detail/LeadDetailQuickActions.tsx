
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Edit, MessageSquare, Calendar, Activity } from 'lucide-react';
import QuickCommentModal from '../QuickCommentModal';
import CRMLeadFormDialog from '../CRMLeadFormDialog';

interface LeadDetailQuickActionsProps {
  leadId: string;
  leadName: string;
  onEdit?: () => void;
  onAddComment?: () => void;
  onScheduleContact?: () => void;
}

export const LeadDetailQuickActions = ({ 
  leadId,
  leadName,
  onEdit, 
  onAddComment, 
  onScheduleContact 
}: LeadDetailQuickActionsProps) => {
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const handleEditLead = () => {
    setShowEditModal(true);
    onEdit?.();
  };

  const handleAddComment = () => {
    setShowCommentModal(true);
    onAddComment?.();
  };

  return (
    <>
      <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Activity className="h-5 w-5 text-purple-600" />
          Ações Rápidas
        </h3>
        <div className="space-y-2">
          <Button 
            variant="outline" 
            className="w-full justify-start bg-white/50 hover:bg-white/80"
            onClick={handleEditLead}
          >
            <Edit className="h-4 w-4 mr-2" />
            Editar Lead
          </Button>
          <Button 
            variant="outline" 
            className="w-full justify-start bg-white/50 hover:bg-white/80"
            onClick={handleAddComment}
          >
            <MessageSquare className="h-4 w-4 mr-2" />
            Adicionar Comentário
          </Button>
          <Button 
            variant="outline" 
            className="w-full justify-start bg-white/50 hover:bg-white/80"
            onClick={onScheduleContact}
          >
            <Calendar className="h-4 w-4 mr-2" />
            Agendar Contato
          </Button>
        </div>
      </div>

      {/* Modal de comentário rápido */}
      <QuickCommentModal
        open={showCommentModal}
        onOpenChange={setShowCommentModal}
        leadId={leadId}
        leadName={leadName}
      />

      {/* Modal de edição de lead */}
      <CRMLeadFormDialog
        open={showEditModal}
        onOpenChange={setShowEditModal}
        leadId={leadId}
        mode="edit"
        onSuccess={() => {
          setShowEditModal(false);
          // O hook useCRMLeadDetail vai refetch automaticamente
        }}
      />
    </>
  );
};

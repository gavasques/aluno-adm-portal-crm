
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Edit, MessageSquare, Calendar, Activity } from 'lucide-react';
import QuickCommentModal from '../QuickCommentModal';
import ModernCRMLeadFormDialog from '../ModernCRMLeadFormDialog';

interface LeadDetailQuickActionsProps {
  leadId: string;
  leadName: string;
  lead?: any; // Adicionando para compatibilidade
  onEdit?: () => void;
  onAddComment?: () => void;
  onScheduleContact?: () => void;
  compact?: boolean;
}

export const LeadDetailQuickActions = ({ 
  leadId,
  leadName,
  lead,
  onEdit, 
  onAddComment, 
  onScheduleContact,
  compact = false
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

  if (compact) {
    return (
      <>
        <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200 shadow-lg">
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <Activity className="h-5 w-5 text-purple-600" />
            Ações Rápidas
          </h3>
          <div className="flex justify-center gap-4">
            <Button 
              variant="outline" 
              size="sm"
              className="h-12 w-12 p-0 bg-gray-100 hover:bg-gray-50"
              onClick={handleEditLead}
              title="Editar Lead"
            >
              <Edit className="h-5 w-5" />
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              className="h-12 w-12 p-0 bg-gray-100 hover:bg-gray-50"
              onClick={handleAddComment}
              title="Adicionar Comentário"
            >
              <MessageSquare className="h-5 w-5" />
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              className="h-12 w-12 p-0 bg-gray-100 hover:bg-gray-50"
              onClick={onScheduleContact}
              title="Agendar Contato"
            >
              <Calendar className="h-5 w-5" />
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
        {lead && (
          <ModernCRMLeadFormDialog
            open={showEditModal}
            onOpenChange={setShowEditModal}
            pipelineId={lead.pipeline_id || ''}
            lead={lead}
            mode="edit"
            onSuccess={() => {
              setShowEditModal(false);
              // O hook useCRMLeadDetail vai refetch automaticamente
            }}
          />
        )}
      </>
    );
  }

  return (
    <>
      <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200 shadow-lg">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Activity className="h-5 w-5 text-purple-600" />
          Ações Rápidas
        </h3>
        <div className="space-y-2">
          <Button 
            variant="outline" 
            className="w-full justify-start bg-gray-100 hover:bg-gray-50"
            onClick={handleEditLead}
          >
            <Edit className="h-4 w-4 mr-2" />
            Editar Lead
          </Button>
          <Button 
            variant="outline" 
            className="w-full justify-start bg-gray-100 hover:bg-gray-50"
            onClick={handleAddComment}
          >
            <MessageSquare className="h-4 w-4 mr-2" />
            Adicionar Comentário
          </Button>
          <Button 
            variant="outline" 
            className="w-full justify-start bg-gray-100 hover:bg-gray-50"
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
      {lead && (
        <ModernCRMLeadFormDialog
          open={showEditModal}
          onOpenChange={setShowEditModal}
          pipelineId={lead.pipeline_id || ''}
          lead={lead}
          mode="edit"
          onSuccess={() => {
            setShowEditModal(false);
            // O hook useCRMLeadDetail vai refetch automaticamente
          }}
        />
      )}
    </>
  );
};

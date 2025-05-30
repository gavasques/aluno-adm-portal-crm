
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { MessageSquare, Send, X } from 'lucide-react';
import { useCRMLeadComments } from '@/hooks/crm/useCRMLeadComments';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

interface QuickCommentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  leadId: string;
  leadName: string;
}

const QuickCommentModal = ({ open, onOpenChange, leadId, leadName }: QuickCommentModalProps) => {
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addComment } = useCRMLeadComments(leadId);

  const handleSubmit = async () => {
    if (!content.trim()) {
      toast.error('Por favor, digite um comentário');
      return;
    }

    setIsSubmitting(true);
    try {
      const success = await addComment(content.trim(), []);
      if (success) {
        setContent('');
        onOpenChange(false);
        toast.success('Comentário adicionado com sucesso!');
      }
    } catch (error) {
      toast.error('Erro ao adicionar comentário');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-blue-600" />
            Adicionar Comentário - {leadName}
          </DialogTitle>
        </DialogHeader>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div>
            <Textarea
              placeholder="Digite seu comentário... (Ctrl+Enter para enviar)"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onKeyDown={handleKeyDown}
              className="min-h-[120px] resize-none"
              disabled={isSubmitting}
            />
            <div className="flex justify-between items-center mt-2">
              <p className="text-sm text-gray-500">
                Ctrl+Enter para enviar rapidamente
              </p>
              <p className="text-sm text-gray-500">
                {content.length}/1000 caracteres
              </p>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              <X className="h-4 w-4 mr-2" />
              Cancelar
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!content.trim() || isSubmitting}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Send className="h-4 w-4 mr-2" />
              {isSubmitting ? 'Enviando...' : 'Enviar Comentário'}
            </Button>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};

export default QuickCommentModal;

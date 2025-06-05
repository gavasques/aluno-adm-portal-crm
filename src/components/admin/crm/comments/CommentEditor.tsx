
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, X } from 'lucide-react';

interface CommentEditorProps {
  onSubmit: (content: string, mentions?: string[]) => void;
  onCancel?: () => void;
  showCancel?: boolean;
  placeholder?: string;
  initialContent?: string;
}

const CommentEditor = ({ 
  onSubmit, 
  onCancel, 
  showCancel = false, 
  placeholder = "Escreva um comentário...",
  initialContent = ""
}: CommentEditorProps) => {
  const [content, setContent] = useState(initialContent);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!content.trim()) return;
    
    setIsSubmitting(true);
    try {
      await onSubmit(content.trim());
      setContent('');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setContent(initialContent);
    onCancel?.();
  };

  return (
    <div className="space-y-3">
      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder={placeholder}
        rows={3}
        className="resize-none"
      />
      <div className="flex justify-end gap-2">
        {showCancel && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleCancel}
            disabled={isSubmitting}
          >
            <X className="h-4 w-4 mr-2" />
            Cancelar
          </Button>
        )}
        <Button
          type="button"
          size="sm"
          onClick={handleSubmit}
          disabled={!content.trim() || isSubmitting}
          className="bg-purple-600 hover:bg-purple-700"
        >
          <Send className="h-4 w-4 mr-2" />
          {isSubmitting ? 'Enviando...' : 'Enviar'}
        </Button>
      </div>
    </div>
  );
};

export default CommentEditor;


import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, AtSign } from 'lucide-react';
import { CRMUser } from '@/types/crm.types';
import UserMention from './UserMention';

interface CommentEditorProps {
  onSubmit: (content: string, mentions: string[]) => void;
  onCancel?: () => void;
  initialValue?: string;
  placeholder?: string;
  disabled?: boolean;
  showCancel?: boolean;
}

const CommentEditor = ({ 
  onSubmit, 
  onCancel, 
  initialValue = '', 
  placeholder = 'Escreva um comentário...',
  disabled = false,
  showCancel = false
}: CommentEditorProps) => {
  const [content, setContent] = useState(initialValue);
  const [mentions, setMentions] = useState<string[]>([]);
  const [showMentions, setShowMentions] = useState(false);
  const [mentionTrigger, setMentionTrigger] = useState('');
  const [mentionPosition, setMentionPosition] = useState({ top: 0, left: 0 });
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setContent(value);

    // Detectar menções (@)
    const cursorPosition = e.target.selectionStart;
    const textBeforeCursor = value.slice(0, cursorPosition);
    const mentionMatch = textBeforeCursor.match(/@(\w*)$/);

    if (mentionMatch) {
      const rect = e.target.getBoundingClientRect();
      setMentionTrigger(`@${mentionMatch[1]}`);
      setMentionPosition({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX
      });
      setShowMentions(true);
    } else {
      setShowMentions(false);
    }
  };

  const handleMention = (user: CRMUser) => {
    if (!textareaRef.current) return;

    const textarea = textareaRef.current;
    const cursorPosition = textarea.selectionStart;
    const textBeforeCursor = content.slice(0, cursorPosition);
    const textAfterCursor = content.slice(cursorPosition);
    
    // Encontrar o início da menção
    const mentionStart = textBeforeCursor.lastIndexOf('@');
    const newContent = 
      content.slice(0, mentionStart) + 
      `@${user.name} ` + 
      textAfterCursor;

    setContent(newContent);
    setMentions(prev => [...prev.filter(id => id !== user.id), user.id]);
    setShowMentions(false);

    // Focar no textarea após a menção
    setTimeout(() => {
      const newCursorPosition = mentionStart + user.name.length + 2;
      textarea.setSelectionRange(newCursorPosition, newCursorPosition);
      textarea.focus();
    }, 0);
  };

  const handleSubmit = () => {
    if (!content.trim()) return;
    
    onSubmit(content.trim(), mentions);
    setContent('');
    setMentions([]);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="relative">
      <div className="space-y-3">
        <Textarea
          ref={textareaRef}
          value={content}
          onChange={handleContentChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          rows={3}
          className="resize-none"
        />
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-xs text-gray-500">
            <AtSign className="h-3 w-3" />
            <span>Use @ para mencionar alguém</span>
          </div>
          
          <div className="flex items-center space-x-2">
            {showCancel && (
              <Button
                variant="outline"
                size="sm"
                onClick={onCancel}
                disabled={disabled}
              >
                Cancelar
              </Button>
            )}
            <Button
              size="sm"
              onClick={handleSubmit}
              disabled={disabled || !content.trim()}
            >
              <Send className="h-4 w-4 mr-2" />
              Enviar
            </Button>
          </div>
        </div>
      </div>

      {showMentions && (
        <UserMention
          trigger={mentionTrigger}
          position={mentionPosition}
          onMention={handleMention}
          onClose={() => setShowMentions(false)}
        />
      )}
    </div>
  );
};

export default CommentEditor;

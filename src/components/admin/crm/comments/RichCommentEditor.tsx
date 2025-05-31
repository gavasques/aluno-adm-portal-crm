
import React, { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Send, AtSign, Bold, Italic, List } from 'lucide-react';
import { useCRMUsers } from '@/hooks/crm/useCRMUsers';
import { CRMUser } from '@/types/crm.types';

interface MentionSuggestion {
  user: CRMUser;
  index: number;
}

interface RichCommentEditorProps {
  onSubmit: (content: string, mentions: string[]) => void;
  placeholder?: string;
  disabled?: boolean;
}

const RichCommentEditor = ({ onSubmit, placeholder = "Escreva um comentário...", disabled }: RichCommentEditorProps) => {
  const [content, setContent] = useState('');
  const [showMentions, setShowMentions] = useState(false);
  const [mentionQuery, setMentionQuery] = useState('');
  const [mentionPosition, setMentionPosition] = useState({ top: 0, left: 0 });
  const [selectedMentionIndex, setSelectedMentionIndex] = useState(0);
  const [mentions, setMentions] = useState<string[]>([]);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { searchUsers } = useCRMUsers();

  const mentionSuggestions = mentionQuery ? searchUsers(mentionQuery) : [];

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    const cursorPosition = e.target.selectionStart;
    
    setContent(value);

    // Detectar se está digitando uma menção
    const beforeCursor = value.substring(0, cursorPosition);
    const mentionMatch = beforeCursor.match(/@(\w*)$/);
    
    if (mentionMatch) {
      setMentionQuery(mentionMatch[1]);
      setShowMentions(true);
      setSelectedMentionIndex(0);
      
      // Calcular posição do dropdown
      const textarea = textareaRef.current;
      if (textarea) {
        const rect = textarea.getBoundingClientRect();
        setMentionPosition({
          top: rect.bottom + 5,
          left: rect.left + 10
        });
      }
    } else {
      setShowMentions(false);
      setMentionQuery('');
    }
  }, []);

  const insertMention = (user: CRMUser) => {
    if (!textareaRef.current) return;

    const cursorPosition = textareaRef.current.selectionStart;
    const beforeCursor = content.substring(0, cursorPosition);
    const afterCursor = content.substring(cursorPosition);
    
    // Encontrar o início da menção
    const mentionStart = beforeCursor.lastIndexOf('@');
    const beforeMention = content.substring(0, mentionStart);
    
    const newContent = `${beforeMention}@${user.name} ${afterCursor}`;
    setContent(newContent);
    
    // Adicionar às menções
    if (!mentions.includes(user.id)) {
      setMentions([...mentions, user.id]);
    }
    
    setShowMentions(false);
    setMentionQuery('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (showMentions && mentionSuggestions.length > 0) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedMentionIndex(prev => 
          prev < mentionSuggestions.length - 1 ? prev + 1 : 0
        );
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedMentionIndex(prev => 
          prev > 0 ? prev - 1 : mentionSuggestions.length - 1
        );
      } else if (e.key === 'Enter') {
        e.preventDefault();
        insertMention(mentionSuggestions[selectedMentionIndex]);
      } else if (e.key === 'Escape') {
        setShowMentions(false);
      }
    } else if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const applyFormatting = (format: 'bold' | 'italic') => {
    if (!textareaRef.current) return;

    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    
    let formattedText = '';
    if (format === 'bold') {
      formattedText = `**${selectedText}**`;
      setIsBold(!isBold);
    } else if (format === 'italic') {
      formattedText = `*${selectedText}*`;
      setIsItalic(!isItalic);
    }
    
    const newContent = content.substring(0, start) + formattedText + content.substring(end);
    setContent(newContent);
    
    // Restaurar foco e posição do cursor
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + formattedText.length - selectedText.length, 
        start + formattedText.length - selectedText.length
      );
    }, 0);
  };

  const handleSubmit = () => {
    if (!content.trim()) return;
    
    onSubmit(content, mentions);
    setContent('');
    setMentions([]);
    setIsBold(false);
    setIsItalic(false);
  };

  return (
    <div className="relative">
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        {/* Toolbar */}
        <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 border-b border-gray-200">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => applyFormatting('bold')}
            className={`h-8 w-8 p-0 ${isBold ? 'bg-gray-200' : ''}`}
          >
            <Bold className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => applyFormatting('italic')}
            className={`h-8 w-8 p-0 ${isItalic ? 'bg-gray-200' : ''}`}
          >
            <Italic className="h-4 w-4" />
          </Button>
          <div className="w-px h-4 bg-gray-300 mx-1"></div>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => {
              const textarea = textareaRef.current;
              if (textarea) {
                const cursorPos = textarea.selectionStart;
                const newContent = content.substring(0, cursorPos) + '@' + content.substring(cursorPos);
                setContent(newContent);
                setTimeout(() => {
                  textarea.focus();
                  textarea.setSelectionRange(cursorPos + 1, cursorPos + 1);
                }, 0);
              }
            }}
          >
            <AtSign className="h-4 w-4" />
          </Button>
        </div>
        
        {/* Editor */}
        <textarea
          ref={textareaRef}
          value={content}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-full p-3 resize-none min-h-20 focus:outline-none"
          disabled={disabled}
          rows={3}
        />
        
        {/* Footer */}
        <div className="flex items-center justify-between px-3 py-2 bg-gray-50 border-t border-gray-200">
          <div className="text-xs text-gray-500">
            {mentions.length > 0 && (
              <span>{mentions.length} pessoa(s) mencionada(s)</span>
            )}
          </div>
          <Button 
            onClick={handleSubmit} 
            disabled={!content.trim() || disabled}
            size="sm"
          >
            <Send className="h-4 w-4 mr-1" />
            Comentar
          </Button>
        </div>
      </div>

      {/* Dropdown de menções */}
      {showMentions && mentionSuggestions.length > 0 && (
        <div 
          className="absolute z-50 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto"
          style={{ 
            top: mentionPosition.top, 
            left: mentionPosition.left,
            minWidth: '200px'
          }}
        >
          {mentionSuggestions.map((user, index) => (
            <div
              key={user.id}
              className={`flex items-center gap-2 p-2 cursor-pointer hover:bg-gray-50 ${
                index === selectedMentionIndex ? 'bg-blue-50' : ''
              }`}
              onClick={() => insertMention(user)}
            >
              <Avatar className="h-6 w-6">
                <AvatarFallback className="text-xs">
                  {user.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="text-sm font-medium">{user.name}</div>
                <div className="text-xs text-gray-500">{user.email}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RichCommentEditor;

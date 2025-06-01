
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, X, Tag, Hash } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { CRMTag } from '@/types/crm.types';
import { toast } from 'sonner';
import ModernFloatingInput from './ModernFloatingInput';

interface ModernTagsSelectorProps {
  selectedTags: string[];
  onTagsChange: (tags: string[]) => void;
}

const ModernTagsSelector = ({ selectedTags, onTagsChange }: ModernTagsSelectorProps) => {
  const [tags, setTags] = useState<CRMTag[]>([]);
  const [loading, setLoading] = useState(true);
  const [newTagName, setNewTagName] = useState('');
  const [creating, setCreating] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);

  useEffect(() => {
    loadTags();
  }, []);

  const loadTags = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('crm_tags')
        .select('*')
        .order('name');

      if (error) {
        console.error('Erro ao carregar tags:', error);
        toast.error('Erro ao carregar tags');
        return;
      }

      setTags(data || []);
    } catch (error) {
      console.error('Erro ao carregar tags:', error);
      toast.error('Erro ao carregar tags');
    } finally {
      setLoading(false);
    }
  };

  const createTag = async () => {
    if (!newTagName.trim()) return;

    setCreating(true);
    try {
      const colors = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16'];
      const randomColor = colors[Math.floor(Math.random() * colors.length)];

      const { data, error } = await supabase
        .from('crm_tags')
        .insert({ 
          name: newTagName.trim(), 
          color: randomColor 
        })
        .select()
        .single();

      if (error) throw error;

      setTags(prev => [...prev, data].sort((a, b) => a.name.localeCompare(b.name)));
      onTagsChange([...selectedTags, data.id]);
      setNewTagName('');
      setShowCreateForm(false);
      toast.success('Tag criada com sucesso! ✨');
    } catch (error) {
      console.error('Erro ao criar tag:', error);
      toast.error('Erro ao criar tag');
    } finally {
      setCreating(false);
    }
  };

  const toggleTag = (tagId: string) => {
    const newSelectedTags = selectedTags.includes(tagId)
      ? selectedTags.filter(id => id !== tagId)
      : [...selectedTags, tagId];
    
    onTagsChange(newSelectedTags);
  };

  const removeTag = (tagId: string) => {
    onTagsChange(selectedTags.filter(id => id !== tagId));
  };

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-8 bg-white/20 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  const selectedTagsData = tags.filter(tag => selectedTags.includes(tag.id));
  const availableTags = tags.filter(tag => !selectedTags.includes(tag.id));

  return (
    <div className="space-y-4">
      {/* Tags selecionadas */}
      <AnimatePresence>
        {selectedTagsData.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-2"
          >
            <div className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
              <Hash className="h-4 w-4" />
              Tags Selecionadas
            </div>
            <div className="flex flex-wrap gap-2">
              {selectedTagsData.map(tag => (
                <motion.div
                  key={tag.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  layout
                >
                  <Badge
                    variant="outline"
                    className="px-3 py-1 text-xs font-medium transition-all duration-200 hover:scale-105"
                    style={{ 
                      backgroundColor: tag.color + '20', 
                      color: tag.color,
                      borderColor: tag.color + '40'
                    }}
                  >
                    {tag.name}
                    <button
                      onClick={() => removeTag(tag.id)}
                      className="ml-2 hover:text-red-500 transition-colors"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Adicionar novas tags */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
            <Tag className="h-4 w-4" />
            Tags Disponíveis
          </div>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="h-7 px-2 bg-white/10 border-white/30 hover:bg-white/20"
          >
            <Plus className="h-3 w-3 mr-1" />
            Nova
          </Button>
        </div>

        {/* Formulário de criação */}
        <AnimatePresence>
          {showCreateForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-2"
            >
              <div className="flex gap-2">
                <div className="flex-1">
                  <ModernFloatingInput
                    value={newTagName}
                    onChange={(e) => setNewTagName(e.target.value)}
                    label="Nome da tag"
                    onKeyPress={(e) => e.key === 'Enter' && createTag()}
                  />
                </div>
                <Button
                  type="button"
                  size="sm"
                  onClick={createTag}
                  disabled={!newTagName.trim() || creating}
                  className="h-12 px-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                >
                  {creating ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                      <Plus className="h-4 w-4" />
                    </motion.div>
                  ) : (
                    <Plus className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tags disponíveis */}
        {availableTags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {availableTags.slice(0, 8).map(tag => (
              <motion.div
                key={tag.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => toggleTag(tag.id)}
                  className="h-8 text-xs px-3 transition-all duration-200 bg-white/10 border-white/30 hover:bg-white/20"
                  style={{ 
                    backgroundColor: tag.color + '15',
                    borderColor: tag.color + '30',
                    color: tag.color
                  }}
                >
                  <Tag className="h-3 w-3 mr-1" />
                  {tag.name}
                </Button>
              </motion.div>
            ))}
            {availableTags.length > 8 && (
              <Badge variant="outline" className="h-8 px-3 text-xs bg-white/10 border-white/30">
                +{availableTags.length - 8} mais...
              </Badge>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ModernTagsSelector;

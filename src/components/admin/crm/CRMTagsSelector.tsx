
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Plus, X, Tag, Palette } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface CRMTag {
  id: string;
  name: string;
  color: string;
}

interface CRMTagsSelectorProps {
  selectedTags: string[];
  onTagsChange: (tags: string[]) => void;
}

const CRMTagsSelector = ({ selectedTags, onTagsChange }: CRMTagsSelectorProps) => {
  const [tags, setTags] = useState<CRMTag[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newTagName, setNewTagName] = useState('');
  const [newTagColor, setNewTagColor] = useState('#3b82f6');
  const [creating, setCreating] = useState(false);

  const predefinedColors = [
    '#3b82f6', '#ef4444', '#22c55e', '#f59e0b', '#8b5cf6',
    '#ec4899', '#06b6d4', '#84cc16', '#f97316', '#6366f1'
  ];

  useEffect(() => {
    fetchTags();
  }, []);

  const fetchTags = async () => {
    try {
      const { data, error } = await supabase
        .from('crm_tags')
        .select('*')
        .order('name');

      if (error) throw error;
      setTags(data || []);
    } catch (error) {
      console.error('Erro ao buscar tags:', error);
      toast.error('Erro ao carregar tags');
    } finally {
      setLoading(false);
    }
  };

  const createTag = async () => {
    if (!newTagName.trim()) return;

    setCreating(true);
    try {
      const { data, error } = await supabase
        .from('crm_tags')
        .insert([{
          name: newTagName.trim(),
          color: newTagColor
        }])
        .select()
        .single();

      if (error) throw error;

      setTags(prev => [...prev, data]);
      setNewTagName('');
      setNewTagColor('#3b82f6');
      setShowCreateDialog(false);
      toast.success('Tag criada com sucesso!');
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
    const newSelectedTags = selectedTags.filter(id => id !== tagId);
    onTagsChange(newSelectedTags);
  };

  if (loading) {
    return <div className="animate-pulse h-8 bg-gray-200 rounded"></div>;
  }

  const selectedTagsData = tags.filter(tag => selectedTags.includes(tag.id));

  return (
    <div className="space-y-3">
      {/* Tags selecionadas */}
      {selectedTagsData.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedTagsData.map(tag => (
            <Badge
              key={tag.id}
              variant="outline"
              className="px-2 py-1"
              style={{ 
                backgroundColor: tag.color + '15', 
                color: tag.color,
                borderColor: tag.color + '30'
              }}
            >
              {tag.name}
              <button
                onClick={() => removeTag(tag.id)}
                className="ml-1 hover:text-red-500"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}

      {/* Seletor de tags */}
      <div className="flex flex-wrap gap-2">
        {tags
          .filter(tag => !selectedTags.includes(tag.id))
          .map(tag => (
            <Button
              key={tag.id}
              variant="outline"
              size="sm"
              onClick={() => toggleTag(tag.id)}
              className="h-7 text-xs"
              style={{ 
                backgroundColor: tag.color + '10',
                borderColor: tag.color + '30'
              }}
            >
              <Tag className="h-3 w-3 mr-1" style={{ color: tag.color }} />
              {tag.name}
            </Button>
          ))}

        {/* Botão para criar nova tag */}
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="h-7 text-xs">
              <Plus className="h-3 w-3 mr-1" />
              Nova Tag
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Criar Nova Tag</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="tag-name">Nome da Tag</Label>
                <Input
                  id="tag-name"
                  value={newTagName}
                  onChange={(e) => setNewTagName(e.target.value)}
                  placeholder="Nome da tag"
                />
              </div>

              <div className="space-y-2">
                <Label>Cor da Tag</Label>
                <div className="flex flex-wrap gap-2">
                  {predefinedColors.map(color => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setNewTagColor(color)}
                      className={`w-8 h-8 rounded-full border-2 ${
                        newTagColor === color ? 'border-gray-900' : 'border-gray-300'
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
                <Input
                  type="color"
                  value={newTagColor}
                  onChange={(e) => setNewTagColor(e.target.value)}
                  className="w-20 h-8"
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setShowCreateDialog(false)}
                  disabled={creating}
                >
                  Cancelar
                </Button>
                <Button
                  onClick={createTag}
                  disabled={!newTagName.trim() || creating}
                >
                  {creating ? 'Criando...' : 'Criar Tag'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default CRMTagsSelector;

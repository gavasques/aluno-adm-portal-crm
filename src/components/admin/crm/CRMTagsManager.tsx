
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Edit, Trash2, Palette, Save, X } from 'lucide-react';
import { useCRMTags } from '@/hooks/crm/useCRMTags';
import { toast } from 'sonner';

interface CRMTagsManagerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface TagFormData {
  name: string;
  color: string;
}

const CRMTagsManager = ({ open, onOpenChange }: CRMTagsManagerProps) => {
  const { tags, loading, createTag, updateTag, deleteTag } = useCRMTags();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingTag, setEditingTag] = useState<string | null>(null);
  const [formData, setFormData] = useState<TagFormData>({ name: '', color: '#3b82f6' });
  const [submitting, setSubmitting] = useState(false);

  const predefinedColors = [
    '#3b82f6', '#ef4444', '#22c55e', '#f59e0b', '#8b5cf6',
    '#ec4899', '#06b6d4', '#84cc16', '#f97316', '#6366f1',
    '#10b981', '#f43f5e', '#0ea5e9', '#eab308', '#a855f7'
  ];

  const resetForm = () => {
    setFormData({ name: '', color: '#3b82f6' });
    setShowCreateForm(false);
    setEditingTag(null);
  };

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      toast.error('Nome da tag é obrigatório');
      return;
    }

    setSubmitting(true);
    try {
      if (editingTag) {
        await updateTag(editingTag, formData.name.trim(), formData.color);
        toast.success('Tag atualizada com sucesso!');
      } else {
        await createTag(formData.name.trim(), formData.color);
        toast.success('Tag criada com sucesso!');
      }
      resetForm();
    } catch (error) {
      toast.error(editingTag ? 'Erro ao atualizar tag' : 'Erro ao criar tag');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (tag: any) => {
    setFormData({ name: tag.name, color: tag.color });
    setEditingTag(tag.id);
    setShowCreateForm(true);
  };

  const handleDelete = async (tagId: string, tagName: string) => {
    if (window.confirm(`Tem certeza que deseja excluir a tag "${tagName}"?`)) {
      try {
        await deleteTag(tagId);
        toast.success('Tag excluída com sucesso!');
      } catch (error) {
        toast.error('Erro ao excluir tag');
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Gerenciar Tags do CRM
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Botão para criar nova tag */}
          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">
              Gerencie as tags utilizadas para categorizar leads no CRM
            </p>
            <Button
              onClick={() => setShowCreateForm(true)}
              disabled={showCreateForm}
            >
              <Plus className="h-4 w-4 mr-2" />
              Nova Tag
            </Button>
          </div>

          {/* Formulário de criação/edição */}
          {showCreateForm && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  {editingTag ? 'Editar Tag' : 'Nova Tag'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="tag-name">Nome da Tag</Label>
                    <Input
                      id="tag-name"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Nome da tag"
                      disabled={submitting}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Cor da Tag</Label>
                    <div className="flex flex-wrap gap-2">
                      {predefinedColors.map(color => (
                        <button
                          key={color}
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, color }))}
                          className={`w-8 h-8 rounded-full border-2 transition-all ${
                            formData.color === color ? 'border-gray-900 scale-110' : 'border-gray-300 hover:scale-105'
                          }`}
                          style={{ backgroundColor: color }}
                          disabled={submitting}
                        />
                      ))}
                    </div>
                    <Input
                      type="color"
                      value={formData.color}
                      onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
                      className="w-20 h-8"
                      disabled={submitting}
                    />
                  </div>
                </div>

                {/* Preview da tag */}
                {formData.name && (
                  <div className="space-y-2">
                    <Label>Preview</Label>
                    <div>
                      <Badge
                        variant="outline"
                        style={{ 
                          backgroundColor: formData.color + '15', 
                          color: formData.color,
                          borderColor: formData.color + '30'
                        }}
                      >
                        {formData.name}
                      </Badge>
                    </div>
                  </div>
                )}

                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={resetForm}
                    disabled={submitting}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Cancelar
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    disabled={!formData.name.trim() || submitting}
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {submitting ? 'Salvando...' : editingTag ? 'Atualizar' : 'Criar Tag'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Lista de tags existentes */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Tags Existentes ({tags.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : tags.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Palette className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Nenhuma tag criada ainda</p>
                  <p className="text-sm">Clique em "Nova Tag" para começar</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {tags.map(tag => (
                    <div
                      key={tag.id}
                      className="flex items-center justify-between p-3 border rounded-lg bg-gray-50"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-4 h-4 rounded-full border"
                          style={{ backgroundColor: tag.color }}
                        />
                        <span className="font-medium">{tag.name}</span>
                      </div>
                      
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(tag)}
                          className="h-8 w-8 p-0"
                          disabled={editingTag === tag.id}
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(tag.id, tag.name)}
                          className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CRMTagsManager;

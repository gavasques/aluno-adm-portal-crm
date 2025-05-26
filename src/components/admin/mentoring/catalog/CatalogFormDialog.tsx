
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Save, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useMentorsForEnrollment } from '@/hooks/admin/useMentorsForEnrollment';
import { MentoringCatalog, CreateMentoringCatalogData } from '@/types/mentoring.types';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

interface CatalogFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  catalog: MentoringCatalog | null;
  onSubmit: (data: CreateMentoringCatalogData) => Promise<void>;
  isLoading: boolean;
}

const CatalogFormDialog: React.FC<CatalogFormDialogProps> = ({
  open,
  onOpenChange,
  catalog,
  onSubmit,
  isLoading
}) => {
  const { toast } = useToast();
  const { mentors, loading: mentorsLoading } = useMentorsForEnrollment();

  const [formData, setFormData] = useState<CreateMentoringCatalogData>({
    name: '',
    type: 'Individual',
    instructor: '',
    durationWeeks: 4,
    numberOfSessions: 4,
    price: 0,
    description: '',
    active: true,
    status: 'Ativa'
  });

  // Configuração do editor de texto rico
  const quillModules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline'],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['blockquote', 'code-block'],
      ['link'],
      ['clean']
    ]
  };

  const quillFormats = [
    'header', 'bold', 'italic', 'underline',
    'color', 'background', 'list', 'bullet',
    'blockquote', 'code-block', 'link'
  ];

  useEffect(() => {
    if (catalog) {
      setFormData({
        name: catalog.name,
        type: catalog.type,
        instructor: catalog.instructor,
        durationWeeks: catalog.durationWeeks,
        numberOfSessions: catalog.numberOfSessions,
        price: catalog.price,
        description: catalog.description,
        active: catalog.active,
        status: catalog.status
      });
    } else {
      setFormData({
        name: '',
        type: 'Individual',
        instructor: '',
        durationWeeks: 4,
        numberOfSessions: 4,
        price: 0,
        description: '',
        active: true,
        status: 'Ativa'
      });
    }
  }, [catalog, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.instructor.trim()) {
      toast({
        title: "Erro",
        description: "Nome da mentoria e mentor são obrigatórios",
        variant: "destructive"
      });
      return;
    }

    try {
      await onSubmit(formData);
      toast({
        title: "Sucesso",
        description: catalog ? "Mentoria atualizada com sucesso!" : "Mentoria criada com sucesso!",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao salvar mentoria. Tente novamente.",
        variant: "destructive"
      });
    }
  };

  const handleInputChange = (field: keyof CreateMentoringCatalogData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Save className="h-5 w-5" />
            {catalog ? 'Editar Mentoria' : 'Nova Mentoria'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Nome da Mentoria */}
          <div className="space-y-2">
            <Label htmlFor="name">Nome da Mentoria *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Nome da mentoria"
              required
            />
          </div>

          {/* Descrição com Editor Rico */}
          <div className="space-y-2">
            <Label htmlFor="description">Descrição *</Label>
            <div className="min-h-[200px]">
              <ReactQuill
                theme="snow"
                value={formData.description}
                onChange={(value) => handleInputChange('description', value)}
                modules={quillModules}
                formats={quillFormats}
                placeholder="Descreva os objetivos e conteúdo da mentoria..."
                style={{ height: '150px' }}
              />
            </div>
          </div>

          {/* Tipo e Mentor */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Tipo *</Label>
              <Select
                value={formData.type}
                onValueChange={(value: 'Individual' | 'Grupo') => handleInputChange('type', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Individual">Individual</SelectItem>
                  <SelectItem value="Grupo">Grupo</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="instructor">Mentor *</Label>
              <Select
                value={formData.instructor}
                onValueChange={(value) => handleInputChange('instructor', value)}
                disabled={mentorsLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder={mentorsLoading ? "Carregando mentores..." : "Selecione um mentor"} />
                </SelectTrigger>
                <SelectContent>
                  {mentors.map((mentor) => (
                    <SelectItem key={mentor.id} value={mentor.name}>
                      {mentor.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Duração, Sessões e Preço */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="durationWeeks">Duração (semanas) *</Label>
              <Input
                id="durationWeeks"
                type="number"
                min="1"
                value={formData.durationWeeks}
                onChange={(e) => handleInputChange('durationWeeks', Number(e.target.value))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="numberOfSessions">Número de Sessões *</Label>
              <Input
                id="numberOfSessions"
                type="number"
                min="1"
                value={formData.numberOfSessions}
                onChange={(e) => handleInputChange('numberOfSessions', Number(e.target.value))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Preço (R$) *</Label>
              <Input
                id="price"
                type="number"
                min="0"
                step="0.01"
                value={formData.price}
                onChange={(e) => handleInputChange('price', Number(e.target.value))}
                required
              />
            </div>
          </div>

          {/* Status */}
          <div className="flex items-center space-x-2">
            <Switch
              id="active"
              checked={formData.active}
              onCheckedChange={(checked) => handleInputChange('active', checked)}
            />
            <Label htmlFor="active">Mentoria ativa</Label>
          </div>

          {/* Ações */}
          <div className="flex gap-2 justify-end pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              <X className="h-4 w-4 mr-1" />
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              <Save className="h-4 w-4 mr-1" />
              {isLoading ? 'Salvando...' : 'Salvar Alterações'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CatalogFormDialog;

import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Save, X } from 'lucide-react';
import { MentoringCatalog, CreateMentoringCatalogData } from '@/types/mentoring.types';
import { useMentors } from '@/hooks/useMentors';

interface CatalogFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  catalog?: MentoringCatalog | null;
  onSubmit: (data: CreateMentoringCatalogData) => Promise<void>;
  isLoading?: boolean;
}

const CatalogFormDialog: React.FC<CatalogFormDialogProps> = ({
  open,
  onOpenChange,
  catalog,
  onSubmit,
  isLoading = false
}) => {
  const { mentors, loading: mentorsLoading } = useMentors();
  const [formData, setFormData] = useState<CreateMentoringCatalogData>({
    name: '',
    type: 'Individual',
    instructor: '',
    durationWeeks: 4,
    numberOfSessions: 4,
    price: 0,
    description: '',
    active: true
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

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
        active: catalog.active
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
        active: true
      });
    }
    setErrors({});
  }, [catalog, open]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    }

    if (!formData.instructor.trim()) {
      newErrors.instructor = 'Mentor é obrigatório';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Descrição é obrigatória';
    }

    if (formData.durationWeeks < 1) {
      newErrors.durationWeeks = 'Duração deve ser pelo menos 1 semana';
    }

    if (formData.numberOfSessions < 1) {
      newErrors.numberOfSessions = 'Deve ter pelo menos 1 sessão';
    }

    if (formData.price < 0) {
      newErrors.price = 'Preço não pode ser negativo';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      await onSubmit(formData);
      onOpenChange(false);
    } catch (error) {
      console.error('Erro ao salvar mentoria:', error);
    }
  };

  const handleChange = (field: keyof CreateMentoringCatalogData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const getSelectedMentorName = (mentorId: string) => {
    const mentor = mentors.find(m => m.id === mentorId);
    return mentor ? `${mentor.name} (${mentor.email})` : mentorId;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {catalog ? 'Editar Mentoria' : 'Nova Mentoria'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Nome */}
          <div className="space-y-2">
            <Label htmlFor="name">Nome da Mentoria *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="Ex: E-commerce Avançado"
              className={errors.name ? 'border-red-500' : ''}
            />
            {errors.name && (
              <p className="text-sm text-red-600">{errors.name}</p>
            )}
          </div>

          {/* Descrição */}
          <div className="space-y-2">
            <Label htmlFor="description">Descrição *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Descreva o conteúdo e objetivos da mentoria..."
              rows={3}
              className={errors.description ? 'border-red-500' : ''}
            />
            {errors.description && (
              <p className="text-sm text-red-600">{errors.description}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Tipo */}
            <div className="space-y-2">
              <Label htmlFor="type">Tipo *</Label>
              <Select 
                value={formData.type} 
                onValueChange={(value: 'Individual' | 'Grupo') => handleChange('type', value)}
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

            {/* Mentor */}
            <div className="space-y-2">
              <Label htmlFor="instructor">Mentor *</Label>
              <Select 
                value={formData.instructor} 
                onValueChange={(value) => handleChange('instructor', value)}
                disabled={mentorsLoading}
              >
                <SelectTrigger className={errors.instructor ? 'border-red-500' : ''}>
                  <SelectValue placeholder={mentorsLoading ? "Carregando mentores..." : "Selecione um mentor"} />
                </SelectTrigger>
                <SelectContent>
                  {mentors.map((mentor) => (
                    <SelectItem key={mentor.id} value={mentor.id}>
                      {mentor.name} ({mentor.email})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.instructor && (
                <p className="text-sm text-red-600">{errors.instructor}</p>
              )}
              {mentors.length === 0 && !mentorsLoading && (
                <p className="text-sm text-amber-600">
                  Nenhum mentor encontrado. Marque usuários como mentores na gestão de usuários.
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {/* Duração */}
            <div className="space-y-2">
              <Label htmlFor="durationWeeks">Duração (semanas) *</Label>
              <Input
                id="durationWeeks"
                type="number"
                min="1"
                value={formData.durationWeeks}
                onChange={(e) => handleChange('durationWeeks', parseInt(e.target.value) || 0)}
                className={errors.durationWeeks ? 'border-red-500' : ''}
              />
              {errors.durationWeeks && (
                <p className="text-sm text-red-600">{errors.durationWeeks}</p>
              )}
            </div>

            {/* Sessões */}
            <div className="space-y-2">
              <Label htmlFor="numberOfSessions">Número de Sessões *</Label>
              <Input
                id="numberOfSessions"
                type="number"
                min="1"
                value={formData.numberOfSessions}
                onChange={(e) => handleChange('numberOfSessions', parseInt(e.target.value) || 0)}
                className={errors.numberOfSessions ? 'border-red-500' : ''}
              />
              {errors.numberOfSessions && (
                <p className="text-sm text-red-600">{errors.numberOfSessions}</p>
              )}
            </div>

            {/* Preço */}
            <div className="space-y-2">
              <Label htmlFor="price">Preço (R$) *</Label>
              <Input
                id="price"
                type="number"
                min="0"
                step="0.01"
                value={formData.price}
                onChange={(e) => handleChange('price', parseFloat(e.target.value) || 0)}
                className={errors.price ? 'border-red-500' : ''}
              />
              {errors.price && (
                <p className="text-sm text-red-600">{errors.price}</p>
              )}
            </div>
          </div>

          {/* Status Ativo */}
          <div className="flex items-center space-x-2">
            <Switch
              id="active"
              checked={formData.active}
              onCheckedChange={(checked) => handleChange('active', checked)}
            />
            <Label htmlFor="active">Mentoria ativa</Label>
          </div>

          <DialogFooter className="flex gap-2">
            <Button 
              type="button"
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              <X className="h-4 w-4 mr-2" />
              Cancelar
            </Button>
            <Button 
              type="submit"
              disabled={isLoading || mentorsLoading}
            >
              <Save className="h-4 w-4 mr-2" />
              {isLoading ? 'Salvando...' : catalog ? 'Salvar Alterações' : 'Criar Mentoria'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CatalogFormDialog;

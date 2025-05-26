
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Save, X } from 'lucide-react';

interface MentoringCatalog {
  id: string;
  title: string;
  mentor: string;
  students: number;
  duration: string;
  date: string;
  status: "Agendada" | "Em Andamento" | "Concluída" | "Cancelada";
  category: string;
  type: "Individual" | "Grupo";
  price: number;
  description: string;
}

interface CatalogEditModalProps {
  catalog: MentoringCatalog | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedCatalog: MentoringCatalog) => void;
}

const CatalogEditModal: React.FC<CatalogEditModalProps> = ({
  catalog,
  isOpen,
  onClose,
  onSave
}) => {
  const [formData, setFormData] = useState<MentoringCatalog | null>(null);

  useEffect(() => {
    if (catalog) {
      setFormData({ ...catalog });
    }
  }, [catalog]);

  const handleInputChange = (field: keyof MentoringCatalog, value: any) => {
    if (formData) {
      setFormData({
        ...formData,
        [field]: value
      });
    }
  };

  const handleSave = () => {
    if (formData) {
      onSave(formData);
      onClose();
    }
  };

  if (!formData) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Save className="h-5 w-5" />
            Editar Mentoria
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Informações Básicas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Título da Mentoria</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="Nome da mentoria"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="mentor">Mentor</Label>
              <Input
                id="mentor"
                value={formData.mentor}
                onChange={(e) => handleInputChange('mentor', e.target.value)}
                placeholder="Nome do mentor"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Tipo</Label>
              <Select
                value={formData.type}
                onValueChange={(value: "Individual" | "Grupo") => handleInputChange('type', value)}
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
              <Label htmlFor="category">Categoria</Label>
              <Input
                id="category"
                value={formData.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
                placeholder="Categoria da mentoria"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration">Duração</Label>
              <Input
                id="duration"
                value={formData.duration}
                onChange={(e) => handleInputChange('duration', e.target.value)}
                placeholder="Ex: 2h, 1h30m"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Preço (R$)</Label>
              <Input
                id="price"
                type="number"
                value={formData.price}
                onChange={(e) => handleInputChange('price', Number(e.target.value))}
                placeholder="299"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="students">Máximo de Alunos</Label>
              <Input
                id="students"
                type="number"
                value={formData.students}
                onChange={(e) => handleInputChange('students', Number(e.target.value))}
                placeholder="10"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value: "Agendada" | "Em Andamento" | "Concluída" | "Cancelada") => handleInputChange('status', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Agendada">Agendada</SelectItem>
                  <SelectItem value="Em Andamento">Em Andamento</SelectItem>
                  <SelectItem value="Concluída">Concluída</SelectItem>
                  <SelectItem value="Cancelada">Cancelada</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Descrição */}
          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Descreva os objetivos e conteúdo da mentoria..."
              rows={4}
            />
          </div>

          {/* Ações */}
          <div className="flex gap-2 justify-end pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              <X className="h-4 w-4 mr-1" />
              Cancelar
            </Button>
            <Button onClick={handleSave}>
              <Save className="h-4 w-4 mr-1" />
              Salvar Alterações
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CatalogEditModal;

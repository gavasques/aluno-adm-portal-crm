import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Save, X, BookOpen, Clock, Link as LinkIcon, Calculator } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useMentorsForEnrollment } from '@/hooks/admin/useMentorsForEnrollment';
import { MentoringCatalog, CreateMentoringCatalogData, MentoringExtensionOption, CheckoutLinks } from '@/types/mentoring.types';
import { calculateSessionsFromFrequency, getFrequencyLabel } from '@/utils/mentoringCalculations';
import ExtensionsManager from './ExtensionsManager';
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

  const [formData, setFormData] = useState<CreateMentoringCatalogData & { extensions?: MentoringExtensionOption[] }>({
    name: '',
    type: 'Individual',
    instructor: '',
    durationMonths: 3,
    frequency: 'Semanal',
    numberOfSessions: 0,
    price: 0,
    description: '',
    active: true,
    status: 'Ativa',
    extensions: [],
    checkoutLinks: {
      mercadoPago: '',
      hubla: '',
      hotmart: ''
    }
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
        durationMonths: catalog.durationMonths || 3,
        frequency: catalog.frequency || 'Semanal',
        numberOfSessions: catalog.numberOfSessions,
        price: catalog.price,
        description: catalog.description,
        active: catalog.active,
        status: catalog.status,
        extensions: catalog.extensions || [],
        checkoutLinks: catalog.checkoutLinks || {
          mercadoPago: '',
          hubla: '',
          hotmart: ''
        }
      });
    } else {
      const initialSessions = calculateSessionsFromFrequency(3, 'Semanal');
      setFormData({
        name: '',
        type: 'Individual',
        instructor: '',
        durationMonths: 3,
        frequency: 'Semanal',
        numberOfSessions: initialSessions,
        price: 0,
        description: '',
        active: true,
        status: 'Ativa',
        extensions: [],
        checkoutLinks: {
          mercadoPago: '',
          hubla: '',
          hotmart: ''
        }
      });
    }
  }, [catalog, open]);

  // Recalcular sessões quando duração ou frequência mudar
  useEffect(() => {
    const calculatedSessions = calculateSessionsFromFrequency(formData.durationMonths, formData.frequency);
    if (calculatedSessions !== formData.numberOfSessions) {
      setFormData(prev => ({
        ...prev,
        numberOfSessions: calculatedSessions
      }));
    }
  }, [formData.durationMonths, formData.frequency]);

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
      console.log('🚀 Enviando dados do formulário:', formData);
      console.log('📋 Extensões incluídas:', formData.extensions);
      
      await onSubmit(formData);
      toast({
        title: "Sucesso",
        description: catalog ? "Mentoria atualizada com sucesso!" : "Mentoria criada com sucesso!",
      });
      onOpenChange(false);
    } catch (error) {
      console.error('Erro ao salvar mentoria:', error);
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

  const handleMentorChange = (mentorId: string) => {
    const selectedMentor = mentors.find(mentor => mentor.id === mentorId);
    if (selectedMentor) {
      handleInputChange('instructor', selectedMentor.name);
    }
  };

  const handleExtensionsChange = (extensions: MentoringExtensionOption[]) => {
    console.log('🔄 Atualizando extensões:', extensions);
    setFormData(prev => ({
      ...prev,
      extensions
    }));
  };

  const handleCheckoutLinkChange = (platform: keyof CheckoutLinks, value: string) => {
    setFormData(prev => ({
      ...prev,
      checkoutLinks: {
        ...prev.checkoutLinks,
        [platform]: value
      }
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Save className="h-5 w-5" />
            {catalog ? 'Editar Mentoria' : 'Nova Mentoria'}
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="basic" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Informações Básicas
            </TabsTrigger>
            <TabsTrigger value="checkout" className="flex items-center gap-2">
              <LinkIcon className="h-4 w-4" />
              Checkout
            </TabsTrigger>
            <TabsTrigger value="extensions" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Extensões ({formData.extensions?.length || 0})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-6 mt-4">
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
                    value={mentors.find(m => m.name === formData.instructor)?.id || ''}
                    onValueChange={handleMentorChange}
                    disabled={mentorsLoading}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={mentorsLoading ? "Carregando mentores..." : "Selecione um mentor"} />
                    </SelectTrigger>
                    <SelectContent>
                      {mentors.map((mentor) => (
                        <SelectItem key={mentor.id} value={mentor.id}>
                          {mentor.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Duração, Frequência e Sessões */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="durationMonths">Duração (meses) *</Label>
                  <Input
                    id="durationMonths"
                    type="number"
                    min="1"
                    max="24"
                    value={formData.durationMonths}
                    onChange={(e) => handleInputChange('durationMonths', Number(e.target.value))}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="frequency">Periodicidade *</Label>
                  <Select
                    value={formData.frequency}
                    onValueChange={(value: 'Semanal' | 'Quinzenal' | 'Mensal') => handleInputChange('frequency', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Semanal">Semanal</SelectItem>
                      <SelectItem value="Quinzenal">Quinzenal</SelectItem>
                      <SelectItem value="Mensal">Mensal</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-gray-500">
                    {getFrequencyLabel(formData.frequency)}
                  </p>
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Calculator className="h-4 w-4" />
                    Sessões Calculadas
                  </Label>
                  <div className="flex items-center gap-2">
                    <Input
                      value={formData.numberOfSessions || 0}
                      disabled
                      className="bg-gray-50"
                    />
                    <span className="text-xs text-gray-500">auto</span>
                  </div>
                  <p className="text-xs text-blue-600">
                    {formData.durationMonths} meses × {formData.frequency.toLowerCase()}
                  </p>
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
            </form>
          </TabsContent>

          <TabsContent value="checkout" className="mt-4">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">Links de Checkout da Mentoria Base</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Configure os links de checkout para as diferentes plataformas de pagamento
                </p>
              </div>
              
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="mercadoPago">Mercado Pago</Label>
                  <Input
                    id="mercadoPago"
                    placeholder="https://..."
                    value={formData.checkoutLinks?.mercadoPago || ''}
                    onChange={(e) => handleCheckoutLinkChange('mercadoPago', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="hubla">Hubla</Label>
                  <Input
                    id="hubla"
                    placeholder="https://..."
                    value={formData.checkoutLinks?.hubla || ''}
                    onChange={(e) => handleCheckoutLinkChange('hubla', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="hotmart">Hotmart</Label>
                  <Input
                    id="hotmart"
                    placeholder="https://..."
                    value={formData.checkoutLinks?.hotmart || ''}
                    onChange={(e) => handleCheckoutLinkChange('hotmart', e.target.value)}
                  />
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="extensions" className="mt-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">Opções de Extensão</h3>
                  <p className="text-sm text-gray-600">
                    Configure opções de extensão que podem ser oferecidas aos clientes
                  </p>
                  {formData.durationMonths > 0 && (
                    <p className="text-sm text-blue-600 mt-1">
                      Duração base da mentoria: {formData.durationMonths} {formData.durationMonths === 1 ? 'mês' : 'meses'}
                    </p>
                  )}
                </div>
                <div className="text-sm text-gray-500">
                  {formData.extensions?.length || 0} extensão(ões) configurada(s)
                </div>
              </div>
              
              <ExtensionsManager
                extensions={formData.extensions || []}
                onExtensionsChange={handleExtensionsChange}
                baseDurationMonths={formData.durationMonths}
                basePrice={formData.price}
              />
            </div>
          </TabsContent>
        </Tabs>

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
          <Button 
            onClick={handleSubmit} 
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Save className="h-4 w-4 mr-1" />
            {isLoading ? 'Salvando...' : 'Salvar Alterações'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CatalogFormDialog;


import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Save, X, BookOpen, Plus, User, Users, Calendar, DollarSign, Settings, Edit, Zap } from 'lucide-react';
import ExtensionsManager from './ExtensionsManager';
import { MentoringExtensionOption } from '@/types/mentoring.types';

interface MentoringCatalog {
  id: string;
  title: string;
  mentor: string;
  duration: string;
  date: string;
  status: "Ativa" | "Inativa" | "Cancelada";
  category: string;
  type: "Individual" | "Grupo";
  price: number;
  description: string;
  extensions?: MentoringExtensionOption[];
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
      setFormData({ 
        ...catalog,
        extensions: catalog.extensions || []
      });
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

  const handleExtensionsChange = (extensions: MentoringExtensionOption[]) => {
    if (formData) {
      setFormData({
        ...formData,
        extensions
      });
    }
  };

  const handleSave = () => {
    if (formData) {
      onSave(formData);
      onClose();
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Individual': return 'bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800 border-purple-300';
      case 'Grupo': return 'bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border-blue-300';
      default: return 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 border-gray-300';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Ativa": return "bg-gradient-to-r from-green-100 to-green-200 text-green-800 border-green-300";
      case "Inativa": return "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 border-gray-300";
      case "Cancelada": return "bg-gradient-to-r from-red-100 to-red-200 text-red-800 border-red-300";
      default: return "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 border-gray-300";
    }
  };

  if (!formData) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto bg-white">
        <DialogHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg text-white shadow-lg">
                <Edit className="h-5 w-5" />
              </div>
              <div>
                <DialogTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  Editar Mentoria
                </DialogTitle>
                <div className="flex items-center gap-2 mt-1">
                  <Badge className={`text-xs px-2 py-1 border ${getTypeColor(formData.type)}`}>
                    {formData.type === 'Individual' ? (
                      <><User className="h-3 w-3 mr-1" />{formData.type}</>
                    ) : (
                      <><Users className="h-3 w-3 mr-1" />{formData.type}</>
                    )}
                  </Badge>
                  <Badge className={`text-xs px-2 py-1 border ${getStatusColor(formData.status)}`}>
                    {formData.status}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </DialogHeader>

        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-gray-100 p-1">
            <TabsTrigger 
              value="basic" 
              className="flex items-center gap-2 text-sm data-[state=active]:bg-white data-[state=active]:shadow-sm"
            >
              <Settings className="h-4 w-4" />
              Informações Básicas
            </TabsTrigger>
            <TabsTrigger 
              value="extensions" 
              className="flex items-center gap-2 text-sm data-[state=active]:bg-white data-[state=active]:shadow-sm"
            >
              <Zap className="h-4 w-4" />
              Extensões
            </TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-4 mt-4">
            {/* Card de Informações Básicas */}
            <Card className="border-0 shadow-sm bg-gradient-to-br from-gray-50 to-gray-100 hover:shadow-md transition-all duration-300">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold text-gray-900 flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-blue-500" />
                  Dados da Mentoria
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="title" className="text-sm font-medium text-gray-700">Título da Mentoria</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      placeholder="Nome da mentoria"
                      className="border-gray-200 focus:border-blue-500 focus:ring-blue-500 h-9 text-sm"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="mentor" className="text-sm font-medium text-gray-700">Mentor</Label>
                    <Input
                      id="mentor"
                      value={formData.mentor}
                      onChange={(e) => handleInputChange('mentor', e.target.value)}
                      placeholder="Nome do mentor"
                      className="border-gray-200 focus:border-blue-500 focus:ring-blue-500 h-9 text-sm"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="type" className="text-sm font-medium text-gray-700">Tipo</Label>
                    <Select
                      value={formData.type}
                      onValueChange={(value: "Individual" | "Grupo") => handleInputChange('type', value)}
                    >
                      <SelectTrigger className="border-gray-200 focus:border-blue-500 h-9 text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Individual">
                          <div className="flex items-center gap-2">
                            <User className="h-3 w-3" />
                            Individual
                          </div>
                        </SelectItem>
                        <SelectItem value="Grupo">
                          <div className="flex items-center gap-2">
                            <Users className="h-3 w-3" />
                            Grupo
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category" className="text-sm font-medium text-gray-700">Categoria</Label>
                    <Input
                      id="category"
                      value={formData.category}
                      onChange={(e) => handleInputChange('category', e.target.value)}
                      placeholder="Categoria da mentoria"
                      className="border-gray-200 focus:border-blue-500 focus:ring-blue-500 h-9 text-sm"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="duration" className="text-sm font-medium text-gray-700">Duração</Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        id="duration"
                        value={formData.duration}
                        onChange={(e) => handleInputChange('duration', e.target.value)}
                        placeholder="Ex: 2h, 1h30m"
                        className="pl-10 border-gray-200 focus:border-blue-500 focus:ring-blue-500 h-9 text-sm"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="price" className="text-sm font-medium text-gray-700">Preço (R$)</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        id="price"
                        type="number"
                        value={formData.price}
                        onChange={(e) => handleInputChange('price', Number(e.target.value))}
                        placeholder="299"
                        className="pl-10 border-gray-200 focus:border-blue-500 focus:ring-blue-500 h-9 text-sm"
                      />
                    </div>
                  </div>
                </div>

                <Separator className="my-4" />

                <div className="space-y-2">
                  <Label htmlFor="status" className="text-sm font-medium text-gray-700">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value: "Ativa" | "Inativa" | "Cancelada") => handleInputChange('status', value)}
                  >
                    <SelectTrigger className="border-gray-200 focus:border-blue-500 h-9 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Ativa">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          Ativa
                        </div>
                      </SelectItem>
                      <SelectItem value="Inativa">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                          Inativa
                        </div>
                      </SelectItem>
                      <SelectItem value="Cancelada">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                          Cancelada
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Card de Descrição */}
            <Card className="border-0 shadow-sm bg-white hover:shadow-md transition-all duration-300">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold text-gray-900">Descrição</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Descreva os objetivos e conteúdo da mentoria..."
                  rows={4}
                  className="border-gray-200 focus:border-blue-500 focus:ring-blue-500 text-sm resize-none"
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="extensions" className="mt-4">
            <Card className="border-0 shadow-sm bg-gradient-to-br from-blue-50 to-blue-100 hover:shadow-md transition-all duration-300">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold text-gray-900 flex items-center gap-2">
                  <Zap className="h-4 w-4 text-blue-600" />
                  Gerenciar Extensões
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ExtensionsManager
                  extensions={formData.extensions || []}
                  onExtensionsChange={handleExtensionsChange}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <DialogFooter className="pt-4 border-t border-gray-200 mt-6">
          <div className="flex gap-2 w-full justify-end">
            <Button 
              variant="outline" 
              onClick={onClose}
              className="bg-white hover:bg-gray-50 border-gray-200 text-gray-700 h-9 px-4 text-sm"
            >
              <X className="h-4 w-4 mr-1" />
              Cancelar
            </Button>
            <Button 
              onClick={handleSave}
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-md hover:shadow-lg transition-all duration-300 h-9 px-4 text-sm"
            >
              <Save className="h-4 w-4 mr-1" />
              Salvar Alterações
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CatalogEditModal;

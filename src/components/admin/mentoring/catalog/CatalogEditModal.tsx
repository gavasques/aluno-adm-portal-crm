
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
import { Switch } from '@/components/ui/switch';
import { Save, X, BookOpen, Plus, User, Users, Calendar, DollarSign, Settings, Edit, Zap, Clock, Target } from 'lucide-react';
import ExtensionsManager from './ExtensionsManager';
import { MentoringExtensionOption } from '@/types/mentoring.types';

interface MentoringCatalog {
  id: string;
  name: string;
  instructor: string;
  durationMonths: number;
  numberOfSessions: number;
  active: boolean;
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

  const getStatusColor = (active: boolean) => {
    return active 
      ? "bg-gradient-to-r from-green-100 to-green-200 text-green-800 border-green-300"
      : "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 border-gray-300";
  };

  if (!formData) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-gray-50 to-white">
        <DialogHeader className="pb-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl text-white shadow-lg">
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
                  <Badge className={`text-xs px-2 py-1 border ${getStatusColor(formData.active)}`}>
                    {formData.active ? 'Ativa' : 'Inativa'}
                  </Badge>
                  {formData.extensions && formData.extensions.length > 0 && (
                    <Badge variant="outline" className="text-xs bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 border-blue-200">
                      <Plus className="h-3 w-3 mr-1" />
                      {formData.extensions.length} extensão(ões)
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </div>
        </DialogHeader>

        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-gray-100 p-1 rounded-lg">
            <TabsTrigger 
              value="basic" 
              className="flex items-center gap-2 text-sm data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-blue-600 transition-all duration-200"
            >
              <Settings className="h-4 w-4" />
              Informações Básicas
            </TabsTrigger>
            <TabsTrigger 
              value="extensions" 
              className="flex items-center gap-2 text-sm data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-blue-600 transition-all duration-200"
            >
              <Zap className="h-4 w-4" />
              Extensões
            </TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-4 mt-4">
            {/* Card de Informações Básicas */}
            <Card className="border-0 shadow-sm bg-white hover:shadow-md transition-all duration-300 border-l-4 border-l-blue-500">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold text-gray-900 flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-blue-500" />
                  Dados da Mentoria
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-medium text-gray-700 flex items-center gap-1">
                      <Target className="h-3 w-3 text-gray-500" />
                      Nome da Mentoria *
                    </Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="Nome da mentoria"
                      className="border-gray-200 focus:border-blue-500 focus:ring-blue-500 h-9 text-sm transition-all duration-200"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="instructor" className="text-sm font-medium text-gray-700 flex items-center gap-1">
                      <User className="h-3 w-3 text-gray-500" />
                      Mentor *
                    </Label>
                    <Input
                      id="instructor"
                      value={formData.instructor}
                      onChange={(e) => handleInputChange('instructor', e.target.value)}
                      placeholder="Nome do mentor"
                      className="border-gray-200 focus:border-blue-500 focus:ring-blue-500 h-9 text-sm transition-all duration-200"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="type" className="text-sm font-medium text-gray-700 flex items-center gap-1">
                      <Users className="h-3 w-3 text-gray-500" />
                      Tipo *
                    </Label>
                    <Select
                      value={formData.type}
                      onValueChange={(value: "Individual" | "Grupo") => handleInputChange('type', value)}
                    >
                      <SelectTrigger className="border-gray-200 focus:border-blue-500 h-9 text-sm transition-all duration-200">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-white border border-gray-200 shadow-lg">
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
                    <Label htmlFor="durationMonths" className="text-sm font-medium text-gray-700 flex items-center gap-1">
                      <Calendar className="h-3 w-3 text-gray-500" />
                      Duração (meses) *
                    </Label>
                    <Input
                      id="durationMonths"
                      type="number"
                      value={formData.durationMonths}
                      onChange={(e) => handleInputChange('durationMonths', Number(e.target.value))}
                      placeholder="3"
                      className="border-gray-200 focus:border-blue-500 focus:ring-blue-500 h-9 text-sm transition-all duration-200"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="numberOfSessions" className="text-sm font-medium text-gray-700 flex items-center gap-1">
                      <Clock className="h-3 w-3 text-gray-500" />
                      Número de Sessões *
                    </Label>
                    <Input
                      id="numberOfSessions"
                      type="number"
                      value={formData.numberOfSessions}
                      onChange={(e) => handleInputChange('numberOfSessions', Number(e.target.value))}
                      placeholder="12"
                      className="border-gray-200 focus:border-blue-500 focus:ring-blue-500 h-9 text-sm transition-all duration-200"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="price" className="text-sm font-medium text-gray-700 flex items-center gap-1">
                      <DollarSign className="h-3 w-3 text-gray-500" />
                      Preço (R$) *
                    </Label>
                    <Input
                      id="price"
                      type="number"
                      value={formData.price}
                      onChange={(e) => handleInputChange('price', Number(e.target.value))}
                      placeholder="299"
                      className="border-gray-200 focus:border-blue-500 focus:ring-blue-500 h-9 text-sm transition-all duration-200"
                    />
                  </div>
                </div>

                <Separator className="my-4" />

                <div className="flex items-center justify-between p-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border border-gray-200">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${formData.active ? 'bg-green-500' : 'bg-gray-400'} transition-colors duration-200`}></div>
                    <Label htmlFor="active" className="text-sm font-medium text-gray-700">
                      Status da Mentoria
                    </Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-600">{formData.active ? 'Ativa' : 'Inativa'}</span>
                    <Switch
                      id="active"
                      checked={formData.active}
                      onCheckedChange={(checked) => handleInputChange('active', checked)}
                      className="data-[state=checked]:bg-green-500"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Card de Descrição */}
            <Card className="border-0 shadow-sm bg-white hover:shadow-md transition-all duration-300 border-l-4 border-l-purple-500">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold text-gray-900 flex items-center gap-2">
                  <Edit className="h-4 w-4 text-purple-500" />
                  Descrição da Mentoria
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Descreva os objetivos e conteúdo da mentoria..."
                  rows={4}
                  className="border-gray-200 focus:border-purple-500 focus:ring-purple-500 text-sm resize-none transition-all duration-200"
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="extensions" className="mt-4">
            <Card className="border-0 shadow-sm bg-gradient-to-br from-blue-50 to-blue-100 hover:shadow-md transition-all duration-300 border-l-4 border-l-blue-600">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold text-gray-900 flex items-center gap-2">
                  <Zap className="h-4 w-4 text-blue-600" />
                  Gerenciar Extensões
                </CardTitle>
                <p className="text-xs text-gray-600 mt-1">Configure extensões adicionais para oferecer aos alunos</p>
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

        <DialogFooter className="pt-4 border-t border-gray-200 mt-6 bg-gray-50 rounded-b-lg -mx-6 px-6 pb-6">
          <div className="flex gap-3 w-full justify-end">
            <Button 
              variant="outline" 
              onClick={onClose}
              className="bg-white hover:bg-gray-50 border-gray-200 text-gray-700 h-9 px-4 text-sm transition-all duration-200 hover:shadow-sm"
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

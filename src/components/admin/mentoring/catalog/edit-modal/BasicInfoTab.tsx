
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { BookOpen, User, Users, Calendar, Clock, Target, DollarSign, Edit } from 'lucide-react';
import { MentoringCatalog } from '@/types/mentoring.types';

interface BasicInfoTabProps {
  formData: MentoringCatalog;
  onInputChange: (field: keyof MentoringCatalog, value: any) => void;
}

const BasicInfoTab: React.FC<BasicInfoTabProps> = ({ formData, onInputChange }) => {
  return (
    <div className="space-y-4">
      {/* Card de Informações Básicas */}
      <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-gray-50 hover:shadow-xl transition-all duration-300 border-l-4 border-l-blue-500">
        <CardHeader className="pb-4 bg-gradient-to-r from-blue-50 to-purple-50">
          <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-blue-500" />
            📋 Dados da Mentoria
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium text-gray-700 flex items-center gap-1">
                <Target className="h-4 w-4 text-gray-500" />
                Nome da Mentoria *
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => onInputChange('name', e.target.value)}
                placeholder="Nome da mentoria"
                className="border-gray-200 focus:border-blue-500 focus:ring-blue-500 h-10 text-sm transition-all duration-200 shadow-sm"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="instructor" className="text-sm font-medium text-gray-700 flex items-center gap-1">
                <User className="h-4 w-4 text-gray-500" />
                Mentor *
              </Label>
              <Input
                id="instructor"
                value={formData.instructor}
                onChange={(e) => onInputChange('instructor', e.target.value)}
                placeholder="Nome do mentor"
                className="border-gray-200 focus:border-blue-500 focus:ring-blue-500 h-10 text-sm transition-all duration-200 shadow-sm"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="type" className="text-sm font-medium text-gray-700 flex items-center gap-1">
                <Users className="h-4 w-4 text-gray-500" />
                Tipo *
              </Label>
              <Select value={formData.type} onValueChange={(value) => onInputChange('type', value)}>
                <SelectTrigger className="border-gray-200 focus:border-blue-500 focus:ring-blue-500 h-10 text-sm">
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Individual">Individual</SelectItem>
                  <SelectItem value="Grupo">Grupo</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="durationMonths" className="text-sm font-medium text-gray-700 flex items-center gap-1">
                <Calendar className="h-4 w-4 text-gray-500" />
                Duração (meses) *
              </Label>
              <Input
                id="durationMonths"
                type="number"
                min="1"
                max="24"
                value={formData.durationMonths}
                onChange={(e) => onInputChange('durationMonths', parseInt(e.target.value))}
                placeholder="3"
                className="border-gray-200 focus:border-blue-500 focus:ring-blue-500 h-10 text-sm transition-all duration-200 shadow-sm"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="numberOfSessions" className="text-sm font-medium text-gray-700 flex items-center gap-1">
                <Clock className="h-4 w-4 text-gray-500" />
                Número de Sessões *
              </Label>
              <Input
                id="numberOfSessions"
                type="number"
                min="1"
                max="50"
                value={formData.numberOfSessions}
                onChange={(e) => onInputChange('numberOfSessions', parseInt(e.target.value))}
                placeholder="12"
                className="border-gray-200 focus:border-blue-500 focus:ring-blue-500 h-10 text-sm transition-all duration-200 shadow-sm"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="price" className="text-sm font-medium text-gray-700 flex items-center gap-1">
                <DollarSign className="h-4 w-4 text-gray-500" />
                Preço (R$) *
              </Label>
              <Input
                id="price"
                type="number"
                min="0"
                step="0.01"
                value={formData.price}
                onChange={(e) => onInputChange('price', parseFloat(e.target.value))}
                placeholder="1200.00"
                className="border-gray-200 focus:border-blue-500 focus:ring-blue-500 h-10 text-sm transition-all duration-200 shadow-sm"
              />
            </div>
          </div>

          <Separator className="my-4" />

          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium text-gray-700 flex items-center gap-1">
              <Edit className="h-4 w-4 text-gray-500" />
              Descrição *
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => onInputChange('description', e.target.value)}
              placeholder="Descreva a mentoria..."
              rows={4}
              className="border-gray-200 focus:border-blue-500 focus:ring-blue-500 text-sm transition-all duration-200 shadow-sm resize-none"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <Label htmlFor="active" className="text-sm font-medium text-gray-700">
              Mentoria Ativa
            </Label>
            <Switch
              id="active"
              checked={formData.active}
              onCheckedChange={(checked) => onInputChange('active', checked)}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BasicInfoTab;


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
              <Select
                value={formData.type}
                onValueChange={(value: "Individual" | "Grupo") => onInputChange('type', value)}
              >
                <SelectTrigger className="border-gray-200 focus:border-blue-500 h-10 text-sm transition-all duration-200 shadow-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white border border-gray-200 shadow-lg">
                  <SelectItem value="Individual">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Individual
                    </div>
                  </SelectItem>
                  <SelectItem value="Grupo">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Grupo
                    </div>
                  </SelectItem>
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
                value={formData.durationMonths}
                onChange={(e) => onInputChange('durationMonths', Number(e.target.value))}
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
                value={formData.numberOfSessions}
                onChange={(e) => onInputChange('numberOfSessions', Number(e.target.value))}
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
                value={formData.price}
                onChange={(e) => onInputChange('price', Number(e.target.value))}
                placeholder="299"
                className="border-gray-200 focus:border-blue-500 focus:ring-blue-500 h-10 text-sm transition-all duration-200 shadow-sm"
              />
            </div>
          </div>

          <Separator className="my-4" />

          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${formData.active ? 'bg-green-500' : 'bg-gray-400'} transition-colors duration-200`}></div>
              <Label htmlFor="active" className="text-sm font-medium text-gray-700">
                Status da Mentoria
              </Label>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600">{formData.active ? 'Ativa' : 'Inativa'}</span>
              <Switch
                id="active"
                checked={formData.active}
                onCheckedChange={(checked) => onInputChange('active', checked)}
                className="data-[state=checked]:bg-green-500"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Card de Descrição */}
      <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-gray-50 hover:shadow-xl transition-all duration-300 border-l-4 border-l-purple-500">
        <CardHeader className="pb-4 bg-gradient-to-r from-purple-50 to-pink-50">
          <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Edit className="h-5 w-5 text-purple-500" />
            📝 Descrição da Mentoria
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => onInputChange('description', e.target.value)}
            placeholder="Descreva os objetivos e conteúdo da mentoria..."
            rows={4}
            className="border-gray-200 focus:border-purple-500 focus:ring-purple-500 text-sm resize-none transition-all duration-200 shadow-sm"
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default BasicInfoTab;

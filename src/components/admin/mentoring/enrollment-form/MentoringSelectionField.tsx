
import React from 'react';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { GraduationCap, Clock, Calendar, DollarSign, Plus } from 'lucide-react';
import { useSupabaseMentoring } from '@/hooks/mentoring/useSupabaseMentoring';
import { MentoringCatalog } from '@/types/mentoring.types';

interface MentoringSelectionFieldProps {
  selectedMentoring: MentoringCatalog | null;
  selectedExtensions: string[];
  onMentoringSelect: (mentoring: MentoringCatalog) => void;
  onExtensionToggle: (extensionId: string, checked: boolean) => void;
}

export const MentoringSelectionField = ({
  selectedMentoring,
  selectedExtensions,
  onMentoringSelect,
  onExtensionToggle
}: MentoringSelectionFieldProps) => {
  const { catalogs } = useSupabaseMentoring();
  const [isSelectingMentoring, setIsSelectingMentoring] = React.useState(false);

  const handleMentoringSelect = (mentoring: MentoringCatalog) => {
    onMentoringSelect(mentoring);
    setIsSelectingMentoring(false);
  };

  if (!selectedMentoring && !isSelectingMentoring) {
    return (
      <div className="space-y-2">
        <Label className="text-sm font-medium text-gray-700">
          Mentoria *
        </Label>
        <Button
          variant="outline"
          onClick={() => setIsSelectingMentoring(true)}
          className="w-full h-12 border-dashed border-2 border-gray-300 hover:border-blue-400 hover:bg-blue-50"
        >
          <GraduationCap className="w-5 h-5 mr-2 text-gray-400" />
          Selecionar Mentoria
        </Button>
      </div>
    );
  }

  if (isSelectingMentoring) {
    return (
      <div className="space-y-2">
        <Label className="text-sm font-medium text-gray-700">
          Selecionar Mentoria *
        </Label>
        <div className="grid gap-3 max-h-80 overflow-y-auto">
          {catalogs.map((mentoring) => (
            <Card
              key={mentoring.id}
              className="cursor-pointer transition-all hover:shadow-md hover:border-blue-300"
              onClick={() => handleMentoringSelect(mentoring)}
            >
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-gray-900">{mentoring.name}</h3>
                  <Badge variant={mentoring.type === 'Individual' ? 'default' : 'secondary'}>
                    {mentoring.type}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 mb-3">{mentoring.description}</p>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span>{mentoring.numberOfSessions} sessões</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span>{mentoring.durationMonths} meses</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <DollarSign className="w-4 h-4 text-gray-400" />
                    <span>R$ {mentoring.price}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <GraduationCap className="w-4 h-4 text-gray-400" />
                    <span>{mentoring.instructor}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <Button
          variant="outline"
          onClick={() => setIsSelectingMentoring(false)}
          className="w-full"
        >
          Cancelar
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label className="text-sm font-medium text-gray-700">
          Mentoria Selecionada
        </Label>
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-semibold text-blue-900">{selectedMentoring.name}</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsSelectingMentoring(true)}
                className="text-blue-700 border-blue-300 hover:bg-blue-100"
              >
                Alterar
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm text-blue-800">
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4" />
                <span>{selectedMentoring.numberOfSessions} sessões</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4" />
                <span>{selectedMentoring.durationMonths} meses</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {selectedMentoring.extensions && selectedMentoring.extensions.length > 0 && (
        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-700">
            Extensões Disponíveis
          </Label>
          <div className="space-y-2">
            {selectedMentoring.extensions.map((extension) => (
              <Card key={extension.id} className="border-gray-200">
                <CardContent className="p-3">
                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id={extension.id}
                      checked={selectedExtensions.includes(extension.id)}
                      onCheckedChange={(checked) => 
                        onExtensionToggle(extension.id, checked as boolean)
                      }
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <label
                        htmlFor={extension.id}
                        className="text-sm font-medium text-gray-900 cursor-pointer"
                      >
                        Extensão de {extension.months} meses
                      </label>
                      {extension.description && (
                        <p className="text-xs text-gray-600 mt-1">{extension.description}</p>
                      )}
                      <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                        <div className="flex items-center space-x-1">
                          <Plus className="w-3 h-3" />
                          <span>{extension.totalSessions || 0} sessões</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <DollarSign className="w-3 h-3" />
                          <span>R$ {extension.price}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

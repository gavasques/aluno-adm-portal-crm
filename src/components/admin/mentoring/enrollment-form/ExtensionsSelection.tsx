
import React from 'react';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { MentoringCatalog } from '@/types/mentoring.types';

interface ExtensionsSelectionProps {
  selectedMentoring: MentoringCatalog | undefined;
  selectedExtensions: string[];
  onExtensionToggle: (extensionId: string, checked: boolean) => void;
  calculateTotalSessions: (mentoringId: string, extensions: string[]) => number;
}

export const ExtensionsSelection = ({
  selectedMentoring,
  selectedExtensions,
  onExtensionToggle,
  calculateTotalSessions
}: ExtensionsSelectionProps) => {
  if (!selectedMentoring?.extensions || selectedMentoring.extensions.length === 0) {
    return null;
  }

  return (
    <div className="border rounded-lg p-4 bg-blue-50 border-blue-200">
      <div className="flex items-center gap-2 mb-3">
        <Label className="text-lg font-semibold text-blue-800">Extensões Disponíveis</Label>
        <Badge variant="secondary" className="bg-blue-100 text-blue-800">
          {selectedMentoring.extensions.length} opção(ões)
        </Badge>
      </div>
      <p className="text-sm text-blue-600 mb-4">
        Selecione as extensões que deseja incluir nesta inscrição:
      </p>
      
      <div className="space-y-3">
        {selectedMentoring.extensions.map((extension) => (
          <div key={extension.id} className="flex items-start space-x-3 p-3 bg-white rounded-lg border border-blue-200">
            <Checkbox
              id={`extension-${extension.id}`}
              checked={selectedExtensions.includes(extension.id)}
              onCheckedChange={(checked) => 
                onExtensionToggle(extension.id, checked as boolean)
              }
            />
            <div className="flex-1 min-w-0">
              <label 
                htmlFor={`extension-${extension.id}`}
                className="text-sm font-medium text-gray-900 cursor-pointer block"
              >
                +{extension.months} meses ({extension.totalSessions || 0} sessões adicionais)
              </label>
              {extension.description && (
                <p className="text-xs text-gray-600 mt-1">{extension.description}</p>
              )}
              <p className="text-sm font-medium text-green-600 mt-1">
                R$ {extension.price.toFixed(2)}
              </p>
            </div>
          </div>
        ))}
      </div>
      
      {selectedExtensions.length > 0 && (
        <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
          <p className="text-sm font-medium text-green-800">
            Total de sessões: {calculateTotalSessions(selectedMentoring.id, selectedExtensions)}
          </p>
          <p className="text-sm text-green-600">
            Duração total: {selectedMentoring.durationMonths + selectedExtensions.reduce((acc, extId) => {
              const ext = selectedMentoring.extensions?.find(e => e.id === extId);
              return acc + (ext?.months || 0);
            }, 0)} meses
          </p>
        </div>
      )}
    </div>
  );
};

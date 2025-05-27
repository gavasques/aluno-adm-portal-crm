
import React from 'react';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { GraduationCap, Calendar, DollarSign } from 'lucide-react';
import { MentoringCatalog } from '@/types/mentoring.types';
import { Control } from 'react-hook-form';

interface MentoringSelectionFieldProps {
  control?: Control<any>;
  mentoringOptions?: MentoringCatalog[];
  loading?: boolean;
  onMentoringChange?: (mentoring: MentoringCatalog | null) => void;
  // Props para SteppedEnrollmentForm
  selectedMentoring?: MentoringCatalog | null;
  selectedExtensions?: string[];
  onMentoringSelect?: (mentoring: MentoringCatalog | null) => void;
  onExtensionToggle?: (extensionId: string, checked: boolean) => void;
}

export const MentoringSelectionField = ({
  control,
  mentoringOptions = [],
  loading = false,
  onMentoringChange,
  selectedMentoring,
  selectedExtensions = [],
  onMentoringSelect,
  onExtensionToggle
}: MentoringSelectionFieldProps) => {
  // Filtrar apenas mentorias individuais
  const individualMentorings = mentoringOptions.filter(mentoring => mentoring.type === 'Individual');

  const handleMentoringChange = (value: string) => {
    const selectedMentoring = individualMentorings.find(m => m.id === value);
    if (onMentoringChange) {
      onMentoringChange(selectedMentoring || null);
    }
    if (onMentoringSelect) {
      onMentoringSelect(selectedMentoring || null);
    }
  };

  // Se não tem control, renderizar versão simples
  if (!control) {
    return (
      <div className="space-y-4">
        <FormLabel className="flex items-center gap-2">
          <GraduationCap className="h-4 w-4" />
          Mentoria *
        </FormLabel>
        <Select 
          onValueChange={handleMentoringChange}
          value={selectedMentoring?.id || ''}
          disabled={loading}
        >
          <SelectTrigger className="bg-white">
            <SelectValue 
              placeholder={loading ? "Carregando mentorias..." : "Selecione uma mentoria individual"}
            />
          </SelectTrigger>
          <SelectContent>
            {individualMentorings.length === 0 ? (
              <div className="p-3 text-center text-gray-500 text-sm">
                {loading ? 'Carregando...' : 'Nenhuma mentoria individual encontrada'}
              </div>
            ) : (
              individualMentorings.map((mentoring) => (
                <SelectItem key={mentoring.id} value={mentoring.id}>
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center text-white text-xs font-medium">
                        {mentoring.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <span className="font-medium">{mentoring.name}</span>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">Individual</Badge>
                          <div className="flex items-center gap-1 text-xs text-gray-500">
                            <Calendar className="h-3 w-3" />
                            {mentoring.durationMonths} meses
                          </div>
                          <div className="flex items-center gap-1 text-xs text-gray-500">
                            <DollarSign className="h-3 w-3" />
                            R$ {mentoring.price.toFixed(2)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
      </div>
    );
  }

  return (
    <FormField
      control={control}
      name="mentoringId"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="flex items-center gap-2">
            <GraduationCap className="h-4 w-4" />
            Mentoria *
          </FormLabel>
          <Select 
            onValueChange={(value) => {
              field.onChange(value);
              handleMentoringChange(value);
            }} 
            value={field.value}
            disabled={loading}
          >
            <FormControl>
              <SelectTrigger className="bg-white">
                <SelectValue 
                  placeholder={loading ? "Carregando mentorias..." : "Selecione uma mentoria individual"}
                />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {individualMentorings.length === 0 ? (
                <div className="p-3 text-center text-gray-500 text-sm">
                  {loading ? 'Carregando...' : 'Nenhuma mentoria individual encontrada'}
                </div>
              ) : (
                individualMentorings.map((mentoring) => (
                  <SelectItem key={mentoring.id} value={mentoring.id}>
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center text-white text-xs font-medium">
                          {mentoring.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <span className="font-medium">{mentoring.name}</span>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="text-xs">Individual</Badge>
                            <div className="flex items-center gap-1 text-xs text-gray-500">
                              <Calendar className="h-3 w-3" />
                              {mentoring.durationMonths} meses
                            </div>
                            <div className="flex items-center gap-1 text-xs text-gray-500">
                              <DollarSign className="h-3 w-3" />
                              R$ {mentoring.price.toFixed(2)}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

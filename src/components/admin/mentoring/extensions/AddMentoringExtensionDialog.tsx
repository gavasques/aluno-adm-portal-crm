
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { StudentMentoringEnrollment, CreateExtensionData } from '@/types/mentoring.types';
import { Plus, Gift, Calendar, Target } from 'lucide-react';

interface AddMentoringExtensionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  enrollment: StudentMentoringEnrollment | null;
  onSubmit: (data: CreateExtensionData) => void;
  isLoading?: boolean;
}

export const AddMentoringExtensionDialog = ({
  open,
  onOpenChange,
  enrollment,
  onSubmit,
  isLoading = false
}: AddMentoringExtensionDialogProps) => {
  const [selectedExtensionId, setSelectedExtensionId] = useState('');
  const [notes, setNotes] = useState('');

  const availableExtensions = enrollment?.mentoring.extensions || [];
  const selectedExtension = availableExtensions.find(ext => ext.id === selectedExtensionId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!enrollment || !selectedExtension) return;

    const extensionData: CreateExtensionData = {
      enrollmentId: enrollment.id,
      extensionMonths: selectedExtension.months,
      notes: notes.trim() || `Extensão da mentoria: ${selectedExtension.description || `+${selectedExtension.months} meses`}`
    };

    onSubmit(extensionData);
    
    // Reset form
    setSelectedExtensionId('');
    setNotes('');
    onOpenChange(false);
  };

  if (!enrollment) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Gift className="h-5 w-5 text-purple-600" />
            Adicionar Extensão da Mentoria
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-sm font-medium text-gray-700">Inscrição:</p>
            <p className="text-sm text-gray-600">{enrollment.mentoring.name}</p>
          </div>

          {availableExtensions.length === 0 ? (
            <div className="text-center py-6 bg-yellow-50 rounded-lg border border-yellow-200">
              <Gift className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
              <p className="text-sm text-yellow-800 font-medium">
                Nenhuma extensão disponível
              </p>
              <p className="text-xs text-yellow-600 mt-1">
                Esta mentoria não possui extensões pré-configuradas
              </p>
            </div>
          ) : (
            <>
              <div className="space-y-2">
                <Label htmlFor="extension">Extensão Disponível *</Label>
                <Select value={selectedExtensionId} onValueChange={setSelectedExtensionId}>
                  <SelectTrigger className="bg-white">
                    <SelectValue placeholder="Selecione uma extensão..." />
                  </SelectTrigger>
                  <SelectContent>
                    {availableExtensions.map((extension) => (
                      <SelectItem key={extension.id} value={extension.id}>
                        <div className="flex items-center justify-between w-full">
                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3 text-gray-400" />
                              <span className="font-medium">+{extension.months} meses</span>
                            </div>
                            {extension.totalSessions && (
                              <div className="flex items-center gap-1">
                                <Target className="h-3 w-3 text-gray-400" />
                                <span className="text-sm">+{extension.totalSessions} sessões</span>
                              </div>
                            )}
                          </div>
                          <Badge variant="outline" className="ml-2">
                            R$ {extension.price.toFixed(2)}
                          </Badge>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedExtension && (
                <div className="bg-purple-50 rounded-lg p-3 border border-purple-200">
                  <h4 className="font-medium text-purple-800 mb-2">Resumo da Extensão</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-purple-700">Duração:</span>
                      <span className="font-medium">+{selectedExtension.months} meses</span>
                    </div>
                    {selectedExtension.totalSessions && (
                      <div className="flex justify-between">
                        <span className="text-purple-700">Sessões extras:</span>
                        <span className="font-medium">+{selectedExtension.totalSessions}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-purple-700">Preço:</span>
                      <span className="font-medium">R$ {selectedExtension.price.toFixed(2)}</span>
                    </div>
                    {selectedExtension.description && (
                      <div className="mt-2 pt-2 border-t border-purple-200">
                        <span className="text-purple-700">Descrição:</span>
                        <p className="text-purple-600 mt-1">{selectedExtension.description}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="notes">Observações</Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Observações sobre a aplicação desta extensão..."
                  className="bg-white resize-none"
                  rows={3}
                />
              </div>
            </>
          )}

          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isLoading || !selectedExtensionId || availableExtensions.length === 0}
              className="bg-purple-600 hover:bg-purple-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              {isLoading ? 'Aplicando...' : 'Aplicar Extensão'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

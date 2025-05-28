
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { GraduationCap, Loader2 } from 'lucide-react';
import { User } from '@/types/user.types';

interface MentorToggleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: User;
  onConfirmToggle: (user: User) => Promise<boolean>;
}

export const MentorToggleDialog: React.FC<MentorToggleDialogProps> = ({
  open,
  onOpenChange,
  user,
  onConfirmToggle
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      const success = await onConfirmToggle(user);
      if (success) {
        onOpenChange(false);
      }
    } catch (error) {
      console.error('Erro ao alterar status de mentor:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const isMentor = user.is_mentor;
  const action = isMentor ? 'remover' : 'tornar';
  const actionTitle = isMentor ? 'Remover como Mentor' : 'Tornar Mentor';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5" />
            {actionTitle}
          </DialogTitle>
          <DialogDescription>
            Você tem certeza que deseja {action} <strong>{user.name}</strong> {isMentor ? 'como mentor' : 'mentor'}?
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium">Usuário:</span>
                <span className="text-sm">{user.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Email:</span>
                <span className="text-sm">{user.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Status atual:</span>
                <span className="text-sm">
                  {isMentor ? '✅ É Mentor' : '❌ Não é Mentor'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Novo status:</span>
                <span className="text-sm">
                  {isMentor ? '❌ Não será Mentor' : '✅ Será Mentor'}
                </span>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={isLoading}
            variant={isMentor ? "destructive" : "default"}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processando...
              </>
            ) : (
              <>
                <GraduationCap className="mr-2 h-4 w-4" />
                {isMentor ? 'Remover Mentor' : 'Tornar Mentor'}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

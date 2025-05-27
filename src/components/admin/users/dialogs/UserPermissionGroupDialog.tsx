
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { usePermissionGroups } from "@/hooks/admin/usePermissionGroups";
import { Loader2, CheckCircle } from "lucide-react";

interface UserPermissionGroupDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string;
  userEmail: string;
  currentGroupId: string | null;
  onConfirmSetPermissionGroup: (groupId: string | null) => Promise<boolean>;
}

export const UserPermissionGroupDialog: React.FC<UserPermissionGroupDialogProps> = ({
  open,
  onOpenChange,
  userId,
  userEmail,
  currentGroupId,
  onConfirmSetPermissionGroup,
}) => {
  const { permissionGroups, isLoading } = usePermissionGroups();
  const [selectedGroupId, setSelectedGroupId] = useState<string>(currentGroupId || "none");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  // Atualizar o grupo selecionado quando o currentGroupId mudar
  useEffect(() => {
    if (open) {
      setSelectedGroupId(currentGroupId || "none");
      setSuccess(false);
    }
  }, [currentGroupId, open]);

  const handleSubmit = async () => {
    setSubmitting(true);
    
    try {
      const groupIdToUpdate = selectedGroupId === "none" ? null : selectedGroupId;
      const success = await onConfirmSetPermissionGroup(groupIdToUpdate);
      
      if (success) {
        setSuccess(true);
        setTimeout(() => {
          onOpenChange(false);
          setSuccess(false);
        }, 1500);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const selectedGroup = permissionGroups.find(g => g.id === selectedGroupId);
  const hasChanges = selectedGroupId !== (currentGroupId || "none");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Definir Grupo de Permissão</DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          <div className="mb-4">
            <p className="text-sm text-muted-foreground">
              Definindo grupo de permissão para: <span className="font-medium text-foreground">{userEmail}</span>
            </p>
          </div>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="permissionGroup">Grupo de Permissão</Label>
              <Select
                value={selectedGroupId}
                onValueChange={setSelectedGroupId}
                disabled={isLoading || submitting}
              >
                <SelectTrigger id="permissionGroup">
                  <SelectValue placeholder="Selecione um grupo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Nenhum grupo</SelectItem>
                  {permissionGroups.map((group) => (
                    <SelectItem key={group.id} value={group.id}>
                      {group.name} {group.is_admin && "(Admin)"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <div className="mt-2 space-y-1">
                {selectedGroup && (
                  <div className="text-sm text-blue-600 bg-blue-50 p-2 rounded">
                    <strong>Grupo selecionado:</strong> {selectedGroup.name}
                    {selectedGroup.description && (
                      <div className="text-xs mt-1">{selectedGroup.description}</div>
                    )}
                  </div>
                )}
                
                <p className="text-sm text-muted-foreground">
                  {selectedGroupId !== "none"
                    ? "O usuário terá acesso aos recursos definidos pelo grupo selecionado."
                    : "Sem grupo de permissão, o usuário terá acesso limitado ao sistema."}
                </p>
              </div>
            </div>

            {success && (
              <div className="flex items-center gap-2 text-green-600 bg-green-50 p-3 rounded-md">
                <CheckCircle className="h-5 w-5" />
                <span className="text-sm font-medium">Grupo atualizado com sucesso!</span>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex justify-end gap-3">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            disabled={submitting}
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={submitting || !hasChanges || success}
          >
            {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {success ? "Salvo!" : "Salvar"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};


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
import { Loader2, CheckCircle, AlertTriangle } from "lucide-react";

interface UserUnbanDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userEmail: string;
  onConfirmUnban: (groupId: string | null) => Promise<boolean>;
}

export const UserUnbanDialog: React.FC<UserUnbanDialogProps> = ({
  open,
  onOpenChange,
  userEmail,
  onConfirmUnban,
}) => {
  const { permissionGroups, isLoading } = usePermissionGroups();
  const [selectedGroupId, setSelectedGroupId] = useState<string>("none");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  // Filtrar grupos para excluir grupos de banimento
  const availableGroups = permissionGroups.filter(group => 
    !group.name.toLowerCase().includes('banido') && 
    !group.name.toLowerCase().includes('banned')
  );

  useEffect(() => {
    if (open) {
      setSelectedGroupId("none");
      setSuccess(false);
    }
  }, [open]);

  const handleSubmit = async () => {
    setSubmitting(true);
    
    try {
      const groupIdToUpdate = selectedGroupId === "none" ? null : selectedGroupId;
      const success = await onConfirmUnban(groupIdToUpdate);
      
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

  const selectedGroup = availableGroups.find(g => g.id === selectedGroupId);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-500" />
            Desbanir Usuário
          </DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          <div className="mb-4 p-3 bg-orange-50 border border-orange-200 rounded-md">
            <p className="text-sm text-orange-800">
              Desbaneando: <span className="font-medium">{userEmail}</span>
            </p>
            <p className="text-xs text-orange-600 mt-1">
              O usuário será removido do status de banido e receberá as permissões do grupo selecionado.
            </p>
          </div>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="permissionGroup">Novo Grupo de Permissão</Label>
              <Select
                value={selectedGroupId}
                onValueChange={setSelectedGroupId}
                disabled={isLoading || submitting}
              >
                <SelectTrigger id="permissionGroup">
                  <SelectValue placeholder="Selecione um grupo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Nenhum grupo (acesso limitado)</SelectItem>
                  {availableGroups.map((group) => (
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
                    ? "O usuário receberá as permissões do grupo selecionado."
                    : "O usuário terá acesso limitado até que um grupo seja atribuído."}
                </p>
              </div>
            </div>

            {success && (
              <div className="flex items-center gap-2 text-green-600 bg-green-50 p-3 rounded-md">
                <CheckCircle className="h-5 w-5" />
                <span className="text-sm font-medium">Usuário desbanido com sucesso!</span>
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
            disabled={submitting || success}
            className="bg-orange-600 hover:bg-orange-700"
          >
            {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {success ? "Desbanido!" : "Desbanir Usuário"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

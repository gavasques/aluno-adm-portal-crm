
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
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

interface UserPermissionGroupDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string;
  userEmail: string;
  currentGroupId: string | null;
  onSuccess: () => void;
}

const UserPermissionGroupDialog: React.FC<UserPermissionGroupDialogProps> = ({
  open,
  onOpenChange,
  userId,
  userEmail,
  currentGroupId,
  onSuccess,
}) => {
  const { permissionGroups, isLoading } = usePermissionGroups();
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(currentGroupId);
  const [submitting, setSubmitting] = useState(false);

  // Atualizar o grupo selecionado quando o currentGroupId mudar
  useEffect(() => {
    if (open) {
      setSelectedGroupId(currentGroupId);
    }
  }, [currentGroupId, open]);

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      
      const { error } = await supabase
        .from("profiles")
        .update({ permission_group_id: selectedGroupId })
        .eq("id", userId);
        
      if (error) throw error;
      
      toast({
        title: "Grupo de permissão atualizado",
        description: selectedGroupId
          ? "Usuário vinculado ao grupo com sucesso"
          : "Usuário removido de qualquer grupo de permissão",
      });
      
      onSuccess();
      onOpenChange(false);
    } catch (error: any) {
      console.error("Erro ao atualizar grupo de permissão do usuário:", error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o grupo de permissão",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

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
                value={selectedGroupId || ""}
                onValueChange={setSelectedGroupId}
                disabled={isLoading}
              >
                <SelectTrigger id="permissionGroup">
                  <SelectValue placeholder="Selecione um grupo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Nenhum grupo</SelectItem>
                  {permissionGroups.map((group) => (
                    <SelectItem key={group.id} value={group.id}>
                      {group.name} {group.is_admin && "(Admin)"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <p className="text-sm text-muted-foreground mt-1">
                {selectedGroupId
                  ? "O usuário terá acesso aos recursos definidos pelo grupo selecionado."
                  : "Sem grupo de permissão, o usuário terá acesso limitado ao sistema."}
              </p>
            </div>
          </div>
        </div>
        
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={submitting}>
            {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Salvar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UserPermissionGroupDialog;

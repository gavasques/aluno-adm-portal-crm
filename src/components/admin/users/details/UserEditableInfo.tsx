
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserPen, Save, X } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface UserEditableInfoProps {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    status: string;
    lastLogin: string;
    storage_used_mb?: number;
    storage_limit_mb?: number;
    tasks?: any[];
    is_mentor?: boolean;
  };
  onRefresh?: () => void;
}

const UserEditableInfo: React.FC<UserEditableInfoProps> = ({ user, onRefresh }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(user.name);
  const [editedEmail, setEditedEmail] = useState(user.email);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!editedName.trim() || !editedEmail.trim()) {
      toast({
        title: "Erro",
        description: "Nome e email são obrigatórios",
        variant: "destructive"
      });
      return;
    }

    setIsSaving(true);
    try {
      // Atualizar dados na tabela profiles
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          full_name: editedName.trim()
        })
        .eq('id', user.id);

      if (profileError) {
        console.error('Erro ao atualizar profile:', profileError);
      }

      // Atualizar email no auth.users (requer privilégios administrativos)
      const { error: authError } = await supabase.auth.admin.updateUserById(
        user.id,
        {
          email: editedEmail.trim(),
          user_metadata: {
            full_name: editedName.trim()
          }
        }
      );

      if (authError) {
        throw authError;
      }

      toast({
        title: "Sucesso",
        description: "Dados do usuário atualizados com sucesso"
      });

      setIsEditing(false);
      onRefresh?.();

    } catch (error: any) {
      console.error('Erro ao salvar:', error);
      toast({
        title: "Erro",
        description: error.message || "Erro ao atualizar dados do usuário",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setEditedName(user.name);
    setEditedEmail(user.email);
    setIsEditing(false);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <UserPen className="h-5 w-5" />
              Editar Dados do Usuário
            </CardTitle>
            <CardDescription>
              Altere as informações básicas do usuário
            </CardDescription>
          </div>
          {!isEditing && (
            <Button onClick={() => setIsEditing(true)} variant="outline">
              <UserPen className="h-4 w-4 mr-2" />
              Editar
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Nome Completo</Label>
          <Input
            id="name"
            value={editedName}
            onChange={(e) => setEditedName(e.target.value)}
            disabled={!isEditing}
            placeholder="Nome completo do usuário"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={editedEmail}
            onChange={(e) => setEditedEmail(e.target.value)}
            disabled={!isEditing}
            placeholder="Email do usuário"
          />
        </div>

        {isEditing && (
          <div className="flex gap-2 pt-4">
            <Button 
              onClick={handleSave} 
              disabled={isSaving}
              className="flex-1"
            >
              <Save className="h-4 w-4 mr-2" />
              {isSaving ? "Salvando..." : "Salvar"}
            </Button>
            <Button 
              onClick={handleCancel} 
              variant="outline"
              disabled={isSaving}
              className="flex-1"
            >
              <X className="h-4 w-4 mr-2" />
              Cancelar
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UserEditableInfo;

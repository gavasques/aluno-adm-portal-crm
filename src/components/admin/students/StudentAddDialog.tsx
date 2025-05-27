
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import StudentForm from "./StudentForm";
import { supabase } from "@/integrations/supabase/client";

interface StudentAddDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const StudentAddDialog: React.FC<StudentAddDialogProps> = ({
  open,
  onOpenChange,
}) => {
  const [userSearchError, setUserSearchError] = useState("");
  const [userFound, setUserFound] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCloseDialog = () => {
    setUserFound(null);
    setUserSearchError("");
    onOpenChange(false);
  };

  const handleFormSubmit = async (data, userFound) => {
    if (!userFound) {
      setUserSearchError("Você precisa relacionar um usuário válido");
      return;
    }

    try {
      setIsSubmitting(true);
      
      // Atualizar o profile do usuário com os dados do aluno
      const { error } = await supabase
        .from('profiles')
        .update({
          name: data.name,
          role: 'Student',
          status: 'Ativo',
          // Adicionar outros campos conforme necessário
        })
        .eq('id', userFound.id);

      if (error) throw error;

      // Criar registro de aluno com informações adicionais
      // (se necessário, em uma tabela separada)
      
      toast({
        title: "Aluno adicionado",
        description: `${data.name} foi adicionado com sucesso.`
      });
      
      handleCloseDialog();
      
      // Atualizar a lista de alunos após adicionar um novo
      window.location.reload();
    } catch (error) {
      console.error("Erro ao adicionar aluno:", error);
      toast({
        title: "Erro",
        description: "Não foi possível adicionar o aluno.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleCloseDialog}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Adicionar Novo Aluno</DialogTitle>
          <DialogDescription>
            Preencha os dados do aluno e relacione a um usuário existente.
          </DialogDescription>
        </DialogHeader>
        
        <StudentForm 
          onSubmit={handleFormSubmit}
          onCancel={handleCloseDialog}
          userSearchError={userSearchError}
          setUserSearchError={setUserSearchError}
          userFound={userFound}
          setUserFound={setUserFound}
          isSubmitting={isSubmitting}
        />
      </DialogContent>
    </Dialog>
  );
};

export default StudentAddDialog;

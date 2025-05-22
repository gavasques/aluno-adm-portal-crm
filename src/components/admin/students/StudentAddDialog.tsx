
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import StudentForm from "./StudentForm";
import { STUDENTS } from "@/data/students";

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

  const handleCloseDialog = () => {
    setUserFound(null);
    setUserSearchError("");
    onOpenChange(false);
  };

  const handleFormSubmit = (data, userFound) => {
    if (!userFound) {
      setUserSearchError("Você precisa relacionar um usuário válido");
      return;
    }
    
    // Create new student with user relation
    const newStudent = {
      id: STUDENTS.length + 1,
      name: data.name,
      email: data.email,
      phone: data.phone,
      company: data.company || "",
      amazonStoreLink: data.amazonStoreLink || "",
      studentState: data.studentState || "",
      companyState: data.companyState || "",
      usesFBA: data.usesFBA || "Não",
      status: "Ativo",
      lastLogin: "Hoje",
      registrationDate: new Date().toLocaleDateString(),
      user: {
        id: userFound.id,
        name: userFound.name,
        email: userFound.email
      }
    };

    // In a real app, save to database
    toast({
      title: "Aluno adicionado",
      description: `${data.name} foi adicionado com sucesso.`
    });
    
    handleCloseDialog();
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
        />
      </DialogContent>
    </Dialog>
  );
};

export default StudentAddDialog;

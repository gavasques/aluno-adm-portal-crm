
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";

interface StudentsHeaderProps {
  onAddStudent: () => void;
}

export const StudentsHeader = ({ onAddStudent }: StudentsHeaderProps) => {
  return (
    <div className="flex justify-between items-center mb-8">
      <h1 className="text-3xl font-bold text-portal-dark">Gestão de Alunos</h1>
      <Button onClick={onAddStudent}>
        <UserPlus className="mr-2 h-4 w-4" /> Adicionar Aluno
      </Button>
    </div>
  );
};

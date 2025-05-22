
import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, Calendar } from "lucide-react";

interface StudentListProps {
  students: any[];
  onDeleteClick: (e: React.MouseEvent, student: any) => void;
  sortDirection: string;
  toggleSort: () => void;
}

const StudentList: React.FC<StudentListProps> = ({
  students,
  onDeleteClick,
  sortDirection,
  toggleSort,
}) => {
  const navigate = useNavigate();

  const handleStudentClick = (student) => {
    navigate(`/admin/gestao-alunos/${student.id}`);
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="cursor-pointer" onClick={toggleSort}>
              Nome
              {sortDirection === "asc" ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="inline-block ml-1 h-4 w-4">
                  <path d="m5 15 7-7 7 7"/>
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="inline-block ml-1 h-4 w-4">
                  <path d="m19 9-7 7-7-7"/>
                </svg>
              )}
            </TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Último Login</TableHead>
            <TableHead>
              <div className="flex items-center">
                <Calendar className="mr-1 h-4 w-4" />
                Data de Cadastro
              </div>
            </TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {students.map((student) => (
            <TableRow
              key={student.id}
              className="cursor-pointer hover:bg-gray-50"
              onClick={() => handleStudentClick(student)}
            >
              <TableCell className="font-medium">{student.name}</TableCell>
              <TableCell>
                <Badge
                  variant={student.status === "Ativo" ? "default" : student.status === "Pendente" ? "secondary" : "outline"}
                  className={
                    student.status === "Ativo"
                      ? "bg-green-500"
                      : student.status === "Pendente"
                        ? "bg-yellow-500"
                        : "bg-gray-500"
                  }
                >
                  {student.status}
                </Badge>
              </TableCell>
              <TableCell>{student.lastLogin}</TableCell>
              <TableCell>{student.registrationDate}</TableCell>
              <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Ações</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => handleStudentClick(student)}>
                      Ver detalhes
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      className="text-red-600"
                      onClick={(e) => onDeleteClick(e, student)}
                    >
                      Excluir aluno
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}

          {students.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                Nenhum aluno encontrado com os critérios de busca.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default StudentList;

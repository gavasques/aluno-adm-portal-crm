
import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
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
import { 
  MoreHorizontal, 
  Eye, 
  Trash2,
  User,
  ArrowUpDown
} from "lucide-react";

interface StudentListViewProps {
  students: any[];
  onDeleteClick: (e: React.MouseEvent, student: any) => void;
  sortDirection: string;
  toggleSort: () => void;
}

const StudentListView: React.FC<StudentListViewProps> = ({
  students,
  onDeleteClick,
  sortDirection,
  toggleSort,
}) => {
  const navigate = useNavigate();

  const handleStudentClick = (student) => {
    navigate(`/admin/gestao-alunos/${student.id}`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Ativo":
        return "bg-green-100 text-green-700 border-green-200";
      case "Pendente":
        return "bg-amber-100 text-amber-700 border-amber-200";
      case "Inativo":
        return "bg-gray-100 text-gray-700 border-gray-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  if (students.length === 0) {
    return (
      <Card className="border-0 shadow-lg">
        <CardContent className="p-12 text-center">
          <div className="flex flex-col items-center space-y-4">
            <div className="p-4 rounded-full bg-gray-100">
              <User className="h-12 w-12 text-gray-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Nenhum aluno encontrado
              </h3>
              <p className="text-gray-500">
                Não há alunos que correspondam aos critérios de busca.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="border-0 shadow-lg overflow-hidden">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-12"></TableHead>
                <TableHead className="font-semibold">
                  <Button 
                    variant="ghost" 
                    onClick={toggleSort}
                    className="h-auto p-0 font-semibold hover:bg-transparent"
                  >
                    Nome
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead className="font-semibold">Status</TableHead>
                <TableHead className="font-semibold">Email</TableHead>
                <TableHead className="font-semibold">Empresa</TableHead>
                <TableHead className="font-semibold">Cadastro</TableHead>
                <TableHead className="font-semibold">Último Acesso</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {students.map((student, index) => (
                <motion.tr
                  key={student.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="cursor-pointer hover:bg-blue-50/50 transition-colors"
                  onClick={() => handleStudentClick(student)}
                >
                  <TableCell>
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white font-semibold text-sm">
                      {student.name.charAt(0).toUpperCase()}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{student.name}</TableCell>
                  <TableCell>
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${getStatusColor(student.status)}`}
                    >
                      {student.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-gray-600">{student.email}</TableCell>
                  <TableCell className="text-sm text-gray-600">{student.company || "—"}</TableCell>
                  <TableCell className="text-sm text-gray-600">{student.registrationDate}</TableCell>
                  <TableCell className="text-sm text-gray-600">{student.lastLogin}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-white border shadow-lg">
                        <DropdownMenuLabel>Ações</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={(e) => {
                          e.stopPropagation();
                          handleStudentClick(student);
                        }}>
                          <Eye className="h-4 w-4 mr-2" />
                          Ver detalhes
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={(e) => onDeleteClick(e, student)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Excluir aluno
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </motion.tr>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default StudentListView;

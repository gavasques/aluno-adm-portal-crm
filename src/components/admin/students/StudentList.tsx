
import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
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
  Calendar, 
  Mail, 
  Building, 
  Eye, 
  Trash2,
  User,
  Clock,
  ArrowUpDown
} from "lucide-react";

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
    <div className="space-y-4">
      {/* Sort Header */}
      <Card className="border-0 shadow-md">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              Lista de Alunos ({students.length})
            </h3>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={toggleSort}
              className="hover:bg-blue-50"
            >
              <ArrowUpDown className="h-4 w-4 mr-2" />
              Ordenar por Nome
              {sortDirection === "asc" ? " ↑" : " ↓"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Students Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {students.map((student, index) => (
          <motion.div
            key={student.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            whileHover={{ y: -2 }}
            className="cursor-pointer"
            onClick={() => handleStudentClick(student)}
          >
            <Card className="border-0 shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden group h-full">
              <div className={`h-1 ${student.status === "Ativo" ? "bg-green-500" : student.status === "Pendente" ? "bg-amber-500" : "bg-gray-400"}`} />
              
              <CardContent className="p-4 space-y-3">
                {/* Header with Avatar and Status */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white font-semibold text-sm">
                      {student.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 text-sm leading-tight">
                        {student.name}
                      </h4>
                      <Badge 
                        variant="outline" 
                        className={`text-xs mt-1 ${getStatusColor(student.status)}`}
                      >
                        {student.status}
                      </Badge>
                    </div>
                  </div>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity">
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
                </div>

                {/* Contact Info */}
                <div className="space-y-2">
                  <div className="flex items-center text-xs text-gray-600">
                    <Mail className="h-3 w-3 mr-2 text-gray-400" />
                    <span className="truncate">{student.email}</span>
                  </div>
                  
                  {student.company && (
                    <div className="flex items-center text-xs text-gray-600">
                      <Building className="h-3 w-3 mr-2 text-gray-400" />
                      <span className="truncate">{student.company}</span>
                    </div>
                  )}
                </div>

                {/* Dates */}
                <div className="pt-2 border-t border-gray-100 space-y-1">
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      Cadastro
                    </div>
                    <span>{student.registrationDate}</span>
                  </div>
                  
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      Último acesso
                    </div>
                    <span>{student.lastLogin}</span>
                  </div>
                </div>

                {/* Action Button */}
                <div className="pt-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-blue-50 border-blue-200 text-blue-600"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleStudentClick(student);
                    }}
                  >
                    <Eye className="h-3 w-3 mr-2" />
                    Ver Detalhes
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default StudentList;

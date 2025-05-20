
import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { 
  Search, 
  MoreHorizontal, 
  Download, 
  Filter, 
  ArrowUp, 
  ArrowDown,
  Calendar,
  Trash2 
} from "lucide-react";

// Sample students data
const STUDENTS = [
  {
    id: 1,
    name: "João Silva",
    email: "joao.silva@exemplo.com",
    phone: "(11) 98765-4321",
    registrationDate: "15/03/2023",
    status: "Ativo",
    lastLogin: "Hoje, 10:45",
    courses: ["Curso Básico de E-commerce", "Mentoria Individual"],
    mentorships: ["Mentoria Individual", "Mentoria em Grupo"],
    bonuses: ["E-book de E-commerce", "Planilha de Controle"],
    observations: "Cliente interessado em expandir para marketplace."
  },
  {
    id: 2,
    name: "Maria Oliveira",
    email: "maria.oliveira@exemplo.com",
    phone: "(21) 97654-3210",
    registrationDate: "22/05/2023",
    status: "Ativo",
    lastLogin: "Ontem, 15:30",
    courses: ["Curso Avançado de E-commerce"],
    mentorships: [],
    bonuses: ["Planilha de Controle"],
    observations: ""
  },
  {
    id: 3,
    name: "Carlos Santos",
    email: "carlos.santos@exemplo.com",
    phone: "(31) 98877-6655",
    registrationDate: "10/01/2023",
    status: "Ativo",
    lastLogin: "Hoje, 09:15",
    courses: ["Curso Básico de E-commerce", "Curso Avançado de E-commerce", "Mentoria Individual"],
    mentorships: ["Mentoria Individual", "Mentoria Avançada"],
    bonuses: ["E-book de E-commerce", "Planilha de Controle", "Templates de E-commerce"],
    observations: "Aluno destaque na turma."
  },
  {
    id: 4,
    name: "Ana Pereira",
    email: "ana.pereira@exemplo.com",
    phone: "(41) 99988-7766",
    registrationDate: "05/02/2023",
    status: "Inativo",
    lastLogin: "15/05/2023, 14:20",
    courses: ["Curso Básico de E-commerce"],
    mentorships: [],
    bonuses: [],
    observations: "Cliente em processo de renovação."
  },
  {
    id: 5,
    name: "Roberto Costa",
    email: "roberto.costa@exemplo.com",
    phone: "(51) 98765-4321",
    registrationDate: "18/04/2023",
    status: "Pendente",
    lastLogin: "Hoje, 11:05",
    courses: ["Mentoria em Grupo"],
    mentorships: ["Mentoria em Grupo"],
    bonuses: ["E-book de E-commerce"],
    observations: "Aguardando confirmação de dados bancários."
  },
  {
    id: 6,
    name: "Fernanda Lima",
    email: "fernanda.lima@exemplo.com",
    phone: "(61) 97654-3210",
    registrationDate: "03/06/2023",
    status: "Ativo",
    lastLogin: "Hoje, 08:30",
    courses: ["Curso Básico de E-commerce", "Mentoria em Grupo"],
    mentorships: ["Mentoria em Grupo"],
    bonuses: ["Planilha de Controle"],
    observations: "Interessada em expandir negócio."
  },
  {
    id: 7,
    name: "Pedro Alves",
    email: "pedro.alves@exemplo.com",
    phone: "(71) 98877-6655",
    registrationDate: "12/07/2023",
    status: "Ativo",
    lastLogin: "Ontem, 16:45",
    courses: ["Curso Avançado de E-commerce"],
    mentorships: ["Mentoria Individual"],
    bonuses: ["Templates de E-commerce"],
    observations: ""
  },
  {
    id: 8,
    name: "Juliana Martins",
    email: "juliana.martins@exemplo.com",
    phone: "(81) 99988-7766",
    registrationDate: "25/08/2023",
    status: "Inativo",
    lastLogin: "20/04/2023, 09:10",
    courses: ["Mentoria Individual"],
    mentorships: ["Mentoria Individual"],
    bonuses: [],
    observations: "Cliente aguardando renovação."
  },
  {
    id: 9,
    name: "Ricardo Souza",
    email: "ricardo.souza@exemplo.com",
    phone: "(91) 98765-4321",
    registrationDate: "14/09/2023",
    status: "Pendente",
    lastLogin: "Hoje, 14:20",
    courses: ["Curso Básico de E-commerce"],
    mentorships: [],
    bonuses: ["E-book de E-commerce"],
    observations: "Aguardando confirmação de pagamento."
  },
  {
    id: 10,
    name: "Amanda Gomes",
    email: "amanda.gomes@exemplo.com",
    phone: "(11) 97654-3210",
    registrationDate: "30/10/2023",
    status: "Ativo",
    lastLogin: "Ontem, 11:30",
    courses: ["Curso Avançado de E-commerce", "Mentoria em Grupo"],
    mentorships: ["Mentoria em Grupo"],
    bonuses: ["Planilha de Controle", "Templates de E-commerce"],
    observations: "Aluna com potencial para mentorias avançadas."
  }
];

const Students = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(25);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortDirection, setSortDirection] = useState("asc");
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");

  // Filter students based on search query and status filter
  const filteredStudents = useMemo(() => {
    return STUDENTS.filter(student => {
      const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === "all" || student.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [searchQuery, statusFilter]);

  // Sort students by name
  const sortedStudents = useMemo(() => {
    return [...filteredStudents].sort((a, b) => {
      if (sortDirection === "asc") {
        return a.name.localeCompare(b.name);
      } else {
        return b.name.localeCompare(a.name);
      }
    });
  }, [filteredStudents, sortDirection]);

  // Calculate pagination
  const totalPages = Math.ceil(sortedStudents.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedStudents.slice(indexOfFirstItem, indexOfLastItem);

  // Handle sort toggle
  const toggleSort = () => {
    setSortDirection(sortDirection === "asc" ? "desc" : "asc");
  };

  // Handle pagination change
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Navigate to student details
  const handleStudentClick = (student) => {
    navigate(`/admin/student/${student.id}`);
  };

  // Handle delete student
  const handleDeleteClick = (e, student) => {
    e.stopPropagation();
    setStudentToDelete(student);
    setShowDeleteConfirmation(true);
  };

  const confirmDeleteStudent = () => {
    toast({
      title: "Aluno excluído",
      description: `O aluno ${studentToDelete.name} foi excluído com sucesso.`
    });
    setShowDeleteConfirmation(false);
    setStudentToDelete(null);
    // In a real app, delete the student from the database
  };

  // Export students to CSV
  const exportToCSV = () => {
    // Create CSV header
    let csvContent = "ID,Nome,Status,Último Login,Data de Cadastro\n";

    // Add data rows
    sortedStudents.forEach(student => {
      csvContent += `${student.id},"${student.name}","${student.status}","${student.lastLogin}","${student.registrationDate}"\n`;
    });

    // Create download link
    const encodedUri = encodeURI("data:text/csv;charset=utf-8," + csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "alunos.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Exportação concluída",
      description: "Os dados dos alunos foram exportados com sucesso."
    });
  };

  // Generate pagination items
  const renderPaginationItems = () => {
    const items = [];
    const maxPagesToShow = 5;

    if (totalPages <= maxPagesToShow) {
      // Show all pages if total pages is less than or equal to max pages to show
      for (let i = 1; i <= totalPages; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink
              isActive={currentPage === i}
              onClick={() => handlePageChange(i)}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }
    } else {
      // Always show first page
      items.push(
        <PaginationItem key={1}>
          <PaginationLink
            isActive={currentPage === 1}
            onClick={() => handlePageChange(1)}
          >
            1
          </PaginationLink>
        </PaginationItem>
      );

      // Calculate start and end pages to show
      let startPage, endPage;
      if (currentPage <= 3) {
        startPage = 2;
        endPage = 4;
        items.push(
          ...[2, 3, 4].map(i => (
            <PaginationItem key={i}>
              <PaginationLink
                isActive={currentPage === i}
                onClick={() => handlePageChange(i)}
              >
                {i}
              </PaginationLink>
            </PaginationItem>
          ))
        );
        items.push(
          <PaginationItem key="ellipsis1">
            <PaginationEllipsis />
          </PaginationItem>
        );
      } else if (currentPage >= totalPages - 2) {
        items.push(
          <PaginationItem key="ellipsis2">
            <PaginationEllipsis />
          </PaginationItem>
        );
        items.push(
          ...[totalPages - 3, totalPages - 2, totalPages - 1].map(i => (
            <PaginationItem key={i}>
              <PaginationLink
                isActive={currentPage === i}
                onClick={() => handlePageChange(i)}
              >
                {i}
              </PaginationLink>
            </PaginationItem>
          ))
        );
      } else {
        items.push(
          <PaginationItem key="ellipsis3">
            <PaginationEllipsis />
          </PaginationItem>
        );
        items.push(
          ...[currentPage - 1, currentPage, currentPage + 1].map(i => (
            <PaginationItem key={i}>
              <PaginationLink
                isActive={currentPage === i}
                onClick={() => handlePageChange(i)}
              >
                {i}
              </PaginationLink>
            </PaginationItem>
          ))
        );
        items.push(
          <PaginationItem key="ellipsis4">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }

      // Always show last page
      items.push(
        <PaginationItem key={totalPages}>
          <PaginationLink
            isActive={currentPage === totalPages}
            onClick={() => handlePageChange(totalPages)}
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }

    return items;
  };

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-8 text-portal-dark">Gestão de Alunos</h1>

      <Card className="mb-6">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Lista de Alunos</CardTitle>
          <Button onClick={exportToCSV}>
            <Download className="mr-2 h-4 w-4" /> Exportar CSV
          </Button>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
            <div className="relative w-full sm:w-96">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input
                placeholder="Buscar alunos..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filtrar por status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os Status</SelectItem>
                  <SelectItem value="Ativo">Ativo</SelectItem>
                  <SelectItem value="Inativo">Inativo</SelectItem>
                  <SelectItem value="Pendente">Pendente</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="cursor-pointer" onClick={toggleSort}>
                    Nome
                    {sortDirection === "asc" ? (
                      <ArrowUp className="inline-block ml-1 h-4 w-4" />
                    ) : (
                      <ArrowDown className="inline-block ml-1 h-4 w-4" />
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
                {currentItems.map((student) => (
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
                            onClick={(e) => handleDeleteClick(e, student)}
                          >
                            Excluir aluno
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}

                {currentItems.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                      Nenhum aluno encontrado com os critérios de busca.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <p className="text-sm text-muted-foreground">
              Exibindo {currentItems.length} de {filteredStudents.length} alunos
            </p>
            <Select value={String(itemsPerPage)} onValueChange={(value) => {
              setItemsPerPage(Number(value));
              setCurrentPage(1);
            }}>
              <SelectTrigger className="w-[110px]">
                <SelectValue placeholder="25 por página" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="25">25 por página</SelectItem>
                <SelectItem value="50">50 por página</SelectItem>
                <SelectItem value="100">100 por página</SelectItem>
                <SelectItem value="200">200 por página</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
                  className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
              
              {renderPaginationItems()}
              
              <PaginationItem>
                <PaginationNext
                  onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
                  className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </CardFooter>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteConfirmation} onOpenChange={setShowDeleteConfirmation}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center text-red-600">
              <Trash2 className="mr-2 h-5 w-5" /> 
              Excluir Aluno
            </DialogTitle>
            <DialogDescription>
              Esta ação não pode ser desfeita. Tem certeza que deseja excluir este aluno?
            </DialogDescription>
          </DialogHeader>
          
          {studentToDelete && (
            <div className="py-4 border-y">
              <p className="font-medium">{studentToDelete.name}</p>
              <p className="text-sm text-muted-foreground">{studentToDelete.email}</p>
            </div>
          )}
          
          <DialogFooter className="gap-2 sm:gap-0 mt-4">
            <Button variant="outline" onClick={() => setShowDeleteConfirmation(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={confirmDeleteStudent}>
              Sim, excluir aluno
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Students;

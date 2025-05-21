
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
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { 
  Search, 
  MoreHorizontal, 
  Download, 
  Filter, 
  ArrowUp, 
  ArrowDown,
  Calendar,
  Trash2,
  UserPlus,
  AlertCircle
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// Import student data from shared file
import { STUDENTS } from "@/data/students";
import { USERS } from "@/data/users";

// Schema for student form validation
const studentFormSchema = z.object({
  name: z.string().min(3, { message: "Nome deve ter pelo menos 3 caracteres" }),
  email: z.string().email({ message: "Email inválido" }),
  phone: z.string().min(8, { message: "Telefone deve ter pelo menos 8 caracteres" }),
  company: z.string().optional(),
  amazonStoreLink: z.string().optional(),
  studentState: z.string().optional(),
  companyState: z.string().optional(),
  usesFBA: z.string().optional(),
  userEmail: z.string().email({ message: "Email do usuário inválido" }),
});

const Students = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(25);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortDirection, setSortDirection] = useState("asc");
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [showAddStudentDialog, setShowAddStudentDialog] = useState(false);
  const [userSearchError, setUserSearchError] = useState("");
  const [userFound, setUserFound] = useState(null);
  
  // Create form
  const form = useForm({
    resolver: zodResolver(studentFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      company: "",
      amazonStoreLink: "",
      studentState: "",
      companyState: "",
      usesFBA: "",
      userEmail: "",
    },
  });

  // Brazilian states array
  const brazilianStates = [
    "Acre", "Alagoas", "Amapá", "Amazonas", "Bahia", "Ceará", "Distrito Federal",
    "Espírito Santo", "Goiás", "Maranhão", "Mato Grosso", "Mato Grosso do Sul",
    "Minas Gerais", "Pará", "Paraíba", "Paraná", "Pernambuco", "Piauí",
    "Rio de Janeiro", "Rio Grande do Norte", "Rio Grande do Sul", "Rondônia",
    "Roraima", "Santa Catarina", "São Paulo", "Sergipe", "Tocantins",
    "Fora do Brasil"
  ];

  // Handle search for user by email
  const handleUserSearch = (email) => {
    if (!email) {
      setUserSearchError("Por favor, insira um email");
      setUserFound(null);
      return;
    }

    const foundUser = USERS.find(user => user.email.toLowerCase() === email.toLowerCase());
    
    if (foundUser) {
      setUserFound(foundUser);
      setUserSearchError("");
      toast({
        title: "Usuário encontrado",
        description: `${foundUser.name} (${foundUser.email})`
      });
    } else {
      setUserFound(null);
      setUserSearchError("Usuário não encontrado com este email");
    }
  };

  // Watch user email field for changes
  const userEmail = form.watch("userEmail");
  
  // Handle form submission
  const onSubmit = (data) => {
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
    // For now, just show success message
    toast({
      title: "Aluno adicionado",
      description: `${data.name} foi adicionado com sucesso.`
    });
    
    setShowAddStudentDialog(false);
    form.reset();
    setUserFound(null);
  };

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
    navigate(`/admin/gestao-alunos/${student.id}`);
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
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-portal-dark">Gestão de Alunos</h1>
        <Button onClick={() => {
          setShowAddStudentDialog(true);
          setUserFound(null);
          setUserSearchError("");
        }}>
          <UserPlus className="mr-2 h-4 w-4" /> Adicionar Aluno
        </Button>
      </div>

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

      {/* Add Student Dialog */}
      <Dialog open={showAddStudentDialog} onOpenChange={(open) => {
        if(!open) {
          form.reset();
          setUserFound(null);
          setUserSearchError("");
        }
        setShowAddStudentDialog(open);
      }}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Adicionar Novo Aluno</DialogTitle>
            <DialogDescription>
              Preencha os dados do aluno e relacione a um usuário existente.
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome*</FormLabel>
                      <FormControl>
                        <Input placeholder="Nome completo" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email*</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="email@exemplo.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Telefone*</FormLabel>
                      <FormControl>
                        <Input placeholder="(00) 00000-0000" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="company"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Empresa</FormLabel>
                      <FormControl>
                        <Input placeholder="Nome da empresa" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="amazonStoreLink"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Link da Loja na Amazon</FormLabel>
                      <FormControl>
                        <Input placeholder="https://amazon.com/shops/..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="studentState"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Estado do Aluno</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione um estado" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {brazilianStates.map((state, index) => (
                            <SelectItem key={index} value={state}>
                              {state}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="companyState"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Estado da Empresa</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione um estado" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {brazilianStates.map((state, index) => (
                            <SelectItem key={index} value={state}>
                              {state}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="usesFBA"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Trabalha com FBA</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione uma opção" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Sim">Sim</SelectItem>
                          <SelectItem value="Não">Não</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="border-t pt-4">
                <h3 className="font-semibold text-lg mb-2">Relacionar Usuário</h3>
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="userEmail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email do Usuário*</FormLabel>
                        <div className="flex gap-2">
                          <FormControl>
                            <Input 
                              placeholder="email.usuario@exemplo.com" 
                              {...field} 
                            />
                          </FormControl>
                          <Button 
                            type="button" 
                            onClick={() => handleUserSearch(field.value)}
                          >
                            Buscar
                          </Button>
                        </div>
                        <FormMessage />
                        {userSearchError && (
                          <Alert variant="destructive" className="mt-2">
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle>Erro</AlertTitle>
                            <AlertDescription>
                              {userSearchError}
                            </AlertDescription>
                          </Alert>
                        )}
                        {userFound && (
                          <Alert className="mt-2 bg-green-50 text-green-800 border-green-200">
                            <AlertTitle>Usuário encontrado</AlertTitle>
                            <AlertDescription>
                              {userFound.name} - {userFound.email}
                            </AlertDescription>
                          </Alert>
                        )}
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              
              <DialogFooter>
                <Button 
                  variant="outline" 
                  type="button"
                  onClick={() => setShowAddStudentDialog(false)}
                >
                  Cancelar
                </Button>
                <Button type="submit">Adicionar Aluno</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Students;

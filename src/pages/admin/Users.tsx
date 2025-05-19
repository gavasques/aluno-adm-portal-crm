
import React, { useState, useMemo } from "react";
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
  DialogTitle 
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
import { Search, MoreHorizontal, UserPlus, User, Mail, Phone, Calendar, HardDrive, Download, Filter, ArrowUp, ArrowDown, Save, Pencil } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// Sample user data
const USERS = [
  {
    id: 1,
    name: "João Silva",
    email: "joao.silva@exemplo.com",
    role: "Aluno",
    status: "Ativo",
    lastLogin: "Hoje, 10:45",
    storage: "45MB / 100MB",
    phone: "(11) 98765-4321",
    registrationDate: "15/03/2023",
    storageValue: 45,
    storageLimit: 100,
    observations: "Cliente interessado em expandir para marketplace."
  },
  {
    id: 2,
    name: "Maria Oliveira",
    email: "maria.oliveira@exemplo.com",
    role: "Aluno",
    status: "Ativo",
    lastLogin: "Ontem, 15:30",
    storage: "78MB / 100MB",
    phone: "(21) 97654-3210",
    registrationDate: "22/05/2023",
    storageValue: 78,
    storageLimit: 100,
    observations: ""
  },
  {
    id: 3,
    name: "Carlos Santos",
    email: "carlos.santos@exemplo.com",
    role: "Administrador",
    status: "Ativo",
    lastLogin: "Hoje, 09:15",
    storage: "23MB / 100MB",
    phone: "(31) 98877-6655",
    registrationDate: "10/01/2023",
    storageValue: 23,
    storageLimit: 100,
    observations: "Administrador principal da plataforma."
  },
  {
    id: 4,
    name: "Ana Pereira",
    email: "ana.pereira@exemplo.com",
    role: "Aluno",
    status: "Inativo",
    lastLogin: "15/05/2023, 14:20",
    storage: "12MB / 100MB",
    phone: "(41) 99988-7766",
    registrationDate: "05/02/2023",
    storageValue: 12,
    storageLimit: 100,
    observations: "Cliente em processo de renovação."
  },
  {
    id: 5,
    name: "Roberto Costa",
    email: "roberto.costa@exemplo.com",
    role: "Aluno",
    status: "Pendente",
    lastLogin: "Hoje, 11:05",
    storage: "89MB / 100MB",
    phone: "(51) 98765-4321",
    registrationDate: "18/04/2023",
    storageValue: 89,
    storageLimit: 100,
    observations: "Aguardando confirmação de dados bancários."
  }
];

// Schema de validação para o formulário de adicionar/editar usuário
const userFormSchema = z.object({
  name: z.string().min(3, { message: "Nome deve ter pelo menos 3 caracteres" }),
  email: z.string().email({ message: "Email inválido" }),
  phone: z.string().min(8, { message: "Telefone inválido" }),
  role: z.string(),
  status: z.string(),
  observations: z.string().optional()
});

type UserFormValues = z.infer<typeof userFormSchema>;

const Users = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [showAddUserDialog, setShowAddUserDialog] = useState(false);
  const [isEditingUserInfo, setIsEditingUserInfo] = useState(false);
  const [itemsPerPage, setItemsPerPage] = useState(25);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortDirection, setSortDirection] = useState("asc");
  const [statusFilter, setStatusFilter] = useState("all");
  
  // Filter users based on search query and status filter
  const filteredUsers = useMemo(() => {
    return USERS.filter(user => {
      const matchesSearch = 
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.role.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === "all" || user.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [searchQuery, statusFilter]);
  
  // Sort users by name
  const sortedUsers = useMemo(() => {
    return [...filteredUsers].sort((a, b) => {
      if (sortDirection === "asc") {
        return a.name.localeCompare(b.name);
      } else {
        return b.name.localeCompare(a.name);
      }
    });
  }, [filteredUsers, sortDirection]);

  // Calculate pagination
  const totalPages = Math.ceil(sortedUsers.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedUsers.slice(indexOfFirstItem, indexOfLastItem);

  // Handle sort toggle
  const toggleSort = () => {
    setSortDirection(sortDirection === "asc" ? "desc" : "asc");
  };

  // Handle pagination change
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  
  const handleResetPassword = (userId, userName) => {
    toast({
      title: "Reset de senha enviado",
      description: `Um e-mail com instruções foi enviado para ${userName}.`
    });
  };
  
  const handleToggleStatus = (userId, currentStatus, userName) => {
    const newStatus = currentStatus === "Ativo" ? "Inativo" : "Ativo";
    toast({
      title: `Status alterado para ${newStatus}`,
      description: `O usuário ${userName} agora está ${newStatus.toLowerCase()}.`
    });
  };
  
  const handleIncreaseStorage = (userId, userName) => {
    toast({
      title: "Armazenamento aumentado",
      description: `O limite de armazenamento de ${userName} foi aumentado em 100MB.`
    });
    // In a real app, update the user's storage limit here
  };

  const handleDecreaseStorage = (userId, userName) => {
    toast({
      title: "Armazenamento reduzido",
      description: `O limite de armazenamento de ${userName} foi reduzido em 100MB.`
    });
    // In a real app, update the user's storage limit here
  };
  
  const handleSendMagicLink = (userId, userName) => {
    toast({
      title: "Link mágico enviado",
      description: `Um link de acesso direto foi enviado para ${userName}.`
    });
  };

  const handleUserClick = (user) => {
    setSelectedUser(user);
    setIsEditingUserInfo(false);
  };

  const handleCloseUserDetails = () => {
    setSelectedUser(null);
    setIsEditingUserInfo(false);
  };

  const handleSaveUserInfo = (data) => {
    toast({
      title: "Informações salvas",
      description: "As informações do usuário foram atualizadas com sucesso."
    });
    setIsEditingUserInfo(false);
    
    // In a real app, update user data in the database
    console.log("Updated user data:", data);
  };
  
  // Formulário para adicionar novo usuário
  const addUserForm = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      role: "Aluno",
      status: "Pendente",
      observations: ""
    }
  });

  // Formulário para editar usuário existente
  const editUserForm = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      name: selectedUser?.name || "",
      email: selectedUser?.email || "",
      phone: selectedUser?.phone || "",
      role: selectedUser?.role || "Aluno",
      status: selectedUser?.status || "Ativo",
      observations: selectedUser?.observations || ""
    }
  });

  // Reset form values when selected user changes
  React.useEffect(() => {
    if (selectedUser) {
      editUserForm.reset({
        name: selectedUser.name,
        email: selectedUser.email,
        phone: selectedUser.phone,
        role: selectedUser.role,
        status: selectedUser.status,
        observations: selectedUser.observations || ""
      });
    }
  }, [selectedUser, editUserForm]);

  const handleAddUser = (data: UserFormValues) => {
    // No mundo real, adicionaríamos o usuário ao banco de dados
    console.log("New user data:", data);
    
    toast({
      title: "Usuário adicionado",
      description: `O usuário ${data.name} foi adicionado com sucesso.`
    });
    
    setShowAddUserDialog(false);
    addUserForm.reset();
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
      if (currentPage <= 3) {
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
        if (totalPages > 4) {
          items.push(
            <PaginationItem key="ellipsis1">
              <PaginationEllipsis />
            </PaginationItem>
          );
        }
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
  
  // Export users to CSV
  const exportToCSV = () => {
    // Create CSV header
    let csvContent = "ID,Nome,Função,Status,Último Login,Data de Cadastro\n";

    // Add data rows
    sortedUsers.forEach(user => {
      csvContent += `${user.id},"${user.name}","${user.role}","${user.status}","${user.lastLogin}","${user.registrationDate}"\n`;
    });

    // Create download link
    const encodedUri = encodeURI("data:text/csv;charset=utf-8," + csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "usuarios.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Exportação concluída",
      description: "Os dados dos usuários foram exportados com sucesso."
    });
  };
  
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-8 text-portal-dark">Gestão de Usuários</h1>
      
      <Card className="mb-6">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Gerenciar Usuários</CardTitle>
          <div className="flex gap-2">
            <Button onClick={exportToCSV}>
              <Download className="mr-2 h-4 w-4" /> Exportar CSV
            </Button>
            <Button onClick={() => setShowAddUserDialog(true)}>
              <UserPlus className="mr-2 h-4 w-4" /> Adicionar Usuário
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
            <div className="relative w-full sm:w-96">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input
                placeholder="Buscar usuários..."
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
                  <TableHead>Função</TableHead>
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
                {currentItems.map((user) => (
                  <TableRow 
                    key={user.id} 
                    className="cursor-pointer hover:bg-gray-50"
                    onClick={() => handleUserClick(user)}
                  >
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>
                      <Badge variant={user.role === "Administrador" ? "default" : "outline"}>
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={user.status === "Ativo" ? "default" : user.status === "Pendente" ? "secondary" : "outline"}
                        className={
                          user.status === "Ativo" 
                            ? "bg-green-500" 
                            : user.status === "Pendente" 
                              ? "bg-yellow-500" 
                              : "bg-gray-500"
                        }
                      >
                        {user.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{user.lastLogin}</TableCell>
                    <TableCell>{user.registrationDate}</TableCell>
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
                          <DropdownMenuItem onClick={() => handleUserClick(user)}>
                            Ver detalhes
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleResetPassword(user.id, user.name)}>
                            Resetar senha
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleToggleStatus(user.id, user.status, user.name)}>
                            {user.status === "Ativo" ? "Desativar usuário" : "Ativar usuário"}
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleSendMagicLink(user.id, user.name)}>
                            Enviar magic link
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
                
                {currentItems.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                      Nenhum usuário encontrado com os critérios de busca.
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
              Exibindo {currentItems.length} de {filteredUsers.length} usuários
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

      {/* Add User Dialog */}
      <Dialog open={showAddUserDialog} onOpenChange={setShowAddUserDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Adicionar Novo Usuário</DialogTitle>
            <DialogDescription>
              Preencha os dados do novo usuário no sistema.
            </DialogDescription>
          </DialogHeader>
          
          <Form {...addUserForm}>
            <form onSubmit={addUserForm.handleSubmit(handleAddUser)} className="space-y-4">
              <FormField
                control={addUserForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome *</FormLabel>
                    <FormControl>
                      <Input placeholder="Nome completo" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={addUserForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email *</FormLabel>
                    <FormControl>
                      <Input placeholder="email@exemplo.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={addUserForm.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Telefone *</FormLabel>
                    <FormControl>
                      <Input placeholder="(00) 00000-0000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={addUserForm.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Função *</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione uma função" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Administrador">Administrador</SelectItem>
                        <SelectItem value="Aluno">Aluno</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={addUserForm.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status *</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Ativo">Ativo</SelectItem>
                        <SelectItem value="Inativo">Inativo</SelectItem>
                        <SelectItem value="Pendente">Pendente</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={addUserForm.control}
                name="observations"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Observações</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Observações sobre o usuário (opcional)"
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setShowAddUserDialog(false)}>
                  Cancelar
                </Button>
                <Button type="submit">
                  Adicionar Usuário
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* User Details Dialog */}
      {selectedUser && (
        <Dialog open={!!selectedUser} onOpenChange={handleCloseUserDetails}>
          <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl flex items-center">
                <User className="mr-2 h-5 w-5" /> 
                {selectedUser.name}
                <Badge variant={selectedUser.role === "Administrador" ? "default" : "outline"} className="ml-3">
                  {selectedUser.role}
                </Badge>
              </DialogTitle>
              <DialogDescription>
                Informações e gerenciamento do usuário
              </DialogDescription>
            </DialogHeader>

            <Tabs defaultValue="info" className="w-full">
              <TabsList className="w-full grid grid-cols-2">
                <TabsTrigger value="info">Informações</TabsTrigger>
                <TabsTrigger value="storage">Armazenamento</TabsTrigger>
              </TabsList>
              
              {/* User Info Tab */}
              <TabsContent value="info" className="pt-4">
                {isEditingUserInfo ? (
                  <Form {...editUserForm}>
                    <form onSubmit={editUserForm.handleSubmit(handleSaveUserInfo)} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <FormField
                            control={editUserForm.control}
                            name="email"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Email *</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={editUserForm.control}
                            name="phone"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Telefone *</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <div className="space-y-4">
                          <FormField
                            control={editUserForm.control}
                            name="role"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Função *</FormLabel>
                                <Select 
                                  onValueChange={field.onChange} 
                                  defaultValue={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="Administrador">Administrador</SelectItem>
                                    <SelectItem value="Aluno">Aluno</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={editUserForm.control}
                            name="status"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Status *</FormLabel>
                                <Select 
                                  onValueChange={field.onChange} 
                                  defaultValue={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="Ativo">Ativo</SelectItem>
                                    <SelectItem value="Inativo">Inativo</SelectItem>
                                    <SelectItem value="Pendente">Pendente</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                      
                      <FormField
                        control={editUserForm.control}
                        name="observations"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Observações</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Observações sobre o usuário (opcional)"
                                className="resize-none h-32"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="flex justify-end gap-2">
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={() => setIsEditingUserInfo(false)}
                        >
                          Cancelar
                        </Button>
                        <Button type="submit">
                          <Save className="h-4 w-4 mr-2" />
                          Salvar
                        </Button>
                      </div>
                    </form>
                  </Form>
                ) : (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="flex items-start space-x-3">
                          <Mail className="h-5 w-5 text-portal-primary mt-1" />
                          <div>
                            <h3 className="text-sm font-semibold text-muted-foreground">Email</h3>
                            <p>{selectedUser.email}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start space-x-3">
                          <Phone className="h-5 w-5 text-portal-primary mt-1" />
                          <div>
                            <h3 className="text-sm font-semibold text-muted-foreground">Telefone</h3>
                            <p>{selectedUser.phone}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start space-x-3">
                          <Calendar className="h-5 w-5 text-portal-primary mt-1" />
                          <div>
                            <h3 className="text-sm font-semibold text-muted-foreground">Data de Registro</h3>
                            <p>{selectedUser.registrationDate}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div>
                          <h3 className="text-sm font-semibold text-muted-foreground mb-1">Status</h3>
                          <div className="flex items-center">
                            <Badge 
                              variant={selectedUser.status === "Ativo" ? "default" : selectedUser.status === "Pendente" ? "secondary" : "outline"}
                              className={
                                selectedUser.status === "Ativo" 
                                  ? "bg-green-500" 
                                  : selectedUser.status === "Pendente" 
                                    ? "bg-yellow-500" 
                                    : "bg-gray-500"
                              }
                            >
                              {selectedUser.status}
                            </Badge>
                          </div>
                        </div>
                        
                        <div>
                          <h3 className="text-sm font-semibold text-muted-foreground mb-1">Função</h3>
                          <Badge variant={selectedUser.role === "Administrador" ? "default" : "outline"}>
                            {selectedUser.role}
                          </Badge>
                        </div>
                        
                        <div>
                          <h3 className="text-sm font-semibold text-muted-foreground mb-1">Último Acesso</h3>
                          <p>{selectedUser.lastLogin}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-6 border-t pt-4">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="text-sm font-semibold text-muted-foreground">Observações</h3>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => setIsEditingUserInfo(true)}
                        >
                          <Pencil className="h-4 w-4 mr-1" />
                          Editar
                        </Button>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-md min-h-[100px]">
                        {selectedUser.observations ? (
                          <p>{selectedUser.observations}</p>
                        ) : (
                          <p className="text-muted-foreground italic">Sem observações.</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="mt-6 space-y-2">
                      <h3 className="text-lg font-semibold border-b pb-2">Ações</h3>
                      <div className="flex flex-wrap gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleResetPassword(selectedUser.id, selectedUser.name)}>
                          Resetar senha
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleSendMagicLink(selectedUser.id, selectedUser.name)}>
                          Enviar magic link
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleToggleStatus(selectedUser.id, selectedUser.status, selectedUser.name)}
                        >
                          {selectedUser.status === "Ativo" ? "Desativar usuário" : "Ativar usuário"}
                        </Button>
                      </div>
                    </div>
                  </>
                )}
              </TabsContent>
              
              {/* Storage Tab */}
              <TabsContent value="storage" className="pt-4">
                <div className="space-y-6">
                  <div className="flex items-start space-x-3">
                    <HardDrive className="h-5 w-5 text-portal-primary mt-1" />
                    <div className="flex-1">
                      <h3 className="text-sm font-semibold text-muted-foreground">Armazenamento Utilizado</h3>
                      <div className="flex items-center mt-2">
                        <div className="w-full h-3 bg-gray-200 rounded-full mr-2">
                          <div 
                            className="h-3 bg-portal-primary rounded-full"
                            style={{ 
                              width: `${(selectedUser.storageValue / selectedUser.storageLimit) * 100}%` 
                            }}
                          ></div>
                        </div>
                        <span className="text-sm whitespace-nowrap">{selectedUser.storage}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border-t pt-4">
                    <h3 className="text-sm font-semibold mb-3">Gerenciar Limite de Armazenamento</h3>
                    <div className="flex items-center gap-3">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleDecreaseStorage(selectedUser.id, selectedUser.name)}
                        disabled={selectedUser.storageLimit <= 100}
                      >
                        <ArrowDown className="h-4 w-4 mr-1" /> Reduzir 100MB
                      </Button>
                      <div className="text-sm font-medium">
                        Limite atual: {selectedUser.storageLimit}MB
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleIncreaseStorage(selectedUser.id, selectedUser.name)}
                      >
                        <ArrowUp className="h-4 w-4 mr-1" /> Aumentar 100MB
                      </Button>
                    </div>
                  </div>
                  
                  <div className="border-t pt-4">
                    <h3 className="text-sm font-semibold mb-2">Detalhes de Uso</h3>
                    <ul className="space-y-2 text-sm">
                      <li className="flex justify-between">
                        <span>Documentos</span>
                        <span className="font-medium">12MB</span>
                      </li>
                      <li className="flex justify-between">
                        <span>Imagens</span>
                        <span className="font-medium">28MB</span>
                      </li>
                      <li className="flex justify-between">
                        <span>Outros arquivos</span>
                        <span className="font-medium">5MB</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
            
            <DialogFooter>
              <Button variant="outline" onClick={handleCloseUserDetails}>Fechar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default Users;

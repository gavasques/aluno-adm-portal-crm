
import React, { useState } from "react";
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
import { toast } from "@/hooks/use-toast";
import { 
  Search, 
  MoreHorizontal, 
  Download, 
  Filter, 
  ArrowUp, 
  ArrowDown,
  Calendar,
  Mail,
  User,
  Shield,
  LogOut,
  Star,
  Settings
} from "lucide-react";
import { motion } from "framer-motion";
import { StarBorder } from "@/components/ui/star-border";

// Mock user data (You would fetch this from your API)
const USERS = [
  { 
    id: 1, 
    name: "João Silva", 
    email: "joao.silva@example.com", 
    status: "Ativo",
    role: "Admin",
    lastLogin: "Hoje, 10:45",
    registrationDate: "15/05/2023",
    storage: "45MB / 100MB",
    avatar: "https://i.pravatar.cc/150?img=1"
  },
  { 
    id: 2, 
    name: "Maria Oliveira", 
    email: "maria.oliveira@example.com", 
    status: "Ativo",
    role: "Usuário",
    lastLogin: "Ontem, 15:30",
    registrationDate: "10/04/2023",
    storage: "78MB / 100MB",
    avatar: "https://i.pravatar.cc/150?img=2"
  },
  { 
    id: 3, 
    name: "Carlos Santos", 
    email: "carlos.santos@example.com", 
    status: "Inativo",
    role: "Usuário",
    lastLogin: "12/05/2023",
    registrationDate: "02/03/2023",
    storage: "22MB / 100MB",
    avatar: "https://i.pravatar.cc/150?img=3"
  },
  { 
    id: 4, 
    name: "Ana Pereira", 
    email: "ana.pereira@example.com", 
    status: "Ativo",
    role: "Editor",
    lastLogin: "Hoje, 09:15",
    registrationDate: "25/04/2023",
    storage: "67MB / 100MB",
    avatar: "https://i.pravatar.cc/150?img=4"
  },
  { 
    id: 5, 
    name: "Pedro Costa", 
    email: "pedro.costa@example.com", 
    status: "Pendente",
    role: "Usuário",
    lastLogin: "Nunca",
    registrationDate: "18/05/2023",
    storage: "0MB / 100MB",
    avatar: "https://i.pravatar.cc/150?img=5"
  }
];

const Users = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortDirection, setSortDirection] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [showUserDetailDialog, setShowUserDetailDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");

  // Filter users based on search query and status filter
  const filteredUsers = USERS.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || user.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Sort users by name
  const sortedUsers = [...filteredUsers].sort((a, b) => {
    return sortDirection === "asc" 
      ? a.name.localeCompare(b.name) 
      : b.name.localeCompare(a.name);
  });

  // Calculate pagination
  const totalPages = Math.ceil(sortedUsers.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedUsers.slice(indexOfFirstItem, indexOfLastItem);

  // Toggle sort direction
  const toggleSort = () => {
    setSortDirection(sortDirection === "asc" ? "desc" : "asc");
  };

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Handle user click to view details
  const handleUserClick = (user) => {
    setSelectedUser(user);
    setShowUserDetailDialog(true);
  };

  // Handle sending password reset
  const handleSendPasswordReset = (userId) => {
    // In a real application, you would call an API endpoint to send a password reset email
    toast({
      title: "Link de redefinição enviado",
      description: "Um link de redefinição de senha foi enviado por e-mail."
    });
  };

  // Handle user deactivation
  const handleToggleUserStatus = (user) => {
    // In a real application, you would call an API endpoint to deactivate/activate the user
    const newStatus = user.status === "Ativo" ? "Inativo" : "Ativo";
    toast({
      title: `Usuário ${newStatus.toLowerCase()}`,
      description: `O status do usuário foi alterado para ${newStatus.toLowerCase()}.`
    });
  };

  // Handle increasing storage quota
  const handleIncreaseStorage = (userId) => {
    // In a real application, you would call an API endpoint to increase user storage
    toast({
      title: "Armazenamento aumentado",
      description: "A cota de armazenamento foi aumentada em 100MB."
    });
  };

  // Handle exporting users to CSV
  const exportToCsv = () => {
    // Create CSV content
    let csvContent = "ID,Nome,Email,Status,Cargo,Último Login,Data de Registro\n";
    
    sortedUsers.forEach(user => {
      csvContent += `${user.id},"${user.name}","${user.email}","${user.status}","${user.role}","${user.lastLogin}","${user.registrationDate}"\n`;
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

  // Animation variants for framer-motion
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="container mx-auto py-6">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex justify-between items-center mb-8"
      >
        <div>
          <h1 className="text-3xl font-bold text-portal-primary">Gestão de Usuários</h1>
          <p className="text-muted-foreground">Gerencie os usuários da plataforma</p>
        </div>
        <StarBorder 
          as="div"
          color="#0C6E9E"
          className="animate-fade-in"
        >
          <Button onClick={() => navigate("/admin/users/new")} className="bg-portal-primary hover:bg-portal-dark">
            <User className="mr-2 h-4 w-4" /> Adicionar Usuário
          </Button>
        </StarBorder>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <Card className="mb-6 border-portal-light shadow-lg overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-portal-primary to-portal-secondary text-white">
            <div className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center">
                <Shield className="mr-2 h-5 w-5" /> 
                Lista de Usuários
              </CardTitle>
              <Button 
                variant="secondary" 
                onClick={exportToCsv}
                className="bg-white text-portal-primary hover:bg-portal-light"
              >
                <Download className="mr-2 h-4 w-4" /> Exportar CSV
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
              <div className="relative w-full sm:w-96">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <Input
                  placeholder="Buscar usuários..."
                  className="pl-10 border-portal-light"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-portal-primary" />
                <select 
                  className="p-2 rounded-md border border-portal-light text-sm"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">Todos os Status</option>
                  <option value="Ativo">Ativo</option>
                  <option value="Inativo">Inativo</option>
                  <option value="Pendente">Pendente</option>
                </select>
              </div>
            </div>

            <div className="rounded-md border border-portal-light overflow-hidden">
              <Table>
                <TableHeader className="bg-portal-light/30">
                  <TableRow>
                    <TableHead className="w-[250px]">
                      <div 
                        className="flex items-center cursor-pointer"
                        onClick={toggleSort}
                      >
                        Usuário
                        {sortDirection === "asc" ? (
                          <ArrowUp className="inline-block ml-1 h-4 w-4" />
                        ) : (
                          <ArrowDown className="inline-block ml-1 h-4 w-4" />
                        )}
                      </div>
                    </TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Cargo</TableHead>
                    <TableHead>Último Login</TableHead>
                    <TableHead>
                      <div className="flex items-center">
                        <Calendar className="mr-1 h-4 w-4" />
                        Cadastro
                      </div>
                    </TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentItems.map((user) => (
                    <motion.tr
                      key={user.id}
                      variants={itemVariants}
                      className="cursor-pointer hover:bg-portal-light/10"
                      onClick={() => handleUserClick(user)}
                    >
                      <TableCell className="py-3">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full overflow-hidden border-2 border-portal-light">
                            <img 
                              src={user.avatar} 
                              alt={user.name} 
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div>
                            <div className="font-medium">{user.name}</div>
                            <div className="text-xs text-muted-foreground">{user.email}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={`
                            ${user.status === "Ativo" ? "bg-portal-success text-white" : ""} 
                            ${user.status === "Inativo" ? "bg-portal-danger text-white" : ""}
                            ${user.status === "Pendente" ? "bg-portal-warning text-portal-dark" : ""}
                          `}
                        >
                          {user.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={`
                            ${user.role === "Admin" ? "border-portal-primary text-portal-primary" : ""} 
                            ${user.role === "Editor" ? "border-portal-secondary text-portal-secondary" : ""}
                            ${user.role === "Usuário" ? "border-portal-accent text-portal-accent" : ""}
                          `}
                        >
                          {user.role}
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
                          <DropdownMenuContent align="end" className="w-56">
                            <DropdownMenuLabel>Ações</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleUserClick(user)}>
                              <User className="mr-2 h-4 w-4" />
                              Ver detalhes
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleSendPasswordReset(user.id)}>
                              <Mail className="mr-2 h-4 w-4" />
                              Enviar link de redefinição
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleToggleUserStatus(user)}>
                              <Shield className="mr-2 h-4 w-4" />
                              {user.status === "Ativo" ? "Desativar usuário" : "Ativar usuário"}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleIncreaseStorage(user.id)}>
                              <Star className="mr-2 h-4 w-4" />
                              Aumentar armazenamento
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </motion.tr>
                  ))}

                  {currentItems.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                        <div className="flex flex-col items-center">
                          <Search className="h-10 w-10 text-portal-light mb-2" />
                          <p>Nenhum usuário encontrado com os critérios de busca.</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-portal-light/10 border-t border-portal-light">
            <div className="text-sm text-muted-foreground">
              Exibindo {currentItems.length} de {filteredUsers.length} usuários
            </div>

            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
                    className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <PaginationItem key={page}>
                    <PaginationLink
                      isActive={currentPage === page}
                      onClick={() => handlePageChange(page)}
                      className={currentPage === page ? "bg-portal-primary text-white" : ""}
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                
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
      </motion.div>

      {/* User Detail Dialog */}
      <Dialog open={showUserDetailDialog} onOpenChange={setShowUserDetailDialog}>
        <DialogContent className="max-w-3xl">
          {selectedUser && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl text-portal-primary flex items-center gap-2">
                  <User className="h-6 w-6" /> 
                  Detalhes do Usuário
                </DialogTitle>
                <DialogDescription>
                  Informações completas sobre o usuário e opções de gerenciamento.
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="col-span-1">
                  <Card className="border-portal-light overflow-hidden h-full">
                    <div className="bg-gradient-to-r from-portal-primary to-portal-secondary h-24"></div>
                    <div className="px-4 pb-6 flex flex-col items-center">
                      <div className="h-24 w-24 rounded-full border-4 border-white overflow-hidden -mt-12 bg-white">
                        <img 
                          src={selectedUser.avatar} 
                          alt={selectedUser.name} 
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <h3 className="text-xl font-semibold mt-2">{selectedUser.name}</h3>
                      <p className="text-sm text-muted-foreground">{selectedUser.email}</p>
                      <Badge
                        className={`mt-2 
                          ${selectedUser.status === "Ativo" ? "bg-portal-success text-white" : ""} 
                          ${selectedUser.status === "Inativo" ? "bg-portal-danger text-white" : ""}
                          ${selectedUser.status === "Pendente" ? "bg-portal-warning text-portal-dark" : ""}
                        `}
                      >
                        {selectedUser.status}
                      </Badge>
                      <p className="text-sm mt-4">Cargo: <span className="font-medium">{selectedUser.role}</span></p>
                      <p className="text-sm">Membro desde: <span className="font-medium">{selectedUser.registrationDate}</span></p>
                      <p className="text-sm">Último acesso: <span className="font-medium">{selectedUser.lastLogin}</span></p>
                      
                      <div className="w-full mt-6">
                        <div className="flex justify-between text-sm mb-1">
                          <span>Armazenamento</span>
                          <span>{selectedUser.storage}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div 
                            className="bg-portal-primary h-2.5 rounded-full" 
                            style={{ width: `${parseInt(selectedUser.storage)/100*45}%` }}
                          ></div>
                        </div>
                        <Button 
                          variant="outline"
                          className="w-full mt-4 border-portal-primary text-portal-primary hover:bg-portal-light"
                          onClick={() => handleIncreaseStorage(selectedUser.id)}
                        >
                          <Star className="mr-2 h-4 w-4" /> Aumentar Armazenamento
                        </Button>
                      </div>
                    </div>
                  </Card>
                </div>
                
                <div className="col-span-1 md:col-span-2">
                  <Card className="border-portal-light h-full">
                    <CardHeader className="bg-portal-light/10 border-b border-portal-light/20">
                      <CardTitle>Gerenciamento de Conta</CardTitle>
                    </CardHeader>
                    <CardContent className="divide-y">
                      <div className="py-4">
                        <h4 className="text-sm font-medium mb-2 flex items-center">
                          <Settings className="h-4 w-4 mr-1 text-portal-primary" /> Configurações de Conta
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <Button 
                            variant="outline"
                            className="border-portal-secondary text-portal-secondary hover:bg-portal-light justify-start"
                            onClick={() => handleSendPasswordReset(selectedUser.id)}
                          >
                            <Mail className="mr-2 h-4 w-4" /> Enviar Magic Link
                          </Button>
                          <Button 
                            variant="outline"
                            className="border-portal-secondary text-portal-secondary hover:bg-portal-light justify-start"
                          >
                            <Settings className="mr-2 h-4 w-4" /> Alterar Senha
                          </Button>
                        </div>
                      </div>
                      
                      <div className="py-4">
                        <h4 className="text-sm font-medium mb-2 flex items-center">
                          <Shield className="h-4 w-4 mr-1 text-portal-primary" /> Status e Permissões
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <Button 
                            variant="outline"
                            className={`${selectedUser.status === "Ativo" ? "border-portal-danger text-portal-danger" : "border-portal-success text-portal-success"} hover:bg-portal-light justify-start`}
                            onClick={() => handleToggleUserStatus(selectedUser)}
                          >
                            {selectedUser.status === "Ativo" ? (
                              <>
                                <LogOut className="mr-2 h-4 w-4" /> Desativar Usuário
                              </>
                            ) : (
                              <>
                                <User className="mr-2 h-4 w-4" /> Ativar Usuário
                              </>
                            )}
                          </Button>
                          <Button 
                            variant="outline"
                            className="border-portal-secondary text-portal-secondary hover:bg-portal-light justify-start"
                          >
                            <Shield className="mr-2 h-4 w-4" /> Editar Permissões
                          </Button>
                        </div>
                      </div>
                      
                      <div className="py-4">
                        <h4 className="text-sm font-medium mb-2 flex items-center">
                          <Star className="h-4 w-4 mr-1 text-portal-primary" /> Produtos e Acessos
                        </h4>
                        <div className="space-y-2">
                          <div className="flex items-center">
                            <input type="checkbox" id="product1" className="mr-2" />
                            <label htmlFor="product1" className="text-sm">Mentoria Individual</label>
                          </div>
                          <div className="flex items-center">
                            <input type="checkbox" id="product2" className="mr-2" />
                            <label htmlFor="product2" className="text-sm">Mentoria em Grupo</label>
                          </div>
                          <div className="flex items-center">
                            <input type="checkbox" id="product3" className="mr-2" />
                            <label htmlFor="product3" className="text-sm">Curso Completo</label>
                          </div>
                          <div className="flex items-center">
                            <input type="checkbox" id="product4" className="mr-2" />
                            <label htmlFor="product4" className="text-sm">Acesso Premium</label>
                          </div>
                        </div>
                      </div>
                      
                      <div className="pt-4">
                        <Button 
                          variant="destructive"
                          className="w-full sm:w-auto"
                        >
                          Remover Usuário
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
              
              <DialogFooter className="gap-2 sm:gap-0">
                <Button variant="outline" onClick={() => setShowUserDetailDialog(false)}>
                  Fechar
                </Button>
                <Button className="bg-portal-primary hover:bg-portal-dark">
                  Salvar Alterações
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Users;

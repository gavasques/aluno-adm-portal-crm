
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
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
import { StarBorder } from "@/components/ui/star-border";
import { toast } from "@/hooks/use-toast";
import { USERS } from "@/data/users";
import { User, UserPlus, Search, MoreHorizontal, Lock, Trash, Eye } from "lucide-react";

// Animation variants
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
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 80 }
  }
};

const Users = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(25);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  // Filter users based on search query
  const filteredUsers = USERS.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleViewUser = (user) => {
    setSelectedUser(user);
    setIsDetailsOpen(true);
  };

  const handleResetPassword = (user) => {
    setSelectedUser(user);
    setIsResetDialogOpen(true);
  };

  const confirmResetPassword = () => {
    toast({
      title: "Senha redefinida",
      description: `Um e-mail com instruções para redefinir a senha foi enviado para ${selectedUser.email}.`
    });
    setIsResetDialogOpen(false);
  };

  const handleDeleteUser = (user) => {
    setUserToDelete(user);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteUser = () => {
    toast({
      title: "Usuário excluído",
      description: `O usuário ${userToDelete.name} foi excluído com sucesso.`
    });
    setIsDeleteDialogOpen(false);
    setUserToDelete(null);
  };

  const sendMagicLink = (user) => {
    toast({
      title: "Magic Link enviado",
      description: `Um Magic Link foi enviado para o e-mail ${user.email}.`
    });
  };

  return (
    <div className="container mx-auto py-6">
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-6"
      >
        {/* Header Section */}
        <motion.div 
          className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
          variants={itemVariants}
        >
          <div>
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-700 to-indigo-600 bg-clip-text text-transparent">
              Gestão de Usuários
            </h1>
            <p className="text-muted-foreground mt-1">
              Gerenciar, monitorar e modificar contas de usuários do sistema
            </p>
          </div>
          <StarBorder 
            as="div" 
            className="w-auto" 
            color="#0C6E9E"
          >
            <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
              <UserPlus className="mr-2 h-4 w-4" /> Adicionar Usuário
            </Button>
          </StarBorder>
        </motion.div>

        {/* Search and Filter Section */}
        <motion.div variants={itemVariants}>
          <Card className="overflow-hidden border-t-4 border-t-blue-600">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 pb-3">
              <CardTitle className="text-blue-800">Lista de Usuários</CardTitle>
              <CardDescription>
                Visualize e gerencie todos os usuários cadastrados no sistema
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
                <div className="relative w-full sm:max-w-sm">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <Input
                    placeholder="Buscar usuários por nome, email ou função..."
                    className="pl-10 border-blue-200 focus:border-blue-400"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    Total: <strong>{filteredUsers.length}</strong> usuários
                  </span>
                </div>
              </div>

              {/* Table Section */}
              <div className="rounded-md border border-blue-100 overflow-hidden shadow-sm">
                <Table>
                  <TableHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
                    <TableRow>
                      <TableHead className="font-medium text-blue-700">Usuário</TableHead>
                      <TableHead className="font-medium text-blue-700">Função</TableHead>
                      <TableHead className="font-medium text-blue-700">Status</TableHead>
                      <TableHead className="font-medium text-blue-700">Último Acesso</TableHead>
                      <TableHead className="text-right font-medium text-blue-700">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentUsers.length > 0 ? currentUsers.map((user, index) => (
                      <TableRow 
                        key={user.id}
                        className="cursor-pointer transition-colors hover:bg-blue-50"
                        onClick={() => handleViewUser(user)}
                      >
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-full p-2">
                              <User className="h-4 w-4" />
                            </div>
                            <div>
                              <p className="font-medium">{user.name}</p>
                              <p className="text-sm text-muted-foreground">{user.email}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{user.role}</TableCell>
                        <TableCell>
                          <Badge 
                            className={
                              user.status === "Ativo" 
                                ? "bg-green-100 text-green-800 hover:bg-green-200" 
                                : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                            }
                          >
                            {user.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{user.lastLogin}</TableCell>
                        <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56">
                              <DropdownMenuLabel>Ações de usuário</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                className="flex items-center cursor-pointer"
                                onClick={() => handleViewUser(user)}
                              >
                                <Eye className="mr-2 h-4 w-4" /> Ver detalhes
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                className="flex items-center cursor-pointer"
                                onClick={() => handleResetPassword(user)}
                              >
                                <Lock className="mr-2 h-4 w-4" /> Resetar senha
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                className="flex items-center cursor-pointer"
                                onClick={() => sendMagicLink(user)}
                              >
                                <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M15 5L9 12L15 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                                Enviar Magic Link
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                className="flex items-center text-red-600 cursor-pointer hover:text-red-700"
                                onClick={() => handleDeleteUser(user)}
                              >
                                <Trash className="mr-2 h-4 w-4" /> Excluir usuário
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    )) : (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                          Nenhum usuário encontrado com esses critérios de busca.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>

            {/* Pagination Section */}
            {filteredUsers.length > 0 && (
              <CardFooter className="bg-gradient-to-r from-blue-50 to-indigo-50 border-t border-blue-100 flex flex-col sm:flex-row items-center justify-between px-6 py-4 gap-4">
                <div className="text-sm text-muted-foreground">
                  Mostrando {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredUsers.length)} de {filteredUsers.length} resultados
                </div>
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        href="#" 
                        onClick={(e) => {
                          e.preventDefault();
                          if (currentPage > 1) handlePageChange(currentPage - 1);
                        }}
                        className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                      />
                    </PaginationItem>
                    
                    {/* First page */}
                    {totalPages > 5 && currentPage > 3 && (
                      <PaginationItem>
                        <PaginationLink 
                          href="#" 
                          onClick={(e) => {
                            e.preventDefault();
                            handlePageChange(1);
                          }}
                          isActive={currentPage === 1}
                        >
                          1
                        </PaginationLink>
                      </PaginationItem>
                    )}
                    
                    {/* Ellipsis */}
                    {totalPages > 5 && currentPage > 3 && (
                      <PaginationItem>
                        <PaginationEllipsis />
                      </PaginationItem>
                    )}

                    {/* Pages */}
                    {Array.from({ length: totalPages }).map((_, index) => {
                      const pageNumber = index + 1;
                      
                      // Show pages around current page
                      if (
                        pageNumber === 1 ||
                        pageNumber === totalPages ||
                        (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                      ) {
                        return (
                          <PaginationItem key={pageNumber}>
                            <PaginationLink 
                              href="#" 
                              onClick={(e) => {
                                e.preventDefault();
                                handlePageChange(pageNumber);
                              }}
                              isActive={currentPage === pageNumber}
                            >
                              {pageNumber}
                            </PaginationLink>
                          </PaginationItem>
                        );
                      }
                      
                      // Add ellipsis after first page and around current page
                      if (
                        (pageNumber === 2 && currentPage > 3) ||
                        (pageNumber === totalPages - 1 && currentPage < totalPages - 2)
                      ) {
                        return (
                          <PaginationItem key={pageNumber}>
                            <PaginationEllipsis />
                          </PaginationItem>
                        );
                      }
                      
                      return null;
                    })}
                    
                    <PaginationItem>
                      <PaginationNext 
                        href="#" 
                        onClick={(e) => {
                          e.preventDefault();
                          if (currentPage < totalPages) handlePageChange(currentPage + 1);
                        }}
                        className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </CardFooter>
            )}
          </Card>
        </motion.div>

        {/* User Details Dialog */}
        {selectedUser && (
          <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-blue-700 to-indigo-600 bg-clip-text text-transparent">
                  Detalhes do Usuário
                </DialogTitle>
                <DialogDescription>
                  Informações completas e opções de gerenciamento
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* User Profile Section */}
                <Card className="lg:col-span-1 border-t-4 border-t-blue-600 overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
                    <div className="flex flex-col items-center text-center">
                      <div className="h-24 w-24 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white mb-3">
                        <User className="h-12 w-12" />
                      </div>
                      <h3 className="text-xl font-bold">{selectedUser.name}</h3>
                      <p className="text-sm text-muted-foreground">{selectedUser.email}</p>
                      <Badge 
                        className="mt-2"
                        variant={selectedUser.status === "Ativo" ? "default" : "outline"}
                      >
                        {selectedUser.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4 p-4">
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground">Função</h4>
                      <p>{selectedUser.role}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground">Último Acesso</h4>
                      <p>{selectedUser.lastLogin}</p>
                    </div>
                  </CardContent>
                </Card>
                
                {/* User Details Section */}
                <Card className="lg:col-span-2 border-t-4 border-t-indigo-600">
                  <CardHeader className="bg-gradient-to-r from-indigo-50 to-blue-50">
                    <CardTitle>Ações e Tarefas</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Tarefas Atribuídas</h3>
                      {selectedUser.tasks && selectedUser.tasks.length > 0 ? (
                        <div className="space-y-2">
                          {selectedUser.tasks.map(task => (
                            <div 
                              key={task.id}
                              className="p-3 rounded-lg border border-blue-100 bg-blue-50"
                            >
                              <div className="flex justify-between items-center">
                                <h4 className="font-medium">{task.title}</h4>
                                <Badge 
                                  variant="outline"
                                  className={
                                    task.priority === "Alta" 
                                      ? "border-red-500 text-red-500" 
                                      : task.priority === "Média"
                                        ? "border-yellow-500 text-yellow-500"
                                        : "border-green-500 text-green-500"
                                  }
                                >
                                  {task.priority}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground mt-1">
                                {task.date} às {task.time}
                              </p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-100">
                          <p className="text-muted-foreground">Nenhuma tarefa atribuída</p>
                        </div>
                      )}
                      
                      <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <Button 
                          variant="outline"
                          className="border-blue-200 text-blue-700 hover:bg-blue-50"
                          onClick={() => handleResetPassword(selectedUser)}
                        >
                          <Lock className="mr-2 h-4 w-4" /> Resetar Senha
                        </Button>
                        <Button 
                          variant="outline"
                          className="border-blue-200 text-blue-700 hover:bg-blue-50"
                          onClick={() => sendMagicLink(selectedUser)}
                        >
                          <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M15 5L9 12L15 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          Magic Link
                        </Button>
                        <Button
                          variant="outline" 
                          className={`border-blue-200 ${selectedUser.status === "Ativo" 
                            ? "text-yellow-600 hover:bg-yellow-50" 
                            : "text-green-600 hover:bg-green-50"}`}
                        >
                          {selectedUser.status === "Ativo" ? "Inativar Usuário" : "Ativar Usuário"}
                        </Button>
                        <Button 
                          variant="outline"
                          className="border-red-200 text-red-600 hover:bg-red-50"
                          onClick={() => handleDeleteUser(selectedUser)}
                        >
                          <Trash className="mr-2 h-4 w-4" /> Excluir Usuário
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <DialogFooter>
                <Button 
                  variant="outline" 
                  onClick={() => setIsDetailsOpen(false)}
                >
                  Fechar
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}

        {/* Reset Password Dialog */}
        <Dialog open={isResetDialogOpen} onOpenChange={setIsResetDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="text-center text-blue-700">
                Redefinir Senha
              </DialogTitle>
              <DialogDescription className="text-center">
                Enviar um link para que o usuário redefina sua senha
              </DialogDescription>
            </DialogHeader>
            {selectedUser && (
              <div className="flex flex-col items-center gap-2 py-4">
                <div className="h-16 w-16 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white">
                  <User className="h-8 w-8" />
                </div>
                <h3 className="text-lg font-semibold">{selectedUser.name}</h3>
                <p className="text-sm text-muted-foreground">{selectedUser.email}</p>
              </div>
            )}
            <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0">
              <Button 
                variant="outline" 
                onClick={() => setIsResetDialogOpen(false)}
                className="w-full sm:w-auto"
              >
                Cancelar
              </Button>
              <Button 
                className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-indigo-600"
                onClick={confirmResetPassword}
              >
                Enviar Link de Redefinição
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete User Dialog */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="text-center text-red-600">
                Confirmar Exclusão
              </DialogTitle>
              <DialogDescription className="text-center">
                Esta ação não pode ser desfeita. O usuário será removido permanentemente.
              </DialogDescription>
            </DialogHeader>
            {userToDelete && (
              <div className="flex flex-col items-center gap-2 py-4 border-y">
                <div className="h-16 w-16 rounded-full bg-red-100 flex items-center justify-center text-red-600">
                  <Trash className="h-8 w-8" />
                </div>
                <h3 className="text-lg font-semibold">{userToDelete.name}</h3>
                <p className="text-sm text-muted-foreground">{userToDelete.email}</p>
              </div>
            )}
            <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0">
              <Button 
                variant="outline" 
                onClick={() => setIsDeleteDialogOpen(false)}
                className="w-full sm:w-auto"
              >
                Cancelar
              </Button>
              <Button 
                variant="destructive"
                className="w-full sm:w-auto"
                onClick={confirmDeleteUser}
              >
                Excluir Permanentemente
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </motion.div>
    </div>
  );
};

export default Users;

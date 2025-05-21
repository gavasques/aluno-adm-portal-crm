
import React, { useState, useEffect } from "react";
import { Search, Trash2, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { USERS } from "@/data/users";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Combobox } from "@/components/ui/combobox";
import { useToast } from "@/components/ui/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface GroupUsersDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  groupId: number;
  groupName: string;
  onAddUserToGroup: (userId: number, groupId: number) => void;
  onRemoveUserFromGroup: (userId: number) => void;
}

const GroupUsersDialog = ({ 
  open, 
  onOpenChange, 
  groupId, 
  groupName,
  onAddUserToGroup,
  onRemoveUserFromGroup
}: GroupUsersDialogProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const { toast } = useToast();
  
  // Estado para controlar os usuários que não estão no grupo
  const [availableUsers, setAvailableUsers] = useState<Array<{ value: number, label: string }>>([]);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  
  // Filtra usuários pelo grupo de permissão e pela busca
  const filteredUsers = USERS.filter(user => 
    user.permissionGroupId === groupId && 
    (
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  // Carrega os usuários disponíveis para adicionar (que não estão neste grupo)
  useEffect(() => {
    if (open) {
      const usersNotInGroup = USERS.filter(user => 
        user.permissionGroupId !== groupId
      ).map(user => ({
        value: user.id,
        label: `${user.name} (${user.email})`
      }));
      
      setAvailableUsers(usersNotInGroup);
      setSelectedUserId(null);
    }
  }, [open, groupId]);

  // Calcula a paginação
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  
  // Adiciona um usuário ao grupo
  const handleAddUser = () => {
    if (selectedUserId) {
      onAddUserToGroup(selectedUserId, groupId);
      
      toast({
        title: "Usuário adicionado",
        description: "Usuário foi adicionado ao grupo com sucesso.",
        variant: "default"
      });
      
      // Atualiza a lista de usuários disponíveis
      setAvailableUsers(prev => prev.filter(user => user.value !== selectedUserId));
      setSelectedUserId(null);
    }
  };
  
  // Remove um usuário do grupo
  const handleRemoveUser = (userId: number) => {
    onRemoveUserFromGroup(userId);
    
    toast({
      title: "Usuário removido",
      description: "Usuário foi removido do grupo com sucesso.",
      variant: "default"
    });
    
    // Adiciona o usuário de volta à lista de disponíveis
    const removedUser = USERS.find(user => user.id === userId);
    if (removedUser) {
      setAvailableUsers(prev => [
        ...prev, 
        { 
          value: removedUser.id, 
          label: `${removedUser.name} (${removedUser.email})` 
        }
      ]);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Usuários do Grupo: {groupName}</DialogTitle>
          <DialogDescription>
            Gerencie os usuários que pertencem a este grupo de permissão. 
            Cada usuário pode pertencer a apenas um grupo por vez.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Adicionar usuário */}
          <div className="flex items-end gap-2">
            <div className="flex-1">
              <label htmlFor="add-user" className="block text-sm font-medium mb-1">
                Adicionar usuário ao grupo
              </label>
              <Combobox
                items={availableUsers}
                value={selectedUserId}
                onChange={setSelectedUserId}
                placeholder="Selecione um usuário..."
              />
            </div>
            <Button 
              onClick={handleAddUser}
              disabled={!selectedUserId}
              className="bg-purple-700 hover:bg-purple-800"
            >
              Adicionar ao Grupo
            </Button>
          </div>
          
          {/* Busca para filtrar usuários já no grupo */}
          <div className="relative flex">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar por nome ou email..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1); // Reset page when searching
              }}
            />
          </div>
          
          {/* Lista de usuários do grupo */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                      Nenhum usuário encontrado neste grupo.
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
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
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveUser(user.id)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Remover usuário</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          
          {totalPages > 1 && (
            <Pagination className="mt-4">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    className={currentPage <= 1 ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <PaginationItem key={page}>
                    <PaginationLink 
                      isActive={page === currentPage}
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                
                <PaginationItem>
                  <PaginationNext 
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    className={currentPage >= totalPages ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GroupUsersDialog;

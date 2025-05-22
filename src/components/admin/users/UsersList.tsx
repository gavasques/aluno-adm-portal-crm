
import React, { useState } from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Loader2, MoreHorizontal, Search, KeyRound, Info, UserPlus, Trash2, UserX, UserCheck, Mail } from "lucide-react";
import UserDetailsDialog from "./UserDetailsDialog";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  lastLogin: string;
  tasks: any[];
}

interface UsersListProps {
  users: User[];
  isLoading: boolean;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onResetPassword: (email: string) => void;
  onAddUser: () => void;
  onInviteUser: () => void;
  onDeleteUser: (userId: string, email: string) => void;
  onToggleUserStatus: (userId: string, email: string, isActive: boolean) => void;
}

const UsersList: React.FC<UsersListProps> = ({
  users,
  isLoading,
  searchQuery,
  onSearchChange,
  onResetPassword,
  onAddUser,
  onInviteUser,
  onDeleteUser,
  onToggleUserStatus,
}) => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);

  // Filtrar usuários de acordo com a pesquisa
  const filteredUsers = users.filter(user => 
    user.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleViewDetails = (user: User) => {
    setSelectedUser(user);
    setShowDetailsDialog(true);
  };

  // Função para determinar a cor da badge de status
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'Ativo':
        return "bg-green-500";
      case 'Convidado':
        return "bg-yellow-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input
            placeholder="Buscar usuários..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Button onClick={onInviteUser} variant="outline" className="gap-2">
            <Mail className="h-4 w-4" /> Convidar Usuário
          </Button>
          <Button onClick={onAddUser} className="gap-2">
            <UserPlus className="h-4 w-4" /> Adicionar Usuário
          </Button>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Papel</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Último Login</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  <div className="flex justify-center items-center">
                    <Loader2 className="h-6 w-6 animate-spin mr-2" />
                    <span>Carregando usuários...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge
                      variant={user.role === "Admin" ? "default" : "outline"}
                      className={
                        user.role === "Admin"
                          ? "bg-blue-500 hover:bg-blue-600"
                          : "bg-gray-100 text-gray-800"
                      }
                    >
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="default"
                      className={getStatusBadgeClass(user.status)}
                    >
                      {user.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{user.lastLogin}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Ações</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => onResetPassword(user.email)}>
                          <KeyRound className="mr-2 h-4 w-4" /> Redefinir senha
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleViewDetails(user)}>
                          <Info className="mr-2 h-4 w-4" /> Ver detalhes
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {user.status === "Ativo" ? (
                          <DropdownMenuItem 
                            onClick={() => onToggleUserStatus(user.id, user.email, true)}
                            className="text-amber-600"
                          >
                            <UserX className="mr-2 h-4 w-4" /> Inativar usuário
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem 
                            onClick={() => onToggleUserStatus(user.id, user.email, false)}
                            className="text-green-600"
                          >
                            <UserCheck className="mr-2 h-4 w-4" /> Ativar usuário
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem 
                          onClick={() => onDeleteUser(user.id, user.email)}
                          className="text-red-600"
                        >
                          <Trash2 className="mr-2 h-4 w-4" /> Excluir usuário
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                  Nenhum usuário encontrado com os critérios de busca.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Dialog de detalhes do usuário */}
      <UserDetailsDialog
        open={showDetailsDialog}
        onOpenChange={setShowDetailsDialog}
        user={selectedUser}
      />
    </div>
  );
};

export default UsersList;


import { useEffect, useState } from "react";
import { useUserManagement } from "@/hooks/admin/useUserManagement";
import { usePermissionGroups } from "@/hooks/admin/usePermissionGroups";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Combobox } from "@/components/ui/combobox";
import StatusBadge from "@/components/ui/status-badge";
import { 
  Search, 
  MoreHorizontal, 
  Mail, 
  KeyRound, 
  AlertTriangle,
  CheckCircle
} from "lucide-react";

const Users = () => {
  const { 
    users, 
    loading, 
    fetchUsers, 
    updateUserPermissionGroup, 
    resetPassword, 
    updateUserStatus,
    sendMagicLink 
  } = useUserManagement();
  
  const { permissionGroups } = usePermissionGroups();
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState(users);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredUsers(users);
    } else {
      const lowercasedSearch = searchTerm.toLowerCase();
      setFilteredUsers(
        users.filter(
          (user) =>
            user.name?.toLowerCase().includes(lowercasedSearch) ||
            user.email?.toLowerCase().includes(lowercasedSearch) ||
            user.role?.toLowerCase().includes(lowercasedSearch)
        )
      );
    }
  }, [searchTerm, users]);

  const handleResetPassword = (email: string | null) => {
    if (email) {
      resetPassword(email);
    }
  };

  const handleSendMagicLink = (email: string | null) => {
    if (email) {
      sendMagicLink(email);
    }
  };

  const handleUpdateStatus = (userId: string, currentStatus: string | null) => {
    const newStatus = currentStatus === "Ativo" ? "Inativo" : "Ativo";
    updateUserStatus(userId, newStatus);
  };

  const handleUpdatePermissionGroup = (userId: string, groupId: number | null) => {
    updateUserPermissionGroup(userId, groupId);
  };

  // Preparar os itens para o Combobox de grupos de permissão
  const permissionGroupItems = permissionGroups.map((group) => ({
    value: group.id,
    label: group.name,
  }));

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Gestão de Usuários</h1>
      </div>

      <Card className="p-4">
        <div className="flex mb-4">
          <div className="relative flex-grow">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Buscar por usuário, email ou papel..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
            <span className="ml-2">Carregando...</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Papel</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Último Login</TableHead>
                  <TableHead>Grupo de Permissão</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      {users.length === 0 
                        ? "Nenhum usuário encontrado." 
                        : "Nenhum usuário corresponde à sua busca."}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>{user.name || "-"}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.role || "Usuário"}</TableCell>
                      <TableCell>
                        <StatusBadge status={user.status || "Inativo"} />
                      </TableCell>
                      <TableCell>
                        {user.last_login 
                          ? new Date(user.last_login).toLocaleString() 
                          : "Nunca"}
                      </TableCell>
                      <TableCell>
                        <Combobox
                          items={permissionGroupItems}
                          value={user.permission_group_id}
                          onChange={(value) => handleUpdatePermissionGroup(user.id, value)}
                          placeholder="Selecionar grupo..."
                        />
                      </TableCell>
                      <TableCell className="text-right">
                        <TooltipProvider>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem 
                                onClick={() => handleSendMagicLink(user.email)}
                                className="flex items-center gap-2 cursor-pointer"
                              >
                                <Mail className="h-4 w-4" />
                                <span>Enviar Magic Link</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleResetPassword(user.email)}
                                className="flex items-center gap-2 cursor-pointer"
                              >
                                <KeyRound className="h-4 w-4" />
                                <span>Redefinir Senha</span>
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => handleUpdateStatus(user.id, user.status)}
                                className={`flex items-center gap-2 cursor-pointer ${
                                  user.status === "Ativo" ? "text-red-600" : "text-green-600"
                                }`}
                              >
                                {user.status === "Ativo" ? (
                                  <>
                                    <AlertTriangle className="h-4 w-4" />
                                    <span>Inativar Usuário</span>
                                  </>
                                ) : (
                                  <>
                                    <CheckCircle className="h-4 w-4" />
                                    <span>Ativar Usuário</span>
                                  </>
                                )}
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TooltipProvider>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </Card>
    </div>
  );
};

export default Users;

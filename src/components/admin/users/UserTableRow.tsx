
import React from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, KeyRound, Info, UserX, UserCheck, Trash2 } from "lucide-react";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  lastLogin: string;
  tasks: any[];
}

interface UserTableRowProps {
  user: User;
  onViewDetails: (user: User) => void;
  onResetPassword: (email: string) => void;
  onDeleteUser: (userId: string, email: string) => void;
  onToggleUserStatus: (userId: string, email: string, isActive: boolean) => void;
}

const UserTableRow: React.FC<UserTableRowProps> = ({
  user,
  onViewDetails,
  onResetPassword,
  onDeleteUser,
  onToggleUserStatus,
}) => {
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
    <TableRow>
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
            <DropdownMenuItem onClick={() => onViewDetails(user)}>
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
  );
};

export default UserTableRow;

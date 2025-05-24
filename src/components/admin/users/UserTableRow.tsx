
import React, { useState } from "react";
import { 
  TableRow, 
  TableCell 
} from "@/components/ui/table";
import UserStatusBadge from "./UserStatusBadge";
import StorageColumn from "./StorageColumn";
import StorageUpgradeDialog from "./StorageUpgradeDialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  User, 
  MoreVertical, 
  Eye, 
  KeyRound,
  UserX,
  UserCheck,
  UserMinus,
  Lock,
  Clock
} from "lucide-react";

interface UserTableRowProps {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    status: string;
    lastLogin: string;
    permission_group_id?: string | null;
    storage_used_mb?: number;
    storage_limit_mb?: number;
  };
  onViewDetails: (user: any) => void;
  onResetPassword: (email: string) => void;
  onDeleteUser: (userId: string, email: string) => void;
  onToggleUserStatus: (userId: string, email: string, isActive: boolean) => void;
  onSetPermissionGroup?: (userId: string, email: string, permissionGroupId: string | null) => void;
}

// ID do grupo "Geral" (temporário) baseado nos logs
const GERAL_GROUP_ID = "564c55dc-0ab8-481e-a0bc-97ea7e484b88";

const UserTableRow: React.FC<UserTableRowProps> = ({ 
  user,
  onViewDetails,
  onResetPassword,
  onDeleteUser,
  onToggleUserStatus,
  onSetPermissionGroup
}) => {
  const [showStorageUpgrade, setShowStorageUpgrade] = useState(false);
  
  // Determinar se o usuário está ativo com base no status
  const normalizedStatus = typeof user.status === 'string' ? user.status.toLowerCase() : '';
  const isActive = normalizedStatus === "ativo" || normalizedStatus === "active";
  
  // Determinar se o usuário está no grupo temporário "Geral"
  const isTemporaryGroup = user.permission_group_id === GERAL_GROUP_ID && user.role !== "Admin";

  const handleAddStorage = () => {
    setShowStorageUpgrade(true);
  };

  return (
    <>
      <TableRow className={isTemporaryGroup ? "bg-orange-50/30 border-l-4 border-l-orange-300" : ""}>
        <TableCell>
          <div className="flex items-center">
            <div className={`h-8 w-8 rounded-full flex items-center justify-center mr-2 ${
              isTemporaryGroup ? "bg-orange-100" : "bg-gray-100"
            }`}>
              {isTemporaryGroup ? (
                <Clock className="h-4 w-4 text-orange-600" />
              ) : (
                <User className="h-4 w-4 text-gray-600" />
              )}
            </div>
            <div>
              <div className="font-medium">{user.name || "Sem nome"}</div>
              <div className="text-sm text-gray-500">{user.email}</div>
            </div>
          </div>
        </TableCell>
        <TableCell>
          <UserStatusBadge 
            status={user.status} 
            permissionGroupId={user.permission_group_id}
            isTemporaryGroup={isTemporaryGroup}
          />
        </TableCell>
        <TableCell>{user.role || "Não definido"}</TableCell>
        <TableCell>{user.lastLogin || "Nunca"}</TableCell>
        <TableCell>
          <StorageColumn
            userId={user.id}
            userName={user.name || user.email}
            storageUsedMb={user.storage_used_mb || 0}
            storageLimitMb={user.storage_limit_mb || 100}
            onAddStorage={handleAddStorage}
          />
        </TableCell>
        <TableCell className="text-right">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Abrir menu</span>
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onViewDetails(user)}>
                <Eye className="mr-2 h-4 w-4" />
                <span>Ver detalhes</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onResetPassword(user.email)}>
                <KeyRound className="mr-2 h-4 w-4" />
                <span>Redefinir senha</span>
              </DropdownMenuItem>

              {onSetPermissionGroup && (
                <DropdownMenuItem onClick={() => onSetPermissionGroup(user.id, user.email, user.permission_group_id)}>
                  <Lock className="mr-2 h-4 w-4" />
                  <span>
                    {isTemporaryGroup ? "Atribuir grupo definitivo" : "Definir permissões"}
                  </span>
                </DropdownMenuItem>
              )}
              
              <DropdownMenuSeparator />
              
              <DropdownMenuItem
                onClick={() => onToggleUserStatus(
                  user.id, 
                  user.email, 
                  !isActive
                )}
              >
                {isActive ? (
                  <>
                    <UserMinus className="mr-2 h-4 w-4" />
                    <span>Desativar usuário</span>
                  </>
                ) : (
                  <>
                    <UserCheck className="mr-2 h-4 w-4" />
                    <span>Ativar usuário</span>
                  </>
                )}
              </DropdownMenuItem>

              <DropdownMenuItem 
                className="text-red-600" 
                onClick={() => onDeleteUser(user.id, user.email)}
              >
                <UserX className="mr-2 h-4 w-4" />
                <span>Excluir usuário</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </TableCell>
      </TableRow>

      <StorageUpgradeDialog
        open={showStorageUpgrade}
        onOpenChange={setShowStorageUpgrade}
        userId={user.id}
        userName={user.name || user.email}
      />
    </>
  );
};

export default UserTableRow;

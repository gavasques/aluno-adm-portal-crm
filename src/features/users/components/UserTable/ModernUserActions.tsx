
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  MoreVertical, 
  Eye, 
  KeyRound,
  UserX,
  Lock,
  HardDrive,
  Activity,
  Link,
  Edit,
  GraduationCap,
  Mail
} from 'lucide-react';
import { User } from '@/types/user.types';

interface ModernUserActionsProps {
  user: User;
  onViewDetails: (user: User) => void;
  onResetPassword: (user: User) => void;
  onChangePassword: (user: User) => void;
  onDeleteUser: (user: User) => void;
  onSetPermissionGroup: (user: User) => void;
  onStorageManagement: (user: User) => void;
  onActivityLogs: (user: User) => void;
  onSendMagicLink: (user: User) => void;
  onToggleMentor: (user: User) => void;
}

const GERAL_GROUP_ID = "564c55dc-0ab8-481e-a0bc-97ea7e484b88";

export const ModernUserActions: React.FC<ModernUserActionsProps> = ({
  user,
  onViewDetails,
  onResetPassword,
  onChangePassword,
  onDeleteUser,
  onSetPermissionGroup,
  onStorageManagement,
  onActivityLogs,
  onSendMagicLink,
  onToggleMentor,
}) => {
  const isTemporaryGroup = user.permission_group_id === GERAL_GROUP_ID && user.role !== "Admin";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button 
            variant="ghost" 
            className="h-8 w-8 p-0 hover:bg-white/80 dark:hover:bg-slate-700/80 backdrop-blur-sm"
          >
            <span className="sr-only">Abrir menu</span>
            <MoreVertical className="h-4 w-4" />
          </Button>
        </motion.div>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="w-56 backdrop-blur-xl bg-white/90 dark:bg-slate-800/90 border-white/20 shadow-xl"
      >
        <DropdownMenuItem onClick={() => onViewDetails(user)} className="group">
          <Eye className="mr-2 h-4 w-4 group-hover:text-blue-600 transition-colors" />
          <span>Ver detalhes</span>
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={() => onResetPassword(user)} className="group">
          <KeyRound className="mr-2 h-4 w-4 group-hover:text-green-600 transition-colors" />
          <span>Redefinir senha</span>
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => onChangePassword(user)} className="group">
          <Edit className="mr-2 h-4 w-4 group-hover:text-blue-600 transition-colors" />
          <span>Alterar senha</span>
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => onSendMagicLink(user)} className="group">
          <Link className="mr-2 h-4 w-4 group-hover:text-purple-600 transition-colors" />
          <span>Enviar Magic Link</span>
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => onSetPermissionGroup(user)} className="group">
          <Lock className="mr-2 h-4 w-4 group-hover:text-orange-600 transition-colors" />
          <span>
            {isTemporaryGroup ? "Atribuir grupo definitivo" : "Gerenciar permissões"}
          </span>
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => onStorageManagement(user)} className="group">
          <HardDrive className="mr-2 h-4 w-4 group-hover:text-indigo-600 transition-colors" />
          <span>Gerenciar armazenamento</span>
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => onActivityLogs(user)} className="group">
          <Activity className="mr-2 h-4 w-4 group-hover:text-gray-600 transition-colors" />
          <span>Logs de atividade</span>
        </DropdownMenuItem>

        {user.role === 'Student' && (
          <DropdownMenuItem onClick={() => onToggleMentor(user)} className="group">
            <GraduationCap className="mr-2 h-4 w-4 group-hover:text-purple-600 transition-colors" />
            <span>{user.is_mentor ? 'Remover como mentor' : 'Tornar mentor'}</span>
          </DropdownMenuItem>
        )}
        
        <DropdownMenuSeparator className="bg-white/20" />
        
        <DropdownMenuItem 
          onClick={() => onDeleteUser(user)} 
          className="text-red-600 focus:text-red-600 hover:text-red-600 group"
        >
          <UserX className="mr-2 h-4 w-4 group-hover:text-red-700 transition-colors" />
          <span>Excluir usuário</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

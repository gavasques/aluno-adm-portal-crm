
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { User } from '@/types/user.types';
import { 
  Shield, 
  Clock, 
  CheckCircle, 
  XCircle, 
  GraduationCap, 
  Ban,
  UserX,
  Users
} from 'lucide-react';

interface UserBadgesProps {
  user: User;
  permissionGroups?: Array<{ id: string; name: string; }>;
}

const GERAL_GROUP_ID = "564c55dc-0ab8-481e-a0bc-97ea7e484b88";

export const UserBadges: React.FC<UserBadgesProps> = ({ 
  user, 
  permissionGroups = [] 
}) => {
  const isTemporaryGroup = user.permission_group_id === GERAL_GROUP_ID && user.role !== "Admin";
  const isAdmin = user.role === "Admin";
  
  // Buscar o grupo "Banido" pelos grupos de permissão
  const bannedGroup = permissionGroups.find(g => 
    g.name.toLowerCase().includes('banido') || 
    g.name.toLowerCase().includes('banned')
  );
  
  // Verificar se o usuário está banido - verificando o grupo de permissão primeiro
  const isBanned = bannedGroup ? 
    user.permission_group_id === bannedGroup.id :
    (user.status === 'Banido' || 
     user.status === 'Banned' ||
     user.status?.toLowerCase() === 'banido' ||
     user.status?.toLowerCase() === 'banned');
  
  // Verificar se está ativo
  const normalizedStatus = typeof user.status === 'string' ? user.status.toLowerCase() : '';
  const isActive = normalizedStatus === "ativo" || normalizedStatus === "active";

  // Encontrar o grupo de permissão
  const permissionGroup = permissionGroups.find(g => g.id === user.permission_group_id);
  
  console.log('🏷️ UserBadges - Renderizando badges para:', {
    userEmail: user.email,
    status: user.status,
    permission_group_id: user.permission_group_id,
    bannedGroup: bannedGroup,
    isBanned: isBanned,
    isActive: isActive,
    isAdmin: isAdmin,
    isTemporaryGroup: isTemporaryGroup,
    permissionGroup: permissionGroup?.name
  });

  return (
    <div className="flex flex-wrap items-start gap-1.5">
      {/* Badge de Admin */}
      {isAdmin && (
        <Badge size="sm" variant="outline" className="bg-blue-50 border-blue-200 text-blue-700 text-[9px] px-1.5 py-0.5">
          <Shield className="w-2 h-2 mr-1" />
          ADM
        </Badge>
      )}

      {/* Badge de Banido - tem prioridade sobre outros status */}
      {isBanned && (
        <Badge size="sm" variant="outline" className="bg-red-100 border-red-300 text-red-800 text-[9px] px-1.5 py-0.5">
          <Ban className="w-2 h-2 mr-1" />
          Banido
        </Badge>
      )}

      {/* Badge de Status (apenas se não estiver banido) */}
      {!isBanned && (
        <>
          {isActive ? (
            <Badge size="sm" variant="outline" className="bg-green-50 border-green-200 text-green-700 text-[9px] px-1.5 py-0.5">
              <CheckCircle className="w-2 h-2 mr-1" />
              Ativo
            </Badge>
          ) : (
            <Badge size="sm" variant="outline" className="bg-red-50 border-red-200 text-red-700 text-[9px] px-1.5 py-0.5">
              <XCircle className="w-2 h-2 mr-1" />
              Inativo
            </Badge>
          )}
        </>
      )}

      {/* Badge de Grupo Temporário (apenas se não estiver banido) */}
      {!isBanned && isTemporaryGroup && (
        <Badge size="sm" variant="outline" className="bg-orange-50 border-orange-200 text-orange-700 text-[9px] px-1.5 py-0.5">
          <Clock className="w-2 h-2 mr-1" />
          Pendente
        </Badge>
      )}

      {/* Badge de Mentor */}
      {user.is_mentor && (
        <Badge size="sm" variant="outline" className="bg-purple-50 border-purple-200 text-purple-700 text-[9px] px-1.5 py-0.5">
          <GraduationCap className="w-2 h-2 mr-1" />
          Mentor
        </Badge>
      )}

      {/* Badge do Grupo de Permissão - sempre exibir quando disponível */}
      {permissionGroup && (
        <Badge size="sm" variant="outline" className="bg-slate-50 border-slate-200 text-slate-700 text-[9px] px-1.5 py-0.5">
          <Users className="w-2 h-2 mr-1" />
          {permissionGroup.name}
        </Badge>
      )}
    </div>
  );
};

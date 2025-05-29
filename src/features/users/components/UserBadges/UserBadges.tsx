
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
    <div className="flex flex-wrap items-start gap-2">
      {/* Badge de Admin */}
      {isAdmin && (
        <div className="flex flex-col items-center">
          <span className="text-[9px] text-gray-400 mb-0.5">Função</span>
          <Badge variant="outline" className="bg-blue-50 border-blue-200 text-blue-700 text-xs">
            <Shield className="w-3 h-3 mr-1" />
            ADM
          </Badge>
        </div>
      )}

      {/* Badge de Banido - tem prioridade sobre outros status */}
      {isBanned && (
        <div className="flex flex-col items-center">
          <span className="text-[9px] text-gray-400 mb-0.5">Status</span>
          <Badge variant="outline" className="bg-red-100 border-red-300 text-red-800 text-xs">
            <Ban className="w-3 h-3 mr-1" />
            Banido
          </Badge>
        </div>
      )}

      {/* Badge de Status (apenas se não estiver banido) */}
      {!isBanned && (
        <div className="flex flex-col items-center">
          <span className="text-[9px] text-gray-400 mb-0.5">Status</span>
          {isActive ? (
            <Badge variant="outline" className="bg-green-50 border-green-200 text-green-700 text-xs">
              <CheckCircle className="w-3 h-3 mr-1" />
              Ativo
            </Badge>
          ) : (
            <Badge variant="outline" className="bg-red-50 border-red-200 text-red-700 text-xs">
              <XCircle className="w-3 h-3 mr-1" />
              Inativo
            </Badge>
          )}
        </div>
      )}

      {/* Badge de Grupo Temporário (apenas se não estiver banido) */}
      {!isBanned && isTemporaryGroup && (
        <div className="flex flex-col items-center">
          <span className="text-[9px] text-gray-400 mb-0.5">Status</span>
          <Badge variant="outline" className="bg-orange-50 border-orange-200 text-orange-700 text-xs">
            <Clock className="w-3 h-3 mr-1" />
            Pendente
          </Badge>
        </div>
      )}

      {/* Badge de Mentor */}
      {user.is_mentor && (
        <div className="flex flex-col items-center">
          <span className="text-[9px] text-gray-400 mb-0.5">É mentor</span>
          <Badge variant="outline" className="bg-purple-50 border-purple-200 text-purple-700 text-xs">
            <GraduationCap className="w-3 h-3 mr-1" />
            Mentor
          </Badge>
        </div>
      )}

      {/* Badge do Grupo de Permissão - sempre exibir quando disponível */}
      {permissionGroup && (
        <div className="flex flex-col items-center">
          <span className="text-[9px] text-gray-400 mb-0.5">Permissão</span>
          <Badge variant="outline" className="bg-slate-50 border-slate-200 text-slate-700 text-xs">
            <Users className="w-3 h-3 mr-1" />
            {permissionGroup.name}
          </Badge>
        </div>
      )}
    </div>
  );
};

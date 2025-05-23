
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { User, Clock, ArrowRight } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  lastLogin: string;
  permission_group_id?: string | null;
  created_at?: string;
}

interface PendingUsersCardProps {
  users: User[];
  isLoading: boolean;
  onAssignGroup: (userId: string, userEmail: string, currentGroupId: string | null) => void;
}

const PendingUsersCard: React.FC<PendingUsersCardProps> = ({
  users,
  isLoading,
  onAssignGroup,
}) => {
  // Filtrar usuários que estão no grupo "Geral" (temporário)
  const pendingUsers = users.filter(user => 
    user.permission_group_id && 
    // Assumindo que o grupo "Geral" pode ser identificado pelo nome ou ID
    user.role !== "Admin" // Não incluir admins na lista de pendentes
  );

  if (isLoading) {
    return (
      <Card className="border-orange-200 bg-orange-50/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-orange-700">
            <Clock className="h-5 w-5" />
            Usuários Pendentes de Atribuição
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-20">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-500"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (pendingUsers.length === 0) {
    return (
      <Card className="border-green-200 bg-green-50/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-700">
            <Clock className="h-5 w-5" />
            Usuários Pendentes de Atribuição
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <p className="text-green-600">✅ Não há usuários pendentes de atribuição de grupo</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-orange-200 bg-orange-50/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-orange-700">
          <Clock className="h-5 w-5" />
          Usuários Pendentes de Atribuição
          <Badge variant="secondary" className="bg-orange-100 text-orange-700">
            {pendingUsers.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border border-orange-200 bg-white">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Usuário</TableHead>
                <TableHead>Data de Cadastro</TableHead>
                <TableHead>Status Atual</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pendingUsers.map((user) => (
                <TableRow key={user.id} className="hover:bg-orange-50">
                  <TableCell>
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-orange-100 flex items-center justify-center mr-3">
                        <User className="h-4 w-4 text-orange-600" />
                      </div>
                      <div>
                        <div className="font-medium">{user.name || "Sem nome"}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {user.created_at ? (
                      format(new Date(user.created_at), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })
                    ) : (
                      "Data não disponível"
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="border-orange-300 text-orange-700 bg-orange-50">
                      Grupo Temporário
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onAssignGroup(user.id, user.email, user.permission_group_id)}
                      className="border-orange-300 text-orange-700 hover:bg-orange-100"
                    >
                      <ArrowRight className="h-4 w-4 mr-1" />
                      Atribuir Grupo
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default PendingUsersCard;

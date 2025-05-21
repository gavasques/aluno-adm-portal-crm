
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Shield, Plus, Search, Users } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { usePermissionGroups } from "@/hooks/admin/usePermissionGroups";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import GroupUsersDialog from "@/components/admin/permissions/GroupUsersDialog";

const Permissions = () => {
  const navigate = useNavigate();
  const { permissionGroups, deletePermissionGroup, studentMenuItems } = usePermissionGroups();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGroup, setSelectedGroup] = useState<{ id: number; name: string } | null>(null);
  const [showUsersDialog, setShowUsersDialog] = useState(false);

  const filteredGroups = permissionGroups.filter(group => 
    group.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    group.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateGroup = () => {
    navigate("/admin/permissions/new");
  };

  const handleEditGroup = (id: number) => {
    navigate(`/admin/permissions/${id}`);
  };

  const handleViewUsers = (groupId: number, groupName: string) => {
    setSelectedGroup({ id: groupId, name: groupName });
    setShowUsersDialog(true);
  };

  const getMenuName = (menuId: string) => {
    const menu = studentMenuItems.find(item => item.id === menuId);
    return menu?.name || menuId;
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <div className="flex items-center mb-4 md:mb-0">
          <Shield className="h-8 w-8 mr-3 text-purple-600" />
          <h1 className="text-3xl font-bold text-gray-900">Grupos de Permissão</h1>
        </div>
        
        <Button onClick={handleCreateGroup} className="bg-purple-700 hover:bg-purple-800">
          <Plus className="mr-2 h-4 w-4" />
          Novo Grupo
        </Button>
      </div>
      
      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle>Gestão de Permissões</CardTitle>
          <CardDescription>
            Crie e gerencie grupos de permissões para controlar o acesso dos alunos às diferentes áreas do painel.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar grupos..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[200px]">Nome</TableHead>
                  <TableHead className="hidden md:table-cell">Descrição</TableHead>
                  <TableHead className="hidden lg:table-cell">Menus Permitidos</TableHead>
                  <TableHead className="hidden md:table-cell w-[150px]">Data de Criação</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredGroups.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                      Nenhum grupo de permissão encontrado.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredGroups.map((group) => (
                    <TableRow key={group.id} className="cursor-pointer hover:bg-gray-50" onClick={() => handleEditGroup(group.id)}>
                      <TableCell className="font-medium">{group.name}</TableCell>
                      <TableCell className="hidden md:table-cell">{group.description}</TableCell>
                      <TableCell className="hidden lg:table-cell">
                        <div className="flex flex-wrap gap-1">
                          {group.allowedMenus.slice(0, 3).map((menuId) => (
                            <Badge key={menuId} variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                              {getMenuName(menuId)}
                            </Badge>
                          ))}
                          {group.allowedMenus.length > 3 && (
                            <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
                              +{group.allowedMenus.length - 3}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {new Date(group.createdAt).toLocaleDateString("pt-BR")}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2" onClick={(e) => e.stopPropagation()}>
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex items-center"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleViewUsers(group.id, group.name);
                            }}
                          >
                            <Users className="h-4 w-4 mr-1" />
                            Ver Usuários
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditGroup(group.id);
                            }}
                          >
                            Editar
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={(e) => e.stopPropagation()}
                              >
                                Excluir
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Excluir grupo</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Tem certeza que deseja excluir o grupo "{group.name}"?
                                  Esta ação não pode ser desfeita.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction
                                  className="bg-red-600 hover:bg-red-700"
                                  onClick={() => deletePermissionGroup(group.id)}
                                >
                                  Excluir
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {selectedGroup && (
        <GroupUsersDialog
          open={showUsersDialog}
          onOpenChange={setShowUsersDialog}
          groupId={selectedGroup.id}
          groupName={selectedGroup.name}
        />
      )}
    </div>
  );
};

export default Permissions;

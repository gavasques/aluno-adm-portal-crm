
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Shield, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { PermissionServiceFactory } from '@/services/permissions';
import FullPagePermissionForm from '@/components/admin/permissions/FullPagePermissionForm';

const PermissionEdit = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const { data: permissionGroup, isLoading, error } = useQuery({
    queryKey: ['permission-group', id],
    queryFn: async () => {
      if (!id) return null;
      const service = PermissionServiceFactory.getPermissionGroupService();
      return await service.getById(id);
    },
    enabled: !!id,
  });

  const handleSuccess = () => {
    navigate('/admin/permissoes');
  };

  const handleCancel = () => {
    navigate('/admin/permissoes');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
          <Card>
            <CardContent className="flex items-center justify-center p-12">
              <div className="flex items-center gap-3">
                <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
                <span className="text-gray-600">Carregando grupo de permissão...</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (error || !permissionGroup) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
          <Card>
            <CardContent className="p-8 text-center">
              <div className="text-red-600 mb-2">Erro ao carregar grupo de permissão</div>
              <p className="text-gray-600 mb-4">
                {error?.message || 'Grupo não encontrado'}
              </p>
              <Button onClick={() => navigate('/admin/permissoes')}>
                Voltar para Permissões
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/admin/permissoes')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Button>
          <div className="flex items-center gap-3">
            <Shield className="h-8 w-8 text-blue-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Editar Grupo de Permissão</h1>
              <p className="text-gray-600">
                Editando: <span className="font-medium">{permissionGroup.name}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Form Card */}
        <Card>
          <CardHeader>
            <CardTitle>Configurações do Grupo</CardTitle>
          </CardHeader>
          <CardContent>
            <FullPagePermissionForm
              isEdit={true}
              permissionGroup={permissionGroup}
              onCancel={handleCancel}
              onSuccess={handleSuccess}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PermissionEdit;

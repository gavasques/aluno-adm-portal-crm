
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import FullPagePermissionForm from '@/components/admin/permissions/FullPagePermissionForm';

const PermissionCreate = () => {
  const navigate = useNavigate();

  const handleSuccess = () => {
    navigate('/admin/permissoes');
  };

  const handleCancel = () => {
    navigate('/admin/permissoes');
  };

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
              <h1 className="text-2xl font-bold text-gray-900">Novo Grupo de Permissão</h1>
              <p className="text-gray-600">Crie um novo grupo de permissões para organizar o acesso dos usuários</p>
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
              isEdit={false}
              onCancel={handleCancel}
              onSuccess={handleSuccess}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PermissionCreate;

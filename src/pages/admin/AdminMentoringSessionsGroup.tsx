
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BreadcrumbNav } from "@/components/ui/breadcrumb-nav";
import { Calendar, Plus, Clock, Users2 } from "lucide-react";

const AdminMentoringSessionsGroup = () => {
  const breadcrumbItems = [
    { label: 'Admin', href: '/admin' },
    { label: 'Mentorias', href: '/admin/mentoring-dashboard' },
    { label: 'Sessões em Grupo' }
  ];

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Breadcrumb */}
      <BreadcrumbNav items={breadcrumbItems} showBackButton={true} />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Sessões em Grupo</h1>
          <p className="text-gray-600 mt-1">Agende e gerencie sessões de mentoria em grupo</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Agendar Nova Sessão
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Sessões Agendadas</p>
                <p className="text-2xl font-bold text-gray-900">8</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Participantes Totais</p>
                <p className="text-2xl font-bold text-gray-900">64</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <Users2 className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Hoje</p>
                <p className="text-2xl font-bold text-gray-900">1</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <Clock className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Esta Semana</p>
                <p className="text-2xl font-bold text-gray-900">4</p>
              </div>
              <div className="p-3 bg-orange-100 rounded-lg">
                <Calendar className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Content */}
      <Card>
        <CardHeader>
          <CardTitle>Próximas Sessões em Grupo</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma sessão em grupo agendada</h3>
            <p className="text-gray-500 mb-4">Comece agendando sua primeira sessão em grupo.</p>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Agendar Primeira Sessão
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminMentoringSessionsGroup;

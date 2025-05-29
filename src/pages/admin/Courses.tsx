
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BreadcrumbNav } from '@/components/ui/breadcrumb-nav';
import { GraduationCap, Plus } from 'lucide-react';

// Definições de tipos necessárias para CourseForm e CourseDetails
export type CourseStatus = "active" | "inactive" | "coming_soon";

export interface Course {
  id: string;
  courseId: string;
  name: string;
  status: CourseStatus;
  platform: string;
  platformLink: string;
  salesPageLink: string;
  accessPeriod: number;
  price: number;
  createdAt: Date;
}

const AdminCourses = () => {
  const breadcrumbItems = [
    { label: 'Admin', href: '/admin' },
    { label: 'Cadastro de Cursos' }
  ];

  return (
    <div className="container mx-auto py-6 space-y-6">
      <BreadcrumbNav items={breadcrumbItems} showBackButton={true} />
      
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Cadastro de Cursos</h1>
          <p className="text-gray-600 mt-1">Gerencie os cursos disponíveis no sistema</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Novo Curso
        </Button>
      </div>

      <Card>
        <CardContent className="p-8 text-center">
          <GraduationCap className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum curso encontrado</h3>
          <p className="text-gray-600 mb-4">
            Comece adicionando o primeiro curso ao catálogo.
          </p>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Adicionar Primeiro Curso
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminCourses;

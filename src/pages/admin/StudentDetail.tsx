
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  ChevronLeft, 
  User, 
  Mail, 
  Phone, 
  Building, 
  Calendar, 
  Star, 
  Clock,
  Shield
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { STUDENTS } from "@/data/students";
import { useToast } from "@/hooks/use-toast";
import EditStudentForm from "@/components/admin/student/EditStudentForm";
import { usePermissionGroups } from "@/hooks/admin/usePermissionGroups";

const StudentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { permissionGroups } = usePermissionGroups();
  
  // Find student data
  const student = STUDENTS.find((s) => s.id === Number(id));
  
  // State for managing current tab
  const [activeTab, setActiveTab] = useState("profile");
  
  // Handle student not found
  if (!student) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center mb-6">
          <Button variant="outline" size="sm" onClick={() => navigate("/admin/gestao-alunos")}>
            <ChevronLeft className="mr-2 h-4 w-4" /> Voltar
          </Button>
        </div>
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-xl font-medium text-gray-500">Aluno não encontrado</p>
            <Button className="mt-4" onClick={() => navigate("/admin/gestao-alunos")}>
              Voltar para Lista de Alunos
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Get permission group name for display
  const permissionGroup = permissionGroups.find(g => g.id === student.permissionGroupId);
  
  // Handle save student changes
  const handleSaveStudent = (data) => {
    // In a real app, this would update the database
    toast({
      title: "Alterações salvas",
      description: "As informações do aluno foram atualizadas com sucesso."
    });
  };
  
  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center mb-6">
        <Button variant="outline" size="sm" onClick={() => navigate("/admin/gestao-alunos")}>
          <ChevronLeft className="mr-2 h-4 w-4" /> Voltar
        </Button>
      </div>
      
      <header className="mb-6">
        <h1 className="text-3xl font-bold">{student.name}</h1>
        <div className="flex items-center mt-2 gap-2">
          <Badge
            variant={student.status === "Ativo" ? "default" : student.status === "Pendente" ? "secondary" : "outline"}
            className={
              student.status === "Ativo"
                ? "bg-green-500"
                : student.status === "Pendente"
                  ? "bg-yellow-500"
                  : "bg-gray-500"
            }
          >
            {student.status}
          </Badge>
          {permissionGroup && (
            <Badge variant="outline" className="flex items-center gap-1 border-blue-500 text-blue-500">
              <Shield className="h-3 w-3" />
              {permissionGroup.name}
            </Badge>
          )}
        </div>
      </header>
      
      <Tabs defaultValue="profile" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="profile">Perfil</TabsTrigger>
          <TabsTrigger value="mentoring">Mentorias</TabsTrigger>
          <TabsTrigger value="purchases">Compras</TabsTrigger>
          <TabsTrigger value="communications">Comunicações</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Informações de Contato</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start">
                    <Mail className="h-5 w-5 mr-2 text-gray-500 mt-0.5" />
                    <div>
                      <p className="font-medium">Email</p>
                      <p className="text-sm text-gray-600">{student.email}</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Phone className="h-5 w-5 mr-2 text-gray-500 mt-0.5" />
                    <div>
                      <p className="font-medium">Telefone</p>
                      <p className="text-sm text-gray-600">{student.phone}</p>
                    </div>
                  </div>
                  {student.company && (
                    <div className="flex items-start">
                      <Building className="h-5 w-5 mr-2 text-gray-500 mt-0.5" />
                      <div>
                        <p className="font-medium">Empresa</p>
                        <p className="text-sm text-gray-600">{student.company}</p>
                      </div>
                    </div>
                  )}
                  <Separator />
                  <div className="flex items-start">
                    <User className="h-5 w-5 mr-2 text-gray-500 mt-0.5" />
                    <div>
                      <p className="font-medium">Usuário Vinculado</p>
                      <p className="text-sm text-gray-600">
                        {student.user ? `${student.user.name} (${student.user.email})` : "Nenhum usuário vinculado"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Shield className="h-5 w-5 mr-2 text-gray-500 mt-0.5" />
                    <div>
                      <p className="font-medium">Grupo de Permissão</p>
                      <p className="text-sm text-gray-600">
                        {permissionGroup ? permissionGroup.name : "Nenhum grupo atribuído"}
                      </p>
                    </div>
                  </div>
                  <Separator />
                  <div className="flex items-start">
                    <Calendar className="h-5 w-5 mr-2 text-gray-500 mt-0.5" />
                    <div>
                      <p className="font-medium">Data de Cadastro</p>
                      <p className="text-sm text-gray-600">{student.registrationDate}</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Clock className="h-5 w-5 mr-2 text-gray-500 mt-0.5" />
                    <div>
                      <p className="font-medium">Último Login</p>
                      <p className="text-sm text-gray-600">{student.lastLogin}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="lg:col-span-2">
              <EditStudentForm student={student} onSave={handleSaveStudent} />
              
              {student.amazonStoreLink && (
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle>Dados da Loja Amazon</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <p><span className="font-medium">Link da Loja:</span> <a href={student.amazonStoreLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{student.amazonStoreLink}</a></p>
                      <p><span className="font-medium">Utiliza FBA:</span> {student.usesFBA || "Não"}</p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="mentoring">
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-xl font-medium text-gray-500">Nenhuma mentoria agendada</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="purchases">
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-xl font-medium text-gray-500">Nenhuma compra registrada</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="communications">
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-xl font-medium text-gray-500">Nenhuma comunicação registrada</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StudentDetail;

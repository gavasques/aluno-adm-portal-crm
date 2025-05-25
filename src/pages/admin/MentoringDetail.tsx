
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BreadcrumbNav } from "@/components/ui/breadcrumb-nav";
import { Save, Pencil, IdCard } from "lucide-react";
import { toast } from "sonner";

interface MentoringData {
  id: string;
  mentoringId: string;
  name: string;
  description: string;
  duration: string;
  type: string;
  registrationDate: string;
  periodicity: string;
  responsible: string;
}

type MentoringForm = Omit<MentoringData, "id" | "mentoringId">;

const MentoringDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isNewMentoring = id === "new";
  const [isEditing, setIsEditing] = useState(isNewMentoring);
  
  const [mentoring, setMentoring] = useState<MentoringData>({
    id: isNewMentoring ? "" : (id || "1"),
    mentoringId: isNewMentoring ? "" : "MNT001",
    name: isNewMentoring ? "" : "Mentoria de E-commerce",
    description: isNewMentoring ? "" : "Mentoria especializada para quem deseja iniciar no mercado de e-commerce...",
    duration: isNewMentoring ? "" : "3 meses",
    type: isNewMentoring ? "" : "Individual",
    registrationDate: isNewMentoring ? "" : "01/05/2025",
    periodicity: isNewMentoring ? "" : "Semanal",
    responsible: isNewMentoring ? "" : "Ana Silva"
  });
  
  const [formData, setFormData] = useState<MentoringForm>({
    name: mentoring.name,
    description: mentoring.description,
    duration: mentoring.duration,
    type: mentoring.type,
    registrationDate: mentoring.registrationDate,
    periodicity: mentoring.periodicity,
    responsible: mentoring.responsible
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSave = () => {
    if (isNewMentoring) {
      // Validação básica para nova mentoria
      if (!formData.name || !formData.type) {
        toast.error("Nome e tipo são obrigatórios!");
        return;
      }
      
      console.log("Criando nova mentoria:", formData);
      toast.success("Mentoria criada com sucesso!");
      
      // Em uma implementação real, você criaria a mentoria e redirecionaria para a página de edição
      navigate("/admin/cadastros?tab=mentoring");
    } else {
      console.log("Dados a serem salvos:", formData);
      
      toast.success("Mentoria atualizada com sucesso!");
      
      setMentoring(prevMentoring => ({
        ...prevMentoring,
        ...formData
      }));
      
      setIsEditing(false);
    }
  };

  const getPageTitle = () => {
    if (isNewMentoring) return "Nova Mentoria";
    return mentoring.name;
  };

  const getHeaderActions = () => {
    if (isNewMentoring) {
      return (
        <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700">
          <Save className="mr-2 h-4 w-4" /> Criar Mentoria
        </Button>
      );
    }
    
    if (isEditing) {
      return (
        <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700">
          <Save className="mr-2 h-4 w-4" /> Salvar
        </Button>
      );
    }
    
    return (
      <Button onClick={() => setIsEditing(true)}>
        <Pencil className="mr-2 h-4 w-4" /> Editar
      </Button>
    );
  };

  const breadcrumbItems = [
    { label: 'Dashboard', href: '/admin' },
    { label: 'Cadastros', href: '/admin/cadastros' },
    { label: 'Mentorias', href: '/admin/cadastros?tab=mentoring' },
    { label: isNewMentoring ? 'Nova Mentoria' : mentoring.name }
  ];

  return (
    <div className="container mx-auto py-4">
      {/* Breadcrumb Navigation */}
      <BreadcrumbNav 
        items={breadcrumbItems} 
        showBackButton={true}
        backHref="/admin/cadastros?tab=mentoring"
        className="mb-4"
      />

      <div className="flex justify-between items-center mb-4">
        <div></div>
        {getHeaderActions()}
      </div>

      <div className="bg-white rounded-lg shadow mb-4">
        <div className="p-4 border-b flex justify-between items-center">
          <h1 className="text-2xl font-bold">{getPageTitle()}</h1>
          {!isNewMentoring && (
            <div className="flex items-center bg-gray-100 px-3 py-1 rounded-full text-sm">
              <IdCard className="h-4 w-4 mr-1 text-gray-600" />
              <span className="font-semibold">{mentoring.mentoringId}</span>
            </div>
          )}
        </div>
      </div>

      <Tabs defaultValue="informacoes" className="w-full">
        <TabsList>
          <TabsTrigger value="informacoes">Informações</TabsTrigger>
          {!isNewMentoring && <TabsTrigger value="comentarios">Comentários</TabsTrigger>}
        </TabsList>
        <TabsContent value="informacoes">
          <Card>
            <CardHeader>
              <CardTitle>{isNewMentoring ? "Dados da Nova Mentoria" : "Detalhes da Mentoria"}</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Nome *</Label>
                  <Input 
                    id="name" 
                    name="name"
                    value={isEditing ? formData.name : mentoring.name} 
                    onChange={handleChange} 
                    disabled={!isEditing}
                    placeholder="Digite o nome da mentoria"
                  />
                </div>
                <div>
                  <Label htmlFor="duration">Duração</Label>
                  <Input 
                    id="duration" 
                    name="duration"
                    value={isEditing ? formData.duration : mentoring.duration} 
                    onChange={handleChange} 
                    disabled={!isEditing}
                    placeholder="Ex: 3 meses"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="type">Tipo *</Label>
                  <Select 
                    disabled={!isEditing} 
                    value={isEditing ? formData.type : mentoring.type} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Individual">Individual</SelectItem>
                      <SelectItem value="Grupo">Grupo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="registrationDate">Data de Inscrição</Label>
                  <Input 
                    id="registrationDate" 
                    name="registrationDate"
                    value={isEditing ? formData.registrationDate : mentoring.registrationDate} 
                    onChange={handleChange} 
                    disabled={!isEditing}
                    placeholder="DD/MM/AAAA"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="periodicity">Periodicidade</Label>
                <Input 
                  id="periodicity" 
                  name="periodicity"
                  value={isEditing ? formData.periodicity : mentoring.periodicity} 
                  onChange={handleChange} 
                  disabled={!isEditing}
                  placeholder="Ex: Semanal, Quinzenal"
                />
              </div>
              <div>
                <Label htmlFor="responsible">Responsável</Label>
                <Input 
                  id="responsible" 
                  name="responsible"
                  value={isEditing ? formData.responsible : mentoring.responsible} 
                  onChange={handleChange} 
                  disabled={!isEditing}
                  placeholder="Nome do responsável"
                />
              </div>
              <div>
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={isEditing ? formData.description : mentoring.description}
                  onChange={handleChange}
                  disabled={!isEditing}
                  placeholder="Descreva a mentoria..."
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        {!isNewMentoring && (
          <TabsContent value="comentarios">
            <Card>
              <CardHeader>
                <CardTitle>Comentários</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Em breve, aqui estarão os comentários sobre a mentoria.</p>
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};

export default MentoringDetail;

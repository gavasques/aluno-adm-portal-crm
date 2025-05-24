
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Save, Pencil, IdCard } from "lucide-react";
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
  const [isEditing, setIsEditing] = useState(false);
  
  const [mentoring, setMentoring] = useState<MentoringData>({
    id: id || "1",
    mentoringId: "MNT001",
    name: "Mentoria de E-commerce",
    description: "Mentoria especializada para quem deseja iniciar no mercado de e-commerce...",
    duration: "3 meses",
    type: "Individual",
    registrationDate: "01/05/2025",
    periodicity: "Semanal",
    responsible: "Ana Silva"
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
    console.log("Dados a serem salvos:", formData);
    
    toast.success("Mentoria atualizada com sucesso!");
    
    setMentoring(prevMentoring => ({
      ...prevMentoring,
      ...formData
    }));
    
    setIsEditing(false);
  };

  return (
    <div className="container mx-auto py-4">
      <div className="flex justify-between items-center mb-4">
        <Button variant="ghost" onClick={() => navigate("/admin/cadastros?tab=mentoring")}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
        </Button>
        {isEditing ? (
          <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700">
            <Save className="mr-2 h-4 w-4" /> Salvar
          </Button>
        ) : (
          <Button onClick={() => setIsEditing(true)}>
            <Pencil className="mr-2 h-4 w-4" /> Editar
          </Button>
        )}
      </div>

      <div className="bg-white rounded-lg shadow mb-4">
        <div className="p-4 border-b flex justify-between items-center">
          <h1 className="text-2xl font-bold">{mentoring.name}</h1>
          <div className="flex items-center bg-gray-100 px-3 py-1 rounded-full text-sm">
            <IdCard className="h-4 w-4 mr-1 text-gray-600" />
            <span className="font-semibold">{mentoring.mentoringId}</span>
          </div>
        </div>
      </div>

      <Tabs defaultValue="informacoes" className="w-full">
        <TabsList>
          <TabsTrigger value="informacoes">Informações</TabsTrigger>
          <TabsTrigger value="comentarios">Comentários</TabsTrigger>
        </TabsList>
        <TabsContent value="informacoes">
          <Card>
            <CardHeader>
              <CardTitle>Detalhes da Mentoria</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Nome</Label>
                  <Input 
                    id="name" 
                    name="name"
                    value={isEditing ? formData.name : mentoring.name} 
                    onChange={handleChange} 
                    disabled={!isEditing} 
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
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="type">Tipo</Label>
                  <Select disabled={!isEditing} value={formData.type} onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Selecione" />
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
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
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
      </Tabs>
    </div>
  );
};

export default MentoringDetail;

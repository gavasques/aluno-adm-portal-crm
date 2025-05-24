
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash, Users, User, Calendar } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useMentoringCatalog } from "@/hooks/admin/useMentoringCatalog";
import MentoringForm from "@/components/admin/mentoring/MentoringForm";
import { MentoriaCatalogo } from "@/types/mentoring.types";
import { toast } from "sonner";

const MentoringCatalog = () => {
  const { mentoringItems, loading, fetchMentoringCatalog, addMentoringItem, updateMentoringItem, deleteMentoringItem } = useMentoringCatalog();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingMentoring, setEditingMentoring] = useState<MentoriaCatalogo | undefined>();

  useEffect(() => {
    fetchMentoringCatalog();
  }, []);

  const handleAddMentoring = () => {
    setEditingMentoring(undefined);
    setIsDialogOpen(true);
  };

  const handleEditMentoring = (mentoring: MentoriaCatalogo) => {
    setEditingMentoring(mentoring);
    setIsDialogOpen(true);
  };

  const handleDeleteMentoring = async (id: string) => {
    if (window.confirm("Tem certeza que deseja excluir esta mentoria?")) {
      await deleteMentoringItem(id);
    }
  };

  const handleSubmit = async (data: any) => {
    if (editingMentoring) {
      return await updateMentoringItem(editingMentoring.id, data);
    } else {
      return await addMentoringItem(data);
    }
  };

  const getTypeBadge = (tipo: string) => {
    return tipo === "INDIVIDUAL" 
      ? <Badge variant="default" className="bg-blue-100 text-blue-800"><User className="w-3 h-3 mr-1" />Individual</Badge>
      : <Badge variant="default" className="bg-green-100 text-green-800"><Users className="w-3 h-3 mr-1" />Grupo</Badge>;
  };

  if (loading) {
    return (
      <div className="container mx-auto py-6">
        <h1 className="text-3xl font-bold mb-8 text-portal-dark">Catálogo de Mentorias</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-64 bg-gray-200 animate-pulse rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-portal-dark">Catálogo de Mentorias</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleAddMentoring}>
              <Plus className="mr-2 h-4 w-4" />
              Nova Mentoria
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingMentoring ? "Editar Mentoria" : "Nova Mentoria"}
              </DialogTitle>
            </DialogHeader>
            <MentoringForm
              mentoring={editingMentoring}
              onSubmit={handleSubmit}
              onCancel={() => setIsDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mentoringItems.map((mentoring) => (
          <Card key={mentoring.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{mentoring.nome_mentoria}</CardTitle>
                <div className="flex space-x-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEditMentoring(mentoring)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteMentoring(mentoring.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              {getTypeBadge(mentoring.tipo_mentoria)}
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                {mentoring.descricao || "Sem descrição"}
              </p>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Instrutor:</span>
                  <span className="font-medium">{mentoring.instrutor_principal_nome || "Não definido"}</span>
                </div>
                
                {mentoring.duracao_acesso_dias && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Duração:</span>
                    <span className="font-medium">{mentoring.duracao_acesso_dias} dias</span>
                  </div>
                )}
                
                {mentoring.sessoes_padrao_individual && mentoring.tipo_mentoria === "INDIVIDUAL" && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Sessões:</span>
                    <span className="font-medium">{mentoring.sessoes_padrao_individual}</span>
                  </div>
                )}
                
                {mentoring.preco && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Preço:</span>
                    <span className="font-medium text-green-600">
                      R$ {mentoring.preco.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                )}
              </div>

              <div className="mt-4 pt-4 border-t">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full"
                  onClick={() => {
                    if (mentoring.tipo_mentoria === "GRUPO") {
                      // Navigate to group management
                      toast.info("Redirecionando para gestão de grupo...");
                    } else {
                      // Navigate to individual management
                      toast.info("Redirecionando para gestão individual...");
                    }
                  }}
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  Gerenciar {mentoring.tipo_mentoria === "GRUPO" ? "Encontros" : "Sessões"}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {mentoringItems.length === 0 && (
        <div className="text-center py-12">
          <Users className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma mentoria cadastrada</h3>
          <p className="text-gray-500 mb-4">Comece criando sua primeira mentoria.</p>
          <Button onClick={handleAddMentoring}>
            <Plus className="mr-2 h-4 w-4" />
            Criar Primera Mentoria
          </Button>
        </div>
      )}
    </div>
  );
};

export default MentoringCatalog;

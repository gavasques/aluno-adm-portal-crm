
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, Calendar, Users, User, Edit, Trash } from "lucide-react";
import { useMentoringCatalog } from "@/hooks/admin/useMentoringCatalog";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import MentoringForm from "@/components/admin/mentoring/MentoringForm";
import { MentoriaCatalogo } from "@/types/mentoring.types";

const Mentoring = () => {
  const navigate = useNavigate();
  const { mentoringItems, loading, fetchMentoringCatalog, addMentoringItem, updateMentoringItem, deleteMentoringItem } = useMentoringCatalog();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingMentoring, setEditingMentoring] = useState<MentoriaCatalogo | undefined>();

  useEffect(() => {
    fetchMentoringCatalog();
  }, []);

  const handleNewMentoring = () => {
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

  const handleManageMentoring = (mentoring: MentoriaCatalogo) => {
    if (mentoring.tipo_mentoria === "GRUPO") {
      navigate(`/admin/group-mentoring/${mentoring.id}`);
    } else {
      navigate(`/admin/individual-mentoring`);
    }
  };

  const getTypeBadge = (tipo: string) => {
    return tipo === "INDIVIDUAL" 
      ? <Badge variant="default" className="bg-blue-100 text-blue-800"><User className="w-3 h-3 mr-1" />Individual</Badge>
      : <Badge variant="default" className="bg-green-100 text-green-800"><Users className="w-3 h-3 mr-1" />Grupo</Badge>;
  };

  if (loading) {
    return (
      <div>
        <div className="flex justify-between items-center mb-6">
          <div>
            <p className="text-sm text-gray-500">Carregando mentorias...</p>
          </div>
        </div>
        <div className="border rounded-md overflow-hidden">
          <div className="animate-pulse bg-gray-200 h-64"></div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <p className="text-sm text-gray-500">Gerencie as mentorias disponíveis</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleNewMentoring}>
              <PlusCircle className="h-4 w-4 mr-2" />
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
      
      <div className="border rounded-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Instrutor</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Preço</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {mentoringItems.map((mentoring) => (
              <tr key={mentoring.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{mentoring.nome_mentoria}</div>
                    <div className="text-sm text-gray-500">{mentoring.descricao}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getTypeBadge(mentoring.tipo_mentoria)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{mentoring.instrutor_principal_nome || "Não definido"}</div>
                  {mentoring.sessoes_padrao_individual && (
                    <div className="text-xs text-gray-500">{mentoring.sessoes_padrao_individual} sessões</div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-green-600">
                    {mentoring.preco ? `R$ ${mentoring.preco.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : "Não definido"}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleManageMentoring(mentoring)}
                  >
                    <Calendar className="mr-1 h-3 w-3" />
                    Gerenciar
                  </Button>
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
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {mentoringItems.length === 0 && (
        <div className="text-center py-12">
          <Users className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma mentoria cadastrada</h3>
          <p className="text-gray-500 mb-4">Comece criando sua primeira mentoria.</p>
          <Button onClick={handleNewMentoring}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Criar Primera Mentoria
          </Button>
        </div>
      )}
    </div>
  );
};

export default Mentoring;

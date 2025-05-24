
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Users, Calendar, Search, Plus, Eye, Edit } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlunoInscricaoMentoria } from "@/types/mentoring.types";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

// Mock data for individual mentoring subscriptions
const mockSubscriptions: AlunoInscricaoMentoria[] = [
  {
    id: "sub1",
    aluno_id: "student1",
    aluno_nome: "João Silva",
    mentoria_catalogo_id: "1",
    mentoria_catalogo: {
      id: "1",
      nome_mentoria: "Mentoria Individual E-commerce",
      descricao: "Mentoria personalizada para quem quer começar no e-commerce",
      tipo_mentoria: "INDIVIDUAL",
      ativo: true,
      created_at: "2025-01-01T00:00:00Z",
      updated_at: "2025-01-01T00:00:00Z"
    },
    mentor_designado_id: "instructor1",
    mentor_designado_nome: "Ana Silva",
    tipo_mentoria_inscricao: "INDIVIDUAL",
    data_inicio_acesso: "2025-05-01",
    data_fim_acesso: "2025-07-30",
    status_inscricao: "ATIVA",
    total_sessoes_contratadas_ind: 6,
    sessoes_realizadas_ind: 2,
    observacoes_adm: "Aluno muito dedicado",
    created_at: "2025-05-01T00:00:00Z",
    updated_at: "2025-05-20T00:00:00Z"
  },
  {
    id: "sub2",
    aluno_id: "student2",
    aluno_nome: "Maria Santos",
    mentoria_catalogo_id: "3",
    mentoria_catalogo: {
      id: "3",
      nome_mentoria: "Mentoria Individual Avançada",
      descricao: "Para quem já tem experiência e quer escalar",
      tipo_mentoria: "INDIVIDUAL",
      ativo: true,
      created_at: "2025-01-01T00:00:00Z",
      updated_at: "2025-01-01T00:00:00Z"
    },
    mentor_designado_id: "instructor2",
    mentor_designado_nome: "Carlos Santos",
    tipo_mentoria_inscricao: "INDIVIDUAL",
    data_inicio_acesso: "2025-04-15",
    data_fim_acesso: "2025-08-15",
    status_inscricao: "ATIVA",
    total_sessoes_contratadas_ind: 10,
    sessoes_realizadas_ind: 5,
    created_at: "2025-04-15T00:00:00Z",
    updated_at: "2025-05-20T00:00:00Z"
  }
];

const IndividualMentoring = () => {
  const [subscriptions, setSubscriptions] = useState<AlunoInscricaoMentoria[]>(mockSubscriptions);
  const [filteredSubscriptions, setFilteredSubscriptions] = useState<AlunoInscricaoMentoria[]>(mockSubscriptions);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSubscription, setSelectedSubscription] = useState<AlunoInscricaoMentoria | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);

  useEffect(() => {
    const filtered = subscriptions.filter(sub =>
      sub.aluno_nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.mentoria_catalogo.nome_mentoria.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.mentor_designado_nome?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredSubscriptions(filtered);
  }, [searchTerm, subscriptions]);

  const getStatusBadge = (status: string) => {
    const statusMap = {
      "ATIVA": { color: "bg-green-100 text-green-800", label: "Ativa" },
      "CONCLUIDA": { color: "bg-blue-100 text-blue-800", label: "Concluída" },
      "CANCELADA": { color: "bg-red-100 text-red-800", label: "Cancelada" }
    };
    const statusInfo = statusMap[status as keyof typeof statusMap];
    return <Badge className={statusInfo.color}>{statusInfo.label}</Badge>;
  };

  const handleViewDetails = (subscription: AlunoInscricaoMentoria) => {
    setSelectedSubscription(subscription);
    setIsDetailDialogOpen(true);
  };

  const getProgressPercentage = (subscription: AlunoInscricaoMentoria) => {
    if (!subscription.total_sessoes_contratadas_ind) return 0;
    return (subscription.sessoes_realizadas_ind / subscription.total_sessoes_contratadas_ind) * 100;
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Mentorias Individuais</h2>
          <p className="text-sm text-gray-500">Gerencie as inscrições de mentorias individuais</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Nova Inscrição
        </Button>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Buscar por aluno, mentoria ou mentor..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredSubscriptions.map((subscription) => (
          <Card key={subscription.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{subscription.aluno_nome}</CardTitle>
                  <p className="text-sm text-gray-600 mt-1">{subscription.mentoria_catalogo.nome_mentoria}</p>
                </div>
                {getStatusBadge(subscription.status_inscricao)}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Mentor:</span>
                  <span className="font-medium">{subscription.mentor_designado_nome || "Não designado"}</span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Período:</span>
                  <span className="font-medium">
                    {format(new Date(subscription.data_inicio_acesso), "dd/MM/yy", { locale: ptBR })} - {format(new Date(subscription.data_fim_acesso), "dd/MM/yy", { locale: ptBR })}
                  </span>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-500">Progresso das Sessões:</span>
                    <span className="font-medium">
                      {subscription.sessoes_realizadas_ind}/{subscription.total_sessoes_contratadas_ind || 0}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${getProgressPercentage(subscription)}%` }}
                    ></div>
                  </div>
                </div>

                {subscription.observacoes_adm && (
                  <div className="text-xs text-gray-600 italic bg-gray-50 p-2 rounded">
                    {subscription.observacoes_adm}
                  </div>
                )}

                <div className="flex space-x-2 pt-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => handleViewDetails(subscription)}
                  >
                    <Eye className="mr-1 h-3 w-3" />
                    Detalhes
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                  >
                    <Calendar className="mr-1 h-3 w-3" />
                    Sessões
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredSubscriptions.length === 0 && (
        <div className="text-center py-12">
          <Users className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchTerm ? "Nenhuma inscrição encontrada" : "Nenhuma mentoria individual"}
          </h3>
          <p className="text-gray-500 mb-4">
            {searchTerm ? "Tente ajustar os termos de busca." : "Quando houver inscrições em mentorias individuais, elas aparecerão aqui."}
          </p>
        </div>
      )}

      {/* Detail Dialog */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detalhes da Mentoria Individual</DialogTitle>
          </DialogHeader>
          {selectedSubscription && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Aluno</label>
                  <p className="text-lg font-semibold">{selectedSubscription.aluno_nome}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Status</label>
                  <div className="mt-1">
                    {getStatusBadge(selectedSubscription.status_inscricao)}
                  </div>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-500">Mentoria</label>
                <p className="text-lg font-semibold">{selectedSubscription.mentoria_catalogo.nome_mentoria}</p>
                <p className="text-sm text-gray-600">{selectedSubscription.mentoria_catalogo.descricao}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Mentor Designado</label>
                  <p className="font-medium">{selectedSubscription.mentor_designado_nome || "Não designado"}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Progresso</label>
                  <p className="font-medium">
                    {selectedSubscription.sessoes_realizadas_ind}/{selectedSubscription.total_sessoes_contratadas_ind || 0} sessões
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Data de Início</label>
                  <p className="font-medium">
                    {format(new Date(selectedSubscription.data_inicio_acesso), "dd/MM/yyyy", { locale: ptBR })}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Data de Término</label>
                  <p className="font-medium">
                    {format(new Date(selectedSubscription.data_fim_acesso), "dd/MM/yyyy", { locale: ptBR })}
                  </p>
                </div>
              </div>

              {selectedSubscription.observacoes_adm && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Observações do Administrador</label>
                  <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded mt-1">
                    {selectedSubscription.observacoes_adm}
                  </p>
                </div>
              )}

              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={() => setIsDetailDialogOpen(false)}>
                  Fechar
                </Button>
                <Button>
                  <Edit className="mr-2 h-4 w-4" />
                  Editar
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default IndividualMentoring;

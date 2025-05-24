
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Users, User, Play, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { AlunoInscricaoMentoria, MentoriaEncontroSessao } from "@/types/mentoring.types";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

// Mock data for student's mentoring subscriptions
const mockStudentSubscriptions: AlunoInscricaoMentoria[] = [
  {
    id: "sub1",
    aluno_id: "current-student",
    aluno_nome: "Usuário Atual",
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
    created_at: "2025-05-01T00:00:00Z",
    updated_at: "2025-05-20T00:00:00Z"
  },
  {
    id: "sub2",
    aluno_id: "current-student",
    aluno_nome: "Usuário Atual",
    mentoria_catalogo_id: "2",
    mentoria_catalogo: {
      id: "2",
      nome_mentoria: "Imersão em Grupo - Ads Pro",
      descricao: "Programa intensivo de anúncios para grupos",
      tipo_mentoria: "GRUPO",
      ativo: true,
      created_at: "2025-01-01T00:00:00Z",
      updated_at: "2025-01-01T00:00:00Z"
    },
    tipo_mentoria_inscricao: "GRUPO",
    data_inicio_acesso: "2025-06-01",
    data_fim_acesso: "2025-07-30",
    status_inscricao: "ATIVA",
    created_at: "2025-06-01T00:00:00Z",
    updated_at: "2025-06-01T00:00:00Z"
  }
];

// Mock sessions for the student
const mockStudentSessions: MentoriaEncontroSessao[] = [
  {
    id: "session1",
    aluno_inscricao_id: "sub1",
    titulo_encontro_sessao: "Sessão 1: Alinhamento Inicial",
    descricao_detalhada: "Definição de objetivos e análise do perfil atual",
    data_hora_agendada: "2025-05-28T10:00:00Z",
    duracao_estimada_min: 60,
    link_plataforma_online: "https://meet.google.com/abc-defg-hij",
    status_encontro_sessao: "REALIZADO",
    created_at: "2025-05-01T00:00:00Z",
    updated_at: "2025-05-28T11:00:00Z"
  },
  {
    id: "session2",
    aluno_inscricao_id: "sub1",
    titulo_encontro_sessao: "Sessão 2: Estratégia de Produto",
    descricao_detalhada: "Definição de produtos e pesquisa de mercado",
    data_hora_agendada: "2025-06-05T14:00:00Z",
    duracao_estimada_min: 60,
    link_plataforma_online: "https://meet.google.com/abc-defg-hij",
    status_encontro_sessao: "AGENDADO",
    created_at: "2025-05-01T00:00:00Z",
    updated_at: "2025-05-01T00:00:00Z"
  },
  {
    id: "session3",
    mentoria_catalogo_id: "2",
    titulo_encontro_sessao: "Aula 1: Introdução aos Anúncios",
    descricao_detalhada: "Apresentação do programa e conceitos básicos",
    data_hora_agendada: "2025-06-10T19:00:00Z",
    duracao_estimada_min: 90,
    link_plataforma_online: "https://zoom.us/j/123456789",
    status_encontro_sessao: "AGENDADO",
    created_at: "2025-06-01T00:00:00Z",
    updated_at: "2025-06-01T00:00:00Z"
  }
];

const MyMentoring = () => {
  const [subscriptions] = useState<AlunoInscricaoMentoria[]>(mockStudentSubscriptions);
  const [sessions] = useState<MentoriaEncontroSessao[]>(mockStudentSessions);

  const getStatusBadge = (status: string) => {
    const statusMap = {
      "ATIVA": { color: "bg-green-100 text-green-800", label: "Ativa", icon: CheckCircle },
      "CONCLUIDA": { color: "bg-blue-100 text-blue-800", label: "Concluída", icon: CheckCircle },
      "CANCELADA": { color: "bg-red-100 text-red-800", label: "Cancelada", icon: AlertCircle }
    };
    const statusInfo = statusMap[status as keyof typeof statusMap];
    const Icon = statusInfo.icon;
    return (
      <Badge className={statusInfo.color}>
        <Icon className="w-3 h-3 mr-1" />
        {statusInfo.label}
      </Badge>
    );
  };

  const getSessionStatusBadge = (status: string) => {
    const statusMap = {
      "AGENDADO": { color: "bg-blue-100 text-blue-800", label: "Agendado", icon: Clock },
      "REALIZADO": { color: "bg-green-100 text-green-800", label: "Realizado", icon: CheckCircle },
      "CANCELADO": { color: "bg-red-100 text-red-800", label: "Cancelado", icon: AlertCircle }
    };
    const statusInfo = statusMap[status as keyof typeof statusMap];
    const Icon = statusInfo.icon;
    return (
      <Badge className={statusInfo.color}>
        <Icon className="w-3 h-3 mr-1" />
        {statusInfo.label}
      </Badge>
    );
  };

  const getProgressPercentage = (subscription: AlunoInscricaoMentoria) => {
    if (!subscription.total_sessoes_contratadas_ind) return 0;
    return (subscription.sessoes_realizadas_ind / subscription.total_sessoes_contratadas_ind) * 100;
  };

  const getDaysRemaining = (endDate: string) => {
    const today = new Date();
    const end = new Date(endDate);
    const diffTime = end.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const individualSubscriptions = subscriptions.filter(s => s.tipo_mentoria_inscricao === "INDIVIDUAL");
  const groupSubscriptions = subscriptions.filter(s => s.tipo_mentoria_inscricao === "GRUPO");

  const upcomingSessions = sessions
    .filter(s => s.status_encontro_sessao === "AGENDADO" && new Date(s.data_hora_agendada) > new Date())
    .sort((a, b) => new Date(a.data_hora_agendada).getTime() - new Date(b.data_hora_agendada).getTime());

  return (
    <div className="container mx-auto py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-portal-dark mb-2">Minhas Mentorias</h1>
        <p className="text-gray-600">Acompanhe suas mentorias individuais e em grupo</p>
      </div>

      {/* Próximas Sessões */}
      {upcomingSessions.length > 0 && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="mr-2 h-5 w-5" />
              Próximas Sessões
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {upcomingSessions.slice(0, 3).map((session) => (
                <div key={session.id} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div>
                    <h4 className="font-medium">{session.titulo_encontro_sessao}</h4>
                    <p className="text-sm text-gray-600">
                      {format(new Date(session.data_hora_agendada), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getSessionStatusBadge(session.status_encontro_sessao)}
                    {session.link_plataforma_online && (
                      <Button size="sm" asChild>
                        <a href={session.link_plataforma_online} target="_blank" rel="noopener noreferrer">
                          <Play className="mr-1 h-3 w-3" />
                          Entrar
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="individual" className="w-full">
        <TabsList>
          <TabsTrigger value="individual">
            <User className="mr-2 h-4 w-4" />
            Mentorias Individuais ({individualSubscriptions.length})
          </TabsTrigger>
          <TabsTrigger value="group">
            <Users className="mr-2 h-4 w-4" />
            Mentorias em Grupo ({groupSubscriptions.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="individual">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {individualSubscriptions.map((subscription) => (
              <Card key={subscription.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{subscription.mentoria_catalogo.nome_mentoria}</CardTitle>
                      <p className="text-sm text-gray-600 mt-1">{subscription.mentoria_catalogo.descricao}</p>
                    </div>
                    {getStatusBadge(subscription.status_inscricao)}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Mentor:</span>
                      <span className="font-medium">{subscription.mentor_designado_nome || "Não designado"}</span>
                    </div>
                    
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Acesso válido até:</span>
                      <span className="font-medium">
                        {format(new Date(subscription.data_fim_acesso), "dd/MM/yyyy", { locale: ptBR })}
                        <span className="text-xs text-gray-500 ml-1">
                          ({getDaysRemaining(subscription.data_fim_acesso)} dias)
                        </span>
                      </span>
                    </div>

                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-500">Progresso das Sessões:</span>
                        <span className="font-medium">
                          {subscription.sessoes_realizadas_ind}/{subscription.total_sessoes_contratadas_ind || 0}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all" 
                          style={{ width: `${getProgressPercentage(subscription)}%` }}
                        ></div>
                      </div>
                    </div>

                    <Button variant="outline" className="w-full">
                      <Calendar className="mr-2 h-4 w-4" />
                      Ver Sessões
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {individualSubscriptions.length === 0 && (
            <div className="text-center py-12">
              <User className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma mentoria individual</h3>
              <p className="text-gray-500">Você ainda não está inscrito em nenhuma mentoria individual.</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="group">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {groupSubscriptions.map((subscription) => (
              <Card key={subscription.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{subscription.mentoria_catalogo.nome_mentoria}</CardTitle>
                      <p className="text-sm text-gray-600 mt-1">{subscription.mentoria_catalogo.descricao}</p>
                    </div>
                    {getStatusBadge(subscription.status_inscricao)}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Acesso válido até:</span>
                      <span className="font-medium">
                        {format(new Date(subscription.data_fim_acesso), "dd/MM/yyyy", { locale: ptBR })}
                        <span className="text-xs text-gray-500 ml-1">
                          ({getDaysRemaining(subscription.data_fim_acesso)} dias)
                        </span>
                      </span>
                    </div>

                    <Button variant="outline" className="w-full">
                      <Calendar className="mr-2 h-4 w-4" />
                      Ver Encontros
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {groupSubscriptions.length === 0 && (
            <div className="text-center py-12">
              <Users className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma mentoria em grupo</h3>
              <p className="text-gray-500">Você ainda não está inscrito em nenhuma mentoria em grupo.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MyMentoring;

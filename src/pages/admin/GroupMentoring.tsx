
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Plus, Calendar, Users, Edit, Trash, Upload } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useMentoringCatalog } from "@/hooks/admin/useMentoringCatalog";
import { useMentoringSessions } from "@/hooks/admin/useMentoringSessions";
import { useMentoringMaterials } from "@/hooks/admin/useMentoringMaterials";
import SessionForm from "@/components/admin/mentoring/SessionForm";
import MaterialUploader from "@/components/admin/mentoring/MaterialUploader";
import MaterialsList from "@/components/admin/mentoring/MaterialsList";
import { MentoriaEncontroSessao } from "@/types/mentoring.types";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const GroupMentoring = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { mentoringItems } = useMentoringCatalog();
  const { sessions, loading: sessionsLoading, fetchSessions, addSession, updateSession, deleteSession } = useMentoringSessions();
  const { materials, uploadMaterial, deleteMaterial, downloadMaterial, fetchMaterials } = useMentoringMaterials();
  
  const [isSessionDialogOpen, setIsSessionDialogOpen] = useState(false);
  const [isMaterialDialogOpen, setIsMaterialDialogOpen] = useState(false);
  const [editingSession, setEditingSession] = useState<MentoriaEncontroSessao | undefined>();
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);

  const mentoring = mentoringItems.find(m => m.id === id);

  useEffect(() => {
    if (id) {
      fetchSessions(id);
    }
  }, [id]);

  useEffect(() => {
    if (selectedSessionId) {
      fetchMaterials(selectedSessionId);
    }
  }, [selectedSessionId]);

  const handleAddSession = () => {
    setEditingSession(undefined);
    setIsSessionDialogOpen(true);
  };

  const handleEditSession = (session: MentoriaEncontroSessao) => {
    setEditingSession(session);
    setIsSessionDialogOpen(true);
  };

  const handleDeleteSession = async (sessionId: string) => {
    if (window.confirm("Tem certeza que deseja excluir este encontro?")) {
      await deleteSession(sessionId);
    }
  };

  const handleSubmitSession = async (data: any) => {
    const sessionData = {
      ...data,
      mentoria_catalogo_id: id
    };

    if (editingSession) {
      return await updateSession(editingSession.id, sessionData);
    } else {
      return await addSession(sessionData);
    }
  };

  const handleViewMaterials = (sessionId: string) => {
    setSelectedSessionId(sessionId);
    setIsMaterialDialogOpen(true);
  };

  const getStatusBadge = (status: string) => {
    const statusMap = {
      "AGENDADO": { color: "bg-blue-100 text-blue-800", label: "Agendado" },
      "REALIZADO": { color: "bg-green-100 text-green-800", label: "Realizado" },
      "CANCELADO": { color: "bg-red-100 text-red-800", label: "Cancelado" }
    };
    const statusInfo = statusMap[status as keyof typeof statusMap];
    return <Badge className={statusInfo.color}>{statusInfo.label}</Badge>;
  };

  if (!mentoring) {
    return (
      <div className="container mx-auto py-4">
        <p>Mentoria não encontrada.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-4">
      <div className="flex justify-between items-center mb-4">
        <Button variant="ghost" onClick={() => navigate("/admin/cadastros?tab=mentoring")}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow mb-4">
        <div className="p-4 border-b">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold">{mentoring.nome_mentoria}</h1>
              <p className="text-gray-600 mt-1">{mentoring.descricao}</p>
              <div className="flex items-center space-x-4 mt-2">
                <Badge className="bg-green-100 text-green-800">
                  <Users className="w-3 h-3 mr-1" />
                  Mentoria em Grupo
                </Badge>
                <span className="text-sm text-gray-500">
                  Instrutor: {mentoring.instrutor_principal_nome || "Não definido"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Tabs defaultValue="encontros" className="w-full">
        <TabsList>
          <TabsTrigger value="encontros">Agenda de Encontros</TabsTrigger>
          <TabsTrigger value="alunos">Alunos Inscritos</TabsTrigger>
          <TabsTrigger value="configuracoes">Configurações</TabsTrigger>
        </TabsList>

        <TabsContent value="encontros">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Encontros Agendados</CardTitle>
                <Dialog open={isSessionDialogOpen} onOpenChange={setIsSessionDialogOpen}>
                  <DialogTrigger asChild>
                    <Button onClick={handleAddSession}>
                      <Plus className="mr-2 h-4 w-4" />
                      Novo Encontro
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>
                        {editingSession ? "Editar Encontro" : "Novo Encontro"}
                      </DialogTitle>
                    </DialogHeader>
                    <SessionForm
                      session={editingSession}
                      onSubmit={handleSubmitSession}
                      onCancel={() => setIsSessionDialogOpen(false)}
                      isGroupSession={true}
                    />
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              {sessionsLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-20 bg-gray-200 animate-pulse rounded"></div>
                  ))}
                </div>
              ) : sessions.length === 0 ? (
                <div className="text-center py-8">
                  <Calendar className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum encontro agendado</h3>
                  <p className="text-gray-500 mb-4">Comece criando o primeiro encontro da mentoria.</p>
                  <Button onClick={handleAddSession}>
                    <Plus className="mr-2 h-4 w-4" />
                    Criar Primeiro Encontro
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {sessions.map((session) => (
                    <div key={session.id} className="border rounded-lg p-4 hover:bg-gray-50">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="font-semibold">{session.titulo_encontro_sessao}</h3>
                            {getStatusBadge(session.status_encontro_sessao)}
                          </div>
                          {session.descricao_detalhada && (
                            <p className="text-gray-600 text-sm mb-2">{session.descricao_detalhada}</p>
                          )}
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span>
                              📅 {format(new Date(session.data_hora_agendada), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                            </span>
                            {session.duracao_estimada_min && (
                              <span>⏱️ {session.duracao_estimada_min} min</span>
                            )}
                            {session.link_plataforma_online && (
                              <a 
                                href={session.link_plataforma_online} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline"
                              >
                                🔗 Link da Reunião
                              </a>
                            )}
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewMaterials(session.id)}
                          >
                            <Upload className="mr-1 h-3 w-3" />
                            Materiais
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditSession(session)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteSession(session.id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alunos">
          <Card>
            <CardHeader>
              <CardTitle>Alunos Inscritos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-500">
                <Users className="mx-auto h-12 w-12 text-gray-400 mb-2" />
                <p>Funcionalidade em desenvolvimento</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="configuracoes">
          <Card>
            <CardHeader>
              <CardTitle>Configurações da Mentoria</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-500">
                <p>Configurações da mentoria em grupo</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Materials Dialog */}
      <Dialog open={isMaterialDialogOpen} onOpenChange={setIsMaterialDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>Materiais do Encontro</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-4">Enviar Novo Material</h3>
              {selectedSessionId && (
                <MaterialUploader
                  sessionId={selectedSessionId}
                  onUpload={uploadMaterial}
                />
              )}
            </div>
            <div>
              <h3 className="text-lg font-medium mb-4">Materiais Anexados</h3>
              <MaterialsList
                materials={materials}
                onDownload={downloadMaterial}
                onDelete={deleteMaterial}
                isAdmin={true}
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GroupMentoring;

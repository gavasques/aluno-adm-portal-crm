
import { useState } from "react";
import { toast } from "sonner";
import { MentoriaEncontroSessao, SessionFormData } from "@/types/mentoring.types";

// Mock data for sessions
const mockSessions: MentoriaEncontroSessao[] = [
  {
    id: "session1",
    mentoria_catalogo_id: "2",
    titulo_encontro_sessao: "Aula 1: Introdução aos Anúncios",
    descricao_detalhada: "Apresentação do programa e conceitos básicos",
    data_hora_agendada: "2025-05-30T14:00:00Z",
    duracao_estimada_min: 90,
    link_plataforma_online: "https://zoom.us/j/123456789",
    status_encontro_sessao: "AGENDADO",
    created_at: "2025-01-01T00:00:00Z",
    updated_at: "2025-01-01T00:00:00Z"
  },
  {
    id: "session2",
    aluno_inscricao_id: "subscription1",
    titulo_encontro_sessao: "Sessão Individual - Análise de Perfil",
    descricao_detalhada: "Revisão e análise do perfil atual do aluno",
    data_hora_agendada: "2025-05-28T10:00:00Z",
    duracao_estimada_min: 60,
    link_plataforma_online: "https://meet.google.com/abc-defg-hij",
    status_encontro_sessao: "AGENDADO",
    created_at: "2025-01-01T00:00:00Z",
    updated_at: "2025-01-01T00:00:00Z"
  }
];

export const useMentoringSessions = () => {
  const [sessions, setSessions] = useState<MentoriaEncontroSessao[]>(mockSessions);
  const [loading, setLoading] = useState(false);

  const fetchSessions = async (catalogId?: string, subscriptionId?: string) => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      let filteredSessions = mockSessions;
      if (catalogId) {
        filteredSessions = mockSessions.filter(s => s.mentoria_catalogo_id === catalogId);
      }
      if (subscriptionId) {
        filteredSessions = mockSessions.filter(s => s.aluno_inscricao_id === subscriptionId);
      }
      setSessions(filteredSessions);
      setLoading(false);
    }, 500);
  };

  const addSession = async (data: SessionFormData & { mentoria_catalogo_id?: string; aluno_inscricao_id?: string }) => {
    try {
      const newSession: MentoriaEncontroSessao = {
        id: Date.now().toString(),
        ...data,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      setSessions(prev => [...prev, newSession]);
      toast.success("Sessão criada com sucesso!");
      return true;
    } catch (error) {
      toast.error("Erro ao criar sessão");
      return false;
    }
  };

  const updateSession = async (id: string, data: Partial<MentoriaEncontroSessao>) => {
    try {
      setSessions(prev => 
        prev.map(session => 
          session.id === id 
            ? { ...session, ...data, updated_at: new Date().toISOString() }
            : session
        )
      );
      toast.success("Sessão atualizada com sucesso!");
      return true;
    } catch (error) {
      toast.error("Erro ao atualizar sessão");
      return false;
    }
  };

  const deleteSession = async (id: string) => {
    try {
      setSessions(prev => prev.filter(session => session.id !== id));
      toast.success("Sessão excluída com sucesso!");
      return true;
    } catch (error) {
      toast.error("Erro ao excluir sessão");
      return false;
    }
  };

  return {
    sessions,
    loading,
    fetchSessions,
    addSession,
    updateSession,
    deleteSession
  };
};
